import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./sendemailbtntreatment.css";

function SendEmailBtnTreatment({ email, specialitie, name }) {
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
        className="btn btn-hover-contact-panel-row font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-0 p-l-6 p-r-6"
        onClick={() => setSendEmailModalShow(!sendEmailModaShow)}
      >
        <i className="ic ic-19 ic-email-3d mr-1"></i>
        <p className="overflow-hidden">{email}</p>
      </button>

      {sendEmailModaShow && (
        <SendEmailModal
          email={email}
          specialitie={specialitie}
          name={name}
          handleClose={() => setSendEmailModalShow(!sendEmailModaShow)}
        />
      )}
    </>
  );
}

export default SendEmailBtnTreatment;

function SendEmailModal({ email, specialitie, name, handleClose }) {
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
      <div style={{ minHeight: "278px" }}>
        <Modal.Header
          style={{
            backgroundColor: specialitie?.color,
            height: "25px",
            border: "none",
          }}
          className="text-center d-flex align-items-center bg-speciality p-0 popup-heading-color justify-content-center"
        >
          <span
            style={{
              backgroundColor: specialitie?.color,
              height: "25px",
              fontSize: "16px",
              width: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontWeight: "600",
            }}
          >
            {specialitie?.name[0]}
          </span>
          <Modal.Title
            className="mx-auto height-25 d-flex align-items-center font-weight-semibold text-uppercase popup-heading-color"
            id="avatarModalTitle"
            style={{
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Send Email to {name}
            {/* <div className="ic ic-29 email-popup">
                <img
                  className="notification-position-relative-height-100P"
                  src="https://simplefirm-bucket.s3.amazonaws.com/static/images/CA29/3-profile_pic_29px_t62dbwo.png"
                  alt="Profile"
                />
              </div> */}
          </Modal.Title>
        </Modal.Header>
        <p className="client-popup-border height-25 d-flex align-items-center justify-content-center text-center">
          {email
            ? `Email will be sent to ${email}`
            : "Email will be sent to email@provider.com"}
        </p>
        <Modal.Body style={{ padding: "5px" }}>
          <div
            className="btn-group mt-0 ChatB4 justify-content-center"
            role="group"
          >
            <Button
              variant="primary-lighter"
              className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-5 p-r-5 p-t-5 p-b-5"
            >
              Testing 1
            </Button>
            <Button
              variant="primary-lighter"
              className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-5 p-r-5 p-t-5 p-b-5 m-l-5"
            >
              Testing 2
            </Button>
            <Button
              variant="primary-lighter"
              className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-5 p-r-5 p-t-5 p-b-5 m-l-5"
            >
              Testing 3
            </Button>
            <Button
              variant="primary-lighter"
              className="btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-5 p-r-5 p-t-5 p-b-5 m-l-5"
            >
              Testing 4
            </Button>
          </div>

          {/* <Form.Check
          type="checkbox"
          className="notification-float-right"
          id="exampleCheckbox-159"
          label="Include chat subject greeting"
        /> */}

          <Form.Group className="mt-0" onSubmit={handleSubmit(onSubmit)}>
            <Form.Label className="m-b-5">Email Subject:</Form.Label>
            <Form.Control
              type="text"
              className="custom-text-input m-b-5 height-25 p-l-5 p-r-5 p-t-5 p-b-5"
              {...register("Subject")}
            />
          </Form.Group>

          <Form.Group className="mt-0">
            <Form.Label className="m-b-5">Type Mail:</Form.Label>
            <Form.Control
              as="textarea"
              rows={12}
              id="text-area-send-email"
              className="chatMessage p-l-5 p-r-5 p-t-5 p-b-5"
              style={{ resize: "both" }}
              {...register("Body")}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer
          className="m-t-5 d-flex pt-0 p-b-5 height-25 align-items-center justify-content-between w-100 p-r-5 p-l-5"
          style={{
            border: " none",
          }}
        >
          <Button
            onClick={handleClose}
            variant="secondary"
            className="height-25 d-flex align-items-center justify-content-center"
            // data-dismiss="modal"
            id="modal-btn-send-email"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            variant="success"
            className="input-group-text send_btn height-25 d-flex align-items-center justify-content-center save-btn-popup popup-heading-color"
            // data-dismiss="modal"
            id="modal-btn-send-email"
          >
            {name ? `Send Email To ${name}` : "Send Email"}{" "}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
