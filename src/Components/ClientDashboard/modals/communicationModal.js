import React from "react";
import Input from "../shared/input";
import { Modal, Button, Nav, Col, Row, Tab } from "react-bootstrap";
import Select from "../shared/select";
import Form from "react-bootstrap/Form";

const CommunicationModalBody = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="modal-dialog modal-dialog-centered modal-dialog-2-max-width"
    >
      <div class="modal-header text-center p-2 popup-heading-color justify-content-center">
        <h5
          class="modal-title mx-auto font-size-24 height-40 font-weight-semibold font-weight-500"
          id="avatarModalTitle"
        >
          Client Communication Preferences
        </h5>
      </div>

      <div class="modal-body">
        <form>
          <div className="row">
            <p class="font-weight-bold mt-3 col-12">Email</p>
            <div className="col-4 mt-4 d-flex">
              <div class="d-inline-block text-grey mb-2">Every Message</div>
              <div>
                <Form.Check inline type="radio" label="Every Message Sent" />
              </div>
            </div>
            <div className="col-4 mt-4">
              <div class="d-inline-block text-grey mb-2">
                Time Since Last Message
              </div>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Time Passed Since Last Message"
                  className="pl-0 mb-2"
                />
              </div>
              <div className="">
                <Select flag={true} />
              </div>
            </div>
            <div className="col-4 mt-4">
              <div class="d-inline-block text-grey mb-2">
                Automatic Frequency
              </div>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="
                                    Automatically Insert After Every"
                  className="pl-0 mb-2"
                />
              </div>
              <div className="">
                <Select flag={true} />
              </div>
            </div>
            <div class="k-separator-line col-12"></div>
             <hr></hr> 
            <p class="font-weight-bold mt-3 col-12">Text</p>
            <div className="col-4 mt-4 d-flex">
              <div class="d-inline-block text-grey mb-2">Every Message</div>
              <div>
                <Form.Check inline type="radio" label="Every Message Sent" />
              </div>
            </div>
            <div className="col-4 mt-4">
              <div class="d-inline-block text-grey mb-2">
                Time Since Last Message
              </div>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Time Passed Since Last Message"
                  className="pl-0 mb-2"
                />
              </div>
              <div className="">
                <Select flag={true} />
              </div>
            </div>
            <div className="col-4 mt-4">
              <div class="d-inline-block text-grey mb-2">
                Automatic Frequency
              </div>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="
                  Automatically Insert After Every"
                  className="pl-0 mb-2"
                />
              </div>
              <div className="">
                <Select flag={true} />
              </div>
            </div>
            <div class="k-separator-line col-12"></div>
            <p class="font-weight-bold mt-3 col-12">Chat</p>
            <div className="col-4 mt-4 d-flex">
              <div class="d-inline-block text-grey mb-2">Every Message</div>
              <div>
                <Form.Check inline type="radio" label="Every Message Sent" />
              </div>
            </div>
            <div className="col-4 mt-4">
              <div class="d-inline-block text-grey mb-2">
                Time Since Last Message
              </div>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Time Passed Since Last Message"
                  className="pl-0 mb-2"
                />
              </div>
              <div className="">
                <Select flag={true} />
              </div>
            </div>
            <div className="col-4 mt-4">
              <div class="d-inline-block text-grey mb-2">
                Automatic Frequency
              </div>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="
                                    Automatically Insert After Every"
                  className="pl-0 mb-2"
                />
              </div>
              <div className="">
                <Select flag={true} />
              </div>
            </div>
            <div class="k-separator-line col-12"></div>
            <p class="font-weight-bold mt-3 col-12">Card</p>
          </div>
        </form>
      </div>

      <div class="mb-3 mt-3 pl-3">
        <button
          type="button"
          id=""
          class="btn btn-success input-group-text send_btn notification-position-absolute-right-14px-background-color-218838-color-white-border-color-218838 save-btn-popup popup-heading-color"
          data-dismiss="modal"
        >
          Save
        </button>
        <button
          type="button"
          class="btn btn-danger  notification-background-color-grey"
          onClick={handleClose}
        >
          Cancle
        </button>
      </div>
    </Modal>
  );
};

export default CommunicationModalBody;
