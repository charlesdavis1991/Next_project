import React from "react";
import { Modal } from "react-bootstrap";
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
import './pinnedCasePopup.css'

function PinnedCasePopUp({ confirmPopUp, handleClose, pinnedCases, setPinnedCases }) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Swap positions of the active and over items
      const updatedCases = { ...pinnedCases };
      const temp = updatedCases[active.id];
      updatedCases[active.id] = updatedCases[over.id];
      updatedCases[over.id] = temp;

      // Update the state
      setPinnedCases(updatedCases);

      // Optionally, make an API call to persist the changes
      updatePinnedCasesAPI(active.id, over.id);
    } else {
        const updatedCases = { ...pinnedCases };
        const temp = updatedCases[active.id];
        updatedCases[active.id] = updatedCases[over.id];
        updatedCases[over.id] = temp;
  
        setPinnedCases(updatedCases);
  
        updatePinnedCasesAPI(active.id, over.id);
    }
  };

  const updatePinnedCasesAPI = (fromPosition, toPosition) => {
    console.log(`Updating positions: ${fromPosition} -> ${toPosition}`);
  };

  const renderCaseItem = (position) => (
    <PinnedCaseItem
      key={position}
      id={position}
      pinnedCase={pinnedCases[position]}
    />
  );

  return (
    <Modal show={confirmPopUp} onHide={handleClose} dialogClassName="max-width-650px">
      <div className="modal-content">
        <div className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
          <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
            Pinned Cases
          </h5>
        </div>
        <div className="modal-body">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={Object.keys(pinnedCases)} strategy={rectSortingStrategy}>
              <div className="row">
                {["p1", "p2", "p3", "p4", "p5"].map(renderCaseItem)}
              </div>
              <div className="row">
                {["p6", "p7", "p8", "p9", "p10"].map(renderCaseItem)}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary mx-auto" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PinnedCaseItem({ id, pinnedCase }) {
    const { setNodeRef: setDroppableRef } = useDroppable({
      id: id,
    });
  
    const { setNodeRef: setDraggableRef, listeners, attributes, isDragging, transform } = useDraggable({
      id: id,
    });
    console.log(pinnedCase)
  
    return (
      <div
        ref={setDroppableRef}
        className={`col text-center px-4 py-2 ${isDragging ? "opacity-50" : ""} ${!pinnedCase ? "empty-case-item" : ""}`}
        style={{
          transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "",
        }}
      >
        <div
          ref={setDraggableRef}
          {...listeners}
          {...attributes}
          className="case-item"
          tabIndex={0}
        >
          {pinnedCase ? (
            <>
            <div className="d-flex align-items-center client-name-box account_text-ellipsis">
            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                {pinnedCase?.for_client?.profile_pic_19p ? (
                    <img
                        className="output-3 theme-ring"
                        src={pinnedCase?.for_client?.profile_pic_19p}
                        alt="Client Profile"
                    />
                ) : null}
            </span>
            <span className="ml-2 text-black text-black-2 whitespace-nowrap account_text-ellipsis">
                {pinnedCase?.for_client
                    ? `${pinnedCase?.for_client?.last_name}, ${pinnedCase?.for_client?.first_name}`
                    : ''}
            </span>
        </div>
        <div className="d-flex align-items-center client-name-box account_text-ellipsis">
        <span className="ic ic-19">
            {pinnedCase?.case_type?.casetype_icon ? (
                <img
                    className=""
                    src={pinnedCase?.case_type?.casetype_icon}
                    alt="Case Type Icon"
                />
            ) : null}
        </span>
        <span className="ml-2 text-black text-black-2 whitespace-nowrap account_text-ellipsis">
            {pinnedCase?.case_type ? pinnedCase?.case_type?.name : ''}
        </span>
    </div>
    <div className="d-flex align-items-center client-name-box account_text-ellipsis">
        <span className="ic ic-19 mb-1 ic-incident"></span>
        <span className="text-black ml-2">
            {pinnedCase?.incident_date ? pinnedCase?.incident_date : ''}
        </span>
    </div>
    </>
          ) : (
            <div className="empty-position">
              Position {id.slice(1)}
            </div>
          )}
        </div>
      </div>
    );
  }
  
export default PinnedCasePopUp;
