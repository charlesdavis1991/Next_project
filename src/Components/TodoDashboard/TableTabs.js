import React, { useState } from "react";
import ClientModal from "../Modals/clientModal";
import EmailModal from "../Modals/emailModal";
import TextModal from "../Modals/textModal";
import { useSelector } from "react-redux";
import TodoModal from "../Modals/TodoModal";
import ChatModal from "../Modals/ChatModal";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import incidentIcon from "../../assets/images/incident.svg";

const TableTabs = ({ todoTypes, selectdedTab, columnWidths }) => {
  // States
  const [customModalShow, setcustomModalShow] = useState(false);
  const [textModalShow, setTextModalShow] = useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);
  const [userInforModal, setUserInfoModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatData, setChatData] = useState(null);

  // Handlers
  const showCustomModal = (event) => {
    event.preventDefault();
    setcustomModalShow(!customModalShow);
  };
  const showTextModal = (event) => {
    event.preventDefault();
    setTextModalShow(!textModalShow);
  };

  const showEmailModal = (event) => {
    event.preventDefault();
    setEmailModalShow(!emailModalShow);
  };

  const openModel = (index, rowData) => {
    setUserInfoModal(true);
  };

  const openChatModel = (event, data) => {
    if (event) {
      event.stopPropagation();
    }
    setChatData(data);
    setChatModal(!chatModal);
  };

  const handleSendMessage = () => {};

  console.log("selectdedTab", selectdedTab, todoTypes);
  console.log(todoTypes[selectdedTab - 1]?.todo_data);

  return (
    <div
      class="to-dotable table-responsive table--no-card position-relative has-tint-rows has-tint-h-45 has-tint-top-25 overflow-hidden"
      style={{ border: "none" }}
    >
      {/* Table content */}
      <table class="table table-hover table-borderless  table-striped table-earning position-relative z-index-1  table-to-do">
        <thead>
          <tr style={{ overflow: "scroll" }} id="tb-header">
            <th></th>
            <th className=" text-center">CREATED BY</th>
            <th
              className=" text-center"
              style={{ width: `${columnWidths[2]}px` }}
            >
              CASE
            </th>
            {/* <th className=" text-center"></th> */}
            <th class="table-col-5 text-center">Task</th>

            <th className=" text-center">RELATED DOCUMENTS</th>
            <th class="table-col-7 text-center">Assigned To</th>
            <th class=" text-center">Due By</th>

            <th className=" text-center">COMPLETED BY</th>
          </tr>
        </thead>
        <tbody style={{ overflow: "scroll" }}>
          {todoTypes[selectdedTab - 1]?.todo_data?.length ? (
            todoTypes[selectdedTab - 1]?.todo_data?.map((record, index) => (
              <tr key={index} style={{ height: "84px" }}>
                <td className="" style={{ width: `${columnWidths[0] - 10}px` }}>
                  <div
                    style={{ width: `${columnWidths[0] - 10}px` }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    {index + 1}
                  </div>
                </td>

                <td className="" style={{ width: `${columnWidths[1] - 10}px` }}>
                  {record?.initiated_by?.profile_pic ? (
                    <span
                      style={{ width: `${columnWidths[1] - 10}px` }}
                      className="d-flex align-items-center"
                      onClick={(event) =>
                        openModel(
                          event,
                          `${record?.initiated_by?.first_name} ${record?.initiated_by?.last_name}`,
                          record?.initiated_by?.profile_pic,
                          record?.initiated_by?.id,
                          "no",
                          ""
                        )
                      }
                    >
                      {record?.initiated_by?.profile_pic ? (
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            // className={`output-${user?.id} theme-ring`}
                            src={record?.initiated_by?.profile_pic}
                            alt=""
                          />
                        </span>
                      ) : (
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            className="output-3 theme-ring"
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                            alt="Avatar"
                          />
                        </span>
                      )}
                      {/* <div id="previewProfilePic"></div> */}
                      <span className="ml-2 text-black">
                        {record?.initiated_by?.first_name}{" "}
                        {record?.initiated_by?.last_name}
                      </span>
                    </span>
                  ) : (
                    <span
                      style={{ width: `${columnWidths[1] - 10}px` }}
                      className="d-flex align-items-center"
                      onClick={(event) =>
                        openModel(
                          event,
                          `${record?.initiated_by?.first_name} ${record?.initiated_by?.last_name}`,
                          "",
                          record?.initiated_by?.id,
                          "no",
                          ""
                        )
                      }
                    >
                      <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img
                          class="output-3"
                          src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                        />
                      </span>
                      {/* <div id="previewProfilePic"></div> */}
                      <span className="ml-2 text-black">
                        {record?.initiated_by?.first_name}{" "}
                        {record?.initiated_by?.last_name}
                      </span>
                    </span>
                  )}
                </td>

                <td style={{ width: `${columnWidths[2] - 10}px` }}>
                  <div style={{ width: `${columnWidths[2] - 10}px` }}>
                    <div
                      className="d-flex align-items-center client-name-box account_text-ellipsis"
                      style={{ height: "21px" }}
                    >
                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                        {record?.for_client?.profile_pic_19p ? (
                          <img
                            className="output-3 theme-ring"
                            src={record?.for_client?.profile_pic_19p}
                            alt="Profile Pic"
                          />
                        ) : (
                          <img
                            class="output-3"
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        )}
                      </span>
                      <span className="ml-2 text-black text-black-2 whitespace-nowrap text-nowrap account_text-ellipsis font-600">
                        {record?.for_client?.first_name}{" "}
                        {record?.for_client?.last_name}
                      </span>
                    </div>
                    <div className="d-flex" style={{ height: "21px" }}>
                      {/* <span className="d-inline-block text-grey mr-1">DOB</span> */}
                      <img src={bdayIcon} className="MR8H19" />
                      {/* {record?.for_case?.incident_date} */}

                      <div className="MR8H19 text-darker account_text-ellipsis text-nowrap">
                        {new Date(
                          record?.for_client?.birthday
                        ).toLocaleDateString("en-US")}
                      </div>
                    </div>
                    {/* <div className="text-darker account_text-ellipsis text-nowrap">
                  <img src={bdayIcon} className="MR8H19" />
                  {record?.for_client?.birthday}
                </div> */}
                    <div className="">
                      <div className="d-flex" style={{ height: "21px" }}>
                        {record?.for_case?.case_type?.casetype_icon ? (
                          <>
                            <img
                              className="MR8H19"
                              src={record?.for_case?.case_type?.casetype_icon}
                              alt="Case Type Icon"
                            />
                            <div className="MR8H19">
                              {record?.for_case?.case_type?.name}
                            </div>
                          </>
                        ) : (
                          <div className="MR8H19">
                            {record?.for_case?.case_type?.name}
                          </div>
                        )}
                      </div>
                      <div
                        className="d-flex"
                        style={{ height: "21px", marginBlock: "-2px" }}
                      >
                        {/* <span className="d-inline-block text-grey mr-1">DOB</span> */}
                        <img src={incidentIcon} className="MR8H19" />
                        {/* {record?.for_case?.incident_date} */}

                        <div className="MR8H19 text-darker text-nowrap">
                          {record?.for_case?.incident_date}
                        </div>
                      </div>

                      {/* <div className="text-darker text-nowrap">
                    <img src={incidentIcon} className="MR8H19" />
                    {record?.for_case?.incident_date}
                  </div> */}
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    height: "80px",
                    marginBlock: "15px",
                    width: `${columnWidths[3] - 10}px`,
                  }}
                >
                  <div
                    className="d-flex flex-column align-items-start gap-1"
                    style={{ width: `${columnWidths[3] - 10}` }}
                  >
                    {record?.todo_type?.tab_name === "Feedback" && (
                      <div
                        className="text-center"
                        style={{ marginInline: "auto", fontSize: "10px" }}
                      >
                        Ticket Number: {record?.ticket_number}
                      </div>
                    )}
                    <div
                      className="text-center"
                      style={{ marginInline: "auto", fontWeight: "600" }}
                    >
                      {record?.todo_type?.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        paddingBlock: "0px",
                        marginInline: "auto",
                      }}
                      className="icon-text-boxes fulWidth"
                      dangerouslySetInnerHTML={{ __html: record?.notes }}
                    ></div>
                  </div>
                </td>
                <td className="">
                  <div style={{ width: `${columnWidths[4] - 10}px` }}></div>
                </td>

                <td style={{ width: `${columnWidths[2] - 10}px` }}>
                  <div
                    className="d-flex align-items-start"
                    style={{ width: `${columnWidths[5] - 10}px` }}
                  >
                    <div className="d-flex flex-column">
                      {record.todo_for.profile_pic ? (
                        <div
                          className="d-flex align-items-center"
                          onClick={(e) => openChatModel(e, record)}
                        >
                          <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img">
                            <img
                              src={record.todo_for.profile_pic}
                              className="output-3 theme-ring"
                              alt="avatar"
                            />
                          </span>
                          <div id="previewProfilePic"></div>
                          <div className="d-flex flex-column">
                            <div className="ml-2 text-black">
                              {record.todo_for.user.first_name}{" "}
                              {record.todo_for.user.last_name}
                            </div>
                            <div className="ml-2 text-black">
                              {new Date(record?.created_at).toLocaleDateString(
                                "en-US"
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center"
                          onClick={(e) => openChatModel(e, record)}
                        >
                          <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img">
                            <img
                              className="output-3 theme-ring"
                              src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                              alt="Avatar"
                            />
                          </span>
                          <div id="previewProfilePic"></div>
                          <div className="d-flex flex-column">
                            <div className="ml-2 text-black">
                              {record.todo_for.user.first_name}{" "}
                              {record.todo_for.user.last_name}
                            </div>
                            <div className="ml-2 text-black">
                              {new Date(record?.created_at).toLocaleDateString(
                                "en-US"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td
                  className=" whitespace-nowrap"
                  style={{ width: `${columnWidths[2] - 10}px` }}
                >
                  <div
                    style={{ width: `${columnWidths[6] - 10}px` }}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {record?.due_date &&
                      new Date(record?.due_date).toLocaleDateString("en-US")}
                  </div>
                </td>

                <td className="" style={{ width: `${columnWidths[2] - 10}px` }}>
                  {record?.completed_at ? (
                    <span
                      className="d-flex align-items-center"
                      style={{ width: `${columnWidths[7] - 10}px` }}
                      // style={{ marginLeft: "20%" }}
                    >
                      {record?.id && record?.id?.check_verification ? (
                        record?.id && record?.id?.check_profile_pic ? (
                          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5">
                            <img
                              class="output-3"
                              style={{ width: "19px", height: "19px" }}
                              src={record?.id?.check_profile_pic}
                            />
                          </span>
                        ) : (
                          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5">
                            <img
                              class="output-3"
                              style={{ width: "19px", height: "19px" }}
                              src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                            />
                          </span>
                        )
                      ) : (
                        <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5">
                          <img
                            class="output-3"
                            style={{ width: "19px", height: "19px" }}
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        </span>
                      )}
                      <span
                        className="text-black font-weight-bold "
                        id="treatment_second_date4"
                        // style={{ marginLeft: "20%" }}
                      >
                        {new Date(record?.completed_at).toLocaleDateString(
                          "en-US"
                        )}
                      </span>
                      {record?.id && record?.id?.check_verification ? (
                        <i className="ic ic-verified ic-19 m-l-5"></i>
                      ) : (
                        <i className="ic ic-unverified ic-19 m-l-5"></i>
                      )}
                    </span>
                  ) : (
                    <span
                      style={{ width: `${columnWidths[7] - 10}px` }}
                      className="d-flex align-items-center mt-2"
                      // style={{ marginLeft: "20%" }}
                    >
                      <img
                        className="output-3"
                        style={{ width: "19px", height: "19px" }}
                        src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                      />{" "}
                      &nbsp; <p className="text-white">____________</p>
                      <i className="ic ic-unverified ic-19 m-l-5"></i>
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>
                <div style={{ width: `${columnWidths?.[0] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[1] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[2] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[3] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[4] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[5] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[6] - 10}px` }}></div>
              </td>
              <td>
                <div style={{ width: `${columnWidths?.[7] - 10}px` }}></div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="tabsModal">
        {/* <TodoModal
          show={userInforModal}
          onHide={() => setUserInfoModal(false)}
        /> */}

        <ChatModal
          data={chatData}
          isOpen={chatModal}
          handleOpen={openChatModel}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default TableTabs;
