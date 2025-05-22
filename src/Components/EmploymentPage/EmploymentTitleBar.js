import React from "react";
import ChecklistWithoutPercentage from "../common/ChecklistWithoutPercentage";

function EmploymentTitlebar({ employerName }) {

  return (
    <div 
      className="border-box has-checklist position-relative"
      style={{ zIndex: "2", left: "-2px" }}
    >
      <div
        className="title-bar-main-div d-flex flex-row has-title-bg "
        style={{ width: "100.2%" }}
      >
                        <span className="page-icon" style={{ width: "60px" }}> 
          <img className="translate-note-icon" src="/BP_resources/images/icon/defendants-icon-color.svg"/>
      </span>
        <ChecklistWithoutPercentage/>

        <div
          
          className="top-header height-25 d-flex responsive-width-of-title"
        >
          <div className="top-head-fixed d-flex align-items-center">
            <h2 className="d-flex align-items-center mr-1">
              <small className="font-weight-600 custom-font-14px">
                {employerName || "Employer Name"}
              </small>
            </h2>
          </div>
        </div>
        
        <div
          className="btn-wrapper justify-content-end align-items-center"
          style={{ marginRight: "13rem" }}
        >
          {/* You can add buttons or additional elements here if needed */}
        </div>
      </div>
    </div>
  );
}

export default EmploymentTitlebar;
