import React from "react";
const SingleTd = ({ rows }) => {
  return (
    <>
      {rows.map((row, index) => (
        <div
          key={index}
          className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5"
          style={{ height: "21px" }}
        >
          <span>{row.label}</span>
          <p>{row.value}</p>
        </div>
      ))}
    </>
  );
};

export default SingleTd;
