import React from "react";
import HistoryCaseDetails from "./history_case_details";
import { useDocumentModal } from "../../../common/CustomModal/CustomModalContext";

const DocumentHistoryTableRowNew = ({ doc, index }) => {
  const { showDocumentModal, documentData } = useDocumentModal();
  const handleDocPreview = (doc) => {
    console.log(doc);
    showDocumentModal("document", doc?.upload, doc);
  };
  return (
    <>
      <tr
        id="client_provider_treatment_date "
        style={{
          cursor: "default",
          background: index % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)",
        }}
        className={`black-color `}
      >
        <td>
          <HistoryCaseDetails
            caseData={doc?.for_case}
            client={doc?.for_client}
            index={index}
          />
        </td>
        <td id="">
          <div
            className="icon-text-boxes d-flex justify-content-center align-items-center"
            style={{ cursor: "pointer" }}
          >
            <button
              onClick={() => handleDocPreview(doc)}
              className="d-flex justify-content-start icon-text-box bg-grey-500 text-center document-name-width history-doc-btn"
            >
              <span className="icon-wrap">
                {" "}
                <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>{" "}
              </span>
              <p class="name history-file-name">{doc?.file_name}</p>
            </button>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center flex-column">
            {doc?.document_slot?.page?.page_icon && (
              <span className="d-flex align-items-center height-21">
                <img
                  src={doc?.document_slot?.page?.page_icon}
                  className="ic ic-19 d-flex align-items-center justify-content-center m-r-5"
                  alt="Page Icon"
                />
                {doc?.document_slot?.page?.name}
              </span>
            )}
            {doc?.document_slot?.slot_number !== 0 && (
              <div className="ml-2 whitespace-nowrap">
                {doc?.document_slot?.slot_number}.{" "}
                {doc?.document_slot?.slot_name
                  ? doc?.document_slot?.slot_name
                  : "Available"}
              </div>
            )}

            {doc?.document_slot?.slot_number === 0 && (
              <div className="ml-2 whitespace-nowrap">
                Attached to {doc?.document_slot?.page?.name || doc?.page_name}{" "}
                Page generally
              </div>
            )}
          </div>
        </td>
        <td>
          <div className="d-flex user-date-area-wrap justify-content-center">
            {doc?.attached_by?.profile_pic_29p && (
              <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                <img
                  class="output-3 theme-ring"
                  src={doc?.attached_by?.profile_pic_29p}
                />
              </span>
            )}
            <div className="user-sorting-info ml-2">
              <span className="text-black text-black-2 whitespace-nowrap">
                {doc?.attached_by?.first_name} {doc?.attached_by?.last_name}
              </span>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default DocumentHistoryTableRowNew;
