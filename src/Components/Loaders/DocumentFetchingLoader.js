import React from "react";
const loaderStyle = {
  border: "12px solid #f3f3f3",
  borderRadius: "50%",
  borderTop: "12px solid #3498db",
  width: "100px",
  height: "100px",
  WebkitAnimation: "spin 2s linear infinite", // Safari
  animation: "spin 2s linear infinite",
  zIndex: 1000,
  position: "relative",
  marginLeft: "auto",
  marginTop: "auto",
  left:"50%",
  top:"20px"
};

const DocumentFetchingLoader = (props) => {
    return(
        <div>
          <div className="loader m-auto" style={loaderStyle}></div>
        </div>
    );
}

export default DocumentFetchingLoader;