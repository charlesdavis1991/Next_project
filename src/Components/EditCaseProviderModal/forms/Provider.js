import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormSubmittingStatus,
  setIsFormSubmitting,
} from "../../../Redux/client-providers/clientProviderSlice";
import api from "../../../api/api";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { useFormik } from "formik";

export default function Provider() {
  const dispatch = useDispatch();
  const caseProviderSpecialties = useSelector(
    (state) => state?.clientProvider?.specialties
  );
  const editCaseProvider = useSelector(
    (state) => state.clientProvider?.editCaseProvider
  );
  const states = useSelector((state) => state.clientProvider?.states);
  const formRef = useRef(null);
  const editCaseProviderTab = useSelector(
    (state) => state.clientProvider?.editCaseProviderTab
  );
  const formSubmittingStatus = useSelector(
    (state) => state.clientProvider?.formSubmittingStatus
  );
  const isFormSubmitting = useSelector(
    (state) => state.clientProvider?.isFormSubmitting
  );
  const activeTabId = useSelector(
    (state) => state.clientProvider?.editCaseProviderTab
  );

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      address_block_name: "",
      case_provider_id: editCaseProvider?.id || "",
      provider_name: editCaseProvider?.panel_name || "",
      provider_specialty: editCaseProvider?.specialty?.id || "",
      location_address1: editCaseProvider?.location?.address || "",
      location_address2: editCaseProvider?.location?.address2 || "",
      location_city: editCaseProvider?.location?.city || "",
      location_state: editCaseProvider?.location?.state || "",
      location_zip: editCaseProvider?.location?.post_code || "",
      location_phone: editCaseProvider?.location?.phone || "",
      location_fax: editCaseProvider?.location?.fax || "",
      location_email: editCaseProvider?.location?.email || "",
      location_website: editCaseProvider?.location?.website || "",
    },
    onSubmit: (values) => {
      const clientId = getClientId();
      const caseId = getCaseId();
      api
        .post(`/api/medical_treatment_provider/${clientId}/${caseId}/`, values)
        .then((response) => {
          console.log("Response: ", response);
          dispatch(
            setFormSubmittingStatus({ formKey: "provider", status: "success" })
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(
            setFormSubmittingStatus({ formKey: "provider", status: "error" })
          );
        });

      dispatch(setIsFormSubmitting(false));
    },
  });

  useEffect(() => {
    if (isFormSubmitting) {
      handleSubmit();
    }
  }, [isFormSubmitting]);
  return (
    <form
      id="editClientForm2_provider"
      // action="/30/editClientInfo2/3/4/"
      ref={formRef}
    >
      <input type="hidden" name="address_block_name" value="" />
      <input
        type="hidden"
        name="case_provider_id"
        value={editCaseProvider?.id}
      />

      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Provider Name*</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="Enter name"
            value={values?.provider_name}
            onChange={handleChange}
            className="form-control"
            name="provider_name"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Specialty</span>
        </div>
        <div className="col-md-10">
          <select
            name="provider_specialty"
            id=""
            className="form-select form-control"
            value={values?.provider_specialty}
            onChange={handleChange}
          >
            {caseProviderSpecialties &&
              caseProviderSpecialties?.map((caseProviderSpecialty) => (
                <option
                  value={caseProviderSpecialty?.id}
                  key={caseProviderSpecialty?.id}
                  selected={
                    editCaseProvider?.specialty?.id === caseProviderSpecialty?.id
                  }
                >
                  {caseProviderSpecialty?.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">
            <nobr>Addr. 1</nobr>
          </span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="Enter Address 1"
            value={values?.location_address1}
            onChange={handleChange}
            className="form-control"
            name="location_address1"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">
            <nobr>Addr. 2</nobr>
          </span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="Enter Address 2"
            value={values?.location_address2}
            onChange={handleChange}
            className="form-control"
            name="location_address2"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-40-Px">
            City
          </span>
        </div>
        <div className="col-md-2 text-left">
          <input
            type="text"
            placeholder="Enter City"
            value={values?.location_city}
            onChange={handleChange}
            className="form-control col-md-9"
            name="location_city"
          />
        </div>
        <div className="col-md-2 text-left">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
            State
          </span>
        </div>
        <div className="col-md-3 text-left">
          <select
            name="location_state"
            id=""
            className="form-select form-control  col-md-9"
            value={values?.location_state}
            onChange={handleChange}
          >
            {states &&
              states?.map((stateItem) => (
                <option
                  value={stateItem?.StateAbr}
                  selected={
                    editCaseProvider?.location?.state === stateItem?.StateAbr
                  }
                  key={stateItem?.id}
                >
                  {stateItem?.name}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-1">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
            Zip
          </span>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            placeholder="Enter Zip"
            value={values?.location_zip}
            onChange={handleChange}
            className="form-control col-md-9"
            name="location_zip"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2">
          <span className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-25-Px">
            Phone
          </span>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            placeholder="Enter Phone"
            value={values?.location_phone}
            onChange={handleChange}
            className="form-control"
            name="location_phone"
          />
        </div>
        <div className="col-md-2">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
            Fax
          </span>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            placeholder="Enter fax"
            value={values?.location_fax}
            onChange={handleChange}
            className="form-control col-md-9"
            name="location_fax"
          />
        </div>
        <div className="col-md-2">
          <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
            Email
          </span>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            placeholder="Enter Email"
            value={values?.location_email}
            onChange={handleChange}
            className="form-control"
            name="location_email"
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">
            <nobr>Website</nobr>
          </span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder="Enter Website Url"
            value={values?.location_website}
            onChange={handleChange}
            className="form-control"
            name="location_website"
          />
        </div>
      </div>
      <div className="col-md d-md-flex">* Cannot be Blank</div>
    </form>
  );
}
