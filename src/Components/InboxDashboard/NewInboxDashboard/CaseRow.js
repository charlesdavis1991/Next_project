import React, { useState, useEffect } from "react";
import { useWindowWidth } from "./provider/WindowWidthProvider";

import {
  attachDocToPage,
  fetchInboxTabCount,
  fetchPagePanels,
  fetchTaskDocumentPopupData,
  updateCheckStatus,
} from "../../../Providers/main";
import CaseDetails from "./CaseDetails";
import InsuranceDetails from "./InsuranceDetails";
import UserTypes from "./UserTypes";
import PageSelector from "./pageSelector";
import SelectedItemDisplay from "./SelectItemDisplay";
import SaveButton from "./SaveBtn";
import { setInboxTabsCount, setTabsToShow } from "../../../Redux/inbox/actions";
import { useDispatch } from "react-redux";
import AccountDetails from "./account/account-details";
import AccountBtns from "./account/account-btn";
import CheckDetails from "./check/check-details";
import CheckBtns from "./check/check-btn";
import CheckSaveButton from "./check/check-save";
import AccountSaveBtn from "./account/account-save-btn";

const CaseRow = ({ searchedInsurance, index, defaultUserTypes, ...props }) => {
  const width = useWindowWidth();
  const isStacked = width <= 8120;
  // const isStacked2 = width <= 2900;
  const caseData = searchedInsurance?.cases[0];
  console.log(searchedInsurance);
  const dispatch = useDispatch();

  // Skip rendering if no case data or client
  if (!caseData?.for_client?.first_name) {
    return null;
  }
  const showInboxConfirmationModal = () => {
    props.setInboxConfirmationModalShow(!props.inboxConfirmationModalShow);

    const modalId = `confirmationModal${props.document?.id}`;
    const modalElement = document.getElementById(modalId);

    if (modalElement) {
      const container = modalElement.parentElement.parentElement; // Update selector to your container

      if (container) {
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      window.$(modalElement).modal({
        backdrop: props.inboxConfirmationModalShow ? "static" : true, // Respect static backdrop
        keyboard: false,
      });
      window
        .$(".modal-backdrop")
        .addClass("modal-rel-backdrop")
        .appendTo(window.$(modalElement).parent());

      window.$("body").removeClass("modal-open");
    } else {
      console.error("Modal element not found.");
    }
  };

  // User types state
  const [rowUserTypes, setRowUserTypes] = useState({
    user_type1: defaultUserTypes?.find(
      (instance) => instance?.name === caseData["user_type1"]
    )?.status,
    user_type2: defaultUserTypes?.find(
      (instance) => instance?.name === caseData["user_type2"]
    )?.status,
    user_type3: defaultUserTypes?.find(
      (instance) => instance?.name === caseData["user_type3"]
    )?.status,
    user_type4: defaultUserTypes?.find(
      (instance) => instance?.name === caseData["user_type4"]
    )?.status,
    user_type5: defaultUserTypes?.find(
      (instance) => instance?.name === caseData["user_type5"]
    )?.status,
    user_type6: defaultUserTypes?.find(
      (instance) => instance?.name === caseData["user_type6"]
    )?.status,
  });

  useEffect(() => {
    const updatedRowUserTypes = {};
    Object.keys(rowUserTypes).forEach((key) => {
      updatedRowUserTypes[key] = defaultUserTypes?.find(
        (instance) => instance?.name === caseData[key]
      )?.status;
    });
    setRowUserTypes(updatedRowUserTypes);
  }, [defaultUserTypes]);

  const handleUserTypeChange = (key) => {
    setRowUserTypes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Page selection state
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPageName, setSelectedPageName] = useState();
  const [selectedPageId, setSelectedPageId] = useState();
  const [nestedDropdowns, setNestedDropdowns] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [panelMenuBar, setPanelMenuBar] = useState(false);
  const [unsortedCase, setUnsortedCase] = useState(true);
  const [unsortedPage, setUnsortedPage] = useState(true);
  const [selectedData, setSelectedData] = useState({
    page_id: caseData?.selected_pages
      ? caseData?.selected_pages[2]?.page?.id
      : "",
    slot: "",
    panel: "-1",
  });

  useEffect(() => {
    const selectedPages = caseData.selected_pages?.filter(
      (item) =>
        item?.page?.is_notes_category === true && item.page_slots.length > 0
    );
    setPages(selectedPages || []);
  }, [caseData]);
  const [dropdownState, setDropdownState] = useState({
    isOpen: false,
    triggerRect: null,
    pageId: null,
  });
  const handlePageSelect = (page, event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownState({
      isOpen: true,
      triggerRect: rect,
      pageId: page.id,
    });

    setTabsToShow({
      page: true,
      panels: true,
      rows: true,
    });
    setSelectedPageId(page?.id);
    setSelectedPageName(page?.name);
    setUnsortedCase(false);
    setSelectedPage(page);
    setNestedDropdowns([]);
    setSelectedSlot(null);
    setSelectedPanel(null);
    fetchPagePanels(caseData?.id, page?.id, page?.name, setNestedDropdowns);
  };

  const handleAttachDocToPage = (type = null) => {
    let panels = "True";
    if (
      !selectedData["panel"] ||
      selectedData["panel"] == "-1" ||
      selectedData["panel"] == ""
    ) {
      panels = "False";
    }
    if (props.inboxTab == "insurance") {
      if (unsortedCase == true) {
        attachDocToPage(
          null,
          caseData?.id,
          panels,
          props.document?.id,
          null,
          null,
          props.insurance?.id,
          null,
          type,
          false,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      } else if (unsortedCase == false && unsortedPage == true) {
        attachDocToPage(
          selectedData["page_id"],
          caseData?.id,
          panels,
          props.document?.id,
          null,
          null,
          props.insurance?.id,
          null,
          type,
          false,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      } else {
        console.log(selectedData);
        attachDocToPage(
          selectedData["page_id"],
          caseData?.id,
          panels,
          props.document?.id,
          selectedData["slot"],
          selectedData["panel"],
          props.insurance?.id,
          null,
          type,
          false,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      }
    } else if (props.inboxTab == "account") {
      if (unsortedCase == true) {
        console.log(props);
        attachDocToPage(
          16,
          caseData?.id,
          panels,
          props.document?.id,
          type === "invoice" ? 65 : type === "verify" ? 66 : null,
          null,
          null,
          props?.account?.id,
          type,
          false,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      } else if (unsortedCase == false && unsortedPage == true) {
        attachDocToPage(
          selectedData["page_id"],
          caseData?.id,
          panels,
          props.document?.id,
          null,
          null,
          null,
          props.account?.id,
          type,
          true,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);

            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      } else {
        attachDocToPage(
          selectedData["page_id"],
          caseData?.id,
          panels,
          props.document?.id,
          selectedData["slot"],
          selectedData["panel"],
          null,
          props.account?.id,
          type,
          false,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      }
    } else {
      if (unsortedCase == true) {
        console.log("Sending Props", props);
        attachDocToPage(
          null,
          caseData?.id,
          panels,
          props.document?.id,
          null,
          null,
          null,
          null,
          type,
          true,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      } else if (unsortedCase == false && unsortedPage == true) {
        console.log(selectedData);
        attachDocToPage(
          selectedData["page_id"],
          caseData?.id,
          panels,
          props.document?.id,
          selectedData["slot"] ?? null,
          null,
          null,
          null,
          type,
          false,
          true,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      } else {
        console.log(selectedData);
        attachDocToPage(
          selectedData["page_id"],
          caseData?.id,
          panels,
          props.document?.id,
          selectedData["slot"],
          selectedData["panel"],
          null,
          null,
          type,
          false,
          false,
          (res) => {
            let user_ids = new Set();
            const trueFirmUsers = Object.keys(rowUserTypes).filter(
              (key) => rowUserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && caseData[`firm_user${user_number}`]) {
                user_ids.add(caseData[`firm_user${user_number}`]?.id);
              }
            }
            let unique_user_ids = Array.from(user_ids);
            fetchTaskDocumentPopupData(
              res?.docData?.for_client?.id,
              res?.docData?.for_case?.id,
              JSON.stringify(unique_user_ids),
              props.document?.id,
              props.setTaskDocumentPopupData
            );
            props.setInboxConfirmationContent(res?.docData);
            showInboxConfirmationModal();
            fetchInboxTabCount(dispatch, setInboxTabsCount);
            props.setMaxItems(props.maxItems + 1);
            props.setItemNumber(1);
            setSelectedPage(null);
            setSelectedPanel(null);
            setSelectedSlot(null);
            props?.setSearchResults([]);
            props?.setSearchQuery("");
          }
        );
      }
    }
  };

  const handleUpdateCheckStatus = (action) => {
    console.log(props.check);
    console.log(props.docment);
    updateCheckStatus(props.check?.id, props.document?.id, action, (res) => {
      let user_ids = new Set();
      const trueFirmUsers = Object.keys(rowUserTypes).filter(
        (key) => rowUserTypes[key] == true
      );
      for (let i = 0; i < trueFirmUsers?.length; i++) {
        let user_number = trueFirmUsers[i].charAt(trueFirmUsers[i].length - 1);
        if (user_number && caseData[`firm_user${user_number}`]) {
          user_ids.add(caseData[`firm_user${user_number}`]?.id);
        }
      }
      let unique_user_ids = Array.from(user_ids);
      fetchTaskDocumentPopupData(
        res?.docData?.for_client?.id,
        res?.docData?.for_case?.id,
        JSON.stringify(unique_user_ids),
        props.document?.id,
        props.setTaskDocumentPopupData
      );
      props.setInboxConfirmationContent(res?.docData);
      showInboxConfirmationModal();
      props.setMaxItems(props.maxItems + 1);
      props.setItemNumber(1);
      fetchInboxTabCount(dispatch, setInboxTabsCount);
    });
  };

  const [checked, setChecked] = React.useState("");

  const handleCheckStatus = (action) => {
    if (action === "verify") {
      handleAttachDocToPage("verify");
    } else if (action === "invoice") {
      handleAttachDocToPage("invoice");
    } else {
      setUnsortedCase(false);
      setUnsortedPage(false);
      setSelectedData({
        page_id: "1",
        slot: "",
        panel: "-1",
      });
      handleAttachDocToPage();
    }
  };

  useEffect(() => {
    if (props.inboxTab === "client") {
      setSelectedPage({
        id: 1,
        name: "Case",
        show_on_sidebar: true,
        page_url: "bp-case",
        page_icon:
          "https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg",
        panels: false,
        is_notes_category: true,
        panel_name: null,
      });
      setSelectedSlot({
        id: 92,
        slot_name: "Case Page",
        slot_number: 0,
        page: { id: 1, name: "Case" },
      });
      setUnsortedCase(false);
      setUnsortedPage(false);
      setSelectedData({
        page_id: 1,
        slot: 92,
        panel: "-1",
      });
    }
  }, [props.inboxTab]);

  return (
    <div
      className="row align-items-center m-0 p-t-5 p-b-5 p-l-5 check-height-inbox-one-row"
      style={{
        background: index % 2 === 0 ? "var(--primary-2)" : "var(--primary-4)",
      }}
    >
      {/* Case Info */}
      <CaseDetails caseData={caseData} isStacked={isStacked} index={index} />

      {/* Insurance Info */}

      <div className="col-2 pl-0 pr-0">
        <UserTypes
          caseData={caseData}
          rowUserTypes={rowUserTypes}
          handleUserTypeChange={handleUserTypeChange}
          isStacked={isStacked}
        />
      </div>

      {props.inboxTab === "insurance" && (
        <InsuranceDetails
          insurance={searchedInsurance?.insurance}
          caseData={caseData}
          isStacked={isStacked}
        />
      )}

      {props.inboxTab === "account" && (
        <AccountDetails
          account={searchedInsurance?.account}
          isStacked={isStacked}
        />
      )}

      {props.inboxTab === "check" && (
        <CheckDetails check={searchedInsurance?.check} isStacked={isStacked} />
      )}

      {!["insurance", "account", "check"].includes(props.inboxTab) && (
        <div className="col-auto flex-grow-1 pl-0 pr-0"></div>
      )}

      {!["account", "check"].includes(props.inboxTab) && (
        <div className="col-3 pl-0 pr-0">
          <PageSelector
            pages={pages}
            selectedPage={selectedPage}
            nestedDropdowns={nestedDropdowns}
            handlePageSelect={handlePageSelect}
            setSelectedPage={setSelectedPage}
            setNestedDropdowns={setNestedDropdowns}
            setSelectedPanel={setSelectedPanel}
            setSelectedSlot={setSelectedSlot}
            setUnsortedCase={setUnsortedCase}
            setUnsortedPage={setUnsortedPage}
            setSelectedData={setSelectedData}
            panelMenuBar={panelMenuBar}
            setPanelMenuBar={setPanelMenuBar}
            dropdownState={dropdownState}
            setDropdownState={setDropdownState}
            inboxTab={props.inboxTab}
          />
        </div>
      )}

      {["account", "check"].includes(props.inboxTab) && (
        <div className="col-3 flex-grow-1 pl-0 pr-0"></div>
      )}

      {props.inboxTab === "account" && (
        <>
          <AccountBtns checked={checked} setChecked={setChecked} />
        </>
      )}

      {props.inboxTab === "check" && (
        <>
          <CheckBtns
            handleUpdateCheckStatus={(action) =>
              handleUpdateCheckStatus(action)
            }
          />
        </>
      )}

      {!["account", "check"].includes(props.inboxTab) && (
        <SelectedItemDisplay
          selectedPage={selectedPage}
          selectedPanel={selectedPanel}
          selectedSlot={selectedSlot}
          inboxTab={props.inboxTab}
        />
      )}

      {["check"].includes(props.inboxTab) && (
        <>
          <CheckSaveButton />
        </>
      )}

      {["account"].includes(props.inboxTab) && (
        <>
          <AccountSaveBtn
            checked={checked}
            handleCheckStatus={(type) => handleCheckStatus(type)}
          />
        </>
      )}

      {/* Save Button */}
      {!["check", "account"].includes(props.inboxTab) && (
        <SaveButton
          selectedPage={selectedPage}
          onClick={(type) => handleAttachDocToPage(type)}
        />
      )}
    </div>
  );
};

export default CaseRow;
