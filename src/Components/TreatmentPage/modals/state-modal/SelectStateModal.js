import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
// import PR from "../../../../assets/state-svg/Puerto-Rico.svg";
// import GU from "../../../../assets/state-svg/Guam.svg";
// import VI from "../../../../assets/state-svg/US-Virgin-Islands.svg";
// import MP from "../../../../assets/state-svg/Mariana-Islands.svg";
import PR from "../../../../assets/state-svg/puerto-rico";
import GU from "../../../../assets/state-svg/guam";
import MP from "../../../../assets/state-svg/marian";
import VI from "../../../../assets/state-svg/us-virigin-island";

function StatesModalSelection({ show, handleClose, onChange, statesData }) {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [rowHeight, setRowHeight] = useState(40); // Default row height
  const containerRef = useRef(null);

  const stateMap = {
    "Puerto Rico": PR,
    Guam: GU,
    "Virgin Islands": VI,
    "Mariana Islands": MP,
  };
  const specialStates = Object.keys(stateMap);

  useEffect(() => {
    if (show && statesData && statesData.length > 0 && containerRef.current) {
      const stateElements =
        containerRef.current.querySelectorAll(".state-item");
      let maxHeight = 0;

      stateElements.forEach((el) => {
        const height = el.offsetHeight;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      console.log(maxHeight);

      setRowHeight(maxHeight - 5);
    }
  }, [show, statesData]);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    onChange(state);
    handleClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="max-870-modal modal-dialog-centered"
        contentClassName="custom-modal-new-provider"
        size="lg"
      >
        <div
        // style={{
        //   minHeight: "210px",
        // }}
        >
          <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
              id="modal_title"
              style={{ fontSize: "14px", fontWeight: "600" }}
            >
              Select State
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "0px" }}>
            <div
              ref={containerRef}
              className="states-container"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                minHeight: "210px",
                gap: "0px",
                width: "100%",
              }}
            >
              {statesData &&
                statesData.map((state, index) => {
                  const row = Math.floor(index / 10);
                  const col = index % 8;
                  const isEvenCell = (row + col) % 2 === 0;

                  let bgColor = isEvenCell
                    ? "var(--primary-4)"
                    : "var(--primary-10)";

                  if (hoveredState === state.id) {
                    bgColor = "white";
                  }

                  if (selectedState?.id === state.id) {
                    bgColor = "var(--primary-50)";
                  }

                  const StateComponent = stateMap[state.name];

                  return (
                    <div
                      key={state.id}
                      className="state-item"
                      onClick={() => handleStateSelect(state)}
                      onMouseEnter={() => setHoveredState(state.id)}
                      onMouseLeave={() => setHoveredState(null)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: bgColor,
                        transition: "background-color 0.2s ease",
                        height: `${35}px`, // Uniform height for all cells
                      }}
                    >
                      {specialStates.includes(state.name) ? (
                        <StateComponent />
                      ) : (
                        <svg
                          style={{
                            width: "19px",
                            height: "19px",
                            fill: "var(--primary-90)",
                            color: "var(--primary-90)",
                            stroke: "var(--primary-90)",
                          }}
                          className={`icon icon-state-${state.StateAbr}`}
                        >
                          <use
                            xlinkHref={`#icon-state-${state.StateAbr}`}
                          ></use>
                        </svg>
                      )}

                      {/* <svg
                        style={{
                          width: "19px",
                          height: "19px",
                          fill: "var(--primary-90)",
                          color: "var(--primary-90)",
                          stroke: "var(--primary-90)",
                        }}
                        className={`icon icon-state-${state.StateAbr}`}
                      >
                        <use xlinkHref={`#icon-state-${state.StateAbr}`}></use>
                      </svg> */}
                      <span
                        className="state-name"
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          textAlign: "center",
                          lineHeight: "normal",
                        }}
                      >
                        {state.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(StatesModalSelection);
