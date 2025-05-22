import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { Button, Form, Col, Row } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import { ClientDataContext } from '../shared/DataContext';
import { getCaseId, getClientId } from "../../../Utils/helper";

const ModalBodyEmail = forwardRef(({ current_cont_1, current_cont_2, current_cont_3, handleClose, primary_email_id }, ref) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const clientId = getClientId();
    const currentCaseId = getCaseId();
    const [checkedBox, setCheckedBox] = useState(null);
    const methods = useForm();
    const { handleSubmit, register, setValue, watch } = methods;
    const { setIsClientDataUpdated } = useContext(ClientDataContext);
    const [contact_1_id, setContact_1_id] = useState(null);
    const [contact_2_id, setContact_2_id] = useState(null);
    const [contact_3_id, setContact_3_id] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue('email1', current_cont_1.email);
        setValue('email2', current_cont_2.email);
        setValue('email3', current_cont_3.email);
        setContact_1_id(current_cont_1?.currentId);
        setContact_2_id(current_cont_2?.currentId);
        setContact_3_id(current_cont_3?.currentId);

        if (current_cont_1.currentId === primary_email_id) setCheckedBox(1);
        if (current_cont_2.currentId === primary_email_id) setCheckedBox(2);
        if (current_cont_3.currentId === primary_email_id) setCheckedBox(3);
    }, [current_cont_1, current_cont_2, current_cont_3, primary_email_id, setValue]);

    const onSubmit = async (data) => {
        const url = `${origin}/api/client/clients/${clientId}/`;
        const email1 = watch('email1');
        const email2 = watch('email2');
        const email3 = watch('email3');

        setLoading(true);
        const requestData = {
            contact_1: {
                id: contact_1_id,
                email: email1,
                primary_email: checkedBox === 1
            },
            contact_2: {
                id: contact_2_id,
                email: email2,
                primary_email: checkedBox === 2
            },
            contact_3: {
                id: contact_3_id,
                email: email3,
                primary_email: checkedBox === 3
            }
        };

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

    const handleCheckboxChange = (index) => {
        setCheckedBox(index);
        setValue('email1Prim', index === 1);
        setValue('email2Prim', index === 2);
        setValue('email3Prim', index === 3);
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit(onSubmit),
    }));

    return (
        <FormProvider {...methods}>
            <Form>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Email 1:
                                </span>
                            </div>
                            <div className="col-md-9">
                                <Form.Control
                                    type="email"
                                    placeholder='Email 1'
                                    {...register('email1')}
                                    defaultValue={current_cont_1.email}
                                    onChange={(e) => setValue('email1', e.target.value)}
                                />
                            </div>
                            <div style={{ paddingLeft: "2rem" }}>
                                <Form.Check
                                    type="checkbox"
                                    checked={checkedBox === 1}
                                    onChange={() => handleCheckboxChange(1)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Email 2:
                                </span>
                            </div>
                            <div className="col-md-9">
                                <Form.Control
                                    type="email"
                                    placeholder='Email 2'
                                    {...register('email2')}
                                    defaultValue={current_cont_2.email}
                                    onChange={(e) => setValue('email2', e.target.value)}
                                />
                            </div>
                            <div style={{ paddingLeft: "2rem" }}>
                                <Form.Check
                                    type="checkbox"
                                    checked={checkedBox === 2}
                                    onChange={() => handleCheckboxChange(2)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Email 3:
                                </span>
                            </div>
                            <div className="col-md-9">
                                <Form.Control
                                    type="email"
                                    placeholder='Email 3'
                                    {...register('email3')}
                                    defaultValue={current_cont_3.email}
                                    onChange={(e) => setValue('email3', e.target.value)}
                                />
                            </div>
                            <div style={{ paddingLeft: "2rem" }}>
                                <Form.Check
                                    type="checkbox"
                                    checked={checkedBox === 3}
                                    onChange={() => handleCheckboxChange(3)}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
        </FormProvider>
    );
})

export default ModalBodyEmail;
