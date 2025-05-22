import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Button } from "react-bootstrap";

import "./VisitsModal.css";
import { api_without_cancellation } from "../../../../api/api";
import { formatDateForInput } from "../../utils/helperFn";
import { getCaseId } from "../../../../Utils/helper";
import VerificationInfo from "../../components/VerificationInfo";

function VisitsModal({
  show,
  handleClose,
  verification,
  dates,
  setdates,
  caseProvider,
  visits,
  setVisits,
  refetch,
  specialitiesList,
}) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [type, setType] = useState("addVisitsFirstLastDates");
  const dropdownRef = useRef(null);
  const firstDateVerification = verification?.first_date;
  const secondDateVerification = verification?.second_date;
  const visitsVerification = verification?.visits;

  const [visitsModalData, setVisitsModalData] = useState({
    visits: visits || 0,
    firstVisitDate: dates.length > 0 ? dates[0]?.date : "",
    lastVisitDate: dates.length > 1 ? dates[1]?.date : "",
  });

  function verify_unverify(arg) {
    const data = {
      client_id: 20,
      case_id: getCaseId(),
      visits: visitsModalData?.visits,
      first_visit_date: visitsModalData?.firstVisitDate,
      last_visit_date: visitsModalData?.lastVisitDate,
      Arg: arg,
      case_provider_id: caseProvider?.id,
    };

    const apiUrl = `${origin}/api/treatment/verify-unverify/`;
    api_without_cancellation
      .post(apiUrl, data)
      .then((response) => {
        // updateCall();
        // onUpdate();
        refetch(); //handleClose()
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  }

  function updateCaseProvider() {
    const data = {
      visits: visitsModalData?.visits,
      first_date: formatDateForInput(visitsModalData?.firstVisitDate),
      last_date: formatDateForInput(visitsModalData?.lastVisitDate),
    };

    api_without_cancellation
      .patch(
        `${origin}/api/treatment/update/case-provider/${caseProvider?.id}/`,
        data
      )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        console.log(
          "visits modal dates needed ===>",
          visitsModalData?.firstVisitDate,
          visitsModalData?.lastVisitDate
        );
        const newDates = [
          { date: visitsModalData?.firstVisitDate },
          { date: visitsModalData?.lastVisitDate },
        ];
        setdates(newDates);
        setVisits(data?.visits);

        // updateCall()
        // onUpdate();
        refetch();
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    const variableMedBillWidth = () => {
      const providerColumns = [
        ...document.querySelectorAll(".provider-col-treatment-visits"),
      ];
      console.log(providerColumns.length);
      const inputColumns = [
        ...document.querySelectorAll(".input-value-provider"),
      ];

      if (inputColumns.length === 0 || providerColumns.length === 0) return;
      if (caseProvider) {
        let providerMaxWidth = 0;
        providerColumns.forEach((col) => {
          const colWidth = col.offsetWidth;
          if (colWidth > providerMaxWidth) {
            providerMaxWidth = colWidth;
          }
        });
        // Apply the maximum width to all columns
        providerColumns.forEach((col) => {
          col.style.minWidth = `${providerMaxWidth}px`;
          col.style.width = `${providerMaxWidth}px`;
        });

        let inputWidth = 0;
        inputColumns.forEach((col) => {
          const colWidth = col.offsetWidth;
          if (colWidth > inputWidth) {
            inputWidth = colWidth;
          }
        });
        // Apply the maximum width to all columns
        inputColumns.forEach((col) => {
          col.style.minWidth = `${900 - providerMaxWidth - 145}px`;
          col.style.width = `${900 - providerMaxWidth - 145}px`;
        });
      }
    };

    // setMaxColumnWidth(calculateMaxWidth());
    variableMedBillWidth();
  }, [caseProvider]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="max-870-modal modal-dialog-centered "
        contentClassName="custom-modal-new-provider"
        size="lg"
      >
        <div style={{}}>
          <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
              id="modal_title"
              style={{ fontSize: "14px", fontWeight: "600" }}
            >
              Add Number of Visits, First and Last Treatment Dates For{" "}
              {caseProvider?.providerprofile_office_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "0px" }}>
            <div className="custom-tab">
              <Tab.Container defaultActiveKey={"addVisitsFirstLastDates"}>
                <div className="">
                  <Tab.Content>
                    <Tab.Pane
                      style={{
                        minHeight: "190px",
                        scrollbarWidth: "none",
                      }}
                      eventKey="addVisitsFirstLastDates"
                    >
                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0 mb-0 justify-content-center align-items-center custom-margin-bottom">
                            <div className="row align-items-center form-group w-100 mb-0">
                              <div
                                class="col-md-2 m-r-5 height-25 d-flex align-items-center text-left"
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: 600,
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "125px",
                                  maxWidth: "125px",
                                }}
                              >
                                <label
                                  class="d-inline-block mb-0 "
                                  for="visits"
                                >
                                  Number of Visits
                                </label>
                              </div>
                              <div
                                className="col-md-5 provider-col-treatment-visits whitespace-nowrap  d-flex align-items-center height-25 p-r-5 p-l-0"
                                style={{
                                  whiteSpace: "nowrap",
                                  // minWidth: "380px",
                                  background: specialitiesList?.secondary_color,

                                  maxWidth: "fit-content",
                                }}
                              >
                                <div
                                  className=""
                                  style={{
                                    backgroundColor: specialitiesList?.color,
                                    height: "25px",
                                    width: "25px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                  }}
                                >
                                  {specialitiesList?.name[0]}
                                </div>
                                <div
                                  style={{
                                    backgroundColor: specialitiesList?.color,
                                    paddingLeft: "5px",
                                    fontWeight: "600",
                                    height: "25px",
                                    paddingRight: "5px",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {specialitiesList?.name}
                                </div>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    paddingLeft: " 5px",
                                  }}
                                >
                                  {caseProvider?.providerprofile_office_name}
                                </span>
                              </div>
                              <div
                                className="p-l-5 height-25 pr-0 input-value-provider"
                                // style={{ minWidth: "504px" }}
                              >
                                <div class="d-flex align-items-center w-100">
                                  <input
                                    type="number"
                                    placeholder="Number of Visits"
                                    class="form-control height-25"
                                    name="visits"
                                    value={visitsModalData?.visits}
                                    onChange={(e) =>
                                      setVisitsModalData({
                                        ...visitsModalData,
                                        visits: e.target.value,
                                      })
                                    }
                                  />
                                  <div class="icon-wrap ic-25 m-l-5 height-25 m-r-5">
                                    {visitsVerification !== null ? (
                                      <i
                                        id="is_request_billing_recived_verified"
                                        className="ic ic-verified ic-25"
                                      ></i>
                                    ) : (
                                      <i
                                        id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"
                                      ></i>
                                    )}
                                  </div>

                                  <button
                                    id="is_request_billing_recived_verified_btn"
                                    className="btn btn-primary justify-content-center rounded-0 height-25 d-flex align-items-center"
                                    onClick={() =>
                                      verify_unverify("CaseProviders-visits")
                                    }
                                    style={{ minWidth: "83px" }}
                                  >
                                    {visitsVerification !== null
                                      ? "Unverify"
                                      : "Verify"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0 height-30"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0 justify-content-center align-items-center custom-margin-bottom">
                            <div
                              class="row align-items-center height-25 justify-content-center form-group mb-0 w-100 mb-0"
                              style={{
                                background: "var(--primary-10)",
                              }}
                            >
                              <VerificationInfo
                                verificationData={visitsVerification}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0 mb-0 justify-content-center align-items-center custom-margin-bottom">
                            <div class="row align-items-center form-group mb-0 w-100">
                              <div
                                class="col-md-2 m-r-5 height-25 d-flex align-items-center text-left"
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: 600,
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "125px",
                                  maxWidth: "125px",
                                }}
                              >
                                <label
                                  class="d-inline-block mb-0 "
                                  for="first_date"
                                >
                                  First Visit
                                </label>
                              </div>
                              <div
                                className="col-md-5 provider-col-treatment-visits whitespace-nowrap  d-flex align-items-center height-25 p-r-5 p-l-0"
                                style={{
                                  whiteSpace: "nowrap",
                                  // minWidth: "380px",
                                  background: specialitiesList?.secondary_color,

                                  maxWidth: "fit-content",
                                }}
                              >
                                <div
                                  className=""
                                  style={{
                                    backgroundColor: specialitiesList?.color,
                                    height: "25px",
                                    width: "25px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                  }}
                                >
                                  {specialitiesList?.name[0]}
                                </div>
                                <div
                                  style={{
                                    backgroundColor: specialitiesList?.color,
                                    paddingLeft: "5px",
                                    fontWeight: "600",
                                    height: "25px",
                                    paddingRight: "5px",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {specialitiesList?.name}
                                </div>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    paddingLeft: " 5px",
                                  }}
                                >
                                  {caseProvider?.providerprofile_office_name}
                                </span>
                              </div>
                              <div
                                class=" height-25 p-l-5 pr-0 input-value-provider"
                                // style={{ minWidth: "504px" }}
                              >
                                <div class="d-flex align-items-center w-100">
                                  <input
                                    type="date"
                                    class="form-control height-25"
                                    value={formatDateForInput(
                                      visitsModalData?.firstVisitDate
                                    )}
                                    onChange={(e) => {
                                      setVisitsModalData({
                                        ...visitsModalData,
                                        firstVisitDate: e.target.value,
                                      });
                                    }}
                                  />
                                  <div class="icon-wrap ic-25 m-l-5 height-25 m-r-5">
                                    {firstDateVerification !== null ? (
                                      <i
                                        id="is_request_billing_recived_verified"
                                        className="ic ic-verified ic-25"
                                      ></i>
                                    ) : (
                                      <i
                                        id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"
                                      ></i>
                                    )}
                                  </div>

                                  <button
                                    id="is_request_billing_recived_verified_btn"
                                    className="btn btn-primary rounded-0 justify-content-center height-25 d-flex align-items-center"
                                    onClick={() =>
                                      verify_unverify(
                                        "CaseProviders-first_date"
                                      )
                                    }
                                    style={{ minWidth: "83px" }}
                                  >
                                    {firstDateVerification !== null
                                      ? "Unverify"
                                      : "Verify"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0 height-30"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0  justify-content-center align-items-center custom-margin-bottom">
                            <div
                              class="row align-items-center height-25 justify-content-center form-group mb-0 w-100 mb-0"
                              style={{
                                background: "var(--primary-10)",
                              }}
                            >
                              <VerificationInfo
                                verificationData={firstDateVerification}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0 justify-content-center align-items-center custom-margin-bottom">
                            <div class="row align-items-center form-group mb-0 w-100 mb-0">
                              <div
                                class="col-md-2 m-r-5 text-left d-flex align-items-center height-25"
                                style={{
                                  color: "var(--primary)",
                                  background: "var(--primary-15)",
                                  fontWeight: 600,
                                  paddingLeft: "5px",
                                  paddingRight: "5px",
                                  minWidth: "125px",
                                  maxWidth: "125px",
                                }}
                              >
                                <label
                                  class="d-inline-block mb-0"
                                  for="second_date"
                                >
                                  Last Visit
                                </label>
                              </div>
                              <div
                                className="col-md-5 provider-col-treatment-visits whitespace-nowrap  d-flex align-items-center height-25 p-r-5 p-l-0"
                                style={{
                                  whiteSpace: "nowrap",
                                  // minWidth: "380px",
                                  background: specialitiesList?.secondary_color,

                                  maxWidth: "fit-content",
                                }}
                              >
                                <div
                                  className=""
                                  style={{
                                    backgroundColor: specialitiesList?.color,
                                    height: "25px",
                                    width: "25px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                  }}
                                >
                                  {specialitiesList?.name[0]}
                                </div>
                                <div
                                  style={{
                                    backgroundColor: specialitiesList?.color,
                                    paddingLeft: "5px",
                                    fontWeight: "600",
                                    height: "25px",
                                    paddingRight: "5px",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {specialitiesList?.name}
                                </div>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    paddingLeft: " 5px",
                                  }}
                                >
                                  {caseProvider?.providerprofile_office_name}
                                </span>
                              </div>
                              <div
                                class=" height-25 p-l-5 pr-0 input-value-provider"
                                // style={{ minWidth: "504px" }}
                              >
                                <div class="d-flex w-100 align-items-center">
                                  <input
                                    type="date"
                                    class="form-control height-25"
                                    value={formatDateForInput(
                                      visitsModalData?.lastVisitDate
                                    )}
                                    onChange={(e) => {
                                      setVisitsModalData({
                                        ...visitsModalData,
                                        lastVisitDate: e.target.value,
                                      });
                                    }}
                                  />
                                  <div class="icon-wrap ic-25 height-25 m-l-5 m-r-5">
                                    {secondDateVerification !== null ? (
                                      <i
                                        id="is_request_billing_recived_verified"
                                        className="ic ic-verified ic-25"
                                      ></i>
                                    ) : (
                                      <i
                                        id="is_request_billing_recived_verified"
                                        className="ic ic-unverified ic-25"
                                      ></i>
                                    )}
                                  </div>

                                  <button
                                    id="is_request_billing_recived_verified_btn"
                                    className="btn btn-primary justify-content-center rounded-0 height-25 d-flex align-items-center"
                                    onClick={() =>
                                      verify_unverify(
                                        "CaseProviders-second_date"
                                      )
                                    }
                                    style={{ minWidth: "83px" }}
                                  >
                                    {secondDateVerification !== null
                                      ? "Unverify"
                                      : "Verify"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row
                        style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        className="mx-0 height-30"
                      >
                        <Col md={12} className="p-0 p-t-5">
                          <div className="row mx-0 justify-content-center align-items-center custom-margin-bottom">
                            <div
                              class="row align-items-center height-25 justify-content-center form-group mb-0 w-100 mb-0"
                              style={{
                                background: "var(--primary-10)",
                              }}
                            >
                              <VerificationInfo
                                verificationData={secondDateVerification}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {/* <div
                                className="col-md-5 justify-content-center d-flex align-items-center height-25 p-r-5 p-l-5"
                                style={{
                                  whiteSpace: "nowrap",
                                  minWidth: "380px",
                                  maxWidth: "fit-content",
                                  background: "var(--primary-10)",
                                }}
                              >

                              </div> */}
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
            </div>
          </Modal.Body>
          {type === "addVisitsFirstLastDates" && (
            <Modal.Footer
              className="p-0 mt-0 padding-outside-btn-new-provider"
              style={{ borderTop: "none" }}
            >
              <Button
                className="button-padding-footer-new-provider d-flex align-items-center justify-content-center "
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant={"primary"}
                disabled={
                  visitsModalData?.visits === 0 ||
                  visitsModalData?.visits === "_" ||
                  (visitsModalData === "" &&
                    visitsModalData?.firstVisitDate === "" &&
                    visitsModalData?.lastVisitDate === "")
                }
                style={{
                  cursor:
                    visitsModalData?.visits === 0 ||
                    visitsModalData?.visits === "_" ||
                    (visitsModalData === "" &&
                      visitsModalData?.firstVisitDate === "" &&
                      visitsModalData?.lastVisitDate === "")
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={updateCaseProvider}
                className="button-padding-footer-new-provider d-flex align-items-center justify-content-center "
              >
                Save
              </Button>
            </Modal.Footer>
          )}
        </div>
      </Modal>
    </>
  );
}

export default React.memo(VisitsModal);
