import React from "react";

const ReportTakenBy = ({
  title,
  first_name,
  last_name,
 
  onSelectReport,
}) => {
  return (
    <div className="info-div ">
      <div className="p-l-5"  onClick={onSelectReport}>
        <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
          No Report Taken By
        </p>

        <div>
          <div className="d-flex justify-content-between">
            <div>Title:</div>
            <div style={{ fontWeight: "bold" }}>
              <p>{title}</p>
            </div>
          </div>

          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">First:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{first_name}</p>
            </div>
          </div>
          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">Last:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{last_name}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <a
          href="#"
          className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
        >
          <i className="ic ic-19 ic-generate-document mr-1"></i>
          Generate Document
        </a>
      </div>
    </div>
  );
};

export default ReportTakenBy;
