import React, { useEffect, useState, useContext, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import "../../public/BP_resources/css/client-main.css";
import "../../public/BP_resources/css/client-4.css";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import ActionBarClient from "../Components/ClientDashboard/ActionBarClient";
import ClientInfo from "../Components/ClientDashboard/ClientInfo";
import ClientRightPanelCards from "../Components/ClientDashboard/ClientRightPanelCards";
import ESignatureComponent from "../Components/ClientDashboard/clientESignature";
import {
  getCaseId,
  getClientId,
  fetchShakespeareStatus,
} from "../Utils/helper";
import "../../public/BP_resources/css/messages.css";
import "../../public/BP_resources/css/client-portal.css";
import "../../public/BP_resources/css/litigation.css";
import InsurancePageClient from "./InsurancePageClient";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../../public/BP_resources/css/litigation.css";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import { mediaRoute } from "../Utils/helper";
import Footer from "../Components/common/footer";

const ClientPage = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [clientData, setClientData] = useState({});
  const { isClientDataUpdated, setIsClientDataUpdated } =
    useContext(ClientDataContext);
  const [CardsData, setCardsData] = useState(false);

  const fetchClientPage = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/client-page/client/${clientId}/case/${currentCaseId}/`,
        {
          headers: { Authorization: token },
        }
      );

      if (isClientDataUpdated || Object.keys(clientData).length === 0) {
        setClientData(response.data);
        setIsClientDataUpdated(false);
      }
    } catch (error) {
      console.error("Failed to fetch client data:", error);
    }
  };


  // useEffect(() => {
  //   fetchClientPage();
  // }, [clientId, currentCaseId]);
  function settingCardsData() {
    const CardsDataSetter = {
      client: `${clientData.client?.first_name || ""} ${clientData.client?.middle_name || ""} ${clientData.client?.last_name || ""}`,
      first_name: clientData.client?.first_name,
      middle_name: clientData.client?.middle_name,
      last_name: clientData.client?.last_name,
      names: {
        first_name: clientData.client?.first_name,
        middle_name: clientData.client?.middle_name,
        last_name: clientData.client?.last_name,
      },
      phone_numbers: [
        {
          currentId: clientData.client?.contact_1?.id,
          phone_number: clientData.client?.contact_1?.phone_number || "",
          primary_phone: clientData.client?.contact_1?.primary_phone,
        },
        {
          currentId: clientData.client?.contact_2?.id,
          phone_number: clientData.client?.contact_2?.phone_number || "",
          primary_phone: clientData.client?.contact_2?.primary_phone,
        },
        {
          currentId: clientData.client?.contact_3?.id,
          phone_number: clientData.client?.contact_3?.phone_number || "",
          primary_phone: clientData.client?.contact_3?.primary_phone,
        },
      ],
      primaryPhone: {
        primary_id: clientData.client?.primary_phone?.id,
        phone_number: clientData.client?.primary_phone?.phone_number,
      },
      Emails: [
        {
          currentId: clientData.client?.contact_1?.id,
          email: clientData.client?.contact_1?.email || "",
        },
        {
          currentId: clientData.client?.contact_2?.id,
          email: clientData.client?.contact_2?.email || "",
        },
        {
          currentId: clientData.client?.contact_3?.id,
          email: clientData.client?.contact_3?.email || "",
        },
      ],
      primaryEmail: {
        primary_id: clientData.client?.primary_email?.id,
        email: clientData.client?.primary_email?.email,
      },
      Address1: {
        currentId: clientData.client?.contact_1?.id,
        first_name: clientData.client?.first_name,
        last_name: clientData.client?.last_name,
        address1: clientData.client?.contact_1?.address1 || "",
        address2: clientData.client?.contact_1?.address2 || "",
        city: clientData.client?.contact_1?.city || "",
        state: clientData.client?.contact_1?.state || "",
        zip: clientData.client?.contact_1?.zip || "",
        mailing_contact: clientData.client?.contact_1?.mailing_contact || false,
      },
      mailingContact: {
        primary_id: clientData.client?.mailing_contact?.id,
        address: clientData.client?.mailing_contact?.address1,
      },
      Address2: {
        currentId: clientData.client?.contact_2?.id,
        first_name: clientData.client?.first_name,
        last_name: clientData.client?.last_name,
        address1: clientData.client?.contact_2?.address1 || "",
        address2: clientData.client?.contact_2?.address2 || "",
        city: clientData.client?.contact_2?.city || "",
        state: clientData.client?.contact_2?.state || "",
        zip: clientData.client?.contact_2?.zip || "",
        mailing_contact: clientData.client?.contact_2?.mailing_contact || false,
      },
      identification: {
        title: clientData.client?.ClientTitleID?.name,
        birthday: clientData.client?.birthday,
        license: clientData.client?.driver_license_number,
        ssn: clientData.client?.ssn,
        license_state: clientData.client?.driver_license_state,
        gender: clientData.client?.gender,
      },
      spouseContact: {
        currentId: clientData.client?.spouse?.id,
        name: `${clientData.client?.spouse?.first_name || ""} ${clientData.client?.spouse?.last_name || ""}`.trim(),
        first_name: clientData.client?.spouse?.first_name || "",
        last_name: clientData.client?.spouse?.last_name || "",
        address1: clientData.client?.spouse?.contact?.address1 || "",
        address2: clientData.client?.spouse?.contact?.address2 || "",
        city: clientData.client?.spouse?.contact?.city || "",
        state: clientData.client?.spouse?.contact?.state || "",
        zip: clientData.client?.spouse?.contact?.zip || "",
        relationship: clientData.client?.spouse?.relationship || "",
      },
      spouseInfo: {
        currentId: clientData.client?.spouse?.id || "",
        status: clientData.client?.spouse?.divorced || "",
        discuss: clientData.client?.spouse?.discussCase || "",
        phone: clientData.client?.spouse?.contact?.phone_number,
        email: clientData.client?.spouse?.contact?.email,
        relationship: clientData.client?.spouse?.marital_status || "",
        DivorcedDate: clientData.client?.spouse?.divorce_date || "",
        MarraigeDate: clientData.client?.spouse?.marriage_date || "",
        contact: clientData.client?.spouse?.contact?.id,
      },
      emergencyContact: {
        currentId: clientData.client?.emergency_contact?.id,
        name: `${clientData.client?.emergency_contact?.first_name || ""} ${clientData.client?.emergency_contact?.last_name || ""}`.trim(),
        first_name: clientData.client?.emergency_contact?.first_name || "",
        last_name: clientData.client?.emergency_contact?.last_name || "",
        address1: clientData.client?.emergency_contact?.contact?.address1 || "",
        address2: clientData.client?.emergency_contact?.contact?.address2 || "",
        city: clientData.client?.emergency_contact?.contact?.city || "",
        state: clientData.client?.emergency_contact?.contact?.state || "",
        zip: clientData.client?.emergency_contact?.contact?.zip || "",
        first_name: clientData.client?.emergency_contact?.first_name || "",
        last_name: clientData.client?.emergency_contact?.last_name || "",
      },
      emergencyInfo: {
        relation: clientData.client?.emergency_contact?.relationship,
        discuss: clientData.client?.emergency_contact?.discussCase,
        phone: clientData.client?.emergency_contact?.contact?.phone_number,
        email: clientData.client?.emergency_contact?.contact?.email,
      },
      Avatars: {
        avatar2: mediaRoute(clientData?.client?.profile_pic_29p),
        avatar3: mediaRoute(clientData?.client?.profile_pic_19p),
        avatar1: mediaRoute(clientData?.client?.profile_pic),
      },
      photos: clientData?.client_photos?.photos,
      CommPhoto1: clientData?.processed_photo_slots?.[0]
        ? {
            id: clientData.processed_photo_slots[0].photo_slot?.id,
            slotNumber:
              clientData.processed_photo_slots[0].photo_slot?.slot_number,
            slotName: clientData.processed_photo_slots[0].photo_slot?.slot_name,
            photoURL:
              clientData.processed_photo_slots[0]?.photo?.case_thumbnail,
          }
        : null,
      CommPhoto2: clientData?.processed_photo_slots?.[1]
        ? {
            id: clientData.processed_photo_slots[1].photo_slot?.id,
            slotNumber:
              clientData.processed_photo_slots[1]?.photo_slot?.slot_number,
            slotName:
              clientData.processed_photo_slots[1]?.photo_slot?.slot_name,
            photoURL:
              clientData.processed_photo_slots[1]?.photo?.case_thumbnail,
          }
        : null,
    };
    return CardsDataSetter;
  }

  useEffect(() => {
    fetchClientPage();
    setCardsData(settingCardsData());
    if (isClientDataUpdated) {
      setIsClientDataUpdated(false);
    }
  }, [isClientDataUpdated, clientId, clientData, currentCaseId]);

  const dispatch = useDispatch();
  const [client_cases, set_client_cases] = useState([]);

  const fetchClientPageTwo = async () => {
    try {
      const client_data = await axios.get(
        origin +
          "/api/client-page/client/" +
          clientId +
          "/case/" +
          currentCaseId +
          "/",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      set_client_cases(client_data.data.client_cases);
    } catch (error) {
      console.error("Failed to fetch client Data:", error);
    }
  };

  useEffect(() => {
    fetchClientPageTwo();
    fetchShakespeareStatus(currentCaseId, clientId, "Client", dispatch);
  }, [clientId, currentCaseId]);

  // Media queries
  const isNoCards1 = useMediaQuery({ minWidth: 1050, maxWidth: 1200 });
  const isNoCards = useMediaQuery({ minWidth: 1200, maxWidth: 1399 });
  const isOneCards = useMediaQuery({ minWidth: 1400, maxWidth: 1699 });
  const isTwoCards = useMediaQuery({ minWidth: 1700, maxWidth: 1849 });
  // const isThreeCards2 = useMediaQuery({ minWidth: 1850, maxWidth: 2099 });
  const isThreeCards = useMediaQuery({ minWidth: 1850, maxWidth: 2099 });
  // const isFourCards2 = useMediaQuery({ minWidth: 2100, maxWidth: 2349 });
  const isFourCards = useMediaQuery({ minWidth: 2100, maxWidth: 2349 });
  // const isFiveCards3 = useMediaQuery({ minWidth: 2350, maxWidth: 2899 });
  const isFiveCards = useMediaQuery({ minWidth: 2350, maxWidth: 2699 });
  const isFiveCards2 = useMediaQuery({ minWidth: 2700, maxWidth: 2899 });
  const is4kCards = useMediaQuery({ minWidth: 2900, maxWidth: 3299 });
  const is6kCards2 = useMediaQuery({ minWidth: 3300, maxWidth: 3800 });
  // const is6kCards = useMediaQuery({ minWidth: 3501, maxWidth: 3700 });
  // const is6kCards3 = useMediaQuery({ minWidth: 3701, maxWidth: 3800 });
  const is7kCards = useMediaQuery({ minWidth: 3801, maxWidth: 4299 });
  const is8kCards = useMediaQuery({ minWidth: 4300, maxWidth: 4799 });
  const is9kCards = useMediaQuery({ minWidth: 4800, maxWidth: 5299 });
  const is10kCards = useMediaQuery({ minWidth: 5300, maxWidth: 6000 });
  const is11kCards = useMediaQuery({ minWidth: 6100, maxWidth: 6399 });
  const is12kCards = useMediaQuery({ minWidth: 6400, maxWidth: 6799 });
  const is13kCards = useMediaQuery({ minWidth: 6800, maxWidth: 7199 });
  const is14kCards = useMediaQuery({ minWidth: 7200 });
  const clientPanelCards = useRef(null);
  const [clientCommunicationPanelWidth, setClientCommunicationPanelWidth] =
    useState();
  useEffect(() => {
    if (clientPanelCards.current) {
      const width = clientPanelCards.current.offsetWidth;
      setClientCommunicationPanelWidth(width);
    }

    const handleResize = () => {
      if (clientPanelCards.current) {
        const width = clientPanelCards.current.offsetWidth;
        setClientCommunicationPanelWidth(width);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderClientInfo = (
    width,
    flexClass,
    flexClassRight,
    isScreenSize,
    isNameShow,
    isPhoneShow,
    isEmailShow,
    isAddress1Show,
    isAddress2Show,
    isClientIdentification = false,
    hasClientSpouse = false,
    hasClientSpouseInfo = false,
    hasEmergencyContact = false,
    hasEmergencyInfo = false
  ) => {
    const screenProps = {
      isScreen14k: isScreenSize === "is14kCards",
      isScreen13k: isScreenSize === "is13kCards",
      isScreen12k: isScreenSize === "is12kCards",
      isScreen11k: isScreenSize === "is11kCards",
      isScreen10k: isScreenSize === "is10kCards",
      isScreen9k: isScreenSize === "is9kCards",
      isScreen8k: isScreenSize === "is8kCards",
      isScreen7k: isScreenSize === "is7kCards",
      isScreen6k: isScreenSize === "is6kCards2",
      isScreen4k: isScreenSize === "is4kCards",
      isScreen50: isScreenSize === "isFiveCards",
      isScreen50_2: isScreenSize === "isFiveCards2",
      isScreen57: isScreenSize === "isFourCards",
      isScreen67: isScreenSize === "isThreeCards",
      isScreen75: isScreenSize === "isTwoCards",
      isScreen90: isScreenSize === "isOneCards",
      isScreen100: isScreenSize === "isNoCards",
      isScreen100_1: isScreenSize === "isNoCards1",
    };

    const filteredScreenProps = Object.entries(screenProps)
      .filter(([key, value]) => value === true)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    return (
      <div style={{ display: "flex", width: width, paddingTop: "5px" }}>
        <div style={{ flex: flexClass }}>
          <ClientInfo
            CardsData={CardsData}
            clientNames={CardsData?.names}
            clientCases={client_cases}
            {...filteredScreenProps}
            isNameShow={isNameShow}
            isPhoneShow={isPhoneShow}
            isEmailShow={isEmailShow}
            isAddress1Show={isAddress1Show}
            isAddress2Show={isAddress2Show}
            isClientIdentification={isClientIdentification}
            hasClientSpouse={hasClientSpouse}
            hasClientSpouseInfo={hasClientSpouseInfo}
            hasEmergencyContact={hasEmergencyContact}
            hasEmergencyInfo={hasEmergencyInfo}
            clientCommWidth={clientCommunicationPanelWidth}
          />
        </div>
        <div
          ref={clientPanelCards}
          className="position-relative"
          style={{
            flex: flexClassRight,
            marginRight: window.innerWidth > 2900 ? "5px" : "5px",
            right: "-5px",
          }}
        >
          <ClientRightPanelCards
            CardsData={CardsData}
            isNameShow={!isNameShow}
            isPhoneShow={!isPhoneShow}
            isEmailShow={!isEmailShow}
            isAddress1Show={!isAddress1Show}
            isAddress2Show={!isAddress2Show}
            isClientIdentification={!isClientIdentification}
            hasClientSpouse={!hasClientSpouse}
            hasClientSpouseInfo={!hasClientSpouseInfo}
            hasEmergencyContact={!hasEmergencyContact}
            hasEmergencyInfo={!hasEmergencyInfo}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="page-wrapper"
        style={{ overflowX: "hidden", overflowY: "scroll" }}
      >
        <Sidebar />
        <div className="page-container">
          <NavBar flaggedPageName="Client" />
          <ActionBarClient />

          <div
            className="container-fluid-client Cus-PLC-2 PR-0-PX"
            style={{ marginTop: "165px" }}
          >
            {is14kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is14kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is13kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is13kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is12kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is12kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is11kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is11kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is10kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is10kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is9kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is9kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is8kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is8kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is7kCards &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is7kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is6kCards2 &&
              renderClientInfo(
                "100.0%",
                "100%",
                "0%",
                "is6kCards2",
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {is4kCards &&
              renderClientInfo(
                "100%",
                "100%",
                "0%",
                "is4kCards",
                true,
                true,
                true,
                true,
                true,
                true,
                true
              )}
            {isFiveCards &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isFiveCards",
                true,
                true,
                true,
                true,
                true
              )}
            {isFiveCards2 &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isFiveCards2",
                true,
                true,
                true,
                true,
                true
              )}
            {isFourCards &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isFourCards",
                true,
                true,
                true,
                true,
                false
              )}
            {isThreeCards &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isThreeCards",
                true,
                true,
                true,
                false,
                false
              )}
            {isTwoCards &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isTwoCards",
                true,
                true,
                false,
                false,
                false
              )}
            {isOneCards &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isOneCards",
                true,
                false,
                false,
                false,
                false
              )}
            {isNoCards &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isNoCards",
                false,
                false,
                false,
                false,
                false
              )}
            {isNoCards1 &&
              renderClientInfo(
                "100%",
                "80%",
                "0%",
                "isNoCards1",
                false,
                false,
                false,
                false,
                false
              )}

            {/* {is14kCards && (
              <div style={{ display: "flex", width: "105.79%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen14k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}
            {/* {is13kCards && (
              <div style={{ display: "flex", width: "104.9%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen13k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}

            {/* {is12kCards && (
              <div style={{ display: "flex", width: "103.6%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen12k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {is11kCards && (
              <div style={{ display: "flex", width: "103.4%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen11k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {is10kCards && (
              <div style={{ display: "flex", width: "103.2%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen10k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {is9kCards && (
              <div style={{ display: "flex", width: "103.1%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen9k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {is8kCards && (
              <div style={{ display: "flex", width: "101.3%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen8k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {is7kCards && (
              <div style={{ display: "flex", width: "101.2%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen7k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}
            {/* 3300-3500 */}
            {/* {is6kCards && (
              <div style={{ display: "flex", width: "100.46%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen6k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}
            {/* 3301-3500 */}
            {/* {is6kCards2 && (
              <div style={{ display: "flex", width: "100.46%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen6k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}
            {/* 3700-3800 */}
            {/* {is6kCards3 && (
              <div style={{ display: "flex", width: "105.46%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen6k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}

            {/* {is4kCards && (
              <div style={{ display: "flex", width: "100.46%" }}>
                <div style={{ flex: "95%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen4k={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ flex: "8%", marginRight: "10px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )} */}
            {/* {isFiveCards && (
              <div style={{ display: "flex", width: "100.40%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen50={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ marginRight: "5px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {isFiveCards2 && (
              <div style={{ display: "flex", width: "100.40%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen50_2={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ marginRight: "5px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}
            {isFiveCards3 && (
              <div style={{ display: "flex", width: "100.45%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen50={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
                <div style={{ marginRight: "5px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={false}
                  />
                </div>
              </div>
            )}

            {isFourCards && (
              <div style={{ display: "flex", width: "100.33%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen57={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                  />
                </div>
                <div style={{ marginRight: "5px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={false}
                    isAddress2Show={true}
                  />
                </div>
              </div>
            )} */}

            {/* {isThreeCards && (
              <div style={{ display: "flex", width: "100.50%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen67={true}
                    isNameShow={true}
                    isPhoneShow={true}
                    isEmailShow={true}
                  />
                </div>
                <div style={{ marginRight: "5px" }}>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={false}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
              </div>
            )}

            {isTwoCards && (
              <div style={{ display: "flex", width: "100.34%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen75={true}
                    isNameShow={true}
                    isPhoneShow={true}
                  />
                </div>
                <div>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={false}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
              </div>
            )}

            {isOneCards && (
              <div style={{ display: "flex", width: "100.5%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen90={true}
                    isNameShow={true}
                  />
                </div>
                <div>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                  />
                </div>
              </div>
            )}

            {isNoCards && (
              <div style={{ display: "flex", width: "100.5%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen100={true}
                  />
                </div>
                <div>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                    isNameShow={true}
                  />
                </div>
              </div>
            )}
            {isNoCards1 && (
              <div style={{ display: "flex", width: "100.5%" }}>
                <div style={{ flex: "80%" }}>
                  <ClientInfo
                    CardsData={CardsData}
                    clientNames={CardsData?.names}
                    clientCases={client_cases}
                    isScreen100_1={true}
                  />
                </div>
                <div>
                  <ClientRightPanelCards
                    CardsData={CardsData}
                    isPhoneShow={true}
                    isEmailShow={true}
                    isAddress1Show={true}
                    isAddress2Show={true}
                    isNameShow={true}
                  />
                </div>
              </div>
            )} */}

            <div
              className="e-signature-section page-container"
              style={{ marginLeft: "-5px" }}
            >
              <ESignatureComponent />
            </div>
            <div
              className="row documents-wrapper m-t-5"
              style={{ marginRight: "0px" }}
            >
              <div className="col-12 pr-0">
                <div className="height-25">
                  <h4
                    style={{ backgroundColor: "var(--primary-15)" }}
                    className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case font-weight-semibold text-center client-contact-title"
                  >
                    {/* {report.reporting_agency} {report.report_type_name} */}
                    Client Quick-Access Document Row
                  </h4>
                </div>
                <DocumentRow clientProvider={currentCaseId} page="Client" />
              </div>
            </div>
            <div className="m-b-5 row esignatures-wrapper no-gutters page-container">
              <div className="col-12">
                <InsurancePageClient showActionBar={false} />
              </div>
            </div>
          </div>
          <NotesSectionDashboard />
        </div>
      </div>
      <Footer />
    </>

    /*<div>
        <div className="page-wrapper">
          <Sidebar />
          <div className="page-container">
            <NavBar flaggedPageName="Client" />
            <ActionBarClient />
          </div>
        </div>
        <div className="client-dashboard-section page-container" style={{ marginTop: "10.5rem" }}>
          <div style={{ display: "flex", width: '100%' }}>
            <div style={{ flex: '80%', marginLeft: '10rem' }}>
              <ClientInfo clientNames={clientNameCreds} clientCases={client_cases} />
            </div>
            <div style={{ flex: '20%', marginRight: '0.3rem' }}>
              <ClientRightPanelCards />
            </div>
          </div>
        </div>

        <div className="e-signature-section page-container" style={{ marginLeft: '10rem' }}>
          <ESignatureComponent />
        </div>
        <div className="quick-access-doc-section page-container" style={{ marginLeft: '10rem' }}>
          <QuickAccessDocumentsComponent insurance={insurance} client={clientNameCreds} insuranceSlots={insuranceSlots} />
        </div>
        <div className="mt-2 mb-4 row esignatures-wrapper no-gutters page-container" style={{ marginLeft: '10rem' }}>
          <div className="col-12">
            <InsurancePageClient showActionBar={false} />
          </div>
        </div>

      </div>*/
  );
};

export default ClientPage;
