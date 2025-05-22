import React from "react";

const SaveButton = ({ selectedPage, onClick }) => {
  return (
    <div
      className="col pl-0 p-r-5"
      style={{
        width: "194px",
        justifyItems: "end",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(null);
      }}
    >
      <button
        style={{
          background: selectedPage ? "var(--green)" : "#6c757d",
          borderColor: selectedPage ? "var(--green)" : "#6c757d",
          color: "white",
          fontSize: "14px",
        }}
        className="height-25 inbox-save-btn btn delete-document green-bg-hover  d-flex align-items-center justify-content-center"
      >
        Save
      </button>
    </div>
  );
};

export default SaveButton;
