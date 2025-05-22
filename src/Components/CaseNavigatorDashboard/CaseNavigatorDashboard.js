import React, { useEffect, useState, useRef, useCallback } from "react";
import StageTabsContent from "./StageTabsContent";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../../Utils/helper";
import { Height } from "@mui/icons-material";
import { useDebounce } from "use-debounce";
import ActionBarComponent from "../common/ActionBarComponent";

export default function CaseNavigatorDashboard() {
  const dispatch = useDispatch();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const clientId = getClientId();
  const caseId = getCaseId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [allFirmCaseTypes, setAllFirmCaseTypes] = useState([]);
  const [AllCaseStages, setAllCaseStages] = useState([]);
  const [AllCaseStatuses, setAllCaseStatuses] = useState([]);
  const [activeStage, setActiveStage] = useState("all_stage");

  // Filling Empty Space in CaseType Sidebar
  const [emptyItems, setEmptyItems] = useState([]);
  const containerRef = useRef(null);
  const allStagesRef = useRef(null);
  const allStatusesRef = useRef(null);
  const listItemHeight = 25; // Set the height of each list item

  // Calculate empty items using useCallback to memoize the function
  const calculateEmptyItems = useCallback(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const additionalRowsHeight = 3 * listItemHeight;
      const filledHeight =
        allFirmCaseTypes.length * listItemHeight + additionalRowsHeight;

      const viewportHeight = window.innerHeight;
      const containerTopOffset =
        containerRef.current.getBoundingClientRect().top;
      const maxHeightAvailable = viewportHeight - containerTopOffset;

      const effectiveRemainingHeight = Math.min(
        containerHeight - filledHeight,
        maxHeightAvailable - filledHeight
      );

      const numEmptyItems = Math.floor(
        effectiveRemainingHeight / listItemHeight
      );

      // Only update state if the number of empty items has changed
      setEmptyItems(
        Array.from({ length: numEmptyItems > 0 ? numEmptyItems : 0 })
      );
    }
  }, [allFirmCaseTypes]);

  const [debouncedCalculateEmptyItems] = useDebounce(calculateEmptyItems, 10);
  useEffect(() => {
    // Perform calculation on initial load and when allFirmCaseTypes changes
    debouncedCalculateEmptyItems();

    const handleResize = () => {
      debouncedCalculateEmptyItems();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [allFirmCaseTypes, debouncedCalculateEmptyItems]);

  // API call for Case Types
  const fetchCaseTypes = async () => {
    const casetype_data = await axios.get(
      origin + "/api/navigator/navigator_case_types/",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setAllFirmCaseTypes(casetype_data.data.all_firm_cases);
  };

  // API call for Stages and Statuses
  const fetchCaseStages_Statuses = async () => {
    const response = await axios.get(
      origin + "/api/navigator/navigator_stages_statuses/",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setAllCaseStages(response.data.all_stages);
    setAllCaseStatuses(response.data.all_statuses);
  };

  useEffect(() => {
    fetchCaseTypes();
    fetchCaseStages_Statuses();
    fetchShakespeareStatus(caseId, clientId, "CaseNavigator", dispatch);
  }, []);

  const HandleStageClick = (stage) => {
    setActiveStage(stage);
  };
  const [activeStatus, setActiveStatus] = useState("all_status");
  const HandleStatusClick = (status) => {
    setActiveStatus(status);
  };

  useEffect(() => {
    if (
      containerRef.current &&
      allStagesRef.current &&
      allStatusesRef.current
    ) {
      const { width: firstItemWidth } =
        containerRef.current.getBoundingClientRect();
      console.log("firstItemWidth", firstItemWidth);
      allStagesRef.current.style.width = `${firstItemWidth}px`;
      allStatusesRef.current.style.width = `${firstItemWidth}px`;
      allStagesRef.current.style.minWidth = `${firstItemWidth}px`;
      allStatusesRef.current.style.minWidth = `${firstItemWidth}px`;
      allStagesRef.current.style.maxWidth = `${firstItemWidth}px`;
      allStatusesRef.current.style.maxWidth = `${firstItemWidth}px`;
    }
  }, [allFirmCaseTypes]);
  const header_name = useSelector((state) => state.header_name?.header_name);

  return (
    <div>
      {/* <div className="action-bar client-BarAlign d-flex m-b-5">
        <span className="page-icon">
          <img
            className="translate-note-icon"
            src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/case-navigator-logo.svg"
            alt=""
          />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5">
          <h2 className="text-white">Case Navigator</h2>
        </div>
      </div> */}
      <ActionBarComponent
        src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/case-navigator-logo.svg"
        page_name={"Case Navigator"}
      />
      <div className="container-fluid has-full-height caseNav-ML5P p-l-5 p-r-5">
        <p className="text-indent-20px text-center m-t-5 m-b-5 bg-primary-4">
          Welcome to the Case Navigator. You may sort cases by Stage, Status,
          and the additional parameters of Case Age, State Venue, and Provider
          Type. You may select all Case Stages, all Case Statuses, and multiple
          selections of each.
        </p>
        <nav className="navbar_sam">
          <div className="nav nav-tabs StagesRow" id="nav-tab" role="tablist">
            <button
              className={`nav-link ${activeStage === "all_stage" ? "active" : ""} m-r-5 no-left-skew no-right-skew justify-content-start`}
              ref={allStagesRef}
              id="nav-allstage-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-allstage"
              type="button"
              role="tab"
              aria-controls="nav-allstage"
              aria-selected={activeStage === "all_stage"}
              onClick={() => HandleStageClick("all_stage")}
            >
              All Stages
            </button>
            {AllCaseStages.map((stage, index) => (
              <button
                key={`stage-${index}`}
                className={`nav-link ${activeStage === stage.name ? "active" : ""} mx-0 no-left-skew no-right-skew `}
                id={`nav-${stage.name}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#nav-${stage.name}`}
                type="button"
                role="tab"
                aria-controls={`nav-${stage.name}`}
                aria-selected={activeStage === stage.name}
                onClick={() => HandleStageClick(stage.name)}
              >
                {stage.name}
              </button>
            ))}
          </div>
        </nav>
        <div className="case-navigator-filters">
          <div className="nav nav-tabs nav-tabs-filter" role="tablist">
            <button
              className={`nav-link ${activeStatus === "all_status" ? "active" : ""} no-left-skew no-right-skew justify-content-start m-r-5`}
              ref={allStatusesRef}
              id="nav-allstatus-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-allstatus"
              type="button"
              role="tab"
              aria-controls="nav-allstatus"
              aria-selected={activeStatus === "all_status"}
              onClick={() => HandleStatusClick("all_status")}
              style={{ marginRight: "4.5px" }}
            >
              All Statuses
            </button>
            {AllCaseStatuses.map((status, index) => (
              <button
                key={`stage-${index}`}
                className={`nav-link ${activeStatus === status.name ? "active" : ""} no-left-skew no-right-skew`}
                id={`nav-${status.name}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#nav-${status.name}`}
                type="button"
                role="tab"
                aria-controls={`nav-${status.name}`}
                aria-selected={activeStatus === status.name}
                onClick={() => HandleStatusClick(status.name)}
              >
                {status.name}
              </button>
            ))}
            {/* <button className="nav-link no-left-skew no-right-skew active" id="nav-allstage_allstatus-tab" data-toggle="tab" role="tab" aria-selected="true">
                    All Statuses
                </button>
                {allStatuses.map((status, index) => (
                  <button key={"status-"+index} className="nav-link no-left-skew no-right-skew" id={`nav-${status.name}-tab`} data-toggle="tab" role="tab" aria-selected="true">
                    <input type="checkbox" className="mr-1" />
                    {status.name}
                  </button>
                ))} */}
          </div>
        </div>
        <div className="row sam_row overflow-hidden">
          <div className="col-auto p-r-0" id="casetypes_block">
            <div className="h-100" ref={containerRef}>
              <h4 className="bg-primary text-lg text-white p-l-5 p-r-5 h-25px">
                Sort By:
              </h4>
              <h4 className="bg-primary text-lg text-white p-l-5 p-r-5 h-25px">
                Case Types
              </h4>
              <p className="all_case_type_heading text-primary bg-primary-20 p-l-5 p-r-5 h-25px d-flex align-items-center">
                All Case Types
              </p>
              <ul className="item-list list-unstyled text-primary">
                {allFirmCaseTypes.map((caseType, index) => (
                  <li
                    key={index}
                    className="d-flex align-items-center justify-content-start p-l-5 p-r-5 h-25px"
                  >
                    <span class="ic-avatar ic-19 m-b-5 m-r-5">
                      <img src={media_origin + caseType.casetype_icon} />
                    </span>
                    {caseType.name}
                  </li>
                ))}
                {emptyItems.map((_, index) => (
                  <li
                    key={`empty-${index}`}
                    className="d-flex align-items-center empty-li h-25px"
                  ></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="d-flex flex-column w-100 position-relative">
            <div className="tab-content StagesRowTabs" id="nav-tabContent">
              <StageTabsContent
                activeStage={activeStage}
                activeStatus={activeStatus}
              />
            </div>
          </div>
        </div>
        <footer
          className="footer-directry"
          style={{ position: "fixed", bottom: "0", width: "100%", zIndex: 10 }}
        >
          <div className="fotter-content-directory"></div>
        </footer>
      </div>
      {/* <div className="col-12 px-0">
        <div className="notes-section-wrapper pt-0">
          <div className="action-bar-wrapper heigh-35 position-relative mr-0 ">
            <div
              className="action-bar client-BarAlign d-flex m-b-5 m-t-5"
              style={{ left: 148 }}
            >
              <span className="page-icon">
                <img
                  className="translate-note-icon"
                  src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/notes-icon-color.svg"
                />
              </span>
              <div className="text-wrapper text-white d-flex align-items-center pr-0">
                <h2 className="text-white text-nowrap">CASE NAVIGATOR</h2>
              </div>
              <div className="btn-wrapper">
                <button
                  className="btn btn-primary rounded-0"
                  type="button"
                  onClick={() => setShowImportPopup(!showImportPopup)}
                  style={{ marginRight: "69px" }}
                >
                  <span className="font-weight-bold pr-2 text-gold">+</span>
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
