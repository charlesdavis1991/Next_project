import React, { useState, useEffect, useContext } from "react";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Button, Modal, Form, Col, Row, Tab } from 'react-bootstrap';
import { FormProvider, useForm } from "react-hook-form";
import avatar from "../../../../public/bp_assets/img/avatar_new.svg"
import axios from 'axios';
import "./../../../../public/BP_resources/css/client-4.css"
import { ClientDataContext } from '../shared/DataContext';


const ModalBodyMessage = ({ handleClose, show, clientName, typeComm, mainHead, primary_email, primary_number, client_pic }) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const node_env = process.env.NODE_ENV;
    const token = localStorage.getItem('token');
    const clientId = getClientId();
    const currentCaseId = getCaseId();
    const [checkedBox, setCheckedBox] = useState(null);
    const methods = useForm();
    const [states, setStates] = useState([]);
    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const { setIsClientDataUpdated } = useContext(ClientDataContext);

    //determine which API to hit
    const onSubmit = async (data) => {
        if (typeComm === 'Chat') {
            const url = `${origin}/api/client-page/client-chat-send-message/${clientId}/case/${currentCaseId}/`;

            const requestData = {
                content: watch('content'),
            };
            setLoading(true);
            try {
                const response = await axios.post(url, requestData, {
                    headers: {
                        Authorization: token,
                    },
                });
                const responseData = response.data;
                setIsClientDataUpdated(true);
                setLoading(false);
                handleClose();
            } catch (error) {
                console.error('Error making POST request:', error);
                setLoading(false);
            }
        } else if (typeComm === "Text") {
            const url = `${origin}/api/client-page/send_sms/`;

            const requestData = {
                recieverNum: primary_number,
                msg: watch('body'),
                client: clientId,
                case: currentCaseId
            };

            setLoading(true);
            try {
                const response = await axios.post(url, requestData, {
                    headers: {
                        Authorization: token,
                    },
                });
                const responseData = response.data;
                setIsClientDataUpdated(true);
                setLoading(false);
                handleClose();
            } catch (error) {
                console.error('Error making POST request:', error);
                setLoading(false);
            }
        } else if (typeComm === "Email") {
            const url = `${origin}/api/client-page/send-email-to-client/${clientId}/`;

            const requestData = {
                reply: watch('reply'),
                to: primary_email,
                subject: watch('subject'),
                body: watch('body')
            };
            setLoading(true);
            try {
                const response = await axios.post(url, requestData, {
                    headers: {
                        Authorization: token,
                    },
                });
                const responseData = response.data;
                setIsClientDataUpdated(true);
                setLoading(false);
                handleClose();
            } catch (error) {
                console.error('Error making POST request:', error);
                setLoading(false);
            }
        } else {
            console.log("Error in component rendering")
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} aria-labelledby="chatModalLabel" centered dialogClassName="modal-dialog modal-dialog-centered">
                <div style={{ height: "520px" }}>
                    <FormProvider {...methods}>
                        <Form id="sendMessage_form" onSubmit={handleSubmit(onSubmit)}>
                            <Modal.Header className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
                                <h5 className='modal-title mx-auto font-size-20 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500'>
                                    SEND {mainHead} MESSAGE TO {client_pic ? (
                                        <div className="ic ic-17 m-t-5 m-b-5">
                                            <img
                                                className={`rounded-circle object-fit-cover theme-ring`}
                                                src={client_pic}
                                                alt="Profil"

                                            />
                                        </div>
                                    ) : (
                                        <div className="ic ic-17 m-t-5 m-b-5">
                                            <img
                                                className={`rounded-circle object-fit-cover `}
                                                src={avatar}
                                            />
                                        </div>
                                    )}  {clientName}</h5>
                            </Modal.Header>
                            <Modal.Header className="text-center p-2 justify-content-center">
                                Your {typeComm} Message for this poup goes here.
                            </Modal.Header>
                            <Modal.Body className="modal-body">
                                <Row className="mx-0 justify-content-center form-group">
                                    <Col md={12} className='justify-content-center'>
                                        <div className="row justify-content-center form-group">
                                            <div className="col-md-3">
                                                <span className="d-inline-block text-grey">
                                                    <button className='btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5'>
                                                        Testing 1
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="col-md-3">
                                                <span className="d-inline-block text-grey">
                                                    <button className='btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5'>
                                                        Testing 2
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="col-md-3">
                                                <span className="d-inline-block text-grey">
                                                    <button className='btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5'>
                                                        Testing 3
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="col-md-3">
                                                <span className="d-inline-block text-grey">
                                                    <button className='btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5'>
                                                        Testing 4
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mx-0 align-items-center form-group">
                                    <Col md={12}>
                                        <div className="row align-items-center form-group">
                                            <div className="col-md-5 text-left">
                                                <span className="d-inline-block text-grey">
                                                    {typeComm} Subject Greeting:
                                                </span>
                                            </div>
                                            <div>
                                                <Form.Check
                                                    type="checkbox"
                                                    {...register('reply')}
                                                    onChange={(e) => setValue('reply', e.target.value)}
                                                    label={`Include ${typeComm} subject greeting`}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="row align-items-center form-group">
                                            <div className="col-md-12">
                                                {typeComm === 'Chat' ?
                                                    <Form.Control
                                                        type="text"

                                                    />
                                                    : <Form.Control
                                                        type="text"
                                                        {...register('subject')}
                                                        onChange={(e) => setValue('subject', e.target.value)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="mx-0 align-items-center form-group">
                                    <Col md={12}>
                                        <div className="row align-items-center form-group">
                                            <div className="col-md-12 text-left">
                                                <span className="d-inline-block text-grey">
                                                    Type {typeComm}:
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="row align-items-center">
                                            <div className="col-md-12">
                                                {typeComm === 'Chat' ?
                                                    <Form.Control
                                                        className='chatMessage notification-border-solid-1px-grey-width-100P-padding-10px'
                                                        type="textarea"
                                                        {...register('content')}
                                                        onChange={(e) => setValue('content', e.target.value)}
                                                        style={{ height: "90px" }}
                                                    />
                                                    : <Form.Control
                                                        className='chatMessage notification-border-solid-1px-grey-width-100P-padding-10px'
                                                        type="textarea"
                                                        {...register('body')}
                                                        onChange={(e) => setValue('body', e.target.value)}
                                                        style={{ height: "90px" }}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer className="d-flex justify-content-between">
                                <button type="button" className="btn  btn-secondary  notification-background-color-grey"
                                    onClick={handleClose}>Cancel
                                </button>
                                <Button variant="success" type="submit">
                                    {loading ? "Sending.." : `Send ${typeComm}`}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </FormProvider>
                </div>
            </Modal >
        </>
    );
}

export default ModalBodyMessage;


