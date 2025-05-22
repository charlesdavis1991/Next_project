import React, { useEffect, useState, useContext,useCallback } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import ActionBarLitigation from "../Components/LitigationDashboard/ActionBarLitigation";
import "../../public/BP_resources/css/litigation.css";
import LitigationCase from "../Components/LitigationDashboard/litigationCase";
import LitigationDefendant from "../Components/LitigationDashboard/litigationDefendantTable";
import { useDispatch, useSelector } from "react-redux";
import LitigationCourtInfo from "../Components/LitigationDashboard/LitigationCourtDetail";
import LitigationJudgeInfo from "../Components/LitigationDashboard/LitigationJudgeDetail";
import LitigationClerkInfo from "../Components/LitigationDashboard/LitigationClerkDetail";
import LitigationTimeline from "../Components/LitigationDashboard/LitigationTimeline";
import LitigationTab from "../Components/LitigationDashboard/LitigationsTabs";
import LitigationNotes from "../Components/LitigationDashboard/LitigationNotes";
import { getClientId, getCaseId } from "../Utils/helper";
import axios from "axios";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import useIsStates from "../Hooks/getStates";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import LitigationTimeLines from "../Components/LitigationDashboard/LitigationTimelines";
import Footer from "../Components/common/footer";
import { fetchStates } from "../Redux/states/statesSlice";
import LitigationActionTabs from "../Components/LitigationDashboard/LitigationActionTabs";
import CourtHistoryTable from "../Components/LitigationDashboard/CourtHistoryTable";
import AddLitigationActPopup from "../Components/LitigationDashboard/Modals/AddLitigationActPopup";

const LitigationPage = ({}) => {
  const [showActPopup, setShowActPopup] = useState(false);
  const handleClosePopup = useCallback(() => {
    if (showActPopup === true) {
      handleTabChange("case");
      setShowActPopup(false);
    }
  }, [showActPopup]);
  
  const [litigationTab,setLitigationTab] = useState("case")
  const handleTabChange = (tab) =>{
      setLitigationTab(tab)
  }
  const tabsData = [
    {   id: "case", 
        label: "Case",
        onClick: () => handleTabChange("case"),
        className: litigationTab === "case" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationTab === "case" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },
    {   id: "templates", 
        label: "Templates", 
        onClick: () => handleTabChange("templates"),
        className: litigationTab === "templates" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationTab === "templates" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },
    {   id: "discovery_tools", 
        label: "Discovery Tools", 
        onClick: () => handleTabChange("discovery_tools"),
        className: litigationTab === "discovery_tools" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationTab === "discovery_tools" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },
    {   id: "court_history", 
        label: "Court History", 
        onClick: () => handleTabChange("court_history"),
        className: litigationTab === "court_history" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationTab === "court_history" ? "var(--primary) !important" : "var(--primary-70) !important",
        rightHand:true,
        activeColor: 'white',
    },
    {   id: "venue", 
      label: "Venue", 
      onClick: () => handleTabChange("venue"),
      className: litigationTab === "venue" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: litigationTab === "venue" ? "var(--primary) !important" : "var(--primary-70) !important",
      rightHand:true,
      activeColor: 'white',
  },
    {   id: "litigation_act", 
        label: "Litigation Act", 
        span: <span className="font-weight-bold pr-2 text-gold">+ </span>,
        onClick: () => {
          handleTabChange("litigation_act")
          setShowActPopup(true)
        },
        className: litigationTab === "litigation_act" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: litigationTab === "litigation_act" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },

    
];
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  // const dispatch = useDispatch();
  // const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [litigationData, setLitigationData] = useState({});
  const [defendantsData, setDefendantsData] = useState([]);
  const [DefendantProcessedPageSlots, setDefendantProcessedPageSlots] =
    useState([]);
  const { isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated } =
    useContext(ClientDataContext);
  const [CardsData, setCardsData] = useState(false);
  const [firstTimeLitigationtData, setFirstTimeLitigationData] = useState(true);
  const dispatch = useDispatch();
  dispatch(fetchStates());

  const fetchLitigationData = async () => {
    try {
      const litigation_data = await axios.get(
        `${origin}/api/litigation-page/litigations/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (litigation_data.status === 200) {
        if (firstTimeLitigationtData) {
          setLitigationData(litigation_data.data);
          setDefendantsData(litigation_data.data?.defendants);
          setDefendantProcessedPageSlots(
            litigation_data.data?.defendant_processed_page_slots
          );
          setFirstTimeLitigationData(false);
        }
        if (isLitigationDashboardDataUpdate) {
          setLitigationData(litigation_data.data);
          setDefendantsData(litigation_data.data?.defendants);
          setDefendantProcessedPageSlots(
            litigation_data.data?.defendant_processed_page_slots
          );
          setLitigationDashboardDataUpdated(false);
        }
      }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };

  //data for components
  function settingCardsData() {
    const CardsDataSetter = {
      CaseData: {
        litigation_id: litigationData?.litigation?.id,
        case_short_name: litigationData?.litigation?.case_short_name,
        case_full_name: litigationData?.litigation?.case_full_name,
        case_number: litigationData?.litigation?.case_number,
        case_name: litigationData?.litigation?.case_name,
        state: litigationData?.litigation?.state,
        county: litigationData?.litigation?.county,
        jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
        jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
        DirCourt: litigationData?.litigation?.DirCourt,
        DirDepartment: litigationData?.litigation?.DirDepartment,
        court_contact: litigationData?.litigation?.court_contact,
        department_contact: litigationData?.litigation?.clerk_contact,
        court_name: litigationData?.litigation?.court_name,
        court_title1: litigationData?.litigation?.court_title1,
        court_title2: litigationData?.litigation?.court_title2,
        department: litigationData?.litigation?.department,
        clerk_first_name: litigationData?.litigation?.clerk_first_name,
        clerk_last_name: litigationData?.litigation?.clerk_last_name,
        floor: litigationData?.litigation?.floor,
        room: litigationData?.litigation?.room,
        deps: litigationData?.litigation?.deps,
        filing_type: litigationData?.litigation?.filing_type,
      },
      CourtData: {
        litigation_id: litigationData?.litigation?.id,
        courtId: litigationData?.litigation?.DirCourt?.id,
        county: litigationData?.litigation?.county,
        state: litigationData?.litigation?.state,
        jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
        jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
        court_name: litigationData?.litigation?.court_name,
        court_title1: litigationData?.litigation?.court_title1,
        court_title2: litigationData?.litigation?.court_title2,
        court_contact: litigationData?.litigation?.court_contact,
      },
      JudgeData: {
        courtId: litigationData?.litigation?.DirCourt?.id,
        litigation_id: litigationData?.litigation?.id,
        departmentId: litigationData?.litigation?.DirDepartment?.id,
        judgeId: litigationData?.litigation?.DirJudge?.id,
        judge_contact: litigationData?.litigation?.judge_department_contact,
        clerk_contact: litigationData?.litigation?.clerk_contact,
        judge_first_name: litigationData?.litigation?.judge_first_name,
        judge_last_name: litigationData?.litigation?.judge_last_name,
        department: litigationData?.litigation?.department,
        clerk_first_name: litigationData?.litigation?.clerk_first_name,
        clerk_last_name: litigationData?.litigation?.clerk_last_name,
        floor: litigationData?.litigation?.floor,
        room: litigationData?.litigation?.room,
        deps: litigationData?.litigation?.deps,
      },
      BlocksData: {
        litigation_id: litigationData?.litigation?.id || null,
        PlaBlock: litigationData?.litigation?.PlaBlock,
        DefBlock: litigationData?.litigation?.DefBlock,
      },
      // ClerkData: {
      //   litigation_id: litigationData?.litigation?.id,
      //   data: litigationData?.litigation?.DirDepartment,
      // },
    };
    return CardsDataSetter;
  }
  const setTimeLineWidth = () => {
    const timelineRight = document.querySelector("#right-timeline");
    const timelineLeft = document.querySelector(".lit-wrapper-height");
  
    if (timelineRight && timelineLeft) {
      const timelineLeftHeight = timelineLeft.getBoundingClientRect().height;
      timelineRight.style.height = `${timelineLeftHeight}px`;
    }
  };
  
  useEffect(() => {
    if (litigationTab === "case") {
      setTimeLineWidth();
      window.addEventListener("resize", setTimeLineWidth);
      
      // Cleanup to prevent memory leaks
      return () => {
        window.removeEventListener("resize", setTimeLineWidth);
      };
    }
  }, [litigationTab, CardsData]);

  useEffect(() => {
    fetchLitigationData();
    setCardsData(settingCardsData());
    if (isLitigationDashboardDataUpdate) {
      setLitigationDashboardDataUpdated(false);
    }
  }, [
    clientId,
    currentCaseId,
    isLitigationDashboardDataUpdate,
    litigationData,
  ]);

  const sampleTimelineEvents = [
    {
      date: "2024-09-15",
      events: [
        {
          type: "Litigation",
          event: {
            is_allday: true,
            event_id: { event_name: "Court Hearing" },
          },
        },
        {
          type: "DefendantDates",
          event: {
            is_allday: true,
            event_id: { event_name: "Served Notice" },
          },
        },
      ],
    },
    {
      date: "2024-09-18",
      events: [
        {
          type: "Litigation",
          event: {
            is_allday: false,
            event_id: { event_name: "Motion Filed" },
          },
        },
      ],
    },
  ];

  // useEffect(() => {
  //   dispatch(setSearchRecordId(""));
  // }, [searchRecordId]);

  // const open = useSelector((state) => state?.open?.open);

  return (
    <>
      <div className="page-wrapper">
        <Sidebar />
        <div className="page-container">
          <NavBar flaggedPageName="Litigation" />
          <ActionBarLitigation
            LitigationDetail={CardsData?.CaseData}
          />


        
          
          <div
            className=" overflow-auto"
            style={{ marginTop: "169.4px", width: "100%" }}
          >
            <LitigationActionTabs litigationActionTab={litigationTab} handleTabChange={handleTabChange} tabsData={tabsData} />
            <div className="litigation-sec-action-bar">
                <div className="w-100" style={{ height: "25px", marginBottom: "5px" }}>
                  <div className="d-flex justify-content-center aling-items-center height-25">
                    <span className="text-center d-flex justify-content-center align-items-center text-uppercase color-white font-weight-bold height-25 p-t-0 p-b-0">{tabsData.find(tab=>tab.id === litigationTab).label}</span>
                  </div>
                </div>
            </div>
            {/* <div style={{zIndex: open ? "0" : "", position: open ? "relative" : "",}}> */}
            {litigationTab === "case" && 
            <>
              <div className="litigation-main-wrapper-responsive flex-nowrap no-gutters m-b-5 lit-wrapper-height">
                <div className="d-flex-1 p-r-5" style={{display:"grid"}}>
                    <div className="row no-gutters equal-column-wrapper position-relative lit-page-section">
                      <div className="lit-upper-1 lit-upper-section-child">
                        <LitigationCase
                          caseInfo={CardsData.CaseData}
                          litigation_obj={litigationData?.litigation}
                        />
                      </div>
                      <LitigationDefendant
                        defendants={defendantsData}
                        defendantProcessedPageSlots={
                          DefendantProcessedPageSlots
                        }
                        BlocksData={CardsData.BlocksData}
                        fetchLitigationData={fetchLitigationData}
                        setIsClientDataUpdated={
                          setLitigationDashboardDataUpdated
                        }
                      />
                        <LitigationCourtInfo
                          Court={CardsData.CourtData}
                          litigation_obj={litigationData?.litigation}
                        />
                       
                        <LitigationJudgeInfo
                          Judge={CardsData.JudgeData}
                        />
                        {/* <LitigationClerkInfo
                                Clerk={CardsData.ClerkData}
                                // states={states}
                                litigation_obj={litigationData?.litigation}
                              /> */}
                    </div>
                </div>

                <div
                  class="litigation-right content-right bg-white"
                  id="right-timeline"
                >
                  <div class="right-calendar border-0 p-0 h-100">
                    <LitigationTimeLines
                      // timeline_events={litigationData?.timeline_events}
                      sol_events={litigationData?.sol_events}
                    />
                  </div>
                </div>
              </div>
              {/* <div class="row">
                  <div class="litigation-tabs mr-15 w-100">
                    <LitigationTab />
                  </div>
                </div>
                <NotesSectionDashboard /> 
             </div>  */}
            <LitigationTab litigation_obj={litigationData?.litigation}/>
            </>
            }
            {litigationTab === "templates" && <div className="height-200" />}
            {litigationTab === "discovery_tools" && <div className="height-200" />}
            {litigationTab === "venue" && <div className="height-200" />}
            {litigationTab === "court_history" && <CourtHistoryTable />}
            <NotesSectionDashboard />
          </div>
        </div>
      </div>
      <Footer />
      {showActPopup && (
        <AddLitigationActPopup
          showPopup={showActPopup}
          handleClose={handleClosePopup}
          litigationDetail={CardsData?.CaseData}
        />
      )}
    </>
  );
};

export default React.memo(LitigationPage);
