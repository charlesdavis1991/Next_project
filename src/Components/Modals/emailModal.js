import React from "react";
import EmailModalBody from "./emailModalBody";
import Modal from "react-bootstrap/Modal";

const EmailModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <EmailModalBody hideModal={props.onHide} />
    </Modal>
  );
};

export default EmailModal;
