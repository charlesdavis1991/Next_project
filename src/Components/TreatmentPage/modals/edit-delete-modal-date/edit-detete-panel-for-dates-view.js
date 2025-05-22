import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Button } from "react-bootstrap";

import "./editDeleteModalDate.css";
import { api_without_cancellation } from "../../../../api/api";
import {
  formatDateForInput,
  formatDateForInputTreatment,
} from "../../utils/helperFn";
import { getCaseId } from "../../../../Utils/helper";
import VerificationInfo from "../../components/VerificationInfo";
import axios from "axios";

function EditDeleteModalDatePanelForDates({
  show,
  handleClose,
  date,
  setAllTreatmentDates,
  caseProvider,
  refetchTreatment,
}) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const [type, setType] = useState("editDeleteEntry");
  const dropdownRef = useRef(null);
  const [treatmentDateId, setTreatmentDateId] = useState(date.id);
  const [treatmentDate, setTreatmentDate] = useState();
  const [treatmentNotes, setTreatmentNotes] = useState(date.description);
  useEffect(() => {
    if (show && date.length !== 0) {
      const date1 = formatDateForInput(date.date);
      setTreatmentDate(date1);
    }
  }, [show, date]);

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/treatment/delete_treatment_date/`,
        {
          treatment_date_id: treatmentDateId,
        }
      );
      if (response.status === 200) {
        setAllTreatmentDates((prevDates) =>
          prevDates?.treatment_date?.filter((td) => td.id !== treatmentDateId)
        );
        refetchTreatment(true);
        handleClose();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${origin}/api/treatment/delete_treatment_update/`,
        {
          treatment_date_id: treatmentDateId,
          treatment_date_date: formatDateForInputTreatment(treatmentDate),
          treatment_date_note: treatmentNotes,
        }
      );
      console.log(response, "<<<<<<<<<<<<<");
      setAllTreatmentDates((prevDates) =>
        prevDates?.map((td) =>
          td?.treatment_date?.id === treatmentDateId
            ? {
                ...td,
                treatment_date: {
                  ...td.treatment_date,
                  date: response.data.date,
                  description: treatmentNotes,
                },
              }
            : td
        )
      );
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="max-800-modal modal-dialog-centered "
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
              Edit or Delete Treatment Date Entry For{" "}
              {caseProvider?.providerprofile_office_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "0px" }}>
            <div className="custom-tab">
              <Tab.Container defaultActiveKey={"editDeleteEntry"}>
                <div className="">
                  <Tab.Content>
                    <Tab.Pane
                      style={{
                        minHeight: "95px",
                      }}
                      eventKey="editDeleteEntry"
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
                                  Treatment Date
                                </label>
                              </div>

                              <div
                                className="p-l-5 height-25 pr-0 input-value-provider"
                                // style={{ minWidth: "504px" }}
                                style={{ width: "calc(100% - 135px)" }}
                              >
                                <div class="d-flex align-items-center w-100">
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="treatment_date"
                                    value={formatDateForInputTreatment(
                                      treatmentDate
                                    )}
                                    onChange={(e) =>
                                      setTreatmentDate(e.target.value)
                                    }
                                    // readOnly
                                  />
                                </div>
                              </div>
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
                                  Treatment Notes
                                </label>
                              </div>

                              <div
                                className="p-l-5 height-25 pr-0 input-value-provider"
                                // style={{ minWidth: "504px" }}
                                style={{ width: "calc(100% - 135px)" }}
                              >
                                <div class="d-flex align-items-center w-100">
                                  <textarea
                                    id="treatment_note"
                                    className="form-control"
                                    value={treatmentNotes}
                                    onChange={(e) =>
                                      setTreatmentNotes(e.target.value)
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>
            </div>
          </Modal.Body>
          {type === "editDeleteEntry" && (
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
              <button
                type="button"
                className="btn btn-danger button-padding-footer-new-provider d-flex align-items-center justify-content-center "
                onClick={handleDelete}
              >
                Delete
              </button>
              <Button
                variant={"primary"}
                disabled={treatmentNotes === "" && treatmentDate === ""}
                style={{
                  cursor:
                    treatmentNotes === "" && treatmentDate === ""
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleUpdate}
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

export default React.memo(EditDeleteModalDatePanelForDates);
