import React from "react";
import { Button, Modal } from "react-bootstrap";


//RK :: 07-18-2024 : 11-03 PM
function ConfirmDeletePopup({ handleClose, handleDeleteSubmission , entity="Entity"  }) {
    return (
      <Modal
        show={true}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
      >
        <div className="" style={{ padding: "15px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
             { entity}
            </Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            <p>
              This will delete the { entity} from the case and move any documents
              attached to this { entity} to being unsorted attached to the case
              generally
            </p>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={handleClose} className="ml-2">
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteSubmission}
                className="ml-2"
              >
                Delete { entity}
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    );
  }
  
export default ConfirmDeletePopup