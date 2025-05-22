import React, { useEffect } from "react";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import CaseDashboard from "../Components/CaseDashboard/main";
import { useLocation } from "react-router-dom";
import {
  getCaseId,
  getClientId,
  setCaseId,
  setClientId,
} from "../Utils/helper";
import { useDispatch } from "react-redux";
import {
  setCaseSummary,
  setCurrentCase,
  fetchCurrentCase,
} from "../Redux/caseData/caseDataSlice";
import { setClientProviders } from "../Redux/client-providers/clientProviderSlice";
import { fetchShakespeareStatus } from "../Utils/helper";
import Footer from "../Components/common/footer";

const CasePage = () => {
  let location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const newClientID = location.pathname.split("/")[2];
    const newCaseID = location.pathname.split("/")[3];
    const clientID = getClientId();
    const caseID = getCaseId();

    if (newClientID !== clientID || newCaseID !== caseID) {
      setClientId(newClientID);
      setCaseId(newCaseID);
      dispatch(setCaseSummary(null));
      dispatch(setCurrentCase(null));
      dispatch(setClientProviders(null));
    }
  }, [location]);

  return (
    <>
      <div className="page-wrapper">
        <Sidebar />
        <div className="page-container">
          <NavBar flaggedPageName="Case" />
          <CaseDashboard />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CasePage;
