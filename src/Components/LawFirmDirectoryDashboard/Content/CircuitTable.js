import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchCircuitData } from "../../../Redux/circuits/circuitSlice";
import CircuitTableModal from "../../Modals/CircuitTableModal";

const CircuitTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState(null);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [circuitPopUp, setCircuitPopUp] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { circuits, loading } = useSelector((state) => state.circuits);
  const selectedState = useSelector((state) => state.selectedState);
  const [numColumns, setNumColumns] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCircuits, setSortedCircuits] = useState(circuits);

  useEffect(() => {
    if (circuits?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchCircuitData({
            url:`${origin}/api/get/all/circuits/?state=${selectedState.selectedState}`,
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
    if (!loading && circuits.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && circuits.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [circuits]);

  useEffect(() => {
    if(circuits?.length > 0){
    const sortedData = [...circuits].sort((a, b) => {
      const nameA = a.name || ""; // Default to an empty string if name is undefined
      const nameB = b.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCircuits(sortedData);}
  }, [circuits]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...circuits].sort((a, b) => {
      const nameA = a.name || "";
      const nameB = b.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCircuits(sortedData);
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
  }, [circuits]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || circuits.length == 0) {
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
  }, [hasNoData, loading, circuits]);

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

  const handleRowClick = (circuit) => {
    setSelectedCircuit(circuit);
    setCircuitPopUp(true);
  };

  const handleClosePopUp = () => {
    setCircuitPopUp(false);
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

  if (error) {
    return <div>Error: {error.message}</div>;
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
              <th style={{ width: "11%" }} onClick={handleSort}>
                {sortOrder === "asc" ? "▼" : "▲"} Circuit
              </th>
              <th style={{ width: "4%" }}>Type</th>
              <th style={{ width: "20%" }}>States</th>
              <th style={{ width: "64%" }}>Counties</th>
            </tr>
          </thead>
          <tbody>
            {sortedCircuits?.map((circuit, index) => {
              return (
                <tr
                  key={circuit.id}
                  onClick={() => handleRowClick(circuit)}
                  data-toggle="modal"
                  data-target="#edit_circuit_modal"
                  ref={
                    index === sortedCircuits.length - 1 ? lastRealRowRef : null
                  }
                >
                  <td className="width-36">{index + 1}</td>
                  <td className="is-search">{circuit?.circuit_name || ""}</td>
                  <td>{circuit?.jurisdiction_type?.name}</td>
                  <td className="is-search">
                    {circuit?.states?.length > 0 ? (
                      circuit.states.map((state, index) => (
                        <span key={index}>
                          {state.name}
                          {index < circuit.states.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className="text-grey">States</span>
                    )}
                  </td>
                  <td className="is-search">
                    {circuit?.counties?.length > 0 ? (
                      circuit.counties.map((county, index) => (
                        <span key={index}>
                          {county.name}
                          {index < circuit.counties.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span className="text-grey">Counties</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {renderAdditionalRows()}
          </tbody>
        </Table>
      {circuitPopUp && (
        <CircuitTableModal
          circuitPopUp={circuitPopUp}
          handleClose={handleClosePopUp}
          circuitData={selectedCircuit}
        />
      )}
    </div>
  );
};

export default CircuitTable;
