import React from "react";
import { Form, Modal, Button } from "react-bootstrap";

function NoProviderModal({ isOpen, handleOpen }) {
  const handleClose = () => {
    handleOpen();
  };

  return (
    <div>
      <Modal show={isOpen} onHide={handleClose} centered size="lg" aria-labelledby="noProviderModalLabel">
        <Modal.Header closeButton id="noProviderModalHeader">
          <Modal.Title id="noProviderModalLabel" className="primary-col">No Provider Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>There is no provider associated with this entry.</Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NoProviderModal;
