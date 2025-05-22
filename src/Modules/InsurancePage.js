import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import ActionBar from "../Components/Insurance/Actionbar";
import TitleBar from "../Components/Insurance/TitleBar";
import InsuranceCompany from "../Components/Insurance/InsuranceCompany";
import Adjsuter from "../Components/Insurance/Adjuster";
import Supervisor from "../Components/Insurance/Supervisor";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import {
  fetchInsurances,
  fetchCreateInsuranceModalData,
  deleteInsurance,
} from "../Redux/insurance/insuranceSlice";
import { useLocation } from "react-router-dom";
import ClaimInfo from "../Components/Insurance/ClaimInfo";
import InsuranceModal from "../Components/Insurance/InsuranceModal";
import "../Components/Insurance/InsurancePage.css";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import { fetchShakespeareStatus } from "../Utils/helper";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import ConfirmDeleteModal from "../Components/Insurance/ConfirmDeleteModal";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import Footer from "../Components/common/footer";

export default function InsurancePage() {
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const [editModal, setEditModal] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInsuranceDeletionId, setSelectedInsuranceDeletionId] =
    useState(null);
  const caseID = useSelector((state) => state?.caseData?.current?.id);
  const clientID = useSelector((state) => state?.client?.current?.id);
  // For controling Insurance Modal
  const [modalShow, setModalShow] = useState(false);
  const [activeTav, setActiveTab] = useState("company");
  // For Getting Data
  const {
    data: insurances,
    error,
    loading,
    modalData,
  } = useSelector((state) => state.insurances);
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log("Insurances has been changed")
  },[insurances])

  // For scolling to a specific report page
  const insuranceRefs = useRef({});
  const containerRef = useRef(null);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);

  //   Extracting the client_id and case_id from URL which is expected to /some/client_id/case_id
  const regex = /\d+/g;
  const { pathname } = useLocation();
  // Use match method to find all numbers
  const numbers = pathname.match(regex);
  // Convert the array of string numbers to an array of integers
  const URLParams = numbers.map(Number);

  // Fetching the insurances and data for AddInsuranceModal
  useEffect(() => {
    fetchShakespeareStatus(caseID, clientID, "Insurance", dispatch);
    dispatch(
      fetchInsurances({ client_id: URLParams[0], case_id: URLParams[1] })
    );
    dispatch(
      fetchCreateInsuranceModalData({
        client_id: URLParams[0],
        case_id: URLParams[1],
      })
    );
  }, [dispatch]);



  useEffect(()=>{
     console.log("Insurances changed")
  },[insurances])

  // handle InsuranceCreation
  const handleInsuranceCreation = () => {
    dispatch(
      fetchInsurances({ client_id: URLParams[0], case_id: URLParams[1] })
    );
  };
  // handle insurance Deletion
  const handleDelete = async () => {
    await dispatch(
      deleteInsurance({ insurance_id: selectedInsuranceDeletionId })
    );
    setShowDeleteModal(false);
    setSelectedInsuranceDeletionId(null);
    handleInsuranceCreation();
  };
  const deleteInsuranceHandler = (id) => {
    setModalShow(false);
    setShowDeleteModal(true);
    setSelectedInsuranceDeletionId(id);
  };
  // Handling click event and passing the clicked Insurance to the Modal for editing
  const extractDataForEditModal = (event) => {
    const id = event.currentTarget.id;
    const insurance = insurances.filter((data) => data.id == id);
    setEditModal({ ...insurance[0], insurance_id: id });
  };

  const handleEditModalShow = (tab) => {
    setActiveTab(tab);
    setModalShow(true);
  };

  // For Scrolling to specfic defendant record from redirected from search page
  useEffect(() => {
    // Scroll to that specific record
    if (searchRecordId && insuranceRefs.current[searchRecordId]) {
      const searchRecordElement = insuranceRefs.current[searchRecordId];
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
  }, [insurances]);
  const open = useSelector((state) => state?.open?.open);
  return (
    <>
    <div className="page-wrapper">
      <Sidebar pages={pages} />
      <div className="page-container">
        <NavBar
          flaggedPageName="Insurance"
          client={client}
          currentCase={currentCase}
        />
        <ActionBar
          onInsuranceCreation={handleInsuranceCreation}
          modalData={modalData}
        />
        <div
          className="reports-main-container"
          ref={containerRef}
          style={{
            overflowY: "auto",
            maxHeight: "100vh",
            paddingLeft: "0px",
            zIndex: open ? "0" : "",
          }}
        >
          {insurances &&
            [...insurances].map((data,index) => (
              <div ref={(el) => (insuranceRefs.current[data?.id] = el)} key={data.id}>
                <div className="report m-b-5" >
                  <TitleBar
                    insurance_type={data?.insurance_type?.name}
                    entity_name={data?.entity_name}
                    client_name={`${data?.for_client?.first_name} ${data?.for_client.last_name}`}
                    entity_id={data?.id}
                    record_id={data?.record_id}
                  />
                  <div
                    className="flex-row d-flex"
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      onClick={extractDataForEditModal}
                      id={data?.id}
                      className="row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels"
                    >
                      <div className="d-flex">
                        <InsuranceCompany
                          insuranceCompany={data?.company_contact}
                          handleEditModalShow={handleEditModalShow}
                        />

                        <Adjsuter
                          adjuster={data?.adjuster}
                          handleEditModalShow={handleEditModalShow}
                        />
                      </div>

                      <div className="d-flex">
                        <Supervisor
                          supervisor={data?.supervisor}
                          handleEditModalShow={handleEditModalShow}
                        />

                        <div>
                          <ClaimInfo
                            insurance_type_name={data?.insurance_type?.name}
                            insurance_liabilityLimit={data?.liabilityLimit}
                            insurance_liabilityLimitAll={
                              data?.liabilityLimitAll
                            }
                            insurance_policy_number={data?.policy_number}
                            insurance_claim_number={data?.claim_number}
                            insurance_Dateconfirmedactive={
                              data?.Dateconfirmedactive
                            }
                            handleEditModalShow={handleEditModalShow}
                          />
                        </div>
                      </div>
                    </div>
                    <NotesPanel record_id={data.id} module={"Insurance"} />
                  </div>
                </div>
                <div className="row documents-wrapper m-t-5">
                  <div className="col-12">
                    <div className="height-25">
                      <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                        {/* {report.reporting_agency} {report.report_type_name} */}
                        &nbsp;Document Row
                      </h4>
                    </div>
                    <DocumentRow clientProvider={data} page="Insurance" index={index} />
                  </div>
                </div>
              </div>
            ))}
          <NotesSectionDashboard />
        </div>

        {modalShow && (
          <InsuranceModal
            states={modalData?.states}
            insuranceTypes={modalData?.insurance_types}
            insurance={editModal}
            litigation={modalData?.litigation}
            show={modalShow}
            handleInsuranceCreation={handleInsuranceCreation}
            handleClose={() => setModalShow(false)}
            activeTab={activeTav}
            deleteInsuranceHandler={deleteInsuranceHandler}
          />
        )}

        {showDeleteModal && (
          <ConfirmDeleteModal
            handleClose={() => setShowDeleteModal(false)}
            handleDeleteSubmission={handleDelete}
          />
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
