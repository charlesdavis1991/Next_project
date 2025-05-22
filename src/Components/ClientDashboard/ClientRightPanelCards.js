import React, { useEffect, useState, useContext } from "react";
import ContactInfo from "./ContactInfo";
import PreviewPortalModal from "./modals/ClientPortalModal";
import SsnModalBody from "./modals/ssnModal";
import { formatDate, getCaseId, getClientId } from "../../Utils/helper";
import axios from "axios";
import ClientNameModal from "./modals/modal";
import ModalBodyMessage from "./modals/clientMessageModal";
import { ClientDataContext } from "./shared/DataContext";
import "./../../../public/BP_resources/css/client-4.css";
import { useMediaQuery } from "react-responsive";
import ClientPortalButton from "./clientPortalButton";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import InformationPanel from "../common/InformationPanel";
import Button from "./shared/button";
import mail from "../../../public/BP_resources/images/icon/mailbox.svg";
import check from "../../../public/BP_resources/images/icon/checkmark.svg";
import activeEmail from "../../../public/BP_resources/images/icon/emailactive.svg";
import InfoPanelWithoutKeyValue from "./shared/InfoPanelWithoutKeyValue";
import ClientEditModal from "./Modal/ClientModal";

const ClientRightPanelCards = ({
  CardsData,
  isPhoneShow,
  isEmailShow,
  isAddress1Show,
  isAddress2Show,
  isNameShow,
  isClientIdentification,
  hasClientSpouse,
  hasClientSpouseInfo,
  hasEmergencyContact,
  hasEmergencyInfo,
}) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();

  const [showClientPortalModal, setShowClientPortalModal] = useState(false);

  //Edit Modal Values
  const [showEditModal, setshowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("edit-name"); // State to store the active tab

  // Handle Edit Modal value
  const handleEditModalOpen = (value, tabKey = "edit-name") => {
    setshowEditModal(value);
    setActiveTab(tabKey); // Set the tab key based on which element is clicked
  };

  //Button Modal Values
  const [showSSNModal, setShowSSNModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const [showGenreateDocumentModal, setShowGenreateDocumentModal] =
    useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
  const [dropdownName, setDropdownName] = useState("");

  //handle BUTTON MODAL values to open
  const handleSsnModalOpen = (value) => {
    setShowSSNModal(value);
  };

  //to close the modals
  function handleClientPortalClose() {
    setShowClientPortalModal(false);
  }

  function handleSsnModalClose() {
    setShowSSNModal(false);
  }

  function handleEditModalClose() {
    setshowEditModal(false);
  }

  function handleEmailModalClose() {
    setShowEmailModal(false);
  }

  //handle BUTTON MODAL values to open for Email
  const handleEmailModalOpen = (value) => {
    setShowEmailModal(value);
  };

  function handleTextModalClose() {
    setShowTextModal(false);
  }

  //handle BUTTON MODAL values to open for text
  const handleTextModalOpen = (value) => {
    setShowTextModal(value);
  };

  const handleChatModalOpen = () => {
    setShowChatModal(true);
  };

  function handleChatModalClose() {
    setShowChatModal(false);
  }

  const clientNameData = [
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"First"}
        </span>
      ),
      value: CardsData?.first_name,
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Middle"}
        </span>
      ),
      value: CardsData?.middle_name
        ? CardsData.middle_name.charAt(0).toUpperCase() +
          CardsData.middle_name.slice(1)
        : "",
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Last"}
        </span>
      ),
      value: CardsData?.last_name,
    },
  ];

  const clientPhoneNumbers = CardsData?.phone_numbers?.map((number, idx) => {
    return {
      label: number?.phone_number ? (
        number?.phone_number
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"(###) ###-####"}
        </span>
      ),
      value:
        number?.currentId === CardsData?.primaryPhone?.primary_id ? (
          <img
            src={check}
            alt="primary"
            className="ic-19 d-flex align-items-center height-21"
          />
        ) : (
          ""
        ),
    };
  });
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const clientEmail = CardsData?.Emails?.map((emails, idx) => {
    return {
      label: emails?.email ? (
        truncateText(emails?.email, 25)
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"email@xyz.com"}
        </span>
      ),
      value:
        emails?.currentId === CardsData?.primaryEmail?.primary_id ? (
          <img
            src={activeEmail}
            alt="primary"
            className="ic-19 d-flex align-items-center height-21"
          />
        ) : (
          ""
        ),
    };
  });

  const clientAddress1 = [
    {
      label: (
        <>
          {CardsData?.Address1?.first_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"First"}
            </span>
          )}{" "}
          {CardsData?.Address1?.last_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Last"}
            </span>
          )}
        </>
      ),
      value:
        CardsData?.Address1?.currentId ===
        CardsData?.mailingContact?.primary_id ? (
          <img
            src={mail}
            alt="primary"
            className="ic-19 d-flex align-items-center height-21"
          />
        ) : (
          ""
        ),
    },
    {
      label: (
        <>
          {CardsData?.Address1?.address1 || CardsData?.Address1?.address2 ? (
            <>
              {CardsData?.Address1?.address1 || ""}
              {CardsData?.Address1?.address2
                ? `, ${CardsData.Address1.address2}`
                : ""}
            </>
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Address"}
            </span>
          )}
        </>
      ),
      value: "",
    },
    {
      label: (
        <>
          {CardsData?.Address1?.city || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"City"}
            </span>
          )}
          {CardsData?.Address1?.state ? (
            `, ${CardsData.Address1.state}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {", State"}
            </span>
          )}
          {CardsData?.Address1?.zip ? (
            ` ${CardsData.Address1.zip}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {" Zip"}
            </span>
          )}
        </>
      ),
      value: "",
    },
  ];

  const clientAddress2 = [
    {
      label: (
        <>
          {CardsData?.Address2?.first_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"First"}
            </span>
          )}{" "}
          {CardsData?.Address2?.last_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Last"}
            </span>
          )}
        </>
      ),
      value:
        CardsData?.Address2?.currentId ===
        CardsData?.mailingContact?.primary_id ? (
          <img
            src={mail}
            alt="primary"
            className="ic-19 d-flex align-items-center height-21"
          />
        ) : (
          ""
        ),
    },
    {
      label: (
        <>
          {CardsData?.Address2?.address1 || CardsData?.Address2?.address2 ? (
            <>
              {CardsData?.Address2?.address1 || ""}
              {CardsData?.Address2?.address2
                ? `, ${CardsData.Address2.address2}`
                : ""}
            </>
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Address"}
            </span>
          )}
        </>
      ),
      value: "",
    },
    {
      label: (
        <>
          {CardsData?.Address2?.city || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"City"}
            </span>
          )}
          {CardsData?.Address2?.state ? (
            `, ${CardsData.Address2.state}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {", State"}
            </span>
          )}
          {CardsData?.Address2?.zip ? (
            ` ${CardsData.Address2.zip}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {" Zip"}
            </span>
          )}
        </>
      ),
      value: "",
    },
  ];

  const clientSSNData = [
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Title"}
        </span>
      ),
      value: CardsData?.identification?.title ? (
        CardsData?.identification?.title
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"Mr./Mrs./Ms."}
        </span>
      ),
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Birthday"}
        </span>
      ),
      value: CardsData?.identification?.birthday ? (
        formatDate(CardsData?.identification?.birthday)
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"DD/MM/YYYY"}
        </span>
      ),
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"License"}
        </span>
      ),
      value: CardsData?.identification?.license ? (
        CardsData?.identification?.license
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"X############"}
        </span>
      ),
    },
  ];

  const clientSpouseContact = [
    {
      label: (
        <>
          {CardsData?.spouseContact?.first_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"First"}
            </span>
          )}{" "}
          {CardsData?.spouseContact?.last_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Last"}
            </span>
          )}
        </>
      ),
      value: "",
    },
    {
      label: (
        <>
          {CardsData?.spouseContact?.address1 ||
          CardsData?.spouseContact?.address2 ? (
            <>
              {CardsData?.spouseContact?.address1 || ""}
              {CardsData?.spouseContact?.address2
                ? `, ${CardsData.spouseContact.address2}`
                : ""}
            </>
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Address"}
            </span>
          )}
        </>
      ),
      value: "",
    },
    {
      label: (
        <>
          {CardsData?.spouseContact?.city || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"City"}
            </span>
          )}
          {CardsData?.spouseContact?.state ? (
            `, ${CardsData.spouseContact.state}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {", State"}
            </span>
          )}
          {CardsData?.spouseContact?.zip ? (
            ` ${CardsData.spouseContact.zip}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {" Zip"}
            </span>
          )}
        </>
      ),
      value: "",
    },
  ];

  const clientSpouseInfo = [
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Marital Status"}
        </span>
      ),
      value: CardsData?.spouseInfo?.relationship
        ? CardsData?.spouseInfo?.relationship
        : "",
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Discuss"}
        </span>
      ),
      value: CardsData?.spouseInfo?.discuss ? (
        <span className="color-green">{"Yes"}</span>
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"Not Clear"}
        </span>
      ),
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Phone"}
        </span>
      ),
      value: CardsData?.spouseInfo?.phone ? (
        CardsData?.spouseInfo?.phone
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"(###) ###-####"}
        </span>
      ),
    },
  ];

  const clientEmergencyContact = [
    {
      label: (
        <>
          {CardsData?.emergencyContact?.first_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"First"}
            </span>
          )}{" "}
          {CardsData?.emergencyContact?.last_name || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Last"}
            </span>
          )}
        </>
      ),
      value: "",
    },
    {
      label: (
        <>
          {CardsData?.emergencyContact?.address1 ||
          CardsData?.emergencyContact?.address2 ? (
            <>
              {CardsData?.emergencyContact?.address1 || ""}
              {CardsData?.emergencyContact?.address2
                ? `, ${CardsData.emergencyContact.address2}`
                : ""}
            </>
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"Address"}
            </span>
          )}
        </>
      ),
      value: "",
    },
    {
      label: (
        <>
          {CardsData?.emergencyContact?.city || (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {"City"}
            </span>
          )}
          {CardsData?.emergencyContact?.state ? (
            `, ${CardsData.emergencyContact.state}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {", State"}
            </span>
          )}
          {CardsData?.emergencyContact?.zip ? (
            ` ${CardsData.emergencyContact.zip}`
          ) : (
            <span
              className=""
              style={{
                color: "var(--primary-25)",
              }}
            >
              {" Zip"}
            </span>
          )}
        </>
      ),
      value: "",
    },
  ];

  const clientEmergencyInfo = [
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Relationship"}
        </span>
      ),
      value: CardsData?.emergencyInfo?.relation
        ? CardsData?.emergencyInfo?.relation
        : "",
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Discuss"}
        </span>
      ),
      value: CardsData?.emergencyInfo?.discuss ? (
        <span className="color-green">{"Yes"}</span>
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"Not Clear"}
        </span>
      ),
    },
    {
      label: (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
            fontWeight: "600",
          }}
        >
          {"Phone"}
        </span>
      ),
      value: CardsData?.emergencyInfo?.phone ? (
        CardsData?.emergencyInfo?.phone
      ) : (
        <span
          className=""
          style={{
            color: "var(--primary-25)",
          }}
        >
          {"(###) ###-####"}
        </span>
      ),
    },
  ];

  // Media queries
  const isFiveCards = useMediaQuery({ minWidth: 2400 });
  const isFourCards = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
  const isThreeCards = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
  const isTwoCards = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
  const isOneCards = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
  const isNoCards = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

  return (
    <>
      {typeof CardsData == typeof false ? (
        <></>
      ) : (
        <div>
          {/*<button
          onClick={() => setShowClientPortalModal(true)}
          className={`client-portal-btn btn btn-primary-lighter-2 portal-btn font-weight-semibold has-left-skew text-lg text-capitalize height-30 rounded-0 d-flex align-items-center justify-content-center col ml-lg-3 client-portalButton margin-top-9r mr-15 SkewX-client ${isFiveCards ? 'client-portal-btn-five' : isFourCards ? 'client-portal-btn-four' : isThreeCards ? 'client-portal-btn-three' : isTwoCards ? 'client-portal-btn-two' : isOneCards ? 'client-portal-btn-one': isNoCards ? 'client-portal-btn-no' : 'client-portal-btn'}`}
        >
          <span className="ic-custom">
            <i className="ic ic-24 ic-portal m-r-5 Anti-SkewX-client "></i>
          </span>
          <span
            style={{ marginBottom: "7px" }}
            className="Anti-SkewX-client mr-4"
          >
            Client portal settings
          </span>
           <span class="left-0 custom-1-client-CPS" id="skewed-client-portal"></span> 
        </button>*/}
          <ClientPortalButton />
          {isNameShow && (
            <div className="m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Name"
                data={clientNameData}
                onSelectReport={handleEditModalOpen}
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Chat Client"
                iconClassName="ic ic-19 ic-chat-3d m-r-5"
                onClick={() => handleChatModalOpen(true, "edit-name")}
                className={"mt-0"}
              />
              {/* <div
                style={{ marginTop: "5px" }}
                onClick={() => handleChatModalOpen(true, "edit-name")}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-chat-3d m-r-5"
                  buttonText="Chat Client"
                />
              </div> */}
              {/* <ContactInfo
            headingToShow={"CLIENT NAMES"}
            type={"names"}
            data={CardsData?.names}
            buttonText={"Chat Client"}
            buttonStyleClass={"ic ic-19 ic-chat-3d m-r-5"}
            modalEditShowValue={() => handleEditModalOpen(true, "edit-name")}
            modalButtonShowValue={handleTextModalOpen}
          /> */}
            </div>
          )}
          {isPhoneShow && (
            <div className="m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="CLIENT PHONE"
                data={clientPhoneNumbers}
                onSelectReport={() => handleEditModalOpen(true, "edit-phone")}
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Text Client"
                iconClassName="ic ic-19 ic-sms-3d m-r-5"
                onClick={handleTextModalOpen}
                className={"mt-0"}
              />
              {/* <div onClick={handleTextModalOpen}>
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-sms-3d m-r-5"
                  buttonText="Text Client"
                />
              </div> */}
              {/* <ContactInfo
            headingToShow={"CLIENT PHONE"}
            type={"phoneNumbers"}
            data={CardsData?.phone_numbers}
            buttonText={"Text Client"}
            buttonStyleClass={"ic ic-19 ic-sms-3d m-r-5"}
            modalEditShowValue={() => handleEditModalOpen(true, "edit-phone")}
            modalButtonShowValue={handleTextModalOpen}
            primary_phone={CardsData?.primaryPhone}
          /> */}
            </div>
          )}
          {isEmailShow && (
            <div className="m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Email"
                data={clientEmail}
                onSelectReport={() => handleEditModalOpen(true, "edit-emails")}
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Email Client"
                iconClassName="ic ic-19 ic-email-3d m-r-5"
                onClick={handleEmailModalOpen}
                className={"mt-0"}
              />
              {/* <div className="" onClick={handleEmailModalOpen}>
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-email-3d m-r-5"
                  buttonText="Email Client"
                />
              </div> */}
              {/* <ContactInfo
            headingToShow={"CLIENT EMAIL"}
            type={"emailAddresses"}
            data={CardsData?.Emails}
            buttonText={"Email Client"}
            buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"}
            modalEditShowValue={() => handleEditModalOpen(true, "edit-emails")}
            modalButtonShowValue={handleEmailModalOpen}
            primary_email_id={CardsData?.primaryEmail?.primary_id}
          /> */}
            </div>
          )}
          {isAddress1Show && (
            <div className="m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Address 1"
                data={clientAddress1}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-address1")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Generate Document"
                iconClassName="ic ic-19 ic-generate-document m-r-5"
                onClick={() => {
                  setDropdownName("Client Address 1");
                  setInstanceIdForGenragteDoc(CardsData?.Address1?.currentId);
                  setShowGenreateDocumentModal(true);
                }}
                className={"mt-0"}
              />
              {/* <div
                className="m-t-5"
                style={{ maxWidth: "260px" }}
                onClick={() => {
                  setDropdownName("Client Address 1");
                  setInstanceIdForGenragteDoc(CardsData?.Address1?.currentId);
                  setShowGenreateDocumentModal(true);
                }}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-generate-document m-r-5"
                  buttonText="Generate Document"
                />
              </div> */}
              {/* <ContactInfo
            headingToShow={"CLIENT ADDRESS 1"}
            type={"homeAddress"}
            data={CardsData?.Address1}
            buttonText={"Generate Document"}
            buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
            modalEditShowValue={() =>
              handleEditModalOpen(true, "edit-address1")
            }
            modalButtonShowValue={()=> {
              setDropdownName('Client Address 1')
              setInstanceIdForGenragteDoc(CardsData?.Address1?.currentId)
              setShowGenreateDocumentModal(true);
            }}

            mail_contact_id={CardsData?.mailingContact?.primary_id}
          /> */}
            </div>
          )}
          {isAddress2Show && (
            <div className="chat-communication-sec m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Address 2"
                data={clientAddress2}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-address2")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Generate Document"
                iconClassName="ic ic-19 ic-generate-document m-r-5"
                onClick={() => {
                  setDropdownName("Client Address 2");
                  setInstanceIdForGenragteDoc(CardsData?.Address2?.currentId);
                  setShowGenreateDocumentModal(true);
                }}
                className={"mt-0"}
              />
              {/* <div
                className="m-t-5"
                style={{ maxWidth: "260px" }}
                onClick={() => {
                  setDropdownName("Client Address 2");
                  setInstanceIdForGenragteDoc(CardsData?.Address2?.currentId);
                  setShowGenreateDocumentModal(true);
                }}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-generate-document m-r-5"
                  buttonText="Generate Document"
                />
              </div> */}
              {/* <ContactInfo
            headingToShow={"CLIENT ADDRESS 2"}
            type={"homeAddress2"}
            data={CardsData?.Address2}
            buttonText={"Generate Document"}
            buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
            modalEditShowValue={() =>
              handleEditModalOpen(true, "edit-address2")
            }
            modalButtonShowValue={()=> {
              setDropdownName('Client Address 2')
              setInstanceIdForGenragteDoc(CardsData?.Address2?.currentId)
              setShowGenreateDocumentModal(true);
            }}
            mail_contact_id={CardsData?.mailingContact?.primary_id}
          /> */}
            </div>
          )}
          {isClientIdentification && (
            <div className="identification-communication-sec m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Identification"
                data={clientSSNData}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-identification")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="View SSN"
                iconClassName="ic ic-19 ic-ssn m-r-5"
                onClick={handleSsnModalOpen}
                className={"mt-0"}
              />
              {/* <div
                className="m-t-5"
                style={{ maxWidth: "260px" }}
                onClick={handleSsnModalOpen}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-ssn m-r-5"
                  buttonText="View SSN"
                />
              </div> */}
              {/* <ContactInfo
          headingToShow={"CLIENT IDENTIFICATION"}
          type={"clientIdentification"}
          data={CardsData?.identification}
          buttonText={"View SSN"}
          buttonStyleClass={"ic ic-19 ic-ssn m-r-5"}
          modalButtonShowValue={handleSsnModalOpen}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-identification")
          }
        /> */}
            </div>
          )}
          {hasClientSpouse && (
            <div className="chat-communication-sec m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Spouse Contact"
                data={clientSpouseContact}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-spouse-contact")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Generate Document"
                iconClassName="ic ic-19 ic-generate-document m-r-5"
                onClick={() => {
                  setDropdownName("Client Spouse Address");
                  setInstanceIdForGenragteDoc(
                    CardsData?.spouseContact?.currentId
                  );
                  setShowGenreateDocumentModal(true);
                }}
                className={"mt-0"}
              />
              {/* <div
                className="m-t-5"
                style={{ maxWidth: "260px" }}
                onClick={() => {
                  setDropdownName("Client Spouse Address");
                  setInstanceIdForGenragteDoc(
                    CardsData?.spouseContact?.currentId
                  );
                  setShowGenreateDocumentModal(true);
                }}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-generate-document m-r-5"
                  buttonText="Generate Document"
                />
              </div> */}
              {/* <ContactInfo
           headingToShow={"CLIENT SPOUSE CONTACT"}
           type={"spouseContact"}
           data={CardsData?.spouseContact}
           buttonText={"Generate Document"}
           buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
           modalEditShowValue={() =>
             handleEditModalOpen(true, "edit-spouse-contact")
           }
           modalButtonShowValue={() => {
             setDropdownName("Client Spouse Address");
             setInstanceIdForGenragteDoc(CardsData?.spouseContact?.currentId);
             setShowGenreateDocumentModal(true);
           }}
         /> */}
            </div>
          )}
          {hasClientSpouseInfo && (
            <div className="chat-communication-sec m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Client Spouse Information"
                data={clientSpouseInfo}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-spouse-information")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Email Contact"
                iconClassName="ic ic-19 ic-email-3d m-r-5"
                onClick={() => console.log("Email Clicked")}
                className={"mt-0"}
              />
              {/* <div
                className="m-t-5"
                style={{ maxWidth: "260px" }}
                onClick={() => console.log("Email Clicked")}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-email-3d m-r-5"
                  buttonText="Email Contact"
                />
              </div> */}
              {/* <ContactInfo
          headingToShow={"CLIENT SPOUSE INFORMATION"}
          type={"spouseInformation"}
          data={CardsData?.spouseInfo}
          buttonText={"Email Contact"}
          buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"}
          modalEditShowValue={() =>
            handleEditModalOpen(true, "edit-spouse-information")
          }
        /> */}
            </div>
          )}
          {hasEmergencyContact && (
            <div className="chat-communication-sec m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Emergency Contact"
                data={clientEmergencyContact}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-emergency-contact")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Generate Document"
                iconClassName="ic ic-19 ic-generate-document m-r-5"
                onClick={() => {
                  setDropdownName("Client Emergency Contact");
                  setInstanceIdForGenragteDoc(
                    CardsData?.emergencyContact?.currentId
                  );
                  setShowGenreateDocumentModal(true);
                }}
                className={"mt-0"}
              />
              {/* <div
                className="m-t-5"
                style={{ maxWidth: "260px" }}
                onClick={() => {
                  setDropdownName("Client Emergency Contact");
                  setInstanceIdForGenragteDoc(
                    CardsData?.emergencyContact?.currentId
                  );
                  setShowGenreateDocumentModal(true);
                }}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-generate-document m-r-5"
                  buttonText="Generate Document"
                />
              </div> */}
              {/* <ContactInfo
           headingToShow={"EMERGENCY CONTACT"}
           type={"emergencyContact"}
           data={CardsData?.emergencyContact}
           buttonText={"Generate Document"}
           buttonStyleClass={"ic ic-19 ic-generate-document m-r-5"}
           modalEditShowValue={() =>
             handleEditModalOpen(true, "edit-emergency-contact")
           }
           modalButtonShowValue={() => {
             setDropdownName("Client Emergency Contact");
             setInstanceIdForGenragteDoc(CardsData?.emergencyContact?.currentId);
             setShowGenreateDocumentModal(true);
           }}
         /> */}
            </div>
          )}
          {hasEmergencyInfo && (
            <div className="chat-communication-sec m-t-5">
              <InfoPanelWithoutKeyValue
                panel_name="Emergency Information"
                data={clientEmergencyInfo}
                onSelectReport={() =>
                  handleEditModalOpen(true, "edit-emergency-information")
                }
                defaultLength={3}
                panelClassName="min-height-auto pr-0"
                hasBtn={true}
                buttonText="Email Contact"
                iconClassName="ic ic-19 ic-email-3d m-r-5"
                onClick={handleEmailModalOpen}
                className={"mt-0"}
              />
              {/* <div
                style={{ maxWidth: "260px" }}
                className="m-t-5"
                onClick={handleEmailModalOpen}
              >
                <Button
                  showButton={true}
                  icon="ic ic-19 ic-email-3d m-r-5"
                  buttonText="Email Contact"
                />
              </div> */}
              {/* <ContactInfo
                headingToShow={"EMERGENCY INFORMATION"}
                type={"emergencyInformation"}
                data={CardsData?.emergencyInfo}
                buttonText={"Email Contact"}
                buttonStyleClass={"ic ic-19 ic-email-3d m-r-5"}
                modalEditShowValue={() =>
                  handleEditModalOpen(true, "edit-emergency-information")
                }
                modalButtonShowValue={handleEmailModalOpen}
              /> */}
            </div>
          )}

          {showClientPortalModal && (
            <PreviewPortalModal
              show={showClientPortalModal}
              handleClose={handleClientPortalClose}
            />
          )}
          {showSSNModal && (
            <SsnModalBody
              show={showSSNModal}
              handleClose={handleSsnModalClose}
              clientName={CardsData.first_name + " " + CardsData.last_name}
              clientSSN={CardsData.identification?.ssn || "Not Provided"}
            />
          )}
          {showEditModal && (
            <ClientEditModal
              show={showEditModal}
              handleClose={handleEditModalClose}
              clientData={CardsData}
            />
            // <ClientNameModal
            //   show={showEditModal}
            //   handleClose={handleEditModalClose}
            //   clientData={CardsData}
            //   defaultTab={activeTab}
            // />
          )}
          {showChatModal && (
            <ModalBodyMessage
              show={showChatModal}
              handleClose={handleChatModalClose}
              clientName={CardsData.first_name + " " + CardsData.last_name}
              typeComm={"Chat"}
              mainHead={"CHAT"}
              client_pic={CardsData.Avatars?.avatar1}
            />
          )}
          {showTextModal && (
            <ModalBodyMessage
              show={showTextModal}
              handleClose={handleTextModalClose}
              clientName={CardsData?.first_name + " " + CardsData?.last_name}
              typeComm={"Text"}
              mainHead={"TEXT"}
              client_pic={CardsData?.Avatars?.avatar1}
            />
          )}
          {showEmailModal && (
            <ModalBodyMessage
              show={showEmailModal}
              handleClose={handleEmailModalClose}
              clientName={CardsData?.first_name + " " + CardsData?.last_name}
              typeComm={"Email"}
              mainHead={"EMAIL"}
              client_pic={CardsData?.Avatars?.avatar1}
              primary_email={CardsData?.primaryEmail?.email}
            />
          )}

          {showGenreateDocumentModal && instanceIdForGenrateDoc && (
            <GenrateDocument
              show={true}
              handleClose={() => {
                setDropdownName(null);
                setInstanceIdForGenragteDoc(null);
                setShowGenreateDocumentModal(false);
              }}
              dropdownName={dropdownName}
              PageEntity="Client"
              instanceId={instanceIdForGenrateDoc}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ClientRightPanelCards;
