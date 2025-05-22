import React, { useCallback, useState } from "react";
import "../../../public/BP_resources/css/litigation.css";
import DocIcon from "../../../public/BP_resources/images/icon/documents-icon-gray.svg";
import { getCaseId, getClientId, mediaRoute } from "../../Utils/helper";
import api from "../../api/api";
import BlockDataPopup from "./Modals/BlockDataPopup";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
import DocumentUploadModal from "../Modals/documentUploadModal";
import { customDateFormat } from "../../Utils/date";
export default function LitigationDefendant({
  defendants = [],
  defendantProcessedPageSlots = [],
  fetchLitigationData,
  setLitigationDashboardDataUpdated,
  BlocksData,
}) {
  const { showDocumentModal } = useDocumentModal();
  const [uploadFile, setUploadFile] = useState("");
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateProgress = (totalFiles) => {
    let progress = 0;
    const increment = 100 / totalFiles;
    const intervalId = setInterval(() => {
      progress += 2;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 300);
  };
  const handleDocPreview = (doc) => {
    console.log(`Previewing document with ID: ${doc.id}`);
    showDocumentModal("document", mediaRoute(doc.upload), doc);
  };
  const handleuploadDoc = useCallback(
    async (e, slot_id, pageId, panel_id) => {
      e.preventDefault();
      const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
      setFileUploadModal(true);
      simulateProgress(files?.length);
      setUploadFile(files[0].name);
      const formData = new FormData();
      formData.append("file", files[0]);
      fileSizeInMB = file.size / (1024 * 1024);
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
        setLitigationDashboardDataUpdated(true);
        await fetchLitigationData();
        setLitigationDashboardDataUpdated(false);
      } catch (error) {
        console.log(error);
      } finally {
        setFileUploadModal(false);
        setUploadFile("");
        setUploadProgress(0);
      }
    },
    [fetchLitigationData, setLitigationDashboardDataUpdated]
  );

  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => {
    setShowPopup(true);
  }
  
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const defendantCount =
    defendants?.length || defendantProcessedPageSlots?.length;
  const initialFakeRows = 6;
  const defendantFakeRows = Math.max(0, initialFakeRows - defendantCount);
  return (
    <div className="d-flex flex-column p-0 p-r-5 lit-upper-section-child lit-upper-2">
      <div
        className="position-relative overflow-scroll fake-information-row h-100"
        style={{
          minHeight: "12rem",
          display: "flex",
          flexDirection: "column",
          scrollbarWidth: "none",
        }}
      >
        <table className="litigation-table position-relative">
          <thead>
            <tr className="" style={{height: "25px", backgroundColor: "var(--primary-15)"}}>
              <th className="td-autosize text-center p-l-5 p-r-5 height-25">
                <div className="client-contact-title">Defendant</div>
              </th>
              <th className="text-center height-25 p-l-5 p-r-5">
                <div className="client-contact-title">Venue</div>
              </th>
              <th className="text-center height-25 p-l-5 p-r-5">
                <div className="client-contact-title">Attempts</div>
              </th>
              <th className="text-center height-25 p-l-5 p-r-5">
                <div className="client-contact-title">Served</div>
              </th>
              <th className="td-autosize text-center height-25 p-l-5 p-r-5">
                <div className="client-contact-title">Proof</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {defendants?.map((defendant) => (
              <tr key={defendant?.id}>
                <td className="td-autosize text-center height-21 p-l-5 p-r-5">
                  {defendant?.first_name} {defendant?.last_name} -{" "}
                  {defendant?.defendantType?.name}
                </td>
                <td className="text-center height-21 p-l-5 p-r-5">California</td>
                <td className="text-center height-21 p-l-5 p-r-5">54</td>
                <td className="text-center height-21 p-l-5 p-r-5">
                  {new Date(defendant?.defServedDate).toLocaleDateString(
                    "en-US"
                  )}
                </td>
                <td className="td-autosize text-center height-21 p-l-5 p-r-5">
                  {defendantProcessedPageSlots
                    ?.filter(
                      (page_slot) => page_slot?.defendant?.id === defendant?.id
                    )
                    ?.map((page_slot, index) => (
                      <div
                        key={index}
                        onDrop={(event) =>
                          handleuploadDoc(
                            event,
                            page_slot?.page_slot?.id,
                            page_slot?.page_slot?.page?.id,
                            page_slot?.defendant?.id
                          )
                        }
                        className="GreyBB1 col-12 col-md-3 col-xl text-center"
                        id="no-vertical-border"
                        onClick={
                          page_slot?.doc
                            ? () => handleDocPreview(page_slot?.doc)
                            : (event) => {
                                event.stopPropagation();
                                const fileInput =
                                  document.createElement("input");
                                fileInput.type = "file";
                                fileInput.onchange = (e) =>
                                  handleuploadDoc(
                                    e,
                                    page_slot?.page_slot?.id,
                                    page_slot?.page_slot?.page?.id,
                                    page_slot?.defendant?.id
                                  );
                                fileInput.click();
                              }
                        }
                      >
                        {page_slot?.doc ? (
                          <div>
                            <p class="date">
                              {customDateFormat(page_slot?.doc?.created)}
                            </p>
                            <span class="icon-wrap">
                              <i class="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
                            </span>
                          </div>
                        ) : (
                          <span className="ic ic-19">
                            <img
                              src={DocIcon}
                              alt="Doc"
                              width="19"
                              height="19"
                              className="cursor-pointer"
                              loading="lazy"
                            />
                          </span>
                        )}
                      </div>
                    ))}
                </td>
              </tr>
            ))}
            {[...Array(defendantFakeRows)].map((_, index) => (
              <tr
                key={`additional-${index}`}
                className="fake-row-2 height-21"
                style={{ height: "21px" }}
              >
                <td className="height-21 p-l-5 p-r-5" colSpan="6">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex w-100 flex-grow-1 m-t-5">
          <span className="col-6 p-l-0 p-r-0">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase d-flex justify-content-center align-items-center" style={{height: "25px", backgroundColor: "var(--primary-15)"}}>
              Defendant Block
            </p>
            <div className="lit-def-client">
              <p
                className="colFont info_fax text-left p-l-5 p-r-5"
                onClick={() => {
                  handleShowPopup();
                }}
              >
                {BlocksData?.DefBlock}
              </p>
            </div>
          </span>
          <span className="col-6 p-l-5 p-r-0">
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase d-flex justify-content-center align-items-center" style={{height: "25px", backgroundColor: "var(--primary-15)"}}>
              Plaintiff Block
            </p>
            <div className="lit-def-client">
              <p
                className="colFont info_fax text-left p-l-5 p-r-5"
                onClick={() => {
                  handleShowPopup();
                }}
              >
                {BlocksData?.PlaBlock}
              </p>
            </div>
          </span>
        </div>
      </div>
      {showPopup && BlocksData?.litigation_id && (
        <BlockDataPopup
          data={BlocksData}
          showPopup={showPopup}
          handleClose={handleClosePopup}
        />
      )}
      <DocumentUploadModal
        uploadFile={uploadFile}
        uploadProgress={uploadProgress}
        show={fileUploadModal}
        onHide={() => setFileUploadModal(false)}
      />
    </div>
  );
}
