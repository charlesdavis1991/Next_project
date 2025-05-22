import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "./PdfThumbnail.css";

const PdfThumbnail = ({
  numPages,
  documentURL,
  currentPage,
  onThumbnailClick,
  setPageNumber,
  selectedPages,
  pageOrders,
  setPageOrders,
  docId,
  imagePdf,
  fullPreview,
  mergePDFs
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedPdf, setDraggedPdf] = useState(null); // Track which PDF the dragged page is from
  const [numImagePages, setNumImagePages] = useState(null);

  // Set up for loading the number of pages from the imagePdf
  const onLoadSuccess = ({ numPages }) => {
    setNumImagePages(numPages);
  };

  // Handle the drag start event, set the dragged index and which PDF it's coming from
  const handleDragStart = (event, index, pdfType) => {
    console.log(`Dragging page ${index + 1} from ${pdfType}`);
    setDraggedIndex(index);
    setDraggedPdf(pdfType); // Set the PDF type ("documentURL" or "imagePdf")
  };

  // Allow the drop event
  const handleDragOver = (event) => {
    event.preventDefault(); // Allow dropping
  };

  // Handle the drop event
  const handleDrop = (event, targetIndex, targetPdfType) => {
    event.preventDefault();
    console.log("targetIndex",targetIndex)
    console.log("targetPdfType",targetPdfType)
    
    // Proceed only if the dragged page is from a different PDF
    if (draggedIndex !== null) {
      setPageOrders((prevOrders) => {
        const currentOrder = prevOrders[docId] || [];

        let newOrder;

        // If dragged from documentURL to imagePdf (or vice versa), update the order
        if (draggedPdf === "documentURL" && targetPdfType === "documentURL") {
          newOrder = [...currentOrder];  // Start with the existing order of documentURL
          const draggedPage = newOrder[draggedIndex];
          newOrder.splice(draggedIndex, 1);  // Remove the dragged page from documentURL
          newOrder.splice(targetIndex, 0, draggedPage); // Insert into imagePdf
        } else if (draggedPdf === "imagePdf" && targetPdfType === "documentURL") {
          
          mergePDFs(draggedIndex,targetIndex,pageOrder)
          newOrder = [...currentOrder];  // Start with the existing order of imagePdf
          
        }

        return {
          ...prevOrders,
          [docId]: newOrder,
        };
      });


      

      // Clear dragged index and PDF type after the drop
      setDraggedIndex(null);
      setDraggedPdf(null);
    }
  };

  const pageOrder = pageOrders[docId] || []; // Get the order for the current document

  return (
    <div className="d-flex">
      {/* First PDF Thumbnail (documentURL) */}
      <div className="pdf-thumbnail d-flex" style={{ padding: "10px" }}
      onDragOver={handleDragOver}

      onDrop={(e) => handleDrop(e, -1, "documentURL")}

      >
        <Document file={documentURL}>
          {pageOrder.map((pageNumber, index) => (
            <div
              key={pageNumber}
              className={`thumbnail-page ${
                selectedPages.includes(pageNumber) ? "page-selected-red" : ""
              }`}
              style={{
                marginTop: "10px",
                cursor: "grab",
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, index, "documentURL")}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.stopPropagation(); 
                handleDrop(e, index, "documentURL")
              }}
            >
              <Page
                scale={0.15}
                pageNumber={pageNumber}
                onClick={() => onThumbnailClick(`pdf_page_${pageNumber}`, setPageNumber)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
        </Document>
      </div>

      {/* Second PDF Thumbnail (imagePdf) */}
      {imagePdf && fullPreview && (
        <div className="pdf-thumbnail d-flex">
          <Document file={imagePdf} onLoadSuccess={onLoadSuccess} loading = {""}>
          
            {Array.from({ length: numImagePages }, (_, index) => (
              <div
                key={index}
                className="thumbnail-page"
                style={{
                  marginTop: "10px",
                  cursor: "grab",
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, index, "imagePdf")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index, "imagePdf")}
              >
                <Page
                  scale={0.15}
                  pageNumber={index + 1} // Note: Page numbers start from 1 in imagePdf
                  renderTextLayer={false}
                  onClick={() => onThumbnailClick(`image_pdf_page_${index}`)}
                  renderAnnotationLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default PdfThumbnail;
