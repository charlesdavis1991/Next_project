import React from "react";
import { Modal } from "react-bootstrap";

const GenericModalComponent = ({
  show,
  handleClose,
  title,
  height = "",
  bodyContent,
  footerContent,
  hasFooter = false,
  dialogClassName = "",
  headerClassName = "",
  titleClassName = "",
}) => {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName={dialogClassName}>
      <div style={{ height: height }}>
        <Modal.Header className={headerClassName}>
          <Modal.Title className={titleClassName} id="modal_title">
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{bodyContent}</Modal.Body>
        {hasFooter && <Modal.Footer>{footerContent}</Modal.Footer>}
      </div>
    </Modal>
  );
};

export default GenericModalComponent;
