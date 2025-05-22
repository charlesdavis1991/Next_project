import React, { Fragment, useEffect, useState, useRef } from "react";
import NavbarOptions from "./navbarOptions";
import { Link } from "react-router-dom";
import { getClientId, getCaseId } from "../../Utils/helper";
import { useSelector, useDispatch } from "react-redux";
import CaseNavigatorPage from "../../Modules/CaseNavigatorPage";
import { setHeaderName } from "../../Redux/header_name/action";
import { api_without_cancellation } from "../../api/api";
import { setPageId } from "../../Redux/getPageId/action";
import "./navbarLinks.css";

const NavbarLinks = (props) => {
  const totalChatCount = useSelector((state) => state.chat.totalChatCount);
  const toDoCount = useSelector((state) => state.general.toDoCount);
  const flaggedPageCount = useSelector(
    (state) => state.general.flaggedPageCount
  );
  const dispatch = useDispatch();

  const [menuItems, setMenuItems] = useState([
    {
      path: `/bp-home/client.id/case.id`,
      linkText: "Home Page",
      icon: "ic-home",
    },
    {
      path: `/bp-navigator/${getClientId()}/${getCaseId()}`,
      linkText: "Case Navigator",
      icon: "ic-case-navigator",
    },
    {
      path: `/work-list/${getClientId()}/${getCaseId()}`,
      linkText: "Work List",
      icon: "ic-worklist",
    },
    {
      path: `/bp-calendar/${getClientId()}/${getCaseId()}`,
      linkText: "Calendar",
      icon: "ic-calendar",
    },
    {
      path: `/bp-checkLists/client.id/case.id`,
      linkText: "CheckLists",
      icon: "ic-speedometer",
    },
    {
      path: `/chat/client.id/case.id`,
      linkText: "Chat",
      icon: "ic-chat-circle",
    },
    {
      path: `/bp-flaggedcases/${getClientId()}/${getCaseId()}`,
      linkText: "Flagged Cases",
      icon: "ic-flagged",
    },
    {
      path: `/bp-reports/client.id/case.id`,
      linkText: "Firm Reporting",
      icon: "ic-reports-updated",
    },
    {
      path: `/bp-lawfirmdirectory/${getClientId()}/${getCaseId()}`,
      linkText: "Directory",
      icon: "ic-directory",
    },
    {
      path: `/bp-accounting/client.id/case.id`,
      linkText: "Accounting",
      icon: "ic-accounting",
    },
    {
      path: `#`,
      linkText: "Library",
      icon: "ic-library",
    },
    {
      path: `/bp-copilot/client.id/case.id`,
      linkText: "Co Pilot",
      icon: "ic-copilot",
    },
  ]);

  const [collapsibleList, setCollapsibleList] = useState([]);
  const addClickRecord = async (clickId, pageId) => {
    try {
      const payload = {
        page_id: pageId,
        click: clickId,
        case_id: getCaseId(),
        client_id: getClientId(),
      };
      dispatch(setPageId(pageId));
      // API call to save click record
      await api_without_cancellation.post(
        "/api/general/click_record/",
        payload
      );

      console.log(`Click record added for ${clickId}:`, payload);
    } catch (error) {
      console.error(`Failed to add click record for ${clickId}:`, error);
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [isHovered5, setIsHovered5] = useState(false);
  const [isHovered6, setIsHovered6] = useState(false);
  const [isHovered7, setIsHovered7] = useState(false);
  const [isHovered8, setIsHovered8] = useState(false);
  const [isHovered9, setIsHovered9] = useState(false);
  const [isHovered10, setIsHovered10] = useState(false);
  const [isHovered11, setIsHovered11] = useState(false);

  return (
    <div className="top-nav-wrapper-inner navbar-links-container-menu-collapsible d-lg-flex flex-wrap d-flex-1 right-in d-block m-t-5">
      <div
        className="bar position-relative Header-z-index-0 "
        style={{ left: "-10px" }}
      >
        <div className="wrap stacked-icons">
          <ul className="list-unstyled" id="main-2">
            <li
              className="pr-0 show-home"
              onClick={() => {
                addClickRecord(29, 35);
                dispatch(setHeaderName("Home"));
              }}
            >
              <Link to={`/bp-home/${getClientId()}/${getCaseId()}`}>
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-home`}></i>
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {"Home Page"}
                  </small>
                </div>
              </Link>
            </li>

            <li
              // onMouseEnter={() => setIsHovered1(true)}
              // onMouseLeave={() => setIsHovered1(false)}
              className="padding-right-9 show-menu-items-lg"
              onClick={() => {
                addClickRecord(30, 36);
                dispatch(setHeaderName("Case Navigator"));
              }}
              // style={{ transform: "translateX(-15px)" }}
            >
              <Link to={`/bp-navigator/${getClientId()}/${getCaseId()}`}>
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-case-navigator`}></i>
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {"Case Navigator"}
                  </small>
                </div>
              </Link>
            </li>
            <li
              className="padding-right-9 show-menu-items-chat"
              // style={{ transform: "translateX(-30px)" }}
            >
              <Link
                onclick="addClickRecord(37)"
                onClick={() => addClickRecord(31)}
                to={`/work-list/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon single-icon-relative">
                    <i className="ic ic-42 ic-worklist"></i>

                    {toDoCount > 0 ? (
                      <div
                        className="count-badge"
                        id="message_count"
                        role="status"
                      >
                        {toDoCount}
                      </div>
                    ) : null}
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                    // style={{ transform: "translateY(3px)" }}
                  >
                    {"Work List"}
                  </small>
                </div>
              </Link>
            </li>
            <li
              className="padding-right-9 show-menu-items"
              onClick={() => {
                addClickRecord(32, 29);
                dispatch(setHeaderName("Calendar"));
              }}
              // style={{ transform: "translateX(-45px)" }}
            >
              <a
                onclick="addClickRecord(37)"
                href={`/bp-calendar/${getClientId()}/${getCaseId()}`}
              >
                {" "}
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-calendar`}></i>
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {"Calendar"}
                  </small>
                </div>
              </a>
            </li>
            <li
              className="padding-right-9 show-menu-items"
              onClick={() => {
                addClickRecord(33, 44);
                dispatch(setHeaderName("CheckLists"));
              }}
              // style={{ transform: "translateX(-60px)" }}
            >
              <a
                onclick="addClickRecord(37)"
                href={`/bp-checkLists/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-speedometer`}></i>
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {"CheckLists"}
                  </small>
                </div>
              </a>
            </li>
            <li
              className="d-none d-lg-block padding-right-9 show-menu-items-chat"
              onClick={() => {
                addClickRecord(34, 30);
                dispatch(setHeaderName("Chat"));
              }}
              // style={{ transform: "translateX(-75px)" }}
            >
              <Link
                onclick="addClickRecord(32)"
                to={`/chat/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon single-icon-relative">
                    <i className="ic ic-42 ic-chat-circle"></i>

                    {totalChatCount > 0 ? (
                      <div
                        className="count-badge"
                        id="message_count"
                        role="status"
                      >
                        {totalChatCount}
                      </div>
                    ) : null}
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {"Chat"}
                  </small>
                </div>
              </Link>
            </li>

            <li
              className="padding-right-9 show-menu-items-chat"
              onClick={() => {
                addClickRecord(35, 31);
                dispatch(setHeaderName("Flagged Cases"));
              }}
              // style={{ transform: "translateX(-90px)" }}
            >
              <Link
                onclick="addClickRecord(37)"
                to={`/bp-flaggedcases/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon single-icon-relative">
                    <i className="ic ic-42 ic-flagged"></i>

                    {flaggedPageCount > 0 ? (
                      <div
                        className="count-badge"
                        id="message_count_2"
                        role="status"
                      >
                        {flaggedPageCount}
                      </div>
                    ) : null}
                  </div>
                  <small
                    className="hover-text"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {"Flagged Cases"}
                  </small>
                </div>
              </Link>
            </li>

            <li
              className="padding-right-9 show-menu-3xl-size"
              // style={{ transform: "translateX(-105px)" }}
              onClick={() => dispatch(setHeaderName("Firm Reporting"))}
            >
              <a
                onclick="addClickRecord(37)"
                href={`/bp-reports/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-reports-updated`}></i>
                  </div>
                  <small
                    className="hover-text"
                    // style={{ transform: "translateY(3px)" }}
                  >
                    {"Firm Reporting"}
                  </small>
                </div>
              </a>
            </li>
            <li
              // style={{ transform: "translateX(-120px)" }}
              className="padding-right-9 show-menu-3xl-size"
              onClick={() => {
                addClickRecord(37, 45);
                dispatch(setHeaderName("Law Firm Directory"));
              }}
            >
              <Link
                onclick="addClickRecord(37)"
                to={`/bp-lawfirmdirectory/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-directory`}></i>
                  </div>
                  <small
                    className="hover-text"
                    // style={{ transform: "translateY(3px)" }}
                  >
                    {"Directory"}
                  </small>
                </div>
              </Link>
            </li>
            <li
              // style={{ transform: "translateX(-135px)" }}
              className="padding-right-9 show-menu-5xl-size"
              onClick={() => {
                addClickRecord(38, 37);
                dispatch(setHeaderName("Accounting"));
              }}
            >
              <a
                onclick="addClickRecord(37)"
                href={`/bp-accounting/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-accounting`}></i>
                  </div>
                  <small
                    className="hover-text"
                    // style={{ transform: "translateY(3px)" }}
                  >
                    {"Accounting"}
                  </small>
                </div>
              </a>
            </li>
            <li
              // style={{ transform: "translateX(-150px)" }}
              className="padding-right-9 show-menu-6xl-size"
              onClick={() => {
                addClickRecord(39);
                dispatch(setHeaderName("Library"));
              }}
            >
              <a onclick="addClickRecord(37)" href={"#"}>
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-library`}></i>
                  </div>
                  <small
                    className="hover-text"
                    // style={{ transform: "translateY(3px)" }}
                  >
                    {"Library"}
                  </small>
                </div>
              </a>
            </li>
            <li
              // style={{ transform: "translateX(-165px)" }}
              className="padding-right-9 show-menu-6xl-size"
              onClick={() => dispatch(setHeaderName("Co Pilot"))}
            >
              <Link
                onclick="addClickRecord(37)"
                to={`/bp-copilot/${getClientId()}/${getCaseId()}`}
              >
                <div className="icon-hover-container">
                  <div className="single-icon">
                    <i className={`ic ic-42 ic-copilot`}></i>
                  </div>
                  <small
                    className="hover-text"
                    // style={{ transform: "translateY(3px)" }}
                  >
                    {"Co Pilot"}
                  </small>
                </div>
              </Link>
            </li>
            <li
              // style={{ transform: "translateX(-120px)" }}
              className="d-none more-2 hidden show-dropdown-menu-icon"
              data-width="80"
            >
              <a href="#" className="more-button" id="more--icon-padding">
                <span className="ic ic-17 h-100 has-no-after text-white d-flex align-items-center justify-content-center rotate-180">
                  <svg
                    width="17"
                    height="50"
                    viewBox="0 0 17 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </span>
              </a>
              <ul className="collapsible-ul" style={{ top: "57px" }}>
                <li
                  className="pr-0 show-home-dropdown"
                  onClick={() => {
                    addClickRecord(29, 35);
                    dispatch(setHeaderName("Home"));
                  }}
                >
                  <a
                    onclick="addClickRecord(37)"
                    // href={`bp-home/${getClientId}/${getCaseId}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-home`}></i>
                      <small className="translate-y-0P2">{"Home Page"}</small>
                    </div>
                  </a>
                </li>
                <li
                  className="padding-right-9 show-menu-items-lg-dropdown"
                  onClick={() => {
                    addClickRecord(30, 36);
                    dispatch(setHeaderName("Case Navigator"));
                  }}
                >
                  <Link to={`/bp-navigator/${getClientId()}/${getCaseId()}`}>
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-case-navigator`}></i>
                      <small className="translate-y-0P2">
                        {"Case Navigator"}
                      </small>
                    </div>
                  </Link>
                </li>
                <li
                  className="padding-right-9 show-menu-items-chat-dropdown"
                  onClick={() => {
                    addClickRecord(31);
                    dispatch(setHeaderName("Work List"));
                  }}
                >
                  <Link
                    onclick="addClickRecord(37)"
                    to={`/work-list/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-worklist`}></i>
                      <small className="translate-y-0P2">{"Work List"}</small>
                      {toDoCount > 0 ? (
                        <div
                          className="count-badge"
                          id="message_count"
                          role="status"
                        >
                          {toDoCount}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </li>
                <li
                  className="padding-right-9 show-menu-items-dropdown"
                  onClick={() => {
                    addClickRecord(32, 29);
                    dispatch(setHeaderName("Calendar"));
                  }}
                >
                  <a
                    onclick="addClickRecord(37)"
                    href={`/bp-calendar/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-calendar`}></i>
                      <small className="translate-y-0P2">{"Calendar"}</small>
                    </div>
                  </a>
                </li>
                <li
                  className="padding-right-9 show-menu-items-dropdown "
                  onClick={() => {
                    addClickRecord(33, 44);
                    dispatch(setHeaderName("CheckLists"));
                  }}
                >
                  <a
                    onclick="addClickRecord(37)"
                    href={`bp-checkLists/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-speedometer`}></i>
                      <small className="translate-y-0P2">{"CheckLists"}</small>
                    </div>
                  </a>
                </li>
                <li
                  className="d-none d-lg-block padding-right-9 show-menu-items-chat-dropdown"
                  onClick={() => {
                    addClickRecord(34, 30);
                    dispatch(setHeaderName("Chat"));
                  }}
                >
                  <Link
                    onclick="addClickRecord(32)"
                    to={`/chat/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon single-icon-relative">
                      <i className="ic ic-42 ic-chat-circle"></i>
                      <small className="translate-y-0P2">{"Chat"}</small>
                      {totalChatCount > 0 ? (
                        <div
                          className="count-badge"
                          id="message_count"
                          role="status"
                        >
                          {totalChatCount}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </li>
                <li
                  className="padding-right-9 show-menu-items-chat-dropdown"
                  onClick={() => {
                    addClickRecord(35, 31);
                    dispatch(setHeaderName("Flagged Cases"));
                  }}
                >
                  <Link
                    onclick="addClickRecord(37)"
                    to={`/bp-flaggedcases/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon single-icon-relative">
                      <i className={`ic ic-42 ic-flagged`}></i>
                      <small className="translate-y-0P2">
                        {"Flagged Cases"}
                      </small>
                      {flaggedPageCount > 0 ? (
                        <div
                          className="count-badge"
                          id="message_count"
                          role="status"
                        >
                          {flaggedPageCount}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </li>

                <li
                  className="padding-right-9 show-menu-3xl-size-dropdown"
                  onClick={() => dispatch(setHeaderName("Firm Reporting"))}
                >
                  <a
                    onclick="addClickRecord(37)"
                    href={`bp-reports/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-reports-updated`}></i>
                      <small className="translate-y-0P2">
                        {"Firm Reporting"}
                      </small>
                    </div>
                  </a>
                </li>
                <li
                  className="padding-right-9 show-menu-3xl-size-dropdown"
                  onClick={() => {
                    addClickRecord(37, 45);
                    dispatch(setHeaderName("Law Firm Directory"));
                  }}
                >
                  <Link
                    onclick="addClickRecord(37)"
                    to={`/bp-lawfirmdirectory/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-directory`}></i>
                      <small className="translate-y-0P2">{"Directory"}</small>
                    </div>
                  </Link>
                </li>
                <li
                  className="padding-right-9 show-menu-5xl-size-dropdown"
                  onClick={() => {
                    addClickRecord(38, 37);
                    dispatch(setHeaderName("Accounting"));
                  }}
                >
                  <a
                    onclick="addClickRecord(37)"
                    href={`/bp-accounting/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-accounting`}></i>
                      <small className="translate-y-0P2">{"Accounting"}</small>
                    </div>
                  </a>
                </li>
                <li
                  className="padding-right-9 show-menu-6xl-size-dropdown"
                  onClick={() => {
                    addClickRecord(39);
                    dispatch(setHeaderName("Library"));
                  }}
                >
                  <a onclick="addClickRecord(37)" href={"#"}>
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-library`}></i>
                      <small className="translate-y-0P2">{"Library"}</small>
                    </div>
                  </a>
                </li>
                <li
                  className="padding-right-9 show-menu-6xl-size-dropdown"
                  onClick={() => dispatch(setHeaderName("Co Pilot"))}
                >
                  <Link
                    onclick="addClickRecord(37)"
                    to={`/bp-copilot/${getClientId()}/${getCaseId()}`}
                  >
                    <div className="single-icon">
                      <i className={`ic ic-42 ic-copilot`}></i>
                      <small className="translate-y-0P2">{"Co Pilot"}</small>
                    </div>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <NavbarOptions expanded={props.expanded} />
    </div>
    // <div className="top-nav-wrapper d-flex flex-wrap d-flex-1">
    //   <div className="top-nav-wrapper-inner d-lg-flex flex-wrap d-flex-1 right-in d-block">
    //     <div className="bar position-relative Header-z-index-0">
    //       <div className="wrap stacked-icons">
    //         <ul className="list-unstyled" id="main-2">
    //           {menuItems.slice(0, 12).map((menuItem, index) => (
    //             <Fragment key={menuItem.path}>
    //               {menuItem?.linkText?.toLowerCase() === "chat" ? (
    //                 <li className="d-none d-lg-block padding-right-9">
    //                   <a
    //                     onclick="addClickRecord(32)"
    //                     href="{% url 'chat' client.id case.id %}"
    //                   >
    //                     <div className="single-icon single-icon-relative">
    //                       <i className="ic ic-42 ic-chat-circle"></i>
    //                       <small className="translate-y-0P2">Chat</small>
    //                       <div
    //                         className="count-badge"
    //                         id="message_count"
    //                         role="status"
    //                       >
    //                         20
    //                       </div>
    //                     </div>
    //                   </a>
    //                 </li>
    //               ) : (
    //                 <li className="padding-right-9">
    //                   <a onclick="addClickRecord(37)" href={menuItem.path}>
    //                     <div className="single-icon">
    //                       <i className={`ic ic-42 ${menuItem.icon}`}></i>
    //                       <small className="translate-y-0P2">
    //                         {menuItem.linkText}
    //                       </small>
    //                     </div>
    //                   </a>
    //                 </li>
    //               )}
    //             </Fragment>
    //           ))}
    //         </ul>
    //       </div>
    //     </div>

    //     <NavbarOptions />
    //   </div>
    // </div>
  );
  // <div className="top-nav-wrapper d-flex flex-wrap d-flex-1">
  //   <div className="top-nav-wrapper-inner d-lg-flex flex-wrap d-flex-1 right-in d-block">
  //     <div
  //       className="bar position-relative Header-z-index-0"
  //       //   style={{ marginLeft: "-50px" }}
  //     >
  //       <div className="wrap stacked-icons">
  //         <ul className="list-unstyled" id="main-2">
  //           {menuItems &&
  //             menuItems.map((menuItem) => (
  //               <Fragment key={menuItem.path}>
  //                 {menuItem?.linkText?.toLowerCase() === "chat" ? (
  //                   <li className="d-none d-lg-block padding-right-9">
  //                     <a
  //                       onclick="addClickRecord(32)"
  //                       href="{% url 'chat' client.id case.id %}"
  //                     >
  //                       <div className="single-icon single-icon-relative">
  //                         <i className="ic ic-42 ic-chat-circle"></i>
  //                         <small className="translate-y-0P2">Chat</small>
  //                         <div
  //                           className="count-badge"
  //                           id="message_count"
  //                           role="status"
  //                         >
  //                           20
  //                         </div>
  //                       </div>
  //                     </a>
  //                   </li>
  //                 ) : (
  //                   <li className="padding-right-9">
  //                     <a onclick="addClickRecord(37)" href={menuItem.path}>
  //                       <div className="single-icon">
  //                         <i className={`ic ic-42 ${menuItem.icon}`}></i>
  //                         <small className="translate-y-0P2">
  //                           {menuItem.linkText}
  //                         </small>
  //                       </div>
  //                     </a>
  //                   </li>
  //                 )}
  //               </Fragment>
  //             ))}

  {
    /* <li className="d-none d-lg-block padding-right-9">
                <a
                  onclick="addClickRecord(38)"
                  href="{% url 'bp-navigator' client.id case.id %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-case-navigator"></i>
                    <small className="translate-y-0P2">Case Navigator</small>
                  </div>
                </a>
              </li>
              <li className="d-none d-lg-block padding-right-9">
                <a
                  onclick="addClickRecord(3)"
                  href="{% url 'bp-todo' client.id case.id  %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-worklist"></i>
                    <small className="translate-y-0P2">Work List</small>
                  </div>
                </a>
              </li>
              <li className="d-none d-lg-block padding-right-9">
                <a
                  onclick="addClickRecord(31)"
                  href="{% url 'bp-calendar' client.id case.id  %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-calendar"></i>
                    <small className="translate-y-0P2">Calendar</small>
                  </div>
                </a>
              </li>
              <li className="d-none d-lg-block padding-right-9">
                <a
                  onclick="addClickRecord(46)"
                  href="{% url 'bp-checklist' client.id case.id  %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-speedometer"></i>
                    <small className="translate-y-0P2">CheckLists</small>
                  </div>
                </a>
              </li>
              <li className="d-none d-lg-block padding-right-9">
                <a
                  onclick="addClickRecord(32)"
                  href="{% url 'chat' client.id case.id %}"
                >
                  <div className="single-icon single-icon-relative">
                    <i className="ic ic-42 ic-chat-circle"></i>
                    <small className="translate-y-0P2">Chat</small>
                    <div
                      className="count-badge"
                      id="message_count"
                      role="status"
                    >
                      20
                    </div>
                  </div>
                </a>
              </li>
              <li className="padding-right-9">
                <a href="{% url 'bp-firmprofile' client.id case.id %}">
                  <div className="single-icon">
                    <i className="ic ic-42 ic-copilot"></i>
                    <small className="translate-y-0P2">Flagged Cases</small>
                  </div>
                </a>
              </li>

              <li className="padding-right-9">
                <a
                  onclick="addClickRecord(51)"
                  href="{% url 'bp-reports' client.id case.id  %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-reports-updated"></i>
                    <small className="translate-y-0P2">Reports</small>
                  </div>
                </a>
              </li>
              <li className="padding-right-9">
                <a
                  onclick="addClickRecord(47)"
                  href="{% url 'bp-lawfirmdirectory' client.id case.id  %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-directory"></i>
                    <small className="translate-y-0P2">Directory</small>
                  </div>
                </a>
              </li>
              <li className="padding-right-9">
                <a
                  onclick="addClickRecord(39)"
                  href="{% url 'bp-bpAccounting' client.id case.id  %}"
                >
                  <div className="single-icon">
                    <i className="ic ic-42 ic-accounting"></i>
                    <small className="translate-y-0P2">Accounting</small>
                  </div>
                </a>
              </li>
              <li className="padding-right-9">
                <a href="#">
                  <div className="single-icon">
                    <i className="ic ic-42 ic-library"></i>
                    <small className="translate-y-0P2">Library</small>
                  </div>
                </a>
              </li>
              <li className="padding-right-9">
                <a href="{% url 'bp-firmprofile' client.id case.id %}">
                  <div className="single-icon">
                    <i className="ic ic-42 ic-copilot"></i>
                    <small className="translate-y-0P2">Co Pilot</small>
                  </div>
                </a>
              </li> */
  }

  // {collapsibleList && collapsibleList.length > 0 ? (
  //   <li className="d-none d-lg-block more-2 hidden" data-width="80">
  //     <a href="#" className="more-button" id="more--icon-padding">
  //       <span className="ic ic-17 h-100 has-no-after text-white d-flex align-items-center justify-content-center rotate-180">
  //         <svg
  //           width="17"
  //           height="50"
  //           viewBox="0 0 17 50"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
  //             fill="currentColor"
  //           ></path>
  //           <path
  //             d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
  //             fill="currentColor"
  //           ></path>
  //         </svg>
  //       </span>
  //     </a>
  //     <ul className="collapsible-ul">
  //       {collapsibleList &&
  //         collapsibleList.map((menuItem) => (
  //           <Fragment key={menuItem.path}>
  //             {menuItem?.linkText?.toLowerCase() === "chat" ? (
  //               <li className="d-none d-lg-block padding-right-9">
  //                 <a
  //                   onclick="addClickRecord(32)"
  //                   href="{% url 'chat' client.id case.id %}"
  //                 >
  //                   <div className="single-icon single-icon-relative">
  //                     <i className="ic ic-42 ic-chat-circle"></i>
  //                     <small className="translate-y-0P2">
  //                       Chat
  //                     </small>
  //                     <div
  //                       className="count-badge"
  //                       id="message_count"
  //                       role="status"
  //                     >
  //                       20
  //                     </div>
  //                   </div>
  //                 </a>
  //               </li>
  //             ) : (
  //               <li className="padding-right-9">
  //                 <a
  //                   onclick="addClickRecord(37)"
  //                   href={menuItem.path}
  //                 >
  //                   <div className="single-icon">
  //                     <i
  //                       className={`ic ic-42 ${menuItem.icon}`}
  //                     ></i>
  //                     <small className="translate-y-0P2">
  //                       {menuItem.linkText}
  //                     </small>
  //                   </div>
  //                 </a>
  //               </li>
  //             )}
  //           </Fragment>
  //         ))}
  //     </ul>
  //   </li>
  // ) : null}
  //         </ul>
  //       </div>
  //     </div>
  //     <NavbarOptions />
  //   </div>
  // </div>
};

export default NavbarLinks;
