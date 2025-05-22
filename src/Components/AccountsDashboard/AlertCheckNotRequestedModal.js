import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useAlertCheckNotRequestedModal } from "./AlertCheckNotRequestedModalContext";

const AlertCheckNotRequested = () => {
  const { isVisible, hideModal } = useAlertCheckNotRequestedModal();

  return (
    <Modal show={isVisible} onHide={hideModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Check Request Required</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          A check has not been requested for this record. To proceed with
          uploading documents, please ensure that a check request is submitted
          first.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertCheckNotRequested;
