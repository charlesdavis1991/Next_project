import React, { useState, useEffect, useRef } from "react";

function DatesGapDropdown({fetchTreatmentDateGapData}){
    const [selectedGap, setSelectedGap] = useState('Do not show Gaps');
    const [isOpen, setIsOpen] = useState(false);
    const toggleGapDropdown = () => setIsOpen(!isOpen);
    const handleGapDropdownClick = (item) => {
      setSelectedGap(item);
      toggleGapDropdown();
      fetchTreatmentDateGapData(item);
    };
    return (
        <div className="dropdown notes-category-wrapper m-r-5 m-l-5 d-block">
          <button
            className="dropdown-toggle footer-select notes-category text-left d-flex align-items-center height-25 gap-dropdown-btn"
            type="button"
            onClick={toggleGapDropdown}
            aria-expanded={isOpen}
            id="dropdownMenuLink"
            aria-haspopup="true"
          >
            <span className="d-flex align-items-center text-truncate">
              {selectedGap || 'Do not Show Gaps'}
            </span>
            <span className="ic ic-17 height-100 has-no-after ic-arrow text-primary d-flex align-items-center justify-content-center ml-auto">
              <svg
                width={34}
                height={17}
                viewBox="0 0 34 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
          {isOpen && (
          <div
            className="dropdown-menu w-100 p-0 d-block"
            aria-labelledby="dropdownMenuLink"
            id=""
          >
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('1 week')}
            >
              1 Week
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('2 weeks')}
            >
              2 weeks
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('3 weeks')}
            >
              3 weeks
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('30 days')}
            >
              30 days
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('60 days')}
            >
              60 days
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('90 days')}
            >
              90 days
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('180 days')}
            >
              180 days
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('1 year')}
            >
              1 year
            </a>
            <a
              className="dropdown-item height-25"
              onClick={() => handleGapDropdownClick('Do nor show gaps')}
            >
              Do nor show gaps
            </a>
          </div>
          )}
        </div>
    )
  }

export default DatesGapDropdown