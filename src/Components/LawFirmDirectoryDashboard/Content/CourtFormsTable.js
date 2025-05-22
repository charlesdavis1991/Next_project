import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchCourtForms } from "../../../Redux/courtForms-table/courtFormsSlice";
import { getCaseId, getClientId } from "../../../Utils/helper";
import CourtFormsTableModal from "../../Modals/CourtFormsTableModal";

const CourtFormsTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const caseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [courtFormPopUp, setCourtFormPopUp] = useState(false);
  const [selectedCourtForm, setSelectedCourtForm] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { courtForms, loading } = useSelector((state) => state.courtForms);
  const [numColumns, setNumColumns] = useState(0);
  const selectedState = useSelector((state) => state.selectedState);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCourtForms, setSortedCourtForms] = useState(courtForms);

  useEffect(() => {
    if (courtForms?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchCourtForms({
            url:`${origin}/api/court/forms/directory/${clientId}/${caseId}/?state=${selectedState.selectedState}`,
            config:{
              headers: {
                Authorization: tokenBearer,
              },
            }
          })
        );
      })();
    }
  }, [tokenBearer, selectedState]);

  useEffect(() => {
    if (!loading && courtForms.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && courtForms.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [courtForms]);

  useEffect(() => {
    if (courtForms?.length > 0){const sortedData = [...courtForms].sort((a, b) => {
      const nameA = a.name || ""; // Default to an empty string if name is undefined
      const nameB = b.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCourtForms(sortedData);}
  }, [courtForms]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...courtForms].sort((a, b) => {
      const nameA = a.court_form_name || "";
      const nameB = b.court_form_name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCourtForms(sortedData);
  };

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current || !lastRealRowRef.current || hasNoData == true)
        return;
      const pageHeight = window.innerHeight;
      const tableTop =
        tableRef.current.getBoundingClientRect().top + window.scrollY;
      if (tableTop > 0) {
        const lastRowHeight =
          lastRealRowRef.current.getBoundingClientRect().height || 25;
        // Get the height of existing rows
        const existingRows = tableRef.current.rows.length;

        const existingRowsWithData = Array.from(tableRef.current.rows).filter(
          (row) => {
            return Array.from(row.cells).some(
              (cell) => cell.textContent.trim() !== ""
            );
          }
        ).length;
        const existingRowsHeight = existingRowsWithData * lastRowHeight;

        const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10; // Subtracting a small buffer
        const rows = Math.floor(remainingHeight / lastRowHeight);
        // Set the number of rows needed to fill the remaining space
        setAdditionalRows(rows > 0 ? rows : 0);
      }
    };
    const extractColumns = () => {
      if (tableRef.current && tableRef.current.rows.length > 0) {
        const columns = tableRef.current.rows[0].cells.length;
        setNumColumns(columns);
      }
    };

    // Initial calculations
    calculateRows();
    extractColumns();

    // Resize event listener
    const handleResize = () => {
      calculateRows();
      extractColumns();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [courtForms]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || courtForms.length == 0) {
      // Perform the logic when there is no data
      dispatch(setIsSearchDisabled(true));
      const table = document.querySelector(".custom-table-directory");
      if (!table) return; // Check if the table exists

      const rowHeight = 31; // height of each row in px
      const viewportHeight = window.innerHeight;
      const tableBottom = table.getBoundingClientRect().bottom;
      const remainingHeight = viewportHeight - tableBottom;

      let additionalRows = Math.max(0, Math.floor(remainingHeight / rowHeight));

      const colSpan = table.querySelectorAll("thead tr th").length;
      const tbody = table.querySelector("tbody");

      // Clear existing fake rows
      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());

      // Append new fake rows
      for (let i = 0; i < additionalRows; i++) {
        const fakeRow = document.createElement("tr");
        fakeRow.className = "fake-row-2";
        fakeRow.style.height = `${rowHeight}px`;

        const td = document.createElement("td");
        td.colSpan = colSpan;
        td.innerHTML = "&nbsp;";
        fakeRow.appendChild(td);
        tbody.appendChild(fakeRow);
      }
    } else {
      const table = document.querySelector(".custom-table-directory");
      if (!table) return;
      const tbody = table.querySelector("tbody");

      // Clear existing fake rows
      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());
    }
  }, [hasNoData, loading, courtForms]);

  useEffect(() => {
    calculateAdditionalRows();

    const handleResize = () => {
      calculateAdditionalRows();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateAdditionalRows]);

  const renderAdditionalRows = () => {
    return Array.from({ length: additionalRows }).map((_, rowIndex) => (
      <tr
        key={rowIndex}
        className="emptytestRows"
        style={{
          height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
        }}
      >
        {Array.from({ length: numColumns }).map((_, colIndex) => (
          <td
            key={colIndex}
            style={{
              height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
              color: "transparent",
            }}
          ></td>
        ))}
      </tr>
    ));
  };

  const handleRowClick = (courtForm) => {
    setSelectedCourtForm(courtForm);
    setCourtFormPopUp(true);
  };

  const handleClosePopUp = () => {
    setCourtFormPopUp(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Table
        className="text-start custom-table-directory font-weight-600"
        striped
        responsive
        bordered
        hover
        ref={tableRef}
      >
        <thead>
          <tr>
            <th style={{ width: "1%" }}></th>
            <th style={{ width: "12%" }} onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Court Form
            </th>
            <th style={{ width: "11%" }}>Code</th>
            <th style={{ width: "10%" }}>Case Types</th>
            <th style={{ width: "30%" }}>States & Counties</th>
            <th style={{ width: "10%" }}>Jurisdiction Type</th>
            <th style={{ width: "20%" }}>Jurisdictions</th>
            <th style={{ width: "6%" }}>Pdf Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {sortedCourtForms?.map((courtForm, index) => {
            return (
              <tr
                key={index}
                onClick={() => handleRowClick(courtForm)}
                data-toggle="modal"
                data-target="#edit_courtForm_modal"
                ref={
                  index === sortedCourtForms.length - 1 ? lastRealRowRef : null
                }
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {courtForm?.court_form_name || ""}
                </td>
                <td className="is-search">
                  {courtForm?.court_form_code || ""}
                </td>
                <td className="is-search">
                  {courtForm?.for_case_types?.map((caseType, index) => (
                    <span key={index} className="text-wrap">
                      {caseType?.name}
                      {", "}
                    </span>
                  )) || ""}
                </td>
                <td className="is-search">
                  {courtForm?.for_states && courtForm?.for_states.length > 0 && (
                    courtForm?.for_states
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((state) => {
                        const countiesForState = courtForm?.for_counties
                          .filter((county) => county.in_state?.id === state.id)
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name));

                        const countyString = countiesForState
                          .map((county) => county.name)
                          .join(", ");

                        return (
                          <div key={state.id} className="text-wrap">
                            <strong>{state.name && ` ${state.name} - `}</strong>
                            <span>{countyString}</span>
                          </div>
                        );
                      })
                  )}
                </td>

                <td className="is-search">
                  {courtForm?.for_jurisdiction_types?.map(
                    (jurisdictiontype, index) => (
                      <span key={index} className="text-wrap">
                        {index + 1}: {jurisdictiontype?.name}
                        {", "}
                      </span>
                    )
                  ) || ""}
                </td>
                <td className="is-search">
                  {courtForm?.for_jurisdictions?.map((jurisdiction, index) => (
                    <span key={index} className="text-wrap">
                      {jurisdiction?.name}
                      {", "}
                    </span>
                  )) || ""}
                </td>
                <td className="is-search">
                  {courtForm?.is_pdf_uploaded === true ? "Yes" : "No"}
                </td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {courtFormPopUp && (
        <CourtFormsTableModal
          courtFormPopUp={courtFormPopUp}
          handleClose={handleClosePopUp}
          courtFormData={selectedCourtForm}
        />
      )}
    </div>
  );
};

export default CourtFormsTable;
