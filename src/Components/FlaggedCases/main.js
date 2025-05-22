import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { getCaseId, getClientId, mediaRoute, setCaseId, setClientId } from "../../Utils/helper";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import incidentIcon from "../../assets/images/incident.svg";
import TableLoader from "../Loaders/tableLoader";
import "./main.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCaseSummary } from "../../api/case";
import avatarImage from "./../../assets/images/avatar.svg";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
} from "../../Redux/caseData/caseDataSlice";
import { markReadFlaggedPageItemsAPI } from "../../Providers/main";
import { setFlaggedPageCount } from "../../Redux/general/actions";
import useWebSocket, { ReadyState } from "react-use-websocket";
import ActionBarComponent from "../common/ActionBarComponent";
import { setHeaderName } from "../../Redux/header_name/action";

const FlaggedCases = ({ case_id, client_id, newFlags, setNewFlags }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const webSocketLink = process.env.REACT_APP_BACKEND_URL.includes("http://")
    ? `ws://${process.env.REACT_APP_BACKEND_URL.replace("http://", "")}`
    : `wss://${process.env.REACT_APP_BACKEND_URL.replace("https://", "")}`;

  const [socketUrlNotification, setSocketUrlNotification] = useState(
    `wss://websockets.simplefirm.com/todo/?username=${localStorage.getItem("username")}`
  );

  const {
    lastMessage: lastMessageNotification,
    readyState: readyStateNotification,
  } = useWebSocket(socketUrlNotification, {
    share: false,
    shouldReconnect: () => true,
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyStateNotification];

  const [flaggedPages, setFlaggedPages] = useState(["no data"]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [fakeRows, setFakeRows] = useState([]);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef(null);

  const fetchData = async (page = 0) => {
    await api
      .get(`/api/flaggedcases/${client_id}/${case_id}/?page=${page}`)
      .then((response) => {
        setFlaggedPages((prevData) => {
          // Check if the first element of the previous state is "no data"
          if ((prevData.length > 0 && prevData[0] === "no data") || page == 1) {
            // If "no data", replace the entire array with the new data
            return response.data.flaggedPages.filter(
              (page) => !page.un_flagged_on
            );
          } else {
            // Otherwise, append the new data to the existing data
            return [
              ...prevData,
              ...response.data.flaggedPages.filter(
                (page) => !page.un_flagged_on
              ),
            ];
          }
        });
        setIsLoading(false);
        if (
          response.data.flaggedPages.length < response.data.totalFlagPageCount
        ) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("flag error", error);
        if (error.response && error.response.status === 404) {
          setHasMore(false);
        }
      });
  };

  const fetchDataOnChange = async (page = 0) => {
    await api
      .get(`/api/flaggedcases/${client_id}/${case_id}/?page=${page}`)
      .then((response) => {
        setFlaggedPages(response.data.flaggedPages);
        setIsLoading(false);
        if (
          response.data.flaggedPages.length < response.data.totalFlagPageCount
        ) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("flag error", error);
        if (error.response && error.response.status === 404) {
          setHasMore(false);
        }
      });
  };

  useEffect(() => {
    fetchData(page);
    markReadFlaggedPageItemsAPI(dispatch, setFlaggedPageCount);
  }, [page, lastMessageNotification]);

  useEffect(() => {
    if (page == 1) {
      fetchDataOnChange(page);
    } else {
      setPage(1);
    }
  }, [newFlags, lastMessageNotification]);

  const handleRedirect = (flagPage) => {
    let clientID = flagPage?.for_client?.id;
    let caseID = flagPage?.for_case?.id;
    const response = api.get(
      `/api/switch_client/${clientID}/${caseID}/Flagged%20Cases%20Page/`
    );
    console.log(">>>", clientID, caseID);
    dispatch(fetchCurrentCase(clientID, caseID));
    fetchCaseSummary(clientID, caseID)
      .then((data) => {
        dispatch(setCaseSummary(data));
        dispatch(fetchAllPages(caseID));
        setClientId(clientID);
        setCaseId(caseID);
        dispatch(setHeaderName(flagPage?.page_name));
        if (flagPage.page_name == "Case") {
          navigate(`/bp-case/${clientID}/${caseID}`, {
            replace: true,
          });
        } else {
          navigate(`/${flagPage.page_link}/${clientID}/${caseID}`, {
            replace: true,
          });
        }
      })
      .catch((err) => {
        console.log("Error occurred", err);
      });
  };

  
  // Checking for hasData on flaggedPage Changed
  useEffect(() => {
    if (flaggedPages.length == 0) {
      setHasData(false);
    } else {
      setHasData(true);
    }
  }, [flaggedPages]);

  // Calculate fake rows for no data div
  useEffect(() => {
    const handleResize = () => {
      if (!hasData) {
        const targetElement = document.getElementById("fake-rows-space");
        const viewportHeight = window.innerHeight;
        const elementPosition = targetElement?.getBoundingClientRect();
        const tableHeight = tableRef.current
          ? tableRef.current.clientHeight
          : 0;
        const spaceAfterElement = viewportHeight - tableHeight;
        const total_row = Math.floor(spaceAfterElement / 94) - 2;
        if (total_row > 0) {
          const fakeRows = [...Array(total_row).keys()];
          setFakeRows(fakeRows);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("DOMContentLoaded", handleResize);
    window.addEventListener("load", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("DOMContentLoaded", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, [hasData]);
  
  // Fake rows if there is no data at all
  useEffect(() => {
    const calculateAdditionalRows = () => {
      if (flaggedPages.length > 0 && flaggedPages[0] != "no data") {
        setTimeout(() => {
          const rowHeight = 94; // height of each row in px
          const viewportHeight = window.innerHeight;
          let tableHeight = tableRef.current
            ? tableRef.current.clientHeight
            : 0;
          if (tableHeight > viewportHeight) {
            tableHeight = rowHeight * flaggedPages.length;
          }
          const availableHeight = viewportHeight - tableHeight;
          const additionalRows = Math.max(
            0,
            Math.floor(availableHeight / rowHeight)
          );

          if (additionalRows > 3) {
            setAdditionalRows(additionalRows - 2);
          }
        }, 300);
      }
    };
    calculateAdditionalRows();

    window.addEventListener("resize", calculateAdditionalRows);

    return () => {
      window.removeEventListener("resize", calculateAdditionalRows);
    };
  }, [flaggedPages, hasData]);
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <>
      <div className="main-content hidden-scrollbar flagged-ML-5">
        <ActionBarComponent
          src="/BP_resources/images/icon/flagged-cases-logo-icon.svg"
          page_name={"Flagged Cases"}
        />
        <div
          className="section__content section__content--p30 m-t-5"
          style={{ height: "auto", zIndex: "0" }}
        >
          <div className="container-fluid px-0">
            <div className="row">
              <div className="col-lg-12 top-head">
                  <div
                    className="table-responsive table--no-card  rounded-0 invisible-scrollbar"
                    style={{
                      overflowY: "scroll",
                      maxHeight: "calc(100vh - 175px)",
                    }}
                  >
                    {hasData == false ? (
                      <div id="fake-rows-space">
                        <table
                          className="table table-borderless table-striped has-height-25 table-earning "
                          ref={tableRef}
                          id="main-table"
                        >
                          <thead>
                            <tr>
                              <th style={{ width: "36.5px" }}></th>
                              <th
                                style={{ width: "25vw", textAlign: "center" }}
                              >
                                CASE
                              </th>
                              <th style={{ width: "25vw" }}>PAGE</th>
                              <th style={{ width: "25vw" }}>FLAGGED</th>
                              <th
                                style={{ width: "25vw", textAlign: "center" }}
                              >
                                <div className="padding-right-15-flagpage">
                                  ON
                                </div>
                              </th>
                            </tr>
                          </thead>

                          {fakeRows.map((value, index) => (
                            <tr
                              key={index}
                              style={{ height: "94px", width: "100%" }}
                              className="search-row fake-row-2 p-5"
                            >
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ))}
                        </table>
                      </div>
                    ) : (
                      <table
                        className={`table table-borderless table-striped has-height-25 table-earning fixed-table-header-2 `}
                        ref={tableRef}
                        id="main-table"
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "36.5px" }}></th>
                            <th style={{ width: "25vw", textAlign: "center" }}>
                              CASE
                            </th>
                            <th style={{ width: "25vw" }}>PAGE</th>
                            <th style={{ width: "25vw" }}>FLAGGED</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th style={{ width: "25vw", textAlign: "center" }}>
                              <div className="padding-right-15-flagpage">
                                ON
                              </div>
                            </th>
                            <th style={{ width: "25vw", textAlign: "center" }}>
                              <div className="padding-right-15-flagpage">
                                REASON
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody id="flagged_pages_table">
                          {flaggedPages.length !== 0 &&
                            flaggedPages[0] != "no data" &&
                            flaggedPages.map((flagPage, index) => {
                              if (!flagPage.un_flagged_by) {
                                return (
                                  <tr
                                    data-id={flagPage.id}
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <td
                                      onClick={() => handleRedirect(flagPage)}
                                    >
                                      {index + 1}
                                    </td>
                                    <td
                                      ref={(node) => {
                                        if (node) {
                                          node.style.setProperty(
                                            "padding-bottom",
                                            "5px",
                                            "important"
                                          );
                                          node.style.setProperty(
                                            "padding-top",
                                            "5px",
                                            "important"
                                          );
                                        }
                                      }}
                                      onClick={() => handleRedirect(flagPage)}
                                    >
                                      <div className="d-flex align-items-center">
                                        <div>
                                          <div
                                            className="d-flex align-items-center client-name-box account_text-ellipsis"
                                            style={{ height: "21px" }}
                                          >
                                            <span className="ic mar-8 ic-avatar ic-19 has-avatar-icon has-cover-img">
                                              {flagPage?.for_client
                                                ?.profile_pic_19p ? (
                                                <img
                                                  src={
                                                    flagPage?.for_client
                                                      ?.profile_pic_19p
                                                      ? mediaRoute(
                                                          flagPage?.for_client
                                                            ?.profile_pic_19p
                                                        )
                                                      : avatarImage
                                                  }
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
                                            <div className=" text-black text-black-2 whitespace-nowrap text-nowrap account_text-ellipsis font-600">
                                              {flagPage?.for_client
                                                ?.last_name &&
                                                flagPage["for_client"][
                                                  "last_name"
                                                ]}
                                              ,{" "}
                                              {flagPage?.for_client
                                                ?.first_name &&
                                                flagPage["for_client"][
                                                  "first_name"
                                                ]}
                                            </div>
                                          </div>
                                          <div
                                            className="d-flex"
                                            style={{ height: "21px" }}
                                          >
                                            <img
                                              src={bdayIcon}
                                              className="MR8H19"
                                            />
                                            {/* {record?.for_case?.incident_date} */}

                                            <div className="MR8H19">
                                              {flagPage?.for_client?.birthday &&
                                                flagPage["for_client"][
                                                  "birthday"
                                                ]}
                                            </div>
                                          </div>
                                          <div className="text-darker text-nowrap"></div>
                                          <div
                                            className="d-flex"
                                            style={{ height: "21px" }}
                                          >
                                            {flagPage?.for_case?.case_type
                                              ?.casetype_icon && (
                                              <img
                                                className="MR8H19"
                                                src={mediaRoute(
                                                  flagPage["for_case"][
                                                    "case_type"
                                                  ]["casetype_icon"]
                                                )}
                                              />
                                            )}
                                            <div className="MR8H19">
                                              {flagPage?.for_case?.case_type
                                                ?.name &&
                                                flagPage["for_case"][
                                                  "case_type"
                                                ]["name"]}
                                            </div>
                                          </div>
                                          <div
                                            className="d-flex"
                                            style={{
                                              height: "21px",
                                              marginBlock: "-2px",
                                            }}
                                          >
                                            <img
                                              src={incidentIcon}
                                              className="MR8H19"
                                            />
                                            <div className="MR8H19">
                                              {flagPage?.incident_date &&
                                                flagPage["incident_date"]}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td
                                      onClick={() => handleRedirect(flagPage)}
                                    >
                                      <div className="d-flex align-items-center justify-content-center">
                                        {/* <i className="ic ic-23 ic-client m-r-5"></i> */}
                                        <div className="tabs-icon mr-1 d-flex justify-content-center">
                                          <img
                                            src={
                                              flagPage?.page_icon
                                                ? mediaRoute(flagPage.page_icon)
                                                : ""
                                            }
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                            }}
                                          />
                                        </div>

                                        <div>{flagPage.page_name || ""} </div>
                                      </div>
                                    </td>
                                    <td
                                      onClick={() => handleRedirect(flagPage)}
                                    >
                                      <div className="d-flex align-items-center justify-content-center">
                                        <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                          {flagPage.flagged_by ? (
                                            <img
                                              src={
                                                flagPage.flagged_by_profile_pic_url
                                                  ? mediaRoute(
                                                      flagPage.flagged_by_profile_pic_url
                                                    )
                                                  : avatarImage
                                              }
                                              alt="Profile Picture"
                                            />
                                          ) : null}
                                        </span>
                                        <span className="ml-2 text-black">
                                          {flagPage.flagged_by_first_name || ""}{" "}
                                          {flagPage.flagged_by_last_name || ""}
                                        </span>
                                      </div>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td
                                      className="text-center "
                                      onClick={() => handleRedirect(flagPage)}
                                    >
                                      <div className="padding-right-15-flagpage">
                                        {flagPage.flagged_on &&
                                          new Date(
                                            flagPage.flagged_on
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "numeric",
                                            day: "numeric",
                                          })}
                                      </div>
                                    </td>
                                    <td
                                      className="text-center "
                                      onClick={() => handleRedirect(flagPage)}
                                    >
                                      <div className="padding-right-15-flagpage">
                                        {flagPage?.flagged_reason
                                          ? flagPage?.flagged_reason?.replace(
                                              /[,\.]?$/,
                                              "."
                                            )
                                          : "Page flagged manually."}
                                      </div>
                                    </td>
                                    {/* <td
                                        onClick={() => handleRedirect(flagPage)}
                                      ></td> */}
                                    {/* <td style={{ textAlign: "left" }}>
                                        <a
                                          onClick={() => {
                                            api
                                              .delete(
                                                `/api/flaggedcases/${client_id}/${case_id}/`,
                                                {
                                                  data: {
                                                    flagPageId: flagPage.id,
                                                  },
                                                }
                                              )
                                              .then(() => {
                                                const newFlaggedPages =
                                                  flaggedPages.filter(
                                                    (page) =>
                                                      page.id !== flagPage.id
                                                  );
                                                setFlaggedPages(newFlaggedPages);
                                                setNewFlags([]);
                                              })
                                              .catch((error) => {
                                                console.error("error", error);
                                              });
                                          }}
                                          className="has-flag-hover"
                                        >
                                          <span className="ic ic-39 ic-flag-green">
                                            <svg
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M20.2338 6H16V11H10V15C10 15.5523 10.4477 16 11 16H20.2338C21.0111 16 21.4912 15.152 21.0913 14.4855L19.3087 11.5145C19.1187 11.1978 19.1187 10.8022 19.3087 10.4855L21.0913 7.5145C21.4912 6.84797 21.0111 6 20.2338 6Z"
                                                fill="#00C800"
                                              />
                                              <path
                                                d="M4 3H15C15.5523 3 16 3.44772 16 4V13H4"
                                                fill="#00C800"
                                              />
                                              <path
                                                d="M4 1V23"
                                                stroke="#19375F"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                              <path
                                                d="M2 23H6"
                                                stroke="#19375F"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </span>
                                          <span className="ic ic-39 ic-flag-red">
                                            <svg
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M20.2338 6H16V11H10V15C10 15.5523 10.4477 16 11 16H20.2338C21.0111 16 21.4912 15.152 21.0913 14.4855L19.3087 11.5145C19.1187 11.1978 19.1187 10.8022 19.3087 10.4855L21.0913 7.5145C21.4912 6.84797 21.0111 6 20.2338 6Z"
                                                fill="#EB0000"
                                              />
                                              <path
                                                d="M4 3H15C15.5523 3 16 3.44772 16 4V13H4"
                                                fill="#EB0000"
                                              />
                                              <path
                                                d="M4 1V23"
                                                stroke="#19375F"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                              <path
                                                d="M2 23H6"
                                                stroke="#19375F"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          </span>
                                        </a>
                                      </td> */}
                                  </tr>
                                );
                              }
                            })}

                          {[...Array(additionalRows)].map((_, index) => (
                            <tr
                              key={index}
                              style={{ height: "94px", width: "100%" }}
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
                            </tr>
                          ))}
                          <tr style={{ height: "35px" }}></tr>
                        </tbody>
                      </table>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlaggedCases;
