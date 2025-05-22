import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { getCaseId, getClientId, getToken } from "../../../Utils/helper";
import axios from "axios";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import GenericTabs from "../../common/GenericTab";
import SelectStateModal from "../../TreatmentPage/modals/state-modal/SelectStateModal";

// RK:07-11-2024 :: 10:40 pm
function AddDefendant({ show, handleClose, onFetchDefendants , defendantsLength }) {
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken()
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs

  const { reset, handleSubmit, register, watch, setValue } = useForm();

  const [defendantType, setDefendantType] = useState("Private Individual"); // to set defendat type based on active pannel

  const {isPanelChecklistUpdated, setIsPanelChecklistUpdated } = useContext(ClientDataContext);

  const [defendantTab,setDefendantTab] = useState("private_individual");
  const handleTabChange = (tab) => setDefendantTab(tab);
  const tabsData =[
    {   
      id: "private_individual", 
      label: "Private Individual", 
      onClick: () => handleTabChange("private_individual"),
      className: defendantTab === "private_individual" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: defendantTab === "private_individual" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
        id: "company_or_business", 
        label: "Company Or Business", 
        onClick: () => handleTabChange("company_or_business"),
        className: defendantTab === "company_or_business" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: defendantTab === "company_or_business" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
      id: "public_identity", 
      label: "Public Identity", 
      onClick: () => handleTabChange("public_identity"),
      className: defendantTab === "public_identity" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: defendantTab === "public_identity" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    }
  ];

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers:{
          Authorization:accessToken,
        }
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSatesData();
  }, []);

  const formatNumber = (inputVal) => {
    inputVal = inputVal.replace(/\D/g, "");
    // Insert formatting characters
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

  function handleChange(event, inputType) {
    let formattedValue = formatNumber(event.target.value);
    setValue(`${inputType}`, formattedValue);
  }

  const onSubmit = (data) => {
    const CleanedData = {
      ...data,
      defendant_type: defendantType,
    };
    console.log(CleanedData)
    const CreateDefendant = async () => {
      try {
        const response = await axios.post(
          `${origin}/api/defendants/add_defendant/${clientId}/${currentCaseId}/`,
          CleanedData , {
            headers: {
              'Content-Type': 'application/json',  
              Authorization: accessToken, 
            }
          }
        );
        if (response.status === 201) {
          handleClose();
          setDefendantType("Private Individual")
          onFetchDefendants();
          setIsPanelChecklistUpdated(true)
          reset()
        }
      } catch (error) {
        console.log(error);
      } 
    };

    CreateDefendant();
  };

  const [stateShow, setStateShow] = useState(false);
  const handleStateShow = () => setStateShow(!stateShow);
  
  const [PIState, setPIState] = useState("");
  const [CBState, setCBState] = useState("");
  const [PEState, setPEState] = useState("");

  const handleStateChange = (state) => {
    if(defendantTab ==="private_individual"){
      setValue("PI_state",state.StateAbr);
      setPIState(state.StateAbr);
    }
    else if(defendantTab === "company_or_business"){
      setValue("CB_state",state.StateAbr);
      setCBState(state.StateAbr);
    }
    else if(defendantTab === "public_identity"){
      setValue("PE_state",state.StateAbr);
      setPEState(state.StateAbr);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="max-1024 modal-dialog-centered "
      >
        <div>
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add Defendant</div></div>
          <Modal.Body className='p-0'>
            <div className="custom-tab m-t-5">
            <GenericTabs tabsData={tabsData} height={25} currentTab={defendantTab} />
                <Form
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="m-t-5">
                    {
                      defendantTab ==="private_individual" && 
                      <>
                        <Row className="mx-0">
                        {!defendantsLength &&(
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
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_first_name")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_address1")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "PI_fax")}
                                  {...register("PI_fax")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_city")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_email")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-5 position-relative height-25 p-r-5 custom-select-new-provider">
                                <div
                                  className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                  onClick={handleStateShow}>
                                  <span id="selectedOption">
                                    {PIState ? (
                                      <div className="d-flex align-items-center">
                                        <svg
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                            fill: "var(--primary-80)",
                                            color: "var(--primary-80)",
                                            stroke: "var(--primary-80)",
                                          }}
                                          className={`icon icon-state-${PIState}`}
                                        >
                                          <use xlinkHref={`#icon-state-${PIState}`}></use>
                                        </svg>
                                        {PIState}
                                      </div>
                                    ) : (
                                      "Select State"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "PI_phone")}
                                  {...register("PI_phone")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_extension")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control rounded-0 height-25"
                                  {...register("PI_zip")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </>
                    }
                    {
                      defendantTab ==="company_or_business" && 
                      <>
                        <Row className="mx-0 custom-margin-bottom">
                          <Col md={12} className="mx-0 p-l-5 p-r-5">
                            <input
                              type="text"
                              placeholder="Type Entity"
                              className="form-control rounded-0 height-25"
                              {...register("CB_entity_name")}
                            />
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_first_name")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_last_name")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_address1")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "CB_fax")}
                                  {...register("CB_fax")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_city")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_email")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-5 position-relative height-25 p-r-5 custom-select-new-provider">
                                <div
                                  className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                  onClick={handleStateShow}>
                                  <span id="selectedOption">
                                    {CBState ? (
                                      <div className="d-flex align-items-center">
                                        <svg
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                            fill: "var(--primary-80)",
                                            color: "var(--primary-80)",
                                            stroke: "var(--primary-80)",
                                          }}
                                          className={`icon icon-state-${CBState}`}
                                        >
                                          <use xlinkHref={`#icon-state-${CBState}`}></use>
                                        </svg>
                                        {CBState}
                                      </div>
                                    ) : (
                                      "Select State"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "CB_phone")}
                                  {...register("CB_phone")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_extension")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control rounded-0 height-25"
                                  {...register("CB_zip")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>                      
                      </>
                    }
                    {
                      defendantTab ==="public_identity" && 
                      <>
                        <Row className="mx-0 custom-margin-bottom">
                          <Col md={12} className="mx-0 p-r-5 p-l-5">
                            <input
                              type="text"
                              placeholder="Type Entity"
                              className="form-control rounded-0 height-25"
                              {...register("PE_entity_name")}
                            />
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_first_name")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_last_name")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_address1")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "PE_fax")}
                                  {...register("PE_fax")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_city")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>
                              <div className="col-md-5">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_email")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-5 position-relative height-25 p-r-5 custom-select-new-provider">
                                <div
                                  className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                  onClick={handleStateShow}>
                                  <span id="selectedOption">
                                    {PEState ? (
                                      <div className="d-flex align-items-center">
                                        <svg
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                            fill: "var(--primary-80)",
                                            color: "var(--primary-80)",
                                            stroke: "var(--primary-80)",
                                          }}
                                          className={`icon icon-state-${PEState}`}
                                        >
                                          <use xlinkHref={`#icon-state-${PEState}`}></use>
                                        </svg>
                                        {PEState}
                                      </div>
                                    ) : (
                                      "Select State"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-1 text-left p-l-5">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  onKeyUp={(e) => handleChange(e, "PE_phone")}
                                  {...register("PE_phone")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_extension")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-5 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control rounded-0 height-25"
                                  {...register("PE_zip")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>                      
                      </>
                    }
                  </div>
                  <div className="d-flex justify-content-between p-b-5 p-r-5 p-l-5">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="height-25" 
                      style={{padding:"0px 12px"}}
                    >
                      Cancel
                    </Button>
                    <Button type="success" className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
                      Save and Close
                    </Button>
                  </div>
                </Form>
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
    </>
  );
}

export default AddDefendant;
