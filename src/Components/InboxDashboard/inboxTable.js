import React, { useState, useEffect } from "react";
import DocumentCarousel from "./documentCarousel";
import InboxTableRow from "./inboxTableRow";
import { fetchCaseLoad } from "../../Providers/main";
import { useSelector } from "react-redux";
import InboxDeleteDocument from "./inboxDeleteDocument";
import InboxConfirmationModalBody from "../Modals/inboxConfirmationModalBody";
import LinearProgress from "@mui/material/LinearProgress";
import InboxPanelFileName from "./InboxPanelFileName";
import InboxConfirmationNewModal from "./inboxConfirmationNewModal";

const InboxTable = (props) => {
  console.log(props.doc_panel?.searched_checks);
  const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
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
          if (index != 1) cell.style.width = `${maxColumnWidths[index]}px`;
        });
      });
    });
  };

  const normalizeMainHeader = () => {
    const table = document.querySelector(".inbox-table");
    if (!table) return;
    const maxColumnWidths = [];

    const row = table.querySelector("tbody tr");
    if (!row) return;
    const cells = row.querySelectorAll("td");
    if (!cells) return;
    cells.forEach((cell, index) => {
      const width = cell.getBoundingClientRect().width;
      maxColumnWidths[index] = width;
    });
    const mainHeaders = document.querySelectorAll(".main-table-header p");
    if (!mainHeaders) return;
    mainHeaders.forEach((header, index) => {
      header.style.width = `${maxColumnWidths[index]}px`;
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
        // if (cells[cells.length - 1]) {
        //     cells[cells.length - 1].style.width = "78px";
        // }
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
    if (query?.length <= 2) {
      return;
    }
    if (query !== "") {
      setShowTableLoader(true);
      setShowDefaultRows(true);
      fetchCaseLoad(props.doc_panel?.document?.id, query, (results) => {
        setSearchResults(results);
        setShowTableLoader(false);
        setShowDefaultRows(false);
        fixAccountTabWidths1();
        fixAccountTabWidths2();
      });
    } else {
      setSearchResults([]);
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
    normalizeColumnWidths();
    normalizeMainHeader();
    fixAccountTabWidths1();
    fixAccountTabWidths2();
    enforceColumnWidths();
    adjustCaseDetailsWidths();
    setIsAbove2000(window.innerWidth > 2000);
    window.addEventListener("DOMContentLoaded", handleResize);
    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchResults]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      //   setDebouncedSearchQuery(searchQuery);
      if (searchQuery.length >= 3) {
        handleSearchByClientName(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
      <div className="d-flex p-r-5 align-items-center height-25 m-b-5 m-t-5">
        <InboxPanelFileName
          text={props.doc_panel?.document?.file_name}
          maxWidth={1920}
          suffix=".pdf"
        />

        <div className="client-search flex-grow-1  doc-shade-area">
          <form>
            {/* <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e?.target?.value);
                // handleSearchByClientName(e?.target?.value);
              }}
              type="text"
              className="form-control height-25"
              id={"search-doc-" + props.doc_panel?.document?.id}
              placeholder="Type 3 letters of the client name to search:"
            /> */}
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
        className="row m-0 display-flex-inbox inbox-doc-panel position-relative"
        id="dummy-height-330"
      >
        <div
          className="inbox-document-holder box-1 m-0"
          style={{
            border: "5px solid white",
          }}
          id="colc"
        >
          <DocumentCarousel
            images={props.doc_panel?.images}
            docs={props.doc_panel}
          />
        </div>
        <div
          className={`inbox-doc-content m-t-5 m-b-5 full-width-block pl-0 pr-0 box-2`}
          onclick="openModal(this,{{doc_panel.document.id}})"
          id="cold"
        >
          {/* <div className="d-flex p-r-5 align-items-center height-25 m-b-5">
            <InboxPanelFileName
              text={props.doc_panel?.document?.file_name}
              maxWidth={1920}
              suffix=".pdf"
            />
          
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
          </div> */}
          <div className="table-container inbox-table-container">
            <div className="table-responsive inbox-table-container table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
              {/* <div>
                <div
                  backdrop="true"
                  keyboard={true}
                  data-keyboard="false"
                  data-backdrop="static"
                  className="modal modal-rel fade show"
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
              {inboxConfirmationModalShow && (
                <InboxConfirmationNewModal
                  taskDocumentPopupData={taskDocumentPopupData}
                  inboxConfirmationContent={inboxConfirmationContent}
                  onHide={() => setInboxConfirmationModalShow(false)}
                  show={inboxConfirmationModalShow}
                />
              )}
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

                <tbody id="tableBody" style={{ maxHeight: "100px !important" }}>
                  {showTableLoader ? (
                    <>
                      {isAbove2000 ? (
                        // Show 3 rows with height 100px when isAbove2000 is true
                        <>
                          <tr
                            className="tab-row fake-row-2 w-100"
                            style={{ height: "100px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                          <tr
                            className="tab-row fake-row-2 w-100"
                            style={{ height: "100px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                          <tr
                            className="tab-row fake-row-2 w-100"
                            style={{ height: "100px" }}
                          >
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                          </tr>
                        </>
                      ) : (
                        // Show the original code when isAbove2000 is false
                        <>
                          <tr className="tab-row fake-row-2 w-100">
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            {props.inboxTab === "insurance" ||
                            props.inboxTab === "check" ? (
                              <>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                              </>
                            ) : null}
                          </tr>
                          <tr className="tab-row fake-row-2 w-100">
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            <td className="text-dark-grey text-center"></td>
                            {props.inboxTab === "insurance" ||
                            props.inboxTab === "check" ? (
                              <>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                                <td className="text-dark-grey text-center"></td>
                              </>
                            ) : null}
                            {props.inboxTab === "check" && (
                              <td className="text-dark-grey text-center"></td>
                            )}
                          </tr>
                        </>
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
                            inboxTab={props.inboxTab}
                            document={props.doc_panel?.document}
                            index={index + 1}
                            case={caseload}
                          />
                        ))}
                      {showDefaultRows && props.doc_panel ? (
                        props.inboxTab == "check" ? (
                          <>
                            {props.doc_panel.searched_checks?.map(
                              (searched_check, index) =>
                                searched_check.cases?.length > 0 &&
                                searched_check.cases[0].for_client
                                  ?.first_name ? (
                                  <InboxTableRow
                                    maxItems={props.maxItems}
                                    setMaxItems={props.setMaxItems}
                                    taskDocumentPopupData={
                                      taskDocumentPopupData
                                    }
                                    setTaskDocumentPopupData={
                                      setTaskDocumentPopupData
                                    }
                                    inboxConfirmationModalShow={
                                      inboxConfirmationModalShow
                                    }
                                    setInboxConfirmationModalShow={
                                      setInboxConfirmationModalShow
                                    }
                                    inboxConfirmationContent={
                                      inboxConfirmationContent
                                    }
                                    setInboxConfirmationContent={
                                      setInboxConfirmationContent
                                    }
                                    inboxTab={props.inboxTab}
                                    document={props.doc_panel?.document}
                                    index={index + 1}
                                    check={searched_check?.check}
                                    case={searched_check?.cases[0]}
                                  />
                                ) : null
                            )}
                            {showDefaultRows &&
                            props.doc_panel &&
                            props.doc_panel.searched_checks?.length == 1 &&
                            isAbove2000 ? (
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
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr className="tab-row fake-row-2">
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                </tr>
                              </>
                            )}
                          </>
                        ) : props.inboxTab == "account" ? (
                          <>
                            {props.doc_panel.searched_accounts?.map(
                              (searched_account, index) =>
                                searched_account.cases?.length > 0 &&
                                searched_account.cases[0].for_client
                                  ?.first_name ? (
                                  <InboxTableRow
                                    maxItems={props.maxItems}
                                    setMaxItems={props.setMaxItems}
                                    taskDocumentPopupData={
                                      taskDocumentPopupData
                                    }
                                    setTaskDocumentPopupData={
                                      setTaskDocumentPopupData
                                    }
                                    inboxConfirmationModalShow={
                                      inboxConfirmationModalShow
                                    }
                                    setInboxConfirmationModalShow={
                                      setInboxConfirmationModalShow
                                    }
                                    inboxConfirmationContent={
                                      inboxConfirmationContent
                                    }
                                    setInboxConfirmationContent={
                                      setInboxConfirmationContent
                                    }
                                    inboxTab={props.inboxTab}
                                    document={props.doc_panel?.document}
                                    index={index + 1}
                                    account={searched_account?.account}
                                    case={searched_account?.cases[0]}
                                  />
                                ) : null
                            )}
                            {showDefaultRows &&
                            props.doc_panel &&
                            props.doc_panel.searched_accounts?.length == 1 &&
                            isAbove2000 ? (
                              <>
                                <tr
                                  className="tab-row fake-row-2"
                                  style={{ height: "100px" }}
                                >
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  {/* <td className="text-dark-grey text-center"></td> */}
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
                                  {/* <td className="text-dark-grey text-center"></td> */}
                                  <td className="text-dark-grey text-center"></td>
                                </tr>
                              </>
                            ) : (
                              <>
                                <tr className="tab-row fake-row-2">
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  <td className="text-dark-grey text-center"></td>
                                  {/* <td className="text-dark-grey text-center"></td> */}
                                  <td className="text-dark-grey text-center"></td>
                                </tr>
                              </>
                            )}
                          </>
                        ) : props.inboxTab == "insurance" ? (
                          <>
                            {props.doc_panel.searched_insurances?.map(
                              (searched_insurance, index) =>
                                searched_insurance.cases?.length > 0 &&
                                searched_insurance.cases[0].for_client
                                  ?.first_name ? (
                                  <InboxTableRow
                                    maxItems={props.maxItems}
                                    setMaxItems={props.setMaxItems}
                                    taskDocumentPopupData={
                                      taskDocumentPopupData
                                    }
                                    setTaskDocumentPopupData={
                                      setTaskDocumentPopupData
                                    }
                                    inboxConfirmationModalShow={
                                      inboxConfirmationModalShow
                                    }
                                    setInboxConfirmationModalShow={
                                      setInboxConfirmationModalShow
                                    }
                                    inboxConfirmationContent={
                                      inboxConfirmationContent
                                    }
                                    setInboxConfirmationContent={
                                      setInboxConfirmationContent
                                    }
                                    inboxTab={props.inboxTab}
                                    document={props.doc_panel?.document}
                                    index={index + 1}
                                    insurance={searched_insurance?.insurance}
                                    case={searched_insurance?.cases[0]}
                                  />
                                ) : null
                            )}
                            {showDefaultRows &&
                              props.doc_panel &&
                              props.doc_panel.searched_insurances?.length ==
                                1 &&
                              isAbove2000 && (
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
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                  </tr>
                                </>
                              )}
                            {showDefaultRows &&
                              props.doc_panel &&
                              props.doc_panel.searched_insurances?.length ==
                                1 &&
                              !isAbove2000 && (
                                <>
                                  <tr className="tab-row fake-row-2">
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                    <td className="text-dark-grey text-center"></td>
                                  </tr>
                                </>
                              )}
                          </>
                        ) : (
                          props.doc_panel.searched_clients?.map(
                            (searched_client, index) =>
                              searched_client.cases?.length > 0 &&
                              searched_client.cases[0].for_client
                                ?.first_name ? (
                                <InboxTableRow
                                  maxItems={props.maxItems}
                                  setMaxItems={props.setMaxItems}
                                  taskDocumentPopupData={taskDocumentPopupData}
                                  setTaskDocumentPopupData={
                                    setTaskDocumentPopupData
                                  }
                                  inboxConfirmationModalShow={
                                    inboxConfirmationModalShow
                                  }
                                  setInboxConfirmationModalShow={
                                    setInboxConfirmationModalShow
                                  }
                                  inboxConfirmationContent={
                                    inboxConfirmationContent
                                  }
                                  setInboxConfirmationContent={
                                    setInboxConfirmationContent
                                  }
                                  inboxTab={props.inboxTab}
                                  document={props.doc_panel?.document}
                                  index={index + 1}
                                  case={searched_client?.cases[0]}
                                />
                              ) : null
                          )
                        )
                      ) : null}
                      {showDefaultRows &&
                        props.doc_panel &&
                        props.doc_panel.searched_clients?.length == 0 && (
                          <>
                            <tr className="tab-row fake-row-2">
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                            </tr>
                            <tr className="tab-row fake-row-2">
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                            </tr>
                          </>
                        )}
                      {showDefaultRows &&
                        props.doc_panel &&
                        props.doc_panel.searched_clients?.length == 1 && (
                          <>
                            <tr
                              className="tab-row fake-row-2"
                              style={{
                                height: isAbove2000 ? "100px" : "136px",
                              }}
                            >
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                              <td className="text-dark-grey text-center"></td>
                            </tr>
                          </>
                        )}
                      {/* {
            
                                                    (showDefaultRows && props.doc_panel && props.doc_panel.searched_insurances?.length == 1 && isAbove2000) ?
                                                    <>
                                                    <tr className="tab-row fake-row-2" style={{height:"100px"}}>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                    </tr>
                                                    <tr className="tab-row fake-row-2" style={{height:"100px"}}>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                    </tr>
                                                    </>
                                                    :
                                                    <>
                                                    <tr className="tab-row fake-row-2">
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                        <td className="text-dark-grey text-center"></td>
                                                    </tr>
                                                    </>
                                                } */}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {inboxTabsCount[props.inboxTab] == 1 && (
        <div className="row m-0 mb-2 ">
          <div
            className="full-width-block p-l-0 pr-0"
            onclick="openModal(this,{{doc_panel.document.id}})"
            id="cold"
          >
            <div className="table-responsive table-responsive-2 table--no-card m-b-40 position-relative has-tint-rows has-tint-h-272 has-tint-top-25 ">
              <table
                className="table table-earning t-b-0 position-relative fake-rows-2 table-striped"
                id="table-{{doc_panel.document.id}}-tab1"
              >
                <tbody
                  style={{ maxHeight: "100px !important", overflowY: "scroll" }}
                >
                  {Array(4)
                    .fill(0)
                    .map((element) => (
                      <tr
                        index={element}
                        id="dummy-height-330"
                        className="tab-row table-fake-row position-relative"
                      >
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                        <td className="text-dark-grey text-center"></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InboxTable;
