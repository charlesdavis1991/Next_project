import React, { useState, useRef, useEffect } from "react";
import "./DocumentSidebar.css";
import DocumentRenameComponent from "./DocumentRenameComponent";
import BottomContentSideBar from "./BottomContentSideBar";
import PropTypes from "prop-types";
import { formatDate, getCaseId, mediaRoute } from "../../../Utils/helper";
import incidentIcon from "../../../assets/images/incident.svg";
import "./BottomContentSideBar.css";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";
import RequestDocModal from "./RequestDocModal";
import { api_without_cancellation } from "../../../api/api";
import LinkDocToTaskModal from "./LinkDocToTaskModal";
import ChatDocumentModal from "./ChatDocumentModal";
import mixColorWithWhite from "../../TreatmentPage/utils/helperFn";

function toSentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function UserProfile({ clientInfo }) {
  return (
    <>
      <div className="user-profile-document-popup-img m-r-5 ic-19 d-flex align-items-center justify-content-center">
        {clientInfo?.profile_pic_29p ? (
          <img
            src={clientInfo.profile_pic_29p}
            alt="Profile avatar ic-19 d-flex align-items-center justify-content-center"
            className=""
          />
        ) : (
          <i className="ic ic-avatar ic-19 has-avatar-icon d-flex align-items-center justify-content-center"></i>
        )}
      </div>

      <span
        className="clientTabFont d-flex align-items-center height-25"
        style={{ fontSize: "14px", fontWeight: "600" }}
      >
        {clientInfo
          ? `${clientInfo.last_name}, ${clientInfo.first_name}`
          : "Client Info"}
      </span>
    </>
  );
}

UserProfile.propTypes = {
  clientInfo: PropTypes.shape({
    profile_pic_29p: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
};

function PageInfo({ page, documentSlot, panel }) {
  const { page_icon = "", name = "" } = page || {};

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "63px",
      }}
    >
      <div
        className="text-bold d-flex align-items-center"
        style={{
          height: "21px",
          fontWeight: "600",
          gap: "5px",
        }}
      >
        <span className="">
          {page_icon && (
            <img
              src={page_icon}
              className="ic ic-19 d-flex align-items-center justify-content-center"
              alt=""
            />
          )}
        </span>
        {name}
      </div>

      <div
        className="text-bold"
        style={{
          height: "21px",
          fontWeight: 600,
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {panel?.panel_name}
      </div>

      <div
        className="text-bold"
        style={{
          height: "21px",
          fontWeight: 600,
          whiteSpace: "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {documentSlot?.slot_number}. {documentSlot?.slot_name}
      </div>

      {/* {page_icon && (
        <img src={page_icon} width="19" className="ic ic-19" alt="" />
      )}

      {!panel ? (
        <p className="m-l-5 text-bold" style={{ fontWeight: "bold" }}>
          {name}: {documentSlot?.slot_number}. {documentSlot?.slot_name}
        </p>
      ) : (
        <>
          <p
            className="m-l-5 text-bold"
            style={{ fontWeight: "bold", marginBottom: 0 }}
          >
            {name}:
          </p>
          <div
            style={{
              fontWeight: 600,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
            className="m-l-5 text-bold"
          >
            {panel?.panel_name}
          </div>
          <div
            style={{
              fontWeight: 600,
            }}
            className="m-l-5 text-bold"
          >
            {documentSlot?.slot_number}. {documentSlot?.slot_name}
          </div>
        </>
      )} */}
    </div>
  );
}

PageInfo.propTypes = {
  page: PropTypes.shape({
    page_icon: PropTypes.string,
    name: PropTypes.string,
  }),
};

const DocumentModalSideBar = ({
  documentData,
  pages,
  slotsData,
  onRefetchSlotsData,
  loading,
  setSlotsData,
  setDeleteConfirmModal,
  refetchDocumentData,
}) => {
  const {
    id: docId,
    for_client: clientInfo,
    for_case: caseInfo,
    file_name,
    docDate,
    attached_by: attachUser,
    document_slot: documentSlot,
  } = documentData;

  console.log("document data", documentData);

  console.log("slots Data", caseInfo);

  useEffect;

  const matchingSlot = slotsData.find((slot) =>
    slot.page_docs?.some((doc) => doc.id === documentData.id)
  );

  console.log("slots matched", matchingSlot);

  const matchExactSlott = matchingSlot?.page_docs?.find(
    (doc) => doc.id === documentData.id
  );

  const panelWithDocument = matchingSlot?.panels?.find((panel) =>
    panel.documents?.some((doc) => doc.id === documentData?.id)
  );
  console.log("panels", panelWithDocument);

  const clientId = clientInfo?.id;
  const caseId = caseInfo?.id;
  const userId = attachUser?.id
    ? attachUser.id
    : localStorage.getItem("loggedInUser") || null;

  const [showMenuBar, setShowMenuBar] = useState(false);
  const [panelMenuBar, setPanelMenuBar] = useState(false);

  const [showDocLinkModal, setShowDocLinkModal] = useState(false);
  const handShowDocLinkModal = () => setShowDocLinkModal(true);
  const handleShowDocLinkModalClose = () => setShowDocLinkModal(false);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    chatDoc: false,
    taskLink: false,
    docReview: false,
  });
  const dropdownRefs = {
    chatDoc: useRef(null),
    taskLink: useRef(null),
    docReview: useRef(null),
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleDropdown = (dropdownName) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatMonth(month) {
    if (typeof month === "string" && month.startsWith("0")) {
      return month.slice(1);
    }

    if (typeof month === "number" && month < 10) {
      return String(month);
    }

    return String(month);
  }

  function formatDate(date) {
    if (typeof date === "string") {
      date = new Date(date);
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${formatMonth(month)}/${day}/${year}`;
  }

  const [documentPanelsData, setDocumentPanelsData] = useState(null);
  const [documentPanelsData2, setDocumentPanelsData2] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("document pnel", documentPanelsData);
  return (
    <div
      className="right-sidebar d-flex flex-column"
      style={{ width: "330px", zIndex: "1" }}
    >
      <div className="bluish-effect"></div>
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="top-content">
          <div
            className="client-name d-flex align-items-center side-bar-padding"
            style={{ height: "25px", background: "white" }}
          >
            <UserProfile clientInfo={clientInfo} />
          </div>
          <div className="basic-info m-r-0 m-l-0">
            {/* Basic info content */}
            <div
              className="tile-row w-100 p-l-5 p-r-5 d-flex align-items-center justify-content-between"
              style={{ height: "21px", background: "var(--primary-4)" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ height: "21px" }}
              >
                {caseInfo?.case_type?.casetype_icon && (
                  <span
                    className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                    style={{ marginRight: "5px" }}
                  >
                    <img
                      style={{
                        width: "19px",
                        height: "19px",
                      }}
                      src={caseInfo?.case_type?.casetype_icon}
                      alt="icon"
                    />
                  </span>
                )}

                <p className="text-black font-weight-semibold d-block">
                  {caseInfo?.case_type?.name || "N/A"}
                </p>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ height: "21px" }}
              >
                <span
                  className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                  style={{ marginRight: "5px" }}
                >
                  <img
                    src={incidentIcon}
                    className=""
                    style={{
                      width: "19px",
                      height: "19px",
                    }}
                  />
                </span>

                <p className="font-weight-semibold">
                  {caseInfo?.incident_date || "N/A"}
                </p>
              </div>
            </div>

            <DocumentRenameComponent
              initialDocumentName={file_name}
              docId={docId}
              refetchDocumentData={refetchDocumentData}
            />
            {/* Other basic info fields */}
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                background: "var(--primary-2)",
              }}
            >
              <div
                className="tile-row d-flex flex-wrap w-100 p-r-5 p-l-5 justify-content-start align-items-center"
                style={{ height: "21px", fontSize: "14px", fontWeight: "600" }}
              >
                <span className="text-black font-weight-semibold text-right pr-0">
                  {documentData.created ? formatDate(documentData.created) : ""}
                </span>
              </div>
              <div
                className="tile-row d-flex align-items-center flex-wrap w-100  p-r-5 p-l-0 justify-content-end align-items-center"
                style={{ height: "21px" }}
              >
                <span
                  className="text-lightgray text-lg"
                  style={{ paddingRight: "0px" }}
                >
                  <a className="d-flex align-items-center justify-content-end text-black">
                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5">
                      <img
                        src={attachUser?.profile_pic_29p}
                        alt="Profile avatar"
                        className="img-round"
                      />
                    </span>
                    <span
                      className="whitespace-nowrap text-black"
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {`${attachUser?.first_name || ""} ${attachUser?.last_name || ""}`}
                    </span>
                  </a>
                </span>
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-between m-b-0"
              style={{
                background: "white",
                height: "63px",
              }}
            >
              <div
                className="tile-row d-flex align-items-center justify-content-start flex-wrap w-100 align-items-center p-l-5"
                style={{
                  minHeight: "21px",
                  maxHeight: "63px",
                  overflow: "hidden",
                  overflowWrap: "break-word", // ensures wrapping inside
                  whiteSpace: "normal", // allows wrapping of long words
                }}
              >
                <PageInfo
                  page={matchingSlot?.page || {}}
                  documentSlot={matchExactSlott?.document_slot}
                  panel={panelWithDocument}
                />
              </div>
            </div>
          </div>
          <div className="">
            <span
              className="color-main text-center text-color-heading d-flex align-items-center justify-content-center document-pop-up-menu-title"
              style={{
                fontSize: "14px",
                height: "25px",
                borderRadius: "0px",
              }}
            >
              HOVER AND CLICK TO MOVE DOCUMENT
            </span>

            {loading ? (
              <div>
                <style>{`
               @keyframes shimmer {
                 0% {
                   background-position: -1000px 0;
                 }
                 100% {
                   background-position: 1000px 0;
                 }
               }
               .shimmer-effect {
                 animation: shimmer 2s infinite linear;
                 background: linear-gradient(
                   90deg,
                   transparent 0%,
                   rgba(255, 255, 255, 0.3) 50%,
                   transparent 100%
                 );
                 background-size: 1000px 100%;
               }
             `}</style>

                <ul
                  className="d-block document-pop-up-menu-sidebar"
                  style={{ paddingLeft: "0px" }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                    (index) => (
                      <li key={index} className="">
                        <a
                          className="cursor-pointer d-flex align-items-center shimmer-effect relative overflow-hidden"
                          style={{
                            height: width > 2120 ? "25px" : "25px",
                            backgroundColor:
                              index % 2 === 0
                                ? "var(--primary-2)"
                                : "var(--primary-4)",
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              animation: "shimmer 2s infinite linear",
                              background:
                                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                              backgroundSize: "1000px 100%",
                            }}
                          />
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              <ul
                className="d-block document-pop-up-menu-sidebar"
                style={{ paddingLeft: "0px" }}
              >
                {pages &&
                  pages.map((page, index) => {
                    // Find the corresponding slot data for the current page
                    const slotData = slotsData.find(
                      (slot) => slot.page.name === page.name
                    );

                    if (
                      page.is_notes_category &&
                      slotData &&
                      slotData.page_slots.length > 0
                    ) {
                      const { panels, page_slots } = slotData;

                      // If panels exist, show panels first

                      if (
                        page_slots.length > 0 &&
                        page.name === "Treatment" &&
                        page.panels
                      ) {
                        return (
                          <li
                            key={index}
                            className=""
                            onMouseEnter={() => setShowMenuBar(index)}
                            onMouseLeave={() => setShowMenuBar(null)}
                            style={{
                              position: "relative",
                            }}
                          >
                            <a
                              className="cursor-pointer d-flex align-items-center"
                              style={{
                                gap: "5px",
                                height: width > 2120 ? "21px" : "21px",
                                fontWeight: "bold",
                                paddingLeft: "5px",
                              }}
                            >
                              <img
                                src={page.page_icon ?? ""}
                                className="doc-pop-width-15px-height-15px"
                                alt=""
                              />
                              {page.name}
                              <span className="caret"></span>
                            </a>
                            <ul
                              className="document-pop-up-sidebar-menubar"
                              style={{
                                position: "absolute",
                                // left: "auto",
                                top: "auto",
                                // page.name === "Witnesses"
                                //   ? `${index * 2 + 3}%`
                                //   : "auto",
                                left: "auto",
                                minWidth: "auto",
                                transform:
                                  width > 1920
                                    ? `translate(10px, -20px)`
                                    : `translate(10px, -20px)`,
                                right: width > 1920 ? "340px" : "340px",
                                display: showMenuBar === index ? "block" : "",
                                width: "max-content",
                              }}
                            >
                              <li
                                key={index}
                                className="d-flex align-items-center justify-content-between background-white-hover-primary-four"
                                style={{
                                  // background: "white",
                                  color: "var(--primary)",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  cursor: "pointer",
                                }}
                                onClick={async () => {
                                  const previousSlotData = slotsData;
                                  const slot = page_slots.find(
                                    (slot) => slot?.slot_number === 0
                                  );
                                  const updatedDocumentData = {
                                    ...documentData,
                                    document_slot: slot ?? {},
                                  };

                                  const updatedSlotsData = slotsData.map(
                                    (currentSlot) => {
                                      if (
                                        currentSlot?.page?.id ===
                                        documentData?.document_slot?.page?.id
                                      ) {
                                        const hasDocument =
                                          currentSlot.page_docs?.some(
                                            (doc) => doc.id === documentData.id
                                          );
                                        const hasPanel =
                                          currentSlot.panels?.some((panel) =>
                                            panel.documents?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            )
                                          );

                                        if (hasDocument || hasPanel) {
                                          return {
                                            ...currentSlot,
                                            page_docs:
                                              currentSlot.page_docs?.filter(
                                                (doc) =>
                                                  doc.id !== documentData.id
                                              ) || [],
                                            panels:
                                              currentSlot.panels?.map(
                                                (panel) => ({
                                                  ...panel,
                                                  documents:
                                                    panel.documents?.filter(
                                                      (doc) =>
                                                        doc.id !==
                                                        documentData.id
                                                    ) || [],
                                                })
                                              ) || [],
                                          };
                                        }
                                      }

                                      return currentSlot;
                                    }
                                  );

                                  const updatingSlot = updatedSlotsData.map(
                                    (currentSlot) => {
                                      if (
                                        currentSlot?.page?.id === slot?.page?.id
                                      ) {
                                        return {
                                          ...currentSlot,
                                          page_docs: [
                                            ...(currentSlot.page_docs || []),
                                            updatedDocumentData,
                                          ],
                                          panels:
                                            currentSlot.panels?.map(
                                              (panel) => ({
                                                ...panel,
                                                documents: [
                                                  ...(panel.documents || []),
                                                  updatedDocumentData,
                                                ],
                                              })
                                            ) || [],
                                        };
                                      }

                                      return currentSlot;
                                    }
                                  );
                                  try {
                                    console.log(
                                      "Updating slot data",
                                      updatingSlot
                                    );
                                    setSlotsData(updatingSlot);
                                    await api_without_cancellation.post(
                                      "api/doc/attach/treatment/",
                                      {
                                        panel_id: "",
                                        slot: page_slots.find(
                                          (slot) => slot.slot_number === 0
                                        ).id,
                                        page_id: page.id,
                                        case_id: documentData?.for_case?.id,
                                        panels: true,
                                        doc_id: docId,
                                      }
                                    );
                                    if (
                                      typeof refetchDocumentData === "function"
                                    ) {
                                      await refetchDocumentData();
                                    }
                                    onRefetchSlotsData();
                                  } catch (error) {
                                    console.error(
                                      "Error attaching document to slot 0",
                                      error
                                    );
                                    setSlotsData(previousSlotData);
                                  }
                                }}
                              >
                                <span
                                  className="d-flex align-items-center whitespace-nowrap "
                                  style={{
                                    fontWeight: "bold",
                                    paddingLeft: "25px",
                                  }}
                                >
                                  <span
                                    className="m-r-5 d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "25px",
                                      height: "25px",
                                    }}
                                  >
                                    <img
                                      src={page.page_icon ?? ""}
                                      className="document-icons-width d-flex align-items-center justify-content-center cursor-pointer"
                                      alt=""
                                    />
                                  </span>
                                  {page.name} Page
                                </span>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "17px",
                                    height: "17px",
                                    color: "#19395F",
                                    transform: "rotate(180deg)",
                                    backgroundImage:
                                      showMenuBar === index
                                        ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                        : ``,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    // marginRight: "-10px",
                                  }}
                                ></span>
                              </li>
                              {page_slots.find(
                                (slot) => slot.slot_number === 0
                              ) && (
                                <li
                                  className="d-flex align-items-center background-white-hover-primary-four"
                                  style={{
                                    // padding: "0px 10px",
                                    height: "25px",
                                    padding: "0 10px",
                                    // background: "white",
                                    cursor: "pointer",
                                    color: "var(--primary)",

                                    fontWeight: "600",
                                    fontSize: "14px",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={async () => {
                                    const previousSlotData = slotsData;
                                    const slot = page_slots.find(
                                      (slot) => slot?.slot_number === 0
                                    );
                                    const updatedDocumentData = {
                                      ...documentData,
                                      document_slot: slot ?? {},
                                    };

                                    const updatedSlotsData = slotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          documentData?.document_slot?.page?.id
                                        ) {
                                          const hasDocument =
                                            currentSlot.page_docs?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            );
                                          const hasPanel =
                                            currentSlot.panels?.some((panel) =>
                                              panel.documents?.some(
                                                (doc) =>
                                                  doc.id === documentData.id
                                              )
                                            );

                                          if (hasDocument || hasPanel) {
                                            return {
                                              ...currentSlot,
                                              page_docs:
                                                currentSlot.page_docs?.filter(
                                                  (doc) =>
                                                    doc.id !== documentData.id
                                                ) || [],
                                              panels:
                                                currentSlot.panels?.map(
                                                  (panel) => ({
                                                    ...panel,
                                                    documents:
                                                      panel.documents?.filter(
                                                        (doc) =>
                                                          doc.id !==
                                                          documentData.id
                                                      ) || [],
                                                  })
                                                ) || [],
                                            };
                                          }
                                        }

                                        return currentSlot;
                                      }
                                    );

                                    const updatingSlot = updatedSlotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          slot?.page?.id
                                        ) {
                                          return {
                                            ...currentSlot,
                                            page_docs: [
                                              ...(currentSlot.page_docs || []),
                                              updatedDocumentData,
                                            ],
                                            panels:
                                              currentSlot.panels?.map(
                                                (panel) => ({
                                                  ...panel,
                                                  documents: [
                                                    ...(panel.documents || []),
                                                    updatedDocumentData,
                                                  ],
                                                })
                                              ) || [],
                                          };
                                        }

                                        return currentSlot;
                                      }
                                    );
                                    try {
                                      console.log(
                                        "Updating slot data",
                                        updatingSlot
                                      );
                                      setSlotsData(updatingSlot);
                                      await api_without_cancellation.post(
                                        "api/doc/attach/treatment/",
                                        {
                                          panel_id: "",
                                          slot: page_slots.find(
                                            (slot) => slot.slot_number === 0
                                          ).id,
                                          page_id: page.id,
                                          case_id: documentData?.for_case?.id,
                                          panels: true,
                                          doc_id: docId,
                                        }
                                      );
                                      if (
                                        typeof refetchDocumentData ===
                                        "function"
                                      ) {
                                        await refetchDocumentData();
                                      }
                                      onRefetchSlotsData();
                                    } catch (error) {
                                      console.error(
                                        "Error attaching document to slot 0",
                                        error
                                      );
                                      setSlotsData(previousSlotData);
                                    }
                                  }}
                                >
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: "100%" }}
                                  >
                                    <span
                                      className="d-flex align-items-center whitespace-nowrap "
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {/* <span
                                        className="m-r-5 d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                        }}
                                      >
                                        <img
                                          src={page.page_icon ?? ""}
                                          className="document-icons-width d-flex align-items-center justify-content-center cursor-pointer"
                                          alt=""
                                        />
                                      </span> */}
                                      Attach to {page.name} Page generally
                                    </span>
                                  </div>
                                </li>
                              )}
                              <li
                                className="d-flex align-items-center"
                                style={{
                                  // paddingLeft: "55px",
                                  height: "25px",
                                  padding: "0 10px",
                                  background: "var(--primary-15)",
                                }}
                              >
                                <span
                                  className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "var(--primary)",
                                    width: "100%",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {page?.panel_name}
                                </span>
                              </li>
                              {panels?.length === 0 && (
                                <li
                                  className="d-flex align-items-center"
                                  style={{
                                    // paddingLeft: "55px",
                                    height: "50px",
                                    padding: "0 10px",
                                    background: "var(--primary-2)",
                                  }}
                                >
                                  <span
                                    className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "14px",
                                      color: "var(--primary-25)",
                                      width: "100%",
                                      // textTransform: "capitalize",
                                    }}
                                  >
                                    {toSentenceCase(`No ${page?.panel_name}`)}
                                  </span>
                                </li>
                              )}
                              {panels.map((panel, panelIndex) => (
                                <li
                                  key={panelIndex}
                                  className="d-flex align-items-center"
                                  style={{
                                    // padding: "0px 10px",
                                    height: "25px",
                                  }}
                                  onMouseEnter={() => {
                                    setDocumentPanelsData(panel);
                                    setPanelMenuBar(panelIndex);
                                  }}
                                  onMouseLeave={() => {
                                    setDocumentPanelsData([]);
                                    setPanelMenuBar(null);
                                  }}
                                >
                                  <a
                                    className="cursor-pointer d-flex align-items-center color-grey-2"
                                    style={{ gap: "0px", width: "100%" }}
                                  >
                                    {/* <span
                                      style={{
                                        display: "inline-block",
                                        width: "17px",
                                        height: "17px",
                                        color: "#19395F",
                                        transform: "rotate(180deg)",
                                        backgroundImage:
                                          panelMenuBar === panelIndex
                                            ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                            : "",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain",
                                      }}
                                    ></span> */}
                                    <span
                                      className=" d-flex align-items-center justify-content-center"
                                      style={{
                                        fontWeight: "bold",
                                        width: "25px",
                                        height: "25px",
                                      }}
                                    >
                                      {panelIndex + 1}
                                    </span>
                                    <span
                                      className="d-flex align-items-center p-r-5 whitespace-nowrap"
                                      style={{
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        color: "black",
                                        width: "calc(100% - 25px)",
                                        background: mixColorWithWhite(
                                          panel?.specialty?.color,
                                          10
                                        ),
                                      }}
                                    >
                                      <span
                                        style={{
                                          background: panel?.specialty?.color,

                                          fontSize: "16px",
                                          fontWeight: "700",
                                          height: "25px",
                                          width: "25px",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          color: "white",
                                          marginRight: "5px",
                                        }}
                                      >
                                        {panel?.specialty?.name[0] ?? ""}
                                      </span>
                                      {panel?.panel_name
                                        ? panel.panel_name
                                        : ""}
                                    </span>
                                  </a>
                                  <ul
                                    className="document-pop-up-sidebar-menubar"
                                    style={{
                                      position: "absolute",
                                      // left: "auto",
                                      top:
                                        width < 1920
                                          ? `${panelIndex * 2 + 18}%`
                                          : `${10 + panelIndex * 2}%`,
                                      left: "auto",
                                      // top: "auto",
                                      minWidth: "250px",
                                      transform:
                                        width > 1920
                                          ? `translate(10px, -${panelIndex + 15}%)`
                                          : `translate(10px, -${panelIndex + 30}%)`,
                                      // right: "17.2%",
                                      right: "91.2%",
                                      display:
                                        panelMenuBar === panelIndex
                                          ? "block"
                                          : "",
                                      width: "max-content",
                                    }}
                                  >
                                    <li
                                      className="d-flex align-items-center"
                                      style={{
                                        padding: "0px",
                                        height: "25px",
                                      }}
                                    >
                                      <span
                                        className="d-flex align-items-center whitespace-nowrap p-r-5"
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          color: "black",
                                          width: "100%",
                                          background: documentData
                                            ? mixColorWithWhite(
                                                documentPanelsData?.specialty
                                                  ?.color,
                                                10
                                              )
                                            : "",
                                        }}
                                      >
                                        <span
                                          style={{
                                            background:
                                              documentPanelsData?.specialty
                                                ?.color,
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            height: "25px",
                                            width: "25px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            color: "white",
                                            marginRight: "5px",
                                          }}
                                        >
                                          {documentPanelsData?.specialty
                                            ?.name[0] ?? ""}
                                        </span>
                                        {documentPanelsData?.panel_name
                                          ? documentPanelsData.panel_name
                                          : ""}
                                      </span>
                                    </li>
                                    <li
                                      className="d-flex align-items-center"
                                      style={{
                                        paddingLeft: "55px",
                                        height: "25px",
                                        paddingRight: "10px",
                                        background: "var(--primary-15)",
                                      }}
                                    >
                                      <span
                                        className="d-flex align-items-center whitespace-nowrap p-r-5"
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          color: "var(--primary)",
                                          width: "100%",
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        Document Row Buttons
                                      </span>
                                    </li>
                                    {page_slots.map((slot, slotIndex) => {
                                      const docsInSlot =
                                        panel.documents?.filter(
                                          (doc) =>
                                            doc.document_slot?.slot_number ===
                                            slot?.slot_number
                                        );
                                      const handleClick = async () => {
                                        const previousSlotData = slotsData;
                                        const updatedDocumentData = {
                                          ...documentData,
                                          document_slot: slot,
                                        };
                                        const matchingSlot =
                                          previousSlotData.find((slot) =>
                                            slot.page_docs?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            )
                                          );

                                        console.log(matchingSlot);
                                        const panelWithDocument =
                                          matchingSlot?.panels?.find((panel) =>
                                            panel.documents?.some(
                                              (doc) =>
                                                doc.id === documentData?.id
                                            )
                                          );

                                        console.log(panelWithDocument);

                                        console.log(
                                          "Updated Document Data Here",
                                          updatedDocumentData
                                        );

                                        console.log(
                                          "Slots Data here",
                                          slotsData
                                        );
                                        console.log(
                                          "Slots Data here",
                                          documentData?.document_slot
                                        );

                                        const updatedSlotsData = slotsData.map(
                                          (currentSlot) => {
                                            if (
                                              currentSlot?.page?.id ===
                                              matchingSlot?.page?.id
                                            ) {
                                              const hasDocument =
                                                currentSlot.page_docs?.some(
                                                  (doc) =>
                                                    doc.id === documentData.id
                                                );
                                              const hasPanel =
                                                currentSlot.panels?.some(
                                                  (panel) =>
                                                    panel.documents?.some(
                                                      (doc) =>
                                                        doc.id ===
                                                        documentData.id
                                                    )
                                                );

                                              console.log(
                                                "Slots Data here",
                                                hasPanel
                                              );

                                              if (hasDocument || hasPanel) {
                                                console.log("hi");
                                                console.log(currentSlot);
                                                console.log(documentData.id);
                                                return {
                                                  ...currentSlot,
                                                  page_docs:
                                                    currentSlot.page_docs?.filter(
                                                      (doc) =>
                                                        doc.id !==
                                                        documentData.id
                                                    ) || [],

                                                  panels:
                                                    currentSlot.panels?.map(
                                                      (panel) => {
                                                        if (
                                                          panel.id ===
                                                          panelWithDocument?.id
                                                        ) {
                                                          return {
                                                            ...panel,
                                                            documents: [
                                                              ...(panel.documents?.filter(
                                                                (doc) =>
                                                                  doc.id !==
                                                                  documentData.id
                                                              ) || []),
                                                            ],
                                                          };
                                                        }
                                                        return panel;
                                                      }
                                                    ) || [],
                                                };
                                              }
                                            }

                                            return currentSlot;
                                          }
                                        );

                                        console.log(
                                          "Updating Here",
                                          updatedSlotsData
                                        );

                                        const updatingSlot =
                                          updatedSlotsData.map(
                                            (currentSlot) => {
                                              if (
                                                currentSlot?.page?.id ===
                                                slot?.page?.id
                                              ) {
                                                return {
                                                  ...currentSlot,
                                                  page_docs: [
                                                    ...(currentSlot.page_docs ||
                                                      []),
                                                    updatedDocumentData,
                                                  ],
                                                  panels:
                                                    currentSlot.panels?.map(
                                                      (panel) => {
                                                        if (
                                                          panel.id ===
                                                          documentPanelsData?.id
                                                        ) {
                                                          console.log(
                                                            "Hello",
                                                            panel.documents
                                                          );
                                                          console.log(
                                                            updatedDocumentData
                                                          );
                                                          return {
                                                            ...panel,
                                                            documents: [
                                                              ...(panel.documents ||
                                                                []),
                                                              updatedDocumentData,
                                                            ],
                                                          };
                                                        }
                                                        return panel;
                                                      }
                                                    ) || [],
                                                };
                                              }

                                              return currentSlot;
                                            }
                                          );

                                        try {
                                          console.log(
                                            "Updating Here 2",
                                            updatingSlot
                                          );
                                          setSlotsData(updatingSlot);
                                          await api_without_cancellation.post(
                                            "api/doc/attach/treatment/",
                                            {
                                              panel_id: panel.id,
                                              slot: slot.id,
                                              page_id: page.id,
                                              case_id:
                                                documentData?.for_case?.id,
                                              panels: true,
                                              doc_id: docId,
                                            }
                                          );
                                          if (
                                            typeof refetchDocumentData ===
                                            "function"
                                          ) {
                                            await refetchDocumentData();
                                          }
                                          onRefetchSlotsData();
                                        } catch (error) {
                                          console.error(error);
                                          setSlotsData(previousSlotData);
                                        }
                                      };

                                      return (
                                        slot.slot_number !== 0 && (
                                          <li
                                            key={slotIndex}
                                            className="d-flex align-items-center"
                                            style={{
                                              padding: "0px 10px",
                                              height: "25px",
                                              background:
                                                slotIndex % 2 === 0
                                                  ? mixColorWithWhite(
                                                      panel?.specialty?.color,
                                                      2
                                                    )
                                                  : mixColorWithWhite(
                                                      panel?.specialty?.color,
                                                      4
                                                    ),
                                              cursor:
                                                docsInSlot.length > 0
                                                  ? "default"
                                                  : "pointer",
                                            }}
                                            onClick={handleClick}
                                          >
                                            {slot.slot_number !== 0 && (
                                              <span className="d-flex align-items-center justify-content-center">
                                                {docsInSlot.length > 0 ? (
                                                  <i
                                                    className="ic ic-19 ic-file-colored cursor-pointer document-icons-width"
                                                    style={{
                                                      backgroundRepeat:
                                                        "no-repeat",
                                                    }}
                                                  ></i>
                                                ) : (
                                                  <img
                                                    src={UploadIcon}
                                                    className="document-icons-width cursor-pointer"
                                                    style={{
                                                      backgroundRepeat:
                                                        "no-repeat",
                                                    }}
                                                  />
                                                )}
                                              </span>
                                            )}
                                            {/* 
                                        {slot.slot_number === 0 && (
                                          <span className="d-flex align-items-center ml-2">
                                            <img
                                              src={page.page_icon ?? ""}
                                              className="document-icons-width  cursor-pointer m-r-5"
                                              alt=""
                                            />
                                            Attach to {page.name} Page generally
                                          </span>
                                        )} */}

                                            {slot.slot_number !== 0 && (
                                              <div
                                                className={`d-flex align-items-center whitespace-nowrap  ${
                                                  docsInSlot.length === 0
                                                    ? "color-grey-2 hoverable-text"
                                                    : ""
                                                }`}
                                                style={{
                                                  width: "calc(100% - 25px)",
                                                  fontWeight: "bold",
                                                  // height: "25px",
                                                }}
                                              >
                                                <>
                                                  <span className="ml-2 hoverable-text">
                                                    {slot.slot_number}.
                                                  </span>
                                                  <span className="ml-2 hoverable-text">
                                                    {docsInSlot.length > 0
                                                      ? docsInSlot[0].file_name
                                                      : slot.slot_name
                                                        ? slot.slot_name
                                                        : "Available"}
                                                  </span>
                                                </>
                                              </div>
                                            )}
                                          </li>
                                        )
                                      );
                                    })}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      }

                      if (page_slots.length > 0 && page.panels) {
                        return (
                          <li
                            key={index}
                            className=""
                            onMouseEnter={() => setShowMenuBar(index)}
                            onMouseLeave={() => setShowMenuBar(null)}
                            style={{
                              position: "relative",
                            }}
                          >
                            <a
                              className="cursor-pointer d-flex align-items-center"
                              style={{
                                gap: "5px",
                                height: width > 2120 ? "21px" : "21px",
                                fontWeight: "bold",
                                paddingLeft: "5px",
                              }}
                            >
                              {/* <span
                                style={{
                                  display: "inline-block",
                                  width: "17px",
                                  height: "17px",
                                  color: "#19395F",
                                  transform: "rotate(180deg)",
                                  backgroundImage:
                                    showMenuBar === index
                                      ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                      : "",
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "contain",
                                }}
                              ></span> */}
                              <img
                                src={page.page_icon ?? ""}
                                className="doc-pop-width-15px-height-15px"
                                alt=""
                              />
                              {page.name}
                              <span className="caret"></span>
                            </a>
                            <ul
                              className="document-pop-up-sidebar-menubar"
                              style={{
                                position: "absolute",
                                // left: "auto",
                                top: "auto",
                                // page.name === "Witnesses"
                                //   ? `${index * 2 + 3}%`
                                //   : "auto",
                                left: "auto",
                                minWidth: "auto",
                                transform:
                                  width > 1920
                                    ? `translate(10px, -20px)`
                                    : `translate(10px, -20px)`,
                                right: width > 1920 ? "340px" : "340px",
                                display: showMenuBar === index ? "block" : "",
                                width: "max-content",
                              }}
                            >
                              <li
                                key={index}
                                className="d-flex align-items-center justify-content-between background-white-hover-primary-four"
                                style={{
                                  // background: "white",
                                  color: "var(--primary)",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  padding: "0 10px",
                                  cursor: "pointer",
                                }}
                                onClick={async () => {
                                  const previousSlotData = slotsData;
                                  const slot = page_slots.find(
                                    (slot) => slot?.slot_number === 0
                                  );
                                  const updatedDocumentData = {
                                    ...documentData,
                                    document_slot: slot ?? {},
                                  };

                                  console.log(slot);
                                  const updatedSlotsData = slotsData.map(
                                    (currentSlot) => {
                                      if (
                                        currentSlot?.page?.id ===
                                        documentData?.document_slot?.page?.id
                                      ) {
                                        const hasDocument =
                                          currentSlot.page_docs?.some(
                                            (doc) => doc.id === documentData.id
                                          );
                                        const hasPanel =
                                          currentSlot.panels?.some((panel) =>
                                            panel.documents?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            )
                                          );

                                        if (hasDocument || hasPanel) {
                                          return {
                                            ...currentSlot,
                                            page_docs:
                                              currentSlot.page_docs?.filter(
                                                (doc) =>
                                                  doc.id !== documentData.id
                                              ) || [],
                                            panels:
                                              currentSlot.panels?.map(
                                                (panel) => ({
                                                  ...panel,
                                                  documents:
                                                    panel.documents?.filter(
                                                      (doc) =>
                                                        doc.id !==
                                                        documentData.id
                                                    ) || [],
                                                })
                                              ) || [],
                                          };
                                        }
                                      }

                                      return currentSlot;
                                    }
                                  );

                                  const updatingSlot = updatedSlotsData.map(
                                    (currentSlot) => {
                                      if (
                                        currentSlot?.page?.id === slot?.page?.id
                                      ) {
                                        return {
                                          ...currentSlot,
                                          page_docs: [
                                            ...(currentSlot.page_docs || []),
                                            updatedDocumentData,
                                          ],
                                          panels:
                                            currentSlot.panels?.map(
                                              (panel) => ({
                                                ...panel,
                                                documents: [
                                                  ...(panel.documents || []),
                                                  updatedDocumentData,
                                                ],
                                              })
                                            ) || [],
                                        };
                                      }

                                      return currentSlot;
                                    }
                                  );
                                  try {
                                    setSlotsData(updatingSlot);
                                    await api_without_cancellation.post(
                                      "api/doc/attach/treatment/",
                                      {
                                        panel_id: "",
                                        slot: page_slots.find(
                                          (slot) => slot.slot_number === 0
                                        ).id,
                                        page_id: page.id,
                                        case_id: documentData?.for_case?.id,
                                        panels: true,
                                        doc_id: docId,
                                      }
                                    );
                                    if (
                                      typeof refetchDocumentData === "function"
                                    ) {
                                      await refetchDocumentData();
                                    }
                                    onRefetchSlotsData();
                                  } catch (error) {
                                    console.error(
                                      "Error attaching document to slot 0",
                                      error
                                    );
                                    setSlotsData(previousSlotData);
                                  }
                                }}
                              >
                                <span
                                  className="cursor-pointer d-flex align-items-center"
                                  style={{
                                    gap: "5px",
                                    fontWeight: "bold",

                                    height: "25px",
                                  }}
                                >
                                  <img
                                    src={page.page_icon ?? ""}
                                    className="doc-pop-width-15px-height-15px"
                                    alt=""
                                  />
                                  {page.name} Page
                                </span>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "17px",
                                    height: "17px",
                                    color: "#19395F",
                                    transform: "rotate(180deg)",
                                    backgroundImage:
                                      showMenuBar === index
                                        ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                        : ``,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    marginRight: "-10px",
                                  }}
                                ></span>
                              </li>
                              {page_slots.find(
                                (slot) => slot.slot_number === 0
                              ) && (
                                <li
                                  className="d-flex align-items-center background-white-hover-primary-four"
                                  style={{
                                    padding: "0px 10px",
                                    height: "25px",
                                    cursor: "pointer",
                                    // background: "white",

                                    color: "var(--primary)",

                                    fontWeight: "600",
                                    fontSize: "14px",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={async () => {
                                    const previousSlotData = slotsData;
                                    const slot = page_slots.find(
                                      (slot) => slot?.slot_number === 0
                                    );
                                    const updatedDocumentData = {
                                      ...documentData,
                                      document_slot: slot ?? {},
                                    };

                                    const updatedSlotsData = slotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          documentData?.document_slot?.page?.id
                                        ) {
                                          const hasDocument =
                                            currentSlot.page_docs?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            );
                                          const hasPanel =
                                            currentSlot.panels?.some((panel) =>
                                              panel.documents?.some(
                                                (doc) =>
                                                  doc.id === documentData.id
                                              )
                                            );

                                          if (hasDocument || hasPanel) {
                                            return {
                                              ...currentSlot,
                                              page_docs:
                                                currentSlot.page_docs?.filter(
                                                  (doc) =>
                                                    doc.id !== documentData.id
                                                ) || [],
                                              panels:
                                                currentSlot.panels?.map(
                                                  (panel) => ({
                                                    ...panel,
                                                    documents:
                                                      panel.documents?.filter(
                                                        (doc) =>
                                                          doc.id !==
                                                          documentData.id
                                                      ) || [],
                                                  })
                                                ) || [],
                                            };
                                          }
                                        }

                                        return currentSlot;
                                      }
                                    );

                                    const updatingSlot = updatedSlotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          slot?.page?.id
                                        ) {
                                          return {
                                            ...currentSlot,
                                            page_docs: [
                                              ...(currentSlot.page_docs || []),
                                              updatedDocumentData,
                                            ],
                                            panels:
                                              currentSlot.panels?.map(
                                                (panel) => ({
                                                  ...panel,
                                                  documents: [
                                                    ...(panel.documents || []),
                                                    updatedDocumentData,
                                                  ],
                                                })
                                              ) || [],
                                          };
                                        }

                                        return currentSlot;
                                      }
                                    );
                                    try {
                                      setSlotsData(updatingSlot);
                                      await api_without_cancellation.post(
                                        "api/doc/attach/treatment/",
                                        {
                                          panel_id: "",
                                          slot: page_slots.find(
                                            (slot) => slot.slot_number === 0
                                          ).id,
                                          page_id: page.id,
                                          case_id: documentData?.for_case?.id,
                                          panels: true,
                                          doc_id: docId,
                                        }
                                      );
                                      if (
                                        typeof refetchDocumentData ===
                                        "function"
                                      ) {
                                        await refetchDocumentData();
                                      }
                                      onRefetchSlotsData();
                                    } catch (error) {
                                      console.error(
                                        "Error attaching document to slot 0",
                                        error
                                      );
                                      setSlotsData(previousSlotData);
                                    }
                                  }}
                                >
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: "100%" }}
                                  >
                                    <span
                                      className="d-flex align-items-center whitespace-nowrap "
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {/* <img
                                        src={page.page_icon ?? ""}
                                        className="document-icons-width cursor-pointer m-r-5"
                                        alt=""
                                      /> */}
                                      Attach to {page.name} Page generally
                                    </span>
                                  </div>
                                </li>
                              )}
                              <li
                                className="d-flex align-items-center"
                                style={{
                                  // paddingLeft: "55px",
                                  height: "25px",
                                  padding: "0 10px",
                                  background: "var(--primary-15)",
                                }}
                              >
                                <span
                                  className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "var(--primary)",
                                    width: "100%",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {page?.panel_name}
                                </span>
                              </li>
                              {panels?.length === 0 && (
                                <li
                                  className="d-flex align-items-center"
                                  style={{
                                    // paddingLeft: "55px",
                                    height: "50px",
                                    padding: "0 10px",
                                    background: "var(--primary-2)",
                                  }}
                                >
                                  <span
                                    className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "14px",
                                      color: "var(--primary-25)",
                                      width: "100%",
                                      // textTransform: "",
                                    }}
                                  >
                                    {toSentenceCase(`No ${page?.panel_name}`)}
                                  </span>
                                </li>
                              )}
                              {panels.map((panel, panelIndex) => (
                                <li
                                  key={panelIndex}
                                  className="d-flex align-items-center"
                                  style={{
                                    // padding: "0px 10px",
                                    height: "25px",
                                  }}
                                  onMouseEnter={() => {
                                    setDocumentPanelsData(panel);
                                    setPanelMenuBar(panelIndex);
                                  }}
                                  onMouseLeave={() => {
                                    setDocumentPanelsData([]);
                                    setPanelMenuBar(null);
                                  }}
                                >
                                  <a
                                    className="cursor-pointer d-flex align-items-center color-grey-2"
                                    // style={{ gap: "5px" }}
                                  >
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "17px",
                                        height: "17px",
                                        color: "#19395F",
                                        transform: "rotate(180deg)",
                                        backgroundImage:
                                          panelMenuBar === panelIndex
                                            ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                            : "",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "contain",
                                      }}
                                    ></span>
                                    <span
                                      className="ml-2"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {panelIndex + 1}.
                                    </span>
                                    <span
                                      className="ml-2 whitespace-nowrap"
                                      style={{
                                        fontWeight: "bold",
                                        color: "var(--primary)",
                                      }}
                                    >
                                      {page?.name === "Offer"
                                        ? panel?.panel_name
                                        : ""}
                                      {page?.name !== "Offer"
                                        ? panel?.specialty
                                          ? panel?.specialty.name
                                          : panel?.panel_name
                                            ? panel?.panel_name
                                            : ""
                                        : ""}
                                    </span>
                                  </a>
                                  <ul
                                    className="document-pop-up-sidebar-menubar"
                                    style={{
                                      position: "absolute",
                                      // left: "auto",
                                      top:
                                        width < 1920
                                          ? `${panelIndex * 2 + 18}%`
                                          : `${10 + panelIndex * 2}%`,
                                      left: "auto",
                                      // top: "auto",
                                      minWidth: "auto",
                                      transform:
                                        width > 1920
                                          ? `translate(10px, -${panelIndex + 15}%)`
                                          : `translate(10px, -${panelIndex + 30}%)`,
                                      // right: "17.2%",
                                      right: "91.2%",
                                      display:
                                        panelMenuBar === panelIndex
                                          ? "block"
                                          : "",
                                      width: "max-content",
                                    }}
                                  >
                                    <li
                                      className="d-flex align-items-center"
                                      style={{
                                        padding: "0px",
                                        height: "25px",
                                      }}
                                    >
                                      <span
                                        className="d-flex align-items-center whitespace-nowrap p-r-5"
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          color: "black",
                                          width: "100%",
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            height: "25px",
                                            width: "25px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            color: "black",
                                            marginRight: "5px",
                                          }}
                                        >
                                          1.
                                        </span>
                                        {documentPanelsData?.panel_name
                                          ? documentPanelsData.panel_name
                                          : ""}
                                      </span>
                                    </li>
                                    <li
                                      className="d-flex align-items-center"
                                      style={{
                                        paddingLeft: "55px",
                                        height: "25px",
                                        paddingRight: "10px",
                                        background: "var(--primary-15)",
                                      }}
                                    >
                                      <span
                                        className="d-flex align-items-center whitespace-nowrap p-r-5"
                                        style={{
                                          fontWeight: "600",
                                          fontSize: "14px",
                                          color: "var(--primary)",
                                          width: "100%",
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        Document Row Buttons
                                      </span>
                                    </li>
                                    {page_slots.map((slot, slotIndex) => {
                                      const docsInSlot =
                                        panel.documents?.filter(
                                          (doc) =>
                                            doc.document_slot?.slot_number ===
                                            slot?.slot_number
                                        );
                                      const handleClick = async () => {
                                        const previousSlotData = slotsData;
                                        const updatedDocumentData = {
                                          ...documentData,
                                          document_slot: slot,
                                        };
                                        const matchingSlot =
                                          previousSlotData.find((slot) =>
                                            slot.page_docs?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            )
                                          );

                                        console.log(matchingSlot);
                                        const panelWithDocument =
                                          matchingSlot?.panels?.find((panel) =>
                                            panel.documents?.some(
                                              (doc) =>
                                                doc.id === documentData?.id
                                            )
                                          );

                                        console.log(panelWithDocument);
                                        const updatedSlotsData = slotsData.map(
                                          (currentSlot) => {
                                            if (
                                              currentSlot?.page?.id ===
                                              matchingSlot?.page?.id
                                            ) {
                                              const hasDocument =
                                                currentSlot.page_docs?.some(
                                                  (doc) =>
                                                    doc.id === documentData.id
                                                );
                                              const hasPanel =
                                                currentSlot.panels?.some(
                                                  (panel) =>
                                                    panel.documents?.some(
                                                      (doc) =>
                                                        doc.id ===
                                                        documentData.id
                                                    )
                                                );

                                              if (hasDocument || hasPanel) {
                                                return {
                                                  ...currentSlot,
                                                  page_docs:
                                                    currentSlot.page_docs?.filter(
                                                      (doc) =>
                                                        doc.id !==
                                                        documentData.id
                                                    ) || [],
                                                  panels:
                                                    currentSlot.panels?.map(
                                                      (panel) => {
                                                        if (
                                                          panel.id ===
                                                          panelWithDocument?.id
                                                        ) {
                                                          return {
                                                            ...panel,
                                                            documents: [
                                                              ...(panel.documents?.filter(
                                                                (doc) =>
                                                                  doc.id !==
                                                                  documentData.id
                                                              ) || []),
                                                            ],
                                                          };
                                                        }
                                                        return panel;
                                                      }
                                                    ) || [],
                                                };
                                              }
                                            }

                                            return currentSlot;
                                          }
                                        );

                                        console.log(
                                          "Updating Here",
                                          updatedSlotsData
                                        );

                                        const updatingSlot =
                                          updatedSlotsData.map(
                                            (currentSlot) => {
                                              if (
                                                currentSlot?.page?.id ===
                                                slot?.page?.id
                                              ) {
                                                return {
                                                  ...currentSlot,
                                                  page_docs: [
                                                    ...(currentSlot.page_docs ||
                                                      []),
                                                    updatedDocumentData,
                                                  ],
                                                  panels:
                                                    currentSlot.panels?.map(
                                                      (panel) => {
                                                        if (
                                                          panel.id ===
                                                          documentPanelsData?.id
                                                        ) {
                                                          return {
                                                            ...panel,
                                                            documents: [
                                                              ...(panel.documents ||
                                                                []),
                                                              updatedDocumentData,
                                                            ],
                                                          };
                                                        }
                                                        return panel;
                                                      }
                                                    ) || [],
                                                };
                                              }

                                              return currentSlot;
                                            }
                                          );

                                        try {
                                          setSlotsData(updatingSlot);
                                          await api_without_cancellation.post(
                                            "api/doc/attach/treatment/",
                                            {
                                              panel_id: panel.id,
                                              slot: slot.id,
                                              page_id: page.id,
                                              case_id:
                                                documentData?.for_case?.id,
                                              panels: true,
                                              doc_id: docId,
                                            }
                                          );
                                          if (
                                            typeof refetchDocumentData ===
                                            "function"
                                          ) {
                                            await refetchDocumentData();
                                          }
                                          onRefetchSlotsData();
                                        } catch (error) {
                                          console.error(error);
                                          setSlotsData(previousSlotData);
                                        }
                                      };

                                      return (
                                        slot.slot_number !== 0 && (
                                          <li
                                            key={slotIndex}
                                            className="d-flex align-items-center"
                                            style={{
                                              padding: "0px 10px",
                                              height: "25px",
                                              cursor:
                                                docsInSlot.length > 0
                                                  ? "default"
                                                  : "pointer",
                                            }}
                                            onClick={handleClick}
                                          >
                                            {slot.slot_number !== 0 && (
                                              <span className="d-flex align-items-center justify-content-center">
                                                {docsInSlot.length > 0 ? (
                                                  <i
                                                    className="ic ic-19 ic-file-colored cursor-pointer document-icons-width"
                                                    style={{
                                                      backgroundRepeat:
                                                        "no-repeat",
                                                    }}
                                                  ></i>
                                                ) : (
                                                  <img
                                                    src={UploadIcon}
                                                    className="document-icons-width cursor-pointer"
                                                    style={{
                                                      backgroundRepeat:
                                                        "no-repeat",
                                                    }}
                                                  />
                                                )}
                                              </span>
                                            )}
                                            {/* 
                                        {slot.slot_number === 0 && (
                                          <span className="d-flex align-items-center ml-2">
                                            <img
                                              src={page.page_icon ?? ""}
                                              className="document-icons-width  cursor-pointer m-r-5"
                                              alt=""
                                            />
                                            Attach to {page.name} Page generally
                                          </span>
                                        )} */}

                                            {slot.slot_number !== 0 && (
                                              <div
                                                className={`d-flex align-items-center  ${
                                                  docsInSlot.length === 0
                                                    ? "color-grey-2 hoverable-text"
                                                    : ""
                                                }`}
                                                style={{
                                                  width: "calc(100% - 25px)",
                                                  fontWeight: "bold",
                                                  // height: "25px",
                                                }}
                                              >
                                                <>
                                                  <span className="ml-2 hoverable-text">
                                                    {slot.slot_number}.
                                                  </span>
                                                  <span className="ml-2 hoverable-text whitespace-nowrap">
                                                    {docsInSlot.length > 0
                                                      ? docsInSlot[0].file_name
                                                      : slot.slot_name
                                                        ? slot.slot_name
                                                        : "Available"}
                                                  </span>
                                                </>
                                              </div>
                                            )}
                                          </li>
                                        )
                                      );
                                    })}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      }

                      // If no panels, show page slots directly
                      if (page_slots.length > 0 && !page.panels) {
                        return (
                          <li
                            key={index}
                            className=""
                            onMouseEnter={() => setShowMenuBar(index)}
                            onMouseLeave={() => setShowMenuBar(null)}
                            style={{
                              position: "relative",
                            }}
                          >
                            <a
                              className="cursor-pointer d-flex align-items-center"
                              style={{
                                gap: "5px",
                                height: width > 2120 ? "21px" : "21px",
                                fontWeight: "bold",
                                paddingLeft: "5px",
                              }}
                            >
                              <img
                                src={page.page_icon ?? ""}
                                className="doc-pop-width-15px-height-15px"
                                alt=""
                              />
                              {page.name}
                              <span className="caret"></span>
                            </a>
                            <ul
                              className="document-pop-up-sidebar-menubar"
                              style={{
                                position: "absolute",
                                // left: "auto",
                                // top:
                                //   width < 1920
                                //     ? `${index * 2 + 30}%`
                                //     : `${10 + index * 1.5}%`,
                                left: "auto",
                                top: "auto",
                                minWidth: "auto",
                                transform:
                                  width > 1920
                                    ? `translate(10px, -20px)`
                                    : `translate(10px, -20px)`,
                                right: width > 1920 ? "340px" : "340px",
                                display: showMenuBar === index ? "block" : "",
                                width: "max-content",
                              }}
                            >
                              <li
                                key={index}
                                className="d-flex align-items-center justify-content-between background-white-hover-primary-four"
                                style={{
                                  // background: "white",
                                  color: "var(--primary)",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  padding: "0 10px",
                                  cursor: "pointer",
                                }}
                                onClick={async () => {
                                  const previousSlot = documentData;
                                  const previousSlotData = slotsData;
                                  const slot = page_slots.find(
                                    (slot) => slot?.slot_number === 0
                                  );

                                  console.log(slot);
                                  const updatedDocumentData = {
                                    ...documentData,
                                    document_slot: slot,
                                  };

                                  const matchingSlot = previousSlotData.find(
                                    (slot) =>
                                      slot.page_docs?.some(
                                        (doc) => doc.id === documentData.id
                                      )
                                  );

                                  console.log("Matching Slot:", matchingSlot);

                                  const panelWithDocument =
                                    matchingSlot?.panels?.find((panel) =>
                                      panel.documents?.some(
                                        (doc) => doc.id === documentData?.id
                                      )
                                    );

                                  console.log(panelWithDocument);

                                  const updatedSlotsData = slotsData.map(
                                    (currentSlot) => {
                                      if (
                                        currentSlot?.page?.id ===
                                        matchingSlot?.page?.id
                                      ) {
                                        const hasDocument =
                                          currentSlot.page_docs?.some(
                                            (doc) => doc.id === documentData.id
                                          );

                                        const hasPanel =
                                          currentSlot.panels?.some((panel) =>
                                            panel.documents?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            )
                                          );

                                        console.log(hasPanel);

                                        if (hasPanel) {
                                          return {
                                            ...currentSlot,
                                            page_docs:
                                              currentSlot.page_docs?.filter(
                                                (doc) =>
                                                  doc.id !== documentData.id
                                              ) || [],
                                            panels:
                                              currentSlot.panels?.map(
                                                (panel) => {
                                                  if (
                                                    panel.id ===
                                                    panelWithDocument?.id
                                                  ) {
                                                    return {
                                                      ...panel,
                                                      documents: [
                                                        ...(panel.documents?.filter(
                                                          (doc) =>
                                                            doc.id !==
                                                            documentData.id
                                                        ) || []),
                                                      ],
                                                    };
                                                  }
                                                  return panel;
                                                }
                                              ) || [],
                                          };
                                        } else if (hasDocument) {
                                          const filteredDocs =
                                            currentSlot.page_docs.filter(
                                              (doc) =>
                                                doc.id !== documentData.id
                                            );

                                          return {
                                            ...currentSlot,
                                            page_docs: filteredDocs,
                                          };
                                        }
                                      }

                                      return currentSlot;
                                    }
                                  );

                                  const updatingSlot = updatedSlotsData.map(
                                    (currentSlot) => {
                                      if (
                                        currentSlot?.page?.id === slot?.page?.id
                                      ) {
                                        return {
                                          ...currentSlot,
                                          page_docs: currentSlot.page_docs
                                            ? [
                                                ...currentSlot.page_docs,
                                                updatedDocumentData,
                                              ]
                                            : [updatedDocumentData],
                                        };
                                      }

                                      return currentSlot;
                                    }
                                  );

                                  try {
                                    setSlotsData(updatingSlot);
                                    await api_without_cancellation.post(
                                      "api/doc/attach/treatment/",
                                      {
                                        slot: slot.id,
                                        page_id: page.id,
                                        case_id: documentData?.for_case?.id,
                                        panels: false,
                                        doc_id: docId,
                                      }
                                    );
                                    if (
                                      typeof refetchDocumentData === "function"
                                    ) {
                                      await refetchDocumentData();
                                    }
                                    onRefetchSlotsData();
                                  } catch (error) {
                                    console.error(error);
                                    setSlotsData(previousSlotData);
                                  }
                                }}
                              >
                                <span
                                  className="cursor-pointer d-flex align-items-center"
                                  style={{
                                    gap: "5px",
                                    fontWeight: "bold",
                                    // paddingLeft: "10px",
                                    height: "25px",
                                  }}
                                >
                                  <img
                                    src={page.page_icon ?? ""}
                                    className="doc-pop-width-15px-height-15px"
                                    alt=""
                                  />
                                  {page.name} Page
                                </span>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "17px",
                                    height: "17px",
                                    color: "#19395F",
                                    transform: "rotate(180deg)",
                                    backgroundImage:
                                      showMenuBar === index
                                        ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                        : ``,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    marginRight: "-10px",
                                  }}
                                ></span>
                              </li>
                              {page_slots.find(
                                (slot) => slot.slot_number === 0
                              ) && (
                                <li
                                  className="d-flex align-items-center background-white-hover-primary-four"
                                  style={{
                                    padding: "0px 10px",
                                    height: "25px",
                                    cursor: "pointer",
                                    // background: "white",

                                    color: "var(--primary)",

                                    fontWeight: "600",
                                    fontSize: "14px",
                                    textTransform: "capitalize",
                                  }}
                                  onClick={async () => {
                                    const previousSlot = documentData;
                                    const previousSlotData = slotsData;
                                    const slot = page_slots.find(
                                      (slot) => slot?.slot_number === 0
                                    );

                                    console.log(slot);
                                    const updatedDocumentData = {
                                      ...documentData,
                                      document_slot: slot,
                                    };

                                    const matchingSlot = previousSlotData.find(
                                      (slot) =>
                                        slot.page_docs?.some(
                                          (doc) => doc.id === documentData.id
                                        )
                                    );

                                    console.log("Matching Slot:", matchingSlot);

                                    const panelWithDocument =
                                      matchingSlot?.panels?.find((panel) =>
                                        panel.documents?.some(
                                          (doc) => doc.id === documentData?.id
                                        )
                                      );

                                    console.log(panelWithDocument);

                                    const updatedSlotsData = slotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          matchingSlot?.page?.id
                                        ) {
                                          const hasDocument =
                                            currentSlot.page_docs?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            );

                                          const hasPanel =
                                            currentSlot.panels?.some((panel) =>
                                              panel.documents?.some(
                                                (doc) =>
                                                  doc.id === documentData.id
                                              )
                                            );

                                          console.log(hasPanel);

                                          if (hasPanel) {
                                            return {
                                              ...currentSlot,
                                              page_docs:
                                                currentSlot.page_docs?.filter(
                                                  (doc) =>
                                                    doc.id !== documentData.id
                                                ) || [],
                                              panels:
                                                currentSlot.panels?.map(
                                                  (panel) => {
                                                    if (
                                                      panel.id ===
                                                      panelWithDocument?.id
                                                    ) {
                                                      return {
                                                        ...panel,
                                                        documents: [
                                                          ...(panel.documents?.filter(
                                                            (doc) =>
                                                              doc.id !==
                                                              documentData.id
                                                          ) || []),
                                                        ],
                                                      };
                                                    }
                                                    return panel;
                                                  }
                                                ) || [],
                                            };
                                          } else if (hasDocument) {
                                            const filteredDocs =
                                              currentSlot.page_docs.filter(
                                                (doc) =>
                                                  doc.id !== documentData.id
                                              );

                                            return {
                                              ...currentSlot,
                                              page_docs: filteredDocs,
                                            };
                                          }
                                        }

                                        return currentSlot;
                                      }
                                    );

                                    const updatingSlot = updatedSlotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          slot?.page?.id
                                        ) {
                                          return {
                                            ...currentSlot,
                                            page_docs: currentSlot.page_docs
                                              ? [
                                                  ...currentSlot.page_docs,
                                                  updatedDocumentData,
                                                ]
                                              : [updatedDocumentData],
                                          };
                                        }

                                        return currentSlot;
                                      }
                                    );

                                    try {
                                      setSlotsData(updatingSlot);
                                      await api_without_cancellation.post(
                                        "api/doc/attach/treatment/",
                                        {
                                          slot: slot.id,
                                          page_id: page.id,
                                          case_id: documentData?.for_case?.id,
                                          panels: false,
                                          doc_id: docId,
                                        }
                                      );
                                      if (
                                        typeof refetchDocumentData ===
                                        "function"
                                      ) {
                                        await refetchDocumentData();
                                      }
                                      onRefetchSlotsData();
                                    } catch (error) {
                                      console.error(error);
                                      setSlotsData(previousSlotData);
                                    }
                                  }}
                                >
                                  <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: "100%" }}
                                  >
                                    <span
                                      className="d-flex align-items-center whitespace-nowrap "
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {/* <img
                                        src={page.page_icon ?? ""}
                                        className="document-icons-width cursor-pointer m-r-5"
                                        alt=""
                                      /> */}
                                      Attach to {page.name} Page generally
                                    </span>
                                  </div>
                                </li>
                              )}

                              <li
                                className="d-flex align-items-center"
                                style={{
                                  paddingLeft: "55px",
                                  height: "25px",
                                  paddingRight: "10px",
                                  background: "var(--primary-15)",
                                }}
                              >
                                <span
                                  className="d-flex align-items-center whitespace-nowrap p-r-5"
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "var(--primary)",
                                    width: "100%",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Document Row Buttons
                                </span>
                              </li>

                              {page_slots
                                .filter((slot) => slot.slot_number !== 0)
                                .map((slot, slotIndex) => {
                                  const docsInSlot = slotData.page_docs?.filter(
                                    (doc) =>
                                      doc.document_slot?.slot_number ===
                                      slot?.slot_number
                                  );

                                  const handleClick = async () => {
                                    const previousSlot = documentData;
                                    const previousSlotData = slotsData;
                                    const updatedDocumentData = {
                                      ...documentData,
                                      document_slot: slot,
                                    };

                                    const matchingSlot = previousSlotData.find(
                                      (slot) =>
                                        slot.page_docs?.some(
                                          (doc) => doc.id === documentData.id
                                        )
                                    );

                                    console.log(matchingSlot);
                                    const panelWithDocument =
                                      matchingSlot?.panels?.find((panel) =>
                                        panel.documents?.some(
                                          (doc) => doc.id === documentData?.id
                                        )
                                      );

                                    console.log(panelWithDocument);

                                    const updatedSlotsData = slotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          matchingSlot?.page?.id
                                        ) {
                                          const hasDocument =
                                            currentSlot.page_docs?.some(
                                              (doc) =>
                                                doc.id === documentData.id
                                            );

                                          const hasPanel =
                                            currentSlot.panels?.some((panel) =>
                                              panel.documents?.some(
                                                (doc) =>
                                                  doc.id === documentData.id
                                              )
                                            );

                                          console.log(hasPanel);

                                          if (hasPanel) {
                                            return {
                                              ...currentSlot,
                                              page_docs:
                                                currentSlot.page_docs?.filter(
                                                  (doc) =>
                                                    doc.id !== documentData.id
                                                ) || [],
                                              panels:
                                                currentSlot.panels?.map(
                                                  (panel) => {
                                                    if (
                                                      panel.id ===
                                                      panelWithDocument?.id
                                                    ) {
                                                      return {
                                                        ...panel,
                                                        documents: [
                                                          ...(panel.documents?.filter(
                                                            (doc) =>
                                                              doc.id !==
                                                              documentData.id
                                                          ) || []),
                                                        ],
                                                      };
                                                    }
                                                    return panel;
                                                  }
                                                ) || [],
                                            };
                                          } else if (hasDocument) {
                                            const filteredDocs =
                                              currentSlot.page_docs.filter(
                                                (doc) =>
                                                  doc.id !== documentData.id
                                              );

                                            return {
                                              ...currentSlot,
                                              page_docs: filteredDocs,
                                            };
                                          }
                                        }

                                        return currentSlot;
                                      }
                                    );

                                    const updatingSlot = updatedSlotsData.map(
                                      (currentSlot) => {
                                        if (
                                          currentSlot?.page?.id ===
                                          slot?.page?.id
                                        ) {
                                          return {
                                            ...currentSlot,
                                            page_docs: currentSlot.page_docs
                                              ? [
                                                  ...currentSlot.page_docs,
                                                  updatedDocumentData,
                                                ]
                                              : [updatedDocumentData],
                                          };
                                        }

                                        return currentSlot;
                                      }
                                    );

                                    try {
                                      setSlotsData(updatingSlot);
                                      await api_without_cancellation.post(
                                        "api/doc/attach/treatment/",
                                        {
                                          slot: slot.id,
                                          page_id: page.id,
                                          case_id: documentData?.for_case?.id,
                                          panels: false,
                                          doc_id: docId,
                                        }
                                      );
                                      if (
                                        typeof refetchDocumentData ===
                                        "function"
                                      ) {
                                        await refetchDocumentData();
                                      }
                                      onRefetchSlotsData();
                                    } catch (error) {
                                      console.error(error);
                                      setSlotsData(previousSlotData);
                                    }
                                  };

                                  return (
                                    <li
                                      key={slotIndex}
                                      className="d-flex align-items-center"
                                      style={{
                                        height: "25px",
                                        cursor:
                                          docsInSlot.length > 0
                                            ? "default"
                                            : "pointer",
                                        padding: "0px 10px",
                                      }}
                                      onClick={handleClick}
                                    >
                                      {slot.slot_number !== 0 && (
                                        <span className="d-flex align-items-center justify-content-center">
                                          {docsInSlot.length > 0 ? (
                                            <i
                                              className="ic ic-19 ic-file-colored cursor-pointer document-icons-width"
                                              style={{
                                                backgroundRepeat: "no-repeat",
                                              }}
                                            ></i>
                                          ) : (
                                            <img
                                              src={UploadIcon}
                                              className="document-icons-width cursor-pointer"
                                              style={{
                                                backgroundRepeat: "no-repeat",
                                              }}
                                            />
                                          )}
                                        </span>
                                      )}

                                      {/* {slot.slot_number === 0 && (
                                      <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "100%",
                                        }}
                                      >
                                        <span
                                          className="d-flex align-items-center whitespace-nowrap "
                                          style={{ fontWeight: "bold" }}
                                        >
                                        
                                          Attach to {page.name} Page generally
                                        </span>
                                      </div>
                                    )} */}

                                      {slot.slot_number !== 0 && (
                                        <div
                                          className={`d-flex align-items-center  ${
                                            docsInSlot.length === 0
                                              ? "color-grey-2 hoverable-text"
                                              : ""
                                          }`}
                                          style={{
                                            width: "calc(100% - 25px)",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <>
                                            <span className="ml-2 hoverable-text">
                                              {slot.slot_number}.
                                            </span>
                                            <span className="ml-2 hoverable-text whitespace-nowrap">
                                              {docsInSlot.length > 0
                                                ? docsInSlot[0].file_name
                                                : slot.slot_name
                                                  ? slot.slot_name
                                                  : "Available"}
                                            </span>
                                          </>
                                        </div>
                                      )}
                                    </li>
                                  );
                                })}
                            </ul>
                          </li>
                        );
                      }
                    }

                    return null;
                  })}

                {pages?.length === 0 &&
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                    (index) => (
                      <li key={index} className="">
                        <a
                          className="cursor-pointer d-flex align-items-center justify-content-center shimmer-effect relative overflow-hidden"
                          style={{
                            height: width > 2120 ? "25px" : "25px",
                            backgroundColor:
                              index % 2 === 0
                                ? "var(--primary-2)"
                                : "var(--primary-4)",
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              animation: "shimmer 2s infinite linear",
                              background:
                                "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                              backgroundSize: "1000px 100%",
                            }}
                          >
                            {index === 7 && (
                              <span
                                style={{
                                  color: "var(--primary-50)",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                }}
                              >
                                Attach Document To Case First
                              </span>
                            )}
                          </div>
                        </a>
                      </li>
                    )
                  )}
              </ul>
            )}
          </div>
        </div>
        <div
          className="d-flex flex-column"
          style={{ gap: height <= 900 ? "0px" : "75px" }}
        >
          <div
            className=""
            style={{
              display: height <= 900 ? "flex" : "block",
              justifyContent: height <= 900 ? "space-between" : "initial",
              background: "white",
              padding: "5px",
            }}
          >
            {/* Chat Document Link Dropdown */}

            <div className="tile-row w-100 m-b-5  center-content my-auto">
              <div className="dropdown  d-flex" ref={dropdownRefs.chatDoc}>
                <button
                  className={`btn height-25 bottom-sidebar-buttons-things  dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn ${dropdownOpen.chatDoc ? "show" : ""}`}
                  type="button"
                  // onClick={() => toggleDropdown("chatDoc")}
                  onClick={handleShow}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen.chatDoc}
                >
                  {/* <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span> */}
                  <span className="ic-19 d-flex align-items-center justify-content-center">
                    <i className="ic ic-19 ic-chat-3d d-flex align-items-cente justify-content-center"></i>
                  </span>
                  {height <= 900 ? "Chat Doc" : "Send Document Link by Chat"}
                </button>
                {dropdownOpen.chatDoc && (
                  <div className="dropdown-menu show">
                    {/* Add dropdown items here */}
                  </div>
                )}
              </div>
            </div>

            {/* Link Doc to Task Dropdown */}

            <div className="tile-row w-100 m-b-5  center-content my-auto">
              <div className="dropdown d-flex" ref={dropdownRefs.taskLink}>
                <button
                  className={`btn height-25 bottom-sidebar-buttons-things  dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn ${dropdownOpen.taskLink ? "show" : ""}`}
                  type="button"
                  // onClick={() => toggleDropdown("taskLink")}
                  onClick={handShowDocLinkModal}
                >
                  {/* <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span> */}
                  <span className="ic-19 d-flex align-items-center justify-content-center">
                    <i className="ic ic-19 ic-file-colored cursor-pointer img-19px d-flex align-items-center justify-content-center"></i>
                  </span>
                  {height <= 900 ? "Task Link" : "Link Document to Task"}
                </button>
                {dropdownOpen.taskLink && (
                  <div className="dropdown-menu show">
                    {/* Add dropdown items here */}
                  </div>
                )}
              </div>
            </div>

            {/* Request Document Review Button */}

            <div className="tile-row w-100 m-b-5 center-content my-auto">
              <div className="dropdown d-flex" ref={dropdownRefs.docReview}>
                <button
                  className={`btn height-25 bottom-sidebar-buttons-things  dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn ${dropdownOpen.docReview ? "show" : ""}`}
                  type="button"
                  onClick={toggleModal}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen.docReview}
                >
                  {/* <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span> */}
                  <span className="ic-19 d-flex align-items-center justify-content-center">
                    <img
                      src="https://simplefirm-bucket.s3.amazonaws.com/static/images/to-do-icon-color_PyU3ldW.svg"
                      className="ic ic-19cursor-pointer img-19px d-flex align-items-center justify-content-center"
                    />
                  </span>

                  {height <= 900 ? "Review" : "Request Document Review Task"}
                </button>
              </div>
            </div>
          </div>
          <BottomContentSideBar
            docId={docId}
            caseId={caseId}
            clientId={clientId}
            setDeleteConfirmModal={setDeleteConfirmModal}
            refetchDocumentData={refetchDocumentData}
          />
        </div>
      </div>
      <RequestDocModal
        selectedDoc={docId}
        isOpen={isModalOpen}
        caseInfo={caseInfo}
        onConfirm={toggleModal}
        onClose={toggleModal}
      />
      <LinkDocToTaskModal
        showModal={showDocLinkModal}
        handleClose={handleShowDocLinkModalClose}
        userId={userId}
        caseId={caseId}
        docId={docId}
        clientId={clientId}
      />
      <ChatDocumentModal
        showModal={showModal}
        caseId={caseId}
        userId={userId}
        caseInfo={caseInfo}
        clientId={clientId}
        handleClose={handleClose}
      />
    </div>
  );
};

DocumentModalSideBar.propTypes = {
  documentData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    for_client: PropTypes.object,
    for_case: PropTypes.shape({
      case_type: PropTypes.shape({
        name: PropTypes.string,
        casetype_icon: PropTypes.string,
      }),
      incident_date: PropTypes.string,
    }),
    file_name: PropTypes.string,
    docDate: PropTypes.string,
    attached_by: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      profile_pic_29p: PropTypes.string,
    }),
    document_slot: PropTypes.object,
  }).isRequired,
  pages: PropTypes.array.isRequired,
  slotsData: PropTypes.array.isRequired,
};

export default DocumentModalSideBar;
