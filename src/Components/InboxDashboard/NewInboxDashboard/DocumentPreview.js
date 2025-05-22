import React from "react";
import DocumentCarousel from "../documentCarousel";

const DocumentPreview = ({ images, docs }) => {
  return (
    <div
      className="col-auto pl-0 pr-0"
      style={{ maxWidth: "217px", flex: "0 0 217px" }}
    >
      <div className="d-flex justify-content-center align-items-center inbox-document-holder box-1">
        <DocumentCarousel images={images} docs={docs} />
      </div>
    </div>
  );
};

export default DocumentPreview;
