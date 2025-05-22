import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

// Individual document panel skeleton loader
const DocumentSkeletonLoader = ({ idx }) => {
  return (
    <div
      id="dummy-height-330"
      className="col-12 pl-0 pr-0 "
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        background: idx % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)",
      }}
    >
      <div className="position-absolute progress-bar-indeterminant">
        <LinearProgress
          sx={{
            backgroundColor: "var(--primary-50)", // Background color of the track
            "& .MuiLinearProgress-bar": {
              backgroundColor: "var(--primary)", // Color of the progress bar
            },
          }}
        />
      </div>
    </div>
  );
};

export default DocumentSkeletonLoader;
