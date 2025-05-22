import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import acceptOffer from '../../SettlementDashboard/api/acceptOffer';
import EditOfferRadioButtons from './EditOfferRadioButtons';

const CounterOfferFields = ({offer, formik,editFormik, offerAccepted, handleOfferAccepted, offerCombinations, offerTab}) => {
  
  const by = offer.by_entity_client ? `${offer.by_entity_client.first_name || ''} ${offer.by_entity_client.last_name || ''}` : 
  offer?.by_defendant?.defendantType?.name === "Private Individual" ? 
  `${offer?.by_defendant?.first_name || ''} ${offer?.by_defendant?.last_name || ''}` :
  `${offer?.by_defendant?.entity_name || ''}`;

const party = offer.entity_client ? `${offer.entity_client.first_name || ''} ${offer.entity_client.last_name || ''}` : 
  offer?.defendant?.defendantType?.name === "Private Individual" ? 
  `${offer?.defendant?.first_name || ''} ${offer?.defendant?.last_name || ''}` :
  `${offer?.defendant?.entity_name || ''}`;
  let selectByIcon = "ic-defendants";
  let selectToIcon = "ic-defendants";
  let selectBy = offerCombinations.defendant_combinations?.find(
      (comb) => offer?.by_defendant?.id === comb?.defendant?.id
  ) || offerCombinations.client_combinations?.find(
      (comb) => {
          const match = offer?.by_entity_client?.id === comb?.client?.id;
          if (match) selectByIcon = "ic-client";
          return match;
      }
  );
  let selectTo = offerCombinations.defendant_combinations?.find(
      (comb) => offer?.defendant?.id === comb?.defendant?.id
  ) || offerCombinations.client_combinations?.find(
      (comb) => {
          const match = offer?.entity_client?.id === comb?.client?.id;
          if (match) selectToIcon = "ic-client";
          return match;
      }
  );
  return (
    <>
      {/* <span className='non-visible-col'>
        To create a counter offer, please enter these relevant details:
      </span> */}
      <EditOfferRadioButtons offerTab={offerTab} formik={formik} selectBy={selectBy} selectByIcon={selectByIcon} selectTo={selectTo} selectToIcon={selectToIcon} offerCombinations={offerCombinations}/>
      <div className="m-b-5 p-l-15 p-r-15">
        <Form.Group as={Row} className="m-b-5">
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
              Counter Offer Date:
            </span>
            <div className="d-flex-1 p-r-15">
                <Form.Control
                    type="date"
                    name="date"
                    className='height-25 p-0 p-l-5 rounded-0'
                    {...formik.getFieldProps("date")}
                    style={{ appearance: "none" }}
                    onClick={(e) => e.target.showPicker()}
                    isInvalid={formik.touched.date && formik.errors.date}
                />
                <Form.Control.Feedback type="invalid">
                    {formik.errors.date}
                </Form.Control.Feedback>
            </div>
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
                    Expires:
            </span>
            <div className="d-flex-1 p-r-15">
                <Form.Control
                type="date"
                className='height-25 p-0 p-l-5 rounded-0'
                name='expiration-date'
                {...formik.getFieldProps("expiration-date")}
                style={{ appearance: "none" }}
                onClick={(e) => e.target.showPicker()}
                isInvalid={formik.touched["expiration-date"] && formik.errors["expiration-date"]}
                
                />
                <Form.Control.Feedback type="invalid">
                {formik.values["expiration-date"]}
                </Form.Control.Feedback>
            </div>
            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
            Offer Amount:
          </span>
            <div className="d-flex-1 p-r-15">
            <Form.Control
              type="text"
              name="amount"
              className="monospace-font height-25 p-0 p-l-5 rounded-0"
              value={formik.values.amount !== "" ? `$ ${formik.values.amount}` : "$ "}
              onFocus={() => {
                  formik.setFieldValue("amount", ""); // Clear only the numeric value on click
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

                  formik.setFieldValue("amount", value); // Update Formik state
              }}
              onBlur={() => {
                  if (!formik.values.amount) {
                      formik.setFieldValue("amount", ""); // Keep "$ " in place if empty
                  }
              }}
              isInvalid={formik.touched.amount && !!formik.errors.amount}
          />

                  <Form.Control.Feedback type="invalid">
                      {formik.errors.amount}
                  </Form.Control.Feedback>
            </div>
            <div class="d-flex-1">
              <div className="d-flex p-l-15 align-items-center">
                  <div className="d-flex m-l-5 checkbox-btn">
                  <Form.Check
                    type="checkbox"
                    className="mr-2"
                    label="Draft"
                    name="draft_checked_counter_offer"
                    checked={formik.values.draft_checked_counter_offer}
                    onChange={(e) => formik.setFieldValue("draft_checked_counter_offer", e.target.checked)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Final"
                      name="final_checked_counter_offer"
                      checked={formik.values.final_checked_counter_offer}
                      onChange={(e) => formik.setFieldValue("final_checked_counter_offer", e.target.checked)} 
                    />
                  </div>
              </div>
            </div>
        </Form.Group>
      </div>
      <Form.Group as={Row} className="m-b-5 p-l-15">
        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
          Accepted:
        </span>
      <div className="d-flex align-items-center m-r-15" style={{width:"135.69px"}}>
          <input
          type="checkbox"
          name="accepted"
          label=""
          className="trust-deposit"
          checked={offerAccepted}
          onChange={(e) => {
              const newVal = e.target.checked;
              if(newVal){
                  editFormik.setFieldValue("accepted_date",getCurrentDate());
              }
              else{
                editFormik.setFieldValue("accepted_date",'');
              }
              handleOfferAccepted(newVal);
              const payload = { offer_id: offer?.id,accepted: newVal ? "True" : "False"};
              acceptOffer(payload);
          }}
          />
      </div>
        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
          Accepted Date:
        </span>
      <div className="d-flex align-items-center" style={{width:"135.69px"}} >
      <Form.Control
          className='height-25 p-0 p-l-5 rounded-0'
          type="date"
          name="accepted_date"
          {...editFormik.getFieldProps("accepted_date")}
          style={{ appearance: "none" }}
          onClick={(e) => e.target.showPicker()}
          isInvalid={editFormik.touched.accepted_date && editFormik.errors.accepted_date}
          
      />
      </div>
      </Form.Group>
    {/* <Form.Group as={Row} className="m-b-5">
      <Form.Label column sm={4} className="fw-bold height-25 p-r-0 p-b-0 p-t-0 rounded-0 d-flex align-items-center">
        Offer From: {by}
      </Form.Label>
      <Col sm={2} className="d-flex align-items-center">
        <Form.Check
          type="radio"
          name="offer_by"
          label=""
          className="trust-deposit"
          // checked={formik.values.offer_by}
          // onChange={(e) =>
          //   formik.setFieldValue("offer_by", e.target.checked)
          // }
        />
      </Col>
      <Form.Label column sm={4} className="fw-bold height-25 p-r-0 p-b-0 p-t-0 rounded-0 d-flex align-items-center">
      Offer To: {party}
      </Form.Label>
      <Col sm={2} className="d-flex align-items-center">
        <Form.Check
          type="radio"
          name="offer_to"
          label=""
          className="trust-deposit"
          // checked={formik.values.offer_to}
          // onChange={(e) =>
          //   formik.setFieldValue("offer_to", e.target.checked)
          // }
        />
      </Col>
    </Form.Group> */}

</>
  )
}

export default CounterOfferFields