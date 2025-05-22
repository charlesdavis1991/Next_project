import React, { useEffect, useState } from "react";
import {
  getCaseId,
  getClientId,
  removeToken,
  getToken,
} from "../../Utils/helper";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";
import { persistor } from "../../Redux/store";
import { setCurrentTodosTab } from "../../Redux/actions";
import { userLogoutAPI } from "../../Providers/main";
import MedicalTreatmentIcon from "../../assets/images/medical-treatment-icon.svg";
import { setHeaderName } from "../../Redux/header_name/action";
import api, { api_without_cancellation } from "../../api/api";
import { setPageId } from "../../Redux/getPageId/action";
import AddFeedbaackModal from "../Modals/AddFeedbaackModal";
import "./main.css";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.caseData?.pages);
  const client = useSelector((state) => state?.caseData?.current?.for_client);
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client_id = getClientId();
  const case_id = getCaseId();
  const isSidebarOpen = useSelector((state) => state.menu.isOpen);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [hovered, setHovered] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/general/click_record/", {
        click: 0,
        case_id: getCaseId(),
        client_id: getClientId(),
        page_id: 34,
      });
      await userLogoutAPI(getClientId(), getCaseId());
      persistor.pause();
      persistor.flush().then(() => {
        return persistor.purge();
      });
      removeToken();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // const addClickRecord = (page) => {
  //   console.log("page", page.page_url);
  //   dispatch(setCurrentTodosTab(0));
  // };
  const addClickRecord = async (page) => {
    // Hardcoded mapping for click IDs
    console.log(page);
    const clickIdMapping = {
      case: 2,
      client: 3,
      accident: 4,
      treatment: 5,
      defendants: 6,
      injury: 7,
      todo: 8,
      costs: 9,
      witnesses: 10,
      documents: 11,
      "other parties": 12,
      insurance: 13,
      loans: 14,
      settle: 16,
      litigation: 17,
      discovery: 18,
      depositions: 19,
      photo: 20,
      notes: 23,
      // "Update Case Status": 24,
      // "Notes Input Panel": 25,
      // "New To-Do Input": 26,
      // "New Note Input": 27,
      // "Search Function": 28,
      home: 29,
      "case navigator": 30,
      worklist: 31,
      calendar: 32,
      speedometer: 33,
      chat: 34,
      "flagged cases": 35,
      reports: 36,
      directory: 37,
      accounting: 38,
      library: 39,
      help: 40,
      settings: 41,
    };

    // Get the click ID for the current page name
    const clickId = clickIdMapping[page.name.toLowerCase()];

    // Proceed only if a valid click ID is found
    if (!clickId) {
      console.warn(`Click ID not found for page: ${page.name}`);
      return;
    }

    try {
      const payload = {
        page_id: page.id,
        click: clickId,
        case_id: case_id,
        client_id: client_id,
      };
      dispatch(setCurrentTodosTab(0));
      dispatch(setPageId(page.id));
      // API call to save click record
      await api_without_cancellation.post(
        "/api/general/click_record/",
        payload
      );

      console.log(`Click record added for ${page.name}:`, payload);
    } catch (error) {
      console.error(`Failed to add click record for ${page.name}:`, error);
    }
  };
  useEffect(() => {
    if (isSidebarOpen) {
      // document.body.classList.add(
      //   "modal-open",
      //   "has-blurred-bg",
      //   "has-static-overlay",
      // );
      document.getElementById("page-container")?.classList.add("menu-blur");
    } else {
      // document.body.classList.remove(
      //   "modal-open",
      //   "has-blurred-bg",
      //   "has-static-overlay",
      // );
      document.getElementById("page-container")?.classList.remove("menu-blur");
    }
    return () => {
      document.body.classList.remove(
        "modal-open",
        "has-blurred-bg",
        "has-static-overlay"
      );
    };
    // document.body.classList.add('modal-open has-blurred-bg has-static-overlay')
  }, [isSidebarOpen]);
  return (
    <aside
      id=""
      className={`menu-sidebar ${isSidebarOpen ? "" : ""}`}
      style={{ left: "0px", paddingTop: "75px" }}
    >
      <div className="menu-sidebar__content">
        <nav className="navbar-sidebar position-relative hello">
          <ul className="list-unstyled navbar__list">
            {
              // client &&
              //   currentCase &&
              pages &&
                pages?.map((page) => {
                  const isActiveTab =
                    window.location.pathname.split("/")[1] === page.page_url;
                  const isHovered = hovered === page.page_url;

                  return page.show_on_sidebar ? (
                    <li
                      className={`Row hc ${
                        page.page_url === window.location.pathname.split("/")[1]
                          ? "active"
                          : ""
                      } ${page.name === "Case" ? "mt-0" : ""}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "25px",
                        paddingRight: "0px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setHovered(page.page_url)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        dispatch(setHeaderName(page.name));
                        setIsActive(isActiveTab);
                      }}
                    >
                      {page.name.toLowerCase() == "reports" ? (
                        <>
                          <Link
                            // href={`${process.env.REACT_APP_BACKEND_URL
                            //   }/api/redirect/reports/?token=${getToken()}`}
                            to={`/bp-reports/${client_id}/${case_id}`}
                            onClick={() => addClickRecord(page)}
                            className="navbar_link_item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0px",
                              whiteSpace: "nowrap",
                              textDecoration: "none",
                              color: "inherit",
                              paddingLeft: "0px",
                              paddingRight: "0px",
                            }}
                          >
                            <img
                              style={{ width: "19px", height: "19px" }}
                              src={page.page_icon}
                            />
                            {page.name}
                          </Link>
                        </>
                      ) : page.name.toLowerCase() == "treatment" ? (
                        <>
                          <Link
                            onClick={() => addClickRecord(page)}
                            to={`/treatment/`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0px",
                              whiteSpace: "nowrap",
                              textDecoration: "none",
                              color: "inherit",
                              paddingLeft: "0px",
                              paddingRight: "0px",
                            }}
                          >
                            <img
                              style={{ width: "19px", height: "19px" }}
                              src={MedicalTreatmentIcon}
                            />
                            {page.name}
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/${page.page_url}/${client_id}/${case_id}`}
                            onClick={() => addClickRecord(page)}
                            className="navbar_link_item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0px",
                              whiteSpace: "nowrap",
                              textDecoration: "none",
                              color: "inherit",
                              paddingLeft: "0px",
                              paddingRight: "0px",
                            }}
                          >
                            <img
                              style={{ width: "19px", height: "19px" }}
                              src={page.page_icon}
                            />
                            {page.name}
                          </Link>
                        </>
                      )}
                      {/* {hovered !== page.page_url &&
                      page.page_url ==
                        window.location.pathname.split("/")[1] && (
                        <svg
                          width="12"
                          height="14"
                          viewBox="0 0 14 34"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z"
                            fill="#19395f"
                          />
                        </svg>
                      )} */}
                    </li>
                  ) : null;
                })
            }
          </ul>
          <ul className="list-unstyled navbar-list-help-to-logout static-pages p-t-35">
            <li
              className="Row hc"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "25px",
                paddingRight: "0px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  handleShow();
                }}
                onMouseEnter={() => setHovered("help")}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  color: "inherit",
                  paddingLeft: "18px",
                  paddingRight: "0px",
                }}
              >
                <i
                  className="ic ic-19 ic-help-2"
                  style={{ marginLeft: "0px" }}
                ></i>
                Help
              </a>

              <div className="blueSpace"> </div>
            </li>
            <li
              className="Row hc"
              onMouseEnter={() => setHovered("settings")}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "25px",
                paddingRight: "0px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              <Link
                to={`/bp-firmsetting/${getClientId()}/${getCaseId()}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  color: "inherit",
                  paddingLeft: "18px",
                  paddingRight: "0px",
                }}
              >
                <i className="ic ic-19 ic-settings-2"></i>
                Settings
              </Link>

              <div className="blueSpace"> </div>
            </li>
            <li
              className="Row hc"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "25px",
                paddingRight: "0px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered("logout")}
              onMouseLeave={() => setHovered(null)}
            >
              <a
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0px",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  color: "inherit",
                  paddingLeft: "18px",
                  paddingRight: "0px",
                }}
              >
                <i
                  className="ic ic-19 ic-logout2"
                  style={{ marginLeft: "4px" }}
                ></i>
                Log Out
              </a>

              <div className="blueSpace"> </div>
            </li>
          </ul>
          <UserProfile user={client} />
        </nav>
        <AddFeedbaackModal show={showModal} handleClose={handleClose} />
      </div>
    </aside>
  );
};

export default Sidebar;
