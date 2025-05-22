import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import "../../../public/BP_resources/css/theme.css";
import "../../../public/BP_resources/css/notes.css";
const ChecklistWithoutPercentage = ({ entity_id, entity }) => {
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [topMargin, setTopMargin] = useState(null);
  async function loadData() {
    try {
      const response = await api.get(
        `api/panel_checklist/?case_id=${currentCase?.id}&client_id=${client?.id}&entity=${entity}&entity_id=${entity_id}`
      );
      console.log("Data Panel Checklist ====>", response.data?.final_checklist);

      setData(response.data?.final_checklist);
      setPercentage(response.data?.checklist_panelpercentage);
    } catch (error) {
      setPercentage(null);
      setData([]);
    }
  }

  console.log("Data ===>", data);

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
        style={{ padding: show ? "0px 14px 0px 5px" : "" }}
      >
        <span className="d-flex align-items-center">
          <span className="ic has-no-after ic-check text-success d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
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
          <span className="checklist-text has-column text-white c-margin-r-check">
            {modifyEntity(entity)} <br />
            
          </span>
          <span className="n-mr2 ic has-no-after ic-arrow text-white d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center ">
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
        <div className="skew-box" style={{ width: "225px" }}></div>
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
  }, [show]);

  function calculateTopMargin(event) {
    // Get the clicked element's top position relative to the document
    const topPosition = event.target.getBoundingClientRect().top;
    console.log("Top Positip", topPosition, show);
    setTopMargin(topPosition);
    setShow(!show);
  }

  return (
    <>
      {show ? (
        <div id="actionbarChecklist" className="checklist-section-wrapper">
          <div className="skew-box" style={{ width: "225px" }}></div>
          {dropDownChecklist()}
        </div>
      ) : (
        // </Modal>
        <div className="checklist-section-wrapper">
          <div className="skew-box" style={{ width: "225px" }}></div>
          <div className="checklist-section translate-5">
            <div className="dropdown w-100">{dropDownBtn()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChecklistWithoutPercentage;
