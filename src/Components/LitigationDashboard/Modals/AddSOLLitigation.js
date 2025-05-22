import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
//import { getCaseId, getClientId } from "../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';

function LitigationSOLForm({
    showPopup,
    handleSave,
    litigationEventMain, litigationEvents, clients, otherParties, defendants, serviceMethods
}) {
    //const currentCaseId = getCaseId();
    //const clientId = getClientId();
    const origin = process.env.REACT_APP_BACKEND_URL;
    const tokenBearer = localStorage.getItem("token");
    const methods = useForm();
    const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        // Use watch to collect form data
        const start_date = watch("start_date");
        const end_date = watch("end_date");
        const all_day_input = watch("all_day_input");
        const start_time = watch("start_time");
        const end_time = watch("end_time");
        const litigation_act_note = watch("litigation_act_note");
        const litigation_meeting_url = watch("litigation_meeting_url");
        const insurance_type = watch("insurance_type");
        const litigation_act_to = watch("litigation_act_to");
        const litigation_act_from_to = watch("litigation_act_from_to");
        const service_method = watch("service_method");
        const dependant_date = watch("dependant_date");

        const requestBody = {
            start_date: start_date,
            end_date: end_date
        }

        try {
            console.log("REQUEST BODY", requestBody)
        } catch (error) {
            console.error('Error making PATCH request:', error)
        }
    };

    return (
        <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} id={`litigation_act_form_${litigationEventMain?.id}`} className="filing_act_form overflow-hidden">
            {/* Hidden Inputs */}
            <input type="hidden" {...register('litigation_act_event_id')} defaultValue={litigationEventMain?.id} />
            <input type="hidden" {...register('litigation_act_event_type_id')} defaultValue={litigationEventMain?.event_type_id?.id} />
            <input type="hidden" {...register('date_name')} className="dependant_date_name" />

            <div className="row align-items-center row-gap">
                {/* Date Fields */}
                <div className="col-12">
                    <div className="d-flex align-items-center fields-top">
                        <div className="filed-item">
                            <div className="custom-form-field d-flex align-items-center">
                                <label htmlFor={`start_date_input_${litigationEventMain?.id}`}>Date:</label>
                                <input type="date" {...register('start_date')} id={`start_date_input_${litigationEventMain?.id}`} className="form-control" min="1000-01-01" max="9999-12-31" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Note */}
                <div className="col-md-12">
                    <div className="custom-form-field d-flex align-items-center">
                        <label htmlFor="event_note" >Statute of Limitations Note:</label>
                        <input className="form-control" type="text" {...register('litigation_act_note')} id="event_note" placeholder=""/>
                    </div>
                </div>

                {/* Litigation Event Info */}
                <div className="col-md-12">
                    <div className="d-block">
                        <p className="black-text font-weight-bold">{litigationEventMain?.event_name}</p>
                    </div>
                    <div className="d-block">
                        <p className="black-text">{litigationEventMain?.event_description}</p>
                    </div>
                    <div className="d-block">
                        <a href="javascript:void(0)" className="lit-color-093761">{litigationEventMain?.event_code}</a>
                    </div>
                </div>
            </div>
        </form>
    </FormProvider>
    );
}

export default LitigationSOLForm;
