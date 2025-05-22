import React, {
  useEffect,
  useReducer,
  useRef,
  useState,
  useContext,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import api from "../api/api";
import "../../public/BP_resources/css/experts-i65.css";
import "../../public/BP_resources/css/defendants_copy.css";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import {
  fetchShakespeareStatus,
  formatDateForPanelDisplay,
  getCaseId,
  getClientId,
} from "../Utils/helper";
import DefendantsActionBar from "../Components/DefendantPage/DefendantsActionBar";
import DefendantMain from "../Components/DefendantPage/DefendantMain";
import EditDefendant from "../Components/DefendantPage/DefandantMain/EditDefendant";
import TitleBar from "../Components/Insurance/TitleBar";
import InsuranceCompany from "../Components/Insurance/InsuranceCompany";
import Adjsuter from "../Components/Insurance/Adjuster";
import Supervisor from "../Components/Insurance/Supervisor";
import ClaimInfo from "../Components/Insurance/ClaimInfo";
import DocumentRow from "../Components/DocumentRow/DocumentRow";
import {
  fetchCreateInsuranceModalData,
  deleteInsurance,
} from "../Redux/insurance/insuranceSlice";
import InsuranceModal from "../Components/Insurance/InsuranceModal";
import ConfirmDeleteModal from "../Components/Insurance/ConfirmDeleteModal";
import AddDefendantInsuranceModal from "../Components/DefendantPage/Insurance/AddDefendantInsuranceModal";
import CounselMain from "../Components/DefendantPage/Counsel/CounselMain";
import AddCounsel from "../Components/DefendantPage/Counsel/AddCounsel";
import ConfirmDeletePopup from "../Components/DefendantPage/DefandantMain/ConfirmDeletePopup";
import GenrateDocument from "../Components/GenrateDocument/GenrateDocument";
import { setSearchRecordId } from "../Redux/search/searchSlice";
import axios from "axios";
import Footer from "../Components/Footer/Footer";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import PanelActionBarComponent from "../Components/common/PanelActionBarComponent";
import InsuranceIcon from "../../public/BP_resources/images/icon/insurance-icon-color.svg";
import ContactPanel from "../Components/common/ContactPanel";
import InformationPanel from "../Components/common/InformationPanel";
import CommonFooter from "../Components/common/footer";
import "./DefendantPage.css";
import AddDefendant from "../Components/DefendantPage/DefandantMain/AddDefendant";
import GenericTabs from "../Components/common/GenericTab";
import { currencyFormat } from "../Utils/helper";
import { Form } from "react-bootstrap";

//RK ::2024-04-07 11-31pm
function DefendantPage() {
  const dispatch = useDispatch();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const searchRecordId = useSelector((state) => state.searchS.searchRecordId);
  // const currentCaseId = useSelector((state) => state?.caseData?.current.id);
  const currentCaseId = getCaseId();
  // const clientId = useSelector((state) => state?.client?.current.id);
  const clientId = getClientId();
  const [medicalBillData,setMedicalBillData] = useState({})
  const [defendants, setDefendats] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [isFecthDefendants, setIsFecthDefendants] = useState(false);
  const [selectedDefendat, setSelectedDefendant] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forDeleteDefendatsId, setForDeleteDefendatsId] = useState(null);
  const selectedEditableTabPanel = useRef("");
  const [currentDefendantId, setCurrentDefendantId] = useState("");
  const [counselTypes, setCounselTypes] = useState([]);
  const { isPanelChecklistUpdated, setIsPanelChecklistUpdated } =
    useContext(ClientDataContext);
  const [pageData, setPageData] = useState({});

  const [defendantsLength, setDefendantsLength] = useState(0); //
  const [reducerValue, setReducer] = useReducer((x) => x + 1, 0);

  const [isDummy, setIsDummy] = useState(true);

  //Counsel Modals
  const [counselAddModalShow, setAddCounselModalShow] = useState(false);
  const [forDeleteCounselId, setForDeleteCounselId] = useState(null);
  const [showDeleteCounselConfirm, setShowDeleteCounselConfirm] =
    useState(false);

  // Insurance Modals
  const [editInsuranceModal, setEditInsuranceModal] = useState({});
  const [showDeleteInsuranceModal, setShowDeleteInsuranceModal] =
    useState(false);
  const [insuranceModalShow, setInsuranceModalShow] = useState(false);
  const [addInsuranceModalShow, setAddInsuranceModalShow] = useState(false);
  const [selectedInsuranceDeletionId, setSelectedInsuranceDeletionId] =
    useState(null);
  const [activeInsuranceTab, setActiveInsuranceTab] = useState("insurance");
  const { modalData } = useSelector((state) => state.insurances);

  /// Genrate Documents
  const [showDocument, setShowDocument] = useState(false);
  const [instanceIdForGenrateDoc, setInstanceIdForGenragteDoc] = useState(null);
  const [dropdownName, setDropdownName] = useState("");
  const defendantsRefs = useRef({});
  const containerRef = useRef(null);
  const [show, setShow] = useState(false);
  const LienButtonsConfig = [
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
      onClick: (id, name) => {},
    },
  ];
  // console.log("Search record Id on the defendant = ",searchRecordId)

  const handleGenrateDocument = (instanceId, dropDownName) => {
    console.log("FUNCTION IS CALLED");
    console.log("HGD instance id == :: ", instanceId);
    console.log("dropDownName", dropDownName);
    setDropdownName(dropDownName);
    setInstanceIdForGenragteDoc(instanceId);
    setShowDocument(true);
  };

  const tokenBearer = localStorage.getItem("token");

  const fecthDefendants = async () => {
    try {
      setIsFecthDefendants(false);
      dispatch(
        fetchCreateInsuranceModalData({
          client_id: clientId,
          case_id: currentCaseId,
        })
      );
      const response = await axios.get(
        `${origin}/api/defendants/defendants_list/${clientId}/${currentCaseId}/`,
        {
          headers: {
            // 'Authorization': `Bearer ${token}`
            Authorization: tokenBearer,
          },
        }
      );
      console.log("defendant api defendants", response?.data.defendants);
      const response1 = await axios.get(
        `${origin}/api/settlement-page/lien-information/?case_id=${currentCaseId}&client_id=${clientId}`,
        {
          headers: {
            // 'Authorization': `Bearer ${token}`
            Authorization: tokenBearer,
          },
        }
      );
      console.log(response1?.data?.data)
      if(response1.status === 200) setMedicalBillData(response1?.data?.data);
      if (response.status === 200) {
        setDefendats(response.data.defendants);
        setPageData(response.data.defendants_info);
        setDefendantsLength(response?.data?.defendants.length);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const fecthDummyStatus = async () => {
    try {
      const response = axios.get(
        `${origin}/api/general/panel_page_block/?case_id=${currentCaseId}&entity=Defendants`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenBearer,
          },
        }
      );
      setIsDummy(response?.data?.status);
    } catch (error) {}
  };

  useEffect(() => {
    fecthDefendants();
    fecthDummyStatus();
  }, [isFecthDefendants, reducerValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/defendants/counsel_types/");
        setCounselTypes(response.data);
      } catch (error) {
        console.log("Error : ", error);
      }
    };
    fetchShakespeareStatus(currentCaseId, clientId, "Defendants", dispatch);
    fetchData();
  }, []);

  const handleFacthDefendants = () => {
    setIsFecthDefendants(true);
  };

  const handleCloseFucton = () => {
    setSelectedDefendant(null);
  };

  const showDeleteConfirmPopup = () => {
    setShowDeleteConfirm(true);
    setSelectedDefendant(null);
  };

  const hideDeleteConfirmPopup = () => {
    setShowDeleteConfirm(false);
  };

  const handleEditModalShow = (tab) => {
    setActiveInsuranceTab(tab);
    setInsuranceModalShow(true);
  };

  const extractDataForEditModal = (data) => {
    setEditInsuranceModal(data);
  };

  // const handleInsuranceCreation = async ()=>{
  //   try{

  //     const response = await api.get(`${origin}/api/defendants/defendants_list/${clientId}/${currentCaseId}/`)
  //     if (response.status===200){
  //       setDefendats(response.data.defendants)
  //     }
  //   }catch(error){
  //     console.log(error)
  //   }

  // }

  // handle insurance Deletion
  const handleDelete = async () => {
    await dispatch(
      deleteInsurance({ insurance_id: selectedInsuranceDeletionId })
    );
    setShowDeleteInsuranceModal(false);
    setSelectedInsuranceDeletionId(null);
    handleFacthDefendants();
  };
  const deleteInsuranceHandler = (id) => {
    setInsuranceModalShow(false);
    setShowDeleteInsuranceModal(true);
    setSelectedInsuranceDeletionId(id);
  };

  //Delete Defendant is handeled here
  const handleDeleteDefendantsSubmission = async () => {
    try {
      setIsFecthDefendants(false);
      const response = await api.delete(
        `${origin}/api/defendants/delete_defendant/${forDeleteDefendatsId}/`
      );
      if (response.status === 204) {
        hideDeleteConfirmPopup();
        handleFacthDefendants();
        setIsPanelChecklistUpdated(!isPanelChecklistUpdated);
        setReducer(reducerValue);
      }
    } catch (error) {
      console.log(error);
    } finally {
      hideDeleteConfirmPopup();
    }
  };

  //Delete OpposingCounsel is handeled here
  const handleDeleteCounselSubmission = async () => {
    try {
      setIsFecthDefendants(false);
      const response = await axios.delete(
        `${origin}/api/defendants/delete_opposing_counsel/${forDeleteCounselId}/`,
        {
          headers: {
            // 'Authorization': `Bearer ${token}`
            Authorization: tokenBearer,
          },
        }
      );
      if (response.status === 204) {
        setShowDeleteCounselConfirm(false);
        handleFacthDefendants();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatWithCommas = (value) => {
    if (!value || isNaN(Number(value))) {
      return "";
    }

    const formattedValue = Number(value).toLocaleString();
    return formattedValue;
  };

  // For Scrolling to specfic defendant record from redirected from search page
  useEffect(() => {
    // Scroll to that specific record
    if (searchRecordId && defendantsRefs.current[searchRecordId]) {
      const searchRecordElement = defendantsRefs.current[searchRecordId];
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
  }, [defendants]);

  let zIndexCounter = 1000; // Starting high zIndex

  const InsuranceButtons = [
    {
      iconClassName: "ic ic-19 ic-generate-document",
      buttonText: "Generate Document",
      className: "p-l-6 p-r-5",
      style: { height: "25px" },
      onClick: (id, name) => {},
    },
  ];

  const handeCounselShow = (defendantId) => {
    setAddCounselModalShow(true);
    console.log("defendantId", defendantId);
    setCurrentDefendantId(defendantId);
  };

  const handeInsuranceShow = (defendantId) => {
    setAddInsuranceModalShow(true);
    console.log("defendantId", defendantId);
    setCurrentDefendantId(defendantId);
  };
  const handleNewDefendantShow = () => {
    setShow(!show);
  };

  const tabsData = [
    {
      id: "defendants",
      label: "Defendants",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-90)",
      modalTarget: "#addDefendant",
      onClick: handleNewDefendantShow,
      leftHand: true,
      span: <span className="font-weight-bold pr-2 text-gold">+</span>,
    },
    {
      id: "insurance",
      label: "Insurance",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-80)",
      modalTarget: "#addInsurance",
      onClick: handeInsuranceShow,
      leftHand: true,
      span: <span className="font-weight-bold pr-2 text-gold">+</span>,
    },
    {
      id: "counsel",
      label: "Counsel",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-70)",
      modalTarget: "#addCounsel",
      left: "0px",
      onClick: handeCounselShow,
      leftHand: true,
      span: <span className="font-weight-bold pr-2 text-gold">+</span>,
    },
  ];

  const height = 25;

  return (
    <>
      <div className="page-wrapper">
        <Sidebar pages={pages} />
        <div className="page-container">
          <NavBar
            client={client}
            currentCase={currentCase}
            flaggedPageName={"Defendants"}
          />
          <DefendantsActionBar
            onFetchDefendants={handleFacthDefendants}
            defendantsLength={defendantsLength}
            pageData={pageData}
            isDummy={isDummy}
            setReducer={setReducer}
          />

          <div
            className="experts-main-container invisible-scrollbar"
            ref={containerRef}
            style={{ overflowY: "auto", maxHeight: "100vh", top: "165px" }}
          >
            {/* <div className="continuous-tabs">
              <button
                data-toggle="modal"
                data-target="#addDefendant"
                onClick={() => handleNewDefendantShow()}
                className="tab-defendant-page  defendants-defendant-page d-flex align-items-center justify-content-center"
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>
                Defendants
              </button>
              <button
                data-toggle="modal"
                data-target="#addInsurance"
                onClick={(defendantId) => handeInsuranceShow(defendantId)}
                className="tab-defendant-page  insurance-defendant-page d-flex align-items-center justify-content-center"
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>
                Insurance
              </button>
              <button
                data-toggle="modal"
                data-target="#addCounsel"
                onClick={(defendantId) => handeCounselShow(defendantId)}
                className="tab-defendant-page  counsel-defendant-page d-flex align-items-center justify-content-center"
              >
                <span className="font-weight-bold pr-2 text-gold">+</span>
                Counsel
              </button>
            </div> */}
            <GenericTabs tabsData={tabsData} height={height} />

            {defendants &&
              defendants.map((object) => {
                const defendantZIndex = zIndexCounter--;

                return (
                  <div
                    ref={(el) => (defendantsRefs.current[object.id] = el)}
                    key={object.id}
                  >
                    <div
                      style={{ position: "relative", zIndex: defendantZIndex }}
                    >
                      <DefendantMain
                        object={object}
                        selecetedEditableTapPanel={selectedEditableTabPanel}
                        setSelectedDefendant={setSelectedDefendant}
                        setForDeleteDefendatsId={setForDeleteDefendatsId}
                        setAddInsuranceModalShow={setAddInsuranceModalShow}
                        handleFacthDefendants={handleFacthDefendants}
                        setAddCounselModalShow={setAddCounselModalShow}
                        setCurrentDefendantId={setCurrentDefendantId}
                        handleGenrateDocument={handleGenrateDocument}
                        handeCounselShow={(id) => handeCounselShow(id)}
                        handeInsuranceShow={(id) => handeInsuranceShow(id)}
                        defendants={defendants}
                      />
                    </div>

                    {object.liability_insurance_id &&
                      object.liability_insurance_id.map((data) => {
                        const insuranceZIndex = zIndexCounter--;

                        return (
                          <div
                            className="report"
                            key={data.id}
                            style={{
                              position: "relative",
                              zIndex: insuranceZIndex,
                            }}
                          >
                            <PanelActionBarComponent
                              panelIconSrc={InsuranceIcon}
                              instanceForName={data?.insurance_type?.name}
                              page_name={"Insurance"}
                              id={data?.id}
                              forInstanceName={
                                object.defendantType_name ===
                                "Private Individual"
                                  ? `${object?.first_name || ""} ${object?.last_name || ""}`
                                  : object?.entity_name || ""
                              }
                            />
                            <div className="d-flex">
                              <div className="leins-container-six" onClick={() => extractDataForEditModal(data)}>
                                <div className="liens-container-item">
                                <ContactPanel
                                  panel_name={"Insurance Company"}
                                  className="m-b-5"
                                  dynamic_label={"Company Name"}
                                  name={data?.company_contact?.name}
                                  address1={data?.company_contact?.address1}
                                  address2={data?.company_contact?.address2}
                                  email={data?.company_contact?.email}
                                  phone_number={
                                    data?.company_contact?.phone_number
                                  }
                                  city={data?.company_contact?.city}
                                  state={data?.company_contact?.state}
                                  zip_code={data?.company_contact?.zip}
                                  fax_number={data?.company_contact?.fax}
                                  ext={data?.company_contact?.ext}
                                  onSelectObject={() =>
                                    handleEditModalShow("company")
                                  }
                                  buttonData={InsuranceButtons}
                                  pageName="Defendants"
                                />
                                </div>
                                <div className="liens-container-item">
                                <ContactPanel
                                  panel_name={"Adjuster"}
                                  className="m-b-5"
                                  name={`${data?.adjuster?.first_name ? data?.adjuster?.first_name : ""} ${data?.adjuster?.last_name ? data?.adjuster?.last_name : ""}`}
                                  address1={data?.adjuster?.address1}
                                  address2={data?.adjuster?.address2}
                                  email={data?.adjuster?.email}
                                  phone_number={data?.adjuster?.phone_number}
                                  fax_number={data?.adjuster?.fax}
                                  city={data?.adjuster?.city}
                                  state={data?.adjuster?.state}
                                  zip_code={data?.adjuster?.zip}
                                  ext={data?.adjuster?.ext}
                                  onSelectObject={() =>
                                    handleEditModalShow("adjuster")
                                  }
                                  buttonData={InsuranceButtons}
                                  pageName="Defendants"
                                />
                      
                                </div>
                                <div className="liens-container-item">
                                <ContactPanel
                                  panel_name={"Supervisor"}
                                  className="m-b-5"
                                  pageName="Defendants"
                                  name={`${data?.supervisor?.first_name ? data?.supervisor?.first_name : ""} ${data?.supervisor?.last_name ? data?.supervisor?.last_name : ""}`}
                                  address1={data?.supervisor?.address1}
                                  address2={data?.supervisor?.address2}
                                  email={data?.supervisor?.email}
                                  city={data?.supervisor?.city}
                                  state={data?.supervisor?.state}
                                  zip_code={data?.supervisor?.zip}
                                  phone_number={
                                    data?.supervisor?.phone_number
                                  }
                                  fax_number={data?.supervisor?.fax}
                                  ext={data?.supervisor?.ext}
                                  onSelectObject={() =>
                                    handleEditModalShow("supervisor")
                                  }
                                  buttonData={InsuranceButtons}
                                />
                                </div>
                                <div className="liens-container-item">
                                <InformationPanel
                                  panel_name={"Claim Information"}
                                  className="m-b-5"
                                  data={[
                                    {
                                      label: "Type",
                                      value: data?.insurance_type?.name,
                                    },
                                    {
                                      label: "Limits",
                                      value: `$ ${formatWithCommas(data?.liabilityLimit)} / ${formatWithCommas(data?.liabilityLimitAll)} $`,
                                    },
                                    {
                                      label: "Policy",
                                      value: data?.policy_number,
                                    },
                                    {
                                      label: "Claim",
                                      value: data?.claim_number,
                                    },
                                    {
                                      label: "Date",
                                      value: formatDateForPanelDisplay(
                                        data?.Dateconfirmedactive
                                      ),
                                    },
                                  ]}
                                  onSelectReport={() =>
                                    handleEditModalShow("claim")
                                  }
                                />
                                </div>
                                <div className="liens-container-item">
                                <InformationPanel
                                    onSelectReport={() =>
                                      handleEditModalShow("lien_adjuster")
                                    }
                                    panel_name={"Lien Information"}
                                    className=""
                                    data={[
                                      {
                                        label: "Lien Adjuster",
                                        value: data?.lien_adjuster ? `${data?.lien_adjuster?.first_name || ''} ${data?.lien_adjuster?.last_name || ''}` : `${data?.company_contact?.first_name || ''} ${data?.company_contact?.last_name || ''}`,
                                      },
                                      {
                                        label: "HI Paid",
                                        value: `${currencyFormat(medicalBillData?.total_ins_paid)}`,
                                      },
                                      {
                                        label: "Medpay/Pip",
                                        value: `${currencyFormat(medicalBillData?.total_medpaypaip)}`,
                                      },
                                      {
                                        label: "ERISA Protected Lien",
                                        value: <Form.Check
                                        style={{width:"15px",height:"15px"}}
                                        type="checkbox"
                                        className="protection-lien-cb"
                                        name="protection_lien"
                                        />,
                                      },
                                      {
                                        label: "",
                                        value:"",
                                      },
                                      {
                                        label: "Total Paid",
                                        value: `${currencyFormat(data?.insurancelien_insurance?.totalpaid)}`,
                                      },
                                      {
                                        label: "Original Lien",
                                        value: `${currencyFormat(data?.insurancelien_insurance?.liens)}`,
                                      },
                                      {
                                        label: "Final Lien",
                                        value: `${currencyFormat(data?.insurancelien_insurance?.lienfinal)}`,
                                      },
                                    ]}
                                  />
                                </div>
                                <div className="liens-container-item">
                                  <ContactPanel
                                  name={`${data?.lein_holder?.name || ''}`}
                                  address1={data?.lien_adjuster?.address1 && data?.lien_adjuster?.address2 ? data?.lien_adjuster?.address1 : data?.lein_holder?.address1}
                                  address2={data?.lien_adjuster?.address1 && data?.lien_adjuster?.address2 ? data?.lien_adjuster?.address2 : data?.lein_holder?.address2}
                                  email={data?.lein_holder?.email}
                                  phone_number={
                                    data?.lein_holder?.phone_number
                                  }
                                  panel_name={"Lien Contact"}
                                  buttonData={LienButtonsConfig}
                                  dynamic_label={"Company Name"}
                                  websiteURL={null}
                                  city={data?.lein_holder?.city}
                                  state={data?.lein_holder?.state}
                                  zip_code={data?.lein_holder?.zip}
                                  fax_number={data?.lein_holder?.fax}
                                  ext={data?.lein_holder?.ext}
                                  pageName="Defendants"
                                  onSelectObject={() =>
                                    handleEditModalShow("lien")
                                  }
                                />
                                </div>
                              </div>
                              <div className="d-flex d-flex-1 p-l-5 m-b-5 overflow-hidden notes-panel-defendant">
                              <NotesPanel
                                record_id={data.id}
                                instanceFor="Defendants" //to show height with respect to defendants page
                                module={"Insurance"}
                                notesName={"Insurance"}
                                pagePanels={6}
                              />
                              </div>
                            </div>

                            {/* <div
                              className="flex-row d-flex"
                              style={{ overflow: "hidden" }}
                            >
                              <div
                                onClick={() => extractDataForEditModal(data)}
                                className="row no-gutters equal-column-wrapper position-relative panels-direction-secondary  insurance-col-panels padding-t-5"
                              >
                                <div className="d-flex flex-xl-row flex-column">
                                  <ContactPanel
                                    panel_name={"Insurance Company"}
                                    className="m-b-5"
                                    dynamic_label={"Company Name"}
                                    name={data?.company_contact?.name}
                                    address1={data?.company_contact?.address1}
                                    address2={data?.company_contact?.address2}
                                    email={data?.company_contact?.email}
                                    phone_number={
                                      data?.company_contact?.phone_number
                                    }
                                    city={data?.company_contact?.city}
                                    state={data?.company_contact?.state}
                                    zip_code={data?.company_contact?.zip}
                                    fax_number={data?.company_contact?.fax}
                                    ext={data?.company_contact?.ext}
                                    onSelectObject={() =>
                                      handleEditModalShow("company")
                                    }
                                    buttonData={InsuranceButtons}
                                  />

                                  <ContactPanel
                                    panel_name={"Adjuster"}
                                    className="m-b-5"
                                    name={`${data?.adjuster?.first_name ? data?.adjuster?.first_name : ""} ${data?.adjuster?.last_name ? data?.adjuster?.last_name : ""}`}
                                    address1={data?.adjuster?.address1}
                                    address2={data?.adjuster?.address2}
                                    email={data?.adjuster?.email}
                                    phone_number={data?.adjuster?.phone_number}
                                    fax_number={data?.adjuster?.fax}
                                    city={data?.adjuster?.city}
                                    state={data?.adjuster?.state}
                                    zip_code={data?.adjuster?.zip}
                                    ext={data?.adjuster?.ext}
                                    onSelectObject={() =>
                                      handleEditModalShow("adjuster")
                                    }
                                    buttonData={InsuranceButtons}
                                  />
                                </div>
                                <div className="d-flex flex-xl-row flex-column">
                                  <ContactPanel
                                    panel_name={"Supervisor"}
                                    className="m-b-5"
                                    name={`${data?.supervisor?.first_name ? data?.supervisor?.first_name : ""} ${data?.supervisor?.last_name ? data?.supervisor?.last_name : ""}`}
                                    address1={data?.supervisor?.address1}
                                    address2={data?.supervisor?.address2}
                                    email={data?.supervisor?.email}
                                    city={data?.supervisor?.city}
                                    state={data?.supervisor?.state}
                                    zip_code={data?.supervisor?.zip}
                                    phone_number={
                                      data?.supervisor?.phone_number
                                    }
                                    fax_number={data?.supervisor?.fax}
                                    ext={data?.supervisor?.ext}
                                    onSelectObject={() =>
                                      handleEditModalShow("supervisor")
                                    }
                                    buttonData={InsuranceButtons}
                                  />

                                  <InformationPanel
                                    panel_name={"Claim Information"}
                                    className="m-b-5"
                                    data={[
                                      {
                                        label: "Type:",
                                        value: data?.insurance_type?.name,
                                      },
                                      {
                                        label: "Limits:",
                                        value: `$ ${formatWithCommas(data?.liabilityLimit)} / ${formatWithCommas(data?.liabilityLimitAll)} $`,
                                      },
                                      {
                                        label: "Policy:",
                                        value: data?.policy_number,
                                      },
                                      {
                                        label: "Claim:",
                                        value: data?.claim_number,
                                      },
                                      {
                                        label: "Date:",
                                        value: formatDateForPanelDisplay(
                                          data?.Dateconfirmedactive
                                        ),
                                      },
                                    ]}
                                    onSelectReport={() =>
                                      handleEditModalShow("claim")
                                    }
                                  />
                                </div>
                              </div>
                              <NotesPanel
                                record_id={data.id}
                                instanceFor="Defendants" //to show height with respect to defendants page
                                module={"Insurance"}
                              />
                            </div> */}
                            <div className="row documents-wrapper">
                              <div className="col-12">
                                <div className="height-25">
                                  <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                                    &nbsp;Document Row
                                  </h4>
                                </div>
                                <DocumentRow
                                  clientProvider={data}
                                  page="Insurance"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {/* Counsel */}
                    {object?.opposingcounsel &&
                      object.opposingcounsel.map((data, index) => {
                        const counselZIndex = zIndexCounter--;
                        return (
                          <CounselMain
                            key={index}
                            counselZIndex={counselZIndex}
                            opposingcounsel={data}
                            counselTypes={counselTypes}
                            entity_name={"Defendant"}
                            For_instance_name={
                              object.defendantType_name === "Private Individual"
                                ? `${object?.first_name || ""} ${object?.last_name || ""}`
                                : object?.entity_name || ""
                            }
                            handleFacthDefendants={handleFacthDefendants}
                            setForDeleteCounselId={setForDeleteCounselId}
                            showDeleteCounselConfirm={
                              setShowDeleteCounselConfirm
                            }
                          />
                        );
                      })}
                  </div>
                );
              })}

            <NotesSectionDashboard />
          </div>
          {selectedDefendat && (
            <EditDefendant
              show={true}
              handleClose={handleCloseFucton}
              object={selectedDefendat}
              defendantsLength={defendantsLength}
              onFetchDefendent={handleFacthDefendants}
              onShowDeleteConfirmPopup={showDeleteConfirmPopup}
              activeTab={selectedEditableTabPanel.current}
              setReducer={setReducer}
              reducerValue={reducerValue}
              handleGenrateDocument={handleGenrateDocument}
            />
          )}
          {showDeleteConfirm && (
            <ConfirmDeletePopup
              entity="Defendants"
              handleClose={hideDeleteConfirmPopup}
              handleDeleteSubmission={handleDeleteDefendantsSubmission}
            />
          )}
        </div>
        <Footer />
        {insuranceModalShow && (
          <InsuranceModal
            states={modalData?.states}
            insuranceTypes={modalData?.insurance_types}
            insurance={editInsuranceModal}
            litigation={modalData?.litigation}
            show={insuranceModalShow}
            handleInsuranceCreation={handleFacthDefendants}
            handleClose={() => setInsuranceModalShow(false)}
            activeTab={activeInsuranceTab}
            deleteInsuranceHandler={deleteInsuranceHandler}
            InsuranceButtons={InsuranceButtons}
          />
        )}

        <AddDefendant
          show={show}
          handleClose={handleNewDefendantShow}
          defendantsLength={defendantsLength}
          onFetchDefendants={handleFacthDefendants}
          // setReducer = {setReducer}
        />

        {addInsuranceModalShow && (
          <AddDefendantInsuranceModal
            show={addInsuranceModalShow}
            handleClose={() => setAddInsuranceModalShow(false)}
            handleInsuranceSubmit={handleFacthDefendants}
            client={modalData?.client}
            otherParties={modalData?.other_parties}
            defendants={defendants}
            insuranceTypes={modalData?.insurance_types}
            states={modalData?.states}
            litigation={modalData?.litigation}
            currentDefendantId={currentDefendantId}
            setReducer={setReducer}
            reducerValue={reducerValue}
          />
        )}

        {showDeleteInsuranceModal && (
          <ConfirmDeletePopup
            entity="Insurance"
            handleClose={() => setShowDeleteInsuranceModal(false)}
            handleDeleteSubmission={handleDelete}
          />
        )}

        {counselAddModalShow && (
          <AddCounsel
            defendants={defendants}
            states={modalData?.states}
            handleFacthDefendants={handleFacthDefendants}
            handleClose={() => setAddCounselModalShow(false)}
            currentDefendantId={currentDefendantId}
          />
        )}

        {showDeleteCounselConfirm && (
          <ConfirmDeletePopup
            entity="Counsel"
            handleClose={() => {
              setShowDeleteCounselConfirm(false);
            }}
            handleDeleteSubmission={handleDeleteCounselSubmission}
          />
        )}

        {showDocument && (
          <GenrateDocument
            show={true}
            handleClose={() => setShowDocument(false)}
            PageEntity="Defendants"
            dropdownName={dropdownName}
            instanceId={instanceIdForGenrateDoc}
          />
        )}
      </div>
      <CommonFooter />
    </>
  );
}

export default DefendantPage;
