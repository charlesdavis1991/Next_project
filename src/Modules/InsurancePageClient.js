import React, { useEffect, useState, useContext } from "react";
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
  deleteInsurance
} from "../Redux/insurance/insuranceSlice";
import { useLocation } from "react-router-dom";
import ClaimInfo from "../Components/Insurance/ClaimInfo";
import InsuranceModal from "../Components/Insurance/InsuranceModal";
import "../Components/Insurance/InsurancePage.css";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import { fetchShakespeareStatus } from '../Utils/helper';
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import ConfirmDeleteModal from "../Components/Insurance/ConfirmDeleteModal";
import ClientCheckList from "./ClientCkeckList";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import PanelActionBarComponent from "../Components/common/PanelActionBarComponent";
import InsuranceIcon from '../../public/BP_resources/images/icon/insurance-icon-color.svg';

export default function InsurancePageClient() {
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const [editModal, setEditModal] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInsuranceDeletionId, setSelectedInsuranceDeletionId] = useState(null)
  const caseID = useSelector((state) => state?.caseData?.current?.id);
  const clientID = useSelector((state) => state?.client?.current?.id);
  const { isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);
  // For controling Insurance Modal
  const [modalShow, setModalShow] = useState(false);
  const [activeTav, setActiveTab] = useState('company');
  // For Getting Data
  const {
    data: insurances,
    error,
    loading,
    modalData,
  } = useSelector((state) => state.insurances);
  const dispatch = useDispatch();



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
  }, [dispatch, isClientDataUpdated]);

  // handle InsuranceCreation
  const handleInsuranceCreation = () => {
    dispatch(
      fetchInsurances({ client_id: URLParams[0], case_id: URLParams[1] })
    );
  };
  // handle insurance Deletion
  const handleDelete = async () => {
    await dispatch(deleteInsurance({ insurance_id: selectedInsuranceDeletionId }))
    setShowDeleteModal(false)
    setSelectedInsuranceDeletionId(null)
    handleInsuranceCreation()
  }
  const deleteInsuranceHandler = (id) => {
    setModalShow(false)
    setShowDeleteModal(true)
    setSelectedInsuranceDeletionId(id)
  }
  // Handling click event and passing the clicked Insurance to the Modal for editing
  const extractDataForEditModal = (event) => {
    const id = event.currentTarget.id;
    const insurance = insurances.filter((data) => data.id == id);
    setEditModal({ ...insurance[0], insurance_id: id });

  };


  const handleEditModalShow = (tab) => {
    setActiveTab(tab)
    setModalShow(true)
  }

  return (
    <>
      <div>
        {insurances &&
          [...insurances].map((data) => (
            <>
              <div className="report m-b-5" key={data.id}>
              <PanelActionBarComponent
                  panelIconSrc={InsuranceIcon}
                  instanceForName={data?.insurance_type?.name}
                  page_name={"Client"}
                  id={data?.id}
                  forInstanceName={
                     `${data?.for_client?.first_name || ""} ${data?.for_client?.last_name || ""}`
                  }
                />
                <div className="" style={{ display: 'flex', flexDirection: "row", paddingLeft: "5px", overflow: 'hidden' }} >
                  <div onClick={extractDataForEditModal} id={data?.id} className="row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels">
                    <div className="d-flex">
                      <div>
                        <InsuranceCompany
                          insuranceCompany={data?.company_contact}
                          handleEditModalShow={handleEditModalShow}
                        />
                      </div>

                      <div>
                        <Adjsuter 
                          adjuster={data?.adjuster}
                          handleEditModalShow={handleEditModalShow} 
                        />
                      </div>
                    </div>

                    <div className="d-flex">
                      <div>
                        <Supervisor 
                          supervisor={data?.supervisor} 
                          handleEditModalShow={handleEditModalShow} 
                        />
                      </div>

                      <div>
                        <ClaimInfo
                          insurance_type_name={data?.insurance_type?.name}
                          insurance_liabilityLimit={data?.liabilityLimit}
                          insurance_liabilityLimitAll={data?.liabilityLimitAll}
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
                  <NotesPanel record_id={data.id} module={"Insurance"} pagePanels={4} />
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
                  <DocumentRow clientProvider={data} page="Insurance" />
                </div>
              </div>
            </>

          ))}
        <div className="row esignatures-wrapper no-gutters">
          {/* Counsels components */}
          <ClientCheckList />
        </div>
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
        <ConfirmDeleteModal handleClose={() => setShowDeleteModal(false)} handleDeleteSubmission={handleDelete} />
      )}
    </>
  );

}
