import React from "react";

const AccountSaveBtn = ({ checked, handleCheckStatus }) => {
  return (
    <div
      className="col pl-0 p-r-5"
      style={{
        width: "194px",
        justifyItems: "end",
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleCheckStatus(checked);
      }}
    >
      <button
        style={{
          background: checked ? "var(--green)" : "#6c757d",
          borderColor: "#6c757d",
          color: "white",
          fontSize: "14px",
        }}
        className="height-25 inbox-save-btn btn delete-document green-bg-hover d-flex align-items-center justify-content-center"
      >
        Save
      </button>
    </div>
  );
};

export default AccountSaveBtn;
