import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateAge,
  formatDate,
  formatDateUTC,
  getCaseId,
  getClientId,
  mediaRoute,
  setCaseId,
  setClientId,
} from "../../Utils/helper";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import incidentIcon from "../../assets/images/incident.svg";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import "./navbarProfile.css";
import { setDynamicWidth } from "../../Redux/header_width/action";
import { setBlurEffect } from "../../Redux/header_blur/action";
import CustomSkeleton from "./Skeleton";
import Loader from "./Loader";
import LastAccessedCases from "./LastAccessedCases";
import { fetchCaseSummary } from "../../api/case";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
} from "../../Redux/caseData/caseDataSlice";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  setCommonLoadingEffect,
  setComponentLoadingEffect,
} from "../../Redux/common/Loader/action";
import PulseLoader from "react-spinners/PulseLoader";
import { setHeaderName } from "../../Redux/header_name/action";
import LastAccessedCasesModal from "./LastAccessedCasesModal";

const NewNavbarProfile = () => {
  const client = useSelector((state) => state?.caseData?.summary?.for_client);

  const caseSummary = useSelector((state) => state?.caseData?.summary);
  const lastAccessedCases = useSelector(
    (state) => state?.caseData?.lastAccessedCases
  );
  const navigate = useNavigate();
  const page = "";

  const dynamicWidth = useSelector(
    (state) => state?.dynamicWidth?.dynamicWidth
  );
  const dispatch = useDispatch();
  const [showRecentCases, setShowRecentCases] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    calculateLongestNameWidth();
  }, [lastAccessedCases]);

  const calculateLongestNameWidth = () => {
    let longestNameLength = 0;
    lastAccessedCases?.forEach((temp) => {
      const nameLength =
        `${temp.for_client.last_name}, ${temp.for_client.first_name}`?.length;
      if (nameLength > longestNameLength) {
        longestNameLength = nameLength;
      }
    });
    const nameLength = `${client?.first_name}, ${client?.last_name}`?.length;

    if (nameLength > longestNameLength) {
      longestNameLength = nameLength;
    }

    const nameWidth =
      longestNameLength <= 26 ? 19 : longestNameLength <= 30 ? 17 : 16;

    const width = Math.max(420, longestNameLength * nameWidth);
    dispatch(setDynamicWidth(width));
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".header-wrapper-client")
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

  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const [EmptySlotsCount, setEmptySlotsCount] = useState();
  const [FilledSlotsCount, setFilledSlotsCount] = useState();
  useEffect(() => {
    const adjustGridLayout = () => {
      const container = dropdownRef.current;
      if (!container) return;

      let availableWidth =
        container.parentElement.getBoundingClientRect().width;
      let availableHeight = window.innerHeight - container.offsetTop;

      const caseHeight = 120;
      const minWidth = dynamicWidth + 7.5 ?? 0;
      const spacing = window.innerWidth - availableWidth;
      availableWidth = availableWidth - spacing;
      setContainerWidth(availableWidth);

      const columns = Math.floor(availableWidth / minWidth);
      const rows = Math.floor(availableHeight / caseHeight);

      availableHeight = rows * caseHeight;
      const totalVisibleSlots = columns * rows;
      const filledSlots = Math.min(
        totalVisibleSlots,
        lastAccessedCases?.length
      );
      const emptySlotsCount = totalVisibleSlots - filledSlots;
      console.log("Dynamic WIdth ===", dynamicWidth);
      console.log("Dynamic WIdth ===", availableWidth);
      console.log("columns ==>", columns);

      const columnsWidth = Math.max(
        availableWidth / columns,
        dynamicWidth + 7.5
      );
      console.log("columns ==>", columnsWidth);

      container.style.gridTemplateColumns = `repeat(${columns}, ${columnsWidth}px)`;
      container.style.gridTemplateRows = `repeat(${rows}, ${caseHeight}px)`;
      container.style.setProperty("width", `${availableWidth}px`, "important");
      container.style.height = `${availableHeight}px`;

      if (isLoading) {
        container.style.setProperty(
          "width",
          `${availableWidth}px`,
          "important"
        );
        container.style.height = `${availableHeight}px`;
        container.style.backgroundColor = "var(--primary-10)";
      }

      setEmptySlotsCount(emptySlotsCount);
      setFilledSlotsCount(filledSlots);

      for (let i = 0; i < filledSlots; i++) {
        const rowIndex = Math.floor(i / columns);
        const colIndex = i % columns;
        const slotElement = container.children[i];

        if (slotElement) {
          if ((rowIndex + colIndex) % 2 === 0) {
            slotElement.classList.add("bg-checkerboard-primary");
            slotElement.classList.remove("bg-checkerboard-secondary");
          } else {
            slotElement.classList.add("bg-checkerboard-secondary");
            slotElement.classList.remove("bg-checkerboard-primary");
          }
        }
      }

      for (let i = filledSlots; i < totalVisibleSlots; i++) {
        const rowIndex = Math.floor(i / columns);
        const colIndex = i % columns;
        const slotElement = container.children[i];

        if (slotElement) {
          if ((rowIndex + colIndex) % 2 === 0) {
            slotElement.classList.add("bg-checkerboard-primary");
            slotElement.classList.remove("bg-checkerboard-secondary");
          } else {
            slotElement.classList.add("bg-checkerboard-secondary");
            slotElement.classList.remove("bg-checkerboard-primary");
          }
        }
      }
    };

    adjustGridLayout();

    const handleResize = () => {
      adjustGridLayout();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [lastAccessedCases, dynamicWidth, isLoading, showRecentCases]);

  // useEffect(() => {
  //   const adjustGridLayout = () => {
  //     const container = dropdownRef.current;
  //     if (!container) return;
  //     let availableWidth =
  //       container.parentElement.getBoundingClientRect().width + 9;

  //     const availableHeight = window.innerHeight - container.offsetTop;

  //     const caseHeight = 120;
  //     const maxCases = Math.floor(availableHeight / caseHeight);
  //     const visibleCases = lastAccessedCases.slice(0, maxCases);
  //     const spacing = window.innerWidth - availableWidth;
  //     availableWidth = availableWidth - spacing;
  //     setContainerWidth(availableWidth);
  //     const minWidth = dynamicWidth ?? 0;
  //     let columns;
  //     columns = Math.floor(availableWidth / minWidth);
  //     let columnsWidth = availableWidth / columns;

  //     let rows = Math.ceil(lastAccessedCases?.length / columns);

  //     container.style.gridTemplateColumns = `repeat(${columns}, ${columnsWidth}px)`;
  //     container.style.gridTemplateRows = `repeat(${rows}, auto)`;
  //     container.style.setProperty("width", `${availableWidth}px`, "important");
  //     container.style.gridTemplateRows = `repeat(${visibleCases.length}, ${caseHeight}px)`;
  //     container.style.height = `${availableHeight}px`;

  //     const totalSlots = columns * maxCases;
  //     const filledSlots = lastAccessedCases.length;
  //     const emptySlotsCount = totalSlots - filledSlots;
  //     console.log(
  //       "Available Height ===>",
  //       window.innerHeight,
  //       availableHeight,
  //       container.offsetTop
  //     );
  //     console.log("Empty Slots count ===>", emptySlotsCount);
  //     setEmptySlotsCount(emptySlotsCount);

  //     if (isLoading) {
  //       container.style.backgroundColor = "var(--primary-10)";
  //     }
  //     setContainerWidth(container.getBoundingClientRect().width);
  //     const items = container.children;

  //     // for (let i = 0; i < items.length; i++) {
  //     //   const rowIndex = Math.floor(i / columns);
  //     //   const colIndex = i % columns;

  //     //   if (columns % 2 === 0) {
  //     //     if ((rowIndex + colIndex) % 2 === 0) {
  //     //       items[i].classList.add("bg-checkerboard-primary");
  //     //       items[i].classList.remove("bg-color-dropdown");
  //     //       items[i].classList.remove("bg-color-secondary");
  //     //     } else {
  //     //       items[i].classList.add("bg-checkerboard-secondary");
  //     //       items[i].classList.remove("bg-color-dropdown");
  //     //       items[i].classList.remove("bg-color-primary");
  //     //     }
  //     //   } else {
  //     //     if ((rowIndex + colIndex) % 2 === 1) {
  //     //       items[i].classList.add("bg-color-dropdown");
  //     //       items[i].classList.remove("bg-checkerboard-primary");
  //     //       items[i].classList.remove("bg-checkerboard-secondary");
  //     //     } else {
  //     //       items[i].classList.add("bg-color-dropdown");
  //     //       items[i].classList.remove("bg-checkerboard-secondary");
  //     //       items[i].classList.remove("bg-checkerboard-primary");
  //     //     }
  //     //   }
  //     // }
  //     for (let i = 0; i < items.length; i++) {
  //       const rowIndex = Math.floor(i / visibleCases.length);
  //       const colIndex = i % visibleCases.length;

  //       if ((rowIndex + colIndex) % 2 === 0) {
  //         items[i].classList.add("bg-checkerboard-primary");
  //       } else {
  //         items[i].classList.add("bg-checkerboard-secondary");
  //       }
  //     }
  //   };

  //   adjustGridLayout();

  //   const handleResize = () => {
  //     adjustGridLayout();
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [lastAccessedCases, dynamicWidth, isLoading, showRecentCases]);

  function extractDigits(phoneNumber) {
    return phoneNumber.replace(/\D/g, "");
  }

  const skewAmount1 = useMemo(() => {
    const angleInDegrees = 11.31;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    return Math.tan(angleInRadians) * 75; // Adjust based on height
  }, []);

  const skewAmount2 = useMemo(() => {
    const angleInDegrees2 = 11.31;
    const angleInRadians2 = (angleInDegrees2 * Math.PI) / 180;
    return Math.tan(angleInRadians2) * 50; // Adjust based on height
  }, []);
  useEffect(() => {
    const rectangle = document.querySelector(".header-client-details");
    if (rectangle) {
      rectangle.style.clipPath = `polygon(${skewAmount1}px 0, calc(100% - ${skewAmount1}px) 0, 100% 100%, 0 100%)`;
    }
  }, [skewAmount1]);

  useEffect(() => {
    const rectangle2 = document.querySelector(".header-top-user-doi");
    if (rectangle2) {
      rectangle2.style.clipPath = `polygon(${skewAmount2}px 0, calc(100% - ${skewAmount2}px) 0, 100% 100%, 0 100%)`;
    }
  }, [skewAmount2]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Replace your existing showRecentCases logic with:
  const displayRecentCasesModal = () => {
    console.log("Clicked");
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="header-wrapper-client"
        style={{ width: `${dynamicWidth ?? 0}px`, marginTop: "0.625rem" }}
        onClick={displayRecentCasesModal}
      >
        <div
          className="header-client-details"
          style={{
            zIndex: 100,
            // clipPath: `polygon(12px 0, 95% 0, 98% 100%, 0% 100%)`,
          }}
        >
          <div
            className="header-client-image"
            style={{ marginLeft: "15px", marginRight: "5px" }}
          >
            {client?.profile_pic_63p ? (
              <div className="image-container">
                <img
                  src={mediaRoute(client?.profile_pic_63p)}
                  alt={client?.first_name}
                />
                <div className="border-overlay"></div>
              </div>
            ) : (
              <div className="icon-container">
                <i className="ic ic-client-avatar"></i>
                <div className="border-overlay"></div>
              </div>
            )}
          </div>
          <div
            id="client-info"
            className="d-flex flex-column justify-content-between position-relative d-flex-1 z-index-1 h-100"
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
              <span
                className="text-primary d-flex align-items-center justify-content-center"
                style={{
                  position: "absolute",
                  // right: `${dynamicWidth - 0.95 * dynamicWidth + 5}px`,
                  right: "20px",
                  top: "5px",
                }}
              >
                <svg
                  width="17"
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
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ height: "25px" }}
            >
              <a
                href="#"
                className="js-acc-btn text-nowrap text-black accident-type d-flex align-items-center client_phone_header text-decoration-none"
              >
                {caseSummary && caseSummary?.for_client?.primary_phone ? (
                  caseSummary?.for_client?.primary_phone?.phone_number && (
                    <span className="text-black font-weight-semibold">
                      (
                      {extractDigits(
                        caseSummary?.for_client?.primary_phone?.phone_number
                      ).slice(0, 3)}
                      ){" "}
                      {extractDigits(
                        caseSummary?.for_client?.primary_phone?.phone_number
                      ).slice(3, 6)}
                      -
                      {extractDigits(
                        caseSummary?.for_client?.primary_phone?.phone_number
                      ).slice(6)}
                    </span>
                  )
                ) : (
                  <Box sx={{ width: 100 }}>
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                  </Box>
                )}
              </a>
              <div className="d-flex" style={{ marginRight: "9px" }}>
                <div className="d-flex m-r-5">
                  <span className="ic-avatar ic-19 m-0 d-flex align-items-center m-r-5">
                    <img
                      src={birthdayIcon}
                      className=""
                      style={{
                        width: "19px",
                        height: "19px",
                      }}
                    />
                  </span>

                  <p className="font-weight-semibold" style={{ width: "70px" }}>
                    {caseSummary?.for_client?.birthday
                      ? formatDate(caseSummary?.for_client?.birthday)
                      : ""}
                  </p>
                </div>
                <a
                  className="js-acc-btn text-black accident-date ml-auto text-decoration-none d-flex align-items-center"
                  style={{ paddingLeft: "5px" }}
                  href="#"
                >
                  <span className="text-grey" style={{ fontWeight: "600" }}>
                    Age
                  </span>
                  <span
                    className="text-black m-l-5 font-weight-semibold"
                    style={{ width: "20px" }}
                  >
                    {calculateAge(caseSummary?.for_client?.birthday)}
                  </span>
                </a>
              </div>
            </div>
          </div>
          {/* <span
            className="text-primary d-flex align-items-center justify-content-center"
            style={{ position: "absolute", right: "25px", paddingTop: "1px" }}
          >
            <svg
              width="17"
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
          </span> */}
        </div>
        {caseSummary ? (
          <div
            className="header-top-user-doi"
            style={{
              width: `${dynamicWidth + 18 ?? 0}px`,
              height: "50px",
              backgroundColor: "rgb(255, 255, 255)",
              fontSize: "14px",
              marginTop: "-5px",
              clipPath: `polygon(${skewAmount2}px 0, calc(100% - ${skewAmount2}px) 0, 100% 100%, 0 100%)`,
              // clipPath: `polygon(9.2px 0, 97.9% 1px, ${dynamicWidth + 8.3}px 100%, 1px 100%)`,
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center w-100"
              style={{ padding: "0px 0px", height: "25px" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ zIndex: "2", marginLeft: "15px" }}
              >
                {caseSummary?.case_type?.casetype_icon && (
                  <span className="ic-avatar ic-19 m-r-5 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center">
                    <img
                      style={{ width: "19px", height: "19px" }}
                      src={caseSummary?.case_type?.casetype_icon}
                      alt="icon"
                    />
                  </span>
                )}

                <p className="font-weight-semibold">
                  {caseSummary?.case_type?.name}
                </p>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "15px", zIndex: "2" }}
              >
                {caseSummary.date_closed ? (
                  <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                    OPEN
                  </div>
                ) : (
                  <div className="text-label m-r-5 color-green font-weight-bold">
                    OPEN
                  </div>
                )}
                <p className="font-weight-semibold">
                  {formatDateUTC(caseSummary?.date_open)}
                </p>
              </div>
            </div>
            <div
              className="d-flex justify-content-between align-items-center w-100"
              style={{ padding: "0px 0px", height: "25px" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ marginLeft: "8px" }}
              >
                <span className="ic-avatar ic-19 m-r-5 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center">
                  <img
                    src={incidentIcon}
                    className=""
                    style={{ width: "19px", height: "19px" }}
                  />
                </span>

                <p className="font-weight-semibold">
                  {formatDate(caseSummary?.incident_date)}
                </p>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "8px" }}
              >
                <div className="text-label m-r-5 color-grey-2 font-weight-bold">
                  Last Accessed{" "}
                </div>

                <p className="font-weight-semibold">
                  {formatDate(caseSummary?.last_accessed_date)}
                </p>
              </div>
              {/* {caseSummary?.date_closed && (
                <div className="d-flex m-r-15">
                  <>
                    <div className="text-label m-r-5 color-grey-2 text-uppercase font-weight-bold">
                      CLOSED{" "}
                    </div>
                    <p className="font-weight-semibold">
                      {formatDateUTC(caseSummary?.date_closed)}
                    </p>
                  </>
                </div>
              )} */}
            </div>
          </div>
        ) : (
          <CustomSkeleton />
        )}
      </div>
      {showRecentCases && (
        <div
          className="header-last-accessed-client"
          id="previous-client"
          ref={dropdownRef}
          style={{
            display: "grid",
            gap: "0px",
            overflowY: "auto",
            maxHeight: "calc(100vh-119px)",
          }}
        >
          {isLoading ? (
            <PulseLoader
              loading={isLoading}
              size={16}
              aria-label="Loading Spinner"
              data-testid="loader"
              color="#19395F"
              style={{
                display: "flex",
                flexDirection: "row",
                height: "calc(100vh-119px)",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            />
          ) : (
            <>
              {lastAccessedCases
                ?.slice(0, FilledSlotsCount)
                ?.map((temp, index) => (
                  <LastAccessedCases
                    data={temp}
                    extractDigits={extractDigits}
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      dispatch(
                        setComponentLoadingEffect("medicalProviders", true)
                      );
                      dispatch(setComponentLoadingEffect("detailBar", true));
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
                          dispatch(setHeaderName("Case"));
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
                    page={page}
                    key={temp.id}
                  />
                ))}

              {Array.from({ length: EmptySlotsCount }, (_, index) => (
                <div
                  key={`empty-${index}`}
                  className={`checkerboard-slot ${
                    index % 2 === 0
                      ? "bg-checkerboard-primary"
                      : "bg-checkerboard-secondary"
                  }`}
                  style={{ height: `120px` }}
                ></div>
              ))}
            </>
          )}
        </div>
      )}
      <LastAccessedCasesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lastAccessedCases={lastAccessedCases}
        extractDigits={extractDigits}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        onCaseClick={async (e, caseData) => {
          e.preventDefault();
          setIsLoading(true);
          dispatch(setComponentLoadingEffect("medicalProviders", true));
          dispatch(setComponentLoadingEffect("detailBar", true));
          const clientID = caseData.for_client.id;
          const caseID = caseData.id;
          const response = await api.get(
            `/api/switch_client/${clientID}/${caseID}/${page ? page.name : "Case"}/`
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
              dispatch(setHeaderName("Case"));
              document.body.classList.remove("modal-open", "has-blurred-bg");
              const menuContainer = document.getElementById("padding-top-165");
              if (menuContainer) {
                menuContainer.style.filter = "";
              }
              const divToRemove = document.querySelector(".header-blur-show");
              if (divToRemove) {
                document.body.removeChild(divToRemove);
              }
              setIsModalOpen(false);
              navigate(`/bp-case/${clientID}/${caseID}`, {
                replace: true,
              });
            })
            .catch((err) => {
              console.log("Error occurred", err);
            });
        }}
        page={page}
      />
    </>
  );
};

export default NewNavbarProfile;
