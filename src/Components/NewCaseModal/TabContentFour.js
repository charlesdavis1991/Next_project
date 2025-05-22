import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import PulseLoader from "react-spinners/PulseLoader";
import { getToken } from "../../Utils/helper";
import "./newcase.css";
const TabContentFour = () => {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${origin}/api/get_intake_reporting/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setCases(data.cases);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNullValue = (value) => {
    return value === null || value === "" ? "-" : value;
  };

  return (
    <>
      {loading ? (
        <PulseLoader
          loading={loading}
          size={16}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#19395F"
          style={{
            display: "flex",
            flexDirection: "row",
            height: "calc(100vh-119px)",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        />
      ) : (
        <div className="tab-pane fade active show">
          {/* <nav className="nav nav-tabs custom-nav-tabs d-flex align-items-center justify-content-around"></nav> */}
          <div className="tab-content">
            <Table
              className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5"
              id="intake-report-table"
            >
              <thead>
                <tr id="tb-header">
                  <th className="text-uppercase">Client Name</th>
                  <th className="text-uppercase">Case Type</th>
                  <th className="text-uppercase">Created By</th>
                  <th className="text-uppercase">Incident Date</th>
                  <th className="text-uppercase">Initial Intake Date</th>
                  <th className="text-uppercase">Accepted Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseData, idx) => (
                  <tr key={idx}>
                    <td>{handleNullValue(caseData.client_name)}</td>
                    <td>{handleNullValue(caseData.case_type)}</td>
                    <td>{handleNullValue(caseData.created_by)}</td>
                    <td>{handleNullValue(caseData.incident_date)}</td>
                    <td>{handleNullValue(caseData.initial_intake_date)}</td>
                    <td>{handleNullValue(caseData.accepted_date)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default TabContentFour;
