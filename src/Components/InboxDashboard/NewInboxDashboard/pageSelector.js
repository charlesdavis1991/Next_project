import React, { useEffect, useState, useRef } from "react";
import { chunk } from "lodash";
import PageSlot from "./PageSlot";
import { useWindowWidth } from "./provider/WindowWidthProvider";
import mixColorWithWhite from "../../TreatmentPage/utils/helperFn";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";
import "./pageSelector.css";

import ReactDOM from "react-dom";

// const DropdownPortal = ({ children }) => {
//   console.log("Hello");
//   if (typeof window === "undefined") return null;
//   return ReactDOM.createPortal(children, document.body);
// };

function toSentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const DropdownPortal = ({ children, isOpen }) => {
  if (typeof window === "undefined") return null;

  // Create portal for dropdown content
  const portalContent = ReactDOM.createPortal(children, document.body);

  // Create overlay portal when dropdown is open
  const overlayPortal = isOpen
    ? ReactDOM.createPortal(
        <div
          className="dropdown-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
            zIndex: 99999, // Just below the dropdown's z-index
            pointerEvents: "none", // Allow clicks to pass through
          }}
        />,
        document.body
      )
    : null;

  return (
    <>
      {overlayPortal}
      {portalContent}
    </>
  );
};

const PageSelector = ({
  pages,
  setSelectedPage,
  setNestedDropdowns,
  setSelectedPanel,
  setSelectedSlot,
  setUnsortedCase,
  setUnsortedPage,
  setSelectedData,
  index,
  inboxTab,
}) => {
  const useResponsiveChunk = (pages) => {
    const [chunkedPages, setChunkedPages] = useState([]);
    const width = useWindowWidth();

    const getChunkSize = (width) => {
      // if (width >= 3000) return 3;
      // if (width >= 2750) return 4;
      // if (width >= 2580) return 5;
      return 6;
    };

    useEffect(() => {
      const chunkSize = getChunkSize(width);
      setChunkedPages(chunk(pages, chunkSize));
    }, [pages, width]);

    return chunkedPages;
  };

  const chunkedPages = useResponsiveChunk(pages);
  console.log("chunkedPages", chunkedPages);
  const [showMenuBar, setShowMenuBar] = useState({ row: null, item: null });
  const [documentPanelsData, setDocumentPanelsData] = useState([]);
  const [panelMenuBar, setPanelMenuBar] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const menuRef = useRef(null);

  const triggerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [menuWidth, setMenuWidth] = useState(0);
  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.offsetWidth);
    }
  }, [showMenuBar]);
  useEffect(() => {
    if (
      triggerRef.current &&
      showMenuBar.row !== null &&
      showMenuBar.item !== null
    ) {
      const rect = triggerRef.current.getBoundingClientRect();
      const top = rect.top;
      const left = rect.left - menuWidth; // place to the left of trigger
      setDropdownPosition({ top, left });
    }
  }, [showMenuBar, menuWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAnyDropdownOpen =
    showMenuBar.row !== null && showMenuBar.item !== null;

  return (
    <div
      className="d-flex flex-row"
      style={{
        position: "relative",
        left: inboxTab !== "insurance" ? "20%" : "0%",
        justifyContent: inboxTab !== "insurance" ? "center" : "flex-start",
      }}
    >
      {chunkedPages.map((group, rowIndex) => (
        <div className="d-flex flex-column" key={rowIndex}>
          {group.map((slotData, itemIndex) => {
            const { page, page_slots, panels } = slotData;

            if (
              page_slots.length > 0 &&
              page.name === "Treatment" &&
              page?.panels
            ) {
              return (
                <li
                  key={itemIndex}
                  className="document-side-bar-hovered-item"
                  onMouseEnter={() =>
                    setShowMenuBar({ row: rowIndex, item: itemIndex })
                  }
                  ref={
                    showMenuBar.row === rowIndex &&
                    showMenuBar.item === itemIndex
                      ? triggerRef
                      : null
                  }
                  style={{
                    listStyle: "none",
                    whiteSpace: "nowrap",
                    width: "110px",
                    position: "relative",
                  }}
                  onMouseLeave={() => setShowMenuBar({ row: null, item: null })}
                >
                  <a
                    className="cursor-pointer d-flex align-items-center"
                    style={{
                      gap: "5px",
                      height: width > 2120 ? "21px" : "21px",
                      fontWeight: "bold",
                      // paddingLeft: "5px",
                    }}
                  >
                    <img
                      src={page.page_icon ?? ""}
                      className="doc-pop-width-15px-height-15px"
                      alt=""
                    />
                    {page.name}
                  </a>
                  {showMenuBar.row === rowIndex &&
                    showMenuBar.item === itemIndex && (
                      <DropdownPortal isOpen={true}>
                        <ul
                          ref={menuRef}
                          className="document-pop-up-sidebar-menubar"
                          style={{
                            position: "absolute",

                            left: dropdownPosition.left,
                            top: dropdownPosition.top,
                            minWidth: "auto",
                            // right: "120px",
                            transform: "translate(0, 0)",
                            display:
                              showMenuBar.row === rowIndex &&
                              showMenuBar.item === itemIndex
                                ? "block"
                                : "none",
                            width: "max-content",
                            zIndex: "100000000000009999999999",
                          }}
                        >
                          <li
                            key={itemIndex}
                            className="d-flex align-items-center justify-content-between background-white-hover-primary-four"
                            style={{
                              background: "white",
                              color: "var(--primary)",
                              fontWeight: "600",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const unsortedSlot = page_slots.find(
                                (slot) => slot.slot_number === 0
                              );
                              console.log(unsortedSlot);
                              setUnsortedCase(false);
                              setUnsortedPage(false);
                              setNestedDropdowns([]);
                              setSelectedPage(page);
                              setSelectedData({
                                page_id: unsortedSlot?.page?.id,
                                slot: unsortedSlot?.id,
                                panel: "-1",
                              });
                              setSelectedPanel(null);
                              setSelectedSlot(unsortedSlot);
                            }}
                          >
                            <span
                              className="d-flex align-items-center whitespace-nowrap "
                              style={{
                                fontWeight: "bold",
                                paddingLeft: "25px",
                              }}
                            >
                              <span
                                className="m-r-5 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "25px",
                                  height: "25px",
                                }}
                              >
                                <img
                                  src={page.page_icon ?? ""}
                                  className="document-icons-width d-flex align-items-center justify-content-center cursor-pointer"
                                  alt=""
                                />
                              </span>
                              {page.name} Page
                            </span>
                            <span
                              style={{
                                display: "inline-block",
                                width: "17px",
                                height: "17px",
                                color: "#19395F",
                                transform: "rotate(180deg)",
                                backgroundImage:
                                  showMenuBar.row === rowIndex &&
                                  showMenuBar.item === itemIndex
                                    ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                    : ``,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                // marginRight: "-10px",
                              }}
                            ></span>
                          </li>
                          {page_slots.find(
                            (slot) => slot.slot_number === 0
                          ) && (
                            <li
                              className="d-flex align-items-center background-white-hover-primary-four"
                              style={{
                                // padding: "0px 10px",
                                height: "25px",
                                padding: "0 10px",
                                // background: "white",
                                cursor: "pointer",
                                color: "var(--primary)",

                                fontWeight: "600",
                                fontSize: "14px",
                                textTransform: "capitalize",
                              }}
                              onClick={() => {
                                const unsortedSlot = page_slots.find(
                                  (slot) => slot.slot_number === 0
                                );
                                console.log(unsortedSlot);
                                setUnsortedCase(false);
                                setUnsortedPage(false);
                                setNestedDropdowns([]);
                                setSelectedPage(page);
                                setSelectedData({
                                  page_id: unsortedSlot?.page?.id,
                                  slot: unsortedSlot?.id,
                                  panel: "-1",
                                });
                                setSelectedPanel(null);
                                setSelectedSlot(unsortedSlot);
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "100%" }}
                              >
                                <span
                                  className="d-flex align-items-center whitespace-nowrap "
                                  style={{ fontWeight: "bold" }}
                                >
                                  {/* <span
                                        className="m-r-5 d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                        }}
                                      >
                                        <img
                                          src={page.page_icon ?? ""}
                                          className="document-icons-width d-flex align-items-center justify-content-center cursor-pointer"
                                          alt=""
                                        />
                                      </span> */}
                                  Attach to {page.name} Page generally
                                </span>
                              </div>
                            </li>
                          )}
                          <li
                            className="d-flex align-items-center"
                            style={{
                              // paddingLeft: "55px",
                              height: "25px",
                              padding: "0 10px",
                              background: "var(--primary-15)",
                            }}
                          >
                            <span
                              className="d-flex align-items-center justify-content-center whitespace-nowrap"
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "var(--primary)",
                                width: "100%",
                                textTransform: "uppercase",
                              }}
                            >
                              {page?.panel_name}
                            </span>
                          </li>
                          {panels?.length === 0 && (
                            <li
                              className="d-flex align-items-center"
                              style={{
                                // paddingLeft: "55px",
                                height: "50px",
                                padding: "0 10px",
                                background: "var(--primary-2)",
                              }}
                            >
                              <span
                                className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                style={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  color: "var(--primary-25)",
                                  width: "100%",
                                  // textTransform: "capitalize",
                                }}
                              >
                                {toSentenceCase(`No ${page?.panel_name}`)}
                              </span>
                            </li>
                          )}
                          {panels.map((panel, panelIndex) => (
                            <li
                              key={panelIndex}
                              className="d-flex align-items-center"
                              style={{
                                height: "25px",
                              }}
                              onMouseEnter={() => {
                                setDocumentPanelsData(panel);
                                setPanelMenuBar(panelIndex);
                              }}
                              onMouseLeave={() => {
                                setDocumentPanelsData([]);
                                setPanelMenuBar(null);
                              }}
                            >
                              <a
                                className="cursor-pointer d-flex align-items-center color-grey-2"
                                style={{ gap: "0px", width: "100%" }}
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
                                      10
                                    ),
                                  }}
                                >
                                  <span
                                    style={{
                                      background: panel?.specialty?.color,

                                      fontSize: "16px",
                                      fontWeight: "700",
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
                              </a>
                              <ul
                                className="document-pop-up-sidebar-menubar"
                                style={{
                                  position: "absolute",
                                  // left: "auto",
                                  // top:
                                  //   width < 1920
                                  //     ? `${panelIndex * 2 + 18}%`
                                  //     : `${10 + panelIndex * 2}%`,
                                  top: `${panelIndex * 4 + 20}%`,
                                  left: "auto",
                                  minWidth: "250px",
                                  transform:
                                    width > 1920
                                      ? `translate(10px, -${panelIndex + 15}%)`
                                      : `translate(10px, -${panelIndex + 30}%)`,
                                  right: "91.2%",
                                  display:
                                    panelMenuBar === panelIndex ? "block" : "",
                                  width: "max-content",
                                }}
                              >
                                <li
                                  className="d-flex align-items-center"
                                  style={{
                                    padding: "0px",
                                    height: "25px",
                                  }}
                                >
                                  <span
                                    className="d-flex align-items-center whitespace-nowrap p-r-5"
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      color: "black",
                                      width: "100%",
                                      background: documentPanelsData?.specialty
                                        ? mixColorWithWhite(
                                            documentPanelsData?.specialty
                                              ?.color,
                                            10
                                          )
                                        : "",
                                    }}
                                  >
                                    <span
                                      style={{
                                        background:
                                          documentPanelsData?.specialty?.color,
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        height: "25px",
                                        width: "25px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "white",
                                        marginRight: "5px",
                                      }}
                                    >
                                      {documentPanelsData?.specialty?.name[0] ??
                                        ""}
                                    </span>
                                    {documentPanelsData?.panel_name
                                      ? documentPanelsData.panel_name
                                      : ""}
                                  </span>
                                </li>
                                <li
                                  className="d-flex align-items-center"
                                  style={{
                                    // paddingLeft: "55px",
                                    height: "25px",
                                    padding: " 0 10px",
                                    background: "var(--primary-15)",
                                  }}
                                >
                                  <span
                                    className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      color: "var(--primary)",
                                      width: "100%",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Document Row Buttons
                                  </span>
                                </li>
                                {page_slots.map((slot, slotIndex) => {
                                  return (
                                    slot.slot_number !== 0 && (
                                      <li
                                        key={slotIndex}
                                        className="d-flex align-items-center"
                                        style={{
                                          padding: "0px 10px",
                                          height: "25px",
                                          cursor: "pointer",
                                          background:
                                            slotIndex % 2 === 0
                                              ? mixColorWithWhite(
                                                  documentPanelsData?.specialty
                                                    ?.color,
                                                  2
                                                )
                                              : mixColorWithWhite(
                                                  documentPanelsData?.specialty
                                                    ?.color,
                                                  4
                                                ),
                                        }}
                                        onClick={() => {
                                          console.log(panel);
                                          setUnsortedCase(false);
                                          setUnsortedPage(false);
                                          setNestedDropdowns([]);
                                          setSelectedPage(page);
                                          setSelectedData({
                                            page_id: slot?.page?.id,
                                            slot: slot?.id,
                                            panel: panel?.id,
                                          });
                                          setSelectedPanel(panel);
                                          setSelectedSlot(slot);
                                        }}
                                      >
                                        {slot.slot_number !== 0 && (
                                          <span className="d-flex align-items-center justify-content-center">
                                            <img
                                              src={UploadIcon}
                                              className="document-icons-width cursor-pointer"
                                              style={{
                                                backgroundRepeat: "no-repeat",
                                              }}
                                            />
                                          </span>
                                        )}
                                        {slot.slot_number !== 0 && (
                                          <div
                                            className={`d-flex align-items-center whitespace-nowrap color-grey-2 hoverable-text`}
                                            style={{
                                              width: "calc(100% - 25px)",
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
                                        )}
                                      </li>
                                    )
                                  );
                                })}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </DropdownPortal>
                    )}
                </li>
              );
            }

            if (page_slots.length > 0 && page.panels) {
              return (
                <li
                  key={itemIndex}
                  className="document-side-bar-hovered-item"
                  onMouseEnter={() =>
                    setShowMenuBar({ row: rowIndex, item: itemIndex })
                  }
                  ref={
                    showMenuBar.row === rowIndex &&
                    showMenuBar.item === itemIndex
                      ? triggerRef
                      : null
                  }
                  style={{
                    listStyle: "none",
                    whiteSpace: "nowrap",
                    width: "110px",
                    position: "relative",
                  }}
                  onMouseLeave={() => setShowMenuBar({ row: null, item: null })}
                >
                  <a
                    className="cursor-pointer d-flex align-items-center"
                    style={{
                      gap: "5px",
                      height: "21px",
                      fontWeight: "bold",
                    }}
                  >
                    <img
                      src={page.page_icon ?? ""}
                      className="doc-pop-width-15px-height-15px"
                      alt=""
                    />
                    {page.name}
                    {/* <span className="caret"></span> */}
                  </a>
                  {showMenuBar.row === rowIndex &&
                    showMenuBar.item === itemIndex && (
                      <DropdownPortal isOpen={true}>
                        <ul
                          ref={menuRef}
                          className="document-pop-up-sidebar-menubar"
                          style={{
                            position: "absolute",

                            left: dropdownPosition.left,
                            top: dropdownPosition.top,
                            minWidth: "auto",
                            transform: "translate(0, 0)",
                            display:
                              showMenuBar.row === rowIndex &&
                              showMenuBar.item === itemIndex
                                ? "block"
                                : "none",
                            width: "max-content",
                            zIndex: "100000000000009999999999",
                          }}
                        >
                          <li
                            key={itemIndex}
                            className="d-flex align-items-center justify-content-between background-white-hover-primary-four "
                            style={{
                              // background: "white",
                              color: "var(--primary)",
                              fontWeight: "600",
                              fontSize: "14px",
                              padding: "0 10px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const unsortedSlot = page_slots.find(
                                (slot) => slot.slot_number === 0
                              );
                              console.log(unsortedSlot);
                              setUnsortedCase(false);
                              setUnsortedPage(false);
                              setNestedDropdowns([]);
                              setSelectedPage(page);
                              setSelectedData({
                                page_id: unsortedSlot?.page?.id,
                                slot: unsortedSlot?.id,
                                panel: "-1",
                              });
                              setSelectedPanel(null);
                              setSelectedSlot(unsortedSlot);
                            }}
                          >
                            <span
                              className="cursor-pointer d-flex align-items-center"
                              style={{
                                gap: "5px",
                                fontWeight: "bold",
                                // paddingLeft: "10px",
                                height: "25px",
                              }}
                            >
                              <img
                                src={page.page_icon ?? ""}
                                className="doc-pop-width-15px-height-15px"
                                alt=""
                              />
                              {page.name} Page
                            </span>
                            <span
                              style={{
                                display: "inline-block",
                                width: "17px",
                                height: "17px",
                                color: "#19395F",
                                transform: "rotate(180deg)",
                                backgroundImage:
                                  showMenuBar.row === rowIndex &&
                                  showMenuBar.item === itemIndex
                                    ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                    : ``,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                marginRight: "-10px",
                              }}
                            ></span>
                          </li>
                          {page_slots.find(
                            (slot) => slot.slot_number === 0
                          ) && (
                            <li
                              className="d-flex align-items-center background-white-hover-primary-four"
                              style={{
                                padding: "0px 10px",
                                height: "25px",
                                cursor: "pointer",
                                // background: "white",

                                color: "var(--primary)",

                                fontWeight: "600",
                                fontSize: "14px",
                                textTransform: "capitalize",
                              }}
                              onClick={() => {
                                const unsortedSlot = page_slots.find(
                                  (slot) => slot.slot_number === 0
                                );
                                console.log(unsortedSlot);
                                setUnsortedCase(false);
                                setUnsortedPage(false);
                                setNestedDropdowns([]);
                                setSelectedPage(page);
                                setSelectedData({
                                  page_id: unsortedSlot?.page?.id,
                                  slot: unsortedSlot?.id,
                                  panel: "-1",
                                });
                                setSelectedPanel(null);
                                setSelectedSlot(unsortedSlot);
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "100%" }}
                              >
                                <span
                                  className="d-flex align-items-center whitespace-nowrap "
                                  style={{ fontWeight: "bold" }}
                                >
                                  {/* <img
                                        src={page.page_icon ?? ""}
                                        className="document-icons-width cursor-pointer m-r-5"
                                        alt=""
                                      /> */}
                                  Attach to {page.name} Page generally
                                </span>
                              </div>
                            </li>
                          )}
                          <li
                            className="d-flex align-items-center"
                            style={{
                              // paddingLeft: "55px",
                              height: "25px",
                              padding: "0 10px",
                              background: "var(--primary-15)",
                            }}
                          >
                            <span
                              className="d-flex align-items-center justify-content-center whitespace-nowrap"
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "var(--primary)",
                                width: "100%",
                                textTransform: "uppercase",
                              }}
                            >
                              {page?.panel_name}
                            </span>
                          </li>
                          {panels?.length === 0 && (
                            <li
                              className="d-flex align-items-center"
                              style={{
                                // paddingLeft: "55px",
                                height: "50px",
                                padding: "0 10px",
                                background: "var(--primary-2)",
                              }}
                            >
                              <span
                                className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                style={{
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  color: "var(--primary-25)",
                                  width: "100%",
                                  // textTransform: "capitalize",
                                }}
                              >
                                {toSentenceCase(`No ${page?.panel_name}`)}
                              </span>
                            </li>
                          )}
                          {panels.map((panel, panelIndex) => (
                            <li
                              key={panelIndex}
                              className="d-flex align-items-center"
                              style={{
                                // padding: "0px 10px",
                                height: "25px",
                              }}
                              onMouseEnter={() => {
                                setDocumentPanelsData(panel);
                                setPanelMenuBar(panelIndex);
                              }}
                              onMouseLeave={() => {
                                setDocumentPanelsData([]);
                                setPanelMenuBar(null);
                              }}
                            >
                              <a
                                className="cursor-pointer d-flex align-items-center color-grey-2"
                                // style={{ gap: "5px" }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "17px",
                                    height: "17px",
                                    color: "#19395F",
                                    transform: "rotate(180deg)",
                                    backgroundImage:
                                      panelMenuBar === panelIndex
                                        ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                        : "",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                  }}
                                ></span>
                                <span
                                  className="ml-2"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {panelIndex + 1}.
                                </span>
                                <span
                                  className="ml-2 whitespace-nowrap"
                                  style={{
                                    fontWeight: "bold",
                                    color: "var(--primary)",
                                  }}
                                >
                                  {page?.name === "Offer"
                                    ? panel?.panel_name
                                    : ""}
                                  {page?.name !== "Offer"
                                    ? panel?.specialty
                                      ? panel?.specialty.name
                                      : panel?.panel_name
                                        ? panel?.panel_name
                                        : ""
                                    : ""}
                                </span>
                              </a>
                              <ul
                                className="document-pop-up-sidebar-menubar"
                                style={{
                                  position: "absolute",
                                  // left: "auto",
                                  // top:
                                  //   width < 1920
                                  //     ? `${panelIndex * 2 + 18}%`
                                  //     : `${10 + panelIndex * 2}%`,
                                  top: `${panelIndex * 4 + 20}%`,
                                  left: "auto",
                                  // top: "auto",
                                  minWidth: "auto",
                                  // transform:
                                  //   width > 1920
                                  //     ? `translate(10px, -${panelIndex + 15}%)`
                                  //     : `translate(10px, -${panelIndex + 30}%)`,
                                  // right: "17.2%",
                                  right: "87.2%",
                                  display:
                                    panelMenuBar === panelIndex ? "block" : "",
                                  width: "max-content",
                                }}
                              >
                                <li
                                  className="d-flex align-items-center"
                                  style={{
                                    padding: "0px",
                                    height: "25px",
                                  }}
                                >
                                  <span
                                    className="d-flex align-items-center whitespace-nowrap p-r-5"
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      color: "black",
                                      width: "100%",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        height: "25px",
                                        width: "25px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "black",
                                        marginRight: "5px",
                                      }}
                                    >
                                      1.
                                    </span>
                                    {documentPanelsData?.panel_name
                                      ? documentPanelsData.panel_name
                                      : ""}
                                  </span>
                                </li>
                                <li
                                  className="d-flex align-items-center"
                                  style={{
                                    // paddingLeft: "55px",
                                    height: "25px",
                                    padding: "0 10px",
                                    background: "var(--primary-15)",
                                  }}
                                >
                                  <span
                                    className="d-flex align-items-center justify-content-center whitespace-nowrap"
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "14px",
                                      color: "var(--primary)",
                                      width: "100%",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Document Row Buttons
                                  </span>
                                </li>
                                {page_slots.map((slot, slotIndex) => {
                                  return (
                                    slot.slot_number !== 0 && (
                                      <li
                                        key={slotIndex}
                                        className="d-flex align-items-center"
                                        style={{
                                          padding: "0px 10px",
                                          height: "25px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          console.log(panel);
                                          // console.log(unsortedSlot);
                                          console.log(slot);
                                          setUnsortedCase(false);
                                          setUnsortedPage(false);
                                          setNestedDropdowns([]);
                                          setSelectedPage(page);
                                          setSelectedData({
                                            page_id: slot?.page?.id,
                                            slot: slot?.id,
                                            panel: panel?.id,
                                          });
                                          setSelectedPanel(panel);
                                          setSelectedSlot(slot);
                                        }}
                                      >
                                        {slot.slot_number !== 0 && (
                                          <span className="d-flex align-items-center justify-content-center">
                                            <img
                                              src={UploadIcon}
                                              className="document-icons-width cursor-pointer"
                                              style={{
                                                backgroundRepeat: "no-repeat",
                                              }}
                                            />
                                          </span>
                                        )}

                                        {slot.slot_number !== 0 && (
                                          <div
                                            className={`d-flex align-items-center  color-grey-2 hoverable-text`}
                                            style={{
                                              width: "calc(100% - 25px)",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <>
                                              <span className="ml-2 hoverable-text">
                                                {slot.slot_number}.
                                              </span>
                                              <span className="ml-2 hoverable-text whitespace-nowrap">
                                                {slot.slot_name
                                                  ? slot.slot_name
                                                  : "Available"}
                                              </span>
                                            </>
                                          </div>
                                        )}
                                      </li>
                                    )
                                  );
                                })}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </DropdownPortal>
                    )}
                </li>
              );
            }

            if (page_slots.length > 0 && !page.panels) {
              return (
                <li
                  key={itemIndex}
                  className="document-side-bar-hovered-item"
                  onMouseEnter={() =>
                    setShowMenuBar({ row: rowIndex, item: itemIndex })
                  }
                  ref={
                    showMenuBar.row === rowIndex &&
                    showMenuBar.item === itemIndex
                      ? triggerRef
                      : null
                  }
                  style={{
                    listStyle: "none",
                    whiteSpace: "nowrap",
                    width: "110px",
                    position: "relative",
                  }}
                  onMouseLeave={() => setShowMenuBar({ row: null, item: null })}
                >
                  <a
                    className="cursor-pointer d-flex align-items-center"
                    style={{
                      gap: "5px",
                      height: "21px",
                      fontWeight: "bold",
                    }}
                  >
                    <img
                      src={page?.page_icon ?? ""}
                      className="doc-pop-width-15px-height-15px"
                      alt=""
                    />
                    {page?.name}
                  </a>
                  {showMenuBar.row === rowIndex &&
                    showMenuBar.item === itemIndex && (
                      <DropdownPortal isOpen={true}>
                        <ul
                          ref={menuRef}
                          className="document-pop-up-sidebar-menubar"
                          style={{
                            position: "absolute",

                            left: dropdownPosition.left,
                            top: dropdownPosition.top,
                            minWidth: "auto",
                            right: "120px",
                            transform: "translate(0, 0)",
                            display:
                              showMenuBar.row === rowIndex &&
                              showMenuBar.item === itemIndex
                                ? "block"
                                : "none",
                            width: "max-content",
                            paddingRight: "5px",
                            zIndex: "100000000000009999999999",
                          }}
                        >
                          <li
                            key={itemIndex}
                            className="d-flex align-items-center justify-content-between background-white-hover-primary-four"
                            style={{
                              // background: "white",
                              color: "var(--primary)",
                              fontWeight: "600",
                              fontSize: "14px",
                              padding: "0 10px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const slot = page_slots.find(
                                (slot) => slot?.slot_number === 0
                              );
                              setUnsortedCase(false);
                              setUnsortedPage(false);
                              setNestedDropdowns([]);
                              setSelectedPage(page);
                              setSelectedData({
                                page_id: slot?.page?.id,
                                slot: slot?.id,
                                panel: "-1",
                              });
                              setSelectedPanel(null);
                              setSelectedSlot(slot);
                            }}
                          >
                            <span
                              className="cursor-pointer d-flex align-items-center"
                              style={{
                                gap: "5px",
                                fontWeight: "bold",
                                // paddingLeft: "10px",
                                height: "25px",
                              }}
                            >
                              <img
                                src={page.page_icon ?? ""}
                                className="doc-pop-width-15px-height-15px"
                                alt=""
                              />
                              {page.name} Page
                            </span>
                            <span
                              style={{
                                display: "inline-block",
                                width: "17px",
                                height: "17px",
                                color: "#19395F",
                                transform: "rotate(180deg)",
                                backgroundImage:
                                  showMenuBar.row === rowIndex &&
                                  showMenuBar.item === itemIndex
                                    ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                    : ``,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                marginRight: "-10px",
                              }}
                            ></span>
                          </li>
                          {page_slots.find(
                            (slot) => slot.slot_number === 0
                          ) && (
                            <li
                              key={itemIndex}
                              className="d-flex align-items-center background-white-hover-primary-four"
                              style={{
                                padding: "0px 10px",
                                height: "25px",
                                cursor: "pointer",
                                // background: "white",

                                color: "var(--primary)",

                                fontWeight: "600",
                                fontSize: "14px",
                                textTransform: "capitalize",
                              }}
                              onClick={() => {
                                const slot = page_slots.find(
                                  (slot) => slot?.slot_number === 0
                                );
                                setUnsortedCase(false);
                                setUnsortedPage(false);
                                setNestedDropdowns([]);
                                setSelectedPage(page);
                                setSelectedData({
                                  page_id: slot?.page?.id,
                                  slot: slot?.id,
                                  panel: "-1",
                                });
                                setSelectedPanel(null);
                                setSelectedSlot(slot);
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "100%" }}
                              >
                                <span
                                  className="d-flex align-items-center whitespace-nowrap "
                                  style={{ fontWeight: "bold" }}
                                >
                                  {/* <img
                                        src={page.page_icon ?? ""}
                                        className="document-icons-width cursor-pointer m-r-5"
                                        alt=""
                                      /> */}
                                  Attach to {page.name} Page generally
                                </span>
                              </div>
                            </li>
                          )}

                          <li
                            className="d-flex align-items-center"
                            style={{
                              // paddingLeft: "55px",
                              height: "25px",
                              padding: "0 10px",
                              background: "var(--primary-15)",
                            }}
                          >
                            <span
                              className="d-flex align-items-center justify-content-center whitespace-nowrap"
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "var(--primary)",
                                width: "100%",
                                textTransform: "uppercase",
                              }}
                            >
                              Document Row Buttons
                            </span>
                          </li>
                          {page_slots
                            .filter((slot) => slot.slot_number !== 0)
                            .map((slot, slotIndex) => {
                              return (
                                <li
                                  key={slotIndex}
                                  className="d-flex align-items-center"
                                  style={{
                                    padding: "0px 10px",
                                    height: "25px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    console.log(slot);
                                    setUnsortedCase(false);
                                    setUnsortedPage(false);
                                    setNestedDropdowns([]);
                                    setSelectedPage(page);
                                    setSelectedData({
                                      page_id: slot?.page?.id,
                                      slot: slot?.id,
                                      panel: "-1",
                                    });
                                    setSelectedPanel(null);
                                    setSelectedSlot(slot);
                                  }}
                                >
                                  {slot.slot_number !== 0 && (
                                    <span className="d-flex align-items-center justify-content-center">
                                      <img
                                        src={UploadIcon}
                                        className="document-icons-width cursor-pointer"
                                        style={{
                                          backgroundRepeat: "no-repeat",
                                        }}
                                      />
                                    </span>
                                  )}

                                  {/* {slot.slot_number === 0 && (
                                  <div
                                    className="d-flex align-items-center justify-content-between"
                                    style={{
                                      width: "100%",
                                    }}
                                  >
                                    <span
                                      className="d-flex align-items-center whitespace-nowrap "
                                      style={{ fontWeight: "bold" }}
                                    >
                                      <img
                                        src={page?.page_icon ?? ""}
                                        className="document-icons-width d-flex align-items-center  cursor-pointer m-r-5"
                                        alt=""
                                      />
                                      Attach to {page?.name} Page generally
                                    </span>
                                  </div>
                                )} */}

                                  {slot.slot_number !== 0 && (
                                    <div
                                      className={`d-flex align-items-center  color-grey-2 hoverable-text `}
                                      style={{
                                        width: "calc(100% - 25px)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <>
                                        <span className="ml-2 hoverable-text">
                                          {slot.slot_number}.
                                        </span>
                                        <span className="ml-2 hoverable-text whitespace-nowrap">
                                          {slot.slot_name
                                            ? slot.slot_name
                                            : "Available"}
                                        </span>
                                      </>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                        </ul>
                      </DropdownPortal>
                    )}
                </li>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default PageSelector;
