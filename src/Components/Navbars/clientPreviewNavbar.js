//this navbar is primarily for client portal
import React, { useState, useRef, useEffect } from "react";
import NavbarLinks from "./navbarLinks";
import NavbarProfileClient from "./clientPreviewProfile";
import DetailBar from "./detailBar";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, toggleSidebar } from "../../Redux/menu/actions";
import { useNavigate, useLocation } from "react-router-dom";
import { searchGlobal } from "../../Redux/search/searchSlice";
import { setCurrentSearchStatus, setSearchText } from "../../Redux/search/searchSlice";

const NavBarclient = (props) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.menu.isOpen);
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
  const [isTopNavOpen, setIsTopNavOpen] = useState(false);
  const [formData, setFormData] = useState('')
  const searchResults = useSelector((state) => state.searchS.searchResult);


  const searchRef = useRef(null)

  // Logic for redirecting use to search page when click in the Search Form
  const navigate = useNavigate()
  const location = useLocation();
  const isSearchURL = location.pathname.includes('search');

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
    setFormData(value)

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(searchGlobal({ name: formData }))
    dispatch(setCurrentSearchStatus("tabs"))
    dispatch(setSearchText(formData))


  }
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);
  return (
    <>
      <header className="header-main-wrapper-client" id="client_header">
        <div className="top-row d-flex flex-wrap">
          <NavbarProfileClient />
          <div className="top-nav-wrapper d-flex flex-wrap d-flex-1">
            <div className="search-icon-wrap">
              <h1>Client Portal</h1>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBarclient;
