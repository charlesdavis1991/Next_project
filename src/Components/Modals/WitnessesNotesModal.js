import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { useFormik } from "formik";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import EditNote from "./EditNote";
const WitnessesNotesModal = ({
  show,
  handleClose,
  witnessData,
  notesData,
  setStatusUpdate,
  noteData,
}) => {
  const [noteDescription, setNoteDescription] = useState("");
  const [todoNote, setTodoNote] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState("2 days");

  const handleNoteChange = (e) => setNoteDescription(e.target.value);
  const handleTodoChange = (e) => setTodoNote(e.target.value);
  const handleUserChange = (e) => setSelectedUser(e.target.value);
  const handleDateChange = (e) => setDueDate(e.target.value);

  const addNotesPanel = (type) => {
    console.log(`Adding notes panel with type: ${type}`);
    // Add your form submission logic here
  };

  const addTodoNote = () => {
    console.log("Adding To-Do note");
    // Add your form submission logic here
  };

  // date formate change
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { day: "numeric", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };
  // time formate change
  const formatTime = (dateTimeString) => {
    try {
      const dateTime = new Date(dateTimeString);
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return dateTime.toLocaleTimeString("en-US", options);
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Time";
    }
  };

  const initialValues = {
    description: "",
  };
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      api
        .post(`/api/notes/${getClientId()}/${getCaseId()}/`, {
          category: notesData?.category?.name,
          entity_type: notesData?.entity_type,
          record_id: notesData?.record_id,
          description: values.description,
        })
        .then((response) => {
          handleClose();
          setLoading(false);
          resetForm();
          setStatusUpdate(true);
        })
        .catch((error) => {
          setLoading(false);
        });
    },
  });
  const [editNoteData, setEditNoteData] = useState(null);
  const [showEditWitnessesNotes, setShowEditWitnessesNotes] =
    React.useState(false);
  const toggleWitnessNotesModal = (note) => {
    setShowEditWitnessesNotes(!showEditWitnessesNotes);
    setEditNoteData(note);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="modal-845w ">
        <div class="modal-header text-center">
          {/* <h5 class="modal-title mx-auto" id="individual_notes_modal_title">
            1 May 17, 2024 3:17 p.m. Usama Nawaz Witness mz,mz Note:
          </h5> */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <h5 class="modal-title mx-auto" id="individual_notes_modal_title">
              {formatDate(noteData?.created_at)}
            </h5>
            <h5 class="modal-title mx-auto" id="individual_notes_modal_title">
              {formatTime(noteData?.created_at)}
            </h5>
            <h5 class="modal-title mx-auto" id="individual_notes_modal_title">
              {noteData?.description}
            </h5>
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <Modal.Body className="panel-popups-body">
          <div className="col-lg-12 p-0 notes-section">
            <form
              method="POST"
              className="d-flex justify-content-start"
              id="notes-form-panel"
              action="/30/addnotes_Panel/3/4/"
            >
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value="NBp3UzXoZHzi2vQMbAymzvj0dZngE2WnScmjiHtWnM4WE1AtqiVV8MObjPu6bpqv"
              />
              <input hidden type="text" id="category-panel" name="category" />
              <input
                hidden
                type="text"
                id="entity_type-panel"
                name="entity_type"
              />
              <input hidden type="text" id="record_id-panel" name="record_id" />
              <div className="footer-line mr-2">
                <button
                  type="button"
                  // onClick={() => addNotes_panel("critical")}
                  className="ml-0 rounded-0"
                >
                  New <br />
                  Critical
                  <br />
                  Note
                </button>
              </div>
              <textarea
                // onFocus={AddNoteInputRecord}
                id="note_description_panel"
                name="description"
                placeholder="Case Note:.."
                value={values.description}
                onChange={handleChange}
                required
              />
              <div className="footer-line">
                <button
                  type="button"
                  className="ml-2 rounded-0"
                  onClick={handleSubmit}
                >
                  Update
                  <br />
                  Case
                  <br />
                  Status
                </button>
              </div>
            </form>
            <form method="POST" id="todo-form-panel" action="/30/addToDo/3/4/">
              <input
                type="hidden"
                name="csrfmiddlewaretoken"
                value="NBp3UzXoZHzi2vQMbAymzvj0dZngE2WnScmjiHtWnM4WE1AtqiVV8MObjPu6bpqv"
              />
              <textarea id="todo-note" hidden name="note"></textarea>
              <div className="footer-line">
                <div className="row align-items-center">
                  <div className="col-lg-8 col-md-6 col-sm-12 d-flex align-items-center">
                    To-Do for
                    <select
                      id="hidden-select"
                      name="user_type"
                      className="vodiapicker"
                    >
                      <option
                        value="7"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1_1_ErAdzXJ.jpg"
                        data-value="20"
                      >
                        Ali Staff
                      </option>
                      <option
                        value="6"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1.png"
                        data-value="19"
                      >
                        Tom Cruise
                      </option>
                      <option
                        value="9"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1_1.jpg"
                        data-value="26"
                      >
                        Christian Rios
                      </option>
                      <option
                        value="4"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/1494599203-greatest-superhero-films-iron-man.jpg"
                        data-value="13"
                      >
                        Ian Silverthorne
                      </option>
                      <option
                        value="1"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/avatar-05_PmbIVew.jpg"
                        data-value="5"
                      >
                        Kamran Dev
                      </option>
                      <option
                        value="5"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/5-profile_pic_63px_JCmYi0k.jpg"
                        data-value="18"
                      >
                        Uneeb Hassan
                      </option>
                      <option value="12" data-thumbnail="img/avatar.png">
                        Automatic User
                      </option>
                      <option
                        value="3"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/download.png"
                        data-value="158"
                      >
                        Usama Staff
                      </option>
                      <option
                        value="8"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/avatar-05.jpg"
                        data-value="21"
                      >
                        Muhammad Abubakar
                      </option>
                      <option value="47" data-thumbnail="img/avatar.png">
                        Nadir Hussain
                      </option>
                      <option
                        value="11"
                        data-thumbnail="https://simplefirm-bucket.s3.amazonaws.com/static/images/attorneys/avatar-01_pjds0gK.jpg"
                        data-value="3"
                      >
                        Usama Nawaz
                      </option>
                      <option value="49" data-thumbnail="img/avatar.png">
                        Sardar Dev
                      </option>
                      <option value="50" data-thumbnail="img/avatar.png">
                        Ahmed Dev
                      </option>
                      <option value="52" data-thumbnail="img/avatar.png">
                        Huzaifa Dev
                      </option>
                      <option value="51" data-thumbnail="img/avatar.png">
                        Moeez Dev
                      </option>
                      <option value="54" data-thumbnail="img/avatar.png">
                        Adnan Dev
                      </option>
                      <option value="55" data-thumbnail="img/avatar.png">
                        Aqeel Dev
                      </option>
                      <option value="48" data-thumbnail="img/avatar.png">
                        Uneeb Hassan
                      </option>
                    </select>
                    <div className="lang-select">
                      <button
                        id="todo-user"
                        className="btn-select-custom"
                        type="button"
                        value="7"
                      ></button>
                      <div className="b">
                        <ul id="outer-div"></ul>
                      </div>
                    </div>
                    due in
                    <select
                      className="right footer-select w-50 m-r-5 form-select"
                      name="due_date"
                      id="cars"
                    >
                      <option value="Now">Now</option>
                      <option value="1 day">1 day</option>
                      <option selected value="2 days">
                        2 days
                      </option>
                      <option value="3 days">3 days</option>
                      <option value="4 days">4 days</option>
                      <option value="5 days">5 days</option>
                      <option value="6 days">6 days</option>
                      <option value="1 week">1 week</option>
                      <option value="2 weeks">2 weeks</option>
                      <option value="1 month">1 month</option>
                      <option value="2 months">2 months</option>
                      <option value="6 months">6 months</option>
                    </select>
                    <button
                      className="btn btn-primary rounded-0"
                      // onClick={addTodoNote}
                      type="button"
                    >
                      <span className="font-weight-bold pr-2 text-gold">+</span>
                      To-Do
                    </button>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-center justify-content-end">
                    <select
                      name="category"
                      id="note_category_panel"
                      className="right w-50 m-r-5 form-select Rep-PP-Align Witnesses"
                    >
                      <option value="Filing" disabled>
                        Filing
                      </option>
                      <option value="Firm Settings Page" disabled>
                        Firm Settings Page
                      </option>
                      <option value="Case" disabled>
                        Case
                      </option>
                      <option value="Client" disabled>
                        Client
                      </option>
                      <option value="Accident" disabled>
                        Accident
                      </option>
                      <option value="Employment" disabled>
                        Employment
                      </option>
                      <option value="Reports" disabled>
                        Reports
                      </option>
                      <option value="Treatment" disabled>
                        Treatment
                      </option>
                      <option value="Injury" disabled>
                        Injury
                      </option>
                      <option value="Defendants" disabled>
                        Defendants
                      </option>
                      <option value="To Do" disabled>
                        To Do
                      </option>
                      <option selected value="Witnesses">
                        Witnesses
                      </option>
                      <option value="Parties" disabled>
                        Parties
                      </option>
                      <option value="Insurance" disabled>
                        Insurance
                      </option>
                      <option value="Loans" disabled>
                        Loans
                      </option>
                      <option value="Costs" disabled>
                        Costs
                      </option>
                      <option value="Settle" disabled>
                        Settle
                      </option>
                      <option value="Litigation" disabled>
                        Litigation
                      </option>
                      <option value="Discovery" disabled>
                        Discovery
                      </option>
                      <option value="Depos" disabled>
                        Depos
                      </option>
                      <option value="Experts" disabled>
                        Experts
                      </option>
                      <option value="Photos" disabled>
                        Photos
                      </option>
                      <option value="Docs" disabled>
                        Docs
                      </option>
                      <option value="Notes" disabled>
                        Notes
                      </option>
                      <option value="Motion" disabled>
                        Motion
                      </option>
                      <option value="Time Page" disabled>
                        Time Page
                      </option>
                      <option value="Statute of Limitations" disabled>
                        Statute of Limitations
                      </option>
                      <option value="Event" disabled>
                        Event
                      </option>
                      <option value="Deadline" disabled>
                        Deadline
                      </option>
                      <option value="Exam" disabled>
                        Exam
                      </option>
                      <option value="Hearing" disabled>
                        Hearing
                      </option>
                      <option value="Trial" disabled>
                        Trial
                      </option>
                    </select>
                    <button
                      className="btn btn-primary rounded-0"
                      form="notes-form"
                      // onClick={() => addNotes_panel("note")}
                      type="button"
                    >
                      <span className="font-weight-bold pr-2 text-gold">+</span>
                      Note
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <nav className="row">
              <div className="col-lg-12 notetable">
                <div className="custom-tab">
                  <div>
                    <div
                      className="tab-pane"
                      id="custom-nav-todo"
                      role="tabpanel"
                      aria-labelledby="custom-nav-todo-tab"
                    >
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="table-responsive table--no-card">
                            <table className="table table-borderless table-striped table-earning">
                              <thead>
                                <tr>
                                  <th scope="col" className="width-1"></th>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th className="width-6-padding-left">User</th>
                                  <th>Note</th>
                                  <th className="width-1">Category</th>
                                </tr>
                              </thead>
                              <tbody className="tbody-panels">
                                {witnessData?.notes?.map(
                                  (note, index) =>
                                    note?.entity_type === "Witness" && (
                                      <tr
                                        key={index}
                                        className=" cursor-pointer"
                                      >
                                        <td className="serial-number">
                                          {index + 1}
                                        </td>
                                        <td className="td-autosize">
                                          {formatDate(note?.created_at)}
                                        </td>
                                        <td className="td-autosize">
                                          {formatTime(note?.created_at)}
                                        </td>
                                        <td className="td-autosize">
                                          <div className="d-flex align-items-center">
                                            <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                              {note?.created_by
                                                ?.bp_attorneystaff_userprofile
                                                ?.profile_pic_29p && (
                                                <img
                                                  src={
                                                    note?.created_by
                                                      ?.bp_attorneystaff_userprofile
                                                      ?.profile_pic_29p
                                                  }
                                                  alt=""
                                                />
                                              )}
                                            </span>
                                            <span className="ml-2 text-black">
                                              {note?.created_by?.first_name}{" "}
                                              {note?.created_by?.last_name}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="client_page_note_row color-white-space-word-wrap">
                                          {note.description}
                                        </td>
                                        <td className="client_page_note_row color-black vertical-align-middle">
                                          <td className="td-autosize vertical-align-middle">
                                            Witnesses
                                          </td>
                                          <td className="td-autosize hover-button vertical-align-middle">
                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              onClick={() => {
                                                toggleWitnessNotesModal(note);
                                              }}
                                            >
                                              Edit
                                            </button>
                                          </td>
                                        </td>
                                      </tr>
                                    )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={() => console.log("Save changes")}
            className="d-none"
          >
            Save
          </Button>
        </Modal.Footer>
        <EditNote
          show={showEditWitnessesNotes}
          handleClose={toggleWitnessNotesModal}
          editNoteData={editNoteData}
        />
      </Modal>
    </>
  );
};

export default WitnessesNotesModal;
