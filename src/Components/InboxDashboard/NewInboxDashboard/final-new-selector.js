import React, { useEffect, useState } from "react";
import { chunk } from "lodash";
import PageSlot from "./PageSlot";
import { useWindowWidth } from "./provider/WindowWidthProvider";
import mixColorWithWhite from "../../TreatmentPage/utils/helperFn";
import UploadIcon from "/public/bp_assets/img/cloud_icon.svg";
import "./pageSelector.css";

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
  // setPanelMenuBar,
  // panelMenuBar,
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
  const [showMenuBar, setShowMenuBar] = useState({ row: null, item: null });
  const [documentPanelsData, setDocumentPanelsData] = useState([]);
  const [panelMenuBar, setPanelMenuBar] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex flex-row">
      {chunkedPages.map((group, rowIndex) => (
        <div className="d-flex flex-column" key={rowIndex}>
          {group.map((slotData, itemIndex) => {
            const { page, page_slots, panels } = slotData;
            console.log("Page", page?.name, rowIndex);

            if (
              panels.length > 0 &&
              page_slots.length > 0 &&
              page.name === "Treatment"
            ) {
              return (
                <li
                  key={itemIndex}
                  className="document-side-bar-hovered-item"
                  onMouseEnter={() =>
                    setShowMenuBar({ row: rowIndex, item: itemIndex })
                  }
                  style={{
                    listStyle: "none",
                    whiteSpace: "nowrap",
                    width: "120px",
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
                  <ul
                    className="document-pop-up-sidebar-menubar"
                    // style={{
                    //   position: "absolute",
                    //   // left: "auto",
                    //   top:
                    //     page.name === "Witnesses"
                    //       ? `${index * 2 + 3}%`
                    //       : "auto",
                    //   left: "auto",
                    //   minWidth: "auto",
                    //   transform:
                    //     width > 1920
                    //       ? `translate(10px, -${index + 15}%)`
                    //       : `translate(10px, -${index + 28}%)`,
                    //   right: width > 1920 ? "340px" : "340px",
                    //   display: showMenuBar === index ? "block" : "",
                    //   width: "max-content",
                    // }}
                    style={{
                      position: "absolute",

                      left: "auto",
                      top: "0",
                      minWidth: "auto",
                      right: "120px",
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
                    <li key={itemIndex} className="">
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
                    </li>
                    {page_slots.find((slot) => slot.slot_number === 0) && (
                      <li
                        className="d-flex align-items-center"
                        style={{
                          height: "25px",
                          paddingLeft: "25px",
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
                          className="d-flex align-items-center justify-content-between"
                          style={{ width: "100%" }}
                        >
                          <span
                            className="d-flex align-items-center whitespace-nowrap "
                            style={{ fontWeight: "bold" }}
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
                            Attach to {page.name} Page generally
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
                            }}
                          ></span>
                        </div>
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
                            top:
                              width < 1920
                                ? `${panelIndex * 2 + 18}%`
                                : `${10 + panelIndex * 2}%`,
                            left: "auto",
                            minWidth: "250px",
                            transform:
                              width > 1920
                                ? `translate(10px, -${panelIndex + 15}%)`
                                : `translate(10px, -${panelIndex + 30}%)`,
                            right: "91.2%",
                            display: panelMenuBar === panelIndex ? "block" : "",
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
                                      documentPanelsData?.specialty?.color,
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
                                {documentPanelsData?.specialty?.name[0] ?? ""}
                              </span>
                              {documentPanelsData?.panel_name
                                ? documentPanelsData.panel_name
                                : ""}
                            </span>
                          </li>
                          <li
                            className="d-flex align-items-center"
                            style={{
                              paddingLeft: "55px",
                              height: "25px",
                              paddingRight: "10px",
                            }}
                          >
                            <span
                              className="d-flex align-items-center whitespace-nowrap p-r-5"
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "var(--primary)",
                                width: "100%",
                                textTransform: "uppercase",
                              }}
                            >
                              Doc Row Access Buttons
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
                </li>
              );
            }

            if (panels.length > 0 && page_slots.length > 0) {
              return (
                <li
                  key={itemIndex}
                  className="document-side-bar-hovered-item"
                  onMouseEnter={() =>
                    setShowMenuBar({ row: rowIndex, item: itemIndex })
                  }
                  style={{
                    listStyle: "none",
                    whiteSpace: "nowrap",
                    width: "120px",
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
                  <ul
                    className="document-pop-up-sidebar-menubar"
                    style={{
                      position: "absolute",
                      left: "auto",
                      top: "0",
                      right: "120px",
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
                    <li key={itemIndex} className="">
                      <span
                        className="cursor-pointer d-flex align-items-center"
                        style={{
                          gap: "5px",
                          fontWeight: "bold",
                          paddingLeft: "10px",
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
                    </li>
                    {page_slots.find((slot) => slot.slot_number === 0) && (
                      <li
                        className="d-flex align-items-center"
                        style={{
                          padding: "0px 10px",
                          height: "25px",
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
                          className="d-flex align-items-center justify-content-between"
                          style={{ width: "100%" }}
                        >
                          <span
                            className="d-flex align-items-center whitespace-nowrap "
                            style={{ fontWeight: "bold" }}
                          >
                            <img
                              src={page.page_icon ?? ""}
                              className="document-icons-width cursor-pointer m-r-5"
                              alt=""
                            />
                            Attach to {page.name} Page generally
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
                        </div>
                      </li>
                    )}
                    {panels.map((panel, panelIndex) => (
                      <li
                        key={panelIndex}
                        className="d-flex align-items-center"
                        style={{
                          padding: "0px 10px",
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
                          style={{ gap: "5px" }}
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
                          <span className="ml-2" style={{ fontWeight: "bold" }}>
                            {panelIndex + 1}.
                          </span>
                          <span
                            className="ml-2 whitespace-nowrap"
                            style={{ fontWeight: "bold" }}
                          >
                            {page?.name === "Offer" ? panel?.panel_name : ""}
                            {page?.name !== "Offer"
                              ? panel?.specialty
                                ? panel?.specialty.name
                                : panel?.panel_name
                                  ? panel?.panel_name
                                  : "No Name"
                              : ""}
                          </span>
                        </a>
                        <ul
                          className="document-pop-up-sidebar-menubar"
                          style={{
                            position: "absolute",
                            // left: "auto",
                            top:
                              width < 1920
                                ? `${panelIndex * 2 + 18}%`
                                : `${10 + panelIndex * 2}%`,
                            left: "auto",
                            // top: "auto",
                            minWidth: "auto",
                            transform:
                              width > 1920
                                ? `translate(10px, -${panelIndex + 15}%)`
                                : `translate(10px, -${panelIndex + 30}%)`,
                            // right: "17.2%",
                            right: "91.2%",
                            display: panelMenuBar === panelIndex ? "block" : "",
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
                              paddingLeft: "55px",
                              height: "25px",
                              paddingRight: "10px",
                            }}
                          >
                            <span
                              className="d-flex align-items-center whitespace-nowrap p-r-5"
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "var(--primary)",
                                width: "100%",
                                textTransform: "uppercase",
                              }}
                            >
                              Doc Row Access Buttons
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
                </li>
              );
            }

            if (page_slots.length > 0 && panels.length === 0) {
              return (
                <li
                  key={itemIndex}
                  className="document-side-bar-hovered-item"
                  onMouseEnter={() =>
                    setShowMenuBar({ row: rowIndex, item: itemIndex })
                  }
                  style={{
                    listStyle: "none",
                    whiteSpace: "nowrap",
                    width: "120px",
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
                  <ul
                    className="document-pop-up-sidebar-menubar"
                    style={{
                      position: "absolute",

                      left: "auto",
                      top: "0",
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
                    <li key={itemIndex} className="">
                      <span
                        className="cursor-pointer d-flex align-items-center"
                        style={{
                          gap: "5px",
                          fontWeight: "bold",
                          paddingLeft: "10px",
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
                    </li>
                    {page_slots.map((slot, slotIndex) => {
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

                          {slot.slot_number === 0 && (
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
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "17px",
                                  height: "17px",
                                  color: "#19395F",
                                  transform: "rotate(180deg)",
                                  backgroundImage:
                                    showMenuBar === itemIndex
                                      ? `url("data:image/svg+xml,<svg width='17' height='17' viewBox='0 0 17 34' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M0.00634766 33.9993L0.00634766 24.7993L7.8602 16.9992L0.00634766 9.19912L0.00634766 -0.000884091L17.0063 16.9992L0.00634766 33.9993Z' fill='%2319395f'/></svg>%0A")`
                                      : ``,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "contain",
                                  marginRight: "-10px",
                                }}
                              ></span>
                            </div>
                          )}

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
