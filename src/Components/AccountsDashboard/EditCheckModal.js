import React, { useCallback, useState, useEffect } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useCostManagement } from "./AccountsManagementContext";
import { accountsValidationSchema } from "./AccountsValidationSchema";
import { useSelector } from "react-redux";
import { useUpdateTrigger } from "./TriggerUpdateContext";
import { Collapse } from "@mui/material";
import { getCaseId, getClientId } from "../../Utils/helper";
import api, { api_without_cancellation } from "../../api/api";
import makeDeposit from "../SettlementDashboard/api/makeDeposit";

function formatDateFromString(dateString) { 
  // Convert the date string to a Date object
  if (!dateString) {
    return "";
  }
  const dateObject = new Date(dateString);

  // Get the month, day, and year
  const month = dateObject.getMonth() + 1; // months are 0-indexed
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();

  // Format the date to "MM/DD/YYYY"
  const formattedDate = `${month}/${day}/${year}`;

  // Remove leading zero from month and day
  const cleanedDate = formattedDate.replace(/^0+/g, ""); // Remove leading zero from month and day if exists

  return cleanedDate;
}
function formatDateFromString2(dateString) {
  if (!dateString) {
    return "";
  }

  let dateObject;

  if (typeof dateString === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number);
      // Create date at noon to avoid any day-shifting due to timezone
      dateObject = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    } else if (dateString.includes("T")) {
      // For ISO-like strings with time component (e.g., "2025-02-25T00:00:00")
      // Extract just the date part to avoid timezone issues
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      // Create date at noon UTC to avoid day boundary issues
      dateObject = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    } else {
      // For any other format - use UTC parsing as fallback
      const tempDate = new Date(dateString);
      dateObject = new Date(
        Date.UTC(
          tempDate.getFullYear(),
          tempDate.getMonth(),
          tempDate.getDate(),
          12,
          0,
          0
        )
      );
    }
  } else if (dateString instanceof Date) {
    // If we already have a Date object, create a new UTC-based version at noon
    dateObject = new Date(
      Date.UTC(
        dateString.getFullYear(),
        dateString.getMonth(),
        dateString.getDate(),
        12,
        0,
        0
      )
    );
  }

  // Format as YYYY-MM-DD without timezone influence
  const year = dateObject.getUTCFullYear();
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateFromString3(dateString) {
  if (!dateString) {
    return "";
  }

  let dateObject;

  // For any date string, preserve the exact date without timezone conversions
  if (typeof dateString === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // For date-only strings (YYYY-MM-DD)
      const [year, month, day] = dateString.split("-").map(Number);
      // Create date at noon to avoid any day-shifting due to timezone
      dateObject = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    } else if (dateString.includes("T")) {
      // For ISO-like strings with time component (e.g., "2025-02-25T00:00:00")
      // Extract just the date part to avoid timezone issues
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      // Create date at noon UTC to avoid day boundary issues
      dateObject = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    } else {
      // For any other format - use UTC parsing as fallback
      const tempDate = new Date(dateString);
      dateObject = new Date(
        Date.UTC(
          tempDate.getFullYear(),
          tempDate.getMonth(),
          tempDate.getDate(),
          12,
          0,
          0
        )
      );
    }
  } else if (dateString instanceof Date) {
    // If we already have a Date object, create a new UTC-based version at noon
    dateObject = new Date(
      Date.UTC(
        dateString.getFullYear(),
        dateString.getMonth(),
        dateString.getDate(),
        12,
        0,
        0
      )
    );
  }

  // Format as YYYY-MM-DD without timezone influence
  const year = dateObject.getUTCFullYear();
  const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getUTCDate()).padStart(2, "0");

  return `${month}/${day}/${year}`;
}
function convertToHtmlDateInputValue(isoDateString) {
  // Attempt to parse the date string
  const date = new Date(isoDateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  // Convert the date to the local time zone and format it as YYYY-MM-DD
  const year = date.getFullYear();
  // GetMonth() returns 0-11; adding 1 to get 1-12. Use padStart to ensure two digits.
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // GetDate() returns 1-31; Use padStart to ensure two digits.
  const day = date.getDate().toString().padStart(2, "0");

  // Construct the YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}

const EditCheckModal = ({
  isVisible,
  onHide,
  check,
  fetchAccountsData,
  panel,
}) => {
  
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const caseId = getCaseId() ?? 0;
  const clientId = getClientId() ?? 0;

  const [errors, setErrors] = useState(false);
  const handleDelete = async () => {
    try {
      // const response = await api_without_cancellation.get(
      //   origin +
      //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
      // );
      const response = await api_without_cancellation.delete(
        origin + `/api/accounting-page/edit-check/?check_id=${check?.id}`
      );
      if (response.status == 200) {
        fetchAccountsData();
        onHide();
      }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };
  const formik = useFormik({
    initialValues: check,
    // validationSchema: accountsValidationSchema,
    onSubmit: async (values) => {
      const payload = {
        check_id: check.id, // Assuming check object has an id field
        date_requested: formatDateFromString(formik.values.date_requested), // The selected date for requested date
        due_date: formatDateFromString(formik.values.due_date), // The selected date for due date
        payee: formik.values.payee, // The payee name or information
        amount: formik.values.amount, // The amount in the check
        memo: formik.values.memo, // Memo or description for the check
        cheque_date: formatDateFromString3(formik.values.cheque_date), // The date of the check
        cheque_number: formik.values.cheque_number, // Check number or invoice number
        date_cleared: formatDateFromString(
          panel === "trust_ledger"
            ? formik.values.cleared_date
            : formik.values.clearedDate
        ), // The date when the check was cleared
      };

      try {
        const response = await api_without_cancellation.post(
          origin + `/api/accounting-page/edit-check/`,
          payload
        );
        if (response.status == 200) {
          fetchAccountsData();
          onHide();
        }
      } catch (error) {
        console.log("Failed to fetch Litigation Data:", error);
      }
      // const payload = {
      //   ...values,
      //   amount: parseFloat(values.amount), // Ensure amount is a float if backend expects a number
      // };
      // const url = isEdit
      //   ? `api/edit-cost/${cost.id}/`
      //   : `api/add-cost/${clientId}/${caseId}/`;
      // try {
      //   await api.post(url, payload);
      //   toggleTriggerUpdate(); // Refresh any necessary data
      //   formik.resetForm(); // Clear the form after successful submission
      //   onHide(); // Close the modal
      // } catch (error) {
      //   console.error(
      //     "Error adding cost:",
      //     error.response ? error.response.data : error.message
      //   );
      //   setErrors(true);
      // }
    },
    enableReinitialize: true,
  });

  console.log(check);
  const [markedDeposit,setMarkedDeposit] = useState(check?.deposit)

  return (
    // <Modal show={isVisible} onHide={onHide} centered size={isEdit ? 'md' : 'lg'}>
    <Modal
      show={isVisible}
      onHide={onHide}
      centered
      size="lg"
      dialogClassName="custom-insurance-dialog justify-content-center "
    >
      <div>
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Check</div></div>
        <Modal.Body style={{ width: "100%", background: "white",padding:"5px" }}>
          {errors ? (
            <Alert variant="danger">Error editing a check record.</Alert>
          ) : (
            <></>
          )}
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group as={Row} className="m-b-5 d-flex align-items-center">
              <Form.Label
                
                className="text-nowrap height-25 p-t-0 p-b-0 d-flex align-items-center text-grey"
                column
                sm={2}
              >
                Requested:
              </Form.Label>
              <Col sm={4} style={{ display: "flex", alignItems: "center" }}>
                {/* <Form.Control
                  type="date"
                  name="date"
                  {...formik.getFieldProps("date")}
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="text-danger">{formik.errors.date}</div>
                )} */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    class="icon-container"
                    style={{
                      display: "flex",
                      height: "19px",
                      width: "19px",
                      marginRight: "4px",
                    }}
                  >
                    <i class="height-i-25 ic ic-client-avatar"></i>
                    <div class="border-overlay"></div>
                  </div>
                  {/* {cost.client.name} */}
                  {check?.check_requested_by?.first_name &&
                  check?.check_requested_by?.last_name
                    ? `${check.check_requested_by.first_name} ${check.check_requested_by.last_name}`
                    : "Christian Ross"}
                </div>
              </Col>
              <Form.Label
                style={{ display: "flex", alignItems: "center" }}
                className="text-nowrap height-25 p-t-0 p-b-0 text-grey"
                column
                sm={2}
              >
                Date Requested:
              </Form.Label>
              <Col style={{ display: "flex", alignItems: "center" }} sm={4}>
                <p style={{ display: "flex", alignItems: "center" }}>{formatDateFromString(check?.date_requested)}</p>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-b-5 d-flex align-items-center">
              {/* <Form.Label className="text-nowrap" column sm={2}> */}
              <Form.Label  column sm={2} className="p-t-0 p-b-0 text-grey">
                Amount:
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  type="number"
                  name="amount"
                  className="form-control height-25 rounded-0 p-t-0 p-b-0"
                  onChange={formik.handleChange}
                  {...formik.getFieldProps("amount")}
                  isInvalid={!!formik.errors.amount && formik.touched.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.amount}
                </Form.Control.Feedback>
              </Col>

              <Form.Label
                
                className="text-nowrap height-21 p-b-0 p-t-0 text-grey"
                column
                sm={2}
              >
                Date Due:
              </Form.Label>
              <Col style={{ display: "flex", alignItems: "center" }} sm={4}>
                <p>{formatDateFromString(check?.due_date)}</p>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-b-5">
              <Form.Label  column sm={2} className="p-t-0 p-b-0 text-grey">
                Payee:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="payee"
                  className="form-control height-25 p-t-0 p-b-0 rounded-0"
                  onChange={formik.handleChange}
                  {...formik.getFieldProps("payee")}
                />
                {formik.touched.payee && formik.errors.payee && (
                  <div className="text-danger">{formik.errors.payee}</div>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-b-5">
              <Form.Label  column sm={2} className="p-t-0 p-b-0 text-grey">
                Memo:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="memo"
                  className="form-control height-25 p-t-0 p-b-0 rounded-0"
                  onChange={formik.handleChange}
                  {...formik.getFieldProps("memo")}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-b-5">
              <Form.Label
                className="text-nowrap p-t-0 p-b-0 text-grey"
                column
                sm={2}
              >
                Check Date:
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  type="date"
                  name="cheque_date"
                  className="form-control height-25 p-t-0 p-b-0 rounded-0"
                  onChange={formik.handleChange}
                  style={{ appearance: "none" }}
                  onClick={(e) => e.target.showPicker()}
                  value={
                    formik.values.cheque_date
                      ? formatDateFromString2(formik.values.cheque_date)
                      : ""
                  } // Convert date to 'YYYY-MM-DD'
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="text-danger">{formik.errors.date}</div>
                )}
              </Col>

              <Form.Label  column sm={2} className="p-t-0 p-b-0 text-grey">
                Check #:
              </Form.Label>
              <Col sm={4} className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  name="cheque_number"
                  className="form-control height-25 p-t-0 p-b-0 rounded-0"
                  onChange={formik.handleChange}
                  {...formik.getFieldProps("cheque_number")}
                />
                {formik.touched.invoice_number &&
                  formik.errors.invoice_number && (
                    <div className="text-danger">
                      {formik.errors.invoice_number}
                    </div>
                  )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="m-b-5">
              <Form.Label column sm={2} className="p-t-0 p-b-0 whitespace-nowrap text-grey">
                Mark Deposit:
              </Form.Label>
              <Col sm={4} className="d-flex align-items-center">
                  <input
                  type="checkbox"
                  name="mark_deposit"
                  checked={markedDeposit}
                  onChange={(e) =>{
                      const newVal = e.target.checked;
                      const payload = {
                          check_id: check?.id,
                          mark_deposit: newVal ? "True" : "False"
                      }
                      setMarkedDeposit(newVal);
                      makeDeposit(payload);
                      fetchAccountsData();
                  }
                  }
                  />
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-between m-t-5 p-0">
              {/* <Button
                style={{
                  marginRight: "5px",
                }}
                variant="secondary"
                onClick={() => {
                  onHide(); // Close the modal
                }}
              >
                Cancel
              </Button> */}
              <Button variant="danger" className="height-25" style={{padding:"0px 12px"}} onClick={handleDelete}>
                Delete
              </Button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // ...(!isEdit && { width: "100%" }),
                }}
              >
                <Button variant="success" className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}} type="submit">
                  Save and Close
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default EditCheckModal;
