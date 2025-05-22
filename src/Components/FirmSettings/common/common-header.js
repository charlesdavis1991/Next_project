import React from "react";

const CommonHeader = ({ heading, points }) => {
  return (
    <>
      <h3 className="text-center text-uppercase">{heading}</h3>
      {points.map((point, index) => (
        <p key={index} className="text-left" style={{ lineHeight: "2" }}>
          {point}
        </p>
      ))}
    </>
  );
};

export default CommonHeader;
