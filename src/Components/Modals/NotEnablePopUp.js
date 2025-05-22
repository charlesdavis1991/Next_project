import { selectClasses } from "@mui/material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { getCaseId } from "../../Utils/helper";
import api from "../../api/api"
import { useDispatch, useSelector } from "react-redux";

function NotEnablePopUp({
  confirmPopUp,
  handleClose,
  title
}) {


  return (<Modal
        show={confirmPopUp ? true : false}
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
            className="btn btn-secondary mx-auto"
            onClick={handleClose}>
        
            Cancel
        </button>

    </div>
    </div>
        </Modal>)
}

export default NotEnablePopUp;
