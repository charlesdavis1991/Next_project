import React, { useState } from "react";
import "./BottomContentSideBar.css";
import api from "../../../api/api";
import { useDocumentModal } from "../DocumentModalContext";
import { saveAs } from "file-saver";
import { useUpdateTrigger } from "../../CostDashboard/TriggerUpdateContext";
import { useReactToPrint } from "react-to-print";
import { photoData } from "../../Photo/utils";
import axios from "axios";
import { mediaRoute } from "../../../Utils/helper";

const apiEndpoint = "api/delete-doc-api/";

async function fetchDocument(docId, check = "",hideDocumentModal) {
  try {
    const response = await api.post(apiEndpoint, { doc_id: docId, check });
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Re-throw to handle it in the component
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
        // Specific logic for delete
        const url = URL.createObjectURL(blob);
        // Any further logic like printing or showing a preview
        return { success: true, url };
      } else {
        // Default handling, e.g., download or print
        return { success: true, blob };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  return { handleAction };
}

function BottomContentSideBar({ docId, documentURL, file_name, imageRef,documentURLfordownload }) {
  const { hideDocumentModal, toggle } = useDocumentModal();
  const [error, setError] = useState(null);
  const handleDownload = async () => {
    console.log("docId",docId);
    console.log("documentURL",documentURL);
    console.log("file_name",file_name);
    console.log("imageRef",imageRef);
    try {
      console.log("documentURL", documentURLfordownload);
      const response = await axios.get(`${mediaRoute(documentURL)}?timestamp=${new Date()}`, {
        responseType: "blob",
        withCredentials: false
      });
      const blob = response?.data;
      const objectURL = URL.createObjectURL(blob);
      saveAs(objectURL, file_name);
    } catch (error) {
      console.error("Error fetching or processing the blob:", error);
    }
  };
  const handleDelete = async (docId) => {
    try {
      await handleDownload()
      const response = await api.delete(
        `api/delete-photo-doc/?photo_id=${docId}`,
        {
          check: "Delete",
        }
      );
      const data = response.data;
      console.log("photo delete data", data);
      
      hideDocumentModal();
      // window.location.reload(true);
    } catch (error) {
      console.error(
        "Failed to delete photo:",
        error.response?.data || error.message
      );
    }
  };
  const handlePrint = useReactToPrint({
    content: () => imageRef.current,
  });
  const handleRemove = async (docId) => {
    try {
      const response = await api.put("/api/remove-doc/", {
        doc_id: docId,
      });

      if (response.status === 200) {
        console.log("Document renamed successfully:", response.data);
        hideDocumentModal();
        toggle();
      } else {
        setError("Failed to rename document due to server-side error.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred");
    }
  };
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <div className="bottom-content side-bar-padding">
      <div className="m-b-5 six-buttons m-l-5 m-r-5">
        <button
          className="btn btn-primary col height-25 d-flex align-items-center justify-content-center"
          onClick={() => handlePrint(docId)}
        >
          Print
        </button>
        <button
          className="btn btn-primary download-btn col height-25 d-flex align-items-center justify-content-center"
          onClick={() => handleDownload()}
        >
          Download
        </button>
        <button className="btn btn-primary col height-25 d-flex align-items-center justify-content-center">
          Email
        </button>
        <button
          type="button"
          className="btn btn-secondary col height-25 d-flex align-items-center justify-content-center"
          onClick={() => handleRemove(docId)}
        >
          Inbox
        </button>
        <button className="btn btn-primary height-25 d-flex align-items-center justify-content-center flex-g">
          E-Sign
        </button>
        <button
          type="button"
          onClick={() => handleDelete(docId)}
          className="btn btn-secondary height-25 d-flex align-items-center justify-content-center flex-g"
        >
          Delete
        </button>
      </div>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {/* <div className="dropdown mb-2 mt-2 has-sub-dropdown">
        <p className="text-center color-main">CLICK TO MOVE DOCUMENT:</p>
        <div id="overflow-x-vls" className="d-230-46 show">
          <ul className="dropdown-menu add-menu dropdown-menu-parent d2-230-46 d-block m-t-0">
            {menuItems.map((item, idx) => (
              <li className="dropdown-submenu" key={idx} onMouseOver={() => {setHoveredIdx(idx)}} onMouseOut={() => setHoveredIdx(null)}>
                <a onmouseover={`getDataDoc(${item.id},this,event,${item.event},46,1,&quot;${item.name}&quot;,&quot;${item.icon}&quot;);event.stopPropagation();`} className="test trigger hover-effect" tabIndex="-1" href="#">
                  <span className="has-no-after text-primary width-17 right-0 mr-2 dropdown--left-icons">
                    <svg width="15" className="vertical-align-mid remove-hover-effect" height="15" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: 'rotate(90deg)'}}>
                      <path d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z" fill="currentColor"></path>
                    </svg>
                  </span>
                  <img src={item.icon} className="doc-pop-width-15px-height-15px mr-1" />
                  {item.name}
                  <span className="caret"></span>
                </a>
                <ul className={`dropdown-menu submenu ${hoveredIdx === idx ? 'iblockDisplay' : 'inoneDisplay'}`} style={{minWidth: '189.117px', right: '280px', top: '-20px'}}>
                  {item.submenu.map((subItem, subIdx) => (
                    <li key={subIdx}>
                      <a style={{ minHeight: '35px', backgroundColor: subIdx % 2 === 0 ? '#e6ebef' : 'f2f5f7' }} onclick={`${subItem.action}(${item.id},'${subItem.id}',${item.event},'${subItem.id}','False',46,'${item.name}','');event.stopPropagation();`} className="doc-pop-width-90P DD3-Align" href="#">
                        <i className={subItem.icon}></i> <span style={{whiteSpace: 'nowrap'}}>{subItem.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
    </div>
  );
}

export default BottomContentSideBar;
