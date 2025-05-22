import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInboxTab,
  setInboxDocPanels,
  setDefaultUserTypes,
  setInboxSearch,
  setInboxTableLoader,
} from "../../../Redux/inbox/actions";
import {
  updateInboxDefaultUserTypes,
  fetchInboxPage,
} from "../../../Providers/main";
import InboxTabsParent from "../inboxTabsParent";
// import InboxTabs from "./inboxTabsParent";

const InboxHeaderNew = (props) => {
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
    // props.scrolltoTop();
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
      <div
        className="client-BarAlign main-action-bar p-b-4 d-flex justify-content-between"
        style={
          {
            //   marginTop: "4px",
          }
        }
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

      <InboxTabsParent
        inboxTab={inboxTab}
        inboxTabsCount={inboxTabsCount}
        handleTabChange={handleTabChange}
      />
    </>
  );
};

export default InboxHeaderNew;
