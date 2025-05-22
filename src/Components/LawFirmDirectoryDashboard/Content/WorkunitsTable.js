import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchWorkunitData } from "../../../Redux/workunit-table/workunitSlice";
import WorkunitPopUp from "../../Modals/WorkunitPopUp";
// import WorkunitsPopUp from "../../Modals/WorkunitsPopUp";

const WorkunitsTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [workunitPopUp, setWorkunitPopUp] = useState(false);
  const [selectedWorkunit, setSelectedPopUp] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { workunits, loading } = useSelector((state) => state.workunits);
  const [numColumns, setNumColumns] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedWorkunits, setSortedWorkunits] = useState([]);

  useEffect(() => {
    if (workunits?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchWorkunitData({
            url: `${origin}/api/workunits/directory/`,
            config: {
              headers: {
                Authorization: tokenBearer,
              },
            },
          })
        );
      })();
    }
  }, [tokenBearer]);

  useEffect(() => {
    if (!loading && workunits.length === 0) {
      dispatch(setHasNoData(true));
    } else if (!loading && workunits.length > 0) {
      dispatch(setHasNoData(false));
      dispatch(setIsSearchDisabled(false));
    }
  }, [workunits]);

  useEffect(() => {
    if (workunits?.length > 0) {
      const sortedData = [...workunits].sort((a, b) => {
        const nameA = a?.wu_name || "";
        const nameB = b?.wu_name || "";
        const compareResult = nameA.localeCompare(nameB);
        return sortOrder === "asc" ? compareResult : -compareResult;
      });
      setSortedWorkunits(sortedData);
    }
  }, [workunits]);

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...workunits].sort((a, b) => {
      const nameA = a?.wu_name || "";
      const nameB = b?.wu_name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedWorkunits(sortedData);
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
        const existingRows = tableRef.current.rows.length;

        const existingRowsWithData = Array.from(tableRef.current.rows).filter(
          (row) => {
            return Array.from(row.cells).some(
              (cell) => cell.textContent.trim() !== ""
            );
          }
        ).length;
        const existingRowsHeight = existingRowsWithData * lastRowHeight;

        const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10;
        const rows = Math.floor(remainingHeight / lastRowHeight);
        setAdditionalRows(rows > 0 ? rows : 0);
      }
    };
    const extractColumns = () => {
      if (tableRef.current && tableRef.current.rows.length > 0) {
        const columns = tableRef.current.rows[0].cells.length;
        setNumColumns(columns);
      }
    };

    calculateRows();
    extractColumns();

    const handleResize = () => {
      calculateRows();
      extractColumns();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [workunits]);

  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || workunits.length == 0) {
      dispatch(setIsSearchDisabled(true));
      const table = document.querySelector(".custom-table-directory");
      if (!table) return;

      const rowHeight = 74;
      const viewportHeight = window.innerHeight;
      const tableBottom = table.getBoundingClientRect().bottom;
      const remainingHeight = viewportHeight - tableBottom;

      let additionalRows = Math.max(0, Math.floor(remainingHeight / rowHeight));

      const colSpan = table.querySelectorAll("thead tr th").length;
      const tbody = table.querySelector("tbody");

      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());

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

      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());
    }
  }, [hasNoData, loading, workunits]);

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

  const handleRowClick = (category) => {
    setSelectedPopUp(category);
    setWorkunitPopUp(true);
  };

  const handleClosePopUp = () => {
    setWorkunitPopUp(false);
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
            <th style={{ width: "2%" }}></th>
            <th style={{ width: "6%" }} onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Workunit
            </th>
            <th style={{ width: "4%" }}>Table</th>
            <th style={{ width: "4%" }}>Field</th>
            <th style={{ width: "8%" }}>Field Description</th>
            <th style={{ width: "4%" }}>Filled</th>
            <th style={{ width: "3%" }}>Any</th>
            <th style={{ width: "3%" }}>All</th>
            <th style={{ width: "4%" }}>Empty</th>
            <th style={{ width: "4%" }}>Valued</th>
            <th style={{ width: "4%" }}>Is Extra Credited?</th>
            <th style={{ width: "4%" }}>Blocking</th>
            <th style={{ width: "4%" }}>More</th>
            <th style={{ width: "4%" }}>Less</th>
            <th style={{ width: "4%" }}>Max</th>
            <th style={{ width: "4%" }}>Min</th>
            <th style={{ width: "10%" }}>Blocked Status</th>
            <th style={{ width: "12%" }}>Checklists</th>
            <th style={{ width: "12%" }}>Panel Checklists</th>
            <th style={{ width: "4%" }}>Is All Page Checklist?</th>
          </tr>
        </thead>
        <tbody>
          {sortedWorkunits?.map((object, index) => {
            return (
              <tr
                key={object?.id}
                onClick={() => handleRowClick(object)}
                data-toggle="modal"
                data-target="#edit_workunit_modal"
                ref={
                  index === sortedWorkunits.length - 1 ? lastRealRowRef : null
                }
              >
                <td>{index + 1}</td>
                <td className="is-search">{object?.wu_name}</td>
                <td className="is-search">{object?.table}</td>
                <td className="is-search">{object?.field}</td>
                <td>{object?.field_description}</td>
                <td>{object?.filled ? "Yes" : "No"}</td>
                <td>{object?.any ? "Yes" : "No"}</td>
                <td>{object?.all ? "Yes" : "No"}</td>
                <td>{object?.empty ? "Yes" : "No"}</td>
                <td>{object?.valued ? "Yes" : "No"}</td>
                <td>{object?.is_extra_credit ? "Yes" : "No"}</td>
                <td>{object?.blocking ? "Yes" : "No"}</td>
                <td>{object?.more}</td>
                <td>{object?.less}</td>
                <td>{object?.max}</td>
                <td>{object?.min}</td>
                <td className="is-search text-wrap">
                  {object?.blocking_status
                    ?.map((status) => status.name)
                    .join(", ")}
                </td>
                <td className="is-search text-wrap">
                  {object?.checklists
                    ?.map((checklist) => checklist.name)
                    .join(", ")}
                </td>
                <td className="is-search text-wrap">
                  {object?.panel_checklists
                    ?.map((panelChecklist) => panelChecklist.name)
                    .join(", ")}
                </td>
                <td>{object?.is_all_page_checklist ? "Yes" : "No"}</td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {workunitPopUp && (
        <WorkunitPopUp
          editWorkunit={workunitPopUp}
          handleClose={handleClosePopUp}
          workunitData={selectedWorkunit}
        />
      )}
    </div>
  );
};

export default WorkunitsTable;
