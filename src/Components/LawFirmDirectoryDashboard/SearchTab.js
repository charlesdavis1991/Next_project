import React, { useState, useRef, useEffect } from "react";
import ReportingAgencyPopUp from "../Modals/ReportingAgencyPopUp";
import InsuranceCompanyPopUp from "../Modals/InsuranceCompanyPopUp";
import InsuranceAdjusterPopUp from "../Modals/InsuranceAdjusterPopUp";
import ExpertPopUp from "../Modals/ExpertPopUp";
import LawFirmModal from "../Modals/LawFirmModal";
import AttorneyModal from "../Modals/AttorneyModal";
import LoanCaseModal from "../Modals/LoanCaseModal";
import CourtDirectoryModal from "../Modals/CourtDirectoryModal";
import JudgeDirectoryModal from "../Modals/JudgeDirectoryModal";
import AddDepartmentModal from "../Modals/AddDepartmentModal";
import LitigationEventModal from "../Modals/LitigationEventModal";
import TimeCodeModal from "../Modals/TimeCodeModal";
import AddStatutesModal from "../Modals/AddStatutesModal";
import AddProcessorServerModal from "../Modals/AddProcessorServerModal";
import "./directory-47.css";
import { useSelector } from "react-redux";
import DirectorySearchDropdown from "../common/DirectorySearchDropdown";
import AddCourtDistrictModal from "../Modals/AddCourtDistrictModal";
import AddJurisdictionModal from "../Modals/AddJurisdictionModal";
import AddDivisionModal from "../Modals/AddDivisionModal";
import AddCircuitModal from "../Modals/AddCircuitModal";
import AddCourtFormsModal from "../Modals/AddCourtFormsModal";
import AddCalculatedDatesModal from "../Modals/AddCalculatedDateModal";
import DependantDateTypeModal from "../Modals/DependantDateTypeModal";
import ExpertCategoryModal from "../Modals/ExpertCategoryModal";
import ClickKeyModal from "../Modals/ClickKeyModal";
import StatusesModal from "../Modals/StatusesModal";
import ChecklistsModal from "../Modals/ChecklistsModal";
import PanelChecklistsModal from "../Modals/PanelChecklistModal";
import WorkunitModal from "../Modals/WorkunitModal";
import ActModal from "../Modals/ActModal";
import SpecialitySearchDropdown from "../common/SpecialitySearchDropdown";
import NewDirectoryProviderModal from "../Modals/NewDirectoryProviderModal";

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

const SearchTab = ({ onTabChange, currentTab }) => {
  const [activeTabText, setActiveTabText] = useState("Accounts");
  const searchInputRef = useRef(null);
  const [buttonText, setButtonText] = useState("Accounts");
  const [popups, setPopups] = useState({
    "CoPilot Firms": false,
    "Reporting Agency": false,
    "Insurance Company": false,
    "Insurance Adjuster": false,
    Experts: false,
    "Law Firm": false,
    Attorney: false,
    "Case Loan": false,
    Courts: false,
    Judges: false,
    Department: false,
    Provider: false,
    "Litigation Event": false,
    "Time Codes": false,
    Statute: false,
    "Process Server": false,
    Jurisdiction: false,
    "Court District": false,
    Division: false,
    Circuit: false,
    "Court Forms": false,
    "Calculated Dates": false,
    "Dependant Date Types": false,
    "Expert Specialties": false,
    "Click Key": false,
    Statuses: false,
    Checklists: false,
    "Panel Checklists": false,
    WorkUnits: false,
    Acts: false,
  });

  const admin =
    localStorage.getItem("directoryAdmin") === "true" ? true : false;
  console.log("lawfirm search-> admin check",admin);
  const tabs = admin
    ? [
        { label: "CoPilot Firms", value: "copilotfirms" },
        { label: "Attorney", value: "attorney" },
        { label: "Law Firm", value: "law-firm" },
        { label: "Courts", value: "courts" },
        { label: "Judges", value: "judge" },
        { label: "Provider", value: "provider" },
        { label: "Experts", value: "experts" },
        { label: "Reporting Agency", value: "reporting-agency" },
        { label: "Insurance Company", value: "insurance-company" },
        { label: "Insurance Adjuster", value: "insurance-adjuster" },
        { label: "Case Loan", value: "case-loan" },
        { label: "Department", value: "department" },
        { label: "Court District", value: "court-district" },
        { label: "Jurisdiction", value: "jurisdiction" },
        { label: "Division", value: "division" },
        { label: "Circuit", value: "circuit" },
        { label: "Court Forms", value: "courtForms" },
        { label: "Expert Specialties", value: "expertSpecialties" },
        { label: "Time Codes", value: "time-codes" },
        { label: "Statute", value: "statute" },
        { label: "Process Server", value: "process-server" },
        { label: "Litigation Event", value: "litigation-event" },
        { label: "Calculated Dates", value: "calculatedDates" },
        { label: "Dependant Date Types", value: "dependantDateTypes" },
        { label: "Click Key", value: "clickKeys" },
        { label: "Statuses", value: "statuses" },
        { label: "Checklists", value: "checklists" },
        { label: "Panel Checklists", value: "panelChecklists" },
        { label: "WorkUnits", value: "workunits" },
        { label: "Acts", value: "acts" },
      ]
    : [
        { label: "CoPilot Firms", value: "copilotfirms" },
        { label: "Attorney", value: "attorney" },
        { label: "Law Firm", value: "law-firm" },
        { label: "Courts", value: "courts" },
        { label: "Judges", value: "judge" },
        { label: "Provider", value: "provider" },
        { label: "Experts", value: "experts" },
        { label: "Reporting Agency", value: "reporting-agency" },
        { label: "Insurance Company", value: "insurance-company" },
        { label: "Insurance Adjuster", value: "insurance-adjuster" },
        { label: "Case Loan", value: "case-loan" },
      ];

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  const togglePopup = (popupName) => {
    setPopups((prevPopups) => ({
      ...prevPopups,
      [popupName]: !(prevPopups[popupName] || false),
    }));
  };

  function getOutputText(input) {
    switch (true) {
      case input.includes("Accounts"):
        return "Accounts";
      case input.includes("Reporting"):
        return "Reporting Agency";
      case input.includes("Insurance Adjuster"):
        return "Insurance Adjuster";
      case input.includes("Insurance Company"):
        return "Insurance Company";
      case input.includes("Experts"):
        return "Expert";
      case input.includes("Law Firm"):
        return "Law Firm";
      case input.includes("Attorney"):
        return "Attorney";
      case input.includes("Case Loan"):
        return "Case Loan";
      case input.includes("Courts"):
        return "Courts";
      case input.includes("Judges"):
        return "Judges";
      case input.includes("Department"):
        return "Department";
      case input.includes("Provider"):
        return "Provider";
      case input.includes("Litigation Event"):
        return "Litigation Event";
      case input.includes("Time Codes"):
        return "Time Codes";
      case input.includes("Statute"):
        return "Statute";
      case input.includes("Process Server"):
        return "Process Server";
      case input.includes("Court District"):
        return "Court District";
      case input.includes("Jurisdiction"):
        return "Jurisdiction";
      case input.includes("Division"):
        return "Division";
      case input.includes("Circuit"):
        return "Circuit";
      case input.includes("Court Forms"):
        return "Court Forms";
      case input.includes("Calculated Dates"):
        return "Calculated Dates";
      case input.includes("Dependant"):
        return "Dependant Date Types";
      case input.includes("Expert Specialties"):
        return "Expert Specialties";
      case input.includes("Click Key"):
        return "Click Key";
      case input.includes("Statuses"):
        return "Statuses";
      case input.includes("Checklists"):
        return "Checklists";
      case input.includes("Panel Checklists"):
        return "Panel Checklists";
      case input.includes("WorkUnits"):
        return "WorkUnits";
      case input.includes("Acts"):
        return "Acts";
      case input.includes("CoPilot"):
        return "CoPilot Firms";
      default:
        return "Court District";
    }
  }

  // useEffect(() => {
  //   const savedTabText = localStorage.getItem("activeTabText") || "Accounts";
  //   setActiveTabText(savedTabText);
  //   setButtonText(savedTabText);

  //   const handleTabClick = (e) => {
  //     const text = $(e.target).text();
  //     setActiveTabText(text);
  //     setButtonText(text);
  //     localStorage.setItem("activeTabText", text);

  //     if (searchInputRef.current) {
  //       searchInputRef.current.value = "";
  //       filterTabEntries();
  //     }
  //   };

  //   $(".PT9-LFD").on("click", handleTabClick);

  //   return () => {
  //     $(".PT9-LFD").off("click", handleTabClick);
  //   };
  // }, []);

  useEffect(() => {
    const selectedTabLabel =
      tabs.find((tab) => tab.value === currentTab)?.label || "Accounts";
    setActiveTabText(selectedTabLabel);
    setButtonText(selectedTabLabel);
  }, [currentTab]);

  const filterTabEntries = () => {
    const searchText = searchInputRef.current.value.toLowerCase().trim();
    const tables = document.querySelectorAll(
      ".custom-table-directory, .law-firm-list"
    );

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      let visibleRowIndex = 1; // Start indexing from 1
      const colSpan = table.querySelectorAll("thead tr th").length;

      rows.forEach((row) => {
        if (searchText.length > 1) {
          let shouldShow = false;

          const cellsToSearch = [...row.querySelectorAll(".is-search")];

          // Split the cleaned search text into individual words
          const searchWords = searchText
            .split(" ")
            .filter((word) => word.length > 0);

          // Check if any cell matches the search words starting from the beginning of the word
          shouldShow = cellsToSearch.some((cell) => {
            if (cell) {
              const cellText = cell.textContent.toLowerCase().trim();

              // Check if every search word matches the start of at least one word in the cell
              return searchWords.every((searchWord) =>
                cellText.includes(searchWord)
              );
            }
            return false;
          });

          row.classList.remove("filtered-row", "even", "odd");
          // if (row.classList.contains("no-search")) {
          //   shouldShow = false;
          // }
          if (shouldShow) {
            row.style.display = "table-row";
            row.querySelector("td:first-child").textContent = visibleRowIndex;
            visibleRowIndex += 1;
            row.classList.add("filtered-row");
            row.classList.add(visibleRowIndex % 2 === 1 ? "odd" : "even");
          } else {
            row.style.display = "none";
          }
        } else {
          row.style.display = "table-row";
        }
      });

      const tbody = table.querySelector("tbody");

      const fakeRows = table.querySelectorAll(".fake-row-2");
      fakeRows.forEach((fakeRow) => {
        if (fakeRow.parentNode) {
          fakeRow.remove();
        }
      });

      if (searchText !== "") {
        const tableBottom = table.getBoundingClientRect().bottom;
        const pageHeight = window.innerHeight;

        const rowHeight = 70; // Assuming each row is 70px high
        const remainingHeight = pageHeight - tableBottom;

        let rowsNeeded = Math.ceil(remainingHeight / rowHeight);
        if (rowsNeeded > 0) {
          rowsNeeded -= 1;
        }

        for (let i = 0; i < rowsNeeded; i++) {
          const fakeRow = document.createElement("tr");
          fakeRow.className = "fake-row-2";
          fakeRow.style.height = `${rowHeight}px`;

          const td = document.createElement("td");
          td.colSpan = colSpan;
          td.innerHTML = "&nbsp;";
          fakeRow.appendChild(td);
          tbody.appendChild(fakeRow);
        }
      }
    });
  };

  const handleInputChange = () => {
    filterTabEntries();
  };

  useEffect(() => {
    filterTabEntries();

    const handleResize = () => {
      filterTabEntries();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputLowercase = (e) => {
    e.target.value = e.target.value.toLowerCase();
  };

  useEffect(() => {
    const inputsEmail = document.querySelectorAll("input[name*=email]");
    const inputsWebsite = document.querySelectorAll("input[name*=website]");

    inputsEmail.forEach((input) =>
      input.addEventListener("keyup", handleInputLowercase)
    );
    inputsWebsite.forEach((input) =>
      input.addEventListener("keyup", handleInputLowercase)
    );

    return () => {
      inputsEmail.forEach((input) =>
        input.removeEventListener("keyup", handleInputLowercase)
      );
      inputsWebsite.forEach((input) =>
        input.removeEventListener("keyup", handleInputLowercase)
      );
    };
  }, []);

  const handleButtonClick = () => {
    const popupName = tabs.find((tab) => tab.value === currentTab)?.label;
    if (popupName) {
      togglePopup(popupName);
    }
  };

  const isSearchDisabled = useSelector(
    (state) => state.directory.isSearchDisabled
  );

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);

  const handleTabDropdownToggle = () => {
    setIsTabDropdownOpen(!isTabDropdownOpen);
  };

  const handleTabSelect = (value) => {
    onTabChange(value);
    setIsTabDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="nav nav-tabs mb-1 h-auto overflow-visible" role="tablist">
      <div
        className="d-flex align-items-center w-100"
        style={{ marginTop: "5px" }}
      >
        <div className="search-tab-wrapper position-relative">
          <button
            className="btn btn-primary dropdown-toggle py-0 height-25"
            type="button"
            onClick={handleTabDropdownToggle}
          >
            {tabs.find((tab) => tab.value === currentTab)?.label ||
              "Select Tab"}
          </button>

          {isTabDropdownOpen && (
            <ul className="dropdown-menu show position-absolute z-2 w-100 p-0">
              {tabs.map((tab, index) => (
                <li key={tab.value}>
                  <button
                    className={`dropdown-item ${currentTab === tab.value ? "active" : ""} py-0 px-3 height-25`}
                    onClick={() => handleTabSelect(tab.value)}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "var(--primary-5)"
                          : "var(--primary-10)",
                    }}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {activeTabText === "Provider" && <SpecialitySearchDropdown />}
        <input
          type="text"
          style={{
            flex: 1,
          }}
          className="form-control py-0 height-25"
          placeholder="Type Something to Filter"
          ref={searchInputRef}
          id="search_filter_directories"
          onChange={handleInputChange}
          disabled={isSearchDisabled}
        />
        <DirectorySearchDropdown />
        {/* may need to hide for directory admins */}
        {admin && (
          <div className="d-flex justify-content-end p-l-4">
            <button
              className="font-weight-bold btn btn-primary mr-1 py-0 height-25"
              onClick={handleButtonClick}
            >
              <span style={{ color: "gold", paddingRight: "6px" }}>+</span>{" "}
              {getOutputText(buttonText)}
            </button>
          </div>
        )}
      </div>
      <>
        {Object.keys(popups).map((popupName, index) => (
          <React.Fragment key={index}>
            {popupName === "Reporting Agency" && (
              <ReportingAgencyPopUp
                reportingAgencyPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Insurance Company" && (
              <InsuranceCompanyPopUp
                insuranceCompanyPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Insurance Adjuster" && (
              <InsuranceAdjusterPopUp
                insuranceAdjusterPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Experts" && (
              <ExpertPopUp
                expertPopup={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Law Firm" && (
              <LawFirmModal
                lawFirmPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Attorney" && (
              <AttorneyModal
                attorneyPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Case Loan" && (
              <LoanCaseModal
                loanCasePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Courts" && (
              <CourtDirectoryModal
                courtPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Judges" && (
              <JudgeDirectoryModal
                judgePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Provider" && (
              <NewDirectoryProviderModal
                providerPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
              // <AddProviderDirectoryModal
              //   providerPopUp={popups[popupName]}
              //   handleClose={() => togglePopup(popupName)}
              // />
            )}
            {popupName === "Department" && (
              <AddDepartmentModal
                departmentPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Litigation Event" && (
              <LitigationEventModal
                litigationEventPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Time Codes" && (
              <TimeCodeModal
                timeCodePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Statute" && (
              <AddStatutesModal
                statuesPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Process Server" && (
              <AddProcessorServerModal
                addProcessorServers={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Jurisdiction" && (
              <AddJurisdictionModal
                addJurisdictions={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Court District" && (
              <AddCourtDistrictModal
                addCourtDistrict={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Division" && (
              <AddDivisionModal
                addDivisions={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Circuit" && (
              <AddCircuitModal
                addCircuits={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Court Forms" && (
              <AddCourtFormsModal
                courtFormPopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Calculated Dates" && (
              <AddCalculatedDatesModal
                calculatedDatePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Dependant Date Types" && (
              <DependantDateTypeModal
                dateTypePopUp={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Expert Specialties" && (
              <ExpertCategoryModal
                addCategory={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Click Key" && (
              <ClickKeyModal
                addClickKeys={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Statuses" && (
              <StatusesModal
                addStatuses={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Checklists" && (
              <ChecklistsModal
                addChecklists={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Panel Checklists" && (
              <PanelChecklistsModal
                addPanelChecklists={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "WorkUnits" && (
              <WorkunitModal
                addWorkunits={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
            {popupName === "Acts" && (
              <ActModal
                addActs={popups[popupName]}
                handleClose={() => togglePopup(popupName)}
              />
            )}
          </React.Fragment>
        ))}
      </>
    </div>
  );
};

export default SearchTab;
