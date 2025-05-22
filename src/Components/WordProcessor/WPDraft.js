import React, {
    useState,
    useEffect,
    useRef,
    useCallback,

} from "react";
import './wordprocessor.css'
import { getLoggedInUserId } from "../../Utils/helper";

import api, { api_without_cancellation } from "../../api/api";
import WPBase from "./WPBase";



function WPDraft({
    docId,
    updatedDocId,
    dynamicTemplateId,
    dispatch,
    state,
    draftId,
    fetchEditDocs
}) {

    const origin = process.env.REACT_APP_BACKEND_URL
        

    const container = useRef(null);
    const userId = getLoggedInUserId();

    const [docName, setDocName] = useState(null);
    const [pageId, setPageId] = useState(null);
    const [dropdownId, setDropdownId] = useState(null);
    const [draftName, setDraftName] = useState("");



      
      const createEditDoc = async (docId,url) => {
        try {
    
            // Check if docId is present in the currentUrl
                const formData = new FormData();
                formData.append("doc_id", docId);
                formData.append("url", url);
    
                const response = await api_without_cancellation.post(`${origin}/api/create-edit-doc/`, formData);
                if (response.success) {
                    console.log(response);
                }
    
                // Proceed with additional logic if needed
            
    
            
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

 

    const deleteEditDoc = async () => {
        try {

            const formData = new FormData();
            formData.append("doc_id", docId);

            const response = await api_without_cancellation.post(`${origin}/api/delete-edit-doc/`, formData);
            if (response.status == 200) {
                if(response.data.success){
                    fetchEditDocs()
                }
               
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }

    }

    




    const saveDraft = async () => {
        try {
            console.log("docName",docName)
            console.log("tempName",state.tempName)

            const content =
                await container.current?.documentEditor.saveAsBlob("Docx");

            if (!content) {
                console.error("Error: Document content is undefined or invalid.");
                return;
            }

            const formData = new FormData();
            formData.append("file", content);
            formData.append("id", docId);
            formData.append("user_id", userId);
            formData.append("dynamic_template_id", dynamicTemplateId);
            formData.append("file_name", docName);
            formData.append("draft_id", draftId);

            const response = await api_without_cancellation.post(
                `${origin}/api/updateDraftDoc/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Save Response:", response);

            if (response.status == 200) {
                deleteEditDoc();
            }
           

        } catch (error) {
            console.error("Error saving document:", error);
        }

        dispatch({
            type: "SHOW_MODAL",
            payload: `${state.tempName} Draft saved successfully!`,
        });
    }
    

    const downloadDocument = async () => {
        try {


            const content =
                await container.current?.documentEditor.saveAsBlob("Docx");
            console.log(content);
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

            // const formData = new FormData();
            // formData.append("file", content);
            // formData.append("id", docId);
            // formData.append("user_id", userId);
            // formData.append("dynamic_template_id", dynamicTemplateId);
            // formData.append("file_name", docName);
            // formData.append("draft_id", draftId);

            // const response = await api_without_cancellation.post(
            //     `${origin}/api/updateDraftDoc/`,
            //     formData,
            //     {
            //         headers: {
            //             'Content-Type': 'multipart/form-data'
            //         }
            //     }
            // );


            // if (response.status == 200) {
            //     console.log("Save Response:", response.data);

            //     if (response.data?.draft_id) {
            //         dispatch({ type: "SET_DRAFT_ID", payload: response.draft_id });
            //     }
               

            // }

            
        } catch (error) {
            console.error("Error saving document:", error);
        }
    }


    const printDoc = async() => {
        const content =
                await container.current?.documentEditor.saveAsBlob("Docx");
        const renamedFile = new File([content], `${docName}.docx`, { type: content.type });

        const formData = new FormData();
        formData.append("file", renamedFile);
        try {
            const response = await api.post(
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


    const pdfToCaseFile = async() => {
        const content =
                await container.current?.documentEditor.saveAsBlob("Docx");
        const renamedFile = new File([content], `${docName}.docx`, { type: content.type });

        const formData = new FormData();
        formData.append("file", renamedFile);
        formData.append("case_id", getCaseId());
        formData.append("client_id", getClientId());
        formData.append("page_id", pageId);

        try {
            const response = await api.post(
              `${origin}/api/documents/pdf-to-casefile/`,
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
                
                dispatch({
                    type: "SHOW_MODAL",
                    payload: `Pdf Attached To Case Successfully`,
                });
            }
          } catch (error) {
            console.error("Error printing document:", error);
          }
    }




    const controls = (
        <>
        <div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={saveDraft}
                    >
                        Save
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={pdfToCaseFile}
                    >
                        PDF to Case File
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary font-weight-bold ml-auto m-b-5 w-100"
                        onClick={deleteEditDoc}
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
                    >
                        Email To Client
                    </button>
            </div>
        
        </>
    )

    
    

    return (
      <>

            <WPBase 
            docId={docId} 
            updatedDocId = {updatedDocId} 
            dynamicTemplateId={dynamicTemplateId}
            setPageId = {setPageId}
            setDropdownId = {setDropdownId}
            setDocName= {setDocName}
            state={state}
            dispatch = {dispatch}
            container = {container}
            controls={controls}
            type="Draft"

            />


                </>
                );
  }

export default WPDraft;
