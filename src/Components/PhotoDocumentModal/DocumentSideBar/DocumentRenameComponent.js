import React, { useState } from "react";
import PropTypes from "prop-types";
import DocumentRenameModal from "./DocumentRenameModal";
import api from "../../../api/api";
import { useDocumentModal } from "../DocumentModalContext";

function DocumentRenameComponent({ initialDocumentName, docId }) {
  const [documentName, setDocumentName] = useState(initialDocumentName);
  const [displayName, setDisplayName] = useState(initialDocumentName);
  const { toggle, setDocumentData } = useDocumentModal();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    let cleanName = documentName.replace(/\.pdf/gi, "");
    if (!cleanName || cleanName.length < 3) {
      setError("Document name must be at least 3 characters long.");
      return; // Exit the function if validation fails
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await api.put("/api/rename-photo-doc/", {
        doc_id: docId,
        doc_rename: documentName,
      });
      setError(null);
      console.log("Document renamed successfully:", response.data);
      setDisplayName(documentName);
      setDocumentData((prevData) => ({
        ...prevData,
        file_name: documentName,
      }));
      toggle();
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="tile-row mw-100">
        <span className="text-black text-left text-break font-weight-semibold d-block">
          {displayName}
        </span>
      </div>
      <div className="tile-row d-flex flex-wrap w-100">
        <div className="input-wrap d-flex-1 ">
          <input
            className="form-control height-25 p-l-5"
            id="document_rename"
            placeholder="Type New Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </div>
        <button
          type="button"
          className="btn text-white bg-success d-flex justify-content-center align-items-center doc-pop-visibility-visible doc-pop-height-25px m-l-5"
          onClick={handleSave}
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
