import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchChecklistData } from "../../../Redux/checklists-table/checklistsSlice";
import ChecklistsPopUp from "../../Modals/ChecklistsPopUp";

const ChecklistsTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [checklistPopUp, setChecklistPopUp] = useState(false);
  const [selectedChecklist, setSelectedPopUp] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { checklists, loading } = useSelector((state) => state.checklistsDirectory);
  const [numColumns, setNumColumns] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedChecklists, setSortedChecklists] = useState([]);

  useEffect(() => {
    if (checklists?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchChecklistData({
            url: `${origin}/api/checklists/directory/`,
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
    if (!loading && checklists.length === 0) {
      dispatch(setHasNoData(true));
    } else if (!loading && checklists.length > 0) {
      dispatch(setHasNoData(false));
      dispatch(setIsSearchDisabled(false));
    }
  }, [checklists]);

  useEffect(() => {
    if (checklists?.length > 0) {
      const sortedData = [...checklists].sort((a, b) => {
        const nameA = a?.name || "";
        const nameB = b?.name || "";
        const compareResult = nameA.localeCompare(nameB);
        return sortOrder === "asc" ? compareResult : -compareResult;
      });
      setSortedChecklists(sortedData);
    }
  }, [checklists]);

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...checklists].sort((a, b) => {
      const nameA = a?.name || "";
      const nameB = b?.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedChecklists(sortedData);
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
  }, [checklists]);

  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || checklists.length == 0) {
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
  }, [hasNoData, loading, checklists]);

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
    setChecklistPopUp(true);
  };

  const handleClosePopUp = () => {
    setChecklistPopUp(false);
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
            <th style={{ width: "40%" }} onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Checklist
            </th>
            <th style={{ width: "30%" }}>Page</th>
            <th style={{ width: "8%" }}>Order</th>
            <th style={{ width: "10%" }}>Is Extra Credit?</th>
            <th style={{ width: "10%" }}>Blocking?</th>
          </tr>
        </thead>
        <tbody>
          {sortedChecklists?.map((object, index) => {
            return (
              <tr
                key={object?.id}
                onClick={() => handleRowClick(object)}
                data-toggle="modal"
                data-target="#edit_checklist_modal"
                ref={
                  index === sortedChecklists.length - 1 ? lastRealRowRef : null
                }
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">{object?.name}</td>
                <td className="is-search">{object?.page?.name}</td>
                <td>{object?.order}</td>
                <td>{object?.is_extra_credit ? "Yes" : "No"}</td>
                <td>{object?.blocking ? "Yes" : "No"}</td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {checklistPopUp && (
        <ChecklistsPopUp
          editChecklist={checklistPopUp}
          handleClose={handleClosePopUp}
          checklistData={selectedChecklist}
        />
      )}
    </div>
  );
};

export default ChecklistsTable;