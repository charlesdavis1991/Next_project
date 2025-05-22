import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchExpertCategoryData } from "../../../Redux/expertCategories/expertCategoriesSlice";
import ExpertCategoryPopup from "../../Modals/ExpertCategoryPopup";

const ExpertCategoryTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [categoryPopUp, setCategoryPopUp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const { expertCategories, loading } = useSelector(
    (state) => state.expertCategories
  );
  const [numColumns, setNumColumns] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedCategories, setSortedCategories] = useState(expertCategories);

  useEffect(() => {
    if (expertCategories?.length > 0) return;
    else if (tokenBearer) {
      (async () => {
        dispatch(
          fetchExpertCategoryData({
            url: `${origin}/api/expert-category/directory/`,
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
    if (!loading && expertCategories.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else if (!loading && expertCategories.length > 0) {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [expertCategories]);

  useEffect(() => {
    if (expertCategories?.length > 0) {
      const sortedData = [...expertCategories].sort((a, b) => {
        const nameA = a?.name || ""; // Default to an empty string if name is undefined
        const nameB = b?.name || "";
        const compareResult = nameA.localeCompare(nameB);
        return sortOrder === "asc" ? compareResult : -compareResult;
      });
      setSortedCategories(sortedData);
    }
  }, [expertCategories]);

  const handleSort = () => {
    // Toggle the sort order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...expertCategories].sort((a, b) => {
      const nameA = a?.name || "";
      const nameB = b?.name || "";
      const compareResult = nameA.localeCompare(nameB);
      return sortOrder === "asc" ? compareResult : -compareResult;
    });
    setSortedCategories(sortedData);
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
  }, [expertCategories]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData || expertCategories.length == 0) {
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
  }, [hasNoData, loading, expertCategories]);

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
    setSelectedCategory(category);
    setCategoryPopUp(true);
  };

  const handleClosePopUp = () => {
    setCategoryPopUp(false);
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
            <th style={{ width: "55%" }} onClick={handleSort}>
              {sortOrder === "asc" ? "▼" : "▲"} Name
            </th>
            <th style={{ width: "43%" }}>For Firm</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories?.map((category, index) => {
            return (
              <tr
                key={category?.id}
                onClick={() => handleRowClick(category)}
                data-toggle="modal"
                data-target="#edit_expertSpecialties_modal"
                ref={
                  index === sortedCategories.length - 1 ? lastRealRowRef : null
                }
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {category?.name || ""}
                </td>
                <td className="is-search">{category?.for_firm?.attorneyprofile?.office_name}</td>
              </tr>
            );
          })}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {categoryPopUp && (
        <ExpertCategoryPopup
          editCategory={categoryPopUp}
          handleClose={handleClosePopUp}
          categoryData={selectedCategory}
        />
      )}
    </div>
  );
};

export default ExpertCategoryTable;
