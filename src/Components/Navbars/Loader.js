import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        overflow: "hidden",
      }}
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
