import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

function DocumentRenameModal({ isOpen, documentName, onConfirm, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div id="outside" onClick={onClose}>
      <Modal
        show={isOpen}
        onHide={onClose}
        aria-labelledby="contained-modal-vcenter"
        centered
        backdrop={false}
        style={{
          zIndex: 1000000,
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
        }}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body className="document-modal-body" style={{ margin: "1rem" }}>
          <p>
            Do you want to rename this document to <b>{documentName}</b>?
          </p>
        </Modal.Body>
        <Modal.Footer className="doc-pop-padding-2rem">
          <button
            type="button"
            onClick={onClose}
            className="btn"
            style={{
              color: "white",
              borderColor: "grey",
              backgroundColor: "grey",
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn"
            style={{
              color: "white",
              borderColor: "#0a3761",
              backgroundColor: "#0a3761",
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

DocumentRenameModal.propTypes = {
  isOpen: PropTypes.bool,
  documentName: PropTypes.string,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
};

DocumentRenameModal.defaultProps = {
  isOpen: false,
  documentName: "",
  onConfirm: () => {},
  onClose: () => {},
};

export default DocumentRenameModal;
