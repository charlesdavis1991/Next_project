import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { getCaseId } from "../../Utils/helper";
import api from "../../api/api"
import NotEnablePopUp from "./NotEnablePopUp";

function SendCopilotRequest({
  confirmPopUp,
  handleClose,
  selectedFirm,
  toFirm,
  requestedAt,
  fetchtFirmsData
}) {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const caseID = getCaseId();
   
    

  const handleConfirm =  async () => {
    const data = {
        case_id: caseID,
        from_firm: toFirm.id,
        to_firm : selectedFirm.id
      };
    try {
      const response =  await api.post(
        `${origin}/api/create-copilot-request/`,
        data
      );
      if (response.status === 200 && response.data.data === "Request Added") {
        handleClose();
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
  

  

 
  return (
    <>
      {requestedAt ? (
        <NotEnablePopUp
          handleClose={handleClose}
          confirmPopUp={confirmPopUp}
          title={`Request already sent to this firm ${selectedFirm?.attorneyprofile?.office_name}`}
        />
      ) : (
        <Modal
          show={confirmPopUp ? true : false}
          onHide={handleClose}
          dialogClassName="modal-dialog modal-800p"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                This will send a request to{" "}
                <b>{selectedFirm?.attorneyprofile?.office_name}</b> asking that they CoPilot your law firm and grant your law firm access to their library of documents and templates.
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
                onClick={handleConfirm}
                className="btn btn-success"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
  
}

export default SendCopilotRequest;
