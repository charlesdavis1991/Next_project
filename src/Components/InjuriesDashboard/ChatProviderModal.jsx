import React from "react";
import { Form, Modal } from "react-bootstrap";

function ChatWithProviderModal({ isOpen, handleOpen }) {
  const handleSubmit = () => {
    handleOpen();
  };

  return (
    <div>
      <Modal
        show={isOpen}
        centered
        size="md"
        onHide={handleOpen}
        className=""
        aria-labelledby="contained-modal-title-vcenter"
      >
        <div class="modal-header">
          <h5
            className="modal-title"
            id="exampleModalLongTitle"
            style={{ fontSize: "15px", fontWeight: 700 }}
          >
            Chat With Provider
          </h5>
        </div>

        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ paddingBottom: "0px" }}>
            <p>
              All medical provider chats are deleted after 7 days. Click a
              message button below to send a quick standardized message to the
              medical office
            </p>
            <div className="mt-3">
              <button
                className="btn btn-primary btn-lg btn-block"
                id="permission-message"
                data-dismiss="modal"
              >
                Status Update Request
              </button>
              <button
                className="btn btn-primary btn-lg btn-block"
                id="permission-message"
                data-dismiss="modal"
              >
                Body Part Confirmation
              </button>
              <button
                className="btn btn-primary btn-lg btn-block"
                id="permission-message"
                data-dismiss="modal"
              >
                Records Request Reminder
              </button>
              <button
                className="btn btn-primary btn-lg btn-block m-b-5"
                id="permission-message"
                data-dismiss="modal"
              >
                Billing Request Reminder
              </button>

              <input
                type="text"
                className="form-control form-control-lg borderRaduis"
                placeholder="Message"
                id="permission-message"
                style={{ boxShadow: "none" }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="padding-1rem d-flex justify-content-between ">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              id="cancel-modal"
              onClick={handleOpen}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              data-dismiss="modal"
              id="cancel-modal"
              onClick={handleOpen}
            >
              Send Chat
            </button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ChatWithProviderModal;
