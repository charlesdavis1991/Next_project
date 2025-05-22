import React, { useEffect, useState } from "react";
import { chunk } from "lodash";
import PageSlot from "./PageSlot";
import { useWindowWidth } from "./provider/WindowWidthProvider";
import mixColorWithWhite from "../../TreatmentPage/utils/helperFn";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";

// 1. First, import ReactDOM at the top of your file
import ReactDOM from "react-dom";

// 2. Create a Portal component for your dropdown
const DropdownPortal = ({ children, isOpen, triggerRect }) => {
  if (!isOpen || !triggerRect) return null;

  console.log(triggerRect);

  // This renders the dropdown directly to the document body,
  // completely outside your component hierarchy
  return ReactDOM.createPortal(
    <div
      className="even-odd-color-changes"
      style={{
        position: "fixed",
        top: triggerRect.top, // Position at the top of the clicked element
        left: triggerRect.left, // Position to the left
        backgroundColor: "#f0f0f0",
        border: "0px solid #ccc",
        minWidth: "280px",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </div>,
    document.body // Render directly to the body element
  );
};

const PageSelector = ({
  pages,
  selectedPage,
  nestedDropdowns,
  handlePageSelect,
  setSelectedPage,
  setNestedDropdowns,
  setSelectedPanel,
  setSelectedSlot,
  setUnsortedCase,
  setUnsortedPage,
  setSelectedData,
  setPanelMenuBar,
  panelMenuBar,
  dropdownState,
  setDropdownState,
  index,
}) => {
  const useResponsiveChunk = (pages) => {
    console.log(pages);
    const [chunkedPages, setChunkedPages] = useState([]);
    const width = useWindowWidth();

    const getChunkSize = (width) => {
      if (width >= 3000) return 3;
      if (width >= 2750) return 4;
      if (width >= 2580) return 5;
      return 6;
    };

    useEffect(() => {
      const chunkSize = getChunkSize(width);
      setChunkedPages(chunk(pages, chunkSize));
    }, [pages, width]);

    return chunkedPages;
  };

  const chunkedPages = useResponsiveChunk(pages);
  console.log(chunkedPages);

  return (
    <div className="d-flex flex-row">
      {chunkedPages.map((group, rowIndex) => (
        <div className="d-flex flex-column" key={rowIndex}>
          {group.map((slotData, itemIndex) => (
            <div style={{ position: "relative" }} key={itemIndex}>
              <div
                style={{ width: "110px", cursor: "pointer" }}
                className="p-t-5 p-b-5 p-r-5 p-l-5 d-flex align-items-center font-600 height-21"
                onClick={(event) => handlePageSelect(slotData?.page, event)}
                // onMouseEnter={(event) => {
                //   handlePageSelect(page, event);
                // }}
                // onMouseLeave={() => {
                //   setNestedDropdowns([]);
                // }}
              >
                {slotData?.page?.page_icon && (
                  <img
                    src={slotData?.page?.page_icon}
                    alt="Page Icon"
                    className="m-r-5 ic-19 mt-0"
                  />
                )}
                {slotData?.page?.name}
              </div>
              <>
                <DropdownPortal
                  isOpen={
                    dropdownState.isOpen &&
                    selectedPage &&
                    nestedDropdowns?.document_slots?.length > 0
                  }
                  triggerRect={dropdownState.triggerRect}
                >
                  {selectedPage &&
                    selectedPage.id === slotData?.page.id &&
                    slotData?.page?.panels &&
                    slotData?.page?.name === "Treatment" &&
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
                                page_id: slotData?.page?.id,
                                slot: unsortedSlot?.id,
                                panel: "-1",
                              });
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
                                        console.log(panel);
                                        setSelectedData({
                                          page_id: slotData?.page?.id,
                                          slot: slot?.id,
                                          panel: panel?.panel_id,
                                        });
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
                    selectedPage.id === slotData?.page.id &&
                    slotData?.page?.panels &&
                    slotData?.page?.name !== "Treatment" &&
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
                                page_id: slotData?.page?.id,
                                slot: unsortedSlot?.id,
                                panel: "-1",
                              });
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
                                        console.log(panel);
                                        setSelectedData({
                                          page_id: slotData?.page?.id,
                                          slot: slot?.id,
                                          panel: panel?.panel_id,
                                        });
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
                  selectedPage.id === slotData?.page.id &&
                  !slotData?.page?.panels &&
                  nestedDropdowns?.document_slots?.length > 0 ? (
                    <div
                      className="even-odd-color-changes"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: "100%",
                        backgroundColor: "#f0f0f0",
                        border: "0px solid #ccc",
                        minWidth: "280px",
                        zIndex: 1000,
                      }}
                    >
                      {/* Unsorted slot option */}
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
                              page_id: slotData?.page?.id,
                              slot: unsortedSlot?.id,
                              panel: "-1",
                            });
                            setSelectedPanel(null);
                            setSelectedSlot(unsortedSlot);
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-between"
                            style={{ width: "100%" }}
                          >
                            <span
                              className="d-flex align-items-center"
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

                      {/* Regular slots */}
                      {nestedDropdowns.document_slots
                        .filter((slot) => slot.slot_number !== 0)
                        .map((slot) => (
                          <PageSlot
                            key={slot.id}
                            slot={slot}
                            onSelect={() => {
                              setUnsortedCase(false);
                              setUnsortedPage(false);
                              setNestedDropdowns([]);
                              setSelectedData({
                                page_id: slotData?.page?.id,
                                slot: slot?.id,
                                panel: null,
                              });
                              setSelectedPanel(null);
                              setSelectedSlot(slot);
                            }}
                          />
                        ))}
                    </div>
                  ) : null}
                </DropdownPortal>
              </>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PageSelector;
