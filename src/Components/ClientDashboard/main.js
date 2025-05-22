import React, { useState } from "react";
import ClientName from "./clientName";
import ClientHistory from "./clientHistory";
import ClientImages from "./clientImages";
import ClientTable from "./clientTable";
import Button from "./shared/button";
import ClientSignature from "./clientSignature";
import ClientInsurance from "./clientInsurance";
import ClientSubHeader from "./clientSubHeader";
import ClientNotes from "./clientNotes";
import TableTabs from "./shared/tableTabs";
import Modal from "./modals/modal";
import ClientNameModal from "./modals/clientNameModal";
import ClientPhoneModal from "./modals/clientPhoneModal";
import ClientEmailModal from "./modals/clientEmailModal";
import ClientAddress from "./modals/clientAddressModal";
import ClientIdentification from "./modals/clientIdentification";
import ClientContacts from "./modals/clientContact";
import ClientInformation from "./modals/clientInformation";
import EmergencyContact from "./modals/emergencyContact";
import EmergencyInfo from "./modals/emergencyInfo";
import PortalModal from "./modals/portal";
import GenerateDocumentModal from "./modals/generateDocModal";
import SendEmailModal from "./modals/sendEmailModal";
import SSNModal from "./modals/ssnModal";

const ClientDashboard = (props) => {
  const client = {
    first_name : "Iqrma",
    last_name : "Amir"
}

const clientCase = [
    {
        name: "Car Accident",
        incident_date: "12/13/2000",
        open: 'True'
    },
    {
        name: "Defective Product",
        incident_date: "12/13/2000",
        open: 'True'
    }
]
  // States
  const [clientName, setClientName] = useState(false);
  const [clientPhone, setClientPhone] = useState(false);
  const [clientEmail, setClientEmail] = useState(false);
  const [clientAddressOne, setClientAddressOne] = useState(false);
  const [clientAddressTwo, setClientAddressTwo] = useState(false);
  const [clientIdentification, setClientIdentification] = useState(false);
  const [clientContact, setClientContact] = useState(false);
  const [clientInformation, setClientInformation] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState(false);
  const [emergencyInfo, setEmergencyInfo] = useState(false);
  const [portal, setPortal] = useState(false);
  const [genDoc, setGenDoc] = useState(false);
  const [sendEmailModal, setSendEmailModal] = useState(false);
  const [ssn, setSsn] = useState(false);

  // Handlers
  const showClientModal = (event) => {
    event.preventDefault();
    setClientName(!clientName);
  };

  const showClientPhone = (event) => {
    event.preventDefault();
    setClientPhone(!clientPhone);
  };

  const showClientEmials = (event) => {
    event.preventDefault();
    setClientEmail(!clientEmail);
  };

  const showClientAddressOne = (event) => {
    event.preventDefault();
    setClientAddressOne(!clientAddressOne);
  };

  const showClientAddressTwo = (event) => {
    event.preventDefault();
    setClientAddressTwo(!clientAddressTwo);
  };

  const showClientIdentification = (event) => {
    event.preventDefault();
    setClientIdentification(!clientIdentification);
  };

  const showClientContact = () => {
    setClientContact(!clientContact);
  };

  const showClientInformation = () => {
    setClientInformation(!clientInformation);
  };

  const showEmergencyContact = () => {
    setEmergencyContact(!emergencyContact);
  };

  const showEmergencyInfo = () => {
    setEmergencyInfo(!emergencyInfo);
  };

  const handlePortal = () => {
    setPortal(!portal);
  };

  const handleGenerateDoc = () => {
    setGenDoc(!genDoc);
  };

  const handleSendEmail = () => {
    setSendEmailModal(!sendEmailModal);
  };

  const handleSSN = () => {
    setSsn(!ssn);
  };

  return (
    <>
      <div className="main-content overflow-x-hidden mt-2">
        <div className="row pl-4 pr-2 mb-1">
          <div className="col-lg-custome-10 col-md-12 col-sm-12 col-12 pl-1">
            <div className="row">
              <div className="col-md-5">
                <ClientHistory
                  client={client}
                  clientCasesProp={clientCase}
                />
              </div>
              <div className="col-md-3">
                <div onClick={showClientModal}>
                  <ClientName
                    first_name = {client.first_name}
                    last_name = {client.last_name}
                  />
                </div>
                <div>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-chat-3d mr-2"
                    buttonText="Chat Client"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div>
                  <ClientImages />
                </div>
              </div>
            </div>
            {/* table components */}
            <div className="row table-messages-wrapper no-gutters flex-g-1 f-gap-05 expanded">
              <div className="placeholder-images">
                <span className="icon-wrap d-block">
                  {" "}
                  <i className="ic ic-placeholder-grey cursor-pointer"></i>{" "}
                </span>
                <span className="icon-wrap d-block">
                  {" "}
                  <i className="ic ic-placeholder-grey cursor-pointer"></i>{" "}
                </span>
              </div>

              <div className="col w-100 has-white-bg tables-parent-wrapper">
                <div className="table-responsive table--no-card table-relative position-relative overflow-y-scroll border-0 tableFixHead has-tint-rows has-tint-top-25 has-tint-h-35 increase-height">
                  <ClientTable />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-custome-2 col-md-12 col-sm-12 col-12 mt-4">
            <div>
              <div className="d-flex align-items-center" onClick={handlePortal}>
                <button className="btn btn-primary-lighter portal-btn font-weight-semibold has-left-skew text-lg text-capitalize height-30 rounded-0 d-flex align-items-center justify-content-center col client-portalButton margin-top-9r ml-lg-5 mr-15">
                  <span
                    className="right-skew-btn left-0"
                    id="skewed-client-portal"
                  ></span>
                  <span className="ic-custom">
                    <i className="ic ic-24 ic-portal m-r-5 mt-1"></i>
                  </span>
                  Client portal settings
                </button>
              </div>
            </div>
            {/* Right panel cards */}
            <div>
              <div>
                <div onClick={showClientEmials}>
                  <ClientName
                    title="Client Email"
                    leftText="reportrequest@ocsheriff.gov00"
                    rightText=""
                  />
                  <ClientName leftText="00" rightText="" />
                  <ClientName
                    leftText="elidrg@sjkdhfg.com00"
                    rightText="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/emailactive.svg"
                  />
                </div>
                <div className="mt-1" onClick={handleSendEmail}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-email-3d m-r-5"
                    buttonText="Email Client"
                  />
                </div>
              </div>
              <div>
                <div onClick={showClientAddressOne}>
                  <ClientName
                    title="Client Address 1"
                    leftText="Lakeasha johnson"
                    rightText=""
                    fontBold="600"
                  />
                  <ClientName leftText="1307 Renner Dr" rightText="" />
                  <ClientName leftText="Address 2" rightText="" />
                </div>
                <div className="mt-1" onClick={handleGenerateDoc}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-generate-document m-r-5"
                    buttonText="Generate Document"
                  />
                </div>
              </div>
              <div>
                <div onClick={showClientAddressTwo}>
                  <ClientName
                    title="Client Address 2"
                    leftText="Lakeasha johnson"
                    rightText="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/mailbox.svg"
                    fontBold="600"
                  />
                  <ClientName
                    leftText="1320 Watersedge Dr Address 2"
                    rightText=""
                  />
                  <ClientName leftText="Dallas, TX 75216" rightText="" />
                </div>
                <div className="mt-1" onClick={handleGenerateDoc}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-generate-document m-r-5"
                    buttonText="Generate Document"
                  />
                </div>
              </div>
              <div>
                <div onClick={showClientIdentification}>
                  <ClientName
                    title="CLIENT IDENTIFICATION"
                    leftText="Title:"
                    rightText="Male00,Mr."
                  />
                  <ClientName leftText="Birthday:" rightText="8/03/1990" />
                  <ClientName leftText="License:" rightText="3498t39gri5g MT" />
                </div>
                <div className="mt-1" onClick={handleSSN}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-ssn m-r-5"
                    buttonText="View SSN"
                  />
                </div>
              </div>
              <div>
                <div onClick={showClientContact}>
                  <ClientName
                    title="Client Spouse Contact"
                    leftText="john smith"
                    rightText=""
                    fontBold="600"
                  />
                  <ClientName
                    leftText="123 mian St, Ste 30000000"
                    rightText=""
                  />
                  <ClientName leftText="HoustonTX234562" rightText="" />
                </div>
                <div className="mt-1" onClick={handleGenerateDoc}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-generate-document m-r-5"
                    buttonText="generate document"
                  />
                </div>
              </div>
              <div>
                <div onClick={showClientInformation}>
                  <ClientName
                    title="Client Spouse Information"
                    leftText="Wife Married,"
                    rightText=""
                    fontBold="600"
                  />
                  <ClientName
                    leftText="DIscuss:"
                    rightText="Yes"
                    color={true}
                  />
                  <ClientName leftText="Phone:" rightText="(000) 000-0000" />
                </div>
                <div className="mt-1" onClick={handleSendEmail}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-email-3d m-r-5"
                    buttonText="35345@etrhet.com"
                  />
                </div>
              </div>
              <div>
                <div onClick={showEmergencyContact}>
                  <ClientName
                    title="Emergency Contact"
                    leftText="john Doe"
                    rightText=""
                    fontBold="600"
                  />
                  <ClientName leftText="456 Main St, Apt 2345" rightText="" />
                  <ClientName leftText="Long Beach IA 90813200" rightText="" />
                </div>
                <div className="mt-1" onClick={handleGenerateDoc}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-generate-document m-r-5"
                    buttonText="generate document"
                  />
                </div>
              </div>
              <div>
                <div onClick={showEmergencyInfo}>
                  <ClientName
                    title="Emergency Information"
                    leftText="Relationship:"
                    rightText="Father"
                  />
                  <ClientName
                    leftText="Discuss:"
                    rightText="Yes"
                    color={true}
                  />
                  <ClientName leftText="Phone:" rightText="((87)6)-439-8735" />
                </div>
                <div className="mt-1" onClick={handleSendEmail}>
                  <Button
                    showButton={true}
                    icon="ic ic-19 ic-email-3d m-r-5"
                    buttonText="Email Contact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* signature component  */}
        <div className="mt-2 mb-4 row esignatures-wrapper no-gutters">
          <div className="col-12">
            <div class="background-main-10 height-25 d-flex align-items-center justify-content-center">
              <h4 class="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                E-Signature template for client
              </h4>
            </div>
            <div className="row">
              <div className="col-12 col-md-3 col-xl pl-0 pr-0 ml-3 mt-2 bg-primary-100">
                <ClientSignature
                  p="p-2"
                  sign="Signed"
                  name="1. example template 1"
                  icon="ic ic-16 ic-md-25 ic-esignature m-r-5 m-l-5s"
                />
              </div>
              <div className="col-12 col-md-3 col-xl pl-0 pr-0 ml-3 mt-2 bg-primary-101">
                <ClientSignature
                  p="p-2"
                  sign="Signed"
                  name="2. example template 2"
                  icon="ic ic-16 ic-md-25 ic-esignature m-r-5 m-l-5s"
                />
              </div>
              <div className="col-12 col-md-3 col-xl pl-0 pr-0 ml-3 mt-2 bg-primary-100">
                <ClientSignature
                  p="p-2"
                  sign="Signed"
                  name="3. example template 3"
                  icon="ic ic-16 ic-md-25 ic-esignature m-r-5 m-l-5s"
                />
              </div>
              <div className="col-12 col-md-3 col-xl pl-0 pr-0 ml-3 mt-2 bg-primary-101">
                <ClientSignature
                  p="p-2"
                  sign="Signed"
                  name="4. example template 4"
                  icon="ic ic-16 ic-md-25 ic-esignature m-r-5 m-l-5s"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 mb-4 row esignatures-wrapper no-gutters">
          <div className="col-12">
            <ClientInsurance />
          </div>
        </div>
        <ClientNotes />
        <TableTabs />
      </div>
      <Modal show={clientName} onHide={() => setClientName(false)}>
        <ClientNameModal hideModal={() => setClientName(false)} />
      </Modal>
      <Modal show={clientPhone} onHide={() => setClientPhone(false)}>
        <ClientPhoneModal hideModal={() => setClientPhone(false)} />
      </Modal>
      <Modal show={clientEmail} onHide={() => setClientEmail(false)}>
        <ClientEmailModal hideModal={() => setClientEmail(false)} />
      </Modal>
      <Modal show={clientAddressOne} onHide={() => setClientAddressOne(false)}>
        <ClientAddress
          hideModal={() => setClientAddressOne(false)}
          number="1"
        />
      </Modal>
      <Modal show={clientAddressTwo} onHide={() => setClientAddressTwo(false)}>
        <ClientAddress
          hideModal={() => setClientAddressTwo(false)}
          number="2"
        />
      </Modal>
      <Modal
        show={clientIdentification}
        onHide={() => setClientIdentification(false)}
      >
        <ClientIdentification
          hideModal={() => setClientIdentification(false)}
        />
      </Modal>
      <Modal show={clientContact} onHide={() => setClientContact(false)}>
        <ClientContacts hideModal={() => setClientContact(false)} />
      </Modal>
      <Modal
        show={clientInformation}
        onHide={() => setClientInformation(false)}
      >
        <ClientInformation hideModal={() => setClientInformation(false)} />
      </Modal>
      <Modal show={emergencyContact} onHide={() => setEmergencyContact(false)}>
        <EmergencyContact hideModal={() => setEmergencyContact(false)} />
      </Modal>
      <Modal show={emergencyInfo} onHide={() => setEmergencyInfo(false)}>
        <EmergencyInfo hideModal={() => setEmergencyInfo(false)} />
      </Modal>
      <Modal show={portal} onHide={() => setPortal(false)} size="modal-w80">
        <PortalModal hideModal={() => setPortal(false)} />
      </Modal>
      <Modal show={genDoc} onHide={() => setGenDoc(false)} size="modal-w80">
        <GenerateDocumentModal hideModal={() => setGenDoc(false)} />
      </Modal>
      <Modal show={sendEmailModal} onHide={() => setSendEmailModal(false)}>
        <SendEmailModal hideModal={() => setSendEmailModal(false)} />
      </Modal>
      <Modal show={ssn} onHide={() => setSsn(false)} size="modal-w40">
        <SSNModal hideModal={() => setSsn(false)} />
      </Modal>
    </>
  );
};

export default ClientDashboard;
