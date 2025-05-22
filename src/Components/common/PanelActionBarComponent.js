import React from "react";
import { useSelector } from "react-redux";
import PanelChecklist from "../common/PanelChecklist";
import { currencyFormat, formatDate } from "../../Utils/helper";

const PanelActionBarComponent = ({
  id,
  page_name,
  title,
  first_name,
  last_name,
  report_type_name = "",
  report_agency_name = "",
  buttons = [],
  panelIconSrc,
  object,
  forInstanceName = "",
  hasGradient = false,
  instanceForName = "",
}) => {
  // console.log(buttons);
  const client = useSelector((state) => state.todos.client);
  return (
    <div
      className="border-box  has-checklist position-relative"
      style={{ zIndex: "2" }}
    >
      <div
        className={`title-bar-main-div d-flex flex-row has-title-bg  ${hasGradient ? "skewed-primary-gradient-new" : ""}`}
      >
        <PanelChecklist
          entity={page_name === "Incident Report" ? "Reports" : page_name}
          entity_id={id}
        />

        {panelIconSrc && (
          <div
            style={{
              position: "absolute",
              left: "0px",
              width: "19px",
              height: "19px",
              top: '1px'
            }}
          >
            <span className="page-icon">
              <img
                src={panelIconSrc}
                alt="Icon"
                style={{ height: "100%", width: "100%" }}
              />
            </span>
          </div>
        )}

        <div
          style={{ paddingLeft: "34px", marginRight: "5px" }}
          className="top-header height-25 d-flex  responsive-width-of-title "
        >
          <div className="top-head-fixed custom-font-14px p-t-5 p-b-5 height-25">
            <h2 className="d-flex align-items-center mr-1">
              {/* IF counsels and insurance on defendants or other page as chaild components */}
              {forInstanceName ? (
                <small style={{ fontWeight: "600" }}>
                  {instanceForName} For {title} {forInstanceName}
                </small>
              ) : (
                <small style={{ fontWeight: "600" }}>{title}</small>
              )}
            </h2>


            <h2 className="d-flex align-items-center mr-1">
              <small className="font-weight-600 custom-font-14px">
                {first_name} {last_name}
              </small>
            </h2>
            {page_name === "Incident Report" && (
              <>
                <h2 className="d-flex align-items-center mr-1">
                  <small className="font-weight-600 custom-font-14px">
                    {report_agency_name}
                  </small>
                </h2>
                <h2 className="d-flex align-items-center mr-1">
                  <small className="font-weight-600 custom-font-14px">
                    {report_type_name}
                  </small>
                </h2>
              </>
            )}
            {page_name === "Defendants" && (
              <>
                <h2 className="d-flex align-items-center mr-1">
                  <small className="font-weight-600 custom-font-14px">
                    {object?.defendantType_name === "Private Individual"
                      ? `${object?.first_name} ${object?.last_name}`
                      : object?.entity_name}
                  </small>
                </h2>
              </>
            )}
          </div>
          {
              page_name == "Loans" &&   
              <>
              <h2 className="d-flex align-items-center m-l-10 mr-1" style={{paddingTop:"1px"}}>
                <small className="custom-font-14px d-flex">Loan Amount:&nbsp;</small>
                <small className="d-flex align-items-center monospace-font custom-font-14px" style={{paddingTop:"2px"}}>
                  { currencyFormat(object?.loan_amount) }
                </small>
              </h2>
              <h2 className="d-flex align-items-center m-l-10 mr-1" style={{paddingTop:"1px"}}>
                <small className="custom-font-14px d-flex">Date Disbursed:&nbsp;</small>
                <small className="custom-font-14px d-flex align-items-center" style={{paddingTop:"2px"}}>
                  { formatDate(object?.date_disbursed) }
                </small>
              </h2>
              </>        

            }
        </div>

        {page_name === "Defendants" ? (
          <div
            class="btn-wrapper justify-content-end align-items-center"
            style={{ marginRight: "13rem" }}
          >
            <p
              className="custom-font-14px dynamic-margin-class-2"
              style={{ color: "white", fontWeight: "600" }}
            >
              {page_name} Notes
            </p>
            {buttons.map((button, index) => (
              <button
                key={index}
                type={button.type || "button"}
                className={`${button.className} d-flex align-items-center justify-content-center`}
                data-toggle={button.dataToggle}
                data-target={button.dataTarget}
                onClick={button.onClick}
                style={{ zIndex: "1", height: "20px" }}
              >
                <span className="font-weight-bold pr-2 text-gold">
                  {button.icon}
                </span>
                {button.label}
              </button>
            ))}
          </div>
        ) : (
          <p
            className="d-flex align-items-center position-relative "
            style={{ right: "0px", zIndex: "1" }}
          >
            <small
              style={{ fontSize: "14px", color: "#ffffff", fontWeight: "600" }}
            >
              {report_type_name} Notes
            </small>
          </p>
        )}

        {/* <div
          className="d-flex align-items-center position-relative w-75 justify-content-center"
          style={{ gap: "5px" }}
        >
          {buttons.map((button, index) => (
            <button
              key={index}
              type={button.type || "button"}
              className={`${button.className} d-flex align-items-center justify-content-center`}
              data-toggle={button.dataToggle}
              data-target={button.dataTarget}
              onClick={button.onClick}
              style={{ zIndex: "1", height: "20px" }}
            >
              <span className="font-weight-bold pr-2 text-gold">
                {button.icon}
              </span>
              {button.label}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default PanelActionBarComponent;
