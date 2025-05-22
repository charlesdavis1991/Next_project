import React, { useState, useEffect } from "react";
import "./directory-47.css";
// import AccountsTable from "./Content/AccountsTable";
import ReportTable from "./Content/ReportTable";
import InsuranceCompanyTable from "./Content/InsuranceCompanyTable";
import InsuranceAdjusterTable from "./Content/InsuranceAdjusterTable";
import ExpertTable from "./Content/ExpertTable";
import LawFirmTable from "./Content/LawFirmTable";
import AttorneyTable from "./Content/AttorneyTable";
import CaseLoanTable from "./Content/CaseLoanTable";
import CourtsTable from "./Content/CourtsTable";
import JudgeTable from "./Content/JudgeTable";
import DepartmentTable from "./Content/DepartmentTable";
import ProviderTable from "./Content/ProviderTable";
import LitigationEventTable from "./Content/LitigationEventTable";
import TimeCodeTable from "./Content/TimeCodeTable";
import StatueTable from "./Content/StatueTable";
import ProcessServerTable from "./Content/ProcessServerTable";
import CoPilotTable from "./Content/CoPilotTable";
import ClickKeyTable from "./Content/ClickKeyTable";

import SearchTab from "./SearchTab";
import ActionBarComponent from "../common/ActionBarComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTab,
  setHasNoData,
  setIsSearchDisabled,
} from "../../Redux/Directory/directorySlice";
import CourtDistrictTable from "./Content/CourtDistrictTable";
import JurisdictionTable from "./Content/JurisdictionTable";
import DivisionTable from "./Content/DivisionTable";
import CircuitTable from "./Content/CircuitTable";
import CourtFormsTable from "./Content/CourtFormsTable";
import CalculatedDatesTable from "./Content/CalculatedDatesTable";
import DependantDateTypeTable from "./Content/DependantDateTypeTable";
import ExpertCategoryTable from "./Content/ExpertCategoryTable";
import StatusesTable from "./Content/StatusesTable";
import ChecklistsTable from "./Content/ChecklistsTable";
import PanelChecklistsTable from "./Content/PanelChecklistsTable";
import WorkunitsTable from "./Content/WorkunitsTable";
import ActsTable from "./Content/ActsTable";

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
// Prevent the click from opening modal
export const handleLinkClick = (e) => {
  e.stopPropagation();
};

export const formatUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

export default function LawFirmDirectoryDashboard() {
  const admin =
    localStorage.getItem("directoryAdmin") === "true" ? true : false;
  console.log("lawfirm main-> admin check", admin);

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const currentTab = useSelector((state) => state.directory.currentTab);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab") || "copilotfirms";
    dispatch(setCurrentTab(savedTab));
  }, [dispatch]);

  const handleTabChange = (tab) => {
    localStorage.setItem("activeTab", tab);
    dispatch(setCurrentTab(tab));
    dispatch(setIsSearchDisabled(false));
    dispatch(setHasNoData(false));
  };

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

  const turncatetext = (text) => {
    let num = 15;
    if (dimensions.width > 2000) {
      num = 13;
    } else if (dimensions.width > 1500 && dimensions.width < 2000) {
      num = 12;
    } else if (dimensions.width > 1000 && dimensions.width < 1500) {
      num = 10;
    } else if (dimensions.width > 768 && dimensions.width < 1000) {
      num = 9;
    } else num = 7;
    if (text.length < num) {
      return text;
    } else return text.slice(0, num) + "...";
  };

  const isTabActive = (tabName) => (currentTab === tabName ? "active" : "");

  return (
    <div className="notes-section-wrapper pt-0">
      <div className="action-bar-wrapper heigh-35 position-relative mr-0  ">
        <ActionBarComponent
          src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/directory-logo-icon.svg"
          page_name={"Law Firm Directory"}
        />
      </div>

      <SearchTab onTabChange={handleTabChange} currentTab={currentTab} />

      <div
        className="tab-content directroy-tables-container"
        id="nav-tabContent"
      >
        <div
          className={`tab-pane fade ${isTabActive("copilotfirms") ? "show active" : ""}`}
          id="custom-nav-copilotfirms"
          role="tabpanel"
          aria-labelledby="custom-nav-copilotfirms-tab"
        >
          {currentTab == "copilotfirms" && <CoPilotTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("reporting-agency") ? "show active" : ""}`}
          id="reporting_agency-nav-home"
          role="tabpanel"
          aria-labelledby="reporting_agency-nav-tab"
        >
          {currentTab == "reporting-agency" && <ReportTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("insurance-company") ? "show active" : ""}`}
          id="insurance_company-nav-home"
          role="tabpanel"
          aria-labelledby="insurance_company-nav-tab"
        >
          {currentTab == "insurance-company" && (
            <InsuranceCompanyTable admin={admin} />
          )}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("insurance-adjuster") ? "show active" : ""}`}
          id="insurance_adjuster-nav-home"
          role="tabpanel"
          aria-labelledby="insurance_adjuster-nav-tab"
        >
          {currentTab == "insurance-adjuster" && (
            <InsuranceAdjusterTable admin={admin} />
          )}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("experts") ? "show active" : ""}`}
          id="expert-nav-home"
          role="tabpanel"
          aria-labelledby="expert-nav-tab"
        >
          {currentTab == "experts" && <ExpertTable admin={admin} />}
        </div>

        <div
          className={`tab-pane fade ${isTabActive("law-firm") ? "show active" : ""}`}
          id="lawfirm-nav-home"
          role="tabpanel"
          aria-labelledby="lawfirm-nav-tab"
        >
          {currentTab == "law-firm" && <LawFirmTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("attorney") ? "show active" : ""}`}
          id="attorney-nav-home"
          role="tabpanel"
          aria-labelledby="attorney-nav-tab"
        >
          {currentTab == "attorney" && <AttorneyTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("case-loan") ? "show active" : ""}`}
          id="caseloan-nav-home"
          role="tabpanel"
          aria-labelledby="caseloan-nav-tab"
        >
          {currentTab == "case-loan" && <CaseLoanTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("courts") ? "show active" : ""}`}
          id="courts-nav-home"
          role="tabpanel"
          aria-labelledby="courts-nav-tab"
        >
          {currentTab == "courts" && <CourtsTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("judge") ? "show active" : ""}`}
          id="judge-nav-home"
          role="tabpanel"
          aria-labelledby="judge-nav-tab"
        >
          {currentTab == "judge" && <JudgeTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("provider") ? "show active" : ""}`}
          role="tabpanel"
          aria-labelledby="provider-nav-tab"
        >
          {currentTab == "provider" && <ProviderTable admin={admin} />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("department") ? "show active" : ""}`}
          id="department-nav-home"
          role="tabpanel"
          aria-labelledby="department-nav-tab"
        >
          {currentTab == "department" && <DepartmentTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("litigation-event") ? "show active" : ""}`}
          id="litigationact-nav-home"
          role="tabpanel"
          aria-labelledby="litigationact-nav-tab"
        >
          {currentTab == "litigation-event" && <LitigationEventTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("time-codes") ? "show active" : ""}`}
          id="timecodes-nav-home"
          role="tabpanel"
          aria-labelledby="timecodes-nav-tab"
        >
          {currentTab == "time-codes" && <TimeCodeTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("statute") ? "show active" : ""}`}
          id="statute-nav-home"
          role="tabpanel"
          aria-labelledby="statute-nav-tab"
        >
          {currentTab == "statute" && <StatueTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("process-server") ? "show active" : ""}`}
          id="process_server-nav-home"
          role="tabpanel"
          aria-labelledby="process_server-nav-tab"
        >
          {currentTab == "process-server" && <ProcessServerTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("court-district") ? "show active" : ""}`}
          id="court_district-nav-home"
          role="tabpanel"
          aria-labelledby="court_district-nav-tab"
        >
          {currentTab == "court-district" && <CourtDistrictTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("jurisdiction") ? "show active" : ""}`}
          id="jurisdiction-nav-home"
          role="tabpanel"
          aria-labelledby="jurisdiction-nav-tab"
        >
          {currentTab == "jurisdiction" && <JurisdictionTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("division") ? "show active" : ""}`}
          id="division-nav-home"
          role="tabpanel"
          aria-labelledby="division-nav-tab"
        >
          {currentTab == "division" && <DivisionTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("circuit") ? "show active" : ""}`}
          id="circuit-nav-home"
          role="tabpanel"
          aria-labelledby="circuit-nav-tab"
        >
          {currentTab == "circuit" && <CircuitTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("courtForms") ? "show active" : ""}`}
          id="courtForms-nav-home"
          role="tabpanel"
          aria-labelledby="courtForms-nav-tab"
        >
          {currentTab == "courtForms" && <CourtFormsTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("calculatedDates") ? "show active" : ""}`}
          id="calculatedDates-nav-home"
          role="tabpanel"
          aria-labelledby="calculatedDates-nav-tab"
        >
          {currentTab == "calculatedDates" && <CalculatedDatesTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("dependantDateTypes") ? "show active" : ""}`}
          id="dependantDateTypes-nav-home"
          role="tabpanel"
          aria-labelledby="dependantDateTypes-nav-tab"
        >
          {currentTab == "dependantDateTypes" && <DependantDateTypeTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("expertSpecialties") ? "show active" : ""}`}
          id="custom-nav-expertSpecialties"
          role="tabpanel"
          aria-labelledby="custom-nav-expertSpecialties-tab"
        >
          {currentTab == "expertSpecialties" && <ExpertCategoryTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("clickKeys") ? "show active" : ""}`}
          id="custom-nav-clickKeys"
          role="tabpanel"
          aria-labelledby="custom-nav-clickKeys-tab"
        >
          {currentTab == "clickKeys" && <ClickKeyTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("statuses") ? "show active" : ""}`}
          id="custom-nav-statuses"
          role="tabpanel"
          aria-labelledby="custom-nav-statuses-tab"
        >
          {currentTab == "statuses" && <StatusesTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("checklists") ? "show active" : ""}`}
          id="custom-nav-checklists"
          role="tabpanel"
          aria-labelledby="custom-nav-checklists-tab"
        >
          {currentTab == "checklists" && <ChecklistsTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("panelChecklists") ? "show active" : ""}`}
          id="custom-nav-panelChecklists"
          role="tabpanel"
          aria-labelledby="custom-nav-panelChecklists-tab"
        >
          {currentTab == "panelChecklists" && <PanelChecklistsTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("workunits") ? "show active" : ""}`}
          id="custom-nav-workunits"
          role="tabpanel"
          aria-labelledby="custom-nav-workunits-tab"
        >
          {currentTab == "workunits" && <WorkunitsTable />}
        </div>
        <div
          className={`tab-pane fade ${isTabActive("acts") ? "show active" : ""}`}
          id="custom-nav-acts"
          role="tabpanel"
          aria-labelledby="custom-nav-acts-tab"
        >
          {currentTab == "acts" && <ActsTable />}
        </div>
      </div>
      <footer className="footer-directry">
        <div className="fotter-content-directory"></div>
      </footer>
    </div>
  );
}
