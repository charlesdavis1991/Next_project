import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalComponent = ({
  show,
  handleClose,
  size,
  title,
  children,
  buttonData,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size={size}>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px", textAlign: "center" }}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {buttonData.map((button, idx) => (
          <Button variant={button.variant} onClick={button.onClick}>
            {button.text}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
