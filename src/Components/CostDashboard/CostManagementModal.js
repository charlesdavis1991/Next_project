import React, { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import api from "../../api/api";
import { useCostManagement } from "./CostManagementContext";
import { costValidationSchema } from "./CostValidationSchema";
import { useSelector } from "react-redux";
import { useUpdateTrigger } from "./TriggerUpdateContext";
import { Collapse } from "@mui/material";
import { getCaseId, getClientId } from "../../Utils/helper";

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

const CostManagementModal = () => {
  const { isVisible, isEdit, cost, hideModal: onHide } = useCostManagement();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const caseId = getCaseId() ?? 0;
  const clientId = getClientId() ?? 0;

  const { toggleTriggerUpdate } = useUpdateTrigger();
  const [errors, setErrors] = useState(false);
  let date = "";
  if (cost?.date) {
    date = convertToHtmlDateInputValue(cost.date);
  }
  const handleDelete = useCallback(async () => {
    try {
      await api.delete(`api/delete-cost/${cost.id}/`);
      toggleTriggerUpdate();
      onHide();
    } catch (error) { }
  }, [cost.id, onHide]);
  const formik = useFormik({
    initialValues: {
      date: date ?? "",
      payee: cost?.payee ?? "",
      invoice_number: cost?.invoice_number ?? "",
      amount: cost?.amount ?? 0,
      paid_by: "Credit Card",
      memo: cost?.memo ?? "",
      category: "Cost",
    },
    validationSchema: costValidationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        amount: parseFloat(values.amount), // Ensure amount is a float if backend expects a number
      };
      const url = isEdit
        ? `api/edit-cost/${cost.id}/`
        : `api/add-cost/${clientId}/${caseId}/`;
      try {
        await api.post(url, payload);
        toggleTriggerUpdate(); // Refresh any necessary data
        formik.resetForm(); // Clear the form after successful submission
        onHide(); // Close the modal
      } catch (error) {
        console.error(
          "Error adding cost:",
          error.response ? error.response.data : error.message
        );
        setErrors(true);
      }
    },
    enableReinitialize: true,
  });


  return (
    <Modal show={isVisible} onHide={onHide} centered>
      <div style={{ width: '500px' }}>
        <Modal.Header
          style={{
            height: "25px",
            backgroundColor: "var(--primary)",
          }}
        >
          <Modal.Title
            style={{
              color: "white",
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              width: "100%",
              margin: "-10px 0px",
            }}
          >
            {isEdit ? `Edit Cost for ${client?.first_name + " " + client?.last_name} * ${currentCase?.case_type?.name}` : "Add Cost"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors ? (
            <Alert variant="danger">Error creating a cost record.</Alert>
          ) : (
            <></>
          )}
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group as={Col} className="mb-3">
              <Form.Label className="text-nowrap">
                Date Due:
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                {...formik.getFieldProps("date")}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="text-danger">{formik.errors.date}</div>
              )}
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>
                Payee:
              </Form.Label>
              <Form.Control
                type="text"
                name="payee"
                {...formik.getFieldProps("payee")}
              />
              {formik.touched.payee && formik.errors.payee && (
                <div className="text-danger">{formik.errors.payee}</div>
              )}
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>
                Invoice Number:
              </Form.Label>
              <Form.Control
                type="text"
                name="invoice_number"
                {...formik.getFieldProps("invoice_number")}
              />
              {formik.touched.invoice_number &&
                formik.errors.invoice_number && (
                  <div className="text-danger">
                    {formik.errors.invoice_number}
                  </div>
                )}
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>
                Amount:
              </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                {...formik.getFieldProps("amount")}
                isInvalid={!!formik.errors.amount && formik.touched.amount}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.amount}
              </Form.Control.Feedback>
            </Form.Group>
            {!isEdit ? (
              <Form.Group as={Col} className="mb-3">
                <Form.Label>
                  Paid By:
                </Form.Label>
                <div style={{ display: 'flex' }}>
                  <Form.Check
                    varient="none"
                    style={{
                      padding: "5px 3px",
                    }}
                    type="radio"
                    label="Credit Card"
                    name="paid_by"
                    id="creditCard"
                    value="Credit Card"
                    checked={formik.values.paid_by === "Credit Card"}
                    onChange={() =>
                      formik.setFieldValue("paid_by", "Credit Card")
                    }
                    inline
                  />
                  <Form.Check
                    varient="none"
                    style={{
                      padding: "5px 3px",
                    }}
                    type="radio"
                    label="Check"
                    name="paid_by"
                    id="check"
                    value="Check"
                    checked={formik.values.paid_by === "Check"}
                    onChange={() => formik.setFieldValue("paid_by", "Check")}
                    inline
                  />
                </div>
              </Form.Group>
            ) : (
              <></>
            )}
            <Form.Group as={Col} className="mb-3">
              <Form.Label>
                Memo:
              </Form.Label>
              <Form.Control
                type="text"
                name="memo"
                {...formik.getFieldProps("memo")}
              />
            </Form.Group>

            {!isEdit ? (
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="text-nowrap">
                  Category:
                </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="category"
                  {...formik.getFieldProps("category")}
                >
                  <option value="Cost">Cost</option>
                  <option value="Report">Report</option>
                  {/*<option value="Medical Bills">Medical Bills</option>*/}
                  {/*<option value="Medical Records">Medical Records</option>*/}
                  {/*<option value="Expert Fees">Expert Fees</option>*/}
                  {/*<option value="Court Fees">Court Fees</option>*/}
                </Form.Select>
              </Form.Group>
            ) : (
              <></>
            )}

            <div className="modal-footer d-flex justify-content-between">
              <Button
                style={{
                  marginRight: "5px",
                }}
                variant="secondary"
                onClick={() => {
                  formik.resetForm(); // Reset form fields
                  onHide(); // Close the modal
                }}
              >
                Cancel
              </Button>
              {isEdit ? (
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              ) : (
                <></>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // ...(!isEdit && { width: "100%" }),
                }}
              >

                <Button variant="primary" type="submit">
                  {isEdit ? "Save Cost" : "Add Cost"}
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default CostManagementModal;
