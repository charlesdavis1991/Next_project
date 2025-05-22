import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { getClientId, getCaseId } from "../../../Utils/helper";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";

function LitigationEditPopUp({
    showPopup,
    handleClose,
    handleSave,
    handleDelete,
    litigation_id,
    contact_id,
    current_name,
    current_note,
    current_depndt_date,
    current_To,
    current_from,
    current_start_date,
    current_start_time,
    current_end_date,
    current_end_time,
    current_meeting_url,
    current_allday,
    client_parties = [],
    other_parties = [],
    def_parties = [],
}) {
    const currentCaseId = getCaseId();
    const clientId = getClientId();
    const origin = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("token");
    const methods = useForm();
    const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
    const [loading, setLoading] = useState(false);
    const { setLitigationDataUpdated } = useContext(ClientDataContext);
    const [delLoading, setDelLoading] = useState(false);
    

    const formatDate = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toISOString().split("T")[0];
    };

    useEffect(() => {
        setValue('name', current_name);
        setValue('note', current_note);
        setValue('dep_date', formatDate(current_depndt_date));
        setValue('to', current_To);
        setValue('from', current_from);
        setValue('start_date', formatDate(current_start_date));
        setValue('start_time', current_start_time);
        setValue('end_date', formatDate(current_end_date));
        setValue('end_time', current_end_time);
        setValue('meeting_url', current_meeting_url);
        setValue('all_day', current_allday);
    }, [current_name, current_note, current_To, current_from, current_start_date, current_start_time, current_end_date, current_end_time, current_meeting_url, current_allday, current_depndt_date])

    const formatTime = (time) => {
        if (!time) return ""; 
        const timeParts = time.split(":");
    
        if (timeParts.length === 3) {
            return `${timeParts[0]}:${timeParts[1]}`;
        }
        return time; 
    };

    const onSubmit = async (data) => {
        const url = `${origin}/api/litigation-page/litigation-act/update/${litigation_id}/`;
        setLoading(true);

        const name = watch("name");
        const note = watch("note");
        const depDate = watch("dep_date");
        const to = watch("to");
        const from = watch("from");
        const start_date = watch("start_date");
        const start_time = formatTime(watch("start_time")); 
        const end_date = watch("end_date");
        const end_time = formatTime(watch("end_time"));  
        const meeting_url = watch("meeting_url");
        const AllDay = watch("all_day");

        const requestBody = {
            name: name,
            notes: note,
            dependant_date: depDate,
            from_to: from,
            to: to,
            start_date: start_date,
            start_time: start_time,
            end_date: end_date,
            end_time: end_time,
            meetingurl: meeting_url,
            is_allday: AllDay
        }

        try {
            const response = await axios.patch(url, requestBody, {
                headers: {
                    Authorization: token,
                },
            });
            setLoading(false);
            setLitigationDataUpdated(true);
            handleClose()
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const onDelete = async () => {
        const url = `${origin}/api/litigation-page/litigation-act/delete/${litigation_id}/`;
        setDelLoading(true);

        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: token,
                },
            });
            setDelLoading(false);
            setLitigationDataUpdated(true);
            handleClose()
        } catch (error) {
            console.error('Error:', error);
            setDelLoading(false);
        }
    };

    return (
        <Modal
            show={showPopup ? true : false}
            onHide={handleClose}
            centered
            dialogClassName="modal-dialog modal-lg modal-dialog-centered lit-max-width-800px"
        >
            <FormProvider {...methods}>
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h5 class="modal-title mx-auto">Edit Litigation</h5>
                    </div>
                    <div class="modal-body">
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2">
                                <p class="text-secondary">Name:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="text"
                                    name="court_title1"
                                    placeholder="Enter name"
                                    class="form-control court_title1_autocomplete"
                                    {...register("name")}
                                    defaultValue={current_name}
                                    onChange={(e) => setValue('name', e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2">
                                <p class="text-secondary">Note:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="text"
                                    name="court_title2"
                                    placeholder="Enter note"
                                    class="form-control court_title2_autocomplete"
                                    {...register("note")}
                                    defaultValue={current_note}
                                    onChange={(e) => setValue('note', e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">Dependant Date:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="date"
                                    class="form-control"
                                    {...register('dep_date')}
                                    defaultValue={formatDate(current_depndt_date)}
                                    onChange={(e) => setValue('dep_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">To:</p>
                            </div>
                            <div class="col-md-10">
                                <Form.Select
                                    {...register("to")}

                                    onChange={(e) => setValue('to', e.target.value)}
                                    className={`form-control ${errors.state && 'is-invalid'}`}
                                >   <option key="" value="">-------</option>

                                    {/* Mapping through client_parties */}
                                    {client_parties.map(client => (
                                        <option key={`Client-${client.id}`} value={`Client, ${client.id}`}>
                                            {client.first_name} {client.last_name} (Client)
                                        </option>
                                    ))}

                                    {/* Mapping through other_parties */}
                                    {other_parties.map(other => (
                                        <option key={`Other-${other.id}`} value={`Parties, ${other.id}`}>
                                            {other.party_first_name} {other.party_last_name} (Other Party)
                                        </option>
                                    ))}

                                    {/* Mapping through def_parties */}
                                    {def_parties.map(defendant => (
                                        <option key={`Defendant-${defendant.id}`} value={`Defendant, ${defendant.id}`}>
                                            {defendant.first_name} {defendant.last_name} (Defendant)
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">From:</p>
                            </div>
                            <div class="col-md-10">
                                <Form.Select
                                    {...register("from")}
                                    onChange={(e) => setValue('from', e.target.value)}
                                    className={`form-control ${errors.state && 'is-invalid'}`}
                                >   <option key="" value="">-------</option>

                                    {/* Mapping through client_parties */}
                                    {client_parties.map(client => (
                                        <option key={`Client-${client.id}`} value={`Client, ${client.id}`}>
                                            {client.first_name} {client.last_name} (Client)
                                        </option>
                                    ))}

                                    {/* Mapping through other_parties */}
                                    {other_parties.map(other => (
                                        <option key={`Other-${other.id}`} value={`Parties, ${other.id}`}>
                                            {other.party_first_name} {other.party_last_name} (Other Party)
                                        </option>
                                    ))}

                                    {/* Mapping through def_parties */}
                                    {def_parties.map(defendant => (
                                        <option key={`Defendant-${defendant.id}`} value={`Defendant, ${defendant.id}`}>
                                            {defendant.first_name} {defendant.last_name} (Defendant)
                                        </option>
                                    ))}

                                </Form.Select>
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">Start Date:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="date"
                                    class="form-control"
                                    {...register('start_date')}
                                    defaultValue={formatDate(current_start_date)}
                                    onChange={(e) => setValue('start_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">Start Time:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="time"
                                    {...register('start_time')}
                                    defaultValue={current_start_time}
                                    id="start_time_input"
                                    className="form-control" />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">End Date:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="date"
                                    class="form-control"
                                    {...register('date')}
                                    defaultValue={formatDate(current_end_date)}
                                    onChange={(e) => setValue('end_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">End Time:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="time"
                                    {...register('end_time')}
                                    defaultValue={current_end_time}
                                    id="start_time_input"
                                    className="form-control" />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">Meeting URL:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="text"
                                    {...register('meeting_url')}
                                    id="meeting_url_input"
                                    placeholder="Enter meeting url"
                                    className="form-control"
                                    defaultValue={current_meeting_url} />
                            </div>
                        </div>
                        <div class="row align-items-center mb-1">
                            <div class="col-md-2 ">
                                <p class="text-secondary">All Day:</p>
                            </div>
                            <div class="col-md-10">
                                <input
                                    type="checkbox"
                                    {...register('all_day')}
                                    className="form-control"
                                    defaultValue={current_allday}
                                    onChange={(e) => setValue('all_day', e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0" style={{dispaly:"flex", justifyContent:"space-between"}}>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onDelete}>
                            {delLoading ? 'Deleting..' : 'Delete'}
                        </button>
                        <button type="button" className="btn btn-success" onClick={onSubmit}>
                            {loading ? 'Saving..' : 'Save'}
                        </button>
                    </div>
                </div>
            </FormProvider>
        </Modal>
    );
}

export default LitigationEditPopUp;