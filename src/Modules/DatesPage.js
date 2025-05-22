import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import MedicalTreatmentIcon from "../assets/images/medical-treatment-icon.svg";
import SimpleIcon from "../assets/images/simple-icon.svg";
import DetailIcon from "../assets/images/detail.svg";
import DatesIcon from "../assets/images/dates.svg";
import Avatar from "../assets/images/avatar.png";
import axios from "axios";
import Specialities from "../Components/BP/Specialities";
import SimplePageCaseProvider from "../Components/BP/SimplePageCaseProvider";
import DatesPageTable from "../Components/BP/DatesPageTable";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import DatesGapDropdown from "./DatesGapDropdown";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import Footer from "../Components/common/footer";
import GenericTabs from "../Components/common/GenericTab";
import { useNavigate } from "react-router-dom";

function DatesPage({ case_id }) {
  const linkStyle = {
    color: "white", // Note camelCase instead of color: "white"
    textDecoration: "none", // textDecoration instead of text-decoration
  };

  //hasnat
  const [needsUpdate, setNeedsUpdate] = useState(false);

  const handleUpdate = () => {
    console.log("re render");
    setNeedsUpdate((prev) => !prev);
  };
  //

  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos);
  const pages = useSelector((state) => state.todos);
  const currentCase = useSelector((state) => state.todos);

  const [specialitiesList, setSpecialitiesList] = useState([]);
  console.log("specialitiesList==>", specialitiesList);

  useEffect(() => {
    async function fetchSpecialitiesList() {
      const { data } = await axios.get(
        origin + "/api/treatment/specialities/" + case_id + "/"
      );
      setSpecialitiesList(data);
      console.log("setSpecialitiesList =>", data);
    }

    fetchSpecialitiesList();
  }, []);

  const [caseProvidersList, setcaseProvidersList] = useState([]);
  console.log("caseProvidersList==>", caseProvidersList);

  useEffect(() => {
    async function fetchSpecialitiesList() {
      const { data } = await axios.get(
        origin + "/api/treatment/case-providers/" + case_id + "/"
      );
      setcaseProvidersList(data);
    }

    fetchSpecialitiesList();
  }, [needsUpdate]);

  const navRef = useRef(null);
  const [useAbbreviations, setUseAbbreviations] = useState(false);

  useEffect(() => {
    const updateTabVisibility = () => {
      const screenWidth = window.innerWidth;
      const thresholdWidth = 1200;

      if (navRef.current) {
        const navWidth = navRef.current.clientWidth;
        const tabs = navRef.current.querySelectorAll(".spec-tab-item");
        const totalTabsWidth = Array.from(tabs).reduce(
          (total, tab) =>
            total +
            tab.offsetWidth +
            (parseInt(window.getComputedStyle(tab).marginLeft, 10) +
              parseInt(window.getComputedStyle(tab).marginRight, 10)),
          0
        );
        // Use screenWidth to decide on abbreviations
        const abbreviate =
          screenWidth < thresholdWidth || totalTabsWidth > navWidth;
        setUseAbbreviations(abbreviate);
        setSpecialityTabWidth(abbreviate);
      }
    };

    const setSpecialityTabWidth = (abbreviate) => {
      const tabs = navRef.current.querySelectorAll(".spec-tab-item");
      if (abbreviate) {
        tabs.forEach((tab) => {
          tab.style.width = `25px`;
          tab.style.minWidth = `25px`;
        });
      }
    };

    const resizeObserver = new ResizeObserver(updateTabVisibility);
    resizeObserver.observe(document.body);

    updateTabVisibility();

    return () => resizeObserver.disconnect();
  }, [specialitiesList]);

  const [activeSpecialty, setActiveSpecialty] = useState("all");
  const handleSpecialtyChange = (id) => {
    setActiveSpecialty(id);
  };

  const [treatmentDateData, settreatmentDateData] = useState([]);
  console.log("treatmentDateData", treatmentDateData.length);
  console.log("treatmentDateData", treatmentDateData);
  const [treatmentDateSpecialtyData, settreatmentDateSpecialtyData] = useState(
    []
  );

  useEffect(() => {
    async function fetchTreatmentDateData() {
      const { data } = await axios.get(
        origin + "/api/treatment/dates_treatment/" + case_id + "/"
      );
      settreatmentDateData(data);
    }

    fetchTreatmentDateData();

    // Fetch treatment dates data for specialty tabs
    async function fetchTreatmentDateSpecialtyData() {
      const { data } = await axios.get(
        origin +
          "/api/treatment/dates_treatment_specific_specialty/" +
          case_id +
          "/"
      );
      settreatmentDateSpecialtyData(data);
      console.log("Treatment Date Specialty Data : ", data);
    }

    fetchTreatmentDateSpecialtyData();
  }, []);

  async function fetchTreatmentDateGapData(gap) {
    console.log("GAP DATA gap : ", gap);
    const [response1, response2] = await Promise.all([
      axios.post(origin + "/api/treatment/dates_treatment/" + case_id + "/", {
        timeframe: gap,
      }),
      axios.post(
        origin +
          "/api/treatment/dates_treatment_specific_specialty/" +
          case_id +
          "/",
        { timeframe: gap }
      ),
    ]);
    const data = response1.data;
    console.log("gap wala data ==>", data);
    const specialty_data = response2.data;
    console.log("gap wala specialty_data ==>", specialty_data);
    settreatmentDateData(data);
    settreatmentDateSpecialtyData(specialty_data);
  }
  const buttonsConfig = [
    {
      label: "New Provider",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#newProvider",
    },
  ];

  // const linksConfig = [
  //   {
  //     to: "/simple/",
  //     label: "Simple",
  //     icon: <img src={SimpleIcon} width="35" alt="Simple" />,
  //     className: "three-icons ",
  //   },
  //   {
  //     to: "/treatment/",
  //     label: "Detail",
  //     icon: <img src={DetailIcon} width="35" alt="Detail" />,
  //     className: "three-icons ",
  //   },
  //   {
  //     to: "/dates/",
  //     label: "Dates",
  //     icon: <img src={DatesIcon} width="35" alt="Dates" />,
  //     className: "three-icons active white-space",
  //   },
  // ];
  const header_name = useSelector((state) => state.header_name?.header_name);
  const nav = useNavigate();

  const handleSimple = () => {
    nav("/simple/");
  };
  const handeleTreatment = () => {
    nav("/treatment/");
  };
  const handleDates = () => {
    nav("/dates/");
  };
  const tabsData = [
    {
      id: "simple",
      label: "Simple",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-90)",
      // modalTarget: "#addDefendant",
      onClick: handleSimple,
      leftHand: true,
      span: (
        <span className="font-weight-bold pr-2 text-gold">
          <img src={SimpleIcon} width="35" alt="Dates" />
        </span>
      ),
    },
    {
      id: "treatment",
      label: "Detail",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-80)",
      // modalTarget: "#addInsurance",
      onClick: handeleTreatment,
      leftHand: true,
      span: (
        <span className="font-weight-bold pr-2 text-gold">
          <img src={DetailIcon} width="35" alt="Detail" />
        </span>
      ),
    },
    {
      id: "dates",
      label: "Dates",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-70)",
      // modalTarget: "#addCounsel",
      left: "0px",
      onClick: handleDates,
      leftHand: true,
      span: (
        <span className="font-weight-bold pr-2 text-gold">
          <img src={DatesIcon} width="35" alt="Dates" />
        </span>
      ),
    },
  ];

  // const lastRealRowRef = useRef(null);
  // const tableRef = useRef();
  // console.log("lastRealRowRef", lastRealRowRef.current);
  // console.log("tableRef", tableRef.current);
  // const [additionalRows, setAdditionalRows] = useState(0);
  // const [numColumns, setNumColumns] = useState(0);
  // useEffect(() => {
  //   const calculateRows = () => {
  //     if (!tableRef.current || !lastRealRowRef.current) return;

  //     const pageHeight = window.innerHeight;
  //     const tableTop =
  //       tableRef.current.getBoundingClientRect().top + window.scrollY;
  //     if (tableTop > 0) {
  //       const lastRowHeight =
  //         lastRealRowRef.current.getBoundingClientRect().height || 25;
  //       // Get the height of existing rows
  //       const existingRows = tableRef.current.rows.length;

  //       const existingRowsWithData = Array.from(tableRef.current.rows).filter(
  //         (row) => {
  //           return Array.from(row.cells).some(
  //             (cell) => cell.textContent.trim() !== ""
  //           );
  //         }
  //       ).length;
  //       const existingRowsHeight = existingRowsWithData * lastRowHeight;

  //       const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10; // Subtracting a small buffer
  //       const rows = Math.floor(remainingHeight / lastRowHeight);
  //       // Set the number of rows needed to fill the remaining space
  //       setAdditionalRows(rows > 0 ? rows : 0);
  //     }
  //   };
  //   const extractColumns = () => {
  //     if (tableRef.current && tableRef.current.rows.length > 0) {
  //       const columns = tableRef.current.rows[0].cells.length;
  //       setNumColumns(columns);
  //     }
  //   };

  //   // Initial calculations
  //   calculateRows();
  //   extractColumns();

  //   // Resize event listener
  //   const handleResize = () => {
  //     calculateRows();
  //     extractColumns();
  //   };

  //   window.addEventListener("resize", handleResize);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [treatmentDateData]);

  // const calculateAdditionalRows = useCallback(() => {
  //   if (treatmentDateData.lenght === 0) {
  //     // Perform the logic when there is no data
  //     // dispatch(setIsSearchDisabled(true));
  //     const table = document.querySelector(".custom-table-directory");
  //     if (!table) return; // Check if the table exists

  //     const rowHeight = 25; // height of each row in px
  //     const viewportHeight = window.innerHeight;
  //     const tableBottom = table.getBoundingClientRect().bottom;
  //     const remainingHeight = viewportHeight - tableBottom;

  //     let additionalRows = Math.max(0, Math.floor(remainingHeight / rowHeight));

  //     const colSpan = table.querySelectorAll("thead tr th").length;
  //     const tbody = table.querySelector("tbody");

  //     // Clear existing fake rows
  //     const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
  //     existingFakeRows.forEach((row) => row.remove());

  //     // Append new fake rows
  //     for (let i = 0; i < additionalRows; i++) {
  //       const fakeRow = document.createElement("tr");
  //       fakeRow.className = "fake-row-2";
  //       fakeRow.style.height = `${rowHeight}px`;

  //       const td = document.createElement("td");
  //       td.colSpan = colSpan;
  //       td.innerHTML = "&nbsp;";
  //       fakeRow.appendChild(td);
  //       tbody.appendChild(fakeRow);
  //     }
  //   } else {
  //     const table = document.querySelector(".custom-table-directory");
  //     if (!table) return;
  //     const tbody = table.querySelector("tbody");

  //     // Clear existing fake rows
  //     const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
  //     existingFakeRows.forEach((row) => row.remove());
  //   }
  // }, [treatmentDateData]);

  // useEffect(() => {
  //   // Initial call
  //   calculateAdditionalRows();
  //   // Add resize event listener
  //   const handleResize = () => {
  //     calculateAdditionalRows();
  //   };
  //   window.addEventListener("resize", handleResize);
  //   // Cleanup function to remove the event listener
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [calculateAdditionalRows]);

  // const renderAdditionalRows = () => {
  //   return Array.from({ length: additionalRows }).map((_, rowIndex) => (
  //     <tr
  //       key={rowIndex}
  //       className="emptytestRows"
  //       style={{
  //         height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
  //       }}
  //     >
  //       {Array.from({ length: numColumns }).map((_, colIndex) => (
  //         <td
  //           key={colIndex}
  //           style={{
  //             height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
  //             color: "transparent",
  //           }}
  //         ></td>
  //       ))}
  //     </tr>
  //   ));
  // };
  console.log("specialitiesList", specialitiesList);

  return (
    <div className="height-webkit-available">
      <div className="page-wrapper">
        <Sidebar pages={pages} />
        <div className="page-container">
          <div className="top-panel-wrapper"></div>
          <NavBar
            flaggedPageName="Dates"
            client={client}
            currentCase={currentCase}
          />
          <div className="main-content height-webkit-available">
            <ActionBarComponent
              src={MedicalTreatmentIcon}
              page_name={header_name}
              buttons={buttonsConfig}
              isChecklist={false}
              // links={linksConfig}
              showChecklist={true}
            />
            {/* <div className="action-bar client-BarAlign anti-action-bar anti-client-BarAlign main-action-bar c-height-action-bar has-checklist d-flex m-b-5 m-t-5  margin-left-155  margin-left-12">
              <span className="page-icon">
                <img
                  className="translate-note-icon"
                  src={MedicalTreatmentIcon}
                />
              </span>
              <div className="text-wrapper text-white d-flex align-items-center p-l-5 width-60">
                <h2 className="text-white font-18">Treatment</h2>
              </div>
              <div className="mobile-action-btns ml-auto">
                <button
                  className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1"
                  id="actionbarToggleBtn"
                >
                  <span className="font-weight-bold pr-2 text-gold">+</span>
                  Actions
                </button>
              </div>
              <div className="btn-wrapper ml-auto left-pos-70 high-index new-provider-btn flex-row-reverse overflow-visible">
                <a
                  className="btn btn-primary rounded-0"
                  href="/30/addMedicalProvider/3/46/"
                  data-toggle="modal"
                  data-target="#newProvider"
                >
                  <span className="font-weight-bold text-gold pr-2">+</span>New
                  Provider
                </a>
                <div className="three-view-icons">
                  <Link to={`/simple/`} style={linkStyle}>
                    <span className="three-icons" onclick="location.href='/30/49/3/46/';">
                      <img src={SimpleIcon} width="35" />
                      Simple
                    </span>
                  </Link>
                  <Link to={`/treatment/`} style={linkStyle}>
                    <span className="three-icons" onclick="location.href='/30/9/3/46/';">
                      <img src={DetailIcon} width="35" />
                      Detail
                    </span>
                  </Link>
                  <Link to={`/dates/`} style={linkStyle}>
                    <span className="three-icons active white-space" onclick="location.href='/30/48/3/46/';">
                      <img src={DatesIcon} width="35" />
                      Dates
                      <span className="treatment-date"></span>
                    </span>
                  </Link>
                </div>
              </div>

              <div
                id="actionbarChecklist"
                className="checklist-section-wrapper"
              >
                <div className="skew-box"></div>

                <div className="checklist-section translate-5">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle text-white d-flex align-items-center justify-content-end w-100"
                      id="myDropdown"
                      type="button"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nt-box m-l-5" id="ntbox-margin-20">
                        <div
                          className="circlechart case-checklist-percentage"
                          data-percentage={50}
                          id="case-checklist-percentage"
                        >
                          <svg
                            className="circle-chart"
                            viewBox="0 0 33.83098862 33.83098862"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              className="circle-chart__background"
                              cx="16.9"
                              cy="16.9"
                              r="15.9"
                            />
                            <circle
                              className="circle-chart__circle stroke-vivid-cerulean"
                              strokeDasharray="24,100"
                              cx="16.9"
                              cy="16.9"
                              r="15.9"
                            />
                            <g className="circle-chart__info">
                              {" "}
                              <text
                                className="circle-chart__percent"
                                x="17.9"
                                y="12.5"
                              >
                                50%
                              </text>
                              <text
                                className="circle-chart__subline"
                                x="16.91549431"
                                y={22}
                              >
                                {" "}
                                100% 100%
                              </text>{" "}
                            </g>
                          </svg>
                        </div>
                      </div>
                      <span className="d-flex align-items-center">
                        <span className="ic has-no-after ic-check text-success d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
                          <svg
                            width={17}
                            height={50}
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        <span className="checklist-text ">
                          Treatment <br />
                          Page
                        </span>
                        <span className="ic has-no-after ic-arrow text-white d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
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
                            />
                            <path
                              d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>
                    <div
                      aria-labelledby="myDropdown"
                      className="dropdown-menu dropdown-menu-right dropdown-content"
                    >
                      <div className="checkbox-line">
                        <input
                          type="checkbox"
                          checked
                          disabled
                          onclick="location.href='/30/uncheckChecklist/25/3/46/';"
                          id="medicalcheck11"
                          name="medicalcheck11"
                        />
                        <label for="medicalcheck11">Treatment First name</label>
                      </div>
                      <div className="checkbox-line">
                        <input
                          type="checkbox"
                          disabled
                          onclick="location.href='/30/markChecklist/26/3/46/';"
                          id="medicalcheck11"
                          name="medicalcheck11"
                        />
                        <label for="medicalcheck11">Treatment last name</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="custom-tab d-flex">
              <nav
                className="d-flex justify-content-evenly align-items-center "
                style={{ marginTop: "5px", flex: "" }}
                id="spec-nav"
                ref={navRef}
              >
                <span
                  className="nav nav-tabs   justify-content-around spec-nav-tab flex-nowrap h-25px"
                  style={{
                    paddingRight: "5px",
                    paddingLeft: "36px",
                    minWidth: "min-content",
                  }}
                  id="nav-tab"
                  role="tablist"
                >
                  <a
                    className=" nav-item nav-link active   edit-case-tabs
                      "
                    // data-id="all"
                    onClick={() => handleSpecialtyChange("all")}
                    role="tab"
                    style={{
                      cursor: "pointer",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                    }}
                  >
                    All
                  </a>

                  {specialitiesList.map((specialitie) => (
                    <Specialities
                      key={specialitie.id}
                      specialitie={specialitie}
                      // useAbbreviations={useAbbreviations}
                      onSpecialtyChange={handleSpecialtyChange}
                      // isActive={activeSpecialty === specialitie.id}
                    />
                  ))}
                </span>
                <span
                  style={{ minWidth: "100%", paddingLeft: "16.5rem" }}
                  className=" "
                >
                  <GenericTabs tabsData={tabsData} height={25} />
                </span>
              </nav>
            </div>
            <div className=" c-overflow-y-scroll  height-webkit-available hidden-scrollbar">
              <div
                style={{
                  height: "100%",
                  backgroundColor: "var(--primary-2)",
                }}
                className="table-responsive table--no-card border-0 overflow-visible "
              >
                <table
                  // ref={tableRef}
                  style={{ tableLayout: "auto" }}
                  className="table table-borderless   has-specialty-icon "
                >
                  <thead>
                    <tr>
                      {/*}  <th className="width-47 background-main-10 "></th>*/}
                      <th
                        style={{ textAlign: "center" }}
                        className=" c-table-left-skew
                        position-relative overflow-y-clip date-page-table-hd color-primary c-font-weight-600"
                      >
                        <span>MEDICAL PROVIDER</span>
                      </th>
                      <th className="p-t-5 p-b-5 date-page-table-hd color-primary c-font-weight-600">
                        FIRST DATE
                      </th>
                      <th className="p-t-5 p-b-5 date-page-table-hd color-primary c-font-weight-600">
                        RECORD
                      </th>
                      <th className="p-t-5 p-b-5 notes-section date-page-table-hd">
                        <form
                          action="."
                          method="post"
                          className="d-flex align-items-center justify-content-end gaps-form-container"
                        >
                          <input
                            type="hidden"
                            name="csrfmiddlewaretoken"
                            value="5o8NEkGTVkvwP2qRWuvdIVxwEKC1vZDUnVPWzC14rly7T9MEugLlwqy2pBXCiKks"
                          />
                          <p className="color-primary c-font-weight-600">
                            SHOW GAPS BEYOND
                          </p>
                          <DatesGapDropdown
                            fetchTreatmentDateGapData={
                              fetchTreatmentDateGapData
                            }
                          />
                        </form>
                      </th>
                      <th className="pr-3 p-t-5 p-b-5 color-primary c-font-weight-600 date-page-table-hd">
                        TREATMENT NOTE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      // specialitiesList.map(specialitie => (
                      //   activeSpecialty === 'all' || activeSpecialty === specialitie.id ?
                      //   treatmentDateData.filter(treatmentDate => treatmentDate.client_provider.specialty === specialitie.id)
                      //       .map(treatmentDate => (
                      //         <DatesPageTable
                      //           key={treatmentDate.client_provider.id}
                      //           caseProvider={treatmentDate.client_provider}
                      //           setcaseProvidersList={setcaseProvidersList}
                      //           specialitie={specialitie}
                      //           setSpecialitiesList={setSpecialitiesList}
                      //           onUpdate={handleUpdate}
                      //           treatmentDateData={treatmentDate}
                      //         />
                      //       ))
                      //     : null
                      // ))

                      // Check if Active tab is all then show all treatment dates else show specific specialty treatment dates

                      activeSpecialty === "all"
                        ? treatmentDateData.map((treatmentDate, index) => (
                            <DatesPageTable
                              key={
                                treatmentDate.client_provider.id + "-" + index
                              }
                              caseProvider={treatmentDate.client_provider}
                              setcaseProvidersList={setcaseProvidersList}
                              specialitie={
                                treatmentDate.client_provider.specialty
                              }
                              setSpecialitiesList={setSpecialitiesList}
                              onUpdate={handleUpdate}
                              treatmentDateData={treatmentDate}
                            />
                          ))
                        : treatmentDateSpecialtyData
                            .filter(
                              (treatmentDate) =>
                                treatmentDate.client_provider.specialty.id ===
                                activeSpecialty
                            )
                            .map((treatmentDate, index) => (
                              <DatesPageTable
                                key={
                                  treatmentDate.client_provider.id +
                                  "-" +
                                  treatmentDate.client_provider.specialty.id +
                                  "-" +
                                  index
                                }
                                caseProvider={treatmentDate.client_provider}
                                setcaseProvidersList={setcaseProvidersList}
                                specialitie={
                                  treatmentDate.client_provider.specialty
                                }
                                setSpecialitiesList={setSpecialitiesList}
                                onUpdate={handleUpdate}
                                treatmentDateData={treatmentDate}
                              />
                            ))
                    }
                    {/* {renderAdditionalRows()} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default React.memo(DatesPage);
