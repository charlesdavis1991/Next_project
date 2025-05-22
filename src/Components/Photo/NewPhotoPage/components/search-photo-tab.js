import React, { useState, useEffect, useCallback } from "react";
import "./search-photo-tab.css";
import { getCaseId, getClientId } from "../../../../Utils/helper";
import api from "../../../../api/api";

const debounce = (fn, ms) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

const SearchPhotosTab = ({
  activeTab,
  setTabData,
  setPageSlots,
  setUnsortedCount,
  setAllCount,
  setLoading,
  setQuery,
  activeTabName,
  pageViewState,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const currentCaseId = getCaseId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [pageView, setPageView] = pageViewState;

  const searchData = async (search) => {
    try {
      const response = await api.get(
        `${origin}/api/photo/list-page-photo-optimized/`,
        {
          params: {
            page_id: activeTab === "all" ? "" : activeTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: activeTab === "all" ? "True" : false,
            query: search,
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

  const fetchTabsData = async (search) => {
    try {
      const response = await api.get(`${origin}/api/photos/count/`, {
        params: {
          case_id: currentCaseId ? currentCaseId : "",
          query: search,
        },
      });
      if (response.status === 200) {
        setPageSlots(response.data.data);
        setUnsortedCount(response.data.unsorted_count);
        setAllCount(response.data.all_count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((search) => {
      setLoading(true);
      searchData(search);
      fetchTabsData(search);
    }, 300),
    [activeTab, currentCaseId]
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <>
      <div className="d-flex align-items-center w-100 height-25 search-tab">
        <div
          onClick={() => setPageView("photos")}
          className={`view-style-tabs view-style-tab-1 height-25 ${pageView === "photos" && "active-view-style-tab"}`}
        >
          Photos
        </div>
        <div
          onClick={() => setPageView("detailed")}
          className={`view-style-tabs view-style-tab-2 height-25 ${pageView === "detailed" && "active-view-style-tab"}`}
        >
          Detailed
        </div>
        <div
          onClick={() => setPageView("default")}
          className={`view-style-tabs skew-lasat-child-none view-style-tab-3 height-25 ${pageView === "default" && "active-view-style-tab"}`}
        >
          Shown on Page
        </div>

        <input
          type="text"
          style={{ flex: 1 }}
          className="form-control"
          placeholder="Filter Photos by Name"
          id="search_filter_directories"
          value={searchTerm}
          onChange={handleInputChange} // Call handleInputChange on every input change
        />
      </div>
    </>
  );
};

export default SearchPhotosTab;
