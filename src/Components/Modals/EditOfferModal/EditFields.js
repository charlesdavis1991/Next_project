import React from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import acceptOffer from '../../SettlementDashboard/api/acceptOffer';
import { getCurrentDate } from '../../../Utils/helper';
import EditOfferRadioButtons from './EditOfferRadioButtons';

const EditFields = ({formik,offer, offerAccepted, handleOfferAccepted, offerCombinations, offerTab }) => {
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
            To generate a check for this offer, please enter these relevant details:
        </span> */}
        {/* <Form.Group as={Row} className="m-b-5">
            <Form.Label className='height-25 p-r-0 p-b-0 p-t-0 rounded-0' column sm={2} style={{paddingLeft:"15px"}}>
            Note
            </Form.Label>
            <Col sm={10}>
                <Form.Control
                    className='height-25 p-0 p-l-5 rounded-0'
                    type="text"
                    name="note"
                    {...formik.getFieldProps("note")}
                    isInvalid={formik.touched.note && formik.errors.note}
                />
                <Form.Control.Feedback type="invalid">
                    {formik.errors.note}
                </Form.Control.Feedback>
            </Col>
        </Form.Group> */}
        <EditOfferRadioButtons offerAccepted={offerAccepted} offerTab={offerTab} formik={formik} selectBy={selectBy}  selectByIcon={selectByIcon} selectTo={selectTo} selectToIcon={selectToIcon} offerCombinations={offerCombinations}/>
        {
            <div className="offer-form-demand-section">
                <div className="m-b-5">
                    <div className={`d-flex align-items-center`}>
                        <span className={`d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 text-end edit-offer-input-label ${offerAccepted ? "disabled-dropdown" : ""}`}>
                                Offer Date:
                        </span>
                        <div className={`d-flex align-items-center`} style={{width:"calc(100% - 179px)"}}>
                            <div class={`d-flex align-items-center ${offerAccepted ? "disabled-dropdown" : ""}`}>
                                <div className="d-flex-1 p-r-5">
                                    <Form.Control
                                        className='height-25 p-0 p-l-5 rounded-0'
                                        type="date"
                                        name="date"
                                        {...formik.getFieldProps("date")}
                                        style={{ appearance: "none" }}
                                        onClick={(e) => e.target.showPicker()}
                                        isInvalid={formik.touched["date"] && formik.errors["date"]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors["date"]}
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
                            <div class="d-flex align-items-center m-l-5">
                                <span className={`d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 ${offerAccepted ? "disabled-dropdown" : ""}`}>
                                    Amount:
                                </span>
                                <div className={`d-flex-1 p-r-5 ${offerAccepted ? "disabled-dropdown" : ""}`}>
                                    <Form.Control
                                        type="text"
                                        name="demand"
                                        className='height-25 p-0 p-l-5  rounded-0 monospace-font'
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
                                <div class={`d-flex align-items-center ${offerAccepted ? "disabled-dropdown" : ""}`}>
                                    <div class="d-flex-1">
                                        <div className="d-flex align-items-center">
                                            <div className='d-flex'>
                                                <input
                                                    type="checkbox"
                                                    name="draft_checked_demand"
                                                    checked={formik.values.draft_checked_demand === "draft"}
                                                    onChange={(e) => formik.setFieldValue("draft_checked_demand", e.target.checked ? "draft" : "")}
                                                />
                                                <span className='m-l-5 m-r-5'>Draft</span>
                                                <input
                                                    type="checkbox"
                                                    name="final_checked_demand"
                                                    checked={formik.values.final_checked_demand === "final"}
                                                    onChange={(e) => formik.setFieldValue("final_checked_demand", e.target.checked ? "final" : "")}
                                                />
                                                <span className='m-l-5 m-r-5'>Final</span>
                                            </div>
                                            {/* <div className="d-flex m-l-5 checkbox-btn">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="mr-2"
                                                    label="Draft"
                                                    name="draft_checked_demand"
                                                    checked={formik.values.draft_checked_demand === "draft"}
                                                    onChange={(e) => formik.setFieldValue("draft_checked_demand", e.target.checked ? "draft" : "")}
                                                />
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Final"
                                                    name="final_checked_demand"
                                                    checked={formik.values.final_checked_demand === "final"}
                                                    onChange={(e) => formik.setFieldValue("final_checked_demand", e.target.checked ? "final" : "")}
                                                />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                                    Accepted:
                                </span>
                                <div className="d-flex align-items-center m-r-5" >
                                    <input
                                    type="checkbox"
                                    name="accepted"
                                    label=""
                                    className="trust-deposit"
                                    checked={offerAccepted}
                                    onChange={(e) => {
                                        const newVal = e.target.checked;
                                        if(newVal){
                                            formik.setFieldValue("accepted_date",getCurrentDate());
                                        }
                                        else{
                                            formik.setFieldValue("accepted_date",'');
                                        }
                                        handleOfferAccepted(newVal);
                                        const payload = { offer_id: offer?.id,accepted: newVal ? "True" : "False"};
                                        acceptOffer(payload);
                                    }}
                                    />
                                </div>
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                                    Date:
                                </span>
                                <div className="d-flex-1" >
                                <Form.Control
                                    className='height-25 p-0 p-l-5 rounded-0'
                                    type="date"
                                    name="accepted_date"
                                    {...formik.getFieldProps("accepted_date")}
                                    style={{ appearance: "none" }}
                                    onClick={(e) => e.target.showPicker()}
                                    isInvalid={formik.touched.accepted_date && formik.errors.accepted_date}
                                    
                                />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        }

        {/* {
            offer.offer_type.name === "Offer" &&
            <div className="offer-form-offer-section">
                <div className="m-b-5 p-l-15 p-r-15">
                    <Form.Group as={Row}>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
                            Offer Date:
                        </span>
                        <div className="d-flex-1 p-r-15">
                            <Form.Control
                            type="date"
                            className='height-25 p-0 p-l-5 rounded-0'
                            {...formik.getFieldProps("date")}
                            style={{ appearance: "none" }}
                            onClick={(e) => e.target.showPicker()}
                            isInvalid={formik.touched.date && formik.errors.date}
                            
                            />
                            <Form.Control.Feedback type="invalid">
                            {formik.values.date}
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
                                        name="draft_checked_offer"
                                        checked={formik.values.draft_checked_offer === "draft"} 
                                        onChange={(e) => formik.setFieldValue("draft_checked_offer", e.target.checked ? "draft" : "")}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Final"
                                        name="final_checked_offer"
                                        checked={formik.values.final_checked_offer === "final"} 
                                        onChange={(e) => formik.setFieldValue("final_checked_offer", e.target.checked ? "final" : "")}
                                    />
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                </div>
            </div>
        }

        {
            offer.offer_type.name === "Mediation" && 
            <div className="offer-form-mediation-section">
                <div className="m-b-5 p-l-15 p-r-15">
                    <Form.Group as={Row}>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
                            Mediation Date:
                        </span>                       
                        <div className="d-flex-1 p-r-15">
                            <Form.Control
                            type="date"
                            className='height-25 p-0 p-l-5 rounded-0'
                            name="mediation_date"
                            onClick={(e) => e.target.showPicker()}
                            value={formik.values["mediation-date"]}
                            onChange={formik.handleChange}
                            isInvalid={formik.touched["mediation-date"] && !!formik.errors["mediation-date"]}
                            />
                            <Form.Control.Feedback type="invalid">
                            {formik.errors["mediation-date"]}
                            </Form.Control.Feedback>
                        </div>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label non-visible-col">
                            Expires:
                        </span>
                        <div className="d-flex-1 p-r-15 non-visible-col">
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
                            Litigation Event:
                        </span>
                        <div className="d-flex-1 p-r-15 height-25">
                            <input
                                type="checkbox"
                                className="form-control"
                                name="litigation_event_3"
                                id="litigation_event_3"
                                onChange={formik.handleChange}
                                checked={formik.values.litigation_event_3}
                            />
                        </div>
                        <div class="d-flex-1 non-visible-col">
                            <div className="d-flex p-l-15 align-items-center">
                                <div className="d-flex m-l-5 checkbox-btn">
                                    <Form.Check
                                        type="checkbox"
                                        className="mr-2"
                                        label="Draft"
                                        name="draft_checked_offer"
                                        checked={formik.values.draft_checked_offer === "draft"} 
                                        onChange={(e) => formik.setFieldValue("draft_checked_offer", e.target.checked ? "draft" : "")}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Final"
                                        name="final_checked_offer"
                                        checked={formik.values.final_checked_offer === "final"} 
                                        onChange={(e) => formik.setFieldValue("final_checked_offer", e.target.checked ? "final" : "")}
                                    />
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                </div>
            </div>
        }

        {
            offer.offer_type.name === "Settlement Conference" && 
            <div className="offer-form-settlement-conference-section">
                <div className="m-b-5 p-l-15 p-r-15">
                    <Form.Group as={Row}>
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label">
                            Conference Date:
                        </span>  
                        <div className="d-flex-1 p-r-15">
                            <Form.Control
                            type="date"
                            className='height-25 p-0 p-l-5 rounded-0'
                            name="settlement-conference-date"
                            onClick={(e) => e.target.showPicker()}
                            value={formik.values["settlement-conference-date"]}
                            onChange={formik.handleChange}
                            isInvalid={formik.touched["settlement-conference-date"] && !!formik.errors["settlement-conference-date"]}
                            />
                            <Form.Control.Feedback type="invalid">
                            {formik.errors["settlement-conference-date"]}
                            </Form.Control.Feedback>
                        </div> 
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 offer-input-label non-visible-col">
                            Expires:
                        </span>
                        <div className="d-flex-1 p-r-15 non-visible-col">
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
                            Litigation Event:
                        </span>
                        <div className="d-flex-1 p-r-15 height-25">
                            <input
                                type="checkbox"
                                className="form-control"
                                name="litigation_event_4"
                                id="litigation_event_4"
                                onChange={formik.handleChange}
                                checked={formik.values.litigation_event_4}
                            />
                        </div>
                        <div class="d-flex-1 non-visible-col">
                            <div className="d-flex p-l-15 align-items-center">
                                <div className="d-flex m-l-5 checkbox-btn">
                                    <Form.Check
                                        type="checkbox"
                                        className="mr-2"
                                        label="Draft"
                                        name="draft_checked_offer"
                                        checked={formik.values.draft_checked_offer === "draft"} 
                                        onChange={(e) => formik.setFieldValue("draft_checked_offer", e.target.checked ? "draft" : "")}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Final"
                                        name="final_checked_offer"
                                        checked={formik.values.final_checked_offer === "final"} 
                                        onChange={(e) => formik.setFieldValue("final_checked_offer", e.target.checked ? "final" : "")}
                                    />
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                </div>
            </div>
        } */}

        {/* <Form.Group as={Row} className="m-b-5 p-l-15">

        </Form.Group> */}
        
    </>
    )
}

export default EditFields