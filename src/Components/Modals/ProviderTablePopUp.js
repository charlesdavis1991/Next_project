import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { getCaseId, getClientId } from "../../Utils/helper";

function ProviderTablePopUp({
  providerPopUp,
  handleClose,
  handleDelete,
  handleSave,
  providerData,
}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const tokenBearer = localStorage.getItem("token");

  const { statesData } = useSelector((state) => state.states);
  const [specialityFirstColumn, setSpecialityFirstColumn] = useState([]);
  const [specialitySecondColumn, setSpecialitySecondColumn] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name_provider: "",
    speciality_first_checkbox: [],
    speciality_second_checkbox: [],
    website: "",
    provider_email: "",
    provider_address: "",
    provider_city: "",
    provider_state: "",
    provider_zip: "",
    provider_phone: "",
    provider_fax: "",
    provider_email: "",

    record_name: "",
    record_address: "",
    record_address2: "",
    record_city: "",
    record_zip: "",
    record_state: "",
    record_spost_code: "",
    record_phone: "",
    record_fax: "",
    record_email: "",

    billing_name: "",
    billing_address: "",
    billing_address2: "",
    billing_city: "",
    billing_zip: "",
    billing_state: "",
    billing_spost_code: "",
    billing_phone: "",
    billing_fax: "",
    billing_email: "",

    pay_record_name: "",
    pay_record_address: "",
    pay_record_address2: "",
    pay_record_city: "",
    pay_record_zip: "",
    pay_record_state: "",
    pay_record_spost_code: "",
    pay_record_phone: "",
    pay_record_fax: "",
    pay_record_email: "",

    pay_billing_name: "",
    pay_billing_address: "",
    pay_billing_address2: "",
    pay_billing_city: "",
    pay_billing_zip: "",
    pay_billing_state: "",
    pay_billing_spost_code: "",
    pay_billing_phone: "",
    pay_billing_fax: "",
    pay_billing_email: "",
  });

  useEffect(() => {
    console.log(providerData, "::::::::::::::::");
    if (providerData) {
      setForm({
        name_provider: providerData.added_by.providerprofile.first_name || "",
        speciality_first_checkbox: providerData.speciality_first_checkbox || [],
        speciality_second_checkbox:
          providerData.added_by.speciality_second_checkbox || [],
        website: providerData.added_by.providerprofile.website || "",
        provider_email:
          providerData.added_by.providerprofile.provider_email || "",
        provider_address: providerData.provider_address || "",
        provider_city: providerData.provider_city || "",
        provider_state: providerData.provider_state || "",
        provider_zip: providerData.provider_zip || "",
        provider_phone: providerData.provider_phone || "",
        provider_fax: providerData.provider_fax || "",
        record_name: providerData.record_name || "",
        record_address: providerData.record_address || "",
        record_address2: providerData.record_address2 || "",
        record_city: providerData.record_city || "",
        record_zip: providerData.record_zip || "",
        record_state: providerData.record_state || "",
        record_spost_code: providerData.record_spost_code || "",
        record_phone: providerData.record_phone || "",
        record_fax: providerData.record_fax || "",
        record_email: providerData.record_email || "",
        billing_name: providerData.billing_name || "",
        billing_address: providerData.billing_address || "",
        billing_address2: providerData.billing_address2 || "",
        billing_city: providerData.billing_city || "",
        billing_zip: providerData.billing_zip || "",
        billing_state: providerData.billing_state || "",
        billing_spost_code: providerData.billing_spost_code || "",
        billing_phone: providerData.billing_phone || "",
        billing_fax: providerData.billing_fax || "",
        billing_email: providerData.billing_email || "",
        pay_record_name: providerData.pay_record_name || "",
        pay_record_address: providerData.pay_record_address || "",
        pay_record_address2: providerData.pay_record_address2 || "",
        pay_record_city: providerData.pay_record_city || "",
        pay_record_zip: providerData.pay_record_zip || "",
        pay_record_state: providerData.pay_record_state || "",
        pay_record_spost_code: providerData.pay_record_spost_code || "",
        pay_record_phone: providerData.pay_record_phone || "",
        pay_record_fax: providerData.pay_record_fax || "",
        pay_record_email: providerData.pay_record_email || "",
        pay_billing_name: providerData.pay_billing_name || "",
        pay_billing_address: providerData.pay_billing_address || "",
        pay_billing_address2: providerData.pay_billing_address2 || "",
        pay_billing_city: providerData.pay_billing_city || "",
        pay_billing_zip: providerData.pay_billing_zip || "",
        pay_billing_state: providerData.pay_billing_state || "",
        pay_billing_spost_code: providerData.pay_billing_spost_code || "",
        pay_billing_phone: providerData.pay_billing_phone || "",
        pay_billing_fax: providerData.pay_billing_fax || "",
        pay_billing_email: providerData.pay_billing_email || "",
      });
    }
  }, [providerData]);

  const getSpecialityData = async () => {
    try {
      const response = await axios.get(`${origin}/api/get/speciality/`, {
        headers: {
          Authorization: tokenBearer,
        },
      });
      const responseData = response.data;
      setSpecialityFirstColumn(responseData.speciality_first_column);
      setSpecialitySecondColumn(responseData.speciality_second_column);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSpecialityData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${origin}/api/medical_treatment_provider/${clientId}/${currentCaseId}/`,
        form,
        {
          headers: {
            Authorization: `Bearer ${tokenBearer}`,
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        // console.log(response.status)
      }
      handleSave(response.data.data);
    } catch (error) {
      console.error("Error saving provider data:", error.message);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${origin}/api/medical_treatment_provider/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: `Bearer ${tokenBearer}`,
          },
        }
      );
      handleDelete(response.data.data);
    } catch (error) {
      console.error("Error deleting provider data:", error.message);
    }
  };

  return (
    <Modal
      show={providerPopUp ? true : false}
      onHide={handleClose}
      dialogClassName="modal-dialog-centered"
    >
      <div className="modal-content">
        <div className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center">
          <h5
            className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
            id="exampleModalLabel"
          >
            Edit Medical Provider
          </h5>
        </div>
        <p className="p-l-10 p-r-10 p-t-5 p-b-5 client-popup-border text-center">
          Input your new medical provider's information here.
        </p>
        <div
          className="modal-body"
          id="modal-body-block"
          style={{ overflowY: "auto", maxHeight: "calc(100% - 100px)" }}
        >
          <input type="hidden" id="provider_id" name="provider_id" value="" />
          <input type="hidden" id="location_id" name="location_id" value="" />
          <div className="row align-items-center form-group m-b-5">
            <div className="col-md-4">
              <input
                type="text"
                name="name_provider"
                value={form.name_provider}
                placeholder="Enter Name of Provider"
                required
                className="form-control height-25 p-1"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                name="website"
                placeholder="Enter Website Url"
                required
                className="form-control height-25 p-1"
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-black">Searchable</span>
            </div>
            <div className="col-md-2">
              <input type="checkbox" name="searchable" className="" />
            </div>
            <ul
              className="card dropdown-menu search-menu p-0 addMedicalProvider-display-flex-margin-top-0px-margin-left-0px-width-100P w-100 m-l-15 m-r-15 m-t-5 m-b-5"
              id="myDropdown1"
            ></ul>
          </div>
          <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
            <h4 className="text-center text-uppercase color-p0 align-self-end">
              Location
            </h4>
            <div className="d-flex">
              <button
                type="button"
                className="btn btn-primary btn-sm btn-copy d-flex align-items-center height-25 ml-1"
              >
                <p className="m-l-5">+ Add Location</p>
              </button>
            </div>
          </div>
          <div id="location_block">
            <div>
              <input type="hidden" name="location-latitude[]" id="latitude" />
              <input type="hidden" name="location-longitude[]" id="longitude" />
              <div
                className="row align-items-center form-group m-b-5"
                id="new-flex"
              >
                <div className="col-md-4 p-r-0">
                  <div className="row">
                    <input
                      type="text"
                      hidden
                      name="location-speciality[]"
                      className="selected_specialities"
                    />
                    <div className="col-md-6">
                      {specialitySecondColumn?.map((i) => (
                        <div className="form-check" key={i.id}>
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input speciality-checkbox"
                              value={i.id}
                            />{" "}
                            {i.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-6">
                      {specialityFirstColumn?.map((i) => (
                        <div className="form-check" key={i.id}>
                          <label className="form-check-label">
                            <input
                              type="checkbox"
                              className="form-check-input speciality-checkbox"
                              value={i.id}
                            />{" "}
                            {i.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="location-address[]"
                    id="location-address"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 1"
                    data-field="xaddress1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="location-address2[]"
                    id="location-address2"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 2"
                    data-field="xaddress2"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="location-city[]"
                    id="location-city"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter City"
                    data-field="xcity"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <select
                    name="location-state[]"
                    id="location-state"
                    data-field="xstate"
                    className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
                    onChange={handleChange}
                  >
                    
                    {statesData?.map((state) => (
                      <option value={state.StateAbr} key={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="location-post_code[]"
                    id="location-zip"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Zip"
                    data-field="xzip"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="location-phone[]"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Phone"
                    data-field="xphone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="location-fax[]"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Fax"
                    data-field="xfax"
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    name="location-email[]"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Email"
                    data-field="xemail"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end m-t-5 m-b-5 align-items-center">
                <div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-copy d-flex align-items-center height-25"
                  >
                    <i className="fa fa-clone me-1"></i>
                    <p className="m-l-5">Copy Location Address</p>
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
                <h4 className="text-center text-uppercase align-self-end color-p0">
                  Records Request
                </h4>
              </div>

              <div
                className="row align-items-center form-group m-b-5 other_location_block"
                id="new-flex"
              >
                <div className="col-md-2 p-r-0">
                  <input
                    name="record_name"
                    value={form.record_name}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Name"
                    data-field="xname"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="record_address"
                    value={form.record_address}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 1"
                    data-field="xaddress1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="record_address2"
                    value={form.record_address2}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 2"
                    data-field="xaddress2"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="record_city"
                    value={form.record_city}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter City"
                    data-field="xcity"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <select
                    name="record_state"
                    value={form.record_state}
                    id="location-state"
                    data-field="xstate"
                    className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
                    onChange={handleChange}
                  >
                    {statesData?.map((state) => (
                      <option value={state.StateAbr} key={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="record_spost_code"
                    value={form.record_spost_code}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Zip"
                    data-field="xzip"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="record_phone"
                    value={form.record_phone}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Phone"
                    data-field="xphone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="record_fax"
                    value={form.record_fax}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Fax"
                    data-field="xfax"
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    name="record_email"
                    value={form.record_email}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Email"
                    data-field="xemail"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
                <h4 className="text-center text-uppercase align-self-end color-p0">
                  Billing Request
                </h4>
              </div>
              <div
                className="row align-items-center form-group m-b-5 other_location_block"
                id="new-flex"
              >
                <div className="col-md-2 p-r-0">
                  <input
                    name="billing_name"
                    value={form.billing_name}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Name"
                    data-field="xname"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="billing_address1"
                    value={form.billing_address1}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 1"
                    data-field="xaddress1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="billing_address2"
                    value={form.billing_address2}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 2"
                    data-field="xaddress2"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="billing_city"
                    value={form.billing_city}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter City"
                    data-field="xcity"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <select
                    name="billing_state"
                    value={form.billing_state}
                    id="location-state"
                    data-field="xstate"
                    className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
                    onChange={handleChange}
                  >
                    {statesData?.map((state) => (
                      <option value={state.id} key={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="billing_zip"
                    value={form.billing_zip}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Zip"
                    data-field="xzip"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="billing_phone"
                    value={form.billing_phone}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Phone"
                    data-field="xphone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="billing_fax"
                    value={form.billing_fax}
                    type="text"
                    placeholder="Enter Fax"
                    data-field="xfax"
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    name="billing_email"
                    value={form.billing_email}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Email"
                    data-field="xemail"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
                <h4 className="text-center text-uppercase align-self-end color-p0">
                  Pay Records Req
                </h4>
              </div>
              <div
                className="row align-items-center form-group m-b-5 other_location_block"
                id="new-flex"
              >
                <div className="col-md-2 p-r-0">
                  <input
                    name="pay_record_name"
                    value={form.pay_record_name}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Name"
                    data-field="xname"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="pay_record_address"
                    value={form.pay_record_address}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 1"
                    data-field="xaddress1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="pay_record_address2"
                    value={form.pay_record_address2}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 2"
                    data-field="xaddress2"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_record_city"
                    value={form.pay_record_city}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter City"
                    data-field="xcity"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <select
                    name="pay_record_state"
                    value={form.pay_record_state}
                    id="location-state"
                    data-field="xstate"
                    className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
                    onChange={handleChange}
                  >
                    
                    {statesData?.map((state) => (
                      <option value={state.StateAbr} key={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_record_spost_code"
                    value={form.pay_record_spost_code}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Zip"
                    data-field="xzip"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_record_phone"
                    value={form.pay_record_phone}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Phone"
                    data-field="xphone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_record_fax"
                    value={form.pay_record_fax}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Fax"
                    data-field="xfax"
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    name="pay_record_email"
                    value={form.pay_record_email}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Email"
                    data-field="xemail"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
                <h4 className="text-center text-uppercase align-self-end color-p0">
                  Pay Billing Req
                </h4>
              </div>
              <div
                className="row align-items-center form-group m-b-5 other_location_block"
                id="new-flex"
              >
                <div className="col-md-2 p-r-0">
                  <input
                    name="pay_billing_name"
                    value={form.pay_billing_name}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Name"
                    data-field="xname"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="pay_billing_address"
                    value={form.pay_billing_address}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 1"
                    data-field="xaddress1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="pay_billing_address2"
                    value={form.pay_billing_address2}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 2"
                    data-field="xaddress2"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_billing_city"
                    value={form.pay_billing_city}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter City"
                    data-field="xcity"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <select
                    name="pay_billing_state"
                    value={form.pay_billing_state}
                    id="location-state"
                    data-field="xstate"
                    className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
                    onChange={handleChange}
                  >
                    {statesData?.map((state) => (
                      <option value={state.StateAbr} key={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_billing_zip"
                    value={form.pay_billing_zip}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Zip"
                    data-field="xzip"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_billing_phone"
                    value={form.pay_billing_phone}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Phone"
                    data-field="xphone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="pay_billing_fax"
                    value={form.pay_billing_fax}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Fax"
                    data-field="xfax"
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    name="pay_billing_email"
                    value={form.pay_billing_email}
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Email"
                    data-field="xemail"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between m-t-5 m-b-5 align-items-center">
                <h4 className="text-center text-uppercase align-self-end color-p0">
                  Lien Holder
                </h4>
              </div>
              <div
                className="row align-items-center form-group m-b-5 other_location_block"
                id="new-flex"
              >
                <div className="col-md-2 p-r-0">
                  <input
                    name="lien-name"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Name"
                    data-field="xname"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="lien-address"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 1"
                    data-field="xaddress1"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2 p-r-0">
                  <input
                    name="lien-address2"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Address 2"
                    data-field="xaddress2"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="lien-city"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter City"
                    data-field="xcity"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <select
                    name="lien-state"
                    id="location-state"
                    data-field="xstate"
                    className="form-select form-control height-25 p-t-0 p-b-0 p-l-5 p-r-5"
                    onChange={handleChange}
                  >
                    {statesData?.map((state) => (
                      <option value={state.StateAbr} key={state.StateAbr}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="lien-post_code"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Zip"
                    data-field="xzip"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="lien-phone"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Phone"
                    data-field="xphone"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-1 p-r-0">
                  <input
                    name="lien-fax"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Fax"
                    data-field="xfax"
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    name="lien-email"
                    className="form-control height-25 p-1"
                    type="text"
                    placeholder="Enter Email"
                    data-field="xemail"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary h-35px"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSaveClick}
          >
            Save changes to Provider Directory
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProviderTablePopUp;
