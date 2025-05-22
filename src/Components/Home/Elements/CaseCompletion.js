import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./caseCompletion.css";

const CaseCompletion = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [caseLoad, setCaseLoad] = useState(0);
  const fetchCaseLoadCache = async () => {
    try {
      const response = await api.get(`${origin}/api/homepage/case-load-cache/`);

      if (response.status === 200) {
        var data = response.data;
        setCaseLoad(data.case_load);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };
  const fetchCaseLoad = async () => {
    try {
      const response = await api.get(`${origin}/api/homepage/case-load/`);

      if (response.status === 200) {
        var data = response.data;
        setCaseLoad(data.case_load);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  useEffect(() => {
    fetchCaseLoadCache();
    fetchCaseLoad();
  }, []);
  return (
    <div
      className="case-completion col-12 column order-1 m-b-5 m-r-5"
      id="case-completion-id-status-new-update"
    >
      <div
        className="bg-primary-2 h-100"
        style={{ maxWidth: "94px", width: "94px" }}
      >
        <div className="background-main-10 height-25">
          <h4 className="client-contact-title height-25 text-center d-flex justify-content-center align-items-center h-100">
            Case Load
          </h4>
        </div>
        <div className="case-completion-chart p-t-10 p-b-10 d-flex align-items-center">
          <div
            className="circlechart d-flex align-items-center justify-content-center"
            data-percentage={caseLoad}
          >
            <svg
              className="circle-chart"
              viewBox="0 0 33.83098862 33.83098862"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="circle-chart__background"
                cx="16.9"
                cy="16.9"
                r="15.9"
              ></circle>
              <circle
                className="circle-chart__circle stroke-carrot-orange"
                stroke-dasharray={`${caseLoad}, 100`} // Dynamic stroke-dasharray
                cx="16.9"
                cy="16.9"
                r="15.9"
              ></circle>
              <g className="circle-chart__info">
                {" "}
                <text className="circle-chart__percent" x="17.9" y="12.5">
                  {caseLoad}%
                </text>{" "}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseCompletion;
