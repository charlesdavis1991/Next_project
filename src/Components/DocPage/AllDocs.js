import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { mediaRoute } from "../../Utils/helper";
import UploadDocModal from "../../Components/DocumentRow/UploadDocModal";
import TableLoader from "../Loaders/tableLoader";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import api from "../../api/api";
import { getClientId, getCaseId } from "../../Utils/helper";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import DocsTable from "./DocsTable";
import "./TabDataStyles.css";

const AllDocs = ({ data, loading, refetchData, refetchLoading, pageView }) => {
  const { showDocumentModal, documentData } = useDocumentModal();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [uploadingSlot, setUploadingSlot] = useState({
    slotId: null,
    panelId: null,
  });

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
  const handleDocPreview = (doc) => {
    console.log("DOC DATA", doc);
    axios
      .get(
        `${origin}/api/attorney-staff/${doc?.attached_by?.id}/profile-image/`
      )
      .then((response) => {
        doc.attached_by.profile_pic_29p = mediaRoute(
          response.data.profile_image
        );
      })
      .catch((error) => {
        console.error(`Error fetching profile image: ${error}`);
      });

    showDocumentModal("document", doc.upload, doc);
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

  const [isDragging, setIsDragging] = useState(false);
  const [draggedSlotNumber, setDraggedSlotNumber] = useState("");
  // Drag and Drop functionality
  const handleDrop = async (e, slot_id, pageId, panel_id) => {
    e.preventDefault();
    setFileUploadModal(true);
    simulateProgress(setUploadProgress);
    const files = e.dataTransfer.files;
    const fileSizeInMB = files[0].size / (1024 * 1024);
    setUploadFile(files[0].name);
    const formData = new FormData();
    formData.append("file", files[0]);

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

  const [isDragginguploadingbutton, setIsDragginguploadingbutton] =
    useState(false);
  const [uploadbuttonLoadingid, setuploadbuttonLoadingid] = useState(null);

  const handleDropwithOutpanlesWithoutslots = async (
    e,
    panel,
    pageId,
    panelId
  ) => {
    e.preventDefault();
    if (panel) {
      setFileUploadModal(true);
      simulateProgress(setUploadProgress);
      setuploadbuttonLoadingid(panelId);

      const files = e.dataTransfer.files;
      const fileSizeInMB = files[0].size / (1024 * 1024);
      const formData = new FormData();
      setUploadFile(files[0].name);
      formData.append("file", files[0]);

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
        setuploadbuttonLoadingid(null);
        setFileUploadModal(false);
      }
    } else {
      setFileUploadModal(true);
      simulateProgress(setUploadProgress);
      const files = e.dataTransfer.files;
      const fileSizeInMB = files[0].size / (1024 * 1024);
      const formData = new FormData();
      formData.append("file", files[0]);
      setUploadFile(files[0].name);

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
        console.error("Failed to handle drop:", error);

        console.log(error);
      } finally {
        setIsDragginguploadingbutton(false);
        setFileUploadModal(false);
      }
    }
  };
  const unAttachedDocuments = () => {
    const treatmentPage = data?.find(
      (page) => page?.page?.name === "Treatment"
    );
    if (treatmentPage) {
      return (
        treatmentPage.page_docs?.filter(
          (document) =>
            document.document_slot === null ||
            document.document_slot?.slot_number === 0
        ) || []
      );
    }
    return [];
  };
  const handleUploadPopupwithoutSlots = (pageId) => {
    setSelectedPageId(pageId);
    setShowDocModal(true); // Show the Doc modal
  };
  const isSlotUploading = (slotId, panelId) => {
    return (
      uploadingSlot?.slotId === slotId && uploadingSlot?.panelId === panelId
    ); // Added parentheses for clarity
  };
  if (loading) {
    return <TableLoader />;
  }

  if (!data) {
    return <div className="loading-center">No data available...</div>;
  }
  const [widestWidth, setWidestWidth] = useState(0);
  const specialtyRefs = useRef([]);

  useEffect(() => {
    if (data && !loading) {
      let maxWidth = 0;
      specialtyRefs.current.forEach((ref) => {
        if (ref) {
          const width = ref.getBoundingClientRect().width;
          maxWidth = Math.max(maxWidth, width);
        }
      });
      setWidestWidth(maxWidth);
    }
  }, [data, loading]);

  return (
    <div>
      <div>
        <DocsTable
          data={data}
          specialtyRefs={specialtyRefs}
          widestWidth={widestWidth}
          handleDocPreview={handleDocPreview}
          handleDrop={handleDrop}
          handleUploadPopup={handleUploadPopup}
          isSlotUploading={isSlotUploading}
          isDragging={isDragging}
          refetchLoading={refetchLoading}
          handleDropwithOutpanlesWithoutslots={
            handleDropwithOutpanlesWithoutslots
          }
          handleUploadPopupwithoutSlots={handleUploadPopupwithoutSlots}
          isDragginguploadingbutton={isDragginguploadingbutton}
          uploadbuttonLoadingid={uploadbuttonLoadingid}
          unAttachedDocuments={unAttachedDocuments}
          loading={loading}
          refetchData={refetchData}
          pageView={pageView}
        />
        <NotesSectionDashboard />
      </div>

      <UploadDocModal
        show={showDocModal}
        handleClose={handleClose}
        slot_id={selectedSlotId}
        panel_id={selectedPanelId}
        page_id={selectedPageId}
        caseId={getCaseId()}
        clientId={getClientId()}
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

export default AllDocs;
