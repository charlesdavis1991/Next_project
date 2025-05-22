import React, { useState } from "react";
import { formatDate } from "../../Utils/helper";

const InformationPanel = ({
  id,
  // title,
  // first_name,
  // last_name,
  pageName="",
  panel_name,
  type,
  act,
  data,
  dataClassName = "justify-content-between",
  onSelectReport,
  hasBtn = false,
  imgSrc,
  buttonText,
  className,
  imgClassName,
  iconClassName,
  onClick = () => console.log("Hi"),
  panelClassName = "",
  defaultLength = 7,
}) => {

  const renderStatusDates = () => {
    const rejected_date = new Date(act?.rejected_on);
    const isExpired = act?.end_date && new Date(act.end_date) < rejected_date;
    const expiredDate = isExpired ? formatDate(act.end_date) : null; //if act has expired
    const expiry = formatDate(act?.end_date); // end_date = expiry
  
    if (act) {
      if (act?.event_id?.trigger_type === "DependantDate") {
        const dependantDateFormatted = act?.dependant_date ? formatDate(act.dependant_date) : null;
        
        return (
          <>
              <div className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap p-r-5 p-l-5">
                <div className="col text-left p-0">
                  <span className="d-inline-block">{act?.date_name}:</span>
                </div>
                <div className="col-auto p-0 text-left font-weight-semibold">
                  <p>{dependantDateFormatted && dependantDateFormatted}</p>
                </div>
              </div>
              <div className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap p-r-5 p-l-5">
                <div className="col text-left p-0">
                  <span className="d-inline-block">Expiry:</span>
                </div>
                <div className="col-auto p-0 text-left font-weight-semibold">
                  <p>{expiry}</p>
                </div>
              </div>
            
          </>
        );
      } else { // "Accept/Reject" type
        const accepted = act?.accepted_on ? formatDate(act.accepted_on) : null;
        const rejected = act?.rejected_on ? formatDate(act.rejected_on) : null;
        
        return (
          <>
              <div className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap p-r-5 p-l-5">
                <div className="col text-left p-0">
                  <span className="d-inline-block">Accepted:</span>
                </div>
                <div className="col-auto p-0 text-left font-weight-semibold">
                  <p>{accepted && accepted}</p>
                </div>
              </div>
              <div className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap p-r-5 p-l-5">
                <div className="col text-left p-0">
                  <span className="d-inline-block">Rejected:</span>
                </div>
                <div className="col-auto p-0 text-left font-weight-semibold">
                  <p>{rejected && rejected}</p>
                </div>
              </div>
              <div className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap p-r-5 p-l-5">
                <div className="col text-left p-0">
                  <span className="d-inline-block">Expiry:</span>
                </div>
                <div className="col-auto p-0 text-left font-weight-semibold">
                  <p>{expiry}</p>
                </div>
              </div>
          </>
        );
      }
    } else {
      return;
    }
  };

  return (
    <>
      <div className={` info-div ${panelClassName}`} onClick={onSelectReport} style={{width:pageName && pageName?.startsWith("litigation") ? "255px" : "260px"}}>
        <div className="" style={{overflow:"hidden"}}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "var(--primary-15)", height: "25px" }}
          >
            <p className="columnsTitle text-center d-flex text-primary font-weight-semibold text-uppercase">
              {panel_name}
            </p>
          </div>

          {panel_name === "Related Dates" && renderStatusDates()}
          {data?.map((item, index) => (
            <div
              className={`info-color-panels-odd-even d-flex align-items-center ${dataClassName} mb-0 colFont flex-wrap p-r-5 p-l-5`}
              key={index}
            >
              <div className={`${dataClassName !== "justify-content-between" ? "": "col"} text-left p-0`}>
                <span className="d-inline-block">{item.label}{item.label && ":"}</span>
              </div>
              <div className={`${dataClassName !== "justify-content-between" ? "": "col-auto"} text-left p-0 font-weight-semibold`}>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
          {data.length < defaultLength &&
            Array.from({ length: ( pageName == "litigation" ? ( hasBtn ? 7 : type === "DependantDate" ? 7 : 6) : 7) - data.length }).map((_, index) => (
              <div
                className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
                style={{ height: "21px" }}
                key={`${index}`}
              ></div>
            ))}
              <div
                className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
                style={{ height: "21px" }}
              ></div>
              <div
                className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
                style={{ height: "21px" }}
              ></div>
              <div
                className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
                style={{ height: "21px" }}
              ></div>
        </div>
        {hasBtn && (
          <div className="mt-auto" id={id}>
            <a
              href="#"
              style={{backgroundColor:"var(--primary-10) !important"}}
              className={`btn btn-primary-lighter-2 btn-white-hover font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center mt-1 ${className}`}
              onClick={(event) => {
                event.stopPropagation();
                onClick(id);
              }}
            >
              {iconClassName && <i className={`${iconClassName} mr-1`}></i>}
              {imgSrc && (
                <img className={imgClassName} src={imgSrc} alt="icon" />
              )}
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default InformationPanel;
