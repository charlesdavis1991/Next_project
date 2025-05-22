import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Button, Form, Col, Row, Tab } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import axios from 'axios';
import AutoCompleteSearch from '../../Insurance/AutoCompleteSearch';
import { ClientDataContext } from '../shared/DataContext';

const relations = [
    {
        key: 1,
        relation: 'Unknown'
    },
    {
        key: 2,
        relation: 'Married'
    },
    {
        key: 3,
        relation: 'Not Married'
    },
]

const ModalBodySpouseInfo = forwardRef(({current_spouse_id, current_contact_id, current_relation, current_discusCase, current_divorced, current_divorce_date, current_marriage_date, current_phone, handleClose, current_email }, ref) => {
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
    const [discussCase,setDiscussCase] = useState(current_discusCase || false)
    useEffect(() => {
        // Set initial values for the form fields
        setValue('relation', current_relation);
        setValue('marraigeDate', current_marriage_date);
        setValue('DivorceDate', current_divorce_date);
        setValue('divorced', current_divorced);
        setValue('phone', current_phone);
        setValue('email', current_email);
        setValue('discussCase', current_discusCase)
      

    }, [current_relation, current_marriage_date, current_divorce_date, current_divorced, current_phone, current_email, current_discusCase, setValue]);
    const formatDate = (date) => {
        return date.toISOString().slice(0, 19); // Slices off the milliseconds and timezone part
    };

    const onSubmit = async (data) => {
        const url = `${origin}/api/client/clients/${clientId}/`;
        const relation = watch('relation'); // field names
        const MarraigeDate = watch('marraigeDate')  ? new Date(watch('marriageDate')) : null;;
        const DivorceDate = watch('DivorceDate') ? new Date(watch('DivorceDate')) : null;
        const Divorced = watch('divorced');
        const phone = watch('phone');
        const email = watch('email');

        setLoading(true);
        const requestData = {
            spouse: {
                    ...data,
                    id: current_spouse_id,
                    relationship: relation,
                    discussCase: discussCase,
                    divorced: Divorced,
                    marriage_date: MarraigeDate,
                    divorce_date: DivorceDate,
                    contact:{
                        id: current_contact_id,
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
            setIsClientDataUpdated(true)
            handleClose()
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
                            <div className="col-md-6">
                                <Form.Select
                                    {...register("relation")}
                                    placeholder='relation'
                                    defaultValue={current_relation}
                                    onChange={(e) => setValue('relation', e.target.value)}
                                ><option key="" value="">------</option>
                                    {relations?.map(relation => (
                                        <option key={relation.key} value={relation.relation}>
                                            {relation.relation}
                                        </option>
                                    ))}

                                </Form.Select>
                            </div>
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Discuss:
                                </span>
                            </div>
                            <div>
                            <Form.Control
                                    type="checkbox"
                                    {...register("discussCase")}
                                    defaultValue={discussCase}
                                    onChange={(e) => {
                                        setDiscussCase(e.target.checked)
                                       
                                    }}
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
                                    Marriage Date:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type='date'
                                    placeholder='Marraige Date'
                                    {...register('marraigeDate')}
                                    defaultValue={current_marriage_date}
                                    onChange={(e) => setValue('marraigeDate', e.target.value)}
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                    Divorce Date:
                                </span>
                            </div>
                            <div className="col-md-3">
                                <Form.Control
                                    type='date'
                                    placeholder="Divorce Date"
                                    {...register("DivorceDate")}
                                    defaultValue={current_divorce_date}
                                    onChange={(e) => setValue('DivorceDate', e.target.checked)}
                                >

                                </Form.Control>
                            </div>
                            <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey">
                                    Divorced:
                                </span>
                            </div>
                            <div>
                                <Form.Control
                                    type="checkbox"
                                    {...register("divorced")}
                                    defaultValue={current_divorced}
                                    onChange={(e) => setValue('divorced', e.target.checked)}
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
                                    type="tel"
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

export default ModalBodySpouseInfo;


