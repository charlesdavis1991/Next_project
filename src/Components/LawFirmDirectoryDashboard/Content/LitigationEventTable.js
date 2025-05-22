import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import LitigationEventPopUp from "../../Modals/LitigationEventPopUp";
import { Table } from "react-bootstrap";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";
import { fetchLitigationData } from "../../../Redux/litigation-event/litigationEventSlice";

const LitigationEventTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsPopUp, setEventsPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [numColumns, setNumColumns] = useState(0);
  const dispatch = useDispatch();
  const { litigations, loading } = useSelector(
    (state) => state.litigationEvent
  );
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const selectedState = useSelector((state) => state.selectedState);

  useEffect(() => {
    if (clientId && currentCaseId && tokenBearer) {
      (async () => {
        dispatch(
          fetchLitigationData({
            url: `${origin}/api/add/litigation/event/${clientId}/${currentCaseId}/?state=${selectedState.selectedState}`,
            config: {
              headers: {
                Authorization: tokenBearer,
              },
            },
          })
        );
      })();
    }
  }, [clientId, currentCaseId, tokenBearer, selectedState]);

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
  }, [litigations]);

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

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setEventsPopUp(true);
  };

  const handleClosePopup = () => {
    setEventsPopUp(false);
    setSelectedEvent(null);
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
            <th style={{ width: "14%" }}>Event / Jurisdiction</th>
            <th style={{ width: "24%" }}>Counties</th>
            <th style={{ width: "12%" }}>Event Description</th>
            <th style={{ width: "9%" }}>Case Type</th>
            <th style={{ width: "12%" }}>Dependant Date Type</th>
            <th style={{ width: "9%" }}>Events Triggered</th>
            <th style={{ width: "12%" }}>Calculate Dates</th>
            <th style={{ width: "7%" }}>Service</th>
          </tr>
        </thead>
        <tbody>
          {litigations?.map((event, index) => (
            <tr
              key={event.id}
              onClick={() => handleRowClick(event)}
              data-toggle="modal"
              data-target="#edit_litigationact_modal"
              ref={index === litigations.length - 1 ? lastRealRowRef : null}
            >
              <td className="width-36">{index + 1}</td>
              <td>
                <div className="is-search">{event?.event_name + "," || ""}</div>
                <div className="is-search">
                  {event?.event_type_id?.litigation_event_type + "," || ""}
                </div>
                <div className="is-search">{event?.event_code + "," || ""}</div>
                <div className="is-search">{event?.state_fed + "," || ""}</div>
                <div className="is-search">{event?.state_id?.name || ""}</div>
              </td>
              <td className="is-search">
                {event?.counties?.length > 0 ? (
                  event.counties.map((county, index) => (
                    <span key={index}>
                      {county.name}
                      {index < event.counties.length - 1 && ", "}
                    </span>
                  ))
                ) : (
                  <span className="text-grey">Counties</span>
                )}
              </td>
              <td className="is-search">{event?.event_description || ""}</td>
              <td className="is-search">
                {event?.case_type_id?.length > 0 &&
                  event.case_type_id.map((type, index) => (
                    <span key={type.id}>
                      {type.name}
                      {index < event?.case_type_id?.length - 1 && ", "}
                    </span>
                  ))}
              </td>
              <td className="is-search">
                {event?.dependent_date_type_id?.dependent_date_name || ""}
              </td>
              <td>
                {event?.litigation_event_triggered?.length > 0 &&
                  event?.litigation_event_triggered.map((event) => (
                    <span key={event.id}>{event?.event_name}</span>
                  ))}
              </td>
              <td className="is-search">
                {event?.calculated_dates_id?.length > 0 &&
                  event.calculated_dates_id.map((cal, index) => (
                    <span key={cal.id}>
                      {cal?.calculated_date_name}
                      {index < event.calculated_dates_id.length - 1 && ", "}
                    </span>
                  ))}
              </td>
              
              <td>
                <div className="row">
                  <div className="col-9 text-right pr-2">
                    <nobr>Party: </nobr>
                  </div>
                  <div className="col-3 pl-1">
                    {event?.service_one_party ? "Yes" : "No"}
                  </div>
                </div>
                <div className="row">
                  <div className="col-9 text-right pr-2">
                    <nobr>All Parties: </nobr>
                  </div>
                  <div className="col-3 pl-1">
                    {event?.service_all_parties ? "Yes" : "No"}
                  </div>
                </div>
                <div className="row">
                  <div className="col-9 text-right pr-2">
                    <nobr>All Defendents: </nobr>
                  </div>
                  <div className="col-3 pl-1">
                    {event?.service_all_defendents ? "Yes" : "No"}
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {eventsPopUp && (
        <LitigationEventPopUp
          eventsPopUp={eventsPopUp}
          handleClose={handleClosePopup}
          events={litigations}
          litigationEvent={selectedEvent}
        />
      )}
    </div>
  );
};

export default LitigationEventTable;
