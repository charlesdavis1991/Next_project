import React, { useEffect, useState, useRef, useCallback } from "react";
import CourtsTablePopUp from "../../Modals/CourtsTablePopUp";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchCourtData } from "../../../Redux/courts-table/courtsSlice";
import { formatUrl, handleLinkClick } from "../main";
import CourtJudgeHistoryPopUp from "../../Modals/DirectoryCasesHistoryModals/CourtJudgeHistoryPopUp";

const CourtsTable = ({admin=false}) => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { courts, loading } = useSelector((state) => state.courts);
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const selectedState = useSelector((state) => state.selectedState);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtPopUp, setCourtPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [numColumns, setNumColumns] = useState(0);
  const dispatch = useDispatch();
  const [sortedCourts, setSortedCourts] = useState(courts);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (clientId && currentCaseId && tokenBearer) {
      (async () => {
        dispatch(
          fetchCourtData({
            url: `${origin}/api/get/court/directory/?limit=${100}&offset=${0}&state=${selectedState.selectedState}`,
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
    if (!loading && courts.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && courts.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [courts]);

  useEffect(() => {
    if (courts?.length > 0) {
      const sortedData = [...courts].sort((a, b) => {
        const courtNameA = a.court_name || ""; // Default to empty string if court or court_name is undefined
        const courtNameB = b.court_name || "";
        const compareResult = courtNameA.localeCompare(courtNameB);
        return sortOrder === "asc" ? compareResult : -compareResult;
      });
      setSortedCourts(sortedData);
    }
  }, [courts]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    // Sort the courts array by court_name
    const sortedData = [...courts].sort((a, b) => {
      const courtNameA = a.court_name || ""; // Default to empty string if court or court_name is undefined
      const courtNameB = b.court_name || "";
      const compareResult = courtNameA.localeCompare(courtNameB);
      return newSortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCourts(sortedData);
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
  }, [courts]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || courts.length === 0) {
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
  }, [hasNoData, courts, loading]);

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

  const handleRowClick = (court) => {
    setSelectedCourt(court);
    setCourtPopUp(true);
  };

  const handleClosePopUp = () => {
    setCourtPopUp(false);
  };

  const [showPopup2, setShowPopup2] = useState(false);
  const [courtId, setCourtId] = useState(null);
  const [courtName, setCourtName] = useState("");

  const handleClosePopup2 = () => {
    setShowPopup2(false);
    setCourtId(null);
  };

  const openCourtHistoryPopUp = (Id, name) => {
    setShowPopup2(true);
    setCourtId(Id);
    setCourtName(name);
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
            <th className="width-25"></th>
            <th className="col-2" onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Court
            </th>
            <th className="col-1">Courthouse Location</th>
            <th className="col-2">Contact</th>
            <th className="col-3">Jurisdiction</th>
            <th className="col-3">Counties Served</th>
            <th className="col-1">Court History</th>
          </tr>
        </thead>
        <tbody>
          {sortedCourts?.map((court, index) => {
            const contact = court.court_contact;
            return (
              <tr
                key={court.id}
                onClick={() => admin ? handleRowClick(court): openCourtHistoryPopUp(court?.id, court?.court_name)}
                ata-toggle="modal"
                data-target="#edit_court_modal"
                ref={index === courts.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-25">{index + 1}</td>
                <td className="is-search text-wrap">{court?.court_name}</td>
                <td>
                  {contact && <TableAddress fullAddress={contact} />}
                  <br />
                  {(contact?.website && (
                    <a
                      href={formatUrl(contact.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-black"
                    >
                      {contact.website}
                    </a>
                  )) || <span className="text-primary-50">site.xyz.com</span>}
                </td>

                <td className="text-wrap is-search">
                  {contact?.phone_number &&
                  contact?.phone_number != "nan" &&
                  contact?.phone_number != "Self Help" ? (
                    <>
                      ({contact.phone_number?.slice(0, 3)}){" "}
                      {contact.phone_number?.slice(3, 6)}-
                      {contact.phone_number?.slice(6)}
                      {contact?.phone_ext && (
                        <span className="text-primary-50">
                          {" ext "}
                          {contact?.phone_ext}
                        </span>
                      )}
                    </>
                  ) : contact?.phone_number == "Self Help" ? (
                    contact.phone_number
                  ) : (
                    <span className="text-primary-50 text-nowrap">
                      (###) ###-#### ext #####
                    </span>
                  )}
                  <br />
                  {contact?.fax ? (
                    <>
                      ({contact.fax.slice(0, 3)}) {contact.fax.slice(3, 6)}-
                      {contact.fax.slice(6)} - <b>fax</b>
                    </>
                  ) : (
                    <span className="text-primary-50">(###) ###-####</span>
                  )}
                  <br />
                  {contact?.email && contact?.email != "nan" ? (
                    contact?.email
                  ) : (
                    <span className="text-primary-50">someone@example.com</span>
                  )}
                </td>
                <td className="is-search">
                  {court?.jurisdiction?.name ? (
                    <div className="text-wrap">{court.jurisdiction.name}</div>
                  ) : (
                    <div className="text-wrap text-primary-50">
                      Jurisdiction Name
                    </div>
                  )}
                  {court?.jurisdiction?.jurisdiction_type?.name ? (
                    <div className="text-wrap">
                      Type: {court.jurisdiction.jurisdiction_type.name}
                    </div>
                  ) : (
                    <div className="text-wrap text-primary-50">
                      Jurisdiction Type,
                    </div>
                  )}
                  {court?.jurisdiction?.states?.length > 0 &&
                  court?.jurisdiction?.counties?.length > 0 ? (
                    court.jurisdiction.states
                      ?.slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((state) => {
                        const countiesForState = court?.jurisdiction?.counties
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
                      })
                  ) : (
                    <div className="text-wrap text-primary-50">
                      State, County
                    </div>
                  )}
                  {court?.jurisdiction?.circuits?.length > 0 &&
                    court.jurisdiction.circuits.map((circuit, index) => (
                      <span key={`circuit-${index}`}>
                        {circuit.circuit_name}
                        {", "}
                      </span>
                    ))}
                  {court?.jurisdiction?.districts?.length > 0 &&
                    court.jurisdiction.districts.map((district, index) => (
                      <span key={`district-${index}`}>
                        {district.name}
                        {index < court.jurisdiction.districts.length - 1 &&
                          ", "}
                      </span>
                    ))}
                  {court?.jurisdiction?.circuits?.length == 0 &&
                    court?.jurisdiction?.districts?.length == 0 && (
                      <div className="text-nowrap text-primary-50">
                        Circuit, District
                      </div>
                    )}
                  {court?.jurisdiction?.divisions?.length > 0 ? (
                    <div className="text-wrap">
                      {court.jurisdiction.divisions.map((division, index) => (
                        <span key={index}>
                          {division.name}
                          {index < court.jurisdiction.divisions.length - 1 &&
                            ", "}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-nowrap text-primary-50">Division</div>
                  )}
                </td>
                <td className="text-wrap">
                  {court?.counties_served?.length > 0 ? (
                    court.counties_served.map((county, index) => (
                      <span key={index}>
                        {county.name}
                        {index < court.counties_served.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span className="text-primary-50">Counties</span>
                  )}
                </td>
                <td
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openCourtHistoryPopUp(court?.id, court?.court_name);
                  }}
                >
                  <div className="row">
                    <div className="col-6 text-right pr-2">Open:</div>
                    <div className="col-6">1</div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-right pr-2">Closed:</div>
                    <div className="col-6">120</div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-right pr-2">Copilots:</div>
                    <div className="col-6">12</div>
                  </div>
                </td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {selectedCourt && (
        <CourtsTablePopUp
          courtPopUp={courtPopUp}
          handleClose={handleClosePopUp}
          courtData={selectedCourt}
        />
      )}
      {showPopup2 && courtId && (
        <CourtJudgeHistoryPopUp
          handleClose={handleClosePopup2}
          historyPopUp={showPopup2}
          courtId={courtId}
          name={courtName}
          tabName="Court"
        />
      )}
    </div>
  );
};

export default CourtsTable;
