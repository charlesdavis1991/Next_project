import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import "./injury.css";

import { useDispatch, useSelector } from "react-redux";

import InjuryDashboard from "../Components/InjuriesDashboard/main";
import { fetchInjuryPageData } from "../Redux/injuries/actions";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../Utils/helper";
import Footer from "../Components/common/footer";

const InjuryPage = ({}) => {
  console.log("Welcome to the Injury page")
  // Redux
  const dispatch = useDispatch();
  const { injuriesData } = useSelector((state) => state.injuries);
  const clientId = getClientId();
  const caseId = getCaseId();

  // State Hooks

  const [currentCase, setCurrentCase] = useState([]);

  useEffect(() => {
    fetchInjuryPageData(dispatch);
    fetchShakespeareStatus(caseId, clientId, "Injury", dispatch);
  }, []);

  //console.log(injuriesData, "shah");
  return (
    <>
    <div className="page-wrapper">
      <Sidebar pages={injuriesData?.pages} />
      <div className="page-container">
        <NavBar
          flaggedPageName="Injury"
          client={injuriesData?.client}
          currentCase={currentCase}
        />
        <InjuryDashboard injuriesData={injuriesData} />
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default InjuryPage;
