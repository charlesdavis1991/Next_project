import React from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import { useSelector } from "react-redux";
import Footer from "../Components/common/footer";
import { CheckRequestModalProvider } from "../Components/AccountsDashboard/CheckRequestModalContext";
import { AlertCheckNotRequestedProvider } from "../Components/AccountsDashboard/AlertCheckNotRequestedModalContext";
import { AccountsManagementProvider } from "../Components/AccountsDashboard/AccountsManagementContext";
import { UpdateTriggerProvider } from "../Components/AccountsDashboard/TriggerUpdateContext";
import AccountsDashboard from "../Components/AccountsDashboard";
import AlertCheckNotRequested from "../Components/AccountsDashboard/AlertCheckNotRequestedModal";
import CheckRequestModal from "../Components/AccountsDashboard/CheckRequestModal";

const AccountingPage = () => {
  const client = useSelector((state) => state?.client?.current);
  const currentCase = useSelector((state) => state?.caseData?.current);

  return (
    <>
    <CheckRequestModalProvider>
      <AlertCheckNotRequestedProvider>
        <AccountsManagementProvider>
          <UpdateTriggerProvider>
            <div className="page-wrapper">
              <Sidebar client={client} currentCase={currentCase} />
              <div className="page-container">
                <NavBar flaggedPageName="Costs" />
                <AccountsDashboard />
                <CheckRequestModal />
                <AlertCheckNotRequested />
              </div>
            </div>
            <Footer/>
          </UpdateTriggerProvider>
        </AccountsManagementProvider>
      </AlertCheckNotRequestedProvider>
    </CheckRequestModalProvider>
    </>
  );
};

export default AccountingPage;
