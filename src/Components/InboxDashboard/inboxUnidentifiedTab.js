import React, { useState, useEffect } from "react";
import DocumentCarousel from "./documentCarousel";
import InboxTableRow from "./inboxTableRow";
import { fetchCaseLoad } from "../../Providers/main";
import { useDispatch, useSelector } from "react-redux";
import InboxDeleteDocument from "./inboxDeleteDocument";
import InboxConfirmationModalBody from "../Modals/inboxConfirmationModalBody";
import { LinearProgress } from "@mui/material";
import InboxPanelFileName from "./InboxPanelFileName";
import InboxConfirmationNewModal from "./inboxConfirmationNewModal";

const InboxUnidentifiedTab = (props) => {
  console.log(props);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDefaultRows, setShowDefaultRows] = useState(true);
  const [showTableLoader, setShowTableLoader] = useState(false);
  const [inboxConfirmationContent, setInboxConfirmationContent] = useState({});
  const [inboxConfirmationModalShow, setInboxConfirmationModalShow] =
    useState(false);
  const [taskDocumentPopupData, setTaskDocumentPopupData] = useState({});

  const [isAbove2000, setIsAbove2000] = useState(window.innerWidth > 2000);

  const normalizeColumnWidths = () => {
    const tables = document.querySelectorAll(".inbox-table"); // Select all tables
    if (!tables.length) return;

    // Step 1: Determine the maximum width for each column across all tables based on row cells
    const maxColumnWidths = [];

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, index) => {
          const width = cell.getBoundingClientRect().width;
          maxColumnWidths[index] = Math.max(maxColumnWidths[index] || 0, width);
        });
      });
    });

    // Step 2: Apply the maximum widths to all cells
    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, index) => {
          if (cells[cells.length - 1]) {
            cells[cells.length - 1].style.width = "100px";
          } else if (index != 1 && cell.innerHTML.trim() != "")
            cell.style.width = `${maxColumnWidths[index]}px`;
        });
      });
    });
  };

  const normalizeMainHeader = () => {
    const tables = document.querySelectorAll(".inbox-table"); // Select all tables
    if (!tables.length) return;

    // Step 1: Determine the maximum width for each column across all tables based on row cells
    const maxColumnWidths = [];

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        cells.forEach((cell, index) => {
          if (cell.innerHTML.trim() != "") {
            const width = cell.getBoundingClientRect().width;
            maxColumnWidths[index] = Math.max(
              maxColumnWidths[index] || 0,
              width
            );
          }
        });
      });
    });
    const mainHeaders = document.querySelectorAll(".main-table-header p");
    if (!mainHeaders) return;
    mainHeaders.forEach((header, index) => {
      if (index != 1) {
        header.style.width = `${maxColumnWidths[index]}px`;
      }
    });
  };

  const enforceColumnWidths = () => {
    const tables = document.querySelectorAll(".inbox-table");
    if (!tables.length) return;

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        // Ensure the first cell has a width of 19.05px
        if (cells[0]) {
          cells[0].style.width = "19.05px";
        }

        // Ensure the last cell has a width of 78px
        if (cells[cells.length - 1]) {
          cells[cells.length - 1].style.width = "100px";
        }
      });
    });
  };

  const fixAccountTabWidths1 = () => {
    const accountDivs = document.querySelectorAll(".users-account-1");
    if (accountDivs.length > 0) {
      let maxWidth = 0;
      accountDivs.forEach((div) => {
        const currentWidth = div.offsetWidth;
        if (currentWidth > maxWidth) {
          maxWidth = currentWidth;
        }
      });
      accountDivs.forEach((div) => {
        div.style.width = `${maxWidth}px`;
      });
    }
  };

  const fixAccountTabWidths2 = () => {
    const accountDivs = document.querySelectorAll(".account-tab-accounts");
    const checkboxWidths = [];
    const textWidths = [];

    // Gather the maximum widths for checkboxes and text
    accountDivs.forEach((div) => {
      const checkboxes = div.querySelectorAll(".checkbox");
      const textElements = div.querySelectorAll(
        ".user-designation, .text-darker"
      );

      checkboxes.forEach((checkbox) => {
        checkboxWidths.push(checkbox.offsetWidth);
      });

      textElements.forEach((text) => {
        textWidths.push(text.offsetWidth);
      });
    });

    // Determine the maximum width for checkboxes and text
    const maxCheckboxWidth = Math.max(...checkboxWidths);
    const maxTextWidth = Math.max(...textWidths);

    // Apply the calculated widths
    accountDivs.forEach((div) => {
      const checkboxes = div.querySelectorAll(".checkbox");
      const textElements = div.querySelectorAll(
        ".user-designation, .text-darker"
      );

      checkboxes.forEach((checkbox) => {
        checkbox.style.width = `${maxCheckboxWidth}px`;
      });

      textElements.forEach((text) => {
        text.style.width = `${maxTextWidth}px`;
      });
    });
  };

  const adjustCaseDetailsWidths = () => {
    const leftColumns = document.querySelectorAll(".box-left");
    const rightColumns = document.querySelectorAll(".box-right");

    let maxLeftWidth = 0;
    let maxRightWidth = 0;

    // Calculate maximum width for left and right columns
    leftColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxLeftWidth = Math.max(maxLeftWidth, width);
    });

    rightColumns.forEach((column) => {
      const width = column.getBoundingClientRect().width;
      maxRightWidth = Math.max(maxRightWidth, width);
    });

    // Apply calculated widths to both left and right columns
    leftColumns.forEach((column) => {
      column.style.width = `${maxLeftWidth}px`;
    });

    rightColumns.forEach((column) => {
      column.style.width = `${maxRightWidth}px`;
    });
  };

  const handleSearchByClientName = (query) => {
    if (query !== "") {
      setShowTableLoader(true);
      setShowDefaultRows(false);
      fetchCaseLoad(
        props.doc_panel?.document?.id,
        query,
        (results) => {
          setSearchResults(results);
          setShowTableLoader(false);
        },
        setShowTableLoader
      );
    } else {
      normalizeMainHeader();
      setShowTableLoader(false);
      setShowDefaultRows(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      normalizeColumnWidths();
      normalizeMainHeader();
      fixAccountTabWidths1();
      fixAccountTabWidths2();
      enforceColumnWidths();
      adjustCaseDetailsWidths();
      setIsAbove2000(window.innerWidth > 2000);
    };

    // Call functions initially
    normalizeColumnWidths(); // Synchronize column widths initially
    normalizeMainHeader();
    fixAccountTabWidths1();
    fixAccountTabWidths2();
    enforceColumnWidths();
    adjustCaseDetailsWidths();
    setIsAbove2000(window.innerWidth > 2000);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchResults]);

  // const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Effect for debouncing search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // setDebouncedSearchQuery(searchQuery);
      if (searchQuery.length >= 3) {
        handleSearchByClientName(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
      <div className="d-flex p-r-5  align-items-center height-25 m-b-5 m-t-5">
        <InboxPanelFileName
          text={props.doc_panel?.document?.file_name}
          maxWidth={300}
          suffix=".pdf"
        />
        {/* <span className="m-l-5 m-r-5" style={{fontWeight:"600"}}>{props.doc_panel?.document?.file_name}</span> */}
        <div className="client-search flex-grow-1  doc-shade-area">
          <form>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e?.target?.value);
                // handleSearchByClientName(e?.target?.value);
              }}
              type="text"
              className="form-control height-25"
              id={"search-doc-" + props.doc_panel?.document?.id}
              placeholder="Type 3 letters of the client name to search:"
            />
          </form>
        </div>
        <InboxDeleteDocument
          maxItems={props.maxItems}
          setMaxItems={props.setMaxItems}
          itemNumber={props.itemNumber}
          setItemNumber={props.setItemNumber}
          document_id={props.doc_panel?.document?.id}
          doc_link={props.doc_panel?.document?.upload}
        />
      </div>
      <div
        className="row m-0 display-flex-inbox inbox-doc-panel"
        id="dummy-height-330"
      >
        <div
          className="inbox-document-holder p-0 box-1 m-0"
          style={{
            border: "5px solid white",
          }}
          id="colc"
        >
          <DocumentCarousel
            images={props.doc_panel?.images}
            docs={props?.doc_panel}
          />
        </div>
        <div
          className="inbox-doc-content p-t-5 p-b-5 full-width-block pl-0 pr-0 box-2 m-0"
          onclick="openModal(this,{{doc_panel.document.id}})"
          id="cold"
        >
          {/* <div className="d-flex p-r-5 align-items-center height-25 m-b-5">
            <InboxPanelFileName
              text={props.doc_panel?.document?.file_name}
              maxWidth={300}
              suffix=".pdf"
            />
            <div className="client-search flex-grow-1  doc-shade-area">
              <form>
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e?.target?.value);
                  }}
                  type="text"
                  className="form-control height-25"
                  id={"search-doc-" + props.doc_panel?.document?.id}
                  placeholder="Type 3 letters of the client name to search:"
                />
              </form>
            </div>
            <InboxDeleteDocument
              maxItems={props.maxItems}
              setMaxItems={props.setMaxItems}
              itemNumber={props.itemNumber}
              setItemNumber={props.setItemNumber}
              document_id={props.doc_panel?.document?.id}
              doc_link={props.doc_panel?.document?.upload}
            />
          </div> */}
          <div
            className="table-container inbox-table-container"
            style={{ overflowY: "scroll" }}
          >
            <div className="table-responsive inbox-table-container table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
              <table
                style={{ overflow: "auto" }}
                className="table-earning t-b-0 position-relative fake-rows-2 table-striped inbox-table"
                id="table-{{doc_panel.document.id}}-tab1"
              >
                {showTableLoader && (
                  <div className="position-absolute progress-bar-indeterminant">
                    <LinearProgress
                      sx={{
                        backgroundColor: "var(--primary-50)", // Background color of the track
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "var(--primary)", // Color of the progress bar
                        },
                      }}
                    />
                  </div>
                )}

                {/* <thead>
                                <tr className="">
                                    <th scope="col" className=""></th>
                                    <th className="text-center text-uppercase">Case</th>
                                    <th className="text-center text-uppercase">Select Document Saving Location</th>
                                    <th className="has-dropdown"></th>
                                    <th className="has-form-check"></th>
                                </tr>
                            </thead>                            */}
                <tbody id="tableBody" style={{ maxHeight: "100px !important" }}>
                  {showTableLoader ? (
                    <>
                      <tr
                        className="tab-row fake-row-2"
                        style={{ height: isAbove2000 ? "100px" : "136px" }}
                      >
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                      </tr>
                      <tr
                        className="tab-row fake-row-2"
                        style={{ height: isAbove2000 ? "100px" : "136px" }}
                      >
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                      </tr>

                      {isAbove2000 && (
                        <tr
                          className="tab-row fake-row-2"
                          style={{ height: "100px" }}
                        >
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <>
                      {!showDefaultRows &&
                        searchResults?.map((caseload, index) => (
                          <InboxTableRow
                            maxItems={props.maxItems}
                            setMaxItems={props.setMaxItems}
                            taskDocumentPopupData={taskDocumentPopupData}
                            setTaskDocumentPopupData={setTaskDocumentPopupData}
                            inboxConfirmationModalShow={
                              inboxConfirmationModalShow
                            }
                            setInboxConfirmationModalShow={
                              setInboxConfirmationModalShow
                            }
                            inboxConfirmationContent={inboxConfirmationContent}
                            setInboxConfirmationContent={
                              setInboxConfirmationContent
                            }
                            index={index + 1}
                            case={caseload}
                            document={props.doc_panel?.document}
                          />
                        ))}
                      {searchResults.length == 2 && isAbove2000 && (
                        <tr
                          className="tab-row fake-row-2"
                          style={{ height: "100px" }}
                        >
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                        </tr>
                      )}
                      {searchResults.length == 1 && isAbove2000 && (
                        <>
                          <tr
                            className="tab-row fake-row-2"
                            style={{ height: "100px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                          <tr
                            className="tab-row fake-row-2"
                            style={{ height: "100px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                        </>
                      )}
                      {searchResults.length == 1 && !isAbove2000 && (
                        <tr
                          className="tab-row fake-row-2"
                          style={{ height: "136px" }}
                        >
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                        </tr>
                      )}
                      {showDefaultRows && (
                        <>
                          <tr
                            className="tab-row fake-row-2"
                            style={{ height: isAbove2000 ? "100px" : "136px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                          <tr
                            className="tab-row fake-row-2"
                            style={{ height: isAbove2000 ? "100px" : "136px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                        </>
                      )}
                      {showDefaultRows && isAbove2000 && (
                        <tr
                          className="tab-row fake-row-2"
                          style={{ height: "100px" }}
                        >
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                          <td className="text-dark-grey text-center"></td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
              {inboxConfirmationModalShow && (
                <InboxConfirmationNewModal
                  taskDocumentPopupData={taskDocumentPopupData}
                  inboxConfirmationContent={inboxConfirmationContent}
                  onHide={() => setInboxConfirmationModalShow(false)}
                  show={inboxConfirmationModalShow}
                />
              )}
              {/* <div>
                <div
                  data-keyboard="false"
                  data-backdrop="static"
                  className="modal modal-rel fade show"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="myModalLabel"
                  id={`confirmationModal${props.doc_panel?.document?.id}`}
                >
                  <div className="modal-dialog modal-dialog-centered inbox-confirmation-modal inbox-modal-height">
                    <div className="modal-content inbox-confirmation-content">
                      <InboxConfirmationModalBody
                        taskDocumentPopupData={taskDocumentPopupData}
                        inboxConfirmationContent={inboxConfirmationContent}
                        onHide={() => setInboxConfirmationModalShow(false)}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InboxUnidentifiedTab;
