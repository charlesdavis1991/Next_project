import React, { useEffect } from "react";

const RedirectPage = () => {
  console.log("test todos");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token", null);
    const clientId = params.get("client_id", null);
    const caseId = params.get("case_id", null);
    const pageName = params.get("page"); // Get the page name from URL

    if (token && clientId && caseId) {
      localStorage.setItem("token", "Bearer " + token);
      localStorage.setItem("client_id", clientId);
      localStorage.setItem("case_id", caseId);
      window.location.href = `/${pageName}/${clientId}/${caseId}`;
    }
  }, []);

  return <></>;
};
export default RedirectPage;
