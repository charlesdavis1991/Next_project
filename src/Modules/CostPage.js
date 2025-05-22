import React from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import CostDashboard from "../Components/CostDashboard/index.js";
import { CheckRequestModalProvider } from "../Components/CostDashboard/CheckRequestModalContext";
import { useSelector } from "react-redux";
import CheckRequestModal from "../Components/CostDashboard/CheckRequestModal";
import { AlertCheckNotRequestedProvider } from "../Components/CostDashboard/AlertCheckNotRequestedModalContext";
import AlertCheckNotRequested from "../Components/CostDashboard/AlertCheckNotRequestedModal";
import { CostManagementProvider } from "../Components/CostDashboard/CostManagementContext";
import { UpdateTriggerProvider } from "../Components/CostDashboard/TriggerUpdateContext";
import Footer from "../Components/common/footer";

const CostPage = () => {
  const client = useSelector((state) => state?.client?.current);
  const currentCase = useSelector((state) => state?.caseData?.current);

  return (
    <CheckRequestModalProvider>
      <AlertCheckNotRequestedProvider>
        <CostManagementProvider>
          <UpdateTriggerProvider>
            <div className="page-wrapper">
              <Sidebar client={client} currentCase={currentCase} />
              <div className="page-container">
                <NavBar flaggedPageName="Costs" />
                <CostDashboard />
                <CheckRequestModal />
                <AlertCheckNotRequested />
              </div>
            </div>
            <Footer/>
          </UpdateTriggerProvider>
        </CostManagementProvider>
      </AlertCheckNotRequestedProvider>
    </CheckRequestModalProvider>
  );
};

export default CostPage;
