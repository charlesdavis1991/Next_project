import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import { getClientId, getToken } from "../../Utils/helper";

const ChatDocLinkModal = ({ show, handleClose, doc_id, caseId }) => {
  if (!caseId || !caseId.id) {
    console.error("caseId is undefined");
    return null;
  }

  const [firmUsersNotes, setFirmUsersNotes] = useState([]);
  const [clickRecordsDate, setClickRecordsDate] = useState([]);
  const [uniqueDictionaries, setUniqueDictionaries] = useState([]);
  const [taskData, setTaskData] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [userListHtml, setUserListHtml] = useState("");

  const origin = process.env.REACT_APP_BACKEND_URL;
  const clientId = getClientId();

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

  function removeDuplicateDictionaries(list) {
    const uniqueDicts = [];
    const seen = new Set();

    for (const item of list) {
      const identifier = JSON.stringify(item);
      if (!seen.has(identifier)) {
        seen.add(identifier);
        uniqueDicts.push(item);
      }
    }

    return uniqueDicts;
  }

  const submitFirmUserMessage = () => {
    const checkboxes = document.querySelectorAll(".todo_popup_checkbox");
    const user_data = [];
    const users_ids = new Set();

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const user_id = checkbox.getAttribute("user_id");
        const profile_pic = checkbox.getAttribute("profile_pic");
        const user_name = checkbox.getAttribute("username");
        const first_name = checkbox.getAttribute("first_name");
        const last_name = checkbox.getAttribute("last_name");
        const dict = {
          first_name: first_name,
          last_name: last_name,
          user_name: user_name,
          user_id: user_id,
          profile_pic: profile_pic,
        };
        user_data.push(dict);
        users_ids.add(user_id);
      }
    });

    const uniqueUserIds = Array.from(users_ids);
    const uniqueDicts = removeDuplicateDictionaries(user_data);
    setUniqueDictionaries(uniqueDicts);

    let userHtml = "";
    uniqueDicts.forEach((user) => {
      userHtml += `${user.first_name} ${user.last_name} `;
    });

    setUserListHtml(userHtml);

    handleClose();
    setConfirmationModalOpen(true);
  };

  const sendMessage = async () => {
    for (let i = 0; i < uniqueDictionaries.length; i++) {
      const user = uniqueDictionaries[i];
      try {
        const res = await axios.get(`${origin}/30/getThreadInfo/`, {
          params: {
            user_id: user.user_id,
            is_provider_thread: "no",
            client_id: clientId,
          },
          headers: {
            Authorization: getToken(),
          },
        });

        const THREAD_ID = res.data.data;
        const USER_TO = user.user_id;
        const USER_BY = getCurrentUserId();
        const SENDERNAME = user.user_name;

        let finalChatMessage = `${chatMessage} doc_name ${doc_id} doc_id ${doc_id}`;
        const data = {
          message: finalChatMessage,
          sent_by: USER_BY,
          send_to: USER_TO,
          thread_id: THREAD_ID,
          user_name: SENDERNAME,
          profile_pic: user.profile_pic,
        };

        // Send message using WebSocket or HTTP
        socket.send(JSON.stringify(data));
        setConfirmationModalOpen(false);
      } catch (error) {
        console.error("Error in sending message:", error);
      }
    }

    //if (window.location.href.indexOf("simplefirm.com/30/32") === -1) {
    //  localStorage.setItem("docId", doc_id);
    //  window.location.reload();
    //} else {
    //  setConfirmationModalOpen(false);
    //}
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
            CHAT A DOCUMENT LINK TO::
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
                      <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
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
                                      first_name={firmUser?.user?.first_name}
                                      last_name={firmUser?.user?.last_name}
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
                      </table>
                    </td>

                    <td style={{ width: "50%" }}>
                      <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel">
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
                                      first_name={firmUser?.user?.first_name}
                                      last_name={firmUser?.user?.last_name}
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
                      </table>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          {/* Section 2: Other Firm Users */}
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
                        first_name={firmUser?.user?.first_name}
                        last_name={firmUser?.user?.last_name}
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
          <Button variant="success" onClick={submitFirmUserMessage}>
            Send Chat Message With a Link To This Document
          </Button>
        </Modal.Footer>
      </Modal>

      {confirmationModalOpen && (
        <Modal
          show={confirmationModalOpen}
          onHide={() => setConfirmationModalOpen(false)}
        >
          <div className="modal-header">
            <input type="hidden" id="logged-in-user" value="" />
            <h5 className="modal-title" id="avatarModalTitle">
              Send a link for this document to {userListHtml}
            </h5>
          </div>
          <div className="modal-body">
            <label>You can send a chat message below</label>
            <br />
            <label>Type Message:</label>
            <textarea
              className="doc-pop-border-solid-1px-grey-width-100P-padding-10px"
              id="id_chat_message_input"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows="4"
              cols="50"
            ></textarea>
          </div>
          <div className="modal-footer doc-pop-padding-2rem">
            <Button
              type="button"
              variant="success"
              className="btn btn-success sendChatMessage input-group-text send_btn doc-pop-position-absolute-right-14px-background-color-218838-color-white-border-color-218838"
              onClick={sendMessage}
            >
              Send Document Link
            </Button>
            <Button
              type="button"
              variant="danger"
              className="btn btn-danger doc-pop-background-color-grey-border-color-grey-position-absolute-left-14px"
              onClick={() => setConfirmationModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ChatDocLinkModal;
