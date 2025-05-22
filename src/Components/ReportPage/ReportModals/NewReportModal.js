import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import {FormProvider, useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { ModalFooter } from "react-bootstrap";
import GenericContactTabForHookForm from "./GenericContactTabForHookForm";

const NewReportModal = ({ show, handleClose ,fetchReports,onUpdate,setDummyReport , isReoportTaken , showReportTakenField }) => {
  //Rk2024265450
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  
  const methods = useForm();
  const { reset, handleSubmit, register, watch } = methods;

  console.log(showReportTakenField)
 

  const [searchResults, setSearchResults] = useState([]); // Reports
  const [filteredResults, setfilteredResults] = useState([]); //filteredReports
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [reportTypes, setReportTypes] = useState([]) // all reports in db 
  const [dummy,setDummy] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedReportTypeID , setSelectedReportTypeID] = useState(1)

  const fetchReportTypes = async () => {
    try {
      const response = await api.get(`${origin}/api/report_types/`);
      if (response.status === 200) {
        setReportTypes(response.data);
        console.log(response.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSatesData = async () => {
    try {
      const response = await api.get(`${origin}/api/states/`);
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const fetchFilterReportData = async () => {
    try {
      const response = await api.get(`${origin}/api/search_filter_reports/`);
      if(response.status ===200){
        setSearchResults(response.data);
      }
      console.log(response)
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchFilterReportData();
    fetchSatesData();
    
    fetchReportTypes()
  }, [origin]);



  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults?.filter((result) => {
        const agency = result.name
          ? result.name.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";

        return (
          agency.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setfilteredResults(filtered);
      setIsFiltersOpen(true)
    } else {
      setfilteredResults("");
    }
  };

  //set Report Data in form inputs
  const handleSelectAgency = (reportingAgency) => {
    console.log(reportingAgency)
    reset({
      reporting_agency_name: reportingAgency.name,
      address: reportingAgency.address1,
      address1: reportingAgency.address2,
      city: reportingAgency.city,
      state: reportingAgency.state,
      zip: reportingAgency.zip,
      email: reportingAgency.email,
      phone: reportingAgency.phone,
      extension: reportingAgency.extension,
      fax: reportingAgency.fax,
      website: reportingAgency.website,
      // report_taken: reportingAgency.report_taken,
      contact_title:reportingAgency.contact_title,
      reporter_firstname:reportingAgency.contact_first_name,
      reporter_lastname:reportingAgency.contact_last_name,
      // report_typeID: Number(reportingAgency.report_type),
    });
    setSelectedReportTypeID(Number(reportingAgency.report_type))
  };

  const sendDataToCreateReport = async (data) => {
    console.log(data)
    if (data.completed) {
      data.completed = new Date(data.completed).toISOString();
    } else {
      data.completed = null;  // Ensure empty or invalid dates are set to null
    }
    if (data.report_taken){
      data.date_taken = new Date().toISOString()
    }

     // Add current time for date_ordered field
     data.date_ordered = new Date().toISOString(); // Ensure empty or invalid dates are set to null
     data.dummy = dummy;
    try {
      const response = await api.post(
        `${origin}/api/add_new_report/${client.id}/${currentCase.id}/`,
        data
      );
      if (response.status === 201) {
        setDummyReport(response.data)
        handleClose();
        reset();
        fetchReports(true);
      }
    } catch (error) {
      console.log("Error at sendData", error);
    }
  };

  const onSubmit = (data) => {
    console.log(data)
    onUpdate();
    sendDataToCreateReport(data);
   
  };




  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered max-800p custom-insurance-dialog"
      >
        <div style={{ height: "659px" }}>
          <Modal.Header className="text-center p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
            >
              Reports
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="custom-tab custom-margin-top"> 
              <Tab.Container defaultActiveKey={"report-information"}>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="report-information"
                  >
                    Report Information
                  </Nav.Link>

                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="reporting-agency"
                  >
                    Reporting Agency
                  </Nav.Link>

                  <Nav.Link
                    className="nav-item nav-link Pad8 tab-item"
                    eventKey="report-taken-by"
                  >
                    Report Taken By
                  </Nav.Link>
                </Nav>
                <Form
                  id="Reports_form "
                  className="d-flex , flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ height: "541px" }}
                >
                  <div className="custom-margin-top ">
                    <Tab.Content>
                      <Tab.Pane eventKey="reporting-agency" style={{overflow: "hidden"}}>
                        <Row className="mx-0"  style={{paddingLeft: "0px",paddingRight: "0px"}}>
                          <Col md={12} style={{paddingLeft: "0px",paddingRight: "0px"}}>
                            <input
                              type="text"
                              placeholder="Type Reporting agency name or address to search directory then click an entry"
                              className="form-control custom-margin-bottom"
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
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults.map((result, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectAgency(result);
                                          setIsFiltersOpen(false);
                                        }}
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        {result.name} {result.address1}{" "}
                                        {result.address2} {result.city}{" "}
                                        {result.state}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className="mx-0 align-items-center custom-margin-bottom">
                          <Col md={12} className = "p-0">
                            <div className="row align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Agency:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Reporting Agency"
                                  className="form-control"
                                  {...register("reporting_agency_name")}
                                />
                              </div>
                            </div>
                            <GenericContactTabForHookForm
                              statesAbrs={statesAbrs}
                              // selectedState={selectedState.current}
                            />
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="report-information">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                          <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex align-items-center text-left" style={{marginLeft: "15px"}}>
                                <input
                                  type="checkbox"
                                  className="form-control"
                                  {...register("is_blocked")}
                                  onChange={(e)=>setDummy(e.target.checked)}
                                />
                                <span  className="d-inline-block text-grey white-space-nowrapping" style={{marginLeft: "5px"}}>
                                   Dummy:
                                </span>
                              </div>
                            
                            </div>



                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Type:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-select form-control"
                                  {...register("report_typeID")}
                                >
                                  {reportTypes &&
                                    reportTypes.map((reportType) => (
                                      <option
                                        key={reportType.id}
                                        value={reportType.id}
                                        selected = {reportType.id === selectedReportTypeID}
                                      >
                                        {reportType.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>

                            {showReportTakenField && showReportTakenField ?( <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey white-space-nowrapping">
                                  No Report Taken:
                                </span>
                              </div>
                              
                              <div className="col-10">

                                <input
                                    type="checkbox"
                                    placeholder="Enter Date Taken"
                                    className=""
                                    {...register("report_taken")}
                                    />
                                </div>
                            </div>) : <></>}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Report Number:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Report Number"
                                  className="form-control"
                                  {...register("report_number")}
                                />
                              </div>
                            </div>

                            

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Ready:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder="Enter Date of Completion"
                                  className="form-control"
                                  {...register("completed")}
                                />
                              </div>
                            </div>
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Cost:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter Cost"
                                  className="form-control"
                                  {...register("cost")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="report-taken-by">
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              
                            <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  <nobr>Title:</nobr>
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Title"
                                  className="form-control"
                                  {...register("title")}
                                  // {...register("contact_title")}
                                />
                              </div>
                            </div>

                        
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  First:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter First Name"
                                  className="form-control"
                                  {...register("reporter_firstname")}
                                  // {...register("contact_first_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Last:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Last Name"
                                  className="form-control"
                                  {...register("reporter_lastname")}
                                  // {...register("contact_last_name")}
                                />
                              </div>
                             
                            </div>
                          </Col>
                        </Row>
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
      
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </FormProvider>
  );

  
};

export default NewReportModal;
