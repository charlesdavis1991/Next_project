import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ContactPanel from "../../common/ContactPanel";

const DeleteConfirmationModal = ({ show, handleClose }) => {
  const [timer, setTimer] = useState(5);
  useEffect(() => {
    let interval;

    if (show) {
      setTimer(5);
      interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [show, handleClose]);

  if (!show) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered "
        contentClassName="custom-modal-new-provider"
        size="md"
      >
        <div>
          <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
              style={{ fontSize: "14px" }}
            >
              Document Deleted
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0 p-t-5 d-flex align-items-center justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div
                className="d-flex flex-column"
                style={{ width: "255px", gap: "5px" }}
              ></div>
              <span
                style={{
                  fontWeight: "600",
                  color: "var(--primary)",
                }}
                className="m-t-5 whitespace-nowrap"
              >
                Document has been successfully deleted.
              </span>
              <span
                style={{
                  fontWeight: "600",
                  color: "var(--primary)",
                }}
                className="whitespace-nowrap"
              >
                Popup will automatically close in {timer} seconds...
              </span>
            </div>
          </Modal.Body>

          <Modal.Footer
            className=" p-0 mt-0 padding-outside-btn-new-provider"
            style={{ borderTop: "none" }}
          >
            <Button
              className="button-padding-footer-new-provider mx-auto d-flex align-items-center justify-content-center "
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default DeleteConfirmationModal;
