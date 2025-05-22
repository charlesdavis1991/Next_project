import React from 'react'
import { Modal,Button } from 'react-bootstrap';

const SettlementNoCheckModal = ({show, handleClose}) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            dialogClassName="custom-check-dialog justify-content-center"
            >
 <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>No Check Found</div></div>

            <Modal.Body>
                <span className='d-block text-center'>There is no check associated with this entry.</span>

            </Modal.Body>
            <div className="d-flex justify-content-center mb-3">
                <div>
                    <Button variant="secondary" onClick={handleClose} className="height-25" style={{padding:"0px 12px"}}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default SettlementNoCheckModal