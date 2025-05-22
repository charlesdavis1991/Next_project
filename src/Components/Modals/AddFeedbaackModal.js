import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";

const AddFeedbaackModal = ({ show, handleClose }) => {
  const [description, setDescription] = useState("");
  const caseSummary = useSelector((state) => state?.caseData?.summary);
  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  const handleSubmit = async () => {
    const ticketNumber = generateRandomString();
    const payload = {
      client_id: getClientId(),
      case_id: getCaseId(),
      todo_for: 38,
      due_date: new Date().toISOString(),
      ticket_number: ticketNumber,
      todo_type: "Feedback",
      description: description,
    };

    try {
      await api.post("/api/save-todo/", payload);
      handleClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="modal-1000w">
      <Modal.Header closeButton style={{ backgroundColor: "var(--primary)" }}>
        <h5 className="mx-auto" style={{ color: "white" }}>
          Feedback
        </h5>
      </Modal.Header>
      <Modal.Body>
        <div className="row feedback-details-row">
          <div className="col-md-4 d-flex align-items-center">
            <p className="gray-label m-r-5 mb-0">Firm:</p>
            <p className="mb-0">
              {caseSummary?.for_client?.created_by?.office_name || ""}
            </p>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <p className="gray-label m-r-5 mb-0">User:</p>
            <p className="mb-0">
              {localStorage.getItem("loggedInUserName") || ""}
            </p>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <p className="gray-label m-r-5 mb-0">Case:</p>
            <p className="mb-0">{caseSummary?.incident_date || ""}</p>
          </div>
          <div className="col-md-4 m-t-5 d-flex align-items-center">
            <p className="gray-label m-r-5 mb-0">Date:</p>
            <p className="mb-0">
              {new Date().toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="col-12 m-t-5">
            <p className="gray-label m-b-5">Feedback:</p>
            <textarea
              className="form-control"
              required
              style={{ resize: "none" }}
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Submit Feedback
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFeedbaackModal;
