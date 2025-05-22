import React, { useEffect, useState } from "react";
import PendingTasks from "./Elements/PendingTasks";
import CasesTimeline from "./Elements/CasesTimeline";
import CaseCompletion from "./Elements/CaseCompletion";
import LeastAccess from "./Elements/LeastAccess";
import ExpireStatute from "./Elements/ExpireStatute";
import OpenCases from "./Elements/OpenCases";
import CasesRole from "./Elements/CasesRole";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import "./Elements/caseRoles.css";

const CaseDetails = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const caseId = getCaseId();
  const clientId = getClientId();
  const token = localStorage.getItem("token");
  const [chats, setChats] = useState([]);
  const fetchHomeChats = async () => {
    try {
      const response = await axios.get(origin + "/api/home/case-detail/", {
        headers: {
          Authorization: token,
        },
        params: {
          client_id: clientId,
          case_id: caseId,
        },
      });
      setChats(response.data);
    } catch (error) {
      console.error(error);
      setChats([]);
    }
  };

  useEffect(() => {
    fetchHomeChats();
  }, []);

  // Note: there is no data in the backend for Case Completion and Open Cases Components
  return (
    <>
      <div class="content-right order-3 order-lg-2 w-100">
        <PendingTasks chats={chats} />

        <div className="row custom-gutter case-completion-open-roles">
          <CaseCompletion />

          <div
            className="open-cases col-12 column order-2 pr-0 m-r-5 order-xl-3 order-xxl-3 m-b-5"
            id="caseRolePercentageCheckNewUpdate"
          >
            <OpenCases />
          </div>

          <div
            className="case-roles col-12 column order-3 pl-0 bg-primary-2 m-b-5 pr-0"
            id="caseRolesPercentageNewUpdateFlexValue"
            style={{ marginRight: "3px" }}
          >
            <CasesRole chats={chats} />
          </div>
        </div>

        <div
          className="row custom-gutter two-equal-tables"
          style={{ zIndex: "0" }}
        >
          <LeastAccess chats={chats} />
          <ExpireStatute chats={chats} />
        </div>
      </div>

      <div className="sidebar order-2 order-lg-3 m-t-5" style={{ zIndex: "0" }}>
        <CasesTimeline chats={chats} />
      </div>
    </>
  );
};

export default CaseDetails;
