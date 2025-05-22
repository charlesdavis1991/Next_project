import React, { useState, useContext, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import { ClientDataContext } from '../shared/DataContext';
import { getCaseId, getClientId } from "../../../Utils/helper";

const ModalBody = forwardRef(({ current_cont_1, current_cont_2, current_cont_3, handleClose, primary_phone_id }, ref) => {
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
        setValue('phone1', current_cont_1.phone_number);
        setValue('phone2', current_cont_2.phone_number);
        setValue('phone3', current_cont_3.phone_number);
        setContact_1_id(current_cont_1?.currentId);
        setContact_2_id(current_cont_2?.currentId);
        setContact_3_id(current_cont_3?.currentId);

        if (current_cont_1.currentId === primary_phone_id) setCheckedBox(1);
        if (current_cont_2.currentId === primary_phone_id) setCheckedBox(2);
        if (current_cont_3.currentId === primary_phone_id) setCheckedBox(3);
    }, [current_cont_1, current_cont_2, current_cont_3, setValue]);

    const onSubmit = async (data) => {
        const url = `${origin}/api/client/clients/${clientId}/`;

        setLoading(true);
        const requestData = {
            contact_1: {
                id: contact_1_id,
                phone_number: watch('phone1'),
                primary_phone: checkedBox === 1
            },
            contact_2: {
                id: contact_2_id,
                phone_number: watch('phone2'),
                primary_phone: checkedBox === 2
            },
            contact_3: {
                id: contact_3_id,
                phone_number: watch('phone3'),
                primary_phone: checkedBox === 3
            }
        };

        try {
            const response = await axios.patch(url, requestData, {
                headers: {
                    Authorization: token,
                },
            });
            const responseData = response.data;
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
        setValue('phone1Prim', index === 1);
        setValue('phone2Prim', index === 2);
        setValue('phone3Prim', index === 3);
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit(onSubmit),
    }));

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

    return (
        <FormProvider {...methods}>
            <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
                <Row className="mx-0 align-items-center form-group">
                    <Col md={12}>
                        <div className="row align-items-center form-group">
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Phone 1:
                                </span>
                            </div>
                            <div className="col-md-6">
                                <Form.Control
                                    type="text"
                                    placeholder='Phone 1'
                                    {...register('phone1')}
                                    defaultValue={current_cont_1.phone_number}
                                    onInput={(e) => handlePhoneInput(e, 'phone1')}
                                    maxLength={14} // Allows for the formatted string with symbols
                                    pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                                />
                            </div>
                            <div style={{ paddingLeft: '2rem' }}>
                                <Form.Check
                                    type="checkbox"
                                    {...register('phone1Prim')}
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
                                    Phone 2:
                                </span>
                            </div>
                            <div className="col-md-6">
                                <Form.Control
                                    type="text"
                                    placeholder='Phone 2'
                                    {...register('phone2')}
                                    defaultValue={current_cont_2.phone_number}
                                    onInput={(e) => handlePhoneInput(e, 'phone2')}
                                    maxLength={14} // Allows for the formatted string with symbols
                                    pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                                />
                            </div>
                            <div style={{ paddingLeft: '2rem' }}>
                                <Form.Check
                                    type="checkbox"
                                    {...register('phone2Prim')}
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
                                    Phone 3:
                                </span>
                            </div>
                            <div className="col-md-6">
                                <Form.Control
                                    type="text"
                                    placeholder='Phone 3'
                                    {...register('phone3')}
                                    defaultValue={current_cont_3.phone_number}
                                    onInput={(e) => handlePhoneInput(e, 'phone3')}
                                    maxLength={14} // Allows for the formatted string with symbols
                                    pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                                />
                            </div>
                            <div style={{ paddingLeft: '2rem' }}>
                                <Form.Check
                                    type="checkbox"
                                    {...register('phone3Prim')}
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

export default ModalBody;
