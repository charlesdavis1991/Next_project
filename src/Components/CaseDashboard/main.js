import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CounsellingModal from "../Modals/counsellingModal";
import AddNewClientModal from "../Modals/addNewClientModal";
import { formatNum } from "../../Utils/date";
import "../../../public/BP_resources/css/notes-section.css";
import "../../../public/BP_resources/css/case.css";
import { useLocation } from "react-router-dom";
import { WorkersOnCase } from "./CaseWorkes";
import {
  calculateAge,
  formatDate,
  formatPhoneToDashes,
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../../Utils/helper";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import {
  fetchClientProvider,
  fetchClientProviderVerifications,
} from "../../api/clientProviders";
import {
  setClientProviders,
  setEditCaseProvider,
  setLoading,
  setVerifications,
} from "../../Redux/client-providers/clientProviderSlice";
import { fetchCaseSummary } from "../../api/case";
import { setCaseSummary } from "../../Redux/caseData/caseDataSlice";
import ClientProvidersStyles from "./ClientProvidersStyles";
import NotesSection from "./NotesSection";
import MedicalProviders from "./MedicalProvidersTable/MedicalProviders";
import PageChecklist from "../common/PageChecklist";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import NotesSectionDashboard from "../NotesSectionDashboard/main";
import api from "../../api/api";
import axios from "axios";
import ActionBarComponent from "../common/ActionBarComponent";
import DocumentRow from "../DocumentRow/DocumentRow";
import incidentIcon from "../../assets/images/incident.svg";
import "./case-dashboard-main.css";
import SingleTd from "../common/SingleTd";
import CasePanelInfoTable from "../common/CasePanelInfoTable";
import DefaultThumbnail from "../common/defaultPhotoSlot";
import ContactPanelWithoutButtons from "../common/ContactPanelWithoutButtons";
import ChangeOfficeFirmLocationModal from "../Modals/ChangeFirmOfficeModal2";
import "./case-main.css";
import MedicalProvidersTable from "./MedicalProvidersTable/MedicalProviderTable";

// import { CoCounsellingFirms } from "./CaseWorkes/CoCounsellingFirms";

const SearchDashboard = () => {
  const dispatch = useDispatch();
  let location = useLocation();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const caseSummaryState = useSelector((state) => state?.caseData?.summary);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const timelineEvents = useSelector(
    (state) => state?.caseData?.summary?.timeline_events
  );
  const client = useSelector((state) => state?.client?.current);
  const client_providers = useSelector((state) => state.clientProvider.all);
  console.log("client provider",client_providers);
  const [counsellingOpen, setCounsellingOpen] = useState(false);
  const [addNewClientOnCaseOpen, setAddNewClientOnCase] = useState(false);
  const [isChangeFirmAddress, setIsChangeFirmAddress] = useState(false);

  const [image1, setImage1] = useState(
    "https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/grid-img3.png"
  );
  const [image2, setImage2] = useState(
    "https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/grid-img2.png"
  );
  const [image3, setImage3] = useState(
    "https://simplefirm-bucket.s3.amazonaws.com/static/page_photos/images_vSMFUkf.jpg"
  );
  const [image4, setImage4] = useState(
    "https://simplefirm-bucket.s3.amazonaws.com/static/page_photos/MOU_timeline_Fall_2023_V11FlT3.png"
  );
  // const [caseSummaryState, setCaseSummaryState] = useState(null);

  const handleClose = (type) => {
    if (type === "counsellingOpen") {
      setCounsellingOpen(!counsellingOpen);
    }
    if (type === "addNewClientOnCaseOpen") {
      setAddNewClientOnCase(!addNewClientOnCaseOpen);
    }
  };

  const fetchCaseSummaryApi = async (clientId, caseId) => {
    try {
      const response = await axios.get(
        origin + `/api/cases/${clientId}/${caseId}/summary/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      dispatch(setCaseSummary(response.data));
      setCaseSummaryState(response.data);
    } catch (e) {
      console.error(e);
    }
  };
  // WILL USE IT IN CASE IF fetchClientProviders DOESN'T WORK PROPERLY
  // const fetchCaseProviderApi = async (clientId, caseId) => {
  //   try {
  //     const response = await axios.get(
  //       origin + `/api/cases/${clientId}/${caseId}/client-providers/`,
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );

  //     dispatch(setClientProviders(response.data));
  //     setCaseSummaryState(response.data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  useEffect(() => {
    const newClientID = location.pathname.split("/")[2];
    const newCaseID = location.pathname.split("/")[3];
    // if (client) {
    // setLoading({ key: "all", value: true });
    // fetchClientProviders(
    //   newClientID || getClientId(),
    //   newCaseID || getCaseId()
    // )
    //   .then((data) => {
    //     dispatch(setClientProviders(data?.results));
    //     setLoading({ key: "all", value: false });
    //   })
    //   .catch((error) => {
    //     console.error(
    //       "Error occurred while fetching client-providers",
    //       error
    //     );
    //     setLoading({ key: "all", value: false });
    //   });
    // }
    fetchCaseSummaryApi(newClientID || getClientId(), newCaseID || getCaseId());
    fetchShakespeareStatus(getCaseId(), getClientId(), "Case", dispatch);
  }, [client]);
  useEffect(() => {
    document.body.classList.add("case-page");
    document.body.classList.remove("client-page");
    document.body.classList.remove("photos-page");
  }, []);

  const buttonsConfig = [
    {
      label: "New Client On Case",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#addcase",
      onClick: () => setAddNewClientOnCase(true),
    },
    {
      label: "Co-counselling Firm",
      icon: "+",
      className: "btn btn-primary rounded-0 height-25 p-b-0 p-t-0",
      dataToggle: "modal",
      dataTarget: "#cocounselling_modal",
      onClick: () => setCounsellingOpen(true),
    },
  ];
  const header_name = useSelector((state) => state.header_name?.header_name);

  const dataForFirstTd = [
    {
      label: (
        <span
          className="text-label font-weight-semibold d-flex align-items-center "
          style={{ fontSize: "14px" }}
        >
          <img
            src={incidentIcon}
            className="m-r-5"
            style={{ width: "19px", height: "19px" }}
          />
          Incident Date
        </span>
      ),
      value: formatDate(caseSummaryState?.incident_date),
    },
    {
      label: (
        <>
          <span className="color-green">OPEN</span> / Intake
        </>
      ),
      value: formatDate(caseSummaryState?.intake_date),
    },
    {
      label: "Retained:",
      value: formatDate(caseSummaryState?.retained),
    },
    {
      label: "Accepted:",
      value: formatDate(caseSummaryState?.accepted_date),
    },
    {
      label: "Closed:",
      value: formatDate(caseSummaryState?.date_closed),
    },
  ];

  const dataForStatuteLimitations =
    caseSummaryState?.case_statute_limitations?.map((caseItem) => ({
      label: caseItem?.date_name,
      value: new Date(caseItem?.start_date)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        })
        .replace(/(\w+)\s(\d+),/, "$1. $2,"),
    }));

  const emptyRowsForStatuteLimitations = Array.from(
    { length: 5 - (caseSummaryState?.case_statute_limitations?.length || 0) },
    (_, index) => ({
      label: "",
      value: "",
    })
  );

  const fullDataForStatuteLimitations = [
    ...(Array.isArray(dataForStatuteLimitations)
      ? dataForStatuteLimitations
      : []),
    ...emptyRowsForStatuteLimitations,
  ];
  const dataForClients = () => {
    const singleClient = {
      profilePic: caseSummaryState?.for_client.profile_pic_19p,
      firstName: caseSummaryState?.for_client.first_name,
      lastName: caseSummaryState?.for_client.last_name,
      age: calculateAge(caseSummaryState?.for_client.birthday),
    };

    const multipleClients = caseSummaryState?.multipleClient_for_case?.map(
      (client) => ({
        profilePic: client.new_client.profile_pic_19p,
        firstName: client.new_client.first_name,
        lastName: client.new_client.last_name,
        age: calculateAge(client.new_client.birthday),
      })
    );

    const allClients = [singleClient, ...(multipleClients || [])];

    const emptyRows = Array.from(
      { length: 5 - allClients.length },
      (_, index) => ({
        profilePic: null,
        firstName: "",
        lastName: "",
        age: "",
        isEmpty: true,
      })
    );

    return [...allClients, ...emptyRows];
  };

  const clientsData = useMemo(() => dataForClients(), [caseSummaryState]);

  const dataForClientsTd = clientsData.map((client, index) => ({
    label: (
      <div className="d-flex align-items-center">
        {client.profilePic || client.firstName || client.lastName ? (
          <>
            {client.profilePic ? (
              <img
                src={client.profilePic}
                className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5"
                alt=""
              />
            ) : (
              <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img m-r-5"></span>
            )}
            <span className="font-weight-semibold">
              {client.firstName} {client.lastName}
            </span>
          </>
        ) : null}
      </div>
    ),
    value:
      !client.isEmpty && client.firstName ? (
        <>
          <span className="padding-left35">
            Age <span className="font-weight-semibold">{client.age}</span>
          </span>
        </>
      ) : null,
  }));

  const dataForCounselingFirms = caseSummaryState?.case_councelling_firms?.map(
    (firm) => ({
      label: firm.firm.counseling_firm.attorneyprofile.office_name,
      value: formatPhoneToDashes(
        firm.firm.counseling_firm.main_contact.phone_number
      ),
    })
  );

  const emptyRowsForCounselingFirms = Array.from(
    { length: 5 - (caseSummaryState?.case_councelling_firms?.length || 0) },
    (_, index) => ({
      label: "",
      value: "",
    })
  );

  const fullDataForCounselingFirms = [
    ...(Array.isArray(dataForCounselingFirms) ? dataForCounselingFirms : []),
    ...emptyRowsForCounselingFirms,
  ];

  const memoizedDataForFirstTd = useMemo(
    () => dataForFirstTd,
    [caseSummaryState]
  );
  const memoizedDataForStatuteLimitations = useMemo(
    () => fullDataForStatuteLimitations,
    [caseSummaryState]
  );
  const memoizedDataForClientsTd = useMemo(
    () => dataForClientsTd,
    [caseSummaryState]
  );
  const memoizedDataForCounselingFirms = useMemo(
    () => fullDataForCounselingFirms,
    [caseSummaryState]
  );

  const tableData = useMemo(
    () => [
      {
        heading: "Open",
        target: "#edit-case-dates-modal",
        data: memoizedDataForFirstTd,
        button: "Edit Case Type and Dates",
        leftHand: false,
        onClick: () => console.log(),
      },
      {
        heading: "Statute of Limitations",
        target: "",
        data: memoizedDataForStatuteLimitations,
        button: "Statue of Limitations",
        leftHand: true,
        onClick: () => console.log(),
      },
      {
        heading: "Clients On Case",
        target: "addCase",
        data: memoizedDataForClientsTd,
        button: "Clients on Case",
        leftHand: true,
        onClick: () => setAddNewClientOnCase(true),
      },
      {
        heading: "CO-COUNSELlING FIRMS",
        target: "cocounselling_modal",
        data: memoizedDataForCounselingFirms,
        button: "Co-Counselling Firms on Case",
        leftHand: true,
        onClick: () => setCounsellingOpen(true),
      },
    ],
    [
      memoizedDataForFirstTd,
      memoizedDataForStatuteLimitations,
      memoizedDataForClientsTd,
      memoizedDataForCounselingFirms,
    ]
  );
  return (
    <div>
      <>
        <ClientProvidersStyles clientProviders={client_providers} />
        <div className="main-content" id="padding-top-165">
          {/* <div
            className="action-bar main-action-bar client-BarAlign d-flex m-b-5 margin-left-12 pr-15"
            style={{ left: 148 }}
          >
            <span className="page-icon">
              <img
                className="translate-note-icon"
                src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/case-icon-color.svg"
              />
            </span> */}
          <ActionBarComponent
            src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/case-icon-color.svg"
            page_name={"Case"}
            buttons={[]}
          />
          {/* <div className="text-wrapper text-white d-flex align-items-center p-l-5">
              <h2 className="text-white mb-0">Case</h2>
              <span className="mx-2 text-white" />
              <ul className="info-list text-white d-none list-unstyled">
                <li>
                  <span className="value">Car Accident</span>
                </li>
                <li>
                  <span className="label">Value Estimate:</span>
                  <span className="value">$125,000</span>
                </li>
                <li>
                  <span className="label">Case Rank:</span>
                  <span className="value">Not Important</span>
                </li>
              </ul>
            </div>
            <div className="mobile-action-btns ml-auto">
              <button
                className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center mr-1"
                id="actionbarToggleBtn"
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>
                Actions
              </button>
              <button className="btn btn-primary rounded-0 position-relative z-index-1 ml-auto height-25 d-flex align-items-center client-mobile-details">
                Case Timeline
              </button>
            </div> */}
          {/* <div className="btn-wrapper">
              <button
                type="submit"
                className="btn btn-primary rounded-0 new-case-btn btn btn-primary rounded-0 height-25 p-b-0 p-t-0"
                data-toggle="modal"
                data-target="#addcase"
                onClick={() => setAddNewClientOnCase(true)}
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>New
                Client On Case
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-0 new-case-btn btn btn-primary rounded-0 height-25 p-b-0 p-t-0"
                data-toggle="modal"
                data-target="#cocounselling_modal"
                onClick={() => setCounsellingOpen(true)}
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>
                Co-counselling Firm
              </button> */}
          {/* <PageChecklist entity={'Case'}/> */}
          {/* </div> */}
          {/* </div> */}
          <div
            className="container-fluid overflow-hidden ML5px-ca"
            style={{ marginLeft: "0px", paddingRight: "0px" }}
          >
            {
              <div className="row">
                <div className="col-12">
                  <div className="d-flex">
                    <div className="content-left d-flex-1 p-r-5">
                      {/* <div className="row m-b-5">
                        <div className="col-12"> */}
                      <div className="border-box has-checklist rounded-0">
                        <div className="row no-gutters flex-nowrap top-panel-parent">
                          <div className="col-auto p-0 flex-g-1">
                            <div className="row no-gutters equal-column-wrapper position-relative">
                              <div className="col-auto d-flex p-0 top-content-panels flex-g-1 p-t-5 top-panel-case-page-responsiveness">
                                {caseSummaryState ? (
                                  <div
                                    className="d-flex align-items-center"
                                    style={{ width: "100%" }}
                                  >
                                    <div
                                      className="m-r-5"
                                      style={{ width: "255px" }}
                                    >
                                      {tableData
                                        .slice(0, 1)
                                        .map((data, idx) => (
                                          <>
                                            <CasePanelInfoTable
                                              key={idx}
                                              id={idx}
                                              heading={data.heading}
                                              data={data.data}
                                              target={data.target}
                                              button={data.button}
                                              leftHand={data.leftHand}
                                              onClick={data.onClick}
                                            />

                                            {/* <table
                                          className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table"
                                          id="treatment-summary-table"
                                        >
                                          <thead>
                                            <tr id="tb-header">
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                <span className="color-green">
                                                  OPEN{" "}
                                                </span>{" "}
                                                Case
                                              </th>
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                Statute of Limitations
                                              </th>
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                Clients On Case
                                              </th>
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                CO-COUNSELlING FIRMS
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr style={{ height: "21px" }}>
                                              <SingleTd
                                                rows={memoizedDataForFirstTd}
                                              />
                                              <SingleTd
                                                rows={
                                                  memoizedDataForStatuteLimitations
                                                }
                                              />
                                              <SingleTd
                                                rows={memoizedDataForClientsTd}
                                              />
                                              <SingleTd
                                                rows={
                                                  memoizedDataForCounselingFirms
                                                }
                                              />
                                              <>
                                              <td className="">
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <span className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center ">
                                                    <img
                                                      src={incidentIcon}
                                                      className=""
                                                      style={{
                                                        width: "19px",
                                                        height: "19px",
                                                      }}
                                                    />
                                                  </span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.incident_date
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <div>
                                                    <span className="color-green">
                                                      OPEN{" "}
                                                    </span>
                                                    / Intake:
                                                  </div>
                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.intake_date
                                                    )}{" "}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <span>Retained:</span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.retained
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <span>Accepted:</span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.accepted_date
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-r-5 p-l-5">
                                                  <span>Closed:</span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.date_closed
                                                    )}
                                                  </p>
                                                </div>
                                              </td>
                                              <td
                                                style={{ verticalAlign: "top" }}
                                              >
                                                {caseSummaryState?.case_statute_limitations &&
                                                  caseSummaryState?.case_statute_limitations?.map(
                                                    (caseItem, index) => (
                                                      <div
                                                        className="mb-0 p-l-5 p-r-5"
                                                        key={index}
                                                      >
                                                        <div className="col text-left">
                                                          <span className="d-inline-block">
                                                            {caseItem.date_name}
                                                          </span>
                                                        </div>
                                                        <div className="col-auto text-left font-weight-semibold">
                                                          {new Date(
                                                            caseItem?.start_date
                                                          )
                                                            .toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                                timeZone: "UTC",
                                                              }
                                                            )
                                                            .replace(
                                                              /(\w+)\s(\d+),/,
                                                              "$1. $2,"
                                                            )}
                                                        </div>
                                                      </div>
                                                    )
                                                  )}

                                                {Array.from(
                                                  {
                                                    length:
                                                      5 -
                                                      (caseSummaryState
                                                        ?.case_statute_limitations
                                                        ?.length || 0),
                                                  },
                                                  (_, index) => (
                                                    <div
                                                      className="mb-0 p-l-5 p-r-5 "
                                                      key={`empty-${index}`}
                                                      style={{ height: "21px" }}
                                                    ></div>
                                                  )
                                                )}
                                              </td>

                                              <td
                                                style={{ verticalAlign: "top" }}
                                              >
                                                <div className="text-left d-flex align-items-center justify-content-between p-l-5 p-r-5">
                                                  <div className="left-area d-flex align-items-center">
                                                    {caseSummaryState
                                                      ?.for_client
                                                      .profile_pic_19p ? (
                                                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                        <img
                                                          className="w-100 h-100"
                                                          src={
                                                            caseSummaryState
                                                              ?.for_client
                                                              .profile_pic_19p
                                                          }
                                                          alt=""
                                                        />
                                                      </span>
                                                    ) : (
                                                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                                    )}
                                                    <span className="m-l-5 m-r-5 font-weight-semibold">
                                                      {
                                                        caseSummaryState
                                                          ?.for_client
                                                          .first_name
                                                      }{" "}
                                                      {
                                                        caseSummaryState
                                                          ?.for_client.last_name
                                                      }
                                                    </span>
                                                  </div>
                                                  <span className="padding-left35">
                                                    Age
                                                    <span className="font-weight-semibold">
                                                      {" "}
                                                      {calculateAge(
                                                        caseSummaryState
                                                          ?.for_client.birthday
                                                      )}
                                                    </span>
                                                  </span>
                                                </div>

                                                {caseSummaryState?.multipleClient_for_case?.map(
                                                  (x) => (
                                                    <div
                                                      className="mb-0 p-l-5 p-r-5"
                                                      key={x.id}
                                                    >
                                                      <div className="col text-left d-flex align-items-center justify-content-between">
                                                        <div className="left-area d-flex align-items-center">
                                                          {x.new_client
                                                            .profile_pic_19p ? (
                                                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                              <img
                                                                className="w-100 h-100"
                                                                src={
                                                                  x.new_client
                                                                    .profile_pic_19p
                                                                }
                                                                alt=""
                                                              />
                                                            </span>
                                                          ) : (
                                                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                                          )}
                                                          <span className="m-l-5 m-r-5 font-weight-semibold">
                                                            {
                                                              x.new_client
                                                                .first_name
                                                            }{" "}
                                                            {
                                                              x.new_client
                                                                .last_name
                                                            }
                                                          </span>
                                                        </div>
                                                        <span className="padding-left35">
                                                          Age
                                                          <span className="font-weight-semibold">
                                                            {" "}
                                                            {calculateAge(
                                                              x.new_client
                                                                .birthday
                                                            )}
                                                          </span>
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                )}

                                                {Array.from(
                                                  {
                                                    length:
                                                      5 -
                                                      (caseSummaryState
                                                        ?.multipleClient_for_case
                                                        ?.length +
                                                        1),
                                                  },
                                                  (_, index) => (
                                                    <div
                                                      className="mb-0 p-l-5 p-r-5"
                                                      key={`empty-${index}`}
                                                      style={{ height: "21px" }}
                                                    ></div>
                                                  )
                                                )}
                                              </td>
                                              <td
                                                style={{ verticalAlign: "top" }}
                                              >
                                                <ul className="list-unstyled list-firms-contact">
                                                  {caseSummaryState?.case_councelling_firms &&
                                                    caseSummaryState?.case_councelling_firms?.map(
                                                      (firm, index) => (
                                                        <li
                                                          className="d-flex justify-content-between p-l-5 p-r-5"
                                                          key={index}
                                                        >
                                                          <span>
                                                            {
                                                              firm.firm
                                                                .counseling_firm
                                                                .attorneyprofile
                                                                .office_name
                                                            }
                                                          </span>
                                                          <strong>
                                                            {formatPhoneToDashes(
                                                              firm.firm
                                                                .counseling_firm
                                                                .main_contact
                                                                .phone_number
                                                            )}
                                                          </strong>
                                                        </li>
                                                      )
                                                    )}

                                                  {Array.from(
                                                    {
                                                      length:
                                                        5 -
                                                        (caseSummaryState
                                                          ?.case_councelling_firms
                                                          ?.length || 0),
                                                    },
                                                    (_, index) => (
                                                      <li
                                                        className="d-flex justify-content-between p-l-5 p-r-5"
                                                        key={`empty-${index}`}
                                                        style={{
                                                          height: "21px",
                                                        }}
                                                      ></li>
                                                    )
                                                  )}
                                                </ul>
                                              </td>
                                              </>
                                            </tr>
                                          </tbody>
                                        </table> */}
                                          </>
                                        ))}
                                    </div>
                                    <div
                                      className="d-flex"
                                      style={{
                                        width: "calc(100% - 255px)",
                                        gap: "5px",
                                      }}
                                    >
                                      {tableData
                                        .slice(1, 4)
                                        .map((data, idx) => (
                                          <>
                                            <CasePanelInfoTable
                                              key={idx}
                                              id={idx}
                                              heading={data.heading}
                                              data={data.data}
                                              target={data.target}
                                              button={data.button}
                                              leftHand={data.leftHand}
                                              onClick={data.onClick}
                                            />

                                            {/* <table
                                          className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table"
                                          id="treatment-summary-table"
                                        >
                                          <thead>
                                            <tr id="tb-header">
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                <span className="color-green">
                                                  OPEN{" "}
                                                </span>{" "}
                                                Case
                                              </th>
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                Statute of Limitations
                                              </th>
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                Clients On Case
                                              </th>
                                              <th className="td-autosize color-grey-2 p-l-5 text-center">
                                                CO-COUNSELlING FIRMS
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr style={{ height: "21px" }}>
                                              <SingleTd
                                                rows={memoizedDataForFirstTd}
                                              />
                                              <SingleTd
                                                rows={
                                                  memoizedDataForStatuteLimitations
                                                }
                                              />
                                              <SingleTd
                                                rows={memoizedDataForClientsTd}
                                              />
                                              <SingleTd
                                                rows={
                                                  memoizedDataForCounselingFirms
                                                }
                                              />
                                              <>
                                              <td className="">
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <span className="ic-avatar ic-19 text-label color-grey-2 text-uppercase font-weight-bold d-flex align-items-center ">
                                                    <img
                                                      src={incidentIcon}
                                                      className=""
                                                      style={{
                                                        width: "19px",
                                                        height: "19px",
                                                      }}
                                                    />
                                                  </span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.incident_date
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <div>
                                                    <span className="color-green">
                                                      OPEN{" "}
                                                    </span>
                                                    / Intake:
                                                  </div>
                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.intake_date
                                                    )}{" "}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <span>Retained:</span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.retained
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-l-5 p-r-5">
                                                  <span>Accepted:</span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.accepted_date
                                                    )}
                                                  </p>
                                                </div>
                                                <div className="d-flex align-items-center text-left font-weight-semibold justify-content-between p-r-5 p-l-5">
                                                  <span>Closed:</span>

                                                  <p>
                                                    {formatDate(
                                                      caseSummaryState?.date_closed
                                                    )}
                                                  </p>
                                                </div>
                                              </td>
                                              <td
                                                style={{ verticalAlign: "top" }}
                                              >
                                                {caseSummaryState?.case_statute_limitations &&
                                                  caseSummaryState?.case_statute_limitations?.map(
                                                    (caseItem, index) => (
                                                      <div
                                                        className="mb-0 p-l-5 p-r-5"
                                                        key={index}
                                                      >
                                                        <div className="col text-left">
                                                          <span className="d-inline-block">
                                                            {caseItem.date_name}
                                                          </span>
                                                        </div>
                                                        <div className="col-auto text-left font-weight-semibold">
                                                          {new Date(
                                                            caseItem?.start_date
                                                          )
                                                            .toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                                timeZone: "UTC",
                                                              }
                                                            )
                                                            .replace(
                                                              /(\w+)\s(\d+),/,
                                                              "$1. $2,"
                                                            )}
                                                        </div>
                                                      </div>
                                                    )
                                                  )}

                                                {Array.from(
                                                  {
                                                    length:
                                                      5 -
                                                      (caseSummaryState
                                                        ?.case_statute_limitations
                                                        ?.length || 0),
                                                  },
                                                  (_, index) => (
                                                    <div
                                                      className="mb-0 p-l-5 p-r-5 "
                                                      key={`empty-${index}`}
                                                      style={{ height: "21px" }}
                                                    ></div>
                                                  )
                                                )}
                                              </td>

                                              <td
                                                style={{ verticalAlign: "top" }}
                                              >
                                                <div className="text-left d-flex align-items-center justify-content-between p-l-5 p-r-5">
                                                  <div className="left-area d-flex align-items-center">
                                                    {caseSummaryState
                                                      ?.for_client
                                                      .profile_pic_19p ? (
                                                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                        <img
                                                          className="w-100 h-100"
                                                          src={
                                                            caseSummaryState
                                                              ?.for_client
                                                              .profile_pic_19p
                                                          }
                                                          alt=""
                                                        />
                                                      </span>
                                                    ) : (
                                                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                                    )}
                                                    <span className="m-l-5 m-r-5 font-weight-semibold">
                                                      {
                                                        caseSummaryState
                                                          ?.for_client
                                                          .first_name
                                                      }{" "}
                                                      {
                                                        caseSummaryState
                                                          ?.for_client.last_name
                                                      }
                                                    </span>
                                                  </div>
                                                  <span className="padding-left35">
                                                    Age
                                                    <span className="font-weight-semibold">
                                                      {" "}
                                                      {calculateAge(
                                                        caseSummaryState
                                                          ?.for_client.birthday
                                                      )}
                                                    </span>
                                                  </span>
                                                </div>

                                                {caseSummaryState?.multipleClient_for_case?.map(
                                                  (x) => (
                                                    <div
                                                      className="mb-0 p-l-5 p-r-5"
                                                      key={x.id}
                                                    >
                                                      <div className="col text-left d-flex align-items-center justify-content-between">
                                                        <div className="left-area d-flex align-items-center">
                                                          {x.new_client
                                                            .profile_pic_19p ? (
                                                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                              <img
                                                                className="w-100 h-100"
                                                                src={
                                                                  x.new_client
                                                                    .profile_pic_19p
                                                                }
                                                                alt=""
                                                              />
                                                            </span>
                                                          ) : (
                                                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                                          )}
                                                          <span className="m-l-5 m-r-5 font-weight-semibold">
                                                            {
                                                              x.new_client
                                                                .first_name
                                                            }{" "}
                                                            {
                                                              x.new_client
                                                                .last_name
                                                            }
                                                          </span>
                                                        </div>
                                                        <span className="padding-left35">
                                                          Age
                                                          <span className="font-weight-semibold">
                                                            {" "}
                                                            {calculateAge(
                                                              x.new_client
                                                                .birthday
                                                            )}
                                                          </span>
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                )}

                                                {Array.from(
                                                  {
                                                    length:
                                                      5 -
                                                      (caseSummaryState
                                                        ?.multipleClient_for_case
                                                        ?.length +
                                                        1),
                                                  },
                                                  (_, index) => (
                                                    <div
                                                      className="mb-0 p-l-5 p-r-5"
                                                      key={`empty-${index}`}
                                                      style={{ height: "21px" }}
                                                    ></div>
                                                  )
                                                )}
                                              </td>
                                              <td
                                                style={{ verticalAlign: "top" }}
                                              >
                                                <ul className="list-unstyled list-firms-contact">
                                                  {caseSummaryState?.case_councelling_firms &&
                                                    caseSummaryState?.case_councelling_firms?.map(
                                                      (firm, index) => (
                                                        <li
                                                          className="d-flex justify-content-between p-l-5 p-r-5"
                                                          key={index}
                                                        >
                                                          <span>
                                                            {
                                                              firm.firm
                                                                .counseling_firm
                                                                .attorneyprofile
                                                                .office_name
                                                            }
                                                          </span>
                                                          <strong>
                                                            {formatPhoneToDashes(
                                                              firm.firm
                                                                .counseling_firm
                                                                .main_contact
                                                                .phone_number
                                                            )}
                                                          </strong>
                                                        </li>
                                                      )
                                                    )}

                                                  {Array.from(
                                                    {
                                                      length:
                                                        5 -
                                                        (caseSummaryState
                                                          ?.case_councelling_firms
                                                          ?.length || 0),
                                                    },
                                                    (_, index) => (
                                                      <li
                                                        className="d-flex justify-content-between p-l-5 p-r-5"
                                                        key={`empty-${index}`}
                                                        style={{
                                                          height: "21px",
                                                        }}
                                                      ></li>
                                                    )
                                                  )}
                                                </ul>
                                              </td>
                                              </>
                                            </tr>
                                          </tbody>
                                        </table> */}
                                          </>
                                        ))}
                                    </div>
                                  </div>
                                ) : (
                                  // <>
                                  //   <div className="text-left p-l-5 p-r-5 case-open">
                                  //     <div
                                  //       className="information-wrapper"
                                  //       role="button"
                                  //       data-toggle="modal"
                                  //       data-target="#edit-case-dates-modal"
                                  //     >
                                  //       <p className="columnsTitle text-primary font-weight-bold text-uppercase text-center">
                                  //         {caseSummaryState?.date_closed ? (
                                  //           <span className="color-grey-2">
                                  //             Case Closed on{" "}
                                  //             {formatDate(
                                  //               caseSummaryState?.date_closed
                                  //             )}
                                  //           </span>
                                  //         ) : (
                                  //           <>
                                  //             <span className="color-green">
                                  //               OPEN{" "}
                                  //             </span>
                                  //             Case
                                  //           </>
                                  //         )}
                                  //       </p>

                                  //       <div className="row mb-0 colFont">
                                  //         <div className="col text-left">
                                  //           <span className="d-inline-block">
                                  //             Intake:
                                  //           </span>
                                  //         </div>
                                  //         <div className="col-auto text-left font-weight-semibold margin-left35">
                                  //           <p>
                                  //             {formatDate(
                                  //               caseSummaryState?.intake_date
                                  //             )}{" "}
                                  //           </p>
                                  //         </div>
                                  //       </div>
                                  //       <div className="row mb-0 colFont">
                                  //         <div className="col text-left">
                                  //           <span className="d-inline-block">
                                  //             Retained:
                                  //           </span>
                                  //         </div>
                                  //         <div className="col-auto text-left font-weight-semibold ">
                                  //           <p>
                                  //             {formatDate(
                                  //               caseSummaryState?.retained
                                  //             )}
                                  //           </p>
                                  //         </div>
                                  //       </div>
                                  //       <div className="row mb-0 colFont">
                                  //         <div className="col text-left">
                                  //           <span className="d-inline-block">
                                  //             Accepted:
                                  //           </span>
                                  //         </div>
                                  //         <div className="col-auto text-left font-weight-semibold ">
                                  //           <p>
                                  //             {formatDate(
                                  //               caseSummaryState?.accepted_date
                                  //             )}{" "}
                                  //           </p>
                                  //         </div>
                                  //       </div>
                                  //       <div className="row mb-0 colFont">
                                  //         <div className="col text-left">
                                  //           <span className="d-inline-block">
                                  //             DOI:
                                  //           </span>
                                  //         </div>
                                  //         <div className="col-auto text-left font-weight-semibold ">
                                  //           <p>
                                  //             {formatDate(
                                  //               caseSummaryState?.incident_date
                                  //             )}
                                  //           </p>
                                  //         </div>
                                  //       </div>
                                  //     </div>
                                  //   </div>
                                  //   <div className="text-left  p-l-5  p-r-5 statue-of-limit ">
                                  //     <div
                                  //       className="information-wrapper"
                                  //       data-toggle="modal"
                                  //     >
                                  //       <p className="columnsTitle text-primary font-weight-bold text-uppercase text-center">
                                  //         Statute of Limitations
                                  //       </p>
                                  // {caseSummaryState?.case_statute_limitations &&
                                  //   caseSummaryState?.case_statute_limitations?.map(
                                  //     (caseItem) => (
                                  //       <div className="row mb-0 colFont">
                                  //         <div className="col text-left">
                                  //           <span className="d-inline-block">
                                  //             {caseItem.date_name}
                                  //           </span>
                                  //         </div>
                                  //         <div className="col-auto text-left font-weight-semibold">
                                  //           {new Date(
                                  //             caseItem?.start_date
                                  //           )
                                  //             ?.toLocaleDateString(
                                  //               "en-US",
                                  //               {
                                  //                 month: "short",
                                  //                 day: "2-digit",
                                  //                 year: "numeric",
                                  //                 timeZone: "UTC",
                                  //               }
                                  //             )
                                  //             .replace(
                                  //               /(\w+)\s(\d+),/,
                                  //               "$1. $2,"
                                  //             )}
                                  //         </div>
                                  //       </div>
                                  //     )
                                  //   )}
                                  //     </div>
                                  //   </div>
                                  //   <div className="text-left  p-l-5 p-r-5 client-on-case client-case-panel0">
                                  //     <div
                                  //       className="information-wrapper"
                                  //       data-toggle="modal"
                                  //     >
                                  //       <p className="columnsTitle text-primary font-weight-bold text-uppercase text-center">
                                  //         Clients On Case
                                  //       </p>
                                  //       <div className="row mb-0 colFont">
                                  // <div className="col text-left d-flex align-items-center justify-content-between">
                                  //   <div className="left-area d-flex align-items-center">
                                  //     {caseSummaryState?.for_client
                                  //       .profile_pic_19p ? (
                                  //       <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
                                  //         <img
                                  //           className="w-100 h-100"
                                  //           src={
                                  //             caseSummaryState
                                  //               .for_client
                                  //               .profile_pic_19p
                                  //           }
                                  //           alt=""
                                  //         />
                                  //       </span>
                                  //     ) : (
                                  //       <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                  //     )}
                                  //     <span className="m-l-5 m-r-5 font-weight-semibold">
                                  //       {
                                  //         caseSummaryState
                                  //           ?.for_client.first_name
                                  //       }{" "}
                                  //       {
                                  //         caseSummaryState
                                  //           ?.for_client.last_name
                                  //       }
                                  //     </span>
                                  //   </div>
                                  //   <span className="padding-left35">
                                  //     Age
                                  //     <span className="font-weight-semibold">
                                  //       {" "}
                                  //       {calculateAge(
                                  //         caseSummaryState
                                  //           ?.for_client.birthday
                                  //       )}
                                  //     </span>
                                  //   </span>
                                  // </div>
                                  //       </div>
                                  // {caseSummaryState?.multipleClient_for_case?.map(
                                  //   (x) => (
                                  //     <div
                                  //       className="row mb-0 colFont"
                                  //       key={x.id}
                                  //     >
                                  //       <div className="col text-left d-flex align-items-center justify-content-between">
                                  //         <div className="left-area d-flex align-items-center">
                                  //           {x.new_client
                                  //             .profile_pic_19p ? (
                                  //             <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
                                  //               <img
                                  //                 className="w-100 h-100"
                                  //                 src={
                                  //                   x.new_client
                                  //                     .profile_pic_19p
                                  //                 }
                                  //                 alt=""
                                  //               />
                                  //             </span>
                                  //           ) : (
                                  //             <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                                  //           )}
                                  //           <span className="m-l-5 m-r-5 font-weight-semibold">
                                  //             {
                                  //               x.new_client
                                  //                 .first_name
                                  //             }{" "}
                                  //             {x.new_client.last_name}
                                  //           </span>
                                  //         </div>
                                  //         <span className="padding-left35">
                                  //           Age
                                  //           <span className="font-weight-semibold">
                                  //             {" "}
                                  //             {calculateAge(
                                  //               x.new_client.birthday
                                  //             )}
                                  //           </span>
                                  //         </span>
                                  //       </div>
                                  //     </div>
                                  //   )
                                  // )}
                                  //     </div>
                                  //   </div>
                                  //   <div className="text-left  p-l-5 p-r-5 client-on-case">
                                  //     <div
                                  //       className="information-wrapper"
                                  //       data-toggle="modal"
                                  //     >
                                  //       <p className="columnsTitle text-primary font-weight-bold text-uppercase text-center">
                                  //         CO-COUNSELlING FIRMS
                                  //       </p>
                                  // <ul className="list-unstyled list-firms-contact">
                                  //   {caseSummaryState?.case_councelling_firms &&
                                  //     caseSummaryState?.case_councelling_firms?.map(
                                  //       (firm, index) => (
                                  //         <li
                                  //           className="d-flex justify-content-between"
                                  //           key={index}
                                  //         >
                                  //           <span>
                                  //             {
                                  //               firm.firm
                                  //                 .counseling_firm
                                  //                 .attorneyprofile
                                  //                 .office_name
                                  //             }
                                  //           </span>
                                  //           <strong>
                                  //             {formatPhoneToDashes(
                                  //               firm.firm
                                  //                 .counseling_firm
                                  //                 .main_contact
                                  //                 .phone_number
                                  //             )}
                                  //           </strong>
                                  //         </li>
                                  //       )
                                  //     )}
                                  // </ul>
                                  //     </div>
                                  //   </div>
                                  // </>
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Stack direction="row" spacing={2}>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                    </Stack>
                                    <Stack
                                      width={200}
                                      direction="row"
                                      spacing={2}
                                      sx={{
                                        alignItems: "center",
                                      }}
                                    >
                                      <Skeleton
                                        variant="rectangular"
                                        height={90}
                                        width={90}
                                      />
                                      <Skeleton
                                        variant="rectangular"
                                        height={90}
                                        width={90}
                                      />
                                    </Stack>
                                  </Stack>
                                )}
                              </div>
                              <div className="col-auto d-flex p-0 top-panel-first-row-case-page-responsiveness top-content-panels flex-g-1 p-t-5 d-xxl-none">
                                {caseSummaryState ? (
                                  <div
                                    className="d-flex align-items-center"
                                    style={{ width: "100%" }}
                                  >
                                    <div
                                      className="m-r-5"
                                      style={{ width: "255px" }}
                                    >
                                      {tableData
                                        .slice(0, 1)
                                        .map((data, idx) => (
                                          <>
                                            <CasePanelInfoTable
                                              key={idx}
                                              id={idx}
                                              heading={data.heading}
                                              data={data.data}
                                              target={data.target}
                                              button={data.button}
                                              leftHand={data.leftHand}
                                              onClick={data.onClick}
                                            />
                                          </>
                                        ))}
                                    </div>
                                    <div
                                      className="d-flex"
                                      style={{
                                        width: "calc(100% - 255px)",
                                        gap: "5px",
                                      }}
                                    >
                                      {tableData
                                        .slice(1, 3)
                                        .map((data, idx) => (
                                          <>
                                            <CasePanelInfoTable
                                              key={idx}
                                              id={idx}
                                              heading={data.heading}
                                              data={data.data}
                                              target={data.target}
                                              button={data.button}
                                              leftHand={data.leftHand}
                                              onClick={data.onClick}
                                            />
                                          </>
                                        ))}
                                    </div>
                                  </div>
                                ) : (
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Stack direction="row" spacing={2}>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                      <Stack width={200}>
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                        <Skeleton
                                          variant="text"
                                          sx={{ fontSize: "1rem" }}
                                        />
                                      </Stack>
                                    </Stack>
                                    <Stack
                                      width={200}
                                      direction="row"
                                      spacing={2}
                                      sx={{
                                        alignItems: "center",
                                      }}
                                    >
                                      <Skeleton
                                        variant="rectangular"
                                        height={90}
                                        width={90}
                                      />
                                      <Skeleton
                                        variant="rectangular"
                                        height={90}
                                        width={90}
                                      />
                                    </Stack>
                                  </Stack>
                                )}
                              </div>
                              <div className="panel-pictures d-flex-1 p-0 position-relative z-index-1 p-t-5 p-l-5 d-none d-xxl-block">
                                <div className="row justify-content-md-end no-gutters flex-nowrap case-photos f-gap-05">
                                  {caseSummaryState?.processed_photo_slots &&
                                    caseSummaryState?.processed_photo_slots?.map(
                                      (photo_slot) => (
                                        <>
                                          {photo_slot ? (
                                            <>
                                              {photo_slot.photo_slot
                                                .slot_number === 1 && (
                                                <div className="image-1">
                                                  <div className="img-cover-block img-box">
                                                    {photo_slot.case_thumbnail ? (
                                                      <img
                                                        src={
                                                          photo_slot.case_thumbnail
                                                        }
                                                        className="img-cover object-center d-flex"
                                                        style={{
                                                          maxHeight: "155px",
                                                          maxWidth: "255px",
                                                          width: "auto",
                                                          height: "auto",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : (
                                                      <DefaultThumbnail
                                                        height="155px"
                                                        width="255px"
                                                        cloudSnowColor="var(--primary-10)"
                                                        colorSunMountain="var(--primary-15)"
                                                        borderColor="var(--primary-20)"
                                                        photoData={photo_slot}
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                              )}

                                              {photo_slot.photo_slot
                                                .slot_number === 2 && (
                                                <div className="image-2">
                                                  <div className="img-cover-block img-box d-flex ">
                                                    {photo_slot.case_thumbnail ? (
                                                      <img
                                                        src={
                                                          photo_slot.case_thumbnail
                                                        }
                                                        className="img-cover"
                                                        style={{
                                                          maxHeight: "155px",
                                                          maxWidth: "255px",
                                                          width: "auto",
                                                          height: "auto",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : (
                                                      <DefaultThumbnail
                                                        height="155px"
                                                        width="255px"
                                                        cloudSnowColor="var(--primary-10)"
                                                        colorSunMountain="var(--primary-15)"
                                                        borderColor="var(--primary-20)"
                                                        photoData={photo_slot}
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                              )}

                                              {photo_slot.photo_slot
                                                .slot_number === 3 && (
                                                <div className="image-3">
                                                  <div className="img-cover-block img-box d-flex">
                                                    {photo_slot.case_thumbnail ? (
                                                      <img
                                                        src={
                                                          photo_slot.case_thumbnail
                                                        }
                                                        className="img-cover"
                                                        style={{
                                                          maxHeight: "155px",
                                                          maxWidth: "255px",
                                                          width: "auto",
                                                          height: "auto",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : (
                                                      <DefaultThumbnail
                                                        height="155px"
                                                        width="255px"
                                                        cloudSnowColor="var(--primary-10)"
                                                        colorSunMountain="var(--primary-15)"
                                                        borderColor="var(--primary-20)"
                                                        photoData={photo_slot}
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          ) : (
                                            <DefaultThumbnail
                                              height="155px"
                                              width="255px"
                                              cloudSnowColor="var(--primary-10)"
                                              colorSunMountain="var(--primary-15)"
                                              borderColor="var(--primary-20)"
                                              photoData={photo_slot}
                                            />
                                          )}
                                        </>
                                      )
                                    )}
                                </div>
                              </div>
                              <div
                                className="d-flex w-100 d-xxl-none"
                                style={{ gap: "5px" }}
                              >
                                <div
                                  className="d-flex d-xxl-none"
                                  style={{
                                    width: "100%",
                                  }}
                                >
                                  {tableData.slice(3, 4).map((data, idx) => (
                                    <>
                                      <CasePanelInfoTable
                                        key={idx}
                                        id={idx}
                                        heading={data.heading}
                                        data={data.data}
                                        target={data.target}
                                        width="100%"
                                        button={data.button}
                                        leftHand={data.leftHand}
                                        onClick={data.onClick}
                                      />
                                    </>
                                  ))}
                                </div>
                                <div className="panel-pictures d-flex-1 p-0 position-relative z-index-1">
                                  <div className="row justify-content-md-end no-gutters flex-nowrap case-photos f-gap-05">
                                    {caseSummaryState?.processed_photo_slots &&
                                      caseSummaryState?.processed_photo_slots?.map(
                                        (photo_slot) => (
                                          <>
                                            {photo_slot ? (
                                              <>
                                                {photo_slot.photo_slot
                                                  .slot_number === 1 && (
                                                  <div className="image-1">
                                                    <div className="img-cover-block img-box">
                                                      {photo_slot.case_thumbnail ? (
                                                        <img
                                                          src={
                                                            photo_slot.case_thumbnail
                                                          }
                                                          className="img-cover object-center d-flex"
                                                          style={{
                                                            maxHeight: "155px",
                                                            maxWidth: "255px",
                                                            width: "auto",
                                                            height: "auto",
                                                            objectFit:
                                                              "contain",
                                                          }}
                                                        />
                                                      ) : (
                                                        <DefaultThumbnail
                                                          height="155px"
                                                          width="255px"
                                                          cloudSnowColor="var(--primary-10)"
                                                          colorSunMountain="var(--primary-15)"
                                                          borderColor="var(--primary-20)"
                                                          photoData={photo_slot}
                                                        />
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                                {photo_slot.photo_slot
                                                  .slot_number === 2 && (
                                                  <div className="image-2">
                                                    <div className="img-cover-block img-box d-flex ">
                                                      {photo_slot.case_thumbnail ? (
                                                        <img
                                                          src={
                                                            photo_slot.case_thumbnail
                                                          }
                                                          className="img-cover"
                                                          style={{
                                                            maxHeight: "155px",
                                                            maxWidth: "255px",
                                                            width: "auto",
                                                            height: "auto",
                                                            objectFit:
                                                              "contain",
                                                          }}
                                                        />
                                                      ) : (
                                                        <DefaultThumbnail
                                                          height="155px"
                                                          width="255px"
                                                          cloudSnowColor="var(--primary-10)"
                                                          colorSunMountain="var(--primary-15)"
                                                          borderColor="var(--primary-20)"
                                                          photoData={photo_slot}
                                                        />
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                                {photo_slot.photo_slot
                                                  .slot_number === 3 && (
                                                  <div className="image-3">
                                                    <div className="img-cover-block img-box d-flex">
                                                      {photo_slot.case_thumbnail ? (
                                                        <img
                                                          src={
                                                            photo_slot.case_thumbnail
                                                          }
                                                          className="img-cover"
                                                          style={{
                                                            maxHeight: "155px",
                                                            maxWidth: "255px",
                                                            width: "auto",
                                                            height: "auto",
                                                            objectFit:
                                                              "contain",
                                                          }}
                                                        />
                                                      ) : (
                                                        <DefaultThumbnail
                                                          height="155px"
                                                          width="255px"
                                                          cloudSnowColor="var(--primary-10)"
                                                          colorSunMountain="var(--primary-15)"
                                                          borderColor="var(--primary-20)"
                                                          photoData={photo_slot}
                                                        />
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            ) : (
                                              <DefaultThumbnail
                                                height="155px"
                                                width="255px"
                                                cloudSnowColor="var(--primary-10)"
                                                colorSunMountain="var(--primary-15)"
                                                borderColor="var(--primary-20)"
                                                photoData={photo_slot}
                                              />
                                            )}
                                          </>
                                        )
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </div>
                      </div> */}
                      <div className="row m-b-5 m-t-5">
                        <div className="col-12">
                          <div className="table-responsive table--no-card border-0 has-table-sub-panel">
                            <div className="d-xxl-none">
                              <MedicalProviders />
                            </div>

                            <div className="d-none d-xxl-block">
                              <MedicalProvidersTable />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="fixed-width-255 content-right responsive-sidebar overflow-hidden m-b-5 m-t-5 p-0"
                      id="content-right"
                    >
                      <div className="right-calendar h-100 border-0 p-0 case-width-250px">
                        <div className="calendar-borders position-relative border-0 h-auto">
                          <h4
                            className="client-contact-title text-center d-flex justify-content-center align-items-center"
                            style={{
                              height: "25px",
                              backgroundColor: "var(--primary-15)",
                            }}
                          >
                            Case Timeline
                          </h4>
                          {timelineEvents?.map((temp) => (
                            <>
                              <div
                                key={temp.id}
                                className="d-flex justify-content-between task"
                                style={{ padding: "0px 5px", height: "21px" }}
                              >
                                <div>
                                  <strong>
                                    {new Date(temp.date).toLocaleDateString(
                                      "en-US",
                                      { weekday: "long" }
                                    )}
                                  </strong>{" "}
                                </div>
                                <div>
                                  <strong>
                                    {new Date(temp.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric",
                                      }
                                    )}
                                  </strong>
                                </div>
                              </div>
                              <div
                                key={temp.id + "_events"}
                                className="task d-block"
                                style={{ padding: "0px 5px", height: "21px" }}
                              >
                                {temp.events &&
                                  temp.events?.map((x) => (
                                    <React.Fragment key={x.id}>
                                      {x.type === "Litigation" ? (
                                        x.event.is_allday ? (
                                          <div className="d-flex justify-content-between">
                                            <span>all-day</span>
                                            <span className="text-right d-block">
                                              <i></i> {x?.event?.name}
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="d-flex justify-content-between">
                                            <span>
                                              {new Date(
                                                x.event.start_date
                                              ).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                timeZone: "UTC",
                                              })}{" "}
                                            </span>{" "}
                                            <span className="text-right d-block full-width">
                                              <i></i> {x?.event?.name}
                                            </span>
                                          </div>
                                        )
                                      ) : (
                                        x.type === "TreatmentDates" && (
                                          <div className="d-flex justify-content-between">
                                            <div
                                              className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                              style={{
                                                backgroundColor:
                                                  x.event.for_provider.specialty
                                                    ?.color,
                                              }}
                                            >
                                              {
                                                x?.event?.for_provider
                                                  ?.specialty?.name[0]
                                              }
                                            </div>
                                            <span className="text-right d-block full-width">
                                              {
                                                x?.event?.for_provider?.provider
                                                  ?.providerprofile?.office_name
                                              }
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </React.Fragment>
                                  ))}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            <div className="d-flex">
              <ContactPanelWithoutButtons
                id={currentCase?.id}
                panel_name="Case Home Office"
                title={""}
                name={currentCase?.for_client?.created_by?.office_name}
                address1={currentCase?.firm_addresses?.address1}
                address2={currentCase?.firm_addresses?.address2}
                city={currentCase?.firm_addresses?.city}
                state={currentCase?.firm_addresses?.stateAbr}
                zip_code={currentCase?.firm_addresses?.zip}
                phone_number={currentCase?.firm_addresses?.phone_number}
                ext={currentCase?.firm_addresses?.phone_ext ?? ""}
                fax_number={currentCase?.firm_addresses?.fax}
                onSelectObject={() => {
                  setIsChangeFirmAddress(true);
                }}
                className="max-panel-width-case-page"
              />
              <WorkersOnCase />
            </div>
            <div className="row esignatures-wrapper no-gutters m-b-5">
              <div className="col-12">
                <div
                  className="p-l-5 height-25"
                  style={{ backgroundColor: "var(--primary-15)" }}
                >
                  <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                    E-Signature Templates for Case
                  </h4>
                </div>{" "}
                <div className="row redtd2 bg-primary-5 align-items-center flex-row position-relative m-0">
                  <div className="icon-text-boxes esignatures-cols-wrapper d-flex flex-wrap w-100 e-template-row">
                    {currentCase &&
                      currentCase?.sign_templates_for_page?.map((signedDoc) => (
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center"
                          id="no-vertical-border"
                          key={signedDoc?.signed_document_id}
                        >
                          <span className="text-lg d-flex align-items-center justify-content-center text-darkest-grey">
                            {signedDoc?.status}
                            <i className="ic ic-16 ic-md-19 ic-esignature m-r-5 m-l-5" />
                          </span>
                          <p className="name">{signedDoc?.template_name}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row documents-wrapper">
              <div className="col-12">
                <div className="background-main-10 height-25"></div>
                <div className="row redtd2 icon-text-boxes-wrap flex-row position-relative ml-0 mr-0 m-0">
                  <div className="col p-0">
                    <div className="d-flex justify-content-start w-100">
                      <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-93-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('93','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">
                            1. Signed Agreement
                          </p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-94-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('94','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">
                            2. Designation of Representation
                          </p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-95-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('95','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">3. Available</p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-96-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('96','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">4. Available</p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-97-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('97','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">5. Available</p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-98-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('98','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">6. Available</p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-99-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('99','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">7. Available</p>
                        </div>{" "}
                        <div
                          className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-100-1"
                          id="no-vertical-border"
                          onclick="uploadPopUp('100','','1')"
                        >
                          <p className="date" />
                          <span className="icon-wrap">
                            <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer" />
                          </span>{" "}
                          <p className="name text-lg-grey">8. Available</p>
                        </div>{" "}
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
                          <div className="upload-icon dropzone-page border-0 rounded-0 bg-transparent dz-clickable">
                            <div className="d-flex align-items-center">
                              <span className="font-weight-bold text-gold h5 m-0 pr-2">
                                +
                              </span>
                              <span className="text-lg-grey">
                                Upload Document to Page
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                </div>
              </div>{" "}
            </div> */}
            <div className="row documents-wrapper m-t-5">
              <div className="col-12">
                <div className="height-25">
                  <h4
                    className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case font-weight-semibold text-center client-contact-title"
                    style={{ backgroundColor: "var(--primary-15)" }}
                  >
                    Case Document Row
                  </h4>
                </div>

                {caseSummaryState && (
                  <DocumentRow
                    clientProvider={caseSummaryState?.id}
                    page="Case"
                  />
                )}
              </div>
            </div>
            <NotesSectionDashboard />
          </div>
          {/* <AttachOrEditCaseWorkerModal
          setOpen={setCounsellingOpen}
          open={counsellingOpen}
        /> */}
          <CounsellingModal
            setOpen={setCounsellingOpen}
            open={counsellingOpen}
            close={handleClose}
          />
          <AddNewClientModal
            setOpen={setAddNewClientOnCase}
            open={addNewClientOnCaseOpen}
          />
          <ChangeOfficeFirmLocationModal
            showModal={isChangeFirmAddress}
            handleClose={() => setIsChangeFirmAddress(false)}
          />
        </div>
      </>
    </div>
  );
};

export default SearchDashboard;
