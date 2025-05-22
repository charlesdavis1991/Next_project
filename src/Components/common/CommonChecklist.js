import React from "react";

const CommonChecklist = () => {
  return (
    <div id="actionbarChecklist" className="checklist-section-wrapper">
      <div className="skew-box"></div>

      <div className="checklist-section translate-5">
        <div className="dropdown">
          <button
            className="dropdown-toggle text-white d-flex align-items-center justify-content-end w-100"
            id="myDropdown"
            type="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="nt-box m-l-5" id="ntbox-margin-20">
              <div
                className="circlechart case-checklist-percentage"
                data-percentage={50}
                id="case-checklist-percentage"
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
                  />
                  <circle
                    className="circle-chart__circle stroke-vivid-cerulean"
                    strokeDasharray="24,100"
                    cx="16.9"
                    cy="16.9"
                    r="15.9"
                  />
                  <g className="circle-chart__info">
                    {" "}
                    <text className="circle-chart__percent" x="17.9" y="12.5">
                      50%
                    </text>
                    <text
                      className="circle-chart__subline"
                      x="16.91549431"
                      y={22}
                    >
                      {" "}
                      100% 100%
                    </text>{" "}
                  </g>
                </svg>
              </div>
            </div>
            <span className="d-flex align-items-center">
              <span className="ic has-no-after ic-check text-success d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
                <svg
                  width={17}
                  height={50}
                  viewBox="0 0 17 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="checklist-text ">
                Treatment <br />
                Page
              </span>
              <span className="ic has-no-after ic-arrow text-white d-sm-none d-md-none d-lg-flex d-xl-flex align-items-center justify-content-center">
                <svg
                  width="17"
                  height="50"
                  viewBox="0 0 17 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </span>
          </button>
          <div
            aria-labelledby="myDropdown"
            className="dropdown-menu dropdown-menu-right dropdown-content"
          >
            <div className="checkbox-line">
              <input
                type="checkbox"
                checked
                disabled
                onclick="location.href='/30/uncheckChecklist/25/3/46/';"
                id="medicalcheck11"
                name="medicalcheck11"
              />
              <label for="medicalcheck11">Treatment First name</label>
            </div>
            <div className="checkbox-line">
              <input
                type="checkbox"
                disabled
                onclick="location.href='/30/markChecklist/26/3/46/';"
                id="medicalcheck11"
                name="medicalcheck11"
              />
              <label for="medicalcheck11">Treatment last name</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonChecklist;
