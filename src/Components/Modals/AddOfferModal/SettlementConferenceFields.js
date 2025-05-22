import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import AddOfferRadioButtons from './AddOfferRadioButtons';
import { formatDate } from '../../../Utils/helper';

const SettlementConferenceFields = ({ formik, offerCombinations }) => {
  return (
    <div>
      <AddOfferRadioButtons formik={formik} offerCombinations={offerCombinations} />
      <div className="offer-form-offer-section">
          <div className="m-b-5 p-l-15 p-r-15">
              <Form.Group as={Row}>
                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 add-offer-input-label">
                      Conference Date:
                  </span>
                  <div className="d-flex-1 p-r-15">
                      <Form.Control
                          type="date"
                          name="settlement_conference_date"
                          className='height-25 rounded-0'
                          {...formik.getFieldProps("settlement_conference_date")}
                          style={{ appearance: "none" }}
                          onClick={(e) => e.target.showPicker()}
                          isInvalid={formik.touched["settlement_conference_date"] && formik.errors["settlement_conference_date"]}
                          />
                      <Form.Control.Feedback type="invalid">
                      {formik.values.settlement_conference_date}
                      </Form.Control.Feedback>
                      
                  </div>
                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 other-offer-input-label">
                          Litigation Event:
                  </span>
                  <div className="d-flex-1 p-r-15">
                      <input
                        type="checkbox"
                        className="form-control height-25 rounded-0"
                        name="settlement_conference_litigation_event"
                        id="settlement-conference-litigation-event"
                        onChange={formik.handleChange}
                        checked={formik.values.settlement_conference_litigation_event}              
                      />
                  </div>
              </Form.Group>
          </div>
          <div className="d-flex m-t-5 m-b-5 align-items-center">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 add-offer-input-label">
                  Note:
              </span>
              <div className='d-flex-1'>
                  <Form.Control 
                      type="text"
                      className='height-25 rounded-0'
                      placeholder="Add a note"
                      id="add-offer-note"
                      name="note"
                      value={formik.values.note}
                      onChange={formik.handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                      {formik.errors.note}
                  </Form.Control.Feedback>
              </div>
          </div>          
      </div>
    </div>
  );
};

export default SettlementConferenceFields;
