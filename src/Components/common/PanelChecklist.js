import React, { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import "../../../public/BP_resources/css/theme.css";
import "../../../public/BP_resources/css/notes.css";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import { getCaseId, getClientId } from "../../Utils/helper";

const PanelChecklist = ({ entity_id, entity, type }) => {
  const caseId = getCaseId();
  const clientId = getClientId();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [topMargin, setTopMargin] = useState(null);
  const { isPanelChecklistUpdated } = useContext(ClientDataContext);
  async function loadData() {
    try {
      const response = await api.get(
        `api/panel_checklist/?case_id=${caseId}&client_id=${clientId}&entity=${entity}&entity_id=${entity_id}`
      );
      setData(response.data?.final_checklist);
      setPercentage(response.data?.checklist_panelpercentage);
    } catch (error) {
      setPercentage(null);
      setData([]);
    }
  }

  function modifyEntity(entity) {
    switch (entity) {
      case "Treatment":
        return "Providers";
      case "Defendants":
        return "Defendant";
      case "Witnesses":
        return "Witness";
      default:
        return entity;
    }
  }

  //U2:13AM/6/27/2024
  function dropDownBtn() {
    return (
      <button
        className="dropdown-toggle text-darker d-flex align-items-center justify-content-space-between w-100"
        id="myDropdown"
        type="button"
        onClick={(e) => calculateTopMargin(e)}
        aria-expanded="false"
        style={{ padding: show ? "0px 15px 0px 5px" : "" }}
      >
        <div
          className={`nt-box ${show ? "m-l-2" : "m-l-2"} m-r-1`}
          id="ntbox-margin-20"
        >
          {/*}    <div className="circlechart" data-percentage="50">
            </div>*/}
          <div
            className="circlechart m-r-8"
            data-percentage={80}
            id="case-checklist-percentage"
            style={{
              left: show ? "-0.5px" : "",
              position: show ? "relative" : "",
            }}
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
        <span className="d-flex align-items-center justify-content-between">
          <span
            className="ic has-no-after ic-check text-success d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center"
            style={{ marginLeft: show ? "7px" : "" }}
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
          {/* <span className="checklist-text has-column text-white c-margin-r-check">{entity=="Treatment" ? "Providers" : entity==='Defendants' ? 'Defendant' : entity } <br />Checklist</span> */}
          <span
            className="checklist-text has-column text-white c-margin-r-check"
            style={{
              right: show ? "-1.5px" : "",
              position: show ? "relative" : "",
            }}
          >
            {modifyEntity(entity)} <br />
            Checklist
          </span>
          <span
            className={`n-mr2 ic has-no-after ic-arrow text-white d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center`}
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
        // id="actionbarChecklist"
        // className="checklist-section-wrapper"
        // style={{ overflowY: "scroll", scrollbarWidth: "none" }}
      >
        <div className={type === "sol" ? "panel-skew-box-sol" : "panel-skew-box"} style={{ width: "225px" }}></div>
        <div
          className="checklist-section translate-5"
          style={{
            marginLeft: "auto",
            maxWidth: "208px",
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
                  className="checkbox-line p-r-5 p-l-5"
                  style={{
                    marginLeft: "auto",
                    backgroundColor: `var(--primary-${index % 2 == 0 ? 20 : 30}) !important`,
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    maxWidth: "196px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={element.status ? true : false}
                    disabled
                    id="medicalcheck11"
                    name="medicalcheck11"
                    className="m-r-5"
                  />
                  <label for="medicalcheck11" className="mb-0">
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
  }, [show, isPanelChecklistUpdated]);

  function calculateTopMargin(event) {
    // Get the clicked element's top position relative to the document
    const topPosition = event.target.getBoundingClientRect().top;
    setTopMargin(topPosition);
    setShow(!show);
  }

  return (
    <>
      {show ? (
        // <Modal
        //   show={show}
        //   onHide={() => setShow(!show)}
        //   contentClassName="remove-modal-content"
        //   dialogClassName="modal-dialog INS-max-width-1000px mr-0"
        //   style={{
        //     position: "absolute",
        //     left: "80vw",
        //     top: `${topMargin - 35}px`,
        //     overflowY: "scroll",
        //     scrollbarWidth: "none",
        //   }}
        // >
        //   <div
        //     id="actionbarChecklist"
        //     className="checklist-section-wrapper"
        //     style={{ overflowY: "scroll", scrollbarWidth: "none" }}
        //   >
        //      <div className="skew-box"></div>
        //     <div className="dropdown">{dropDownChecklist()}</div>
        //   </div>
        <div
          id="actionbarChecklist"
          className="checklist-section-wrapper"
          style={{ top: entity === "Defendants" ? "0" : "1px" }}
        >
          <div className={type === "sol" ? "panel-skew-box-sol" : "panel-skew-box"} style={{ width: "225px" }}></div>
          {dropDownChecklist()}
        </div>
      ) : (
        // </Modal>
        <div
          className="checklist-section-wrapper"
          style={{ top: entity === "Defendants" ? "0" : "1px" }}
        >
          <div className={type === "sol" ? "panel-skew-box-sol" : "panel-skew-box"} style={{ width: "225px" }}></div>
          <div className="checklist-section translate-5">
            <div className="dropdown w-100">{dropDownBtn()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(PanelChecklist);
