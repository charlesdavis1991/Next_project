import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import CustomSelect from "./shared/selectDropDow";
import Modal from "./modals/modal";
import NotesModal from "./modals/notesModal";

const ClientNotes = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="row mt-2 mb-2">
        <div className="col-12 pr-0">
          <div className="d-flex">
            <div className="notes-page">
              <span class="page-icon">
                <img
                  class="translate-note-icon"
                  src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/notes-icon-color.svg"
                />
              </span>
            </div>
            <div className="skew-notes ml-2"></div>
            <div className="insurance-header w-100">
              <div className="d-flex align-items-center">
                <div class="text-wrapper text-white d-flex align-items-center ml-3">
                  <h2 class="text-white">Notes</h2>
                </div>
                <a href="#" className="text-white ml-90">
                  <button className="btn-primary">
                    <span className="font-weight-bold pr-2 text-gold">+</span>{" "}
                    Import
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center ml-3 mr-3">
        <div className="btn-text-holder angle-skew-11 ml-2">
          <button className="btn-primary d-flex align-items-center justify-content-center no-border-radius btn-primary rounded-0 control-btn">
            <p className="anti-skew font-wieght-600 font-size-20 w-lg-20 line-hight-20 height-100 pt-2 pb-2">
              Critical
              <br /> Case <br /> Note
            </p>
          </button>
        </div>
        <div
          className="height-80 justify-content-center w-100"
          style={{ width: "100% !important" }}
        >
          <form
            id="notes-form"
            className="pl-0 pr-0"
            style={{ height: "100%" }}
          >
            <div className="notes-text-area">
              <textarea
                onclick=""
                required
                name="description"
                placeholder="Input a Case Note, New To-Do, or Update the Case Status…"
                className="form-control d-inline-block ML5PX-PLC"
              ></textarea>
            </div>
          </form>
        </div>
        <div className="btn-text-holder angle-skew-11">
          <button className="btn-primary d-flex align-items-center justify-content-center no-border-radius btn-primary rounded-0 control-btn">
            <p className="anti-skew font-wieght-600 font-size-20 w-lg-20 line-hight-20 height-100 pt-2 pb-2">
              Update Case Status
            </p>
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-lg-between pl-5 pr-5 mt-2 mb-3">
        <div className="mt-2" onClick={handleOpen}>
          <button className="btn-primary">
            <span className="font-weight-bold pr-2 text-gold">+</span> Asign
            Task
          </button>
        </div>
        <div className="mr-5 d-flex align-items-center">
          <div className="">
            <Form className="d-flex align-items-center">
              <div className="mt-2">
                <Form.Label>Note Category:</Form.Label>
              </div>
              <div className="ml-2 w-200">
                <CustomSelect />
              </div>
            </Form>
            {/* <CustomSelect /> */}
          </div>
          <a href="#" className="text-white ml-3 mr-4">
            <button className="btn-primary">
              <span className="font-weight-bold pr-2 text-gold">+</span> Save
              Note
            </button>
          </a>
        </div>
      </div>
      <Modal show={open} onHide={() => setOpen(false)} size="modal-w70">
        <NotesModal hideModal={() => setOpen(false)} />
      </Modal>
    </>
  );
};

export default ClientNotes;
