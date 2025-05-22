import React, { useEffect, useRef, useState } from "react";
import "./photo-detailed-cards.css";
import { Img } from "react-image";
import { BrokenPreviewImage } from "./photo-view-card";

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

const photoName = (nameOne, nameTwo) => {
  const name = nameOne || nameTwo;
  return name?.length > 35 ? name.slice(0, 32) + "..." : name;
};

export const PhotoDetailedCard = ({
  photo,
  slot,
  panelName,
  panelId,
  specialty,
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

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ marginRight: "0px" }}
    >
      {photo?.for_page === 8 && (
        <div
          className="has-primary-font-detail-view-card"
          style={{
            display: "flex",
            justifyContent: photo?.panelName === null ? "center" : "flex-start",
            alignItems: "center",
            // padding: "0px 10px",
            background: photo?.specialty?.color
              ? mixColorWithWhite(photo?.specialty?.color, 10)
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
          {photo?.panelName !== null && (
            <>
              <span
                className="d-flex m-r-5 align-items-center justify-content-center"
                style={{
                  width: "25px",
                  height: "25px",
                  background: photo?.specialty?.color || "#000", // fallback color
                  color: "white",
                  minWidth: "25px",
                }}
              >
                {photo?.specialty?.name?.[0] || "?"}
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
                {photo.panelName}
              </span>
            </>
          )}

          {photo?.panelName === null && (
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
      {photo?.for_page !== 8 && (
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
          {photo?.for_page
            ? photo?.panelName ||
              (slot?.slot_number === 0 && slot?.slot_name) ||
              (slot?.slot_name === null && "Available") ||
              slot?.slot_name ||
              "Unattached Photo"
            : "Unattached Photo"}
        </div>
      )}
      <div
        className={`font-weight-semibold cursor-pointer updated-empty-card`}
        id="no-vertical-border"
        onClick={() => handleDocPreview(photo)}
        style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth }}
        key={photo.id}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "5px",
          }}
        >
          <span
            className="d-flex align-items-center justify-content-center"
            style={{
              display: "inline-block",
              marginRight: "5px",
              width: "25px",
              height: "25px",
            }}
          >
            <i className="ic ic-19 ic-file-colored cursor-pointer img-19px"></i>
          </span>
          <p
            title={photo?.title || slot?.slot_name}
            className="name new-view-title"
          >
            {slot?.slot_number}. {photo?.title || slot?.slot_name}
          </p>
        </div>
        <div
          ref={divRef}
          style={{
            height: "43px",
            maxHeight: "43px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {photo?.image || width ? (
            // <Document file={doc.upload} error={<BrokenPreviewImage />}>
            //   <Page
            //     width={width} // * 0.78}
            //     height={43}
            //     pageNumber={1}
            //     renderTextLayer={false}
            //     renderAnnotationLayer={false}
            //   />
            // </Document>
            <Img
              src={photo?.image}
              unloader={<BrokenPreviewImage />}
              style={{ height: 43, width: width, objectFit: "cover" }}
            />
          ) : (
            <BrokenPreviewImage />
          )}
        </div>
        <div>
          <div className="updated-empty-card-sub-head first-sub-head">
            <p className="updated-empty-card-sub-head-label">File Size: </p>
            <p>{photo?.file_size}</p>
          </div>
          <div className="updated-empty-card-sub-head">
            <p className="updated-empty-card-sub-head-label">Linked: </p>
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
                {photo?.attached_by?.profile_pic_29p ? (
                  <img
                    className="client_profile_image_63"
                    src={photo?.attached_by?.profile_pic_29p}
                    alt=""
                  />
                ) : (
                  <i className="ic ic-client-avatar h-100 w-100"></i>
                )}{" "}
                <div class="border-overlay"></div>
              </div>
              <p>{`${photo?.attached_by?.first_name || ""} ${photo?.attached_by?.last_name || ""}`}</p>
            </div>
          </div>
          <div className="updated-empty-card-sub-head">
            <p className="updated-empty-card-sub-head-label">Upload Date: </p>
            <p>{new Date(photo?.date_uploaded).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
