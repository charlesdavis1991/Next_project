import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Nav, Tab } from "react-bootstrap";
import api, { api_without_cancellation } from "../../api/api";
import axios from "axios";
import { getCaseId, getClientId,getLoggedInUserId,mediaRoute } from "../../Utils/helper";
import GenericModalComponent from "../common/Modal/Modal";
import { useFooter } from "../common/shared/FooterContext";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";


function CourtForm({
  handleClose,
  show,
  PageEntity,
  instanceId,
  dropdownName = "",

}) {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [generateData, setGenerateData] = useState([]);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedDraftDocs, setSelectedDraftDocs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTab, setSelectedTab] = useState("GDFT");
  const [ openDocCount, setOpenDocCount ] = useState(0);
  const { footerState, setFooterState } = useFooter();

  const [courtForms, setCourtForms] = useState([]);

  const { showDocumentModal } = useDocumentModal();



  const openCourtForm = async (court_form_id,form_name) => {
    const hasMatchingUrl = footerState?.find(item => item.url.includes("CourtForm") && item.url.includes(`court_form_id=${court_form_id}`) && item.url.includes(`litigation_id=${instanceId}`) ); 
      if (hasMatchingUrl){
        window.location.href = hasMatchingUrl.url
      } else {
        const newBaseUrl = `/bp-courtform/${getClientId()}/${getCaseId()}`
        const url = `${newBaseUrl}/?court_form_id=${court_form_id}&litigation_id=${instanceId}`;
        window.location.href = url
      }

    
  };

  const openCourtFormReturnDic = async (court_form_id,form_name) => {
    const hasMatchingUrl = footerState?.find(item => item.url.includes("CourtForm") && item.url.includes(`court_form_id=${court_form_id}`) && item.url.includes(`litigation_id=${instanceId}`) ); 
      if (hasMatchingUrl){
        return {
          "url":hasMatchingUrl.url,
          "widowName":`_blank_${hasMatchingUrl.for_doc.id}`
        }
      } 
      else{
        const newBaseUrl = `/bp-courtform/${getClientId()}/${getCaseId()}`
        const url = `${newBaseUrl}/?court_form_id=${court_form_id}&litigation_id=${instanceId}`;
        return {
          "url":url,
          "windowName":`${form_name}_${court_form_id}`
        }
      }
   
  };


  const openAllCourtForm = async () => {
    try {

      let docList = await Promise.all(
        selectedDocs.map(async (doc, index) => {
          return openCourtFormReturnDic(doc.id,doc.court_form_name); // Assuming openDocWordAll returns a promise
        })
      );
    
      console.log("docList", docList);
    
      // Delay each document download by index * 1000 ms
      docList.forEach((doc, index) => {
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = doc.url;
          a.target = doc.windowName || "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, index * 1000); // Delay each download by 1 second
      });
      fetchEditDocs();


     
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };





 

  
  const fetchCourtForms = async () => {
    try {
      // const response = await api_without_cancellation.get(
      //   origin +
      //   `/api/documents/get-courtforms/?client_id=${getClientId()}&case_id=${getCaseId()}`
      // );
      const response = await api_without_cancellation.get(
        origin +
        `/api/documents/get-courtforms/?case_id=${getCaseId()}&client_id=${getClientId()}&litigation_act_id=${instanceId}`
      );
      if (response.status == 200) {
        console.log("Courtforms",response.data.data)
        setCourtForms(response.data.data)
      }
    } catch (error) {
      console.log("Failed to fetch Litigation Data:", error);
    }
  };

  useEffect(() => {
    fetchCourtForms()
    
  }, []);

  

  const handleCheckboxChange_1 = useCallback(
    (doc) => {
      setSelectedDocs((prevDocs) =>
        prevDocs.some((d) => d.id === doc.id)
          ? prevDocs.filter((d) => d.id !== doc.id)
          : [...prevDocs, doc]
      );
    },
    [setSelectedDocs]
  );

  const handleCheckboxChange_2 = useCallback(
    (doc) => {
      setSelectedDraftDocs((prevDocs) =>
        prevDocs.some((d) => d.id === doc.id)
          ? prevDocs.filter((d) => d.id !== doc.id)
          : [...prevDocs, doc]
      );
    },
    [setSelectedDraftDocs]
  );


  const createEditDoc = async (docId,url,name,dynamic_template_id) => {
    try {

          const  currentUrl = window.location.href;
          const formData = new FormData();
          formData.append("doc_id", docId);
          formData.append("url", url);
          formData.append("redirect_url", currentUrl);
          formData.append("name", name);
          formData.append("template_id", dynamic_template_id);


            const response = await api_without_cancellation.post(`${origin}/api/create-edit-doc/`, formData);
            if (response.status == 200) {
               fetchEditDocs();
            }

            // Proceed with additional logic if needed
        

        
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

const fetchEditDocs = async () => {
  console.log("fetching data ......")
  try {
      
      const response = await api_without_cancellation.get(
       `${origin}/api/create-edit-doc/`
      );
    
      if (response.status === 200) {
          var data = response.data
          console.log("fetchEditDocs",data)
          setFooterState(data)

          

      }
    
   
  } catch (error) {
    console.error("Error fetching case types:", error);
    
  }
};


 




  

 


const handleDocPreview = (doc) => {
    // console.log("document for preview = ", doc);
    handleClose()
    showDocumentModal("document", mediaRoute(doc.upload), doc);
  };


  
  

  const bodyContent = useMemo(
    () => (
      <div className="custom-tab mt-3">
        <Tab.Container defaultActiveKey={"GenerateCourtFormFromTemplate"}>
          <Nav variant="tabs" className="justify-content-around">
            <Nav.Link
              eventKey="GenerateCourtFormFromTemplate"
              onClick={() => {
                setSelectAll(false);
                setSelectedTab("GDFT");
              }}
            >
              Generate Court Form From Template
            </Nav.Link>
            <Nav.Link
              eventKey="CourtFormDrafts"
              onClick={() => {
                setSelectAll(false);
                setSelectedTab("DD");
              }}
            >
              Court Form Drafts
            </Nav.Link>
          </Nav>
          <div
            className="d-flex flex-column justify-content-between"
            style={{ height: "545px" }}
          >
            <Tab.Content style={{ height: "490px", overflow: "scroll" }}>
              <Tab.Pane eventKey="GenerateCourtFormFromTemplate">
                <div class="table-responsive table--no-card rounded-0 border-0">
                  <table class="table table-borderless table-striped table-earning has-height-25 generate-doc-table">
                    <thead>
                      <tr>
                        <th scope="col" class="width-1"></th>
                        <th></th>
                        <th>Court Form Code</th>
                        <th>Court Form Name</th>
                        <th></th>
                        <th></th>
                        
                      </tr>
                    </thead>
                    <tbody id="table-body-cat" className="generate-doc-body">
                      {courtForms?.map((obj, index) => (
                        <tr key={obj.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div class="form-check justify-content-center">
                              <input
                                className="form-check-input template-checkbox"
                                type="checkbox"
                                checked={selectedDocs.some(
                                  (d) => d.id === obj.id
                                )}
                                onChange={() =>
                                  handleCheckboxChange_1({
                                    ...obj,
                                  })
                                }
                              />
                            </div>
                          </td>
                          <td class="color-white-space-word-wrap">{obj.court_form_code ? obj.court_form_code : "" }</td>
                          <td class="color-white-space-word-wrap">{obj.court_form_name ? obj.court_form_name : "" }</td>

                          <td>
                          {obj?.background_pdf ? (
                            <i className="ic-generate-document-pdf ic ic-29"
                            onClick={() => handleDocPreview(obj?.background_pdf)}
                            ></i>
                       
                    ) : (
                      <i className="ic-pdf-icon-grey ic ic-29"></i>
                     
                    )}
                          </td>
                  
                      

                    
                          <td class="text-center td-autosize">
                            <div class="d-flex justify-content-center space-x-5">
                              <button
                                className="width-120 height-25 d-flex align-items-center justify-content-center btn court-form-open"
                                 onClick={() =>
                                   openCourtForm(
                                    obj.id,
                                    obj.court_form_name
                                   )
                                 }
                               
                              >
                                Open
                                <i className="ic ic-19 ic-generate-document ml-1"></i>
                              </button>
                           
                            </div>
                          </td>
                       
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="CourtFormDrafts">
                <div class="table-responsive table--no-card rounded-0 border-0">
                  <table class="table table-borderless table-striped table-earning has-height-25">
                    <thead>
                      <tr>
                        <th scope="col" class="width-1"></th>
                        <th>
                        </th>
                        <th class="">Court Form Name</th>
                        <th class="text-center">Last Accessed</th>
                        <th></th>
                        <th>Assign Document Generation Task</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-cat">
                      
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="ml-2"
              >
                Close
              </Button>
              <div className="d-flex space-x-5">
                <Button
                  variant="primary"
                  onClick={() => openAllCourtForm()}
               
                >
                  Open Selected Docs in Tabs
                </Button>
              
              </div>
            </div>
          </div>
        </Tab.Container>
      </div>
    ),
    [
      handleClose,
      selectedDocs,
      selectedDraftDocs,
      selectedTab,
      courtForms

    ]
  );

  return (
    <GenericModalComponent
      show={show}
      handleClose={handleClose}
      title={
        <>
          <i className="ic ic-29 ic-court-form m-r-5"></i> Generate
          Court Form
        </>
      }
      height="659px"
      bodyContent={bodyContent}
      dialogClassName="modal-dialog-centered genrate-docs-modal"
      titleClassName="mx-auto d-flex align-items-center justify-content-center font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
      headerClassName="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center"
    />
  );
}

export default CourtForm;
