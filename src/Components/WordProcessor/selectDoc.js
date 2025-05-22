import React, {
    useState,
    useEffect,

} from "react";
import './wordprocessor.css'
import { getLoggedInUserId, getCaseId, getClientId } from "../../Utils/helper";

import api, { api_without_cancellation } from "../../api/api";
import Button from "react-bootstrap/Button";

import { useSearchParams } from "react-router-dom";

import Modal from "react-bootstrap/Modal";


function SelectDoc({
    dynamicTemplateId,
    redirectUrl
}) {

    const origin = process.env.REACT_APP_BACKEND_URL
    const [searchParams] = useSearchParams();


    const entity = searchParams.get("entity");
    const entityId = searchParams.get("entity_id");

    const userId = getLoggedInUserId();
    const [data, setData] = useState([]);
    const [templateData, setTemplateData] = useState({});
    const [disableBtn, setDisableBtn] = useState(false);

    
    const redirectBack = async () => {
        window.location.href = redirectUrl;
        
        
    };

      
      const getEditData  = async () => {
        try {
    
            
                const response = await api_without_cancellation.get(`${origin}/api/get-edit-doc/?template_id=${dynamicTemplateId}`);
                if (response.status == 200) {
        
                    setData(response.data)
                    console.log("edit data",response.data)
                    const hasNonMatchingUserId = response.data.some(item => item.user.id === userId && item.for_template.id === dynamicTemplateId && item.url.includes("GenerateDocument") );
                    if (hasNonMatchingUserId) {
                        setDisableBtn(true)
                    } else {
                        setDisableBtn(false)

                    }
                }
    
                // Proceed with additional logic if needed
            
    
            
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        getEditData();
        getTemplateData();
    }, []);

    const createEditDoc = async (docId,url,name,redirect_url,dynamic_template_id) => {
        try {
    
              const formData = new FormData();
              formData.append("doc_id", docId);
              formData.append("url", url);
              formData.append("redirect_url", redirect_url);
              formData.append("name", name);
              formData.append("template_id", dynamic_template_id);

    
                const response = await api_without_cancellation.post(`${origin}/api/create-edit-doc/`, formData);
                if (response.status == 200) {
                    console.log(response);
                }
    
                // Proceed with additional logic if needed
            
    
            
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const openDoc = async (docId,url,name,redirect_url,updatedDocId,template_id) => {
        try {
            
            const new_url = `${url}${updatedDocId? `&updatedDocId=${updatedDocId}`:''}`
            await createEditDoc(docId,new_url,name,redirect_url,template_id)
            window.location.href = new_url

    
            
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const createWPUrl =  (url) => {
        const encodedRedirectUrl = encodeURIComponent(redirectUrl || ""); // Encode redirect_url
        return `${url}&redirect_url=${encodedRedirectUrl}`;
    
      };


      const getTemplateData = async (options) => {
        try {
            const response = await api_without_cancellation.get(
                `/api/firmsetting-page/edit-dl-template/`,
                {
                    params: {
                        template_id: dynamicTemplateId,
                    },
                }
            );
            if (response.status == 200) {
                setTemplateData(response.data)
            }
            console.log("template data", response.data)

        } catch (error) {
            console.error(error);
        }
    };
    


    const openNewWordDoc = async () => {
        const newBaseUrl = `/bp-wordprocessor/${getClientId()}/${getCaseId()}`;
        const formData = {
            doc_id: templateData?.for_template?.template?.id,
            case_id: getCaseId(),
            client_id: getClientId(),
            template_id: templateData?.for_template?.id,
            dynamic_template_id: templateData?.id,
            option: "WordProcessor",
            entity:entity,
            entity_id:entityId
          };
        const templateName = templateData?.for_template?.template_name;
          console.log("formData",formData)
          console.log("templateName",templateName)

        try {
          const res =  await api_without_cancellation.post("api/documents/fillTemplate/", formData);
          
    
          
          res.data.link = res.data.link.replace(
            "https://wordprocessor.simplefirm.com",
            newBaseUrl
          );
    
          res.data.link = res.data.link.replace(
            "type=Draft",
            "type=GenerateDocument"
          );
          const url = createWPUrl(res.data.link);
          const id_doc = res.data.id;
          const windowName = `_blank_${id_doc}`;
          console.log("Generated data:", res.data);
    
          await createEditDoc(id_doc, url, templateName,redirectUrl,dynamicTemplateId);
          window.location.href = url
      
          
        } catch (error) {
          console.error("Error during API call:", error);
          return null; // Return null explicitly if an error occurs
        }
      };
    

 

    

    return (
      <>

<Modal
        show={true}
        onHide={() => {
            redirectBack();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            The following users are currently editing this document: 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <table>
                <tbody>
                    { data && data?.map((item, idx) => {

                        return (
                            <tr>
                            <td className="td-autosize">
                            <span className="d-flex align-items-center ml-3">
                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                    {item?.profile_pic ?(<img 
                                    id="output" 
                                    className="output-8 output-3 theme-ring border-color-primary-50" 
                                    src={item?.profile_pic} 
                                    alt="Profile"
                                />):(null)}
                               
                                </span>
                                <span className="ml-2">{item?.user?.first_name} {item?.user?.last_name}</span>
                            </span>
                            </td>
                            <td className="td-autosize">
                            <button
                                    type="button"
                                    className="btn btn-primary font-weight-bold"
                                    onClick={() => {
                                        openDoc(
                                            item?.for_doc?.id,
                                            item?.url,
                                            item?.name,
                                            item?.redirect_url,
                                            item?.updated_doc,
                                            item?.for_template?.id
                                        )
                                    }}
                                >
                                    Open
                            </button>
                            </td>
                        </tr>
                        )
                        

                    })}
                </tbody>
            </table>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none' }}>
      
          <Button
            variant="secondary"
            className="ml-auto"
            onClick={() => {
                redirectBack();
            }}
          >
            Dismiss
          </Button>
          <Button
            variant="primary"
            className="mr-auto"
            onClick={() => {
              openNewWordDoc();
          }}
          disabled={disableBtn}
          >
            New Draft
          </Button>
        </Modal.Footer>
      </Modal>

                </>
                );
  }

export default SelectDoc;
