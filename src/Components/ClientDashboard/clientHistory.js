import React, { useEffect, useState } from "react";
import incident from "../../../public/bp_assets/img/incident.svg";
import "./clientHistory.css";
import AddClientModalBody from "./modals/newCaseModal";

const ClientName = ({ first_name, last_name, clientCasesProp }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "");
    const day = String(date.getDate()).padStart(2, "");
    return `${month}/${day}/${year}`;
  };
  const [showClientModal, setShowClientModal] = useState(false);

  const clientCases = [...clientCasesProp];
  const caseCount = clientCases.length;
  const initialFakeRows = 3;
  const caseFakeRows = Math.max(0, initialFakeRows - caseCount);

  const buttonsConfig = [
    {
      label: "New Case For Client",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addlegalcounsel",
      onClick: () => setShowClientModal(!showClientModal),
    },
  ];

  return (
    <>
      <div className="client-contact-phone-col client-contact-col c-case custom-w-mw client-contact-wrapper height-70">
        <div
          className="d-flex align-items-center justify-contact-center w-100"
          style={{ height: "25px", background: "var(--primary-15)" }}
        >
          <h4
            className="client-contact-title text-center w-100 d-flex align-items-center justify-content-center"
            style={{ height: "25px" }}
          >
            {first_name ? first_name : ""} {last_name ? last_name : ""} Case
            History
          </h4>
        </div>
        <div>
          <div className="row flex-column mr-0 ml-0">
            <div
              className="table-responsive table--no-card border-0 has-alternate-grey insurance-col-table panel-notes-section-height"
              style={{
                height: "63px",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <table className="table table-borderless table-striped table-earning">
                <tbody className="tbody-panels">
                  {clientCases &&
                    clientCases.length > 0 &&
                    clientCases.map((cases, index) => (
                      <tr className="" key={index}>
                        <td
                          className="height-21 text-left d-flex align-items-center"
                          id="clientHistoryCaseIconPadding"
                        >
                          <i className="ic ic-accident ic-19 m-r-5"></i>
                          <span
                            className="white-space-nowrap"
                            style={{
                              fontSize: "14px",
                              color: "black",
                              fontWeight: "600",
                            }}
                          >
                            {cases?.case_type}
                          </span>
                        </td>
                        <td
                          className="height-21 text-left"
                          id="clientHistoryCaseIconPadding"
                        >
                          {cases.incident_date ? (
                            <span className="height-21 d-flex align-items-center">
                              <>
                                <img
                                  src={incident}
                                  alt="primary"
                                  className="ic-19 m-r-5"
                                />
                              </>
                              <span className="font-weight-semibold">
                                {formatDate(cases?.incident_date)}
                              </span>
                            </span>
                          ) : null}
                        </td>
                        <td
                          className="height-21 text-center"
                          id="clientHistoryCaseIconPadding"
                        >
                          {cases?.auto_case_stage &&
                            cases?.auto_case_stage?.length > 0 &&
                            cases?.auto_case_stage?.map((stages, index) => (
                              <span
                                key={index}
                                className="font-weight-semibold"
                              >
                                {stages}
                              </span>
                            ))}
                        </td>
                        <td
                          className="height-21 text-right"
                          id="clientHistoryCaseIconPadding"
                        >
                          {cases.open === "True" ? (
                            <>
                              <span className="color-green font-weight-bold m-r-5">
                                OPEN:
                              </span>
                              <span className="font-weight-semibold">
                                {formatDate(cases?.date_open)}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="colorgrey-2 font-weight-bold m-r-5">
                                CLOSED
                              </span>
                              <span className="font-weight-semibold">
                                {formatDate(cases?.date_closed)}
                              </span>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  {[...Array(caseFakeRows)].map((_, index) => (
                    <tr
                      key={`additional-${index}`}
                      className="fake-row-2"
                      style={{ height: "21px" }}
                    >
                      <td
                        colSpan="6"
                        id="clientHistoryCaseIconPadding"
                        style={{ height: "21px" }}
                      >
                        &nbsp;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowClientModal(!showClientModal)}
              style={{
                backgroundColor: "var(--primary-10)",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
              }}
              className="btn info-panel-button-hover-state w-100 font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center mt-0"
            >
              <span
                className="font-weight-bold p-r-5"
                style={{
                  color: "#c49e09",
                }}
              >
                +
              </span>
              New Case For Client
            </button>
          </div>
        </div>
      </div>

      {showClientModal && (
        <AddClientModalBody
          handleClose={() => setShowClientModal(false)}
          show={showClientModal}
        />
      )}
    </>
  );
};

export default ClientName;
