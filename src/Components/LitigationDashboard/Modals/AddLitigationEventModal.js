import React, { useEffect, useState } from "react";
import "../../../../public/BP_resources/css/litigation.css";
import axios from "axios";
import { Modal, Button, Nav, Tab } from "react-bootstrap";
import LitigationFillingForm from "./AddFillingsLitigation";
import LitigationHearingForm from "./AddHearingLitigation";
import LitigationMotionForm from "./AddMotionLitigation";
import LitigationDiscoveryForm from "./AddDiscoveryLitigation";
import LitigationDepositionsForm from "./AddDepositionsLitigation";
import LitigationExamForm from "./AddExamsLitigation";
import LitigationTrailForm from "./AddTrailLitigation";
import LitigationSOLForm from "./AddSOLLitigation";
import { getClientId, getCaseId } from "../../../Utils/helper";

//for directory page
export default function LitigationAddEventModal({
  showPopup,
  handleClose,
  litigationDetail,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const clientId = getClientId();
  const caseId = getCaseId();
  const [partiesData, setPartiesData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [popUpData, setPopUpData] = useState([]);
  const [activeKey, setActiveKey] = useState("filings");
  const [loading, setLoading] = useState(false);

  console.log("parties data", partiesData);
  console.log("service data", serviceData);
  console.log("popup data", popUpData);

  const fetchPartiesData = async () => {
    return axios.get(
      `${origin}/api/litigation-page/defendants-and-other-parties/${clientId}/${caseId}/`,
      {
        params: { litigation_event_popup: true },
        headers: { Authorization: token },
      }
    );
  };

  const fetchServiceData = async () => {
    return axios.get(`${origin}/api/litigation-page/service-methods/`, {
      params: { client_id: clientId, case_id: caseId },
      headers: { Authorization: token },
    });
  };

  const fetchPopUpData = async () => {
    return axios.get(
      `${origin}/api/litigation-page/litigation-events-for-popups/`,
      {
        params: { case_id: caseId, client_id: clientId },
        headers: { Authorization: token },
      }
    );
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Run all API calls concurrently
      const [partiesResponse, serviceResponse, popUpResponse] =
        await Promise.all([
          fetchPartiesData(),
          fetchServiceData(),
          fetchPopUpData(),
        ]);

      // Set the state
      setPartiesData(partiesResponse.data);
      setServiceData(serviceResponse.data);
      setPopUpData(popUpResponse.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [clientId, caseId]);

  const handleSelect = (key) => {
    setActiveKey(key);
  };

  // Map active tab to the button text
  const buttonLabels = {
    filings: "Add Filing",
    hearings: "Add Hearing",
    motion: "Add Motion",
    discovery: "Add Discovery",
    deposition: "Add Deposition",
    "exam-modules": "Add Exam",
    trial: "Add Trial",
    deadline: "Add Deadline",
    "other-litigation": "Add Event",
    sol: "Add Statute of Limitations",
  };

  return (
    <Modal
      show={showPopup ? true : false}
      onHide={handleClose}
      centered
      dialogClassName="modal-dialog modal-dialog-centered lit-max-width-1200-px"
      className="generic-popup fade bd-example-modal-lg zoom-in"
    >
      <Modal.Header className="modal-header text-center CustomLitigation">
        <h5
          className="modal-title mx-auto CustomLitigationFont"
          id="exampleModalLabel"
        >
          ADD LITIGATION EVENT
        </h5>
        <button
          typeName="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <p>
          {litigationDetail?.jurisdiction_obj?.name ? (
            litigationDetail.jurisdiction_obj.name
          ) : (
            <span className="text-primary-20">Jurisdiction</span>
          )}
          ,{" "}
          {litigationDetail?.filing_type ? (
            litigationDetail?.filing_type
          ) : (
            <span className="text-primary-20">Filing Type</span>
          )}
          ,{" "}
          {litigationDetail?.court_name ? (
            litigationDetail?.court_name
          ) : (
            <span className="text-primary-20">Court Name</span>
          )}
          ,{" "}
          {litigationDetail?.court_title1 ? (
            litigationDetail?.court_title1
          ) : (
            <span className="text-primary-20">Court Title</span>
          )}
        </p>

        <p className="mt-2 black-text d-flex align-items-center">
          {litigationDetail?.court_title2 ? (
            litigationDetail?.court_title2
          ) : (
            <span className="text-primary-20">Court Title</span>
          )}
          <i className="litigation-border"></i>{" "}
          {litigationDetail?.case_short_name ? (
            litigationDetail?.case_short_name
          ) : (
            <span className="text-primary-20">Case Short Name</span>
          )}
          <i className="litigation-border"></i>{" "}
          {litigationDetail?.case_number ? (
            litigationDetail?.case_number
          ) : (
            <span className="text-primary-20">#######</span>
          )}
        </p>
        <div class="custom-tab mt-3">
          <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
            <nav className="ml-0">
              <Nav
                className="nav nav-tabs flex-nowrap background-temp"
                id="nav-tab"
                role="tablist"
                //style={{ width: "calc(100% - 300px)" }}
              >
                <div className="white-div"></div>

                <Nav.Link eventKey="filings" className="nav-item nav-link">
                  <i className="ic ic-19 ic-filing-grey m-r-5"></i>
                  <span className="text">Filings</span>
                </Nav.Link>

                <Nav.Link eventKey="hearings" className="nav-item nav-link">
                  <i className="ic ic-19 ic-hearing-grey m-r-5"></i>
                  <span className="text">Hearings</span>
                </Nav.Link>

                <Nav.Link eventKey="motion" className="nav-item nav-link">
                  <i className="ic ic-19 ic-motion-grey m-r-5"></i>
                  <span className="text">Motions</span>
                </Nav.Link>

                <Nav.Link eventKey="discovery" className="nav-item nav-link">
                  <i className="ic ic-19 ic-discovery-grey m-r-5"></i>
                  <span className="text">Discovery</span>
                </Nav.Link>

                <Nav.Link eventKey="deposition" className="nav-item nav-link">
                  <i className="ic ic-19 ic-deposition-grey m-r-5"></i>
                  <span className="text">Depositions</span>
                </Nav.Link>

                <Nav.Link eventKey="exam-modules" className="nav-item nav-link">
                  <i className="ic ic-19 ic-exam-grey m-r-5"></i>
                  <span className="text">Exams</span>
                </Nav.Link>

                <Nav.Link eventKey="trial" className="nav-item nav-link">
                  <i className="ic ic-19 ic-trial-grey m-r-5"></i>
                  <span className="text">Trial</span>
                </Nav.Link>

                <Nav.Link eventKey="deadline" className="nav-item nav-link">
                  <i className="ic ic-19 ic-deadline-grey m-r-5"></i>
                  <span className="text">Deadline</span>
                </Nav.Link>

                <Nav.Link
                  eventKey="other-litigation"
                  className="nav-item nav-link"
                >
                  <i className="ic ic-19 ic-event-grey m-r-5"></i>
                  <span className="text">Events</span>
                </Nav.Link>

                <Nav.Link eventKey="sol" className="litigation-sol-tab">
                  S.O.L
                </Nav.Link>
              </Nav>
            </nav>

            <Tab.Content
              className="tab-content mt-2 overflow-hidden"
              id="nav-tabContent"
              style={{ height: "400px" }}
            >
              <Tab.Pane eventKey="filings">
                <LitigationFillingForm
                  clients={partiesData?.clients}
                  defendants={partiesData?.defendants}
                  otherParties={partiesData?.other_parties}
                  serviceMethods={serviceData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="hearings">
                {/*<LitigationHearingForm/>*/}
              </Tab.Pane>
              <Tab.Pane eventKey="motion">
                <LitigationMotionForm
                  clients={partiesData?.clients}
                  defendants={partiesData?.defendants}
                  otherParties={partiesData?.other_parties}
                  serviceMethods={serviceData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="discovery">
                <LitigationDiscoveryForm
                  clients={partiesData?.clients}
                  defendants={partiesData?.defendants}
                  otherParties={partiesData?.other_parties}
                  serviceMethods={serviceData}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="deposition">
                {/*<LitigationDepositionsForm/>*/}
              </Tab.Pane>
              <Tab.Pane eventKey="exam-modules">
                <LitigationExamForm
                  clients={partiesData?.clients}
                  defendants={partiesData?.defendants}
                  otherParties={partiesData?.other_parties}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="trial">
                <LitigationTrailForm
                  clients={partiesData?.clients}
                  defendants={partiesData?.defendants}
                  otherParties={partiesData?.other_parties}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="deadline">
                <h4>deadline</h4>
              </Tab.Pane>
              <Tab.Pane eventKey="other-litigation">
                <h4>events</h4>
              </Tab.Pane>
              <Tab.Pane eventKey="sol">
                <LitigationSOLForm />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <div className="ml-auto d-flex">
          <button type="button" className="btn btn-success">
            {loading ? "Adding.." : buttonLabels[activeKey] || "Add"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
