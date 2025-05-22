import React, { useEffect, useState, useRef, useCallback } from "react";
import LawFirmTablePopUp from "../../Modals/LawFirmTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import {
  setHasNoData,
  setIsSearchDisabled,
} from "../../../Redux/Directory/directorySlice";
import { fetchLawFirmData } from "../../../Redux/law-firm/lawFirmSlice";
import { handleLinkClick } from "../main";
import AttorneyCasesHistoryPopUp from "../../Modals/DirectoryCasesHistoryModals/AttorneyCasesHistoryPopUp";

const LawFirmTable = ({admin=false}) => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;

  const [selectedFirm, setSelectedFirm] = useState(null);
  const [lawFirmPopUp, setLawFirmPopUp] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const selectedState = useSelector((state) => state.selectedState);
  const [numColumns, setNumColumns] = useState(0);
  const dispatch = useDispatch();
  const { lawFirms, loading } = useSelector((state) => state.lawFirm);
  const hasNoData = useSelector((state) => state.directory.hasNoData);

  useEffect(() => {
    if (tokenBearer) {
      (async () => {
        dispatch(
          fetchLawFirmData({
            url: `${origin}/api/get/law/firm/?state=${selectedState.selectedState}`,
            config: {
              headers: {
                Authorization: tokenBearer,
              },
            },
          })
        );
      })();
    }
  }, [tokenBearer, selectedState]);

  useEffect(() => {
    if (lawFirms.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [lawFirms]);

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
  }, [lawFirms]);

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

  // const getLawFirmHandler = async () => {
  //   try {
  //     const response = await axios.get(`${origin}/api/get/law/firm/`, {
  //       headers: {
  //         Authorization: tokenBearer,
  //       },
  //     });
  //     const responseData = response.data;
  //     setLawFirm(responseData.data);
  //     if(response.data.data.length==0)
  //       {
  //         setHasNoData(true)
  //       }
  //       else{
  //         setHasNoData(false)
  //       }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRowClick = (firm) => {
    setSelectedFirm(firm);
    setLawFirmPopUp(true);
  };

  const handleClosePopup = () => {
    setLawFirmPopUp(false);
    setSelectedFirm(null);
  };

  const [showPopup2, setShowPopup2] = useState(false);
  const [lawFirmId, setLawFirmId] = useState(null);
  const [lawFirmName, setLawFirmName] = useState("");

  const handleClosePopup2 = () => {
    setShowPopup2(false);
    setLawFirmId(null);
  };

  const openLawFirmHistoryPopUp = (Id, name) => {
    setShowPopup2(true);
    setLawFirmId(Id);
    setLawFirmName(name);
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
            <th className="col-3">Law Firm</th>
            <th className="col-2">Office Location</th>
            <th className="col-1"></th>
            <th className="w-auto">Locations</th>
            <th className="col-2">Contact</th>
            <th className="col-2"></th>
            <th className="col-2">Law Firm History</th>
          </tr>
        </thead>
        <tbody>
          {lawFirms?.map((firm, index) => (
            <tr
              key={firm.id}
              onClick={() => admin ? handleRowClick(firm) : openLawFirmHistoryPopUp(firm?.id, firm?.office_name)}
              data-toggle="modal"
              data-target="#edit_lawfirm_modal"
              ref={index === lawFirms.length - 1 ? lastRealRowRef : null}
            >
              <td className="width-25">{index + 1}</td>
              <td className="is-search">{firm?.office_name || ""}</td>
              <td className="is-search">
                {firm?.contact && <TableAddress fullAddress={firm?.contact} />}
                <br />
                {(
                  <a
                    href={firm?.contact?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="text-black"
                  >
                    {firm?.contact?.website}
                  </a>
                ) || <span className="text-primary-50">www.site@xyz.com</span>}
              </td>
              <td></td>
              <td>locations in numeric</td>
              <td
                className={`text-wrap is-search ${
                  !firm?.contact?.phone_number ? "text-primary-50" : ""
                }`}
              >
                {firm?.contact?.phone_number ? (
                  <>
                    ({firm.contact.phone_number.slice(0, 3)}){" "}
                    {firm.contact.phone_number.slice(3, 6)}-
                    {firm.contact.phone_number.slice(6)}
                    {firm?.contact?.phone_ext && (
                      <span className="text-primary-50">
                        {" ext "}
                        {firm?.contact?.phone_ext}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-50">
                    (###) ###-#### ext #####
                  </span>
                )}
                <br />
                {firm?.contact?.fax ? (
                  <>
                    ({firm.contact.fax.slice(0, 3)}){" "}
                    {firm.contact.fax.slice(3, 6)}-{firm.contact.fax.slice(6)} -{" "}
                    <b>fax</b>
                  </>
                ) : (
                  <span className="text-primary-50">
                    (###) ###-#### - <b> fax</b>
                  </span>
                )}
                <br />
                {firm?.contact?.email || (
                  <span className="text-primary-50">someone@example.com</span>
                )}
              </td>
              <td></td>
              <td
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openLawFirmHistoryPopUp(firm?.id, firm?.office_name);
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
          ))}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {lawFirmPopUp && (
        <LawFirmTablePopUp
          lawFirmPopUp={lawFirmPopUp}
          handleClose={handleClosePopup}
          selectedFirm={selectedFirm}
        />
      )}
      {showPopup2 && lawFirmId && (
        <AttorneyCasesHistoryPopUp
          handleClose={handleClosePopup2}
          historyPopUp={showPopup2}
          firmId={lawFirmId}
          name={lawFirmName}
          tabName="Law Firm"
        />
      )}
    </div>
  );
};

export default LawFirmTable;
