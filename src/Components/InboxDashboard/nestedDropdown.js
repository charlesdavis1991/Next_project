import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { setTabsToShow } from "../../Redux/inbox/actions";
import { fetchPagePanels } from "../../Providers/main";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";
import mixColorWithWhite from "../TreatmentPage/utils/helperFn";
import "./nestedDropdown.css";

const NestedDropdown = ({
  setUnsortedCase,
  unsortedCase,
  setUnsortedPage,
  unsortedPage,
  inboxTab,
  setSelectedData,
  caseData,
}) => {
  const dropdownRef = React.useRef(null);
  const [dropdownOpenManual, setDropdownOpenManual] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPageName, setSelectedPageName] = useState();
  const [selectedPageId, setSelectedPageId] = useState();
  const [nestedDropdowns, setNestedDropdowns] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [panelMenuBar, setPanelMenuBar] = useState(false);
  console.log(caseData);
  // We don't need hoveredIndex anymore as we're using selectedPage for visibility
  // const [hoveredIndex, setHoveredIndex] = useState(null);

  const handlePageSelect = (page) => {
    setTabsToShow({ page: true, panels: true, rows: true });
    setSelectedPageId(page?.id);
    setSelectedPageName(page?.name);
    setSelectedPage(page);
    setNestedDropdowns([]);
    setUnsortedCase(false);
    // setSelectedData({ page_id: page?.id, slot: , panel: "-1" });
    setSelectedSlot(null);
    setSelectedPanel(null);
    fetchPagePanels(caseData?.id, page?.id, page?.name, setNestedDropdowns);
  };

  console.log("case daata", caseData);
  console.log("Paanel; Data", panelMenuBar);
  // console.log("Paanel; Data", panelMenuBar === );
  const toggleRef = React.useRef(null);

  // useEffect(() => {
  //   const calculateAndApplyMaxWidths = () => {
  //     if (!toggleRef.current) return;
  //     const dropmenuWidth = document.getElementById("dropdown-custom-menu");
  //     if (!dropmenuWidth) return;
  //     // Add a class to the toggle for easy selection
  //     toggleRef.current.classList.add("dropdown-1-2-3-inbox-page");

  //     const dropdownPicker = document.querySelectorAll(
  //       ".dropdown-1-2-3-inbox-page"
  //     );

  //     if (dropdownPicker.length === 0) return;

  //     // Set initial minimum width
  //     let dropdownWidth = 160;

  //     dropdownPicker.forEach((col) => {
  //       const textWidth = col.scrollWidth;
  //       console.log("Toggle width:", textWidth);

  //       if (textWidth > dropdownWidth) {
  //         dropdownWidth = textWidth;
  //       }
  //     });

  //     console.log("Final width:", dropdownWidth);

  //     dropmenuWidth.style.width = `${dropdownWidth + 20}px`; // Set the desired width in pixels
  //     // Apply the calculated width to all dropdown toggles
  //     dropdownPicker.forEach((col) => {
  //       col.style.width = `${dropdownWidth + 20}px`;
  //     });
  //   };

  //   setTimeout(calculateAndApplyMaxWidths, 50);
  // }, [selectedPage, selectedSlot]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenManual(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Dropdown
        id="dropdown-1"
        className="m-b-5 custom-dropdown-wrapper d-inline-block1 dropdown-1-2-3-inbox-page"
        show={dropdownOpenManual}
        onToggle={() => setDropdownOpenManual(!dropdownOpenManual)}
        ref={dropdownRef}
        // style={{
        //   width: "max-content",
        // }}
      >
        <div
          style={{ width: "100%" }}
          className="position custom-dropdown-opener"
        >
          <Dropdown.Toggle
            id="dropdown-custom"
            className={`bg-white dropdown-toggle form-select font-600 p-0 p-l-5 p-r-5 has-no-bg text-left d-flex align-items-center height-25 btn btn-default hover-black-text`}
            variant="secondary"
            style={{ width: "100%", content: "none", borderRadius: "0px" }}
            // onClick={() => setDropdownOpenManual(true)}
            ref={toggleRef}
          >
            <b
              className="d-flex align-items-center"
              style={{ fontWeight: "600" }}
            >
              {!selectedPage ? (
                "Select Page"
              ) : (
                <>
                  {selectedPage?.page_icon && (
                    <img
                      src={selectedPage?.page_icon}
                      alt="Page Icon"
                      className="m-r-5 mt-0 ic-19"
                    />
                  )}
                  {selectedPage?.name} -
                  {selectedSlot?.slot_number !== 0 && selectedSlot !== null && (
                    <span className="ml-2">
                      {selectedSlot?.slot_number}.
                      {selectedSlot?.slot_name
                        ? selectedSlot?.slot_name
                        : "Available"}
                    </span>
                  )}
                  {selectedSlot?.slot_number === 0 && (
                    <span className="ml-2">
                      Attached to {selectedPage?.name} Page generally
                    </span>
                  )}
                </>
              )}
            </b>
            <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center ml-auto">
              <svg
                width="34"
                height="17"
                viewBox="0 0 34 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
                  fill="#203f64"
                ></path>
              </svg>
            </span>
          </Dropdown.Toggle>
        </div>

        <Dropdown.Menu
          className="dropdown-menu p-0 add-menu"
          id="dropdown-custom-menu"
          style={{
            backgroundColor: "#fafbfc",
            top: "0",
            // width: "253px !important",
            width: "160px",
            position: "fixed ",
          }}
        >
          <div
            className="dropdown-parent neg-margin-0"
            style={{ width: "inherit" }}
          >
            {caseData?.selected_pages?.map((page, index) => {
              if (page?.is_notes_category) {
                return (
                  <div
                    key={index}
                    className="hover-dropdown-item even-odd-color-changes-menu-items"
                    // No need for hover handlers since we're using selectedPage for visibility
                    // onMouseEnter={() => setHoveredIndex(index)}
                    // onMouseLeave={() => setHoveredIndex(null)}
                    style={{ position: "relative", backgroundColor: "#fafbfc" }}
                  >
                    <div
                      className="dropdown-item p-t-5 p-b-5 p-r-5 p-l-5 d-flex align-items-center font-600 height-25"
                      onClick={() => handlePageSelect(page)}
                    >
                      {page?.page_icon && (
                        <img
                          src={page?.page_icon}
                          alt="Page Icon"
                          className="m-r-5 ic-19 mt-0"
                        />
                      )}
                      {page?.name}
                    </div>

                    {selectedPage &&
                      selectedPage.id === page.id &&
                      page?.panels &&
                      page?.name === "Treatment" &&
                      nestedDropdowns?.document_slots?.length > 0 && (
                        <div
                          className="even-odd-color-changes"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: "100%",
                            backgroundColor: "#f0f0f0",
                            border: "0px solid #ccc",
                            // minWidth: "280px",
                            // transform: `translatey(${index * 15}px)`,
                            zIndex: 1000,
                          }}
                        >
                          {nestedDropdowns?.document_slots.some(
                            (slot) => slot.slot_number === 0
                          ) && (
                            <li
                              className="d-flex align-items-center"
                              style={{
                                // padding: "0px 10px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const unsortedSlot =
                                  nestedDropdowns.document_slots.find(
                                    (slot) => slot.slot_number === 0
                                  );
                                setUnsortedCase(false);
                                setUnsortedPage(false);
                                setNestedDropdowns([]);
                                setSelectedData({
                                  page_id: page?.id,
                                  slot: unsortedSlot?.id,
                                  panel: "-1",
                                });
                                setDropdownOpenManual(false);
                                setSelectedPanel(null);
                                setSelectedSlot(unsortedSlot);
                              }}
                            >
                              <div
                                className="d-flex align-items-center font-600  whitespace-nowrap"
                                style={{
                                  width: "100%",
                                }}
                              >
                                <span
                                  className="d-flex align-items-center justify-content-center  "
                                  // style={{ fontWeight: "bold" }}
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                  }}
                                >
                                  <img
                                    src={
                                      nestedDropdowns?.document_slots.find(
                                        (slot) => slot.slot_number === 0
                                      )?.page?.page_icon ?? ""
                                    }
                                    className="document-icons-width d-flex align-items-center cursor-pointer"
                                    alt=""
                                  />
                                </span>
                                Attach to{" "}
                                {
                                  nestedDropdowns?.document_slots.find(
                                    (slot) => slot.slot_number === 0
                                  )?.page?.name
                                }{" "}
                                Page generally
                              </div>
                            </li>
                          )}

                          {nestedDropdowns.data.map((panel, panelIndex) => {
                            return (
                              <li
                                key={panel?.id}
                                className="d-flex align-items-center"
                                style={{
                                  // padding: "0px 10px",
                                  height: "25px",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() => setPanelMenuBar(panelIndex)}
                                onMouseLeave={() => setPanelMenuBar(null)}
                              >
                                <span
                                  className=" d-flex align-items-center justify-content-center"
                                  style={{
                                    fontWeight: "bold",
                                    width: "25px",
                                    height: "25px",
                                  }}
                                >
                                  {panelIndex + 1}
                                </span>
                                <span
                                  className="d-flex align-items-center p-r-5 whitespace-nowrap"
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "black",
                                    width: "calc(100% - 25px)",
                                    background: mixColorWithWhite(
                                      panel?.specialty?.color,
                                      50
                                    ),
                                  }}
                                >
                                  <span
                                    style={{
                                      background: mixColorWithWhite(
                                        panel?.specialty?.color,
                                        50
                                      ),
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      height: "25px",
                                      width: "25px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      color: "white",
                                      marginRight: "5px",
                                    }}
                                  >
                                    {panel?.specialty?.name[0] ?? ""}
                                  </span>
                                  {panel?.panel_name ? panel.panel_name : ""}
                                </span>
                                <div
                                  className="even-odd-color-changes"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: "100%",
                                    backgroundColor: "#f0f0f0",
                                    border: "0px solid #ccc",
                                    // minWidth: "280px",
                                    transform: `translateY(${panelIndex * 15}px)`,
                                    // transform: `translateY(${panelIndex * 13}px)`,
                                    zIndex: 1000,
                                    display:
                                      panelMenuBar === panelIndex
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {nestedDropdowns.document_slots
                                    .filter((slot) => slot.slot_number !== 0)
                                    .map((slot) => (
                                      <li
                                        key={slot?.id}
                                        className="d-flex align-items-center whitespace-nowrap"
                                        style={{
                                          padding: "0px 10px",
                                          height: "25px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setUnsortedCase(false);
                                          setUnsortedPage(false);
                                          setNestedDropdowns([]);
                                          setSelectedData({
                                            page_id: page?.id,
                                            slot: slot?.id,
                                            panel: panel?.id,
                                          });
                                          setDropdownOpenManual(false);
                                          setSelectedPanel(panel);
                                          setSelectedSlot(slot);
                                        }}
                                      >
                                        <span
                                          className="d-flex align-items-center justify-content-center"
                                          style={{
                                            // backgroundRepeat: "no-repeat",
                                            width: "19px",
                                            // height: "19px",
                                          }}
                                        >
                                          <img
                                            src={UploadIcon}
                                            className="document-icons-width cursor-pointer"
                                            style={{
                                              backgroundRepeat: "no-repeat",
                                              width: "19px",
                                              height: "19px",
                                            }}
                                            alt="Upload"
                                          />
                                        </span>
                                        <div
                                          className={`d-flex align-items-center color-grey-2 hoverable-text`}
                                          style={{
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <>
                                            <span className="ml-2 hoverable-text">
                                              {slot.slot_number}.
                                            </span>
                                            <span className="ml-2 hoverable-text">
                                              {slot.slot_name
                                                ? slot.slot_name
                                                : "Available"}
                                            </span>
                                          </>
                                        </div>
                                      </li>
                                    ))}
                                </div>
                              </li>
                            );
                          })}
                        </div>
                      )}

                    {selectedPage &&
                      selectedPage.id === page.id &&
                      page?.panels &&
                      page?.name !== "Treatment" &&
                      nestedDropdowns?.document_slots?.length > 0 && (
                        <div
                          className="even-odd-color-changes"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: "100%",
                            backgroundColor: "#f0f0f0",
                            border: "0px solid #ccc",
                            // minWidth: "280px",
                            // transform: `translatey(${index * 15}px)`,
                            zIndex: 1000,
                          }}
                        >
                          {nestedDropdowns?.document_slots.some(
                            (slot) => slot.slot_number === 0
                          ) && (
                            <li
                              className="d-flex align-items-center"
                              style={{
                                // padding: "0px 10px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const unsortedSlot =
                                  nestedDropdowns.document_slots.find(
                                    (slot) => slot.slot_number === 0
                                  );
                                setUnsortedCase(false);
                                setUnsortedPage(false);
                                setNestedDropdowns([]);
                                setSelectedData({
                                  page_id: page?.id,
                                  slot: unsortedSlot?.id,
                                  panel: "-1",
                                });
                                setDropdownOpenManual(false);
                                setSelectedPanel(null);
                                setSelectedSlot(unsortedSlot);
                              }}
                            >
                              <div
                                className="d-flex align-items-center font-600  whitespace-nowrap"
                                style={{
                                  width: "100%",
                                }}
                              >
                                <span
                                  className="d-flex align-items-center justify-content-center  "
                                  // style={{ fontWeight: "bold" }}
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                  }}
                                >
                                  <img
                                    src={
                                      nestedDropdowns?.document_slots.find(
                                        (slot) => slot.slot_number === 0
                                      )?.page?.page_icon ?? ""
                                    }
                                    className="document-icons-width d-flex align-items-center cursor-pointer"
                                    alt=""
                                  />
                                </span>
                                Attach to{" "}
                                {
                                  nestedDropdowns?.document_slots.find(
                                    (slot) => slot.slot_number === 0
                                  )?.page?.name
                                }{" "}
                                Page generally
                              </div>
                            </li>
                          )}

                          {nestedDropdowns.data.map((panel, panelIndex) => {
                            return (
                              <li
                                key={panel?.id}
                                className="d-flex align-items-center"
                                style={{
                                  // padding: "0px 10px",
                                  height: "25px",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={() => setPanelMenuBar(panelIndex)}
                                onMouseLeave={() => setPanelMenuBar(null)}
                              >
                                <span
                                  className=" d-flex align-items-center justify-content-center"
                                  style={{
                                    fontWeight: "bold",
                                    width: "25px",
                                    height: "25px",
                                  }}
                                >
                                  {panelIndex + 1}
                                </span>
                                <span
                                  className="d-flex align-items-center p-r-5 whitespace-nowrap"
                                  style={{
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    color: "black",
                                    width: "calc(100% - 25px)",
                                  }}
                                >
                                  {panel?.panel_name ? panel.panel_name : ""}
                                </span>
                                <div
                                  className="even-odd-color-changes"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: "100%",
                                    backgroundColor: "#f0f0f0",
                                    border: "0px solid #ccc",
                                    // minWidth: "280px",
                                    transform: `translateY(${panelIndex * 15}px)`,
                                    // transform: `translateY(${panelIndex * 13}px)`,
                                    zIndex: 1000,
                                    display:
                                      panelMenuBar === panelIndex
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {nestedDropdowns.document_slots
                                    .filter((slot) => slot.slot_number !== 0)
                                    .map((slot) => (
                                      <li
                                        key={slot?.id}
                                        className="d-flex align-items-center whitespace-nowrap"
                                        style={{
                                          padding: "0px 10px",
                                          height: "25px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          setUnsortedCase(false);
                                          setUnsortedPage(false);
                                          setNestedDropdowns([]);
                                          setSelectedData({
                                            page_id: page?.id,
                                            slot: slot?.id,
                                            panel: panel?.id,
                                          });
                                          setDropdownOpenManual(false);
                                          setSelectedPanel(panel);
                                          setSelectedSlot(slot);
                                        }}
                                      >
                                        <span
                                          className="d-flex align-items-center justify-content-center"
                                          style={{
                                            // backgroundRepeat: "no-repeat",
                                            width: "19px",
                                            // height: "19px",
                                          }}
                                        >
                                          <img
                                            src={UploadIcon}
                                            className="document-icons-width cursor-pointer"
                                            style={{
                                              backgroundRepeat: "no-repeat",
                                              width: "19px",
                                              height: "19px",
                                            }}
                                            alt="Upload"
                                          />
                                        </span>
                                        <div
                                          className={`d-flex align-items-center color-grey-2 hoverable-text`}
                                          style={{
                                            fontWeight: "bold",
                                          }}
                                        >
                                          <>
                                            <span className="ml-2 hoverable-text">
                                              {slot.slot_number}.
                                            </span>
                                            <span className="ml-2 hoverable-text">
                                              {slot.slot_name
                                                ? slot.slot_name
                                                : "Available"}
                                            </span>
                                          </>
                                        </div>
                                      </li>
                                    ))}
                                </div>
                              </li>
                            );
                          })}
                        </div>
                      )}

                    {selectedPage &&
                      selectedPage.id === page.id &&
                      !page?.panels &&
                      nestedDropdowns?.document_slots?.length > 0 && (
                        <div
                          className="even-odd-color-changes"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: "100%",
                            backgroundColor: "#f0f0f0",
                            border: "0px solid #ccc",
                            minWidth: "280px",
                            // transform: `translatey(${index * 15}px)`,
                            zIndex: 1000,
                          }}
                        >
                          {/* Slot 0 - only render once */}
                          {nestedDropdowns.document_slots.some(
                            (slot) => slot.slot_number === 0
                          ) && (
                            <li
                              className="d-flex align-items-center whitespace-nowrap"
                              style={{
                                padding: "0px 10px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const unsortedSlot =
                                  nestedDropdowns.document_slots.find(
                                    (slot) => slot.slot_number === 0
                                  );

                                setUnsortedCase(false);
                                setUnsortedPage(false);
                                setNestedDropdowns([]);
                                setSelectedData({
                                  page_id: page?.id,
                                  slot: unsortedSlot?.id,
                                  panel: null,
                                });
                                setDropdownOpenManual(false);
                                setSelectedPanel(null);
                                setSelectedSlot(unsortedSlot);
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{
                                  width: "100%",
                                }}
                              >
                                <span
                                  className="d-flex align-items-center "
                                  style={{ fontWeight: "bold" }}
                                >
                                  <img
                                    src={
                                      nestedDropdowns.document_slots.find(
                                        (slot) => slot.slot_number === 0
                                      )?.page?.page_icon ?? ""
                                    }
                                    className="document-icons-width d-flex align-items-center cursor-pointer m-r-5"
                                    alt=""
                                  />
                                  Attach to{" "}
                                  {
                                    nestedDropdowns.document_slots.find(
                                      (slot) => slot.slot_number === 0
                                    )?.page?.name
                                  }{" "}
                                  Page generally
                                </span>
                              </div>
                            </li>
                          )}

                          {/* Other slots */}
                          {nestedDropdowns.document_slots
                            .filter((slot) => slot.slot_number !== 0)
                            .map((slot) => (
                              <li
                                key={slot?.id}
                                className="d-flex align-items-center whitespace-nowrap"
                                style={{
                                  padding: "0px 10px",
                                  height: "25px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setUnsortedCase(false);
                                  setUnsortedPage(false);
                                  setNestedDropdowns([]);
                                  setSelectedData({
                                    page_id: page?.id,
                                    slot: slot?.id,
                                    panel: null,
                                  });
                                  setDropdownOpenManual(false);
                                  setSelectedPanel(null);
                                  setSelectedSlot(slot);
                                }}
                              >
                                <span
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    // backgroundRepeat: "no-repeat",
                                    width: "19px",
                                    // height: "19px",
                                  }}
                                >
                                  <img
                                    src={UploadIcon}
                                    className="document-icons-width cursor-pointer"
                                    style={{
                                      backgroundRepeat: "no-repeat",
                                    }}
                                    alt="Upload"
                                  />
                                </span>
                                <div
                                  className={`d-flex align-items-center color-grey-2 hoverable-text`}
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  <>
                                    <span className="ml-2 hoverable-text">
                                      {slot.slot_number}.
                                    </span>
                                    <span className="ml-2 hoverable-text">
                                      {slot.slot_name
                                        ? slot.slot_name
                                        : "Available"}
                                    </span>
                                  </>
                                </div>
                              </li>
                            ))}
                        </div>
                      )}
                  </div>
                );
              }
            })}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default NestedDropdown;
