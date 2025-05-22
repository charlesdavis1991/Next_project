// import Dropdown from "react-bootstrap/Dropdown";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import { Modal, Button, Nav, Form, Col, Row, Tab } from "react-bootstrap";
import "./dropdown-checklist.css";
import "../../../public/BP_resources/css/theme.css";
import "../../../public/BP_resources/css/notes.css";
import { setHeaderChecklistOpen } from "../../Redux/header_checklist/action";
import { getCaseId, getClientId } from "../../Utils/helper";
import axios from "axios";

export function CustomDropdown() {
  // const commutativeChecklist = useSelector(
  //   (state) => state?.caseData?.commutativeChecklist
  // );
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const caseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [flag, setFlag] = useState(true);
  const [caseProgressDropdown, setCaseProgressDropdown] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [cumulativeProgress, setCumulativeProgress] = useState(0);
  const [commutativeChecklist, setCommutativeChecklist] = useState(null);
  const dispatch = useDispatch();
  const [topMargin, setTopMargin] = useState(null);

  //U2024/14/6|4:19AM
  const fetchCommutativeChecklist = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/commulative-checklist/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCommutativeChecklist(response.data);
      setFlag(!flag);
    } catch (error) {
      console.error(error);
    }
  };

  function calculateTopMargin(event) {
    // Get the clicked element's top position relative to the document
    const topPosition = event.target.getBoundingClientRect().top;
    console.log("Top Posiition ===>", topPosition);
    setTopMargin(topPosition);
    setCaseProgressDropdown(!caseProgressDropdown);
  }
  //U2:13AM/6/27/2024
  function dropDownBtn() {
    return (
      <button
        className="dropdown-toggle text-white d-flex align-items-center justify-content-between w-100"
        id="dropdown-checklist"
        type="button"
        // data-toggle="dropdown"
        // aria-haspopup="true"
        // aria-expanded="false"
        onClick={(e) => {
          if (dropdownItems.length > 0) {
            dispatch(setHeaderChecklistOpen(!caseProgressDropdown));
            setCaseProgressDropdown(!caseProgressDropdown);
            calculateTopMargin(e);
          }
        }}
        // style={{ padding: "0px 10px 0px 5px" }}
      >
        <div
          className="nt-box translate-12px"
          style={{ paddingLeft: `${caseProgressDropdown ? "" : ""}` }}
        >
          <div
            className="circlechart case-checklist-percentage"
            data-percentage={
              commutativeChecklist?.all_checklists?.total_percentage
            }
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
                strokeDasharray={`${cumulativeProgress},100`}
                cx="16.9"
                cy="16.9"
                r="15.9"
              />
              <g className="circle-chart__info">
                <text className="circle-chart__percent" x="17.9" y="12.5">
                  {cumulativeProgress}%
                </text>
                <text className="circle-chart__subline" x="16.91549431" y={22}>
                  {cumulativeProgress}%
                </text>
              </g>
            </svg>
          </div>
        </div>
        <span
          className={`d-flex align-items-center ${caseProgressDropdown ? "" : "checklist-section_text-wrap"}`}
        >
          <span
            className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center translate-14px text-brightgreen"
            style={{
              position: caseProgressDropdown ? "relative" : "",
              left: caseProgressDropdown ? "0px" : "",
            }}
          >
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
          <span
            className="checklist-text text-nowrap move-icon-12"
            style={{
              lineHeight: "17px",
              right: caseProgressDropdown ? "-10px" : "",
              position: caseProgressDropdown ? "relative" : "",
            }}
          >
            Total Case <br /> Completion
          </span>
          <span
            className="ic has-no-after noML ic-arrow text-white d-flex align-items-center justify-content-center c-margin-1"
            style={{
              right: caseProgressDropdown ? "-10px" : "",
              position: caseProgressDropdown ? "relative" : "",
            }}
          >
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
        </span>
      </button>
    );
  }
  //U2:13AM/6/27/2024
  function dropDownChecklist() {
    return (
      <>
        <div
          className="checklist-dropdown header-checklist-dropdown"
          style={{ background: "none" }}
        >
          <div
            className="checklist-display "
            style={{
              marginLeft: "auto",
              maxWidth: "228px",
              clipPath: "polygon(0 0, 100% 0%, 100% 100%, 4% 100%)",
              paddingLeft: "0px",
            }}
          >
            {dropDownBtn()}
          </div>
          {dropdownItems &&
            dropdownItems.map((item, index) => (
              <div
                className="checklist-row"
                style={{
                  // paddingTop: "5px",
                  backgroundColor: `var(--primary-${index % 2 == 0 ? 20 : 30}) !important`,
                  marginLeft: "auto",
                  maxWidth: "219px",
                }}
              >
                <div
                  className="checklist-row-content"
                  style={{ paddingLeft: "5px", paddingRight: "20px" }}
                >
                  <div className="nt-box" id="margin-r-26 m-0">
                    <div
                      className="circlechart"
                      data-percentage={item.progress}
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
                          className="circle-chart__circle"
                          style={{ stroke: item.color }}
                          strokeDasharray={`${item.progress},100`}
                          cx="16.9"
                          cy="16.9"
                          r="15.9"
                        />
                        <g className="circle-chart__info">
                          <text
                            className="circle-chart__percent"
                            x="17.9"
                            y="12.5"
                          >
                            {item.progress}%
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="align-self-center translate-16px">
                    <img
                      className="checklist-page-icon"
                      src={`${item.icon}`}
                      alt="Icon"
                    />
                  </div>
                  <button
                    onclick="showHeaderRowDropdown(1)"
                    className="dropbtn d-flex white-color align-items-center translate-16px p-l-5"
                  >
                    {item.title.split(" ")[0]} {item.title.split(" ")[1]}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }
  useEffect(() => {
    if (flag) {
      fetchCommutativeChecklist();
    }
    if (commutativeChecklist && commutativeChecklist.all_checklists) {
      let items = [];

      const titlesOfInterest = [
        "client",
        "reports",
        "treatment",
        "defendants",
        "insurance",
        "loans",
        "costs",
      ];
      let index = 0;
      let colors = [
        "#009900",
        "#646464",
        "#0EA5E9",
        "#D4D4D4",
        "#646464",
        "#007bff",
      ];
      Object.keys(commutativeChecklist.all_checklists).forEach((key) => {
        const checklist = commutativeChecklist.all_checklists[key];
        const normalizedKey = key.toLowerCase();

        if (titlesOfInterest.includes(normalizedKey)) {
          let icon = "/bp_assets/img/check-icon.png"; // Default icon
          let progress;

          if (Array.isArray(checklist)) {
            const iconItem = checklist.find(
              (item) => item.page && item.page.page_icon
            );
            icon = iconItem ? iconItem.page.page_icon : icon; // Use the found icon or default
            progress =
              typeof checklist[checklist.length - 1] === "number"
                ? checklist[checklist.length - 1]
                : undefined;
          }

          items.push({
            progress: progress,
            icon: icon,
            title: key + " Page",
            color: colors[index],
          });
          index++;
        }
      });

      setDropdownItems(items);
      setCumulativeProgress(
        commutativeChecklist?.all_checklists?.total_percentage
      );
    }
  }, [commutativeChecklist, caseProgressDropdown]);

  return (
    <>
      {caseProgressDropdown ? (
        // <Modal
        //   show={caseProgressDropdown}
        //   onHide={() => {
        //     setCaseProgressDropdown(!caseProgressDropdown);
        //   }}
        //   contentClassName="remove-modal-content"
        //   dialogClassName="modal-dialog INS-max-width-1000px mr-0"
        //   style={{ position: "absolute", top: "5vh", left: "80vw",overflow:'scroll', scrollbarWidth:"none"}}
        // >
        // {/* <Button variant="close" style={{backgroundColor:"transparent"}} onClick={handleClose} aria-label="Close"></Button> */}
        <div
          id="headerChecklist"
          className="checklist-section-wrapper ml-md-auto height-md-50 "
          style={{ width: "228px" }}
        >
          <div className="header-checklist-section checklist-section checklist-section-dropdown-header-checklist">
            {/* <p class="text-white">0/0</p> */}
            <div
              className="dropdown w-100"
              style={{ top: dropdownItems ? "175px" : "" }}
            >
              {dropDownChecklist()}
            </div>
          </div>
        </div>
      ) : (
        // </Modal>
        <div
          id="headerChecklist"
          className="checklist-section-wrapper ml-md-auto height-md-50 "
        >
          <div className="header-checklist-section checklist-section checklist-section-dropdown-header-checklist">
            {/* <p class="text-white">0/0</p> */}
            <div className="dropdown w-100">{dropDownBtn()}</div>
          </div>
        </div>
      )}
    </>
  );
}
