import React, { useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "./CustomPdfThumbnail.css";
import { mediaRoute } from "../../../Utils/helper";

const CustomPdfThumbnail = ({
  numPages,
  documentURL,
  currentPage,
  onThumbnailClick,
  setPageNumber,
  photoListData = [],
  isPdf = true, // Flag to determine if the content is PDF or image
}) => {
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

  const flattenedPageDocs = photoListData.reduce((acc, photoData) => {
    return acc.concat(photoData.page_docs);
  }, []);

  if (documentURL) {
    const currentIndex = flattenedPageDocs.findIndex(
      (page_doc) => page_doc.image === documentURL
    );
    if (currentIndex !== -1) {
      setPageNumber(currentIndex + 1);
    }
  }

  return (
    <div
      className="pdf-thumbnail"
      style={{ paddingLeft: "10px", paddingRight: "10px" }}
    >
      {isPdf ? (
        // Render PDF thumbnails
        <Document file={documentURL}>
          {Array.from({ length: numPages }, (_, index) => (
            <div
              key={index}
              id={`thumbnail_pdf_page_${index + 1}`}
              className={`thumbnail-page ${currentPage === index + 1 ? "page-selected" : ""}`}
              style={{ marginTop: "10px" }}
              ref={currentPage === index + 1 ? thumbnailRef : null}
            >
              <Page
                scale={0.15}
                pageNumber={index + 1}
                onClick={() => onThumbnailClick(index + 1, setPageNumber)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      ) : (
        // Render image thumbnails
        <>
          {/* <div className="pdfpage">
            <div className="content-wrapper">
              <img
                style={{ width: "160px" }}
                src={documentURL}
                className="photo-url"
                alt=""
              />
            </div>
          </div> */}
          {flattenedPageDocs.map((page_doc, index) => {
            return (
              <div
                key={index}
                className="pdfpage pe-auto"
                id={`pdf_page_${index + 1}`}
              >
                <div className="content-wrapper">
                  <img
                    src={page_doc.image}
                    className="photo-url"
                    alt=""
                    style={{ width: "160px" }}
                    onClick={() =>
                      onThumbnailClick(index + 1, setPageNumber, page_doc.image)
                    }
                  />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CustomPdfThumbnail;
