import React, { useState, useEffect } from "react";
import DocumentHistoryTableRow from "./documentHistoryTableRow";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import TableLoader from "../Loaders/tableLoader";

const DocumentHistoryTable = () => {
  const inboxDocumentHistory = useSelector(
    (state) => state.inbox.inboxDocumentHistory
  );
  const inboxHistoryLoader = useSelector(
    (state) => state.inbox.inboxHistoryLoader
  );
  const [isAbove2000, setIsAbove2000] = useState(window.innerWidth > 2000);

  useEffect(() => {
    const handleResize = () => {
      setIsAbove2000(window.innerWidth > 2000);
    };

    if (!inboxDocumentHistory) {
      const parent = document.querySelector(".document-parent-div");
      const height = parent.getBoundingClientRect().height;
      const rows = Math.floor(height / isAbove2000 ? 44 : 140);
      const fakeHtml =
        rows &&
        Array(rows).map((row) => (
          <tr key={row} className="search-row fake-row-2 p-5">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ));
      document.querySelector(".history-table-body").innerHTML =
        fakeHtml.join("");
    }
    setIsAbove2000(window.innerWidth > 2000);
    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isAbove2000]);

  return (
    <>
      <div className="row m-0">
        <div className="col-md-12 pl-0 pr-0">
          <div className="no-border-1 table-responsive table--no-card m-b-40 position-relative has-tint-rows has-tint-h-35">
            <table
              className="table table-earning t-b-0 table-history table-striped"
              id="table-1"
            >
              <thead>
                <tr className="height-25 history-table-header">
                  <th scope="col" className="inbox-width-1-p"></th>
                  <th className="text-center text-uppercase p-l-28 min-w-165">
                    Case
                  </th>
                  <th className="min-w-260 text-center text-uppercase">
                    Document
                  </th>
                  <th className="document-full-width-column text-right whitespace-nowrap"></th>
                  <th id="p-r-80" className="text-uppercase">
                    Document Sorted To
                  </th>
                  <th className="document-full-width-column text-right whitespace-nowrap"></th>
                  <th
                    colspan="2"
                    className="text-center text-uppercase min-w-154"
                  >
                    Sorted By
                  </th>
                </tr>
              </thead>
              <tbody
                className="history-table-body"
                style={{
                  position: "relative",
                  zIndex: "1",
                }}
              >
                {inboxHistoryLoader ? (
                  <TableLoader />
                ) : inboxDocumentHistory ? (
                  inboxDocumentHistory?.map((doc, index) => (
                    <DocumentHistoryTableRow index={index + 1} doc={doc} />
                  ))
                ) : null}

                {/* <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                            <tr className='search-row fake-row-2 p-5'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentHistoryTable;
