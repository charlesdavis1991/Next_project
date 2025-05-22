import React from 'react'
import { Modal, ModalHeader, Nav, Tab, Table } from 'react-bootstrap';

const SsnModalBody = ({ handleClose, show, clientName, clientSSN }) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} size="md" aria-labelledby="previewPortalModalLabel" centered>
                <Modal.Header className="modal-header p-0 bg-primary popup-heading-color justify-content-center">
                        <h5 className="modal-title mx-auto font-size-18 d-flex align-items-center justify-content-center height-35 font-weight-semibold popup-heading-color font-weight-500" id="avatarModalTitle">
                            {clientName} Social Security Number</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-body">
                        <div className='text-center'>
                            <h4>
                                {clientSSN}
                            </h4>
                        </div>
                    </div>

                    <div className="mb-3 pl-3 d-flex justify-content-center">
                        <button type="button" className="btn btn-secondary  notification-background-color-grey"
                            onClick={handleClose}>Close</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SsnModalBody;


