import React, { useState, useEffect } from "react";
import { Modal } from 'react-bootstrap';
import { getCaseId, getClientId } from "../../../Utils/helper";
import api from "../../../api/api";
import '../../../../public/BP_resources/css/client-4.css';

const TextViewResponseModal = ({ handleClose, show, message, sendResponse }) => {
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    
    const clientId = getClientId();
    const currentCaseId = getCaseId();

    useEffect(() => {
        setReply("");
    }
    , [message]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/api/client-page/send_sms/`, {
                msg: reply,
                client: clientId,
                case: currentCaseId
            });
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
            if (error.status >= 400 && error.status < 500) {
                alert(error?.response?.data?.data || "Error sending message, please try again.");
            } else {
                alert("Error sending message, please try again.");
            }
        } finally {
            setLoading(false);
        }
        handleClose();
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} size="xl" aria-labelledby="textViewResponseModalLabel" centered>
                <Modal.Header className="modal-header text-center p-0 bg-primary text-white justify-content-center">
                    <h5 className="modal-title mx-auto font-size-24 height-40 text-white  font-weight-semibold  font-weight-500" id="avatarModalTitle">
                        <i className="ic ic-19 ic-sms-3d m-r-5"></i>
                        Text Message
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5 className="pb-1">
                            From:{" "}
                            <span className="text-transform-font-weight">
                                {`${message?.obj?.sender?.first_name} ${message?.obj?.sender?.last_name}`}
                            </span>
                        </h5>
                        <h5 className="pb-1">
                            To:{" "}
                            <span className="text-transform-font-weight">
                                {message?.phone_no}
                            </span>
                        </h5>
                        <h5 className="pb-1">
                            Date:{" "}
                            <span className="text-transform-font-weight">
                                {new Date(
                                    message?.obj?.created_at
                                ).toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })}{" "}
                                <b className="text-transform-font-weight">
                                    {new Date(
                                        message?.obj?.created_at
                                    ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </b>
                            </span>
                        </h5>
                        <h5>
                            Message:
                        </h5>
                        <p className="text-transform-font-weight pb-1">
                            {message?.obj?.body}
                        </p>
                    </div>
                    <div className="pb-2">
                        <h5 className="pb-1">
                            Response:
                        </h5>
                        <textarea
                            className="form-control modal-response-input-h-120"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
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
                                "Send"
                            )}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TextViewResponseModal;