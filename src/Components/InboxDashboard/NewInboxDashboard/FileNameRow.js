import React from "react";
import InboxPanelFileName from "../InboxPanelFileName";
import InboxDeleteDocument from "../inboxDeleteDocument";

const FileNameRow = ({
  fileName,
  documentId,
  docLink,
  maxItems,
  setMaxItems,
  itemNumber,
  setItemNumber,
  inboxTab,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="row align-items-center m-r-5 m-0 m-t-5 m-b-5">
      <InboxPanelFileName text={fileName} maxWidth={1920} suffix=".pdf" />
      <div className="client-search flex-grow-1 doc-shade-area">
        {["ocr_failed", "completed", "unidentified"].includes(inboxTab) && (
          <form>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e?.target?.value);
                // handleSearchByClientName(e?.target?.value);
              }}
              type="text"
              className="form-control height-25"
              id={"search-doc-" + documentId}
              placeholder="Type 3 letters of the client name to search:"
            />
          </form>
        )}
      </div>
      <InboxDeleteDocument
        maxItems={maxItems}
        setMaxItems={setMaxItems}
        itemNumber={itemNumber}
        setItemNumber={setItemNumber}
        document_id={documentId}
        doc_link={docLink}
      />
    </div>
  );
};

export default FileNameRow;
