import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import { getCaseId, getClientId } from '../../../Utils/helper';
import api from '../../../api/api';
import avatarImage from "./../../../assets/images/avatar.svg";
import { mediaRoute } from "../../../Utils/helper";
const RequestDocModal = ({ isOpen, caseInfo, onConfirm, onClose, selectedDoc }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const currentCaseid = getCaseId();
    const clientid = getClientId();
    const origin = process.env.REACT_APP_BACKEND_URL;

    const firmUsers = [
        [caseInfo?.firm_user1, caseInfo?.firm_user2],
        [caseInfo?.firm_user3, caseInfo?.firm_user4],
        [caseInfo?.firm_user5, caseInfo?.firm_user6]
    ].filter(pair => pair.some(user => user)); // Filter out pairs with no users

    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleConfirm = async () => {
        try {
            const response = await api.post(`${origin}/api/doc-page/add-task-document/${clientid}/${currentCaseid}/`, {
                user_id: selectedUsers,
                doc_id: selectedDoc
            });
            if (response.status === 200) {
                onConfirm();
                onClose();
            }
        } catch (error) {
            console.error('Error requesting document:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const renderUserCard = (user, index) => {
        if (!user) return null;
        return (
            <div key={user.id} className="col-12 col-md-6 mb-3">
                <div className="d-flex align-items-center">
                    <img src={user.profile_pic_29p?
                        mediaRoute(user.profile_pic_29p)
                        : avatarImage}
                        alt={`${user.user.first_name} ${user.user.last_name}`} 
                       
                       style={{ width: "20px", height: "20px", borderRadius: "50%", margin:"0px 10px" }}
                    />
                    
                    <div className="flex-grow-1">{`${user.user.first_name} ${user.user.last_name}`}</div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id={`user_checkbox_${user.id}`} onChange={() => handleCheckboxChange(user.id)} />
                        <label className="custom-control-label" htmlFor={`user_checkbox_${user.id}`}></label>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg" centered style={{
            zIndex: 1000000,
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
        }}>
            {/* Updated Modal Header Design */}
            <Modal.Header style={{ backgroundColor: "#003366", padding: 0 }}>
                <Modal.Title className="w-100 text-center" style={{ backgroundColor: "#003366", color: "white", padding: "12px", fontSize: "16px" }}>
                    Firm Users Assigned to Case
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Header within the Body */}
                <div className="text-center mb-3">
                    <h5 className="client-contact-title text-center" style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "4px", margin: "0 auto", maxWidth: "350px" }}>
                        FIRM USERS ASSIGNED TO CASE
                    </h5>
                </div>

                <div className="container-fluid">
                    {firmUsers.map((pair, index) => (
                        <div key={index} className="row mb-3">
                            {renderUserCard(pair[0])}
                            {renderUserCard(pair[1])}
                        </div>
                    ))}
                    <div className="">
                        <h5                         className="client-contact-title text-center" style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "4px", margin: "0 auto", maxWidth: "350px" }}>
                            Other Firm Users
                        </h5>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant='success' onClick={handleConfirm}>
                    Request Document Review
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

RequestDocModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    caseInfo: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default RequestDocModal;

