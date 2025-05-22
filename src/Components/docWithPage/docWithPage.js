import React, { useEffect, useState } from 'react';
import { formatDate } from '../../Utils/helper';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import ProcessedPageSlotModal from '../Modals/processedPageSlotModal';

const DocWithPage = () => {
    const casePageData = useSelector((state) => state.case.caseData);
    const [ fileUploadModal, setFileUploadModal ] = useState(false);
    const [uploadFile, setUploadFile] = useState("");

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => { 
            setUploadFile(files?.map(file => file.name));
            setFileUploadModal(true);
        }
    });
    return (
        <>
        <div className="row documents-wrapper" style={{ overflow: 'hidden', width:"99%", display:"flex", marginLeft:"10px" }}>
            <div className="col-12">
                <div className="row redtd2 icon-text-boxes-wrap flex-row position-relative ml-0 mr-0 m-0">
                    <div className="col p-0">
                        <div className="d-flex justify-content-start w-100">

                            <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                                {
                                    casePageData && casePageData.processed_page_slots && casePageData.processed_page_slots.map((item, index) => {
                                        return (
                                            <>
                                                {
                                                    item.doc ?
                                                        <div className="col-12 col-md-3 col-xl icon-text-box text-center" id="no-vertical-border">
                                                            <p className="date">
                                                                {formatDate(item.doc.created)}
                                                            </p>

                                                            <span className="icon-wrap">
                                                                <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                                                            </span>
                                                            {
                                                                item.page_slot.slot_name ?
                                                                    <p className="name">

                                                                        {item.page_slot.slot_number}. {item.page_slot.slot_name}

                                                                    </p> :
                                                                    <p className="name">{item.page_slot.slot_number}. {item.doc.file_name}</p>
                                                            }

                                                        </div> :
                                                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-{{item.page_slot.id}}-{{page.id}}" id="no-vertical-border" 
                                                        onClick={()=>setFileUploadModal(prev=>!prev)}
                                                        // onclick="uploadPopUp('{{item.page_slot.id}}','','{{page.id}}')"
                                                        >
                                                            <p className="date"></p>
                                                            <span className="icon-wrap">
                                                                <i className="ic ic-35 ic-file-grey cursor-pointer"></i>
                                                            </span>
                                                            {
                                                                item.page_slot.slot_name ?
                                                                    <p className="name text-lg-grey">{item.page_slot.slot_number}. {item.page_slot.slot_name}</p> :
                                                                    <p className="name text-lg-grey">{item.page_slot.slot_number}. Available</p>
                                                            }
                                                        </div>

                                                }

                                            </>
                                        )
                                    })
                                }

                                <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
                                    <div className="upload-icon dropzone-page border-0 rounded-0 bg-transparent">
                                        <div className="d-flex align-items-center">
                                            <span className="font-weight-bold text-gold h5 m-0 pr-2">+</span>
                                            <span className="text-lg-grey">Upload Document to Page</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <ProcessedPageSlotModal uploadFile={uploadFile} uploadProgress={"100%"} id="fileModal" show={fileUploadModal} onHide={() => setFileUploadModal(false)} />
        </>

    )
}

export default DocWithPage;