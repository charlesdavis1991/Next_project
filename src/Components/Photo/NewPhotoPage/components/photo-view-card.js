import React, { useState, useEffect, useRef } from "react";
import { Img } from "react-image";
import "./photo-view-card.css";

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

export const photoName = (nameOne, nameTwo) => {
  const name = nameOne || nameTwo;
  return name?.length > 35 ? name.slice(0, 32) + "..." : name;
};

export const BrokenPreviewImage = () => {
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

export const PhotoViewCard = ({
  photo,
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

  console.log("Photo ===>", photo);

  if (photo?.for_page === 1) {
    console.log(slot);
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      // style={{ marginRight: "5px" }}
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
        className={`font-weight-semibold cursor-pointer detailed-empty-card ${modifiedView && " "}`}
        id="no-vertical-border"
        onClick={() => handleDocPreview(photo)}
        key={photo.id}
        style={{ width: cardWidth, minWidth: cardWidth, maxWidth: cardWidth }}
      >
        <div
          title={photo.title || slot?.slot_name}
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
            {slot?.slot_number}. {photoName(photo?.title, slot?.slot_name)}
          </p>
        </div>
        <div
          ref={divRef}
          id={`${photo.id}-${photo.title || slot?.slot_name}`}
          className="detailed-empty-card-img-div"
        >
          {photo?.image || width ? (
            <Img
              src={photo?.image}
              unloader={<BrokenPreviewImage />}
              style={{ height: 270, width: width * 0.78, objectFit: "contain" }}
            />
          ) : (
            <BrokenPreviewImage />
          )}
        </div>
        {/* <div className="detailed-empty-card-details">
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
          </div> */}
      </div>
    </div>
  );
};
