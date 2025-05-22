import React, { useEffect, useRef, useState } from "react";
import SendCopilotRequest from "../../Modals/SendCopilotRequest";
import NotEnablePopUp from "../../Modals/NotEnablePopUp";
import { Table } from "react-bootstrap";
import TableAddress from "../../common/TableAddress";
import api from "../../../api/api";
import { useSelector } from "react-redux";

const CoPilotTable = () => {
  const tokenBearer = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [toFirm, setToFirm] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const selectedState = useSelector((state) => state.selectedState);
  const [confirmPopUp, setConfirmPopUp] = useState(false);
  const [additionalRowsAccounts, setAdditionalRowsAccounts] = useState(0);
  const lastRealRowRef = useRef(null);
  const tableRef = useRef();

  const fetchtFirmsData = async () => {
    try {
      const response = await api.get(
        `${origin}/api/copilot-all-firms/?state=${selectedState?.selectedState}`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );

      if (response.status === 200) {
        setFirms(response.data.data);
        setToFirm(response.data.logged_in_firm);
        setLoggedInUser(response.data.logged_in_user);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    fetchtFirmsData();

    // const dummyData = [
    //   {
    //     id: 1,
    //     attorneyprofile: {
    //       office_name: "Law Office 1",
    //     },
    //     main_contact: [
    //       {
    //         address1: "123 Main St",
    //         address2: "Suite 100",
    //         city: "Cityville",
    //         state: "CA",
    //         zip: "12345",
    //         phone_number: "1234567890",
    //         fax: "0987654321",
    //         email: "contact@lawoffice1.com",
    //       },
    //     ],
    //     copilot_casetypes: {
    //       for_casetype: [
    //         { id: 1, name: "Criminal" },
    //         { id: 2, name: "Family" },
    //       ],
    //     },
    //     pending: 5,
    //     referred: 10,
    //     complete: 20,
    //     do_copilot: true,
    //   },
    //   {
    //     id: 2,
    //     attorneyprofile: {
    //       office_name: "Law Office 2",
    //     },
    //     main_contact: [
    //       {
    //         address1: "456 Elm St",
    //         address2: "Apt 202",
    //         city: "Townsville",
    //         state: "TX",
    //         zip: "67890",
    //         phone_number: "9876543210",
    //         fax: "0123456789",
    //         email: "contact@lawoffice2.com",
    //       },
    //     ],
    //     copilot_casetypes: {
    //       for_casetype: [
    //         { id: 3, name: "Immigration" },
    //         { id: 4, name: "Corporate" },
    //       ],
    //     },
    //     pending: 2,
    //     referred: 4,
    //     complete: 15,
    //     do_copilot: false,
    //   },
    // ];
  }, [tokenBearer, selectedState]);

  // adding empty rows in table

  const [numColumns, setNumColumns] = useState(0);
  //     useEffect(() => {
  //     const calculateRows = () => {
  //       if (!tableRef.current || !lastRealRowRef.current) return;

  //       const pageHeight = window.innerHeight;
  //       const tableTop = tableRef.current.getBoundingClientRect().top;

  //       const lastRowHeight = lastRealRowRef.current.getBoundingClientRect().height || 25;

  //       // Get the height of existing rows
  //       const existingRows = tableRef.current.rows.length;
  //       const existingRowsWithData = Array.from(tableRef.current.rows).filter(row => {
  //         return Array.from(row.cells).some(cell => cell.textContent.trim() !== "");
  //       }).length;
  //       const existingRowsHeight = existingRowsWithData * lastRowHeight;

  //       const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10; // Subtracting a small buffer

  //       const rows = Math.floor(remainingHeight / lastRowHeight);
  //       // Set the number of rows needed to fill the remaining space
  //       setAdditionalRowsAccounts(rows > 0 ? rows : 0);
  //     };
  //     const extractColumns = () => {
  //       if (tableRef.current && tableRef.current.rows.length > 0) {
  //         const columns = tableRef.current.rows[0].cells.length;
  //         setNumColumns(columns);
  //       }
  //     };

  //   // Initial calculations
  //   calculateRows();
  //   extractColumns();

  //   // Resize event listener
  //   const handleResize = () => {
  //     calculateRows();
  //     extractColumns();
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [firms]);

  const notEnableTitle = `${selectedFirm?.attorneyprofile?.office_name} is not available
    to CoPilot your firm.`;
  const alreadyLinkedTitle = `${selectedFirm?.attorneyprofile?.office_name} is already linked
    to ${toFirm?.attorneyprofile?.office_name} for Copilot`;

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
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
            <th style={{ width: "1%" }}></th>
            <th style={{ width: "10%" }}>Office Name</th>
            <th style={{ width: "11%" }}>Contact Information</th>
            <th style={{ width: "42%" }}>Case Types</th>
            <th style={{ width: "4%" }}>Actions</th>
            <th style={{ width: "4%" }}>Rating</th>
            <th style={{ width: "4%" }}>Status</th>
            <th style={{ width: "7%" }}>Copilot Enabled</th>
            <th style={{ width: "6%" }}>Copilot Linked</th>
            <th style={{ width: "5%" }}>Requested</th>
          </tr>
        </thead>
        <tbody>
          {firms?.map((firm, index) => (
            <tr
              key={firm?.id}
              onClick={() => handleRowClick(firm)}
              ref={index === firms.length - 1 ? lastRealRowRef : null}
            >
              <td className="width-36">{index + 1}</td>
              <td className="is-search">
                {firm?.attorneyprofile?.office_name || ""}
                <br />
                {firm?.main_contact[0] && (
                  <TableAddress fullAddress={firm?.main_contact[0]} />
                )}
              </td>
              <td className="is-search">
                {firm?.main_contact[0]?.phone_number ? (
                  <>
                    ({firm?.main_contact[0].phone_number?.slice(0, 3)}){" "}
                    {firm?.main_contact[0].phone_number?.slice(3, 6)}-
                    {firm?.main_contact[0].phone_number?.slice(6)}
                    {firm?.main_contact[0]?.phone_ext && (
                      <span className="text-grey">
                        {" ext "}
                        {firm?.main_contact[0]?.phone_ext}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-grey text-wrap">
                    (###) ###-#### ext #####
                  </span>
                )}
                <br />
                {firm?.main_contact[0]?.fax ? (
                  <>
                    ({firm?.main_contact[0].fax.slice(0, 3)}){" "}
                    {firm?.main_contact[0].fax.slice(3, 6)}-
                    {firm?.main_contact[0].fax.slice(6)} - <b>fax</b>
                  </>
                ) : (
                  <span className="text-grey">(###) ###-####</span>
                )}
                <br />
                {firm?.main_contact[0]?.email &&
                firm?.main_contact[0]?.email != "nan" ? (
                  firm?.main_contact[0]?.email
                ) : (
                  <span className="text-grey">someone@example.com</span>
                )}
                <br />
                {(firm?.main_contact[0]?.website && (
                  <a
                    href={firm?.main_contact[0].website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="text-black"
                  >
                    {firm?.main_contact[0].website}
                  </a>
                )) || <span className="text-grey">www.site@xyz.com</span>}
              </td>
              <td className="is-search">
                {firm?.copilot_case_types?.map((casetype, idx) => (
                  <span key={casetype.id}>
                    {casetype?.name || ""}
                    {idx !== firm?.copilot_case_types?.length - 1 && ", "}
                  </span>
                ))}
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
                {firm?.pending || ""}
                {firm?.referred || ""}
                {firm?.complete || ""}
                {firm.statuS}
              </td>
              <td>{firm?.do_copilot ? "Yes" : "No"}</td>
              <td>{firm?.copilot_linked ? "Yes" : "No"}</td>
              <td>{firm?.requested_at ? firm.requested_at : ""}</td>
            </tr>
          ))}
          {renderAdditionalRows()}
        </tbody>
      </Table>

      {selectedFirm && !selectedFirm.do_copilot ? (
        <NotEnablePopUp
          handleClose={handleClosePopup}
          confirmPopUp={confirmPopUp}
          title={notEnableTitle}
        />
      ) : selectedFirm?.copilot_linked ? (
        <NotEnablePopUp
          handleClose={handleClosePopup}
          confirmPopUp={confirmPopUp}
          title={alreadyLinkedTitle}
        />
      ) : (
        <SendCopilotRequest
          handleClose={handleClosePopup}
          confirmPopUp={confirmPopUp}
          selectedFirm={selectedFirm}
          toFirm={toFirm}
          requestedAt={selectedFirm?.requested_at}
          fetchtFirmsData={fetchtFirmsData}
        />
      )}
    </div>
  );
};

export default CoPilotTable;
