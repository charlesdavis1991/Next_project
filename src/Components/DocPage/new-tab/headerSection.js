import React from "react";
import "./header-section.css";

const HeaderSection = ({ name, icon }) => {
  return (
    <div
      className=" m-b-5 flex-nowrap align-items-center d-flex "
      style={{ gap: "5px" }}
    >
      <div class="panel-icon-heaader-section">
        <img
          src={icon ?? ""}
          // height={19}
          // width={19}
          className="ic ic-19 d-flex align-items-center justify-content-center"
        />
      </div>
      <div
        className="panel-color-header-section"
        style={{
          background: "var(--primary)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ height: 0, width: "10px", height: "max-content" }} />
        <h4
          className="d-flex align-items-center  m-l-5"
          style={{ color: "white" }}
        >
          <small className="font-weight-600">{name}</small>
        </h4>
      </div>
    </div>
  );
};

export default HeaderSection;
