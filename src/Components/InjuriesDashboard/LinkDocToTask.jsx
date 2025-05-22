import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";

const TodoModal = ({ show, handleClose, caseId, doc_id }) => {
  if (!caseId || !caseId.id) {
    console.error("caseId is undefined");
    return null;
  }

  const [todosContext, setTodosContext] = useState([]);

  const origin = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${origin}/api/todos-list/${caseId.id}/`)
      .then((response) => {
        setTodosContext(response.data.todos_context);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, [show]);

  // LinkTodo function
  const linkTodo = () => {
    const checkboxes = document.querySelectorAll(".custom-control-input");
    const todo_ids = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const todo_id = checkbox.id.split("_").pop();
        todo_ids.push(todo_id);
      }
    });

    console.log(todo_ids);
    console.log(doc_id);

    axios
      .get(`${origin}/30/LinkDocToToDo/`, {
        params: {
          todo_id: JSON.stringify(todo_ids),
          doc_id: doc_id,
        },
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("docId", doc_id);
        handleClose();
        //window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal-fullscreen-xl"
      size="xxl"
      centered
    >
      <Modal.Header className="text-center height-35 p-0 bg-primary rounded-0 border-0">
        <Modal.Title className="mx-auto text-white text-upper height-35">
          Check Box to Link Document With an open task as a relevant document:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="to-dotable table-responsive table--no-card position-relative has-tint-rows has-tint-h-45 has-tint-top-25"
        style={{ padding: "0px", overflow: "auto" }}
      >
        <Table
          hover
          borderless
          striped
          className="table-earning position-relative z-index-1 has-height-25 has-height-td-55"
        >
          <thead>
            <tr id="client-search-tb-head">
              <th></th>
              <th className="text-center">Input By</th>
              <th></th>
              <th className="text-center">Task</th>
              <th className="text-center">Relevant Docs</th>
              <th className="text-center">Assigned To</th>
              <th className="text-center">Due By</th>
              <th className="text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {todosContext && todosContext.length > 0 ? (
              todosContext.map((row, index) => (
                <tr key={row.id}>
                  <td className="td-autosize">{index + 1}</td>
                  <td className="td-autosize">
                    <div
                      className="d-flex align-items-center"
                      onClick={() => openNoteMessageModal(row.created_by)}
                    >
                      {row.created_by?.profile_pic ? (
                        <img
                          className="ic-avatar ic-29 theme-ring"
                          src={`${origin}${row.created_by.profile_pic.url}`}
                        />
                      ) : (
                        <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                      )}
                      <span className="ml-2 text-black">
                        {row.created_by?.first_name} {row.created_by?.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="td-autosize">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="td-autosize">
                    <div className="d-flex">
                      <p className="text-right d-flex align-items-center">
                        {row.todo_type?.name}
                      </p>
                      <div
                        className="d-flex align-items-center icon-text-boxes font-family-universal"
                        dangerouslySetInnerHTML={{ __html: row.notes }}
                      ></div>
                    </div>
                  </td>
                  <td className="td-autosize">
                    <div>
                      {row.docs.map((doc, index) => (
                        <span className="icon-wrap" key={index}>
                          <i className="ic ic-23 ic-file-colored cursor-pointer ml-1 mr-1"></i>
                        </span>
                      ))}

                      {Array(6 - row.docs.length)
                        .fill()
                        .map((_, index) => (
                          <span className="icon-wrap" key={`grey-${index}`}>
                            <i className="ic ic-23 ic-file-grey cursor-pointer ml-1 mr-1"></i>
                          </span>
                        ))}
                    </div>
                  </td>

                  <td className="td-autosize">
                    <div
                      className="d-flex align-items-center"
                      onClick={() => openNoteMessageModal(row.todo_for)}
                    >
                      {row.todo_for?.profile_pic ? (
                        <img
                          className="ic-avatar ic-29 has-avatar-icon has-cover-img"
                          src={`${origin}${row.todo_for.profile_pic}`}
                        />
                      ) : (
                        <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                      )}
                      {row.todo_for?.user ? (
                        <>
                          <span className="ml-2 text-black">
                            {row.todo_for.user.first_name}{" "}
                            {row.todo_for.user.last_name}
                          </span>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </td>
                  <td className="td-autosize">
                    {new Date(row.due_date).toLocaleDateString()}
                  </td>
                  <td className="td-autosize">
                    <div className="custom-control custom-checkbox injury-m-l-65">
                      <input
                        type="checkbox"
                        disabled={row.docs.length > 5}
                        className="custom-control-input"
                        id={`todo_checkbox_${row.id}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`todo_checkbox_${row.id}`}
                      ></label>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3">
                  <div className="fake-rows">
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                    <div className="table-fake-row"></div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between bg-white pt-2 pb-2 p-l-15 p-r-15">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={() => linkTodo()}>
          Link Document
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TodoModal;
