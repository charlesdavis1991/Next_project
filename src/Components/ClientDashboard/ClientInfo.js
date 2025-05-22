import React, { useEffect, useState, useContext } from "react";
import ClientName from "./clientName";
import ClientHistory from "./clientHistory";
import ClientImages from "./clientImages";
import ClientTable from "./clientTable";
import Button from "./shared/button";
import ModalBodyMessage from "./modals/clientMessageModal";
import ClientNameModal from "./modals/modal";
import axios from "axios";
import { formatDate, getCaseId, getClientId } from "../../Utils/helper";
import ContactInfo from "./ContactInfo";
import { ClientDataContext } from "./shared/DataContext";
import "./../../../public/BP_resources/css/client-4.css";
import { mediaRoute } from "../../Utils/helper";
import InformationPanel from "../common/InformationPanel";
import "./../../../public/BP_resources/css/photos.css";
import check from "../../../public/BP_resources/images/icon/checkmark.svg";
import GenrateDocument from "../GenrateDocument/GenrateDocument";
import activeEmail from "../../../public/BP_resources/images/icon/emailactive.svg";
import mail from "../../../public/BP_resources/images/icon/mailbox.svg";
import SsnModalBody from "./modals/ssnModal";
import InfoPanelWithoutKeyValue from "./shared/InfoPanelWithoutKeyValue";
import ClientEditModal from "./Modal/ClientModal";
import ClientAvatarModal from "./Modal/clientAvatarModal";

export default function ClientInfo({
  CardsData,
  clientNames,
  clientCases,
  isScreen14k,
  isScreen100_1,
  isScreen50_2,
  isScreen4k,
  isScreen5k,
  isScreen6k,
  isScreen7k,
  isScreen8k,
  isScreen9k,
  isScreen10k,
  isScreen11k,
  isScreen12k,
  isScreen13k,
  isScreen50,
  isScreen57,
  isScreen67,
  isScreen75,
  isScreen80,
  isScreen90,
  isScreen100,
  isNameShow,
  isPhoneShow,
  isEmailShow,
  isAddress1Show,
  isAddress2Show,
  isClientIdentification,
  hasClientSpouse,
  hasClientSpouseInfo,
  hasEmergencyContact,
  hasEmergencyInfo,
  clientCommWidth,
}) {
  //Button Modal Values
  const [showChatModal, setShowChatModal] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("edit-name"); // State to store the active tab
  const [showTextModal, setShowTextModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSSNModal, setShowSSNModal] = useState(false);

  const [showGenreateDocumentModal, setShowGenreateDocumentModal] =
    useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
  const [dropdownName, setDropdownName] = useState("");
  const [showAvatarModal, setAvatarModalOpen] = useState(false);

  function handleChatModalClose() {
    setShowChatModal(false);
  }

  //handle BUTTON MODAL values to open
  const handleChatModalOpen = () => {
    setShowChatModal(true);
  };

  // Handle Edit Modal value
  const handleEditModalOpen = (value, tabKey = "edit-name") => {
    setshowEditModal(value);
    setActiveTab(tabKey); // Set the tab key based on which element is clicked
  };

  const handleEditAvatarModalOpen = (value, tabKey = "edit-name") => {
    setAvatarModalOpen(value);
    setActiveTab(tabKey); // Set the tab key based on which element is clicked
  };

  function handleEditModalClose() {
    setshowEditModal(false);
  }

  function handleTextModalClose() {
    setShowTextModal(false);
  }

  //handle BUTTON MODAL values to open for text
  const handleTextModalOpen = (value) => {
    setShowTextModal(value);
  };

  function handleEmailModalClose() {
    setShowEmailModal(false);
  }

  //handle BUTTON MODAL values to open for Email
  const handleEmailModalOpen = (value) => {
    setShowEmailModal(value);
  };

  const handleSsnModalOpen = (value) => {
    setShowSSNModal(value);
  };

  function handleSsnModalClose() {
    setShowSSNModal(false);
  }

  {
    /*Sample data For ClientHostory Comp */
  }
  const client = {
    first_name: "Iqrma",
    last_name: "Amir",
  };

  {
    /*Sample data For clientTable Comp */
  }
  const sortedAllMsgData = [
    {
      type: "Note",
      obj: {
        created_by: {
          first_name: "John",
          last_name: "Doe",
          bp_userprofile: {
            account_type: "Attorney",
            bp_attorney_userprofile: {
              profile_pic: {
                url: "https://via.placeholder.com/150",
              },
            },
          },
        },
        timestamp: new Date().toISOString(),
        text: "This is a note message. It contains important information.",
        user: 1,
      },
    },
    {
      type: "Email",
      obj: {
        created_by: {
          first_name: "Jane",
          last_name: "Smith",
          bp_userprofile: {
            account_type: "Staff",
            bp_attorneystaff_userprofile: {
              profile_pic: {
                url: "https://via.placeholder.com/150",
              },
            },
          },
        },
        timestamp: new Date().toISOString(),
        subject:
          "This is an email subject. It provides a brief overview of the email content.",
        user: 2,
      },
    },
    {
      type: "ChatMessage",
      obj: {
        created_by: {
          first_name: "Emily",
          last_name: "Johnson",
          bp_userprofile: {
            account_type: "Attorney",
            bp_attorney_userprofile: {
              profile_pic: {
                url: "https://via.placeholder.com/150",
              },
            },
          },
        },
        timestamp: new Date().toISOString(),
        text: "This is a chat message. It is a short and quick communication.",
        user: 3,
      },
    },
  ];

  const clientTab = {
    client_user: 1,
    first_name: "Michael",
    last_name: "Brown",
    profile_pic: {
      url: "https://via.placeholder.com/150",
    },
  };

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

  return (
    <>
      {typeof CardsData == typeof false ? (
        <></>
      ) : (
        <div
          style={{
            marginTop:
              isScreen8k ||
              isScreen9k ||
              isScreen10k ||
              isScreen11k ||
              isScreen12k ||
              isScreen13k ||
              isScreen14k
                ? "5px"
                : "0",
          }}
        >
          <div className="col-lg-custome-20 col-md-16 col-sm-16 col-16">
            <div className="overflow-hidden row table-messages-wrapper no-gutters flex-g-1 f-gap-05">
              <div className="col" style={{}}>
                <ClientHistory
                  first_name={CardsData?.first_name}
                  last_name={CardsData?.last_name}
                  clientCasesProp={clientCases}
                />
              </div>
              {isNameShow && (
                <div className="min-w-260px-client">
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
                  {/* <div onClick={handleEditModalOpen}>
                  <ClientName
                    first_name={CardsData.first_name}
                    middle_name={CardsData.middle_name}
                    last_name={CardsData.last_name}
                  />
                </div> */}
                  {/* <div
                    style={{}}
                    onClick={() => handleChatModalOpen(true, "edit-name")}
                  >
                    <Button
                      showButton={true}
                      icon="ic ic-19 ic-chat-3d m-r-5"
                      buttonText="Chat Client"
                    />
                  </div> */}
                </div>
              )}
              {isPhoneShow && (
                <>
                  <InfoPanelWithoutKeyValue
                    panel_name="CLIENT PHONE"
                    data={clientPhoneNumbers}
                    onSelectReport={() =>
                      handleEditModalOpen(true, "edit-phone")
                    }
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
                    modalEditShowValue={() =>
                      handleEditModalOpen(true, "edit-phone")
                    }
                    modalButtonShowValue={handleTextModalOpen}
                    topMargin={false}
                    primary_phone={CardsData?.primaryPhone}
                  /> */}
                </>
              )}
              {isEmailShow && (
                <>
                  <InfoPanelWithoutKeyValue
                    panel_name="Client Email"
                    data={clientEmail}
                    onSelectReport={() =>
                      handleEditModalOpen(true, "edit-emails")
                    }
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
                    modalEditShowValue={() =>
                      handleEditModalOpen(true, "edit-emails")
                    }
                    modalButtonShowValue={handleEmailModalOpen}
                    topMargin={false}
                    primary_email_id={CardsData?.primaryEmail?.primary_id}
                  /> */}
                </>
              )}
              {isAddress1Show && (
                <div>
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
                      setInstanceIdForGenragteDoc(
                        CardsData?.Address1?.currentId
                      );
                      setShowGenreateDocumentModal(true);
                    }}
                    className={"mt-0"}
                  />
                  {/* <div
                    className="m-t-5"
                    onClick={() => {
                      setDropdownName("Client Address 1");
                      setInstanceIdForGenragteDoc(
                        CardsData?.Address1?.currentId
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
                    topMargin={false}
                    mail_contact_id={CardsData?.mailingContact?.primary_id}
                  /> */}
                </div>
              )}
              {isAddress2Show && (
                <div className="">
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
                      setInstanceIdForGenragteDoc(
                        CardsData?.Address2?.currentId
                      );
                      setShowGenreateDocumentModal(true);
                    }}
                    className={"mt-0"}
                  />
                  {/* <div
                    className="m-t-5"
                    onClick={() => {
                      setDropdownName("Client Address 2");
                      setInstanceIdForGenragteDoc(
                        CardsData?.Address2?.currentId
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
                    topMargin={false}
                    mail_contact_id={CardsData?.mailingContact?.primary_id}
                  /> */}
                </div>
              )}
              {isClientIdentification && (
                <div className="">
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
                  {/* <div className="m-t-5" onClick={handleSsnModalOpen}>
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
                <div className="">
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
                <div className="">
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
                <div className="">
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
                <div className="">
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
                  {/* <div className="m-t-5" onClick={handleEmailModalOpen}>
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

              <ClientImages
                modalEditShowValue={() =>
                  handleEditAvatarModalOpen(true, "edit-avatar")
                }
                middle_name={CardsData?.middle_name}
                first_name={CardsData?.client?.first_name}
                last_name={CardsData?.client?.last_name}
                Avatars={CardsData?.Avatars}
                photos={CardsData?.photos}
                image1={CardsData.Avatars?.avatar1}
                image2={CardsData.Avatars?.avatar2}
                image3={CardsData.Avatars?.avatar3}
              />
            </div>
            {/* table components */}
            <div
              className="overflow-hidden row table-messages-wrapper no-gutters flex-g-1 f-gap-05"
              style={{
                paddingTop: "5px",
                width: hasEmergencyInfo
                  ? `calc(100% + ${clientCommWidth}px)`
                  : "100%",
                height: isScreen100_1
                  ? ""
                  : isScreen100
                    ? "70rem"
                    : isScreen90
                      ? "63rem"
                      : isScreen75
                        ? "57rem"
                        : isScreen67
                          ? "48.5rem"
                          : isScreen57
                            ? "41.5rem"
                            : isScreen50_2
                              ? "32rem"
                              : isScreen50
                                ? "32rem"
                                : isScreen4k
                                  ? "17.5rem"
                                  : "11rem",
                marginTop: isScreen100 ? "-0.2rem" : "",
              }}
            >
              <div className="container-PLC">
                {CardsData?.CommPhoto1?.photoURL ? (
                  <div className="scalable-box-image">
                    <img
                      src={mediaRoute(CardsData?.CommPhoto1?.photoURL)}
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="scalable-box overflow-hidden">
                    <svg
                      width="90px"
                      height={"5rem"}
                      viewBox="10 2 4 22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <g>
                          <path
                            d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                            style={{
                              fill: "rgb(220,225,230)",
                              fillRule: "nonzero",
                            }}
                          />
                          <path
                            d="M1,20L8,13L15,20"
                            style={{
                              fill: "none",
                              stroke: "rgb(165,175,190)",
                              strokeWidth: "2px",
                            }}
                          />
                          <path
                            d="M23,20L19,16L12,23"
                            style={{
                              fill: "none",
                              stroke: "rgb(165,175,190)",
                              strokeWidth: "2px",
                            }}
                          />
                          <path
                            d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                            style={{
                              fill: "rgb(220,225,230)",
                              fillRule: "nonzero",
                            }}
                          />
                          <path
                            d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                            style={{
                              fill: "rgb(165,175,190)",
                              fillRule: "nonzero",
                            }}
                          />
                          <circle
                            cx="17"
                            cy="9"
                            r="2"
                            style={{ fill: "white" }}
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
                {CardsData?.CommPhoto2?.photoURL ? (
                  <div className="scalable-box-image mt-1 overflow-hidden">
                    <img
                      src={mediaRoute(CardsData?.CommPhoto2?.photoURL)}
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: "100%",
                        maxWidth: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="scalable-box mt-1 overflow-hidden">
                    <svg
                      width="109px"
                      height={"5rem"}
                      viewBox="10 2 4 22"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <g>
                          <path
                            d="M8,13L12,18L10,18L9,17L8,18L7,17L6,18L4,18L8,13Z"
                            style={{
                              fill: "rgb(220,225,230)",
                              fillRule: "nonzero",
                            }}
                          />
                          <path
                            d="M1,20L8,13L15,20"
                            style={{
                              fill: "none",
                              stroke: "rgb(165,175,190)",
                              strokeWidth: "2px",
                            }}
                          />
                          <path
                            d="M23,20L19,16L12,23"
                            style={{
                              fill: "none",
                              stroke: "rgb(165,175,190)",
                              strokeWidth: "2px",
                            }}
                          />
                          <path
                            d="M8.508,5C7.729,5 7.132,5.482 6.762,6.109C5.99,5.876 5.296,6.344 5.113,7.16C4.499,7.348 4,7.828 4,8.5C4,9.323 4.677,10 5.5,10L10.5,10C11.323,10 12,9.323 12,8.5C12,7.718 11.371,7.105 10.604,7.043C10.55,5.918 9.645,5 8.508,5Z"
                            style={{
                              fill: "rgb(220,225,230)",
                              fillRule: "nonzero",
                            }}
                          />
                          <path
                            d="M17.212,5.339C17.114,5.183 16.886,5.183 16.788,5.339L16.282,6.149C16.274,6.162 16.261,6.172 16.245,6.177C16.23,6.182 16.213,6.181 16.198,6.173L15.353,5.724C15.19,5.637 14.993,5.751 14.986,5.936L14.953,6.87C14.952,6.892 14.943,6.913 14.928,6.928C14.913,6.943 14.892,6.952 14.87,6.953L13.936,6.986C13.751,6.992 13.637,7.19 13.724,7.353L14.173,8.199C14.181,8.213 14.182,8.229 14.177,8.245C14.172,8.26 14.162,8.274 14.149,8.282L13.339,8.788C13.183,8.886 13.183,9.114 13.339,9.212L14.149,9.718C14.163,9.726 14.172,9.74 14.177,9.755C14.182,9.77 14.181,9.787 14.173,9.802L13.724,10.647C13.637,10.81 13.751,11.008 13.936,11.014L14.87,11.047C14.892,11.048 14.913,11.057 14.928,11.072C14.943,11.087 14.952,11.108 14.953,11.13L14.986,12.064C14.993,12.249 15.19,12.363 15.353,12.276L16.198,11.827C16.213,11.819 16.23,11.818 16.245,11.823C16.261,11.828 16.274,11.838 16.282,11.851L16.788,12.661C16.886,12.817 17.114,12.817 17.212,12.661L17.717,11.852C17.726,11.838 17.74,11.828 17.756,11.822C17.77,11.817 17.787,11.819 17.801,11.827L18.647,12.276C18.81,12.363 19.008,12.249 19.014,12.064L19.047,11.13C19.048,11.108 19.057,11.087 19.072,11.072C19.087,11.057 19.108,11.048 19.13,11.047L20.064,11.014C20.249,11.008 20.363,10.81 20.276,10.647L19.827,9.801C19.819,9.787 19.818,9.771 19.823,9.755C19.828,9.74 19.838,9.726 19.851,9.718L20.661,9.212C20.817,9.114 20.817,8.886 20.661,8.788L19.851,8.282C19.838,8.274 19.828,8.26 19.823,8.245C19.818,8.229 19.819,8.213 19.827,8.199L20.276,7.353C20.363,7.19 20.249,6.992 20.064,6.986L19.13,6.953C19.108,6.952 19.087,6.943 19.072,6.928C19.057,6.913 19.048,6.892 19.047,6.87L19.014,5.936C19.008,5.751 18.81,5.637 18.647,5.724L17.802,6.173C17.787,6.181 17.77,6.182 17.755,6.177C17.74,6.172 17.726,6.162 17.718,6.149L17.212,5.339Z"
                            style={{
                              fill: "rgb(165,175,190)",
                              fillRule: "nonzero",
                            }}
                          />
                          <circle
                            cx="17"
                            cy="9"
                            r="2"
                            style={{ fill: "white" }}
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
              <div className="col w-100">
                <div>
                  <ClientTable
                    client={CardsData?.first_name + " " + CardsData?.last_name}
                    sortedAllMsgData={sortedAllMsgData}
                    isScreen100={isScreen100 && true}
                    isScreen90={isScreen90 && true}
                    isScreen80={isScreen80 && true}
                    isScreen75={isScreen75 && true}
                    isScreen57={isScreen57 && true}
                    isScreen50={isScreen50 && true}
                    isScreen67={isScreen67 && true}
                    isScreen50_2={isScreen50_2 && true}
                  />
                </div>
              </div>
            </div>
          </div>
          {showChatModal && (
            <ModalBodyMessage
              show={showChatModal}
              handleClose={handleChatModalClose}
              clientName={clientNames.first_name + " " + clientNames.last_name}
              typeComm={"Chat"}
              mainHead={"CHAT"}
              client_pic={CardsData.Avatars?.avatar1}
            />
          )}
          {showTextModal && (
            <ModalBodyMessage
              show={showTextModal}
              handleClose={handleTextModalClose}
              clientName={CardsData.first_name + " " + CardsData.last_name}
              typeComm={"Text"}
              mainHead={"TEXT"}
              primary_number={CardsData.primaryPhone?.phone_number}
              client_pic={CardsData.Avatars?.avatar1}
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
          {showEmailModal && (
            <ModalBodyMessage
              show={showEmailModal}
              handleClose={handleEmailModalClose}
              clientName={CardsData.first_name + " " + CardsData.last_name}
              typeComm={"Email"}
              mainHead={"EMAIL"}
              primary_email={CardsData.primaryEmail?.email}
              client_pic={CardsData.Avatars?.avatar1}
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
          {showAvatarModal && (
            <ClientAvatarModal
              show={showAvatarModal}
              handleClose={() => setAvatarModalOpen(false)}
              hideModal={() => setAvatarModalOpen(false)}
              first_name={CardsData?.first_name}
              middle_name={CardsData?.middle_name}
              last_name={CardsData?.last_name}
              Avatars={CardsData?.Avatars}
              photos={CardsData?.photos}
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
        </div>
      )}
    </>
  );
}
