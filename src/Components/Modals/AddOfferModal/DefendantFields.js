import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import AddOfferRadioButtons from './AddOfferRadioButtons';

const DefendantFields = ({ formik, offerCombinations,combination }) => {
    return (
        <div>
            <AddOfferRadioButtons formik={formik} offerCombinations={offerCombinations} combination={combination} />
            <div className={`offer-form-offer-section}`}>
                <div className="m-b-5">
                    <div className={`d-flex align-items-center ${combination ? "" : "disabled-dropdown"}`}>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 add-offer-input-label text-end">
                            Date:
                        </span>
                        <div className={`d-flex align-items-center ${combination ? "" : "disabled-dropdown"}`} style={{width:"calc(100% - 179px)"}}>
                            <div class="d-flex align-items-center w-50">
                                <div className="d-flex-1 p-r-5" >
                                    <Form.Control
                                        type="date"
                                        name="date-sent"
                                        className='height-25 rounded-0'
                                        {...formik.getFieldProps("date-sent")}
                                        style={{ appearance: "none" }}
                                        onClick={(e) => e.target.showPicker()}
                                        isInvalid={formik.touched["date-sent"] && formik.errors["date-sent"]}
                                        />
                                    <Form.Control.Feedback type="invalid">
                                    {formik.values["date-sent"]}
                                    </Form.Control.Feedback>
                            
                                </div>
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                                        Expires:
                                </span>
                                <div className="d-flex-1">
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
                            </div>
                            
                            <div class={`d-flex align-items-center w-50 m-l-5`}>
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                                        Amount:
                                </span>
                                <div className="d-flex-1 p-r-5">
                                <Form.Control
                                    type="text"
                                    name="demand"
                                    className="monospace-font height-25 p-0 p-l-5 rounded-0"
                                    value={formik.values.demand !== "" ? `$ ${formik.values.demand}` : "$ "}
                                    onFocus={() => {
                                        formik.setFieldValue("demand", ""); // Clear only the numeric value on click
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
                                        formik.setFieldValue("demand", value); // Update Formik state
                                    }}
                                    onBlur={() => {
                                        if (!formik.values.demand) {
                                            formik.setFieldValue("demand", ""); // Keep "$ " in place if empty
                                        }
                                    }}
                                    isInvalid={formik.touched.demand && !!formik.errors.demand}
                                />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.demand}
                                    </Form.Control.Feedback>
                                </div>
                                <div class={`d-flex align-items-center`}>
                                    <div class="d-flex-1">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex">
                                                <input
                                                    type="checkbox"
                                                    name="demand_draft"
                                                    checked={formik.values.demand_draft === "draft"}
                                                    onChange={(e) => formik.setFieldValue("demand_draft", e.target.checked ? "draft" : "")}
                                                />
                                                <span className='m-l-5 m-r-5'>Draft</span>
                                                <input
                                                    type="checkbox"
                                                    name="demand_final"
                                                    checked={formik.values.demand_final === "final"}
                                                    onChange={(e) => formik.setFieldValue("demand_final", e.target.checked ? "final" : "")}
                                                />
                                                <span className='m-l-5 m-r-5'>Final</span>

                                                {/* <Form.Check
                                                    type="checkbox"
                                                    className="mr-2"
                                                    label="Draft"
                                                    name="demand_draft"
                                                    checked={formik.values.demand_draft === "draft"}
                                                    onChange={(e) => formik.setFieldValue("demand_draft", e.target.checked ? "draft" : "")}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Final"
                                                    name="demand_final"
                                                    checked={formik.values.demand_final === "final"}
                                                    onChange={(e) => formik.setFieldValue("demand_final", e.target.checked ? "final" : "")}
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`d-flex m-t-5 m-b-5 align-items-center ${combination ? "" : "disabled-dropdown"}`}>
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 add-offer-input-label text-end">
                        Note:
                    </span>
                    <div className='d-flex-1 text-grey font-weight-600'>
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

export default DefendantFields;
