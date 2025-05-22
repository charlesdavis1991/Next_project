import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateAge,
  formatDate,
  formatDateUTC,
  setCaseId,
  setClientId,
} from "../../Utils/helper";
import { Stages } from "../common/CaseStage";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { CustomDropdown } from "../common/Dropdown";
import { fetchCaseSummary } from "../../api/case";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
} from "../../Redux/caseData/caseDataSlice";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import incidentIcon from "../../assets/images/incident.svg";
import { setDynamicWidth } from "../../Redux/header_width/action";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import "./navbarProfile.css";
import { setBlurEffect } from "../../Redux/header_blur/action";

const NavbarProfile = () => {
  const client = useSelector((state) => state?.caseData?.summary?.for_client);
  const caseSummary = useSelector((state) => state?.caseData?.summary);
  const stages = useSelector((state) => state?.caseData?.stages);
  const pages = useSelector((state) => state?.caseData?.pages);
  const lastAccessedCases = useSelector(
    (state) => state?.caseData?.lastAccessedCases
  );
  const dynamicWidth = useSelector((state) => state.dynamicWidth.dynamicWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const todos_count = useSelector(
    (state) => state?.caseData?.current?.current_todos
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showRecentCases, setShowRecentCases] = useState(false);
  const page = "";
  const [closeDropdown, setCloseDropdown] = useState(false);

  useEffect(() => {
    calculateLongestNameWidth();
  }, [lastAccessedCases]);

  const calculateLongestNameWidth = () => {
    let longestNameLength = 0;
    let longestName = "";
    lastAccessedCases?.forEach((temp) => {
      const nameLength =
        `${temp.for_client.last_name}, ${temp.for_client.first_name}`.length;
      if (nameLength > longestNameLength) {
        longestNameLength = nameLength;
        longestName = temp.for_client.first_name;
      }
    });
    const nameLength = `${client?.first_name}, ${client?.last_name}`.length;

    if (nameLength > longestNameLength) {
      longestNameLength = nameLength;
      longestName = client?.first_name;
    }

    const nameWidth =
      longestNameLength <= 26 ? 19 : longestNameLength <= 30 ? 17 : 16;

    const width = Math.max(369, longestNameLength * nameWidth);
    dispatch(setDynamicWidth(width));
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
     
     
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".client-details-wrapper")
      ) {
  
        setShowRecentCases(false);
        dispatch(setBlurEffect(false));
        document.body.classList.remove("modal-open", "has-blurred-bg");
        const menuContainer = document.getElementById("padding-top-165");
        if (menuContainer) {
          menuContainer.style.filter = "";
        }
        const divToRemove = document.querySelector(".header-blur-show");
        if (divToRemove) {
          document.body.removeChild(divToRemove);
        }
      }
    }
    if (showRecentCases) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // document.body.classList.remove("modal-open", "has-blurred-bg");
      // const menuContainer = document.getElementById("padding-top-165");
      // if (menuContainer) {
      //   menuContainer.style.filter = "";
      // }
      // const divToRemove = document.querySelector(".header-blur-show");
      // if (divToRemove) {
      //   document.body.removeChild(divToRemove);
      // }
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRecentCases]);

  const displayRecentCases = () => {
    const parentNode = document.body;
    const divToRemove = document.querySelector(".header-blur-show");
    const menuContainer = document.getElementById("padding-top-165");

    if (showRecentCases) {
      document.body.classList.remove("modal-open", "has-blurred-bg");
      parentNode.style.overflow = "auto";
      if (menuContainer) {
        menuContainer.style.filter = "";
      }
      if (divToRemove) {
        parentNode.removeChild(divToRemove);
      }
      setShowRecentCases(false);
      dispatch(setBlurEffect(false));
    }
    if (!showRecentCases) {
      const newDiv = document.createElement("div");

      document.body.classList.add("modal-open", "has-blurred-bg");
      if (menuContainer) {
        menuContainer.style.filter = "";
      }
      parentNode.style.overflow = "hidden";
      newDiv.className = "header-blur-show";
      parentNode.appendChild(newDiv);
      setShowRecentCases(true);
      dispatch(setBlurEffect(true));
    }
  };

  function extractDigits(phoneNumber) {
    return phoneNumber.replace(/\D/g, "");
  }

  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const adjustGridLayout = () => {
      const container = dropdownRef.current;
      const minWidth = dynamicWidth + 29;
      if (container && lastAccessedCases.length > 0) {
        let columns;

        if (window.innerWidth >= 1780 && minWidth <= 500) {
          columns = 4;
        } else if (window.innerWidth >= 1500 && minWidth <= 500) {
          columns = 3;
        } else if (window.innerWidth >= 1081 && minWidth <= 500) {
          columns = 2;
        } else if (window.innerWidth >= 2250 && minWidth >= 500) {
          columns = 4;
        } else if (window.innerWidth >= 1780 && minWidth >= 500) {
          columns = 3;
        } else if (window.innerWidth >= 1081 && minWidth >= 500) {
          columns = 2;
        } else {
          columns = 1;
        }

        let rows = Math.ceil(lastAccessedCases.length / columns);

        container.style.gridTemplateColumns = `repeat(${columns}, ${dynamicWidth + 29}px)`;
        container.style.gridTemplateRows = `repeat(${rows}, auto)`;
        container.style.setProperty(
          "width",
          `${minWidth * columns}px`,
          "important"
        );
        if (isLoading) {
          container.style.setProperty(
            "width",
            `${minWidth * columns}px`,
            "important"
          );
          container.style.backgroundColor = "var(--primary-4)";
        }
        container.style.overflowX = "auto";

        const items = container.children;
        for (let i = 0; i < items.length; i++) {
          const rowIndex = Math.floor(i / columns);
          const colIndex = i % columns;

          if (columns % 2 === 0) {
            if ((rowIndex + colIndex) % 2 === 0) {
              items[i].classList.add("bg-primary");
              items[i].classList.remove("bg-color-dropdown");
            } else {
              items[i].classList.add("bg-secondary");
              items[i].classList.remove("bg-color-dropdown");
            }
          }
          if (columns % 2 === 1) {
            if ((rowIndex + colIndex) % 2 === 1) {
              items[i].classList.add("bg-color-dropdown");
              items[i].classList.remove("bg-primary");
            } else {
              items[i].classList.add("bg-color-dropdown");
              items[i].classList.remove("bg-secondary");
            }
          }
        }
      }
    };

    adjustGridLayout();

    const handleResize = () => {
      if (dropdownRef.current) {
        setContainerWidth(dropdownRef.current.offsetWidth);
        adjustGridLayout();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    lastAccessedCases,
    dynamicWidth,
    containerWidth,
    showRecentCases,
    isLoading,
  ]);

  return (
    <>
      <div
        className="client-details-wrapper header-wrapper"
        style={{ width: `${dynamicWidth}px` }}
        onClick={displayRecentCases}
      >
        <div
          className="client-details"
          style={{ zIndex: 100 }}
          onclick="recent_cases_toggle()"
          data-toggle="modal"
          data-target="#prev-client-modal"
        >
          <div
            className="right-skew"
            id="client_panel_right_skew"
            onclick="recent_cases_toggle()"
            data-toggle="modal"
            data-target="#prev-client-modal"
          ></div>
          <div
            className="left-skew"
            id="client_panel_left_skew"
            onclick="recent_cases_toggle()"
            data-toggle="modal"
            data-target="#prev-client-modal"
          ></div>
          <div className="client-image position-relative header-avatar-border">
            {client?.profile_pic_63p ? (
              <img src={client?.profile_pic_63p} alt={client?.first_name} />
            ) : (
              <i className="ic ic-client-avatar h-100 w-100"></i>
            )}
          </div>
          <div
            className="client-info position-relative z-index-1 d-flex-1"
            id="client-info"
          >
            <div className="client-name d-flex align-items-center">
              <a
                className="clientTabFont text-black d-block client_name_header text-nowrap"
                href="#"
              >
                {client && client.first_name && client.last_name ? (
                  <>
                    {client?.last_name}
                    <span className="text-dark-grey">,</span>&nbsp;
                    {client?.first_name}
                  </>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Box sx={{ width: 100 }}>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </Box>
                    <Box sx={{ width: 100 }}>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                    </Box>
                  </Stack>
                )}
              </a>
            </div>
            {/* <div className="client-phone">
              <a
                className="js-acc-btn text-black text-decoration-none"
                href="#"
              ></a>
            </div> */}
            <div className="d-flex align-items-center justify-content-between">
              <a
                href="#"
                className="js-acc-btn text-nowrap text-black accident-type d-flex align-items-center client_phone_header text-decoration-none"
              >
                {client && client.primary_phone ? (
                  client?.primary_phone?.phone_number && (
                    <span
                      className="text-black font-weight-semibold"
                      style={{ paddingTop: "9px" }}
                    >
                      <span
                        className="text-dark-grey"
                        style={{ paddingTop: "9px" }}
                      >
                        (
                      </span>
                      {extractDigits(client?.primary_phone.phone_number).slice(
                        0,
                        3
                      )}
                      <span
                        className="text-dark-grey"
                        style={{ paddingTop: "9px" }}
                      >
                        ){" "}
                      </span>
                      {extractDigits(client?.primary_phone.phone_number).slice(
                        3,
                        6
                      )}
                      <span
                        className="text-dark-grey"
                        style={{ paddingTop: "9px" }}
                      >
                        -
                      </span>
                      {extractDigits(client?.primary_phone.phone_number).slice(
                        6
                      )}
                    </span>
                  )
                ) : (
                  <Box sx={{ width: 100 }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </Box>
                )}
              </a>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-label color-grey-2 text-uppercase font-weight-bold">
                    <span className="ic-avatar ic-19 mr-8px m-0">
                      <img
                        src={birthdayIcon}
                        className="MR8H19"
                        style={{
                          paddingTop: "-4px",
                          marginRight: "10ppx",
                          marginLeft: "14px",
                          height: "19px",
                        }}
                      />
                    </span>
                  </div>
                  <p
                    className="font-weight-semibold"
                    style={{ paddingTop: "9px", width: "71px" }}
                  >
                    {client?.birthday ? formatDate(client.birthday) : ""}
                  </p>
                </div>
                <a
                  className="js-acc-btn text-black accident-date ml-auto text-decoration-none"
                  href="#"
                >
                  <span
                    className="client-age d-flex ml-auto p-0"
                    style={{ marginRight: "-8px" }}
                  >
                    <span
                      className="text-grey"
                      style={{ paddingTop: "9px", paddingLeft: "5px" }}
                    >
                      Age
                    </span>
                    <span
                      className="text-black ml-1 font-weight-semibold"
                      style={{ paddingTop: "9px", width: "20px" }}
                    >
                      {calculateAge(client?.birthday)}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <span className="ic has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center">
            <svg
              width="34"
              height="17"
              viewBox="0 0 34 17"
              fill="#19395f"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: showRecentCases ? "rotate(180deg)" : "" }}
            >
              <path
                d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                fill="#19395f"
              />
            </svg>
          </span>
        </div>
        {caseSummary ? (
          <div
            className="top-user-doi p-l-15 p-b-4 position-absolute"
            style={{
              width: `${dynamicWidth - 2}px`,
              backgroundColor: "rgb(255, 255, 255)",
              fontSize: "14px",
              marginLeft: "-3px",
              paddingLeft: "15px",
            }}
          >
            <div
              className="right-skew"
              id="client_panel_right_skew"
              onclick="recent_cases_toggle()"
              data-toggle="modal"
              data-target="#prev-client-modal"
              style={{ zIndex: window.innerWidth < 1150 ? 0 : 1 }}
            ></div>
            <div
              className="left-skew"
              id="client_panel_left_skew"
              onclick="recent_cases_toggle()"
              data-toggle="modal"
              data-target="#prev-client-modal"
              style={{ left: "-10px", top: "-3px" }}
            ></div>
            <div className="d-flex justify-content-between align-items-center">
              <div
                className="d-flex m-r-15"
                style={{ marginLeft: "-6px", zIndex: "2" }}
              >
                <div
                  style={{ marginRight: "-2px" }}
                  className="text-label color-grey-2 text-uppercase font-weight-bold"
                >
                  {caseSummary?.case_type?.casetype_icon && (
                    <span className="ic-avatar ic-19 mr-8px">
                      <img
                        className="img-19px"
                        src={caseSummary?.case_type?.casetype_icon}
                        alt="icon"
                      />
                    </span>
                  )}
                </div>
                <p
                  style={{ paddingTop: "2px" }}
                  className="font-weight-semibold"
                >
                  {caseSummary?.case_type?.name}
                </p>
              </div>
              <div
                className="d-flex"
                style={{ marginRight: "-2px", paddingTop: "1px", zIndex: "2" }}
              >
                {caseSummary.date_closed ? (
                  <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                    OPEN:{" "}
                  </div>
                ) : (
                  <div className="text-label m-r-5 color-green font-weight-bold">
                    OPEN:{" "}
                  </div>
                )}
                <p className="font-weight-semibold">
                  {formatDateUTC(caseSummary?.date_open)}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div
                className="d-flex m-r-15"
                style={{ marginLeft: "-12px", zIndex: "2" }}
              >
                <div
                  style={{ marginRight: "-8px" }}
                  className="text-label color-grey-2 text-uppercase font-weight-bold"
                >
                  <span className="ic-avatar ic-19 mr-8px">
                    <img src={incidentIcon} className="MR8H19" />
                  </span>
                </div>
                <p
                  style={{ paddingTop: "2px" }}
                  className="font-weight-semibold"
                >
                  {formatDate(caseSummary?.incident_date)}
                </p>
              </div>
              <div
                className="d-flex"
                style={{ marginRight: "-5px", paddingTop: "1px", zIndex: "2" }}
              >
                <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                  Last Accessed:{" "}
                </div>

                <p className="font-weight-semibold">12/12/2024</p>
              </div>
              {caseSummary?.date_closed && (
                <div className="d-flex m-r-15">
                  <>
                    <div className="text-label m-r-5 color-grey-2 text-uppercase font-weight-bold">
                      CLOSED:{" "}
                    </div>
                    <p className="font-weight-semibold">
                      {formatDateUTC(caseSummary?.date_closed)}
                    </p>
                  </>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Box
            className="top-user-doi p-l-15 p-b-4 position-absolute"
            sx={{
              width: `${dynamicWidth - 2}px`,
              backgroundColor: "rgb(255, 255, 255)",
              fontSize: "14px",
              marginLeft: "-3px",
              paddingLeft: "15px",
            }}
          >
            <div
              className="right-skew"
              id="client_panel_right_skew"
              onclick="recent_cases_toggle()"
              data-toggle="modal"
              data-target="#prev-client-modal"
              style={{ right: "-14px" }}
            ></div>
            <div
              className="left-skew"
              id="client_panel_left_skew"
              onclick="recent_cases_toggle()"
              data-toggle="modal"
              data-target="#prev-client-modal"
              style={{ left: "-10px" }}
            ></div>
            <div className="d-flex justify-content-between">
              <p className="font-weight-semibold d-flex">
                <Skeleton variant="circular" width={18} height={18} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={60} />
              </p>
              <div className="d-flex m-r-15">
                <p className="font-weight-semibold">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={80}
                  />
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <p className="font-weight-semibold">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={80}
                  />
                </p>
              </div>
              <div className="d-flex m-r-15">
                <p className="font-weight-semibold">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={80}
                  />
                </p>
              </div>
            </div>
          </Box>
        )}
      </div>
      {showRecentCases ? (
        <div
          className="previous-client wid-0-new dropdownWidth right-in pop-up-client"
          id="previous-client"
          ref={dropdownRef}
          style={{
            display: "grid",
            width: `${dynamicWidth}px`,
            marginLeft: "-15px",
            // gridTemplateColumns: `repeat(auto-fill, ${dynamicWidth + 29}px)`,
            // gridAutoFlow: "column",
            // gridTemplateRows: "repeat(5, auto)",
            gap: "0px",
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
                overflow: "hidden",
              }}
            >
              <div className="loader"></div>
            </div>
          ) : (
            lastAccessedCases &&
            lastAccessedCases?.map((temp) => (
              <div
                className="d-flex flex-column users-incident-popup bg-color-dropdown"
                key={temp.id}
                style={{ width: `${dynamicWidth + 29}px` }}
              >
                <a
                  href="#"
                  className="link-empty text-decoration-none"
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    const clientID = temp.for_client.id;
                    const caseID = temp.id;
                    const response = await api.get(
                      `/api/switch_client/${clientID}/${caseID}/${page.name}/`
                    );

                    setClientId(clientID);
                    setCaseId(caseID);
                    dispatch(fetchCurrentCase(clientID, caseID));
                    fetchCaseSummary(clientID, caseID)
                      .then((data) => {
                        dispatch(setCaseSummary(data));
                        dispatch(fetchAllPages(caseID));
                        setIsLoading(false);
                        setShowRecentCases(false);
                        dispatch(setBlurEffect(false));
                        document.body.classList.remove(
                          "modal-open",
                          "has-blurred-bg"
                        );
                        const menuContainer =
                          document.getElementById("padding-top-165");
                        if (menuContainer) {
                          menuContainer.style.filter = "";
                        }
                        const divToRemove =
                          document.querySelector(".header-blur-show");
                        if (divToRemove) {
                          document.body.removeChild(divToRemove);
                        }
                        navigate(`/bp-case/${clientID}/${caseID}`, {
                          replace: true,
                        });
                      })
                      .catch((err) => {
                        console.log("Error occurred", err);
                      });
                  }}
                />
                <div className="client-details pop-up-client-details">
                  <div
                    className="client-details-wrap-area  d-flex align-items-center text-decoration-none"
                    style={{ maxWidth: "none", margin: "0" }}
                  >
                    <div className="client-image pop-up-client-image position-relative header-avatar-border">
                      <a
                        href={
                          page
                            ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                            : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                        }
                      >
                        {temp.for_client.profile_pic_63p ? (
                          <img
                            src={temp.for_client.profile_pic_63p}
                            alt={`${temp.for_client.first_name} ${temp.for_client.last_name}`}
                          />
                        ) : (
                          <i className="ic ic-client-avatar h-100 w-100"></i>
                        )}
                      </a>
                    </div>
                    <div className="client-info pop-up-client-info overflow-hidden col p-0 h-100">
                      <div className="client-name pop-up-client-name d-flex align-items-center">
                        <a
                          href={
                            page
                              ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                              : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                          }
                          className="clientTabFont d-block text-decoration-none"
                        >
                          {temp.for_client.last_name}
                          <span className="Header-color-grey">, </span>
                          {temp.for_client.first_name}
                        </a>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <a
                          href={
                            page
                              ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                              : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                          }
                          className="js-acc-btn text-black accident-type d-flex align-items-center  client_phone_header text-decoration-none text-nowrap"
                        >
                          {temp.for_client.primary_phone &&
                            temp.for_client.primary_phone.phone_number && (
                              <span
                                className="text-black font-weight-normal font-weight-semibold"
                                style={{ paddingTop: "9px" }}
                              >
                                <span
                                  className="text-dark-grey"
                                  style={{ paddingTop: "9px" }}
                                >
                                  (
                                </span>
                                {extractDigits(
                                  temp.for_client.primary_phone.phone_number
                                ).slice(0, 3)}
                                <span
                                  className="text-dark-grey"
                                  style={{ paddingTop: "9px" }}
                                >
                                  ){" "}
                                </span>
                                {extractDigits(
                                  temp.for_client.primary_phone.phone_number
                                ).slice(3, 6)}
                                -
                                {extractDigits(
                                  temp.for_client.primary_phone.phone_number
                                ).slice(6)}
                              </span>
                            )}
                        </a>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="text-label color-grey-2 text-uppercase font-weight-bold">
                              <span className="ic-avatar ic-19 mr-8px m-0">
                                <img
                                  src={birthdayIcon}
                                  className="MR8H19"
                                  style={{
                                    paddingTop: "-4px",
                                    marginRight: "8px",
                                    marginLeft: "16px",
                                    height: "19px",
                                  }}
                                />
                              </span>
                            </div>
                            <p
                              className="font-weight-semibold"
                              style={{ paddingTop: "9px", width: "71px" }}
                            >
                              {formatDate(temp.for_client?.birthday)}
                            </p>
                          </div>
                          <a
                            href={
                              page
                                ? `/bp-switch_client/${temp.for_client.id}/${temp.id}/${page.name}`
                                : `/bp-switch_client/${temp.for_client.id}/${temp.id}/Case`
                            }
                            className="js-acc-btn text-black accident-date ml-auto text-decoration-none"
                          >
                            <span className="client-age d-flex ml-auto p-0">
                              <span
                                className="text-grey"
                                style={{
                                  paddingTop: "9px",
                                  paddingLeft: "5px",
                                }}
                              >
                                Age
                              </span>
                              <span
                                className="text-black ml-1 font-weight-semibold"
                                style={{ paddingTop: "9px", width: "20px" }}
                              >
                                {calculateAge(
                                  new Date(temp.for_client.birthday)
                                )}
                              </span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <ul
                    className="previous-clients-nav"
                    style={{ marginLeft: `${dynamicWidth - 363}px` }}
                  >
                    {pages &&
                      pages.map((item, index) => {
                        return (
                          <>
                            {item.show_on_sidebar && (
                              <li key={index}>
                                <a>
                                  <img src={item.page_icon} alt={item.name} />
                                  {item.name}
                                </a>
                              </li>
                            )}
                          </>
                        );
                      })}
                  </ul> */}
                </div>
                <div className="check-detail-items p-l-15 p-b-5 ">
                  <div
                    className="check-detail-items_wrap"
                    style={{ maxWidth: "none" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex m-r-15">
                        <div
                          style={{ marginRight: "-2px" }}
                          className="text-label color-grey-2 text-uppercase font-weight-bold"
                        >
                          {temp?.case_type?.casetype_icon && (
                            <span className="ic-avatar ic-19 mr-8px">
                              <img
                                className="img-19px"
                                src={temp?.case_type?.casetype_icon}
                                alt="icon"
                              />
                            </span>
                          )}
                        </div>
                        <p
                          style={{ paddingTop: "2px" }}
                          className="font-weight-semibold"
                        >
                          {temp.case_type && temp.case_type.name}
                        </p>
                      </div>

                      <div
                        className="d-flex m-r-15"
                        style={{ paddingTop: "1px" }}
                      >
                        <div className="text-label m-r-5 color-green font-weight-bold">
                          OPEN:{" "}
                        </div>
                        <p
                          className="font-weight-semibold"
                          style={{ width: "76px" }}
                        >
                          {temp.date_open && formatDateUTC(temp.date_open)}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <img src={incidentIcon} className="MR8H19" />
                        <p className="font-weight-semibold">
                          {temp.incident_date && formatDate(temp.incident_date)}
                        </p>
                      </div>
                      <div
                        className="d-flex m-r-15"
                        style={{ paddingRight: "4px" }}
                      >
                        <div
                          className="text-label color-green font-weight-bold"
                          style={{ marginRight: "1px" }}
                        >
                          Last Accessed:
                        </div>
                        <p
                          className="font-weight-semibold"
                          style={{ width: "76px" }}
                        >
                          12/12/2024
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <Stages stageCase={caseSummary} stages={stages} />
                  <div
                    className="to-do-flag-wrapper ml-auto pb-0 col-auto"
                    style={{ padding: "0 5px" }}
                  >
                    <small className="pr-2 pr-lg-5 text-center">
                      <div className="text-label">To-Dos</div>
                      <h3
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          margin: "0",
                        }}
                      >
                        {todos_count}
                      </h3>
                    </small>
                    <div
                      className="flagged-icon-wrap text-right"
                      id="flagged_icon_div"
                    >
                      {caseSummary?.flagged_page ? (
                        <div
                          className="d-flex align-items-center"
                          onClick={remove_flag}
                        >
                          <i className="ic ic-45 ic-flag-red cursor-pointer"></i>
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center"
                          onClick={async () => {
                            if (!isFlagPageLoading) {
                              setFlagModalShow(true);
                            }
                          }}
                        >
                          <i className="ic ic-45 ic-flag-grey d-flex cursor-pointer"></i>
                        </div>
                      )}
                    </div>
                  </div> */}
                  {/* <CustomDropdown /> */}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </>
  );
};

export default NavbarProfile;
