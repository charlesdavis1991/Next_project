import React, { useState, useEffect } from "react";
import "../../../public/BP_resources/css/global-modals.css";
import { useDispatch, useSelector } from "react-redux";
import toDoIcon from "../../../public/BP_resources/images/icon/to-do-icon.svg";
import { assignTodo } from "../../Redux/notes/thunks";
import api from "../../api/api";
import SuccessAssignTaskModal from "./assignTodoSuccessModal";
import avatarImage from "./../../assets/images/avatar.svg";
import { mediaRoute } from "../../Utils/helper";

//U2024235:4:00AM
const AssignTodoModal = ({ show, handleClose }) => {
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("Now");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [uniqueIdUsers, setUniqueIdUsers] = useState([]);
  const [successBtnFlag, setSuccessBtnFlag] = useState(false);
  const [clickDates, setClickDates] = useState([]);
  const [notesFirmUsers, setNotesFirmUsers] = useState([]);
  const [newCaseTasks, setNewCaseTasks] = useState([]);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state?.note);

  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const case_users = [
    currentCase?.firm_user1,
    currentCase?.firm_user2,
    currentCase?.firm_user3,
  ];
  const case_users1 = [
    currentCase?.firm_user4,
    currentCase?.firm_user5,
    currentCase?.firm_user6,
  ];
  const enableAssignTodoBtn = () => {
    // Implement your logic to enable the "Assign New Task" button
  };

  const handleSelectChange = (event) => {
    setDueTime(event.target.value);
  };
  function handleCloseBtn() {
    setAssignedUsers([]);
    setUniqueIdUsers([]);
    setDescription("");
    setDueTime("Now");
    handleClose();
  }

  const toggleUserAssignment = (uniqueId, userId) => {
    //becuase we don't have unique userid's that's why we made our own uniqueId
    const index = uniqueIdUsers.findIndex((id) => id === uniqueId);
    if (index !== -1) {
      setAssignedUsers([
        ...assignedUsers.slice(0, index),
        ...assignedUsers.slice(index + 1),
      ]);
      setUniqueIdUsers(uniqueIdUsers.filter((id) => id !== uniqueId));
    } else {
      setUniqueIdUsers([...uniqueIdUsers, uniqueId]);
      setAssignedUsers([...assignedUsers, userId]);
    }
    console.log("hehe", userId);
  };

  async function createNotesTodo() {
    const taskData = {
      client_id: client?.id,
      case_id: currentCase?.id,
      description: description,
      time: dueTime,
      user_ids: [...new Set(assignedUsers)],
    };
    try {
      let response = await dispatch(assignTodo(taskData));
      setNewCaseTasks(response);
      setAssignedUsers([]);
      setUniqueIdUsers([]);
      setDescription("");
      setDueTime("Now");
    } catch (error) {
      setNewCaseTasks([]);
    }
  }

  async function clickDatesAPI() {
   try{ const response = await api.get("api/click_dates/", {
      params: { case_id: currentCase?.id },
    });
    setClickDates(response.data);}
    catch(e){
      console.error(e)
    }
  }
  async function notesFirmUsersAPI() {
   try{ const response = await api.get("api/notes_firm_users/", {
      params: { case_id: currentCase?.id },
    });
    setNotesFirmUsers(response.data);}
    catch(e){
      console.error(e)
    }
  }
  function fetchClickDate(id) {
    const clickObject = clickDates.find((element) => id === element?.user?.id);
    return clickObject?.created_at
      ? new Date(clickObject.created_at).toISOString().split("T")[0]
      : "";
  }
  useEffect(() => {
    setSuccessBtnFlag(assignedUsers.length === 0 ? false : true);
    if (clickDates.length === 0) {
      clickDatesAPI();
    }
    if (notesFirmUsers.length === 0) {
      notesFirmUsersAPI()
    }
  }, [assignedUsers])
  return newCaseTasks?.length > 0 ? (<SuccessAssignTaskModal show={show} setRes={setNewCaseTasks} handleClose={handleClose} res={newCaseTasks} />) : (
    <div className={`modal generic-popup bd-example-modal-lg fade zoom-in ${show ? 'show' : ''}`} id="assign_todo-modal" tabIndex="-1" role="dialog" aria-labelledby="assign_todo-modal" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100000, paddingRight: '17px', display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-1 modal-dialog-4-max-width" >
        <div className="modal-content" id="no-border-popup">
          <div className="modal-header text-center p-0 bg-primary-5 popup-heading-color justify-content-center">
            <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase text-primary font-weight-500 d-flex align-items-center modal-title-with-icon">
              <img src={toDoIcon} alt="To-Do Icon" /> ASSIGN TASK
            </h5>
          </div>
          <div className="modal-body">
            <div>
              <div></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <p className=" notes-text-area" style={{ border: "none" }}>
                  Type the task description in the input field below. Select the
                  amount of time for the task to be completed with the Due
                  dropdown. Then select the case workers you want to assign the
                  task and click the green “Assign New Task” button.
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className=" notes-text-area" style={{ border: "none" }}>
                  <textarea
                    className="assign_todo_textarea"
                    onKeyUp={enableAssignTodoBtn}
                    required
                    name="description"
                    placeholder="Input a Case Note, New To-Do, or Update the Case Status…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="d-flex assign-dropdown align-items-center">
                  Due:
                  <div className="m-r-5 m-l-5">
                    <select
                      className="  note-assign-time  d-flex align-items-center"
                      value={dueTime}
                      onChange={handleSelectChange}
                      aria-labelledby="dropdownMenuButton"
                    >
                      {[
                        "Now",
                        "1 day",
                        "2 days",
                        "3 days",
                        "4 days",
                        "5 days",
                        "6 days",
                        "1 week",
                        "2 weeks",
                        "1 month",
                        "2 months",
                        "3 months",
                        "6 months",
                      ].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="m-r-15 background-main-10 height-25">
                <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                  CASE WORKERS ASSIGNED TO CASE
                </h4>
              </div>

              <div className="d-flex background-main-2 f-gap-05 mb-3">
                <div className="table-responsive table--no-card rounded-0 border-0 position-relative">
                  <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
                    <tbody>
                      {case_users.map((user, index) => {
                        const uniqueId = `${user?.id}-${index}-caseuser1`;
                        return (
                          <tr key={user?.id}>
                            <td id="padding-l-15"></td>
                            <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g"
                                >
                                  <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img
                                      id="output"
                                      src={
                                        user?.profile_pic
                                          ? mediaRoute(user?.profile_pic)
                                          : avatarImage
                                      }
                                      alt={user?.user?.first_name}
                                    />
                                  </div>
                                  <div className="ml-2 flex-g">
                                    {user?.user?.first_name}{" "}
                                    {user?.user?.last_name}
                                  </div>
                                </button>
                              </div>
                            </td>
                            <td className="text-end">
                              {fetchClickDate(user?.user?.id)}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="custom-control custom-checkbox m-l-10">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input todo_popup_checkbox"
                                    id={`todo_popup_checkbox${uniqueId}`}
                                    user_id={user?.id}
                                    onClick={() =>
                                      toggleUserAssignment(uniqueId, user?.id)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`todo_popup_checkbox${user?.id}`}
                                  ></label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="table-responsive table--no-card rounded-0 border-0 position-relative">
                  <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
                    <tbody>
                      {case_users1.map((user, index) => {
                        const uniqueId = `${user?.id}-${index}-caseuser2`;
                        return (
                          <tr key={user?.id}>
                            <td id="padding-l-15"></td>
                            <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g"
                                >
                                  <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    <img
                                      id="output"
                                      src={
                                        user?.profile_pic
                                          ? mediaRoute(user?.profile_pic)
                                          : avatarImage
                                      }
                                      alt={user?.user?.first_name}
                                    />
                                  </div>
                                  <div className="ml-2 flex-g">
                                    {user?.user?.first_name}{" "}
                                    {user?.user?.last_name}
                                  </div>
                                </button>
                              </div>
                            </td>
                            <td className="text-end">
                              {fetchClickDate(user?.user?.id)}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="custom-control custom-checkbox m-l-10">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input todo_popup_checkbox"
                                    id={`todo_popup_checkbox${uniqueId}`}
                                    user_id={user?.id}
                                    onClick={() =>
                                      toggleUserAssignment(uniqueId, user?.id)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`todo_popup_checkbox${user?.id}`}
                                  ></label>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="m-r-15 background-main-10 height-25">
                <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                  Other Firm users
                </h4>
              </div>
              <div className="d-flex">
                <div className="dis-grid f-gap-05 adjust-custom-bg height-">
                  {notesFirmUsers.map((user, index) => {
                    let uniqueId = "Nfirm" + index;
                    return (
                      <div class="td-autosize d-flex justify-content-between align-items-center w-100 height-35">
                        <div class="d-flex align-items-center">
                          <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                            <img
                              src={
                                user?.profile_pic_29p
                                  ? mediaRoute(user?.profile_pic_29p)
                                  : avatarImage
                              }
                              alt=""
                            />
                          </span>
                          <span class="ml-2 color-black">
                            {user?.first_name} {user?.last_name}
                          </span>
                        </div>
                        <div className="custom-control custom-checkbox m-l-10">
                          <input
                            type="checkbox"
                            className="custom-control-input todo_popup_checkbox"
                            id={"3"}
                            onClick={() =>
                              toggleUserAssignment(uniqueId, user?.id)
                            }
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={"3"}
                          ></label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-between pt-4">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCloseBtn}
            >
              Cancel
            </button>
            <button
              className={`btn ${successBtnFlag ? "btn-success" : ""}`}
              type="button"
              disabled={!successBtnFlag || description.length === 0}
              onClick={createNotesTodo}
            >
              Assign New Task
            </button>
            {/* <button type="button" className="btn save-btn-popup popup-heading-color d-none" id="enable_assign_task" >Assign New Task</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTodoModal;
