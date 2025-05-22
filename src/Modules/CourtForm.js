import React, {
    useState,
    useMemo,
    useEffect,
    useContext
} from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useFooter } from "../Components/common/shared/FooterContext"; // Assuming FooterContext is common, kept for usage.
import { Spinner, Table } from "react-bootstrap";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import ActionBarComponent from "../Components/common/ActionBarComponent";


// Litigation Dashboard specific components
import ActionBarLitigation from "../Components/LitigationDashboard/ActionBarLitigation";
import LitigationCase from "../Components/LitigationDashboard/litigationCase";
import LitigationDefendant from "../Components/LitigationDashboard/litigationDefendantTable";
import LitigationCourtInfo from "../Components/LitigationDashboard/LitigationCourtDetail";
import LitigationJudgeInfo from "../Components/LitigationDashboard/LitigationJudgeDetail";
import LitigationClerkInfo from "../Components/LitigationDashboard/LitigationClerkDetail";
import LitigationTimeline from "../Components/LitigationDashboard/LitigationTimeline";
import LitigationTab from "../Components/LitigationDashboard/LitigationsTabs";
import LitigationNotes from "../Components/LitigationDashboard/LitigationNotes";
import LitigationTimeLines from "../Components/LitigationDashboard/LitigationTimelines";

// Notes section specific component
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";

// Redux & State Management
import { useDispatch, useSelector } from "react-redux";
import { setSearchRecordId } from "../Redux/search/searchSlice";

// Utilities
import { getCaseId, getClientId,mediaRoute} from "../Utils/helper";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";

// CSS
import '../Components/WordProcessor/wordprocessor.css';
import "../../public/BP_resources/css/litigation.css";

// Axios API calls
import api, { api_without_cancellation } from "../api/api";
import useIsStates from "../Hooks/getStates";
import Footer from "../Components/common/footer";
import ConfirmCancelPopUp from "../Components/Modals/ConfirmCancelPopUp";


import FilingsContent from "../Components/LitigationDashboard/LitigationTabInfo/FilingsContent";
import DiscoveryContent from "../Components/LitigationDashboard/LitigationTabInfo/DiscoveryContent";
import MotionContent from "../Components/LitigationDashboard/LitigationTabInfo/MotionContent";
import HearingContent from "../Components/LitigationDashboard/LitigationTabInfo/HearingContent";
import DespositionContent from "../Components/LitigationDashboard/LitigationTabInfo/DespositionContent";
import ExamContent from "../Components/LitigationDashboard/LitigationTabInfo/ExamContent";
import TrailContent from "../Components/LitigationDashboard/LitigationTabInfo/TrailContent";
import DeadlineContent from "../Components/LitigationDashboard/LitigationTabInfo/DeadlineContent";
import EventsContent from "../Components/LitigationDashboard/LitigationTabInfo/EventsContent";
import CourtFormTable from "../Components/CourtForm/CourtFormTable";

import NotEnablePopUp from "../Components/Modals/NotEnablePopUp";



import { useDocumentModal } from "../Components/common/CustomModal/CustomModalContext";



function CourtForm() {
    const origin = process.env.REACT_APP_BACKEND_URL


    const { footerState, setFooterState } = useFooter();

    const [formDataContext, setFormDataContext] = useState({});

    const node_env = process.env.NODE_ENV;
    const media_origin =
        node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
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
    const states = useIsStates();
    const searchRecordId = useSelector((state) => state.searchS.searchRecordId);


    const [searchParams] = useSearchParams();
  const docId = searchParams.get("docId");
  const updatedDocId = searchParams.get("updatedDocId");

  const courtFormId = searchParams.get("court_form_id");

  const redirectUrl = decodeURIComponent(searchParams.get("redirect_url"));
  const litigationId = searchParams.get("litigation_id");

  const [courtFormData, setCourtFormData] = useState(false);


  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);


  const [eventType, setEventType] = useState(false);
  const [litigationActObj, setLitigationActObj] = useState({});
  const [litigationObj, setLitigationObj] = useState({});


  const [validationPopUp, setValidationPopUp] = useState(false);
  const [validationText, setValidationText] = useState("");
  const { showDocumentModal } = useDocumentModal();

  const [courtFormPdf, setCourtFormPdf] = useState(null);
  const [courtFormPdfImages, setCourtFormPdfImages] = useState([]);
  const [showPdf, setShowPdf] = useState(false);

  

    const handleDocPreview = () => {
        // console.log("document for preview = ", doc);
        showDocumentModal("document", mediaRoute(courtFormPdf.upload), courtFormPdf);
        };

      
  const handleValidationPopUp = () => {
    setValidationPopUp(false);
    };

  const isSaveDisabled = useMemo(() => {
    return (
        courtFormPdfImages.length < 1 ||
      !courtFormPdf
    );


  }, [courtFormPdfImages,courtFormPdf]);


  
  const handleClose = () => {
    setShowConfirmPopUp(false)

  }


  const handleConfirm = () => {
    const redirect_url = "/bp-litigation/" + getClientId() + "/" + getCaseId()
    window.location.href = redirect_url;

  }


  const openCancelPopUp = () => {
    setShowConfirmPopUp(true)

  }




  const fecthData = async () => {
    if(litigationId != "0"){
        try {
            const response = await api.get(
              `${origin}/api/litigation-page/litigation-act-by-id/?case_id=${currentCaseId}&client_id=${clientId}&litigation_act_id=${litigationId}`
              
            );
            console.log("tab data",response.data)
            setLitigationObj(response.data.litigation);
            setLitigationActObj(response.data.litigation_act);
            setEventType(response.data.type);
      
            
          } catch (error) {
            console.log(error);
          }

    }
  
  };





    const handleInputChange = (dataVariable, event) => {
        const { type, checked, value } = event.target;
        setFormDataContext(prevState => ({
            ...prevState,
            [dataVariable]: type === "checkbox" ? (checked ? "X" : "") : value
        }));
    };


    const fetchEditDocs = async () => {
        console.log("fetching data ......")
        try {

            const response = await api_without_cancellation.get(
                `${origin}/api/create-edit-doc/`
            );

            if (response.status === 200) {
                var data = response.data
                console.log("fetchEditDocs", data)
                setFooterState(data)



            }


        } catch (error) {
            console.error("Error fetching case types:", error);

        }
    };


    const fetchCourtFormData = async () => {
        console.log("fetching data ......")
        try {

            const response = await api_without_cancellation.get(
                `${origin}/api/documents/get-courtform/?court_form_id=${courtFormId}`
            );

            if (response.status === 200) {
                let data = response.data.data
                let cfpdf = response.data.court_form_pdf
                let cfimgs = response.data.pdf_images
                console.log("fetchCourtFormData", data)
                setCourtFormData(data)
                setCourtFormPdf(cfpdf)
                setCourtFormPdfImages(cfimgs)

            }


        } catch (error) {
            console.error("Error fetching case types:", error);

        }
    };


    const createEditDoc = async (docId, url, name, dynamic_template_id) => {
        try {

            const redirect_url = `/bp-litigation/${getClientId()}/${getCaseId()}`
            const formData = new FormData();
            formData.append("doc_id", docId);
            formData.append("url", url);
            formData.append("redirect_url", redirect_url);
            formData.append("name", name);
            formData.append("template_id", dynamic_template_id);


            const response = await api_without_cancellation.post(`${origin}/api/create-edit-doc/`, formData);
            if (response.status == 200) {
                fetchEditDocs();
            }

            // Proceed with additional logic if needed



        } catch (error) {
            console.error("An error occurred:", error);
        }
    };






    const openCourtForm = async () => {


        try {
            console.log(formDataContext)
            const formData = new FormData();

            formData.append("court_form_id", courtFormId);
            formData.append("case_id", getCaseId());
            formData.append("client_id", getClientId());
            formData.append("litigation_act_id", litigationId);
            formData.append("context", JSON.stringify(formDataContext));

            const response = await api_without_cancellation.post(
                origin +
                `/api/documents/open-courtform/`,
                formData
            );
            console.log("data", response)
            if (response.status == 200) {
                const doc_id = response.data.doc_id
                const newBaseUrl = `/bp-wordprocessor/${getClientId()}/${getCaseId()}`
                const url = `${newBaseUrl}/?docId=${doc_id}&litigation_id=${litigationId}&court_form_id=${courtFormId}&type=CourtForm`;
                await createEditDoc(doc_id, url, courtFormData?.court_form_name, "")

                window.location.href = url
            }  else {
                setValidationText(response.error)
                setValidationPopUp(true)
                
            }
        } catch (error) {
            let error_text = error.response.data.error
            // console.log("Failed to fetch Litigation Data:", error.response.data.error);

            setValidationText(error_text)
            setValidationPopUp(true)
        }
    };



    useEffect(() => {
        fetchCourtFormData();
        fecthData();
    }, []);




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
        } catch (error) {
            console.log("Failed to fetch Litigation Data:", error);
        }
    };

    //data for components
    function settingCardsData() {
        const CardsDataSetter = {
            CaseData: {
                litigation_id: litigationData?.litigation?.id,
                case_name: litigationData?.litigation?.case_name,
                case_number: litigationData?.litigation?.case_number,
                county: litigationData?.litigation?.county,
                state: litigationData?.litigation?.state,
                filing_type: litigationData?.litigation?.filing_type,
                DirCourt: litigationData?.litigation?.DirCourt,
                case_full_name: litigationData?.litigation?.case_full_name,
                case_short_name: litigationData?.litigation?.case_short_name,
                jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
                jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
                court_contact: litigationData?.litigation?.court_contact,
                judge_contact: litigationData?.litigation?.judge_department_contact,
                department_contact: litigationData?.litigation?.clerk_contact,
                department: litigationData?.litigation?.department,
                clerk_first_name: litigationData?.litigation?.clerk_first_name,
                clerk_last_name: litigationData?.litigation?.clerk_last_name,
                floor: litigationData?.litigation?.floor,
                room: litigationData?.litigation?.room,
                deps:  litigationData?.litigation?.deps,
            },
            CourtData: {
                litigation_id: litigationData?.litigation?.id,
                courtId: litigationData?.litigation?.DirCourt?.id,
                county: litigationData?.litigation?.county,
                state: litigationData?.litigation?.state,
                jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
                jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
                court_name: litigationData?.litigation?.court_title2,
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
                deps:  litigationData?.litigation?.deps,
            },
            ClerkData: {
                litigation_id: litigationData?.litigation?.id,
                clerk_first_name:
                litigationData?.litigation?.clerk_contact?.first_name ||
                litigationData?.litigation?.clerk_first_name,
                clerk_last_name:
                litigationData?.litigation?.clerk_contact?.last_name ||
                litigationData?.litigation?.clerk_last_name,
                department: litigationData?.litigation?.department,
                clerk_department_contact: {
                current_id: litigationData?.litigation?.clerk_contact?.id,
                address1: litigationData?.litigation?.clerk_contact?.address1,
                address2: litigationData?.litigation?.clerk_contact?.address2,
                city: litigationData?.litigation?.clerk_contact?.city,
                state: litigationData?.litigation?.clerk_contact?.state,
                zip: litigationData?.litigation?.clerk_contact?.zip,
                phone_number:
                    litigationData?.litigation?.clerk_contact?.phone_number, // 10-digit phone number (no formatting needed)
                fax: litigationData?.litigation?.clerk_contact?.fax, // 10-digit fax number (no formatting needed)
                email: litigationData?.litigation?.clerk_contact?.email,
                },
          },
        };
        return CardsDataSetter;
    }

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

    useEffect(() => {
        dispatch(setSearchRecordId(""));
    }, [searchRecordId]);
    const open = useSelector((state) => state?.open?.open);



    const renderContent = () => {
        switch (eventType) {
            case "Filing":
                return <FilingsContent object={litigationActObj} name="Filing" litigation_obj = {litigationObj} />
            case "Hearing":
                return <HearingContent object={litigationActObj} name="Hearing" litigation_obj = {litigationObj}/>
            case "Motion":
                return <MotionContent object={litigationActObj} name="Motion" litigation_obj = {litigationObj} />
            case "Discovery":
                return <DiscoveryContent object={litigationActObj} name="Discovery" litigation_obj = {litigationObj} />
            case "Depos":
                return <DespositionContent object={litigationActObj} name="Deposition" litigation_obj = {litigationObj} />
            case "Exam":
                return <ExamContent object={litigationActObj} name="Exam"  litigation_obj = {litigationObj} />
            case "Trial":
                return <TrailContent object={litigationActObj} name="Trial" litigation_obj = {litigationObj} />
            case "Deadline":
                return <DeadlineContent object={litigationActObj} name="Deadline" litigation_obj = {litigationObj} />
            case "Event":
                return <EventsContent object={litigationActObj} name="Event" litigation_obj = {litigationObj} />


          default:
            return;
        }
      };

    return (
        <>
            <div className="page-wrapper">
                <Sidebar />
                <div className="page-container">
                    <NavBar flaggedPageName="Litigation" />
                    <ActionBarLitigation LitigationDetail={CardsData.CaseData} />
                    <div
                        className=" overflow-auto"
                        style={{ marginTop: "10.5rem", width: "100%", zIndex: "0" }}
                    >
                        <div
                            className="row"
                            style={{
                                zIndex: open ? "0" : "",
                                position: open ? "relative" : "",
                            }}
                        >
                            <div className="col-12">
                                <div className="row litigation-main-wrapper-responsive d-flex flex-nowrap no-gutters m-b-5">
                                    <div className="litigation-left content-left d-flex-1 p-r-10">
                                        <div className="border-box has-checklist rounded-0 overflow-hidden">
                                            <div className="row no-gutters">
                                                <div className="col-12 p-0">
                                                    <div className="row no-gutters equal-column-wrapper position-relative p-l-5">
                                                        <LitigationCase
                                                            caseInfo={CardsData.CaseData}
                                                            states={states}
                                                        />
                                                        <LitigationDefendant
                                                            defendants={defendantsData}
                                                            defendantProcessedPageSlots={
                                                                DefendantProcessedPageSlots
                                                            }
                                                            fetchLitigationData={fetchLitigationData}
                                                            setIsClientDataUpdated={
                                                                setLitigationDashboardDataUpdated
                                                            }
                                                        />
                                                        <div class="d-flex">
                                                            <LitigationCourtInfo
                                                                Court={CardsData.CourtData}
                                                                states={states}
                                                            />
                                                            <LitigationJudgeInfo
                                                                Judge={CardsData.JudgeData}
                                                                states={states}
                                                            />
                                                            {/* <LitigationClerkInfo
                                                                Clerk={CardsData.ClerkData}
                                                                states={states}
                                                                litigation_obj={litigationData?.litigation}
                                                            /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="litigation-right content-right bg-white h-100"
                                        id="right-timeline"
                                    >
                                        <div class="right-calendar border-0 p-0">
                                            <LitigationTimeLines
                                                timeline_events={litigationData?.timeline_events}
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
              <NotesSectionDashboard /> */}
                            </div>
                        </div>

                         

                        {renderContent()}

                        <div className="col-12 px-0">
                            <div className="notes-section-wrapper pt-0">
                                <div
                                    className="action-bar-wrapper heigh-35 position-relative mr-0 w-100"
                                >
                                    <div class="action-bar main-action-bar client-BarAlign d-flex m-b-5 pr-15 w-100" style={{paddingRight:"0px",paddingLeft:"0px"}}>
                                            <span class="page-icon">
                                                <img class="translate-note-icon" src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/courtforms.svg" />
                                            </span>
                                            <div class="text-wrapper text-nowrap text-white d-flex align-items-center p-l-5 w-100" style={{paddingRight:"0px",paddingLeft:"0px"}}>
                                            <h2 className="text-white mb-0 d-flex justify-content-between align-items-center w-100">
                                                <span>Court Form</span>
                                                {courtFormData ? (
                                                    <span className="mx-auto text-center">
                                                    {courtFormData?.court_form_code} - {courtFormData?.court_form_name}
                                                    </span>
                                                ) : null}
                                                <span>
                                                    {
                                                        showPdf ? (  <button
                                                            className={`height-25 d-flex align-items-center justify-content-center btn btn-success`}
                                                            onClick={() =>
                                                                setShowPdf(false)
                                                            }
                                                        
                                                        >
                                                            Hide Court Form Pdf
                                                            <i className="ic ic-19 ic-generate-document ml-1"></i>
                                                        </button>):(  <button
                                                            className={`height-25 d-flex align-items-center justify-content-center btn ${!isSaveDisabled ? 'btn-success' : 'btn-secondary'} `}
                                                            onClick={() =>
                                                                setShowPdf(true)
                                                            }
                                                            disabled = {isSaveDisabled}
                                                        
                                                        >
                                                            Show Court Form Pdf
                                                            <i className="ic ic-19 ic-generate-document ml-1"></i>
                                                        </button>)
                                                    }
                                              
                                                </span>
                                                </h2>
                                                

                                            </div>
                                            </div>



                                </div>
                            </div>
                            <div className="row  w-100 m-t-5 m-l-5">
                                <div className="w-100 d-flex">
                                    <button className="btn btn-secondary mr-auto" onClick={openCancelPopUp}>
                                        Cancel
                                    </button>

                                    <button className="btn btn-primary ml-auto m-r-10" onClick={openCourtForm}>
                                        Generate Court Form
                                    </button>
                                </div>

                               <CourtFormTable courtFormId={courtFormId} formDataContext={formDataContext} setFormDataContext={setFormDataContext} setValidationPopUp={setValidationPopUp} setValidationText={setValidationText} courtFormPdfImages={courtFormPdfImages}  showPdf={showPdf}/>
                                
                                <div className="w-100 d-flex mt-1">
                                    <button className="btn btn-secondary mr-auto" onClick={openCancelPopUp}>
                                        Cancel
                                    </button>

                                    <button className="btn btn-primary ml-auto m-r-10" onClick={openCourtForm}>
                                        Generate Court Form
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="height-25 mt-1">

                        </div>





                    </div>
                </div>
            </div>
            {
                <ConfirmCancelPopUp
                show={showConfirmPopUp}
                handleConfirm={handleConfirm}
                handleClose={handleClose}
                title={"Do you want to cancel the court form generation and discard all changes?"}

                />
            }
             {
                <NotEnablePopUp
                confirmPopUp={validationPopUp}
                handleClose={handleValidationPopUp}
                title= {validationText}
              />
              }
            <Footer />
        </>
    );
}

export default CourtForm;
