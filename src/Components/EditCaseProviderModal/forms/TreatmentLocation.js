import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormSubmittingStatus,
  setIsFormSubmitting,
} from "../../../Redux/client-providers/clientProviderSlice";
import api from "../../../api/api";
import { getCaseId, getClientId } from "../../../Utils/helper";
import VerificationNote from "../VerificationNote";
import UnVerifyAction from "../UnVerifyAction";
import VerifyAction from "../VerifyAction";
import { useFormik } from "formik";

export default function TreatmentLocation() {
  const formRef = useRef(null);
  const dispatch = useDispatch();

  const editCaseProvider = useSelector(
    (state) => state.clientProvider?.editCaseProvider
  );
  const states = useSelector((state) => state.clientProvider?.states);
  const treatmentComplete = editCaseProvider?.treatment_complete;
  const treatmentLocation = editCaseProvider?.treatment_location;

  const verifications = useSelector(
    (state) => state.clientProvider?.verifications
  );

  const fieldVerified = (field_name) => {
    const verification = verifications[field_name];
    if (verification) {
      return verification;
    }
    return false;
  };

  const treatmentVerified = fieldVerified("treatment_complete");

  const isFormSubmitting = useSelector(
    (state) => state.clientProvider?.isFormSubmitting
  );

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: {
      address_block_name: "treatment_location",
      case_provider_id: editCaseProvider?.id || "",
      medical_name: treatmentLocation?.name || "",
      medical_address1: treatmentLocation?.address1 || "",
      medical_address2: treatmentLocation?.address2 || "",
      medical_city: treatmentLocation?.city || "",
      medical_state: treatmentLocation?.state || "",
      medical_zip: treatmentLocation?.zip || "",
      medical_phone: treatmentLocation?.phone_number || "",
      medical_fax: treatmentLocation?.fax || "",
      medical_email: treatmentLocation?.email || "",
      medical_website: treatmentLocation?.website || "",
      treatment_complete: treatmentComplete || "",
    },
    onSubmit: (values) => {
      const clientId = getClientId();
      const caseId = getCaseId();
      api
        .post(`/api/medical_contact_panel/${clientId}/${caseId}/`, values)
        .then((response) => {
          console.log("Response: ", response);
          dispatch(
            setFormSubmittingStatus({
              formKey: "treatment_location",
              status: "success",
            })
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(
            setFormSubmittingStatus({
              formKey: "treatment_location",
              status: "error",
            })
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
    <form id="editClientForm2_treatment_location" ref={formRef}>
      <input
        type="hidden"
        name="address_block_name"
        value="treatment_location"
      />
      <input
        type="hidden"
        name="case_provider_id"
        value={editCaseProvider?.id}
      />
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">Complete?</span>
        </div>
        <div className="col-md-11">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex justify-content-around align-items-center ml-3">
              <label className="mr-3 mb-0">
                <input
                  type="radio"
                  name="treatment_complete"
                  value={values?.treatment_complete}
                  defaultChecked={
                    values?.treatment_complete?.toUpperCase() === "YES"
                  }
                  onChange={(e) => {
                    setFieldValue("treatment_complete", "YES");
                  }}
                />{" "}
                Yes
              </label>
              <label className="mb-0">
                <input
                  type="radio"
                  name="treatment_complete"
                  value={values?.treatment_complete}
                  defaultChecked={
                    values?.treatment_complete?.toUpperCase() === "NO"
                  }
                  onChange={(e) => {
                    setFieldValue("treatment_complete", "NO");
                  }}
                />{" "}
                No
              </label>
            </div>
            <div className="d-flex  align-items-center">
              {treatmentVerified &&
              treatmentVerified?.action?.toLowerCase() === "verified" ? (
                <UnVerifyAction
                  fieldName="treatment_complete"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              ) : (
                <VerifyAction
                  fieldName="treatment_complete"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={treatmentVerified} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div>
            <p
              className="text-white provider_specialty"
              style={{
                backgroundColor: editCaseProvider?.specialty?.color,
                width: "fit-content",
                padding: 5,
              }}
            >
              {editCaseProvider?.specialty?.name}
            </p>
            <br />
            <p className="provider_name">{editCaseProvider?.panel_name}</p>
            <br />
            <p>
              <span className="location_address1">
                {editCaseProvider?.location?.address},{" "}
              </span>
              <span className="location_address2">
                {editCaseProvider?.location?.address2}
              </span>
            </p>
            <br />
            <p>
              <span className="location_city">
                {editCaseProvider?.location?.city},{" "}
              </span>
              <span className="location_state">
                {editCaseProvider?.location?.state},{" "}
              </span>
              <span className="location_zip">
                {editCaseProvider?.location?.post_code}
              </span>
            </p>
          </div>
        </div>
        <div className="col-md-9">
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Name*</span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter name"
                value={values?.medical_name}
                onChange={handleChange}
                className="form-control"
                name="medical_name"
              />
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
                value={values?.medical_address1}
                onChange={handleChange}
                className="form-control"
                name="medical_address1"
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
                value={values?.medical_address2}
                onChange={handleChange}
                className="form-control"
                name="medical_address2"
              />
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div className="col-md-2">
              <span className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-40-Px">
                City
              </span>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Enter City"
                value={values?.medical_city}
                onChange={handleChange}
                className="form-control"
                name="medical_city"
              />
            </div>
            <div className="col-md-2">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                State
              </span>
            </div>
            <div className="col-md-2">
              <select
                name="medical_state"
                id=""
                className="form-select form-control"
                value={values?.medical_state}
                onChange={handleChange}
              >
                {states &&
                  states?.map((stateItem) => (
                    <option
                      value={stateItem?.StateAbr}
                      key={stateItem?.StateAbr}
                      selected={stateItem?.StateAbr === values?.medical_state}
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
                value={values?.medical_zip}
                onChange={handleChange}
                className="form-control"
                name="medical_zip"
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
                value={values?.medical_phone}
                onChange={handleChange}
                className="form-control"
                name="medical_phone"
              />
            </div>
            <div className="col-md-1">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                Fax
              </span>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Enter fax"
                value={values?.medical_fax}
                onChange={handleChange}
                className="form-control"
                name="medical_fax"
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
                value={values?.medical_email}
                onChange={handleChange}
                className="form-control"
                name="medical_email"
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
                value={values?.medical_website}
                onChange={handleChange}
                className="form-control"
                name="medical_website"
              />
            </div>
          </div>
          <div className="col-md d-md-flex">* Cannot be Blank</div>
        </div>
      </div>
    </form>
  );
}
