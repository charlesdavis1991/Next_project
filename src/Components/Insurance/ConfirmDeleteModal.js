import React from 'react'
import { Modal, Button } from 'react-bootstrap';
const ConfirmDeleteModal = ({handleClose,handleDeleteSubmission}) => {
  return (
    <div>
      <Modal
        show={true}
          onHide={handleClose}
          dialogClassName="modal-lg modal-dialog-centered  custom-insurance-dialog"
      >
      <div className="" style={{padding: "15px"}}>
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center">
              <Modal.Title
                className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
                id="modal_title"
              >
                {/* Are you sure you want to delete this insurance? */}
                Insurance
              </Modal.Title>
            </Modal.Header>
      <Modal.Body>
      <p>
      This will delete the insurance from the case and move any documents attached to this insurance to being unsorted attached to the case generally
      </p>
      <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="secondary"
                        onClick={ handleClose}
                        className="ml-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        onClick={handleDeleteSubmission}
                        className="ml-2"
                      >
                        Delete Insurance
                      </Button>
                    </div>
      </Modal.Body>
      </div>
      </Modal>
    </div>
  )
}

export default ConfirmDeleteModal

