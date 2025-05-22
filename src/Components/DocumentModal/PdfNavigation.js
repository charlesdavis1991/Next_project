import React, { useState } from "react";
import {
  ArrowDownward,
  ArrowUpward,
  ViewSidebarOutlined,
} from "@mui/icons-material";
import ZoomControls from "./ZoomControls";
import "./pdfNavigation.css";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";

const PdfNavigation = ({
  handleSearch,
  pageNumber = 1,
  setPageNumber,
  totalPages,
  onZoomChange,
  zoomScale,
  toggleSidebar,
  scrollPageToView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isfocus, setIsFocus] = useState(false);

  const handleChangePageNumber = (event) => {
    const newPageNumber = Number(event.target.value);
    if (newPageNumber >= 1 && newPageNumber <= totalPages) {
      scrollPageToView(newPageNumber, setPageNumber);
    }
  };

  const incrementPageNumber = () => {
    if (pageNumber <= totalPages + 1) {
      scrollPageToView(pageNumber + 1, setPageNumber);
    }
  };
  const decrementPageNumber = () => {
    if (pageNumber >= 1) {
      scrollPageToView(pageNumber - 1, setPageNumber);
    }
  };

  return (
    <div className="pdftoolbar document-pop-up-bottom-bar p-l-5 p-r-5 align-items-center m-0 overflow-hidden">
      <div className="col-md-3 col-lg-5 col-xl-6 col-xxl-7 p-0 d-flex align-items-center">
        {/* <button onClick={toggleSidebar} style={{ height: "25px" }}>
          <ViewSidebarOutlined />
        </button> */}
        <div
          className="input-row d-flex-1 p-l-5 min-width-search-document-popup"
          style={{
            height: "25px",
            maxWidth: "600px",
            marginRight: "5px",
            minWidth: "230px",
          }}
        >
          <input
            type="text"
            className="form-control height-25 document-search-text-color document-height-25px "
            placeholder="Type Search Terms to Only Display Pages With Those Terms"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e);
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            style={{
              height: "25px",
              fontWeight: "600",
              color: isfocus ? "var(--primary)" : "var(--primary-25)",
            }}
          />
        </div>
        <div
          className="center-controls d-flex align-items-center justify-content-center ml-auto"
          style={{ gap: "5px" }}
        >
          <button
            onClick={decrementPageNumber}
            disabled={pageNumber <= 1}
            style={{
              height: "25px",
              padding: 0,
              margin: 0,
              minWidth: "25px",
              width: "25px",
            }}
            className="d-flex align-items-center justify-content-center btns-bottom-bar-document-popup"
          >
            {/* <ArrowUpward className="d-flex align-items-center justify-content-center" /> */}
            <FaChevronUp
              size={18}
              style={{
                color: "#009900",
              }}
            />

            {/* <svg
              width="17"
              height="17"
              viewBox="0 0 34 17"
              fill="#009900"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: "rotate(180deg)" }}
            >
              <path
                d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                fill="#009900"
              />
            </svg> */}
          </button>
          <input
            id="pageno"
            className="pageno form-control p-0 color-main"
            value={pageNumber}
            onChange={handleChangePageNumber}
            min="1"
            max={totalPages}
            style={{
              height: "25px",
              fontWeight: "600",
              minWidth: "40px",
            }}
          />
          <button
            onClick={incrementPageNumber}
            disabled={pageNumber >= totalPages}
            style={{
              height: "25px",
              padding: 0,
              margin: 0,
              minWidth: "25px",
              width: "25px",
            }}
            className="d-flex align-items-center justify-content-center btns-bottom-bar-document-popup"
          >
            <FaChevronDown
              size={18}
              style={{
                color: "#009900",
              }}
            />
            {/* <svg
              width="17"
              height="17"
              viewBox="0 0 34 17"
              fill="#009900"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                fill="#009900"
              />
            </svg> */}
            {/* <ArrowDownward className="d-flex align-items-center justify-content-center" /> */}
          </button>
        </div>
      </div>
      <ZoomControls onZoomChange={onZoomChange} zoomScale={zoomScale} />
    </div>
  );
};

export default PdfNavigation;
