import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import api from "../../../api/api";  // Adjust the import path as necessary

const ReportInformationModal = ({ show, handleClose, report ,onFetchReports}) => {

   //Rk202430051006
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [shouldSubmit, setShouldSubmit] = useState(true);
  const [reportTypes, setReportTypes] = useState([]) // all reports in db 

  
  const { register, handleSubmit, reset, watch} = useForm();
  const selectedReportTypeId = watch('report_typeID'); // For Make Selected ReportTypes . 

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  
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
  
  const fetchFilterReportData = async () => {
    try {
      const response = await api.get(`${origin}/api/search_filter_reports/`);
      setSearchResults(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFilterReportData();
    fetchReportTypes()
  }, [origin]);


  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults?.filter((result) => {
        const agency = result.reporting_agency
          ? result.reporting_agency.toLowerCase()
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

      setFilteredResults(filtered);
      setIsFiltersOpen(true)
    } else {
      setFilteredResults([]);
    }
  };

  const handleSelectAgency = (reportingAgency) => {
    setShouldSubmit(false);
    reset({
      report_typeID: reportingAgency.report_type_id, 
      title: reportingAgency.title ,
      reporter_firstname: reportingAgency.reporter_firstname ,
      reporter_lastname: reportingAgency.reporter_lastname ,
      date_taken: reportingAgency.date_taken,
      report_taken: reportingAgency.report_taken ,
      completed: reportingAgency.completed,
      cost: reportingAgency.cost,
    });
  
    setFilteredResults([]);
  };

  useEffect(() => {
    if (report) {
      reset({
        report_typeID: report.report_typeID || "",
        title: report.title || "",
        reporter_firstname: report.reporter_firstname || "",
        reporter_lastname: report.reporter_lastname || "",
        date_taken: formatDate(report.date_taken) || "",
        report_taken: report.report_taken || false,
        completed: formatDate(report.completed) || "",
        cost: report.cost || "",
      });
    }
  }, [report, reset]);


  console.log(report)  


  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const postDataforUpdateReportAgency = async (data) => {
    if (data) {
      if (data.completed) {
        data.completed = new Date(data.completed).toISOString();
      } else {
        data.completed = null;  // Ensure empty or invalid dates are set to null
      }
      if (data.date_taken) {
        data.date_taken = new Date(data.date_taken).toISOString();
      } else {
        data.date_taken = null;  // Ensure empty or invalid dates are set to null
      }
    }

    try {
      const response = await api.put(
        `${origin}/api/report/${report.id}/`,
        data
      );
      if (response.status === 200) {
        handleClose();
        onFetchReports();
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleDeleteSubmission = async() =>{
      try{
        const response = await api.delete(
          `${origin}/api/report/${report.id}/`,
        );
        if (response.status === 204) {
          handleClose();
          onFetchReports();
        }
      }catch(error){
        console.log(error)
      }
    }


  const onSubmit = (data) => {
    postDataforUpdateReportAgency(data);
  };

  const myStyle = {
    outerBox: {
      display: "flex",
      justifyContent: "center",
      maxHeight: "555px",
      backgroundColor: "white",
    },
    innerBox: {
      minWidth: "560px",
      height: "638px",
    },
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <div style={myStyle.outerBox}>
        <div style={myStyle.innerBox} className="modal-content">
          <div className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
            <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
              Report Information
            </h5>
          </div>
          <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
            Input and edit your report's information here.
          </p>
          <div className="modal-body">
            <form
              id="report_information_form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-12">
                  <input
                    type="text"
                    placeholder="Type Reporting agency name or address to search directory then click an entry"
                    className="form-control mb-1"
                    {...register("reporting_agency_search_form")}
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
                              {result.reporting_agency} {result.address1} {" "}
                              {result.address2} {result.city} {result.state}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Type:</span>
                </div>
                <div className="col-md-10">
                  <select
                    className="form-select form-control"
                    {...register("report_typeID")}
                    >
                      {reportTypes && reportTypes.map((reportType) => (
                        <option 
                          key={reportType.id} 
                          value={reportType.id}
                          selected={reportType.id === selectedReportTypeId}
                        >
                          {reportType.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey"><nobr>Reporter:</nobr></span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Title"
                    className="form-control"
                    {...register("title")}
                  />
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">First:</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="form-control"
                    {...register("reporter_firstname")}
                  />
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Last:</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className="form-control"
                    {...register("reporter_lastname")}
                  />
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Date:</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="date"
                    placeholder="Enter Date Taken"
                    className="form-control"
                    {...register("date_taken")}
                  />
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-6 text-left">
                  <span className="d-inline-block text-grey white-space-nowrapping">No Report:</span>
                </div>
                <div className="col-md-1 ml-3 d-flex">
                  <input
                    className="form-control"
                    type="checkbox"
                    {...register("report_taken")}
                  />
                </div>
              </div>

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Ready:</span>
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

              <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">Cost:</span>
                </div>
                <div className="col-md-10">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    placeholder="Enter Cost"
                    {...register("cost")}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer border-0 justify-content-between pt-4">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSubmission}
            >
              Delete
            </Button>
            <Button
              form="report_information_form"
              type="submit"
              className="btn popup-heading-color save-btn-popup"
            >
              Save Report Information
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportInformationModal;
