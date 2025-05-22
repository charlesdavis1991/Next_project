import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import CalculatedDatesTableModal from "../../Modals/CalculatedDatesTableModal";
import { fetchCalculatedDates } from "../../../Redux/calculated-dates-table/calculatedDatesSlice";

const CalculatedDatesTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [calculatedDatePopUp, setCalculatedDatePopUp] = useState(false);
  const [selectedCalculatedDate, setSelectedCalculatedDate] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { calculatedDates, loading } = useSelector(
    (state) => state.calculatedDates
  );
  const [numColumns, setNumColumns] = useState(0);
  const selectedState = useSelector((state) => state.selectedState);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCalculatedDates, setSortedCalculatedDates] =
    useState(calculatedDates);

  useEffect(() => {
    if (calculatedDates?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchCalculatedDates({
            url:`${origin}/api/calculated/dates/directory/?state=${selectedState.selectedState}`,
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
    if (!loading && calculatedDates.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && calculatedDates.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [calculatedDates]);

  useEffect(() => {
    if(calculatedDates?.length > 0){
    const sortedData = [...calculatedDates].sort((a, b) => {
      const nameA = a.name || ""; // Default to an empty string if name is undefined
      const nameB = b.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCalculatedDates(sortedData);}
  }, [calculatedDates]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...calculatedDates].sort((a, b) => {
      const nameA = a.calculated_date_name || "";
      const nameB = b.calculated_date_name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCalculatedDates(sortedData);
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
  }, [calculatedDates]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || calculatedDates.length == 0) {
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
  }, [hasNoData, loading, calculatedDates]);

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

  const handleRowClick = (calculatedDate) => {
    setSelectedCalculatedDate(calculatedDate);
    setCalculatedDatePopUp(true);
  };

  const handleClosePopUp = () => {
    setCalculatedDatePopUp(false);
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
            <th style={{ width: "17%" }} onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Calculated Date
            </th>
            <th style={{ width: "7%" }}>Type</th>
            <th style={{ width: "5%" }}>Days</th>
            <th style={{ width: "5%" }}>Months</th>
            <th style={{ width: "5%" }}>Years</th>
            <th style={{ width: "14%" }}>Dependant Date</th>
            <th style={{ width: "6%" }}>Jurisdiction Type</th>
            <th style={{ width: "40%" }}>State & Counties</th>
          </tr>
        </thead>
        <tbody>
          {sortedCalculatedDates?.map((calculatedDate, index) => {
            return (
              <tr
                key={calculatedDate.id}
                onClick={() => handleRowClick(calculatedDate)}
                data-toggle="modal"
                data-target="#edit_calculatedDate_modal"
                ref={
                  index === sortedCalculatedDates.length - 1
                    ? lastRealRowRef
                    : null
                }
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {calculatedDate?.calculated_date_name || ""}
                </td>
                <td className="is-search">
                  {calculatedDate?.day_count_type || ""}
                </td>
                <td>{calculatedDate?.day_count || ""}</td>
                <td>{calculatedDate?.month_count || ""}</td>
                <td>{calculatedDate?.year_count || ""}</td>
                <td className="is-search">
                  {calculatedDate?.dependant_date?.dependent_date_name || ""}
                </td>
                <td className="is-search">
                  {calculatedDate?.jurisdiction_type?.name || ""}
                </td>
                <td className="is-search">
                  {calculatedDate?.state && (
                    <strong>
                      {calculatedDate.state.name}
                      {" - "}
                    </strong>
                  )}
                  {calculatedDate?.counties?.map((county, index) => (
                    <span key={index} className="text-wrap">
                      {county.name}
                      {", "}
                    </span>
                  ))}
                </td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {calculatedDatePopUp && (
        <CalculatedDatesTableModal
          calculatedDatePopUp={calculatedDatePopUp}
          handleClose={handleClosePopUp}
          calculatedDateData={selectedCalculatedDate}
        />
      )}
    </div>
  );
};

export default CalculatedDatesTable;
