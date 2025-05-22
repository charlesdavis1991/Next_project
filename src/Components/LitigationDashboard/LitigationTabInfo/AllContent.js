import React, { useEffect, useState, useContext } from "react";
import "../../../../public/BP_resources/css/litigation.css";
import TitleBar from "./TitleBar";
import NotesPanel from "../../NotesPanelSection/NotesPanel";
import DocumentRow from "../../DocumentRow/DocumentRow";
import { formatDateForPanelDisplay } from "../../../Utils/helper";
import LitigationEditPopUp from "../Modals/editLitigationModal";
import EditLitigationActPopup from "../Modals/EditLitigationActPopup";
import { getClientId, getCaseId } from "../../../Utils/helper";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import axios from "axios";
import getTimeFromDateTime from "./getTimeHelper";
import Button from "../../ClientDashboard/shared/button";
import CourtForm from "../../CourtForm/CourtForm";
import NotEnablePopUp from "../../Modals/NotEnablePopUp";
import { handleLinkClick } from "../../LawFirmDirectoryDashboard/main";
import { Col, Row } from "react-bootstrap";
import InformationPanel from "../../common/InformationPanel";
import ContactPanel from "../../common/ContactPanel";

export default function AllContent({ object, name, litigation_obj }) {
  const clientId = getClientId();
  const caseId = getCaseId();
  const token = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const [defParties, setDefParties] = useState([]);
  const [otherParties, setOtherParties] = useState([]);
  const [clientParties, setClientParties] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { isLitigationDataUpdate, setLitigationDataUpdated } =
    useContext(ClientDataContext);
  const [firstTimeLitData, setFirstTimeLitData] = useState(true);

  const [showCourtForm, setShowCourtForm] = useState(false);
  const [instanceIdForCourtForm, setInstanceIdForCourtForm] = useState("");

  const [validationPopUp, setValidationPopUp] = useState(false);
  const [validationText, setValidationText] = useState("");

  const handleValidationPopUp = () => {
    setValidationPopUp(false);
  };

  const handleCourtForm = (instanceId) => {
    setInstanceIdForCourtForm(instanceId);
    const litigation_jurisdiction_type = litigation_obj?.jurisdiction_type;
    const litigation_states = litigation_obj?.state;
    
    if (litigation_states && litigation_jurisdiction_type) {
      setShowCourtForm(true);
    } else {
      return;
    }
  };

  const fecthDefPartiesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/defendants-and-other-parties/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (firstTimeLitData) {
        setDefParties(response.data?.defendants);
        setOtherParties(response.data?.other_parties);
        setClientParties(response.data?.clients);
        setFirstTimeLitData(false);
      }
      if (isLitigationDataUpdate) {
        setDefParties(response.data?.defendants);
        setOtherParties(response.data?.other_parties);
        setClientParties(response.data?.clients);
        setLitigationDataUpdated(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fecthDefPartiesData();
    if (isLitigationDataUpdate) {
      setLitigationDataUpdated(false);
    }
  }, [isLitigationDataUpdate, clientId, defParties, caseId]);

  const handleOpenClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };


  const litigationActData = [];

  const getLabelByDateType = (dateName) => {
    switch (dateName) {
      case "Service Date":
        return "Serviced";
      case "Incident Date":
        return "Incident Date";
      case "Discovery Service Date":
        return "Discovery Served";
      case "Defendant Service Date":
        return "Defendant Served";
      case "Response Served Date":
        return "Response Served";
      case "Motion Served Date":
        return "Motion Served";
      case "Filing Date":
        return "Form Filed";
      case "Motion Hearing Date":
        return "Motion Hearing";
      case "Deadline Date":
        return "Deadline";
      case "Exam Date":
        return "Exam";
      case "Deposition Date":
        return "Deposition Date";
      case "Trial Date":
        return "Trial Date";
      case "Hearing Date":
        return "Hearing";
      default:
        return "Completed";
    }
  };

  // Apply to "DependantDate" trigger type
  if (object?.trigger_type === "DependantDate" && object?.dependant_date) {
    litigationActData.push({
      label: getLabelByDateType(object?.dependant_date_type?.dependant_date_name),
      value: object?.dependant_date,
    });
  } else if (object?.trigger_type === "DependantDate" && object?.rejected_on) {
    litigationActData.push({
      label: `Expired on`,
      value: object?.rejected_on,
    });
  } 
  // Apply to "Accept/Reject" trigger type
  else if (object?.trigger_type === "Accept/Reject" && object?.accepted_on) {
    litigationActData.push({
      label: getLabelByDateType(object?.dependant_date_type?.dependant_date_name),
      value: object?.accepted_on,
    });
  } else if (object?.trigger_type === "Accept/Reject" && new Date(object?.rejected_on) > new Date(object?.end_date)) {
    litigationActData.push({
      label: `Expired on`,
      value: object?.rejected_on,
    });
  } else if (object?.trigger_type === "Accept/Reject" && object?.rejected_on) {
    litigationActData.push({
      label: `Rejected on`,
      value: object?.rejected_on,
    });
  }
  
  const litigationActButtonConfig = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "",
      style: {
        height: "25px",
        backgroundColor: "var(--primary-10)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
      },
      onClick: ()=>console.log("No event listener applied on this gen-doc btn"),
    },
  ];

  return (
    <div
      className="expert"
      style={{ marginTop: "-2px", overflow: "hidden" }}
      key={object?.id}
    >
      <TitleBar object={object} name={name} />
      <div className="flex-row d-flex overflow-hidden padding-t-5">
        <div className="reports-data row no-gutters equal-column-wrapper position-relative d-flex insurance-col-panels">
          
          <InformationPanel
          onSelectReport={handleOpenClick}
          pageName="litigation"
          panel_name={"Litigation Act"}
          data={litigationActData}
          hasBtn={true}
          buttonText={"Court Form"}
          iconClassName={"ic ic-19 ic-court-form"}
          onClick={() => handleCourtForm(object?.id)}
          />

          <InformationPanel
          onSelectReport={handleOpenClick}
          pageName="litigation"
          panel_name={"Related Dates"}
            type={object?.event_id?.trigger_type}
          act={object}
          data={
            object?.calculated_dates?.length > 0 ? 
            object?.calculated_dates?.map((calDate, index)=>{
              return {
                label:calDate?.date_name,
                value:formatDateForPanelDisplay(calDate?.date_val)
              }
            })
            : 
            object?.event_id?.calculated_dates_id?.length > 0 ? 
            object.event_id.calculated_dates_id.map((calDate, index) => {
              return {
                label:calDate?.calculated_date_name,
                value:`${calDate?.day_count} ${calDate?.day_count_type} before`
              }
            }) 
            :
            [
              {
              label:"No calculated dates available.",
              value:""
              }
            ]
          }
          />

          <ContactPanel
          panel_name={"LOCATION OR MEETING LINK"}
          pageName={"litigation_all_content"}
          name={object?.location?.name}
          address1={object?.location?.address1}
          address2={object?.location?.address2}
          city={object?.location?.city}
          state={object?.location?.state}
          zip_code={object?.location?.zip}
          phone_number={object?.location?.phone}
          fax_number={object?.location?.fax}
          email={object?.location?.email}
          websiteURL={object?.location?.webiste}
          meetingurl={object?.meetingurl || 'Meeting Link'}
          buttonData={litigationActButtonConfig}
          />
        </div>
        {object?.id && (
          <NotesPanel
            entity_type={"LitigationAct"}
            record_id={object?.id}
            module={"Litigation"}
            pagePanels={3}
            notesName={name}
          />
        )}
      </div>
      <div className="row documents-wrapper m-t-5">
        <div className="col-12">
          <div className="height-25">
            <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-15 font-weight-semibold text-center client-contact-title">
              &nbsp;Document Row
            </h4>
          </div>
          <DocumentRow
            clientProvider={object}
            page={object?.event_type_id?.litigation_event_type}
          />
        </div>
      </div>
      {/* <LitigationEditPopUp
        showPopup={showPopup}
        handleClose={handleClosePopup}
        current_name={object?.name}
        current_note={object?.notes}
        current_depndt_date={object?.dependant_date}
        current_To={object?.to}
        current_from={object?.from_to}
        current_start_date={object?.start_date}
        current_end_date={object?.end_date}
        current_start_time={currentStartTime}
        current_end_time={currentEndTime}
        current_meeting_url={object?.meetingurl}
        current_allday={object?.is_allday}
        litigation_id={object?.id}
        client_parties={clientParties}
        def_parties={defParties}
        other_parties={otherParties}
      /> */}
      {showPopup && (
        <EditLitigationActPopup
          showPopup={showPopup}
          handleClose={handleClosePopup}
          litigationDetail={litigation_obj}
          act={object}
        />
      )}
      {showCourtForm && (
        <CourtForm
          show={true}
          handleClose={() => setShowCourtForm(false)}
          PageEntity="litigation"
          instanceId={instanceIdForCourtForm}
        />
      )}
      {
        <NotEnablePopUp
          confirmPopUp={validationPopUp}
          handleClose={handleValidationPopUp}
          title={validationText}
        />
      }
    </div>
  );
}