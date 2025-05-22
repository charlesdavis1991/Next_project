import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import api from "../api/api";
import "../../public/BP_resources/css/experts-i65.css";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import {
  fetchShakespeareStatus,
  getCaseId,
  getClientId,
  formatDateForPanelDisplay
} from "../Utils/helper";
import { Button, Modal } from "react-bootstrap";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import ExpertActionBar from "../Components/Experts/ExpertActionBar";
import ExpertTitleBar from "../Components/Experts/ExpertTitleBar";
import EditCaseExpertModal from "../Components/Experts/ExpertsModals/EditCaseExpertModal";
import ConfirmDeletePopup from "../Components/ReportPage/ReportModals/ConfirmDeletePopup";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import Footer from "../Components/common/footer";
import ContactPanel from '../Components/common/ContactPanel';
import InformationPanel from '../Components/common/InformationPanel';
import ExpertFilters from "../Components/Experts/ExpertFilters";
import NewCaseExpertModal from "../Components/Experts/ExpertsModals/NewCaseExpertModal";

//RK ::2024-26-06 10-31pm
function ExpertsPage() {
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const currentCaseId = getCaseId();
  const clientId = getClientId();

  const [experts, setExperts] = useState([]);
  const [isFecthExperts, setIsFetchExperts] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forDeleteExpertId, setForDeleteExpertId] = useState(null);
  const selectedEditableTabPanel = useRef("");

  // For scolling to a specific report page
  const expertRefs = useRef({});
  const containerRef = useRef(null);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);

  // console.log(experts)

  const fecthExperts = async () => {
    try {
      setIsFetchExperts(false);
      const response = await api.get(
        `${origin}/api/experts/${clientId}/${currentCaseId}/`
      );
      if (response.status === 200) {
        setExperts(response.data);
        setFilteredExperts(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fecthExperts();
    fetchShakespeareStatus(currentCaseId, clientId, "Experts", dispatch);
  }, [isFecthExperts]);

  const handleFacthExperts = () => {
    setIsFetchExperts(true);
  };

  const handleCloseFucton = () => {
    setSelectedExpert(null);
  };

  const showDeleteConfirmPopup = () => {
    setShowDeleteConfirm(true);
    setSelectedExpert(null);
  };

  const hideDeleteConfirmPopup = () => {
    setShowDeleteConfirm(false);
  };

  //Delete Post is handeled here
  const handleDeleteSubmission = async () => {
    try {
      setIsFetchExperts(false);
      const response = await api.delete(
        `${origin}/api/delete_expert/${forDeleteExpertId}/`
      );
      if (response.status === 204) {
        hideDeleteConfirmPopup();
        handleFacthExperts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // For Scrolling to specfic defendant record from redirected from search page
  useEffect(() => {
    // Scroll to that specific record
    if (searchRecordId && expertRefs.current[searchRecordId]) {
      const searchRecordElement = expertRefs.current[searchRecordId];
      const containerElement = containerRef.current;

      // Calculate the top offset of the product relative to the container
      const searchRecordOffsetTop = searchRecordElement.offsetTop;
      const containerScrollTop = containerElement.scrollTop;
      const smallScrollAdjustment = 10;

      // Scroll the container to the product with a small adjustment
      containerElement.scrollTo({
        top: searchRecordOffsetTop - containerScrollTop - smallScrollAdjustment,
        behavior: "smooth",
      });

      dispatch(setSearchRecordId(""));
    }
  }, [experts]);

  const [activeType, setActiveType] = useState("all");
  const [filteredExperts, setFilteredExperts] = useState([])

  const handleExpertTypeChange = useCallback((selectedType) => {
    setActiveType(selectedType);
    
    // Example of filtering experts based on type
    const filteredExperts = selectedType === "all" 
      ? experts 
      : experts?.filter(expert => expert?.retained_by_entity === selectedType);
    setFilteredExperts(filteredExperts);
  }, [experts]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const ExpertButtons = [
    {
        iconClassName: "ic ic-19 ic-generate-document",
        buttonText: "Generate Document",
        className: "p-l-6 p-r-5",
        style: {
        height: "25px",
        backgroundColor: "var(--primary-10)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
        },
    },
  ];
  const ExpertAgencyButtons = [
    {
        iconClassName: "ic ic-19 ic-generate-document",
        buttonText: "Generate Document",
        className: "p-l-6 p-r-5",
        style: {
        height: "25px",
        backgroundColor: "var(--primary-10)",
        borderColor: "var(--primary)",
        color: "var(--primary)",
        },
    },
  ];
  return (
    <>
    <div className="page-wrapper">
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar
          client={client}
          currentCase={currentCase}
          flaggedPageName={"Experts"}
        />
        <ExpertActionBar onFetchExperts={handleFacthExperts} />
        <div
          className="TreatmentPage-main-container invisible-scrollbar"
          ref={containerRef}
          style={{ overflowY: "auto", maxHeight: "100vh" }}
        >
          <div className="d-flex align-items-center">
            <ExpertFilters
              activeType={activeType}
              onTypeChange={handleExpertTypeChange}
            />
            <div className="d-flex justify-content-center height-25 w-100" style={{marginRight: "300px"}}>
              <button
                  className="tab-defendant-page active TreatmentPage-all-trapezium d-flex align-items-center justify-content-center px-2"
                  data-toggle="modal"
                  data-target="#addExpert"
                  onClick={() => handleShow()}
                  style={{zIndex: "1", left: "0px"}}
                >
                  <span className="font-weight-bold pr-2 text-gold">
                    +
                  </span>
                  Experts
                </button>
            </div>
          </div>
          {filteredExperts &&
            filteredExperts.map((object) => (
              <div
                className="expert"
                key={object.id}
                ref={(el) => (expertRefs.current[object?.id] = el)}
              >
                <ExpertTitleBar {...object} />
                {/* <div className="flex-row d-flex" style={{ overflow: "hidden" }}>
                  <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
                    <ExpertContact
                      object={object}
                      onSelectExpert={() => (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "expert-contact"),
                        setForDeleteExpertId(object.id)
                      )}
                    />

                    <SecondContact
                      object={object}
                      onSelectExpert={() => (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "agency-contact"),
                        setForDeleteExpertId(object.id)
                      )}
                    />

                    <Retained
                      object={object}
                      onSelectExpert={() => (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "retained"),
                        setForDeleteExpertId(object.id)
                      )}
                    />
                  </div>

                  <NotesPanel
                    entity_type={"Experts"}
                    record_id={object.id}
                    module={"Experts"}
                    pagePanels={3}
                  />
                </div> */}
                <div className="d-flex">
                  <div className="leins-container-four" >
                    <div className="liens-container-item">
                    <ContactPanel
                      id={object?.id}
                      panel_name={"Expert"}
                      className="m-b-5"
                      name={object?.expert_contact?.first_name && `${object.expert_contact.first_name} ${object?.expert_contact?.last_name ? object?.expert_contact?.last_name : ""}`}
                      catgegory={object?.expert_catagery_names[0]}
                      address1={object?.expert_contact?.address1}
                      address2={object?.expert_contact?.address2}
                      email={object?.expert_contact?.email}
                      phone_number={object?.expert_contact?.phone_number}
                      city={object?.expert_contact?.city}
                      state={object?.expert_contact?.state}
                      zip_code={object?.expert_contact?.zip}
                      fax_number={object?.expert_contact?.fax}
                      ext={object?.expert_contact?.phone_ext}
                      websiteURL={object?.expert_contact?.website}
                      onSelectObject={() =>(
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "expert-contact"),
                        setForDeleteExpertId(object.id)
                      )}
                      buttonData={ExpertButtons}
                      pageName="Experts"
                    />
                    </div>
                    <div className="liens-container-item">
                      <InformationPanel
                        panel_name={"Field Of Expertise"}
                        className="m-b-5"
                        data={object?.expert_catagery_names?.map(name => ({ value: name }))}
                        dataClassName="text-left"
                        onSelectReport={() =>
                        (
                          setSelectedExpert(object),
                          (selectedEditableTabPanel.current = "expertise"),
                          setForDeleteExpertId(object.id)
                        )
                        }
                      />
                    </div>
                    <div className="liens-container-item">
                    <ContactPanel
                      id={object?.id}
                      panel_name={"Expert Agency"}
                      className="m-b-5"
                      catgegory={object?.second_contact?.name}
                      title={"Agency"}
                      name={`${object?.second_contact?.first_name ? object.second_contact.first_name : ""} ${object?.second_contact?.last_name ? object.second_contact.last_name : ""}`}
                      address1={object?.second_contact?.address1}
                      address2={object?.second_contact?.address2}
                      email={object?.second_contact?.email}
                      phone_number={object?.second_contact?.phone_number}
                      fax_number={object?.second_contact?.fax}
                      city={object?.second_contact?.city}
                      state={object?.second_contact?.state}
                      zip_code={object?.second_contact?.zip}
                      ext={object?.second_contact?.phone_ext}
                      websiteURL={object?.second_contact?.website}
                      onSelectObject={() =>
                      (
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "agency-contact"),
                        setForDeleteExpertId(object.id)
                      )
                      }
                      buttonData={ExpertAgencyButtons}
                      pageName="Experts"
                    />
          
                    </div>
                    <div className="liens-container-item">
                    <InformationPanel
                      id={object?.id}
                      panel_name={"Party Retaining Expert"}
                      className="m-b-5"
                      data={[
                        // {
                        //   label: "Field",
                        //   value: object?.field,
                        // },
                        {
                          label: "Retained By",
                          value: object?.retained_by_name,
                        },
                        {
                          label: "Retainer",
                          value: object?.retainer,
                        },
                        {
                          label: "Rate",
                          value: object?.rate,
                        },
                        {
                          label: "Date Retained",
                          value: formatDateForPanelDisplay(object?.retained),
                        },
                        {
                          label: "Deposition Date",
                          value: "",
                        },
                      ]}
                      onSelectReport={() =>(
                        setSelectedExpert(object),
                        (selectedEditableTabPanel.current = "retained"),
                        setForDeleteExpertId(object.id)
                      )
                      }
                    />
                    </div>
                  </div>
                  <div className="d-flex d-flex-1 p-l-5 m-b-5 overflow-hidden notes-panel-defendant">
                  <NotesPanel
                    record_id={object.id}
                    instanceFor="Experts" //to show height with respect to defendants page
                    module={"Experts"}
                    notesName={"Experts"}
                    pagePanels={3}
                    
                  />
                  </div>
                </div>
                <div className="row documents-wrapper">
                  <div className="col-12">
                    <div className="height-25">
                      <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                        {/* {report.reporting_agency} {report.report_type_name} */}
                        &nbsp;Document Row
                      </h4>
                    </div>
                    <DocumentRow clientProvider={object} page="Experts" />
                  </div>
                </div>
              </div>
            ))}
          <NotesSectionDashboard />
        </div>

        {/* edit report all data component */}
        {selectedExpert && (
          <EditCaseExpertModal
            show={true}
            handleClose={handleCloseFucton}
            expert={selectedExpert}
            onFetchExperts={handleFacthExperts}
            onShowDeleteConfirmPopup={showDeleteConfirmPopup}
            activeTab={selectedEditableTabPanel.current}
            ExpertButtons={ExpertButtons}
            ExpertAgencyButtons={ExpertAgencyButtons}
            setSelectedExpert={setSelectedExpert}
            setForDeleteExpertId={setForDeleteExpertId}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmDeletePopup
            handleDeleteSubmission={handleDeleteSubmission}
            handleClose={hideDeleteConfirmPopup}
            entity="Expert"
          />
        )}
        {show && 
          <NewCaseExpertModal
            show={show}
            handleClose={handleClose}
            fetchExperts={handleFacthExperts}
          />
        }
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ExpertsPage;
