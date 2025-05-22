import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchJurisdictionData } from "../../../Redux/jurisdiction-table/jurisdictionSlice";
import JurisdictionTableModal from "../../Modals/JurisdictionTableModal";

const JurisdictionTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [jurisdictionPopUp, setJurisdictionPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { jurisdictions, loading } = useSelector(
    (state) => state.jurisdictions
  );
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(null);
  const [numColumns, setNumColumns] = useState(0);
  const selectedState = useSelector((state) => state.selectedState);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedJurisdictions, setSortedJurisdictions] = useState(jurisdictions);

  useEffect(() => {
    if (jurisdictions?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchJurisdictionData({
            url:`${origin}/api/get/jurisdiction/directory/?state=${selectedState.selectedState}`,
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
    if (!loading && jurisdictions.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && jurisdictions.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [jurisdictions]);

  useEffect(() => {
    if(jurisdictions?.length > 0){const sortedData = [...jurisdictions].sort((a, b) => {
      const nameA = a.name || ""; // Default to an empty string if name is undefined
      const nameB = b.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedJurisdictions(sortedData);}
  }, [jurisdictions]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...jurisdictions].sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedJurisdictions(sortedData);
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
  }, [jurisdictions]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || jurisdictions.length == 0) {
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
  }, [hasNoData, loading, jurisdictions]);

  useEffect(() => {
    // Initial call
    calculateAdditionalRows();
    // Add resize event listener
    const handleResize = () => {
      calculateAdditionalRows();
    };
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove the event listener
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

  const handleRowClick = (jurisdiction) => {
    setSelectedJurisdiction(jurisdiction);
    setJurisdictionPopUp(true);
  };

  const handleClosePopUp = () => {
    setJurisdictionPopUp(false);
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
              {sortOrder === "asc" ? "▼" : "▲"} Jurisdiction
            </th>
            <th style={{ width: "4%" }}>Type</th>
            <th style={{ width: "41%" }}>State & County</th>
            <th style={{ width: "42%" }}>Circuit & District & Division</th>
          </tr>
        </thead>
        <tbody>
          {sortedJurisdictions?.map((jurisdiction, index) => {
            return (
              <tr
                key={jurisdiction.id}
                onClick={() => handleRowClick(jurisdiction)}
                data-toggle="modal"
                data-target="#edit_jurisdiction_modal"
                ref={index === jurisdictions.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">{jurisdiction?.name || ""}</td>
                <td className="is-search">{jurisdiction?.jurisdiction_type?.name}</td>
                <td className="is-search">
                  {jurisdiction?.states
                    ?.slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((state) => {
                      const countiesForState = jurisdiction?.counties
                        ?.filter((county) => county.in_state?.id === state.id)
                        ?.slice()
                        .sort((a, b) => a.name.localeCompare(b.name));

                      const countyString = countiesForState
                        ?.map((county) => county.name)
                        .join(", ");

                      return (
                        <div key={state.id} className="text-wrap">
                          <strong>{state.name && ` ${state.name} - `}</strong>
                          <span>{countyString}</span>
                        </div>
                      );
                    })}
                </td>

                <td className="is-search">
                  {jurisdiction?.districts?.map((district) => (
                    <span key={district.id}>
                      {district.name && `${district.name}, `}
                    </span>
                  ))}
                  {jurisdiction?.divisions?.lenght > 0 && (
                    <>
                      <br />
                      {jurisdiction?.divisions?.map((division) => (
                        <span key={division.id}>
                          {division.name && `${division.name}, `}
                        </span>
                      ))}
                    </>
                  )}
                  {jurisdiction?.circuits?.length > 0 && (
                    <>
                      <br />
                      {jurisdiction?.circuits?.map((circuit) => (
                        <span key={circuit.id}>
                          {circuit.circuit_name && `${circuit.circuit_name}, `}
                        </span>
                      ))}
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {jurisdictionPopUp && (
        <JurisdictionTableModal
          jurisdictionPopUp={jurisdictionPopUp}
          handleClose={handleClosePopUp}
          jurisdictionData={selectedJurisdiction}
        />
      )}
    </div>
  );
};

export default JurisdictionTable;
