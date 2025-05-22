import React from "react";
import TextModalBody from "./textModalBody";
import Modal from "react-bootstrap/Modal";

const TextModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <TextModalBody hideModal={props.onHide} />
    </Modal>
  );
};

export default TextModal;
