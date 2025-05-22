import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import api from "../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";
// import { useDocumentModal } from "./DocumentModalContext";
import incidentIcon from "../../assets/images/incident.svg";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import "./ClientSearch.css";
import {
  setInboxRefreshDocuments,
  setInboxRefreshDocumentsDueToDelete,
} from "../../Redux/inbox/actions";
import { useDispatch } from "react-redux";

export function useClientSearch(searchDelay = 200) {
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

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    isLoading,
    error,
  };
}

const SearchInput = ({ value, onChange, placeholder, className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      type="text"
      className={`form-control ${className}`}
      placeholder={placeholder}
      id="id-border-radius-important-popup"
      value={value}
      style={{
        height: "25px",
        padding: "5px 10px",
        color: isFocused ? "black" : "var(--primary-25)",
      }}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

const ClientTable = ({
  setError,
  recs,
  isLoading,
  error,
  searchTerm = "",
  fetchPageDetails,
  setLoading,
  setSearchTerm,
  setSearchResults,
}) => {
  const { documentData } = useDocumentModal();
  const { id: docId } = documentData;
  const { toggle, hideDocumentModal, setDocumentData, refetchDocumentData } =
    useDocumentModal();
  const dispatch = useDispatch();

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
      setLoading(true);
      fetchPageDetails(response.data?.docData?.for_case?.id);
      setDocumentData({
        ...documentData,
        for_client: { ...response.data?.docData?.for_client },
        attached_by: {
          ...response.data?.docData?.attached_by,
        },
        for_case: {
          ...response.data?.docData?.for_case,
        },
      });
      setSearchResults([]);
      setSearchTerm("");
      console.log("Document moved successfully", response.data);
      dispatch(setInboxRefreshDocuments(true));
      dispatch(setInboxRefreshDocumentsDueToDelete(true));
      if (typeof refetchDocumentData === "function") {
        console.log("Hello");
        await refetchDocumentData();
      }
      toggle();
      // hideDocumentModal();
    } catch (error) {
      console.error("Error in handleMoveToCase function:", error);
      setError(
        `Something went wrong with moving the document: ${error.message}`
      );
      setLoading(false);
    } finally {
      setLoading(false);
      // dispatch(setInboxRefreshDocuments(false));
      // dispatch(setInboxRefreshDocumentsDueToDelete(false));
    }
  };
  console.log(recs);

  function alignColumnWidthsByClass(className) {
    const elements = document.querySelectorAll(`.${className}`);
    let maxWidth = 0;

    elements.forEach((el) => {
      const width = el.offsetWidth;
      if (width > maxWidth) maxWidth = width;
    });

    elements.forEach((el) => {
      el.style.width = `${maxWidth}px`;
      el.style.minWidth = `${maxWidth}px`;
      el.style.maxWidth = `${maxWidth}px`;
    });
  }

  useEffect(() => {
    if (!recs || recs.length === 0) return;

    alignColumnWidthsByClass("birthday-wrapper");
    alignColumnWidthsByClass("case-wrapper");
    alignColumnWidthsByClass("doi-wrapper");
  }, [recs]);

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
          <td
            id="id-document-padding-important-popup-first"
            className="text-center height-35"
            style={{
              fontWeight: "600",
              fontSize: "14px",
              color: "#000",
            }}
          >
            <div className=" d-flex align-items-center">
              <span className="p-r-5 d-flex align-items-center">
                <img
                  className="ic-29"
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    backgroundColor: "white",
                  }}
                  src={
                    rec?.for_client?.profile_pic_19p ??
                    "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                  }
                />
              </span>
              {rec?.for_client?.first_name || ""}{" "}
              {rec?.for_client?.last_name || ""}
            </div>
          </td>
          <td
            id="id-document-padding-important-popup birthday-col"
            className="text-center height-35"
            style={{
              fontWeight: "600",
              fontSize: "14px",
              color: "#000",
            }}
          >
            <div className=" d-flex align-items-center justify-content-center">
              <span className="p-r-5 d-flex align-items-center">
                <img className="ic-19" src={birthdayIcon} />
              </span>
              <span className="d-flex align-items-center justify-content-start birthday-wrapper">
                {rec?.for_client?.birthday || ""}
              </span>
            </div>
          </td>
          <td
            id="id-document-padding-important-popup  case-col"
            className="text-center height-35 "
            style={{
              fontWeight: "600",
              fontSize: "14px",
              color: "#000",
            }}
          >
            <div
              className=" d-flex align-items-center justify-content-center"
              style={{
                gap: "5px",
              }}
            >
              <span className="d-flex align-items-center ">
                <img
                  className="ic-19"
                  src={rec?.case_type?.casetype_icon ?? ""}
                />
              </span>
              <span className="case-wrapper d-flex align-items-center justify-content-start">
                {rec?.case_type?.name || ""}
              </span>
              <span className="d-flex align-items-center ">
                <img className="ic-19" src={incidentIcon} />
              </span>
              <span className="doi-wrapper d-flex align-items-center justify-content-start">
                {rec?.incident_date || ""}
              </span>
            </div>
          </td>
          <td
            id="id-document-padding-important-popup-last"
            className="text-end height-35 p-r-5"
          >
            <button
              onClick={() => handleMoveToCase(docId, rec?.id || null, 2)}
              className="btn-success height-25"
              style={{
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Link Document to Case Generally
            </button>
          </td>
        </tr>
      ));
    } else if (searchTerm.length !== 0 && recs.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center">
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
      id="id-document-padding-important-popup"
      style={{ display: searchTerm.length > 0 ? "inline-table" : "none" }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "var(--primary-10)",
          }}
        >
          <th
            className="text-left height-25 td-autosize"
            style={{ backgroundColor: "var(--primary-10)", fontWeight: 600 }}
          >
            CLIENT NAME
          </th>
          <th
            className="text-center height-25 td-autosize"
            style={{ backgroundColor: "var(--primary-10)", fontWeight: 600 }}
          >
            BIRTHDAY
          </th>
          <th
            className="text-center height-25 td-autosize"
            style={{ backgroundColor: "var(--primary-10)", fontWeight: 600 }}
          >
            CASE
          </th>
          {/* <th
            className="text-center"
            style={{ backgroundColor: "var(--primary-10)", fontWeight: 600 }}
          >
            STAGE
          </th> */}
          <th
            className="text-center height-25 td-autosize"
            style={{ backgroundColor: "var(--primary-10)", fontWeight: 600 }}
          ></th>
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </table>
  );
};

export { SearchInput, ClientTable };
