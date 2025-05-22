import React, { useEffect, useState, useRef, useCallback } from "react";
import JudgeTablePopUp from "../../Modals/JudgeTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import axios from "axios";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import {
  fetchDepartments,
  fetchJudgeData,
} from "../../../Redux/judge-table/judgeSlice";
import { formatUrl, handleLinkClick } from "../main";
import CourtJudgeHistoryPopUp from "../../Modals/DirectoryCasesHistoryModals/CourtJudgeHistoryPopUp";

const JudgeTable = ({admin=false}) => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [courtData, setCourtData] = useState([]);
  const { judges, loading } = useSelector((state) => state.judges);
  const selectedState = useSelector((state) => state.selectedState);
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const [selectedJudge, setSelectedJudge] = useState(null);

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [numColumns, setNumColumns] = useState(0);
  const dispatch = useDispatch();
  const [sortedJudges, setSortedJudges] = useState(judges);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (clientId && currentCaseId && tokenBearer) {
      (async () => {
        dispatch(
          fetchJudgeData({
            url: `${origin}/api/add/judge/directory/${clientId}/${currentCaseId}/?limit=${100}&offset=${0}&state=${selectedState.selectedState}`,
            config: {
              headers: {
                Authorization: tokenBearer,
              },
            },
          })
        );
        dispatch(
          fetchDepartments({
            url: `${origin}/api/get/departments/`,
            config: {
              headers: {
                Authorization: tokenBearer,
              },
            },
          })
        );
        getCourtDataHandler();
      })();
    }
  }, [clientId, currentCaseId, tokenBearer, selectedState]);

  useEffect(() => {
    if (judges.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [judges]);

  useEffect(() => {
    if (judges?.length > 0) {
      const sortedData = [...judges].sort((a, b) => {
        const courtNameA = a.court?.court_name || ""; // Default to empty string if court or court_name is undefined
        const courtNameB = b.court?.court_name || "";
        const compareResult = courtNameA.localeCompare(courtNameB);
        return sortOrder === "asc" ? compareResult : -compareResult;
      });
      setSortedJudges(sortedData);
    }
  }, [judges]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    // Sort the judges array by court_name
    const sortedData = [...judges].sort((a, b) => {
      const courtNameA = a.court?.court_name || ""; // Default to empty string if court or court_name is undefined
      const courtNameB = b.court?.court_name || "";
      const compareResult = courtNameA.localeCompare(courtNameB);
      return newSortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedJudges(sortedData);
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
  }, [judges]);

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

  const getCourtDataHandler = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/court/directory/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      setCourtData(response.data.data);
    } catch (err) {
      console.error(err.message);
    } finally {
    }
  };
  const handleRowClick = (judge) => {
    setSelectedJudge(judge);
  };

  const handleClosePopup = () => {
    setSelectedJudge(null);
  };

  const [showPopup2, setShowPopup2] = useState(false);
  const [judgeId, setJudgeId] = useState(null);
  const [judgeName, setJudgeName] = useState("");

  const handleClosePopup2 = () => {
    setShowPopup2(false);
    setJudgeId(null);
  };

  const openJudgeHistoryPopUp = (Id, name) => {
    setShowPopup2(true);
    setJudgeId(Id);
    setJudgeName(name);
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
            <th className="col-md-3">Judge</th>
            <th className="col-md-3" onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Court Bench
            </th>
            <th className="col-md-3">Contact</th>
            <th className="col-md-3">Judge History</th>
          </tr>
        </thead>
        <tbody>
          {sortedJudges?.map((judge, index) => {
            const contact = judge?.judge_contact || {};
            return (
              <tr
                key={judge.id}
                onClick={() => admin ? handleRowClick(judge) : openJudgeHistoryPopUp(judge?.id, judge?.judge_full_name)}
                data-toggle="modal"
                data-target="#edit_judge_modal"
                ref={index === judges.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-25">{index + 1}</td>
                <td className="is-search">
                  {judge?.judge_full_name && (
                    <div>{judge?.judge_full_name},</div>
                  )}
                  {judge?.dept_info?.department && (
                    <div>Department - {judge?.dept_info?.department},</div>
                  )}
                  {judge?.dept_info?.clerk_first_name && (
                    <div>Clerk - {judge?.dept_info?.clerk_first_name}</div>
                  )}
                </td>
                <td className="is-search">
                  {judge?.court?.court_name ? judge.court.court_name : ""}
                  <br />
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
                  )) || (
                    <span className="text-primary-50">www.site@xyz.com</span>
                  )}
                </td>
                <td className="text-wrap is-search">
                  {contact?.phone_number ? (
                    <>
                      ({contact.phone_number.slice(0, 3)}){" "}
                      {contact.phone_number.slice(3, 6)}-
                      {contact.phone_number.slice(6)}
                      {contact.phone_ext && (
                        <span className="text-primary-50">
                          {" ext "}
                          {contact.phone_ext}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-primary-50">
                      (###) ###-#### ext #####
                    </span>
                  )}
                  <br />
                  {contact?.fax ? (
                    <>
                      ({contact.fax.slice(0, 3)}) {contact.fax.slice(3, 6)}-
                      {contact.fax.slice(6)}
                    </>
                  ) : (
                    <span className="text-primary-50">(###) ###-####</span>
                  )}
                  <br />
                  {contact?.email && contact.email != "nan" ? (
                    contact.email
                  ) : (
                    <span className="text-primary-50">someone@example.com</span>
                  )}
                </td>
                <td
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openJudgeHistoryPopUp(judge?.id, judge?.judge_full_name);
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
      {selectedJudge && (
        <JudgeTablePopUp
          judgePopUp={selectedJudge}
          handleClose={handleClosePopup}
          courtData={courtData}
        />
      )}
      {showPopup2 && judgeId && (
        <CourtJudgeHistoryPopUp
          handleClose={handleClosePopup2}
          historyPopUp={showPopup2}
          judgeId={judgeId}
          name={judgeName}
          tabName="Judge"
        />
      )}
    </div>
  );
};

export default JudgeTable;
