import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import { getCaseId,getClientId } from "../../Utils/helper";
import UploadDocument from "./UploadDocument"; // Adjust the import path if needed
import { Button, Nav, Tab } from "react-bootstrap";

const debounce = (fn, ms) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

const SearchTab = ({activeTab, setTabData, setPageSlots, setUnsortedCount, setAllCount, setLoading, setQuery, fetchDocumentsData}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const currentCaseId = getCaseId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  // Function to handle opening the modal
  const handleOpenModal = () => setShowModal(true);

  // Function to handle closing the modal


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
            client_id: getClientId()
  
          },
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
        setLoading(false)

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
      setLoading(true)
      searchData(search);
      fetchTabsData(search);
    }, 300),
    [activeTab, currentCaseId] // Add dependencies to ensure proper re-rendering
  );

  // Handle input changes and trigger debounced search
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setQuery(value)
    debouncedSearch(value); // Call the debounced function on input change
  };

  return (
    <>
          <UploadDocument setShowModal={setShowModal}  show={showModal} fetchDocumentsData={fetchDocumentsData}/>

    <div className="nav nav-tabs mb-1 h-auto " role="tablist">
      <div className="d-flex align-items-center w-100" style={{ marginTop: "5px" }}>
        <div className="height-35 d-flex align-items-center p-l-5 p-r-5 text-white search_filter_dir_label_div">
          <label
            htmlFor="search_filter_directories"
            className="search_filter_directories_label font-weight-bold btn btn-primary m-2 p-0"
          >
            Filter Documents by Name:
          </label>
        </div>
        <input
          type="text"
          style={{ flex: 1 }}
          className="form-control"
          placeholder="Type Something to Filter"
          id="search_filter_directories"
          value={searchTerm}
          onChange={handleInputChange} // Call handleInputChange on every input change
        />
        {(activeTab == "documents")?(  <Button variant="primary" onClick={handleOpenModal}>
          Add a Document
        </Button>
      ):null}
      
      </div>
    </div>
    </>

  );
};

export default SearchTab;
