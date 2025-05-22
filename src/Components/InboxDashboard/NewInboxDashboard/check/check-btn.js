import React from "react";

const CheckBtns = ({ handleUpdateCheckStatus }) => {
  return (
    <div
      className="col"
      style={{
        width: "194px",
        position: "relative",
        left: "-3%",
        // flexDirection: "column",
      }}
    >
      <div
        style={{ gap: "5px" }}
        className="d-flex justify-content-center flex-column"
      >
        <div
          className="d-flex height-25 align-ites-center justify-content-center font-weight-semibold cursor-pointer btn-hover-document-row"
          id="no-vertical-border"
          style={{
            width: "150px",
            borderColor: "var(--primary)",
            backgroundColor: "var(--primary-10)",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
            gap: "5px",
          }}
          onClick={() => handleUpdateCheckStatus("Sent")}
        >
          <span className="d-flex align-items-center">
            <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
          </span>
          Sent
        </div>

        <div
          className="d-flex height-25 align-items-center justify-content-center font-weight-semibold cursor-pointer btn-hover-document-row"
          id="no-vertical-border"
          style={{
            width: "150px",
            borderColor: "var(--primary)",
            backgroundColor: "var(--primary-10)",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
            gap: "5px",
          }}
          onClick={() => handleUpdateCheckStatus("Cleared")}
        >
          <span className="d-flex align-items-center">
            <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
          </span>
          Cleared
        </div>
      </div>
    </div>
  );
};

export default CheckBtns;
