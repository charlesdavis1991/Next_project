import React, { useState, useRef, useEffect } from "react";
import NavbarLinks from "./navbarLinks";
import NavbarProfile from "./navbarProfile";
import DetailBar from "./detailBar";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleSidebar } from "../../Redux/menu/actions";
import { useNavigate, useLocation } from "react-router-dom";
import {
  searchGlobal,
  setSearchDocument,
  setSearchResult,
} from "../../Redux/search/searchSlice";
import {
  setCurrentSearchStatus,
  setSearchText,
  setsearchAlphabet,
} from "../../Redux/search/searchSlice";
import { setBlurEffect } from "../../Redux/header_blur/action";
import "./main.css";
import NewNavbarProfile from "./NewNavbarProfile";
import { setTabsResultCount } from "../../Redux/actions";
import { useDocumentModal } from "../../../src/Components/common/CustomModal/CustomModalContext";
import { mediaRoute } from "../../Utils/helper";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.menu.isOpen);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [isTopNavOpen, setIsTopNavOpen] = useState(false);
  const [formData, setFormData] = useState("");
  const searchResults = useSelector((state) => state.searchS.searchResult);
  const searchAlphabet = useSelector((state) => state.searchS.searchAlphabet);
  const searchText = useSelector((state) => state.searchS.searchText);
  const blurEffect = useSelector((state) => state.blurEffect.blurEffect);
  const token = localStorage.getItem("token");
  const searchRef = useRef(null);

  // Logic for redirecting use to search page when click in the Search Form
  const navigate = useNavigate();
  const location = useLocation();
  const isSearchURL = location.pathname.includes("search");

  const attorneyBranding = useSelector(
    (state) => state.settings?.attorneyBranding?.logo
  );
  const toggleTopNav = () => {
    setIsTopNavOpen(!isTopNavOpen);
    if (isTopNavOpen) {
      document
        .querySelector(".top-nav-wrapper-inner")
        ?.classList.add("right-in", "d-block");
      document.getElementById("leftSidebar")?.classList.remove("left-in");
    } else {
      // Hide top-nav-modal
      document.getElementById("top-nav-modal")?.classList.remove("show");
      document
        .querySelector(".top-nav-wrapper-inner")
        ?.classList.remove("right-in", "d-block");
    }
  };

  document.addEventListener("click", function (event) {
    const target = event.target;
    const menuBtn = document.getElementById("leftBtn");

    if (!menuBtn?.contains(target)) {
      // console.log("Clicked outside leftBtn and its child elements.");
      dispatch(closeSidebar());
    } else {
      // console.log("Clicked on leftBtn or its child element.");
      // dispatch(closeSidebar())
    }
  });

  React.useEffect(() => {
    const checkDeviceWidth = () => {
      // const deviceWidth = window.innerWidth;
      setDeviceWidth(window.innerWidth);

      if (window.innerWidth > 1080) {
        dispatch(closeSidebar());
      }
    };

    window.addEventListener("resize", checkDeviceWidth);
    return () => {
      window.removeEventListener("resize", checkDeviceWidth);
    };
  }, []);

  useEffect(() => {
    dispatch(setBlurEffect(false));
  }, []);

  const bodyElement = document.querySelector("body");
  React.useEffect(() => {
    if (bodyElement && bodyElement.classList?.contains("modal-open")) {
      bodyElement.style.overflow = "hidden !important";
    } else {
      bodyElement.style.overflow = "auto  !important";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchText(formData));
    dispatch(searchGlobal({ name: formData, tab_name: "tabs", token: token }));
    dispatch(setCurrentSearchStatus("tabs"));
    dispatch(setsearchAlphabet(false));
    dispatch(setSearchResult({}));
    dispatch(
      setTabsResultCount({
        invoice: 0,
        incident: 0,
        "incident-date": 0,
        check: 0,
        "client-name": 0,
        "client-email": 0,
        "client-SSN": 0,
        "client-phone": 0,
        "client-birthday": 0,
        defendant: 0,
        "defendant-phone": 0,
        witness: 0,
        claim: 0,
        "court-case": 0,
        otherparty: 0,
        address: 0,
        notes: 0,
        document: 0,
      })
    );
  };
  // useEffect(() => {
  //   console.log("The  Global  function has been called")
  //   if (searchText != "") {
  //     if (searchAlphabet == false) {
  //       dispatch(searchGlobal({ name: searchText, tab_name: "tabs" }));
  //     } else {
  //       dispatch(searchGlobal({ name: searchText, tab_name: "alphabets" }));
  //     }
  //   }
  // }, [searchText]);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  // For viewing document when redirect from searchPage
  const searchDocument = useSelector((state) => state.searchS.searchDocument);
  const { showDocumentModal } = useDocumentModal();
  useEffect(() => {
    if (searchDocument) {
      showDocumentModal(
        "document",
        mediaRoute(searchDocument.upload),
        searchDocument
      );
      dispatch(setSearchDocument(""));
    }
  }, [searchDocument]);

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    // Trigger the expansion when the input is clicked
    setExpanded(!expanded);
  };

  return (
    <>
      <header className="header-main">
        <div
          className={`logo Header-z-index-99999 default-branding-logo branding-logo-div header-logo-container-top`}
          style={blurEffect ? { filter: "blur(4px)" } : {}}
        >
          <div className="logo-wrap">
            <img
              className={`logoss pt-1 ${attorneyBranding ? "px-2" : ""}`}
              style={{
                height: "60px",
                ...(attorneyBranding
                  ? {}
                  : { paddingLeft: "3rem", paddingRight: "5rem" }),
              }}
              src={
                "https://simplefirm-bucket.s3.amazonaws.com/static/images/shutterstock_583717939_c7Rm30h.jpg"
              }
            />
          </div>
        </div>
        <div className="d-flex d-flex-1 align-items-center flex-wrap">
          {/* Navbar Profile */}
          <NewNavbarProfile />
          <div
            className="top-nav-wrapper d-flex flex-wrap d-flex-1"
            style={
              blurEffect
                ? { filter: "blur(4px)", marginTop: "1px" }
                : { marginTop: "1px" }
            }
          >
            <NavbarLinks expanded={expanded} />
            <div className="search-icon-wrap">
              <button
                className={`more-button ${isTopNavOpen ? "" : "active"}`}
                // onClick={toggleTopNav}
              >
                <span className="ic ic-17 h-100 has-no-after text-white d-flex align-items-center justify-content-center rotate-180">
                  <svg
                    width={17}
                    height={50}
                    viewBox="0 0 17 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                      fill="currentColor"
                    />
                    <path
                      d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </button>
              <button id="searchIcon" className="search-icon pl-md-3 pr-md-3">
                <i className="ic ic-discovery ic-29" />
              </button>
              {isSearchURL ? (
                <form
                  className="search-form search-form-control-skew bg-white"
                  id="search-form"
                  style={{
                    position: "relative", // Stay in normal flow
                    marginRight: "0px",
                    width: expanded ? "322.5px" : "232px",
                    transition: expanded
                      ? "width 0.3s ease-out, margin-left 0.3s ease-out"
                      : "width 0.3s ease-in, margin-left 0.3s ease-in", // Add margin transition
                    marginLeft: expanded ? "0%" : "0%",
                    marginTop: "20px",
                  }}
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    name="name"
                    ref={searchRef}
                    id="search_header"
                    className="form-control w-100 header-search-input"
                    defaultValue=""
                    onChange={handleChange}
                    onClick={handleExpand}
                  />
                  <div
                    className="search-btn search-btn-control-skew"
                    style={{ marginRight: "0px" }}
                  >
                    <input
                      className="btn H-btn"
                      type="submit"
                      form="search-form"
                      value="Search"
                      style={{ paddingLeft: "16px" }}
                    />
                  </div>
                  <div
                    className="right-skew header-right-transform-width8px"
                    style={{ height: "99%", right: "-7px" }}
                  />
                  {/* <div
                    className="left-skew Header-left-8px-width-8px"
                    style={{ height: "100%" }}
                  /> */}
                </form>
              ) : (
                <form
                  onClick={() => navigate(`/search/`)}
                  className="search-form search-form-control-skew"
                  id="search-form"
                  style={{
                    position: "relative",
                    marginRight: "0px",
                    width: expanded ? "322.5px" : "232px",
                    transition: expanded
                      ? "width 0.3s ease-out, margin-left 0.3s ease-out"
                      : "width 0.3s ease-in, margin-left 0.3s ease-in",
                    marginLeft: expanded ? "0%" : "0%",
                    marginTop: "20px",
                  }}
                >
                  <input
                    type="button"
                    name="name"
                    id="search_header"
                    className="form-control w-100"
                    defaultValue=""
                    onClick={handleExpand}
                  />
                  <div
                    className="search-btn search-btn-control-skew"
                    style={{ marginRight: "0px" }}
                  >
                    <input
                      className="btn H-btn"
                      type="submit"
                      form="search-form"
                      value="Search"
                      style={{ paddingLeft: "16px" }}
                    />
                    {/* <div className="right-skew header-right-transform-width-bg"></div>
                    <div
                      className="left-skew header-left-transform-width-bg-height"
                      style={{ height: "100%" }}
                    ></div> */}
                  </div>
                  <div
                    className="right-skew header-right-transform-width8px"
                    style={{ height: "99%", right: "-7px" }}
                  />
                  {/* <div
                    className="left-skew Header-left-8px-width-8px"
                    style={{ height: "100%" }}
                  /> */}
                </form>
              )}
            </div>
            {/* side bar button for small screens */}
            <div className="menu-btn">
              <button
                id="leftBtn"
                className="btn d-flex align-items-center justify-content-center"
                onClick={() => dispatch(toggleSidebar())}
              >
                <div id="nav-icon3" className={isSidebarOpen ? "open" : ""}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
      <DetailBar
        flaggedPageName={props?.flaggedPageName || ""}
        newFlags={props?.newFlags}
        setNewFlags={props?.setNewFlags}
      />
      {/* <header className="header-main-wrapper" id="client_header">
        <div
          className="logo Header-z-index-99999 default-branding-logo branding-logo-div"
          style={blurEffect ? { filter: "blur(4px)" } : {}}
        >
          <div className="logo-wrap">
            <img
              className="logoss"
              src={
                attorneyBranding ||
                "https://simplefirm-bucket.s3.amazonaws.com/static/images/shutterstock_583717939_c7Rm30h.jpg"
              }
            />
          </div>
        </div>
        <div className="top-row d-flex flex-wrap">
          <NavbarProfile />
          <div
            className="top-nav-wrapper d-flex flex-wrap d-flex-1"
            style={blurEffect ? { filter: "blur(4px)" } : {}}
          >
            <NavbarLinks />
            <div className="search-icon-wrap">
              <button
                className={`more-button ${isTopNavOpen ? "" : "active"}`}
                onClick={toggleTopNav}
              >
                <span className="ic ic-17 h-100 has-no-after text-white d-flex align-items-center justify-content-center rotate-180">
                  <svg
                    width={17}
                    height={50}
                    viewBox="0 0 17 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                      fill="currentColor"
                    />
                    <path
                      d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </button>
              <button id="searchIcon" className="search-icon pl-md-3 pr-md-3">
                <i className="ic ic-discovery ic-29" />
              </button>
              {isSearchURL ? (
                <form
                  className="search-form"
                  id="search-form"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    name="name"
                    ref={searchRef}
                    id="search_header"
                    className="form-control w-100"
                    defaultValue=""
                    onChange={handleChange}
                  />
                  <div className="search-btn">
                    <input
                      className="btn H-btn"
                      type="submit"
                      form="search-form"
                      value="Search"
                    />
                    <div className="right-skew header-right-transform-width-bg"></div>
                    <div className="left-skew header-left-transform-width-bg-height"></div>
                  </div>
                  <div className="right-skew header-right-transform-width8px" />
                  <div className="left-skew Header-left-8px-width-8px" />
                </form>
              ) : (
                <form
                  className="search-form"
                  id="search-form"
                  onClick={() => navigate(`/search/`)}
                >
                  <input
                    type="button"
                    name="name"
                    id="search_header"
                    className="form-control w-100"
                    defaultValue=""
                  />
                  <div className="search-btn">
                    <input
                      className="btn H-btn"
                      type="submit"
                      form="search-form"
                      value="Search"
                    />
                    <div className="right-skew header-right-transform-width-bg"></div>
                    <div className="left-skew header-left-transform-width-bg-height"></div>
                  </div>
                  <div className="right-skew header-right-transform-width8px" />
                  <div className="left-skew Header-left-8px-width-8px" />
                </form>
              )}
            </div>
            <div className="menu-btn">
              <button
                id="leftBtn"
                className="btn d-flex align-items-center justify-content-center"
                onClick={() => dispatch(toggleSidebar())}
              >
                <div id="nav-icon3" className={isSidebarOpen ? "open" : ""}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </div>
          </div> */}
      {/* <SearchBox /> */}
      {/* </div>
      </header>
      <DetailBar
        flaggedPageName={props?.flaggedPageName || ""}
        newFlags={props?.newFlags}
        setNewFlags={props?.setNewFlags}
      /> */}
    </>
  );
};

export default NavBar;
