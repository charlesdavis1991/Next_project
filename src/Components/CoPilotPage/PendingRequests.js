import React, { useEffect, useRef, useState } from "react";
import HandleCoPilotRequestPopUp from "../Modals/HandleCoPilotRequestPopUp";
import NotEnablePopUp from "../Modals/NotEnablePopUp";

import { Spinner, Table } from "react-bootstrap";
import TableAddress from "../common/TableAddress";
import api from "../../api/api"
import TableLoader from "../Loaders/tableLoader";

const PendingRequests = ({setRequestCount,fetchCoPilotedFirms}) => {


  const origin = process.env.REACT_APP_BACKEND_URL;
  const [firms, setFirms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [toFirm, setToFirm] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [additionalRowsAccounts, setAdditionalRowsAccounts] = useState(0);
  const [lastRowHeight, setLastRowHeight] = useState(0);
  const lastRealRowRef = useRef(null);
  const tableRef = useRef();


  const fetchtFirmsData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`${origin}/api/copilot-pending-requests/`);
      console.log(response.data)
      if (response.status === 200) {
        setRequestCount(response.data.data.length)
        setFirms(response.data.data);
        setToFirm(response.data.logged_in_firm)
        setLoggedInUser(response.data.logged_in_user)


      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

 

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };


  useEffect(() => {
    fetchtFirmsData();
  }, []);

  // adding empty rows in table

  const [numColumns, setNumColumns] = useState(0);
 
  const notEnableTitle = `${selectedFirm?.from_firm?.attorneyprofile?.office_name} is not available
    to CoPilot your firm.`
  const alreadyLinkedTitle = `${selectedFirm?.from_firm?.attorneyprofile?.office_name} is already linked
    to ${toFirm?.attorneyprofile?.office_name} for Copilot`

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current || !lastRealRowRef.current) return;

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
        setAdditionalRowsAccounts(rows > 0 ? rows : 0);
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
  }, [firms]);

  const renderAdditionalRows = () => {
    return Array.from({ length: additionalRowsAccounts }).map((_, rowIndex) => (
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

  const handleRowClick = (firm) => {
        setSelectedFirm(firm);
        setConfirmPopUp(true);
  
  };

  const handleClosePopup = () => {
    setConfirmPopUp(false);
    setSelectedFirm(null);
  };

  const handleDelete = () => {
    if (selectedFirm) {
      const updatedFirms = firms.filter((firm) => firm.id !== selectedFirm.id);
      setFirms(updatedFirms);
      handleClosePopup();
    }
  };

  const handleSave = (updatedFirm) => {
    if (updatedFirm) {
      const index = firms.findIndex((firm) => firm.id === updatedFirm.id);
      if (index !== -1) {
        const updatedFirms = [...firms];
        updatedFirms[index] = updatedFirm;
        setFirms(updatedFirms);
        handleClosePopup();
      }
    }
  };

 
  return (
    <div>
      { loading ? (<TableLoader/>): (
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
              <th></th>
              <th>Office Name</th>
              <th>Contact Information</th>
              <th>Case Types</th>
              <th>Actions</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Copilot Enabled</th>
              <th>Copilot Linked</th>

            </tr>
          </thead>
          <tbody>
            {
            
            
            firms?.map((firm, index) => (
              <tr
                key={firm?.id}
                onClick={() => handleRowClick(firm)}
                ref={index === firms.length - 1 ? lastRealRowRef : null}
              >
                <td className="width-36">{index + 1}</td>
                <td>
                  {firm?.from_firm?.attorneyprofile?.office_name || ""}
                  <br />
                  {firm?.from_firm?.main_contact[0] && (
                    <TableAddress fullAddress={firm?.from_firm?.main_contact[0]} />
                  )}
                </td>
                <td>
                {firm?.from_firm?.main_contact?.length > 0 && (
                     <>
                {firm?.from_firm?.main_contact[0]?.phone_number ? (
                      <>
                        ({firm?.from_firm?.main_contact[0].phone_number?.slice(0, 3)}){" "}
                        {firm?.from_firm?.main_contact[0].phone_number?.slice(3, 6)}-
                        {firm?.from_firm?.main_contact[0].phone_number?.slice(6)}
                        {firm?.from_firm?.main_contact[0]?.phone_ext && (
                          <span className="text-grey">
                            {" ext "}
                            {firm?.from_firm?.main_contact[0]?.phone_ext}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-grey text-nowrap">
                        (###) ###-#### ext #####
                      </span>
                    )}
                    <br />
                    {firm?.from_firm?.main_contact[0]?.fax ? (
                      <>
                        ({firm?.from_firm?.main_contact[0].fax.slice(0, 3)}) {firm?.from_firm?.main_contact[0].fax.slice(3, 6)}-
                        {firm?.from_firm?.main_contact[0].fax.slice(6)} - <b>fax</b>
                      </>
                    ) : (
                      <span className="text-grey">(###) ###-####</span>
                    )}
                    <br />
                    {firm?.from_firm?.main_contact[0]?.email && firm?.from_firm?.main_contact[0]?.email != "nan" ? (
                      firm?.from_firm?.main_contact[0]?.email
                    ) : (
                      <span className="text-grey">someone@example.com</span>
                    )}
                    <br />
                    {(firm?.from_firm?.main_contact[0]?.website && (
                      <a
                        href={firm?.from_firm?.main_contact[0].website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="text-black"
                      >
                        {firm?.from_firm?.main_contact[0].website}
                      </a>
                    )) || <span className="text-grey">www.site@xyz.com</span>
                    
                    }
                </>
                  )}

                  
                </td>
                <td>
                  {firm?.copilot_case_types?.map(
                    (casetype, idx) => (
                      <span key={casetype.id}>
                        {casetype?.name || ""}
                        {idx !==
                          firm?.copilot_case_types?.length - 1 &&
                          ", "}
                      </span>
                    )
                  )}
                </td>
                <td className="heart-icon">
                  <span className="d-flex justify-content-center align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 50 51"
                      fill=""
                    >
                      <path
                        d="M25 47.1233C24.7471 47.1233 24.4942 47.058 24.2677 46.9271C24.0216 46.7851 18.1748 43.3904 12.2442 38.2754C8.72914 35.2438 5.92329 32.237 3.90474 29.3386C1.29263 25.588 -0.020939 21.9804 0.000252352 18.6158C0.025057 14.7008 1.4273 11.019 3.94897 8.24846C6.51323 5.43128 9.93529 3.87991 13.585 3.87991C18.2624 3.87991 22.5389 6.50003 25.0001 10.6506C27.4613 6.50012 31.7378 3.87991 36.4152 3.87991C39.8633 3.87991 43.153 5.27972 45.6788 7.82151C48.4506 10.6109 50.0255 14.5521 49.9997 18.6344C49.9785 21.9931 48.6403 25.5952 46.0224 29.3406C43.9976 32.2376 41.1957 35.243 37.6944 38.2737C31.7854 43.3882 25.9807 46.7829 25.7364 46.9249C25.5088 47.0571 25.2543 47.1233 25 47.1233ZM13.5849 6.8096C10.7702 6.8096 8.11762 8.02092 6.11557 10.2205C4.0814 12.4554 2.95005 15.4435 2.92993 18.6344C2.8898 24.986 8.99525 31.599 14.1242 36.0281C18.6546 39.9403 23.2497 42.8771 24.9974 43.9482C26.736 42.8754 31.2987 39.9396 35.8102 36.0298C40.9247 31.5972 47.0298 24.978 47.0701 18.6159C47.091 15.3082 45.8264 12.1266 43.6006 9.88664C41.629 7.90246 39.0771 6.80969 36.4152 6.80969C31.9364 6.80969 27.9091 9.95969 26.394 14.6482C26.1986 15.2528 25.6355 15.6625 25.0002 15.6625C24.3646 15.6625 23.8017 15.2527 23.6064 14.6481C22.091 9.95969 18.0638 6.8096 13.5849 6.8096Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </td>
                <td>
                  <div className="overflow-hidden">
                    <span className="fa fa-star checked"></span>
                    <span className="fa fa-star checked"></span>
                    <span className="fa fa-star checked"></span>
                    <span className="fa fa-star"></span>
                    <span className="fa fa-star"></span>
                  </div>
                </td>
                <td>
                  {firm?.pending || ""}{firm?.referred || ""}
                  {firm?.complete || ""}{firm.statuS}

                  
                </td>
                <td>{firm?.from_firm?.do_copilot ? "Yes" : "No"}</td>
                <td>{firm?.copilot_linked ? "Yes" : "No"}</td>
              </tr>
            ))}
            {/* {renderAdditionalRows()} */}
            {/* {[...Array(additionalRows)].map((_, index) => (
              <tr
                key={`additional-${index}`}
                className="fake-row-2"
                style={{ height: `${lastRowHeight}px` }} // Apply the dynamic height
              >
                <td colSpan="8">&nbsp;</td>
              </tr>
            ))} */}
          </tbody>
        </Table>)}

      

        {selectedFirm?.from_firm && !selectedFirm?.from_firm.do_copilot?(
         <NotEnablePopUp
         handleClose={handleClosePopup}
         confirmPopUp = {confirmPopUp}
         title = {notEnableTitle}
       />
        ):(
          selectedFirm?.copilot_linked?(<NotEnablePopUp
            handleClose={handleClosePopup}
            confirmPopUp = {confirmPopUp}
            title = {alreadyLinkedTitle}
          />):(
            <HandleCoPilotRequestPopUp
            handleClose={handleClosePopup}
            confirmPopUp = {confirmPopUp}
            selectedFirm = {selectedFirm?.from_firm}
            fetchtFirmsData = {fetchtFirmsData}
            fetchCoPilotedFirms = {fetchCoPilotedFirms}
            toFirm = {toFirm}
            loggedInUser = {loggedInUser}
            requestId={selectedFirm?.id}
          />
          )
            
        )
      }
      </div>
    )
};

export default PendingRequests;
