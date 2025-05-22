import React from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import acceptOffer from "../../SettlementDashboard/api/acceptOffer";
import generateCheckOffer from "../../SettlementDashboard/api/generateCheckOffer";
import { getCaseId, getClientId } from "../../../Utils/helper";

const GenerateCheckFields = ({ formik, offer, updateOffersState, handleCurrentOffer, handleOfferChecks, handleDisableSaveBtn }) => {
  return (
    <>
      {/* Row 1: Check Amount and Mark To */}
      <div className="d-flex align-items-center">
        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 generate-check-input-label text-end">
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
      </div>

      {/* Row 2: Check Date and Check Number */}
      <div className="d-flex align-items-center m-t-5">
        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 generate-check-input-label text-end">
          Check Date:
        </span>
        <div className="d-flex-1 m-r-5">
          <Form.Control
            className='height-25 p-0 p-l-5 rounded-0'
            type="date"
            name="check_date"
            {...formik.getFieldProps("check_date")}
            style={{ appearance: "none" }}
            onClick={(e) => e.target.showPicker()}
            isInvalid={formik.touched.check_date && formik.errors.check_date}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.check_date}
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
      </div>
      <div className="d-flex align-items-center m-t-5">
        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 generate-check-input-label text-end">
          Mark Deposit:
        </span>
        <div className="d-flex-1">
          <div class="d-flex align-items-center">
            <input
              type="checkbox"
              name="mark_deposit"
              checked={formik.values.mark_deposit === "on"}
              onChange={(e) =>
                  formik.setFieldValue("mark_deposit", e.target.checked ? "on" : "off")
              }
            />
          </div>
        </div>
      </div>
      <div className="p-l-0 d-flex align-items-center justify-content-center m-b-5">
          <div className="d-flex justify-content-center">
            <Button variant="success" onClick={async ()=>{
                    if(!acceptOffer){
                      setShowAlert(true);
                      setAlertMessage("You can only add checks against accepted offers.");
                      return;
                  }         
                  const payload = {
                      case_id: parseInt(getCaseId()),
                      client_id: parseInt(getClientId()),
                      linked_offer_for_check: offer?.id,
                      mark_deposit: formik.values.mark_deposit,
                      check_amount: parseFloat(formik.values.check_amount),
                      payee: formik.values.payee,
                      check_number: formik.values.check_number,
                      check_date: formik.values.check_date
                  }
                  const res = await generateCheckOffer(payload)
                  updateOffersState();
                  handleCurrentOffer();
                  handleOfferChecks(offer?.id);
                  formik.setFieldValue("check_amount","");
                  formik.resetForm();
                  handleDisableSaveBtn(false);
            }} 
              className="height-25 add-check-btn" style={{padding:"0px 12px"}} disabled={!offer || formik.values.check_amount==""}>
                  Add Check
              </Button>
          </div>
      </div>
        </>
  );
};

export default GenerateCheckFields;
