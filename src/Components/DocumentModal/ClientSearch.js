import React from "react";
import {
  ClientTable,
  SearchInput,
  useClientSearch,
} from "./ClientSearchComponents";

const ClientSearch = ({ setError, fetchPageDetails, setLoading }) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    isLoading,
    error,
  } = useClientSearch();

  return (
    <div className="client-search-container table-responsive table--no-card rounded-0 border-0 doc-pop-overflow-visible min-height-0 m-l-5 m-r-5 m-t-5 m-b-5 p-r-10">
      <div className="client-search" style={{ height: "25px" }}>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="document-search-text-color"
          placeholder="Move This Document to a Different Case by Typing the First Three Letters of a Client's First, Middle or Last Name"
        />
      </div>
      <ClientTable
        recs={searchResults}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        setError={setError}
        fetchPageDetails={fetchPageDetails}
        setLoading={setLoading}
        setSearchResults={setSearchResults}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default ClientSearch;
