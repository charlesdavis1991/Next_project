import React, { useState } from "react";

import { useSelector } from "react-redux";

const TabsTable = ({ todos, currentTab }) => {
  //   // States
  //   const [customModalShow, setcustomModalShow] = useState(false);
  //   const [textModalShow, setTextModalShow] = useState(false);
  //   const [emailModalShow, setEmailModalShow] = useState(false);

  //   console.log(searchResults, "kjkjk");

  //   // Handlers
  //   const showCustomModal = (event) => {
  //     event.preventDefault();
  //     setcustomModalShow(!customModalShow);
  //   };
  //   const showTextModal = (event) => {
  //     event.preventDefault();
  //     setTextModalShow(!textModalShow);
  //   };

  //   const showEmailModal = (event) => {
  //     event.preventDefault();
  //     setEmailModalShow(!emailModalShow);
  //   };
  console.log(todos, "todos");
  return (
    <>
      <table className="table table-borderless table-striped table-earning theme-colored fake-rows-2">
        <thead>
          {/* {searchResults.length > 0 && ( */}
          <tr>
            <th class="testSearch-width-1P"></th>
            <th class="text-center">CASE</th>
            <th class="text-center">RESULT</th>
            <th></th>
            <th class="testSearch-width-65P text-center">NOTES AND TO DOS</th>
            <th></th>
            <th class="has-form-check"></th>
            <th></th>
            <th></th>
          </tr>
          {/* )} */}
        </thead>
        {/* <tbody>
          {searchResults
            ? searchResults?.map((record, index) => (
                <tr className="search-row fake-row-2 p-5">
                  <td className="td-autosize text-center">{index + 1}</td>
                  <td className="">
                    <div className="d-flex align-items-center client-name-box account_text-ellipsis">
                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                        {record?.case_data?.for_client?.profile_pic_19p && (
                          <img
                            src={
                              record["case_data"]["for_client"][
                                "profile_pic_19p"
                              ]
                            }
                            class="output-3 theme-ring"
                          />
                        )}
                      </span>
                      <span className="ml-2 text-black text-black-2 whitespace-nowrap account_text-ellipsis font-600">
                        <b>
                          {record?.case_data?.for_client?.last_name &&
                            record["case_data"]["for_client"]["last_name"]}
                          ,
                          {record?.case_data?.for_client?.first_name &&
                            record["case_data"]["for_client"]["first_name"]}
                        </b>
                      </span>
                    </div>
                    <p className="text-darker account_text-ellipsis">
                      <span className="d-inline-block text-grey mr-1">DOB</span>
                      {record?.case_data?.for_client?.birthday &&
                        record["case_data"]["for_client"]["birthday"]}
                    </p>

                    <div className="">
                      <div className="search-Flex-1">
                        {record?.case_data?.case_type?.casetype_icon && (
                          <img
                            className="mr-2"
                            src={
                              record["case_data"]["case_type"]["casetype_icon"]
                            }
                          />
                        )}
                        <p className="MR8H19">
                          {record?.case_data?.case_type?.name &&
                            record["case_data"]["case_type"]["name"]}
                        </p>
                      </div>
                      <p className="text-darker">
                        <span className="d-inline-block text-grey mr-1">
                          DOI
                        </span>
                        {record?.case_data?.incident_date &&
                          record["case_data"]["incident_date"]}
                      </p>
                    </div>
                  </td>

                  <td style={{ width: "11%" }} className="text-left">
                    <div dangerouslySetInnerHTML={{ __html: record?.result }} />
                  </td>
                  <td
                    className="text-center"
                    style={{ paddingLeft: "0px !important" }}
                  >
                    <div className="d-flex justify-content-center btn-group-vertical">
                      <div className="button-skew-1-custom">
                        <button
                          className="btn angle-skew-11 mb-1 height-30 Width-120-ic-1 d-flex align-items-center justify-content-center btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email d-flex-1 font-weight-semibold "
                          onClick={showCustomModal}
                        >
                          <i className="anti-skew ic ic-19 ic-chat-3d mr-1"></i>
                          <span className="anti-skew btn-text-holder Pos-Rel-1T">
                            Chat Client
                          </span>
                        </button>
                      </div>
                      <div className="button-skew-2-custom">
                        <button
                          className="btn angle-skew-11 mb-1 height-30 Width-120-ic-1 d-flex align-items-center justify-content-center btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email d-flex-1 font-weight-semibold "
                          onClick={showTextModal}
                        >
                          <i className="anti-skew ic ic-19 ic-sms-3d mr-1"></i>
                          <span className="anti-skew btn-text-holder Pos-Rel-1T">
                            Text Client
                          </span>
                        </button>
                      </div>
                      <div className="button-skew-3-custom">
                        <button
                          className="btn angle-skew-11 mb-1 height-30 Width-120-ic-1 d-flex align-items-center justify-content-center btn btn-primary-lighter btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email d-flex-1 font-weight-semibold "
                          onClick={showEmailModal}
                        >
                          <i className="anti-skew ic ic-19 ic-email-3d mr-1 "></i>
                          <span className="anti-skew btn-text-holder Pos-Rel-1T">
                            Email Client
                          </span>
                        </button>
                      </div>
                    </div>
                  </td>

                  <td style={{ width: "100%" }} className="text-center">
                    <div
                      className="height-80 justify-content-center"
                      style={{ width: "100% !important" }}
                    >
                      <form id="notes-form" style={{ height: "100%" }}>
                        <div className="notes-text-area">
                          <textarea
                            onclick=""
                            id={
                              record.case_data
                                ? "case-note-" + record.case_data?.id.toString()
                                : "case-note"
                            }
                            required
                            name="description"
                            placeholder="Input a text for a note, task or client communication:"
                            className="form-control d-inline-block ML5PX-PLC"
                          ></textarea>
                        </div>
                      </form>
                    </div>
                  </td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center btn-group-vertical">
                      <div className="button-skew-1R-custom">
                        <button
                          onClick={() =>
                            props.addNotesHandler(
                              "note",
                              record?.case_data?.id,
                              record?.case_data?.for_client?.id
                            )
                          }
                          className="btn btn-primary mb-1 height-30 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                        >
                          <span className="anti-skew btn-text-holder Pos-Rel-1T">
                            Note
                          </span>
                        </button>
                      </div>
                      <div className="button-skew-2R-custom">
                        <button
                          onClick={() =>
                            props.addNotesHandler(
                              "critical",
                              record?.case_data?.id,
                              record?.case_data?.for_client?.id
                            )
                          }
                          className="btn btn-primary mb-1 height-30 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                        >
                          <span className="anti-skew btn-text-holder Pos-Rel-1T">
                            Critical
                          </span>
                        </button>
                      </div>
                      <div className="button-skew-3R-custom">
                        <button
                          onClick={() =>
                            props.addNotesHandler(
                              "update",
                              record?.case_data?.id,
                              record?.case_data?.for_client?.id
                            )
                          }
                          className="btn btn-primary mb-1 height-30 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                        >
                          <span className="anti-skew btn-text-holder Pos-Rel-1T">
                            Update
                          </span>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: "35%" }} className="text-right">
                    <div className="users-account angle-skew-11">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail SearchFirm1-6">
                        <input
                          className="mr-1 checkbox anti-skew"
                          onclick="event.stopPropagation();"
                          user_id={
                            record?.case_data?.firm_user1
                              ? record?.case_data?.firm_user1.id
                              : ""
                          }
                          type="checkbox"
                          checked={
                            record["case_data"]["user_type1_active"]
                              ? true
                              : false
                          }
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "400" }}
                          className="anti-skew text-darker user-designation"
                        >
                          {record?.case_data?.user_type1 &&
                            record["case_data"]["user_type1"]}
                        </div>

                        <div className=" ic ic-avatar ic-19 has-avatar-icon has-cover-img anti-skew">
                          {record?.case_data?.firm_user1 &&
                            record?.case_data?.firm_user1?.profile_pic_19p && (
                              <img
                                src={
                                  record["case_data"]["firm_user1"][
                                    "profile_pic_19p"
                                  ]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "400" }}
                          className="anti-skew text-darker ml-2"
                        >
                          {record?.case_data?.firm_user1 &&
                            record["case_data"]["firm_user1"]["user"][
                              "first_name"
                            ]}{" "}
                          {record?.case_data?.firm_user1 &&
                            record["case_data"]["firm_user1"]["user"][
                              "last_name"
                            ]}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail SearchFirm2-6">
                        <input
                          className="mr-1 checkbox anti-skew"
                          onclick="event.stopPropagation();"
                          user_id={
                            record?.case_data?.firm_user2
                              ? record?.case_data?.firm_user2.id
                              : ""
                          }
                          type="checkbox"
                          checked={
                            record["case_data"]["user_type2_active"]
                              ? true
                              : false
                          }
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "400" }}
                          className="anti-skew text-darker user-designation"
                        >
                          {record?.case_data?.user_type2 &&
                            record["case_data"]["user_type2"]}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img anti-skew">
                          {record?.case_data?.firm_user2 &&
                            record?.case_data?.firm_user2?.profile_pic_19p && (
                              <img
                                src={
                                  record["case_data"]["firm_user2"][
                                    "profile_pic_19p"
                                  ]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "400" }}
                          className="anti-skew text-darker ml-2"
                        >
                          {record?.case_data?.firm_user2 &&
                            record["case_data"]["firm_user2"]["user"][
                              "first_name"
                            ]}{" "}
                          {record?.case_data?.firm_user2 &&
                            record["case_data"]["firm_user2"]["user"][
                              "last_name"
                            ]}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail SearchFirm3-6">
                        <input
                          className="mr-1 checkbox anti-skew"
                          onclick="event.stopPropagation();"
                          user_id={
                            record?.case_data?.firm_user3
                              ? record?.case_data?.firm_user3.id
                              : ""
                          }
                          type="checkbox"
                          checked={
                            record["case_data"]["user_type3_active"]
                              ? true
                              : false
                          }
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "400" }}
                          className="anti-skew text-darker user-designation"
                        >
                          {record?.case_data?.user_type3 &&
                            record["case_data"]["user_type3"]}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img anti-skew">
                          {record?.case_data?.firm_user3 &&
                            record?.case_data?.firm_user3?.profile_pic_19p && (
                              <img
                                src={
                                  record["case_data"]["firm_user3"][
                                    "profile_pic_19p"
                                  ]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "400" }}
                          className="anti-skew text-darker ml-2"
                        >
                          {record?.case_data?.firm_user3 &&
                            record["case_data"]["firm_user3"]["user"][
                              "first_name"
                            ]}{" "}
                          {record?.case_data?.firm_user3 &&
                            record["case_data"]["firm_user3"]["user"][
                              "last_name"
                            ]}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail SearchFirm4-6">
                        <input
                          className="mr-1 checkbox anti-skew"
                          onclick="event.stopPropagation();"
                          user_id={
                            record?.case_data?.firm_user4
                              ? record?.case_data?.firm_user4.id
                              : ""
                          }
                          type="checkbox"
                          checked={
                            record["case_data"]["user_type4_active"]
                              ? true
                              : false
                          }
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "400" }}
                          className="anti-skew text-darker user-designation"
                        >
                          {record?.case_data?.user_type4 &&
                            record["case_data"]["user_type4"]}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img anti-skew">
                          {record?.case_data?.firm_user4 &&
                            record?.case_data?.firm_user4?.profile_pic_19p && (
                              <img
                                src={
                                  record["case_data"]["firm_user4"][
                                    "profile_pic_19p"
                                  ]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "400" }}
                          className="anti-skew text-darker ml-2"
                        >
                          {record?.case_data?.firm_user3 &&
                            record["case_data"]["firm_user3"]["user"][
                              "first_name"
                            ]}{" "}
                          {record?.case_data?.firm_user3 &&
                            record["case_data"]["firm_user3"]["user"][
                              "last_name"
                            ]}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail SearchFirm5-6">
                        <input
                          className="mr-1 checkbox anti-skew"
                          onclick="event.stopPropagation();"
                          user_id={
                            record?.case_data?.firm_user5
                              ? record?.case_data?.firm_user5.id
                              : ""
                          }
                          type="checkbox"
                          checked={
                            record["case_data"]["user_type5_active"]
                              ? true
                              : false
                          }
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "400" }}
                          className="anti-skew text-darker user-designation"
                        >
                          {record?.case_data?.user_type5 &&
                            record["case_data"]["user_type5"]}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img anti-skew">
                          {record?.case_data?.firm_user5 &&
                            record?.case_data?.firm_user5?.profile_pic_19p && (
                              <img
                                src={
                                  record["case_data"]["firm_user5"][
                                    "profile_pic_19p"
                                  ]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "400" }}
                          className="anti-skew text-darker ml-2"
                        >
                          {record?.case_data?.firm_user5 &&
                            record["case_data"]["firm_user5"]["user"][
                              "first_name"
                            ]}{" "}
                          {record?.case_data?.firm_user5 &&
                            record["case_data"]["firm_user5"]["user"][
                              "last_name"
                            ]}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail SearchFirm6-6">
                        <input
                          className="mr-1 checkbox anti-skew"
                          onclick="event.stopPropagation();"
                          user_id={
                            record?.case_data?.firm_user6
                              ? record?.case_data?.firm_user6.id
                              : ""
                          }
                          type="checkbox"
                          checked={
                            record["case_data"]["user_type6_active"]
                              ? true
                              : false
                          }
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "400" }}
                          className="anti-skew text-darker user-designation"
                        >
                          {record?.case_data?.user_type6 &&
                            record["case_data"]["user_type6"]}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img anti-skew">
                          {record?.case_data?.firm_user6 &&
                            record?.case_data?.firm_user6?.profile_pic_19p && (
                              <img
                                src={
                                  record["case_data"]["firm_user6"][
                                    "profile_pic_19p"
                                  ]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "400" }}
                          className="anti-skew text-darker ml-2"
                        >
                          {record?.case_data?.firm_user6 &&
                            record["case_data"]["firm_user6"]["user"][
                              "first_name"
                            ]}{" "}
                          {record?.case_data?.firm_user6 &&
                            record["case_data"]["firm_user6"]["user"][
                              "last_name"
                            ]}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: "20%" }}>
                    <div className="Pos-Rel-20R btn-text-holder d-flex align-items-center justify-content-end justify-content-xl-end col-left mb-0 angle-skew-11">
                      <button
                        onclick=""
                        className="btn btn-primary mb-1 height-30 width-75 d-flex align-items-center justify-content-center no-border-radius btn btn-primary rounded-0 control-btn"
                      >
                        <span className="btn-text-holder font-weight-bold pr-2 text-gold margin-b-08">
                          +
                        </span>
                        <p className="anti-skew">Task</p>
                      </button>
                    </div>
                  </td>
                  <td></td>
                </tr>
              ))
            : null}
        </tbody> */}
        <tr
          style={{
            height: "140px",
            // display: searchResults.length % 2 === 0 ? "" : "none",
          }}
          className="search-row fake-row-2 p-5"
        >
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr style={{ height: "140px" }} className="search-row fake-row-2 p-5">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </>
  );
};

export default TabsTable;
