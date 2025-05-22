import React, { useEffect, useState, useRef, useCallback } from "react";
import ReportTablePopUp from "../../Modals/ReportTablePopUp";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import { useDispatch, useSelector } from "react-redux";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchReportingAgencyData } from "../../../Redux/reportingAgencies/reportingAgenciesAdjusterSlice";
import { formatUrl, handleLinkClick } from "../main";

const ReportTable = ({admin=false}) => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const { reportingAgencies, loading } = useSelector(
    (state) => state.reportingAgencies
  );
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const [numColumns, setNumColumns] = useState(0);
  const lastRealRowRef = useRef(null);
  const tableRef = useRef();
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const selectedState = useSelector((state) => state.selectedState);

  useEffect(() => {
    if (reportingAgencies?.length > 0) return;
    else if (
      clientId &&
      currentCaseId &&
      tokenBearer
    ) {
      (async () => {
        dispatch(
          fetchReportingAgencyData({
            url:`${origin}/api/agency/report/${clientId}/${currentCaseId}/?state=${selectedState.selectedState}`,
            config:{
              headers: {
                Authorization: tokenBearer,
              },
            }
          })
        );
      })();
    }
  }, [clientId, currentCaseId, tokenBearer, selectedState]);

  useEffect(() => {
    if (reportingAgencies.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [reportingAgencies]);

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
  }, [reportingAgencies]);

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

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedReport(null);
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
          className="text-start custom-table-directory"
          striped
          responsive
          bordered
          hover
          ref={tableRef}
        >
          <thead>
            <tr>
              <th className="width-36"></th>
              <th className="col-4">Reporting Agency</th>
              <th className="col-4">Contact Information</th>
              <th className="col-3">Cases With Agency</th>
              <th className="col-1">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {reportingAgencies.map((report, index) => (
              <tr
                key={report.id}
                onClick={() => admin ?  handleRowClick(report) : console.log("report history")}
                ref={
                  index === reportingAgencies.length - 1 ? lastRealRowRef : null
                }
              >
                <td>{index + 1}</td>
                <td className="is-search">
                  {report?.reporting_agency || ""}
                  <br />
                  {report?.contact_id && (
                    <TableAddress fullAddress={report?.contact_id} />
                  )}
                </td>
                <td className="text-wrap is-search">
                  {report?.contact_id?.phone_number ? (
                    <>
                      ({report.contact_id.phone_number.slice(0, 3)}){" "}
                      {report.contact_id.phone_number.slice(3, 6)}-
                      {report.contact_id.phone_number.slice(6)}
                      {report?.contact_id?.phone_ext && (
                        <span className="text-grey">
                          {" ext "}
                          {report?.contact_id?.phone_ext}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-grey">(###) ###-#### ext #####</span>
                  )}
                  <br />
                  {report?.contact_id?.fax ? (
                    <>
                      ({report?.contact_id?.fax.slice(0, 3)}){" "}
                      {report?.contact_id?.fax.slice(3, 6)}-
                      {report?.contact_id?.fax.slice(6)} -<b>fax</b>
                    </>
                  ) : (
                    <span className="text-grey">
                      (###) ###-#### - <b>fax</b>
                    </span>
                  )}
                  <br />
                  {report?.contact_id?.email || (
                    <span className="text-grey">someone@example.com</span>
                  )}
                  <br />
                  {(
                    <a
                      href={formatUrl(report?.contact_id?.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-black"
                    >
                      {report?.contact_id?.website}
                    </a>
                  ) || <span className="text-grey">www.site@xyz.com</span>}
                </td>
                <td>
                  <div className="row">
                    <div className="col-4 text-right pr-2">Open:</div>
                    <div className="col-8">1</div>
                  </div>
                  <div className="row">
                    <div className="col-4 text-right pr-2">Closed:</div>
                    <div className="col-8">120</div>
                  </div>
                </td>
                <td>
                  <p className="text-center">
                    {report?.Enabled ? "Yes" : "No"}
                  </p>
                </td>
              </tr>
            ))}

            {!reportingAgencies.length && renderAdditionalRows()}
          </tbody>
        </Table>
      {showPopup && (
        <ReportTablePopUp
          ReportTablePopUp={showPopup}
          handleClose={handleClosePopup}
          report={selectedReport}
        />
      )}
    </div>
  );
};

export default ReportTable;
