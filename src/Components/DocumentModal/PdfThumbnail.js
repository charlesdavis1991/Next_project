import React, { useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "./PdfThumbnail.css";

const PdfThumbnail = ({
  numPages,
  documentURL,
  currentPage,
  onThumbnailClick,
  setPageNumber,
}) => {
  console.log(currentPage, numPages);
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
    <div
      className="pdf-thumbnail"
      style={{
        paddingLeft: "10px",
        paddingRight: "10px",
        width: "120px",
        backgroundColor: "var(--primary-10)",
        scrollbarWidth: "none",
        minWidth: "120px",
      }}
    >
      <Document file={documentURL}>
        {Array.from({ length: numPages }, (_, index) => (
          <div
            key={index}
            id={`thumbnail_pdf_page_${index + 1}`}
            className={`thumbnail-page ${
              currentPage === index + 1 ? "page-selected" : ""
            }`}
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
    </div>
  );
};

export default PdfThumbnail;
