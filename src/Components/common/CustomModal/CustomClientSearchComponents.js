import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import api from "../../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useDocumentModal } from "./CustomModalContext";

export function useCustomClientSearch(searchDelay = 200) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, searchDelay);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      setIsLoading(true);
      setError(null);
      api
        .get(`api/clients/search/?query=${debouncedSearchTerm}`)
        .then((response) => {
          console.log("API RESPONSE: ", response);
          setSearchResults(response.data);
        })
        .catch((error) => {
          setError(error);
          setSearchResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (debouncedSearchTerm.length === 0) {
      setSearchResults([]);
      setError(null);
    }
  }, [debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, searchResults, isLoading, error };
}

const SearchInput = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    className={`form-control ${className}`}
    placeholder={placeholder}
    value={value}
    style={{ height: "25px", padding: "5px 10px" }}
    onChange={onChange}
  />
);

const ClientTable = ({ setError, recs, isLoading, error, searchTerm = "" }) => {
  const { documentData } = useDocumentModal();
  const { id: docId } = documentData;
  const { toggle, hideDocumentModal } = useDocumentModal();

  const handleMoveToCase = async (docId, caseId, onPageId) => {
    if (!docId) {
      console.error("Document ID is required");
      setError("Document ID is required");
      return;
    }

    const pageId = onPageId;

    if (!pageId) {
      console.error("No page ID provided and no default could be determined");
      setError("Page ID is necessary but was not provided");
      return;
    }

    if (!caseId) {
      console.error("Case ID is not available in the provided record");

      setError("No case associated with this document");
      return;
    }

    try {
      const response = await api.post(`/api/attach_doc_to_page/`, {
        page_id: pageId,
        case_id: caseId,
        doc_id: docId,
      });

      console.log("Document moved successfully", response.data);
      toggle();
      hideDocumentModal();
    } catch (error) {
      console.error("Error in handleMoveToCase function:", error);
      setError(
        `Something went wrong with moving the document: ${error.message}`
      );
    }
  };

  const tableBody = useMemo(() => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan="6" className="text-center">
            <Box sx={{ display: "flex", width: "100%" }}>
              <CircularProgress />
            </Box>
          </td>
        </tr>
      );
    } else if (error) {
      return (
        <tr>
          <td colSpan="6" className="text-center text-danger">
            Error loading data: {error.message}
          </td>
        </tr>
      );
    } else if (recs.length > 0) {
      return recs.map((rec) => (
        <tr key={rec.id}>
          <td className="text-center">
            {rec?.for_client?.first_name || ""}{" "}
            {rec?.for_client?.last_name || ""}
          </td>
          <td className="text-center">{rec?.for_client?.birthday || ""}</td>
          <td className="text-center">{rec?.incident_date || ""}</td>
          <td className="text-center">{rec?.stage || ""}</td>
          <td className="text-center">
            <button
              onClick={() => handleMoveToCase(docId, rec?.id || null, 2)}
              className="btn-success"
            >
              Move to Case
            </button>
          </td>
        </tr>
      ));
    } else if (searchTerm.length !== 0 && recs.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="text-center">
            No Results
          </td>
        </tr>
      );
    } else {
      return <tr></tr>;
    }
  }, [recs, isLoading, error]);

  return (
    <table
      className="table table-earning"
      style={{ display: searchTerm.length > 0 ? "inline-table" : "none" }}
    >
      <thead>
        <tr>
          <th
            className="text-center"
            style={{ backgroundColor: "white", fontWeight: 600 }}
          >
            CLIENT NAME
          </th>
          <th
            className="text-center"
            style={{ backgroundColor: "white", fontWeight: 600 }}
          >
            BIRTHDAY
          </th>
          <th
            className="text-center"
            style={{ backgroundColor: "white", fontWeight: 600 }}
          >
            CASE / DOI
          </th>
          <th
            className="text-center"
            style={{ backgroundColor: "white", fontWeight: 600 }}
          >
            STAGE
          </th>
          <th
            className="text-center"
            style={{ backgroundColor: "white", fontWeight: 600 }}
          ></th>
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </table>
  );
};

export { SearchInput, ClientTable };
