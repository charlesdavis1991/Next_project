import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import { ClientDataContext } from '../shared/DataContext';

const titles = [
    {
        key: 1,
        title: 'Mr.'
    },
    {
        key: 2,
        title: 'Mrs.'
    },
    {
        key: 3,
        title: 'Ms.'
    },
    {
        key: 4,
        title: 'Miss.'
    }
]
const ModalBodyIdentify = forwardRef(({ current_title, current_birthday, current_gender, current_ssn, current_license, current_state, handleClose }, ref) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const node_env = process.env.NODE_ENV;
    const token = localStorage.getItem('token');
    const clientId = getClientId();
    const currentCaseId = getCaseId();
    const [checkedBox, setCheckedBox] = useState(null);
    const methods = useForm();
    const { handleSubmit, register, setValue, watch, formState: { errors } } = methods;
    const [states, setStates] = useState([]);
    const {isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);
    const [loading, setLoading] = useState(false);
    const [currentBirthdayAcc, setCurrentBirthdayAcc] = useState(current_birthday)
    useEffect(() => {
        // Set initial values for the form fields
        setValue('title', current_title);
        setValue('birthday', current_birthday);
        setValue('ssn', current_ssn);
        setValue('gender', current_gender);
        setValue('license', current_license);
        setValue('state', current_state);
    }, [current_title, current_birthday, current_ssn, current_gender, current_license, current_state, setValue]);

    //get states
    const getStates = async () => {
        try {
            const response = await axios.get(
                `${origin}/api/states/`,
                {
                    headers: { Authorization: token },
                }
            );
            setStates(response.data);
        } catch (error) {
            console.error("Failed to fetch client data:", error);
        }
    }

    const formatDate = (date) => {
        return date.toISOString().slice(0, 19); // Slices off the milliseconds and timezone part
    };

    const handleDateChange = (e) => {
    
        const formattedDate = formatDate(new Date(e.target.value));
        setValue('birthday', formattedDate.split('T')[0]);
        setValue('bod',e.target.value)
    };

    useEffect(() => {
       if (current_birthday){
        const date = new Date(current_birthday.split('T')[0]);
        setCurrentBirthdayAcc(date)
       }
        getStates();
    }, [])

    const onSubmit = async (data) => {
        const url = `${origin}/api/client/clients/${clientId}/`;
        
        setLoading(true);
        const birthday = watch('birthday') ? formatDate(new Date(watch('birthday'))) : null;
        const requestData = {
            ...data,
            birthday: birthday
        }


        try {
      
            const response = await axios.patch(url, requestData, {
                headers: {
                    Authorization: token,
                },
            });
            setLoading(false);
            setIsClientDataUpdated(!isClientDataUpdated)
            handleClose()
        } catch (error) {
            console.error('Error making PATCH request:', error);
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit(onSubmit),
    }));
    return (
        <FormProvider {...methods}>
            <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    Title:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Select
                                    {...register("title")}
                                    placeholder='Title'
                                    defaultValue={current_title}
                                    onChange={(e) => setValue('title', e.target.value)}
                                ><option key="" value="">------</option>
                                    {titles?.map(title => (
                                        <option key={title.key} value={title.title}>
                                            {title.title}
                                        </option>
                                    ))}

                                </Form.Select>
                            </div>
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    Birthday:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type='date'
                                    placeholder="Enter Birthday"
                                    {...register("birthday")}
                                    
                                    defaultValue={current_birthday}
                                    onChange={(e) => handleDateChange(e)}
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    SSN:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="text"
                                    {...register("ssn")}
                                    defaultValue={current_ssn}
                                    onChange={(e) => setValue('ssn', e.target.value)}
                                    placeholder='Zip#'
                                >

                                </Form.Control>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    Driver's License #:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="text"
                                    {...register("driver_license_number")}
                                    defaultValue={current_license}
                                    onChange={(e) => setValue('license', e.target.value)}
                                    placeholder='License #'
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    License State:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Select
                                    {...register('driver_license_state')}
                                    defaultValue={current_state}
                                   
                                    className={`form-control ${errors.state && 'is-invalid'}`}
                                >   <option key="" value="">-------</option>
                                    {states?.map(state => (
                                        <option key={state.id} value={state.StateAbr}>
                                            {state.name}
                                        </option>
                                    ))}

                                </Form.Select>
                            </div>
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    Gender:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="text"
                                    {...register('gender')}
                                    defaultValue={current_gender}
                                    onChange={(e) => setValue('gender', e.target.value)}
                                    placeholder='Gender'
                                >

                                </Form.Control>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-auto text-left">
                                <span className="d-inline-block text-grey">
                                    Recalculate Statute of Limitations if Birthday is changed:
                                </span>
                            </div>
                            <div>
                                <Form.Control
                                    disabled
                                    type="checkbox"
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-auto text-left">
                                <span className="d-inline-block text-grey">
                                    Delete old statute entries on case:
                                </span>
                            </div>
                            <div>
                                <Form.Control
                                    disabled
                                    type='checkbox'
                                >

                                </Form.Control>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
        </FormProvider>
    );
})

export default ModalBodyIdentify;


