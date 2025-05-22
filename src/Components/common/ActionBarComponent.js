import React from "react";
import PageChecklist from "./PageChecklist";
import { Link } from "react-router-dom";
import CommonChecklist from "./CommonChecklist";
import { CostInfoItem } from "../CostDashboard/CostInfoItem";
import { useSelector } from "react-redux";
import nparrow from "../../../public/BP_resources/images/icon/nparrow.svg";

const ActionBarComponent = ({
  src = "",
  page_name,
  buttons = [],
  isChecklist = false,
  isDummy = false,
  page_checklist_state,
  links = [],
  showChecklist = false,
  costInfo = {},
  injuries = [],
  caseAccident = [],
  defendantData = {},
}) => {
  const linkStyle = {
    color: "white", // Note camelCase instead of color: "white"
    textDecoration: "none", // textDecoration instead of text-decoration
  };

  // console.log("Page Name ===>", page_name);
  const open = useSelector((state) => state?.open?.open);
  return (
    <div
      className={`action-bar main-action-bar client-BarAlign d-flex m-b-5 pr-15 ${isChecklist ? "has-checklist" : ""} ${showChecklist ? "has-checklist anti-action-bar anti-client-BarAlign" : ""} ${page_name == "Search" ? "search-action-bar" : ""}`}
      style={{
        overflow: isChecklist ? "unset" : showChecklist ? "unset" : "initial",
        zIndex: open ? "0" : "",
      }}
    >
      <span className="page-icon">
        {page_name === "Home" ? (
          <i className="ic ic-29 ic-home"></i>
        ) : page_name === "Accounting" ||
          page_name === "Accounting Trust Ledger" ? (
          <i style={{ height: "32px" }} className="ic ic-42 ic-accounting"></i>
        ) : (
          <img className="translate-note-icon" src={src} />
        )}
      </span>
      <div className="text-wrapper text-nowrap text-white d-flex align-items-center p-l-5">
        <h2 className="text-white mb-0" style={{cursor: 'default', ...(page_name === 'Documents' && {marginLeft: '5px'})}}>{page_name}</h2>
      </div>
      {isChecklist && (
        <PageChecklist
          entity={page_name === "Incident Report" ? "Reports" : page_name}
          updateState={page_checklist_state}
        />
      )}
      {page_name === "Injuries" && (
        <div class="injury-legend d-flex flex-wrap" id="other-parties-page">
          {injuries.map((injury, idx) => (
            <div class="d-flex align-items-center m-r-15-i" key={idx}>
              <div
                class={`background-color-${injury.bgColor}-width-14px-height-14px-margin-right-5px`}
              ></div>
              <span> {injury.name} </span>
            </div>
          ))}
        </div>
      )}
      {page_name === "Defendants" && (
        <div className="text-wrapper custom-font-14px text-white d-flex align-items-center p-l-5">
          <span className="text-gray-2">
            {defendantData?.total_defendants}{" "}
          </span>
          <p className="p-l-5 p-r-5">Total</p>
          <span className="text-gray-2">{defendantData?.case_served}</span>
          <p className="p-l-5  p-r-5">Served</p>
        </div>
      )}
      {(page_name.includes("Time") || page_name.includes("Car Accident")) && (
        <ul
          className="info-list text-white text-nowrap d-flex list-unstyled"
          style={{ zIndex: "1" }}
        >
          {caseAccident.map((caseAcc, idx) => (
            <li key={idx}>
              <span className="label">{caseAcc.label}</span>
              <span className="value">{caseAcc.value}</span>
            </li>
          ))}
        </ul>
      )}
      {page_name === "Costs" && (
        <ul
          className="m-b-0 info-list text-white d-flex list-unstyled no-wrap"
          style={{ zIndex: "1", fontWeight: "600px" }}
        >
          <CostInfoItem label="Total" value={costInfo.totalAmount} />
          <CostInfoItem
            label="Open Not Requested"
            value={costInfo.openNotRequested}
          />
          <CostInfoItem label="Requested" value={costInfo.requested} />
          <CostInfoItem label="Paid" value={costInfo.paid} />
          <CostInfoItem label="CC" value={costInfo.totalCreditCard} />
        </ul>
      )}

      {showChecklist && <CommonChecklist />}
      {isDummy ? (
        <></>
      ) : (
        <>
          {page_name === "Treatment" && (
            <>
              {links.map((link, index) => (
                <Link key={index} to={link.to} style={linkStyle}>
                  <span className={link.className}>
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              ))}
            </>
          )}
          <div
            className="d-flex w-100 p-r-5 justify-content-end align-items-center"
            style={{ gap: "5px" }}
          >
            {buttons?.map((button, index) => (
              <button
                key={index}
                type={button.type || "button"}
                className={button.className || "btn btn-primary"}
                data-toggle={button.dataToggle}
                data-target={button.dataTarget}
                onClick={button.onClick}
                style={{ zIndex: "1" }}
              >
                <span className="font-weight-bold pr-2 text-gold">
                  {button.icon}
                </span>
                {button.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActionBarComponent;
