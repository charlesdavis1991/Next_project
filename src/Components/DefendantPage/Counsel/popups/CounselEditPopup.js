import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Nav, Form, Col, Row, Tab } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId, getToken } from "../../../../Utils/helper";
import api from "../../../../api/api";
import axios from "axios";
import GenericTabs from "../../../common/GenericTab";
import ContactPanel from "../../../common/ContactPanel";
import SelectStateModal from "../../../TreatmentPage/modals/state-modal/SelectStateModal";

function CounselEditPopup({
  show,
  handleClose,
  activeTab,
  opposingcounsel,
  counselTypes,
  handleFacthDefendants,
  onShowDeleteConfirmPopup,
  CounselButtons
}) {
  const currentCaseId = getCaseId();
  const clientId = getClientId();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [counselTab,setCounselTab] = useState(activeTab);
  const handleTabChange = (tab) => setCounselTab(tab);
  const tabsData =[
    {   
      id: "counsel", 
      label: "Counsel", 
      onClick: () => handleTabChange("counsel"),
      className: counselTab === "counsel" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: counselTab === "counsel" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
        id: "attorney", 
        label: "Attorney", 
        onClick: () => handleTabChange("attorney"),
        className: counselTab === "attorney" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: counselTab === "attorney" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
      id: "information", 
      label: "Information", 
      onClick: () => handleTabChange("information"),
      className: counselTab === "information" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: counselTab === "information" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    }
  ];

  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();

  const [searchResults, setSearchResults] = useState([]); // counsel's filters
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFilteresOpen, setIsFiltersOpen] = useState(false);

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

  const fecthCounselFilter = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/general/search_filter_counsel/`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        setSearchResults(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSatesData();
    fecthCounselFilter();
  }, []);

  //   Formting phone number an fax number
  const formatNumber = (inputVal) => {
    if (!inputVal) return inputVal;

    inputVal = inputVal.replace(/\D/g, "");
    inputVal =
      "(" +
      inputVal.substring(0, 3) +
      ") " +
      inputVal.substring(3, 6) +
      "-" +
      inputVal.substring(6, 10);
    // Update input value
    return inputVal;
  };

  const handleInputFirmChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2) {
      const filtered = searchResults?.firms?.filter((result) => {
        const office_name = result.office_name
          ? result.office_name.toLowerCase()
          : "";
          const first_name = result.first_name
          ? result.first_name.toLowerCase()
          : "";
        const last_name = result.last_name
          ? result.last_name.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
          office_name.startsWith(inputValue) ||
          first_name.startsWith(inputValue) ||
          last_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(!isFilteresOpen);
    } else {
      setFilteredResults([]);
    }
  };

  const handleCounselChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2) {
      const filtered = searchResults?.attorneys?.filter((result) => {
        const first_name = result.first_name
          ? result.first_name.toLowerCase()
          : "";
        const last_name = result.last_name
          ? result.last_name.toLowerCase()
          : "";
        const firm_name = result.firm_name
          ? result.firm_name.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
          firm_name.startsWith(inputValue) ||
          first_name.startsWith(inputValue) ||
          last_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(!isFilteresOpen);
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelectedForCounsel = (instance) => {

    setValue("counsel_name", instance?.office_name);
    setValue("counsel_address1", instance.address1 || "");
    setValue("counsel_address2", instance.address2 || "");
    setValue("counsel_city", instance.city || "");
    setValue("counsel_state", instance.state || "");
    setValue("counsel_zip", instance.zip || "");
    setValue("counsel_phone", formatNumber(instance.phone) || "");
    setValue("counsel_extension", instance.extension || "");
    setValue("counsel_fax", formatNumber(instance.fax) || "");
    setValue("counsel_email", instance.email || "");
    setValue("counsel_website", instance.website || "");
  };

  const handleSelectedForAttorney = (instance) => {
    setValue("attorney_name", `${instance.first_name || ''} ${instance.middle_name || ''} ${instance.last_name || ''}`.trim());
    setValue("attorney_address1", instance.address1 || "");
    setValue("attorney_address2", instance.address2 || "");
    setValue("attorney_city", instance.city || "");
    setValue("attorney_state", instance.state || "");
    setValue("attorney_zip", instance.zip || "");
    setValue("attorney_phone", formatNumber(instance.phone) || "");
    setValue("attorney_extension", instance.extension || "");
    setValue("attorney_fax", formatNumber(instance.fax) || "");
    setValue("attorney_email", instance.email || "");
    setValue("attorney_website", instance.website || "");

  };

  useEffect(() => {
    console.log("Results = ", opposingcounsel);
    // Counsel
    setValue(
      "counsel_name",
      opposingcounsel?.opposingcounselcontact?.name || ""
    );
    setValue(
      "counsel_address1",
      opposingcounsel?.opposingcounselcontact?.address1 || ""
    );
    setValue(
      "counsel_address2",
      opposingcounsel?.opposingcounselcontact?.address2 || ""
    );
    setValue(
      "counsel_city",
      opposingcounsel?.opposingcounselcontact?.city || ""
    );
    setValue(
      "counsel_state",
      opposingcounsel?.opposingcounselcontact?.state || ""
    );
    setValue("counsel_zip", opposingcounsel?.opposingcounselcontact?.zip || "");
    setValue(
      "counsel_phone",
      opposingcounsel?.opposingcounselcontact?.phone_number || ""
    );
    setValue(
      "counsel_email",
      opposingcounsel?.opposingcounselcontact?.email || ""
    );
    setValue("counsel_fax", opposingcounsel?.opposingcounselcontact?.fax || "");

    // Attorney
    setValue("attorney_name", opposingcounsel?.opposingattorney?.name || "");
    setValue(
      "attorney_address1",
      opposingcounsel?.opposingattorney?.address1 || ""
    );
    setValue(
      "attorney_address2",
      opposingcounsel?.opposingattorney?.address2 || ""
    );
    setValue("attorney_city", opposingcounsel?.opposingattorney?.city || "");
    setValue("attorney_state", opposingcounsel?.opposingattorney?.state || "");
    setValue("attorney_zip", opposingcounsel?.opposingattorney?.zip || "");
    setValue(
      "attorney_phone",
      opposingcounsel?.opposingattorney?.phone_number || ""
    );
    setValue("attorney_email", opposingcounsel?.opposingattorney?.email || "");
    setValue("attorney_fax", opposingcounsel?.opposingattorney?.fax || "");

    // information
    setValue("file_number", opposingcounsel?.file_number);
    setValue("counsel_type_id", opposingcounsel?.counsel_type?.id);
  }, []);

  function handleChange(event, inputType) {
    let formattedValue = formatNumber(event.target.value);
    setValue(`${inputType}`, formattedValue);
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${origin}/api/defendants/edit_opposing_counsel/${opposingcounsel?.id}/`,
        data,
        {
          headers: {
            "Content-Type": " application/json",
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        handleFacthDefendants();
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleClose();
    }
  };

  const SelectedCounselState = watch("counsel_state");
  const SelectedAttorneyState = watch("attorney_state");

  const [stateShow, setStateShow] = useState(false);
  const handleStateShow = () => setStateShow(!stateShow);
  
  const [counselState, setCounselState] = useState(opposingcounsel?.opposingcounselcontact?.state || "");
  const [attorneyState, setAttorneyState] = useState(opposingcounsel?.opposingattorney?.state || "");

  const handleStateChange = (state) => {
    if(defendantTab ==="counsel"){
      setValue("counsel_state",state.StateAbr);
      setCounselState(state.StateAbr);
    }
    else if(defendantTab === "attorney"){
      setValue("attorney_state",state.StateAbr);
      setAttorneyState(state.StateAbr);
    }
  };

  useEffect(() => {
    register("counsel_type_id");
  }, [register]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="insurance-modal-dialog modal-dialog-centered modal-800p"
      >
      <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Counsel</div></div>
        <Modal.Body className="panel-popups-body" style={{padding:"5px"}}>
          <div className="custom-tab defendant-modal-content">
            <GenericTabs tabsData={tabsData} height={25} currentTab={counselTab} popupTabs={true} />
            <Form
              id="insurance_contacts_form"
              onSubmit={handleSubmit(onSubmit)}>
              <div className="custom-margin-top" style={{height:"236px"}}>
                <div>
                    { counselTab === "counsel" && 
                      <>
                        <Row className="custom-margin-bottom mx-0">
                          <Col md={12} className="p-l-0 p-r-0">
                            <input
                              type="text"
                              className="form-control rounded-0 height-25"
                              placeholder="Type Counsel Name or Firm Name to add from library"
                              onChange={handleInputFirmChange}
                            />

                            {Array.isArray(filteredResults) &&
                              filteredResults.length > 0 && (
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${isFilteresOpen ? "block" : "hidden"}`}
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
                                      ?.slice(0, 9)
                                      ?.map((result, index) => {
                                        const fullAddress = [
                                          (result?.office_name) ? `${result.office_name}` : '',
                                          result?.first_name,
                                          result?.last_name,
                                          result?.address1,
                                          result?.address2,
                                          result?.city,
                                          result?.state,
                                          result?.zip,
                                          result?.phone,
                                          result?.website,
                                        ].filter(Boolean).join(', ') + (result?.zip ? '' : '');
                                      return  <div
                                          key={index}
                                          onClick={() => {
                                            handleSelectedForCounsel(result);
                                            setIsFiltersOpen(!isFilteresOpen);
                                          }}
                                          style={{
                                            padding: "5px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                          {fullAddress}
                                        </div>
                                    })}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className="mx-0">
                          <div>
                            <ContactPanel
                              name={watch("counsel_name")}
                              panel_name={"Opposing Counsel"}
                              pageName="Defendants"
                              className="m-b-5"
                              dynamic_label={"Opposing Counsel Name"}
                              phone_number={watch("counsel_phone")}
                              fax_number={watch("counsel_fax")}
                              email={watch("counsel_email")}
                              address1={watch("counsel_address1")}
                              address2={watch("counsel_address2")}
                              city={watch("counsel_city")}
                              state={watch("counsel_state")}
                              zip_code={watch("counsel_zip")}
                              ext={watch("counsel_extension")}
                              buttonData={CounselButtons}
                            />
                          </div>
                          <Col md={"auto"} className="p-0 d-flex-1">
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Name:
                              </span>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="Enter name"
                                  {...register("counsel_name")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Address 1, 2:
                              </span>
                              <div className="d-flex-1 p-r-5">
                                <Form.Control
                                  type="text"
                                  placeholder="Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("counsel_address1")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("counsel_address2")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                City, State, Zip:
                              </span>
                              <div className="d-flex-1 p-l-0 p-r-5">
                                <Form.Control
                                  type="text"
                                  placeholder="Enter City"
                                  className="form-control rounded-0 height-25"
                                  {...register("counsel_city")}
                                />
                              </div>
                              <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                  <div
                                    className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                    onClick={handleStateShow}>
                                    <span id="selectedOption">
                                      {counselState ? (
                                        <div className="d-flex align-items-center">
                                          <svg
                                            style={{
                                              width: "15px",
                                              height: "15px",
                                              fill: "var(--primary-80)",
                                              color: "var(--primary-80)",
                                              stroke: "var(--primary-80)",
                                            }}
                                            className={`icon icon-state-${counselState}`}
                                          >
                                            <use xlinkHref={`#icon-state-${counselState}`}></use>
                                          </svg>
                                          {counselState}
                                        </div>
                                      ) : (
                                        "Select State"
                                      )}
                                    </span>
                                  </div>
                                </div>  
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Zip"
                                  className="form-control rounded-0 height-25"
                                  {...register("counsel_zip")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Phone, Ext:
                              </span>
                              <div className="d-flex-1 p-r-5 p-l-0">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="(###) ###-####"
                                  onKeyUp={(e) => handleChange(e, "counsel_phone")}
                                  {...register("counsel_phone")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="number"
                                  className="form-control rounded-0 height-25"
                                  placeholder="Extension"
                                  {...register("counsel_extension")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Fax:
                              </span>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="(###) ###-####"
                                  onKeyUp={(e) => handleChange(e, "counsel_fax")}
                                  {...register("counsel_fax")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Email:
                              </span>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="Enter Email"
                                  {...register("counsel_email")}
                                />
                              </div>
                            </Row>  
                          </Col>
                        </Row>
                      
                      </>
                    }
                    { counselTab === "attorney" && 
                      <>
                        <Row className="custom-margin-bottom mx-0">
                          <Col md={12} className="p-l-0 p-r-0">
                            <input
                              placeholder="Type Counsel Name or Firm Name to add from library"
                              id="12"
                              type="text"
                              className="form-control rounded-0 height-25"
                              onChange={handleCounselChange}
                            />
                            {Array.isArray(filteredResults) &&
                              filteredResults.length > 0 && (
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${isFilteresOpen ? "block" : "hidden"}`}
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "#fff",
                                      border: "1px solid #ccc",
                                      width: "100%",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults
                                      .slice(0, 9)
                                      ?.map((result, index) => {
                                        const fullAddress = [
                                          result?.firm_name,
                                          (result?.first_name || result?.last_name) ? `${result.first_name} ${result.last_name}` : '',
                                          result?.address1,
                                          result?.address2,
                                          result?.city,
                                          result?.state,
                                          result?.zip,
                                        ].filter(Boolean).join(', ') + (result?.zip ? '' : ''); 
                                        
                                        return <div
                                          key={index}
                                          onClick={() => {
                                            handleSelectedForAttorney(result);
                                            setIsFiltersOpen(!isFilteresOpen);
                                          }}
                                          style={{
                                            padding: "5px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #ddd",
                                          }}
                                        >
                                        {fullAddress}
                                        </div>
                                      })}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className="mx-0">
                          <div>
                            <ContactPanel
                              name={watch("attorney_name")}
                              panel_name={"Opposing Attorney"}
                              pageName="Defendants"
                              className="m-b-5"
                              dynamic_label={"Opposing Counsel Name"}
                              phone_number={watch("attorney_phone")}
                              fax_number={watch("attorney_fax")}
                              email={watch("attorney_email")}
                              address1={watch("attorney_address1")}
                              address2={watch("attorney_address2")}
                              city={watch("attorney_city")}
                              state={watch("attorney_state")}
                              zip_code={watch("attorney_zip")}
                              ext={watch("attorney_extension")}
                              buttonData={CounselButtons}
                            />
                          </div>
                        
                          <Col md={"auto"} className="p-0 d-flex-1">
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Name:
                              </span>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="Enter name"
                                  {...register("attorney_name")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Address 1, 2:
                              </span>
                              <div className="d-flex-1 p-r-5">
                                <Form.Control
                                  type="text"
                                  placeholder="Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("attorney_address1")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("attorney_address2")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                City, State, Zip:
                              </span>
                              <div className="d-flex-1 p-l-0 p-r-5">
                                <Form.Control
                                  type="text"
                                  placeholder="Enter City"
                                  className="form-control rounded-0 height-25"
                                  {...register("attorney_city")}
                                />
                              </div>
                              <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                <div
                                  className="dropdown-button rounded-0 p-0 p-l-5 form-control  height-25 d-flex align-items-center"
                                  onClick={handleStateShow}>
                                  <span id="selectedOption">
                                    {attorneyState ? (
                                      <div className="d-flex align-items-center">
                                        <svg
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                            fill: "var(--primary-80)",
                                            color: "var(--primary-80)",
                                            stroke: "var(--primary-80)",
                                          }}
                                          className={`icon icon-state-${attorneyState}`}
                                        >
                                          <use xlinkHref={`#icon-state-${attorneyState}`}></use>
                                        </svg>
                                        {attorneyState}
                                      </div>
                                    ) : (
                                      "Select State"
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Zip"
                                  className="form-control rounded-0 height-25 "
                                  {...register("attorney_zip")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Phone, Ext:
                              </span>
                              <div className="d-flex-1 p-r-5 p-l-0">
                                <Form.Control
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "attorney_phone")}
                                  {...register("attorney_phone")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="number"
                                  className="form-control rounded-0 height-25"
                                  placeholder="Extension"
                                  {...register("attorney_extension")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Fax:
                              </span>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="(###) ###-####"
                                  onKeyUp={(e) => handleChange(e, "attorney_fax")}
                                  {...register("attorney_fax")}
                                />
                              </div>
                            </Row>
                            <Row className="custom-margin-bottom mx-0">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                                Email:
                              </span>
                              <div className="d-flex-1">
                                <Form.Control
                                  type="text"
                                  className="form-control rounded-0 height-25"
                                  placeholder="Enter Email"
                                  {...register("attorney_email")}
                                />
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    }
                    { counselTab === "information" && 
                      <>
                        <Row className="custom-margin-bottom mx-0 position-relative">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                            Counsel Type:
                          </span>
                          <div className="d-flex-1 custom-select-new-entity">
                            <Form.Control
                                as="select"
                                value={watch("counsel_type_id") || ""}
                                onChange={(e) => setValue("counsel_type_id", e.target.value)}
                                className={`custom-margin-bottom height-25 p-0 p-l-5 rounded-0 mb-0 ${errors.counsel_type_id && "is-invalid"}`}
                              >
                              <option value="" disabled>
                                Select Counsel Type
                              </option>
                              {counselTypes &&
                                counselTypes.map((counsel) => (
                                  <option key={counsel.id} value={counsel.id}>
                                    {counsel.name}
                                  </option>
                                ))}
                            </Form.Control>
                            {/* <Form.Control
                              as="select"
                              className="form-control rounded-0 height-25"
                              {...register("counsel_type_id")}
                            >
                              <option value={""}>---------</option>
                              {counselTypes &&
                                counselTypes?.map((counselType) => (
                                  <option
                                    key={counselType.id}
                                    value={counselType.id}
                                  >
                                    {counselType.name}
                                  </option>
                                ))}
                            </Form.Control> */}
                          </div>
                        </Row>
                        <Row className="custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 counsel-input-label">
                            File Number:
                          </span>
                          <div className="d-flex-1">
                            <Form.Control
                              type="text"
                              className="form-control rounded-0 height-25"
                              placeholder="Enter File Number"
                              {...register("file_number")}
                            />
                          </div>
                        </Row>
                      </>
                    }
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between align-items-center p-b-5 p-r-5 p-l-5">
          {/* <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button> */}
          <Button variant="danger" className="height-25" style={{padding:"0px 12px"}} onClick={() => onShowDeleteConfirmPopup()}>
            Delete
          </Button>
          <Button
            form="insurance_contacts_form"
            type="submit"
            variant="success" className="m-l-5 btn-success height-25" style={{padding:"0px 12px"}}
          >
            Save and Close
          </Button>
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
    </>
  );
}

export default CounselEditPopup;
