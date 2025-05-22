import React from "react";
import { Modal } from "react-bootstrap";

const ImagePreviewModal = ({ show, handleClose, imageUrl, imageAlt }) => {
  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px" }}>Image Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <img
          src={imageUrl}
          alt={imageAlt}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "80vh",
            objectFit: "contain",
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ImagePreviewModal;
