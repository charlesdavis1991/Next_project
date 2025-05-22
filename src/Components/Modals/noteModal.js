import React from "react";
import Modal from "react-bootstrap/Modal";
import NoteModalBody from "./noteModalBody";

const NoteModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      className="modal fade zoom-in"
      id="snackbar"
      aria-labelledby="exampleModalLabel"
      centered
    >
      <NoteModalBody content={props.content} hideModal={props.onHide} />
    </Modal>
  );
};

export default NoteModal;
