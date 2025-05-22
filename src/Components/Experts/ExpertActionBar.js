import React, { useState } from "react";
import ActionBarImg from "../../../public/BP_resources/images/icon/experts-icon-color.svg";
import { useSelector } from "react-redux";
import ActionBarComponent from "../common/ActionBarComponent";

const ExpertActionBar = ({ onFetchExperts }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Array(10).fill(true)); // Assuming 10 checklist items initially checked
  const client = useSelector((state) => state.todos.client);
  // const pages = useSelector((state) => state.todos.pages);
  // const currentCase = useSelector((state) => state.todos.currentCase);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCheck = (index) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  const checklistItems = [
    "example 1",
    "example 2",
    "example 3",
    "example 4",
    "example 5",
    "example 6",
    "example 7",
    "example 8",
    "example 9",
    "example 10",
  ];


  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div>
      <ActionBarComponent
        src={ActionBarImg}
        page_name={"Experts"}
        isChecklist={true}
      />
      {/* <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex  margin-left-11 overflow-visible">
        <span className="page-icon">
          <img
            className="m-l-2"
            src={ActionBarImg}
            alt="Incident Folder Icon"
          />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5">
          <h2 className="text-white">
            <nobr>Experts</nobr>
          </h2>
        </div>
        <PageChecklist entity={"Experts"} /> */}
      {/* <div id="actionbarChecklist" className="checklist-section-wrapper">
                    <div className="skew-box">
                    
                    </div>
                    <div className="checklist-section">
                        
                        <div className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
                       
                            <button
                                className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                                id={`myDropdown${client?.id}`}
                                type="button"
                                onClick={toggleDropdown}
                                aria-expanded={dropdownOpen}
                            >
                                <div className="nt-box">
                                    <div className="circlechart" data-percentage={client?.checklist_percentage}>
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
                                                        100%
                                                    </text>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <span className="d-flex align-items-center">
                                    <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                                        <svg width="17" height="50" viewBox="0 0 17 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                    <span className="checklist-text"> Reports <br />Page</span>
                                    <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                                        <svg width="17" height="50" viewBox="0 0 17 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z" fill="currentColor" />
                                            <path d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                </span>
                            </button>
                            <div
                                aria-labelledby={`myDropdown${client?.id}`}
                                className={`dropdown-menu dropdown-menu-right dropdown-content ${dropdownOpen ? 'show' : ''}`}
                            >
                                {checklistItems.map((item, index) => (
                                    <div key={index} className="checkbox-line">
                                        <input
                                            type="checkbox"
                                            checked={checkedItems[index]}
                                            id={`examplecheck${index + 1}`}
                                            name={`examplecheck${index + 1}`}
                                            onChange={() => toggleCheck(index)}
                                        />
                                        <label htmlFor={`examplecheck${index + 1}`}>{item}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> */}
      {/* <div className="mobile-action-btns ml-auto">
          <button
            className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1"
            id="actionbarToggleBtn"
          >
            <span className="font-weight-bold pr-2 text-gold">+</span>Actions
          </button>
        </div>
        <div className="btn-wrapper-old d-flex justify-content-end px-0"> */}
      {/* <button type="button" id="add-report-btn" className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25" data-bs-toggle="modal" data-bs-target="#addreport"><span className="font-weight-bold pr-2 text-gold">+</span>Report</button> */}
      {/* <Button
            className="btn btn-primary rounded-0 p-b-0 p-t-0 height-25"
            onClick={handleShow}
          >
            <span className="font-weight-bold pr-2 text-gold">+</span>Expert
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default ExpertActionBar;
