import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import { getClientId, getToken } from "../../Utils/helper";

const FirmUserModal = ({ show, handleClose, doc_id, caseId }) => {
  if (!caseId || !caseId.id) {
    console.error("caseId is undefined");
    return null;
  }

  const [firmUsersNotes, setFirmUsersNotes] = useState([]);
  const [clickRecordsDate, setClickRecordsDate] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const origin = process.env.REACT_APP_BACKEND_URL;
  const clientId = getClientId();
  console.log("clientId in injury : ", clientId);

  useEffect(() => {
    if (show) {
      fetchFirmUsersNotes();
    }
  }, [show]);

  const fetchFirmUsersNotes = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/firm-users-notes-and-case/?case_id=${caseId.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );
      const data = response.data;
      setFirmUsersNotes(data.firm_users_notes);
      setClickRecordsDate(data.click_records_date);
    } catch (error) {
      console.error("Error fetching firm users data:", error);
    }
  };

  const closeDocumentPreviewModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleAddTaskDocPopUp = async () => {
    const checkboxes = document.querySelectorAll(".todo_popup_checkbox");
    const users_ids = new Set();

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const user_id = checkbox.getAttribute("user_id");
        if (user_id) {
          users_ids.add(user_id);
        }
      }
    });

    const uniqueUserIds = Array.from(users_ids);

    console.log("clientId in todo popup : ", clientId);

    handleClose();
    setConfirmationModalOpen(true);

    try {
      const response = await axios.post(
        `${origin}/api/add_task_document_popup/${clientId}/${caseId.id}/`,
        {
          user_id: JSON.stringify(uniqueUserIds),
          doc_id: doc_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getToken(),
          },
        }
      );

      const res = response.data;

      if (res.length > 0) {
        const taskHtml = res.map((item, index) => {
          const client = item.for_client
            ? `${item.for_client.last_name} ${item.for_client.first_name}`
            : "";
          const todo_for = item.todo_for
            ? `${item.todo_for.user.first_name} ${item.todo_for.user.last_name}`
            : "";
          const case_data = item.for_case
            ? `<span class="d-inline-block text-dark-grey mr-1">DOI:</span>${item.for_case.incident_date} ${item.for_case.case_type?.name || ""}`
            : "";

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="td-autosize">
                <p>{client}</p>
                <p>{case_data}</p>
              </td>
              <td className="td-autosize align-items-center">
                <div className="float-left d-flex align-items-center">
                  {item.notes}
                </div>
              </td>
              <td className="doc-pop-width-18P-padding-0px">
                <div className="ic ic-29 doc-pop-float-left">
                  <img
                    className="doc-pop-position-relative-height-100P"
                    src={item.todo_for?.profile_pic || ""}
                  />
                </div>
                <div className="ml-25">{todo_for}</div>
              </td>
              <td className="doc-pop-white-space-nowrap">{item.due_date}</td>
            </tr>
          );
        });

        setTaskData({
          length: res.length,
          html: taskHtml,
        });

        setConfirmationModalOpen(true);
        handleClose();
      }
    } catch (error) {
      console.error("Error in assigning tasks:", error);
    }
  };

  const isUserInCase = (firmUser) => {
    return [
      caseId.firm_user1,
      caseId.firm_user2,
      caseId.firm_user3,
      caseId.firm_user4,
      caseId.firm_user5,
      caseId.firm_user6,
    ].some((caseFirmUser) => caseFirmUser?.id === firmUser.id);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header
          closeButton
          className="text-center height-35 p-0 bg-primary rounded-0 border-0"
        >
          <Modal.Title className="mx-auto text-white text-upper height-35">
            Request Review Of This Document From:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0px" }}>
          <h4 className="client-contact-title d-flex justify-content-center align-items-center height-25 text-center bg-white">
            Firm Users Assigned to Case
          </h4>
          <div className="d-flex background-main-2">
            <div className="table-responsive table--no-card rounded-0 border-0 has-gradient-separator position-relative">
              <Table className="table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
                <tbody>
                  <tr>
                    <td style={{ width: "50%" }}>
                      <Table>
                        {[
                          caseId.firm_user1,
                          caseId.firm_user2,
                          caseId.firm_user3,
                        ].map((firmUser, index) =>
                          firmUser ? (
                            <tr key={index}>
                              <td id="padding-l-15">
                                {firmUser.for_firmusertype?.name || ""}
                              </td>
                              <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex">
                                  <Button
                                    variant="link"
                                    data-toggle="modal"
                                    className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g"
                                  >
                                    <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                      {firmUser?.profile_pic ? (
                                        <img
                                          src={`${origin}${firmUser.profile_pic}`}
                                        />
                                      ) : (
                                        <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></div>
                                      )}
                                    </div>
                                    <div className="ml-2">
                                      {firmUser?.user?.first_name}{" "}
                                      {firmUser?.user?.last_name}
                                    </div>
                                  </Button>
                                </div>
                              </td>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="custom-control custom-checkbox m-l-10">
                                    <input
                                      type="checkbox"
                                      className="todo_popup_checkbox"
                                      user_id={firmUser?.id}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="text-end">
                                {clickRecordsDate.map(
                                  (click) =>
                                    firmUser?.id === click.user?.id &&
                                    click.created_at
                                )}
                              </td>
                            </tr>
                          ) : null
                        )}
                      </Table>
                    </td>

                    <td style={{ width: "50%" }}>
                      <Table>
                        {[
                          caseId.firm_user4,
                          caseId.firm_user5,
                          caseId.firm_user6,
                        ].map((firmUser, index) =>
                          firmUser ? (
                            <tr key={index}>
                              <td id="padding-l-15">
                                {firmUser.for_firmusertype?.name || ""}
                              </td>
                              <td className="td-autosize d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex">
                                  <Button
                                    variant="link"
                                    data-toggle="modal"
                                    className="btn d-flex align-items-center justify-content-center padding-transform-visibility-margin p-0 flex-g"
                                  >
                                    <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                      {firmUser?.profile_pic ? (
                                        <img
                                          src={`${origin}${firmUser.profile_pic}`}
                                        />
                                      ) : (
                                        <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></div>
                                      )}
                                    </div>
                                    <div className="ml-2 flex-g">
                                      {firmUser?.user?.first_name}{" "}
                                      {firmUser?.user?.last_name}
                                    </div>
                                  </Button>
                                </div>
                              </td>
                              <td>
                                <div class="d-flex align-items-center">
                                  <div class="custom-control custom-checkbox m-l-10">
                                    <input
                                      type="checkbox"
                                      className="todo_popup_checkbox"
                                      user_id={firmUser?.id}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="text-end">
                                {clickRecordsDate.map(
                                  (click) =>
                                    firmUser?.id === click.user?.id &&
                                    click.created_at
                                )}
                              </td>
                            </tr>
                          ) : null
                        )}
                      </Table>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          <h4 className="client-contact-title text-center bg-white">
            Other Firm Users
          </h4>
          <div className="d-flex">
            <div className="dis-grid height-">
              {firmUsersNotes.map(
                (firmUser, index) =>
                  !isUserInCase(firmUser) && (
                    <div
                      className="td-autosize d-flex justify-content-between align-items-center w-100 height-35"
                      key={index}
                    >
                      <div className="d-flex align-items-center">
                        {firmUser.profile_pic ? (
                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                            <img src={`${origin}${firmUser.profile_pic}`} />
                          </span>
                        ) : (
                          <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                        )}
                        <span className="ml-2 color-black">
                          {firmUser.user?.first_name} {firmUser.user?.last_name}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        id={`todo_popup_checkbox_${index}`}
                        className="todo_popup_checkbox"
                        user_id={firmUser.id}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between bg-white pt-2 pb-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddTaskDocPopUp}>
            Request Document Review
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      {taskData && (
        <Modal
          show={confirmationModalOpen}
          onHide={closeDocumentPreviewModal}
          size="xxl"
          className="modal-fullscreen-xl"
        >
          <Modal.Header className="modal-header text-center" closeButton>
            <Modal.Title className="mx-auto">
              You assigned tasks to {taskData.length} users
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-hover table-borderless table-striped table-earning">
              <thead>
                <tr className="doc-pop-height-25px">
                  <th></th>
                  <th className="doc-pop-width-8P">Case</th>
                  <th className="doc-pop-width-42P">Task</th>
                  <th className="doc-pop-width-6P-padding-left-52px">
                    Assigned
                  </th>
                  <th>Due By</th>
                </tr>
              </thead>
              <tbody>{taskData.html}</tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <div class="modal-footer border-0 justify-content-between pt-0 ">
              <Button variant="secondary" onClick={closeDocumentPreviewModal}>
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default FirmUserModal;
