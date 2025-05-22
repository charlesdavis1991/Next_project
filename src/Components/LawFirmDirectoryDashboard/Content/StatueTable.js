import React, { useEffect, useState, useRef, useCallback } from "react";
import StatuePopUp from "../../Modals/StatuePopUp";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";
import { fetchStatuteData } from "./../../../Redux/statue-data/statuteSlice";

const StatueTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [selectedStatue, setSelectedStatue] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const lastRealRowRef = useRef(null);
  const tableRef = useRef();
  const [numColumns, setNumColumns] = useState(0);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { statutes, loading } = useSelector((state) => state.statutes);
  const selectedState = useSelector((state) => state.selectedState);

  useEffect(() => {
    if (statutes?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchStatuteData({
            url:`${origin}/api/get/statue/limits/?state=${selectedState?.selectedState}`,
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
  }, [statutes]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData) {
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
  }, [hasNoData, loading]);

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

  const handleRowClick = (statue) => {
    setSelectedStatue(statue);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedStatue(null);
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
    <div className="table-responsive invisible-scrollbar">
      <Table
        className="text-start custom-table-directory fixed-table-layout font-weight-600"
        striped
        responsive
        bordered
        hover
        ref={tableRef}
      >
        <thead>
          <tr>
            <th style={{ width: "2%" }}></th>
            <th style={{ width: "6%" }}>State</th>
            <th style={{ width: "10%" }}>Name</th>
            <th style={{ width: "6%" }}>Time Span</th>
            <th style={{ width: "10%" }}>Statute Type</th>
            <th style={{ width: "6%" }}>Filing Date Added</th>
            <th style={{ width: "4%" }}>Satisfied</th>
            <th style={{ width: "4%" }}>Removed</th>
            <th style={{ width: "9%" }}>Claim Form Filing Date</th>
            <th style={{ width: "5%" }}>Incident Date</th>
            <th style={{ width: "5%" }}>Case Type</th>
            <th style={{ width: "5%" }}>Case State</th>
            <th style={{ width: "5%" }}>Is Triggered</th>
            <th style={{ width: "10%" }}>Additional Statute</th>
            <th style={{ width: "8%" }}>Disabled SOL</th>
            <th style={{ width: "5%" }}>Expired On</th>
          </tr>
        </thead>
        <tbody>
          {statutes.map((statue, index) => (
            <tr
              key={statue.id}
              onClick={() => handleRowClick(statue)}
              data-bs-toggle="modal"
              data-bs-target="#edit_statue_modal"
              style={{ cursor: "pointer" }}
              ref={index === statutes.length - 1 ? lastRealRowRef : null}
            >
              <td className="width-36">{index + 1}</td>
              <td className="is-search">
                {statue?.for_state ? statue.for_state.StateAbr : ""}
              </td>
              <td className="is-search">{statue?.name || ""}</td>
              <td className="is-search">{statue?.time_span || ""}</td>
              <td className="is-search">{statue?.statute_type || ""}</td>
              <td>{statue?.filing_date_added ? "Yes" : "No"}</td>
              <td>{statue?.satisfied ? "Yes" : "No"}</td>
              <td>{statue?.removed ? "Yes" : "No"}</td>
              <td>
                {statue?.claim_form_filing_date
                  ? `${new Date(statue.claim_form_filing_date).getMonth() + 1}/${new Date(statue.claim_form_filing_date).getDate()}/${new Date(statue.claim_form_filing_date).getFullYear()}`
                  : ""}
              </td>
              <td>{statue?.incident_date_bool ? "Yes" : "No"}</td>
              <td>{statue?.case_type_bool ? "Yes" : "No"}</td>
              <td>{statue?.case_state_bool ? "Yes" : "No"}</td>
              <td>{statue?.is_triggered ? "Yes" : "No"}</td>
              <td className="text-lowercase is-search">
                {statue?.additional_statute_triggered &&
                statue?.additional_statute_triggered?.length > 0
                  ? statue?.additional_statute_triggered
                      .map((sol) => sol?.name || "")
                      .join(", ")
                  : ""}
              </td>
              <td className="text-lowercase is-search">
                {statue?.disabled_sol && statue?.disabled_sol?.length > 0
                  ? statue?.disabled_sol
                      .map((sol) => sol?.name || "")
                      .join(", ")
                  : ""}
              </td>
              <td className="text-lowercase is-search">
                {statue?.expired_on ? statue.expired_on?.name : ""}
              </td>
            </tr>
          ))}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {popupVisible && (
        <StatuePopUp
          statuesPopUp={popupVisible}
          handleClose={handleClosePopup}
          selectedStatue={selectedStatue}
        />
      )}
    </div>
  );
};

export default StatueTable;
