import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { useDocumentModal } from "../../Components/DocumentModal/DocumentModalContext";
import { mediaRoute } from "../../Utils/helper";
import UploadDocModal from "../../Components/DocumentRow/UploadDocModal";
import TableLoader from "../Loaders/tableLoader";
import { getClientId, getCaseId } from "../../Utils/helper";
import api from "../../api/api";
import ButtonLoader from "../Loaders/ButtonLoader";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import {
  DetailedEmptyCard,
  DetailedUploadCard,
  DetailedUploadCardNoLoader,
  DetailedUploadCardWithoutPanelsWithoutSlots,
  DetailedViewCard,
} from "./DetailedViewCards";
import {
  DefaultEmptyCard,
  DefaultUploadCard,
  DefaultUploadCardNoLoader,
  DefaultUploadCardWithoutPanelsWithoutSlots,
  DefaultViewCard,
  DefaultViewCard2,
} from "./defaultViewCard";
import {
  UpdatedEmptyCard,
  UpdatedUploadCard,
  UpdatedUploadCardNoLoader,
  UpdatedUploadCardWithoutPanelsWithoutSlots,
  UpdatedViewCard,
} from "./UpdatedViewCards";

const TabData = ({
  activeTab,
  data,
  loading,
  all,
  refetchData,
  refetchLoading,
  pageView,
}) => {
  console.log("data from tabdata:", data);
  const { showDocumentModal, documentData } = useDocumentModal();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = getCaseId();
  const client = getClientId();
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedPanelId, setSelectedPanelId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [ispanlename, setispanlename] = useState(false);

  // State for handling modal and upload progress
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState("");
  const [isAttachedDocs, setIsAttachedDocs] = useState({});
  const [isAttachedDocs2, setIsAttachedDocs2] = useState({});
  useEffect(() => {
    data?.page_slots?.map((slot, index) => {
      const attachedDocs =
        all === true
          ? data?.page_docs?.filter(
              (doc) =>
                doc?.document_slot?.id === slot?.id &&
                doc?.document_slot?.slot_number !== 0
            )
          : data?.data?.filter(
              (doc) =>
                doc?.document_slot?.id === slot?.id &&
                doc?.document_slot?.slot_number !== 0
            );
      if (attachedDocs?.length > 0)
        setIsAttachedDocs({ [data?.page?.name]: true });
    });

    getPanelsArray().map((panel) => {
      data?.page_slots?.slice(0, 9).map((slot, index) => {
        const attachedDocs =
          all === true
            ? panel?.documents?.filter(
                (doc) => doc?.document_slot?.id === slot?.id
              )
            : panel?.documents?.filter(
                (doc) => doc?.document_slot?.id === slot?.id
              );
        if (attachedDocs?.length > 0)
          setIsAttachedDocs2({ [data?.page?.name]: true });
      });
    });
  }, [data]);
  const handleUploadPopup = (slotId, itemId, pageId) => {
    setSelectedSlotId(slotId);
    setSelectedPageId(pageId);
    setShowDocModal(true); // Show the Doc modal
  };
  const handleUploadPopupwithoutSlots = (pageId) => {
    setSelectedPageId(pageId);
    setShowDocModal(true); // Show the Doc modal
  };
  const handleUploadPopupwithpanles = (slotId, panelId, pageId) => {
    setSelectedSlotId(slotId);
    setSelectedPanelId(panelId);
    setSelectedPageId(pageId);
    setShowDocModal(true);
  };
  const handleDocPreview = (doc) => {
    console.log(`Previewing document with ID: ${doc?.id}`);
    console.log("DOC DATA", doc);
    console.log("DOC Upload URL", mediaRoute(doc.upload));
    axios
      .get(`${origin}/api/attorney-staff/${doc.attached_by?.id}/profile-image/`)
      .then((response) => {
        doc.attached_by.profile_pic_29p = mediaRoute(
          response.data.profile_image
        );
      })
      .catch((error) => {
        console.error(`Error fetching profile image: ${error}`);
      });
    if (activeTab == "unsorted") {
      showDocumentModal("document", doc.upload, doc);
    } else {
      showDocumentModal("document", doc.upload, doc);
    }
  };

  const handleClose = () => {
    setShowDocModal(false); // Hide the Doc modal
    setSelectedSlotId(null);
    setSelectedPanelId(null);
    setSelectedPageId(null);
  };

  const addDocumentHandler = () => {
    setShowDocModal(false); // Hide the Doc modal
    setSelectedSlotId(null);
    setSelectedPanelId(null);
    setSelectedPageId(null);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isDragginguploadingbutton, setIsDragginguploadingbutton] =
    useState(false);
  const [draggedSlotNumber, setDraggedSlotNumber] = useState("");
  const [uploadingSlot, setUploadingSlot] = useState({
    slotId: null,
    panelId: null,
  });
  // Drag and Drop functionality
  const simulateProgress = (setUploadProgress) => {
    let progress = 0;

    const intervalId = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      // Stop once we reach 100%
      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 300); // 300ms delay between increments
  };
  const handleDrop = async (e, slot_id, pageId) => {
    e.preventDefault();
    setFileUploadModal(true);
    simulateProgress(setUploadProgress); // Simulate gradual progress
    setDraggedSlotNumber(slot_id);
    const files = e.dataTransfer.files;
    const fileSizeInMB = files[0].size / (1024 * 1024);
    setUploadFile(files[0].name);
    const formData = new FormData();
    formData.append("file", files[0]);
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

    try {
      await api.post("api/doc/attach/treatment/", {
        slot: slot_id,
        page_id: pageId,
        case_id: getCaseId(),
        panels: false,
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
  const [uploadbuttonLoadingid, setuploadbuttonLoadingid] = useState(null);
  const handleDropwithpanles = async (e, slot_id, pageId, panel_id) => {
    e.preventDefault();
    setFileUploadModal(true);
    simulateProgress(setUploadProgress); // Simulate gradual progress

    setUploadingSlot({ slotId: slot_id, panelId: panel_id });
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
  const handleDropwithOutpanlesWithoutslots = async (
    e,
    panel,
    pageId,
    panelId
  ) => {
    e.preventDefault();
    if (panel) {
      setFileUploadModal(true);
      simulateProgress(setUploadProgress); // Simulate gradual progress
      setuploadbuttonLoadingid(panelId);

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
          page_id: pageId,
          case_id: getCaseId(),
          doc_id: docId,
          file_size: fileSizeInMB,
        });
        await refetchData();
      } catch (error) {
        console.log(error);
      } finally {
        setFileUploadModal(false);
        setuploadbuttonLoadingid(null);
      }
    } else {
      setFileUploadModal(true);
      const files = e.dataTransfer.files;
      const fileSizeInMB = files[0].size / (1024 * 1024);
      const formData = new FormData();
      simulateProgress(setUploadProgress);
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
        console.log("check error " + isSlotUploading(slot_id, panel_id));
        console.log("check error " + isDragging);
        console.log("check error " + refetchLoading);
      } catch (error) {
        console.error("Failed to handle drop:", error);

        console.log(error);
      } finally {
        setFileUploadModal(false);
      }
    }
  };
  function getPanelName(panel) {
    console.log("hello", panel?.for_client);
    if (!panel || !data || !data.page) {
      return " ";
    }
    // if (data.page.name === "Offer") {
    //   return panel?.panel_name || " ";
    // } else if (data.page.name === "Litigation") {
    //   return (
    //     (panel.event_type_id?.litigation_event_type || " ") +
    //     " " +
    //     (panel.name || " ")
    //   );
    // } else if (data.page.name === "Insurance") {
    //   return (
    //     (panel.insurance_type?.name || " ") +
    //     " For Client " +
    //     (panel.for_client?.first_name || " ") +
    //     " " +
    //     (panel.for_client?.last_name || " ")
    //   );
    // } else if (data.page.name === "Defendants") {
    //   const panel_name =
    //     panel?.defendantType_name === "Private Individual"
    //       ? `${panel?.first_name ? panel?.first_name : " "} ${panel?.last_name ? panel?.last_name : " "}`
    //       : panel?.entity_name
    //         ? panel?.entity_name
    //         : " ";
    //   return panel_name;
    // } else if (data.page.name === "Reports") {
    //   return (
    //     (panel?.reporter_firstname || " ") +
    //     " " +
    //     (panel?.reporter_lastname || " ") +
    //     " " +
    //     (panel?.title || " ") +
    //     " " +
    //     (panel?.report_typeID?.name || " ")
    //   );
    // } else if (data.page.name === "Employment") {
    //   return panel?.employer_name || " ";
    // } else if (data.page.name === "Experts") {
    //   return (panel?.first_name || " ") + " " + (panel?.last_name || " ");
    // } else if (data.page.name === "Loans") {
    //   return panel?.contact_name || " ";
    // } else if (data.page.name === "Insurance") {
    //   return (
    //     (panel?.party_first_name || " ") +
    //     " For Client " +
    //     (panel?.party_middle_name || " ") +
    //     " " +
    //     (panel?.party_last_name || " ")
    //   );
    // } else {

    // }
    return panel.panel_name || "No Name";
  }
  const getPanelsArray = () => {
    if (!data?.page_slots || data?.page_slots.length === 0) {
      return data?.panels && data.panels.length > 0 ? [data.panels[0]] : [];
    } else {
      return data?.panels || [];
    }
  };
  const isSlotUploading = (slotId, panelId) => {
    return (
      uploadingSlot?.slotId === slotId && uploadingSlot?.panelId === panelId
    ); // Added parentheses for clarity
  };
  if (loading) {
    return <TableLoader />;
  }
  const unAttachedDocuments = () => {
    console.log("Data ==> Unattached Docs", data);
    return all
      ? data?.page_docs?.filter(
          (document) =>
            document.document_slot === null ||
            document.document_slot?.slot_number === 0
        )
      : data?.data?.filter(
          (document) =>
            document.document_slot === null ||
            document.document_slot?.slot_number === 0
        );
    // ?.filter((document) => document.document_slot === null);
  };

  if (!data) {
    return <div className="loading-center">No Data</div>; // Centered loading indicator
  }

  if (
    // (data?.page?.panels === true && !data?.panels) ||
    // (data?.page?.panels === false &&
    activeTab !== "unsorted" &&
    (!data?.panels || data?.panels.length === 0)
  ) {
    return (
      <>
        {!all && (
          <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
            <div class="panel-icon" style={{ marginRight: "0px !important" }}>
              <img
                src={data?.page?.page_icon}
                // height={19}
                // width={19}
                className="ic ic-19 d-flex align-items-center justify-content-center"
              />
            </div>
            <div
              className="panel-color"
              style={{
                background: "var(--primary)",
                left: "25px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{ height: 0, width: "10px", height: "max-content" }}
              />
              <h4
                className="d-flex align-items-center  m-l-5"
                style={{ color: "white" }}
              >
                <small className="font-weight-600 anti-skew">
                  {data?.page?.name}
                </small>
              </h4>
            </div>
          </div>
        )}
        <div>
          <div>
            {data?.page_slots?.length === 0 && (
              <div className="d-flex">
                <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
                  <div
                    className="col-auto p-0 text-white"
                    style={{
                      marginLeft: "34px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Nothing Added
                  </div>
                </div>
              </div>
            )}
            <div className="row no-gutters flex-row position-relative p-md-r-0 m-t-5">
              <div className="col p-0">
                {(isAttachedDocs[data?.page?.name] ||
                  isAttachedDocs2[data?.page?.name] ||
                  pageView === "default") && (
                  <div
                    className={`d-md-flex justify-content-start w-100 ${pageView === "default" && "m-b-5"}`}
                  >
                    <div
                      className="icon-text-boxes d-flex flex-wrap w-100 e-template-row "
                      style={{
                        marginRight: pageView === "default" ? "5px" : 0,
                        height:
                          pageView === "detailed"
                            ? "347px"
                            : pageView === "default"
                              ? "auto"
                              : `auto`,
                        ...(all &&
                          pageView === "detailed" && { marginBottom: "5px" }),
                      }}
                    >
                      {data?.page_slots?.map((slot, index) => {
                        const attachedDocs =
                          all === true
                            ? data?.page_docs?.filter(
                                (doc) =>
                                  doc?.document_slot?.id === slot?.id &&
                                  doc?.document_slot?.slot_number !== 0
                              )
                            : data?.data?.filter(
                                (doc) =>
                                  doc?.document_slot?.id === slot?.id &&
                                  doc?.document_slot?.slot_number !== 0
                              );
                        return (
                          <React.Fragment key={slot.id}>
                            {attachedDocs?.length > 0
                              ? attachedDocs.map((doc) =>
                                  pageView === "default" ? (
                                    <DefaultViewCard
                                      key={doc.id}
                                      doc={doc}
                                      slot={slot}
                                      handleDocPreview={handleDocPreview}
                                    />
                                  ) : pageView === "detailed" ? (
                                    <DetailedViewCard
                                      key={doc.id}
                                      doc={doc}
                                      slot={slot}
                                      handleDocPreview={handleDocPreview}
                                    />
                                  ) : (
                                    <UpdatedViewCard
                                      key={doc.id}
                                      doc={doc}
                                      slot={slot}
                                      handleDocPreview={handleDocPreview}
                                    />
                                  )
                                )
                              : slot.slot_number !== 0 &&
                                pageView === "default" && (
                                  <DefaultEmptyCard
                                    slot={slot}
                                    page={data}
                                    item={null}
                                    isDragging={isDragging}
                                    refetchLoading={refetchLoading}
                                    handleDrop={handleDrop}
                                    handleUploadPopup={handleUploadPopup}
                                    isSlotUploading={isSlotUploading}
                                  />
                                  //  :
                                  // pageView === 'detailed' ?
                                  //   <DetailedEmptyCard
                                  //     slot={slot}
                                  //     page={data}
                                  //     item={null}
                                  //     isDragging={isDragging}
                                  //     refetchLoading={refetchLoading}
                                  //     handleDrop={handleDrop}
                                  //     handleUploadPopup={handleUploadPopup}
                                  //     isSlotUploading={isSlotUploading}
                                  //   /> :
                                  //   <UpdatedEmptyCard
                                  //     slot={slot}
                                  //     page={data}
                                  //     item={null}
                                  //     isDragging={isDragging}
                                  //     refetchLoading={refetchLoading}
                                  //     handleDrop={handleDrop}
                                  //     handleUploadPopup={handleUploadPopup}
                                  //     isSlotUploading={isSlotUploading}
                                  //     style={((!all && !(pageView === 'detailed')) && { height: '100%' })}
                                  //   />
                                )}
                          </React.Fragment>
                        );
                      })}

                      {/* {data?.page_slots?.map((slot, index) => {
                        const emptyWindows =
                          all === true
                            ? data?.page_docs?.filter(
                              (doc) => doc?.document_slot?.id === slot?.id
                            )
                            : data?.data?.filter(
                              (doc) => doc?.document_slot?.id === slot?.id
                            );
                        return pageView === "default" ||
                          emptyWindows?.length > 0 ? null : (
                          <div style={{ flex: 1 }} key={slot.id} />
                        );
                      })} */}
                      <UploadDocModal
                        show={showDocModal}
                        handleClose={handleClose}
                        slot_id={selectedSlotId}
                        page_id={selectedPageId}
                        caseId={currentCase}
                        clientId={client?.id}
                        isDocumentTab={true}
                        handleDocumentUpload={addDocumentHandler}
                        refetchLoading={refetchLoading}
                        refetchData={refetchData}
                      />

                      {data?.page_slots?.length === 0 ? (
                        pageView === "default" ? (
                          <DefaultUploadCard
                            page={data}
                            item={{ id: 0 }}
                            isDragginguploadingbutton={
                              isDragginguploadingbutton
                            }
                            uploadbuttonLoadingid={0}
                            handleDropwithOutpanlesWithoutslots={null}
                            handleUploadPopupwithoutSlots={null}
                          />
                        ) : pageView === "detailed" ? (
                          <DetailedUploadCard
                            page={data}
                            item={{ id: 0 }}
                            isDragginguploadingbutton={
                              isDragginguploadingbutton
                            }
                            uploadbuttonLoadingid={0}
                            handleDropwithOutpanlesWithoutslots={null}
                            handleUploadPopupwithoutSlots={null}
                          />
                        ) : (
                          <UpdatedUploadCard
                            page={data}
                            item={{ id: 0 }}
                            isDragginguploadingbutton={
                              isDragginguploadingbutton
                            }
                            uploadbuttonLoadingid={0}
                            handleDropwithOutpanlesWithoutslots={null}
                            handleUploadPopupwithoutSlots={null}
                          />
                        )
                      ) : pageView === "default" ? (
                        <DefaultUploadCard
                          page={data}
                          item={{ id: 0 }}
                          isDragginguploadingbutton={isDragginguploadingbutton}
                          uploadbuttonLoadingid={0}
                          handleDropwithOutpanlesWithoutslots={
                            handleDropwithOutpanlesWithoutslots
                          }
                          handleUploadPopupwithoutSlots={
                            handleUploadPopupwithoutSlots
                          }
                        />
                      ) : pageView === "detailed" ? (
                        <DetailedUploadCard
                          page={data}
                          item={{ id: 0 }}
                          isDragginguploadingbutton={isDragginguploadingbutton}
                          uploadbuttonLoadingid={0}
                          handleDropwithOutpanlesWithoutslots={
                            handleDropwithOutpanlesWithoutslots
                          }
                          handleUploadPopupwithoutSlots={
                            handleUploadPopupwithoutSlots
                          }
                        />
                      ) : (
                        <UpdatedUploadCard
                          page={data}
                          item={{ id: 0 }}
                          isDragginguploadingbutton={isDragginguploadingbutton}
                          uploadbuttonLoadingid={0}
                          handleDropwithOutpanlesWithoutslots={
                            handleDropwithOutpanlesWithoutslots
                          }
                          handleUploadPopupwithoutSlots={
                            handleUploadPopupwithoutSlots
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
                {/* Un Attached Document Row */}
                {unAttachedDocuments()?.length > 0 && (
                  <>
                    {pageView === "default" && (
                      <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
                        <div
                          className="panel-color"
                          style={{
                            background: "var(--primary)",
                            left: "25px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              height: 0,
                              width: "10px",
                              height: "max-content",
                            }}
                          />
                          <h4
                            className="d-flex align-items-center  m-l-5"
                            style={{ color: "white" }}
                          >
                            <small className="font-weight-600 anti-skew">
                              Unattached Documents
                            </small>
                          </h4>
                        </div>
                      </div>
                    )}
                    <div
                      // className="w-100 m-t-5 unattached-documents-container"
                      className={`w-100 unattached-documents-container ${(!all || pageView === "default") && " m-t-5"}`}
                      style={{
                        marginRight: "5px",
                        justifyContent: "end",
                        paddingRight: 0,
                        height: "auto",
                        ...(pageView !== "default" && {
                          display: "flex",
                          justifyContent: "flex-start",
                          flexWrap: "wrap",
                        }),
                      }}
                    >
                      {unAttachedDocuments()?.map((document) =>
                        pageView === "default" ? (
                          <DefaultViewCard2
                            key={document.id}
                            doc={document}
                            slot={undefined}
                            handleDocPreview={handleDocPreview}
                          />
                        ) : pageView === "detailed" ? (
                          <DetailedViewCard
                            key={document.id}
                            doc={document}
                            slot={document?.document_slot}
                            handleDocPreview={handleDocPreview}
                            modifiedView={true}
                          />
                        ) : (
                          <UpdatedViewCard
                            key={document.id}
                            doc={document}
                            slot={document?.document_slot}
                            handleDocPreview={handleDocPreview}
                            modifiedView={true}
                          />
                        )
                      )}
                    </div>
                  </>
                )}
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
      </>
    );
  }

  return (
    <>
      {activeTab == "unsorted" && (
        <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
          <div class="panel-icon" style={{ marginRight: "0px !important" }}>
            <i
              // src="https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg"
              // height={19}
              // width={19}
              className="ic ic-19 ic-file-colored d-flex align-items-center justify-content-center"
            ></i>
          </div>
          <div
            className="panel-color"
            style={{
              background: "var(--primary)",
              left: "25px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ height: 0, width: "10px", height: "max-content" }} />
            <h4
              className="d-flex align-items-center  m-l-5"
              style={{ color: "white" }}
            >
              <small className="font-weight-600 anti-skew">Unsorted</small>
            </h4>
          </div>
        </div>
      )}
      {!all && activeTab !== "unsorted" && (
        <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
          <div class="panel-icon" style={{ marginRight: "0px !important" }}>
            <img
              src={data?.page?.page_icon}
              // height={19}
              // width={19}
              className="ic ic-19 d-flex align-items-center justify-content-center"
            />
          </div>
          <div
            className="panel-color"
            style={{
              background: "var(--primary)",
              left: "25px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ height: 0, width: "10px", height: "max-content" }} />
            <h4
              className="d-flex align-items-center  m-l-5"
              style={{ color: "white" }}
            >
              <small className="font-weight-600 anti-skew">
                {data?.page?.name}
              </small>
            </h4>
          </div>
        </div>
      )}

      {getPanelsArray().map((panel) => (
        <div>
          <div>
            <div>
              {/* <div className="tab-data-sub-heading-hero"></div> */}

              <div className="d-flex align-items-center w-100 skewed-primary-gradient-custom p-5-x alpha  ">
                <div
                  className="col-auto p-0 text-white"
                  style={{
                    marginLeft: "34px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {data?.page_slots?.length === 0 || data?.page_slots === null
                    ? "Nothing Added"
                    : getPanelName(panel).trim() === ""
                      ? "No Name"
                      : getPanelName(panel)}
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters flex-row position-relative  p-md-r-0   m-t-5">
            <div className="col p-0">
              {(isAttachedDocs[data?.page?.name] ||
                isAttachedDocs2[data?.page?.name] ||
                pageView === "default") && (
                <div className="d-md-flex justify-content-start w-100">
                  <div
                    className={`icon-text-boxes d-flex flex-wrap w-100 e-template-row ${pageView === "default" && " m-b-5"}`}
                    style={{
                      marginRight: pageView === "default" ? "5px" : 0,
                      height: "auto",
                    }}
                  >
                    {data?.page_slots?.slice(0, 9).map((slot, index) => {
                      const attachedDocs =
                        all === true
                          ? panel?.documents?.filter(
                              (doc) => doc?.document_slot?.id === slot?.id
                            )
                          : panel?.documents?.filter(
                              (doc) => doc?.document_slot?.id === slot?.id
                            );
                      return (
                        <React.Fragment key={slot.id}>
                          {attachedDocs?.length > 0
                            ? attachedDocs.map((doc) =>
                                pageView === "default" ? (
                                  <DefaultViewCard
                                    key={doc.id}
                                    doc={doc}
                                    slot={slot}
                                    handleDocPreview={handleDocPreview}
                                  />
                                ) : pageView === "detailed" ? (
                                  <DetailedViewCard
                                    key={doc.id}
                                    doc={doc}
                                    slot={slot}
                                    handleDocPreview={handleDocPreview}
                                  />
                                ) : (
                                  <UpdatedViewCard
                                    key={doc.id}
                                    doc={doc}
                                    slot={slot}
                                    handleDocPreview={handleDocPreview}
                                  />
                                )
                              )
                            : slot.slot_number !== 0 &&
                              pageView === "default" && (
                                <DefaultEmptyCard
                                  slot={slot}
                                  page={data}
                                  item={panel}
                                  isDragging={isDragging}
                                  refetchLoading={refetchLoading}
                                  handleDrop={handleDropwithpanles}
                                  handleUploadPopup={
                                    handleUploadPopupwithpanles
                                  }
                                  isSlotUploading={isSlotUploading}
                                />
                              )}
                        </React.Fragment>
                      );
                    })}

                    {data?.page_slots?.length === 0 ||
                    data?.page_slots === null ? (
                      isDragginguploadingbutton &&
                      panel?.id === uploadbuttonLoadingid ? (
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer">
                          <div className="d-flex align-items-center justify-content-center">
                            <ButtonLoader />
                            <span
                              style={{
                                marginLeft: "5px",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              Uploading...
                            </span>
                          </div>
                        </div>
                      ) : pageView === "default" ? (
                        <DefaultUploadCardNoLoader
                          page={data}
                          item={panel}
                          handleDropwithOutpanlesWithoutslots={
                            handleDropwithOutpanlesWithoutslots
                          }
                          handleUploadPopupwithoutSlots={
                            handleUploadPopupwithoutSlots
                          }
                        />
                      ) : pageView === "detailed" ? (
                        <DetailedUploadCardNoLoader
                          page={data}
                          item={panel}
                          handleDropwithOutpanlesWithoutslots={
                            handleDropwithOutpanlesWithoutslots
                          }
                          handleUploadPopupwithoutSlots={
                            handleUploadPopupwithoutSlots
                          }
                        />
                      ) : (
                        <UpdatedUploadCardNoLoader
                          page={data}
                          item={panel}
                          handleDropwithOutpanlesWithoutslots={
                            handleDropwithOutpanlesWithoutslots
                          }
                          handleUploadPopupwithoutSlots={
                            handleUploadPopupwithoutSlots
                          }
                        />
                      )
                    ) : isDragginguploadingbutton &&
                      panel?.id === uploadbuttonLoadingid ? (
                      <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer">
                        <div className="d-flex align-items-center justify-content-center">
                          <ButtonLoader />
                          <span
                            style={{
                              marginLeft: "5px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            Uploading...
                          </span>
                        </div>
                      </div>
                    ) : pageView === "default" ? (
                      <DefaultUploadCardNoLoader
                        page={data}
                        item={panel}
                        handleDropwithOutpanlesWithoutslots={
                          handleDropwithOutpanlesWithoutslots
                        }
                        handleUploadPopupwithoutSlots={
                          handleUploadPopupwithoutSlots
                        }
                      />
                    ) : pageView === "detailed" ? (
                      <DetailedUploadCardNoLoader
                        page={data}
                        item={panel}
                        handleDropwithOutpanlesWithoutslots={
                          handleDropwithOutpanlesWithoutslots
                        }
                        handleUploadPopupwithoutSlots={
                          handleUploadPopupwithoutSlots
                        }
                      />
                    ) : (
                      <UpdatedUploadCardNoLoader
                        page={data}
                        item={panel}
                        handleDropwithOutpanlesWithoutslots={
                          handleDropwithOutpanlesWithoutslots
                        }
                        handleUploadPopupwithoutSlots={
                          handleUploadPopupwithoutSlots
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {(data?.panels === null || data?.panels?.length === 0) &&
      data?.page_slots?.length > 0 ? (
        pageView === "default" ? (
          <DefaultUploadCardWithoutPanelsWithoutSlots
            page={data}
            isDragginguploadingbutton={isDragginguploadingbutton}
            handleDropwithOutpanlesWithoutslots={
              handleDropwithOutpanlesWithoutslots
            }
            handleUploadPopupwithoutSlots={handleUploadPopupwithoutSlots}
          />
        ) : pageView === "detailed" ? (
          <DetailedUploadCardWithoutPanelsWithoutSlots
            page={data}
            isDragginguploadingbutton={isDragginguploadingbutton}
            handleDropwithOutpanlesWithoutslots={
              handleDropwithOutpanlesWithoutslots
            }
            handleUploadPopupwithoutSlots={handleUploadPopupwithoutSlots}
          />
        ) : (
          <UpdatedUploadCardWithoutPanelsWithoutSlots
            page={data}
            isDragginguploadingbutton={isDragginguploadingbutton}
            handleDropwithOutpanlesWithoutslots={
              handleDropwithOutpanlesWithoutslots
            }
            handleUploadPopupwithoutSlots={handleUploadPopupwithoutSlots}
          />
        )
      ) : (
        ""
      )}

      <UploadDocModal
        show={showDocModal}
        handleClose={handleClose}
        slot_id={selectedSlotId}
        page_id={selectedPageId}
        caseId={currentCase}
        clientId={client?.id}
        isDocumentTab={selectedPanelId ? false : true}
        handleDocumentUpload={addDocumentHandler}
        refetchLoading={refetchLoading}
        refetchData={refetchData}
        panel_id={selectedPanelId}
      />
      {unAttachedDocuments()?.length > 0 && (
        <>
          {pageView === "default" && (
            <div className="m-l-7 m-b-5 flex-nowrap align-items-center">
              <div
                className="panel-color"
                style={{
                  background: "var(--primary)",
                  left: "25px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ height: 0, width: "10px", height: "max-content" }}
                />
                <h4
                  className="d-flex align-items-center  m-l-5"
                  style={{ color: "white" }}
                >
                  <small className="font-weight-600 anti-skew">
                    Unattached Documents
                  </small>
                </h4>
              </div>
            </div>
          )}

          <div
            className="w-100 m-t-5 unattached-documents-container"
            style={{
              marginRight: "5px",
              justifyContent: "end",
              height: "auto",
              ...(pageView !== "default" && {
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }),
            }}
          >
            {unAttachedDocuments()?.map((document) =>
              pageView === "default" ? (
                <DefaultViewCard2
                  key={document.id}
                  doc={document}
                  slot={undefined}
                  handleDocPreview={handleDocPreview}
                />
              ) : pageView === "detailed" ? (
                <DetailedViewCard
                  key={document.id}
                  doc={document}
                  slot={document?.document_slot}
                  handleDocPreview={handleDocPreview}
                  modifiedView={true}
                />
              ) : (
                <UpdatedViewCard
                  key={document.id}
                  doc={document}
                  slot={document?.document_slot}
                  handleDocPreview={handleDocPreview}
                  modifiedView={true}
                />
              )
            )}
          </div>
        </>
      )}
      <DocumentUploadModal
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        show={fileUploadModal}
        onHide={() => setFileUploadModal(false)}
      />
    </>
  );
};

export default TabData;
