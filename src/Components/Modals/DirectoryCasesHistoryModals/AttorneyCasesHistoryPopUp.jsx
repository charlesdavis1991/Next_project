import { Modal, Nav, Tab, Table } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProviderHistoryTable from "../../LawFirmDirectoryDashboard/DirectoryCommon/ProviderHistoryTable";
import CopilotFirmsPanel from "../../LawFirmDirectoryDashboard/DirectoryCommon/CopilotFirmsPanel";

export default function AttorneyCasesHistoryPopUp({
  firmId,
  attorneyId,
  historyPopUp,
  handleClose,
  name,
  tabName,
}) {
  const [cases, setCases] = useState({});
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    if (historyPopUp) {
      if (firmId) {
        getFirmHistory(firmId);
      } else if(attorneyId){
        getAttorneyHistory(attorneyId);
      }
    }
  }, [attorneyId, firmId, historyPopUp]);

  const getAttorneyHistory = async (id) => {
    try {
      const response = await axios.get(
        `${origin}/api/getAttorneyHistory/${id}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        setCases(response.data);
      }
    } catch (err) {
      console.error("error is: ", err);
    }
  };

  const getFirmHistory = async (id) => {
    try {
      const response = await axios.get(
        `${origin}/api/getFirmHistory/${id}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 200) {
        setCases(response.data);
      }
    } catch (err) {
      console.error("error is: ", err);
    }
  };

  const emptyRowsCountOpen = useMemo(() => {
    const actualRows = cases?.open_cases?.length || 0;
    if (actualRows >= 14) return 0;
    return 14 - actualRows;
  }, [history]);

  const emptyRowsOpen = useMemo(() => {
    return Array(emptyRowsCountOpen)
      .fill(0)
      .map((_, index) => index);
  }, [emptyRowsCountOpen]);

  const emptyRowsCountClosed = useMemo(() => {
    const actualRows = cases?.closed_cases?.length || 0;
    if (actualRows >= 14) return 0;
    return 14 - actualRows;
  }, [history]);

  const emptyRowsClosed = useMemo(() => {
    return Array(emptyRowsCountClosed)
      .fill(0)
      .map((_, index) => index);
  }, [emptyRowsCountClosed]);

  const emptyRowsCountHistory = useMemo(() => {
    const actualRows = cases?.history?.yearly_stats?.length || 0;
    if (actualRows >= 10) return 0;
    return 10 - actualRows;
  }, [cases]);

  const emptyRowsHistory = useMemo(() => {
    return Array(emptyRowsCountHistory)
      .fill(0)
      .map((_, index) => index);
  }, [emptyRowsCountHistory]);

  return (
    <Modal
      show={historyPopUp}
      onHide={handleClose}
      dialogClassName="max-width-1900px"
      centered
    >
      <Modal.Header className="p-0 d-flex align-items-center justify-content-center height-25 bg-primary">
        <div className="d-flex align-items-center">
          <p
            className="p-l-5 text-uppercase text-white font-weight-600"
            style={{ fontSize: "21px" }}
          >
            History & Cases With {name}
          </p>
        </div>
      </Modal.Header>
      <Modal.Body className="py-0 px-1">
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav
            variant="tabs"
            className="mb-3 mt-2 justify-content-center text-primary-50"
          >
            <Nav.Item>
              <Nav.Link eventKey="history">{tabName} History</Nav.Link>
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
                      Total:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.total_cases}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Deadlines:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Deadline}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Events:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Event}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Hearings:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Hearing}
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Open:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.open_cases}
                    </div>
                  </div>

                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Depositions:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Deposition}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Discoveries:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Discovery}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Motions:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Motion}
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Closed:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.closed_cases}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Exams:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Exam}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Filing:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Filing}
                    </div>
                  </div>
                  <div className="row">
                    <div className="text-primary-50 text-right col-6">
                      Trials:{" "}
                    </div>
                    <div className="text-black text-left col-4">
                      {cases?.history?.Trial}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Table
                  className="text-start custom-table-directory font-weight-600"
                  striped
                  responsive
                  bordered
                  hover
                >
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Total</th>
                      <th>Open</th>
                      <th>Closed</th>
                      <th>Deadline</th>
                      <th>Deposition</th>
                      <th>Discover</th>
                      <th>Event</th>
                      <th>Exam</th>
                      <th>Filing</th>
                      <th>Hearing</th>
                      <th>Motion</th>
                      <th>Trial</th>
                    </tr>
                  </thead>
                  <tbody className="font-weight-600">
                    {cases?.history?.yearly_stats?.length > 0 &&
                      cases.history?.yearly_stats?.map((obj, index) => (
                        <tr key={index}>
                          <td>{obj?.year}</td>
                          <td>
                            {obj?.total_cases}
                          </td>
                          <td>{obj?.open_cases}</td>
                          <td>{obj?.closed_cases}</td>
                          <td>{obj?.event_types["Deadline"] || 0}</td>
                          <td>{obj?.event_types["Deposition"] || 0}</td>
                          <td>{obj?.event_types["Discovery"] || 0}</td>
                          <td>{obj?.event_types["Event"] || 0}</td>
                          <td>{obj?.event_types["Exam"] || 0}</td>
                          <td>{obj?.event_types["Filing"] || 0}</td>
                          <td>{obj?.event_types["Hearing"] || 0}</td>
                          <td>{obj?.event_types["Motion"] || 0}</td>
                          <td>{obj?.event_types["Trial"] || 0}</td>
                        </tr>
                      ))}
                    {emptyRowsHistory?.map((index) => (
                      <tr key={`empty-${index}`} className="height-25">
                        <td colSpan={13}></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="open" className="overflow-hidden">
              {/* insert open/close table */}
              <Table
                className="text-start custom-table-directory font-weight-600"
                striped
                responsive
                bordered
                hover
              >
                <thead>
                <tr>
                    <th>Case Name</th>
                    <th>Case Number</th>
                    <th>Case Stage</th>
                    <th>Court</th>
                    <th>Judge</th>
                    <th>Defendant</th>
                  </tr>
                </thead>
                <tbody className="font-weight-600">
                  {cases?.open_cases?.length > 0 &&
                    cases.open_cases.map((obj, index)=> (
                      <tr key={index}>
                        <td>{obj?.case_name}</td>
                        <td>{obj?.case_number}</td>
                        <td>{obj?.case_stage}</td>
                        <td>{obj?.court_name}</td>
                        <td>{obj?.judge_full_name}</td>
                        <td></td>
                      </tr>
                    ))
                  }
                  {emptyRowsOpen.map((index) => (
                    <tr key={`empty-${index}`} className="height-25">
                      <td colSpan={6}></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab.Pane>
            <Tab.Pane eventKey="close" className="overflow-hidden">
              {/* insert open/close table */}
              <Table
                className="text-start custom-table-directory font-weight-600"
                striped
                responsive
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th>Case Name</th>
                    <th>Case Number</th>
                    <th>Case Stage</th>
                    <th>Court</th>
                    <th>Judge</th>
                    <th>Defendant</th>
                  </tr>
                </thead>
                <tbody className="font-weight-600">
                  {cases?.closed_cases?.length > 0 &&
                    cases.closed_cases.map((obj, index)=> (
                      <tr key={index}>
                        <td>{obj?.case_name}</td>
                        <td>{obj?.case_number}</td>
                        <td>{obj?.case_stage}</td>
                        <td>{obj?.court_name}</td>
                        <td>{obj?.judge_full_name}</td>
                        <td></td>
                      </tr>
                    ))
                  }
                  {emptyRowsClosed.map((index) => (
                    <tr key={`empty-${index}`} className="height-25">
                      <td colSpan={6}></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab.Pane>
            <Tab.Pane eventKey="copilot" className="overflow-hidden">
              <CopilotFirmsPanel />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
