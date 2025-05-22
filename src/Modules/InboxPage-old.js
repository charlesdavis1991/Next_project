import React, { useState, useEffect } from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import {
  fetchInboxPage,
  fetchInboxDocumentHistory,
  fetchInboxTabCount,
} from "../Providers/main";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedPanelId,
  setSelectedPanelName,
  setTabsToShow,
  setUnsortedCase,
  setUnsortedPage,
  setInboxDocPanels,
  setInboxTableLoader,
  setInboxTabsCount,
  setInboxDocumentHistory,
  setInboxProcessingDocuments,
  setInboxFailedOcrDocuments,
  setInboxAllDocuments,
} from "../Redux/inbox/actions";
import InboxDashboard from "../Components/InboxDashboard/main";
import { getClientId, getCaseId } from "../Utils/helper";
import Footer from "../Components/common/footer";

const InboxPage = () => {
  const dispatch = useDispatch();
  const inboxTab = useSelector((state) => state.inbox.inboxTab);
  const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
  const inboxRefreshDocuments = useSelector(
    (state) => state.inbox.inboxRefreshDocuments
  );
  const inboxRefreshDocumentsDueToDelete = useSelector(
    (state) => state.inbox.inboxRefreshDocumentsDueToDelete
  );
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
  const [itemNumber, setItemNumber] = useState(1);
  const [maxItems, setMaxItems] = useState(5);
  const inboxSearch = useSelector((state) => state.inbox.inboxSearch);

  console.log(inboxRefreshDocumentsDueToDelete);

  useEffect(() => {
    dispatch(setTabsToShow({}));
    dispatch(setSelectedPanelId("-1"));
    dispatch(setSelectedPanelName());
    dispatch(setInboxTableLoader(true));
    dispatch(setUnsortedCase(true));
    dispatch(setUnsortedPage(true));
    if (inboxRefreshDocumentsDueToDelete) {
      setItemNumber(1);
    }

    if (inboxTab == "document_history") {
      fetchInboxDocumentHistory(
        dispatch,
        setInboxDocumentHistory,
        setInboxTableLoader
      );
    } else {
      if (inboxSearch?.length > 0) {
        setItemNumber(1);
        setMaxItems(5);
      }
      fetchInboxPage(
        dispatch,
        setInboxDocPanels,
        setInboxTableLoader,
        inboxTab,
        inboxSearch,
        itemNumber,
        setItemNumber,
        []
      );
    }
    fetchInboxTabCount(dispatch, setInboxTabsCount);
  }, [inboxTab, inboxRefreshDocumentsDueToDelete, inboxSearch]);

  useEffect(() => {
    fetchInboxTabCount(dispatch, setInboxTabsCount);
  }, [inboxRefreshDocuments, inboxRefreshDocumentsDueToDelete]);

  useEffect(() => {
    if (itemNumber) {
      console.log(itemNumber);
      fetchInboxPage(
        dispatch,
        setInboxDocPanels,
        setInboxTableLoader,
        inboxTab,
        inboxSearch,
        itemNumber,
        setItemNumber,
        inboxDocPanels
      );
    }
  }, [itemNumber, maxItems]);

  return (
    <>
      <div className="inbox-page">
        <div className="page-wrapper">
          <Sidebar />
          <div className="page-container">
            <NavBar flaggedPageName="Inbox" />
            <InboxDashboard
              maxItems={maxItems}
              setMaxItems={setMaxItems}
              itemNumber={itemNumber}
              setItemNumber={setItemNumber}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default InboxPage;
