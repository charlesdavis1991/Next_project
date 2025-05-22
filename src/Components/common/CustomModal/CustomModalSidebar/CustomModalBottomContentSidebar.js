import React, { useState } from "react";
import "./CustomModalBottomContentSidebar.css";
import api from "../../../../api/api";
import axios from "axios";
import { useDocumentModal } from "../CustomModalContext";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import { mediaRoute } from "../../../../Utils/helper";

// const apiEndpoint = "api/delete-doc-api/";

const BottomContentSideBar = ({
  docId,
  documentURL,
  file_name,
  imageRef,
  documentURLfordownload,
  isPdf = true,
  buttonData,
  error,
}) => {
  // Handle download for PDF and Images
  // const handleDownload = async () => {
  //   try {
  //     if (isPdf) {
  //       const response = await api.post(apiEndpoint, {
  //         doc_id: docId,
  //         check: "",
  //       });
  //       const data = response.data.data;
  //       const blob = createBlob(data);
  //       const fileURL = URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = fileURL;
  //       link.setAttribute("download", "file.pdf");
  //       document.body.appendChild(link);
  //       link.click();
  //       link.parentNode.removeChild(link);
  //     } else {
  //       const response = await axios.get(
  //         `${mediaRoute(documentURL)}?timestamp=${new Date()}`,
  //         {
  //           responseType: "blob",
  //           withCredentials: false,
  //         }
  //       );
  //       const blob = response.data;
  //       saveAs(blob, file_name);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or processing the blob:", error);
  //     setError(error.response?.data?.message || "An unexpected error occurred");
  //   }
  // };

  // // Handle delete for PDF and Images
  // const handleDelete = async () => {
  //   try {
  //     if (isPdf) {
  //       const response = await api.post(apiEndpoint, {
  //         doc_id: docId,
  //         check: "Delete",
  //       });
  //       const data = response.data.data;
  //       const blob = createBlob(data);
  //       const url = URL.createObjectURL(blob);
  //       const iframe = document.createElement("iframe");
  //       iframe.style.display = "none";
  //       iframe.src = url;
  //       document.body.appendChild(iframe);
  //       iframe.onload = () => {
  //         iframe.contentWindow.print();
  //         document.body.removeChild(iframe);
  //       };
  //     } else {
  //       await handleDownload();
  //       await api.delete(`api/delete-photo-doc/?photo_id=${docId}`);
  //       hideDocumentModal();
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete document:", error);
  //     setError(error.response?.data?.message || "An unexpected error occurred");
  //   }
  // };

  // // Handle print for PDF and Images
  // const handlePrint = isPdf
  //   ? async () => {
  //       try {
  //         const response = await api.post(apiEndpoint, {
  //           doc_id: docId,
  //           check: "",
  //         });
  //         const data = response.data.data;
  //         const blob = createBlob(data);
  //         const url = URL.createObjectURL(blob);
  //         const iframe = document.createElement("iframe");
  //         iframe.style.display = "none";
  //         iframe.src = url;
  //         document.body.appendChild(iframe);
  //         iframe.onload = () => {
  //           iframe.contentWindow.print();
  //           document.body.removeChild(iframe);
  //         };
  //       } catch (error) {
  //         console.error("Failed to print document:", error);
  //         setError(
  //           error.response?.data?.message || "An unexpected error occurred"
  //         );
  //       }
  //     }
  //   : useReactToPrint({ content: () => imageRef.current });

  // // Handle remove
  // const handleRemove = async () => {
  //   try {
  //     const response = await api.put("/api/remove-doc/", { doc_id: docId });
  //     if (response.status === 200) {
  //       hideDocumentModal();
  //       toggle();
  //     } else {
  //       setError("Failed to rename document due to server-side error.");
  //     }
  //   } catch (error) {
  //     setError(error.response?.data?.message || "An unexpected error occurred");
  //   }
  // };

  return (
    <div className="bottom-content side-bar-padding p-0">
      <div className="m-b-5 six-buttons m-l-5 m-r-10">
        {buttonData.map((button, index) => (
          <button
            key={index}
            className={button.className}
            onClick={() => button.onClick(docId)}
          >
            {button.label}
          </button>
        ))}
        {/* <button
          className="btn btn-primary col height-25 d-flex align-items-center justify-content-center"
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          className="btn btn-primary download-btn col height-25 d-flex align-items-center justify-content-center"
          onClick={handleDownload}
        >
          Download
        </button>
        <button className="btn btn-primary col height-25 d-flex align-items-center justify-content-center">
          Email
        </button>
        <button
          type="button"
          className="btn btn-secondary col height-25 d-flex align-items-center justify-content-center"
          onClick={handleRemove}
        >
          Inbox
        </button>
        <button className="btn btn-primary height-25 d-flex align-items-center justify-content-center flex-g">
          E-Sign
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn btn-secondary height-25 d-flex align-items-center justify-content-center flex-g"
        >
          Delete
        </button> */}
      </div>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default BottomContentSideBar;
