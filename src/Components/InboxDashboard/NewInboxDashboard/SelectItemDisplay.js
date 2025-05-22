import React from "react";

const SelectedItemDisplay = ({
  selectedPage,
  selectedPanel,
  selectedSlot,
  inboxTab,
}) => {
  return (
    <div
      className="col"
      style={{
        width: "194px",
        position: "relative",
        left: inboxTab !== "insurance" ? "8%" : "-2%",
        // flexDirection: "column",
      }}
    >
      {selectedPage && (
        <span
          className="d-flex align-items-center height-21"
          style={{
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <img
            src={selectedPage?.page_icon}
            className="ic ic-19 d-flex align-items-center justify-content-center m-r-5"
            alt="Page Icon"
          />
          {selectedPage?.name}
        </span>
      )}

      {selectedPanel && (
        <div
          className="ml-2 height-21 whitespace-nowrap"
          style={{
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {selectedPanel?.panel_name}
        </div>
      )}

      {selectedSlot?.slot_number !== 0 && selectedSlot !== null && (
        <div
          className="ml-2 whitespace-nowrap"
          style={{
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {selectedSlot?.slot_number}.
          {selectedSlot?.slot_name ? selectedSlot?.slot_name : "Available"}
        </div>
      )}

      {selectedSlot?.slot_number === 0 && (
        <div
          className="ml-2 whitespace-nowrap"
          style={{
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Attach to {selectedPage?.name} Page generally
        </div>
      )}
    </div>
  );
};

export default SelectedItemDisplay;
