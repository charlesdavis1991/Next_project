import React, {  useState } from "react";
import { Button, Form, Modal, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { formatToYYYYMMDD, getCaseId, getClientId } from "../../Utils/helper";
import api, { api_without_cancellation } from "../../api/api";
import makeDeposit from "../SettlementDashboard/api/makeDeposit";
import EditOfferPopUpHistory from "./EditOfferModal/EditOfferPopUpHistory";


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

const EditSettlementTrustLedgerCheckPopup = ({
    isVisible,
    onHide,
    check,
    setCurrentCheck,
    fetchAccountsData,
    offer,
    checks
    }) => {
    
    const origin =
        process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    // const currentCase = useSelector((state) => state?.caseData?.current);
    // const client = useSelector((state) => state?.client?.current);
    // const caseId = getCaseId() ?? 0;
    // const clientId = getClientId() ?? 0;
    const [settlementChecks,setChecks] = useState(checks?.length > 0 ? checks : [])
    // const [errors, setErrors] = useState(false);
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
            setChecks(prev => prev.filter(c => c.id !== check?.id));
            setCurrentCheck({});
            formik.resetForm();
        }
        } catch (error) {
        console.log("Failed to fetch Litigation Data:", error);
        }
    };
    const formik = useFormik({
        initialValues: {
            mark_deposit: check?.deposit ? "on" : "off",
            check_amount: check?.amount || 0.00,
            payee: check?.payee || "",
            check_number: check?.cheque_number || "",
            cheque_date:formatToYYYYMMDD(check?.cheque_date),
            date_requested:check?.date_check_requested
            
        },
        // validationSchema: accountsValidationSchema,
        onSubmit: async (values) => {
        const payload = {
            check_id: check.id,
            date_requested: formatDateFromString(formik.values.date_requested), 
            due_date: "",
            date_cleared: "",
            payee: formik.values.payee, 
            amount: formik.values.check_amount,
            memo: formik.values.memo, 
            cheque_date: formatDateFromString3(formik.values.cheque_date),
            cheque_number: formik.values.check_number,
            mark_deposit:formik.values.mark_deposit
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


    return (
        // <Modal show={isVisible} onHide={onHide} centered size={isEdit ? 'md' : 'lg'}>
        <Modal
        show={isVisible}
        onHide={onHide}
        centered
        size="lg"
        dialogClassName="custom-edit-offer-dialog justify-content-center "
        >
        <div>
            <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Settlement Check</div></div>
            <Modal.Body style={{ width: "100%", background: "white",padding:"5px" }}>
            <div className='m-t-15 m-b-15 side-padding-100'>
                <span className='d-block text-center text-primary font-weight-600'>Select the Settlement Check you wish to edit by clicking on the entry below.</span>
                <span className='d-block text-center text-primary font-weight-600'>By default the Settlement Check that was click is displayed in the edit fields.</span>
            </div>
            <Form onSubmit={formik.handleSubmit}>

                <div className={`dropdown-container d-flex align-items-center`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end by-label" >
                        By:
                    </span>
                    <div className="d-flex align-items-center height-25 rounded-0" style={{ padding: "0px",border:"none" }}>
                        {offer && <i className={`ic ic-19 m-r-5 ${offer.by_entity_client ? "ic-client" : "ic-defendants"}`}></i>}
                        <span className='text-grey font-weight-semibold' style={{padding:!offer ? "5px 10px" : ""}}>
                            {
                            offer.by_entity_client ? `${offer.by_entity_client.first_name || ''} ${offer.by_entity_client.last_name || ''}` : 
                            offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
                            `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
                            `${offer?.by_defendant?.entity_name || ''}`
                            }
                        </span>
                    </div>
                </div>
                <div className={`d-flex align-items-center ${!check ? "disabled-dropdown" : ""}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Check Amount:
                    </span>
                    <div className="d-flex-1 m-r-5">
                    <Form.Control
                        type="text"
                        name="check_amount"
                        className="monospace-font height-25 p-0 p-l-5 rounded-0"
                        value={formik.values.check_amount !== "" ? `$ ${formik.values.check_amount}` : "$ "}
                        onFocus={() => {
                            formik.setFieldValue("check_amount", ""); // Clear only the numeric value on click
                        }}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                            // Ensure only one decimal point
                            if ((value.match(/\./g) || []).length > 1) {
                                value = value.substring(0, value.lastIndexOf("."));
                            }

                            // Restrict to 2 decimal places
                            if (value.includes(".")) {
                                let parts = value.split(".");
                                if (parts[1].length > 2) {
                                    parts[1] = parts[1].substring(0, 2);
                                }
                                value = parts.join(".");
                            }

                            formik.setFieldValue("check_amount", value); // Update Formik state
                        }}
                        // onBlur={() => {
                        //     if (!formik.values.check_amount) {
                        //         formik.setFieldValue("check_amount", "0.00"); // Keep "$ " in place if empty
                        //     }
                        // }}
                        isInvalid={formik.touched.check_amount && !!formik.errors.check_amount}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.check_amount}
                    </Form.Control.Feedback>
                    </div>

                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Payee:
                    </span>
                    <div className="d-flex-1">
                    <Form.Control
                        type="text"
                        className='height-25 p-0 p-l-5 rounded-0'
                        name="payee"
                        {...formik.getFieldProps("payee")}
                        isInvalid={formik.touched.payee && formik.errors.payee}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.payee}
                    </Form.Control.Feedback>
                    </div>

                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 m-l-5 text-end">
                        Check Date:
                    </span>
                    <div className="d-flex-1 m-r-5">
                    <Form.Control
                        className='height-25 p-0 p-l-5 rounded-0'
                        type="date"
                        name="cheque_date"
                        {...formik.getFieldProps("cheque_date")}
                        style={{ appearance: "none" }}
                        onClick={(e) => e.target.showPicker()}
                        isInvalid={formik.touched.cheque_date && formik.errors.cheque_date}
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.cheque_date}
                    </Form.Control.Feedback>
                    </div>

                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end">
                    Check Number:
                    </span>
                    <div className="d-flex-1">
                    <Form.Control
                        type="number"
                        className='height-25 p-0 p-l-5 rounded-0'
                        name="check_number"
                        {...formik.getFieldProps("check_number")}
                        isInvalid={
                        formik.touched.check_number && formik.errors.check_number
                        }
                    />
                    <Form.Control.Feedback type="invalid">
                        {formik.errors.check_number}
                    </Form.Control.Feedback>
                    </div>

                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 m-l-5 text-end">
                    Trust Deposit:
                    </span>
                    <div className="">
                    <div class="d-flex align-items-center">
                        <input
                            type="checkbox"
                            name="mark_deposit"
                            checked={formik.values.mark_deposit === "on"}
                            onChange={(e) =>{
                              const newVal = e.target.checked;
                              const payload = {
                                  check_id: check?.id,
                                  mark_deposit: newVal ? "True" : "False"
                              }
                              formik.setFieldValue("mark_deposit", newVal ? "on" : "off")
                              makeDeposit(payload);
                              fetchAccountsData();
                            }
                                
                            }
                        />
                    </div>
                    </div>

                </div>
                <div className="d-flex justify-content-between m-t-5 m-b-5 p-0">
                    <Button variant="danger" disabled={!check?.id} className="height-25" style={{padding:"0px 12px"}} onClick={handleDelete}>
                        Delete this Settlement Check
                    </Button>
                </div>
                <EditOfferPopUpHistory offer={offer} checks={settlementChecks} setCurrentCheck={setCurrentCheck} check={check} />
                <div className="d-flex justify-content-between m-t-5 p-0">
                <Button
                    style={{padding:"0px 12px"}}
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancel
                </Button>


                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // ...(!isEdit && { width: "100%" }),
                    }}
                >
                    <Button variant="success" disabled={!check} className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}} type="submit">
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

export default EditSettlementTrustLedgerCheckPopup;
