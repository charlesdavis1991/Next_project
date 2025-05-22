import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { getCaseId } from "../../Utils/helper";
import api, { api_without_cancellation } from "../../api/api";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import "./pinnedCasePopup.css";
const styles = `
.pinned-case-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0px;
  margin-bottom: 0px;
}

.case-item {
  border-radius: 0px;
  transition: background-color 0.3s;
}

.case-item-p1, .case-item-p3, .case-item-p5 {
  background-color: var(--primary-4);
}

.case-item-p2, .case-item-p4, .case-item-p6 {
  background-color: var(--primary-10);
}

.empty-case-item {
  cursor: pointer;
}

.case-content {
  padding: 5px;
  height: 100%;
}

.content-section {
  overflow: hidden;
  text-overflow: ellipsis;
}
`;

function PinnedCasePopUp({
  confirmPopUp,
  handleClose,
  pinnedCases,
  setPinnedCases,
}) {
  const caseId = getCaseId();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Refs for measuring different sections
  const nameRefs = useRef({});
  const caseTypeRefs = useRef({});
  const dateRefs = useRef({});

  const [maxWidths, setMaxWidths] = useState({
    names: 0,
    caseTypes: 0,
    dates: 0,
  });

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const calculateMaxWidths = () => {
      const nameWidths = Object.values(pinnedCases).map((caseItem) => {
        if (!caseItem?.for_client) return 0;
        const fullName = `${caseItem.for_client.last_name}, ${caseItem.for_client.first_name}`;
        return fullName.length * 9.2;
      });

      const caseTypeWidths = Object.values(pinnedCases).map((caseItem) => {
        if (!caseItem?.case_type?.name) return 0;
        return caseItem.case_type.name.length * 9.1;
      });

      const dateWidths = Object.values(pinnedCases).map((caseItem) => {
        if (!caseItem?.incident_date) return 0;
        return caseItem.incident_date.length * 9.1;
      });

      setMaxWidths({
        names: Math.max(...nameWidths, 175),
        caseTypes: Math.max(...caseTypeWidths, 120),
        dates: Math.max(...dateWidths, 120),
      });
    };

    calculateMaxWidths();

    window.addEventListener("resize", calculateMaxWidths);
    return () => window.removeEventListener("resize", calculateMaxWidths);
  }, [pinnedCases, confirmPopUp]);

  const updatePinnedCases = async (
    position,
    position_to,
    caseId_to,
    caseId_from
  ) => {
    let requestData = {};
    if (caseId_from?.id === caseId_to?.id && position_to) {
      requestData = {
        [position]: null,
        [position_to]: caseId_to?.id,
      };
    } else if (position_to) {
      requestData = {
        [position]: caseId_from?.id ? caseId_from?.id : null,
        [position_to]: caseId_to?.id,
      };
    } else {
      requestData = {
        [position]: caseId,
      };
    }
    try {
      await api_without_cancellation
        .post(`/api/pinned-cases/`, requestData)
        .then((response) => {
          setPinnedCases(response.data);
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedCases = { ...pinnedCases };

      const temp = updatedCases[active.id];

      updatedCases[active.id] = updatedCases[over.id];

      updatedCases[over.id] = temp;

      setPinnedCases(updatedCases);
      updatePinnedCases(
        active.id,
        over.id,
        updatedCases[over.id],
        updatedCases[active.id]
      );
    } else if (!over) {
      updatePinnedCases(active.id);
    }
  };

  const renderCaseItem = (position) => (
    <PinnedCaseItem
      key={position}
      id={position}
      pinnedCase={pinnedCases[position]}
      maxWidths={maxWidths}
      refs={{
        nameRef: (el) => (nameRefs.current[position] = el),
        caseTypeRef: (el) => (caseTypeRefs.current[position] = el),
        dateRef: (el) => (dateRefs.current[position] = el),
      }}
    />
  );

  return (
    <Modal
      show={confirmPopUp}
      onHide={handleClose}
      dialogClassName="modal-dialog max-width-popup-pinned-case-popup"
      contentClassName="border-0 modal-custom-content-bg-issset"
    >
      <div className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
        <h5
          className="modal-title mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
          id="avatarModalTitle"
          style={{ fontSize: "15px" }}
        >
          CASES PINNED TO THE HOME PAGE
        </h5>
      </div>
      <div className="modal-body p-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={Object.keys(pinnedCases)}
            strategy={rectSortingStrategy}
          >
            <div className="pinned-case-grid">
              {["p1", "p2", "p3"].map(renderCaseItem)}
            </div>
            <div className="pinned-case-grid">
              {["p4", "p5", "p6"].map(renderCaseItem)}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </Modal>
  );
}

const PinnedCaseItem = React.forwardRef(
  ({ id, pinnedCase, maxWidths, refs }, ref) => {
    const { setNodeRef: setDroppableRef } = useDroppable({ id });
    const {
      setNodeRef: setDraggableRef,
      listeners,
      attributes,
      isDragging,
      transform,
    } = useDraggable({ id });

    const handleClickEmptyPosition = () => {
      if (!pinnedCase) {
        updatePinnedCases(id);
      }
    };

    return (
      <div
        ref={setDroppableRef}
        className={`case-item case-item-${id} ${!pinnedCase ? "empty-case-item" : ""}`}
        style={{
          transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : "",
          opacity: isDragging ? 0.5 : 1,
        }}
        onClick={handleClickEmptyPosition}
      >
        <div
          ref={(el) => {
            setDraggableRef(el);
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          {...listeners}
          {...attributes}
          className="case-content"
        >
          {pinnedCase ? (
            <div className="d-flex" style={{ minHeight: "42px" }}>
              <div
                ref={refs.nameRef}
                className="d-flex align-items-center content-section"
                style={{
                  width: `${maxWidths.names}px`,
                  marginRight: "5px",
                }}
              >
                <span className="ic ic-avatar ic-35 has-avatar-icon has-cover-img">
                  {pinnedCase?.for_client?.profile_pic_19p && (
                    <img
                      className="output-3 theme-ring"
                      src={pinnedCase.for_client.profile_pic_19p}
                      alt="Client Profile"
                    />
                  )}
                </span>
                <span
                  className="m-l-5 text-black text-black-2 whitespace-nowrap"
                  style={{ fontWeight: "600" }}
                >
                  {pinnedCase?.for_client
                    ? `${pinnedCase.for_client.last_name}, ${pinnedCase.for_client.first_name}`
                    : ""}
                </span>
              </div>
              <div className="d-flex flex-column">
                <div
                  ref={refs.caseTypeRef}
                  className="d-flex align-items-center content-section"
                  style={{ width: `${maxWidths.caseTypes}px` }}
                >
                  <span className="ic ic-19 d-flex align-items-center">
                    {pinnedCase?.case_type?.casetype_icon && (
                      <img
                        src={pinnedCase.case_type.casetype_icon}
                        alt="Case Type Icon"
                      />
                    )}
                  </span>
                  <span
                    className="m-l-5 text-black text-black-2 whitespace-nowrap"
                    style={{ fontWeight: "600" }}
                  >
                    {pinnedCase?.case_type ? pinnedCase.case_type.name : ""}
                  </span>
                </div>
                <div
                  ref={refs.dateRef}
                  className="d-flex align-items-center content-section"
                  style={{ width: `${maxWidths.dates}px` }}
                >
                  <span className="ic ic-19 ic-incident d-flex align-items-center"></span>
                  <span
                    className="text-black m-l-5"
                    style={{ fontWeight: "600" }}
                  >
                    {pinnedCase?.incident_date || ""}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="d-flex"
              style={{
                width: `${maxWidths.names + maxWidths.caseTypes + 5}px`,
                height: "42px",
              }}
              onClick={() => updatePinnedCases(id)}
            >
              <span
                className="text-center d-flex align-items-center justify-content-center"
                style={{
                  width: `${maxWidths.names + maxWidths.caseTypes + 5}px`,
                  color: "var(--primary-25)",
                  fontWeight: "600",
                }}
              >
                PIN CASE TO HOME # {id.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default PinnedCasePopUp;
