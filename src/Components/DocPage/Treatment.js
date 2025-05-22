import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useDocumentModal } from "../../Components/DocumentModal/DocumentModalContext";
import { mediaRoute, getClientId, getCaseId } from "../../Utils/helper";
import UploadDocModal from '../../Components/DocumentRow/UploadDocModal';
import TableLoader from '../Loaders/tableLoader';
import api from '../../api/api';
import ButtonLoader from '../Loaders/ButtonLoader';
import DocumentUploadModal from '../Modals/documentUploadModal';

const Treatment = ({ data, loading, refetchData, refetchLoading }) => {
    const { showDocumentModal } = useDocumentModal();
    const origin = process.env.REACT_APP_BACKEND_URL;
    const currentCase = getCaseId();
    const client = getClientId();
    const [showDocModal, setShowDocModal] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [selectedPanelId, setSelectedPanelId] = useState(null);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [uploadingSlot, setUploadingSlot] = useState({ slotId: null, panelId: null });
    const [isDragging, setIsDragging] = useState(false);

    // State for handling modal and upload progress
    const [fileUploadModal, setFileUploadModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFile, setUploadFile] = useState("");
    const handleUploadPopup = (slotId, panelId, pageId) => {
        setSelectedSlotId(slotId);
        setSelectedPanelId(panelId);
        setSelectedPageId(pageId);
        setShowDocModal(true);
    };

    const handleDocPreview = (doc) => {
        axios.get(`${origin}/api/attorney-staff/${doc.attached_by.id}/profile-image/`)
            .then(response => {
                doc.attached_by.profile_pic_29p = mediaRoute(response.data.profile_image);
            })
            .catch(error => {
                console.error(`Error fetching profile image: ${error}`);
            });
        showDocumentModal(
            mediaRoute(doc.upload), doc
        );
    };

    const handleClose = () => {
        setShowDocModal(false);
        setSelectedSlotId(null);
        setSelectedPanelId(null);
        setSelectedPageId(null);
    };

    const addDocumentHandler = () => {
        setShowDocModal(false);
        setSelectedSlotId(null);
        setSelectedPanelId(null);
        setSelectedPageId(null);
    };
    const simulateProgress = (setUploadProgress) => {
        let progress = 0;

        const intervalId = setInterval(() => {
            progress += 1;
            setUploadProgress(progress);

            // Stop once we reach 100%
            if (progress >= 100) {
                clearInterval(intervalId);
            }
        }, 300); // 300ms delay between increments
    };
    const handleDrop = async (e, slot_id, pageId, panel_id) => {
        e.preventDefault();
        setFileUploadModal(true);
        simulateProgress(setUploadProgress); // Simulate gradual progress
        // setUploadingSlot({ slotId: slot_id, panelId: panel_id });
        const files = e.dataTransfer.files;
        const fileSizeInMB = files[0].size / (1024 * 1024);
        setUploadFile(files[0].name);
        const formData = new FormData();
        formData.append('file', files[0]);

        try {
            const response = await api.post(
                `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const docId = response?.data?.docId;
            await api.post("api/doc/attach/treatment/", {
                panel_id: panel_id,
                slot: slot_id,
                page_id: pageId,
                case_id: getCaseId(),
                panels: true,
                doc_id: docId,
                file_size: fileSizeInMB,
            });
            await refetchData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsDragging(false);
            setFileUploadModal(false);

        }
    };
    const [isDragginguploadingbutton, setIsDragginguploadingbutton] = useState(false)
    const [uploadbuttonLoadingid, setuploadbuttonLoadingid] = useState(null)

    const handleDropwithOutpanlesWithoutslots = async (e, panel, pageId, panelId) => {
        e.preventDefault();
        if (panel) {
            setFileUploadModal(true);
            simulateProgress(setUploadProgress); // Simulate gradual progress
            setuploadbuttonLoadingid(panelId)

            const files = e.dataTransfer.files;
            const fileSizeInMB = files[0].size / (1024 * 1024);
            setUploadFile(files[0].name);
            const formData = new FormData();
            formData.append('file', files[0]);

            try {
                const response = await api.post(
                    `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                const docId = response?.data?.docId;
                await api.post("api/doc/attach/treatment/", {
                    page_id: pageId,
                    case_id: getCaseId(),
                    doc_id: docId,
                    file_size: fileSizeInMB,
                });
                await refetchData();
            } catch (error) {

                console.log(error);
            } finally {
                setIsDragginguploadingbutton(false);
                setuploadbuttonLoadingid(null)
                setFileUploadModal(false);

            }
        }
        else {
            setFileUploadModal(true);
            simulateProgress(setUploadProgress); // Simulate gradual progress
            const files = e.dataTransfer.files;
            const fileSizeInMB = files[0].size / (1024 * 1024);
            const formData = new FormData();
            formData.append('file', files[0]);

            try {
                const response = await api.post(
                    `/api/upload_doc/${getClientId()}/${getCaseId()}/`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                const docId = response?.data?.docId;
                await api.post("api/doc/attach/treatment/", {
                    page_id: pageId,
                    case_id: getCaseId(),
                    doc_id: docId,
                    file_size: fileSizeInMB,
                });
                await refetchData();
            } catch (error) {
                console.error('Failed to handle drop:', error);


                console.log(error);
            } finally {
                setIsDragginguploadingbutton(false);
                setFileUploadModal(false);
            }
        }

    };

    const handleUploadPopupwithoutSlots = (pageId) => {
        setSelectedPageId(pageId);
        setShowDocModal(true); // Show the Doc modal
    };
    const isSlotUploading = (slotId, panelId) => {
        return uploadingSlot?.slotId === slotId && uploadingSlot?.panelId === panelId; // Added parentheses for clarity

    };
    const unAttachedDocuments = () => {
        return data?.data?.filter(document => document.document_slot === null) || [];
    }
    if (loading) {
        return <><TableLoader /></>; // Centered loading indicator
    }

    if (!data) {
        return <div>No Data</div>; // Centered loading indicator
    }

    return (
        <div>
            <div className='row no-gutters has-title-bg m-b-5 flex-nowrap'>
                <div className="panel-icon">
                    <img src={mediaRoute(data?.page?.page_icon)} height={25} width={25} />
                </div>
                <div className="top-header height-25 d-flex">
                    <div className="top-head d-flex align-items-center h-100">
                        <div className="d-flex align-items-center m-l-5" style={{ textDecoration: "none", fontStyle: "normal", fontWeight: "600", fontSize: "14px" }}>
                            {data?.page?.name}
                        </div>
                    </div>
                </div>
            </div>
            {data?.panels?.map((item) => (
                <div key={item.id} className=" m-b-5 m-t-5" >
                    <div className="document-panel-wrapper m-b-0">
                        <h5 className="text-dark-grey font-weight-bold">
                            <span className="ml-7 mr-2 text-uppercase">{item?.specialty?.name}</span>
                            {item?.panel_name}
                        </h5>
                        <div className="tbdocument redtd2 flex-row m-0">
                            <div className="col Doc-display-justify-content-background-color-transparent p-0">
                                <div className="icon-text-boxes d-flex flex-wrap w-100 e-template-row  m-t-5" style={{ marginRight: "10px", height: "auto" }}>
                                    {data?.page_slots?.slice(0, 9).map((slot) => {
                                        const attachedDocs = item?.documents?.filter(doc => doc?.document_slot?.id === slot?.id);
                                        return (
                                            <React.Fragment key={slot.id}>
                                                {attachedDocs?.length > 0 ? (
                                                    attachedDocs.map(doc => (
                                                        <div className="col-12 col-md-6 col-xl-3 icon-text-box text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer" id="no-vertical-border" onClick={() => handleDocPreview(doc)} key={doc.id}>
                                                            <p className="date">{new Date(doc.created).toLocaleDateString()}</p>
                                                            <span className="icon-wrap">
                                                                <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                                                            </span>
                                                            <p className="name">{slot?.slot_number}. {doc.file_name || slot.slot_name}</p>
                                                        </div>
                                                    ))
                                                ) : slot?.slot_number !== 0 && (
                                                    <div
                                                        onDrop={(e) => handleDrop(e, slot.id, data?.page?.id, item?.id)}
                                                        className={`col-12 col-md-3 col-xl icon-text-box text-center dropzone-${slot.id}-${item.id}-${data.page.id} height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer`}
                                                        id="no-vertical-border"
                                                        onClick={() => handleUploadPopup(slot?.id, item?.id, data?.page?.id)}
                                                    >
                                                        {isSlotUploading(slot?.id, item?.id) && (isDragging || refetchLoading) ? ( // Corrected condition
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <ButtonLoader />
                                                                <span style={{ marginLeft: "5px" }}>Uploading</span>
                                                            </div>
                                                        ) : ( // Unchanged code
                                                            <>
                                                                <span className="icon-wrap">
                                                                    <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                                                                </span>
                                                                {slot.slot_name ? (
                                                                    <p className="name text-lg-grey">
                                                                        {slot?.slot_number}. {slot?.slot_name}
                                                                    </p>
                                                                ) : (
                                                                    <p className="name text-lg-grey">
                                                                        {slot?.slot_number}. Available
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}  <div
                                        className="col-12 d-flex m-b-5 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                                        onDrop={(event) => handleDropwithOutpanlesWithoutslots(event, true, data?.page?.id, item?.id)}
                                        onClick={() => handleUploadPopupwithoutSlots(data?.page?.id)}
                                    >
                                        <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{data.page.id}-{clientProvider.id}">
                                            <div className="d-flex align-items-center width-inherit justify-content-center">
                                                {isDragginguploadingbutton && item?.id === uploadbuttonLoadingid ? (
                                                    <>
                                                        <ButtonLoader />
                                                        <span style={{ marginLeft: "5px" }}>Uploading..</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="font-weight-bold text-gold h5 m-0 pr-2">+</span>
                                                        <span className="text-lg-grey name">Upload Document to Page up </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {(data?.panels === null || data?.panels?.length === 0) && data?.page_slots?.length > 0 ? (
                <div
                    className="col-12 d-flex m-b-5 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                    onDrop={(event) => handleDropwithOutpanlesWithoutslots(event, false, data?.page?.id, null)}
                    onClick={() => handleUploadPopupwithoutSlots(data?.page?.id)}
                >
                    <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{data.page.id}-{clientProvider.id}">
                        <div className="d-flex align-items-center width-inherit justify-content-center">
                            {isDragginguploadingbutton ? (
                                <>
                                    <ButtonLoader />
                                    <span style={{ marginLeft: "5px" }}>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-weight-bold text-gold h5 m-0 pr-2">+</span>
                                    <span className="text-lg-grey name">Upload Document to Page below</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : ''}
            {unAttachedDocuments().length > 0 &&
                // <> <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
                //     <div className='col-auto p-0 text-white' style={{ marginLeft: "34px", fontWeight: "600", fontSize: "14px" }} >&#160;
                //     </div>
                // </div>

                <div className="icon-text-boxes d-flex flex-wrap w-100 e-template-row m-t-5 m-b-5" style={{ marginRight: "10px", justifyContent: "end", paddingRight: "10px", height: "ato" }}>
                    {unAttachedDocuments().map((document) => (
                        <div
                            className="col-12 col-md-3 col-xl icon-text-box-custom m-b-5 text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer"
                            id="no-vertical-border"
                            onClick={() => handleDocPreview(document)}
                            key={document.id}

                        >
                            <span className="icon-wrap">
                                <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                            </span>
                            <p className="name">
                                {document?.file_name.length > 20
                                    ? `${document.file_name.slice(0, 20)}...`
                                    : document.file_name}
                            </p>
                        </div>
                    ))}
                </div>
                // </>
            }
            <UploadDocModal
                show={showDocModal}
                handleClose={handleClose}
                slot_id={selectedSlotId}
                panel_id={selectedPanelId}
                page_id={selectedPageId}
                caseId={currentCase}
                clientId={client}
                handleDocumentUpload={addDocumentHandler}
                refetchLoading={refetchLoading}
                isDocumentTab={false}
                refetchData={refetchData}
            />
            <DocumentUploadModal
                uploadFile={uploadFile}
                uploadProgress={uploadProgress}
                show={fileUploadModal}
                onHide={() => setFileUploadModal(false)}
            />
        </div>
    );
};

export default Treatment;
