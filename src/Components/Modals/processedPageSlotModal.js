import React from 'react';
import Modal from 'react-bootstrap/Modal';
import DocumentUploadModalBody from './documentUploadModalBody';

const ProcessedPageSlotModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            id="fileModal"
            style={{innerWidth:"80%", minWidth:"80%"}}
        >
            <div className='modal-body' style={{ paddingTop:"100px"}}>
                <div class="modal-header text-center height-35 p-0 rounded-0 border-0" style={{ backgroundColor: "#19395f" }}>
                    <h3 class="modal-title mx-auto text-white text-upper height-35">Upload Document to Slot</h3>
                </div>
                <div class="row">

                    <div class="col-md-6 text-center mt-5">

                        <button class="btn btn-primary dropzoneUpload">Upload a Document</button>

                    </div>
                    <div class="col-md-6 DD-Scrollable">
                        <input class="uploaded_doc" id="uploaded_doc" type="hidden" />
                        <table class="table table-borderless table-striped">
                            <thead>
                                <th style={{color:"#000000"}}>Page</th>
                                <th style={{color:"#000000"}}>Document Name</th>

                            </thead>
                            <tbody>
                                {new Array(8).fill(1).map((i, index)=>{
                                    
                                    return(
                                        <tr key={index}>
                                            <td>Treatment</td>
                                            <td></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" id="closemodal" class="btn btn-secondary close-btn" data-dismiss="modal" onClick={()=>props.onHide()}>Cancel</button>
                    <button onclick="attachDocumentPopup('${slot_id}','${panel_id}','${page_id}')" disabled type="submit" class="btn btn-success" id="attach-doc-button" onClick={()=>props.onHide()}>Attach Doc</button>
                </div>
            </div>

        </Modal >
    )
}

export default ProcessedPageSlotModal;