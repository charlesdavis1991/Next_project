//page checklist
import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { backdropClasses } from "@mui/material";

import { Modal, Button, Nav, Form, Col, Row, Tab } from "react-bootstrap";
import "../../../public/BP_resources/css/theme.css";
import "../../../public/BP_resources/css/notes.css";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
const PageChecklist = ({ entity, updateState }) => {
  const currentCase = parseInt(localStorage.getItem("case_id"));
  const client = parseInt(localStorage.getItem("client_id"));
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [topMargin, setTopMargin] = useState(null);
  const { isPanelChecklistUpdated } = useContext(ClientDataContext);
  async function loadData() {
    try {
      const response = await api.get(
        `api/page_checklist/?case_id=${currentCase}&client_id=${client}&page=${entity}`
      );
      setData(response.data?.final_checklist);
      setPercentage(response.data?.checklist_casepercentage);
    } catch (error) {
      setPercentage(null);
      setData([]);
    }
  }


  //U2:13AM/6/27/2024
  function dropDownBtn() {
    return (
      <button
        className={`dropdown-toggle text-white d-flex align-items-center ${show ? "" : "justify-content-end"} w-100`}
        id="myDropdown"
        type="button"
        onClick={(e) => calculateTopMargin(e)}
        aria-expanded="false"
        style={{ padding: show ? "0px 15px 0px 5px" : "" }}
      >
        <div
          className={`nt-box ${show ? "m-l-2" : "m-l-2"} m-r-1`}
          id="ntbox-margin-20"
          style={{
            left: show ? "-4px" : "",
            position: show ? "relative" : "",
          }}
        >
          {/*}    <div className="circlechart" data-percentage="50">
                        </div>*/}
          <div
            className="circlechart case-checklist-percentage"
            data-percentage={80}
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
                strokeDasharray={`${percentage ? percentage : 0},100`}
                cx="16.9"
                cy="16.9"
                r="15.9"
              />
              <g className="circle-chart__info">
                {" "}
                <text className="circle-chart__percent" x="17.9" y="12.5">
                  {percentage ? `${percentage}%` : "0%"}
                </text>
                <text className="circle-chart__subline" x="16.91549431" y={22}>
                  {" "}
                  100% 100%
                </text>{" "}
              </g>
            </svg>
          </div>
        </div>
        <span className="d-flex align-items-center">
          <span
            className="ic has-no-after ic-check text-success d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center"
            style={{
              left: show ? "-4.5px" : "",
              position: show ? "relative" : "",
            }}
          >
            <svg
              width="17"
              height="50"
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
          <span
            className="checklist-text "
            style={{
              right: show ? "-1.5px" : "",
              position: show ? "relative" : "",
            }}
          >
            {entity} <br />
            Page
          </span>
          <span
            className="ic has-no-after ic-arrow text-white d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center"
            style={{
              right: show ? "-1.5px" : "",
              position: show ? "relative" : "",
            }}
          >
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
    );
  }
  //U2:13AM/6/27/2024
  function dropDownChecklist() {
    return (
      <div
        aria-labelledby="myDropdown"
        // className={``}
        id="actionbarChecklist"
        className="checklist-section-wrapper"
        style={{
          boxSizing: "border-box",
          zIndex: 10,
          display: show ? "block" : "none",
        }}
      >
        <div className="page-skew-box" style={{ width: "225px" }}></div>
        <div
          className=" checklist-section  translate-5"
          style={{
            marginLeft: "auto",
            maxWidth: "215px",
            paddingRight: "0px",

            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 4% 100%)",
          }}
        >
          {dropDownBtn()}
        </div>
        {data
          ? data.map((element, index) => {
              const checked = element?.status ? `checked` : ``;
              return (
                <div
                  className="checkbox-line"
                  style={{
                    marginLeft: "auto",
                    backgroundColor: `var(--primary-${index % 2 == 0 ? 20 : 30}) !important`,
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    paddingLeft: "5px",
                    display: "flex",
                    alignItems: "center",

                    maxWidth: "207px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={element.status ? true : false}
                    disabled
                    id="medicalcheck11"
                    name="medicalcheck11"
                    style={{ marginRight: "5px" }}
                  />
                  <label
                    style={{ marginBottom: "0px", display: "inline" }}
                    for="medicalcheck11"
                  >
                    {element.name}
                  </label>
                </div>
              );
            })
          : ""}
      </div>
    );
  }

  useEffect(() => {
    loadData();
    if (show) {
      const element = document.getElementsByClassName("modal-content") | false;

      if (element) {
   
        element[0].classList.remove("modal-content");
      }
    }
  }, [show, updateState, isPanelChecklistUpdated]);

  function handleClose() {
    setShow(!show);
  }
  function calculateTopMargin(event) {
    // Get the clicked element's top position relative to the document
    const topPosition = event.target.getBoundingClientRect().top;
    console.log("Top Posiition ===>", topPosition, show);
    setTopMargin(topPosition);
    setShow(!show);
  }

  return (
    <>
      {show ? (
        // <Modal
        //   show={show}
        //   onHide={handleClose}
        //   contentClassName="remove-modal-content"
        //   dialogClassName="modal-dialog INS-max-width-1000px mr-0"
        //   style={{
        //     position: "absolute",
        //     top: `${topMargin - 35}px`,
        //     left: "80vw",
        //     overflow: "scroll",
        //     scrollbarWidth: "none",
        //   }}
        // >
        // <div id="actionbarChecklist" className="checklist-section-wrapper">
        <>
          {/* <div className="skew-box"></div> */}
          {/* <div className="dropdown">{dropDownChecklist()}</div> */}
          {dropDownChecklist()}
        </>
      ) : (
        // </div>
        // </Modal>
        <div id="actionbarChecklist" className="checklist-section-wrapper">
          <div className="page-skew-box" style={{ width: "225px" }}></div>
          <div className="checklist-section translate-5">
            <div className="dropdown">
              {dropDownBtn()}
              {dropDownChecklist()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageChecklist;
