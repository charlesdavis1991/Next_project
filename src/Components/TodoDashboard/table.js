import React, { useLayoutEffect, useRef, useState } from "react";
import ClientModal from "../Modals/clientModal";
import EmailModal from "../Modals/emailModal";
import TextModal from "../Modals/textModal";
import { useSelector } from "react-redux";
import TodoModal from "../Modals/TodoModal";
import ChatModal from "../Modals/ChatModal";
import "./todos.css";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import incidentIcon from "../../assets/images/incident.svg";

const Table = ({ todos, todoTabs, atorneyStaff, setColumnWidths }) => {
  // Redux
  const { searchResults } = useSelector((state) => state.todos);

  // States
  const [rowData, setRowData] = useState(null);
  const [customModalShow, setcustomModalShow] = useState(false);
  const [textModalShow, setTextModalShow] = useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);
  const [userInforModal, setUserInfoModal] = useState(false);
  const [chatModal, setChatModal] = useState(false);
  const [chatData, setChatData] = useState(null);

  console.log(todos, "99898todostodos");
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

  console.log(todos, "333333");
  console.log(searchResults[0]);

  const tableRef = useRef(null);

  useLayoutEffect(() => {
    if (tableRef.current) {
      const table = tableRef.current;

      const headerRow = table.querySelector("thead tr");

      const widths = Array.from(headerRow.children).map(
        (cell) => cell.getBoundingClientRect().width
      );

      setColumnWidths(widths);
    }
  }, []);
  console.log("todosDatas12", todos);
  return (
    // <div
    //   className="todoTable has-tint-h-45 has-tint-top-25"
    //   style={{
    //     overflowX: "auto",
    //     paddingInline: "12px",
    //     verticalAlign: "middle",
    //   }}
    // >

    <div
      className="tab-pane fade show active allOpen"
      id="custom-nav-1-all-todo"
      role="tabpanel"
      aria-labelledby="custom-nav-1-all-todo-tab"
    >
      <div
        class="to-dotable table-responsive table--no-card position-relative has-tint-rows has-tint-h-45 has-tint-top-25 overflow-hidden"
        style={{ border: "none" }}
      >
        {/* Table content */}
        <table
          ref={tableRef}
          className="table table-hover table-borderless  table-striped table-earning position-relative z-index-1  table-to-do"
        >
          <thead className="toolbar-fonts">
            <tr
              id="tb-header"
              style={{
                backgroundColor: "#19395f",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              <th class=""></th>
              <th className="  text-center">CREATED BY</th>

              <th className=" text-center">CASE</th>
              <th class="table-col-5 text-center">Task</th>

              <th className="text-center">RELATED DOCUMENTS</th>
              <th class="table-col-4 text-center">Assigned To</th>
              <th class="text-center">Due By</th>

              <th className=" text-center">COMPLETED BY</th>
            </tr>
          </thead>
          <tbody>
            {todos?.map?.((record, index) => (
              <tr
                // style={{ verticalAlign: "middle" }}
                key={index}
                style={{ height: "84px" }}
                // className="search-row fake-row-2 align-items-center"
                onClick={() => openModel(index, record)}
                data-toggle="modal"
                data-target="#edit_todo"
                data-created_at={record?.created_at}
                data-id={record?.id}
                data-type_name={record?.todo_type?.name}
                data-type={record?.todo_type?.id}
                data-task={record?.notes}
                data-todo_for={record?.todo_for?.id}
                data-due_by={record?.due_date}
                data-completed_at={record?.completed_at}
                data-completion_note={record?.completion_note}
                data-completed={record?.complete}
                data-verification={
                  record?.id && record?.id?.check_verification
                    ? "True"
                    : "False"
                }
                data-profile_pic={
                  record?.id && record?.id?.check_profile_pic
                    ? record?.id?.check_profile_pic
                    : ""
                }
                data-verification_info={
                  record?.id && record?.id?.check_verification
                    ? record?.id?.check_verification
                    : ""
                }
              >
                <td className="td-autosize">
                  <div className="d-flex justify-content-center align-items-center">
                    {index + 1}
                  </div>
                </td>

                {record?.created_by?.bp_userprofile?.account_type ===
                "Attorney" ? (
                  record?.created_by?.bp_userprofile?.bp_attorney_userprofile
                    ?.profile_pic !== null ? (
                    // <td style={{ paddingLeft: "0px" }}>
                    <td className="td-autosize">
                      <div className="d-flex align-items-center">
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            src={
                              record?.created_by?.bp_userprofile
                                ?.bp_attorney_userprofile?.profile_pic
                            }
                            className="output-3 theme-ring"
                            alt="avatar"
                          />
                        </span>
                        <div id="previewProfilePic"></div>
                        <div className="text-black ml-2">
                          {record?.created_by?.first_name}{" "}
                          {record?.created_by?.last_name}
                        </div>
                      </div>
                    </td>
                  ) : (
                    // <td style={{ paddingLeft: "0px" }}>
                    <td className="td-autosize">
                      <div className="d-flex align-items-center">
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            class="output-3"
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        </span>
                        <div className="td-autosize text-center ml-2">
                          {record?.created_by?.first_name}{" "}
                          {record?.created_by?.last_name}
                        </div>
                      </div>
                    </td>
                  )
                ) : record?.created_by?.bp_attorneystaff_userprofile
                    ?.profile_pic !== null ? (
                  // <td style={{ paddingLeft: "0px" }}>
                  <td class="td-autosize">
                    <div className="d-flex align-items-center">
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img
                          src={
                            record?.created_by?.bp_attorneystaff_userprofile
                              ?.profile_pic
                          }
                          className="output-3 theme-ring"
                          alt="avatar"
                        />
                      </span>
                      <div id="previewProfilePic"></div>
                      <div className="text-black ml-2">
                        {record?.created_by?.first_name}{" "}
                        {record?.created_by?.last_name}
                      </div>
                    </div>
                  </td>
                ) : (
                  // <td style={{ paddingLeft: "0px" }}>
                  <td class="td-autosize">
                    <div className="d-flex align-items-center">
                      <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img
                          class="output-3"
                          src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                        />
                      </span>
                      <div id="previewProfilePic"></div>
                      <div className="text-black ml-2">
                        {record?.created_by?.first_name &&
                        record?.created_by?.last_name ? (
                          <>
                            {record?.created_by?.first_name}{" "}
                            {record?.created_by?.last_name}
                          </>
                        ) : (
                          <>{record?.created_by?.username}</>
                        )}
                      </div>
                    </div>
                  </td>
                )}

                {/* <td style={{ paddingLeft: "0px" }}> */}

                <td className="allign-items-center ">
                  <div
                    className="d-flex align-items-center client-name-box account_text-ellipsis"
                    style={{ height: "21px" }}
                  >
                    <span className="ic mar-8 ic-avatar ic-19 has-avatar-icon has-cover-img">
                      {record?.for_client?.profile_pic_19p ? (
                        <img
                          src={record?.for_client?.profile_pic_19p}
                          className="output-3 theme-ring"
                          alt="avatar"
                        />
                      ) : (
                        <img
                          className="output-3"
                          src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                        />
                      )}
                    </span>
                    {/* <div className="td-autosize text-center ml-2"> */}
                    <div className=" text-black text-black-2 whitespace-nowrap text-nowrap account_text-ellipsis font-600">
                      {record?.for_client?.first_name}{" "}
                      {record?.for_client?.last_name}
                    </div>
                  </div>
                  <div className="d-flex" style={{ height: "21px" }}>
                    {/* <span className="d-inline-block text-grey mr-1">DOB</span> */}
                    <img src={bdayIcon} className="MR8H19" />
                    {/* {record?.for_case?.incident_date} */}

                    <div className="MR8H19">
                      {new Date(
                        record?.for_client?.birthday
                      ).toLocaleDateString("en-US")}
                    </div>
                  </div>
                  <div className="text-darker text-nowrap"></div>

                  <div className="d-flex" style={{ height: "21px" }}>
                    {record?.for_case?.case_type?.casetype_icon && (
                      <img
                        src={record?.for_case?.case_type?.casetype_icon}
                        alt=""
                        className="MR8H19"
                      />
                    )}
                    <div className="MR8H19">
                      {record?.for_case?.case_type?.name}
                    </div>
                  </div>
                  <div
                    className="d-flex"
                    style={{ height: "21px", marginBlock: "-2px" }}
                  >
                    <img src={incidentIcon} className="MR8H19" />

                    <div className="MR8H19">
                      {record?.for_case?.incident_date}
                    </div>
                  </div>
                </td>

                <td
                  className=" height-80"
                  style={{ height: "80px", marginBlock: "15px" }}
                >
                  <div className="d-flex flex-column align-items-start gap-1">
                    {record?.todo_type?.name === "Feedback:" && (
                      <div
                        className="text-center"
                        style={{ marginInline: "auto", fontSize: "10px" }}
                      >
                        Ticket Number: {record?.ticket_number}
                      </div>
                    )}
                    <div
                      className="text-center "
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

                {/* <td class="td-autosize"></td> */}
                <td className="td-autosize">
                  <div className="icon-container">
                    {Array?.from({ length: 6 }, (_, index) => (
                      <span className="icon-wrap" key={index}>
                        <i className="ic ic-23 ic-custom-icon-cloud-2 cursor-pointer"></i>
                      </span>
                    ))}
                  </div>
                </td>

                <td>
                  <div className="d-flex align-items-start">
                    <div className="d-flex flex-column">
                      {record?.todo_for?.profile_pic ? (
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
                              {record?.todo_for?.user?.first_name}{" "}
                              {record?.todo_for?.user?.last_name}
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
                              className="output-3"
                              src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                            />
                          </span>
                          <div id="previewProfilePic"></div>
                          <div className="d-flex flex-column">
                            <div className="ml-2 text-black">
                              {record?.todo_for?.user?.first_name}{" "}
                              {record?.todo_for?.user?.last_name}
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

                <td className="td-autosize  whitespace-nowrap">
                  <div className="d-flex align-items-center justify-content-center">
                    {record?.due_date &&
                      new Date(record?.due_date)?.toLocaleDateString("en-US")}
                  </div>
                </td>

                <td className="td-autosize whitespace-nowrap">
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center flex-row gap-2">
                      {record?.completed_at &&
                      record?.id &&
                      record?.id?.check_profile_pic ? (
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5">
                          <img
                            src={record?.id?.check_profile_pic}
                            alt=""
                            className="pl-0"
                          />
                        </span>
                      ) : record?.completed_by ? (
                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                          <img
                            className="output-3"
                            src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                          />
                        </span>
                      ) : null}
                      <span className="ml-2">
                        <div className="text-black ">
                          {record?.completed_by &&
                          record?.created_by?.first_name &&
                          record?.created_by?.last_name ? (
                            <>
                              {record?.created_by?.first_name}{" "}
                              {record?.created_by?.last_name}
                            </>
                          ) : (
                            <>{record?.created_by?.username}</>
                          )}
                        </div>
                      </span>
                    </div>
                    {record?.completed_at ? (
                      <span
                        className="d-flex align-items-center mt-2"
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
                          className="text-black font-weight-bold m-l-5 m-r-5"
                          id="treatment_second_date4"
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
            ))}
          </tbody>
        </table>
      </div>
      <div className="tabsModal">
        <TodoModal
          show={userInforModal}
          onHide={() => setUserInfoModal(false)}
          selectedData={rowData}
          todoTabs={todoTabs}
          atorneyStaff={atorneyStaff}
        />
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

export default Table;
