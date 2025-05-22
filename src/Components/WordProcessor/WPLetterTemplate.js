import React, {
    useState,
    useRef,

} from "react";
import './wordprocessor.css'
import { getLoggedInUserId, getCaseId,getClientId } from "../../Utils/helper";

import api, { api_without_cancellation } from "../../api/api";
import WPBase from "./WPBase";



function WPLetterTemplate({
    docId,
    updatedDocId,
    dynamicTemplateId,
    dispatch,
    state,
    fetchEditDocs
}) {

    const origin = process.env.REACT_APP_BACKEND_URL
        

    const container = useRef(null);
    const userId = getLoggedInUserId();

    const [docName, setDocName] = useState(null);
    const [pageId, setPageId] = useState(null);
    const [dropdownId, setDropdownId] = useState(null);

    const tokenBearer = localStorage.getItem("token");

    




   

      const copyTemplate = async () => {
        try {
          const content = await container.current.documentEditor.saveAsBlob("Docx");
          const renamedFile = new File([content], `${docName}.docx`, { type: content.type });
    
    
          const payload = {
            template_id: dynamicTemplateId,
            temp_name: `${state.updatedFileName}`,
            dropdown: dropdownId,
            page: pageId,
            file: renamedFile
          };
          const response = await api_without_cancellation.post(
            `/api/firmsetting-page/copy-dl-template/`,
            payload,
            {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }
          );
          if (response.status == 200){
            const doc_id = response.data?.for_template?.template.id
            const dynamic_template_id = response.data?.id
            let redirect_url = `/bp-wordprocessor/3/4/?docId=${doc_id}&dynamic_template_id=${dynamic_template_id}&type=LetterTemplate`;
            await deleteEditDoc(dynamicTemplateId);
            createEditDoc(doc_id,redirect_url,state.updatedFileName,dynamic_template_id);
            window.location.href = redirect_url;
          }
        } catch (error) {
          console.error(error);
    
        } 
      };
      const createEditDoc = async (docId,url,name,dynamic_template_id) => {
        try {
                const  currentUrl = window.location.href;
            // Check if docId is present in the currentUrl
                const formData = new FormData();
                formData.append("doc_id", docId);
                formData.append("url", url);
                formData.append("redirect_url", currentUrl);
                formData.append("name", name);
                formData.append("template_id", dynamic_template_id);

    
                const response = await api_without_cancellation.post(`${origin}/api/create-edit-doc/`, formData);
                if (response.success) {
                    console.log(response);
                }
    
                // Proceed with additional logic if needed
            
    
            
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const deleteEditDoc = async (dynamic_template_id) => {
        try {

            const formData = new FormData();
            formData.append("doc_id", docId);
            formData.append("template_id", dynamic_template_id);
            

            const response = await api_without_cancellation.post(`${origin}/api/delete-edit-doc/`, formData);
            if (response.status == 200) {
                if(response.data.success){
                    console.log("deleted success... fetchign edit")
                    fetchEditDocs()
                }
            }

        } catch (error) {
            console.error("An error occurred:", error);
        }

    }

    


 


    const saveDocument = async () => {
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

            if (state.draftId) formData.append("draft_id", state.draftId);

            const response = await api_without_cancellation.post(
                `${origin}/api/updateWordProcessorDoc/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Save Response:", response);

            if (response.status == 200) {
                deleteEditDoc(dynamicTemplateId);
                

            }
           

        } catch (error) {
            console.error("Error saving document:", error);
        }

        dispatch({
            type: "SHOW_MODAL",
            payload: `${state.tempName} saved successfully!`,
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

            // const formData = new FormData();
            // formData.append("file", content);
            // formData.append("id", docId);
            // formData.append("user_id", userId);
            // formData.append("dynamic_template_id", dynamicTemplateId);
            // formData.append("file_name", docName);

            // if (state.draftId) formData.append("draft_id", state.draftId);

            // const response = await api_without_cancellation.post(
            //     `${origin}/api/updateWordProcessorDoc/`,
            //     formData,
            //     {
            //         headers: {
            //             'Content-Type': 'multipart/form-data'
            //         }
            //     }
            // );


            // if (response.status == 200) {
            //     console.log("Save Response:", response.data);


              

            // }

            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `${docName}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            
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
                        onClick={saveDocument}
                    >
                        Save
                    </button>
                </div>
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
            <div>
                <input
                    type="text"
                    className="form-control col"
                    value={state.updatedFileName}
                    onChange={(e) =>
                        dispatch({
                            type: "SET_UPDATED_FILENAME",
                            payload: e.target.value,
                        })
                    }
                />
            </div>
            <div className="d-flex">
                <button
                    type="button"
                    className="btn btn-primary font-weight-bold ml-auto m-t-5 m-b-5"
                    onClick={copyTemplate}
                >
                    Save Copy
                </button>
            </div>
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
            type="LetterTemplate"

            />


                </>
                );
  }

export default WPLetterTemplate;
