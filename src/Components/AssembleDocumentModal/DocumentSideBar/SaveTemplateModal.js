import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from 'axios';

const SaveTemplateModal = ({ show, handleClose, handleSave, defaultSignerName = "", defaultSignerEmail = "" }) => {
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [signerEmail, setSignerEmail] = useState(defaultSignerEmail);
  const [errorMessage, setErrorMessage] = useState("");

  const onSave = () => {
    if (!signerName || !signerEmail) {
      setErrorMessage("Please fill in both fields before saving.");
    } else {
      setErrorMessage("");
      handleSave({ signerName, signerEmail });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm the name and email are correct before sending</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <Form>
          <Form.Group controlId="signerName">
            <Form.Label>Signer Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter signer name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="signerEmail">
            <Form.Label>Signer Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter signer email"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose} style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', color: 'white' }}>
          Cancel
        </Button>
        <Button variant="none" onClick={onSave} style={{ backgroundColor: '#007bff', borderColor: '#007bff', color: 'white' }}>

          Request Electronic Signature
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SaveTemplateModal;