import React from "react";
import SingleTd from "./SingleTd";
import "./casePanelTable.css";

const CasePanelInfoTable = ({
  id,
  heading,
  data,
  target,
  width = "",
  button,
  leftHand,
  onClick,
}) => {
  return (
    <table
      className={`table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table`}
      id="treatment-summary-table"
      data-toggle="modal"
      data-target={target}
      style={{
        width:
          heading === "Open" ? "255px" : width ? width : "calc(100% - 255px)",
      }}
    >
      <thead>
        <tr id="tb-header">
          {heading === "Open" ? (
            <th className="td-autosize color-grey-2 p-l-5 text-center">
              <span className="color-green">OPEN </span> Case
            </th>
          ) : (
            <th className="td-autosize color-grey-2 p-l-5 text-center">
              {heading}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        <tr style={{ height: "21px" }}>
          <td>
            <div
              style={{
                maxHeight: data.length > 5 ? "105px" : "auto",
                overflowY: data.length > 5 ? "auto" : "",
                scrollbarWidth: "none",
              }}
            >
              <SingleTd rows={data} />
            </div>
            <button
              onClick={onClick}
              style={{
                backgroundColor: "var(--primary-10)",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
              }}
              className="btn info-panel-button-hover-state w-100 font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center mt-0"
            >
              {leftHand && (
                <span
                  className="font-weight-bold p-r-5"
                  style={{
                    color: "#c49e09",
                  }}
                >
                  +
                </span>
              )}
              {button}
            </button>
          </td>
          {/* <td>
            
          </td> */}
          {/* <>
            <td className="">
              <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                <span className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center ">
                  <img
                    src={incidentIcon}
                    className=""
                    style={{
                      width: "19px",
                      height: "19px",
                    }}
                  />
                </span>

                <p>{formatDate(caseSummaryState?.incident_date)}</p>
              </div>
              <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                <div>
                  <span className="color-green">OPEN </span>/ Intake:
                </div>
                <p>{formatDate(caseSummaryState?.intake_date)} </p>
              </div>
              <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                <span>Retained:</span>

                <p>{formatDate(caseSummaryState?.retained)}</p>
              </div>
              <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                <span>Accepted:</span>

                <p>{formatDate(caseSummaryState?.accepted_date)}</p>
              </div>
              <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-r-5 p-l-5">
                <span>Closed:</span>

                <p>{formatDate(caseSummaryState?.date_closed)}</p>
              </div>
            </td>
            <td style={{ verticalAlign: "top" }}>
              {caseSummaryState?.case_statute_limitations &&
                caseSummaryState?.case_statute_limitations?.map(
                  (caseItem, index) => (
                    <div className="mb-0 p-l-5 p-r-5" key={index}>
                      <div className="col text-left">
                        <span className="d-inline-block">
                          {caseItem.date_name}
                        </span>
                      </div>
                      <div className="col-auto text-left font-weight-semibold">
                        {new Date(caseItem?.start_date)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            timeZone: "UTC",
                          })
                          .replace(/(\w+)\s(\d+),/, "$1. $2,")}
                      </div>
                    </div>
                  )
                )}

              {Array.from(
                {
                  length:
                    5 -
                    (caseSummaryState?.case_statute_limitations?.length || 0),
                },
                (_, index) => (
                  <div
                    className="mb-0 p-l-5 p-r-5 "
                    key={`empty-${index}`}
                    style={{ height: "21px" }}
                  ></div>
                )
              )}
            </td>

            <td style={{ verticalAlign: "top" }}>
              <div className="text-left d-flex align-items-center justify-content-between p-l-5 p-r-5">
                <div className="left-area d-flex align-items-center">
                  {caseSummaryState?.for_client.profile_pic_19p ? (
                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                      <img
                        className="w-100 h-100"
                        src={caseSummaryState?.for_client.profile_pic_19p}
                        alt=""
                      />
                    </span>
                  ) : (
                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                  )}
                  <span className="m-l-5 m-r-5 font-weight-semibold">
                    {caseSummaryState?.for_client.first_name}{" "}
                    {caseSummaryState?.for_client.last_name}
                  </span>
                </div>
                <span className="padding-left35">
                  Age
                  <span className="font-weight-semibold">
                    {" "}
                    {calculateAge(caseSummaryState?.for_client.birthday)}
                  </span>
                </span>
              </div>

              {caseSummaryState?.multipleClient_for_case?.map((x) => (
                <div className="mb-0 p-l-5 p-r-5" key={x.id}>
                  <div className="col text-left d-flex align-items-center justify-content-between">
                    <div className="left-area d-flex align-items-center">
                      {x.new_client.profile_pic_19p ? (
                        <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          <img
                            className="w-100 h-100"
                            src={x.new_client.profile_pic_19p}
                            alt=""
                          />
                        </span>
                      ) : (
                        <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                      )}
                      <span className="m-l-5 m-r-5 font-weight-semibold">
                        {x.new_client.first_name} {x.new_client.last_name}
                      </span>
                    </div>
                    <span className="padding-left35">
                      Age
                      <span className="font-weight-semibold">
                        {" "}
                        {calculateAge(x.new_client.birthday)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}

              {Array.from(
                {
                  length:
                    5 - (caseSummaryState?.multipleClient_for_case?.length + 1),
                },
                (_, index) => (
                  <div
                    className="mb-0 p-l-5 p-r-5"
                    key={`empty-${index}`}
                    style={{ height: "21px" }}
                  ></div>
                )
              )}
            </td>
            <td style={{ verticalAlign: "top" }}>
              <ul className="list-unstyled list-firms-contact">
                {caseSummaryState?.case_councelling_firms &&
                  caseSummaryState?.case_councelling_firms?.map(
                    (firm, index) => (
                      <li
                        className="d-flex justify-content-between p-l-5 p-r-5"
                        key={index}
                      >
                        <span>
                          {
                            firm.firm.counseling_firm.attorneyprofile
                              .office_name
                          }
                        </span>
                        <strong>
                          {formatPhoneToDashes(
                            firm.firm.counseling_firm.main_contact.phone_number
                          )}
                        </strong>
                      </li>
                    )
                  )}

                {Array.from(
                  {
                    length:
                      5 -
                      (caseSummaryState?.case_councelling_firms?.length || 0),
                  },
                  (_, index) => (
                    <li
                      className="d-flex justify-content-between p-l-5 p-r-5"
                      key={`empty-${index}`}
                      style={{ height: "21px" }}
                    ></li>
                  )
                )}
              </ul>
            </td>
          </> */}
        </tr>
      </tbody>
    </table>
  );
};

export default CasePanelInfoTable;
