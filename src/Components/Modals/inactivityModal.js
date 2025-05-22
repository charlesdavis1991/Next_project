import React from "react";
import InactivityModalBody from "./inactivityModalBody";
import Modal from "react-bootstrap/Modal";
import { useInactivity } from "../../Providers/inactivity";

const InactivityModal = () => {
  const { inactivityModalShow, timeoutTime, hideInactivityModal, reset } =
    useInactivity();

  const handleKeepLoggedIn = () => {
    reset();
    hideInactivityModal();
  };

  return (
    <Modal
      size="md"
      show={inactivityModalShow}
      onHide={hideInactivityModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <InactivityModalBody
        timeoutTime={timeoutTime}
        hideModal={handleKeepLoggedIn}
      />
    </Modal>
  );
};

export default InactivityModal;
