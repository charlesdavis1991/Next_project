import React from "react";
import { deleteDocument, downloadDocument } from "../../Providers/main";
import { useDispatch, useSelector } from "react-redux";
import {
  setInboxRefreshDocumentsDueToDelete,
  setInboxDocPanels,
} from "../../Redux/inbox/actions";
import axios from "axios";
import fileDownload from "js-file-download";

const InboxDeleteDocument = (props) => {
  const dispatch = useDispatch();
  const inboxRefreshDocumentsDueToDelete = useSelector(
    (state) => state.inbox.inboxRefreshDocumentsDueToDelete
  );
  const inboxTab = useSelector((state) => state.inbox.inboxTab);
  const handleDocumentDeletion = (e) => {
    e.preventDefault();

    axios
      .get(props.doc_link, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "document.pdf");
        return deleteDocument(
          props.document_id,
          dispatch,
          inboxRefreshDocumentsDueToDelete,
          setInboxRefreshDocumentsDueToDelete
        );
      })
      .then(() => {
        props.setItemNumber(1);
        props.setMaxItems(5);
        dispatch(setInboxDocPanels([]));
      })
      .catch((err) => {
        console.error("Error in deletion workflow", err);
      });
  };

  const capitalizeFirstLetter = () => {
    return inboxTab.charAt(0).toUpperCase() + inboxTab.slice(1);
  };

  return (
    <a
      onClick={handleDocumentDeletion}
      style={{
        background: "#6c757d",
        borderColor: "#6c757d",
        color: "white",
        // textTransform: "capitalize",
        fontSize: "14px",
      }}
      id="removeButton"
      href="#"
      className="btn delete-document height-25 d-flex justify-content-center align-items-center m-l-5"
    >
      Delete
    </a>
  );
};

export default InboxDeleteDocument;
