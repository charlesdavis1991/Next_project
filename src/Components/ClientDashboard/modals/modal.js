import React, { Children, useState } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import ClientNameModalBody from "./clientNameModal";
import ModalBody from "./clientPhoneModal";
import ModalBodyEmail from "./clientEmailModal";
import ModalBodyAddress1 from "./clientAddressModal";
import ModalBodyAddress2 from "./clientAddressModel2";
import ModalBodyIdentify from "./clientIdentification";
import ModalBodySpouseCon from "./clientSpouseContact";
import ModalBodySpouseInfo from "./clientSpouseInfo";
import ModalBodyEmergencyCon from "./emergencyContact";
import ModalBodyEmergencyInfo from "./emergencyInfo";
import AvatarModal from "./AvatarModal";

const ClientNameModal = ({ handleClose, show, clientData, defaultTab }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // This will store the submit handlers for each child
  const formRefs = {};

  const onSubmitHandler = async () => {
    if (formRefs[activeTab]) {
      setLoading(true);
      try {
        await formRefs[activeTab].submit(); // Trigger submission for the active form
        setLoading(false);
        handleClose(); // Close modal after successful save
      } catch (error) {
        console.error("Form submission error:", error);
        setLoading(false);
      }
    }
  };

  const [signal, setSignal] = useState(false);

  const sendSignal = () => {
      setSignal(true);
  };

  // Function to reset the signal
  const resetSignal = () => {
      setSignal(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-lg modal-dialog-centered max-800p edit-client-dialog"
    >
      <div style={{ height: "420px" }}>
        <Modal.Header className="modal-header text-center">
          <h5
            className="modal-title mx-auto"
          >
            Edit Client Information
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="custom-tab mt-3">
            <Tab.Container defaultActiveKey={defaultTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="justify-content-around">
                <Nav.Link
                  className=""
                  eventKey="edit-name"
                >
                  Name
                </Nav.Link>

                <Nav.Link
                  className=""
                  eventKey="edit-phone"
                >
                  Phone Numbers
                </Nav.Link>

                <Nav.Link
                  className=""
                  eventKey="edit-emails"
                >
                  Emails
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-address1"
                >
                  Address 1
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-address2"
                >
                  Address 2
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-identification"
                >
                  Identification
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-spouse-contact"
                >
                  Spouse Contact
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-spouse-information"
                >
                  Spouse Information
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-emergency-contact"
                >
                  Emergency Contact
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-emergency-information"
                >
                  Emergency Information
                </Nav.Link>
                <Nav.Link
                  className=""
                  eventKey="edit-avatar"
                >
                  Avatar
                </Nav.Link>
              </Nav>
              <div className="mt-2">
                <Tab.Content>
                  <Tab.Pane eventKey="edit-name">
                    <ClientNameModalBody ref={(ref) => (formRefs["edit-name"] = ref)} current_first_name={clientData?.first_name} current_middle_name={clientData?.middle_name} current_last_name={clientData?.last_name} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-phone">
                    <ModalBody ref={(ref) => (formRefs["edit-phone"] = ref)} current_cont_1={clientData?.phone_numbers[0]} current_cont_2={clientData?.phone_numbers[1]} current_cont_3={clientData?.phone_numbers[2]} handleClose={handleClose} primary_phone_id={clientData?.primaryPhone?.primary_id} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-emails">
                    <ModalBodyEmail ref={(ref) => (formRefs["edit-emails"] = ref)} current_cont_1={clientData?.Emails[0]} current_cont_2={clientData?.Emails[1]} current_cont_3={clientData?.Emails[2]} handleClose={handleClose} primary_email_id={clientData?.primaryEmail?.primary_id} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-address1">
                    <ModalBodyAddress1 ref={(ref) => (formRefs["edit-address1"] = ref)} id={clientData?.Address1?.currentId} current_address1={clientData?.Address1?.address1} current_address2={clientData?.Address1?.address2} current_city={clientData?.Address1?.city} current_state={clientData?.Address1?.state} current_zip={clientData?.Address1?.zip} mailing_contact={clientData?.Address1?.mailing_contact} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-address2">
                    <ModalBodyAddress2 ref={(ref) => (formRefs["edit-address2"] = ref)} id={clientData?.Address2?.currentId} current_address1={clientData?.Address2?.address1} current_address2={clientData?.Address2?.address2} current_city={clientData?.Address2?.city} current_state={clientData?.Address2?.state} current_zip={clientData?.Address2?.zip} mailing_contact={clientData?.Address2?.mailing_contact} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-identification">
                    <ModalBodyIdentify ref={(ref) => (formRefs["edit-identification"] = ref)} current_title={clientData?.identification?.title} current_birthday={clientData?.identification?.birthday} current_gender={clientData?.identification?.gender} current_license={clientData?.identification?.license} current_ssn={clientData?.identification?.ssn} current_state={clientData?.identification?.license_state} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-spouse-contact">
                    <ModalBodySpouseCon ref={(ref) => (formRefs["edit-spouse-contact"] = ref)} current_first_name={clientData?.spouseContact?.first_name} current_last_name={clientData?.spouseContact?.last_name} current_address1={clientData?.spouseContact?.address1} current_address2={clientData?.spouseContact?.address2} current_city={clientData?.spouseContact?.city} current_state={clientData?.spouseContact?.state} current_zip={clientData?.spouseContact?.zip} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-spouse-information">
                    <ModalBodySpouseInfo ref={(ref) => (formRefs["edit-spouse-information"] = ref)} current_first_name={clientData?.spouseContact?.first_name} current_last_name={clientData?.spouseContact?.last_name} current_id={clientData?.spouseInfo?.currentId} current_discusCase={clientData?.spouseInfo?.discuss} current_divorce_date={clientData?.spouseInfo?.DivorcedDate} current_divorced={clientData?.spouseInfo?.status} current_marriage_date={clientData?.spouseInfo?.MarraigeDate} current_email={clientData?.spouseInfo?.email} current_phone={clientData?.spouseInfo?.phone} current_relation={clientData?.spouseInfo?.relationship} handleClose={handleClose} current_spouse_id={clientData?.spouseInfo?.id} current_contact_id={clientData?.spouseInfo?.contact} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-emergency-contact">
                    <ModalBodyEmergencyCon ref={(ref) => (formRefs["edit-emergency-contact"] = ref)} current_first_name={clientData?.emergencyContact?.first_name} current_last_name={clientData?.emergencyContact?.last_name} current_address1={clientData?.emergencyContact?.address1} current_address2={clientData?.emergencyContact?.address2} current_city={clientData?.emergencyContact?.city} current_state={clientData?.emergencyContact?.state} current_zip={clientData?.emergencyContact?.zip} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-emergency-information">
                    <ModalBodyEmergencyInfo ref={(ref) => (formRefs["edit-emergency-information"] = ref)} current_relation={clientData?.emergencyInfo?.relation} current_discusCase={clientData?.emergencyInfo?.discuss} current_email={clientData?.emergencyInfo?.email} current_phone={clientData?.emergencyInfo?.phone} handleClose={handleClose} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="edit-avatar">
                    <AvatarModal ref={(ref) => (formRefs["edit-avatar"] = ref)} first_name={clientData?.first_name} middle_name={clientData?.middle_name} last_name={clientData?.last_name} hideModal={handleClose} Avatars={clientData?.Avatars} photos={clientData?.photos} resetSignal={resetSignal} signal={signal} />
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </Modal.Body>
        <div class="modal-footer border-0 justify-content-between pt-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Close
          </button>
          {activeTab === "edit-avatar" ? (
            <button type="button" className="btn btn-danger" onClick={sendSignal}>
              {loading ? 'Resetting...' : 'Reset Client Avatar'}
            </button>
          ) :
            (null)}
          {<button type="button" className="btn btn-success" onClick={onSubmitHandler}>
            {loading ? 'Saving...' : 'Save'}
          </button>}
        </div>
      </div >
    </Modal >
  );
}

export default ClientNameModal;