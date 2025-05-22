import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import GenericContactTabForHookForm from "./GenericContactTabForHookForm";
import api from "../../../api/api";
import { FormProvider, useForm } from "react-hook-form";



const ReportAgencyModal = ({ show, handleClose, report  , onFetchReports}) => {
  //Rk20243005240
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [statesAbrs, setStatesAbrs] = useState([]);
  const [shouldSubmit, setShouldSubmit] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const [selectedState , setSelectedState] = useState("AZ")

  const methods = useForm();
  const { reset, handleSubmit, register } = methods;

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

  useEffect(() => {
    fetchFilterReportData();
    fetchStatesData();
  }, [origin]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const filtered = searchResults.filter((result) => {
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
      reporting_agency: reportingAgency.reporting_agency,
      address: reportingAgency.address,
      address1: reportingAgency.address1,
      city: reportingAgency.city,
      state: reportingAgency.state,
      zip: reportingAgency.zip,
      email: reportingAgency.email,
      phone: reportingAgency.phone,
      extension: reportingAgency.extension,
      fax: reportingAgency.fax,
    });
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

  useEffect(() => {
    if (report) {
      reset({
        reporting_agency: report.reporting_agency || "",
        address: report.address || "",
        address1: report.address1 || "",
        city: report.city || "",
        // state: report.state || "",
        zip: report.zip_code || "",
        phone: formatNumber(report.phone) || "",
        extension: report.extension || "",
        fax: formatNumber(report.fax) || "",
        email: report.email || "",
      });
      setSelectedState(report.state)
    }
  }, [report, reset]);

  const postDataforUpdateReportAgency = async (data) => {
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


  //remove bracktes and spaces from  numbers 
  const stripNumberFormatting = (number) => {
    return number.replace(/[^\d]/g, "");
  };

  const onSubmit = (data) => {
    if (shouldSubmit) {
      const cleanedData = {
        ...data,
        phone: stripNumberFormatting(data.phone), //removes prenthesis and spaces form value
        fax:stripNumberFormatting(data.fax),
        address:data.address || null,
        address1:data.address1 || null
      };

      postDataforUpdateReportAgency(cleanedData);
      onFetchReports()
    }
  };


  //Delete Post is handeled here
  const handleDeleteSubmission = async() =>{
    try{
      const response = await api.delete(
        `${origin}/api/reporting_agency/${report.id}/`,
      );
      if (response.status === 204) {
        handleClose();
        onFetchReports();
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <FormProvider {...methods}>
      <Modal show={show} onHide={handleClose}>
        <div className="edit-report-outer-container">
          <div  className="modal-content edit-report-inner-container">
            <Modal.Header className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
              <Modal.Title className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
                Reporting Agency
              </Modal.Title>
            </Modal.Header>
            <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
              Input and edit your report agency information here.
            </p>
            <Modal.Body className="modal-body panel-popups-body">
              <form
                id="edit_report_contact_form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value="wFSuLjn7lNQtvzTJVMD0z5SFoeOIrY0OLFMFYsyAxlhpgrFXCN6CAYLFTg2p25BZ"
                />
                <div className="row align-items-center custom-margin-bottom">
                  <div className="col-md-12" >
                    <input
                      type="text"
                      placeholder="Type Reporting agency name or address to search directory then click an entry"
                      className="form-control "
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
                    <span className="d-inline-block text-grey">Agency:</span>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      placeholder="Enter Reporting Agency"
                      className="form-control"
                      {...register("reporting_agency")}
                    />
                  </div>
                </div>

                <GenericContactTabForHookForm statesAbrs={statesAbrs} selectedState={selectedState} />
              </form>
            </Modal.Body>
            <Modal.Footer
              className="modal-footer"
              style={{ backgroundColor: "white" }}
            >
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteSubmission}>
                Delete
              </Button>
              <Button
                form="edit_report_contact_form"
                type="submit"
                className="btn btn-secondary save-btn-popup popup-heading-color"
                onClick={() => setShouldSubmit(true)}
              >
                Save Reporting Agency Information
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </FormProvider>
  );
};

export default ReportAgencyModal;
