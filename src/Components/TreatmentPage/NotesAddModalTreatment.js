// 05/24/2024---Hassnain Ali
import React from "react";
import { useRef } from "react";
import noImage from "../../assets/images/avatar.png";
import { Image } from "react-bootstrap";
import { Modal, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import avatarImage from "./../../assets/images/avatar.svg";
import { Margin } from "@mui/icons-material";
import { format } from "date-fns";

function NoteAddModalTreatment({
  show,
  handleClose,
  handleFormSubmission,
  data,
  pages,
  pannel,
  module,
  caseProvider = {},
}) {
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const descriptionRef = useRef(null);
  const noteSelectRef = useRef(null);

  //    Sending data to the parent component for posting to the server
  const sendData = (category) => {
    if (descriptionRef.current.value != "" && category != "") {
      handleFormSubmission(category, descriptionRef.current.value);
    }
  };
  const handleProfilePic = (note) => {
    let profilePicUrl;

    try {
      profilePicUrl = note.created_by?.bp_attorneystaff_userprofile
        ?.profile_pic_29p
        ? media_origin +
          note.created_by.bp_attorneystaff_userprofile.profile_pic_29p
        : avatarImage;
    } catch (error) {
      console.log("ERROR PROFILE PIC", error);
      profilePicUrl = avatarImage;
    }
    return profilePicUrl;
  };
  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="m-900max">
      <Modal.Header closeButton className="text-center">
        <Modal.Title className="mx-auto" id="individual_notes_modal_title">
          Add Notes For {pannel} {caseProvider?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="panel-popups-body">
        <div className="w-100">
          <div className="d-flex justify-content-start" id="notes-form-panel">
            {/* <div className="footer-line ss-m-bottom">
              <Button variant="primary" className="ml-0 rounded-0" onClick={() => sendData("Critical")}>
                New <br />
                Critical<br />
                Note
              </Button>
            </div> */}
            <Form.Control
              as="textarea"
              id="note_description_panel-treatment"
              required
              className="m-0"
              name="description"
              placeholder="Case Note:.."
              ref={descriptionRef}
            />
            {/* <div className="footer-line">
              <Button variant="primary" className="ml-2 rounded-0" onClick={() => sendData("Update Case Status")}>
                Update<br />
                Case<br />
                Status
              </Button>
            </div> */}
          </div>
          <div id="todo-form-panel">
            <Form.Control as="textarea" id="todo-note" hidden name="note" />
            <div className="footer-line ss-m-bottom">
              <div className="row align-items-center">
                {/* <div className="col-lg-8 col-md-6 col-sm-12 d-flex align-items-center text-nowrap">
                  <p className=" m-r-5">To-Do for</p>
                  <input className="m-r-5" type="checkbox"></input>
                  <p className=" m-r-5">due in</p>
                  <Form.Control
                    style={{ marginRight: "5px" }}
                    as="select"
                    className="right footer-select w-50 m-r-5 form-select"
                    name="due_date"
                  >
                    <option value="Now">Now</option>
                    <option value="1 day">1 day</option>
                    <option value="2 days">2 days</option>
                    <option value="3 days">3 days</option>
                    <option value="4 days">4 days</option>
                    <option value="5 days">5 days</option>
                    <option value="6 days">6 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="6 months">6 months</option>
                  </Form.Control>
                  <Button className="btn btn-primary rounded-0" type="button">
                    <span className="font-weight-bold pr-2 text-gold">+</span>
                    To-Do
                  </Button>
                </div> */}
                <div className="col-lg-12 col-md-12 col-sm-12 d-flex align-items-center justify-content-end">
                  {/* <Form.Control
                    style={{ marginRight: "5px" }}
                    as="select"
                    name="category"
                    id="note_category_panel"
                    className="right footer-select w-50 m-r-5 form-select"
                    ref={noteSelectRef}
                  >
                    {pages && pages.length > 0 ? (
                      pages.map(
                        (page, index) =>
                          module == page.name && (
                            <option value={page.name} key={index}>
                              {page.name}
                            </option>
                          )
                      )
                    ) : (
                      <option>No Option</option>
                    )}
                  </Form.Control> */}
                  <Button
                    className="btn btn-primary rounded-0"
                    type="button"
                    onClick={() => sendData(descriptionRef.current.value)}
                  >
                    <span className="font-weight-bold pr-2 text-gold">+</span>
                    Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <nav>
            {" "}
            {/* this nav is important -> binds with the notatable class in theme.css (idk why it was done this way) */}
            <div className="notetable">
              <div className="custom-tab">
                <div
                  className="tab-pane"
                  id="custom-nav-todo"
                  role="tabpanel"
                  aria-labelledby="custom-nav-todo-tab"
                >
                  <div className="table-responsive table--no-card">
                    <Table className="table table-borderless table-striped table-earning">
                      <thead>
                        <tr>
                          <th className="INS-width-1px"></th>
                          <th>Date</th>
                          <th>Time</th>
                          <th className="td-autosize">User</th>
                          <th>Note</th>
                          <th>Category</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="table-body-cat-notes">
                        {data && data.length > 0 ? (
                          data.map((note, index) => (
                            <tr
                              className={`${note.entity_type}${note.record_id}`}
                              key={note.id}
                            >
                              <td className="td-autosize width-36">
                                {index + 1}
                              </td>
                              <td className="td-autosize">
                                {" "}
                                {format(note.created_at, "MMMM dd, yyyy")}
                              </td>
                              <td className="td-autosize">
                                {" "}
                                {format(note.created_at, "h:mm a")}
                              </td>
                              <td className="td-autosize d-flex align-items-center">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                  <Image
                                    src={handleProfilePic(note)}
                                    alt=""
                                    className=""
                                  />
                                </span>
                                <span className="ml-2 text-black whitespace-nowrap">
                                  {note.created_by.first_name}{" "}
                                  {note.created_by.last_name}
                                </span>
                              </td>
                              <td className="client_page_note_row INS-color-black">
                                {note.description}
                              </td>
                              <td className="td-autosize">
                                {note.category?.name
                                  ? note.category.name
                                  : module}
                              </td>
                              <td className="td-autosize hover-button">
                                <Button
                                  variant="secondary"
                                  className="edit-notes-btn"
                                >
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="INS-float-margin"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          type="submit"
          form="addDefendantInsuranceForm"
          className="d-none"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteAddModalTreatment;
