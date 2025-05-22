import React, { useCallback, useEffect, useState, useRef } from "react";
import checkUpload from "../../../public/BP_resources/images/icon/check upload.svg";
import checkSent from "../../../public/BP_resources/images/icon/CHECK SENT.svg";
import checkCleared from "../../../public/BP_resources/images/icon/CHECK CLEARED.svg";
import grayDoc from "../../../public/BP_resources/images/icon/documents-icon-gray.svg";
import colorDoc from "../../../public/BP_resources/images/icon/documents-icon-color.svg";
import { useDropzone } from "react-dropzone";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import { getCaseId, getClientId, getToken, mediaRoute } from "../../Utils/helper";
import axios from "axios";

const ChequeUpload = ({ entity, pageId, updateStates, handleNoCheckShow, documentType, panel, width }) => {
    
    const entityRef = useRef(entity);
    const [isCheckAvailable, setIsCheckAvailable] = useState(panel == "trust_ledger" ? true : false); 

    useEffect(() => {
        if (entity) {
            entityRef.current = entity; 
            setIsCheckAvailable(panel == "trust_ledger" ? true : !!entity?.checkID); 
        }
    }, [entity]);

    const { showDocumentModal } = useDocumentModal();

    const onDropCheckSent = useCallback((acceptedFiles, e) => {
        console.log("UPLOADING FILE...");
        console.log("Accepted Files:", acceptedFiles);

        uploadAndAttachDocument(acceptedFiles, entityRef.current)
            .then(() => console.log("Check data uploaded successfully"))
            .catch((err) => console.error("Error uploading check data:", err));

        e.stopPropagation();
    }, []);

    const { getRootProps: getRootPropsCheckSent, getInputProps: getInputPropsCheckSent } = useDropzone({
        onDrop: onDropCheckSent,
    });

    const handleCheckClick = (e) => {
        e.stopPropagation();

        if (!isCheckAvailable) {
            handleNoCheckShow(); // Show modal only if no check exists
            return;
        }

        // If check exists, allow document upload
        getRootPropsCheckSent().onClick();
    };

    const renderCheckIcon = () => {
        const currentEntity = entityRef.current;

        if (panel === "offer") {
            const condition1 = documentType === "check_as_sent" ? (currentEntity?.checks[0]?.check_sent) : documentType === "check cleared" ? (currentEntity?.checks[0]?.check_cleared) : (currentEntity?.checks[0]?.verify);
            if (!currentEntity?.checks || currentEntity?.checks.length === 0) {
                return (
                    <img src={documentType ==="check_as_sent" ? checkUpload : grayDoc} alt={documentType ==="check_as_sent" ? "check upload" : "check not requested icon"} className="height-i-21 gray-scale-1"
                        onClick={handleCheckClick} />
                );
            } else if (condition1 === null) {
                return (
                    <div {...getRootPropsCheckSent()} className="dropzone-wrapper">
                        <input {...getInputPropsCheckSent()} />
                        <img src={documentType ==="check_as_sent" ? checkUpload : grayDoc} alt={documentType ==="check_as_sent" ? "check upload" : "verify icon"} className="height-i-21 dz-clickable" />
                    </div>
                );
            } else {
                return (
                    <img src={documentType ==="check_as_sent" ? checkSent : colorDoc} alt={documentType ==="check_as_sent" ? "check upload" : "verify icon"} className="height-i-21"
                        onClick={async() => {
                            if(documentType === "check_as_sent"){
                                const data = await getDocumentData(currentEntity?.checks[0]?.check_sent);
                                console.log(data);
                                showDocumentModal("document", mediaRoute(data.upload), data)
                            }
                            else if(documentType === "check cleared"){
                                const data = await getDocumentData(currentEntity?.checkID?.check_cleared);
                                console.log(data);
                                showDocumentModal("document", mediaRoute(data.upload), data)
                            }
                                
                            else{
                                const data = await getDocumentData(currentEntity?.checks[0]?.verify);
                                console.log(data);
                                showDocumentModal("document", mediaRoute(data.upload), data)
                            }
                        }} 
                    />
                );
            }
        } else {
            const condition1 = documentType === "check_as_sent" ? (currentEntity?.checkID?.check_sent) : documentType === "check cleared" ? (currentEntity?.checkID?.check_cleared) : (currentEntity?.checkID?.verify);
            if (panel != "trust_ledger" && !currentEntity?.checkID) {
                return (
                    <img src={(documentType ==="check_as_sent" || documentType ==="check cleared")  ? checkUpload : grayDoc} alt={(documentType ==="check_as_sent" || documentType ==="check cleared") ? "check upload" : "check not requested icon"} className="height-i-21 gray-scale-1"
                        onClick={handleCheckClick} />
                );
            } else if (condition1 === null) {
                return (
                    <div {...getRootPropsCheckSent()} className="dropzone-wrapper">
                        <input {...getInputPropsCheckSent()} />
                        <img src={(documentType ==="check_as_sent" || documentType ==="check cleared") ? checkUpload : grayDoc} alt={(documentType ==="check_as_sent" || documentType ==="check cleared") ? "check upload" : "verify icon"} className="height-i-21 dz-clickable" />
                    </div>
                );
            } else {
                return (
                    
                    <img src={documentType ==="check_as_sent" ? checkSent : documentType ==="check cleared" ? checkCleared : colorDoc} alt={documentType ==="check_as_sent" ? "check sent"  : documentType ==="check cleared" ? "check cleared" : "verified icon"} className="height-i-21"
                        onClick={async() => {
                            if(documentType === "check_as_sent"){
                                const data = await getDocumentData(currentEntity?.checkID?.check_sent);
                                console.log(data);
                                showDocumentModal("document", mediaRoute(data.upload), data)
                            }
                            else if(documentType === "check cleared"){
                                const data = await getDocumentData(currentEntity?.checkID?.check_cleared);
                                console.log(data);
                                showDocumentModal("document", mediaRoute(data.upload), data)
                            }
                                
                            else{
                                const data = await getDocumentData(currentEntity?.checkID?.verify);
                                console.log(data);
                                showDocumentModal("document", mediaRoute(data.upload), data)
                            }
                                
                        }} 
                    />
                );
            }
        }
    };

    async function uploadAndAttachDocument(acceptedFiles, entityData) {
        if (!entityData  || !entityData.checkID) {
            console.error("Entity or checkID is missing", entityData);
            return;
        }

        console.log("Uploading document for Entity:", entityData);
        
        const caseId = getCaseId();
        const clientId = getClientId();
        if (!acceptedFiles.length) return;
        const accessToken = getToken();
        const formData = new FormData();
        formData.append("file0", acceptedFiles[0]);
        formData.append("number_of_files", 1);
        formData.append("client_id", clientId);
        formData.append("case_id", caseId);

        try {
            const origin = process.env.REACT_APP_BACKEND_URL;
            const uploadResponse = await axios.post(`${origin}/api/upload/doc/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: accessToken,
                },
            });

            console.log("File uploaded successfully:", uploadResponse.data);

            const attachData = {
                check_id: panel === "offer" ? entityData?.checks[0]?.id : entityData?.checkID?.id,
                doc_id: uploadResponse.data?.docId || "",
                page_id: pageId || "",
                case_id: caseId || "",
                slot: "",
                document_type: documentType,
            };

            console.log("Attaching document:", attachData);
            
            const attachResponse = await axios.post(`${origin}/api/accounting-page/attach-check-doc/`, attachData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: accessToken,
                },
            });

            console.log("Document attached successfully:", attachResponse.data);

            updateStates();
            setIsCheckAvailable(true); 
            return attachResponse.data;
        } catch (error) {
            console.error("Error in file upload or document attachment:", error);
            throw error;
        }
    }

    async function getDocumentData(id) {
        const accessToken = getToken();
        try {
            const origin = process.env.REACT_APP_BACKEND_URL;
            const res = await axios.get(`${origin}/api/document/${id}/`, {
                headers: {
                    Authorization: accessToken,
                },
            });

            return res.data;
        } catch (error) {
            console.error("Error in fetching document:", error);
            throw error;
        }
    }

    return <div className="d-flex align-items-center justify-content-center" style={{width:width,height:"21px"}}>{renderCheckIcon()}</div>;
};

export default ChequeUpload;
