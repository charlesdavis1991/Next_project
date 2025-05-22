import React, { useState } from "react";
import "../../../public/BP_resources/css/litigation.css";

export default function LitigationNotes({ caseInfo }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCriticalNoteClick = () => {
    addNotes("critical");
    addClickRecord(41, "35", false);
  };

  const handleUpdateCaseStatusClick = () => {
    addNotes("update_case_status");
    addClickRecord(44, "35", false);
  };

  const handleTextareaFocus = () => {
    AddNoteInputRecord();
  };

  const handleTextareaChange = (event) => {
    document.querySelector(".assign_todo_textarea").value = event.target.value;
  };

  return (
    <div className="notes-section-wrapper p-l-15">
      <div className="action-bar-wrapper heigh-35 position-relative mr-0 ">
        <div
          className="action-bar client-BarAlign d-flex m-b-5 m-t-5"
          style={{ left: "147.988px" }}
        >
          <span className="page-icon">
            <img
              className="translate-note-icon"
              src="/static/BP_resources/images/icon/notes-icon-color.svg"
            />
          </span>
          <div className="text-wrapper text-white d-flex align-items-center ">
            <h2 className="text-white">Notes</h2>
          </div>
          <div className="btn-wrapper">
            <button
              className="btn btn-primary rounded-0"
              data-toggle="modal"
              data-target="#import_csv-modal"
            >
              <span className="font-weight-bold pr-2 text-gold">+</span>Import
            </button>
          </div>
        </div>
      </div>

      <div
        className="col-lg-12 notes-section bg-primary-5 h-100 pl-0  p-r-15"
        id="notes_section_main_div"
      >
        <form
          method="POST"
          className="p-t-5 m-r-5"
          id="notes-form"
          action="/30/addNotes/3/46/"
        >
          <input
            type="hidden"
            name="csrfmiddlewaretoken"
            value="BP7LfSmpWm1gz0NN9kCiJRT6ld0wnNxA2PzN2FQF37tQAql2AIbsv7ytaj4ygdmT"
          />
          <input type="hidden" id="category" name="category" />
          <div className="footer-line mr-2">
            <button
              type="button"
              onClick={handleCriticalNoteClick}
              className="ml-0 rounded-0 text-capital"
            >
              <span className="btn-text-holder">Critical Case Note</span>
            </button>
          </div>
          <div className="notes-text-area">
            <textarea
              id="w3review"
              className="note_assign_text"
              required
              name="description"
              placeholder="Input a Case Note, New To-Do, or Update the Case Status…"
              onFocus={handleTextareaFocus}
              onClick={() => addClickRecord(40, "35", false)}
              onChange={handleTextareaChange}
            />
          </div>
          <div className="footer-line">
            <button
              type="button"
              onClick={handleUpdateCaseStatusClick}
              className="ml-2 rounded-0"
            >
              <span className="btn-text-holder">Update Case Status</span>
            </button>

            <div className="container-fluid notes-ML5P">
              <div className="row flex-wrap align-items-center justify-content-between dropdown-btn-row m-b-5">
                <div className="col-12 col-md-auto d-flex align-items-center justify-content-end justify-content-xl-end col-left mb-0">
                  <button
                    className="btn btn-primary rounded-0 control-btn"
                    data-toggle="modal"
                    onClick={() => {
                      enable_assign_todo_btn();
                      addClickRecord(42, "35", false);
                    }}
                    data-target="#assign_todo-modal"
                    type="button"
                    style={{height: "25px", display: "inline-flex", alignItems: "center", justifyContent: "center"}}
                  >
                    <span className="font-weight-bold pr-2 text-gold margin-b-08">
                      +
                    </span>
                    Assign Task
                  </button>
                </div>
                <div className="col-12 col-md-auto d-md-flex align-items-center justify-content-center justify-content-xl-end col-right mb-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <span className="notes-category-label">Note Category:</span>
                    <div className="dropdown notes-category-wrapper m-r-5 m-l-5">
                      <a
                        className="dropdown-toggle footer-select notes-category text-left d-flex align-items-center height-25"
                        href="#"
                        role="button"
                        id="dropdownMenuLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="d-flex align-items-center text-truncate">
                          <i className="ic ic-notes ic-19 m-r-5"></i>
                        </span>
                        <span className="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
                          <svg
                            width="34"
                            height="17"
                            viewBox="0 0 34 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </span>
                      </a>
                      <div
                        className="dropdown-menu w-100 p-0"
                        aria-labelledby="dropdownMenuLink"
                        id="note_category"
                      >
                        <input
                          type="hidden"
                          id="note_assign_category"
                          value="Case"
                        />
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Notes")}
                        >
                          <img
                            src="/media/images/notes-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Notes
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Loans")}
                        >
                          <img
                            src="/media/images/case-loans-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Loans
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Settlement")}
                        >
                          <img
                            src="/media/images/settlement-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Settlement
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Discovery")}
                        >
                          <img
                            src="/media/images/discovery-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Discovery
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Depos")}
                        >
                          <img
                            src="/media/images/depositions-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Depos
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Counsel")}
                        >
                          <img
                            src="/media/images/insurance-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Counsel
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Case")}
                        >
                          <img
                            src="/media/images/case-icon-color_gIGzPMA.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Case
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Client")}
                        >
                          <img
                            src="/media/images/client-icon-color_KismKtn.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Client
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Employment")}
                        >
                          <img
                            src="/media/images/employment-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Employment
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Accident")}
                        >
                          <img
                            src="/media/images/car-accident-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Accident
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Reports")}
                        >
                          <img
                            src="/media/images/incident-folder-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Reports
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Treatment")}
                        >
                          <img
                            src="/media/images/medical-treatment-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Treatment
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Injury")}
                        >
                          <img
                            src="/media/images/injuries-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Injury
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Defendants")}
                        >
                          <img
                            src="/media/images/defendants-icon-color-final.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Defendants
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("To Do")}
                        >
                          <img
                            src="/media/images/to-do-icon-color_PyU3ldW.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          To Do
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Witnesses")}
                        >
                          <img
                            src="/media/images/witnesses-icon-color_sd9w6D5.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Witnesses
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Parties")}
                        >
                          <img
                            src="/media/images/other-parties-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Parties
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Insurance")}
                        >
                          <img
                            src="/media/images/insurance-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Insurance
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Costs")}
                        >
                          <img
                            src="/media/images/costs-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Costs
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Litigation")}
                        >
                          <img
                            src="/media/images/litigation-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Litigation
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Experts")}
                        >
                          <img
                            src="/media/images/incident-folder-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Experts
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Photos")}
                        >
                          <img
                            src="/media/images/photo-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Photos
                        </a>
                        <a
                          className="dropdown-item height-25"
                          onClick={() => setNoteCategory("Docs")}
                        >
                          <img
                            src="/media/images/documents-icon-color.svg"
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                          Docs
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="notes-filter">
                    <span className="notes-category-label">Note Category:</span>
                    <select
                      className="custom-select"
                      aria-label="Filter Note Category"
                      id="filter_note_category"
                      onChange={(e) => filterNoteCategory(e.target.value)}
                    >
                      <option selected>Choose...</option>
                      <option value="Notes">Notes</option>
                      <option value="Loans">Loans</option>
                      <option value="Settlement">Settlement</option>
                      <option value="Discovery">Discovery</option>
                      <option value="Depos">Depos</option>
                      <option value="Counsel">Counsel</option>
                      <option value="Case">Case</option>
                      <option value="Client">Client</option>
                      <option value="Employment">Employment</option>
                      <option value="Accident">Accident</option>
                      <option value="Reports">Reports</option>
                      <option value="Treatment">Treatment</option>
                      <option value="Injury">Injury</option>
                      <option value="Defendants">Defendants</option>
                      <option value="To Do">To Do</option>
                      <option value="Witnesses">Witnesses</option>
                      <option value="Parties">Parties</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Costs">Costs</option>
                      <option value="Litigation">Litigation</option>
                      <option value="Experts">Experts</option>
                      <option value="Photos">Photos</option>
                      <option value="Docs">Docs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div
        className="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                You may edit the note here.
              </h5>
            </div>
            <div className="modal-body"></div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
