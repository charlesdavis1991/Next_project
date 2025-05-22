import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { ModalFooter } from "react-bootstrap";

const NewReportModal = ({ show, handleClose ,fetchReports }) => {
  //Rk2024265450
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCase = useSelector((state) => state?.caseData?.current);
  const client = useSelector((state) => state?.client?.current);
  const { register, handleSubmit, reset } = useForm();

  const [searchResults, setSearchResults] = useState([]); // Reports
  const [filteredResults, setfilteredResults] = useState([]); //filteredReports
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [reportTypes, setReportTypes] = useState([]) // all reports in db 

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
    reset({
      reporting_agency_name: reportingAgency.name,
      address1: reportingAgency.address1,
      address2: reportingAgency.address2,
      city: reportingAgency.city,
      state: reportingAgency.state,
      zip: reportingAgency.zip,
      email: reportingAgency.email,
      phone_number: reportingAgency.phone,
      extension: reportingAgency.extension,
      fax: reportingAgency.fax,
      website: reportingAgency.website,
      // report_taken: reportingAgency.report_taken,
      title:reportingAgency.contact_title,
      reporter_firstname:reportingAgency.contact_first_name,
      reporter_lastname:reportingAgency.contact_last_name,
      // report_typeID: Number(reportingAgency.report_type),
    });
    setSelectedReportTypeID(Number(reportingAgency.report_type))
  };

  const sendDataToCreateReport = async (data) => {
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
    try {
      const response = await api.post(
        `${origin}/api/add_new_report/${client.id}/${currentCase.id}/`,
        data
      );
      if (response.status === 201) {
        handleClose();
        reset();
        fetchReports(true);
      }
    } catch (error) {
      console.log("Error at sendData", error);
    }
  };

  const onSubmit = (data) => {
    sendDataToCreateReport(data);
   
  };

  return (
    <Modal show={show} onHide={handleClose} >
      <div
        className="model-new-report"
      >
        <div
          className="modal-content "
        >
          <Modal.Header className="modal-header text-center" closeButton>
            <Modal.Title className="modal-title mx-auto">
              Add a New Report to Oscar Root's Dog Bite case
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body panel-popups-body">
            <form id="add_new_report_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-12">
                <input
                    type="text"
                    placeholder="Type Reporting agency name or address to search directory then click an entry"
                    className="form-control mb-1"
                    name="reporting_agency_search_form"
                    onChange={handleInputChange}
                  />
                  {Array.isArray(filteredResults) &&
                    filteredResults.length > 0 && (
                      <div className="" style={{position: "relative"}}>
                        <div
                          className={`${isFiltersOpen? "block" : "hidden"}`}
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
                                handleSelectAgency(result)
                                setIsFiltersOpen(false)
                              }}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #ddd",
                              }}
                            >
                              {result.name} {result.address1} {" "}
                              {result.address2} {result.city} {result.state}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    <nobr>Agency:</nobr>
                  </p>
                </div>
                <div className="col-md-11">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Reporting Agency"
                    {...register("reporting_agency_name")}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    <nobr>Address 1:</nobr>
                  </p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Address 1"
                    className="form-control"
                    {...register("address1")}
                  />
                </div>
                <div className="col-md-1 text-left">
                  <span className="d-inline-block text-black">Type:</span>
                </div>
                <div className="col-md-5">
                  <select
                    className="form-control"
                    {...register("report_typeID")}
                  >
                    {reportTypes && reportTypes?.map((report) => (
                      <option key={report.id} value={report.id} selected={selectedReportTypeID}>{report.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    <nobr>Address 2:</nobr>
                  </p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Address 2"
                    className="form-control"
                    {...register("address2")}
                  />
                </div>
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    Reporter:
                  </p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Title"
                    className="form-control"
                    {...register("title")}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">City:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter City"
                    className="form-control"
                    {...register("city")}
                  />
                </div>
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">First:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="form-control"
                    {...register("reporter_firstname")}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">State:</p>
                </div>
                <div className="col-md-5">
                  <select
                    className="form-select form-control"
                    {...register("state")}
                  >
                    {statesAbrs &&
                      statesAbrs.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                  </select>
                </div>
                    
                <div className="col-md-1">
                  <p className="text-secondary text-nowrap baseBPCase-color-000">
                    Report taken:
                  </p>
                </div>
                 <div className="col-md-5">
                  <input
                  style={{height:'15px'}}
                    className="form-control "
                    type="checkbox"
                    {...register("report_taken")}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">ZIP:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter ZIP Code"
                    className="form-control"
                    {...register("zip")}
                  />
                </div>
                

                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">Last:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className="form-control"
                    {...register("reporter_lastname")}
                  />
                </div>
                
                
              </div>
              
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">Phone:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    className="form-control"
                    {...register("phone_number")}
                  />
                </div>
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">Ext:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Extension"
                    className="form-control"
                    {...register("extension")}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">Email:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Email"
                    className="form-control"
                    {...register("email")}
                  />
                </div>
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">Fax:</p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Fax"
                    className="form-control"
                    {...register("fax")}
                  />
                </div>
              </div>
              <div className="row align-items-center mb-1">
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    Website:
                  </p>
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Enter Website"
                    className="form-control"
                    {...register("website")}
                  />
                </div>
                <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    Completed:
                  </p>
                </div>
                <div className="col-md-5">
                  <input
                    type="date"
                    className="form-control"
                    {...register("completed")}
                  />
                </div>
                {/* <div className="col-md-1">
                  <p className="text-secondary baseBPCase-color-000">
                    Requested:
                  </p>
                </div>
                <div className="col-md-5">
                  <input
                    type="date"
                    className="form-control"
                    {...register("date_ordered")}
                  />
                </div> */}
              </div>
          
          <ModalFooter>
              <button
                onClick={handleClose}
               type="button" class="btn btn-secondary baseBPCase-float-left-margin-right-auto" data-dismiss="modal">Cancel</button>
              <button type="submit" form="add_new_report_form" class="btn btn-success">Save</button>
          </ModalFooter>
            </form>
          </Modal.Body>
        </div>
      </div>
    </Modal>
  );
};

export default NewReportModal;
