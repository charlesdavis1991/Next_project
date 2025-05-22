// import React, {
//     useState,
//     useRef,
//     useEffect,
//     useContext

// } from "react";
// import './wordprocessor.css'

// import api, { api_without_cancellation } from "../../api/api";
// import { Spinner, Table } from "react-bootstrap";
// import { RssFeed } from "@mui/icons-material";
// import { getCaseId, getClientId } from "../../Utils/helper";

// import { useFooter } from "../common/shared/FooterContext";
// import { redirect } from "react-router-dom";


// import ActionBarLitigation from "../../Components/LitigationDashboard/ActionBarLitigation";
// import "../../../public/BP_resources/css/litigation.css";
// import LitigationCase from "../../Components/LitigationDashboard/litigationCase";
// import LitigationDefendant from "../../Components/LitigationDashboard/litigationDefendantTable";
// import { useDispatch, useSelector } from "react-redux";
// import LitigationCourtInfo from "../../Components/LitigationDashboard/LitigationCourtDetail";
// import LitigationJudgeInfo from "../../Components/LitigationDashboard/LitigationJudgeDetail";
// import LitigationClerkInfo from "../../Components/LitigationDashboard/LitigationClerkDetail";
// import LitigationTimeline from "../../Components/LitigationDashboard/LitigationTimeline";
// import LitigationTab from "../../Components/LitigationDashboard/LitigationsTabs";
// import LitigationNotes from "../../Components/LitigationDashboard/LitigationNotes";
// import axios from "axios";
// import NotesSectionDashboard from "../../Components/NotesSectionDashboard/main";
// import { ClientDataContext } from "../../Components/ClientDashboard/shared/DataContext";
// import useIsStates from "../../Hooks/getStates";
// import { setSearchRecordId } from "../../Redux/search/searchSlice";
// import LitigationTimeLines from "../../Components/LitigationDashboard/LitigationTimelines";
// import Footer from "../../Components/common/footer";


// function WPCourtFormVariable({
//     courtFormId,
//     litigationId,
//     courtFormName
// }) {

//     const origin = process.env.REACT_APP_BACKEND_URL

//     const [variables, setVariables] = useState([]);
//     const [formDataContext, setFormDataContext] = useState({});
//     const { footerState, setFooterState } = useFooter();


//     const handleInputChange = (dataVariable, event) => {
//       const { type, checked, value } = event.target;
//       setFormDataContext(prevState => ({
//           ...prevState,
//           [dataVariable]: type === "checkbox" ? (checked ? "X" : "") : value
//       }));
//   };


//   const fetchEditDocs = async () => {
//     console.log("fetching data ......")
//     try {
        
//         const response = await api_without_cancellation.get(
//          `${origin}/api/create-edit-doc/`
//         );
      
//         if (response.status === 200) {
//             var data = response.data
//             console.log("fetchEditDocs",data)
//             setFooterState(data)
  
            
  
//         }
      
     
//     } catch (error) {
//       console.error("Error fetching case types:", error);
      
//     }
//   };


//   const createEditDoc = async (docId,url,name,dynamic_template_id) => {
//     try {

//           const redirect_url =  `/bp-litigation/${getClientId()}/${getCaseId()}`
//           const formData = new FormData();
//           formData.append("doc_id", docId);
//           formData.append("url", url);
//           formData.append("redirect_url", redirect_url);
//           formData.append("name", name);
//           formData.append("template_id", dynamic_template_id);


//             const response = await api_without_cancellation.post(`${origin}/api/create-edit-doc/`, formData);
//             if (response.status == 200) {
//                fetchEditDocs();
//             }

//             // Proceed with additional logic if needed
        

        
//     } catch (error) {
//         console.error("An error occurred:", error);
//     }
// };

    

   


//     const openCourtForm = async () => {
   
  
//       try {
//         console.log(formDataContext)
//         const formData = new FormData();
        
//             formData.append("court_form_id", courtFormId);
//             formData.append("case_id", getCaseId());
//             formData.append("client_id", getClientId());
//             formData.append("litigation_act_id", litigationId);
//             formData.append("context", JSON.stringify(formDataContext));
        
//         const response = await api_without_cancellation.post(
//           origin +
//           `/api/documents/open-courtform/`,
//           formData
//         );
//         console.log("data",response)
//         if (response.status == 200) {
//           const doc_id = response.data.doc_id
//           const newBaseUrl = `/bp-wordprocessor/${getClientId()}/${getCaseId()}`
//           const url = `${newBaseUrl}/?docId=${doc_id}&litigation_id=${litigationId}&court_form_id=${courtFormId}&type=CourtForm`;
//           await createEditDoc(doc_id,url,courtFormName,"")

//           window.location.href = url
//         }
//       } catch (error) {
//         console.log("Failed to fetch Litigation Data:", error);
//       }
//     };
  
    


//     const fetchVariables = async () => {
//         try {
//           const response = await api_without_cancellation.get(
//             `${origin}/api/documents/read-courtform-key/?court_form_id=${courtFormId}`,
        
//           );
    
//           if (response.status == 200) {
//             console.log(response.data.data)
//             setVariables(response.data.data);
//           }
//         } catch (error) {
//           console.error("Failed to fetch client data:", error);
//         }
//       };

//     useEffect(() => {
//         fetchVariables();
      
//       }, []);



//       const node_env = process.env.NODE_ENV;
//       const media_origin =
//         node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
//       const token = localStorage.getItem("token");
//       const dispatch = useDispatch();
//       const currentCaseId = getCaseId();
//       const clientId = getClientId();
//       const [litigationData, setLitigationData] = useState({});
//       const [defendantsData, setDefendantsData] = useState([]);
//       const [DefendantProcessedPageSlots, setDefendantProcessedPageSlots] =
//         useState([]);
//       const { isLitigationDashboardDataUpdate, setLitigationDashboardDataUpdated } =
//         useContext(ClientDataContext);
//       const [CardsData, setCardsData] = useState(false);
//       const [firstTimeLitigationtData, setFirstTimeLitigationData] = useState(true);
//       const states = useIsStates();
//       const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
    
//       const fetchLitigationData = async () => {
//         try {
//           const litigation_data = await axios.get(
//             `${origin}/api/litigation-page/litigations/${clientId}/${currentCaseId}/`,
//             {
//               headers: {
//                 Authorization: token,
//               },
//             }
//           );
//           if (firstTimeLitigationtData) {
//             setLitigationData(litigation_data.data);
//             setDefendantsData(litigation_data.data?.defendants);
//             setDefendantProcessedPageSlots(
//               litigation_data.data?.defendant_processed_page_slots
//             );
//             setFirstTimeLitigationData(false);
//           }
//           if (isLitigationDashboardDataUpdate) {
//             setLitigationData(litigation_data.data);
//             setDefendantsData(litigation_data.data?.defendants);
//             setDefendantProcessedPageSlots(
//               litigation_data.data?.defendant_processed_page_slots
//             );
//             setLitigationDashboardDataUpdated(false);
//           }
//         } catch (error) {
//           console.log("Failed to fetch Litigation Data:", error);
//         }
//       };
    
//       //data for components
//       function settingCardsData() {
//         const CardsDataSetter = {
//           CaseData: {
//             litigation_id: litigationData?.litigation?.id,
//             case_name: litigationData?.litigation?.case_name,
//             case_number: litigationData?.litigation?.case_number,
//             court_title1: litigationData?.litigation?.court_title1,
//             court_title2: litigationData?.litigation?.court_title2,
//             court_name: litigationData?.litigation?.court_name,
//             county: litigationData?.litigation?.county,
//             state: litigationData?.litigation?.state,
//             filing_type: litigationData?.litigation?.filing_type,
//             case_full_name: litigationData?.litigation?.case_full_name,
//             case_short_name: litigationData?.litigation?.case_short_name,
//             jurisdiction_obj: litigationData?.litigation?.jurisdiction_obj,
//             DirCourt: litigationData?.litigation?.DirCourt,
//             jurisdiction_type: litigationData?.litigation?.jurisdiction_type,
//           },
//           CourtData: {
//             litigation_id: litigationData?.litigation?.id,
//             court_name: litigationData?.litigation?.court_name,
//             court_title1: litigationData?.litigation?.court_title1,
//             court_title2: litigationData?.litigation?.court_title2,
//             court_contact: {
//               current_id: litigationData?.litigation?.court_contact?.id,
//               address1:
//                 litigationData?.litigation?.court_contact?.address1 ||
//                 litigationData?.litigation?.court_address1,
//               address2:
//                 litigationData?.litigation?.court_contact?.address2 ||
//                 litigationData?.litigation?.court_address2,
//               city:
//                 litigationData?.litigation?.court_contact?.city ||
//                 litigationData?.litigation?.court_address_city,
//               state:
//                 litigationData?.litigation?.court_contact?.state ||
//                 litigationData?.litigation?.state?.name,
//               zip:
//                 litigationData?.litigation?.court_contact?.zip ||
//                 litigationData?.litigation?.court_address_zip,
//               phone_number: litigationData?.litigation?.court_contact?.phone_number, // This should be 10 digits long (no formatting needed)
//               fax: litigationData?.litigation?.court_contact?.fax, // This should also be 10 digits long (no formatting needed)
//               email: litigationData?.litigation?.court_contact?.email,
//             },
//           },
//           JudgeData: {
//             litigation_id: litigationData?.litigation?.id,
//             judge_first_name:
//               litigationData?.litigation?.judge_department_contact?.first_name ||
//               litigationData?.litigation?.judge_first_name,
//             judge_last_name:
//               litigationData?.litigation?.judge_department_contact?.last_name ||
//               litigationData?.litigation?.judge_last_name,
//             clerk_first_name:
//               litigationData?.litigation?.clerk_contact?.first_name ||
//               litigationData?.litigation?.clerk_first_name,
//             clerk_last_name:
//               litigationData?.litigation?.clerk_contact?.last_name ||
//               litigationData?.litigation?.clerk_last_name,
//             department: litigationData?.litigation?.department,
//             judge_department_contact: {
//               current_id: litigationData?.litigation?.judge_department_contact?.id,
//               address1:
//                 litigationData?.litigation?.judge_department_contact?.address1,
//               address2:
//                 litigationData?.litigation?.judge_department_contact?.address2,
//               city: litigationData?.litigation?.judge_department_contact?.city,
//               state: litigationData?.litigation?.judge_department_contact?.state,
//               zip: litigationData?.litigation?.judge_department_contact?.zip,
//               phone_number:
//                 litigationData?.litigation?.judge_department_contact?.phone_number, // No formatting needed
//               fax: litigationData?.litigation?.judge_department_contact?.fax, // No formatting needed
//               email: litigationData?.litigation?.judge_department_contact?.email,
//             },
//           },
//           ClerkData: {
//             litigation_id: litigationData?.litigation?.id,
//             clerk_first_name:
//               litigationData?.litigation?.clerk_contact?.first_name ||
//               litigationData?.litigation?.clerk_first_name,
//             clerk_last_name:
//               litigationData?.litigation?.clerk_contact?.last_name ||
//               litigationData?.litigation?.clerk_last_name,
//             department: litigationData?.litigation?.department,
//             clerk_department_contact: {
//               current_id: litigationData?.litigation?.clerk_contact?.id,
//               address1: litigationData?.litigation?.clerk_contact?.address1,
//               address2: litigationData?.litigation?.clerk_contact?.address2,
//               city: litigationData?.litigation?.clerk_contact?.city,
//               state: litigationData?.litigation?.clerk_contact?.state,
//               zip: litigationData?.litigation?.clerk_contact?.zip,
//               phone_number: litigationData?.litigation?.clerk_contact?.phone_number, // 10-digit phone number (no formatting needed)
//               fax: litigationData?.litigation?.clerk_contact?.fax, // 10-digit fax number (no formatting needed)
//               email: litigationData?.litigation?.clerk_contact?.email,
//             },
//           },
//         };
//         return CardsDataSetter;
//       }
    
//       useEffect(() => {
//         fetchLitigationData();
//         setCardsData(settingCardsData());
//         if (isLitigationDashboardDataUpdate) {
//           setLitigationDashboardDataUpdated(false);
//         }
//       }, [
//         clientId,
//         currentCaseId,
//         isLitigationDashboardDataUpdate,
//         litigationData,
//       ]);
    
//       const sampleTimelineEvents = [
//         {
//           date: "2024-09-15",
//           events: [
//             {
//               type: "Litigation",
//               event: {
//                 is_allday: true,
//                 event_id: { event_name: "Court Hearing" },
//               },
//             },
//             {
//               type: "DefendantDates",
//               event: {
//                 is_allday: true,
//                 event_id: { event_name: "Served Notice" },
//               },
//             },
//           ],
//         },
//         {
//           date: "2024-09-18",
//           events: [
//             {
//               type: "Litigation",
//               event: {
//                 is_allday: false,
//                 event_id: { event_name: "Motion Filed" },
//               },
//             },
//           ],
//         },
//       ];
    
//       useEffect(() => {
//         dispatch(setSearchRecordId(""));
//       }, [searchRecordId]);
//       const open = useSelector((state) => state?.open?.open);

//     return (
// <div className="row  w-100 m-t-5 m-l-5">
//   <button className="btn btn-primary ml-auto" onClick={openCourtForm}>
//     Open Word Processor

//   </button>
// <Table
//           className="text-start custom-table-directory m-t-5"
//           striped
//           responsive
//           bordered
//           hover
//         >
// {/* <table className={`table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5`}
//         id="treatment-summary-table"> */}

// <tbody>
//   {variables &&
//     variables?.map((item, idx) => {

//       const dataVariableCb = item[0] || ""; // Use the first or third element as the key
//       const dataVariableInp = item[2] || ""; // Use the first or third element as the key

//       return (
//         <tr>
//           <td
//     style={{ width: "60px"}}
//     >
//             {
//                 item[0]?(
                
//                     <div class="form-check justify-content-center">
//                         <input 
//                             className="form-check-input template-checkbox"
//                             type="checkbox"
//                             onChange={(e) => handleInputChange(dataVariableCb, e)}

                            
//                             ></input>
//                     </div>
                    
//                     ):(
//                    ""
//                 )
//             }
          
           
//           </td>
//           <td
//     style={{ width: "500px"}}
//     >

//           {
//                 item[1]?(item[1]):("")
//             }
            
//           </td>
//           <td
//            style={{ width: "auto"}}
//           >

          
//           {
                                

//                 item[2]?(
//                 <div class="form-check justify-content-center">
//                       <textarea className="form-control" style={{height:"auto"}} rows={item[3]?(item[3]):(1)}
//                       onChange={(e) => handleInputChange(dataVariableInp, e)}

//                       />
      

//                 </div>
                
//                 ):("")           }

               
//           </td>
          

//         </tr>
//       );
//     })}
// </tbody>
// </Table>

// </div>

// </>  
//                 );
//   }

// export default WPCourtFormVariable;
