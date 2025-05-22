import React, { useState } from "react";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import incidentIcon from "../../assets/images/incident.svg";

import { useSelector } from "react-redux";

import ChatModal from "../Modals/ChatModal";
import "./todos.css";
import TodoModal from "../Modals/TodoModal";

const CompletedTable = ({
  todos,
  todoTabs,
  completed,
  atorneyStaff,
  columnWidths,
}) => {
  console.log(todos, "sadasd");
  // Redux

  // const { todos_completed } = useSelector((state) => state.todos);

  // States
  const [rowData, setRowData] = useState(null);

  const [chatModal, setChatModal] = useState(false);
  const [chatData, setChatData] = useState(null);
  const [userInforModal, setUserInfoModal] = useState(false);
  // Handlers

  const openModel = (index, rowData) => {
    setUserInfoModal(true);
    setRowData(rowData);
  };
  const openChatModel = (event, data) => {
    if (event) {
      event.stopPropagation();
    }
    setChatData(data);
    setChatModal(!chatModal);
  };

  const handleSendMessage = () => {};

  console.log(rowData, chatModal, "333333");

  return (
    <div
      class="to-dotable table-responsive table--no-card position-relative has-tint-rows has-tint-h-45 has-tint-top-25 overflow-hidden"
      style={{ border: "none" }}
    >
      {/* Table content */}
      <table className="table table-hover table-borderless  table-striped table-earning position-relative z-index-1  table-to-do">
        <thead className="toolbar-fonts">
          <tr id="tb-header">
            <th className="w-4"></th>
            <th className="  text-center">CREATED BY </th>
            <th className=" text-center">CASE</th>
            <th class="text-center">Task</th>

            <th className="text-center">RELATED DOCUMENTS</th>
            <th class=" text-center">Assigned To</th>
            <th class=" text-center">Due By</th>

            <th className=" pl-42 text-center">COMPLETED BY</th>
          </tr>
        </thead>
        <tbody>
          {completed?.length ? (
            completed?.map?.((row, index) => (
              <tr
                key={index}
                data-toggle="modal"
                data-target="#edit_todo"
                onClick={() => openModel(index, row)}
                data-id={row?.id}
                data-type_name={row?.todo_type?.name}
                data-type={row?.todo_type?.id}
                data-task={row?.notes}
                data-todo_for={row?.todo_for?.id}
                data-due_by={row?.due_date}
                data-completed_at={row?.completed_at}
                data-completion_note={row?.completion_note}
                data-completed={row?.complete}
                data-verification={row?.id}
                data-profile_pic={row?.id}
                data-verification_info={row?.id}
                style={{ height: "84px" }}
              >
                <td className="">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: `${columnWidths?.[0] - 10}px` }}
                  >
                    {index + 1}
                  </div>
                </td>

                {row?.created_by?.bp_userprofile?.account_type ===
                "Attorney" ? (
                  row?.created_by?.bp_userprofile?.bp_attorney_userprofile
                    ?.profile_pic !== null ? (
                    <td className="">
                      <span
                        className="d-flex align-items-center"
                        style={{ width: `${columnWidths?.[1] - 10}px` }}
                      >
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            className={`output-${row?.created_by?.id} theme-ring`}
                            src={
                              row?.created_by?.bp_userprofile
                                ?.bp_attorney_userprofile?.profile_pic
                            }
                          />
                        </span>
                        <div id="previewProfilePic"></div>
                        <span className="ml-2 text-black">{`${row?.created_by?.first_name} ${row?.created_by?.last_name}`}</span>
                      </span>
                    </td>
                  ) : (
                    <td className="">
                      <span
                        className="d-flex align-items-center"
                        style={{ width: `${columnWidths?.[1] - 10}px` }}
                      >
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            class="output-3"
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        </span>
                        <div id="previewProfilePic"></div>
                        <span className="ml-2 text-black">{`${row?.created_by?.first_name} ${row?.created_by?.last_name}`}</span>
                      </span>
                    </td>
                  )
                ) : row?.created_by?.bp_attorneystaff_userprofile
                    ?.profile_pic !== null ? (
                  <td className="">
                    <span
                      className="d-flex align-items-center"
                      style={{ width: `${columnWidths?.[1] - 10}px` }}
                    >
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img
                          className={`output-${row?.created_by?.id} theme-ring`}
                          src={
                            row?.created_by?.bp_attorneystaff_userprofile
                              ?.profile_pic
                          }
                        />
                      </span>
                      <div id="previewProfilePic"></div>
                      <span className="ml-2 text-black">{`${row?.created_by?.first_name} ${row?.created_by?.last_name}`}</span>
                    </span>
                  </td>
                ) : (
                  <td className="">
                    <span
                      className="d-flex align-items-center"
                      style={{ width: `${columnWidths?.[1] - 10}px` }}
                    >
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img
                          class="output-3"
                          src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                        />
                      </span>
                      <div id="previewProfilePic"></div>
                      <span className="ml-2 text-black">{`${row?.created_by?.first_name} ${row?.created_by?.last_name}`}</span>
                    </span>
                  </td>
                )}

                <td style={{ padding: 0 }}>
                  <div style={{ width: `${columnWidths?.[2] - 10}px` }}>
                    <div
                      className="d-flex align-items-center client-name-box account_text-ellipsis"
                      style={{ height: "21px" }}
                    >
                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                        {row.for_client?.profile_pic_19p ? (
                          <img
                            className="output-3 theme-ring"
                            src={row.for_client?.profile_pic_19p}
                          />
                        ) : (
                          <img
                            class="output-3"
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        )}
                      </span>
                      <span className="ml-2 text-black text-black-2 whitespace-nowrap text-nowrap account_text-ellipsis font-600">{`${row.for_client?.first_name} ${row.for_client?.last_name}`}</span>
                    </div>
                    <div className="d-flex" style={{ height: "21px" }}>
                      {/* <span className="d-inline-block text-grey mr-1">DOB</span> */}
                      <img src={bdayIcon} className="MR8H19" />
                      {/* {record?.for_case?.incident_date} */}

                      <div className="MR8H19 text-darker account_text-ellipsis text-nowrap">
                        {new Date(row?.for_client?.birthday).toLocaleDateString(
                          "en-US"
                        )}
                      </div>
                    </div>
                    {/* <div className="text-darker account_text-ellipsis text-nowrap">
                  <img src={bdayIcon} className="MR8H19" />
                  {row.for_client?.birthday}
                </div> */}
                    <div className="">
                      <div className="d-flex" style={{ height: "21px" }}>
                        {row.for_case?.case_type?.casetype_icon ? (
                          <>
                            <img
                              src={row.for_case?.case_type?.casetype_icon}
                              className="MR8H19"
                            />
                            <div className="MR8H19">
                              {row?.for_case?.case_type?.name}
                            </div>
                          </>
                        ) : (
                          <div className="MR8H19">
                            {row.for_case?.case_type?.name}
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
                          {row?.for_case?.incident_date}
                        </div>
                      </div>
                      {/* <div className="text-darker text-nowrap">
                    <img src={incidentIcon} className="MR8H19" />
                    {row?.for_case?.incident_date}
                  </div> */}
                    </div>
                  </div>
                </td>

                <td
                  className="d-flex justify-content-center  align-items-center"
                  style={{ height: "80px", marginBlock: "15px" }}
                >
                  <div
                    className="d-flex flex-column align-items-start gap-1"
                    style={{ width: `${columnWidths?.[3] - 10}px` }}
                  >
                    <div
                      className="text-center"
                      style={{ marginInline: "auto", fontWeight: "600" }}
                    >
                      {row?.todo_type?.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        paddingBlock: "0px",
                        marginInline: "auto",
                      }}
                      className="icon-text-boxes fulWidth"
                      dangerouslySetInnerHTML={{ __html: row?.notes }}
                    ></div>
                  </div>
                </td>
                <td className="">
                  <div style={{ width: `${columnWidths?.[4] - 10}px` }}></div>
                </td>
                <td>
                  <div
                    className="d-flex align-items-start"
                    style={{ width: `${columnWidths?.[5] - 10}px` }}
                  >
                    <div className="d-flex flex-column">
                      {row.todo_for.profile_pic ? (
                        <div
                          className="d-flex align-items-center"
                          onClick={(e) => openChatModel(e, row)}
                        >
                          <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img">
                            <img
                              src={row.todo_for.profile_pic}
                              className="output-3 theme-ring"
                              alt="avatar"
                            />
                          </span>
                          <div id="previewProfilePic"></div>
                          <div className="d-flex flex-column">
                            <div className="ml-2 text-black">
                              {row.todo_for.user.first_name}{" "}
                              {row.todo_for.user.last_name}
                            </div>
                            <div className="ml-2 text-black">
                              {new Date(row?.created_at).toLocaleDateString(
                                "en-US"
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center"
                          onClick={(e) => openChatModel(e, row)}
                        >
                          <span className="ic ic-avatar ic-25 has-avatar-icon has-cover-img">
                            <img
                              src="/nouser.webp"
                              className="output-3"
                              alt="default-avatar"
                            />
                          </span>
                          <div id="previewProfilePic"></div>
                          <div className="d-flex flex-column">
                            <div className="ml-2 text-black">
                              {row.todo_for.user.first_name}{" "}
                              {row.todo_for.user.last_name}
                            </div>
                            <div className="ml-2 text-black">
                              {new Date(row?.created_at).toLocaleDateString(
                                "en-US"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: `${columnWidths?.[6] - 10}px` }}
                  >
                    {row?.due_date
                      ? new Date(row?.due_date).toLocaleDateString("en-US")
                      : ""}
                  </div>
                </td>

                <td className="">
                  <div
                    className="d-flex flex-column gap-2"
                    style={{ width: `${columnWidths?.[7] - 10}px` }}
                  >
                    <div
                      className="d-flex align-items-center  flex-row gap-2 mb-2"
                      // style={{ marginLeft: "20%" }}
                    >
                      {row?.completed_by &&
                      row?.completed_by?.bp_attorneystaff_userprofile
                        ?.profile_pic ? (
                        <span
                          className="ic  ic-avatar ic-19 has-avatar-icon has-cover-img "
                          style={{ marginRight: "8px" }}
                        >
                          <img
                            class="output-3"
                            style={{ width: "19px", height: "19px" }}
                            src={
                              row?.completed_by?.bp_attorneystaff_userprofile
                                ?.profile_pic
                            }
                          />
                        </span>
                      ) : row?.completed_by?.first_name ? (
                        <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5">
                          <img
                            class="output-3"
                            style={{ width: "19px", height: "19px" }}
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        </span>
                      ) : null}

                      <span className="">
                        <div className="text-black ">
                          {row?.completed_by &&
                          row?.completed_by?.first_name &&
                          row?.completed_by?.last_name ? (
                            <>
                              {row?.completed_by?.first_name}{" "}
                              {row?.completed_by?.last_name}
                            </>
                          ) : (
                            <>{row?.completed_by?.username}</>
                          )}
                        </div>
                      </span>
                    </div>
                    {row?.completed_at && row?.id ? (
                      <span
                        className="d-flex align-items-center"
                        // style={{ marginLeft: "20%" }}
                      >
                        {row?.completed_by &&
                        row?.completed_by?.bp_attorneystaff_userprofile
                          ?.profile_pic ? (
                          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5">
                            <img
                              class="output-3"
                              style={{ width: "19px", height: "19px" }}
                              src={
                                row?.completed_by?.bp_attorneystaff_userprofile
                                  ?.profile_pic
                              }
                            />
                          </span>
                        ) : (
                          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
                            <img
                              class="output-3"
                              style={{ width: "19px", height: "19px" }}
                              src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                            />
                          </span>
                        )}
                        <span className="text-black font-weight-bold m-l-5 m-r-5">
                          {new Date(row?.completed_at).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                        {row?.id ? (
                          <i
                            className={`ic ${
                              row?.verified ? "ic-verified" : "ic-unverified"
                            } ic-19 m-l-5`}
                          ></i>
                        ) : (
                          <i
                            className={`ic ${
                              row?.verified ? "ic-verified" : "ic-unverified"
                            } ic-19 m-l-5`}
                          ></i>
                        )}
                      </span>
                    ) : (
                      <span
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
                  </div>
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
        <TodoModal
          show={userInforModal}
          onHide={() => setUserInfoModal(false)}
          selectedData={rowData}
          todoTabs={todoTabs}
          atorneyStaff={atorneyStaff}
        />

        {/* <ChatModal
          data={chatData}
          isOpen={chatModal}
          handleOpen={openChatModel}
          handleSendMessage={handleSendMessage}
        /> */}
      </div>
    </div>
  );
};

export default CompletedTable;
