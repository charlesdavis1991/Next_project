import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";

function SendEmailBtn({ email }) {
  ///We will replace dummy name for send email in future (Jhon Doe)
  const [sendEmailModaShow, setSendEmailModalShow] = useState(false);

  return (
    <>
      <button
        style={{
          height: "25px",
          width: "100%",
          backgroundColor: "var(--primary-10)",
          borderColor: "var(--primary)",
          color: "var(--primary)",
        }}
        className="btn btn-hover-contact-panel-row font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-5 p-l-6 p-r-6"
        onClick={() => setSendEmailModalShow(!sendEmailModaShow)}
      >
        <i className="ic ic-19 ic-email-3d mr-1"></i>
        <p className="overflow-hidden">{email}</p>
      </button>

      {sendEmailModaShow && (
        <SendEmailModal
          email={email}
          handleClose={() => setSendEmailModalShow(!sendEmailModaShow)}
        />
      )}
    </>
  );
}

export default SendEmailBtn;

function SendEmailModal({ email, handleClose }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
    >
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center">
        <Modal.Title
          className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
          id="avatarModalTitle"
        >
          Send Email to {email}
          {/* <div className="ic ic-29 email-popup">
                <img
                  className="notification-position-relative-height-100P"
                  src="https://simplefirm-bucket.s3.amazonaws.com/static/images/CA29/3-profile_pic_29px_t62dbwo.png"
                  alt="Profile"
                />
              </div> */}
        </Modal.Title>
      </Modal.Header>
      <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
        Your Emergency Email Contact Message for this popup goes here.
      </p>
      <Modal.Body>
        <div
          className="btn-group mt-2 ChatB4 justify-content-center"
          role="group"
        >
          <Button
            variant="primary-lighter"
            className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
          >
            Testing 1
          </Button>
          <Button
            variant="primary-lighter"
            className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2"
          >
            Testing 2
          </Button>
          <Button
            variant="primary-lighter"
            className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2"
          >
            Testing 3
          </Button>
          <Button
            variant="primary-lighter"
            className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5 ml-2"
          >
            Testing 4
          </Button>
        </div>

        <Form.Check
          type="checkbox"
          className="notification-float-right"
          id="exampleCheckbox-159"
          label="Include chat subject greeting"
        />

        <Form.Group className="mt-3" onSubmit={handleSubmit(onSubmit)}>
          <Form.Label>Chat Subject Greeting:</Form.Label>
          <Form.Control
            type="text"
            className="custom-text-input notification-border-solid-1px-grey-width-100P-padding-10px"
            {...register("Subject")}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Type Mail:</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            className="chatMessage notification-border-solid-1px-grey-width-100P-padding-10px"
            style={{ resize: "both" }}
            {...register("Body")}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer className="notification-padding-2rem">
        <Button
          onClick={handleClose}
          variant="success"
          className="input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
          data-dismiss="modal"
        >
          Send Email To Emergency Contact
        </Button>
        <Button
          onClick={handleClose}
          variant="danger"
          className="notification-background-color-grey-border-color-grey-position-absolute-left-14px"
          data-dismiss="modal"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
