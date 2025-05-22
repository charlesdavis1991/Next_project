import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import "../../../public/BP_resources/css/notes.css";

const NotesCategoryDropdown = forwardRef(
  (
    {
      handleNoteCreateFormSubmission,
      textAreaId,
      tabsPage,
      case_id,
      client_id,
      toggleDropDownParent,
    },
    ref
  ) => {
    const node_env = process.env.NODE_ENV;
    const media_origin =
      node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Case");

    const dropdownRef = useRef(null); // Reference for the dropdown element

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
      toggleDropDownParent(!isOpen);
    };

    const handleCategoryClick = (item) => {
      setSelectedCategory(item);
      toggleDropdown(); // Close the dropdown after selection
    };

    // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false); // Close the dropdown if clicked outside
        }
      };

      // Add event listener when the dropdown is open
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      // Clean up the event listener
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const childFunction = () => {
      return selectedCategory;
    };

    useImperativeHandle(ref, () => ({
      childFunction,
    }));

    return (
      <div
        className="col-auto col-right mb-0 d-flex align-items-center justify-content-between"
        style={{
          paddingTop: "1px",
          paddingRight: "0px",
          paddingLeft: "0px",
          height: "42px",
        }}
        ref={dropdownRef} // Assign ref to the div containing the dropdown
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            height: "25px",
            marginBottom: "10px",
            marginTop: "0px",
            paddingLeft: "6px",
          }}
        >
          <div
            className="dropdown notes-category-wrapper primary-border-2 notes-custom skewed-button"
            style={{ width: "166px", height: "25px", marginRight: "8px" }}
          >
            <button
              className="dropdown-toggle footer-select notes-category text-left d-flex align-items-center height-25"
              type="button"
              onClick={toggleDropdown}
              aria-expanded={isOpen}
              id="dropdownMenuLink"
              aria-haspopup="true"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span className="d-flex align-items-center text-truncate anti-skew">
                <img
                  src={
                    media_origin +
                      tabsPage.find((item) => item.name === selectedCategory)
                        ?.page_icon ||
                    "https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg"
                  }
                  className="mr-1 notes-sec-width-19px-height-19px m-b-2"
                />
                {selectedCategory || "Case"}
              </span>
              <span className="ic ic-17 height-100 has-no-after anti-skew text-primary d-flex align-items-center justify-content-center ml-auto">
                <svg
                  width="34"
                  height="17"
                  viewBox="0 0 34 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </button>
            {isOpen && (
              <div
                className="dropdown-menu w-100 p-0 d-block"
                style={{ position: "absolute", left: "0px" }}
                aria-labelledby="dropdownMenuLink"
                id="note_category"
              >
                {tabsPage.map(
                  (item) =>
                    item.is_notes_category && (
                      <a
                        key={item.id}
                        className="dropdown-item height-25"
                        onClick={() => handleCategoryClick(item.name)}
                      >
                        {item.page_icon ? (
                          <img
                            src={media_origin + item.page_icon}
                            className="mr-1 notes-sec-width-19px-height-19px"
                          />
                        ) : (
                          <i className="ic ic-notes ic-19 m-r-5"></i>
                        )}
                        {item.name}
                      </a>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default NotesCategoryDropdown;
