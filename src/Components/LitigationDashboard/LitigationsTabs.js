import React, { useEffect, useState, useContext } from "react";
import "../../../public/BP_resources/css/litigation.css";
import { Tab } from "react-bootstrap";
import FilingsContent from "./LitigationTabInfo/FilingsContent";
import DiscoveryContent from "./LitigationTabInfo/DiscoveryContent";
import MotionContent from "./LitigationTabInfo/MotionContent";
import axios from "axios";
import { getCaseId, getClientId } from "../../Utils/helper";
import SOLContent from "./LitigationTabInfo/SOLTabComp";
import HearingContent from "./LitigationTabInfo/HearingContent";
import { ClientDataContext } from "../ClientDashboard/shared/DataContext";
import DespositionContent from "./LitigationTabInfo/DespositionContent";
import ExamContent from "./LitigationTabInfo/ExamContent";
import TrailContent from "./LitigationTabInfo/TrailContent";
import DeadlineContent from "./LitigationTabInfo/DeadlineContent";
import EventsContent from "./LitigationTabInfo/EventsContent";
import AllContent from "./LitigationTabInfo/AllContent";
import LitigationPanelTabs from "./LitigationPanelTabs";
import LitigationPlaceholderPanel from "./LitigationPlaceholderPanel";
import SOLTempTab from "./LitigationTabInfo/SOLTempTab";

export default function LitigationTab({ litigation_obj }) {
  const clientId = getClientId();
  const caseId = getCaseId();
  const [activeKey, setActiveKey] = useState("all-panel");
  const [tabData, setTabData] = useState({});
  const [litigationTab, setLitigationTab] = useState("all_panels");
  const handleTabChange = (tab) => setLitigationTab(tab);

  const tabsData = [
    {
      id: "all_panels",
      label: "All",
      onClick: () => handleTabChange("all_panels"),
      className:
        litigationTab === "all_panels"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "all_panels"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "filings",
      label: "Filings",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Filing?.length > 0 ? "ic-Filing" : "ic-filing-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("filings"),
      className:
        litigationTab === "filings"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "filings"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "hearings",
      label: "Hearings",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Hearing?.length > 0 ? "ic-Hearing" : "ic-hearing-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("hearings"),
      className:
        litigationTab === "hearings"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "hearings"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "motion",
      label: "Motion",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Motion?.length > 0 ? "ic-Motion" : "ic-motion-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("motion"),
      className:
        litigationTab === "motion"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "motion"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "discovery",
      label: "Discovery",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Discovery?.length > 0 ? "ic-discovery" : "ic-discovery-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("discovery"),
      className:
        litigationTab === "discovery"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "discovery"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "deposition",
      label: "Depositions",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.DEpos?.length > 0 ? "ic-Deposition" : "ic-deposition-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("deposition"),
      className:
        litigationTab === "deposition"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "deposition"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "exam-modules",
      label: "Exams",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Exam?.length > 0 ? "ic-Exam" : "ic-exam-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("exam-modules"),
      className:
        litigationTab === "exam-modules"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "exam-modules"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "trial",
      label: "Trial",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Trial?.length > 0 ? "ic-Trial" : "ic-trial-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("trial"),
      className:
        litigationTab === "trial"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "trial"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "deadline",
      label: "Deadline",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Deadline?.length > 0 ? "ic-Deadline" : "ic-deadline-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("deadline"),
      className:
        litigationTab === "deadline"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "deadline"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "other-litigation",
      label: "Events",
      span: (
        <i
          className={`ic ic-19 ${tabData?.categorized_litigation_acts?.Event?.length > 0 ? "ic-Event" : "ic-event-grey"}  m-r-5`}
        ></i>
      ),
      onClick: () => handleTabChange("other-litigation"),
      className:
        litigationTab === "other-litigation"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background:
        litigationTab === "other-litigation"
          ? "var(--primary) !important"
          : "var(--primary-70) !important",
      leftHand: true,
      activeColor: "white",
    },
    {
      id: "sol",
      label: "S.O.L",
      onClick: () => handleTabChange("sol"),
      className:
        litigationTab === "sol"
          ? "active tab-trapezium-cycles-corners"
          : "tab-trapezium-cycles-corners",
      background: litigationTab === "sol" ? "red !important" : "red !important",
      leftHand: true,
      activeColor: "white",
    },
  ];
  const token = localStorage.getItem("token");
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const { isLitigationActDataUpdated, setLitigationActDataUpdated } =
    useContext(ClientDataContext);
  const [firstTimeLitData, setFirstTimeLitData] = useState(true);

  const fecthData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/litigation-page/litigations-acts/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTabData(response.data);
      if (firstTimeLitData) {
        setTabData(response.data);
        setFirstTimeLitData(false);
      }
      if (isLitigationActDataUpdated) {
        setTabData(response.data);
        setLitigationActDataUpdated(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthData();
    if (isLitigationActDataUpdated) {
      setLitigationActDataUpdated(false);
    }
  }, [isLitigationActDataUpdated, clientId, caseId]);

  const handleSelect = (key) => {
    setActiveKey(key);
  };
  return (
    <div className="custom-tab lit-custom-tab">
      <Tab.Container activeKey={activeKey} onSelect={handleSelect}>
        <nav className="border-0 ml-0">
          <LitigationPanelTabs
            litigationTab={litigationTab}
            handleTabChange={handleTabChange}
            tabsData={tabsData}
          />
          {/* <Nav
            className="nav nav-tabs flex-nowrap  background-main-10"
            id="nav-tab"
            role="tablist"
            style={{ width: "calc(100%)" }}
          >
            <Nav.Link eventKey="all-panel" className="nav-item nav-link">
              All
            </Nav.Link>

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

            <Nav.Link eventKey="other-litigation" className="nav-item nav-link">
              <i className="ic ic-19 ic-event-grey m-r-5"></i>
              <span className="text">Events</span>
            </Nav.Link>
            <Nav.Link eventKey="sol" id="" className="litigation-sol-tab">
              S.O.L
            </Nav.Link>
          </Nav> */}
        </nav>
        {litigationTab === "all_panels" && (
          <>
            {tabData?.categorized_litigation_acts &&
                Object.entries(tabData.categorized_litigation_acts).map(
                  ([categoryName, items]) =>
                    items.map((obj, index) => (
                      <AllContent
                        key={`${categoryName}-${index}`}
                        name={categoryName}
                        object={obj}
                        litigation_obj={litigation_obj}
                      />
                    ))
            )}
            {tabData?.SOLs?.map(
              (sol, index) => (
                <SOLTempTab
                  key={index}
                  name="Statute Of Limitations"
                  object={sol}
                  litigation_obj={litigation_obj}
                />
              )
              // <SOLContent
              //   key={index}
              //   litigation_obj={litigation_obj}
              //   act={sol}
              // />
            )}
          </>
        )}
        {litigationTab === "filings" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Filing ||
              tabData?.categorized_litigation_acts?.Filing?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Filings"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Filing?.map((obj) => (
                <FilingsContent
                  object={obj}
                  name="Filing"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "hearings" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Hearing ||
              tabData?.categorized_litigation_acts?.Hearing?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Hearings"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Hearing?.map((obj) => (
                <HearingContent
                  object={obj}
                  name="Hearing"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "motion" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Motion ||
              tabData?.categorized_litigation_acts?.Motion?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Motion"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Motion?.map((obj) => (
                <MotionContent
                  object={obj}
                  name="Motion"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "discovery" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Discovery ||
              tabData?.categorized_litigation_acts?.Discovery?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Discovery"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Discovery?.map((obj) => (
                <DiscoveryContent
                  object={obj}
                  name="Discovery"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "deposition" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Depos ||
              tabData?.categorized_litigation_acts?.Depos?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Deposition"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Depos?.map((obj) => (
                <DespositionContent
                  object={obj}
                  name="Deposition"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "exam-modules" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Exam ||
              tabData?.categorized_litigation_acts?.Exam?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Exam"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Exam?.map((obj) => (
                <ExamContent
                  object={obj}
                  name="Exam"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "trial" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Trial ||
              tabData?.categorized_litigation_acts?.Trial?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Trial"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Trial?.map((obj) => (
                <TrailContent
                  object={obj}
                  name="Trial"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "deadline" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Deadline ||
              tabData?.categorized_litigation_acts?.Deadline?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Deadline"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Deadline?.map((obj) => (
                <DeadlineContent
                  object={obj}
                  name="Deadline"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "other-litigation" && (
          <>
            {(!tabData?.categorized_litigation_acts?.Event ||
              tabData?.categorized_litigation_acts?.Event?.length == 0) && (
              <LitigationPlaceholderPanel panel_name={"Event"} />
            )}
            {tabData?.categorized_litigation_acts &&
              tabData?.categorized_litigation_acts?.Event?.map((obj) => (
                <EventsContent
                  object={obj}
                  name="Event"
                  litigation_obj={litigation_obj}
                />
              ))}
          </>
        )}
        {litigationTab === "sol" && (
          <>
            {(!tabData?.SOLs || tabData.SOLs.length === 0) && (
              <LitigationPlaceholderPanel panel_name={"S.O.L"} />
            )}
            {tabData?.SOLs?.map(
              (sol, index) => (
                <SOLTempTab
                  key={index}
                  name="Statute Of Limitations"
                  object={sol}
                  litigation_obj={litigation_obj}
                />
              )
              // <SOLContent
              //   key={index}
              //   litigation_obj={litigation_obj}
              //   act={sol}
              // />
            )}
          </>
        )}
      </Tab.Container>
    </div>
  );
}

const LitigationDocRows = () => {
  return (
    <div className="docs-row-litigation mt-3">
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
      <div class="documentIcon-2">
        <form action="#" class="docIconForm">
          <input type="hidden" />
          <div class="d-flex justify-content-between align-items-center">
            <div class="court_form_code_heading ">
              <p class="text-lg-grey">Court Form</p>
            </div>
            <span class="icon-wrap court-form-icon-wrap">
              <i class="ic ic-file-colored cursor-pointer"></i>
            </span>
            <p class="name text-lg-grey">Label 1</p>
          </div>
        </form>
      </div>
    </div>
  );
};
