import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "../../../public/BP_resources/css/notes-section.css";
import api from '../../api/api';
import NotesImportSuccessPopup from "../Modals/notesImportSuccessPopup";

// U2024/31/5/3:19AM
export const NotesImportPopup = ({showImportPopup,handleClose})=>{
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result,setResult] = useState([])
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  
  function successCloseClickHandler(){
    setFile(null);
    setResult([]);
    setSuccess(false);
    handleClose();
  }
  function handleFileChange(event) {
    const fileInput = event.target;
    const selectedFile = fileInput.files[0];
    
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension !== 'csv') {
          alert('Please upload a CSV file.');
          fileInput.value = null; // Reset the input value
          setFile(null); 
        }
      else {
          setFile(selectedFile); 
        } 
    }
  }
  const handleSubmit = async ()=>{
    let field = document.getElementById("csv-field");
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('case_id',currentCase?.id);
    formData.append('client_id',client?.id)
    setFile(null);
    try {
      const response = await api.post(`/api/notes_csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      field.value = null;
      setResult(response?.data?.existing_notes)
      setSuccess(!success);

    } catch (error) {
      console.error('Error uploading file:', error);
      field.value = null;
      alert('Error while uploading file.');
      handleClose();
    }
  }
  return success ?  <NotesImportSuccessPopup showImportPopup={showImportPopup} closeClickHandler={successCloseClickHandler} result={result} /> : (<>
            <div className={`modal generic-popup fade bd-example-modal-md ${showImportPopup ? 'show' : ''}`}  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',zIndex:100000,display: showImportPopup ? 'flex' : 'none', justifyContent:"center",alignItems:"center" }}>
              <div class="modal-dialog" style={{display:"flex",justifyContent:"center"}}>
                <div class="modal-content" >
                  <div class="modal-body">
                    <div class="row align-items-center form-group justify-content-center">
                      <div class="col-md-2 d-flex justify-content-between align-items-center CSV-textWrap mt-1">
                        <label for="uploaded_csv">Upload the file</label>
                      </div>
                      <div class="col-md-10 d-flex justify-content-between align-items-center" >
                        <input type="file" style={{paddingBottom:"33px"}} id="csv-field" onChange={handleFileChange} class="form-control choose-file-csv"/>
                        
                      </div>
                    </div>
                    <div class="modal-footer">
                          <button type="button" class="btn btn-secondary float-left-margin-right-auto" onClick={handleClose} >Cancel</button>
                          <button type="button" onClick={handleSubmit}  class="btn btn-success">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>) 
}
export default NotesImportPopup;