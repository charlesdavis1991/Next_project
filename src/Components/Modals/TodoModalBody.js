import React, { Fragment, useState } from "react";
import { ModalBody, ModalHeader } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  fetchTodosPageData,
  postTodosCompletion,
} from "../../Redux/todos/actions";
// import "../TodoDashboard/todos.css";
import { getClientId } from "../../Utils/helper";
// import { toast } from "react-toastify";

const typeDrp = [
  { id: 1, value: "Product Document" },
  { id: 2, value: "Doc Review" },
];

const TodoModalBody = (props) => {
  const dispatch = useDispatch();
  const clientId = getClientId();
  const loggedInUser = localStorage.getItem("loggedInUser");
  console.log("Props Data ===>", props);
  const initialFormData = {
    todoType: props.selectedData?.todo_type || "",
    task: props.selectedData?.notes || "",
    todoFor: props.selectedData?.todo_for?.id || "",
    dueBy: new Date(props.selectedData?.due_date || "")
      .toISOString()
      .split("T")[0],
    completedAt: props.selectedData?.completed_at
      ? new Date(props.selectedData.completed_at).toISOString().split("T")[0]
      : props.selectedData?.complete
        ? new Date().toISOString().split("T")[0]
        : "",

    completionNote: props.selectedData?.completion_note || "",
    completed: props.selectedData?.complete || false,
    verified: props?.selectedData?.verified?.verified || false,
    verified_by: props?.selectedData?.verified?.verified_by || null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the field being changed is 'completed', and it is being checked (changed to true)
    if (name === "completed" && checked) {
      // Set the 'completedAt' field to today's date
      setFormData({
        ...formData,
        completedAt: new Date().toISOString().split("T")[0],
        [name]: checked,
      });
    } else {
      // For other fields or if 'completed' is being unchecked
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  const handleVerified = (verify) => {
    setFormData({
      ...formData,
      verified: verify,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newData = {
      todo_id: props.selectedData.id,
      complete_note: formData.completionNote,
      completed: formData.completed,
      permission: true,
      completed_at: formData.completedAt,
      todo_type: formData.todoType,
      task: formData.task,
      todo_for: formData.todoFor,
      due_by: formData.dueBy,
    };
    setIsSending(true);
    postTodosCompletion(newData)
      .then(() => {
        props.hideModal();
        fetchTodosPageData(dispatch);
        // toast.success("Successful");
        setIsSending(false);
      })
      .catch(() => {
        setIsSending(false);
        // toast.error("Something went wrong");
      });
  };

  const sanitizeHtml = (html) => {
    // Define a regular expression to remove potentially harmful tags and attributes
    const cleanHtml = html.replace(/<[^>]+>/g, "");

    return cleanHtml;
  };
  const sanitizedHtml = sanitizeHtml(formData?.task);

  console.log(clientId, props?.selectedData, "nbnbhb");
  return (
    <div className="tabsModal">
      <ModalHeader>
        <div
          className="modal-title mx-auto d-flex align-items-center "
          style={{ fontWeight: 800, fontSize: "15px", color: "#333333" }}
        >
          <span className="page-icon">
            <img
              className="translate-note-icon"
              src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/to-do-icon-color.svg"
              alt=""
            />
          </span>{" "}
          &nbsp;&nbsp;TO DO
        </div>
      </ModalHeader>
      <ModalBody>
        <form id="edit_todo_form" onSubmit={handleSubmit}>
          <div className="row form-group align-items-center">
            <div className="col-md-2 text-left">
              <span
                className="d-inline-block text-primary"
                style={{ fontSize: "14px" }}
              >
                Type:
              </span>
            </div>
            <div className="col-md-10">
              {Number(loggedInUser) ===
              Number(props?.selectedData?.created_by?.id) ? (
                <select
                  name="todoType"
                  disabled={clientId != props?.selectedData?.created_by?.id}
                  className="form-select form-control borderRaduis"
                  value={formData.todoType}
                  onChange={handleInputChange}
                >
                  {props?.todoTabs?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{props?.selectedData?.todo_type?.name}</p>
              )}
            </div>
          </div>
          {props?.selectedData?.todo_type?.name === "Feedback:" && (
            <div className="row form-group align-items-center">
              <div className="col-md-2 text-left">
                <span
                  className="d-inline-block text-grey"
                  style={{ fontSize: "14px" }}
                >
                  Ticket No:
                </span>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  readOnly
                  name="ticket_number"
                  className="form-control borderRaduis"
                  value={props?.selectedData?.ticket_number}
                  required
                />
              </div>
            </div>
          )}
          <div className="row form-group align-items-center">
            <div className="col-md-2 text-left">
              <span
                className="d-inline-block text-grey"
                style={{ fontSize: "14px" }}
              >
                Task:
              </span>
            </div>
            <div className="col-md-10">
              {Number(loggedInUser) ==
              Number(props?.selectedData?.created_by?.id) ? (
                <input
                  type="text"
                  name="task"
                  placeholder="Enter Task"
                  className="form-control borderRaduis"
                  value={formData.task}
                  onChange={handleInputChange}
                />
              ) : (
                <div
                  className="icon-text-boxes icon-width "
                  dangerouslySetInnerHTML={{ __html: formData?.task }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: "none",
                    // paddingBlock: "0px",
                  }}
                />
              )}
            </div>
          </div>

          <div className="row form-group align-items-center">
            <div className="col-md-2 align-items-center text-left">
              <span
                className="d-inline-block text-grey"
                style={{ fontSize: "14px" }}
              >
                To Do For:
              </span>
            </div>
            <div className="col-md-10">
              <select
                name="todoFor"
                readOnly
                disabled
                className="form-select form-control borderRaduis"
                value={formData.todoFor}
                onChange={handleInputChange}
              >
                {props?.atorneyStaff?.map((item) => (
                  <option value={item?.id}>{item?.user?.username}</option>
                ))}

                {/* Add options here */}
              </select>
            </div>
          </div>

          <div className="row form-group align-items-center">
            <div className="col-md-2 text-left">
              <span
                className="d-inline-block text-grey"
                style={{ fontSize: "14px" }}
              >
                Due By:
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="date"
                readOnly
                name="dueBy"
                className="form-control borderRaduis"
                value={formData.dueBy}
                required
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row form-group align-items-center">
            <div className="col-md-2 text-left ">
              <span
                className="d-inline-block text-grey no-wrap"
                style={{ fontSize: "14px" }}
              >
                Completed At:
              </span>
            </div>
            <div className="col-md-10">
              <input
                type="date"
                name="completedAt"
                className="form-control borderRaduis"
                required
                value={formData.completedAt}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row form-group align-items-center">
            <div className="col-md-2 text-left ">
              <span
                className="d-inline-block text-grey"
                style={{ fontSize: "14px" }}
              >
                Completion Note:
              </span>
            </div>
            <div className="col-md-10">
              <textarea
                name="completionNote"
                rows="30"
                cols="30"
                style={{ height: "100px" }}
                className="form-control to-do-height-100px borderRaduis"
                value={formData.completionNote}
                onChange={handleInputChange}
                placeholder="Enter Completion Note"
              ></textarea>
            </div>
          </div>

          <div className="row form-group align-items-center">
            <div className="col-md-2 text-left ">
              <span
                className="d-inline-block text-grey "
                style={{ fontSize: "14px" }}
              >
                Completed:
              </span>
            </div>
            <div className="col-md-10 d-flex justify-content-center">
              <input
                type="checkbox"
                name="completed"
                className=""
                checked={formData.completed}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row form-group align-items-center">
            <div className="col-md-10">
              <div className="bg-grey-100 height-35 d-flex justify-content-center text-center align-items-center">
                <div
                  className="font-italic text-black d-flex verification_note"
                  style={{ fontSize: "14px" }}
                >
                  Verified by
                  {/* <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img mx-1">
                    <img src="{% static 'bp_assets/img/avatar.png' %}" alt="" />
                  </span>{" "}
                  <span></span>{" "} */}
                </div>
              </div>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary rounded-0 height-35 d-flex verify_btn"
                // onClick={() => props.handlePostTodo()}
                onClick={() => handleVerified()}
              >
                Verify
              </button>
            </div>
          </div>
        </form>
      </ModalBody>
      <div className="modal-footer border-0 justify-content-between ">
        <button
          type="button"
          className="btn btn-lg btn-secondary text-white"
          onClick={props.hideModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          form="edit_todo_form"
          className="btn btn-success"
          disabled={isSending}
        >
          {isSending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default TodoModalBody;
