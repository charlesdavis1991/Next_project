import React, { useEffect, useState, useRef, useCallback } from "react";
import AttorneyTablePopUp from "../../Modals/AttorneyTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchAttorneyDirectoryData } from "../../../Redux/attorny-table/attornySlice";
import { formatUrl, handleLinkClick } from "../main";
import AttorneyCasesHistoryPopUp from "../../Modals/DirectoryCasesHistoryModals/AttorneyCasesHistoryPopUp";

const AttorneyTable = ({ admin = false }) => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { attorneyDirectories, loading } = useSelector(
    (state) => state.attorneyDirectories
  );

  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [attorneyPopUp, setAttorneyPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const selectedState = useSelector((state) => state.selectedState);

  //

  useEffect(() => {
    if (attorneyDirectories?.length > 0) return;
    else if (clientId && currentCaseId && tokenBearer) {
      (async () => {
        dispatch(
          fetchAttorneyDirectoryData({
            url: `${origin}/api/attorney/law/firm/${clientId}/${currentCaseId}/?state=${selectedState.selectedState}`,
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

  const [numColumns, setNumColumns] = useState(0);

  useEffect(() => {
    if (attorneyDirectories.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [attorneyDirectories]);
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
  }, [attorneyDirectories]);

  // Fake rows when there is no data
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
          height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 94}px`,
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

  const handleRowClick = (attorney) => {
    setSelectedAttorney(attorney);
    setAttorneyPopUp(true);
  };

  const handleClose = () => {
    setAttorneyPopUp(false);
  };

  const [showPopup2, setShowPopup2] = useState(false);
  const [attorneyId, setAttorneyId] = useState(null);
  const [attorneyName, setAttorneyName] = useState("");

  const handleClosePopup2 = () => {
    setShowPopup2(false);
    setAttorneyId(null);
  };

  const openAttorneyHistoryPopUp = (Id, fName, mName, lName) => {
    const name = fName + " " + mName + " " + lName;
    setShowPopup2(true);
    setAttorneyId(Id);
    setAttorneyName(name);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span class="loader"></span>
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
            <th className="">Attorney</th>
            <th className="">License</th>
            <th className="">Law Firm</th>
            <th className="">Contact</th>
            <th className="">Attorney History</th>
          </tr>
        </thead>
        <tbody>
          {attorneyDirectories.map((attorney, index) => {
            // Ensure main_contact is an array with at least one element
            const mainContact = attorney?.main_contact?.[0] || {};

            return (
              <tr
                key={attorney.id}
                onClick={() =>
                  admin
                    ? handleRowClick(attorney)
                    : openAttorneyHistoryPopUp(
                        attorney?.id,
                        mainContact?.first_name,
                        mainContact?.middle_name,
                        mainContact?.last_name
                      )
                }
                data-toggle="modal"
                data-target="#edit_attorney_modal"
                ref={
                  index === attorneyDirectories.length - 1
                    ? lastRealRowRef
                    : null
                }
              >
                <td className="width-25">{index + 1}</td>
                <td className="is-search">
                  {mainContact.first_name +
                    " " +
                    mainContact.middle_name +
                    " " +
                    mainContact.last_name || ""}
                </td>
                <td></td>
                <td className="is-search">
                  {attorney?.firmdirectory?.office_name || ""}
                  <br />
                  {mainContact && <TableAddress fullAddress={mainContact} />}
                  <br />
                  {(mainContact?.website && (
                    <a
                      href={formatUrl(mainContact?.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-black"
                    >
                      {mainContact?.website}
                    </a>
                  )) || (
                    <span className="text-primary-50">www.site@xyz.com</span>
                  )}
                </td>
                <td className="text-wrap is-search">
                  {mainContact.phone_number ? (
                    <>
                      ({mainContact.phone_number.slice(0, 3)}){" "}
                      {mainContact.phone_number.slice(3, 6)}-
                      {mainContact.phone_number.slice(6)}
                      {mainContact.phone_ext && (
                        <span className="text-primary-50">
                          {" ext "}
                          {mainContact.phone_ext}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-primary-50">
                      (###) ###-#### ext #####
                    </span>
                  )}
                  <br />
                  {mainContact.fax ? (
                    <>
                      ({mainContact.fax.slice(0, 3)}){" "}
                      {mainContact.fax.slice(3, 6)}-{mainContact.fax.slice(6)} -
                      <b>fax</b>
                    </>
                  ) : (
                    <span className="text-primary-50">
                      (###) ###-#### - <b>fax</b>
                    </span>
                  )}
                  <br />
                  {mainContact.email || (
                    <span className="text-primary-50">someone@example.com</span>
                  )}
                </td>
                <td
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openAttorneyHistoryPopUp(
                      attorney?.id,
                      mainContact?.first_name,
                      mainContact?.middle_name,
                      mainContact?.last_name
                    );
                  }}
                >
                  <div className="row">
                    <div className="col-6 text-right pr-2">Open:</div>
                    <div className="col-6 text-left">1</div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-right pr-2">Closed:</div>
                    <div className="col-6 text-left">120</div>
                  </div>
                  <div className="row">
                    <div className="col-6 text-right pr-2">Copilots:</div>
                    <div className="col-6 text-left">12</div>
                  </div>
                </td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {selectedAttorney && (
        <AttorneyTablePopUp
          attorneyPopUp={attorneyPopUp}
          handleClose={handleClose}
          attorney={selectedAttorney}
        />
      )}
      {showPopup2 && attorneyId && (
        <AttorneyCasesHistoryPopUp
          handleClose={handleClosePopup2}
          historyPopUp={showPopup2}
          attorneyId={attorneyId}
          name={attorneyName}
          tabName="Attorney"
        />
      )}
    </div>
  );
};

export default AttorneyTable;
