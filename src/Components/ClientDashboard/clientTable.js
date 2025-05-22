import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { Modal, Nav, Tab, Table, TabPane } from "react-bootstrap";
import api, { cancelPendingRequests } from "../../api/api";
import "../../../public/BP_resources/css/client-4.css";
import "../../../public/BP_resources/css/litigation.css";
import {
  getCaseId,
  getClientId,
  standardFormatDateTime,
} from "../../../src/Utils/helper";
import avatar from "../../../public/bp_assets/img/avatar_new.svg";
import { ClientDataContext } from "./shared/DataContext";
import TextViewResponseModal from "./modals/clientTableViewTextModal";
import EmailViewResponseModal from "./modals/clientTableViewEmailModal";
import axios from "axios";
import "./ClientTable.css";

const ClientTable = ({
  sortedAllMsgData,
  client,
  isScreen100,
  isScreen90,
  isScreen80,
  isScreen75,
  isScreen57,
  isScreen50,
  isScreen67,
  isScreen50_2,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("email"); // State to track active tab
  const clientId = getClientId();
  const caseId = getCaseId();
  const [allEmails, setAllEmails] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [textMessages, setTextMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const [textViewResponseModalShow, setTextViewResponseModalShow] =
    useState(false);
  const [clickedMessage, setClickedMessage] = useState(null);

  const [EmailViewResponseModalShow, setEmailViewResponseModalShow] =
    useState(false);
  const [clickedEmail, setClickedEmail] = useState(null);

  // Calculate real message counts
  const chatMessageCount = allMessages?.filter(
    (message) => message?.type === "ChatMessage"
  ).length;
  const textMessageCount = allMessages?.filter(
    (message) =>
      message?.type === "TextMessage" || message?.type === "IncomingTextMessage"
  ).length;
  const emailMessageCount = allEmails.length;

  const { isClientDataUpdated, setIsClientDataUpdated } =
    useContext(ClientDataContext);
  const [firstTimeMessageData, setFirstTimeMessageData] = useState(true);

  const navLinkRef = useRef(null);

  useEffect(() => {
    if (navLinkRef.current) {
      navLinkRef.current.id = "client-communication-table-ui-elements";
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/client/all_messages/?client_id=${clientId}&case_id=${caseId}`,
        {
          headers: { Authorization: token },
        }
      );
      if (firstTimeMessageData) {
        const updatedMessages = response?.data?.all_messages.map((message) => {
          if (message.hasOwnProperty("phone_no:")) {
            message.phone_no = message["phone_no:"];
            delete message["phone_no:"];
          }
          return message;
        });
        setAllMessages(updatedMessages);
        setFirstTimeMessageData(false);
      }
      if (isClientDataUpdated) {
        const updatedMessages = response?.data?.all_messages.map((message) => {
          if (message.hasOwnProperty("phone_no:")) {
            message.phone_no = message["phone_no:"];
            delete message["phone_no:"];
          }
          return message;
        });
        setAllMessages(updatedMessages);
        isClientDataUpdated(false);
      }
      if (allMessages.length > 0) {
        setChatMessages(
          allMessages.map((message) => {
            if (message.hasOwnProperty("phone_no:")) {
              message.phone_no = message["phone_no:"];
              delete message["phone_no:"];
            }
            if (message.type === "ChatMessage") {
              return message;
            }
          })
        );
        setTextMessages(
          allMessages.map((message) => {
            if (message.hasOwnProperty("phone_no:")) {
              message.phone_no = message["phone_no:"];
              delete message["phone_no:"];
            }
            if (message.type === "TextMessage") {
              return message;
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmailsAPI = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/client-page/fetch-mails/${clientId}/`,
        {
          headers: { Authorization: token },
        }
      );
      if (firstTimeMessageData) {
        setAllEmails(response.data);
        setFirstTimeMessageData(false);
      }
      if (isClientDataUpdated) {
        setAllEmails(response.data);
        isClientDataUpdated(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchEmailsAPI();
    if (isClientDataUpdated) {
      setIsClientDataUpdated(false);
    }

    return () => {
      cancelPendingRequests();
    };
  }, [clientId, caseId, isClientDataUpdated, allEmails, allMessages]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId); // Update active tab when clicked
  };

  const handleTextMessageClick = (message) => {
    console.log("Clicked message:", message);
    setTextViewResponseModalShow(true);
    setClickedMessage(message);
  };

  const handleCloseTextViewResponseModal = () => {
    setTextViewResponseModalShow(false);
    setClickedMessage(null);
  };

  const handleEmailMessageClick = (email) => {
    console.log("Clicked email:", email);
    setEmailViewResponseModalShow(true);
    setClickedEmail(email);
  };

  const handleCloseEmailViewResponseModal = () => {
    setEmailViewResponseModalShow(false);
    setClickedEmail(null);
  };

  // Initialize fake rows based on screen size
  const initialFakeRows = isScreen100
    ? 30
    : isScreen90
      ? 26
      : isScreen80
        ? 25
        : isScreen75
          ? 24
          : isScreen67
            ? 20
            : isScreen57
              ? 17
              : isScreen50
                ? 13
                : isScreen50_2
                  ? 13
                  : 10;

  // Subtract real message count from fake rows for each tab
  const chatFakeRows = Math.max(0, initialFakeRows - chatMessageCount);
  const textFakeRows = Math.max(0, initialFakeRows - textMessageCount);
  const emailFakeRows = Math.max(0, initialFakeRows - emailMessageCount);

  return (
    <div>
      {/* Nav Tabs Email, Text, Chat */}

      <Tab.Container defaultActiveKey={"chat"}>
        <div>
          <Nav
            className="nav nav-tabs flex-nowrap  background-main-10"
            id="nav-tab"
            role="tablist"
            style={{ width: "100%" }}
          >
            <Nav.Link
              ref={navLinkRef}
              eventKey="chat"
              className="client-table-nav-tabs nav-item nav-link first-child"
              data-force-id="client-communication-table-ui-elements"
            >
              <i className="ic ic-19 ic-chat-3d"></i>
              <span className="text">Chat</span>
            </Nav.Link>
            <Nav.Link
              eventKey="text"
              className="client-table-nav-tabs nav-item nav-link"
            >
              <i className="ic ic-19 ic-sms-3d"></i>
              <span className="text">Text</span>
            </Nav.Link>
            <Nav.Link
              eventKey="email"
              className="client-table-nav-tabs nav-item nav-link m-r-1"
            >
              <i className="ic ic-19 ic-email-3d"></i>
              <span className="text">Email</span>
            </Nav.Link>
            <div
              className="height-25 d-flex justify-content-center"
              style={{
                paddingTop: "3px",
                width: isScreen100 ? "70%" : "75%",
                backgroundColor: "var(--primary-15)",
              }}
            >
              <h4 className="client-contact-title d-flex h-100">
                Client Communication
              </h4>
            </div>
          </Nav>
        </div>
        <Tab.Content
          style={{
            height: isScreen50
              ? "34rem"
              : isScreen50_2
                ? "34rem"
                : isScreen57
                  ? "41.5rem"
                  : isScreen67
                    ? "49rem"
                    : isScreen75
                      ? "57rem"
                      : isScreen80
                        ? "51rem"
                        : isScreen90
                          ? "65rem"
                          : isScreen100
                            ? "70rem"
                            : "30rem",
            scrollbarWidth: "none",
          }}
        >
          <TabPane eventKey={"chat"}>
            <div
              className="tab-pane fade show active cutom1111"
              id="client-tab-content"
              role="tabpanel"
              aria-labelledby="client-tab"
            >
              {/* Chat Tab */}

              {/* added this table to make the header separate to put the scroll this table just showing body */}
              <div
                className="table--no-card rounded-0 border-0 w-100 custom1212"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                <table className="table table-borderless table-striped table-earning">
                  <thead className="sticked-head">
                    <tr id="tb-header">
                      <th scope="col" className="width-1"></th>
                      <th className="width-6-padding-left-42 text-center">
                        Sent by
                      </th>
                      <th className="width-6 text-center">Sent To</th>
                      <th className="width-6 text-center">Received</th>
                      <th className="width-1"></th>
                      <th className="width-78 text-center">Message</th>
                    </tr>
                  </thead>

                  <tbody id="group_chat_body">
                    {allMessages.length > 0 ? (
                      allMessages?.map((message, index) => {
                        if (message?.type === "ChatMessage") {
                          return (
                            <tr key={message?.obj?.id}>
                              {/* Counter */}
                              <td scope="row">{index + 1}</td>

                              {/* Sent by */}
                              {message?.obj?.user?.bp_userprofile
                                ?.account_type === "Attorney" ? (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.user?.bp_userprofile
                                      ?.bp_attorney_userprofile?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.user.bp_userprofile
                                            ?.bp_attorney_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Attorney Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.user?.first_name} ${message?.obj?.user?.last_name}`}
                                  </span>
                                </td>
                              ) : (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.user
                                      ?.bp_attorneystaff_userprofile
                                      ?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.user
                                            ?.bp_attorneystaff_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Staff Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.user?.first_name || ""} ${message?.obj?.user?.last_name || ""}`}
                                  </span>
                                </td>
                              )}

                              {/* Sent To */}
                              <td className="td-autosize"></td>

                              {/* Received */}
                              <td className="white-space-nowrap">
                                {new Date(
                                  message?.obj?.timestamp
                                ).toLocaleDateString()}{" "}
                                <b className="text-transform-font-weight">
                                  {new Date(
                                    message?.obj?.timestamp
                                  ).toLocaleTimeString()}
                                </b>
                              </td>

                              {/* Icon */}
                              <td className="padding-010">
                                <i className="ic ic-19 ic-chat-3d m-r-5"></i>
                              </td>

                              {/* Message Body */}
                              {message?.obj?.content?.length > 50 ? (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.content?.slice(0, 50)}
                                </td>
                              ) : (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.content?.slice(0, 50)}
                                </td>
                              )}
                            </tr>
                          );
                        }
                        return null; // Return null if condition is not met
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No messages available
                        </td>
                      </tr>
                    )}

                    {[...Array(chatFakeRows)].map((_, index) => (
                      <tr
                        key={`additional-${index}`}
                        className="fake-row-2"
                        style={{ height: "25px" }}
                      >
                        <td colSpan="12">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
          <TabPane eventKey={"text"}>
            <div
              className="tab-pane fade show active cutom1111"
              id="client-tab-content"
              role="tabpanel"
              aria-labelledby="client-tab"
            >
              {/* Chat Tab */}

              {/* added this table to make the header separate to put the scroll this table just showing body */}
              <div className="table--no-card rounded-0 border-0 w-100 custom1212">
                <table className="table table-borderless table-striped table-earning">
                  <thead className="sticked-head">
                    <tr id="tb-header">
                      <th scope="col" className="width-1"></th>
                      <th className="width-6-padding-left-42 text-center">
                        From
                      </th>
                      <th className="width-6 text-center">To</th>
                      <th className="width-6 text-center">Date</th>
                      <th className="width-1"></th>
                      <th className="width-78 text-center">Message</th>
                    </tr>
                  </thead>
                  <tbody id="group_chat_body">
                    {allMessages.length > 0 ? (
                      allMessages?.map((message, index) => {
                        if (
                          message?.type === "TextMessage" ||
                          message?.type === "IncomingTextMessage"
                        ) {
                          return (
                            <tr
                              key={message?.obj?.id}
                              onClick={() => handleTextMessageClick(message)}
                            >
                              {/* Counter */}
                              <td className="vertical-top" scope="row">
                                {index + 1}
                              </td>

                              {/* From */}
                              {message?.obj?.sender?.bp_userprofile
                                ?.account_type === "Attorney" ? (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.sender?.bp_userprofile
                                      ?.bp_attorney_userprofile?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.sender.bp_userprofile
                                            ?.bp_attorney_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Attorney Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.sender?.first_name} ${message?.obj?.sender?.last_name}`}
                                  </span>
                                </td>
                              ) : (
                                <td className="text-black td-autosize d-flex align-items-center">
                                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {message?.obj?.sender
                                      ?.bp_attorneystaff_userprofile
                                      ?.profile_pic ? (
                                      <img
                                        className="theme-ring"
                                        src={
                                          message?.obj?.sender
                                            ?.bp_attorneystaff_userprofile
                                            ?.profile_pic
                                        }
                                        alt="Staff Avatar"
                                      />
                                    ) : (
                                      <img
                                        className=""
                                        src={avatar}
                                        alt="Default Avatar"
                                      />
                                    )}
                                  </span>
                                  <span className="ml-2 text-black">
                                    {`${message?.obj?.sender?.first_name || ""} ${message?.obj?.sender?.last_name || ""}`}
                                  </span>
                                </td>
                              )}

                              {/* Sent To */}
                              <td className="vertical-top td-autosize">
                                {message?.phone_no}
                              </td>

                              {/* Received */}
                              <td className="vertical-top white-space-nowrap">
                                {new Date(
                                  message?.obj?.created_at
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                <b className="text-transform-font-weight">
                                  {new Date(
                                    message?.obj?.created_at
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </b>
                              </td>

                              {/* Icon */}
                              <td className="vertical-top padding-010">
                                <i className="ic ic-19 ic-sms-3d m-r-5"></i>
                              </td>

                              {/* Message Body */}
                              {message.obj.body.length > 50 ? (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.body?.slice(0, 50)}
                                </td>
                              ) : (
                                <td className="text-black white-space-text-overflow text-left">
                                  {message?.obj?.body?.slice(0, 50)}
                                </td>
                              )}
                            </tr>
                          );
                        }
                        return null; // Return null if condition is not met
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No messages available
                        </td>
                      </tr>
                    )}

                    {[...Array(textFakeRows)].map((_, index) => (
                      <tr
                        key={`additional-${index}`}
                        className="fake-row-2"
                        style={{ height: "25px" }}
                      >
                        <td colSpan="12">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
          <TabPane eventKey={"email"}>
            <div
              className="tab-pane fade show active cutom1111"
              id="client-tab-content"
              role="tabpanel"
              aria-labelledby="client-tab"
            >
              {/* Added table to the email tab, similar to Chat and Text tabs */}
              <div className="table--no-card rounded-0 border-0 w-100 custom1212">
                <table className="table table-borderless table-striped table-earning ">
                  <thead className="sticked-head">
                    <tr id="tb-header">
                      <th scope="col" className="width-1"></th>
                      <th className="width-6-padding-left-42 text-center">
                        From
                      </th>
                      <th className="width-6 text-center">To</th>
                      <th className="width-6 text-center">Date</th>
                      <th className="width-10 text-center">Subject</th>
                      <th className="width-78 text-center">Message</th>
                    </tr>
                  </thead>
                  <tbody id="group_chat_body">
                    {allEmails.length > 0 ? (
                      allEmails.map((email, index) => (
                        <tr
                          key={index}
                          onClick={() => handleEmailMessageClick(email)}
                        >
                          {/* Row Number */}
                          <td className="vertical-top" scope="row">
                            {index + 1}
                          </td>

                          {/* Sender */}
                          <td className="text-black text-left vertical-top">
                            {email.sender}
                          </td>

                          {/* Recipient */}
                          <td className="text-black text-left white-space-text-overflow vertical-top">
                            {email.recipient}
                          </td>

                          {/* Date Received */}
                          <td className="vertical-top white-space-nowrap">
                            {new Date(email.date_received).toLocaleDateString(
                              "en-US",
                              {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}{" "}
                            <b className="text-transform-font-weight">
                              {new Date(email.date_received).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </b>
                          </td>

                          {/* Subject */}
                          <td className="email-subject-col text-black white-space-text-overflow text-left vertical-top">
                            {email.subject}
                          </td>

                          {/* Message Body */}
                          <td className="text-black white-space-text-overflow text-left vertical-top">
                            {(email.body.length > 100
                              ? `${email.body.slice(0, 100)}...`
                              : email.body
                            )
                              .split("\n")
                              .map((line, i) => (
                                <span key={i}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No emails available
                        </td>
                      </tr>
                    )}

                    {[...Array(emailFakeRows)].map((_, index) => (
                      <tr
                        key={`additional-${index}`}
                        className="fake-row-2"
                        style={{ height: "25px" }}
                      >
                        <td colSpan="12">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
        </Tab.Content>
      </Tab.Container>

      <TextViewResponseModal
        show={textViewResponseModalShow}
        handleClose={handleCloseTextViewResponseModal}
        message={clickedMessage}
        // sendResponse={handleCloseTextViewResponseModal}
      />
      <EmailViewResponseModal
        show={EmailViewResponseModalShow}
        handleClose={handleCloseEmailViewResponseModal}
        email={clickedEmail}
        // sendResponse={handleCloseEmailViewResponseModal}
      />
    </div>
  );
};

export default ClientTable;
