import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import { ClientDataContext } from '../shared/DataContext';

const ModalBodyAddress1 = forwardRef(({id, current_address1, current_address2, current_state, current_city, current_zip, mailing_contact, handleClose }, ref) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const node_env = process.env.NODE_ENV;
    const token = localStorage.getItem('token');
    const clientId = getClientId();
    const currentCaseId = getCaseId();
    const [checkedBox, setCheckedBox] = useState(null);
    const methods = useForm();
    const [states, setStates] = useState([]);
    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();
    const { setIsClientDataUpdated } = useContext(ClientDataContext);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        getStates();
    }, [])

    useEffect(() => {
        // Set initial values for the form fields
        setValue('zip', current_zip);
        setValue('city', current_city);
        setValue('state', current_state);
        setValue('address1', current_address1);
        setValue('address2', current_address2);
        setValue('mailing_contact', mailing_contact);
        setValue('id', id);

    }, [current_zip, current_city, current_address1, current_address2, current_state, mailing_contact, setValue]);

    const onSubmit = async (data) => {
        const url = `${origin}/api/client/clients/${clientId}/`;
        const address1 = watch('address1'); // field names
        const address2 = watch('address2');
        const city = watch('city');
        const state = watch('state');
        const zip = watch('zip');
        const mail = watch('mailing_contact') === "" ? false : true;

        setLoading(true);
        const requestData = {
            contact_1: {
                id: id,
                ...data,
                mailing_contact: mail
            }
        }



        try {
            const response = await axios.patch(url, requestData, {
                headers: {
                    Authorization: token,
                },
            });
            setLoading(false);
            setIsClientDataUpdated(true)
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
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Address 1:
                                </span>
                            </div>
                            <div className="col-md-4">
                                <Form.Control
                                    type="text"
                                    {...register("address1")}
                                    defaultValue={current_address1}
                                    onChange={(e) => setValue('address1', e.target.value)}
                                    placeholder='Address 1'
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Address 2:
                                </span>
                            </div>
                            <div className="col-md-4">
                                <Form.Control
                                    type="text"
                                    {...register("address2")}
                                    defaultValue={current_address2}
                                    onChange={(e) => setValue('address2', e.target.value)}
                                    placeholder='Address 2'
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
                                    City:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="text"
                                    {...register("city")}
                                    defaultValue={current_city}
                                    onChange={(e) => setValue('city', e.target.value)}
                                    placeholder='City'
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    State:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Select
                                    {...register('state')}
                                    defaultValue={current_state}
                                    onChange={(e) => setValue('state', e.target.value)}
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
                                    Zip:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type="text"
                                    {...register("zip")}
                                    defaultValue={current_zip}
                                    onChange={(e) => setValue('zip', e.target.value)}
                                    placeholder='Zip#'
                                >

                                </Form.Control>
                            </div>
                        </div>
                    </Col>
                </Row>


                <Row className="mx-0 align-items-center form-group">
                    <Col md={11}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-5 text-left">
                                <span className="d-inline-block text-grey">
                                    Client wants to recieve mail here:
                                </span>
                            </div>
                            <div style={{ paddingLeft: "2rem" }}>
                                <Form.Check
                                    type="checkbox"
                                    defaultValue={mailing_contact}
                                    onChange={(e) => setValue('mailing_contact', e.target.checked)}
                                />
                            </div> 
                        </div>
                    </Col>
                </Row>
            </Form>
        </FormProvider>
    );
})

export default ModalBodyAddress1;


