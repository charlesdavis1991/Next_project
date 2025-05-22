import React from "react";
import invoiceIcon from "/public/BP_resources/images/icon/documents-icon-color.svg";

const AccountBtns = ({ checked, setChecked }) => {
  return (
    <div
      className="col"
      style={{
        width: "194px",
        position: "relative",
        left: "1%",
      }}
    >
      <div
        style={{ gap: "5px" }}
        className="d-flex justify-content-center flex-column"
      >
        <div
          className="d-flex height-25 whitespace-nowrap align-items-center justify-content-center font-weight-semibold cursor-pointer "
          id="no-vertical-border"
          style={{
            width: "150px",
            gap: "5px",
          }}
        >
          <input
            className="m-r-5 checkbox"
            style={{}}
            onClick={(e) => {
              e.stopPropagation();
              setChecked("general");
            }}
            type="checkbox"
            checked={checked === "general"}
          />
          Save to Case Generally
        </div>

        <div
          className="d-flex height-25 align-items-center justify-content-center font-weight-semibold cursor-pointer "
          id="no-vertical-border"
          style={{
            width: "150px",
            gap: "5px",
          }}
        >
          <input
            className="m-r-5 checkbox"
            style={{}}
            onClick={(e) => {
              e.stopPropagation();
              setChecked("invoice");
            }}
            type="checkbox"
            checked={checked === "invoice"}
          />
          <img src={invoiceIcon} className="height-i-25  gray-scale-1" />
        </div>

        <div
          className="d-flex height-25 align-items-center justify-content-center font-weight-semibold cursor-pointer "
          id="no-vertical-border"
          style={{
            width: "150px",
            gap: "5px",
          }}
        >
          <input
            className="m-r-5 checkbox"
            style={{}}
            onClick={(e) => {
              e.stopPropagation();
              setChecked("verify");
            }}
            type="checkbox"
            checked={checked === "verify"}
          />
          <img src={invoiceIcon} className="height-i-25  gray-scale-1" />
        </div>
      </div>
    </div>
  );
};

export default AccountBtns;
