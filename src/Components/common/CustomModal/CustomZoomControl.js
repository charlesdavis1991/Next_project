import React from "react";
import "./CustomZoomControl.css";
import { Add, Remove, KeyboardArrowDown } from "@mui/icons-material";

const CustomZoomControl = ({ onZoomChange, zoomScale }) => {
  const handleZoom = (zoomType) => {
    onZoomChange(zoomType);
  };

  return (
    <div className="zoom-controls d-flex align-items-center justify-content-center">
      <button
        className="color-main"
        onClick={() => handleZoom("in")}
        aria-label="Zoom in"
        style={{ height: "25px" }}
      >
        <Add />
      </button>
      <div className="v-sep"></div>
      <button
        className="color-main"
        onClick={() => handleZoom("out")}
        aria-label="Zoom out"
        style={{ height: "25px" }}
      >
        <Remove />
      </button>
      <div className="dropdown">
        <div
          className="dropdown-value dropdown-value-max-height dropdown-value-max-width d-flex align-items-center"
          style={{ height: "25px" }}
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
            )
          )}
        </div>
      </div>
      <div className="ml-2 dropdown-value-max-height">
        <button
          type="button"
          className="pushed zoom-controls-text-buttons-colors color-main"
          onClick={() => handleZoom("width")}
          aria-label="Page width"
          style={{ height: "25px" }}
        >
          Page Width
        </button>
        <button
          type="button"
          className="pushed zoom-controls-text-buttons-colors color-main"
          onClick={() => handleZoom("fit")}
          aria-label="Full page"
          style={{ height: "25px" }}
        >
          Full Page
        </button>
      </div>
    </div>
  );
};

export default CustomZoomControl;
