import React, { useEffect, useRef, useState } from "react";
import { mediaRoute } from "../../Utils/helper";

const Tabs = ({
  page = "document",
  data,
  onSelect,
  allCount,
  unsortedCount,
  activeTab,
}) => {
  const [hoveredTab, setHoveredTab] = React.useState(null);
  const handleMouseEnter = (tab) => {
    setHoveredTab(tab);
  };
  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  console.log(activeTab);
  console.log(hoveredTab);

  const [maxTabWidth, setMaxTabWidth] = useState(null);

  const tabRefs = useRef({});

  useEffect(() => {
    const widths = Object.values(tabRefs.current).map(
      (ref) => ref?.offsetWidth || 0
    );

    const maxWidth = Math.max(...widths);
    if (maxWidth > 115) {
      setMaxTabWidth(maxWidth);
    } else {
      setMaxTabWidth(115);
    }
  }, [data, allCount, unsortedCount]);

  const commonTabStyle = (key) => ({
    transition: "all 0.1s ease",
    margin: "0",
    border: "none",
    color: "white",
    boxSizing: "border-box",
    width: maxTabWidth ? `${maxTabWidth}px` : "auto",
    minWidth: maxTabWidth ? `${maxTabWidth}px` : "auto",
    flexGrow: "0",
    backgroundColor:
      activeTab === key
        ? "var(--primary)"
        : hoveredTab === key
          ? "var(--primary-70)"
          : "var(--primary-60)",
  });

  return Boolean(unsortedCount || allCount || data.length) ? (
    <div
      className="nav nav-tabs directory-tab-box h-25px"
      id="nav-tab"
      role="tablist"
      style={{
        backgroundColor: "var(--primary-15)",
        marginTop: page === "photo" ? "5px" : "0px",
      }}
    >
      {unsortedCount != 0 && (
        <a
          ref={(el) => (tabRefs.current["unsorted"] = el)}
          className="nav-item nav-link PT9-LFD left-skews-doc-page-tabs doc-page-background-color"
          id="-nav-tab"
          data-toggle="tab"
          href="#unsorted-nav-home"
          role="tab"
          aria-controls="unsorted-nav-home"
          aria-selected="false"
          onClick={() => onSelect("unsorted", "Unsorted")}
          // style={{
          //   transition: "all -0.1s ease",
          //   // padding: "7px 10px",
          //   margin: "0",
          //   border: "none",
          //   boxSizing: "border-box",
          //   // paddingLeft: "6px",
          //   color: "white",
          //   backgroundColor:
          //     activeTab === "unsorted"
          //       ? "var(--primary)"
          //       : hoveredTab === "unsorted"
          //         ? "var(--primary-70)"
          //         : "var(--primary-60)",
          // }}
          style={commonTabStyle("unsorted")}
          onMouseEnter={() => handleMouseEnter("unsorted")}
          onMouseLeave={handleMouseLeave}
          data-text="Unsorted"
        >
          {" "}
          <div className="d-flex align-items-center">
            <span>Unsorted</span>
            {/* <span className="badge badge-primary ml-1">{unsortedCount}</span> */}
            <span className="text-gold ml-1">{unsortedCount}</span>
          </div>
        </a>
      )}

      {allCount != 0 && (
        <a
          ref={(el) => (tabRefs.current["all"] = el)}
          className="nav-item nav-link active PT9-LFD me-3 left-skews-doc-page-tabs"
          id="all-nav-home-tab"
          data-toggle="tab"
          href="#all-nav-home"
          role="tab"
          aria-controls="all-nav-home"
          aria-selected="true"
          onClick={() => onSelect("all", "All")}
          // style={{
          //   transition: "all -0.1s ease",
          //   // padding: "7px 10px",
          //   margin: "0",
          //   border: "none",
          //   boxSizing: "border-box",
          //   color: "white",
          //   backgroundColor:
          //     activeTab === "all"
          //       ? "var(--primary)"
          //       : hoveredTab === "all"
          //         ? "var(--primary-70)"
          //         : "var(--primary-60)",
          // }}
          style={commonTabStyle("all")}
          onMouseEnter={() => handleMouseEnter("all")}
          onMouseLeave={handleMouseLeave}
          data-text="All"
        >
          {" "}
          <div className="d-flex align-items-center">
            <span>All</span>
            {/* <span className="badge badge-primary ml-1">{allCount}</span> */}
            <span className="text-gold ml-1">{allCount}</span>
          </div>
        </a>
      )}

      {data?.map((tab) => (
        <a
          ref={(el) => (tabRefs.current[tab.name] = el)}
          className={`nav-item nav-link PT9-LFD ${tab?.name?.toLowerCase()}-nav-tab left-skews-doc-page-tabs`} // Dynamic class based on tab name
          id={`${tab?.name?.toLowerCase()}-nav-tab`} // Dynamic id based on tab name
          data-toggle="tab"
          href={`#${tab?.name?.toLowerCase()}-nav-home`}
          role="tab"
          aria-controls={`${tab?.name?.toLowerCase()}-nav-home`}
          aria-selected="false"
          onClick={() => onSelect(tab?.id, tab?.name)}
          // style={{
          //   transition: "all -0.1s ease",
          //   // padding: "7px 10px",
          //   margin: "0",
          //   border: "none",
          //   color: "white",
          //   boxSizing: "border-box",
          //   backgroundColor:
          //     activeTab === tab?.id
          //       ? "var(--primary)"
          //       : hoveredTab === tab?.name
          //         ? "var(--primary-70)"
          //         : "var(--primary-60)",
          // }}
          style={commonTabStyle(tab?.id)}
          data-text={tab?.name}
          onMouseEnter={() => handleMouseEnter(tab?.id)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="d-flex align-items-center">
            <span className="" style={{ width: "19px", height: "19px" }}>
              <img className="ic-19 ic" src={tab?.page_icon}></img>
            </span>
            <span className="ml-1">{tab?.name}</span>
            {/* <span className="badge badge-primary ml-1">{tab?.doc_count}</span> */}
            <span className="text-gold ml-1">
              {page === "photo" ? tab?.photo_count : tab?.doc_count}
            </span>
          </div>
        </a>
      ))}
    </div>
  ) : (
    <div style={{ height: 0, marginBottom: "-10px" }}></div>
  );
};

export default Tabs;
