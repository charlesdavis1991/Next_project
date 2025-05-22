import React from "react";
const loaderStyle = {
  border: "3px solid #FFFFFF",
  borderRadius: "50%",
  borderTop: "3px solid #3498db",
  width: "15px",
  height: "15px",
  WebkitAnimation: "spin 2s linear infinite", // Safari
  animation: "spin 2s linear infinite",
};

const ButtonLoader = (props) => {
    return(
        <div>
          <div className="loader m-auto" style={loaderStyle}></div>
        </div>
    );
}

export default ButtonLoader;