import React, { useEffect, useState, useContext } from "react";
import "../../../../public/BP_resources/css/litigation.css";
import TitleBar from "./TitleBar";
import NotesPanel from "../../NotesPanelSection/NotesPanel";
import DocumentRow from "../../DocumentRow/DocumentRow";
import { formatDateForPanelDisplay } from "../../../Utils/helper";
import "../../../../public/BP_resources/css/litigation.css";
import LitigationDocRows from "./LitigationDocRowsComp";
import LitigationDateSOLModal from "../Modals/dateEditSOL";
import LitigationSOLModal from "./SOLstatusEdit";

export default function SOLContent({
  solcase,
  solcaseData,
  act,
}) {
  const [templateId, setTemplateId] = useState("no_option");

  console.log("sol data",act);

  // const [showDateModal, setShowDateModal] = useState(false);
  // const [showStatusModal, setShowStatusModal] = useState(false);

  // const handleSolcaseClick = (pk) => {
  //     document.getElementById('sol_id_input').value = pk;
  //     // Trigger modal, integrate with a modal management system like react-bootstrap, or custom implementation
  // };

  // const updateSolcaseRecalculation = (event) => {
  //     const { solcase_id, field_name } = event.target.dataset;
  //     const isChecked = event.target.checked;
  //     // Handle the recalculation logic for the solcase
  // };

  // const handleShowStatusModal = () => {
  //     setShowStatusModal(true);
  // }

  // const handleShowModalDate = () => {
  //     setShowDateModal(true);
  // };

  // const handleCloseStatusModal = () =>{
  //     setShowStatusModal(false);
  // }
  // const handleCloseModalDate = () => {
  //     setShowDateModal(false);
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  };

  const getTimeSpan = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMs = Math.abs(d2 - d1);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays <= 30) {
      return `${diffInDays} days`;
    }

    const diffInMonths = diffInDays / 30.44; // Average month length
    if (diffInMonths < 12) {
      return `${Math.floor(diffInMonths)} months`;
    }

    const diffInYears = diffInMonths / 12;
    return `${Math.floor(diffInYears)} years`;
  };

  return (
    <div
      className={`overflow-hidden panel-wrapper-row m-b-15 m-r-5 ${solcase ? "lit-padding-5px-border-margin-top-color" : "sol_subblock"}`}
    >
      <div className="row">
        <div className="col-md-6">
          {/* <div className="litigation-row d-flex">
                        <span className="text-row-wrap float-left">
                            <p className={solcaseData?.removed ? 'font-weight-bold' : 'black-text font-weight-bold'}>
                                {solcaseData?.name}
                            </p>
                        </span>
                    </div> */}
          <h4
            className={
              solcaseData?.removed ? "lit-color-dark-grey" : "lit-color-777"
            }
          >
            Statute Of Limitation Cases
          </h4>
          <div className="litigation-links d-block">
            <a href="javascript:void(0)" className="lit-color-093761">
              {getTimeSpan(act?.end_date, act?.start_date)} after{" "}
              {act?.event_type_id?.litigation_event_type &&
                `${act?.event_type_id?.litigation_event_type} Date`}
            </a>
          </div>
        </div>

        {/* <div className="col-md-5 d-none">
                    <div className="litigation-row d-flex">
                        <input
                            type="checkbox"
                            className="mr-1"
                            data-solcase_id={solcaseData?.pk}
                            data-field_name="Incident Date"
                            onClick={updateSolcaseRecalculation}
                            defaultChecked={solcaseData?.recalculate_incident_date}
                        />
                        <label className="mb-0">
                            Recalculate Statute of Limitations if Incident Date is changed
                        </label>
                    </div>
                    <div className="litigation-row d-flex">
                        <input
                            type="checkbox"
                            className="mr-1"
                            data-solcase_id={solcaseData?.pk}
                            data-field_name="Birthday"
                            onClick={updateSolcaseRecalculation}
                            defaultChecked={solcaseData?.recalculate_birthday}
                        />
                        <label className="mb-0">
                            Recalculate Statute of Limitations if Birthday is changed
                        </label>
                    </div>
                </div> */}

        {/* Filing date block */}
        <div className="col-md-6 text-right">
          <div
            className="litigation-row d-flex lit-cursor-pointer justify-content-end"
            style={{ borderBottom: "2px solid black", paddingBottom: "5px" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#eee")
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            <span className="text-row-wrap text-left">
              <p className="gray-label ml-2 mr-1">
                {act?.event_type_id?.litigation_event_type}
              </p>
            </span>
            <span className="text-row-wrap d-block overflow-hidden ml-2 text-left">
              <p className={!solcaseData?.removed ? "black-text" : ""}>
                {formatDate(act?.start_date)}
              </p>
            </span>
          </div>
        </div>
      </div>

      {/* Select box for template */}
      <select
        className="lit-color-grey-font-14px-width-300-px-text-align-center form-select"
        name="template_id"
        id="template_id"
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
      >
        <option value="no_option" className="lit-color-grey-font-size-14px">
          Applicable Litigation Templates
        </option>
        <option value="example_1" className="lit-color-grey-font-size-14px">
          example document 1
        </option>
        <option value="example_2" className="lit-color-grey-font-size-14px">
          example document 2
        </option>
        <option value="example_3" className="lit-color-grey-font-size-14px">
          example document 3
        </option>
      </select>
      <LitigationDocRows />
      {/* {showDateModal && 
                <LitigationDateSOLModal showPopup={showDateModal} handleClose={handleCloseModalDate} solId={solcaseData?.id}/>
            }
            {showStatusModal &&
             <LitigationSOLModal showPopup={showStatusModal} handleClose={handleCloseStatusModal} solId={solcaseData?.id} removed={solcaseData.removed} satisfied={solcaseData.satisfied} filing_date={solcaseData.filing_date_added}/>   
            } */}
    </div>
  );
}
