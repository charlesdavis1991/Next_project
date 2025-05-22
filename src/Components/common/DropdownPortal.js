import { createPortal } from "react-dom";
import React from "react";

const DropdownPortal = ({ children, position }) => {
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        maxHeight: "200px",
        width: "32%",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
        // display: "grid",
        // gridTemplateColumns: "repeat(3, 1fr)",
        // gap: "10px",
        zIndex: 1000000,
        backgroundColor: "white",
      }}
    >
      {children}
    </div>,
    document.body // Mounts the dropdown to the body
  );
};

export default DropdownPortal;
