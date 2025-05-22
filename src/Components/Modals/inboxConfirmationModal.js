import React from 'react'
import Modal from 'react-bootstrap/Modal';
import InboxConfirmationModalBody from './inboxConfirmationModalBody';

const InboxConfirmationModal = (props) => {
  return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="inbox-confirmation-modal"
    >
      <InboxConfirmationModalBody taskDocumentPopupData={props.taskDocumentPopupData} inboxConfirmationContent={props.inboxConfirmationContent} hideModal={props.onHide} />
    </Modal>
    )
}

export default InboxConfirmationModal;