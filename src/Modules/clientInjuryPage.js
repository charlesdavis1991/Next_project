//this page is made to be implemented in Clien Page
import React, { useEffect, useState } from "react";
import "./injury.css";

import { useDispatch, useSelector } from "react-redux";

import InjuryDashboardClient from "../Components/InjuriesDashboard/clientInjuriesDashboard";
import { fetchInjuryPageData } from "../Redux/injuries/actions";

const InjuryPageClient = ({}) => {
  // Redux
  const dispatch = useDispatch();
  const { injuriesData } = useSelector((state) => state.injuries);

  // State Hooks

  const [currentCase, setCurrentCase] = useState([]);

  useEffect(() => {
    fetchInjuryPageData(dispatch);
  }, []);

  
  return (
    <div>
      <div className="page-container">
        <InjuryDashboardClient injuriesData={injuriesData} />
      </div>
    </div>
  );
};

export default InjuryPageClient;
