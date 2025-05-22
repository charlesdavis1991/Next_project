import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import api from "../../../api/api"; // Assuming your API is set up here
import "./EsignPage.css"; // Use your provided CSS
import SaveTemplateModal from "./SaveTemplateModal";

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Fetch the document from the API
async function fetchDocument(docId, action = "") {
  try {
    const response = await api.post("api/delete-doc-api/", {
      doc_id: docId,
      check: action,
    });
    return response.data.data; // Assuming the PDF data comes in base64
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

const ESignPage = () => {
  const { docId } = useParams();
  const [pdfData, setPdfData] = useState(null); // To store the fetched PDF data
  const [numPages, setNumPages] = useState(null);
  const [signatureElements, setSignatureElements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  // Fetch PDF data from the API
  useEffect(() => {
    async function fetchPdf() {
      try {
        const base64Pdf = await fetchDocument(docId, ""); // Fetching the PDF
        const byteCharacters = atob(base64Pdf);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(blob); // Convert to blob URL for rendering
        setPdfData(pdfUrl);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    }

    fetchPdf();
  }, [docId]);

  // Function to remove text content inside the react-pdf textLayer div
  useEffect(() => {
    if (pdfData) {
      const hideTextLayer = () => {
        const textLayers = document.querySelectorAll(
          ".react-pdf__Page__textContent"
        );
        textLayers.forEach((layer) => {
          layer.style.display = "none"; // Set the display to none
        });
      };
      // Set a small delay to ensure the PDF is rendered before hiding the text layer
      setTimeout(hideTextLayer, 1000);
    }
  }, [pdfData, numPages]);

  // Fix canvas responsiveness after rendering the PDF
  useEffect(() => {
    if (pdfData) {
      const fixCanvasSize = () => {
        const canvases = document.querySelectorAll(".react-pdf__Page__canvas");
        canvases.forEach((canvas) => {
          canvas.style.width = "100%"; // Set canvas width to 100%
          canvas.style.height = "auto"; // Maintain aspect ratio
        });
      };
      setTimeout(fixCanvasSize, 500); // Give a little delay to ensure canvas has rendered
    }
  }, [pdfData, numPages]);

  // Function to add a signature field dynamically
  const addSignatureField = (fieldType) => {
    setSignatureElements((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: fieldType,
        position: { x: 100, y: 100 }, // Default position
      },
    ]);
  };

  // Handle drag stop for signature elements
  const handleDragStop = (id, data) => {
    setSignatureElements((prev) =>
      prev.map((element) =>
        element.id === id
          ? { ...element, position: { x: data.x, y: data.y } }
          : element
      )
    );
  };

  // Function to get the box positions of signature elements
  const getBoxPosition = () => {
    const positions = [];
    document.querySelectorAll(".sign-action").forEach((element) => {
      const rect = element.getBoundingClientRect(); // Get position relative to the viewport
      positions.push({
        id: element.id,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    });
    return positions;
  };

  // Save template and send signature data to the server
  const handleSaveTemplate = async ({
    templateName,
    signerName,
    signerEmail,
  }) => {
    const fields = getBoxPosition(); // Get positions of signature elements
    const currentDate = new Date();
    const oneMonthLater = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    const formattedDate = oneMonthLater.toISOString();

    try {
      // Initial POST request to create the template using axios
      const response = await axios.post("create-template", {
        doc_id: docId, // Assuming you have docId from useParams
        name: templateName,
        fields,
      });

      if (response.status === 200) {
        const templateId = response.data.data.template; // Extract template ID from the response

        // Second POST request to send the template
        const sendTemplateResponse = await axios.post(
          `/send-template/${templateId}/`,
          {
            expires_at: formattedDate,
            name: signerName,
            email: signerEmail,
            client_id: "{{ for_client }}", // Replace with actual client ID
            case_id: "{{ for_case }}", // Replace with actual case ID
          }
        );

        if (sendTemplateResponse.status === 200) {
          // Hide the modal after successful template save and send
          setShowModal(false); // Close the modal without redirecting the user
          alert("Template saved and sent successfully.");
        } else {
          throw new Error("Error while sending the template.");
        }
      } else {
        throw new Error("Error while creating the template.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred, please try again.");
    }
  };

  return (
    <div>
      <header
        className="esign-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgb(9, 55, 97)",
          padding: "10px",
          color: "white",
        }}
      >
        <img
          src={`${origin}/static/bp_assets/img/logo-new.png`}
          alt="Logo"
          style={{ maxHeight: "40px" }}
        />
        <h1 className="Esign-heading" style={{ color: "white" }}>
          Place the Electronic Signature Fields on the Document
        </h1>
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: "#007bff",
            borderColor: "#007bff",
            color: "white",
          }}
          onClick={() => setShowModal(true)}
        >
          Save
        </button>
      </header>

      <div className="esign-wrapper">
        <nav id="esign-sidebar">
          <ul className="list-unstyled components">
            <li>
              <button
                className="a-btn"
                onClick={() => addSignatureField("SIGN")}
              >
                Click To Add Sign
              </button>
            </li>
            <li>
              <button
                className="a-btn"
                onClick={() => addSignatureField("NAME")}
              >
                Click To Add Name
              </button>
            </li>
            <li>
              <button
                className="a-btn"
                onClick={() => addSignatureField("EMAIL")}
              >
                Click To Add Email
              </button>
            </li>
            <li>
              <button
                className="a-btn"
                onClick={() => addSignatureField("DATE")}
              >
                Click To Add Date
              </button>
            </li>
          </ul>
        </nav>

        <div className="esign-main-content-container d-flex align-items-center flex-column">
          {pdfData && (
            <div
              className="esign-pdf-container"
              style={{ position: "relative" }}
            >
              <Document
                file={pdfData}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={800}
                  />
                ))}
              </Document>

              {/* Render signature elements as draggable */}
              {signatureElements.map((element) => (
                <Draggable
                  key={element.id}
                  position={element.position}
                  onStop={(e, data) => handleDragStop(element.id, data)}
                >
                  <div
                    className={`draggable-sign sign-action ${element.type.toLowerCase()}-element`}
                    style={{
                      position: "absolute",
                      padding: "10px",
                      backgroundColor: "#ffda5b",
                      color: "#9d2624",
                      cursor: "move",
                    }}
                  >
                    {element.type}{" "}
                    <button
                      style={{ marginLeft: "10px", color: "red" }}
                      onClick={() =>
                        setSignatureElements((prev) =>
                          prev.filter((el) => el.id !== element.id)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </Draggable>
              ))}
            </div>
          )}
        </div>
      </div>

      <SaveTemplateModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveTemplate}
      />
    </div>
  );
};

export default ESignPage;
