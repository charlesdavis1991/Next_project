import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import axios from "axios";
import Cookies from "js-cookie";
import GenericModalComponent from "../common/Modal/Modal";

//RK :: 2024-1-08 03-31am
function GenrateDocument({ handleClose, show, PageEntity, instanceId }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const { reset, handleSubmit, register, watch } = useForm();
  const caseId = getCaseId();
  const clientId = getClientId();
  const [generateData, setGenerateData] = useState([]);
  const [dropdownId, setDropdownId] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [dropdowns, setDropdowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedDraftDocs, setSelectedDraftDocs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTab, setSeletedTab] = useState("GDFT"); // or DD

  // console.log("generateData :: " , generateData)

  const AuthenticatedUserId = localStorage.getItem("loggedInUser");

  const fetchDropdownsAndSetIds = async () => {
    try {
      const response = await api.get(`api/documents/get_all_dropdowns/`);
      if (response.status === 200) {
        setDropdowns(response.data);

        const filteredPages = response.data.filter(
          (obj) => obj.for_page.name === PageEntity
        );
        if (filteredPages.length > 0) {
          const dropdown = filteredPages[0];
          setDropdownId(dropdown.number);
          setPageId(dropdown.for_page.id); // Seting the pageId based on the filtered dropdown
        } else {
          console.log("No dropdown found with the specified PageEntity");
        }
      }
    } catch (error) {
      console.log("GET ALL DROPDOWNSLIST :: ", error);
    }
  };

  useEffect(() => {
    fetchDropdownsAndSetIds();
  }, [PageEntity]);

  useEffect(() => {
    if (dropdownId && pageId && caseId && clientId) {
      api
        .get(
          // `/30/GetDLTemplateFromDropdown/?dropdown_id=${dropdownId}&page_id=${pageId}&case_id=${caseId}&client_id=${clientId}`
          `/api/documents/get-dl-template/?dropdown_id=${dropdownId}&page_id=${pageId}&case_id=${caseId}&client_id=${clientId}`
        )
        .then((response) => {
          setGenerateData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log({ error });
          setLoading(false);
        });
    }
  }, [dropdownId, pageId, caseId, clientId]);

  useEffect(() => {
    if (selectAll) {
      if (selectedTab === "GDFT") {
        const allDocs = generateData?.data?.map((doc) => ({
          ...doc,
        }));
        setSelectedDocs(allDocs);
      } else if (selectedTab === "DD") {
        const allDocs = generateData?.document_drafts?.map((doc) => ({
          ...doc,
        }));
        setSelectedDraftDocs(allDocs);
      }
    } else {
      setSelectedDocs([]);
      setSelectedDraftDocs([]);
    }
  }, [selectAll, generateData]);

  const handleCheckboxChange_1 = (doc) => {
    const docIndex = selectedDocs.findIndex((d) => d.id === doc.id);

    if (docIndex >= 0) {
      const updatedDocs = [...selectedDocs];
      updatedDocs.splice(docIndex, 1);
      setSelectedDocs(updatedDocs);
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const handleCheckboxChange_2 = (doc) => {
    const docIndex = selectedDraftDocs.findIndex((d) => d.id === doc.id);

    if (docIndex >= 0) {
      const updatedDocs = [...selectedDraftDocs];
      updatedDocs.splice(docIndex, 1);
      setSelectedDraftDocs(updatedDocs);
    } else {
      setSelectedDraftDocs([...selectedDraftDocs, doc]);
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
  };

  // console.log(selectedDocs)
  /// Create an dynamic functin that can open word doc with the help of pageEntity , :

  // const openDocWordProcessor2 = async({DynamicTemplateId,templateId,doc_id,count,contact_id,defendant_id,witness_id,provider_id,other_party_id,incident_report_id,insurance_id, litigation_id})=>{

  const openDocWordProcessor2 = async ({
    DynamicTemplateId,
    templateId,
    doc_id,
    count,
  }) => {
    // to open  openDocWord
    const openDocWord = async (formData, index = 0) => {
      try {
        console.log("form Data :: ", formData);
        const res = await api.post("api/documents/fillTemplate/", formData);
        // console.log("res :: ", res.data);
        const url = res.data.link;
        const id_doc = res.data.id;

        // Using to open selected files in each tab differently.
        const windowName = `_blank_${id_doc}_${index}`;

        setTimeout(() => {
          const a = document.createElement("a");
          a.href = url;
          a.target = windowName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, index * 1000);
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };

    //to open draf tabs docs
    const openDraftDocs = (doc) => {
      const url =  "/bp-wordprocessor/" + getClientId() + "/" + getCaseId() + `?docId=${doc.doc_id}&userId=${AuthenticatedUserId}&type=Draft&dynamic_template_id=${doc.id}&draftId=${doc.template_id}`;
      window.open(url, `_blank_${doc.doc_id}`);
    };

    const entity_id = {};
    // Set the ID field dynamically based on PageEntity
    switch (PageEntity.toLowerCase()) {
      case "defendants":
        entity_id.defendant_id = instanceId;
        break;
      case "witness":
        entity_id.witness_id = instanceId;
        break;
      case "contact":
        entity_id.contact_id = instanceId;
        break;
      case "provider":
        entity_id.provider_id = instanceId;
        break;
      case "other_party":
        entity_id.other_party_id = instanceId;
        break;
      case "incident_report":
        entity_id.incident_report_id = instanceId;
        break;
      case "insurance":
        entity_id.insurance_id = instanceId;
        break;
      case "litigation":
        entity_id.litigation_id = instanceId - 1; // like in Django site you have -1 from ids.
        break;
      default:
        // console.error(`Unknown PageEntity: ${PageEntity}`);
        return; // Exit if PageEntity is unknown
    }

    if (count === "one") {
      const formData = {
        doc_id: doc_id,
        case_id: `${caseId}`,
        client_id: `${clientId}`,
        template_id: templateId,
        dynamic_template_id: DynamicTemplateId,
        option: "WordProcessor",
        ...entity_id, // sample :: defendant_id: 123
      };

      openDocWord(formData);
    } else if (count === "all") {
      selectedTab === "GDFT" &&
        selectedDocs?.forEach((doc, index) => {
          // console.log("Docs , " , selectedDocs)
          // console.log("doc , " , doc)
          const formData = {
            doc_id: doc.doc_id,
            case_id: `${caseId}`,
            client_id: `${clientId}`,
            template_id: doc.template_id,
            // "dynamic_template_id": doc.dynamic_template_id, old
            dynamic_template_id: doc.id,
            option: "WordProcessor",
            ...entity_id, // sample :: defendant_id: 123
          };

          openDocWord(formData, index);
        });

      selectedTab === "DD" &&
        selectedDraftDocs?.forEach((doc, index) => {
          setTimeout(() => {
            openDraftDocs(doc, index);
          }, index * 1000); // Delay can be adjusted as needed (1 second delay)
        });
    }
  };

  const downloadSelectedDocs = async (selectedDocs, PageEntity, instanceId) => {
    try {
      const entity_id = {};

      // Set the ID field dynamically based on PageEntity
      switch (PageEntity.toLowerCase()) {
        case "defendants":
          entity_id.defendant_id = instanceId;
          break;
        case "witness":
          entity_id.witness_id = instanceId;
          break;
        case "contact":
          entity_id.contact_id = instanceId;
          break;
        case "provider":
          entity_id.provider_id = instanceId;
          break;
        case "other_party":
          entity_id.other_party_id = instanceId;
          break;
        case "incident_report":
          entity_id.incident_report_id = instanceId;
          break;
        case "insurance":
          entity_id.insurance_id = instanceId;
          break;
        case "litigation":
          entity_id.litigation_id = instanceId - 1; // like in Django site you have -1 from ids.
          break;
        default:
          return; // Exit if PageEntity is unknown
      }

      // Ensure selectedDocs is an array
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];

      const downloadPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          ...entity_id, // sample :: defendant_id: 123
        };

        console.log("Form Data:", formData); // Debugging statement

        try {
          const response = await axios.post(
            `${origin}/api/documents/download_docs_word/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
              },
            }
          );
          const { data, filename } = response.data;

          console.log("Downloading document:", filename); // Debugging statement

          // Decode the base64 encoded document content
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          // Create a blob and trigger a download
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error(
            "An error occurred while downloading the document:",
            error
          );
        }
      });

      await Promise.all(downloadPromises);
      console.log("All downloads completed"); // Debugging statement
    } catch (error) {
      console.error("An error occurred while processing the documents:", error);
      // Handle the error appropriately, e.g., showing an error message to the user
    }
  };
  const downloadSelectedPdfs = async (selectedDocs, PageEntity, instanceId) => {
    try {
      const entity_id = {};

      // Set the ID field dynamically based on PageEntity
      switch (PageEntity.toLowerCase()) {
        case "defendants":
          entity_id.defendant_id = instanceId;
          break;
        case "witness":
          entity_id.witness_id = instanceId;
          break;
        case "contact":
          entity_id.contact_id = instanceId;
          break;
        case "provider":
          entity_id.provider_id = instanceId;
          break;
        case "other_party":
          entity_id.other_party_id = instanceId;
          break;
        case "incident_report":
          entity_id.incident_report_id = instanceId;
          break;
        case "insurance":
          entity_id.insurance_id = instanceId;
          break;
        case "litigation":
          entity_id.litigation_id = instanceId - 1; // like in Django site you have -1 from ids.
          break;
        default:
          return; // Exit if PageEntity is unknown
      }

      // Ensure selectedDocs is an array
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];

      const downloadPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          ...entity_id, // sample :: defendant_id: 123
        };

        console.log("Form Data:", formData); // Debugging statement

        try {
          const response = await axios.post(
            `${origin}/api/documents/convert_to_pdf_and_downloads/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
                "Content-Type": "application/json", // Ensure content type is application/json
              },
            }
          );

          const { data, filename } = response.data;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const url = URL.createObjectURL(pdfBlob);

          // Create an anchor element and simulate a click to download the file
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Cleanup
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error(
            "An error occurred while downloading the document:",
            error
          );
        }
      });

      await Promise.all(downloadPromises);
      console.log("All downloads completed"); // Debugging statement
    } catch (error) {
      console.error("An error occurred while processing the documents:", error);
      // Handle the error appropriately, e.g., showing an error message to the user
    }
  };

  const downloadDraftDocs = async (selectedDocs) => {
    console.log(selectedDocs, "LLLLLLLLLLLLLLLLL");
    try {
      // Ensure selectedDocs is an array
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];

      const downloadPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
        };

        console.log("Form Data:", formData); // Debugging statement

        try {
          const response = await axios.post(
            `${origin}/api/documents/downloadDraftDoc/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
              },
            }
          );

          if (response.status !== 200) {
            throw new Error(
              `API call failed with status code: ${response.status}`
            );
          }

          const { data, filename } = response.data;

          console.log("Downloading document:", response.data); // Debugging statement

          // Decode the base64 encoded document content
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          // Create a blob and trigger a download
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error(
            "An error occurred while downloading the document:",
            error
          );
        }
      });

      await Promise.all(downloadPromises);
      console.log("All downloads completed"); // Debugging statement
    } catch (error) {
      console.error("An error occurred while processing the documents:", error);
      // Handle the error appropriately, e.g., showing an error message to the user
    }
  };

  const printDocs = async (selectedDocs, PageEntity, instanceId) => {
    try {
      const entity_id = {};

      // Set the ID field dynamically based on PageEntity
      switch (PageEntity.toLowerCase()) {
        case "defendants":
          entity_id.defendant_id = instanceId;
          break;
        case "witness":
          entity_id.witness_id = instanceId;
          break;
        case "contact":
          entity_id.contact_id = instanceId;
          break;
        case "provider":
          entity_id.provider_id = instanceId;
          break;
        case "other_party":
          entity_id.other_party_id = instanceId;
          break;
        case "incident_report":
          entity_id.incident_report_id = instanceId;
          break;
        case "insurance":
          entity_id.insurance_id = instanceId;
          break;
        case "litigation":
          entity_id.litigation_id = instanceId - 1; // like in Django site you have -1 from ids.
          break;
        default:
          return; // Exit if PageEntity is unknown
      }

      // Ensure selectedDocs is an array
      const docsArray = Array.isArray(selectedDocs)
        ? selectedDocs
        : [selectedDocs];

      const printPromises = docsArray.map(async (doc) => {
        const formData = {
          doc_id: doc.doc_id,
          template_id: doc.template_id,
          dynamic_template_id: doc.id,
          ...entity_id, // sample :: defendant_id: 123
        };

        console.log("Form Data:", formData); // Debugging statement

        try {
          const response = await axios.post(
            `${origin}/api/documents/print_docs/`,
            formData,
            {
              headers: {
                Authorization: tokenBearer,
                "Content-Type": "application/json", // Ensure content type is application/json
              },
            }
          );

          const { data } = response.data;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(data), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const url = URL.createObjectURL(pdfBlob);

          // Create an iframe element and use it to print the file
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = url;
          document.body.appendChild(iframe);

          iframe.onload = () => {
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
          };

          // Cleanup
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error(
            "An error occurred while printing the document:",
            error
          );
        }
      });

      await Promise.all(printPromises);
      console.log("All print jobs completed"); // Debugging statement
    } catch (error) {
      console.error("An error occurred while processing the documents:", error);
      // Handle the error appropriately, e.g., showing an error message to the user
    }
  };

  function openDraftDoc({ docId, userId, dynamic_template_id, draft_id }) {
    var url =  "/bp-wordprocessor/" + getClientId() + "/" + getCaseId() + `/?docId=${docId}&userId=${AuthenticatedUserId}&type=Draft&dynamic_template_id=${dynamic_template_id}&draftId=${draft_id}`;

    window.open(url, `_blank_${docId}`);
  }

  const bodyContent = (
    <div className="custom-tab mt-3">
      <Tab.Container defaultActiveKey={"GenerateDocumentFromTemplate"}>
        <Nav variant="tabs" className="justify-content-around">
          <Nav.Link
            eventKey="GenerateDocumentFromTemplate"
            onClick={() => {
              setSelectAll(false);
              setSeletedTab("GDFT");
            }}
          >
            Generate Document From Template
          </Nav.Link>
          <Nav.Link
            eventKey="DocumentDrafts"
            onClick={() => {
              setSelectAll(false);
              setSeletedTab("DD");
            }}
          >
            Document Drafts
          </Nav.Link>
        </Nav>
        <div
          ///  div was form before
          id="genrate-docs-form "
          className="d-flex , flex-column justify-content-between"
          style={{ height: "545px" }}
        >
          <div className="mt-2 ">
            <Tab.Content>
              <Tab.Pane eventKey="GenerateDocumentFromTemplate">
                <div class="table-responsive table--no-card rounded-0 border-0">
                  <table class="table table-borderless table-striped table-earning has-height-25">
                    <thead>
                      <tr>
                        <th scope="col" class="width-1"></th>
                        <th>
                          <input
                            id="select-all-docs"
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        </th>
                        <th>Template Name</th>
                        <th>Copilot</th>
                        <th class="text-center">Pages</th>

                        <th class="text-center">Uploaded</th>
                        <th class="text-center width-25">Last Generated</th>
                        <th class="text-center width-25">Firm</th>

                        <th></th>

                        <th>Task For</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-cat">
                      {generateData?.data?.map((obj, index) => (
                        <tr key={obj.doc_id}>
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
                              {/* <label className="form-check-label" htmlFor="gridCheck1"></label> */}
                            </div>
                          </td>
                          <td class="text-nowrap">{obj.template_name}</td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <a href="#" class="has-light-btn">
                                <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                  <img src={obj.copilot_profile_pic} alt="" />
                                </span>
                                <span class="ml-1 text-black">
                                  {obj.copilot_name}
                                </span>
                              </a>
                            </div>
                          </td>
                          <td class="text-center">{obj.pages}</td>
                          <td class="text-center">{obj.created}</td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <span>{obj.last_generated}</span>
                              {/* <a href="#" class="has-light-btn">
                                           <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                           
                                                       </span>
                                           <span class="ml-1 text-black">
                                                           Farhan Khan
                                           </span>
                                         </a> */}
                            </div>
                          </td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <a href="#" class="has-light-btn">
                                <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                  <img src={obj.firm_profile_pic} alt="" />
                                </span>
                                <span class="ml-1 text-black">{obj.firm}</span>
                              </a>
                            </div>
                          </td>

                          <td>
                            <div class="d-flex justify-content-center space-x-5">
                              {/* <button
                                      class="btn btn-primary d-flex align-items-center m-r-5"
                                      onclick="openDocWordProcessor('5','3','241','one','','21','','','','','', '-1')"
                                    >
                                      Open{" "}
                                      <i class="ic ic-19 ic-generate-document ml-1"></i>
                                    </button>
                                    <button
                                      class="btn btn-primary d-flex align-items-center"
                                      onclick="DownloadWordToPdf('5','3','266','one','','21','','','','','', '-1')"
                                    >
                                      Download{" "}
                                      <img
                                        class="ic ic-19 ml-1"
                                        src="/static/bp_assets/img/pdf.svg"
                                      />
                                    </button>
                                    
                                      onclick="openDraftDoc('${data2[i]["doc_id"]}','{{request.user.id}}','${data2[i]["template_id"]}','${data2[i]["id"]}')">
                                    
                                    */}
                              <Button
                                className="w-100"
                                onClick={() =>
                                  openDocWordProcessor2({
                                    DynamicTemplateId: obj.id,
                                    templateId: obj.template_id,
                                    doc_id: obj.doc_id,
                                    count: "one",
                                  })
                                }
                              >
                                Open{" "}
                                <i class="ic ic-19 ic-generate-document ml-1"></i>
                              </Button>
                              <Button
                                className="w-100"
                                onClick={
                                  selectedTab === "GDFT"
                                    ? () =>
                                        downloadSelectedDocs(
                                          {
                                            doc_id: obj.doc_id,
                                            template_id: obj.template_id,
                                            id: obj.id,
                                          },
                                          PageEntity,
                                          instanceId
                                        )
                                    : () => downloadDraftDocs({ doc_id: obj })
                                }
                              >
                                Download
                                <img
                                  class="ic ic-19 ml-1"
                                  src="/static/bp_assets/img/pdf.svg"
                                />
                              </Button>
                            </div>
                          </td>
                          <td>
                            <div class="d-flex align-items-center">
                              {/* <div class="dropdown pl-0 p-r-5 dropdown-document">
                                      <a
                                        class="dropdown-toggle w-100 form-select has-no-after has-no-bg text-left d-flex align-items-center"
                                        href="#"
                                        role="button"
                                        id="dropdownMenuLink-5"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                      >
                                        Select
                                        <span class="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
                                          <svg
                                            width="34"
                                            height="17"
                                            viewBox="0 0 34 17"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                              fill="currentColor"
                                            ></path>
                                          </svg>
                                        </span>
                                      </a>
                                      <div
                                        class="dropdown-menu w-100 p-0"
                                        aria-labelledby="dropdownMenuLink"
                                      >
                                        <input type="hidden" id="dd-user-5" />

                                        <a
                                          href="#"
                                          class="dropdown-item has-light-btn"
                                        >
                                          <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                          <span class="ml-2 text-black">
                                            Usama Nawaz
                                          </span>
                                        </a>
                                        <a
                                          href="#"
                                          class="dropdown-item has-light-btn"
                                        >
                                          <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                          <span class="ml-2 text-black">
                                            Usama Nawaz
                                          </span>
                                        </a>
                                      </div>
                                    </div> */}

                              <select
                                className="form-select"
                                aria-label="select example"
                              >
                                <option>Task for</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                              </select>

                              <Button variant="primary" type="submit">
                                <span class="font-weight-bold pr-2 text-gold">
                                  +
                                </span>{" "}
                                Task
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="DocumentDrafts">
                <div class="table-responsive table--no-card rounded-0 border-0">
                  <table class="table table-borderless table-striped table-earning has-height-25">
                    <thead>
                      <tr>
                        <th scope="col" class="width-1"></th>
                        <th>
                          <input
                            id="select-all-docs"
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                          />
                        </th>

                        <th class="">Document Name</th>
                        <th class="text-center">Last Accessed</th>

                        <th></th>

                        <th>Assign Document Generation Task</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-cat">
                      {generateData?.document_drafts?.map((obj, index) => (
                        <tr class="height-70" key={obj.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div class="form-check justify-content-center">
                              <input
                                className="form-check-input template-checkbox"
                                type="checkbox"
                                checked={selectedDraftDocs.some(
                                  (d) => d.id === obj.id
                                )}
                                onChange={() =>
                                  handleCheckboxChange_2({
                                    ...obj,
                                  })
                                }
                              />
                            </div>
                          </td>
                          <td class="text-nowrap text-center">
                            {obj?.document_name}
                          </td>
                          <td class="text-center td-autosize">
                            <div class="align-items-center">
                              <a href="#" class="has-light-btn">
                                <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                <span class="ml-1 text-black">
                                  {obj?.user_name}
                                </span>
                              </a>
                            </div>
                            <span>{obj?.created_at}</span>
                          </td>

                          <td class="text-center">
                            <div class="mx-auto">
                              <button
                                class="btn btn-primary height-25 d-flex align-items-center mb-1 width-85 mx-auto"
                                onClick={() =>
                                  openDraftDoc({
                                    docId: obj.doc_id,
                                    draft_id: obj.template_id,
                                    dynamic_template_id: obj.id,
                                  })
                                }
                              >
                                Open{" "}
                                <i class="ic ic-19 ic-generate-document ml-1"></i>
                              </button>
                              <button
                                class="btn btn-primary height-25 d-flex align-items-center width-85 text-center mx-auto"
                                onClick={() =>
                                  downloadDraftDocs({
                                    doc_id: obj.doc_id,
                                  })
                                }
                              >
                                <img
                                  class="ic ic-19 mx-auto"
                                  src="/static/bp_assets/img/pdf.svg"
                                />
                                Download
                              </button>
                            </div>
                          </td>
                          <td class="text-right">
                            <div class="d-flex align-items-center">
                              <div class="dropdown pl-0 p-r-5 dropdown-document w-auto ml-auto">
                                <a
                                  class=" w-100 form-select has-no-after has-no-bg text-left d-flex align-items-center"
                                  href="#"
                                  role="button"
                                  id="dropdownMenuLink2-3"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  Select Firm User For Task
                                  <span class="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
                                    <svg
                                      width="34"
                                      height="17"
                                      viewBox="0 0 34 17"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                                        fill="currentColor"
                                      ></path>
                                    </svg>
                                  </span>
                                </a>
                                <div
                                  className="dropdown-menu w-100 p-0"
                                  aria-labelledby="dropdownMenuLink"
                                  x-placement="bottom-start"
                                  style={{
                                    position: "absolute",
                                    transform: "translate3d(0px, 34px, 0px)",
                                    top: 0,
                                    left: 0,
                                    willChange: "transform",
                                  }}
                                >
                                  <input type="hidden" id="dd-user2-3" />
                                </div>
                              </div>
                              <button
                                class="btn btn-primary height-25 d-flex align-items-center m-r-5"
                                onclick="addTask2('3','undefined')"
                              >
                                <span class="font-weight-bold pr-2 text-gold">
                                  +
                                </span>{" "}
                                Task
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose} className="ml-2">
              Close
            </Button>

            <div className="d-flex justify-content-between space-x-5">
              <Button
                variant="primary"
                type="submit"
                onClick={() => openDocWordProcessor2({ count: "all" })}
                disabled={
                  selectedDocs?.length === 0 && selectedDraftDocs?.length === 0
                }
              >
                Open Selected Docs in Tabs
              </Button>

              <Button
                variant="primary"
                type="submit"
                onClick={
                  selectedTab === "GDFT"
                    ? () =>
                        downloadSelectedDocs(
                          selectedDocs,
                          PageEntity,
                          instanceId
                        )
                    : () => downloadDraftDocs(selectedDraftDocs)
                }
                disabled={
                  selectedDocs?.length === 0 && selectedDraftDocs?.length === 0
                }
              >
                Download Selected as Docs
              </Button>

              <Button
                variant="primary"
                type="submit"
                onClick={() =>
                  downloadSelectedPdfs(selectedDocs, PageEntity, instanceId)
                }
                disabled={
                  selectedDocs?.length === 0 && selectedDraftDocs?.length === 0
                }
              >
                Download Selected as PDFs
              </Button>

              <Button
                variant="primary"
                type="submit"
                onClick={() => printDocs(selectedDocs, PageEntity, instanceId)}
                disabled={
                  selectedDocs?.length === 0 && selectedDraftDocs?.length === 0
                }
              >
                Print Selected
              </Button>
            </div>
          </div>
        </div>
      </Tab.Container>
    </div>
  );

  // return (
  //   <Modal
  //     show={show}
  //     onHide={handleClose}
  //     dialogClassName=" modal-dialog-centered genrate-docs-modal"
  //   >
  //     <div style={{ height: "659px" }}>
  //       <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
  //         <Modal.Title
  //           className="mx-auto d-flex align-items-center justify-content-center font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
  //           id="modal_title"
  //         >
  //           <i className="ic ic-29 ic-generate-document m-r-5"></i> Generate
  //           Document
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //   <div className="custom-tab mt-3">
  //     <Tab.Container defaultActiveKey={"GenerateDocumentFromTemplate"}>
  //       <Nav variant="tabs" className="justify-content-around">
  //         <Nav.Link
  //           eventKey="GenerateDocumentFromTemplate"
  //           onClick={() => {
  //             setSelectAll(false);
  //             setSeletedTab("GDFT");
  //           }}
  //         >
  //           Generate Document From Template
  //         </Nav.Link>
  //         <Nav.Link
  //           eventKey="DocumentDrafts"
  //           onClick={() => {
  //             setSelectAll(false);
  //             setSeletedTab("DD");
  //           }}
  //         >
  //           Document Drafts
  //         </Nav.Link>
  //       </Nav>
  //       <div
  //         ///  div was form before
  //         id="genrate-docs-form "
  //         className="d-flex , flex-column justify-content-between"
  //         style={{ height: "545px" }}
  //       >
  //         <div className="mt-2 ">
  //           <Tab.Content>
  //             <Tab.Pane eventKey="GenerateDocumentFromTemplate">
  //               <div class="table-responsive table--no-card rounded-0 border-0">
  //                 <table class="table table-borderless table-striped table-earning has-height-25">
  //                   <thead>
  //                     <tr>
  //                       <th scope="col" class="width-1"></th>
  //                       <th>
  //                         <input
  //                           id="select-all-docs"
  //                           type="checkbox"
  //                           checked={selectAll}
  //                           onChange={handleSelectAllChange}
  //                         />
  //                       </th>
  //                       <th>Template Name</th>
  //                       <th>Copilot</th>
  //                       <th class="text-center">Pages</th>

  //                       <th class="text-center">Uploaded</th>
  //                       <th class="text-center width-25">
  //                         Last Generated
  //                       </th>
  //                       <th class="text-center width-25">Firm</th>

  //                       <th></th>

  //                       <th>Task For</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody id="table-body-cat">
  //                     {generateData?.data?.map((obj, index) => (
  //                       <tr key={obj.doc_id}>
  //                         <td>{index + 1}</td>
  //                         <td>
  //                           <div class="form-check justify-content-center">
  //                             <input
  //                               className="form-check-input template-checkbox"
  //                               type="checkbox"
  //                               checked={selectedDocs.some(
  //                                 (d) => d.id === obj.id
  //                               )}
  //                               onChange={() =>
  //                                 handleCheckboxChange_1({
  //                                   ...obj,
  //                                 })
  //                               }
  //                             />
  //                             {/* <label className="form-check-label" htmlFor="gridCheck1"></label> */}
  //                           </div>
  //                         </td>
  //                         <td class="text-nowrap">{obj.template_name}</td>
  //                         <td class="text-center td-autosize">
  //                           <div class="align-items-center">
  //                             <a href="#" class="has-light-btn">
  //                               <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
  //                                 <img
  //                                   src={obj.copilot_profile_pic}
  //                                   alt=""
  //                                 />
  //                               </span>
  //                               <span class="ml-1 text-black">
  //                                 {obj.copilot_name}
  //                               </span>
  //                             </a>
  //                           </div>
  //                         </td>
  //                         <td class="text-center">{obj.pages}</td>
  //                         <td class="text-center">{obj.created}</td>
  //                         <td class="text-center td-autosize">
  //                           <div class="align-items-center">
  //                             <span>{obj.last_generated}</span>
  //                             {/* <a href="#" class="has-light-btn">
  //                                    <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">

  //                                                </span>
  //                                    <span class="ml-1 text-black">
  //                                                    Farhan Khan
  //                                    </span>
  //                                  </a> */}
  //                           </div>
  //                         </td>
  //                         <td class="text-center td-autosize">
  //                           <div class="align-items-center">
  //                             <a href="#" class="has-light-btn">
  //                               <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
  //                                 <img
  //                                   src={obj.firm_profile_pic}
  //                                   alt=""
  //                                 />
  //                               </span>
  //                               <span class="ml-1 text-black">
  //                                 {obj.firm}
  //                               </span>
  //                             </a>
  //                           </div>
  //                         </td>

  //                         <td>
  //                           <div class="d-flex justify-content-center space-x-5">
  //                             {/* <button
  //                               class="btn btn-primary d-flex align-items-center m-r-5"
  //                               onclick="openDocWordProcessor('5','3','241','one','','21','','','','','', '-1')"
  //                             >
  //                               Open{" "}
  //                               <i class="ic ic-19 ic-generate-document ml-1"></i>
  //                             </button>
  //                             <button
  //                               class="btn btn-primary d-flex align-items-center"
  //                               onclick="DownloadWordToPdf('5','3','266','one','','21','','','','','', '-1')"
  //                             >
  //                               Download{" "}
  //                               <img
  //                                 class="ic ic-19 ml-1"
  //                                 src="/static/bp_assets/img/pdf.svg"
  //                               />
  //                             </button>

  //                               onclick="openDraftDoc('${data2[i]["doc_id"]}','{{request.user.id}}','${data2[i]["template_id"]}','${data2[i]["id"]}')">

  //                             */}
  //                             <Button
  //                               className="w-100"
  //                               onClick={() =>
  //                                 openDocWordProcessor2({
  //                                   DynamicTemplateId: obj.id,
  //                                   templateId: obj.template_id,
  //                                   doc_id: obj.doc_id,
  //                                   count: "one",
  //                                 })
  //                               }
  //                             >
  //                               Open{" "}
  //                               <i class="ic ic-19 ic-generate-document ml-1"></i>
  //                             </Button>
  //                             <Button
  //                               className="w-100"
  //                               onClick={
  //                                 selectedTab === "GDFT"
  //                                   ? () =>
  //                                       downloadSelectedDocs(
  //                                         {
  //                                           doc_id: obj.doc_id,
  //                                           template_id: obj.template_id,
  //                                           id: obj.id,
  //                                         },
  //                                         PageEntity,
  //                                         instanceId
  //                                       )
  //                                   : () =>
  //                                       downloadDraftDocs({ doc_id: obj })
  //                               }
  //                             >
  //                               Download
  //                               <img
  //                                 class="ic ic-19 ml-1"
  //                                 src="/static/bp_assets/img/pdf.svg"
  //                               />
  //                             </Button>
  //                           </div>
  //                         </td>
  //                         <td>
  //                           <div class="d-flex align-items-center">
  //                             {/* <div class="dropdown pl-0 p-r-5 dropdown-document">
  //                               <a
  //                                 class="dropdown-toggle w-100 form-select has-no-after has-no-bg text-left d-flex align-items-center"
  //                                 href="#"
  //                                 role="button"
  //                                 id="dropdownMenuLink-5"
  //                                 data-toggle="dropdown"
  //                                 aria-haspopup="true"
  //                                 aria-expanded="false"
  //                               >
  //                                 Select
  //                                 <span class="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
  //                                   <svg
  //                                     width="34"
  //                                     height="17"
  //                                     viewBox="0 0 34 17"
  //                                     fill="none"
  //                                     xmlns="http://www.w3.org/2000/svg"
  //                                   >
  //                                     <path
  //                                       d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
  //                                       fill="currentColor"
  //                                     ></path>
  //                                   </svg>
  //                                 </span>
  //                               </a>
  //                               <div
  //                                 class="dropdown-menu w-100 p-0"
  //                                 aria-labelledby="dropdownMenuLink"
  //                               >
  //                                 <input type="hidden" id="dd-user-5" />

  //                                 <a
  //                                   href="#"
  //                                   class="dropdown-item has-light-btn"
  //                                 >
  //                                   <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
  //                                   <span class="ml-2 text-black">
  //                                     Usama Nawaz
  //                                   </span>
  //                                 </a>
  //                                 <a
  //                                   href="#"
  //                                   class="dropdown-item has-light-btn"
  //                                 >
  //                                   <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
  //                                   <span class="ml-2 text-black">
  //                                     Usama Nawaz
  //                                   </span>
  //                                 </a>
  //                               </div>
  //                             </div> */}

  //                             <select
  //                               className="form-select"
  //                               aria-label="select example"
  //                             >
  //                               <option>Task for</option>
  //                               <option>2</option>
  //                               <option>3</option>
  //                               <option>4</option>
  //                             </select>

  //                             <Button variant="primary" type="submit">
  //                               <span class="font-weight-bold pr-2 text-gold">
  //                                 +
  //                               </span>{" "}
  //                               Task
  //                             </Button>
  //                           </div>
  //                         </td>
  //                       </tr>
  //                     ))}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             </Tab.Pane>
  //             <Tab.Pane eventKey="DocumentDrafts">
  //               <div class="table-responsive table--no-card rounded-0 border-0">
  //                 <table class="table table-borderless table-striped table-earning has-height-25">
  //                   <thead>
  //                     <tr>
  //                       <th scope="col" class="width-1"></th>
  //                       <th>
  //                         <input
  //                           id="select-all-docs"
  //                           type="checkbox"
  //                           checked={selectAll}
  //                           onChange={handleSelectAllChange}
  //                         />
  //                       </th>

  //                       <th class="">Document Name</th>
  //                       <th class="text-center">Last Accessed</th>

  //                       <th></th>

  //                       <th>Assign Document Generation Task</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody id="table-body-cat">
  //                     {generateData?.document_drafts?.map(
  //                       (obj, index) => (
  //                         <tr class="height-70" key={obj.id}>
  //                           <td>{index + 1}</td>
  //                           <td>
  //                             <div class="form-check justify-content-center">
  //                               <input
  //                                 className="form-check-input template-checkbox"
  //                                 type="checkbox"
  //                                 checked={selectedDraftDocs.some(
  //                                   (d) => d.id === obj.id
  //                                 )}
  //                                 onChange={() =>
  //                                   handleCheckboxChange_2({
  //                                     ...obj,
  //                                   })
  //                                 }
  //                               />
  //                             </div>
  //                           </td>
  //                           <td class="text-nowrap text-center">
  //                             {obj?.document_name}
  //                           </td>
  //                           <td class="text-center td-autosize">
  //                             <div class="align-items-center">
  //                               <a href="#" class="has-light-btn">
  //                                 <span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
  //                                 <span class="ml-1 text-black">
  //                                   {obj?.user_name}
  //                                 </span>
  //                               </a>
  //                             </div>
  //                             <span>{obj?.created_at}</span>
  //                           </td>

  //                           <td class="text-center">
  //                             <div class="mx-auto">
  //                               <button
  //                                 class="btn btn-primary height-25 d-flex align-items-center mb-1 width-85 mx-auto"
  //                                 onClick={() =>
  //                                   openDraftDoc({
  //                                     docId: obj.doc_id,
  //                                     draft_id: obj.template_id,
  //                                     dynamic_template_id: obj.id,
  //                                   })
  //                                 }
  //                               >
  //                                 Open{" "}
  //                                 <i class="ic ic-19 ic-generate-document ml-1"></i>
  //                               </button>
  //                               <button
  //                                 class="btn btn-primary height-25 d-flex align-items-center width-85 text-center mx-auto"
  //                                 onClick={() =>
  //                                   downloadDraftDocs({
  //                                     doc_id: obj.doc_id,
  //                                   })
  //                                 }
  //                               >
  //                                 <img
  //                                   class="ic ic-19 mx-auto"
  //                                   src="/static/bp_assets/img/pdf.svg"
  //                                 />
  //                                 Download
  //                               </button>
  //                             </div>
  //                           </td>
  //                           <td class="text-right">
  //                             <div class="d-flex align-items-center">
  //                               <div class="dropdown pl-0 p-r-5 dropdown-document w-auto ml-auto">
  //                                 <a
  //                                   class=" w-100 form-select has-no-after has-no-bg text-left d-flex align-items-center"
  //                                   href="#"
  //                                   role="button"
  //                                   id="dropdownMenuLink2-3"
  //                                   data-toggle="dropdown"
  //                                   aria-haspopup="true"
  //                                   aria-expanded="false"
  //                                 >
  //                                   Select Firm User For Task
  //                                   <span class="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
  //                                     <svg
  //                                       width="34"
  //                                       height="17"
  //                                       viewBox="0 0 34 17"
  //                                       fill="none"
  //                                       xmlns="http://www.w3.org/2000/svg"
  //                                     >
  //                                       <path
  //                                         d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
  //                                         fill="currentColor"
  //                                       ></path>
  //                                     </svg>
  //                                   </span>
  //                                 </a>
  //                                 <div
  //                                   className="dropdown-menu w-100 p-0"
  //                                   aria-labelledby="dropdownMenuLink"
  //                                   x-placement="bottom-start"
  //                                   style={{
  //                                     position: "absolute",
  //                                     transform:
  //                                       "translate3d(0px, 34px, 0px)",
  //                                     top: 0,
  //                                     left: 0,
  //                                     willChange: "transform",
  //                                   }}
  //                                 >
  //                                   <input
  //                                     type="hidden"
  //                                     id="dd-user2-3"
  //                                   />
  //                                 </div>
  //                               </div>
  //                               <button
  //                                 class="btn btn-primary height-25 d-flex align-items-center m-r-5"
  //                                 onclick="addTask2('3','undefined')"
  //                               >
  //                                 <span class="font-weight-bold pr-2 text-gold">
  //                                   +
  //                                 </span>{" "}
  //                                 Task
  //                               </button>
  //                             </div>
  //                           </td>
  //                         </tr>
  //                       )
  //                     )}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             </Tab.Pane>
  //           </Tab.Content>
  //         </div>
  //         <div className="d-flex justify-content-between">
  //           <Button
  //             variant="secondary"
  //             onClick={handleClose}
  //             className="ml-2"
  //           >
  //             Close
  //           </Button>

  //           <div className="d-flex justify-content-between space-x-5">
  //             <Button
  //               variant="primary"
  //               type="submit"
  //               onClick={() => openDocWordProcessor2({ count: "all" })}
  //               disabled={
  //                 selectedDocs?.length === 0 &&
  //                 selectedDraftDocs?.length === 0
  //               }
  //             >
  //               Open Selected Docs in Tabs
  //             </Button>

  //             <Button
  //               variant="primary"
  //               type="submit"
  //               onClick={
  //                 selectedTab === "GDFT"
  //                   ? () =>
  //                       downloadSelectedDocs(
  //                         selectedDocs,
  //                         PageEntity,
  //                         instanceId
  //                       )
  //                   : () => downloadDraftDocs(selectedDraftDocs)
  //               }
  //               disabled={
  //                 selectedDocs?.length === 0 &&
  //                 selectedDraftDocs?.length === 0
  //               }
  //             >
  //               Download Selected as Docs
  //             </Button>

  //             <Button
  //               variant="primary"
  //               type="submit"
  //               onClick={() =>
  //                 downloadSelectedPdfs(
  //                   selectedDocs,
  //                   PageEntity,
  //                   instanceId
  //                 )
  //               }
  //               disabled={
  //                 selectedDocs?.length === 0 &&
  //                 selectedDraftDocs?.length === 0
  //               }
  //             >
  //               Download Selected as PDFs
  //             </Button>

  //             <Button
  //               variant="primary"
  //               type="submit"
  //               onClick={() =>
  //                 printDocs(selectedDocs, PageEntity, instanceId)
  //               }
  //               disabled={
  //                 selectedDocs?.length === 0 &&
  //                 selectedDraftDocs?.length === 0
  //               }
  //             >
  //               Print Selected
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </Tab.Container>
  //   </div>
  //       </Modal.Body>
  //     </div>
  //   </Modal>

  // );

  return (
    <GenericModalComponent
      show={show}
      handleClose={handleClose}
      title={
        <>
          <i className="ic ic-29 ic-generate-document m-r-5"></i> Generate
          Document
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

export default GenrateDocument;
