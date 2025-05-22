import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
//import { getCaseId, getClientId } from "../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';

function LitigationExamForm({
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
                                    <label htmlFor={`start_date_input_${litigationEventMain?.id}`}>Start Date:</label>
                                    <input type="date" {...register('start_date')} id={`start_date_input_${litigationEventMain?.id}`} className="form-control" min="1000-01-01" max="9999-12-31" />
                                </div>
                            </div>

                            <div className="filed-item">
                                <div className="custom-form-field d-flex align-items-center">
                                    <label htmlFor="end_date_input">End Date:</label>
                                    <input type="date" {...register('end_date')} id="end_date_input" className="form-control" min="1000-01-01" max="9999-12-31" />
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className="filed-label">
                                <div className="custom-form-field d-flex align-items-center">
                                    <label htmlFor="all_day_input">All Day:</label>
                                    <input type="checkbox" {...register('all_day_input')} id="all_day_input" className="radioCSS" />
                                </div>
                            </div>

                            {/* Time Fields */}
                            <div className="filed-item">
                                <div className="custom-form-field d-flex align-items-center">
                                    <label htmlFor="start_time_input" className="col-md-5 p-0 m-0">Start Time:</label>
                                    <input type="time" {...register('start_time')} id="start_time_input" className="form-control" />
                                </div>
                            </div>

                            <div className="filed-item">
                                <div className="custom-form-field d-flex align-items-center">
                                    <label htmlFor="end_time_input" className="col-md-5 p-0 m-0">End Time:</label>
                                    <input type="time" {...register('end_time')} id="end_time_input" className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Note */}
                    <div className="col-md-12">
                        <div className="custom-form-field d-flex align-items-center">
                            <label htmlFor="event_note">Event note:</label>
                            <input type="text" {...register('litigation_act_note')} id="event_note" placeholder="" className="form-control" />
                        </div>
                    </div>

                    {/* Meeting URL */}
                    <div className="col-md-12">
                        <div className="custom-form-field d-flex align-items-center">
                            <label htmlFor="meeting_url_input">Meeting:</label>
                            <input type="text" {...register('litigation_meeting_url')} id="meeting_url_input" placeholder="" className="form-control" />
                        </div>
                    </div>

                    {/* New Filing Select */}
                    <div className="col-md-6">
                        <div className="custom-form-field d-flex align-items-center">
                            <label htmlFor="event_select">Exam Type:</label>
                            <select {...register('insurance_type')} id="event_select" className="form-control">
                                {litigationEvents?.map((litigationEvent, index) => (
                                    <option key={index} value={litigationEvent.id}>
                                        {litigationEvent?.event_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="custom-form-field d-flex align-items-center">
                        <label htmlFor="litigation_act_to">To:</label>
                        <select {...register('litigation_act_to')} id="litigation_act_to" className="form-control">
                            <option key="" value="">-------</option>
                            {clients?.map(client => (
                                <option key={client?.id} value={`Client, ${client?.id}`}>{client?.first_name} {client?.last_name} (Client)</option>
                            ))}
                            {otherParties?.map(other => (
                                <option key={other?.id} value={`Parties, ${other?.id}`}>{other?.first_name} {other?.last_name} (Other Party)</option>
                            ))}
                            {defendants?.map(defendant => (
                                <option key={defendant?.id} value={`Defendant, ${defendant?.id}`}>{defendant?.first_name} {defendant?.last_name} (Defendant)</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Litigation Act To Select */}
                <div className="col-md-6">
                    <div className="custom-form-field d-flex align-items-center">
                        <label htmlFor="litigation_act_to">To:</label>
                        <select {...register('litigation_act_to')} id="litigation_act_to" className="form-control">
                            <option key="" value="">-------</option>
                            {clients?.map(client => (
                                <option key={client?.id} value={`Client, ${client?.id}`}>{client?.first_name} {client?.last_name} (Client)</option>
                            ))}
                            {otherParties?.map(other => (
                                <option key={other?.id} value={`Parties, ${other?.id}`}>{other?.first_name} {other?.last_name} (Other Party)</option>
                            ))}
                            {defendants?.map(defendant => (
                                <option key={defendant?.id} value={`Defendant, ${defendant?.id}`}>{defendant?.first_name} {defendant?.last_name} (Defendant)</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="custom-form-field d-flex align-items-center">
                        <label htmlFor="litigation_act_to">From:</label>
                        <select {...register('litigation_act_to')} id="litigation_act_to" className="form-control">
                            <option key="" value="">-------</option>
                            {clients?.map(client => (
                                <option key={client?.id} value={`Client, ${client?.id}`}>{client?.first_name} {client?.last_name} (Client)</option>
                            ))}
                            {otherParties?.map(other => (
                                <option key={other?.id} value={`Parties, ${other?.id}`}>{other?.first_name} {other?.last_name} (Other Party)</option>
                            ))}
                            {defendants?.map(defendant => (
                                <option key={defendant?.id} value={`Defendant, ${defendant?.id}`}>{defendant?.first_name} {defendant?.last_name} (Defendant)</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dependent Date */}
                <div className="col-md-6">
                    <div className="custom-form-field d-flex align-items-center">
                        <label htmlFor="dependant_date_input">Dependent Date:</label>
                        <input type="date" {...register('dependant_date')} id="dependant_date_input" className="form-control" min="1000-01-01" max="9999-12-31" />
                    </div>
                </div>

                <div className="col-md-6">
                    {litigationEventMain?.map((calDate, index) => (
                        <div key={index} className="litigation-row d-flex">
                            <p className="black-text">{calDate.calculated_date_name} </p>
                            <p className="gray-label ml-2 mr-1">Due</p>
                            <p className="black-text">
                                {calDate.day_count} {calDate.day_count_type} days before
                            </p>
                        </div>
                    ))}
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
        </FormProvider >
    );
}

export default LitigationExamForm;
