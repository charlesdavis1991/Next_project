import React, { useState, useEffect } from "react";
import { Modal } from 'react-bootstrap';
import api from '../../../api/api';
import { getClientId } from '../../../Utils/helper';
import '../../../../public/BP_resources/css/client-4.css';

const EmailViewResponseModal = ({ handleClose, show, email }) => {
    const [respSubject, setRespSubject] = useState(`Re: ${email?.subject}`);
    const [respMessage, setRespMessage] = useState("");

    const [loading, setLoading] = useState(false);
    
    const client_id = getClientId();
    
    useEffect(() => {
        setRespSubject(`Re: ${email?.subject}`);
        setRespMessage("");
    }
    , [email]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/api/client/send-email-to-client/${client_id}/`, {
                reply: true,
                subject: respSubject,
                body: respMessage,
                to: email?.sender,
            });
            if(response.status !== 200) {
                alert("Error sending email, please try again.");
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
        handleClose();
    }; 

    return (
        <div>
            <Modal show={show} onHide={handleClose} size="md" aria-labelledby="emailViewResponseModalLabel" centered>
                <Modal.Header className="modal-header text-center p-0 bg-primary text-white justify-content-center">
                    <h5 className="modal-title mx-auto font-size-24 height-40 text-white  font-weight-semibold  font-weight-500" id="avatarModalTitle">
                        <i className="ic ic-19 ic-email-3d m-r-5"></i>
                        Email Message
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5 className="pb-1">
                            From:{" "}
                            <span className="text-transform-font-weight">
                                {email?.sender}
                            </span>
                        </h5>
                        <h5 className="pb-1">
                            To:{" "}
                            <span className="text-transform-font-weight">
                                {email?.recipient}
                            </span>
                        </h5>
                        <h5 className="pb-1">
                            Date:{" "}
                            <span className="text-transform-font-weight">
                                {new Date(
                                    email?.date_received
                                ).toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })}{" "}
                                <b className="text-transform-font-weight">
                                    {new Date(
                                        email?.date_received
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </b>
                            </span>
                        </h5>
                        <h5 className="pb-1">
                            Subject:
                            <span className="text-transform-font-weight">
                                {email?.subject}
                            </span>
                        </h5>
                        <h5>
                            Message:
                        </h5>
                        <p className="text-transform-font-weight pb-1">
                            {email?.body?.split("\n")?.map((line, i) => (
                              <span key={i}>
                                {line}
                                <br />
                              </span>
                            ))}
                        </p>
                    </div>
                    <div className="pb-2">
                        <h5 className="pb-1">
                            Response:
                        </h5>
                        <h5 className="pb-1">
                            Subject:
                        </h5>
                        <input
                            type="text"
                            className="form-control"
                            value={respSubject}
                            onChange={(e) => setRespSubject(e.target.value)}
                            placeholder="Enter your response subject"
                        />
                        <h5 className="pb-1">
                            Message:
                        </h5>
                        <textarea
                            className="form-control modal-response-input-h-120"
                            value={respMessage}
                            onChange={(e) => setRespMessage(e.target.value)}
                            placeholder="Enter your response"
                        />
                    </div>
                    <div className="">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-success float-right"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                "Sending..."
                            ) : (
                                "Send Response"
                            )}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EmailViewResponseModal;