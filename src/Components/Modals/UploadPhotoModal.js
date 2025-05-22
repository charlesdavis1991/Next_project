import React from "react";
import UploadPhotoModalBody from "./UploadPhotoModalBody";
import Modal from "react-bootstrap/Modal";

const UploadPhotoModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <UploadPhotoModalBody
        pages={props.pages}
        hideModal={props.onHide}
        client_id={props.client_id}
        case_id={props.case_id}
        setUnsortedPhotos={props.setUnsortedPhotos}
      />
    </Modal>
  );
};

export default UploadPhotoModal;
