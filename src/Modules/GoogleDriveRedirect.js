import React, { useEffect } from "react";
import { getToken } from "../Utils/helper";
import axios from "axios";

const GoogleDriveRedirect = () => {
  useEffect(() => {
    const redirectCall = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      const accessToken = getToken();
      const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

      if (!code) {
        console.error("No code found in URL parameters");
        return;
      }

      try {
        const response = await axios.get(`${origin}/api/firmsetting-page/google_drive_redirect/`, {
          params: { code: code, error:error },
          headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,  // Optional Authorization header
          },
        });

        if (response.status === 200) {
          const token = response.data.data.user_token;
          const caseId = response.data.data.case_id;
          const clientId = response.data.data.client_id;
          const pageName = "bp-firmsetting"
          
          // Redirecting immediately after receiving the response
          if (token && clientId && caseId) {
            localStorage.setItem("token", "Bearer " + token);
            localStorage.setItem("client_id", clientId);
            localStorage.setItem("case_id", caseId);
            window.location.href = `/${pageName}/${clientId}/${caseId}`;
          }
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching the redirect URL:", error);
      }
    };

    // Call the redirect function as soon as component mounts
    redirectCall();
  }, []); // Empty dependency array ensures this runs only once on mount

  return null;
};

export default GoogleDriveRedirect;
