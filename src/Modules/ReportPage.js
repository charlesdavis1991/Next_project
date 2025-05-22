import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import ActionBar from "../Components/ReportPage/ActionBar";
import ReportAgency from "../Components/ReportPage/ReportAgency";
import ReportInfo from "../Components/ReportPage/ReportInfo";
import ReportTakenBy from "../Components/ReportPage/ReportTakenBy";
import TitleBar from "../Components/ReportPage/TitleBar";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import api from "../api/api";
import "../../public/BP_resources/css/reports-page-15.css";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import EditReportModal from "../Components/ReportPage/ReportModals/EditReportModal";
import {
  fetchShakespeareStatus,
  getCaseId,
  getClientId,
} from "../Utils/helper";
import { Button, Modal } from "react-bootstrap";
import DummyReportPanel from "../Components/ReportPage/DummyReportPanel";
import ConfirmDeletePopup from "../Components/ReportPage/ReportModals/ConfirmDeletePopup";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import PanelActionBarComponent from "../Components/common/PanelActionBarComponent";
import ContactPanel from "../Components/common/ContactPanel";
import InformationPanel from "../Components/common/InformationPanel";
import CostIcon from "../assets/images/costs-icon-color.svg";
import GenrateDocument from "../Components/GenrateDocument/GenrateDocument";
import Footer from "../Components/common/footer";

//R20242851207
const ReportPage = () => {
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [reports, setReports] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [isDummy, setIsDummy] = useState(false);
  const [dummyReport, setDummyReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // for report update
  const selectedEditableTabPanel = useRef("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forDeleteReportId, setForDeleteReportId] = useState(null);
  const [fecthReports, setFetchReports] = useState(false);
  const [isReoportTaken, setIsReportTaken] = useState(false);
  const [showReportTakenField, setShowReportTakeField] = useState(true);
  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);

  // For scolling to a specific report page
  const reportRefs = useRef({});
  const containerRef = useRef(null);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);

  const fetchReports = async () => {
    try {
      setFetchReports(false);
      setShowReportTakeField(true);
      const response = await api.get(
        `${origin}/api/reports/${clientId}/${currentCaseId}/`
      );
      if (response.status === 200) {
        setReports(response.data);

        // Checking if any report has `report_taken` set to true
        const reportTaken = response.data.some((report) => report.report_taken);
        setIsReportTaken(reportTaken);

        if (response.data.length >= 1) {
          setShowReportTakeField(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //U2024/7/4/1:15AM
  //THIS FUNCTION HITS PANEL PAGE BLOCK API WHICH GIVE INFO ABOUT TO SHOW DUMMY PANEL OR NOT
  async function fetchIsDummyStatus() {
    try {
      const response = await api.get(
        `${origin}/api/general/panel_page_block/?case_id=${currentCaseId}&entity=Reports`
      );
      setIsDummy(response?.data?.status);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchIsDummyStatus();
    fetchShakespeareStatus(currentCaseId, clientId, "Report", dispatch);
    fetchReports();
  }, [fecthReports, refresh]);

  const handleFacthReports = () => {
    setFetchReports(true);
  };

  const handleCloseFucton = () => {
    setSelectedReport(null);
  };

  const showDeleteConfirmPopup = () => {
    setShowDeleteConfirm(true);
    setSelectedReport(null);
  };
  const hideDeleteConfirmPopup = () => {
    setShowDeleteConfirm(false);
  };

  //Delete Post is handeled here
  const handleDeleteSubmission = async () => {
    try {
      setFetchReports(false);
      const response = await api.delete(
        `${origin}/api/report/${forDeleteReportId}/`
      );
      if (response.status === 204) {
        hideDeleteConfirmPopup();
        handleFacthReports();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const header_name = useSelector((state) => state.header_name?.header_name);
  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };
  const handleGenrateDocument = (instanceId) => {
    console.log("FUNCTION IS CALLED");
    console.log("HGD instance id == :: ", instanceId);
    setInstanceIdForGenragteDoc(instanceId);
    setShowDocument(true);
  };
  const reportComponent = (report) => {
    const reportData = [
      {
        label: "No Report Taken:",
        value: report?.report_taken ? formatDate(report?.date_taken) : "No",
      },
      {
        label: "Report No:",
        value: report?.report_number ? (
          report?.report_number
        ) : (
          <span className="text-primary-50">####</span>
        ),
      },
      { label: "Complete:", value: formatDate(report?.completed) },
      { label: "Cost:", value: report?.cost },
      { label: "Requested:", value: formatDate(report?.date_ordered) },
    ];

    const personalData = [
      { label: "Title:", value: report?.contact_title },
      { label: "First:", value: report?.contact_first_name },
      { label: "Last:", value: report?.contact_last_name },
    ];

    console.log(personalData, "report", report);
    const buttonData = [
      // {
      //   id: "email-button",
      //   iconClassName: "ic ic-19 ic-email-3d",
      //   buttonText: report?.email,
      //   className: "overflow-hidden info_email m-b-5 p-l-6 p-r-6",
      //   style: { height: "25px" },
      //   onClick: () => console.log("Email clicked"),
      // },
      {
        id: "generate-document-button",
        iconClassName: "ic ic-19 ic-generate-document",
        buttonText: "Generate Document",
        className: "p-l-6 p-r-5",
        style: { height: "25px" },
        onClick: (id) => handleGenrateDocument(id),
      },
    ];


    return (
      <div
        className="report"
        key={report?.id}
        ref={(el) => (reportRefs.current[report?.id] = el)}
      >
        {/* <TitleBar {...report} /> */}
        <PanelActionBarComponent
          id={report?.id}
          page_name={"Incident Report"}
          title={report?.contact_title}
          first_name={report?.contact_first_name}
          last_name={report?.contact_last_name}
          report_type_name={report?.report_type_name}
          report_agency_name={report?.reporting_agency_name}
        />
        <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
          <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
            <InformationPanel
              id={report?.id}
              panel_name="Report Information"
              // report_taken={report?.report_taken}
              // date_taken={report?.date_taken}
              // report_number={report?.report_number}
              // complete={report?.completed}
              // cost={report?.cost}
              // date_ordered={report?.date_ordered}
              data={reportData}
              onSelectReport={() => (
                setSelectedReport(report),
                (selectedEditableTabPanel.current = "report-information"),
                setForDeleteReportId(report?.id)
              )}
              imgSrc={CostIcon}
              buttonText="Report Cost Request"
              className="btn-white-hover"
              imgClassName="report_cost_request_img"
              onClick={() => console.log("Clicked")}
            />

            <ContactPanel
              id={report?.id}
              panel_name="Reporting Agency"
              title={report?.name}
              name={report?.reporting_agency_name}
              address1={report?.address}
              address2={report?.address1}
              city={report?.city}
              state={report?.state}
              zip_code={report?.zip_code}
              phone_number={report?.phone}
              fax_number={report?.fax}
              email={report?.email}
              onSelectObject={() => (
                setSelectedReport(report),
                (selectedEditableTabPanel.current = "reporting-agency"),
                setForDeleteReportId(report?.id)
              )}
              buttonData={buttonData}
            />

            <InformationPanel
              id={report?.id}
              panel_name="No Report Taken By"
              data={personalData}
              onSelectReport={() => (
                setSelectedReport(report),
                (selectedEditableTabPanel.current = "report-taken-by"),
                setForDeleteReportId(report?.id)
              )}
              iconClassName="ic ic-19 ic-generate-document" // Font icon
              buttonText="Generate Document"
              className=""
              onClick={(id) => handleGenrateDocument(id)}
            />
          </div>

          <NotesPanel
            entity_type={"Reports"}
            record_id={report?.id}
            module={"Reports"}
            pagePanels={3}
          />
        </div>
        <div className="row documents-wrapper m-t-5">
          <div className="col-12">
            <div className="height-25">
              <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                {report?.reporting_agency} {report?.report_type_name}
                &nbsp;Document Row
              </h4>
            </div>
            <DocumentRow clientProvider={report} page="Reports" />
          </div>
        </div>
      </div>
    );
  };
  function setRefreshMethod() {
    // setFetchReports(false);
    setRefresh(refresh + 1);
    handleFacthReports();
  }

  // For Scrolling to specfic defendant record from redirected from search page
  useEffect(() => {
    // Scroll to that specific record
    if (searchRecordId && reportRefs.current[searchRecordId]) {
      const searchRecordElement = reportRefs.current[searchRecordId];
      const containerElement = containerRef.current;

      // Calculate the top offset of the product relative to the container
      const searchRecordOffsetTop = searchRecordElement.offsetTop;
      const containerScrollTop = containerElement.scrollTop;
      const smallScrollAdjustment = 10;

      // Scroll the container to the product with a small adjustment
      containerElement.scrollTo({
        top: searchRecordOffsetTop - containerScrollTop - smallScrollAdjustment,
        behavior: "smooth",
      });

      dispatch(setSearchRecordId(""));
    }
  }, [reports]);
  const open = useSelector((state) => state?.open?.open);
  return (
    <>
    <div className="page-wrapper">
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar
          flaggedPageName="Reports"
          client={client}
          currentCase={currentCase}
        />
        <ActionBar
          onFetchReports={handleFacthReports}
          isDummy={isDummy}
          onUpdateState={refresh}
          onUpdate={setRefreshMethod}
          setDummyReport={setDummyReport}
          isReoportTaken={isReoportTaken}
          showReportTakenField={showReportTakenField}
          reports={reports}
        />
        <div
          className="reports-main-container"
          ref={containerRef}
          style={{
            overflowY: "auto",
            maxHeight: "100vh",
            zIndex: open ? "0" : "",
          }}
        >
          {isDummy
            ? reportComponent(
                dummyReport ? dummyReport : reports[reports.length - 1]
              )
            : reports && reports.map((report) => reportComponent(report))}
          <NotesSectionDashboard />
        </div>

        {/* edit report all data component */}
        {selectedReport && (
          <EditReportModal
            show={true}
            handleClose={handleCloseFucton}
            report={selectedReport}
            onFetchReports={handleFacthReports}
            onShowDeleteConfirmPopup={showDeleteConfirmPopup}
            activeTab={selectedEditableTabPanel.current}
            onUpdate={setRefreshMethod}
            setDummyReport={setDummyReport}
            isMultipleReports={reports.length > 1}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmDeletePopup
            handleDeleteSubmission={handleDeleteSubmission}
            handleClose={hideDeleteConfirmPopup}
            entity=" INCIDENT REPORT"
          />
        )}

        {showDocument && (
          <GenrateDocument
            show={true}
            handleClose={() => setShowDocument(false)}
            PageEntity="Reports"
            instanceId={instanceIdForGenrateDoc}
          />
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ReportPage;
