import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Button, Form, Col, Row } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import { ClientDataContext } from '../shared/DataContext';
import './../../../../public/BP_resources/css/client-4.css';

const ClientNameModalBody = forwardRef(({ current_first_name, current_middle_name, current_last_name, handleClose }, ref) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const clientId = getClientId();
    const methods = useForm();
    const { reset, handleSubmit, register, setValue } = methods;
    const { setIsClientDataUpdated } = useContext(ClientDataContext);
    const [loading, setLoading] = useState(false);

    // Helper function to capitalize the first letter of a string
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        setValue('first_name', current_first_name);
        setValue('middle_name', current_middle_name);
        setValue('last_name', current_last_name);
    }, [current_first_name, current_middle_name, current_last_name, setValue]);

    const onSubmit = async (data) => {
        // Capitalize each name
        const requestData = {
            first_name: capitalize(data.first_name),
            middle_name: capitalize(data.middle_name),
            last_name: capitalize(data.last_name)
        };

        const url = `${origin}/api/client/clients/${clientId}/`;
        setLoading(true);

        try {
            await axios.patch(url, requestData, {
                headers: { Authorization: token },
            });
            setLoading(false);
            setIsClientDataUpdated(true);
            handleClose();
        } catch (error) {
            console.error('Error:', error);
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
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">First Name:</span>
                            </div>
                            <div className="col-md-10">
                                <Form.Control
                                    type="text"
                                    placeholder='Enter First Name'
                                    {...register('first_name')}
                                    defaultValue={current_first_name}
                                    onChange={(e) => setValue('first_name', e.target.value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">Middle Name:</span>
                            </div>
                            <div className="col-md-10">
                                <Form.Control
                                    type="text"
                                    placeholder='Enter Middle Name'
                                    {...register('middle_name')}
                                    defaultValue={current_middle_name}
                                    onChange={(e) => setValue('middle_name', e.target.value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">Last Name:</span>
                            </div>
                            <div className="col-md-10">
                                <Form.Control
                                    type="text"
                                    placeholder='Enter Last Name'
                                    {...register('last_name')}
                                    defaultValue={current_last_name}
                                    onChange={(e) => setValue('last_name', e.target.value)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
        </FormProvider>
    );
});

export default ClientNameModalBody;
