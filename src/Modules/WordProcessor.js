import React, {
  useState,
  useReducer,
  useEffect
} from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Footer from "../Components/common/footer";
import WPLetterTemplate from "../Components/WordProcessor/WPLetterTemplate";
import WPGenerateDocument from "../Components/WordProcessor/WPGenerateDocument";
import { useSearchParams } from "react-router-dom";
import WPDraft from "../Components/WordProcessor/WPDraft";
import SelectDoc from "../Components/WordProcessor/selectDoc";
import WPCourtForm from "../Components/WordProcessor/WPCourtForm";


import { getLoggedInUserId, getCaseId,getClientId } from "../Utils/helper";
import axios from "axios";
import { useFooter } from "../Components/common/shared/FooterContext";

function WordProcessor() {
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("docId");
  const updatedDocId = searchParams.get("updatedDocId");

  const dynamicTemplateId = searchParams.get("dynamic_template_id");
  const type = searchParams.get("type");
  const draftId = searchParams.get("draftId");

  const courtFormId = searchParams.get("court_form_id");
  const courtFormName = searchParams.get("court_form_name");

  const redirectUrl = decodeURIComponent(searchParams.get("redirect_url"));

  const { footerState, setFooterState } = useFooter();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [countdown, setCountdown] = useState(5); // Initialize countdown to 5 seconds
  const [countdownActive, setCountdownActive] = useState(false);
  const litigationId = searchParams.get("litigation_id");

  const renderContent = () => {
    switch (type) {
      case "LetterTemplate":
        return <WPLetterTemplate  updatedDocId={updatedDocId}  docId={docId} dynamicTemplateId={dynamicTemplateId}  dispatch={dispatch} state={state}/>;
      case "GenerateDocument":
        return <WPGenerateDocument  updatedDocId={updatedDocId}  docId={docId} dynamicTemplateId={dynamicTemplateId}  dispatch={dispatch} draftId={draftId}  state={state} fetchEditDocs={fetchEditDocs} type={type}/>;
      case "Draft":
        return <WPGenerateDocument  updatedDocId={updatedDocId}  docId={docId} dynamicTemplateId={dynamicTemplateId}  dispatch={dispatch} draftId={draftId}  state={state} fetchEditDocs={fetchEditDocs} type={type}/>;
      case "selectDoc":
        return <SelectDoc dynamicTemplateId={dynamicTemplateId} redirectUrl={redirectUrl} />;
      case "CourtForm":
          return <WPCourtForm updatedDocId={updatedDocId}  docId={docId} courtFormId={courtFormId}  dispatch={dispatch} draftId={draftId}  state={state} fetchEditDocs={fetchEditDocs} type={type} litigationId={litigationId} />;
      // case "CourtFormVariable":
      //   return <WPCourtFormVariable updatedDocId={updatedDocId}  docId={docId} courtFormId={courtFormId} litigationId={litigationId} courtFormName={courtFormName} />;

      default:
        return <p>Select an option to get started</p>;
    }
  };

  
  const fetchEditDocs = async () => {
    try {
        
        const response = await axios.get(
         `${origin}/api/create-edit-doc/`,
          {
            headers: { Authorization: token },
          }
        );
      
        if (response.status === 200) {
            var data = response.data
            setFooterState(data)
        }
      
     
    } catch (error) {
      console.error("Error fetching case types:", error);
      
    }
  };


  const initialState = {
    filename: "",
    updatedFileName: "",
    show: false,
    loading: true,
    error: false,
    status: "",
    draftId: "",
    tempName:""
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_LOADING":
        return { ...state, loading: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      case "SET_FILENAME":
        return { ...state, filename: action.payload };
      case "SET_UPDATED_FILENAME":
        return { ...state, updatedFileName: action.payload };
      case "SHOW_MODAL":
        return { ...state, show: true, status: action.payload };
      case "HIDE_MODAL":
        return { ...state, show: false };
      case "SET_DRAFT_ID":
        return { ...state, draftId: action.payload };
      case "SET_TEMP_NAME":
          return { ...state, tempName: action.payload };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const redirectToFirmSetting = async () => {
      if (type === "LetterTemplate" && !state.status.includes("renamed")) {
          const redirect_url = "/bp-firmsetting/" + getClientId() + "/" + getCaseId() + "/?tab_id=templates";
          window.location.href = redirect_url;
      } else if ( (type === "GenerateDocument" || type === "Draft") && !state.status.includes("renamed") && !state.status.includes("Attached To Case") ){
        if(redirectUrl){
          window.location.href = redirectUrl;
        } 
        
      } else if ( type === "CourtForm"){
        const redirect_url = "/bp-litigation/" + getClientId() + "/" + getCaseId()
        window.location.href = redirect_url;
      }
  };

  useEffect(() => {
    if (state.show) {
      setCountdown(5);
      setCountdownActive(true);

      const timer = setTimeout(() => {
        dispatch({ type: "HIDE_MODAL" });
        redirectToFirmSetting();
        setCountdownActive(false);
      }, 5000);

      const countdownInterval = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
        setCountdownActive(false);
      };
    }
  }, [state.show]);

  return (
    <>
    
      <div className="page-wrapper">
        <link href="https://cdn.syncfusion.com/ej2/material.css" rel="stylesheet" />

        <Sidebar />
        <div className="page-container">
          <NavBar flaggedPageName="Word Processor" />
          <div className="row w-100" id="padding-top-165">
            {type == "CourtFormVariable" ?
            (<ActionBarComponent
              src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/courtforms.svg"
              page_name={"Court Form"}
            />):( <ActionBarComponent
              src={
                type == "LetterTemplate"?
                ("https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/edit-template-icon.svg"):
                ("https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/documents-icon-color.svg")
              }
              page_name={ state.tempName || "Word Processor"}
            />)  
          
          }
            
           
            
            {renderContent()}

          </div>
        </div>
      </div>
      
      <Modal
        show={state.show}
        onHide={() => 
          {
            
            dispatch({ type: "HIDE_MODAL" })
            redirectToFirmSetting();
        
        }
        
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>{state.status}</Modal.Title>
        </Modal.Header>
        <Modal.Footer className = "mt-0" style={{ borderTop: 'none', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="secondary"
            onClick={() => {
              dispatch({ type: "HIDE_MODAL" });
              redirectToFirmSetting();
            }}
            style={{ marginBottom: '10px' }} // Adds space between button and countdown text
          >
            Dismiss
          </Button>
          <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Automatically closing in {countdown} seconds...
          </div>
        </Modal.Footer>

      </Modal>

    <Footer />
    </>
  );
}

export default WordProcessor;
