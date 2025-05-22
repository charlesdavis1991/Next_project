import React from "react";
import { Form, Modal } from "react-bootstrap";

function Warning({ show, handleClose }) {

  return (
    <div>
      <Modal
        show={show} onHide={handleClose}
        centered
        size="md"
        className=""
        aria-labelledby="contained-modal-title-vcenter"
      >
        <div class="modal-header">
          <h5
            className="modal-title"
            id="exampleModalLongTitle"
            style={{ fontSize: "15px", fontWeight: 700 }}
          >
            Warning
          </h5>
        </div>
          <Modal.Body>
            <p>
            You must clear all Notes, Medical Providers and 
            Medical Record Entries from an Injured Body Part Before Deselecting it.
            </p>
          </Modal.Body>
          <Modal.Footer>

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleClose}
            >
              Close
            </button>
          </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Warning;
