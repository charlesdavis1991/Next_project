import React from "react";
import { Modal, Button } from "react-bootstrap";

const ImagePreviewModal = ({ show, handleClose, handleSave, previewImage }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        className="text-center d-flex align-items-center justify-content-center"
      >
        <Modal.Title style={{ fontSize: "15px" }}>Uploaded Image</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center d-flex align-items-center justify-content-center">
        <img
          src={previewImage}
          alt="Uploaded Preview"
          className="client-image ic-63 position-relative m-r-5"
        />

        <img
          src={previewImage}
          alt="Uploaded Preview"
          className="client-image ic-29 position-relative m-r-5"
        />
        <img
          src={previewImage}
          alt="Uploaded Preview"
          className="client-image ic-19 position-relative"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImagePreviewModal;
