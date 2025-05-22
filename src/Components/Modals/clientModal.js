import React from "react";
import Modal from "react-bootstrap/Modal";
import ClientModalBody from "./clientModalBody";

const ClientModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ClientModalBody hideModal={props.onHide} />
    </Modal>
  );
};

export default ClientModal;
