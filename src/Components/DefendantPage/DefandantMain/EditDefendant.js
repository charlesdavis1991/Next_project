import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import {
  formatDateForModalFields,
  formatDateForSubmission,
  getToken,
} from "../../../Utils/helper";
import axios from "axios";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import GenericTabs from "../../common/GenericTab";
import ContactPanel from "../../common/ContactPanel";
import SelectStateModal from "../../TreatmentPage/modals/state-modal/SelectStateModal";

// RK:07-09-2024 :: 2:40 am
function EditDefendant({
  object,
  handleClose,
  onFetchDefendent,
  show,
  activeTab,
  onShowDeleteConfirmPopup,
  defendantsLength,
  setReducer,
  reducerValue,
  handleGenrateDocument
}) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();

  const methods = useForm();
  const { reset, handleSubmit, register, watch, setValue } = methods;

  const [searchResults, setSearchResults] = useState([]); // defendants's Directries
  const [filteredResults, setFilteredResults] = useState([]); //filteredDefendats
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { isPanelChecklistUpdated, setIsPanelChecklistUpdated } =
    useContext(ClientDataContext);

  const [defendantTab,setDefendantTab] = useState(activeTab);
  const handleTabChange = (tab) => setDefendantTab(tab);
  const tabsData =[
    {   
      id: "defendant", 
      label: object?.defendantType_name === "Private Individual"
        ? "Contact Information"
        : object?.defendantType_name === "Commercial Company"
          ? "Company Information"
          : object?.defendantType_name === "Public Entity"
            ? "Public Entity"
            : "Defendant", 
      onClick: () => handleTabChange("defendant"),
      className: defendantTab === "defendant" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: defendantTab === "defendant" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
        id: "employment", 
        label: object?.defendantType_name === "Private Individual"
        ? "Employer"
        : object?.defendantType_name === "Commercial Company"
          ? "Agent For Service"
          : object?.defendantType_name === "Public Entity"
            ? "Claims of Department"
            : "Employer", 
        onClick: () => handleTabChange("employment"),
        className: defendantTab === "employment" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: defendantTab === "employment" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
      id: "information", 
      label: "Information", 
      onClick: () => handleTabChange("information"),
      className: defendantTab === "information" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: defendantTab === "information" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
      id: "process-server", 
      label: "Process Server", 
      onClick: () => handleTabChange("process-server"),
      className: defendantTab === "process-server" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: defendantTab === "process-server" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    }
  ];

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults.filter((result) => {
        const name = result.name ? result.name.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zipcodes_list ? result.state.toLowerCase() : "";

        return (
          name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setFilteredResults([]);
    }
  };

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFilterProcessDirectoriesData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/defendants/search_filter_process_server_directories/`
      );
      if (response.status === 200) {
        console.log(response.data);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFilterProcessDirectoriesData();
    fetchSatesData();
  }, [origin]);

  const handleSelectedDirectoryForProcessServer = (directory) => {
    setValue("process_server_name", directory.name || "");
    setValue("process_server_address1", directory.address1 || "");
    setValue("process_server_address2", directory.address2 || "");
    setValue("process_server_city", directory.city || "");
    setValue("process_server_state", directory.state || "");
    setValue("process_server_zip", directory.zip || "");
    setValue("process_server_phone", formatNumber(directory.phone) || "");
    setValue("process_server_extension", directory.extension || "");
    setValue("process_server_fax", formatNumber(directory.fax) || "");
    setValue("process_server_email", directory.email || "");
    // Optionally handle additional state or logic here if needed
  };

  const formatNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleProcessPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("process_phone", formattedValue, { shouldValidate: true });
  };

  const handleProcessFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("process_fax", formattedValue, { shouldValidate: true });
  };

  const handleWorkPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("work_phone", formattedValue, { shouldValidate: true });
  };

  const handleWorkFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("work_fax", formattedValue, { shouldValidate: true });
  };

  const handleHomePhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("home_phone", formattedValue, { shouldValidate: true });
  };

  const handleHomeFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("home_fax", formattedValue, { shouldValidate: true });
  };

  const workPhoneValue = watch("work_phone");
  const workFaxValue = watch("work_fax");

  const processPhoneValue = watch("process_server_phone");
  const processFaxValue = watch("process_server_fax");

  const homePhoneValue = watch("home_phone");
  const homeFaxValue = watch("home_fax");

  useEffect(() => {
    if (object) {
      console.log(object);
      const { work_contact, home_contact } = object;
      const process_server = object?.process_server?.contact_id;

      reset({
        // Fields for work_ prefix from work_contact
        defendant_employer: object?.defendant_employer || "",
        work_address1: work_contact?.address1 || "",
        work_address2: work_contact?.address2 || "",
        work_city: work_contact?.city || "",
        work_state: work_contact?.state || "",
        work_zip: work_contact?.zip || "",
        work_phone: formatNumber(work_contact?.phone_number) || "",
        work_extension: work_contact?.phone_ext || "",
        work_fax: formatNumber(work_contact?.fax) || "",
        work_email: work_contact?.email || "",
        work_name: work_contact?.name || "",

        first_name: object?.first_name || "",
        last_name: object?.last_name || "",
        home_address1: home_contact?.address1 || "",
        home_address2: home_contact?.address2 || "",
        home_city: home_contact?.city || "",
        home_state: home_contact?.state || "",
        home_zip: home_contact?.zip || "",
        home_phone: formatNumber(home_contact?.phone_number) || "",
        home_extension: home_contact?.phone_ext || "",
        home_fax: formatNumber(home_contact?.fax) || "",
        home_email: home_contact?.email || "",

        process_server_name: process_server?.name || "",
        process_server_address1: process_server?.address1 || "",
        process_server_address2: process_server?.address2 || "",
        process_server_city: process_server?.city || "",
        process_server_state: process_server?.state || "",
        process_server_zip: process_server?.zip || "",
        process_server_phone: formatNumber(process_server?.phone_number) || "",
        process_server_extension: process_server?.phone_ext || "",
        process_server_fax: formatNumber(process_server?.fax) || "",
        process_server_email: process_server?.email || "",

        // Other fields

        dummy: object?.dummy,
        entity_name: object?.entity_name || "",
        liability_estimate: object?.liability_estimate || "",
        liability_percent: object?.liability_percent || "",
        type: object?.defendantType_name || "",
        gender: object?.gender || "",
        birthday: formatDateForModalFields(object?.birthday) || "",
        repr_letter_sent:
          formatDateForModalFields(object?.repr_letter_sent) || "",
        contact_date: formatDateForModalFields(object?.contact_date) || "",
        defServedDate: formatDateForModalFields(object?.defServedDate) || "",
      });
    }
  }, [object, reset]);

  const [stateShow, setStateShow] = useState(false);
  const handleStateShow = () => setStateShow(!stateShow);
  
  const [homeState, setHomeState] = useState(object?.home_contact?.state || "");
  const [workState, setWorkState] = useState(object?.work_contact?.state || "");
  const [processServerState, setProcessServerState] = useState(object?.process_server?.state || "");


  const handleStateChange = (state) => {
    if(defendantTab ==="defendant"){
      setValue("home_state",state.StateAbr);
      setHomeState(state.StateAbr);
    }
    else if(defendantTab === "employment"){
      setValue("work_state",state.StateAbr);
      setWorkState(state.StateAbr);
    }
    else if(defendantTab === "process-server"){
      setValue("process_server_state",state.StateAbr);
      setProcessServerState(state.StateAbr);
    }
  };

  const postDataforUpdateDefendant = async (data) => {
    try {
      const response = await axios.put(
        `${origin}/api/defendants/defendant_edit/${object.id}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
        }
      );
      onFetchDefendent();
      setIsPanelChecklistUpdated(!isPanelChecklistUpdated);
      setReducer(reducerValue);
      if (response.status === 200) {
        handleClose();
        // handleClose();
        // onFetchDefendent();
        // setIsPanelChecklistUpdated(true)
        // setReducer(reducerValue)
      }
    } catch (error) {
      handleClose();
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    const cleanedData = {
      ...data,
      repr_letter_sent: data.repr_letter_sent
        ? formatDateForSubmission(data.repr_letter_sent)
        : null,
      contact_date: data.contact_date
        ? formatDateForSubmission(data.contact_date)
        : null,
      defServedDate: data.defServedDate
        ? formatDateForSubmission(data.defServedDate)
        : null,
      birthday: data.birthday ? formatDateForSubmission(data.birthday) : null,
      liability_estimate: data?.liability_estimate || 0,
      liability_percent: data?.liability_percent || 0,
    };
    postDataforUpdateDefendant(cleanedData);
  };

  const DefendantButtonsConfig = [
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
      onClick: handleGenrateDocument,
    },
  ];

  const EmploymentButtonsConfig = [
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

  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="insurance-modal-dialog modal-dialog-centered modal-800p"
      >
        <div>
          <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Defendant</div></div>
          <Modal.Body style={{padding:"5px"}}>
            <div className="custom-tab defendant-modal-content">
              <GenericTabs tabsData={tabsData} height={25} currentTab={defendantTab} popupTabs={true} />
              <div>
                <Form
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  
                >
                  <div className="custom-margin-top" style={{height:"236px"}}>
                    { defendantTab === "defendant" && 
                      <>
                      <Row className="mx-0">
                        <div>
                          <ContactPanel
                              id={object?.id}
                              pageName="Defendants"
                              name={
                                object?.defendantType_name === "Private Individual"
                                  ? `${watch("first_name") || ""}  ${watch("last_name") || ""}`
                                  : watch("entity_name") || ""
                              }
                              dynamic_label={
                                object?.defendantType_name !== "Private Individual"
                                  ? "Entity Name"
                                  : ""
                              }
                              panel_name={
                                object?.defendantType_name == "Private Individual"
                                  ? "Contact Information"
                                  : object?.defendantType_name === "Commercial Company"
                                    ? "Company Information"
                                    : object?.defendantType_name === "Public Entity"
                                      ? "Public Entity"
                                      : "Defendant"
                              }
                              className=""
                              phone_number={watch("home_phone")}
                              fax_number={watch("home_fax")}
                              email={watch("home_email")}
                              address1={watch("home_address1")}
                              address2={watch("home_address2")}
                              city={watch("home_city")}
                              state={watch("home_state")}
                              zip_code={watch("home_zip")}
                              ext={watch("home_extension")}
                              buttonData={DefendantButtonsConfig}
                              genrate_doc_address={"Defendant Address"}
                            />
                        </div>
                        <Col md={"auto"} className="p-0 d-flex-1">
                          <Row className="align-items-center custom-margin-bottom mx-0">
                            <Col md={12} className="p-0">
                              {object?.defendantType_name ===
                              "Private Individual" ? (
                                <>
                                  <div className="row mx-0 align-items-center custom-margin-bottom">
                                      <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                        First, Last Name:
                                      </span>
                                    <div className="d-flex-1 p-r-5">
                                      <input
                                        type="text"
                                        placeholder="Enter First Name"
                                        className="form-control rounded-0 height-25"
                                        {...register("first_name")}
                                      />
                                    </div>
                                    <div className="d-flex-1">
                                      <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className="form-control rounded-0 height-25"
                                        {...register("last_name")}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Entity Name:
                                  </span>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="Enter Entity Name"
                                      className="form-control rounded-0 height-25"
                                      {...register("entity_name")}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className="row mx-0 align-items-center custom-margin-bottom">
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                  Address 1, 2:
                                </span>
                                <div className="d-flex-1 p-r-5">
                                  <input
                                    type="text"
                                    placeholder="Enter Address 1"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_address1")}
                                  />
                                </div>
                                <div className="d-flex-1">
                                  <input
                                    type="text"
                                    placeholder="Enter Address 2"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_address2")}
                                  />
                                </div>
                              </div>

                              <div className="row mx-0 align-items-center custom-margin-bottom">
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                  City, State, Zip:
                                </span>
                                <div className="d-flex-1 p-l-0 p-r-5">
                                  <input
                                    type="text"
                                    placeholder="Enter city"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_city")}
                                  />
                                </div>
                                <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                  <div
                                    className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                    onClick={handleStateShow}>
                                    <span id="selectedOption">
                                      {homeState ? (
                                        <div className="d-flex align-items-center">
                                          <svg
                                            style={{
                                              width: "15px",
                                              height: "15px",
                                              fill: "var(--primary-80)",
                                              color: "var(--primary-80)",
                                              stroke: "var(--primary-80)",
                                            }}
                                            className={`icon icon-state-${homeState}`}
                                          >
                                            <use xlinkHref={`#icon-state-${homeState}`}></use>
                                          </svg>
                                          {homeState}
                                        </div>
                                      ) : (
                                        "Select State"
                                      )}
                                    </span>
                                  </div>
                                </div>                                
                                <div className="d-flex-1">
                                  <input
                                    type="text"
                                    placeholder="Zip"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_zip")}
                                  />
                                </div>
                              </div>

                              <div className="row mx-0 align-items-center custom-margin-bottom">
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                  Phone, Ext:
                                </span>
                                <div className="d-flex-1 p-r-5 p-l-0">
                                  <input
                                    type="text"
                                    placeholder="(###) ###-####"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_phone")}
                                    value={homePhoneValue || ""}
                                    onChange={handleHomePhoneInputChange}
                                  />
                                </div>
                                <div className="d-flex-1">
                                  <input
                                    type="text"
                                    placeholder="Extension"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_extension")}
                                  />
                                </div>
                              </div>

                              {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                                <div className="col-md-2 text-left">
                                  <span className="d-inline-block text-grey text-nowrap">
                                    Extension:
                                  </span>
                                </div>

                                <div className="col-md-10">
                                  <input
                                    type="text"
                                    placeholder="Extension"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_extension")}
                                  />
                                </div>
                              </div> */}

                              <div className="row mx-0 align-items-center custom-margin-bottom">
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                  Fax:
                                </span>
                                <div className="d-flex-1">
                                  <input
                                    type="text"
                                    placeholder="(###) ###-####"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_fax", {})}
                                    value={homeFaxValue || ""}
                                    onChange={handleHomeFaxInputChange}
                                  />
                                </div>
                              </div>

                              <div className="row mx-0 align-items-center custom-margin-bottom">
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                  Email:
                                </span>
                                <div className="d-flex-1">
                                  <input
                                    type="email"
                                    placeholder="Enter email"
                                    className="form-control rounded-0 height-25"
                                    {...register("home_email")}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      </>
                    }
                    { defendantTab === "employment" && 
                      <>
                        <Row className="mx-0">
                          <div>
                            <ContactPanel
                              pageName="Defendants"
                                id={object?.id}
                                name={watch("defendant_employer")}
                                panel_name={
                                  object?.defendantType_name == "Private Individual"
                                    ? "Employer"
                                    : object?.defendantType_name === "Commercial Company"
                                      ? "Agent For Service"
                                      : object?.defendantType_name === "Public Entity"
                                        ? "Claims Of Department"
                                        : "Employer"
                                }
                                className=""
                                phone_number={watch("work_phone")}
                                email={watch("work_email")}
                                address1={watch("work_address1")}
                                address2={watch("work_address2")}
                                city={watch("city")}
                                state={watch("work_state")}
                                zip_code={watch("work_zip")}
                                ext={watch("work_extension")}
                                fax_number={watch("work_fax")}
                                buttonData={EmploymentButtonsConfig}
                              />
                          </div>
                          <Col md={"auto"} className="p-0 d-flex-1">
                            <Row className="align-items-center custom-margin-bottom mx-0">
                              <Col md={12} className="p-0">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    {object?.defendantType_name ===
                                    "Private Individual"
                                      ? "Employer"
                                      : object?.defendantType_name ===
                                          "Commercial Company"
                                        ? "Agent For Service"
                                        : object?.defendantType_name ===
                                            "Public Entity"
                                          ? "Claims"
                                          : "Employer"}
                                  </span>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder={
                                        object?.defendantType_name ===
                                        "Private Individual"
                                          ? "Enter employer name"
                                          : object?.defendantType_name ===
                                              "Commercial Company"
                                            ? "Enter agent for service name"
                                            : object?.defendantType_name ===
                                                "Public Entity"
                                              ? "Enter claim department name"
                                              : "Enter employer name"
                                      }
                                      className="form-control height-25 rounded-0"
                                      {...register("defendant_employer")}
                                    />
                                  </div>
                                </div>

                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                      Address 1, 2:
                                    </span>
                                  <div className="d-flex-1 p-r-5">
                                    <input
                                      type="text"
                                      placeholder="Enter Address 1"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_address1")}
                                    />
                                  </div>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="Enter Address 2"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_address2")}
                                    />
                                  </div>
                                </div>

                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    City, State, Zip:
                                  </span>
                                  <div className="d-flex-1 p-l-0 p-r-5">
                                    <input
                                      type="text"
                                      placeholder="Enter city"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_city")}
                                    />
                                  </div>
                                  <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                      <div
                                        className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                        onClick={handleStateShow}>
                                        <span id="selectedOption">
                                          {workState ? (
                                            <div className="d-flex align-items-center">
                                              <svg
                                                style={{
                                                  width: "15px",
                                                  height: "15px",
                                                  fill: "var(--primary-80)",
                                                  color: "var(--primary-80)",
                                                  stroke: "var(--primary-80)",
                                                }}
                                                className={`icon icon-state-${workState}`}
                                              >
                                                <use xlinkHref={`#icon-state-${workState}`}></use>
                                              </svg>
                                              {workState}
                                            </div>
                                          ) : (
                                            "Select State"
                                          )}
                                        </span>
                                      </div>
                                  </div>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="Zip"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_zip")}
                                    />
                                  </div>
                                </div>

                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Phone, Ext:
                                  </span>

                                  <div className="d-flex-1 p-r-5 p-l-0">
                                    <input
                                      type="text"
                                      placeholder="(###) ###-####"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_phone")}
                                      value={workPhoneValue || ""}
                                      onChange={handleWorkPhoneInputChange}
                                    />
                                  </div>
                                  <div className="d-flex-1">
                                    <input
                                      type="number"
                                      placeholder="Extension"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_extension")}
                                    />
                                  </div>
                                </div>

                                {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <div className="col-md-2 text-left">
                                    <span className="d-inline-block text-grey text-nowrap">
                                      Extension:
                                    </span>
                                  </div>

                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      placeholder="Extension"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_extension")}
                                    />
                                  </div>
                                </div> */}

                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Fax:
                                  </span>

                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="(###) ###-####"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_fax", {})}
                                      value={workFaxValue || ""}
                                      onChange={handleWorkFaxInputChange}
                                    />
                                  </div>
                                </div>

                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Email:
                                  </span>
                                  <div className="d-flex-1">
                                    <input
                                      type="email"
                                      placeholder="Enter email"
                                      className="form-control height-25 rounded-0"
                                      {...register("work_email")}
                                    />
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </> 
                    }

                    { defendantTab === "process-server" && 
                      <>
                        <Row className="mx-0 custom-margin-bottom">
                          <Col md={12} className="p-l-0 p-r-0">
                            <input
                              type="text"
                              placeholder="Type process server information to search directory then click an entry"
                              className="form-control height-25 rounded-0"
                              name="reporting_agency_search_form"
                              onChange={handleInputChange}
                            />
                            {Array.isArray(filteredResults) &&
                              filteredResults.length > 0 && (
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${isFiltersOpen ? "block" : "hidden"}`}
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "#fff",
                                      border: "1px solid #ccc",
                                      width: "100%",
                                      // maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults
                                      .slice(0, 9)
                                      .map((result, index) => {
                                        const fullAddress =
                                          [
                                            result?.name
                                              ? `${result.name}`
                                              : "",
                                            result?.address1,
                                            result?.address2,
                                            result?.city,
                                            result?.state,
                                            result?.zip,
                                          ]
                                            .filter(Boolean)
                                            .join(", ") +
                                          (result?.zip ? "" : "");

                                        return (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              handleSelectedDirectoryForProcessServer(
                                                result
                                              );
                                              setIsFiltersOpen(false);
                                            }}
                                            style={{
                                              padding: "5px",
                                              cursor: "pointer",
                                              borderBottom: "1px solid #ddd",
                                            }}
                                          >
                                            {fullAddress}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className="mx-0">
                          <div>
                            <ContactPanel
                                id={object?.id}
                                pageName="Defendants"
                                className=""
                                name={watch("process_server_name")}
                                panel_name={"process-server"}
                                phone_number={watch("process_server_phone")}
                                email={watch("process_server_email")}
                                address1={watch("process_server_address1")}
                                address2={watch("process_server_address2")}
                                city={watch("process_server_city")}
                                state={watch("process_server_state")}
                                zip_code={watch("process_server_zip")}
                                ext={watch("process_server_extension")}
                                fax_number={watch("process_server_fax")}
                                buttonData={EmploymentButtonsConfig}
                              />
                          </div>
                        
                          <Col md={"auto"} className="p-0 d-flex-1">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Name:
                                  </span>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="Enter Employer Name"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_name")}
                                    />
                                  </div>
                                </div>
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Address 1, 2:
                                  </span>
                                  <div className="d-flex-1 p-r-5">
                                    <input
                                      type="text"
                                      placeholder="Enter Address 1"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_address1")}
                                    />
                                  </div>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="Enter Address 2"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_address2")}
                                    />
                                  </div>
                                </div>
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    City, State, Zip:
                                  </span>
                                  <div className="d-flex-1 p-l-0 p-r-5">
                                    <input
                                      type="text"
                                      placeholder="Enter city"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_city")}
                                    />
                                  </div>
                                  <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                    <div
                                      className="dropdown-button rounded-0 p-0 p-l-5 form-control  height-25 d-flex align-items-center"
                                      onClick={handleStateShow}>
                                      <span id="selectedOption">
                                        {processServerState ? (
                                          <div className="d-flex align-items-center">
                                            <svg
                                              style={{
                                                width: "15px",
                                                height: "15px",
                                                fill: "var(--primary-80)",
                                                color: "var(--primary-80)",
                                                stroke: "var(--primary-80)",
                                              }}
                                              className={`icon icon-state-${processServerState}`}
                                            >
                                              <use xlinkHref={`#icon-state-${processServerState}`}></use>
                                            </svg>
                                            {processServerState}
                                          </div>
                                        ) : (
                                          "Select State"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="Zip"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_zip")}
                                    />
                                  </div>
                                </div>
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Phone, Ext:
                                  </span>

                                  <div className="d-flex-1 p-r-5 p-l-0">
                                    <input
                                      type="text"
                                      placeholder="(###) ###-####"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_phone")}
                                      value={processPhoneValue || ""}
                                      onChange={handleProcessPhoneInputChange}
                                    />
                                  </div>
                                  <div className="d-flex-1">
                                    <input
                                      type="number"
                                      placeholder="Extension"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_extension")}
                                    />
                                  </div>
                                </div>
                                {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <div className="col-md-2 text-left">
                                    <span className="d-inline-block text-grey text-nowrap">
                                      Extension:
                                    </span>
                                  </div>

                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      placeholder="Extension"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_extension")}
                                    />
                                  </div>
                                </div> */}

                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Fax:
                                  </span>

                                  <div className="d-flex-1">
                                    <input
                                      type="text"
                                      placeholder="(###) ###-####"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_fax", {})}
                                      value={processFaxValue || ""}
                                      onChange={handleProcessFaxInputChange}
                                    />
                                  </div>
                                </div>
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                  <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                    Email:
                                  </span>

                                  <div className="d-flex-1">
                                    <input
                                      type="email"
                                      placeholder="Enter email"
                                      className="form-control height-25 rounded-0"
                                      {...register("process_server_email")}
                                    />
                                  </div>
                                </div>
                          </Col> 
                        </Row>                    
                      </> 
                    }
                    { defendantTab === "information" && 
                      <>
                        <Row className="mx-0">
                          {defendantsLength && defendantsLength === 1 && (
                            <Col
                              md={12}
                              className="d-flex align-items-center m-b-5"
                            >
                              <input
                                type="checkbox"
                                id="dummy_defendant"
                                {...register("dummy")}
                                style={{ marginRight: "5px" }}
                              />
                              <label className="mb-0">
                                {" "}
                                Defendant Unknown or Not Identified
                              </label>
                            </Col>
                          )}

                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                Type:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  disabled
                                  className="form-control height-25 rounded-0"
                                  {...register("type")}
                                />
                              </div>
                            </div>

                            {object?.defendantType_name ===
                              "Private Individual" && (
                              <div className="row mx-0 align-items-center custom-margin-bottom">
                                <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                  Birthday:
                                </span>
                                <div className="d-flex-1">
                                  <input
                                    type="date"
                                    placeholder=""
                                    className="form-control height-25 rounded-0"
                                    {...register("birthday")}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="row mx-0 align-items-center custom-margin-bottom position-relative">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">Gender:</span>
                              <div class="d-flex-1 custom-select-state-entity">
                                <Form.Control as="select"  className="form-control height-25 p-0 p-l-5 rounded-0"
                                  {...register("gender")}
                                  onChange={(e) => setValue("gender", e.target.value)}
                                >
                                <option  value="">-----------</option>
                                <option value={"Male"}>Male</option>
                                <option value={"Female"}>Female</option>
                                
                                </Form.Control>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                Liability Acc %:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="number"
                                  step="any"
                                  className="form-control height-25 rounded-0"
                                  {...register("liability_percent")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                Liability Est %:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="number"
                                  step="any"
                                  className="form-control height-25 rounded-0"
                                  {...register("liability_estimate")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                Rep Letter:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control height-25 rounded-0"
                                  {...register("repr_letter_sent")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                Contact:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control height-25 rounded-0"
                                  {...register("contact_date")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 defendant-input-label">
                                Served:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control height-25 rounded-0"
                                  {...register("defServedDate")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>                      
                      </> 
                    }
                  </div>
                  <div className="d-flex justify-content-between custom-margin-top">
                    <Button
                      variant="danger"
                      onClick={onShowDeleteConfirmPopup}
                      className="height-25" style={{padding:"0px 12px"}}
                    >
                      Delete
                    </Button>
                    <Button variant="success"  className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
                      Save and Close
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      {stateShow && (
        <SelectStateModal
          show={stateShow}
          handleClose={handleStateShow}
          onChange={handleStateChange}
          statesData={statesAbrs}
        />
      )}
    </FormProvider>
  );
}

export default EditDefendant;
