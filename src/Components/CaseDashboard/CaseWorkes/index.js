import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./CaseWorkers.css";
import CaseWorkerChatModal from "../../Modals/CaseWorkerChatModal";

export const WorkersOnCase = () => {
  const [chatData, setChatData] = useState(null);
  const [chatModal, setChatModal] = useState(false);
  const openChatModel = (event, data) => {
    setChatData(data);
    setChatModal(!chatModal);
    event.stopPropagation();
  };
  const currentCase = useSelector((state) => state.caseData?.current);
  const caseSummary = useSelector((state) => state.caseData?.summary);
  const [firmUsers, setFirmUsers] = useState([]);

  useEffect(() => {
    if (currentCase && caseSummary && caseSummary?.workers) {
      setFirmUsers([
        {
          firm_user: caseSummary?.firm_user1,
          user_type: caseSummary?.workers[0],
        },
        {
          firm_user: caseSummary?.firm_user2,
          user_type: caseSummary?.workers[1],
        },
        {
          firm_user: caseSummary?.firm_user3,
          user_type: caseSummary?.workers[2],
        },
        {
          firm_user: caseSummary?.firm_user4,
          user_type: caseSummary?.workers[3],
        },
        {
          firm_user: caseSummary?.firm_user5,
          user_type: caseSummary?.workers[4],
        },
        {
          firm_user: caseSummary?.firm_user6,
          user_type: caseSummary?.workers[5],
        },
      ]);
    }
  }, [currentCase, caseSummary]);
  return (
    <>
      {firmUsers && (
        <div className=" m-b-5 p-l-0" style={{ width: "calc(100% - 255px)" }}>
          <div className="position-relative overflow-hidden">
            <div className="expandable-section">
              <div
                className="p-l-5 height-25"
                style={{ backgroundColor: "var(--primary-15)" }}
              >
                <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                  CASE WORKERS ASSIGNED TO CASE
                </h4>
              </div>
              <div className="d-none align-items-center p-b-5 ">
                <h3 className="font-weight-normal height-25">
                  {caseSummary?.for_client?.created_by?.office_name}
                </h3>
                {caseSummary?.p_add_firm_user ? (
                  <button
                    type="button"
                    className="btn btn-primary height-25 text-uppercase d-flex align-items-center justify-content-center bg-clr-primary"
                    data-toggle="modal"
                    data-target="#attach-user-modal"
                  >
                    Select Firm Users for each case role
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary height-25 text-uppercase d-flex align-items-center justify-content-center bg-clr-primary"
                    data-toggle="modal"
                    data-target="#add_firm_user"
                  >
                    Select Firm Users for each case role
                  </button>
                )}
              </div>
              <div className="d-md-flex d-xl-flex flex-md-column flex-xl-row f-gap-05">
                <div className="table-responsive table--no-card rounded-0 border-0 position-relative">
                  <table className="table table-borderless table-striped table-workers table-workers-1st has-height-25 has-table-sub-panel large-spacing-around table-layout-fixed">
                    <tbody
                      data-target="#attach-user-modal"
                      // data-target={
                      //   caseSummary && caseSummary?.p_add_firm_user
                      //     ? "#attach-user-modal"
                      //     : "#add_firm_user"
                      // }
                      data-toggle="modal"
                    >
                      {firmUsers &&
                        firmUsers.length > 0 &&
                        firmUsers.slice(0, 3).map((d, index) => (
                          <tr data-toggle="modal">
                            <td
                              style={{
                                height: "35px",
                                padding: "10px",
                                width: "33.3%",
                                fontWeight: "600",
                              }}
                              className="d-flex-inline color-black align-items-center"
                            >
                              {" "}
                              {d.user_type?.name}
                            </td>
                            {d.firm_user &&
                            d.firm_user.for_firmsetting &&
                            d.firm_user.for_firmsetting.assign_firm_user ? (
                              d.user_type1 &&
                              d.firm_user &&
                              d.firm_user.user.id == d.user_type.id ? (
                                <td
                                  style={{
                                    height: "35px",
                                    padding: "10px",
                                    border: "1px solid red",
                                  }}
                                  className="d-flex-inline d-flex justify-content-between align-items-center color-black p-3"
                                  id="case-user-1"
                                >
                                  <button
                                    type="button"
                                    data-toggle="modal"
                                    className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                  >
                                    {d.firm_user.profile_pic_29p ? (
                                      <div
                                        className="ic ic-avatar ic-29 has-avatar-icon has-cover-img img-border"
                                        id="case-profile-1"
                                      >
                                        <img
                                          onClick={(e) => openChatModel(e, d)}
                                          className={`${d?.firm_user?.is_active ? "img-border" : ""}`}
                                          id={`output${index}`}
                                          src={
                                            d.firm_user.profile_pic_29p
                                              ? d.firm_user.profile_pic_29p
                                              : "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                                          }
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        onClick={(e) => openChatModel(e, d)}
                                        className="ic ic-avatar ic-29 has-avatar-icon has-cover-img default"
                                        id="case-profile-1 default"
                                      ></div>
                                    )}
                                    <div
                                      className="ml-2"
                                      style={{
                                        paddingTop: "2px",
                                        fontWeight: "600",
                                      }}
                                      id="case-username-1"
                                      onClick={(e) => openChatModel(e, d)}
                                    >{`${d.firm_user.user.first_name} ${d.firm_user.user.last_name}`}</div>
                                  </button>
                                </td>
                              ) : (
                                <>
                                  <td
                                    style={{
                                      height: "35px",
                                      padding: "10px",
                                      width: "33.3%",
                                    }}
                                    className="d-flex-inline text-black d-flex justify-content-between align-items-center "
                                  >
                                    <button
                                      type="button"
                                      data-toggle="modal"
                                      className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                    >
                                      {d.firm_user.profile_pic_29p ? (
                                        <div
                                          className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                          id="case-profile-1"
                                        >
                                          <img
                                            onClick={(e) => openChatModel(e, d)}
                                            id={`output${index}`}
                                            src={d.firm_user.profile_pic_29p}
                                            className={`${d?.firm_user?.is_active ? "img-border" : ""}`}
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          onClick={(e) => openChatModel(e, d)}
                                          className="ic ic-avatar ic-29 has-avatar-icon has-cover-img default"
                                          id="case-profile-1"
                                        >
                                          {" "}
                                        </div>
                                      )}
                                      <div
                                        className="ml-2"
                                        id="case-username-1"
                                        style={{ fontWeight: "600" }}
                                        onClick={(e) => openChatModel(e, d)}
                                      >{`${
                                        d.firm_user &&
                                        d.firm_user.user.first_name
                                      } ${
                                        d.firm_user &&
                                        d.firm_user.user.last_name
                                      }`}</div>
                                    </button>
                                  </td>
                                </>
                              )
                            ) : d.firm_user && d.firm_user.profile_pic_29p ? (
                              <>
                                <td
                                  style={{
                                    height: "35px",
                                    padding: "10px",
                                    width: "33.3%",
                                  }}
                                  className="d-flex-inline d-flex justify-content-between align-items-center color-black p-3"
                                >
                                  <button
                                    type="button"
                                    className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                  >
                                    <div
                                      className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                      id="case-profile-1"
                                    >
                                      <img
                                        onClick={(e) => openChatModel(e, d)}
                                        id={`output${1}`}
                                        src={d.firm_user.profile_pic_29p}
                                        className={`${d?.firm_user?.is_active ? "img-border" : ""}`}
                                      />
                                    </div>
                                    <div
                                      className="ml-2"
                                      style={{
                                        paddingTop: "2px",
                                        fontWeight: "600",
                                      }}
                                      id="case-username-1"
                                      onClick={(e) => openChatModel(e, d)}
                                    >{`${
                                      d.firm_user &&
                                      d.firm_user.user.first_name + "88"
                                    } ${
                                      d.firm_user && d.firm_user.user.last_name
                                    }`}</div>
                                  </button>
                                </td>
                              </>
                            ) : (
                              <td
                                style={{
                                  height: "35px",
                                  padding: "10px",
                                  width: "33.3%",
                                  fontWeight: "600",
                                }}
                                className="d-flex-inline text-black d-flex align-items-center justify-content-start"
                              >
                                <div
                                  onClick={(e) => openChatModel(e, d)}
                                  className="ic ic-avatar ic-29 has-avatar-icon has-cover-img default"
                                  id="case-profile-1"
                                ></div>
                                <div
                                  className="ml-2"
                                  id="case-username-1"
                                  onClick={(e) => openChatModel(e, d)}
                                >
                                  {d.firm_user &&
                                  d.firm_user.user.first_name &&
                                  d.firm_user.user.first_name
                                    ? d.firm_user.user.first_name +
                                      " " +
                                      d.firm_user.user.last_name
                                    : ""}
                                </div>
                              </td>
                            )}
                            <td
                              style={{
                                height: "35px",
                                width: "33.3%",
                                padding: "10px 5px 10px 0",
                                textAlign: "right",
                                display: "flex",
                                justifyContent: "flex-end",
                                fontWeight: "600",
                              }}
                              className="d-flex-inline text-end align-items-center caseWorkerLastAccessedDate"
                              id="case-clickdate-1"
                            >
                              {d?.user_type?.click_record_date}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-responsive table--no-card rounded-0 border-0">
                  <table
                    className="table table-borderless table-striped table-workers table-workers-2nd has-height-25 has-table-sub-panel large-spacing-around table-layout-fixed"
                    data-toggle="modal"
                  >
                    <tbody
                      data-toggle="modal"
                      data-target="#attach-user-modal"
                      // data-target={
                      //   caseSummary && caseSummary?.p_add_firm_user
                      //     ? "#attach-user-modal"
                      //     : "#add_firm_user"
                      // }
                    >
                      {firmUsers &&
                        firmUsers.length > 0 &&
                        firmUsers.slice(3).map((d, index) => (
                          <tr data-toggle="modal">
                            <td
                              style={{
                                height: "35px",
                                padding: "10px",
                                width: "33.3%",
                                fontWeight: "600",
                              }}
                              className="d-flex-inline color-black align-items-center "
                            >
                              {" "}
                              {d.user_type?.name}
                            </td>
                            {d.firm_user &&
                            d.firm_user.for_firmsetting &&
                            d.firm_user.for_firmsetting.assign_firm_user ? (
                              d.user_type1 &&
                              d.firm_user &&
                              d.firm_user.user.id == d.user_type.id ? (
                                <td
                                  style={{
                                    height: "35px",
                                    padding: "10px",
                                    border: "1px solid red",
                                  }}
                                  className="d-flex-inline d-flex justify-content-between align-items-center color-black p-3"
                                  id="case-user-1"
                                >
                                  <button
                                    type="button"
                                    data-toggle="modal"
                                    className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                  >
                                    {d.firm_user.profile_pic_29p ? (
                                      <div
                                        className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                        id="case-profile-1"
                                      >
                                        <img
                                          onClick={(e) => openChatModel(e, d)}
                                          id={`output${index}`}
                                          className={`${d?.firm_user?.is_active ? "img-border" : ""}`}
                                          src={d.firm_user.profile_pic_29p}
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        onClick={(e) => openChatModel(e, d)}
                                        className="ic ic-avatar ic-29 has-avatar-icon has-cover-img default"
                                        id="case-profile-1"
                                      ></div>
                                    )}
                                    <div
                                      className="ml-2"
                                      style={{
                                        paddingTop: "2px",
                                        fontWeight: "600",
                                      }}
                                      id="case-username-1"
                                      onClick={(e) => openChatModel(e, d)}
                                    >{`${d.firm_user.user.first_name} ${d.firm_user.user.last_name}`}</div>
                                  </button>
                                </td>
                              ) : (
                                <>
                                  <td
                                    style={{
                                      height: "35px",
                                      padding: "10px",
                                      width: "33.3%",
                                    }}
                                    className="d-flex-inline text-black d-flex justify-content-between align-items-center "
                                  >
                                    <button
                                      type="button"
                                      data-toggle="modal"
                                      className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                    >
                                      {d.firm_user.profile_pic_29p ? (
                                        <div
                                          className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                          id="case-profile-1"
                                        >
                                          <img
                                            onClick={(e) => openChatModel(e, d)}
                                            id={`output${index}`}
                                            className={`${d?.firm_user?.is_active ? "img-border" : ""}`}
                                            src={d.firm_user.profile_pic_29p}
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          onClick={(e) => openChatModel(e, d)}
                                          className="ic ic-avatar ic-29 has-avatar-icon has-cover-img default"
                                          id="case-profile-1"
                                        ></div>
                                      )}
                                      <div
                                        className="ml-2"
                                        id="case-username-1"
                                        style={{ fontWeight: "600" }}
                                        onClick={(e) => openChatModel(e, d)}
                                      >{`${
                                        d.firm_user &&
                                        d.firm_user.user.first_name
                                      } ${
                                        d.firm_user &&
                                        d.firm_user.user.last_name
                                      }`}</div>
                                    </button>
                                  </td>
                                </>
                              )
                            ) : d.firm_user && d.firm_user.profile_pic_29p ? (
                              <>
                                <td
                                  style={{
                                    height: "35px",
                                    padding: "10px",
                                    width: "33.3%",
                                  }}
                                  className="d-flex-inline d-flex justify-content-between align-items-center color-black p-3"
                                >
                                  <button
                                    type="button"
                                    className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                  >
                                    <div
                                      className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                                      id="case-profile-1"
                                    >
                                      <img
                                        onClick={(e) => openChatModel(e, d)}
                                        id={`output${1}`}
                                        className={`${d?.firm_user?.is_active ? "img-border" : ""}`}
                                        src={d.firm_user.profile_pic_29p}
                                      />
                                    </div>
                                    <div
                                      className="ml-2"
                                      style={{
                                        paddingTop: "2px",
                                        fontWeight: "600",
                                      }}
                                      id="case-username-1"
                                      onClick={(e) => openChatModel(e, d)}
                                    >{`${
                                      d.firm_user && d.firm_user.user.first_name
                                    } ${
                                      d.firm_user && d.firm_user.user.last_name
                                    }`}</div>
                                  </button>
                                </td>
                              </>
                            ) : (
                              <td
                                style={{
                                  height: "35px",
                                  padding: "10px",
                                  width: "33.3%",
                                  fontWeight: "bold",
                                }}
                                className="d-flex-inline text-black d-flex align-items-center justify-content-start"
                              >
                                <div
                                  onClick={(e) => openChatModel(e, d)}
                                  className="ic ic-avatar ic-29 has-avatar-icon has-cover-img default"
                                  id="case-profile-1"
                                ></div>
                                <div
                                  className="ml-2"
                                  id="case-username-1"
                                  onClick={(e) => openChatModel(e, d)}
                                >
                                  {d.firm_user &&
                                  d.firm_user.user.first_name &&
                                  d.firm_user.user.first_name
                                    ? d.firm_user.user.first_name +
                                      " " +
                                      d.firm_user.user.last_name
                                    : ""}
                                </div>
                              </td>
                            )}
                            <td
                              style={{
                                height: "35px",
                                width: "33.3%",
                                padding: "10px 5px 10px 0",
                                textAlign: "right",
                                display: "flex",
                                fontWeight: "600",
                                justifyContent: "flex-end",
                              }}
                              className="d-flex-inline text-end align-items-center caseWorkerLastAccessedDate"
                              id="case-clickdate-1"
                            >
                              {d?.user_type?.click_record_date}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <CaseWorkerChatModal
        data={chatData}
        isOpen={chatModal}
        handleOpen={openChatModel}
      />
    </>
  );
};
