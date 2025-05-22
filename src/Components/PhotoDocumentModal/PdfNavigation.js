import React, { useState } from "react";
import {
  ArrowDownward,
  ArrowUpward,
  ViewSidebarOutlined,
} from "@mui/icons-material";
import ZoomControls from "./ZoomControls";

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
    <div className="pdftoolbar p-l-5 p-r-5 align-items-center m-0">
      <div className="col-md-3 col-lg-5 col-xl-6 col-xxl-7 p-0 d-flex align-items-center">
        <button onClick={toggleSidebar}>
          <ViewSidebarOutlined />
        </button>
        <div className="input-row d-flex-1 p-l-5">
          <input
            type="text"
            className="form-control height-35"
            placeholder="Type Text to Search Within Document"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e);
            }}
          />
        </div>
        <div className="center-controls d-flex align-items-center justify-content-center ml-auto">
          <button onClick={decrementPageNumber} disabled={pageNumber <= 1}>
            <ArrowUpward />
          </button>
          <input
            id="pageno"
            className="pageno form-control"
            value={pageNumber}
            onChange={handleChangePageNumber}
            min="1"
            max={totalPages}
          />
          <button
            onClick={incrementPageNumber}
            disabled={pageNumber >= totalPages}
          >
            <ArrowDownward />
          </button>
        </div>
      </div>
      <ZoomControls onZoomChange={onZoomChange} zoomScale={zoomScale} />
    </div>
  );
};

export default PdfNavigation;
