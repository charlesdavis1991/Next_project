import React, {
    useState,
    useRef,
    useEffect

} from "react";
import './wordprocessor.css'
import { getLoggedInUserId, getCaseId, getClientId } from "../../Utils/helper";

import api, { api_without_cancellation } from "../../api/api";
import WPBase from "./WPBase";
import WPCourtFormBase from "./WPCourtFormBase";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import SendEmailPopUp from "./SendEmailPopUp";
import ButtonLoader from "../Loaders/ButtonLoader";


function WPCourtForm({
    docId,
    updatedDocId,
    courtFormId,
    dispatch,
    state,
    fetchEditDocs,
    type,
    litigationId
}) {

    const origin = process.env.REACT_APP_BACKEND_URL
    
    const container = useRef(null);
    const userId = getLoggedInUserId();

    const [docName, setDocName] = useState(null);
    const [pageId, setPageId] = useState(null);
   

    const [emailPopUp, setEmailPopUp] = useState(false);

    const [saveLoading, setSaveLoading] = useState(false);



    


    const fetchClientPage = async () => {
        try {
          const response = await api.get(
            `${origin}/api/client-page/client/${getClientId()}/case/${getCaseId()}/`,
        
          );
    
          if (response.status == 200) {
            setClientData(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch client data:", error);
        }
      };

    useEffect(() => {
        fetchClientPage();
      
      }, []);



      
      

    const deleteEditDoc = async () => {
        try {

            const formData = new FormData();
            formData.append("doc_id", docId);

            const response = await api_without_cancellation.post(`${origin}/api/delete-edit-doc/`, formData);
            if (response.status == 200) {
                if(response.data.success){
                    fetchEditDocs();
                   
                }
               
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }

    }


    const deleteEditDocWithPopUp = async () => {
        try {
            await deleteEditDoc();
            dispatch({
                type: "SHOW_MODAL",
                payload: `${docName} closed successfully!`,
            });

        } catch (error) {
            console.error("An error occurred:", error);
        }

    }

    


  

    const saveDraft = async () => {
        try {
           

            const content =
                await container.current?.documentEditor.saveAsBlob("Docx");

           

        } catch (error) {
            console.error("Error saving document:", error);
        }

            dispatch({
                type: "SHOW_MODAL",
                payload: `Doc Updated successfully!`,
            });

       
        }

       


    
    

    const downloadDocument = async () => {
        try {
            const content = await container.current?.documentEditor.saveAsBlob("Docx");
            
            if (!content) {
                console.error("Error: Document content is undefined or invalid.");
                return;
            }
    
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `${docName}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            console.log("Document downloaded successfully.");
    
        } catch (error) {
            console.error("Error downloading document:", error);
        }
    }


    const printDoc = async() => {
        const content =
                await container.current?.documentEditor.saveAsBlob("Docx");
        const renamedFile = new File([content], `${docName}.docx`, { type: content.type });

        const formData = new FormData();
        formData.append("file", renamedFile);
        try {
            const response = await api_without_cancellation.post(
              `${origin}/api/documents/word-to-pdf/`,
              formData,
              {
                headers: {
                'Content-Type': 'multipart/form-data'
        },
              }
            );
            const { data } = response.data;
            const pdfBlob = new Blob(
              [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
              { type: "application/pdf" }
            );
            const url = URL.createObjectURL(pdfBlob);
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = () => {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
              iframe.addEventListener("afterprint", () => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(url);
              });
            };
          } catch (error) {
            console.error("Error printing document:", error);
          }
    }

    const attachPdfToCaseFile = async() => {
        setSaveLoading(true)
        const content =
        await container.current?.documentEditor.saveAsBlob("Docx");
const renamedFile = new File([content], `${docName}.docx`, { type: content.type });

const formData = new FormData();
formData.append("file", renamedFile);
formData.append("case_id", getCaseId());
formData.append("client_id", getClientId());
formData.append("panel_id", litigationId);


try {
    const response = await api.post(
      `${origin}/api/documents/pdf-to-casefile-litigation/`,
      formData,
      {
        headers: {
        'Content-Type': 'multipart/form-data'
},
      }
    );
    if(response.status == 200){
        const { data, filename } = response.data;
        const pdfBlob = new Blob(
          [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
          { type: "application/pdf" }
        );
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await deleteEditDoc();
       
    }
  } catch (error) {
    console.error("Error printing document:", error);
  } 
  finally{
    setSaveLoading(false)

  }

    }
    const pdfToCaseFile = async() => {
        try {
            await attachPdfToCaseFile()
            dispatch({
                type: "SHOW_MODAL",
                payload: `${docName} Attached To Case Successfully`,
            });
          } catch (error) {
            console.error("Error printing document:", error);
          }
    }

    const sendEmail = () =>{
        setEmailPopUp(true)
    }




    const controls = (
        <>
        <div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={pdfToCaseFile}
                    >
                        {
                            saveLoading ? (
                                <ButtonLoader />
                            ):(
                                type === "GenerateDocument" ? "Save As Draft":"Save"
                            )
                        }
                    </button>
                </div>
            </div>
            {/* <div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={pdfToCaseFile}
                    >
                        PDF to Case File
                    </button>
                </div>
            </div> */}
            <div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={deleteEditDocWithPopUp}
                    >
                       Close
                    </button>
                </div>
            </div>
            
            <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={printDoc}
                    >
                        Print
                    </button>
            </div>
            <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={downloadDocument}
                    >
                        Download
                    </button>
            </div>
            <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={sendEmail}
                    >
                        Email To Client
                    </button>
            </div>
        
        </>
    )

    const handleCloseEmailPopUp = () => {
        setEmailPopUp(false)
    }


    

    
    

    return (
      <>


            
            <WPCourtFormBase 
            docId={docId}
            updatedDocId = {updatedDocId} 
            courtFormId = {courtFormId}
            setDocName= {setDocName}
            state={state}
            dispatch = {dispatch}
            container = {container}
            controls={controls}
            type="CourtForm"
            />

            <SendEmailPopUp
            
            emailPopUp = {emailPopUp}
            handleCloseEmailPopUp = {handleCloseEmailPopUp}
            attachPdfToCaseFile = {attachPdfToCaseFile}
            container = {container}
            docName = {docName}
            />

                </>
                );
  }

export default WPCourtForm;
