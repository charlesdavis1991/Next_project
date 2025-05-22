import React, { useEffect, useRef, useState } from "react";
import InboxHeaderNew from "./InboxHeaderNew";
import { useDispatch, useSelector } from "react-redux";
import { fetchInboxDefaultUserTypes } from "../../../Providers/main";
import { setDefaultUserTypes } from "../../../Redux/inbox/actions";

import "../nestedDropdown.css";
import InboxTableHeaderNew from "./InboxTableHeaderNew";
import InboxTableNew from "./InboxTableNew";

import InboxProcessingTabNew from "./processingTab/inbox-processing";
import DocumentSkeletonLoader from "./common/skeletonLoader";

import DocumentHistory from "./document_history/document_history";
import InboxPlaceholderRows from "./common/inbox-place-holder-rows";

const InboxDashboard = ({
  maxItems,
  setMaxItems,
  itemNumber,
  setItemNumber,
}) => {
  const dispatch = useDispatch();
  const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
  const inboxTableLoader = useSelector((state) => state.inbox.inboxTableLoader);
  const inboxTab = useSelector((state) => state.inbox.inboxTab);
  const inboxFailedOcrDocuments = useSelector(
    (state) => state.inbox.inboxFailedOcrDocuments
  );
  const inboxProcessingDocuments = useSelector(
    (state) => state.inbox.inboxProcessingDocuments
  );
  const inboxAllDocuments = useSelector(
    (state) => state.inbox.inboxAllDocuments
  );
  const defaultUserTypes = useSelector((state) => state.inbox.defaultUserTypes);

  useEffect(() => {
    fetchInboxDefaultUserTypes(dispatch, setDefaultUserTypes);
  }, []);

  const totalItemsToLoad = inboxTabsCount[inboxTab] || 0;
  const loadedItemsCount = inboxDocPanels?.length || 0;
  const remainingLoadersCount = Math.max(
    0,
    totalItemsToLoad - loadedItemsCount
  );

  const remainingLoaders = Array(remainingLoadersCount).fill(0);

  const containerRef = useRef(null);
  const [placeholderCount, setPlaceholderCount] = useState(0);

  useEffect(() => {
    const calculatePlaceholders = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 20;
        const totalRows = Math.ceil(availableHeight / 330);
        const dataRows = inboxTabsCount[inboxTab] || 0;
        const remaining = Math.max(0, totalRows - dataRows);
        setPlaceholderCount(remaining);
      }
    };

    calculatePlaceholders();
    window.addEventListener("resize", calculatePlaceholders);
    return () => window.removeEventListener("resize", calculatePlaceholders);
  }, [inboxTab, inboxTabsCount]);

  return (
    <div
      className="experts-main-container invisible-scrollbar"
      style={{ overflowY: "auto", maxHeight: "100vh", top: "165px" }}
    >
      <InboxHeaderNew
        maxItems={maxItems}
        setMaxItems={setMaxItems}
        itemNumber={itemNumber}
        setItemNumber={setItemNumber}
      />

      <div className="">
        {inboxTab !== "document_history" && (
          <InboxTableHeaderNew inboxTab={inboxTab} />
        )}

        {inboxTab === "processing" ? (
          <InboxProcessingTabNew />
        ) : inboxTab === "document_history" ? (
          <>
            <DocumentHistory />
          </>
        ) : (
          <div ref={containerRef}>
            {!inboxTableLoader &&
              inboxTabsCount[inboxTab] > 0 &&
              inboxDocPanels?.map((doc_panel, idx) => (
                <InboxTableNew
                  maxItems={maxItems}
                  setMaxItems={setMaxItems}
                  itemNumber={itemNumber}
                  setItemNumber={setItemNumber}
                  doc_panel={doc_panel}
                  idx={idx}
                  inboxTab={inboxTab}
                />
              ))}

            {!inboxTableLoader && inboxTabsCount[inboxTab] === 0 && (
              <InboxPlaceholderRows
                inboxTab={inboxTab}
                inboxTabsCount={inboxTabsCount}
              />
            )}

            {inboxTabsCount[inboxTab] > 0 &&
              remainingLoaders.map((_, idx) => (
                <DocumentSkeletonLoader
                  key={`skeleton-${loadedItemsCount + idx}`}
                  idx={loadedItemsCount + idx}
                />
              ))}

            {!inboxTableLoader &&
              placeholderCount > 0 &&
              inboxTabsCount[inboxTab] > 0 &&
              Array.from({ length: placeholderCount }).map((_, i) => {
                const baseIndex = inboxDocPanels?.length || 0; // data rows count
                const rowIndex = baseIndex + i; // total index including placeholders
                return (
                  <div
                    key={`placeholder-${i}`}
                    className="col-12 pl-0 pr-0"
                    style={{
                      height: "330px",
                      background:
                        rowIndex % 2 === 0
                          ? "var(--primary-2)"
                          : "var(--primary-4)",
                    }}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxDashboard;
