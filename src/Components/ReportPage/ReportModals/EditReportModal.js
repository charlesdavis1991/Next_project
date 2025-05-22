import React, { useState, useEffect, useRef } from "react";
import GenericContactTabForHookForm from "./GenericContactTabForHookForm";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import api from "../../../api/api";



function EditReportModal({ report, handleClose, onFetchReports, show , activeTab ,onUpdate,onShowDeleteConfirmPopup,setDummyReport , isMultipleReports}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const methods = useForm();
  const { reset, handleSubmit, register, watch } = methods;

  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); //for filtered reports to insert data in agency tab pane
  const [statesAbrs, setStatesAbrs] = useState([]);
  const [shouldSubmit, setShouldSubmit] = useState(true);
  const [reportTypes, setReportTypes] = useState([]); // all reports in db
  const [dummy,setDummy] = useState(report["is_blocked"]);
  const selectedState = useRef("AZ");


  const [reportTaken , setReportTaken] = useState(false)
  const selectedReportTypeId = watch("report_typeID"); // For Make Selected ReportTypes .



  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults.filter((result) => {
        const agency = result.name ? result.name.toLowerCase() : "";
        const address = result.address ? result.address.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        

        return (
          agency.startsWith(inputValue) ||
          address.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setFilteredResults([]);
    }
  };


  const fetchStatesData = async () => {
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
      setSearchResults(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchReportTypes = async () => {
    try {
      const response = await api.get(`${origin}/api/report_types/`);
      if (response.status === 200) {
        setReportTypes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
    
  // }, [origin]);

  const handleSelectAgency = (report) => {
    setShouldSubmit(false);
    reset({
      reporting_agency_name: report.name,
      address: report.address,
      address1: report.address1,
      city: report.city,
      // state: report.state,
      zip: report.zip,
      email: report.email,
      phone: report.phone,
      extension: report.extension,
      fax: report.fax,
      // contact_title: report.title,
      contact_title: report.contact_title,
      contact_first_name:report.contact_first_name,
      contact_last_name:report.contact_last_name,
    });
    // setSelectedState(report.state);
    selectedState.current = report.state
    setFilteredResults([]);
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

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
 
    fetchFilterReportData();
    fetchStatesData();
    fetchReportTypes();
    if (report) {
      reset({
        reporting_agency_name: report.reporting_agency_name || "",
        for_reporting_agency: report.for_reporting_agency || "",
        address: report.address || "",
        address1: report.address1 || "",
        city: report.city || "",
        zip: report.zip_code || "",
        phone: formatNumber(report.phone) || "",
        extension: report.extension || "",
        fax: formatNumber(report.fax) || "",
        email: report.email || "",
        // state:report.state || "",

        ////////repot-info-panel-data-filled here


        report_typeID: report.report_typeID || "",
        contact_title: report.contact_title || "",
        contact_first_name: report.contact_first_name || "",
        contact_last_name: report.contact_last_name || "",

        ///OLD
        // title: report.title || "",
        // reporter_firstname: report.reporter_firstname || "",
        // reporter_lastname: report.reporter_lastname || "",


        date_taken: formatDate(report.date_taken) || "",
        report_taken: report.report_taken || false,
        is_blocked: report.is_blocked || false,
        completed: formatDate(report.completed) || "",
        cost: report.cost || 1.0,

        //fill the report-taken-by data
        report_number: report.report_number || "",
      });
      setReportTaken(report.date_taken);
      selectedState.current = report.state
    }
  }, [report, reset,origin]);

  async function postDataforUpdateReportAgency(data) {
    console.log(data);
    
    try {
      const response = await api.put(
        `${origin}/api/report/${report.id}/`,
        data
      );
      if (response.status === 200) {
        setDummyReport(response.data)
        handleClose();
        onFetchReports();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //remove bracktes and spaces from  numbers
  const stripNumberFormatting = (number) => {
    return number.replace(/[^\d]/g, "");
  };

  const onSubmit = (data) => {
    // setShouldSubmit(true)
    if (shouldSubmit) {
    }
      const cleanedData = {
        ...data,
        phone: stripNumberFormatting(data.phone), //removes prenthesis and spaces form value
        fax: stripNumberFormatting(data.fax),
        address: data.address || null,
        address1: data.address1 || null,
        completed: data.completed
        ? new Date(data.completed).toISOString()
        : null,
        date_taken: data.date_taken
        ? new Date(data.date_taken).toISOString()
        : null,
        state: data.state || selectedState.current, // this field is tracked with useRef
      };
      console.log(data.state ,"State")
      cleanedData["is_blocked"] = dummy
      postDataforUpdateReportAgency(cleanedData);
      onUpdate();
      onFetchReports();
  };

  //Delete Post is handeled here
  const handleDeleteSubmission = async () => {
    try {
      const response = await api.delete(`${origin}/api/report/${report.id}/`);
      if (response.status === 204) {
        handleClose();
        onFetchReports();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName=" modal-dialog-centered max-800p custom-insurance-dialog"
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
            <div className="custom-tab mt-3"> 
              <Tab.Container defaultActiveKey={activeTab}>
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
                  style={{ height: "545px" }}
                >
                  <div className="mt-2 ">
                    <Tab.Content>
                      <Tab.Pane eventKey="reporting-agency">
                        <Row className="mx-0 " style={{paddingLeft: "0px",paddingRight: "0px"}}>
                          <Col md={12} className="mx-0" style={{paddingLeft: "0px",paddingRight: "0px"}}>
                            <input
                              type="text"
                              placeholder="Type Reporting agency name or address to search directory then click an entry"
                              className="form-control mb-1"
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
                                        {result.name} {result.address}{" "}
                                        {result.address1} {result.city}{" "}
                                        {result.state}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0 ">
                          <Col md={12} className="mx-0">
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
                                <input
                                  type="text"
                                  placeholder="Enter Reporting Agencys"
                                  className=""
                                  style={{ display: "none" }}
                                  {...register("for_reporting_agency")}
                                />
                              </div>
                            </div>
                            <GenericContactTabForHookForm
                              statesAbrs={statesAbrs}
                              selectedState={selectedState.current}
                            />
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="report-information">
                        <Row className="mx-0">
                          <Col md={12} className ="p-0">

                          <div className="row mx-0 align-items-center custom-margin-bottom ">
                              <div className="d-flex align-items-center text-left" style={{marginLeft: "15px"}}>
                                <input
                                  type="checkbox"
                                  className="form-control"
                                  {...register("is_blocked")}
                                  onChange={(e)=>setDummy(e.target.checked)}
                                  checked={dummy}
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
                                        selected={
                                          reportType.id === selectedReportTypeId
                                        }
                                      >
                                        {reportType.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>

                          {report?.report_taken && !isMultipleReports ? ( <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey white-space-nowrapping">
                                  No Report Taken:
                                </span>
                              </div>
                              
                              {report?.report_taken ? (
                                <div className="col-md-6 d-flex ">
                                <input
                                  type="date"
                                  placeholder="Enter Date Taken"
                                  className="form-control"
                                  {...register("date_taken")}

                                />
                                <input
                                  type="checkbox"
                                  placeholder="Enter Date Taken"
                                  className=""
                                  style={{marginLeft : "20px"}}
                                  {...register("report_taken")}
                                />
                              </div> 
                              ): (

                                <div className="d-flex col-md-2">
                                
                                
                                    <input
                                    style={{height: "20px"}}
                                      type="checkbox"
                                      placeholder="Enter Date Taken"
                                      className=""
                                      {...register("report_taken")}
                                    />
                        
                                </div>
                              )}
                            </div>) : <></> }

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

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Date:
                                </span>
                              </div>


                              <div className="col-md-10">
                                <input
                                  type="date"
                                  placeholder="Enter Date Taken"
                                  className="form-control"
                                  {...register("date_taken")}
                                />
                              </div> 
                              
                            </div> */}

                            

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
                        <Row className="mx-0 mt-3">
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
                                  // {...register("title")}
                                  {...register("contact_title")}
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
                                  // {...register("reporter_firstname")}
                                  {...register("contact_first_name")}
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
                                  // {...register("reporter_lastname")}
                                  {...register("contact_last_name")}
                                />
                              </div>
                             
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                  <div className="d-flex justify-content-between">
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
                      Save
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
      </Modal>

      {/* {showDeleteConfirm && (
        <ConformDeletePopup handleDeleteSubmission={handleDeleteSubmission} handleClose={hideDeleteConfirmPopup} />
      )} */}
    </FormProvider>

  );
}

export default EditReportModal;
