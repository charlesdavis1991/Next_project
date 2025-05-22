import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { useDocumentModal } from "../DocumentModal/DocumentModalContext";
import { mediaRoute } from "../../Utils/helper";

// --- Doc Row ----- M202405210303

const ReportsDocRow = ({ instance, page  }) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
    const { showDocumentModal } = useDocumentModal();
    const handleDocPreview = (doc) => {
        console.log(`Previewing document with ID: ${doc.id}`);
        showDocumentModal(
            mediaRoute(doc.upload),
            doc
        )
    };

    const handleUploadPopup = (pageSlotId, clientId, pageId) => {
        // Implement upload popup logic
        console.log(`Opening upload popup for page slot ID: ${pageSlotId}, client ID: ${clientId}, page ID: ${pageId}`);
    };
    const [processedPageSlots, setprocessedPageSlots] = useState([]);
    const fetchprocessedPageSlots = async () => {
        try {
          const  response  = await axios.get(origin + '/api/get-reports-processed-page-slots/'+instance.id+'/'+page+'/');
          
          const slicedData = response.data.length > 0 ? response.data.slice(0, 8) : [];
          setprocessedPageSlots(slicedData);
        } catch (error) {
          console.log('Failed to fetch tabsPage:', error);
        }
      };
      useEffect(() => {
        fetchprocessedPageSlots();
      }, []);
      
    //   console.log('processedPageSlots', processedPageSlots[0], instance.id);
  return (
    <div className="row no-gutters flex-row position-relative p-r-15 p-md-r-0">
            <div className="col p-0">
                <div className="d-md-flex justify-content-start w-100">
                    <div className="icon-text-boxes d-flex flex-wrap w-100 e-template-row ">
                        {processedPageSlots.map((processedPageSlot, index) => (
                                <React.Fragment key={index}>
                                    {processedPageSlot.doc? (
                                        <div className="col-12 col-md-3 height-35 col-xl icon-text-box text-center" id="no-vertical-border" onClick={() => handleDocPreview(processedPageSlot.doc)}>
                                            <p className="date">{processedPageSlot.doc.created}</p>
                                            <span className="icon-wrap">
                                            <i className="ic ic-19 ic-generate-document m-r-5 cursor-pointer"></i>
                                            </span>
                                            {processedPageSlot.page_slot.slot_name? (
                                                <p className="name">{processedPageSlot.page_slot.slot_number}. {processedPageSlot.page_slot.slot_name}</p>
                                            ) : (
                                                <p className="name">{processedPageSlot.page_slot.slot_number}. {processedPageSlot.doc.file_name}</p>
                                            )}
                                        </div>
                                    ) : (
                                        (processedPageSlot.page_slot.slot_number === 2 || processedPageSlot.page_slot.slot_number === 3 || processedPageSlot.page_slot.slot_number === 4)? (
                                            <div className="col-12 col-md-3 col-xl icon-text-box text-center" id="no-vertical-border">
                                                <span className="icon-wrap">
                                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                                                </span>
                                                {processedPageSlot.page_slot.slot_name? (
                                                    <p className="name text-lg-grey">{processedPageSlot.page_slot.slot_number}. {processedPageSlot.page_slot.slot_name}</p>
                                                ) : (
                                                    <p className="name text-lg-grey">{processedPageSlot.page_slot.slot_number}. Available</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-{processedPageSlot.page_slot.id}-{instance.id}-{page2.id}" id="no-vertical-border" onClick={() => handleUploadPopup(processedPageSlot.page_slot.id, instance.id, page2.id)}>
                                                <span className="icon-wrap">
                                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                                                </span>
                                                {processedPageSlot.page_slot.slot_name? (
                                                    <p className="name text-lg-grey">{processedPageSlot.page_slot.slot_number}. {processedPageSlot.page_slot.slot_name}</p>
                                                ) : (
                                                    <p className="name text-lg-grey">{processedPageSlot.page_slot.slot_number}. Available</p>
                                                )}
                                            </div>
                                        )
                                    )}
                                </React.Fragment>
                            
                        ))}
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
                            <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{page2.id}-{instance.id}">
                                <div className="d-flex align-items-center width-inherit">
                                    <span className="font-weight-bold text-gold h5 m-0 pr-2">+</span>
                                    <span className="text-lg-grey name">Upload Document to Page</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default ReportsDocRow
