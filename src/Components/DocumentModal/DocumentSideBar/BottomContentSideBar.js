import React, { useState } from "react";
import "./BottomContentSideBar.css"; // Keep this for existing styles
import api, { api_without_cancellation } from "../../../api/api";
import { useDocumentModal } from "../../common/CustomModal/CustomModalContext";
import { useNavigate } from "react-router-dom";
import { useUpdateTrigger } from "../../CostDashboard/TriggerUpdateContext";

const apiEndpoint = "api/delete-doc-api/";

async function fetchDocument(docId, action = "") {
  try {
    const response = await api.post(apiEndpoint, {
      doc_id: docId,
      check: action,
    });
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

function decodeData(data) {
  return new Uint8Array(
    atob(data)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
}

function createBlob(data, type = "application/pdf") {
  const bytes = decodeData(data);
  return new Blob([bytes], { type });
}

function useDocumentActions() {
  const handleAction = async (docId, action = "") => {
    try {
      const data = await fetchDocument(docId, action);
      const blob = createBlob(data);
      if (action === "Delete") {
        const url = URL.createObjectURL(blob);
        return { success: true, url };
      } else {
        return { success: true, blob };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  return { handleAction };
}

function BottomContentSideBar({
  docId,
  clientId,
  caseId,
  setDeleteConfirmModal,
  refetchDocumentData,
}) {
  const { toggleTriggerUpdate } = useUpdateTrigger();
  const navigate = useNavigate();
  const { hideDocumentModal, toggle } = useDocumentModal();
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  // const [showESignModal, setShowESignModal] = useState(false); // New state for E-Sign modal
  const [email, setEmail] = useState("");
  const [modalContent, setModalContent] = useState(""); // State for holding E-Sign content

  const handlePrint = async (docId) => {
    try {
      // Fetch the document data via API
      const response = await api.post("/api/delete-doc-api/", {
        doc_id: docId,
        check: "",
      });

      // Extract the data and convert it to a Blob
      const data = response.data.data;
      const bytes = new Uint8Array(
        atob(data)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create an invisible iframe and append it to the DOM
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    } catch (error) {
      console.error(
        "Failed to print document:",
        error.response?.data || error.message
      );
      setError("Failed to print document. Please try again.");
    }
  };

  const handleDownload = async (docId) => {
    try {
      const response = await api.post(apiEndpoint, {
        doc_id: docId,
        check: "",
      });
      const data = response.data.data;
      const blob = createBlob(data);
      const fileURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "file.pdf");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download error:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (docId) => {
    try {
      const response = await api_without_cancellation.post(apiEndpoint, {
        doc_id: docId,
        check: "",
      });
      const data = response.data.data;
      const blob = createBlob(data);
      const fileURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "file.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
      await api_without_cancellation.post(apiEndpoint, {
        doc_id: docId,
        check: "Delete",
      });
      setDeleteConfirmModal(true);
      if (typeof refetchDocumentData === "function") {
        await refetchDocumentData();
      }
      toggle();
      hideDocumentModal();
      toggleTriggerUpdate();

      // toggle();
      // hideDocumentModal();
      // toggleTriggerUpdate();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  const handleDeleteComplete = () => {};

  const handleEmail = async (docId, email) => {
    try {
      await api.post("/api/email-doc/", { doc_id: docId, email });
      alert("Document emailed successfully!");
      setShowEmailModal(false);
    } catch (error) {
      console.error("Email error:", error.response?.data || error.message);
    }
  };

  const handleRemove = async (docId) => {
    try {
      await api.put("/api/remove-doc/", { doc_id: docId });
      toggleTriggerUpdate();
      toggle();
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  const handleESign = () => {
    // Navigate to the E-Sign page

    hideDocumentModal();
    navigate(`/esign/${docId}/${clientId}/${caseId}`);
  };

  return (
    <>
      <div className="bottom-content side-bar-padding">
        <div className="m-b-5 six-buttons m-l-0 m-r-0">
          <button
            className="btn btn-primary col height-25 d-flex align-items-center justify-content-center"
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
            onClick={() => handlePrint(docId)}
          >
            Print
          </button>
          <button
            className="btn btn-primary download-btn col height-25 d-flex align-items-center justify-content-center"
            onClick={() => handleDownload(docId)}
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Download
          </button>
          <button
            className="btn btn-primary col height-25 d-flex align-items-center justify-content-center"
            onClick={() => setShowEmailModal(true)}
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Email
          </button>
          <button
            type="button"
            className="btn btn-secondary col height-25 d-flex align-items-center justify-content-center"
            onClick={() => handleRemove(docId)}
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Inbox
          </button>
          <button
            className="btn btn-primary height-25 d-flex align-items-center justify-content-center flex-g"
            onClick={() => handleESign(docId)}
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            E-Sign
          </button>
          <button
            type="button"
            onClick={() => handleDelete(docId)}
            className="btn btn-secondary height-25 d-flex align-items-center justify-content-center flex-g"
            style={{
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Delete
          </button>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}

        {/* Email Modal */}
        {showEmailModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              zIndex: 1000,
              borderRadius: "8px",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div>
              <h3>Send Document via Email</h3>
              <input
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => handleEmail(docId, email)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                  }}
                >
                  Send
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BottomContentSideBar;
