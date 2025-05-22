import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DocumentRenameModal from "./DocumentRenameModal";
import api from "../../../api/api";
import { useDocumentModal } from "../DocumentModalContext";
import "./DocumentSidebar.css";

function DocumentRenameComponent({
  initialDocumentName,
  docId,
  refetchDocumentData,
}) {
  const [documentName, setDocumentName] = useState("");
  const [displayName, setDisplayName] = useState(initialDocumentName);
  const { toggle, setDocumentData } = useDocumentModal();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(21);
  const textRef = useRef(null);
  const LINE_HEIGHT = 21;
  const MAX_HEIGHT = 84;

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      const scrollHeight = element.scrollHeight;
      const numberOfLines = Math.ceil(scrollHeight / LINE_HEIGHT);
      const newHeight = Math.min(numberOfLines * LINE_HEIGHT, MAX_HEIGHT);
      setContainerHeight(newHeight);
    }
  }, [displayName]);

  const handleSave = () => {
    let cleanName = documentName.replace(/\.pdf/gi, "");
    if (!cleanName || cleanName.length < 3) {
      setError("Document name must be at least 3 characters long.");
      return; // Exit the function if validation fails
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    let cleanName = documentName.replace(/\.pdf/gi, "");
    try {
      const response = await api.put("/api/rename-doc/", {
        doc_id: docId,
        doc_rename: cleanName,
      });
      setError(null);
      console.log("Document renamed successfully:", response.data);
      setDisplayName(documentName);
      setDocumentData((prevData) => ({
        ...prevData,
        file_name: documentName,
      }));
      if (typeof refetchDocumentData === "function") {
        await refetchDocumentData();
      }
      toggle();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="tile-row mw-100 flex-wrap d-flex align-items-center p-l-5 p-r-5"
        style={{
          height: `${containerHeight}px`,
          minHeight: "21px",
          maxHeight: `${MAX_HEIGHT}px`,
          transition: "height 0.1s ease",
          overflow: "hidden",
          background: "var(--primary-2)",
        }}
      >
        <span
          ref={textRef}
          className="text-black text-left text-break font-weight-semibold d-block"
        >
          {/* {displayName.length > 50
            ? `${displayName.slice(0, 50)}...`
            : displayName} */}
          {displayName}
        </span>
      </div>
      <div
        className="tile-row d-flex flex-wrap height-35 align-items-center w-100 p-l-5 p-r-5"
        style={{
          background: "var(--primary-4)",
        }}
      >
        <div className="input-wrap d-flex-1 ">
          <input
            className="form-control height-25 p-l-5 document-search-text-color"
            id="document_rename"
            placeholder="Rename Document"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            style={{ height: "21px" }}
          />
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </div>
        <button
          type="button"
          className={`btn text-white d-flex justify-content-center align-items-center doc-pop-visibility-visible doc-pop-height-25px m-l-5 ${documentName ? "btn-success" : "btn-secondary"}`}
          disabled={!documentName}
          onClick={handleSave}
          style={{
            height: "21px",
            fontSize: "14px",
            fontWeight: "600",
            padding: "5px",
            minWidth: "46px",
          }}
        >
          Save
        </button>
      </div>
      <DocumentRenameModal
        isOpen={isModalOpen}
        documentName={documentName}
        onConfirm={handleConfirm}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

DocumentRenameComponent.propTypes = {
  initialDocumentName: PropTypes.string,
};

DocumentRenameComponent.defaultProps = {
  initialDocumentName: "",
};
export default DocumentRenameComponent;
