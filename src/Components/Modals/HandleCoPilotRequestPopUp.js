import { selectClasses } from "@mui/material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { getCaseId } from "../../Utils/helper";
import api from "../../api/api"
import { useDispatch, useSelector } from "react-redux";

function HandleCoPilotRequestPopUp({
  confirmPopUp,
  handleClose,
  selectedFirm,
  fetchtFirmsData,
  toFirm,
  loggedInUser,
  requestId,
  fetchCoPilotedFirms
}) {
    const origin = process.env.REACT_APP_BACKEND_URL;
        
    const caseID = getCaseId();
    const [isChecked, setIsChecked] = useState(false);
    const [modalStatus, setModalStatus] = useState("");


  
    
    const handleConfirm = () => {
        updateStatus("accept");
      };

  const handleAccept = () => {
    setModalStatus("accept")
};

  
  const handleReject = () => {
    updateStatus("reject");
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
  };


  const updateStatus =  async (status) => {
    const data = {
        request_id:requestId,
        status: status,
        case_id: caseID,
        for_firm: selectedFirm.id,
        copiloted_firm : toFirm.id
      };
    try {
      const response =  await api.post(
        `${origin}/api/handle-pending-requests/`,
        data
      );
      console.log("API response:", response); // Log the response to check for success or failure

      if (response.status === 200 && response.data.status) {
        handleClose();
        setModalStatus("");
        fetchCoPilotedFirms();
        fetchtFirmsData();
      }
    } catch (error) {
      if (error.response) {
        // If the server responded with a status other than 2xx
        console.error("Error response:", error.response.data);
      } else if (error.request) {
        // If the request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error:", error.message);
      }
      handleClose();
    }
  };
  

  

 


  return (<Modal
        show={confirmPopUp ? true : false}
        onHide={handleClose}
        dialogClassName={modalStatus == "accept" ? ("modal-dialog-centered modal-800p"):("modal-dialog modal-800p")}
        >
        {
            modalStatus == "accept" ? (<div className="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Confirm Co Pilot Request</h5>
                </div>
                <div class="modal-body">
                  <form id="requestCoPilotForm">
                      <div class="ml-3 mt-3">
                          <p>The purpose of this agreement is to establish a collaborative framework where {toFirm?.attorneyprofile?.office_name} can request assistance from {selectedFirm?.attorneyprofile.office_name} in handling a significant volume of cases and clients.</p>
        
                <h4>Objective:</h4>
                <p>The objective of this agreement is to support one another by sharing caseloads. In situations where either firm is overwhelmed with a high number of cases, the requesting firm may seek assistance from the other firm, also referred to as the "copiloting firm."</p>
        
                <h4>Copiloting Process:</h4>
                <ol>
                <li>
                <strong>Request:</strong> The requesting firm will initiate the copiloting process by submitting a formal request to the copiloting firm, specifying the caseload they require assistance with. This request will be made through our platform's designated Copiloting feature.
                </li>
                <li>
                <strong>Acceptance:</strong> Upon receiving the request, the copiloting firm will review the details and evaluate their capacity to accommodate the additional caseload. If the copiloting firm agrees to assist, they will accept the request through the platform, indicating their commitment to share the workload.
                </li>
                <li>
                <strong>Caseload Sharing:</strong> Once the copiloting firm accepts the request, the cases will be divided between the firms in a mutually agreed manner. We will utilize our platform's built-in tools and functionalities to ensure smooth collaboration and transparent case management throughout the copiloting period.
                </li>
                </ol>
        
                <h4>Duration and Termination:</h4>
                <ol>
                <li>
                <strong>Duration:</strong> The copiloting agreement will be valid for a specified duration, which shall be determined by both parties prior to initiating the copiloting process. The duration can be extended or modified by mutual consent.
                </li>
                <li>
                <strong>Termination:</strong> Either party has the right to terminate this agreement by providing written notice to the other party. Upon termination, both firms will complete any ongoing cases and ensure a smooth transition of remaining caseloads back to the requesting firm.
                </li>
                </ol>
        
                <h4>Confidentiality and Data Protection:</h4>
                <p>Both firms shall adhere to strict confidentiality standards and protect the privacy of clients and their sensitive information. Any shared data or documentation should be treated with utmost care and in accordance with applicable data protection laws and regulations.</p>
        
                <h4>Indemnification:</h4>
                <p>Each firm shall indemnify, defend, and hold harmless the other firm, its officers, employees, and agents from and against any claims, damages, liabilities, costs, and expenses arising out of or related to their performance under this copiloting agreement.</p>
        
                <p>We believe that this Copiloting Agreement will enable us to work together efficiently and support one another in handling caseloads during peak periods. If you agree with the terms and conditions outlined above, please sign and return a copy of this agreement.</p>
        
                            </div>
        
                            <div class="form-check mt-5 ml-3">
                                <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="agreeCheckbox"
                                        onChange={handleCheckboxChange}
                                    />
                                <label class="form-check-label" for="exampleCheckbox">
                                    By checking this box, you acknowledge that you have thoroughly reviewed and understood the terms of this agreement and agree to be bound by them.
                                </label>
                                </div>
        
                                <div class="input-group mt-2 ml-3">
                                <div>{loggedInUser?.first_name} {loggedInUser?.last_name}</div>
        
        
                                </div>
                                <div class="invalid-feedback" id="error1"></div>
        
        
        
                        </form>
        
                </div>
        
                <div class="modal-footer border-0 justify-content-between pt-0">
                    <button type="button" class="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    <button
                        type="button"
                        className="btn btn-success"
                        disabled={!isChecked} // Initial state of the button
                        onClick={handleConfirm}
                        >
                    Confirm
                    </button>        
                
                </div>
          </div>):( 
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Do you want to Copilot this firm  <b>{selectedFirm?.attorneyprofile?.office_name}</b>?
                     
                    </h5>
                    
                  </div>
                  <div className="modal-body"></div>
                  <div className="modal-footer border-0 justify-content-between pt-0">
          
                  <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  
                    <button
                      type="button"
                      onClick={handleReject}
                      className="btn btn-danger ml-auto"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="btn btn-success"
                    >
                      Accept
                    </button>
                  </div>
                </div>)
        }
        
        </Modal>)
}

export default HandleCoPilotRequestPopUp;
