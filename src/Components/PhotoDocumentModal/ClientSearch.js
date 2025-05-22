import React from "react";
import {
  ClientTable,
  SearchInput,
  useClientSearch,
} from "./ClientSearchComponents";

const ClientSearch = ({ setError }) => {
  const { searchTerm, setSearchTerm, searchResults, isLoading, error } =
    useClientSearch();

  return (
    <div className="client-search-container table-responsive table--no-card rounded-0 border-0 doc-pop-overflow-visible min-height-0 m-t-5">
      <div className="client-search">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for Client..."
        />
      </div>
      <ClientTable
        recs={searchResults}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        setError={setError}
      />
    </div>
  );
};

export default ClientSearch;
