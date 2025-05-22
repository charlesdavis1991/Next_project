import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import AssembleDocument from "../AssembleDocument/AssembleDocument";
import "./SearchTabStyles.css";

const debounce = (fn, ms) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

const SearchTab = ({
  activeTab,
  setTabData,
  setPageSlots,
  setUnsortedCount,
  setAllCount,
  setLoading,
  setQuery,
  activeTabName,
  pageViewState,
  isAngleLong,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const currentCaseId = getCaseId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [pageView, setPageView] = pageViewState;

  const [showAssemble, setShowAssemble] = useState(false);

  const handleAssemblePopUp = () => {
    setShowAssemble(true);
  };

  // Fetch data for documents filtered by search term
  const searchData = async (search) => {
    try {
      const response = await api.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: activeTab === "all" ? "" : activeTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: activeTab === "all" ? "True" : false,
            query: search, // Pass the search term in the API request
            client_id: getClientId(),
          },
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch tab data based on search term
  const fetchTabsData = async (search) => {
    try {
      const response = await api.get(
        `${origin}/api/doc-page/doc-page-api-viewset/`,
        {
          params: {
            case_type_id: currentCaseId ? currentCaseId : "",
            query: search, // Pass the search term in the API request
          },
        }
      );
      if (response.status === 200) {
        setPageSlots(response.data.data);
        setUnsortedCount(response.data.unsorted_count);
        setAllCount(response.data.all_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Debounce both searchData and fetchTabsData calls together
  const debouncedSearch = useCallback(
    debounce((search) => {
      setLoading(true);
      searchData(search);
      fetchTabsData(search);
    }, 300),
    [activeTab, currentCaseId] // Add dependencies to ensure proper re-rendering
  );

  // Handle input changes and trigger debounced search
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setQuery(value);
    debouncedSearch(value); // Call the debounced function on input change
  };

  return (
    <>
      <div className="d-flex align-items-center w-100 height-25 search-tab">
        <div
          onClick={() => setPageView("detailed")}
          className={`view-style-tabs view-style-tab-1 height-25 ${pageView === "detailed" && "active-view-style-tab"} ${!isAngleLong && " short-angle"}`}
        >
          Documents
        </div>
        <div
          onClick={() => setPageView("updated")}
          className={`view-style-tabs view-style-tab-2 height-25 ${pageView === "updated" && "active-view-style-tab"}`}
        >
          Detailed
        </div>
        <div
          onClick={() => setPageView("default")}
          className={`view-style-tabs skew-lasat-child-none view-style-tab-3 height-25 ${pageView === "default" && "active-view-style-tab"}`}
        >
          Doc Rows
        </div>

        <input
          type="text"
          style={{ flex: 1 }}
          className="form-control"
          placeholder="Filter Documents by Name"
          id="search_filter_directories"
          value={searchTerm}
          onChange={handleInputChange} // Call handleInputChange on every input change
        />

        {activeTabName != "Unsorted" && (
          <button
            className="height-25 d-flex align-items-center search_filter_directories_label font-weight-bold btn btn-primary m-l-5 p-l-5 p-r-5 text-white no-border-btn"
            onClick={handleAssemblePopUp}
          >
            Doc Assembly
          </button>
        )}
      </div>
      <div
        style={{
          width: "100%",
          height: "5px",
          background: "white",
          position: "relative",
        }}
      ></div>
      {showAssemble && (
        <AssembleDocument
          show={showAssemble}
          handleClose={() => setShowAssemble(false)}
          activeTab={activeTab}
        />
      )}
    </>
  );
};

export default SearchTab;
