import React, { useEffect, useState } from "react";
import NestedDropdown from "./nestedDropdown";
import TempNestedDropdown from "./tempNestedDropdown";
import {
  attachDocToPage,
  fetchTaskDocumentPopupData,
  updateCheckStatus,
} from "../../Providers/main";
import { useSelector } from "react-redux";
import { Tune } from "@mui/icons-material";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import incidentIcon from "../../assets/images/incident.svg";
import { currencyFormat } from "../../Utils/helper";

const InboxTableRow = (props) => {
  console.log(props.document);
  const [isAbove2000, setIsAbove2000] = useState(window.innerWidth > 2000);

  // const unsortedCase = useSelector((state) => state.inbox.unsortedCase);
  // const unsortedPage = useSelector((state) => state.inbox.unsortedPage);
  const [unsortedCase, setUnsortedCase] = useState(true);
  const [unsortedPage, setUnsortedPage] = useState(true);
  const [selectedData, setSelectedData] = useState({
    page_id: props.case?.selected_pages
      ? props.case?.selected_pages[0]?.id
      : "",
    slot: "",
    panel: "-1",
  });

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

  const handleUpdateCheckStatus = (action) => {
    updateCheckStatus(props.check?.id, props.document?.id, action, (res) => {
      let user_ids = new Set();
      const trueFirmUsers = Object.keys(rowuserTypes).filter(
        (key) => rowuserTypes[key] == true
      );
      for (let i = 0; i < trueFirmUsers?.length; i++) {
        let user_number = trueFirmUsers[i].charAt(trueFirmUsers[i].length - 1);
        if (user_number && props.case[`firm_user${user_number}`]) {
          user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
    });
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
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      } else if (unsortedCase == false && unsortedPage == true) {
        attachDocToPage(
          selectedData["page_id"],
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      } else {
        attachDocToPage(
          selectedData["page_id"],
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      }
    } else if (props.inboxTab == "account") {
      if (unsortedCase == true) {
        attachDocToPage(
          null,
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      } else if (unsortedCase == false && unsortedPage == true) {
        attachDocToPage(
          selectedData["page_id"],
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      } else {
        attachDocToPage(
          selectedData["page_id"],
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      }
    } else {
      if (unsortedCase == true) {
        console.log("Sending Props", props);
        attachDocToPage(
          null,
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      } else if (unsortedCase == false && unsortedPage == true) {
        console.log(selectedData);
        attachDocToPage(
          selectedData["page_id"],
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      } else {
        console.log(selectedData);
        attachDocToPage(
          selectedData["page_id"],
          props.case?.id,
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
            const trueFirmUsers = Object.keys(rowuserTypes).filter(
              (key) => rowuserTypes[key] == true
            );
            for (let i = 0; i < trueFirmUsers?.length; i++) {
              let user_number = trueFirmUsers[i].charAt(
                trueFirmUsers[i].length - 1
              );
              if (user_number && props.case[`firm_user${user_number}`]) {
                user_ids.add(props.case[`firm_user${user_number}`]?.id);
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
          }
        );
      }
    }
    props.setMaxItems(props.maxItems + 1);
  };

  function formatDate(isoString) {
    console.log(isoString);
    const date = new Date(isoString);

    const month = String(date.getMonth() + 1); // getMonth() is zero-based
    const day = String(date.getDate());
    const year = date.getFullYear();
    if (month && day && year) return `${month}/${day}/${year}`;
    return "";
  }

  const defaultUserTypes = useSelector((state) => state.inbox.defaultUserTypes);
  console.log(defaultUserTypes);
  console.log("finding types", props.case);
  const [rowuserTypes, setRowuserTypes] = useState({
    user_type1: defaultUserTypes?.find(
      (instance) => instance?.name === props.case["user_type1"]
    )?.status,
    user_type2: defaultUserTypes?.find(
      (instance) => instance?.name === props.case["user_type2"]
    )?.status,
    user_type3: defaultUserTypes?.find(
      (instance) => instance?.name === props.case["user_type3"]
    )?.status,
    user_type4: defaultUserTypes?.find(
      (instance) => instance?.name === props.case["user_type4"]
    )?.status,
    user_type5: defaultUserTypes?.find(
      (instance) => instance?.name === props.case["user_type5"]
    )?.status,
    user_type6: defaultUserTypes?.find(
      (instance) => instance?.name === props.case["user_type6"]
    )?.status,
  });

  useEffect(() => {
    const updatedRowUserTypes = {};
    Object.keys(rowuserTypes).forEach((key) => {
      updatedRowUserTypes[key] = defaultUserTypes?.find(
        (instance) => instance?.name === props.case[key]
      )?.status;
    });
    setRowuserTypes(updatedRowUserTypes);
  }, [defaultUserTypes]);

  const handleUserTypeChange = (key) => {
    setRowuserTypes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  console.log("row user type: ", rowuserTypes);

  useEffect(() => {
    const handleResize = () => {
      setIsAbove2000(window.innerWidth > 2000);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <tr
        style={{ textAlign: "left", height: isAbove2000 ? "73px" : "136px" }}
        className="search-row fake-row-2 vertical-align-middle"
      >
        <td
          className="text-dark-grey text-center"
          style={{ width: "19.05px !important" }}
        >
          {props.index}
        </td>
        <td style={{ width: "10%", whiteSpace: "nowrap" }} className="">
          <div className="case-details-1">
            <div className="d-flex align-items-center height-21 client-info-box">
              <div class="d-flex box-left">
                <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                  {props.case?.for_client?.profile_pic_19p && (
                    <img
                      src={props.case?.for_client?.profile_pic_19p}
                      className="output-3 theme-ring"
                      alt="Client Avatar"
                    />
                  )}
                </span>
                <span className="ml-2 text-black text-black-2 whitespace-nowrap font-600">
                  <b>
                    {props.case?.for_client?.last_name},{" "}
                    {props.case?.for_client?.first_name}
                  </b>
                </span>
              </div>
              <p
                className="ml-3 d-flex align-items-center"
                style={{ fontWeight: "600" }}
              >
                <img
                  src={birthdayIcon}
                  className="m-r-5 ic-19"
                  alt="Birthday Icon"
                />
                {formatDate(props.case?.for_client?.birthday)}
              </p>
            </div>

            <div className="d-flex align-items-center height-21 case-info-box">
              <div className="d-flex align-items-center search-Flex-1 height-21 box-left font-600">
                {props.case?.case_type?.casetype_icon && (
                  <img
                    className="mr-2 ic-19"
                    src={props.case?.case_type?.casetype_icon}
                    alt="Case Type Icon"
                  />
                )}
                <p className="MR8H19">{props.case?.case_type?.name}</p>
              </div>
              <p className="ml-3 d-flex align-items-center box-right font-600">
                <img
                  src={incidentIcon}
                  className="m-r-5 ic-19"
                  alt="Incident Icon"
                />
                {props.case?.incident_date
                  ? formatDate(props.case?.incident_date)
                  : "-"}
              </p>
            </div>

            <div className="d-flex align-items-center height-21 status-info-box">
              <p
                className="box-left height-21"
                style={{
                  color: props.case?.open === "True" ? "green" : "grey",
                  fontWeight: "600",
                }}
              >
                {props.case?.open === "True" ? "OPEN" : "CLOSED"}
              </p>
              <div className="ml-3 d-flex align-items-center box-right height-21 font-600">
                {/* <img
                                src="/date-icon.svg"
                                className="mr-2 ic-19"
                                alt="Status Date Icon"
                            /> */}
                <p style={{ color: "black", fontWeight: "600" }}>
                  {props.case?.open === "True"
                    ? formatDate(props.case?.intake_date)
                    : props.case?.date_closed
                      ? formatDate(props.case?.date_closed)
                      : "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="case-details-2">
            {/* Client Name and Avatar */}
            <div className="d-flex align-items-center height-21">
              <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                {props.case?.for_client?.profile_pic_19p && (
                  <img
                    src={props.case?.for_client?.profile_pic_19p}
                    className="output-3 theme-ring"
                    alt="Client Avatar"
                  />
                )}
              </span>
              <span className="ml-2 text-black text-black-2 whitespace-nowrap font-600">
                <b>
                  {props.case?.for_client?.last_name},{" "}
                  {props.case?.for_client?.first_name}
                </b>
              </span>
            </div>

            {/* Birthday */}
            <p className="ml-0 d-flex align-items-center height-21 font-600">
              <img
                src={birthdayIcon}
                className="mr-2 ic-19"
                alt="Birthday Icon"
              />
              {formatDate(props.case?.for_client?.birthday)}
            </p>

            {/* Case Type */}
            <div className="d-flex align-items-center height-21 font-600">
              {props.case?.case_type?.casetype_icon && (
                <img
                  className="mr-2 ic-19"
                  src={props.case?.case_type?.casetype_icon}
                  alt="Case Type Icon"
                />
              )}
              <p className="MR8H19">{props.case?.case_type?.name}</p>
            </div>

            {/* Incident Date */}
            <p className="ml-0 d-flex align-items-center height-21 font-600">
              <img
                src={incidentIcon}
                className="mr-2 ic-19"
                alt="Incident Icon"
              />
              {props.case?.incident_date
                ? formatDate(props.case?.incident_date)
                : "-"}
            </p>

            {/* Case Status */}
            <div className="d-flex height-21">
              <p
                style={{
                  color: props.case?.open === "True" ? "green" : "grey",
                  fontWeight: "600",
                }}
              >
                {props.case?.open === "True" ? "OPEN" : "CLOSED"}
              </p>
              <div className="m-l-5 d-flex align-items-center font-600">
                {/* <img src="/date-icon.svg" className="mr-2 ic-19" alt="Status Date Icon" /> */}
                <p style={{ color: "black", fontWeight: "600" }}>
                  {props.case?.open === "True"
                    ? formatDate(props.case?.intake_date)
                    : props.case?.date_closed
                      ? formatDate(props.case?.date_closed)
                      : "-"}
                </p>
              </div>
            </div>
          </div>
        </td>
        {props.inboxTab == "insurance" ? (
          <>
            <td className="">
              <div class="d-flex justify-content-center  align-items-center">
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="pb-0 mb-0 font-600">
                      {props.insurance?.insurance_type?.name
                        ? props.insurance?.insurance_type?.name
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-600">
                      {props.insurance?.company?.company_name
                        ? props.insurance?.company?.company_name
                        : "-"}
                    </p>
                  </div>
                </div>
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="pb-0 mb-0 font-600">
                      {props.insurance?.claim_number
                        ? props.insurance?.claim_number
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-600">
                      {props.insurance?.policy_number
                        ? props.insurance?.policy_number
                        : "-"}
                    </p>
                  </div>
                </div>
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="pb-0 mb-0 font-600">
                      {props.case?.court_name ? props.case?.court_name : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="font-600">
                      {props.case?.case_number ? props.case?.case_number : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </>
        ) : null}
        {props.inboxTab == "client" && <td></td>}
        {props.inboxTab == "unidentified" && <td></td>}
        {props.inboxTab == "completed" && <td></td>}
        {props.inboxTab == "ocr_failed" && <td></td>}

        {props.inboxTab == "check" ? (
          <>
            <td className="">
              <div class="d-flex justify-content-center align-items-center">
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="font-600">
                      {props.check?.bank_account?.account_number
                        ? "*" +
                          props.check?.bank_account?.account_number?.slice(-4)
                        : "-"}
                    </p>
                  </div>
                </div>
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="font-600">
                      {props.check?.cheque_number
                        ? props.check?.cheque_number
                        : "-"}
                    </p>
                  </div>
                </div>
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="font-600">
                      {props.check?.cheque_date
                        ? props.check?.cheque_date?.split("T")[0]
                        : "-"}
                    </p>
                  </div>
                </div>
                <div
                  style={{ paddingTop: "20px" }}
                  className="align-items-center client-name-box ml-2"
                >
                  <div>
                    <p className="font-600">
                      {props.check?.amount
                        ? currencyFormat(props.check?.amount)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </>
        ) : null}
        {props.inboxTab == "account" ? (
          <>
            <td style={{ width: "20%" }} className="">
              <div
                style={{ paddingTop: "20px" }}
                className="d-flex justify-content-center align-items-center client-name-box"
              >
                <div>
                  <p className="pb-0 mb-0 font-600">
                    {props.account?.payee ? props.account?.payee : "-"}
                  </p>
                </div>
                <div>
                  <p className="font-600">
                    {props.account?.invoice_number
                      ? props.account?.invoice_number
                      : "-"}
                  </p>
                </div>
              </div>
            </td>
            {props.inboxTab == "account" && (
              <td className="text-center">
                <div class="d-flex justify-content-center align-items-center w-100">
                  <div
                    style={{ alignItems: "center" }}
                    className="d-flex justify-content-center btn-group-vertical"
                  >
                    <div className="m-b-5">
                      <div
                        className="d-flex height-25 font-weight-semibold cursor-pointer btn-hover-document-row"
                        id="no-vertical-border"
                        style={{
                          width: "150px",
                          borderColor: "var(--primary)",
                          backgroundColor: "var(--primary-10)",
                          color: "var(--primary)",
                          border: "1px solid var(--primary)",
                        }}
                        onClick={() => handleAttachDocToPage("invoice")}
                      >
                        <span className="icon-wrap">
                          <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                        </span>
                        <p className="name">Invoice</p>
                      </div>
                    </div>
                    <div>
                      <div
                        className="d-flex height-25 font-weight-semibold cursor-pointer btn-hover-document-row"
                        id="no-vertical-border"
                        style={{
                          width: "150px",
                          borderColor: "var(--primary)",
                          backgroundColor: "var(--primary-10)",
                          color: "var(--primary)",
                          border: "1px solid var(--primary)",
                        }}
                        onClick={() => handleAttachDocToPage("verify")}
                      >
                        <span className="icon-wrap">
                          <i className="ic ic-19 ic-custom-icon-cloud-2 cursor-pointer img-19px"></i>
                        </span>
                        <p className="name">Verification</p>
                      </div>
                    </div>
                    {/* <div>
                                <button onClick={() => handleAttachDocToPage('invoice')} style={{ width: "150px" }} className="btn btn-secondary btn-secondary-hover-green m-b-5 height-25 d-flex align-items-center justify-content-center" >
                                    Invoice
                                </button>
                            </div>
                            <div>
                                <button onClick={() => handleAttachDocToPage('verify')} style={{ width: "150px" }} className="btn btn-secondary btn-secondary-hover-green m-b-5 height-25 d-flex align-items-center justify-content-center" >
                                    Verification
                                </button>
                            </div> */}
                  </div>

                  {!isAbove2000 && (
                    <div className="ml-4 users-account  users-account-1">
                      <div class="">
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail mr-2">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user1
                                ? props.case.firm_user1.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type1")}
                            checked={rowuserTypes?.user_type1}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type1
                              ? props.case["user_type1"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user1 &&
                              props.case?.firm_user1?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user1"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user1
                              ? props.case?.firm_user1?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user1
                              ? props.case?.firm_user1?.user?.last_name
                              : null}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="m-l-5 mr-2 checkbox "
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user2
                                ? props.case.firm_user2.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type2")}
                            checked={rowuserTypes?.user_type2}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type2
                              ? props.case["user_type2"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user2 &&
                              props.case?.firm_user2?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user2"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user2
                              ? props.case?.firm_user2?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user2
                              ? props.case?.firm_user2?.user?.last_name
                              : null}
                          </div>
                        </div>
                      </div>
                      <div class="">
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail mr-2">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user3
                                ? props.case.firm_user3.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type3")}
                            checked={rowuserTypes?.user_type3}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type3
                              ? props.case["user_type3"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user3 &&
                              props.case?.firm_user3?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user3"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user3
                              ? props.case?.firm_user3?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user3
                              ? props.case?.firm_user3?.user?.last_name
                              : null}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="m-l-5 mr-2 checkbox "
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user4
                                ? props.case.firm_user4.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type4")}
                            checked={rowuserTypes?.user_type4}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type4
                              ? props.case["user_type4"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user4 &&
                              props.case?.firm_user4?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user4"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user4
                              ? props.case?.firm_user4?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user4
                              ? props.case?.firm_user4?.user?.last_name
                              : null}
                          </div>
                        </div>
                      </div>
                      <div class="">
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail mr-2">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user5
                                ? props.case.firm_user5.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type5")}
                            checked={rowuserTypes?.user_type5}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type5
                              ? props.case["user_type5"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user5 &&
                              props.case?.firm_user5?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user5"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user5
                              ? props.case?.firm_user5?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user4
                              ? props.case?.firm_user5?.user?.last_name
                              : null}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="m-l-5 mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user6
                                ? props.case.firm_user6.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type6")}
                            checked={rowuserTypes?.user_type6}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type6
                              ? props.case["user_type6"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user6 &&
                              props.case?.firm_user6?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user6"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user6
                              ? props.case?.firm_user6?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user6
                              ? props.case?.firm_user6?.user?.last_name
                              : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAbove2000 && (
                    <div className="ml-4 users-account account-tab-accounts users-account-2">
                      <div class="d-flex">
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user1
                                ? props.case.firm_user1.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type1")}
                            checked={rowuserTypes?.user_type1}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type1
                              ? props.case["user_type1"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user1 &&
                              props.case?.firm_user1?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user1"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user1
                              ? props.case?.firm_user1?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user1
                              ? props.case?.firm_user1?.user?.last_name
                              : null}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user4
                                ? props.case.firm_user4.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type4")}
                            checked={rowuserTypes?.user_type4}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type4
                              ? props.case["user_type4"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user4 &&
                              props.case?.firm_user4?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user4"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user4
                              ? props.case?.firm_user4?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user4
                              ? props.case?.firm_user4?.user?.last_name
                              : null}
                          </div>
                        </div>
                      </div>
                      <div class="d-flex">
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user2
                                ? props.case.firm_user2.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type2")}
                            checked={rowuserTypes?.user_type2}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type2
                              ? props.case["user_type2"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user2 &&
                              props.case?.firm_user2?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user2"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user2
                              ? props.case?.firm_user2?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user2
                              ? props.case?.firm_user2?.user?.last_name
                              : null}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user5
                                ? props.case.firm_user5.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type5")}
                            checked={rowuserTypes?.user_type5}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type5
                              ? props.case["user_type5"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user5 &&
                              props.case?.firm_user5?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user5"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user5
                              ? props.case?.firm_user5?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user4
                              ? props.case?.firm_user5?.user?.last_name
                              : null}
                          </div>
                        </div>
                      </div>
                      <div class="d-flex">
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user3
                                ? props.case.firm_user3.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type3")}
                            checked={rowuserTypes?.user_type3}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type3
                              ? props.case["user_type3"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user3 &&
                              props.case?.firm_user3?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user3"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user3
                              ? props.case?.firm_user3?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user3
                              ? props.case?.firm_user3?.user?.last_name
                              : null}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                          <input
                            className="mr-2 checkbox m-l-5"
                            onclick="event.stopPropagation();"
                            type="checkbox"
                            user_id={
                              props.case?.firm_user6
                                ? props.case.firm_user6.id
                                : ""
                            }
                            onClick={() => handleUserTypeChange("user_type6")}
                            checked={rowuserTypes?.user_type6}
                          />
                          <div
                            style={{ textAlign: "left", fontWeight: "600" }}
                            className=" text-darker user-designation"
                          >
                            {props.case?.user_type6
                              ? props.case["user_type6"]
                              : null}
                          </div>
                          <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            {props.case?.firm_user6 &&
                              props.case?.firm_user6?.profile_pic_19p && (
                                <img
                                  src={
                                    props.case["firm_user6"]["profile_pic_19p"]
                                  }
                                />
                              )}
                          </div>
                          <div
                            style={{ fontWeight: "600" }}
                            className=" text-darker ml-2"
                          >
                            {props.case?.firm_user6
                              ? props.case?.firm_user6?.user?.first_name
                              : null}{" "}
                            {props.case?.firm_user6
                              ? props.case?.firm_user6?.user?.last_name
                              : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            )}
            <td></td>
          </>
        ) : (
          <>
            {/* <td style={{width: "100%"}} className="text-center">
                        <div className="justify-content-center" style={{width: "100%"}} >
                            <form className="notes-form-2 notes-form-without-flex"  id="notes-form" style={{height: "100%"}}>
                                <TempNestedDropdown inboxTab={props.inboxTab} setSelectedData={setSelectedData} case={props.case} />
                            </form>
                        </div>
                    </td> */}

            <td
              style={{
                width:
                  props.inboxTab == "insurance" ||
                  props.inboxTab == "account" ||
                  props.inboxTab == "check" ||
                  props.inboxTab == "client"
                    ? "40%"
                    : "50%",
              }}
              className="text-center"
            >
              <div class="d-flex justify-content-center align-items-center w-100">
                {/* <div className="case-sorted-2">
                                <p className="search-Flex-1 inbox-doc-filename justify-content-center" style={{ height: '20px' }}>
                                    Save to Case as Unsorted:
                                </p>
                                <div className="justify-content-center" style={{width: "100%"}} >
                                    <form className="notes-form-2"  id="notes-form" style={{height: "100%",paddingLeft:"0px"}}>
                                        
                                        <NestedDropdown setUnsortedCase={setUnsortedCase} unsortedCase={unsortedCase} setUnsortedPage={setUnsortedPage} unsortedPage={unsortedPage} inboxTab={props.inboxTab} setSelectedData={setSelectedData} case={props.case} />
                                    </form>
                                </div>
                            </div> */}
                {!isAbove2000 && (
                  <div className="ml-4 users-account  users-account-1">
                    <div class="">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail mr-2">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user1
                              ? props.case.firm_user1.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type1")}
                          checked={rowuserTypes?.user_type1}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type1
                            ? props.case["user_type1"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user1 &&
                            props.case?.firm_user1?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user1"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user1
                            ? props.case?.firm_user1?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user1
                            ? props.case?.firm_user1?.user?.last_name
                            : null}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user2
                              ? props.case.firm_user2.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type2")}
                          checked={rowuserTypes?.user_type2}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type2
                            ? props.case["user_type2"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user2 &&
                            props.case?.firm_user2?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user2"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user2
                            ? props.case?.firm_user2?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user2
                            ? props.case?.firm_user2?.user?.last_name
                            : null}
                        </div>
                      </div>
                    </div>
                    <div class="">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail mr-2">
                        <input
                          className="mr-2 checkbox m-l-5 "
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user3
                              ? props.case.firm_user3.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type3")}
                          checked={rowuserTypes?.user_type3}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type3
                            ? props.case["user_type3"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user3 &&
                            props.case?.firm_user3?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user3"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user3
                            ? props.case?.firm_user3?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user3
                            ? props.case?.firm_user3?.user?.last_name
                            : null}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user4
                              ? props.case.firm_user4.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type4")}
                          checked={rowuserTypes?.user_type4}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type4
                            ? props.case["user_type4"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user4 &&
                            props.case?.firm_user4?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user4"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user4
                            ? props.case?.firm_user4?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user4
                            ? props.case?.firm_user4?.user?.last_name
                            : null}
                        </div>
                      </div>
                    </div>
                    <div class="">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail mr-2">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user5
                              ? props.case.firm_user5.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type5")}
                          checked={rowuserTypes?.user_type5}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type5
                            ? props.case["user_type5"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user5 &&
                            props.case?.firm_user5?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user5"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user5
                            ? props.case?.firm_user5?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user4
                            ? props.case?.firm_user5?.user?.last_name
                            : null}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user6
                              ? props.case.firm_user6.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type6")}
                          checked={rowuserTypes?.user_type6}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type6
                            ? props.case["user_type6"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user6 &&
                            props.case?.firm_user6?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user6"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user6
                            ? props.case?.firm_user6?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user6
                            ? props.case?.firm_user6?.user?.last_name
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isAbove2000 && (
                  <div className="ml-4 users-account account-tab-accounts users-account-2">
                    <div class="d-flex">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user1
                              ? props.case.firm_user1.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type1")}
                          checked={rowuserTypes?.user_type1}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type1
                            ? props.case["user_type1"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user1 &&
                            props.case?.firm_user1?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user1"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user1
                            ? props.case?.firm_user1?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user1
                            ? props.case?.firm_user1?.user?.last_name
                            : null}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user4
                              ? props.case.firm_user4.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type4")}
                          checked={rowuserTypes?.user_type4}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type4
                            ? props.case["user_type4"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user4 &&
                            props.case?.firm_user4?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user4"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user4
                            ? props.case?.firm_user4?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user4
                            ? props.case?.firm_user4?.user?.last_name
                            : null}
                        </div>
                      </div>
                    </div>
                    <div class="d-flex">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user2
                              ? props.case.firm_user2.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type2")}
                          checked={rowuserTypes?.user_type2}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type2
                            ? props.case["user_type2"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user2 &&
                            props.case?.firm_user2?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user2"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user2
                            ? props.case?.firm_user2?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user2
                            ? props.case?.firm_user2?.user?.last_name
                            : null}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user5
                              ? props.case.firm_user5.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type5")}
                          checked={rowuserTypes?.user_type5}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type5
                            ? props.case["user_type5"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user5 &&
                            props.case?.firm_user5?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user5"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user5
                            ? props.case?.firm_user5?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user4
                            ? props.case?.firm_user5?.user?.last_name
                            : null}
                        </div>
                      </div>
                    </div>
                    <div class="d-flex">
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user3
                              ? props.case.firm_user3.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type3")}
                          checked={rowuserTypes?.user_type3}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type3
                            ? props.case["user_type3"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user3 &&
                            props.case?.firm_user3?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user3"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user3
                            ? props.case?.firm_user3?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user3
                            ? props.case?.firm_user3?.user?.last_name
                            : null}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start user-desingation-detail ">
                        <input
                          className="mr-2 checkbox m-l-5"
                          onclick="event.stopPropagation();"
                          type="checkbox"
                          user_id={
                            props.case?.firm_user6
                              ? props.case.firm_user6.id
                              : ""
                          }
                          onClick={() => handleUserTypeChange("user_type6")}
                          checked={rowuserTypes?.user_type6}
                        />
                        <div
                          style={{ textAlign: "left", fontWeight: "600" }}
                          className=" text-darker user-designation"
                        >
                          {props.case?.user_type6
                            ? props.case["user_type6"]
                            : null}
                        </div>
                        <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                          {props.case?.firm_user6 &&
                            props.case?.firm_user6?.profile_pic_19p && (
                              <img
                                src={
                                  props.case["firm_user6"]["profile_pic_19p"]
                                }
                              />
                            )}
                        </div>
                        <div
                          style={{ fontWeight: "600" }}
                          className=" text-darker ml-2"
                        >
                          {props.case?.firm_user6
                            ? props.case?.firm_user6?.user?.first_name
                            : null}{" "}
                          {props.case?.firm_user6
                            ? props.case?.firm_user6?.user?.last_name
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </td>

            <td
              style={{
                width:
                  (props.inboxTab == "insurance" ||
                    props.inboxTab == "account" ||
                    // props.inboxTab == "check" ||
                    props.inboxTab == "client") &&
                  "20%",
              }}
            >
              {props.inboxTab !== "check" && (
                <div>
                  {/* <p className="search-Flex-1 inbox-doc-filename justify-content-center" style={{ height: '20px' }}>
                                Save to Case as Unsorted:
                            </p> */}
                  <div
                    className="justify-content-center"
                    style={{ width: "100%", marginTop: "0px" }}
                  >
                    <form
                      className="notes-form-2"
                      id="notes-form"
                      style={{
                        height: "100%",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                      }}
                    >
                      {/* <p className="pdf-filename" style={{ textAlign: "left" }}><b>{props.document?.file_name}</b></p> */}
                      <NestedDropdown
                        setUnsortedCase={setUnsortedCase}
                        unsortedCase={unsortedCase}
                        setUnsortedPage={setUnsortedPage}
                        unsortedPage={unsortedPage}
                        inboxTab={props.inboxTab}
                        setSelectedData={setSelectedData}
                        caseData={props.case}
                      />
                    </form>
                  </div>
                </div>
              )}
            </td>
          </>
        )}

        {props.inboxTab == "check" ? (
          <td className="text-center">
            <div
              style={{ alignItems: "center" }}
              className="d-flex justify-content-center btn-group-vertical"
            >
              <div>
                <button
                  onClick={() => handleUpdateCheckStatus("Sent")}
                  style={{ width: "65px" }}
                  className="btn btn-primary p-t-5 p-b-5 p-r-5 p-l-5 mb-2 height-25 d-flex align-items-center justify-content-center"
                >
                  Sent
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleUpdateCheckStatus("Cleared")}
                  style={{ width: "65px" }}
                  className="btn btn-primary mb-2 p-t-5 p-b-5 p-r-5 p-l-5 height-25 d-flex align-items-center justify-content-center"
                >
                  Cleared
                </button>
              </div>
            </div>
          </td>
        ) : (
          <td
            style={{
              width:
                (props.inboxTab != "insurance" ||
                  props.inboxTab != "account" ||
                  props.inboxTab != "check" ||
                  props.inboxTab != "client") &&
                "150px",
            }}
            className="text-center"
          >
            <div
              style={{ alignItems: "center" }}
              className="d-flex justify-content-end"
            >
              <div>
                <button
                  onClick={() => handleAttachDocToPage()}
                  style={{ width: "68.44px" }}
                  className="height-25 inbox-save-btn btn delete-document green-bg-hover bg-secondary d-flex align-items-center justify-content-center"
                >
                  Save
                </button>
              </div>
            </div>
          </td>
        )}
      </tr>
      {/* <div>
            <div data-keyboard="false" data-backdrop="static" className="modal modal-rel fade show" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" id="confirmationModal">
                <div className="modal-dialog modal-dialog-centered inbox-confirmation-modal inbox-modal-height">
                    <div className="modal-content inbox-confirmation-content">
                        <InboxConfirmationModalBody taskDocumentPopupData={taskDocumentPopupData} inboxConfirmationContent={inboxConfirmationContent} onHide={() => setInboxConfirmationModalShow(false)} />

                    </div>
                </div>
            </div>
        </div> */}
    </>
  );
};

export default InboxTableRow;
