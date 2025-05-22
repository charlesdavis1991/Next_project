import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./caseRoles.css";

const CasesRole = (chats) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [caseRoles, setCaseRoles] = useState({});
  const fetchCaseRoles = async () => {
    try {
      const response = await api.get(`${origin}/api/homepage/roles-count/`);

      if (response.status === 200) {
        var data = response.data;
        console.log("fetchCaseRoles", data);
        setCaseRoles(data);
      }
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  useEffect(() => {
    fetchCaseRoles();
  }, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "inline-block",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            className="background-main-10 height-25"
            style={{
              height: "25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 0px",
            }}
          >
            <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center h-100">
              Case Roles
            </h4>
          </div>
          <ul
            className="list-unstyled list-with-big-numbers"
            style={{ listStyleType: "none", padding: 0, margin: 0 }}
          >
            {Object.entries(caseRoles).map(([key, value]) => (
              <li
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 5px",
                  gap: "15px",
                  width: "100%",
                  height: "35px",
                }}
              >
                <span style={{ textAlign: "left", flex: "1" }}>{key}</span>
                <span
                  className="number"
                  style={{ textAlign: "right", flex: "0" }}
                >
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
export default CasesRole;
