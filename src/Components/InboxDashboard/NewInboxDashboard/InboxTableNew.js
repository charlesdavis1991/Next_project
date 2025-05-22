import React, { useEffect, useRef, useState } from "react";
import {
  useWindowWidth,
  WindowWidthProvider,
} from "./provider/WindowWidthProvider";
import { useSelector } from "react-redux";
import FileNameRow from "./FileNameRow";
import DocumentPreview from "./DocumentPreview";
import CaseRow from "./CaseRow";
import InboxConfirmationNewModal from "../inboxConfirmationNewModal";
import { fetchCaseLoad } from "../../../Providers/main";
import { LinearProgress } from "@mui/material";

const InboxTableNew = ({
  idx,
  maxItems,
  setMaxItems,
  itemNumber,
  setItemNumber,
  inboxTab,
  doc_panel,
}) => {
  const defaultUserTypes = useSelector((state) => state.inbox.defaultUserTypes);
  const [inboxConfirmationContent, setInboxConfirmationContent] = useState({});
  const [inboxConfirmationModalShow, setInboxConfirmationModalShow] =
    useState(false);
  const [taskDocumentPopupData, setTaskDocumentPopupData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showTableLoader, setShowTableLoader] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isStacked = width <= 8120;

  const handleSearchByClientName = (query) => {
    if (query?.length <= 2) {
      return;
    }
    if (query !== "") {
      setShowTableLoader(true);
      setSearchResults([]);
      fetchCaseLoad(doc_panel?.document?.id, query, (results) => {
        setSearchResults(results);
        setShowTableLoader(false);
      });
    } else {
      setSearchResults([]);
      setShowTableLoader(false);
    }
  };

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
    <WindowWidthProvider>
      {inboxConfirmationModalShow && (
        <InboxConfirmationNewModal
          taskDocumentPopupData={taskDocumentPopupData}
          inboxConfirmationContent={inboxConfirmationContent}
          onHide={() => setInboxConfirmationModalShow(false)}
          show={inboxConfirmationModalShow}
        />
      )}
      <div
        key={idx}
        // style={{
        //   background: idx % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)",
        // }}
      >
        {/* FILE NAME ROW */}
        <FileNameRow
          fileName={doc_panel?.document?.file_name}
          documentId={doc_panel?.document?.id}
          docLink={doc_panel?.document?.upload}
          maxItems={maxItems}
          setMaxItems={setMaxItems}
          itemNumber={itemNumber}
          setItemNumber={setItemNumber}
          inboxTab={inboxTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* MAIN ROW: IMAGE + DETAILS */}
        <div className="row m-0 align-items-start">
          {/* Left Column (Document Preview) */}
          <DocumentPreview images={doc_panel?.images} docs={doc_panel} />

          {/* Right Column (Case Rows) */}
          <div
            className="col p-l-0 pr-0"
            style={{
              height: "292px",
              overflow: "scroll",
              scrollbarWidth: "none",
            }}
          >
            {inboxTab === "insurance" ? (
              <>
                {doc_panel?.searched_insurances?.map(
                  (searchedInsurance, index) => (
                    <>
                      <CaseRow
                        maxItems={maxItems}
                        setMaxItems={setMaxItems}
                        setItemNumber={setItemNumber}
                        taskDocumentPopupData={taskDocumentPopupData}
                        setTaskDocumentPopupData={setTaskDocumentPopupData}
                        inboxConfirmationModalShow={inboxConfirmationModalShow}
                        setInboxConfirmationModalShow={
                          setInboxConfirmationModalShow
                        }
                        inboxConfirmationContent={inboxConfirmationContent}
                        setInboxConfirmationContent={
                          setInboxConfirmationContent
                        }
                        inboxTab={inboxTab}
                        document={doc_panel?.document}
                        insurance={searchedInsurance?.insurance}
                        key={index}
                        searchedInsurance={searchedInsurance}
                        index={index}
                        defaultUserTypes={defaultUserTypes}
                        // fetchPagePanels={fetchPagePanels}
                      />
                      {Array.from(
                        { length: 2 - doc_panel?.searched_insurances?.length },
                        (_, i) => {
                          const realCount =
                            doc_panel?.searched_insurances?.length || 0;
                          const index = realCount + i; // total row index
                          const background =
                            index % 2 === 0
                              ? "var(--primary-2)"
                              : "var(--primary-4)";

                          return (
                            <div
                              key={i}
                              className="col-12 pl-0 pr-0"
                              style={{
                                position: "relative",
                                width: "100%",
                                height: isStacked ? "136px" : "136px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: background,
                              }}
                            ></div>
                          );
                        }
                      )}
                    </>
                  )
                )}
              </>
            ) : inboxTab === "account" ? (
              <>
                {doc_panel?.searched_accounts?.map(
                  (searched_accounts, index) => (
                    <>
                      <CaseRow
                        maxItems={maxItems}
                        setMaxItems={setMaxItems}
                        setItemNumber={setItemNumber}
                        taskDocumentPopupData={taskDocumentPopupData}
                        setTaskDocumentPopupData={setTaskDocumentPopupData}
                        inboxConfirmationModalShow={inboxConfirmationModalShow}
                        setInboxConfirmationModalShow={
                          setInboxConfirmationModalShow
                        }
                        inboxConfirmationContent={inboxConfirmationContent}
                        setInboxConfirmationContent={
                          setInboxConfirmationContent
                        }
                        inboxTab={inboxTab}
                        document={doc_panel?.document}
                        account={searched_accounts?.account}
                        key={index}
                        searchedInsurance={searched_accounts}
                        index={index}
                        defaultUserTypes={defaultUserTypes}
                        // fetchPagePanels={fetchPagePanels}
                      />

                      {Array.from(
                        { length: 2 - doc_panel?.searched_accounts?.length },
                        (_, i) => {
                          const realCount =
                            doc_panel?.searched_accounts?.length || 0;
                          const index = realCount + i; // total row index
                          const background =
                            index % 2 === 0
                              ? "var(--primary-2)"
                              : "var(--primary-4)";

                          return (
                            <div
                              key={i}
                              className="col-12 pl-0 pr-0"
                              style={{
                                position: "relative",
                                width: "100%",
                                height: isStacked ? "136px" : "136px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: background,
                              }}
                            ></div>
                          );
                        }
                      )}
                    </>
                  )
                )}
              </>
            ) : inboxTab === "check" ? (
              <>
                {doc_panel?.searched_checks?.map((searched_check, index) => (
                  <CaseRow
                    maxItems={maxItems}
                    setMaxItems={setMaxItems}
                    setItemNumber={setItemNumber}
                    taskDocumentPopupData={taskDocumentPopupData}
                    setTaskDocumentPopupData={setTaskDocumentPopupData}
                    inboxConfirmationModalShow={inboxConfirmationModalShow}
                    setInboxConfirmationModalShow={
                      setInboxConfirmationModalShow
                    }
                    inboxConfirmationContent={inboxConfirmationContent}
                    setInboxConfirmationContent={setInboxConfirmationContent}
                    inboxTab={inboxTab}
                    document={doc_panel?.document}
                    check={searched_check?.check}
                    key={index}
                    searchedInsurance={searched_check}
                    index={index}
                    defaultUserTypes={defaultUserTypes}
                    // fetchPagePanels={fetchPagePanels}
                  />
                ))}

                {Array.from(
                  { length: 2 - doc_panel?.searched_checks?.length },
                  (_, i) => {
                    const realCount = doc_panel?.searched_checks?.length || 0;
                    const index = realCount + i; // total row index
                    const background =
                      index % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)";

                    return (
                      <div
                        key={i}
                        className="col-12 pl-0 pr-0"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: isStacked ? "136px" : "136px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: background,
                        }}
                      ></div>
                    );
                  }
                )}
              </>
            ) : ["ocr_failed", "completed", "unidentified"].includes(
                inboxTab
              ) ? (
              <>
                {searchResults?.map((my_data, index) => (
                  <CaseRow
                    maxItems={maxItems}
                    setMaxItems={setMaxItems}
                    setItemNumber={setItemNumber}
                    taskDocumentPopupData={taskDocumentPopupData}
                    setTaskDocumentPopupData={setTaskDocumentPopupData}
                    inboxConfirmationModalShow={inboxConfirmationModalShow}
                    setInboxConfirmationModalShow={
                      setInboxConfirmationModalShow
                    }
                    inboxConfirmationContent={inboxConfirmationContent}
                    setInboxConfirmationContent={setInboxConfirmationContent}
                    inboxTab={inboxTab}
                    document={doc_panel?.document}
                    key={index}
                    searchedInsurance={{
                      cases: [my_data],
                    }}
                    index={index}
                    defaultUserTypes={defaultUserTypes}
                    // fetchPagePanels={fetchPagePanels}
                    setSearchQuery={setSearchQuery}
                    setSearchResults={setSearchResults}
                  />
                ))}
                {searchResults?.length > 0 &&
                  Array.from({ length: 2 - searchResults?.length }, (_, i) => {
                    const realCount = searchResults?.length || 0;
                    const index = realCount + i; // total row index
                    const background =
                      index % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)";

                    return (
                      <div
                        key={i}
                        className="col-12 pl-0 pr-0"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: isStacked ? "136px" : "136px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: background,
                        }}
                      ></div>
                    );
                  })}
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
                {searchResults.length === 0 &&
                  Array.from({ length: 2 }, (_, index) => (
                    <div
                      key={index}
                      id=""
                      className="col-12 pl-0 pr-0"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: isStacked ? "136px" : "136px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background:
                          index % 2 === 0
                            ? "var(--primary-2)"
                            : "var(--primary-4)", // Optional: to match the background
                      }}
                    ></div>
                  ))}
              </>
            ) : (
              <>
                {doc_panel?.searched_clients?.map((searched_clients, index) => (
                  <>
                    <CaseRow
                      maxItems={maxItems}
                      setMaxItems={setMaxItems}
                      setItemNumber={setItemNumber}
                      taskDocumentPopupData={taskDocumentPopupData}
                      setTaskDocumentPopupData={setTaskDocumentPopupData}
                      inboxConfirmationModalShow={inboxConfirmationModalShow}
                      setInboxConfirmationModalShow={
                        setInboxConfirmationModalShow
                      }
                      inboxConfirmationContent={inboxConfirmationContent}
                      setInboxConfirmationContent={setInboxConfirmationContent}
                      inboxTab={inboxTab}
                      document={doc_panel?.document}
                      key={index}
                      searchedInsurance={searched_clients}
                      index={index}
                      defaultUserTypes={defaultUserTypes}
                    />
                    {Array.from(
                      { length: 2 - doc_panel?.searched_clients?.length },
                      (_, i) => {
                        const realCount =
                          doc_panel?.searched_clients?.length || 0;
                        const index = realCount + i; // total row index
                        const background =
                          index % 2 === 0
                            ? "var(--primary-2)"
                            : "var(--primary-4)";

                        return (
                          <div
                            key={i}
                            className="col-12 pl-0 pr-0"
                            style={{
                              position: "relative",
                              width: "100%",
                              height: isStacked ? "136px" : "136px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              background: background,
                            }}
                          ></div>
                        );
                      }
                    )}
                  </>
                ))}
              </>
            )}

            {/* need to think how to show empty rows */}

            {/* {Array.from({ length: numberOfFillerRows }, (_, index) => (
              <div
                key={`filler-${index}`}
                id="dummy-height-330"
                className="col-12 pl-0 pr-0"
                style={{
                  position: "relative",
                  width: "100%",
                
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    index % 2 === 0 ? "var(--primary-10)" : "var(--primary-4)", // Optional: to match the background
                }}
              ></div>
            ))} */}
          </div>
        </div>
      </div>
    </WindowWidthProvider>
  );
};

export default InboxTableNew;
