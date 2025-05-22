import React, { useState } from "react";
import TitleBar from "../../Insurance/TitleBar";
import InsuranceCompany from "../../Insurance/InsuranceCompany";
import Adjsuter from "../../Insurance/Adjuster";
import NotesPanel from "../../NotesPanelSection/NotesPanel";
import DocumentRow from "../../DocumentRow/DocumentRow";
import ClaimInfo from "../../Insurance/ClaimInfo";
import Supervisor from "../../Insurance/Supervisor";
import InsuranceModal from "../../Insurance/InsuranceModal";
import { useDispatch, useSelector } from "react-redux";
import { deleteInsurance } from "../../../Redux/insurance/insuranceSlice";
import ConfirmDeletePopup from "../../DefendantPage/DefandantMain/ConfirmDeletePopup";

function InsuranceMain({
  object,
  handleFetchWitnesses,
}) {
  const [insuranceModalShow, setInsuranceModalShow] = useState(false);
  const [activeInsuranceTab, setActiveInsuranceTab] = useState("company");
  const [showDeleteInsuranceModal, setShowDeleteInsuranceModal] =
    useState(false);
  const dispatch = useDispatch();

  const { modalData } = useSelector((state) => state.insurances);

  const handlefecth = () => handleFetchWitnesses(true);

  const handleEditModalShow = (tab) => {
    setActiveInsuranceTab(tab);
    setInsuranceModalShow(true);
  };

  const handleDeleteShow = () => {
    setInsuranceModalShow(!insuranceModalShow);
    setShowDeleteInsuranceModal(!showDeleteInsuranceModal);
  };

  // handle insurance Deletion
  const handleDeleteInsurance = async () => {
    await dispatch(deleteInsurance({ insurance_id: object?.id }));
    setShowDeleteInsuranceModal(false);
    handlefecth();
  };

  return (
    <div className="expert" key={object?.id}>
      <TitleBar
        insurance_type={object?.insurance_type?.name}
        entity_name={object?.entity_name}
        client_name={`${object?.for_client?.first_name} ${object?.for_client?.last_name}`}
        entity_id={object?.id}
        record_id={object?.record_id}
      />
      <div className="flex-row d-flex"
          style={{overflow: 'hidden'}}>
        <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5">
          <div className="d-flex">
            <InsuranceCompany
              insuranceCompany={object?.company_contact}
              handleEditModalShow={handleEditModalShow}
            />

            <Adjsuter
              adjuster={object?.adjuster}
              handleEditModalShow={handleEditModalShow}
            />
          </div>
          <div className="d-flex">
            <Supervisor
              supervisor={object?.supervisor}
              handleEditModalShow={handleEditModalShow}
            />

            <ClaimInfo
              insurance_type_name={object?.insurance_type?.name}
              insurance_liabilityLimit={object?.liabilityLimit}
              insurance_liabilityLimitAll={object?.liabilityLimitAll}
              insurance_policy_number={object?.policy_number}
              insurance_claim_number={object?.claim_number}
              insurance_Dateconfirmedactive={object?.Dateconfirmedactive}
              handleEditModalShow={handleEditModalShow}
            />
          </div>
        </div>

        <NotesPanel
          entity_type={"Insurance"}
          record_id={object.id}
          module={"Insurance"}
        />
      </div>
      <div className="row documents-wrapper m-t-5">
        <div className="col-12">
          <div className="height-25">
            <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
              &nbsp;Document Row
            </h4>
          </div>
          <DocumentRow clientProvider={object} page="Insurance" />
        </div>
      </div>

      {insuranceModalShow && (
        <InsuranceModal
          states={modalData?.states}
          insuranceTypes={modalData?.insurance_types}
          insurance={object} //editInsuranceModal
          litigation={modalData?.litigation}
          show={insuranceModalShow}
          handleInsuranceCreation={handlefecth} //pass handlefecth
          handleClose={() => setInsuranceModalShow(false)}
          activeTab={activeInsuranceTab}
          deleteInsuranceHandler={handleDeleteShow}
        />
      )}

      {showDeleteInsuranceModal && (
        <ConfirmDeletePopup
          entity="Insurance"
          handleClose={handleDeleteShow}
          handleDeleteSubmission={handleDeleteInsurance}
        />
      )}
    </div>
  );
}

export default InsuranceMain;
