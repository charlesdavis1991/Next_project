import { selectClasses } from "@mui/material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { getCaseId } from "../../Utils/helper";
import api from "../../api/api"
import { useDispatch, useSelector } from "react-redux";

function ConfirmCancelPopUp({
  show,
  handleConfirm,
  handleClose,
  title
}) {


  return (<Modal
        show={show ? true : false}
        onHide={handleClose}
        dialogClassName="modal-dialog"
        >
            <div className="modal-content">
    <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">
        {title}
        </h5>
        </div>
        <div className="modal-footer border-0">
        <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}>
        
            Cancel
        </button>
        <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}>
        
            Confirm
        </button>

    </div>
    </div>
        </Modal>)
}

export default ConfirmCancelPopUp;
