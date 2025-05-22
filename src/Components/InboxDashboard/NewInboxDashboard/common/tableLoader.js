import React from "react";
const loaderStyle = {
  border: "16px solid #f3f3f3",
  borderRadius: "50%",
  borderTop: "16px solid #3498db",
  width: "120px",
  height: "120px",
  WebkitAnimation: "spin 2s linear infinite", // Safari
  animation: "spin 2s linear infinite",
  zIndex: 1000,
  position: "relative",
  marginLeft: "auto",
  marginTop: "auto",
};

const TableLoaderInbox = (props) => {
  return (
    <div className="d-flex justify-content-center">
      <div className="loader m-auto" style={loaderStyle}></div>
    </div>
  );
};

export default React.memo(TableLoaderInbox);
