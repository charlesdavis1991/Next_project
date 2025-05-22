import { Modal, Nav, Tab } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientProvidersStyles from "../../CaseDashboard/ClientProvidersStyles";
import ProviderCasesTablePopup from "../../LawFirmDirectoryDashboard/DirectoryCommon/ProviderCasesTablePopup";
import ProviderHistoryTable from "../../LawFirmDirectoryDashboard/DirectoryCommon/ProviderHistoryTable";
import CopilotFirmsPanel from "../../LawFirmDirectoryDashboard/DirectoryCommon/CopilotFirmsPanel";

export default function ProviderCasesHistory({
  providerId,
  providerCasesPopup,
  handleClose,
  specialties,
  specialty,
  providerName,
}) {
  const [providerCases, setProviderCases] = useState([]);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    if (providerId && providerCasesPopup) {
      getProviderCases(providerId);
    }
  }, [providerId, providerCasesPopup]);

  const getProviderCases = async (providerId) => {
    try {
      const response = await axios.get(
        `${origin}/api/getProviderCases/${providerId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        setProviderCases(response.data);
      }
    } catch (err) {
      console.error("error is: ", err);
    }
  };

  return (
    <>
      <ClientProvidersStyles clientProviders={specialties} />
      <Modal
        show={providerCasesPopup}
        onHide={handleClose}
        dialogClassName="max-width-1900px"
        centered
      >
        <Modal.Header
          className={`provider-specialty-${specialty?.id}-10 p-0 d-flex align-items-center height-25`}
        >
          <div className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                width: "25px",
                height: "25px",
                backgroundColor: `${specialty?.color}`,
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              {specialty?.name[0]}
            </div>
            <div
              className="d-flex align-items-center height-25 p-l-5 text-uppercase font-weight-600"
              style={{ fontSize: "14px" }}
            >
              History & Cases With &nbsp;
              <p
                className="d-flex align-items-center height-25"
                style={{
                  backgroundColor: `${specialty?.color}`,
                  color: "white",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                }}
              >
                {specialty?.name}
              </p>
              <p>&nbsp;{providerName && `- ${providerName}`}</p>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="py-0 px-1">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav
              variant="tabs"
              className="mt-2 justify-content-center text-primary-50"
            >
              <Nav.Item>
                <Nav.Link eventKey="history">Provider History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="open">Open Cases</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="close">Closed Cases</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="copilot">CoPilot Firms</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content style={{ maxHeight: "700px", minHeight: "378px" }}>
              <Tab.Pane eventKey="history" className="overflow-hidden">
                <div className="row font-weight-600 mb-2">
                  <div className="col-4">
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Total Cases:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.total_cases}</div>
                    </div>
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Open Case:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.open_cases}</div>
                    </div>
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Closed Cases:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.closed_cases}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Total Original Billing:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.total_original_billing}</div>
                    </div>
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Total Liens:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.total_liens}</div>
                    </div>
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Total Final Payments:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.total_final_payments}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Total Visits:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.total_visits}</div>
                    </div>
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Original Billing / Visit:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.original_per_visit}</div>
                    </div>
                    <div className="row">
                      <div className="text-primary-50 text-right col-6">
                        Final Payments / Visit:{" "}
                      </div>
                      <div className="text-black text-left col-4">{providerCases?.history?.final_per_visit}</div>
                    </div>
                  </div>
                </div>
                <div>
                  {/* {providerCases?.history?.length > 0 ? ( */}
                  <ProviderHistoryTable
                    history={providerCases?.history?.yearly_stats || []}
                  />
                  {/* ) : (
                    <div className="h-100 w-100 text-primary-50 font-bold">
                      No History
                    </div>
                  )} */}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="open" className="overflow-hidden">
                {/* {providerCases?.open_cases?.length > 0 ? ( */}
                <ProviderCasesTablePopup
                  providerCases={providerCases?.open_cases || []}
                />
                {/* ) : (
                  <div className="h-50 d-flex align-items-center justify-content-center">
                    <p className="text-primary-50 font-bold">No Open Cases</p>
                  </div>
                )} */}
                {/* Please divide these into a different component for this table */}
                {/* Refine the ProviderCasesTablePopup table for this, api is ready */}
              </Tab.Pane>
              <Tab.Pane eventKey="close" className="overflow-hidden">
                {/* {providerCases?.closed_cases?.length > 0 ? ( */}
                <ProviderCasesTablePopup
                  providerCases={providerCases?.closed_cases || []}
                  closedCases
                />
                {/* ) : (
                  <div className="h-50 d-flex align-items-center justify-content-center">
                    <p className="text-primary-50 font-bold">No Closed Cases</p>
                  </div>
                )} */}
                {/* Refine the ProviderCasesTablePopup table for this, api is ready */}
              </Tab.Pane>
              <Tab.Pane eventKey="copilot" className="overflow-hidden">
                <CopilotFirmsPanel />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
