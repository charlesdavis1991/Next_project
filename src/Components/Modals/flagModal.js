import React from "react";
import FlagModalBody from "./flagModalBody";
import Modal from "react-bootstrap/Modal";

const FlagModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <FlagModalBody flagPage={props.flagPage} hideModal={props.onHide} />
    </Modal>
  );
};

export default FlagModal;
