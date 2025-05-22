import React, { useState, useEffect, useContext} from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import {useForm } from "react-hook-form";
import api from "../../../api/api";
import { getCaseId, getClientId, getToken } from "../../../Utils/helper";
import { useSelector } from "react-redux";
import { format, formatISO, parseISO } from 'date-fns';
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import axios from "axios";

const formatDate = (date) => {
  if (!date) return "";
  // Use `parseISO` to correctly parse the date string
  const parsedDate = parseISO(date);
  // Format the date as needed (YYYY-MM-DD format)
  return format(parsedDate, 'yyyy-MM-dd');
};

// RK:08-10-2024 :: 1:40 am
function EditWitnesses({
    object,
    handleClose,
    onFetch,
    show,
    activeTab,
    onShowDeleteConfirmPopup,
    retainedByList,
    setReducer,
    reducerValue
    }) {

  const { reset, handleSubmit, register, watch, setValue } = useForm();
  


  const [forEntity, setForEntity] = useState(null)
  const [forRecordId , setForRecordId] = useState(null)
  const [isBlocked, setIsBlocked] = useState(object?.is_blocked)    
  const { modalData } = useSelector((state) => state.insurances);
  const [loading, setLoading] = useState(false);
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const { isClientDataUpdated, setIsClientDataUpdated, isPanelChecklistUpdated, setIsPanelChecklistUpdated } = useContext(ClientDataContext);
  const accessToken = getToken();
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

  useEffect(() => {
    if (object) {
      const { witness_contact_home, witness_contact_last } = object;
     

      reset({
        // Fields for work_ prefix from witness_contact_home
        witness_employer: object?.witness_employer || "",
        work_address1: witness_contact_home?.address1 || "",
        work_address2: witness_contact_home?.address2 || "",
        work_city: witness_contact_home?.city || "",
        work_state: witness_contact_home?.state || "",
        work_zip: witness_contact_home?.zip || "",
        work_phone: formatNumber(witness_contact_home?.phone_number) || "",
        work_extension: witness_contact_home?.phone_ext || "",
        work_fax: formatNumber(witness_contact_home?.fax) || "",
        work_email: witness_contact_home?.email || "",
        work_name: witness_contact_home?.name || "",

        witness_first_name: object?.witness_first_name || "",
        witness_last_name: object?.witness_last_name || "",
        last_contact_address1: witness_contact_last?.address1 || "",
        last_contact_address2: witness_contact_last?.address2 || "",
        last_contact_city: witness_contact_last?.city || "",
        last_contact_state: witness_contact_last?.state || "",
        last_contact_zip: witness_contact_last?.zip || "",
        last_contact_phone: formatNumber(witness_contact_last?.phone_number) || "",
        last_contact_extension: witness_contact_last?.phone_ext || "",
        last_contact_fax: formatNumber(witness_contact_last?.fax) || "",
        last_contact_email: witness_contact_last?.email || "",



        // Other fields

        statement_summary: object?.statement_summary || " ",
        witness_gender : object?.witness_gender || "",
        witness_birthday : formatDate(object?.witness_birthday) || "",
        RepLetterSent: formatDate(object?.RepLetterSent) || "",
        contact_confirmed_date: formatDate(object?.contact_confirmed_date) || "",
        
    },
    setForEntity(object?.witness_for_entity),
    setForRecordId(object?.witness_for_record_id),
    
    );
    }
  }, [object, reset]);


  
  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/` , {
        headers: {
          // 'Authorization': `Bearer ${token}`
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

  useEffect(() => {
    fetchSatesData()
  }, [])
  

  

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
    setValue("last_contact_phone", formattedValue, { shouldValidate: true });
  };

  const handleHomeFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("last_contact_fax", formattedValue, { shouldValidate: true });
  };

  const workPhoneValue = watch("work_phone");
  const workFaxValue = watch("work_fax");

  const homePhoneValue = watch("last_contact_phone");
  const homeFaxValue = watch("last_contact_fax");


  
  const handleSelectRetainedByChange = (event) => {
    const selectedValue = event.target.value;
    const [Entity, id] = selectedValue.split(",");

    console.log("Full Name:", Entity);
    console.log("ID:", id);

    setForEntity(Entity);
    setForRecordId(id);

  };

  
  const postDataforUpdateWitness = async (data) => {
  
    try {
      setLoading(true);
      const response = await axios.put(
        `${origin}/api/witnesses/edit_witness/${object.id}/`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',  
            Authorization: accessToken, 
          }
        }
      );
      
      if (response.status === 200) {
        onFetch();
        setIsClientDataUpdated(!isClientDataUpdated);
        setIsPanelChecklistUpdated(!isPanelChecklistUpdated);
        setReducer(reducerValue)
        setLoading(false)
        handleClose();
      }
      // handleClose();
    } catch (error) {
      console.log(error);
    }
  };


  const formatDateForBackend = (date) => {
    const parsedDate = parseISO(date);
    return formatISO(parsedDate, { representation: 'complete' }); // Formats the date to ISO 8601 in UTC
  };

  //remove bracktes and spaces from  numbers
  const stripNumberFormatting = (number) => {
    return number.replace(/[^\d]/g, "");
  };

  const onSubmit = (data) => {

    const cleanedData = {
      ...data,
      RepLetterSent: data.RepLetterSent ? formatDateForBackend(data?.RepLetterSent) : null,
      contact_confirmed_date: data.contact_confirmed_date ? formatDateForBackend(data?.contact_confirmed_date) : null,
      witness_birthday: data.witness_birthday ? formatDateForBackend(data?.witness_birthday) : null,
      witness_for_entity: forEntity || " ",
      witness_for_record_id: forRecordId || null,
      last_contact_phone: data.last_contact_phone ? stripNumberFormatting(data?.last_contact_phone) :  ' ',
      last_contact_fax: data.last_contact_fax ? stripNumberFormatting(data?.last_contact_fax) :  ' ',
      "is_blocked": isBlocked

    }
   
    postDataforUpdateWitness(cleanedData)
    
    
  };
  const selectedLastContactState = watch("last_contact_state");

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
      >
        <div style={{ height: "550px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
              Witness
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="custom-tab custom-margin-top">
              <Tab.Container defaultActiveKey={activeTab}>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    eventKey="witness"
                  >
                    Witness
                  </Nav.Link>
                  <Nav.Link
                  
                    eventKey="details"
                  >
                    Witness Details
                  </Nav.Link>


                  {/* <Nav.Link
                    eventKey="witness-for"
                  >
                    Witness For
                  </Nav.Link> */}

                  <Nav.Link
                    eventKey="WitnessStatementSummary"
                  >
                    Witness Statement Summary
                  </Nav.Link>
                  
                </Nav>
                <Form
                  className="d-flex , flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ height: "434px" }}
                >
                  <div className="custom-margin-top ">
                    <Tab.Content>
                      
                    <Tab.Pane eventKey="witness">
                      <Row className="mx-0">
                        <Col md={12} className="p-0">
                          <div className="row mx-0 align-items-center custom-margin-bottom">
                            <div className="col-md-2 text-left">
                              <span className="d-inline-block text-grey text-nowrap">
                                Dummy:
                              </span>
                            </div>
                            <div className="col-md-10">
                              <input
                                type="checkbox"
                                defaultChecked={isBlocked}
                                onChange={(e)=> setIsBlocked(e.target.checked)}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mx-0">
                          <Col md={12} className = "p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  First Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("witness_first_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Last Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("witness_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("last_contact_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("last_contact_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("last_contact_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-3">
                                
                              <select
                                name="state"
                                className="form-select"
                                {...register("last_contact_state")}
                                value={selectedLastContactState || ""}
                                onChange={(e) => setValue("last_contact_state", e.target.value)}
                              >
                                <option  value="">
                                    Select state
                                  </option>

                                  {statesAbrs &&
                                    statesAbrs.map((state) => (
                                      <option
                                        key={state.id}
                                        value={state.StateAbr}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("last_contact_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>

                              <div className="col-md-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("last_contact_phone")}
                                  value={homePhoneValue || ""}
                                  onChange={handleHomePhoneInputChange}
                                />
                              </div>
                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Ext:
                                </span>
                              </div>

                              <div className="col-md-4">
                                <input
                                  type="number"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("last_contact_extension")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              {/* <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>

                              <div className="col-md-4">
                                <input
                                  type="number"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("last_contact_extension")}
                                />
                              </div> */}
                              
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("last_contact_fax", {})}
                                  value={homeFaxValue || ""}
                                  onChange={handleHomeFaxInputChange}
                                />
                              </div>

                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("last_contact_fax", {})}
                                  value={homeFaxValue || ""}
                                  onChange={handleHomeFaxInputChange}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("last_contact_email")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
{/*                       
                      <Tab.Pane eventKey="witness-for">
                        
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Employer:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Employer Name"
                                  className="form-control"
                                  {...register("witness_employer")}
                                />
                              </div>
                            </div>


                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 1:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 1"
                                  className="form-control"
                                  {...register("work_address1")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Address 2:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Address 2"
                                  className="form-control"
                                  {...register("work_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  City :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Enter city"
                                  className="form-control"
                                  {...register("work_city")}
                                />
                              </div>

                              <div className="col-md-1 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  State :
                                </span>
                              </div>
                              <div className="col-md-3">
                                
                              <select
                                      name="state"
                                      className="form-select "
                                      {...register("work_state")}
                                    >
                                      {statesAbrs &&
                                        statesAbrs.map((state) => (
                                          <option key={state.id} selected={state.StateAbr ===object?.witness_contact_home?.state} value={state.StateAbr}>
                                            {state.name}
                                          </option>
                                        ))}
                                </select>
                              </div>

                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Zip :
                                </span>
                              </div>
                              <div className="col-md-2">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control"
                                  {...register("work_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Phone:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("work_phone")}
                                  value={workPhoneValue || ""}
                                  onChange={handleWorkPhoneInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Extension:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Extension"
                                  className="form-control"
                                  {...register("work_extension")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Fax:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control"
                                  {...register("work_fax", {})}
                                  value={workFaxValue || ""}
                                  onChange={handleWorkFaxInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Email:
                                </span>
                              </div>

                              <div className="col-md-10">
                                <input
                                  type="email"
                                  placeholder="Enter email"
                                  className="form-control"
                                  {...register("work_email")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane> */}
                    

                      <Tab.Pane eventKey="details">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                          

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  For:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-select"
                                 
                                  onChange={handleSelectRetainedByChange}
                                >

                                    <option
                                      value={" "}
                                      >
                                        -----------
                                      </option>
                                  {retainedByList &&
                                    retainedByList.clients.map((client) => (
                                      <option
                                        key={`Client, ${client.id}`}
                                        value={`Client, ${client.id}`}
                                        selected={
                                          forEntity === "Client" &&
                                          forRecordId === client.id
                                        }
                                      >
                                        {client.first_name} {client.last_name}{" "}
                                        (Client)
                                      </option>
                                    ))}
                                  {retainedByList &&
                                    retainedByList.defendants.map(
                                      (defendant) => (
                                        <option
                                          key={`Defendant, ${defendant.id}`}
                                          value={`Defendant, ${defendant.id}`}
                                          selected={
                                            forEntity === "Defendant" &&
                                            forRecordId === defendant.id
                                          }
                                        >
                                          {defendant.first_name}{" "}
                                          {defendant.last_name} (Defendant)
                                        </option>
                                      )
                                    )}
                                  {retainedByList &&
                                    retainedByList.otherParties.map(
                                      (otherParty) => (
                                        <option
                                          key={`OtherParty, ${otherParty.id}`}
                                          value={`OtherParty, ${otherParty.id}`}
                                          selected={
                                            forEntity === "OtherParty" &&
                                            forRecordId === otherParty.id
                                          }
                                        >
                                          {otherParty.party_first_name}{" "}
                                          {otherParty.party_last_name} (Other
                                          Party)
                                        </option>
                                      )
                                    )}
                                </select>
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  DOB:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("witness_birthday")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Gender:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-select"
                                  defaultValue={object?.witness_gender}
                                  {...register("witness_gender")}
                                >
                                  <option value={""}>-----</option>
                                  <option value={"Male"}>Male</option>
                                  <option value={"Female"}>Female</option>
                                </select>
                              </div>
                            </div>

                            
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Rep Letter:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("RepLetterSent")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Contact:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control"
                                  {...register("contact_confirmed_date")}
                                />
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Relationship To Client:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="checkbox"
                                  className="form-check"
                                  {...register("relationship_to_client")}
                                />
                              </div>
                            </div> */}

                          </Col>
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="WitnessStatementSummary">
                          <Col md={12}>
                            <p className="text-secondary color-000">
                              <nobr>Summary:</nobr>
                            </p>

                            <textarea
                              style={{ height: "240px", resize: "none" }}
                              className="form-control"
                              placeholder="Enter Summary"
                              {...register("statement_summary")}
                            />
                          </Col>
                        </Tab.Pane>
                    </Tab.Content>
                  </div>
                  <div className="d-flex justify-content-between custom-margin-top">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="ml-2"
                    >
                      Close
                    </Button>
                    <Button
                      variant="danger"
                      onClick={onShowDeleteConfirmPopup}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                    <Button variant="primary" type="submit">
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
      </Modal>

    </>
  )
}

export default EditWitnesses