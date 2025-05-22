import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import { ModalFooter } from "react-bootstrap";

function NewCaseExpertModalOld({ show, handleClose ,fetchExperts }) {
 
    const origin = process.env.REACT_APP_BACKEND_URL;
    const currentCase = useSelector((state) => state?.caseData?.current);
    const client = useSelector((state) => state?.client?.current);
    const { register, handleSubmit, reset } = useForm();
  
    const [searchResults, setSearchResults] = useState([]); // Expert's Directries
    const [filteredResults, setfilteredResults] = useState([]); //filteredExperties
    const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
    const [expertCategories, setExpertCategories] = useState([]) // all categories 
  
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  
    const [selectedCategoryTypeID , setSelectedCategoryTypeID] = useState(1)
  
    const fetchExpertCategories = async () => {
      try {
        const response = await api.get(`${origin}/api/expert_categories/`);
        if (response.status === 200) {
          setExpertCategories(response.data);
         
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
  
  
  
    const fetchFilterExpertData = async () => {
      try {
        const response = await api.get(`${origin}/api/search_filter_expert/`);
        if(response.status ===200){
          setSearchResults(response.data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
  
  
    useEffect(() => {
      fetchFilterExpertData();
      fetchSatesData();
      fetchExpertCategories()
    }, [origin]);
  
  
    
    const handleInputChange = (e) => {
      const inputValue = e.target.value.toLowerCase();
      if (inputValue !== "") {
        const filtered = searchResults?.filter((result) => {
          const title = result.title
            ? result.title.toLowerCase()
            : "";
          const address1 = result.address1 ? result.address1.toLowerCase() : "";
          const address2 = result.address2 ? result.address2.toLowerCase() : "";
          const city = result.city ? result.city.toLowerCase() : "";
          const state = result.state ? result.state.toLowerCase() : "";
          const zip = result.zip ? result.zip.toLowerCase() : "";
          const expert_firstname = result.expert_firstname ? result.expert_firstname.toLowerCase() : "";
          const expert_lastname = result.expert_lastname ? result.expert_lastname.toLowerCase() : "";
         
          return (
            title.startsWith(inputValue) ||
            expert_firstname.startsWith(inputValue) ||
            expert_lastname.startsWith(inputValue) ||
            address1.startsWith(inputValue) ||
            address2.startsWith(inputValue) ||
            city.startsWith(inputValue) ||
            state.startsWith(inputValue) ||
            zip.startsWith(inputValue) 
           
          );
        });
  
        setfilteredResults(filtered);
        setIsFiltersOpen(true)
      } else {
        setfilteredResults("");
      }
    };
  
    //set Report Data in form inputs
    const handleSelectAgency = (expertDirectory) => {
      reset({
        address1: expertDirectory.address1,
        address2: expertDirectory.address2,
        city: expertDirectory.city,
        state: expertDirectory.state,
        zip: expertDirectory.zip,
        email: expertDirectory.email,
        phone_name: expertDirectory.phone_name,
        extension: expertDirectory.extension,
        fax: expertDirectory.fax,
        website: expertDirectory.website,
        title:expertDirectory.title,
        first_name:expertDirectory.expert_firstname,
        last_name:expertDirectory.expert_lastname,

      });
      // setSelectedCategoryTypeID(Number(expertDirectory.expert_categoryID)) // ** confirm it 
    };
  
    const sendDataToCreateCaseExpert = async (data) => {
     
       // Add current time for date_ordered field
       data.date_ordered = new Date().toISOString(); // Ensure empty or invalid dates are set to null
      try {
        const response = await api.post(
          `${origin}/api/add_new_expert/${client.id}/${currentCase.id}/`,
          data
        );
        if (response.status === 201) {
          handleClose();
          reset();
          fetchExperts(true);
        }
      } catch (error) {
        console.log("Error at sendData", error);
      }
    };
  
    const onSubmit = (data) => {
      sendDataToCreateCaseExpert(data);
      console.log(data)
     
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
              Add a New Expert to Oscar Root's Dog Bite case
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body panel-popups-body">
            <form id="add_new_report_form" onSubmit={handleSubmit(onSubmit)}>
              <div className="row mx-0">
                <div className="col-md-12">
                <input
                    type="text"
                    placeholder="Type Expert's Name or Field for Expertise to search directory then click an entry"
                    className="form-control mb-1"
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
                              {result.title} {result.expert_firstname} {result.expert_lastname} {result.address1}
                              {result.address2} {result.city} {result.state} {result.zip}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="row mx-0 align-items-center mb-1">
              
                    <div className="col-md-2 text-left">
                        <span className="d-inline-block text-black text-nowrap">Select Expertise :</span>
                        </div>
                    <div className="col-md-10">
                    <select
                        className="form-control"
                        {...register("expert_categoryID")}
                        // selected = {selectedCategoryTypeID}
                        >
                        {expertCategories && expertCategories?.map((obj) => (
                            <option key={obj.id} value={obj.id} selected={selectedCategoryTypeID}>{obj.name}</option>
                        ))}
                    </select>
                    </div>

                    </div>
             
              <div className="row mx-0 align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">
                    <nobr>Address 1:</nobr>
                  </p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter Address 1"
                    className="form-control"
                    {...register("address1")}
                  />
                </div>

                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000 text-nowrap">Expert First Name:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="form-control"
                    {...register("first_name")}
                  />
                </div>

                
              </div>
              <div className="row mx-0 align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">
                    <nobr>Address 2:</nobr>
                  </p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter Address 2"
                    className="form-control"
                    {...register("address2")}
                  />
                </div>
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">
                  Expert Last Name:
                  </p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="form-control"
                    {...register("last_name")}
                  />
                </div>
              </div>
              <div className="row mx-0 align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">City:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter City"
                    className="form-control"
                    {...register("city")}
                  />
                </div>
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">Expert Title:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter title "
                    className="form-control"
                    {...register("title")}
                  />
                </div>
              </div>
              <div className="row mx-0 align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">State:</p>
                </div>
                <div className="col-md-4">
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
                    
                <div className="col-md-2">
                  <p className="text-secondary text-nowrap baseBPCase-color-000">
                   Zip:
                  </p>
                </div>
                 <div className="col-md-4">
                  <input
                    // style={{height:'15px'}}
                    placeholder="Enter Zip Code"
                    className="form-control "
                    type="text"
                    {...register("zip")}
                  />
                </div>
              </div>
              <div className="row mx-0 align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">Phone:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Enter Phone "
                    className="form-control"
                    {...register("phone_number")}
                  />
                </div>
                

                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">Ext:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Extension"
                    className="form-control"
                    {...register("extension")}
                  />
                </div>
                
                
              </div>
              
              <div className="row mx-0 align-items-center mb-1">
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">Email:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="email"
                    placeholder="Enter Email Address"
                    className="form-control"
                    {...register("email")}
                  />
                </div>
                <div className="col-md-2">
                  <p className="text-secondary baseBPCase-color-000">Fax:</p>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Fax"
                    className="form-control"
                    {...register("fax")}
                  />
                </div>
                
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
}

export default NewCaseExpertModalOld