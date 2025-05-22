import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchPage from "../Modules/SearchPage";
import RedirectPage from "../Modules/RedirectPage";
import GoogleAuthRedirect from "../Modules/GoogleAuthRedirect";
import GoogleCalendarRedirect from "../Modules/GoogleCalendarRedirect";
import QuickBooksAuthRedirect from "../Modules/QuickBooksAuthRedirect";

// import ClientPage from "../Modules/ClientPage";
import LoginPage from "../Modules/LoginPage";
import { getCaseId, getClientId, getToken, removeToken } from "../Utils/helper";
import InboxPage from "../Modules/InboxPage";
import { useDispatch, useSelector } from "react-redux";
import CostPage from "../Modules/CostPage";
import CasePage from "../Modules/CasePage";
import AccidentPage from "../Modules/AccidentPage";
import ToDoPage from "../Modules/ToDoPage";
import InjuryPage from "../Modules/InjuryPage";
// import { DocumentModalProvider } from "../Components/DocumentModal/DocumentModalContext";
import DocumentModal from "../Components/DocumentModal";
import { DocumentModalProvider as PhotoDocumentModalProvider } from "../Components/PhotoDocumentModal/DocumentModalContext";
import PhotoDocumentModal from "../Components/PhotoDocumentModal/index";
import EditCaseProviderModal from "../Components/EditCaseProviderModal";
import { fetchCurrentClient } from "../Redux/client/clientSlice";
import {
  fetchAllPages,
  fetchAllStages,
  fetchCommutativeChecklist,
  fetchCurrentCase,
} from "../Redux/caseData/caseDataSlice";
import ChatPage from "../Modules/ChatPage";
import CourtForm from "../Modules/CourtForm";

// import Treatment from "../Components/BP/treatment"
// import Simple from "../Components/BP/simple"
import { useIdleTimer } from "react-idle-timer";
import {
  autoLogoutAPI,
  getNotificationCountChatAPI,
  getToDoCountAPI,
  markReadToDoItemsAPI,
  markReadFlaggedPageItemsAPI,
  getFlaggedPageCountAPI,
} from "../Providers/main";
import EditCaseTypeDateModal from "../Components/EditCaseTypeDateModal";
import TreatmentPage from "../Modules/TreatmentPage";
import TreatmentPageTemp from "../Modules/TreatmentPageTemp";
import SimplePage from "../Modules/SimplePage";
import DatesPage from "../Modules/DatesPage";
import { persistor } from "../Redux/store";
import InactivityModal from "../Components/Modals/inactivityModal";
import WorkListPage from "../Modules/WorkListPage";
import ClientPage from "../Modules/ClientPage";
import LitigationPage from "../Modules/LitigationsPage";
import ImageGalleryModal from "../Components/CaseAccident/ImageGalleryModal";
import EditNote from "../Components/Modals/EditNote";
import VehicleLocationModal from "../Components/Modals/VehicleLocationModal";
import CarDetailsModal from "../Components/Modals/CarDetailsModal";
import VehicleDescriptionModal from "../Components/Modals/VehicleDescriptionModal";
import WitnessesPage from "../Modules/WitnessesPage";
import IndividualNotesModal from "../Components/CaseAccident/IndividualNotesModal";
import AttachUserModal from "../Components/CaseDashboard/AttachUserModal";
import Calendar from "../Components/Calendar/Calendar";
// import AddFirmUserModal from "../Components/CaseDashboard/AddFirmUserModal";
import NotesSectionPage from "../Modules/NotesSectionPage";
import ReportPage from "../Modules/ReportPage";
import InsurancePage from "../Modules/InsurancePage";
import PhotoPage from "../Modules/PhotoPage";
import DocPage from "../Modules/DocPage";
import CoPilotPage from "../Modules/CoPilotPage";

import LawFirmDirectory from "../Modules/LawFirmDirectory";
import ExpertsPage from "../Modules/ExpertsPage";
import CaseNavigatorPage from "../Modules/CaseNavigatorPage";
import FlaggedCasesPage from "../Modules/FlaggedCasesPage";
import DefendantPage from "../Modules/DefendantPage";
import { setTotalChatCount } from "../Redux/chat/actions";
import { setToDoCount, setFlaggedPageCount } from "../Redux/general/actions";
import useWebSocket, { ReadyState } from "react-use-websocket";
import WitnessesPage2 from "../Modules/WitnessesPage2";

import CheckListPage from "../Modules/CheckListPage"; // checklist page
import TimePage from "../Modules/TimePage";
import HomePage from "../Components/Home/HomePage";
import EmploymentPage from "../Modules/EmploymentPage";
import ESignPage from "../Components/DocumentModal/DocumentSideBar/ESignPage";
import { DocumentModalProvider } from "../Components/common/CustomModal/CustomModalContext";
import CheckListsPage from "../Modules/CheckListsPage";
import FirmSetting from "../Modules/FirmSettingsPage";
import WordProcessor from "../Modules/WordProcessor";
import AssembleDocument from "../Components/AssembleDocument/AssembleDocument";
import AssembleDocumentModal from "../Components/AssembleDocumentModal";
import api from "../api/api";
import { InactivityProvider } from "../Providers/inactivity";
import SettlementPage from "../Modules/SettlementPage";
import AccountingPage from "../Modules/Accounting";
import GoogleDriveRedirect from "../Modules/GoogleDriveRedirect";
import DropboxRedirect from "../Modules/DropboxRedirect";
import BoxRedirect from "../Modules/BoxRedirect";
import MsAuthRedirect from "../Modules/MsAuthRedirect";
import MsCalendarRedirect from "../Modules/MsCalendarRedirect";
import MsOneDriveRedirect from "../Modules/MsOneDriveRedirect";
import CaseLoansPage from "../Modules/CaseLoansPage";
import SvgDefs from "../Components/BP/modals/CaseProviderModals/SvgDefs";
import OtherPartiesPage from "../Modules/OtherPartiesPage";
import PhotoPage2 from "../Modules/PhotoPage2";

// import { DocumentModalProvider } from "../Components/DocumentModal/DocumentModalContext";

const Main = () => {
  console.warn = () => {};
  console.error = () => {};
  const dispatch = useDispatch();
  let token = getToken();

  const [authToken, setAuthToken] = useState(getToken());

  useEffect(() => {
    const handleStorageChange = (e) => {
      setAuthToken(getToken());
    };

    setAuthToken(getToken());

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const webSocketLink = process.env.REACT_APP_BACKEND_URL.includes("http://")
    ? `ws://${process.env.REACT_APP_BACKEND_URL.replace("http://", "")}`
    : `wss://${process.env.REACT_APP_BACKEND_URL.replace("https://", "")}`;
  const [socketUrl, setSocketUrl] = useState(
    `wss://websockets.simplefirm.com/30/32/${getClientId()}/${getCaseId()}/?chat_token=12345&username=${localStorage.getItem("username")}`
  );
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    share: false,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    getNotificationCountChatAPI(dispatch, setTotalChatCount);
  }, [lastMessage]);

  const [socketUrlToDo, setSocketUrlToDo] = useState(
    `wss://websockets.simplefirm.com/todo/?username=${localStorage.getItem("username")}`
  );
  const { lastMessage: lastMessageToDo, readyState: readyStateToDo } =
    useWebSocket(socketUrlToDo, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    getToDoCountAPI(dispatch, setToDoCount);
    getFlaggedPageCountAPI(dispatch, setFlaggedPageCount);

    if (window.location.href.includes("work-list")) {
      markReadToDoItemsAPI(dispatch, setToDoCount);
    }
    if (window.location.href.includes("flaggedcases")) {
      markReadFlaggedPageItemsAPI(dispatch, setFlaggedPageCount);
    }
    if (lastMessageToDo?.data) {
      let message = JSON.parse(lastMessageToDo?.data);
      if (message?.flagged_page_unread_count) {
        dispatch(setFlaggedPageCount(message.flagged_page_unread_count));
      }
      if (message?.unread_count) {
        dispatch(setToDoCount(message.unread_count));
      }
    }
  }, [lastMessageToDo]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const connectionStatusToDo = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyStateToDo];

  const [inactivityModalShow, setInactivityModalShow] = useState(false);
  const [timeoutTime, setTimeoutTime] = useState(null);
  const inactivityTimeout = useSelector(
    (state) => state.general.inactivityTimeout
  );
  const page_id_click_record = useSelector(
    (state) => state.page_id_click_record.page_id_click_record
  );
  // const onIdle = async () => {
  //   if (getToken()) {
  //     try {
  //       await api.post("/api/general/click_record/", {
  //         click: -inactivityTimeout,
  //         case_id: getCaseId(),
  //         client_id: getClientId(),
  //         page_id: page_id_click_record,
  //       });

  //       autoLogoutAPI(getClientId(), getCaseId());
  //       removeToken();
  //       persistor.pause();
  //       persistor.flush().then(() => {
  //         return persistor.purge();
  //       });
  //       window.location.href = "/";
  //       window.location.reload();
  //     } catch (error) {
  //       console.error("error occured", error);
  //     }
  //   } else {
  //     console.log("Already logged out.");
  //   }
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeoutTime(parseInt(getRemainingTime() / 1000));
  //   }, 1000);
  // }, []);

  // const onIdleWarning = () => {
  //   if (getToken()) {
  //     setInactivityModalShow(true);
  //   } else {
  //     console.log("Already logged out.");
  //   }
  // };

  // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  //   onIdle: onIdle,
  //   timeout: parseInt(inactivityTimeout) * 60 * 1000,
  //   throttle: 500,
  // });

  // useIdleTimer({
  //   onIdle: onIdleWarning,
  //   timeout: parseInt(inactivityTimeout) * 60 * 1000 - 60 * 1000,
  //   throttle: 500,
  // });

  useEffect(() => {
    if (authToken) {
      dispatch(fetchCurrentClient(getClientId()));
      dispatch(fetchCurrentCase(getClientId(), getCaseId()));
      dispatch(fetchAllPages(getCaseId()));
      dispatch(fetchAllStages());
      dispatch(fetchCommutativeChecklist(getClientId(), getCaseId()));
    }
  }, [authToken]);

  useEffect(() => {
    const handleUnload = (event) => {
      const [navigation] = performance.getEntriesByType("navigation");

      if (navigation && navigation.type !== "reload") {
        // autoLogoutAPI(getClientId(), getCaseId());
        // removeToken();
        return "logout";
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  const loggedInRoutes = [
    <Route
      key="inbox-page-main"
      path={"/inbox/:clientId/:caseId"}
      element={<InboxPage />}
    />,
    <Route
      key="client-page"
      path={"/bp-client/:clientId/:caseId"}
      element={<ClientPage />}
    />,
    // <Route key="cost-page"  path="/bp-costs" element={<CostPage />} />,
    <Route
      key="todo-page"
      path={"/bp-todo/:clientId/:caseId"}
      element={<ToDoPage />}
    />,
    <Route
      key="worklist"
      path={"/work-list/:clientId/:caseId"}
      element={<WorkListPage />}
    />,
    <Route
      key="injuries-page"
      path={"/bp-injuriessub/:clientId/:caseId"}
      element={<InjuryPage />}
    />,
    <Route
      key="witness-page"
      path={"/bp-witnesses/bp-witnesses"}
      element={<WitnessesPage2 />}
    />,
    <Route
      key="case-page"
      // path={"/bp-case/" + getClientId() + "/" + getCaseId()}
      path={"/bp-case/:clientId/:caseId"}
      element={<CasePage />}
    />,
    <Route
      key="cost-page-2"
      path={"/bp-costs/:clientId/:caseId"}
      element={<CostPage />}
    />,
    <Route
      key="chat-page"
      path={"/chat/:clientId/:caseId"}
      element={<ChatPage />}
    />,
    <Route
      key="flaggedcases-page"
      path={"/bp-flaggedcases/:clientId/:caseId"}
      element={<FlaggedCasesPage />}
    />,
    <Route
      key="chat-page"
      path={"/bp-caraccident/:clientId/:caseId"}
      element={<AccidentPage />}
    />,

    <Route
      key="treamtment-page"
      path="/treatment/"
      element={<TreatmentPage />}
    />,

    <Route
      key="insurance-page"
      path={"/bp-insurance/:clientId/:caseId"}
      element={<InsurancePage />}
    />,

    <Route
      key="simple-page"
      path="/simple/"
      element={<SimplePage case_id={getCaseId()} />}
    />,

    <Route
      key="dates-page"
      path="/dates/"
      element={<DatesPage case_id={getCaseId()} />}
    />,
    <Route
      key="treatment-temp-page"
      path="/TreatmentPageTemp/"
      element={<TreatmentPageTemp case_id={getCaseId()} />}
    />,
    <Route key="search-page" path={"/search/"} element={<SearchPage />} />,
    <Route
      key="note-page"
      path={"/bp-note/:clientId/:caseId"}
      element={<NotesSectionPage />}
    />,
    <Route
      key="directory-page"
      path={"/bp-lawfirmdirectory/:clientId/:caseId"}
      element={<LawFirmDirectory />}
    />,
    <Route
      key="employment-page"
      path={"bp-employment/:clientId/:caseId"}
      element={<EmploymentPage />}
    />,
    <Route
      key="reports-page"
      path={"/bp-reports/:clientId/:caseId"}
      element={<ReportPage />}
    />,
    <Route
      key="photos-page"
      path={"/bp-photo2/:clientId/:caseId"}
      element={<PhotoPage2 client_id={getClientId()} case_id={getCaseId()} />}
    />,
    <Route
      key="photos-page"
      path={"/bp-photo/:clientId/:caseId"}
      element={<PhotoPage />}
    />,
    <Route
      key="documents-page"
      path={"/bp-documents/:clientId/:caseId"}
      element={<DocPage />}
    />,
    <Route
      key="navigator-page"
      path={"/bp-navigator/:clientId/:caseId"}
      element={<CaseNavigatorPage />}
    />,
    <Route
      key="defendants-page"
      path={"/bp-defendants/:clientId/:caseId"}
      element={<DefendantPage />}
    />,
    <Route
      key="checklists-page"
      path={"/bp-checkLists/:clientId/:caseId"}
      element={<CheckListsPage />}
    />,
    <Route
      key="experts-page"
      path={"/bp-experts/:clientId/:caseId"}
      element={<ExpertsPage />}
    />,
    <Route
      key="calender-page"
      path={"/bp-calendar/:clientId/:caseId"}
      element={<Calendar />}
    />,

    <Route
      key="checklist"
      // path={"/checklist/" + getClientId() + "/" + getCaseId()}
      path={"/checklist/"}
      element={<CheckListPage />}
    />,

    <Route
      key="litigation-page"
      path={"/bp-litigation/:clientId/:caseId"}
      element={<LitigationPage />}
    />,

    <Route
      key="time-page"
      path={"/bp-timePage/:clientId/:caseId"}
      element={<TimePage />}
    />,

    <Route
      key="bp-home"
      path={"/bp-home/:clientId/:caseId"}
      element={<HomePage />}
    />,

    <Route
      key="esign-page"
      path={"/esign/:docId/:clientId/:caseId"}
      element={<ESignPage />}
    />,
    <Route
      key="firm-settings"
      path={"/bp-firmsetting/:clientId/:caseId"}
      element={<FirmSetting />}
    />,
    <Route
      key="wordprocessor"
      path={"/bp-wordprocessor/:clientId/:caseId"}
      element={<WordProcessor />}
    />,

    <Route
      key="copilot-page"
      path={"/bp-copilot/:clientId/:caseId"}
      element={<CoPilotPage />}
    />,
    <Route
      key="court-forms"
      path={"/bp-courtform/:clientId/:caseId"}
      element={<CourtForm />}
    />,
    <Route
      key="settlement-page"
      path={"/bp-settlement/:clientId/:caseId"}
      element={<SettlementPage />}
    />,
    <Route
      key="accounts-page"
      path={"/bp-accounting/:clientId/:caseId"}
      element={<AccountingPage />}
    />,
    <Route
      key="caseloan-page"
      path={"/bp-caseloan/:clientId/:caseId"}
      element={<CaseLoansPage />}
    />,
    <Route
      key="other-parties"
      path={"/bp-otherparties/:clientId/:caseId"}
      element={<OtherPartiesPage />}
    />,
  ];

  const loggedOutRoutes = [
    <Route key="login-page" path="/*" element={<LoginPage />} />,
  ];

  return (
    <>
      <Router>
        <InactivityProvider>
          <SvgDefs />
          <InactivityModal />
          <VehicleLocationModal />
          <CarDetailsModal />
          <VehicleDescriptionModal />
          <EditNote />
          <ImageGalleryModal />
          {/* <EditCaseProviderModal /> */}
          <EditCaseTypeDateModal />
          <IndividualNotesModal />
          <AttachUserModal />
          {/* <AddFirmUserModal /> */}
          <DocumentModalProvider>
            <DocumentModal />
            {/* <PhotoDocumentModalProvider> */}
            <PhotoDocumentModal />
            <AssembleDocumentModal />

            <Routes>
              <Route
                key="inbox-page"
                path={"/redirect/inbox/"}
                element={<RedirectPage />}
              />
              <Route
                key="case-page"
                path={"/redirect/case/"}
                element={<RedirectPage />}
              />
              <Route
                key="bp-todo"
                path={"/redirect/todo/"}
                element={<RedirectPage />}
              />
              <Route
                key="bp-injuriessub"
                path={"/redirect/injury/"}
                element={<RedirectPage />}
              />
              <Route
                key="bp-google-redirect-with-auth"
                path={"/google_redirect_with_auth/"}
                element={<GoogleAuthRedirect />}
              />
              <Route
                key="bp-google-calendar-redirect"
                path={"/google_calendar_redirect_with_auth/"}
                element={<GoogleCalendarRedirect />}
              />
              <Route
                key="bp-quickBooksRedirect"
                path={"/quickBooksRedirect/"}
                element={<QuickBooksAuthRedirect />}
              />
              <Route
                key="bp-google-drive-redirect"
                path={"/google_drive_redirect/"}
                element={<GoogleDriveRedirect />}
              />
              <Route
                key="bp-box-redirect"
                path={"/box_redirect/"}
                element={<BoxRedirect />}
              />
              <Route
                key="bp-dropbox-redirect"
                path={"/dropbox_redirect/"}
                element={<DropboxRedirect />}
              />
              <Route
                key="bp-ms-auth-redirect"
                path={"/msRedirect/"}
                element={<MsAuthRedirect />}
              />
              <Route
                key="bp-ms-calendar-redirect"
                path={"/msCalendarRedirect/"}
                element={<MsCalendarRedirect />}
              />
              <Route
                key="bp-ms-onedrive-redirect"
                path={"/msOneDriveRedirect/"}
                element={<MsOneDriveRedirect />}
              />
              ,
              {/* {[
                          !token && loggedOutRoutes,
                          token && loggedInRoutes
                      ]} */}
              {authToken
                ? loggedInRoutes.map((route) => route)
                : loggedOutRoutes.map((route) => route)}
            </Routes>
            {/* </PhotoDocumentModalProvider> */}
          </DocumentModalProvider>
        </InactivityProvider>
      </Router>
    </>
  );
};

export default Main;
