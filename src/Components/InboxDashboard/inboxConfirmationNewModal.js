import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Button } from "react-bootstrap";
import "./inbox-modal.css";
import avatarImage from "./../../assets/images/avatar.png";

const InboxConfirmationNewModal = ({
  show,
  onHide,
  taskDocumentPopupData,
  inboxConfirmationContent,
}) => {
  console.log(taskDocumentPopupData);
  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="max-800 modal-dialog-centered "
      contentClassName="custom-modal-new-provider"
      size="lg"
    >
      <div style={{ minHeight: "270px" }}>
        <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
          <Modal.Title
            className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
            id="modal_title"
            style={{ fontSize: "14px", fontWeight: "600" }}
          >
            Confirmation Message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            minHeight: "270px",
            padding: "0px",
            background: " var(--primary-10)",
          }}
        >
          <div className="custom-tab">
            <Tab.Container defaultActiveKey={"inboxConfirmationPopup"}>
              <div className="">
                <Tab.Content>
                  <Tab.Pane
                    style={{
                      minHeight: "250px",
                      background: "var(--primary-10)",
                    }}
                    eventKey="inboxConfirmationPopup"
                  >
                    <div className="d-flex flex-column p-l-5 p-r-5">
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Document Attached to Case:
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {inboxConfirmationContent?.for_client?.first_name}{" "}
                        {inboxConfirmationContent?.for_client?.last_name}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {inboxConfirmationContent?.for_case?.case_type?.name}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        DOI: {inboxConfirmationContent?.for_case?.incident_date}
                      </span>
                    </div>
                    <div
                      className="d-flex justify-content-center  align-items-center"
                      style={{ background: "white", padding: "5px" }}
                    >
                      <div
                        style={{ gap: "5px" }}
                        className="w-100 d-flex align-items-center justify-content-center"
                      >
                        <span className="d-flex align-items-center justify-content-center ic-19">
                          <i className="ic ic-19 ic-file-colored cursor-pointer"></i>
                        </span>
                        <span className="name inbox-modal-fn">
                          {inboxConfirmationContent?.file_name}
                        </span>
                      </div>
                    </div>
                    {taskDocumentPopupData?.data ? (
                      <table className="table table-hover table-borderless table-striped table-earning ">
                        <thead>
                          <tr className="doc-pop-height-25px">
                            <th></th>
                            <th>Case</th>
                            <th>Task</th>
                            <th>Assigned</th>
                            <th>Due By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taskDocumentPopupData?.data?.map((task, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                <p>
                                  {task?.for_client?.last_name}{" "}
                                  {task?.for_client?.first_name}
                                </p>
                                <p>
                                  <span className="d-inline-block text-dark-grey mr-1">
                                    DOI:
                                  </span>{" "}
                                  {task?.for_case?.incident_date}{" "}
                                  {task?.for_case?.case_type
                                    ? task?.for_case?.case_type?.name
                                    : null}
                                </p>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center f-gap-05">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: task["notes"],
                                    }}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex f-gap-05 align-items-center justify-content-center">
                                  <div className="ic ic-19 doc-pop-float-left">
                                    <img
                                      className="doc-pop-position-relative-height-100P output-459 theme-ring"
                                      src={
                                        task?.todo_for?.user?.profile_pic
                                          ? task?.todo_for?.user?.profile_pic
                                          : avatarImage
                                      }
                                      alt="profile"
                                    />
                                  </div>
                                  <div id="previewProfilePic"></div>
                                  <div>
                                    {task.todo_for
                                      ? task.todo_for?.user?.first_name +
                                        " " +
                                        task.todo_for?.user?.last_name
                                      : null}
                                  </div>
                                </div>
                              </td>
                              <td>{task?.due_date ? task?.due_date : null}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : null}
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default InboxConfirmationNewModal;
