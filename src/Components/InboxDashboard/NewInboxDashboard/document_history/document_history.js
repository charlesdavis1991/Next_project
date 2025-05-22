import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DocumentHistoryTableRowNew from "./document_his_table_row_new";
import TableLoader from "../common/tableLoader";

const ROW_HEIGHT = 94;

const DocumentHistory = () => {
  const inboxDocumentHistory = useSelector(
    (state) => state.inbox.inboxDocumentHistory
  );
  const inboxHistoryLoader = useSelector(
    (state) => state.inbox.inboxHistoryLoader
  );

  const tableRef = useRef(null);
  const [rowCountToFill, setRowCountToFill] = useState(0);

  useEffect(() => {
    const calculateRowCount = () => {
      const container = tableRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const availableHeight = window.innerHeight - rect.top - 20; // adjust offset if needed
        const totalRows = Math.floor(availableHeight / ROW_HEIGHT);
        setRowCountToFill(totalRows);
      }
    };

    calculateRowCount();
    window.addEventListener("resize", calculateRowCount);
    return () => window.removeEventListener("resize", calculateRowCount);
  }, []);

  const dataLength = inboxDocumentHistory?.length || 0;
  const blankRowCount = rowCountToFill - dataLength;

  return (
    <div className="row m-0">
      <div className="col-md-12 pl-0 pr-0">
        <table
          // style={{ marginLeft: "27px" }}
          className="table table-borderless table-striped table-earning has-specialty-icon"
        >
          <thead>
            <tr id="bg-m-10" className="line-height">
              {["Case", "Document", "Document Sorted To", "Sorted By"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      background: "var(--primary-10)",
                      textTransform: "uppercase",
                    }}
                    className="pr-3 btn-primary-lighter-default color-primary c-font-weight-600"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody ref={tableRef}>
            {/* If loading and no data, show full loader rows */}
            {inboxHistoryLoader ? (
              [...Array(rowCountToFill)].map((_, i) => (
                <tr
                  key={`loader-${i}`}
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    backgroundColor:
                      i % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)",
                  }}
                >
                  <td colSpan={4}>{i === 0 && <TableLoader />}</td>
                </tr>
              ))
            ) : (
              <>
                {/* Render actual data */}
                {inboxDocumentHistory?.map((doc, index) => (
                  <DocumentHistoryTableRowNew
                    key={index}
                    index={index}
                    doc={doc}
                  />
                ))}

                {/* Fill the rest with blank rows (striped style, no loader) */}
                {blankRowCount > 0 &&
                  [...Array(blankRowCount)].map((_, i) => (
                    <tr
                      key={`blank-${i}`}
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        backgroundColor:
                          (dataLength + i) % 2 === 0
                            ? "var(--primary-2)"
                            : "var(--primary-4)",
                      }}
                    >
                      <td colSpan={4} />
                    </tr>
                  ))}
              </>
            )}
          </tbody>

          {/* <tbody>
            {inboxHistoryLoader ? (
              <tr
                id="client_provider_treatment_date "
                style={{
                  cursor: "default",
                }}
                className={`black-color `}
              >
                <td colSpan={4}>
                  <TableLoader />
                </td>
              </tr>
            ) : inboxDocumentHistory ? (
              inboxDocumentHistory?.map((doc, index) => (
                <DocumentHistoryTableRowNew index={index + 1} doc={doc} />
              ))
            ) : null}
          </tbody> */}
        </table>
      </div>
    </div>
  );
};

export default DocumentHistory;
