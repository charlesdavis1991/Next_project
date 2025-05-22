import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInboxTab,
  setInboxDocPanels,
  setDefaultUserTypes,
  setInboxSearch,
  setInboxTableLoader,
} from "../../Redux/inbox/actions";
import {
  updateInboxDefaultUserTypes,
  fetchInboxPage,
} from "../../Providers/main";
import InboxTabs from "./inboxTabsParent";

const InboxHeader = (props) => {
  const dispatch = useDispatch();
  const inboxTab = useSelector((state) => state.inbox.inboxTab);
  const inboxTabsCount = useSelector((state) => state.inbox.inboxTabsCount);
  const inboxDocPanels = useSelector((state) => state.inbox.inboxDocPanels);
  const inboxAllDocuments = useSelector(
    (state) => state.inbox.inboxAllDocuments
  );
  const defaultUserTypes = useSelector((state) => state.inbox.defaultUserTypes);
  const inboxSearch = useSelector((state) => state.inbox.inboxSearch);

  const handleDefaultUserType = (id) => {
    const updatedUserTypes = defaultUserTypes.map((instance) =>
      instance?.id === id ? { ...instance, status: !instance.status } : instance
    );
    dispatch(setDefaultUserTypes(updatedUserTypes));
    updateInboxDefaultUserTypes(
      id,
      updatedUserTypes?.find((instance) => instance?.id == id)?.status
    );
  };

  const handleTabChange = (tab_name) => {
    props.scrolltoTop();
    props.setItemNumber(1);
    props.setMaxItems(5);
    dispatch(setInboxTab(tab_name));
    dispatch(setInboxDocPanels([]));
  };

  const handleInboxSearchChange = (e) => {
    dispatch(setInboxDocPanels([]));
    dispatch(setInboxSearch(e?.target.value));
    // props.setItemNumber(100000)
    // props.setMaxItems(0)
    // props.setItemNumber(1)
    // props.setMaxItems(5)
    // fetchInboxPage(dispatch, setInboxDocPanels, setInboxTableLoader, inboxTab, e?.target.value, 1, props.setItemNumber, [])
  };

  const [isAbove2000, setIsAbove2000] = useState(window.innerWidth > 2000);

  useEffect(() => {
    const leftSidebarWidth = document
      .querySelector(".menu-sidebar")
      .getBoundingClientRect().width;
    const inboxHeader = document.querySelector(".inbox-header-parent");
    if (inboxHeader) inboxHeader.style.left = `${leftSidebarWidth + 5}px`;
    const historyTableHeader = document.querySelector(".history-table-header");
    if (historyTableHeader) {
      historyTableHeader.style.left = `${leftSidebarWidth + 5}px`;
      historyTableHeader.style.width = `calc( 100% - ${leftSidebarWidth + 5}px)`;
      historyTableHeader.style.minWidth = `calc( 100% - ${leftSidebarWidth + 5}px)`;
    }

    const handleResize = () => {
      setIsAbove2000(window.innerWidth > 2000);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [inboxTab]);

  console.log("Inbox search: ", inboxSearch);
  console.log("First doc panel: ", inboxDocPanels[0]);

  return (
    <>
      {/* <div className="client-BarAlign main-action-bar  d-flex justify-content-between m-b-5 m-t-5 ">
            <div className="d-flex w-100 ">
                <div className="client-search d-flex-1 p-r-5 height-25">
                    <form >
                        <input onChange={handleInboxSearchChange} id="inbox-search-input" value={inboxSearch} type="text" className="form-control" placeholder="Filter search by client name and case type"/>
                    </form>
                </div>
            </div> 
        </div> */}
      <div
        className="client-BarAlign main-action-bar p-b-4 d-flex justify-content-between"
        style={{
          marginTop: "4px",
        }}
      >
        <div
          className="d-flex w-100 align-items-center"
          style={{
            background: "var(--primary-80)",
            paddingTop: "2px",
            paddingBottom: "2px",
          }}
        >
          <p className="fw-600 text-white wp-nowrap p-l-5">
            Document Review To:
          </p>
          <div className="client-search p-l-5 p-r-5 d-flex justify-content-start inbox-labels">
            {defaultUserTypes
              ? defaultUserTypes?.map((instance) => (
                  <div
                    onClick={() => handleDefaultUserType(instance?.id)}
                    className="inbox-checkbox-container f-flex"
                  >
                    <input
                      className="mr-2 checkbox cursor-pointer"
                      onclick="event.stopPropagation();"
                      checked={instance?.status}
                      type="checkbox"
                    />
                    <span className=" text-white fw-600 cursor-pointer">
                      {instance?.name}
                    </span>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>

      <InboxTabs
        inboxTab={inboxTab}
        inboxTabsCount={inboxTabsCount}
        handleTabChange={handleTabChange}
      />

      {inboxTab == "document_history" ? null : (
        <div className="row m-0 m-b-5 flex-wrap-none display-flex-inbox height-25 inbox-header-parent">
          <div className="inbox-document-holder pr-0 box-1 m-0 height-25">
            <p className="inbox-row-header height-25 p-t-1 d-flex align-items-center justify-content-center whitespace-nowrap p-l-5 inbox-menu-bar">
              DOCUMENT IMAGE
            </p>
          </div>
          <div className="box-2 m-0 inbox-doc-menu height-25">
            <div className="inbox-row-header d-flex align-items-center justify-content-between height-25 inbox-menu-bar main-table-header">
              {inboxTab === "insurance" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  >
                    Insurance
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className=" height-25 text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  >
                    Save to Case as Unsorted or
                  </p>
                  <p className="has-form-check"></p>
                </>
              ) : inboxTab === "check" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  >
                    Account
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  >
                    {/* Save to Case as Unsorted or */}
                  </p>
                  <p className="has-form-check"></p>
                </>
              ) : inboxTab === "account" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  >
                    Invoice
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className="text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  ></p>
                  <p className="has-form-check"></p>
                </>
              ) : inboxTab === "ocr_failed" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className={"height-25 text-center text-uppercase"}
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  ></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  >
                    Save to Case as Unsorted or
                  </p>
                  <p className="has-form-check"></p>
                </>
              ) : inboxTab === "unidentified" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  ></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  >
                    Save to Case as Unsorted or
                  </p>
                  <p className="has-form-check"></p>
                </>
              ) : inboxTab === "completed" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  ></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  >
                    Save to Case as Unsorted or
                  </p>
                  <p className="has-form-check"></p>
                </>
              ) : inboxTab === "client" ? (
                <>
                  <p scope="col" className=""></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "248px" }}
                  >
                    Case
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "254px" }}
                  ></p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "681px" }}
                  >
                    Send Document Review Task
                  </p>
                  <p
                    className="height-25 text-center text-uppercase"
                    style={{ minWidth: "340px" }}
                  >
                    Save to Case as Unsorted or
                  </p>
                  <p className="has-form-check"></p>
                </>
              ) : null}
            </div>
            {/* <p className="inbox-row-header height-25 d-flex align-items-center justify-content-center inbox-menu-bar">DOCUMENT IDENTIFICATION AND SORTING</p> */}
          </div>
        </div>
      )}
    </>
  );
};

export default InboxHeader;
