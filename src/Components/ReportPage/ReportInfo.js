import React, { useState } from "react";
import CostIcon from "../../assets/images/costs-icon-color.svg";

const ReportInfo = ({
  id,
  // title,
  // first_name,
  // last_name,
  report_number,
  report_taken,
  date_taken,
  complete,
  cost,
  requested_date,
  date_ordered,
  onSelectReport,
}) => {
  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  return (
    <>
      <div className="info-div">
        <div className="p-l-5 " onClick={onSelectReport}>
          <div>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
              Report Information
            </p>
          </div>

          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">No Report Taken:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              {report_taken ? <p>{formatDate(date_taken)}</p> : <p>No</p>}
            </div>
          </div>

          <div className="row mb-0 colFont">
            <div class="col text-left">
              <span class="d-inline-block">Report No:</span>
            </div>
            <div class="col-auto text-left font-weight-semibold">
              {report_number ? (
                <p>{report_number}</p>
              ) : (
                <p className="text-primary-50">####</p>
              )}
            </div>
          </div>

          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">Complete:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{formatDate(complete)}</p>
            </div>
          </div>
          <div className="row mb-0 colFont">
            <div className="col text-left">
              <span className="d-inline-block">Cost:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{cost}</p>
            </div>
          </div>
          <div className="row mb-0 colFont font-weight-semibold">
            <div className="col text-left">
              <span className="d-inline-block ">Requested:</span>
            </div>
            <div className="col-auto text-left font-weight-semibold">
              <p>{formatDate(date_ordered)}</p>
            </div>
          </div>
        </div>
        <div className="mt-auto" id="add-report-cost" data-report-id="14">
          <a
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center mt-3"
          >
            <img className="report_cost_request_img" src={CostIcon} />
            Report Cost Request
          </a>
        </div>
      </div>
    </>
  );
};

export default ReportInfo;
