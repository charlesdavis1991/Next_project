import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewClientInExistingCase } from "../../Redux/case/actions";
import { formatDate, getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";
import { fetchCaseSummary } from "../../api/case";
import { setCaseSummary } from "../../Redux/caseData/caseDataSlice";

const AddNewClientModal = ({ setOpen, open }) => {
  const currentCase = useSelector((state) => state?.caseData?.current);
  const caseSummary = useSelector((state) => state?.caseData?.summary);
  const client = useSelector((state) => state?.client?.current);
  const dispatch = useDispatch();

  useEffect(() => {}, [currentCase]);
  const [clientData, setClientData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dob: "yyyy-mm-dd",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    states: "",
    post_code: "",
    insurance_type: "",
    source_name: "",
    source: "",
    source_type: "",
    ad_date: "yyyy-mm-dd",
    ad_time: "",
    ad_location: "",
    ad_location_address1: "",
    ad_location_address2: "",
    ad_location_city: "",
    ad_location_state: "",
    ad_location_zip: "",
    plaintiff_insurance: "",
    policy_number: "",
    claim_number: "",
    intake_notes: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (currentCase && client) {
        console.log("clientData: ", clientData);
        const clientId = getClientId();
        const caseId = getCaseId();
        api
          .post(`/api/newClientExistingCase/${clientId}/${caseId}/`, clientData)
          .then((response) => {
            console.log("response", response);
            if (response.status === 200) {
              fetchCaseSummary(getClientId(), getCaseId())
                .then((data) => {
                  dispatch(setCaseSummary(data));
                  setOpen(false);
                })
                .catch((err) => {
                  console.log("Error occurred", err);
                  setOpen(false);
                });
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            setOpen(false);
          });
        // dispatch(
        //   createNewClientInExistingCase({
        //     ...clientData,
        //     client_id: client.id || 3,
        //     case_id: currentCase.id || 2,
        //   })
        // );
        // setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };
  const handleClear = () => {
    setClientData({
      first_name: "",
      last_name: "",
      email: "",
      dob: "yyyy-mm-dd",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      states: "",
      post_code: "",
      insurance_type: "",
      source_name: "",
      source: "",
      source_type: "",
      ad_date: "yyyy-mm-dd",
      ad_time: "",
      ad_location: "",
      ad_location_address1: "",
      ad_location_address2: "",
      ad_location_city: "",
      ad_location_state: "",
      ad_location_zip: "",
      plaintiff_insurance: "",
      policy_number: "",
      claim_number: "",
      intake_notes: "",
    });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const newDiv = document.createElement("div");
      newDiv.className = "modal-backdrop show";
      document.body.classList.add("modal-open", "has-blurred-bg");
      document.body.appendChild(newDiv);
    }
    return () => {
      const divToRemove = document.querySelector(".modal-backdrop.show");
      document.body.classList.remove("modal-open", "has-blurred-bg");
      if (divToRemove) {
        document.body.removeChild(divToRemove);
      }
    };
  }, [open]);
  return (
    <div
      className={`modal ${open ? "d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden={!open}
    >
      <div
        className="modal-dialog modal-dialog-3-max-width modal-dialog-centered "
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              <img
                src="/BP_resources/images/icon/image1.png"
                className="modal-title-img mr-2"
              />
              Add New Client for Existing Case
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => handleClear()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="container-fluid px-0 clienthead  top-head pt-4">
              <div className="row" id="other-parties-page">
                <div className="col-lg-12 addNewCase-padding-left-10px">
                  <div className="mb-0">
                    <div className="px-2">
                      <div className="row">
                        <div className="col-md-12 addNewCase-height-48px mb-3">
                          <input
                            type="hidden"
                            name="existing_case_id"
                            id="case_id"
                          />
                          {currentCase && (
                            <p>
                              {currentCase.case_type?.name} Case DOI: with
                              {/* {formatDate(currentCase.incident_date)} &nbsp; */}
                              {currentCase.for_client.first_name} &nbsp;
                              {currentCase.for_client.last_name}
                              {caseSummary?.multipleClient_for_case?.map(
                                (client) => (
                                  <span>
                                    , {client.new_client.first_name}{" "}
                                    {client.new_client.last_name}
                                  </span>
                                )
                              )}
                            </p>
                          )}

                          <ul
                            className="card dropdown-menu search-menu p-0 m-0 addNewCase-display-flex-margin-top-45px-margin-left-0px-width-100P"
                            id="myDropdown2"
                          ></ul>
                        </div>
                        <div className="col-md-6">
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                First Name:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="first_name"
                                value={clientData.first_name}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter First Name"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Last Name:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="last_name"
                                value={clientData.last_name}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Last Name"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                DOB:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="date"
                                name="dob"
                                value={clientData.dob}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                min="1000-01-01"
                                max="9999-12-31"
                                placeholder="Enter DOB"
                                id="date"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Phone:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="phone"
                                value={clientData.phone}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Phone"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Email:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="email"
                                name="email"
                                value={clientData.email}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Email"
                              />
                            </div>
                          </div>

                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Address:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="address1"
                                value={clientData.address1}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Address 1"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3"></div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="address2"
                                value={clientData.address2}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Address 2"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3"></div>
                            <div className="col-md-4 pr-0">
                              <input
                                type="text"
                                name="city"
                                value={clientData.city}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter City"
                              />
                            </div>
                            <div className="col-md-3 addNewCase-padding-0-5px">
                              <select
                                name="states"
                                value={clientData.states}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                              >
                                <option selected value="">
                                  State
                                </option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                              </select>
                            </div>
                            <div className="col-md-2 pl-0">
                              <input
                                type="text"
                                name="post_code"
                                value={clientData.post_code}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter ZIP"
                              />
                            </div>
                          </div>

                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Intake Notes:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <textarea
                                cols="30"
                                name="intake_notes"
                                value={clientData.intake_notes}
                                onChange={handleChange}
                                className="addNewCase-height-121px form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Intake Notes"
                              ></textarea>
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                <nobr>Plaintiff Insurance:</nobr>
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="plaintiff_insurance"
                                value={clientData.plaintiff_insurance}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Plaintiff insurance company"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Policy #:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="policy_number"
                                value={clientData.policy_number}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Policy #"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Claim #:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="claim_number"
                                value={clientData.claim_number}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Claim #"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                <nobr>Source Generally:</nobr>
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="source"
                                value={clientData.source}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter How Did You Hear About Us?"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Source Type:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <select
                                name="source_type"
                                value={clientData.source_type}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                              >
                                <option value="CT1">Case Type 1</option>
                                <option value="CT2">Case Type 2</option>
                                <option value="CT3">Case Type 3</option>
                              </select>
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Source Name:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="source_name"
                                value={clientData.source_name}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Source Name"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Ad date:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <div className="row align-items-center">
                                <div className="col-md-5">
                                  <input
                                    placeholder="Enter Ad date"
                                    className="form-control no-bootstrap-focus no-bootstrap-effect"
                                    min="1000-01-01"
                                    max="9999-12-31"
                                    id="date"
                                    type="date"
                                    name="ad_date"
                                    value={clientData.ad_date}
                                    onChange={handleChange}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <p className="text-secondary addNewCase-color-000">
                                    <nobr>Ad Time:</nobr>
                                  </p>
                                </div>
                                <div className="col-md-5">
                                  <input
                                    type="time"
                                    name="ad_time"
                                    value={clientData.ad_time}
                                    onChange={handleChange}
                                    className="form-control no-bootstrap-focus no-bootstrap-effect"
                                    placeholder="Enter Ad Time"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                Ad location:
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="ad_location"
                                value={clientData.ad_location}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Ad Location"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3">
                              <p className="text-secondary addNewCase-color-000">
                                <nobr> Ad Location Addr:</nobr>
                              </p>
                            </div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="ad_location_address1"
                                value={clientData.ad_location_address1}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Ad Location Address 1"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3"></div>
                            <div className="col-md-9">
                              <input
                                type="text"
                                name="ad_location_address2"
                                value={clientData.ad_location_address2}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Ad Location Address 2"
                              />
                            </div>
                          </div>
                          <div className="row mb-1 align-items-center">
                            <div className="col-md-3"></div>
                            <div className="col-md-4 pr-0">
                              <input
                                type="text"
                                name="ad_location_city"
                                value={clientData.ad_location_city}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Ad City"
                              />
                            </div>
                            <div className="col-md-3 addNewCase-padding-0-5px">
                              <select
                                name="ad_location_state"
                                value={clientData.ad_location_state}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                              >
                                <option selected value="">
                                  State
                                </option>
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
                              </select>
                            </div>
                            <div className="col-md-2 pl-0">
                              <input
                                type="text"
                                name="ad_location_zip"
                                value={clientData.ad_location_zip}
                                onChange={handleChange}
                                className="form-control no-bootstrap-focus no-bootstrap-effect"
                                placeholder="Enter Ad ZIP"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer px-0 justify-content-between mt-4 BottomGap">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleClear()}
                          data-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewClientModal;
