import React from "react";
import "./ZoomControl.css";
import { Add, Remove, KeyboardArrowDown } from "@mui/icons-material";

const ZoomControls = ({ onZoomChange, zoomScale }) => {
  const handleZoom = (zoomType) => {
    onZoomChange(zoomType);
  };

  return (
    <div className="zoom-controls d-flex align-items-center justify-content-center">
      <button onClick={() => handleZoom("in")} aria-label="Zoom in">
        <Add />
      </button>
      <div className="v-sep"></div>
      <button onClick={() => handleZoom("out")} aria-label="Zoom out">
        <Remove />
      </button>
      <div className="dropdown">
        <div
          className="dropdown-value"
          onClick={() => handleZoom("toggleDropdown")}
        >
          <span className="zoomval">{+(zoomScale * 100).toFixed(2)}%</span>
          <KeyboardArrowDown style={{ fontSize: 14 }} />
        </div>
        <div className="dropdown-content">
          {/* Buttons to adjust zoom level */}
          {["width", "height", "fit", 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4].map(
            (zoomLevel) => (
              <button
                key={zoomLevel}
                onClick={() => handleZoom(zoomLevel)}
                onKeyPress={(e) => e.key === "Enter" && handleZoom(zoomLevel)}
                aria-label={`Zoom ${zoomLevel}`}
              >
                {typeof zoomLevel === "number"
                  ? `${zoomLevel * 100}%`
                  : `Adjust ${zoomLevel}`}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="ml-2">
        <button
          type="button"
          className="pushed"
          onClick={() => handleZoom("width")}
          aria-label="Page width"
        >
          Page Width
        </button>
        <button
          type="button"
          className="pushed"
          onClick={() => handleZoom("fit")}
          aria-label="Full page"
        >
          Full Page
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;
