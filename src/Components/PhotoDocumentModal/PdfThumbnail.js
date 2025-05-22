import React, { useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "./PdfThumbnail.css";
import { mediaRoute } from "../../Utils/helper";

const PdfThumbnail = ({
  numPages,
  documentURL,
  currentPage,
  onThumbnailClick,
  setPageNumber,
  photoListData,
}) => {
  console.log("Thumbnail Current Page", currentPage);

  const thumbnailRef = useRef(null);

  // Effect to scroll to the selected thumbnail
  useEffect(() => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentPage]);

  return (
    <div className="pdf-thumbnail">
      <div className="pdfpage">
        <div className="content-wrapper">
          <img
            style={{ width: "160px" }}
            src={documentURL}
            className="photo-url"
            alt=""
          />
        </div>
      </div>
      {/* {photoListData.length > 0 &&
        photoListData.map((photoData) =>
          photoData.page_docs.map(
            (page_doc) =>
              mediaRoute(page_doc.image) !== documentURL && (
                <div className="pdfpage">
                  <div className="content-wrapper">
                    <img
                      src={mediaRoute(page_doc.image)}
                      className="photo-url"
                      alt=""
                      style={{ width: "160px" }}
                    />
                  </div>
                </div>
              )
          )
        )} */}
    </div>
  );
};

export default PdfThumbnail;
