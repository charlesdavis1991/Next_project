import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchActData } from "../../../Redux/act-table/actsSlice";
import ActPopUp from "../../Modals/ActPopUp";

const ActsTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [actPopUp, setActPopUp] = useState(false);
  const [selectedAct, setSelectedPopUp] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { acts, loading } = useSelector((state) => state.acts);
  const [numColumns, setNumColumns] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedActs, setSortedActs] = useState([]);

  useEffect(() => {
    if (acts?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchActData({
            url: `${origin}/api/acts/directory/`,
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
    if (!loading && acts.length === 0) {
      dispatch(setHasNoData(true));
    } else if (!loading && acts.length > 0) {
      dispatch(setHasNoData(false));
      dispatch(setIsSearchDisabled(false));
    }
  }, [acts]);

  useEffect(() => {
    if (acts?.length > 0) {
      const sortedData = [...acts].sort((a, b) => {
        const nameA = a?.act_name || "";
        const nameB = b?.act_name || "";
        const compareResult = nameA.localeCompare(nameB);
        return sortOrder === "asc" ? compareResult : -compareResult;
      });
      setSortedActs(sortedData);
    }
  }, [acts]);

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...acts].sort((a, b) => {
      const nameA = a?.act_name || "";
      const nameB = b?.act_name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedActs(sortedData);
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
  }, [acts]);

  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || acts.length == 0) {
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
  }, [hasNoData, loading, acts]);

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
    setActPopUp(true);
  };

  const handleClosePopUp = () => {
    setActPopUp(false);
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
            <th style={{ width: "10%" }} onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Act
            </th>
            <th style={{ width: "4%" }}>Group?</th>
            <th style={{ width: "6%" }}>Page</th>
            <th style={{ width: "8%" }}>WorkUnits</th>
            <th style={{ width: "15%" }}>Trigger Status If Missing</th>
            <th style={{ width: "15%" }}>Block Status If Missing</th>
            <th style={{ width: "15%" }}>Trigger Status</th>
            <th style={{ width: "15%" }}>Block Status</th>
            <th style={{ width: "3%" }}>Order</th>
            <th style={{ width: "8%" }}>Trigger Status if not All</th>
          </tr>
        </thead>
        <tbody>
          {sortedActs?.map((object, index) => {
            return (
              <tr
                key={object?.id}
                onClick={() => handleRowClick(object)}
                data-toggle="modal"
                data-target="#edit_act_modal"
                ref={index === sortedActs.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">{object?.act_name}</td>
                <td className="is-search">{object?.group ? "Yes" : "No"}</td>
                <td className="is-search">{object?.page?.name}</td>
                <td className="is-search text-wrap">
                  {object?.work_units
                    ?.map((workunit) => workunit?.wu_name)
                    .join(", ")}
                </td>
                <td className="is-search text-wrap">
                  {object?.trigger_status_if_missing
                    ?.map((status) => status?.name)
                    .join(", ")}
                </td>
                <td className="is-search text-wrap">
                  {object?.block_status_if_missing
                    ?.map((status) => status?.name)
                    .join(", ")}
                </td>
                <td className="is-search text-wrap">
                  {object?.trigger_status
                    ?.map((status) => status?.name)
                    .join(", ")}
                </td>
                <td className="is-search text-wrap">
                  {object?.block_status
                    ?.map((status) => status?.name)
                    .join(", ")}
                </td>
                <td>{object?.order}</td>
                <td>{object?.trigger_status_if_not_all?.name}</td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {actPopUp && (
        <ActPopUp
          editAct={actPopUp}
          handleClose={handleClosePopUp}
          actData={selectedAct}
        />
      )}
    </div>
  );
};

export default ActsTable;
