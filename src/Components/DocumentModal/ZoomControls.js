import React from "react";
import "./ZoomControl.css";
import { Add, Remove, KeyboardArrowDown } from "@mui/icons-material";

const ZoomControls = ({ onZoomChange, zoomScale }) => {
  const handleZoom = (zoomType) => {
    onZoomChange(zoomType);
  };

  return (
    <div
      className="zoom-controls d-flex align-items-center justify-content-center"
      style={{ gap: "10px" }}
    >
      <div className="dropdown-value-max-height">
        <button
          type="button"
          className=" zoom-controls-text-buttons-colors color-main"
          onClick={() => handleZoom("width")}
          aria-label="Page width"
          style={{
            height: "25px",
            padding: 0,
            paddingLeft: "5px",
            paddingRight: "5px",
            fontWeight: "600",
            marginRight: "10px",
          }}
        >
          Page Width
        </button>
        <button
          type="button"
          className=" zoom-controls-text-buttons-colors color-main"
          onClick={() => handleZoom("fit")}
          aria-label="Full-Page"
          style={{
            height: "25px",
            padding: 0,
            paddingLeft: "5px",
            paddingRight: "5px",
            fontWeight: "600",
          }}
        >
          Full-Page
        </button>
      </div>
      <button
        className="color-main d-flex align-items-center justify-content-center btns-bottom-bar-document-popup"
        onClick={() => handleZoom("in")}
        aria-label="Zoom in"
        style={{
          height: "25px",
          padding: 0,
          minWidth: "25px",
          width: "25px",
          // fontSize: "16px",
          // fontWeight: "700",
          // color: "var(--primary)",
        }}
      >
        <Add className="d-flex align-items-center justify-content-center" />
      </button>
      {/* <div className="v-sep"></div> */}
      <button
        className="color-main d-flex align-items-center justify-content-center btns-bottom-bar-document-popup"
        onClick={() => handleZoom("out")}
        aria-label="Zoom out"
        style={{ height: "25px", padding: 0, minWidth: "25px", width: "25px" }}
      >
        <Remove className="d-flex align-items-center justify-content-center" />
      </button>
      <div className="dropdown">
        <div
          className="dropdown-value dropdown-value-max-height dropdown-value-max-width d-flex align-items-center"
          style={{ height: "25px" }}
          onClick={() => handleZoom("toggleDropdown")}
        >
          <span
            className="zoomval"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--primary)",
            }}
          >
            {+(zoomScale * 100).toFixed(2)}%
          </span>
          {/* <KeyboardArrowDown style={{ fontSize: 14 }} /> */}
          <div
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              color: "#19395F",
              transform: "rotate(90deg)",
              backgroundImage: `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`,

              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              marginRight: "5px",
            }}
          ></div>
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
    </div>
  );
};

export default ZoomControls;
