import React, { useEffect, useRef, useState } from "react";
import ButtonLoader from "../Loaders/ButtonLoader";
import { Document, Page } from "react-pdf";
import "./allDocsDetailedViewStyles.css";

function mixColorWithWhite(hex, percentage) {
  const whitePercentage = (100 - percentage) / 100;

  let r = parseInt(hex?.slice(1, 3), 16);
  let g = parseInt(hex?.slice(3, 5), 16);
  let b = parseInt(hex?.slice(5, 7), 16);

  // Mix each channel with white
  r = Math.floor(r + (255 - r) * whitePercentage);
  g = Math.floor(g + (255 - g) * whitePercentage);
  b = Math.floor(b + (255 - b) * whitePercentage);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const docName = (nameOne, nameTwo) => {
  const name = nameOne || nameTwo;
  return name?.length > 35 ? name.slice(0, 32) + "..." : name;
};

export const DetailedViewCard = ({
  doc,
  slot,
  handleDocPreview,
  modifiedView,
}) => {
  const [width, setWidth] = useState("");
  const divRef = useRef(null);
  const [cardWidth, setCardWidth] = useState("255px");

  useEffect(() => {
    if (divRef.current) {
      const width = divRef.current.getBoundingClientRect().width;
      console.log(`Width using getBoundingClientRect: ${width}px`);
      setWidth(width);
    }
  }, []);

  console.log("Document ===>", doc);
  console.log("Slot ===>", slot);

  if (doc?.page_name === "Case") {
    console.log(slot);
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      // style={{ marginRight: "5px" }}
    >
      {doc?.page_name === "Treatment" && (
        <div
          className="has-primary-font-detail-view-card"
          style={{
            display: "flex",
            justifyContent: doc?.panelName === null ? "center" : "flex-start",
            alignItems: "center",
            // padding: "0px 10px",
            background: doc?.specialty?.color
              ? mixColorWithWhite(doc?.specialty?.color, 10)
              : "var(--primary-15)",
            color: "var(--primary)",
            width: cardWidth,
            minWidth: cardWidth,
            maxWidth: cardWidth,
            fontSize: "14px",
            fontWeight: "600",
            height: "25px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {doc?.panelName !== null && (
            <>
              <span
                className="d-flex m-r-5 align-items-center justify-content-center"
                style={{
                  width: "25px",
                  height: "25px",
                  background: doc?.specialty?.color || "#000", // fallback color
                  color: "white",
                  minWidth: "25px",
                }}
              >
                {doc?.specialty?.name?.[0] || "?"}
              </span>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "14px",
                  fontWeight: "600",
                  height: "25px",
                  textTransform: "uppercase",
                  alignContent: "center",
                }}
              >
                {doc.panelName}
              </span>
            </>
          )}

          {doc?.panelName === null && (
            <>
              <span
                className="m-l-2"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "14px",
                  fontWeight: "600",
                  height: "25px",
                  textTransform: "uppercase",
                  alignContent: "center",
                }}
              >
                {slot?.slot_name}
              </span>
            </>
          )}
        </div>
      )}
      {doc?.page_name !== "Treatment" && (
        <div
          className="has-primary-font-detail-view-card"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px 10px",
            background: "var(--primary-15)",
            color: "var(--primary)",
            width: cardWidth,
            minWidth: cardWidth,
            maxWidth: cardWidth,
            fontSize: "14px",
            fontWeight: "600",
            height: "25px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {doc?.page_name ? (
            doc.page_name === "Treatment" ? (
              <>
                <span>{doc?.specialty?.name?.[0]}</span> {doc?.panelName}
              </>
            ) : doc?.panelName ? (
              doc.panelName
            ) : slot?.slot_number === 0 ? (
              slot?.slot_name
            ) : slot?.slot_name === null ? (
              "Available"
            ) : slot?.slot_name ? (
              slot?.slot_name
            ) : (
              "Unattached Document"
            )
          ) : (
            "Unattached Document"
          )}
        </div>
      )}
      <div
        className={`font-weight-semibold cursor-pointer detailed-empty-card ${modifiedView && " "}`}
        id="no-vertical-border"
        onClick={() => handleDocPreview(doc)}
        key={doc.id}
        style={{
          width: cardWidth,
          minWidth: cardWidth,
          maxWidth: cardWidth,
          height: "352px",
          minHeight: "352px",
          border: "none",
        }}
      >
        <div
          title={doc.file_name || slot?.slot_name}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <span
            className="icon- wrap"
            style={{
              display: "inline-block",
              marginRight: "5px",
              marginTop: "2px",
            }}
          >
            <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
          </span>
          <p className="name new-view-title">
            {slot?.slot_number}. {docName(doc.file_name, slot?.slot_name)}
          </p>
        </div>
        <div
          ref={divRef}
          id={`${doc.id}-${doc.file_name || slot?.slot_name}`}
          className="detailed-empty-card-img-div"
          style={{
            height: "317px",
          }}
        >
          {doc?.upload || width ? (
            <Document file={doc.upload} error={<BrokenPreviewImage />}>
              <Page
                height={317}
                width={245}
                pageNumber={1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          ) : (
            <BrokenPreviewImage />
          )}
        </div>
        <div className="detailed-empty-card-details">
          <div className="detailed-empty-card-sub-head">
            <p className="detailed-empty-card-sub-head-label">File Size: </p>
            <p>{doc?.file_size}</p>
          </div>
          <div className="detailed-empty-card-sub-head">
            <p className="detailed-empty-card-sub-head-label">Assigned By: </p>

            <div style={{ display: "flex", alignItems: "justify-end" }}>
              <div
                class="icon-container"
                style={{
                  display: "flex",
                  height: "19px",
                  width: "19px",
                  marginRight: "4px",
                }}
              >
                {doc?.attached_by?.profile_pic_29p ? (
                  <img
                    className="client_profile_image_63"
                    src={doc?.attached_by?.profile_pic_29p}
                    alt=""
                  />
                ) : (
                  <i className="ic ic-client-avatar h-100 w-100"></i>
                )}{" "}
                <div class="border-overlay"></div>
              </div>
              <p>{`${doc?.attached_by?.first_name || ""} ${doc?.attached_by?.last_name || ""}`}</p>
            </div>
          </div>
          <div className="detailed-empty-card-sub-head">
            <p className="detailed-empty-card-sub-head-label">Upload Date: </p>
            <p>{new Date(doc.created).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DetailedEmptyCard = ({
  slot,
  page,
  item,
  isDragging,
  refetchLoading,
  handleDrop,
  handleUploadPopup,
  isSlotUploading,
  style,
}) => {
  return null;
  return (
    <div
      onDrop={(e) => handleDrop(e, slot.id, page?.page?.id, item?.id)}
      className={`dropzone-${slot.id}-${item?.id}-${page.page.id} font-weight-semibold cursor-pointer detailed-empty-card`}
      id="no-vertical-border"
      onClick={() => handleUploadPopup(slot?.id, item?.id, page?.page?.id)}
      style={{ ...style }}
    >
      {isSlotUploading(slot?.id, item?.id) && (isDragging || refetchLoading) ? ( // Corrected condition
        <div className="d-flex align-items-center justify-content-center">
          <ButtonLoader />
          <span style={{ marginLeft: "5px" }}>Uploading</span>
        </div>
      ) : (
        <div
          style={{ height: "95%" }}
          className="d-flex align-items-center justify-content-center"
        >
          <div>
            <p style={{ textAlign: "center" }}>
              <svg viewBox="0 0 24 24" height={24} width={24} fill="none">
                <g strokeWidth="0"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  <path
                    d="M4 12H20M12 4V20"
                    stroke="var(--primary-25)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </p>
            <p
              className="name"
              style={{
                fontWeight: 600,
                paddingBottom: "14px",
                color: "var(--primary-25)",
                textAlign: "center",
              }}
            >
              {slot?.slot_name ? `Add ${slot?.slot_name}` : "Add File"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const DetailedUploadCard = ({
  page,
  item,
  isDragginguploadingbutton,
  uploadbuttonLoadingid,
  handleDropwithOutpanlesWithoutslots,
  handleUploadPopupwithoutSlots,
  style,
}) => {
  return null;
  return (
    <div
      className="col-12 col-md-6 col-xl-3 icon-text-box text-center order-last font-weight-semibold cursor-pointer detailed-empty-card detailed-mb-5"
      onDrop={(event) =>
        handleDropwithOutpanlesWithoutslots(
          event,
          true,
          page?.page?.id,
          item?.id
        )
      }
      onClick={() => handleUploadPopupwithoutSlots(page?.page?.id)}
      style={{ marginRight: "5px", ...style }}
    >
      <div className="upload-icon border-0 rounded-0 bg-transparent">
        <div className="d-flex align-items-center width-inherit justify-content-center">
          {isDragginguploadingbutton && item?.id === uploadbuttonLoadingid ? (
            <>
              <ButtonLoader />
              <span style={{ marginLeft: "5px" }}>Uploading..</span>
            </>
          ) : (
            <p
              className="detailed-empty-card-sub-head"
              style={{ fontWeight: 600, color: "var(--primary-25)" }}
            >
              Upload Document to Page{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const DetailedUploadCardWithoutPanelsWithoutSlots = ({
  page,
  isDragginguploadingbutton,
  handleDropwithOutpanlesWithoutslots,
  handleUploadPopupwithoutSlots,
}) => {
  return null;
  return (
    <div
      className="text-center order-last font-weight-semibold cursor-pointer detailed-empty-card detailed-mb-5"
      onDrop={(event) =>
        handleDropwithOutpanlesWithoutslots(event, false, page?.page?.id, 0)
      }
      onClick={() => handleUploadPopupwithoutSlots(page?.page?.id)}
      style={{ marginRight: "5px" }}
    >
      <div className="upload-icon border-0 rounded-0 bg-transparent">
        <div className="d-flex align-items-center width-inherit justify-content-center">
          {isDragginguploadingbutton ? (
            <>
              <ButtonLoader />
              <span style={{ marginLeft: "5px" }}>Uploading..</span>
            </>
          ) : (
            <p
              className="detailed-empty-card-sub-head"
              style={{ fontWeight: 600, color: "var(--primary-25)" }}
            >
              Upload Document to Page{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const DetailedUploadCardNoLoader = ({
  page,
  item,
  isDragginguploadingbutton,
  uploadbuttonLoadingid,
  handleDropwithOutpanlesWithoutslots,
  handleUploadPopupwithoutSlots,
}) => {
  return null;
  return (
    <div
      className="col-12 col-md-6 col-xl-3 icon-text-box text-center order-last font-weight-semibold cursor-pointer detailed-empty-card detailed-mb-5"
      onDrop={(event) =>
        handleDropwithOutpanlesWithoutslots(
          event,
          true,
          page?.page?.id,
          item?.id
        )
      }
      onClick={() => handleUploadPopupwithoutSlots(page?.page?.id)}
      style={{ marginRight: "5px" }}
    >
      <div className="upload-icon border-0 rounded-0 bg-transparent">
        <div className="d-flex align-items-center width-inherit justify-content-center">
          {/* {isDragginguploadingbutton &&
                        item?.id === uploadbuttonLoadingid ? (
                        <>
                            <ButtonLoader />
                            <span style={{ marginLeft: "5px" }}>
                                Uploading..
                            </span>
                        </>
                    ) : ( */}
          <p
            className="detailed-empty-card-sub-head"
            style={{ fontWeight: 600, color: "var(--primary-25)" }}
          >
            Upload Document to Page{" "}
          </p>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

const BrokenPreviewImage = () => {
  return (
    <svg
      height={60}
      width={60}
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      fill="#000000"
    >
      <g strokeWidth="0"></g>
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g>
        <g>
          <polygon
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeMiterlimit="10"
            points="23,1 55,1 55,63 9,63 9,15 "
          ></polygon>
          <polyline
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeMiterlimit="10"
            points="9,15 23,15 23,1 "
          ></polyline>
        </g>
        <circle
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          cx="32"
          cy="36"
          r="9"
        ></circle>
        <line
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeMiterlimit="10"
          x1="25.834"
          y1="29.834"
          x2="38.166"
          y2="42.166"
        ></line>
      </g>
    </svg>
  );
};
