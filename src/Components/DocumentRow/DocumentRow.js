import React, { useEffect, useState } from "react";
import axios from "axios";
import UploadDocModal from "./UploadDocModal";
import { useSelector } from "react-redux";
// import { useDocumentModal } from "../DocumentModal/DocumentModalContext";
import { getToken, mediaRoute } from "../../Utils/helper";
import ButtonLoader from "../Loaders/ButtonLoader";
import api from "../../api/api";
import { getClientId, getCaseId } from "../../Utils/helper";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import "./document-row.css";

const DocumentRow = ({ clientProvider, page }) => {
  const accessToken = getToken();
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const { showDocumentModal } = useDocumentModal();
  const handleDocPreview = (doc) => {
    showDocumentModal("document", mediaRoute(doc.upload), doc);
  };
  const [processedPageSlots, setprocessedPageSlots] = useState([]);
  // const pages = useSelector((state) => state.caseData?.pages);
  const pages = useSelector((state) => state?.allPages?.allPages);

  const [pageId, setPageId] = useState(null);
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState("");

  const fetchprocessedPageSlots = async () => {
    
    try {
      if (page === "Client" || page === "Case" || page === "Accident") {
        const response = await axios.get(
          origin +
            "/api/get-processed-page-slots/" +
            clientProvider +
            "/" +
            page +
            "/" +
            getClientId() +
            "/" 
        );
        const slicedData =
          response?.data?.length > 0 ? response.data.slice(0, 8) : [];
        setprocessedPageSlots(slicedData);
      } else {
        const response = await axios.get(
          origin +
            "/api/get-processed-page-slots/" +
            clientProvider.id +
            "/" +
            page +
            "/" +
            getClientId() +
            "/" 
        );
        const slicedData =
          response?.data?.length > 0 ? response.data.slice(0, 8) : [];
        setprocessedPageSlots(slicedData);
      }
    } catch (error) {
      // console.log("Failed to fetch tabsPage:", error);
    }
  };

  useEffect(() => {
    fetchprocessedPageSlots();
    const filteredPages =
      pages.length > 0 && pages.filter((obj) => obj?.name === page);
    if (filteredPages?.length > 0) {
      const page = filteredPages[0];
      setPageId(page.id);
    } else {
      // console.log("No page found with the specified name");
    }
  }, []);

  const simulateProgress = (setUploadProgress) => {
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 3;
      setUploadProgress(progress);
      // Stop once we reach 100%
      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 250); // 300ms delay between increments
  };

  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneralUplaoding, setIsGeneralUplaoding] = useState(false);
  const [draggedSlotNumber, setDraggedSlotNumber] = useState("");
  const handleUploadPopup = (slotId, panelId, pageId) => {
    setSelectedSlotId(slotId);
    setSelectedPanelId(panelId);
    setShowDocModal(true); // Show the Doc modal
  };

  const handleClose = () => {
    fetchprocessedPageSlots();
    setShowDocModal(false); // Hide the Doc modal
  };

  // Drag and Drop functionality
  const handleDrop = async (e, slot_id) => {
    e.preventDefault();
    setFileUploadModal(true);
    simulateProgress(setUploadProgress);
    const files = e.dataTransfer.files;
    setUploadFile(files[0].name);
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const response = await axios.post(
        `${origin}/api/upload_doc/${getClientId()}/${getCaseId()}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: accessToken,
          },
        }
      );
      const docId = response.data.docId;
      await axios.post(
        `${origin}/api/doc/attach/treatment/`,
        {
          panel_id: clientProvider.id,
          slot: slot_id,
          page_id: pageId,
          case_id: getCaseId(),
          panels: true,
          doc_id: docId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        }
      );
      await fetchprocessedPageSlots();
      // setIsDragging(false)
    } catch (error) {
      // console.log(error);
    } finally {
      setFileUploadModal(false);
    }
  };
  const handleGeneralUploadToThePageDrop = async (e) => {
    e.preventDefault();
    setFileUploadModal(true);
    setUploadProgress(0);
    const files = e.dataTransfer.files;
    const formData = new FormData();
    if (files.length == 1) {
      for (let index = 0; index < files.length; index++) {
        simulateProgress(setUploadProgress);
        formData.append("file", files[index]);
        try {
          const response = await axios.post(
            `${origin}/api/upload_doc/${getClientId()}/${getCaseId()}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: accessToken,
              },
            }
          );
          const docId = response.data.docId;
          await axios.post(
            `${origin}/api/doc/attach/treatment/`,
            {
              panel_id: clientProvider.id,
              slot: "",
              page_id: pageId,
              case_id: getCaseId(),
              panels: true,
              doc_id: docId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: accessToken,
              },
            }
          );
        } catch (error) {
          // console.log(error);
        }
      }
    } else {
      for (let index = 0; index < files.length; index++) {
        formData.append("file", files[index]);
        try {
          const response = await axios.post(
            `${origin}/api/upload_doc/${getClientId()}/${getCaseId()}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: accessToken,
              },
            }
          );
          const docId = response.data.docId;
          await axios.post(
            `${origin}/api/doc/attach/treatment/`,
            {
              panel_id: clientProvider.id,
              slot: "",
              page_id: pageId,
              case_id: getCaseId(),
              panels: true,
              doc_id: docId,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: accessToken,
              },
            }
          );
          setUploadProgress((prevCount) => prevCount + 100 / files.length);
        } catch (error) {
          // console.log(error);
        }
      }
    }
    await fetchprocessedPageSlots();
    setFileUploadModal(false);
    setUploadProgress(0);
  };

  // console.log('processedPageSlots', processedPageSlots[0], clientProvider.id);
  return (
    <div className="row no-gutters flex-row position-relative p-r-5 p-md-r-0 height-25 m-b-5 m-t-5 document-row-wrapping-below-1230px">
      <div className="col p-0">
        <div className="d-md-flex justify-content-start w-100">
          <div className="icon-text-boxes d-flex flex-wrap w-100 e-template-row height-25">
            {processedPageSlots.map((processedPageSlot, index) => (
              <React.Fragment key={processedPageSlot.page_slot.id}>
                {processedPageSlot.doc ? (
                  <div
                    className="col-12 col-md-3 col-xl icon-text-box text-center height-25 font-weight-semibold cursor-pointer btn-hover-document-row"
                    id="no-vertical-border"
                    style={{
                      borderColor: "var(--primary)",
                      backgroundColor: "var(--primary-10)",
                      color: "var(--primary)",
                      border: "1px solid var(--primary)",
                      maxWidth: "255px",
                    }}
                    onClick={() => handleDocPreview(processedPageSlot.doc)}
                  >
                    <p className="date">{processedPageSlot.doc.created}</p>
                    <span className="icon-wrap">
                      <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                    </span>
                    {processedPageSlot.page_slot.slot_name ? (
                      <p className="name">
                        {processedPageSlot.page_slot.slot_number}.{" "}
                        {processedPageSlot.page_slot.slot_name}
                      </p>
                    ) : (
                      <p className="name">
                        {processedPageSlot.page_slot.slot_number}.{" "}
                        {processedPageSlot.doc.file_name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    // onDrop={()=> handleDrop(event,processedPageSlot.page_slot.id)}
                    onDrop={(e) =>
                      handleDrop(e, processedPageSlot.page_slot.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-{processedPageSlot.page_slot.id}-{clientProvider.id}-{page2.id} height-25 font-weight-semibold btn-hover-document-row cursor-pointer"
                    id="no-vertical-border"
                    style={{
                      borderColor: "var(--primary)",
                      backgroundColor: "var(--primary-10)",
                      color: "var(--primary)",
                      border: "1px solid var(--primary)",
                      maxWidth: "255px",
                    }}
                    onClick={() =>
                      handleUploadPopup(
                        processedPageSlot.page_slot.id,
                        clientProvider.id,
                        2
                      )
                    }
                  >
                    <>
                      <span className="icon-wrap">
                        <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                      </span>
                      {processedPageSlot.page_slot.slot_name ? (
                        <p className="name text-lg-grey">
                          {processedPageSlot.page_slot.slot_number}.{" "}
                          {processedPageSlot.page_slot.slot_name}
                        </p>
                      ) : (
                        <p className="name text-lg-grey">
                          {processedPageSlot.page_slot.slot_number}. Available
                        </p>
                      )}
                    </>
                  </div>
                )}
              </React.Fragment>
            ))}

            <UploadDocModal
              show={showDocModal}
              handleClose={handleClose}
              slot_id={selectedSlotId}
              panel_id={selectedPanelId}
              page_id={pageId}
              caseId={currentCase?.id}
              clientId={client?.id}
              handleDocumentUpload={handleClose}
              // refetchData={() => console.log("refetch data")}
            />
            <div
              className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25  font-weight-semibold btn-hover-document-row cursor-pointer"
              onDrop={(e) => handleGeneralUploadToThePageDrop(e)}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => handleUploadPopup("", clientProvider.id, 2)}
              style={{
                borderColor: "var(--primary)",
                backgroundColor: "var(--primary-10)",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
              }}
            >
              <div className="upload-icon border-0 rounded-0 bg-transparent dropzone-{page2.id}-{clientProvider.id}">
                <div className="d-flex align-items-center width-inherit">
                  <>
                    <span className="font-weight-bold text-gold h5 m-0 pr-2">
                      +
                    </span>
                    <span className="text-lg-grey name">
                      Upload Document to Page
                    </span>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DocumentUploadModal
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        show={fileUploadModal}
        onHide={() => setFileUploadModal(false)}
      />
    </div>
  );
};

export default DocumentRow;
