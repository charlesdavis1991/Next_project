import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "../../../public/BP_resources/css/notes-section.css";
import api from '../../api/api';

// U2024/31/5/3:19AM
export const NotesImportSuccessPopup = ({showImportPopup,closeClickHandler,result})=>{
  
  const renderTableRows = () => {
    return result.map((item, index) => {
      return (
        <tr key={index} >
          <td className="td-autosize">{item.created_at}</td>
          <td className="td-autosize">{item.description}</td>
        </tr>
      );
    });
  };


  return <>
      <div className={`modal generic-popup fade bd-example-modal-lg ${showImportPopup ? 'show' : ''}`}  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',zIndex:100000,display: showImportPopup ? 'flex' : 'none', justifyContent:"center",alignItems:"center" }}>
        <div style={{background:"white",width:"60%"}}>
        
          <div className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center" >
            <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
              File Uploaded Successfully!
            </h5>
          </div>
          { result.length===0 ?<div></div> : 
          <div className="modal-body" style={{maxWidth:'100%',maxHeight:'600px',overflow:'scroll'}}>
              <h5>
              These notes already exist.
              </h5>
            <table className="table table-hover table-borderless table-striped table-earning">
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {renderTableRows()}
              </tbody>
            </table>
          </div>}
          <div className="modal-footer border-0 justify-content-between pt-0">
            <button type="button" onClick={closeClickHandler} className="btn btn-secondary doc-pop-margin-0-auto-0-auto" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
    </div>
  </>
}
export default NotesImportSuccessPopup;