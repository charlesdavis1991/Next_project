import React, { useState, useRef, useEffect } from "react";
import "../../common/CustomModal/CustomModalSidebar/CustomDocumentSidebar.css";
// import DocumentRenameComponent from "./DocumentRenameComponent";
// import BottomContentSideBar from "./BottomContentSideBar";
import PropTypes from "prop-types";
import { getCaseId, mediaRoute } from "../../../Utils/helper";
import "../../common/CustomModal/CustomModalSidebar/CustomModalBottomContentSidebar.css";
import api from "../../../api/api";
import {
  PageInfo,
  UserProfile,
} from "../../common/CustomModal/CustomModalSidebar/ModalSideBarUserInfo";
import CustomRenameComponent from "../../common/CustomModal/CustomModalSidebar/CustomRenameComponent";
import BottomContentSideBar from "../../common/CustomModal/CustomModalSidebar/CustomModalBottomContentSidebar";
import incidentIcon from "../../../assets/images/incident.svg";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

// function UserProfile({ clientInfo }) {
//   return (
//     <>
//       <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
//         {clientInfo?.profile_pic_29p && (
//           <img
//             src={mediaRoute(clientInfo.profile_pic_29p)}
//             alt="Profile avatar"
//             className="invisible"
//           />
//         )}
//       </span>
//       <span className="ml-2 text-black white-space-nowrap user_name">
//         <span className="clientTabFont d-block">
//           <p
//             style={{
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               width: "170px",
//               whiteSpace: "nowrap",
//             }}
//             title={
//               clientInfo
//                 ? `${clientInfo.last_name}, ${clientInfo.first_name}`
//                 : "Client Info"
//             }
//           >
//             {clientInfo
//               ? `${clientInfo.last_name}, ${clientInfo.first_name}`
//               : "Client Info"}
//           </p>
//         </span>
//       </span>
//     </>
//   );
// }

// UserProfile.propTypes = {
//   clientInfo: PropTypes.shape({
//     profile_pic_29p: PropTypes.string,
//     first_name: PropTypes.string,
//     last_name: PropTypes.string,
//   }),
// };

// function PageInfo({ page }) {
//   const { page_icon = "", name = "" } = page || {};

//   return (
//     <>
//       {page_icon && <img src={mediaRoute(page_icon)} width="20" alt="" />}
//       <p className="ml-1">{name}</p>
//     </>
//   );
// }

// PageInfo.propTypes = {
//   page: PropTypes.shape({
//     page_icon: PropTypes.string,
//     name: PropTypes.string,
//   }),
// };
const DocumentModalSideBar = ({
  documentData,
  documentURL,
  photoListData,
  hideDocumentModal,
  currentFetchPhotoListData,
  imageRef,
  documentURLfordownload,
}) => {
  const {
    id: docId,
    for_client: clientInfo,
    for_case: caseInfo,
    title: file_name,
    date_uploaded: dateUploaded,
    docDate,
    attached_by: attachUser,
    photo_slot: documentSlot,
    for_page: for_page,
  } = documentData;
  const [showAttach, setShowAttach] = useState(false);
  const [showSubAttach, setShowSubAttach] = useState(false);
  const [showMenuBar, setShowMenuBar] = useState(false);
  const [panelMenuBar, setPanelMenuBar] = useState(false);

  function getPageIcons(photoData, photoSlot) {
    let result = {};
    photoData?.forEach((photo) => {
      const pageId = photo?.page?.id;
      if (photoSlot?.photo_slot?.page === pageId) {
        result = {
          name: photo?.page?.name,
          page_icon: photo?.page?.page_icon,
        };
      }
    });

    return result;
  }

  console.log("Document Data ===>", getPageIcons(photoListData, documentData));

  console.log("Document Data ===>", documentSlot);

  const handleAttachToPage = (slot_id, page_id) => {
    api
      .post("api/attach_photo_to_page/", {
        photo_id: docId,
        slot_id,
        page_id,
      })
      .then((response) => {
        console.log("Attach to page response", response);
        hideDocumentModal();
      })
      .catch((error) => {
        console.error("Failed to attach to page", error);
      });
  };
  const handleAttachToPageWithpanels = (slot_id, page_id, panel_id) => {
    const relatedInstance = photoListData?.find(
      (page) => page.page.id === page_id
    );
    console.log("Related Instance: ", relatedInstance);
    const relatedPanel = relatedInstance?.panels.find((panel) =>
      panel.photos.some((photo) => photo.id === docId)
    );
    console.log("Related Panel: ", relatedPanel);
    api
      .post("api/attach_photo_to_page/", {
        photo_id: docId,
        slot_id,
        page_id,
        panel_id: panel_id,
        prev_panel_id: relatedPanel ? relatedPanel.id : "",
      })
      .then((response) => {
        console.log("Attach to page response", response);
        hideDocumentModal();
      })
      .catch((error) => {
        console.error("Failed to attach to page", error);
      });
  };
  function getPanelName(panel, data) {
    if (!panel || !data) {
      return " ";
    }

    if (data.page.name === "Litigation") {
      return (
        (panel.event_type_id?.litigation_event_type || " ") +
        " " +
        (panel.name || " ")
      );
    } else if (data.page.name === "Insurance") {
      return (
        (panel.insurance_type?.name || " ") +
        " For Client " +
        (panel.for_client?.first_name || " ") +
        " " +
        (panel.for_client?.last_name || " ")
      );
    } else if (data.page.name === "Defendants") {
      return (panel?.first_name || " ") + " " + (panel?.last_name || " ");
    } else if (data.page.name === "Reports") {
      return (
        (panel?.reporter_firstname || " ") +
        " " +
        (panel?.reporter_lastname || " ") +
        " " +
        (panel?.title || " ") +
        " " +
        (panel?.report_typeID?.name || " ")
      );
    } else if (data.page.name === "Employment") {
      return panel?.employer_name || " ";
    } else if (data.page.name === "Experts") {
      return (panel?.first_name || " ") + " " + (panel?.last_name || " ");
    } else if (data.page.name === "Loans") {
      return panel?.contact_name || " ";
    } else if (data.page.name === "Insurance") {
      return (
        (panel?.party_first_name || " ") +
        " For Client " +
        (panel?.party_middle_name || " ") +
        " " +
        (panel?.party_last_name || " ")
      );
    } else {
      return panel.panel_name || "No Name";
    }
  }

  const [error, setError] = useState(null);
  const handleDownload = async (docId) => {
    console.log("docId", docId);
    console.log("documentURL", documentURL);
    console.log("file_name", file_name);
    console.log("imageRef", imageRef);
    try {
      console.log("documentURL", documentURLfordownload);
      const response = await axios.get(
        `${mediaRoute(documentURL)}?timestamp=${new Date()}`,
        {
          responseType: "blob",
          withCredentials: false,
        }
      );
      const blob = response?.data;
      const objectURL = URL.createObjectURL(blob);
      saveAs(objectURL, file_name);
    } catch (error) {
      console.error("Error fetching or processing the blob:", error);
    }
  };
  const handleDelete = async (docId) => {
    console.log("docId ==>", docId);
    try {
      await handleDownload(docId);
      const response = await api.delete(
        `api/delete-photo-doc/?photo_id=${docId}`,
        {
          check: "Delete",
        }
      );
      const data = response.data;
      console.log("photo delete data", data);

      hideDocumentModal();
      // window.location.reload(true);
    } catch (error) {
      console.error(
        "Failed to delete photo:",
        error.response?.data || error.message
      );
    }
  };
  const handlePrint = useReactToPrint({
    content: () => imageRef.current,
  });

  const buttonData = [
    {
      label: "Print",
      className:
        "btn btn-primary col height-25 d-flex align-items-center justify-content-center",
      onClick: handlePrint,
    },
    {
      label: "Download",
      className:
        "btn btn-primary download-btn col height-25 d-flex align-items-center justify-content-center",
      onClick: handleDownload,
    },
    {
      label: "Email",
      className:
        "btn btn-primary col height-25 d-flex align-items-center justify-content-center",
      onClick: () => console.log("Email"),
    },

    {
      label: "Delete",
      className:
        "btn btn-secondary height-25 d-flex align-items-center justify-content-center flex-g",
      onClick: handleDelete,
    },
  ];

  return (
    <div className="right-sidebar d-flex flex-column" style={{ width: "25%" }}>
      <div className="bluish-effect"></div>
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="top-content">
          <div
            className="client-name d-flex align-items-center side-bar-padding"
            style={{ height: "35px" }}
          >
            <UserProfile clientInfo={clientInfo} />
          </div>
          {/* <div className="basic-info m-b-20 p-r-10 p-l-10">
            <div className="tile-row w-100">
              <span className="text-black font-weight-semibold d-block">
                {caseInfo?.case_type?.name || "N/A"}
              </span>
              <p className="text-darker">
                <span className="d-inline-block text-dark-grey mr-1">
                  Photo Name:{" "}
                </span>
                {file_name || "N/A"}
              </p>
              <p className="text-darker">
                <span className="d-inline-block text-dark-grey mr-1">
                  Upload:{" "}
                </span>
                {dateUploaded || "N/A"}
              </p>
            </div>

            <CustomRenameComponent
              initialDocumentName={file_name}
              docId={docId}
              apiEndpoint="/api/rename-photo-doc/"
              isPdf={false}
            />

            <div className="tile-row d-flex align-items-center flex-wrap w-100 mt-3">
              <PageInfo page={for_page || {}} />
            </div>
          </div> */}
          <div className="basic-info m-r-5 m-l-5">
            <div
              className="tile-row w-100 p-l-5 p-r-5 d-flex justify-content-between align-items-center"
              style={{ height: "21px" }}
            >
              <div className="d-flex align-items-center">
                {caseInfo?.case_type?.casetype_icon && (
                  <span
                    className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                    style={{ marginRight: "10px" }}
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
              <div className="d-flex align-items-center">
                <span
                  className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center"
                  style={{ marginRight: "10px" }}
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
            <CustomRenameComponent
              initialDocumentName={file_name}
              docId={docId}
              apiEndpoint="/api/rename-photo-doc/"
              isPdf={false}
            />
            <div
              className="tile-row d-flex flex-wrap w-100 p-r-5 p-l-5 justify-content-between m-t-5 align-items-center"
              style={{ height: "21px" }}
            >
              <span className="text-lightgray text-lg">Attached:</span>
            </div>
            <div
              className="tile-row d-flex align-items-center flex-wrap w-100  p-r-5 p-l-5 justify-content-between align-items-center"
              style={{ height: "21px" }}
            >
              <span className="d-flex align-items-center">
                <p className="text-lightgray text-lg p-r-5">By: </p>
                <a
                  href="#"
                  className="d-flex align-items-center text-black  font-weight-semibold text-right pr-0"
                >
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                    <img
                      src={attachUser?.profile_pic_29p}
                      alt="Profile avatar"
                      className="img-round"
                    />
                  </span>
                  <span className="ml-2 text-black">
                    {`${attachUser?.first_name || ""} ${attachUser?.last_name || ""}`}
                  </span>
                </a>
              </span>
              <span className="text-black font-weight-semibold text-right pr-0 d-flex justify-content-end">
                {docDate || dateUploaded.split("T")[0]}
              </span>
            </div>
            <div
              className="tile-row d-flex align-items-center flex-wrap w-100 m-t-5 align-items-center"
              style={{ height: "21px" }}
            >
              <PageInfo page={getPageIcons(photoListData, documentData)} />
            </div>
            {/* <div className="tile-row d-flex flex-wrap w-100"></div> */}
            <div
              className="tile-row d-flex flex-wrap w-100 align-items-center"
              style={{ height: "21px" }}
            >
              <p className="doc-pop-margin-left-2-5rem m-l-5">
                <span className="counter">
                  {documentSlot?.slot_number || ""}.
                </span>
                {documentSlot?.slot_name || ""}
              </p>
            </div>
          </div>
          <div>
            <span
              className="color-main text-center text-color-heading d-flex align-items-center justify-content-center document-pop-up-menu-title"
              style={{
                fontSize: "14px",
                height: "21px",
                borderRadius: "0px",
              }}
            >
              CLICK TO MOVE PHOTOS
            </span>
          </div>
          <ul
            className="d-block document-pop-up-menu-sidebar"
            style={{ paddingLeft: "0px" }}
          >
            {photoListData.map((photoData, idx) => {
              console.log(photoData.page.name === "Injury");
              if (
                photoData.page.name === "Injury" &&
                photoData.page.panels === false
              ) {
                return (
                  <li
                    key={idx}
                    className=""
                    onMouseEnter={() => setShowMenuBar(idx)}
                    onMouseLeave={() => setShowMenuBar(null)}
                  >
                    <a
                      className="cursor-pointer d-flex align-items-center"
                      style={{ gap: "5px" }}
                    >
                      <img
                        src={photoData.page.page_icon ?? ""}
                        className="doc-pop-width-15px-height-15px mr-1 m-l-5"
                        alt=""
                      />
                      {photoData.page.name}
                      <span className="caret"></span>
                    </a>
                    <ul
                      className="document-pop-up-sidebar-menubar"
                      style={{
                        position: "absolute",
                        left: "auto",
                        top: "auto",
                        minWidth: "217px",
                        transform: "auto",
                        right: "25%",
                        display: showMenuBar === idx ? "block" : "",
                        width: "auto",
                      }}
                    >
                      <li
                        className="d-flex align-items-center"
                        style={{ padding: "5px 5px", cursor: "pointer" }}
                        onClick={() =>
                          handleAttachToPage("", photoData.page.id)
                        }
                      >
                        <span className="d-flex align-items-center ml-2">
                          <img
                            src={photoData.page.page_icon ?? ""}
                            className="document-icons-width  cursor-pointer m-r-5"
                            alt=""
                          />
                          Attach to {photoData.page.name} Page generally
                        </span>
                      </li>
                      {/* <div
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          width: "19px",
                          height: "19px",
                          color: "#19395F",
                          transform: "rotate(180deg)",
                          backgroundImage:
                            showMenuBar === idx
                              ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                              : "",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      ></div> */}
                    </ul>
                  </li>
                );
              }
              if (photoData.page.panels === true) {
                return (
                  <li
                    key={idx}
                    className=""
                    onMouseEnter={() => setShowMenuBar(idx)}
                    onMouseLeave={() => setShowMenuBar(null)}
                  >
                    <a
                      className="cursor-pointer d-flex align-items-center"
                      style={{ gap: "5px" }}
                    >
                      <img
                        src={photoData.page.page_icon ?? ""}
                        className="doc-pop-width-15px-height-15px mr-1 m-l-5"
                        alt=""
                      />
                      {photoData.page.name}
                      <span className="caret"></span>
                    </a>
                    <ul
                      className="document-pop-up-sidebar-menubar"
                      style={{
                        position: "absolute",
                        left: "auto",
                        top: "auto",
                        minWidth: "217px",
                        transform: "auto",
                        right: "25%",
                        display: showMenuBar === idx ? "block" : "",
                        width: "auto",
                      }}
                    >
                      {photoData.panels?.map((panel, panelIndex) => (
                        <li
                          key={panelIndex}
                          className="d-flex align-items-center"
                          style={{
                            padding: "5px 5px",
                            height: "40px",
                          }}
                          onMouseEnter={() => setPanelMenuBar(panelIndex)}
                          onMouseLeave={() => setPanelMenuBar(null)}
                        >
                          <a
                            className="cursor-pointer d-flex align-items-center color-grey-2"
                            style={{ gap: "5px" }}
                          >
                            <span className="ml-2">{panel.id}.</span>
                            <span className="ml-2">
                              {panel.panel_name
                                ? panel.panel_name
                                : panel.name
                                  ? panel.name
                                  : "No Name"}
                            </span>
                          </a>
                          <ul
                            className="document-pop-up-sidebar-menubar"
                            style={{
                              position: "absolute",
                              left: "auto",
                              top: "auto",
                              minWidth: "217px",
                              transform: "auto",
                              right: "-75%",
                              display:
                                panelMenuBar === panelIndex ? "block" : "",
                              width: "auto",
                            }}
                          >
                            <li
                              className="d-flex align-items-center"
                              style={{ padding: "5px 5px" }}
                              onClick={() =>
                                handleAttachToPage("", photoData.page.id)
                              }
                            >
                              <span className="d-flex align-items-center ml-2">
                                <img
                                  src={photoData.page.page_icon ?? ""}
                                  className="document-icons-width  cursor-pointer m-r-5"
                                  alt=""
                                />
                                Attach to {photoData.page.name} Page generally
                              </span>
                            </li>
                            {photoData.page_slots.map((slot, slotIndex) => {
                              const docsInSlot = photoData.page_docs?.filter(
                                (doc) =>
                                  doc.photo_slot?.slot_number ===
                                    slot?.slot_number &&
                                  panel.photos.some(
                                    (photo) =>
                                      photo.photo_slot?.slot_number ===
                                      slot?.slot_number
                                  )
                              );
                              console.log(docsInSlot);

                              return (
                                <li
                                  key={slotIndex}
                                  className="d-flex align-items-center"
                                  style={{
                                    padding: "5px 5px",
                                    cursor:
                                      docsInSlot.length > 0
                                        ? "default"
                                        : "pointer",
                                  }}
                                  onClick={() =>
                                    handleAttachToPageWithpanels(
                                      slot.id,
                                      photoData.page.id,
                                      panel.id
                                    )
                                  }
                                >
                                  {slot.slot_number !== 0 && (
                                    <span className="d-flex align-items-center justify-content-center">
                                      {docsInSlot.length > 0 ? (
                                        <i
                                          className="ic ic-23 ic-file-colored cursor-pointer document-icons-width"
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

                                  {slot.slot_number !== 0 && (
                                    <div
                                      className={`d-flex align-items-center  ${
                                        docsInSlot.length === 0
                                          ? "color-grey-2 hoverable-text"
                                          : ""
                                      }`}
                                    >
                                      <>
                                        <span className="ml-2">
                                          {slot.slot_number}.
                                        </span>
                                        <span className="ml-2">
                                          {docsInSlot.length > 0
                                            ? docsInSlot[0].title
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
                            {/* <div
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                width: "19px",
                                height: "19px",
                                color: "#19395F",
                                transform: "rotate(180deg)",
                                backgroundImage:
                                  showMenuBar === idx
                                    ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                    : "",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                              }}
                            ></div> */}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              if (photoData.page.panels === false && !photoData.panels) {
                return (
                  <li
                    key={idx}
                    className=""
                    onMouseEnter={() => setShowMenuBar(idx)}
                    onMouseLeave={() => setShowMenuBar(null)}
                  >
                    <a
                      className="cursor-pointer d-flex align-items-center"
                      style={{ gap: "5px" }}
                    >
                      <img
                        src={photoData.page.page_icon ?? ""}
                        className="doc-pop-width-15px-height-15px mr-1 m-l-5"
                        alt=""
                      />
                      {photoData.page.name}
                      <span className="caret"></span>
                    </a>
                    <ul
                      className="document-pop-up-sidebar-menubar"
                      style={{
                        position: "absolute",
                        left: "auto",
                        top: "auto",
                        minWidth: "217px",
                        transform: "auto",
                        right: "25%",
                        display: showMenuBar === idx ? "block" : "",
                        width: "auto",
                      }}
                    >
                      <li
                        className="d-flex align-items-center"
                        style={{ padding: "5px 5px", cursor: "pointer" }}
                        onClick={() =>
                          handleAttachToPage("", photoData.page.id)
                        }
                      >
                        <span className="d-flex align-items-center ml-2">
                          <img
                            src={photoData.page.page_icon ?? ""}
                            className="document-icons-width  cursor-pointer m-r-5"
                            alt=""
                          />
                          Attach to {photoData.page.name} Page generally
                        </span>
                      </li>
                      {photoData.page_slots.map((slot, slotIndex) => {
                        const docsInSlot = photoData.page_docs?.filter(
                          (doc) =>
                            doc.photo_slot?.slot_number === slot?.slot_number
                        );
                        console.log("docs in slot", docsInSlot);
                        return (
                          <li
                            key={slotIndex}
                            className="d-flex align-items-center"
                            style={{
                              padding: "5px 5px",
                              cursor:
                                docsInSlot.length > 0 ? "default" : "pointer",
                            }}
                            onClick={() =>
                              handleAttachToPage(slot.id, photoData.page.id)
                            }
                          >
                            {slot.slot_number !== 0 && (
                              <span className="d-flex align-items-center justify-content-center">
                                {docsInSlot.length > 0 ? (
                                  <i
                                    className="ic ic-23 ic-file-colored cursor-pointer document-icons-width"
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

                            {slot.slot_number !== 0 && (
                              <div
                                className={`d-flex align-items-center  ${
                                  docsInSlot.length === 0
                                    ? "color-grey-2 hoverable-text"
                                    : ""
                                }`}
                              >
                                <>
                                  <span className="ml-2">
                                    {slot.slot_number}.
                                  </span>
                                  <span className="ml-2">
                                    {docsInSlot.length > 0
                                      ? docsInSlot[0].title
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
                      {/* <div
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          width: "19px",
                          height: "19px",
                          color: "#19395F",
                          transform: "rotate(180deg)",
                          backgroundImage:
                            showMenuBar === idx
                              ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                              : "",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "contain",
                        }}
                      ></div> */}
                    </ul>
                  </li>
                );
              }
            })}
          </ul>
          {/* <div className="center-content my-auto">
            <div className="tile-row w-100 p-r-5 p-l-5">
              <div
                className="dropdown has-sub-dropdown mb-2 d-flex"
                style={{ flexDirection: "column" }}
              >
                <button
                  className="btn height-25 dropdown-toggle position-relative d-flex align-items-center justify-content-center w-100 form-select has-no-bg position-relative doc-rev-btn rotate-btn"
                  onClick={() => setShowAttach(!showAttach)}
                >
                  <span className="has-no-after ic-arrow text-primary width-17 m-r-10 mega-hover-btn align-mid">
                    <svg
                      width="17"
                      height="23"
                      className=" "
                      viewBox="0 0 34 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: "relative",
                        top: "3px",
                        right: "25px",
                      }}
                    >
                      <path
                        d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <span style={{ maxWidth: "100%" }}>
                    Move to New Page and Slot
                  </span>
                </button>
                {showAttach && (
                  <div
                    style={{
                      overflowY: "scroll",
                      height: "150px",
                      cursor: "pointer",
                    }}
                  >
                    <ul>
                      {photoListData.map((photoData, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            if (showSubAttach === photoData?.page?.name) {
                              setShowSubAttach("");
                            } else {
                              setShowSubAttach(photoData?.page?.name);
                            }
                          }}
                        >
                          {photoData.page.name || ""}
                          {photoData.page.panels === false && (
                            <div>
                              {showSubAttach === photoData?.page?.name && (
                                <ul>
                                  {photoData.page_slots.map(
                                    (page_slot, j) =>
                                      photoData?.page_docs.filter(
                                        (item) =>
                                          item?.photo_slot?.id === page_slot.id
                                      ).length === 0 && (
                                        <li
                                          key={j}
                                          onClick={() =>
                                            handleAttachToPage(
                                              page_slot.id,
                                              photoData?.page?.id
                                            )
                                          }
                                        >
                                          {page_slot.slot_number || ""}.{" "}
                                          {page_slot.slot_name || "Available"}
                                        </li>
                                      )
                                  )}
                                  <li
                                    onClick={() =>
                                      handleAttachToPage(
                                        "",
                                        photoData?.page?.id
                                      )
                                    }
                                  >
                                    Attach to {photoData.page.name || ""}
                                  </li>
                                </ul>
                              )}
                            </div>
                          )}
                          {photoData.page.panels === true && (
                            <>
                              {showSubAttach === photoData?.page?.name &&
                              (photoData.panels === null ||
                                photoData.panels.length === 0) ? (
                                <ul>
                                  <li
                                    onClick={() =>
                                      handleAttachToPage(
                                        "",
                                        photoData?.page?.id
                                      )
                                    }
                                  >
                                    Attach to {photoData.page.name || ""}
                                  </li>
                                </ul>
                              ) : (
                                ""
                              )}
                              {photoData.panels.map((panel, index) => (
                                <>
                                  {showSubAttach === photoData?.page?.name && (
                                    <div key={index}>
                                      &nbsp;{getPanelName(panel, photoData)}
                                    </div>
                                  )}
                                  <div>
                                    {showSubAttach ===
                                      photoData?.page?.name && (
                                      <ul>
                                        {photoData.page_slots.map(
                                          (page_slot, j) =>
                                            panel.photos?.filter(
                                              (item) =>
                                                item?.photo_slot?.id ===
                                                page_slot.id
                                            ).length === 0 && (
                                              <li
                                                key={j}
                                                onClick={() =>
                                                  handleAttachToPageWithpanels(
                                                    page_slot?.id,
                                                    photoData?.page?.id,
                                                    panel?.id
                                                  )
                                                }
                                              >
                                                {page_slot.slot_number || ""}.{" "}
                                                {page_slot.slot_name ||
                                                  "Available"}
                                              </li>
                                            )
                                        )}
                                        <li
                                          onClick={() =>
                                            handleAttachToPage(
                                              "",
                                              photoData?.page?.id
                                            )
                                          }
                                        >
                                          Attach to {photoData.page.name || ""}
                                        </li>
                                      </ul>
                                    )}
                                  </div>
                                </>
                              ))}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>
        <BottomContentSideBar
          docId={docId}
          documentURL={documentURL}
          file_name={file_name}
          imageRef={imageRef}
          documentURLfordownload={documentURLfordownload}
          isPdf={false}
          buttonData={buttonData}
          error={error}
        />
      </div>
    </div>
  );
};

DocumentModalSideBar.propTypes = {
  documentData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    for_client: PropTypes.object, // Define more specifically if possible
    for_case: PropTypes.shape({
      case_type: PropTypes.shape({
        name: PropTypes.string,
      }),
      incident_date: PropTypes.string,
    }),
    file_name: PropTypes.string,
    docDate: PropTypes.string,
    attached_by: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
    document_slot: PropTypes.object, // Define more specifically if possible
  }).isRequired,
};
export default DocumentModalSideBar;
