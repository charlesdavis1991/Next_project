import React from 'react';
import Modal from 'react-bootstrap/Modal';
import DocumentUploadModalBody from './documentUploadModalBody';

const DocumentUploadModal = (props) => {
  return (
    <>
        <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          id="fileModal"          
        >
            <DocumentUploadModalBody uploadFile={props.uploadFile} uploadProgress={props.uploadProgress} hideModal={props.onHide} />
        </Modal>
    </>
  )
}

export default DocumentUploadModal;