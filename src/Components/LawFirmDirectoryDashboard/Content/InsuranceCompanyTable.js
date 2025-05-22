import React, { useEffect, useState, useRef, useCallback } from "react";
import InsuranceCompanyTablePopUp from "../../Modals/InsuranceCompanyTablePopUp";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import {
  setIsSearchDisabled,
  setHasNoData,
} from "../../../Redux/Directory/directorySlice";
import { fetchInsuranceCompanyData } from "../../../Redux/insuranceCompany/insuranceCompanySlice";
import { handleLinkClick } from "../main";

const InsuranceCompanyTable = ({ fetchCompany, admin=false }) => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { insuranceCompanies, loading } = useSelector(
    (state) => state.insuranceCompanies
  );

  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [numColumns, setNumColumns] = useState(0);
  const dispatch = useDispatch();
  const hasNoData = useSelector((state) => state.directory.hasNoData);
  const selectedState = useSelector((state) => state.selectedState);

  useEffect(() => {
    if (insuranceCompanies?.length > 0) return;
    else if (
      clientId &&
      currentCaseId &&
      tokenBearer
    ) {
      (async () => {
        dispatch(
          fetchInsuranceCompanyData({
            url:`${origin}/api/insurance/company/${clientId}/${currentCaseId}/?state=${selectedState.selectedState}`,
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
    if (insuranceCompanies.length === 0) {
      dispatch(setHasNoData(true)); // Set hasNoData to true if data is empty
    } else {
      dispatch(setHasNoData(false)); // Set hasNoData to false if data exists
      dispatch(setIsSearchDisabled(false));
    }
  }, [insuranceCompanies]);

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
  }, [insuranceCompanies]);

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

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedInsurance(null);
  };

  const handleRowClick = (insurance) => {
    setSelectedInsurance(insurance);
    setShowPopup(true);
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
          <tr className="text-start">
            <th></th>
            <th>Insurance Company</th>
            <th>Type</th>
            <th>Contact Information</th>
            <th>Cases With Insurance Company</th>
          </tr>
        </thead>
        <tbody>
          {insuranceCompanies.map((insurance, index) =>
            insurance &&
            insurance.company_contact &&
            insurance.company_contact ? (
              <tr
                key={insurance.id}
                onClick={() => admin ? handleRowClick(insurance) : console.log("insComp history")}
                data-toggle="modal"
                data-target="#editinsurance_contact_modal"
                ref={
                  index === insuranceCompanies.length - 1
                    ? lastRealRowRef
                    : null
                }
                className={insurance?.insurance_type?.id ? "" : "no-search"}
              >
                <td className="width-36">{index + 1}</td>
                <td className="is-search">
                  {insurance?.company_contact?.name || ""}
                  <br />
                  {insurance?.company_contact && (
                    <TableAddress fullAddress={insurance.company_contact} />
                  )}
                </td>
                <td className="is-search">{insurance?.insurance_type?.name || ""}</td>
                <td
                  className={`text-wrap is-search text-lowercase ${
                    !insurance?.company_contact?.phone_number ? "text-grey" : ""
                  }`}
                >
                  {insurance?.company_contact?.phone_number ? (
                    <>
                      ({insurance?.company_contact?.phone_number.slice(0, 3)}){" "}
                      {insurance?.company_contact?.phone_number.slice(3, 6)}-
                      {insurance?.company_contact?.phone_number.slice(6)}
                      {insurance?.company_contact?.phone_ext && (
                        <span className="text-grey">
                          {" ext "}
                          {insurance?.company_contact?.phone_ext}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-grey">(###) ###-#### ext #####</span>
                  )}
                  <br />
                  {insurance?.company_contact?.fax ? (
                    <>
                      ({insurance?.company_contact?.fax.slice(0, 3)}){" "}
                      {insurance?.company_contact?.fax.slice(3, 6)}-
                      {insurance?.company_contact?.fax.slice(6)} - <b>fax</b>
                    </>
                  ) : (
                    <span className="text-grey">
                      (###) ###-#### - <b>fax</b>
                    </span>
                  )}
                  <br />
                  {insurance?.company_contact?.email || (
                    <span className="text-grey">someone@example.com</span>
                  )}
                  <br />
                  {(
                    <a
                      href={formatUrl(insurance?.company_contact?.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-black"
                    >
                      {insurance?.company_contact?.website}
                    </a>
                  ) || <span className="text-grey">www.site@xyz.com</span>}
                </td>
                <td>
                  <div className="row">
                    <div className="col-6 col-xxl-4 text-right pr-2">Open:</div>
                    <div className="col-6 col-xxl-8">1</div>
                  </div>
                  <div className="row">
                    <div className="col-6 col-xxl-4 text-right pr-2">
                      Closed:
                    </div>
                    <div className="col-6 col-xxl-8">120</div>
                  </div>
                </td>
              </tr>
            ) : null
          )}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {showPopup && (
        <InsuranceCompanyTablePopUp
          insuranceCompanyPopup={showPopup}
          handleClose={handleClosePopup}
          insurance={selectedInsurance}
        />
      )}
    </div>
  );
};

export default InsuranceCompanyTable;
