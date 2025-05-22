import React, { useState } from "react";
import "./InfoPanelWithoutKeyValue.css";

const InfoPanelWithoutKeyValue = ({
  id,
  // title,
  // first_name,
  // last_name,
  panel_name,
  data,
  onSelectReport,
  hasBtn = false,
  imgSrc,
  buttonText,
  className,
  imgClassName,
  iconClassName,
  onClick = () => console.log("Hi"),
  panelClassName = "",
  defaultLength = 7,
}) => {
  return (
    <>
      <div className={`info-div min-w-260px-client ${panelClassName}`}>
        <div className=" " onClick={onSelectReport}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "var(--primary-15)", height: "25px" }}
          >
            <p className="columnsTitle text-center d-flex text-primary font-weight-semibold text-uppercase">
              {panel_name}
            </p>
          </div>
          {data.map((item, index) => (
            <div
              className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap p-r-5 p-l-5"
              key={index}
            >
              <div className="col text-left p-0">
                <span
                  className="d-inline-block"
                  style={{
                    // color: "var(--primary-25)",
                    fontWeight: "600",
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div className="col-auto p-0 text-left font-weight-semibold">
                <p>{item.value}</p>
              </div>
            </div>
          ))}
          {data.length < defaultLength &&
            Array.from({ length: 7 - data.length }).map((_, index) => (
              <div
                className="info-color-panels-odd-even d-flex align-items-center justify-content-between mb-0 colFont flex-wrap"
                style={{ height: "21px" }}
                key={`${index}`}
              ></div>
            ))}
        </div>
        {hasBtn && (
          <div className="mt-0">
            <a
              href="#"
              className={`btn info-panel-button-hover-state font-weight-semibold text-lg height-25 rounded-0 d-flex align-items-center justify-content-center ${className}`}
              onClick={onClick}
              style={{
                backgroundColor: "var(--primary-10)",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
              }}
            >
              {iconClassName && <i className={`${iconClassName} mr-1`}></i>}
              {imgSrc && (
                <img className={imgClassName} src={imgSrc} alt="icon" />
              )}
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default InfoPanelWithoutKeyValue;
