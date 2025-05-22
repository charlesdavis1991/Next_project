import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import { ClientDataContext } from '../shared/DataContext';

const ModalBodyEmergencyInfo = forwardRef(({ current_relation, current_discusCase, current_phone, current_email, handleClose }, ref) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const node_env = process.env.NODE_ENV;
    const token = localStorage.getItem('token');
    const clientId = getClientId();
    const currentCaseId = getCaseId();
    const [checkedBox, setCheckedBox] = useState(null);
    const methods = useForm();
    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();
    const { setIsClientDataUpdated } = useContext(ClientDataContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Set initial values for the form fields
        setValue('relation', current_relation);
        setValue('phone', current_phone);
        setValue('email', current_email);
        setValue('discussCase', current_discusCase);

    }, [current_relation, current_phone, current_email, current_discusCase, setValue]);

    const onSubmit = async (data) => {
        const url = `${origin}/api/client/clients/${clientId}/`;
        const relation = watch('relation'); // field names
        const phone = watch('phone');
        const email = watch('email');
        const discuss = Boolean(watch('discussCase'))

        setLoading(true);
        const requestData = {
            emergency_contact: {
                relationship: relation,
                discussCase: discuss,
                contact: {
                    phone_number: phone,
                    email: email
                }
            }
        }

        try {
            const response = await axios.patch(url, requestData, {
                headers: {
                    Authorization: token,
                },
            });
            setLoading(false);
            setIsClientDataUpdated(true);
            handleClose();
        } catch (error) {
            console.error('Error making PATCH request:', error);
            setLoading(false);
        }
    };

    const handlePhoneInput = (e, name) => {
        let phoneNumber = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        
        // Enforce max 10 digits
        if (phoneNumber.length > 10) phoneNumber = phoneNumber.slice(0, 10);
    
        // Apply formatting for (123) 456-7890
        if (phoneNumber.length > 6) {
            phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
        } else if (phoneNumber.length > 3) {
            phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        } else if (phoneNumber.length > 0) {
            phoneNumber = `(${phoneNumber}`;
        }
    
        setValue(name, phoneNumber); // Update the field with the formatted value
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
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Relationship:
                                </span>
                            </div>
                            <div className="col-md-10">
                                <Form.Control
                                    type="text"
                                    {...register("relation")}
                                    placeholder='Relation'
                                    defaultValue={current_relation}
                                    onChange={(e) => setValue('relation', e.target.value)}
                                >

                                </Form.Control>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Discuss Case:
                                </span>
                            </div>
                            <div>
                                <Form.Control
                                    type="checkbox"
                                    {...register("discussCase")}
                                    defaultValue={current_discusCase}
                                    onChange={(e) => setValue('discussCase', e.target.checked)}
                                >

                                </Form.Control>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Phone:
                                </span>
                            </div>
                            <div className="col-md-4">
                                <Form.Control
                                    type="text"
                                    {...register('phone')}
                                    defaultValue={current_phone}
                                    onChange={(e) => handlePhoneInput(e, 'phone')}
                                    maxLength={14} // Allows for the formatted string with symbols
                                    pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Email:
                                </span>
                            </div>
                            <div className="col-md-4">
                                <Form.Control
                                    type="email"
                                    {...register('email')}
                                    defaultValue={current_email}
                                    onChange={(e) => setValue('email', e.target.value)}
                                    placeholder='Email'
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

export default ModalBodyEmergencyInfo;


