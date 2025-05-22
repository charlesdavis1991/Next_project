import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import api from "../../../api/api";
import {
  setFormSubmittingStatus,
  setIsFormSubmitting,
} from "../../../Redux/client-providers/clientProviderSlice";
import VerificationNote from "../VerificationNote";
import UnVerifyAction from "../UnVerifyAction";
import VerifyAction from "../VerifyAction";
import { formatDateInputValue } from "../../../Utils/date";
import { useFormik } from "formik";

export default function RecordsRequest() {
  const dispatch = useDispatch();

  const clientProvider = useSelector((state) => state.clientProvider);
  const states = clientProvider?.states;
  const editCaseProvider = clientProvider?.editCaseProvider;
  const requestRecords = editCaseProvider?.records_request;

  const editCaseProviderTab = useSelector(
    (state) => state.clientProvider?.editCaseProviderTab
  );
  const isFormSubmitting = useSelector(
    (state) => state.clientProvider?.isFormSubmitting
  );

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

  const recordOrdered = fieldVerified("record_ordered");
  const recordReceived = fieldVerified("record_received");

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      address_block_name: "records_request",
      case_provider_id: editCaseProvider?.id,
      records_ordered:
        formatDateInputValue(editCaseProvider?.record_ordered) || "",
      records_received:
        formatDateInputValue(editCaseProvider?.record_received) || "",
      medical_name: requestRecords?.name || "",
      medical_address1: requestRecords?.address1 || "",
      medical_address2: requestRecords?.address2 || "",
      medical_city: requestRecords?.city || "",
      medical_state: requestRecords?.state || "",
      medical_zip: requestRecords?.zip || "",
      medical_phone: requestRecords?.phone_number || "",
      medical_fax: requestRecords?.fax || "",
      medical_email: requestRecords?.email || "",
      medical_website: requestRecords?.website || "",
    },
    onSubmit: (values) => {
      const clientId = getClientId();
      const caseId = getCaseId();
      api
        .post(`/api/medical_contact_panel/${clientId}/${caseId}/`, values)
        .then((response) => {
          console.log("Response: ", response);
          dispatch(setFormSubmittingStatus({ formKey: "records_request", status: "success" }));
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(setFormSubmittingStatus({ formKey: "records_request", status: "error" }));
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
    <form id="editClientForm2_records_request">
      <input type="hidden" name="address_block_name" value="records_request" />
      <input
        type="hidden"
        name="case_provider_id"
        value={editCaseProvider?.id}
      />
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">
            {/* Records*/} Ordered
          </span>
        </div>
        <div className="col-md-11 d-flex ">
          <input
            type="date"
            min="1000-01-01"
            max="9999-12-31"
            value={values.records_ordered}
            onChange={handleChange}
            className="form-control"
            name="records_ordered"
          />
          <div className="d-flex  align-items-center">
            {recordOrdered &&
            recordOrdered?.action?.toLowerCase() === "verified" ? (
              <UnVerifyAction
                fieldName="record_ordered"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            ) : (
              <VerifyAction
                fieldName="record_ordered"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            )}
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={recordOrdered} />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">
            {/* Records*/} Received
          </span>
        </div>
        <div className="col-md-11 d-flex ">
          <input
            type="date"
            min="1000-01-01"
            max="9999-12-31"
            value={values.records_received}
            onChange={handleChange}
            className="form-control"
            name="records_received"
          />
          <div className="d-flex  align-items-center">
            {recordReceived &&
            recordReceived?.action?.toLowerCase() === "verified" ? (
              <UnVerifyAction
                fieldName="record_received"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            ) : (
              <VerifyAction
                fieldName="record_received"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            )}
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={recordReceived} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
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
        <div className="col-md-7">
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block text-grey">Name*</span>
            </div>
            <div className="col-md-10">
              <input
                type="text"
                placeholder="Enter name"
                value={values.medical_name}
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
                value={values.medical_address1}
                onChange={handleChange}
                name="medical_address1"
                className="form-control"
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
                value={values.medical_address2}
                onChange={handleChange}
                className="form-control"
                name="medical_address2"
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
                value={values.medical_city}
                onChange={handleChange}
                className="form-control"
                name="medical_city"
              />
            </div>
            <div className="col-md-2 text-left">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                State
              </span>
            </div>
            <div className="col-md-3 text-left">
              {/* <select
                name="medical_state"
                id=""
                className="form-select form-control"
              >
                {states &&
                  states.map((stateItem) => (
                    <option
                      value={stateItem.StateAbbr}
                      selected={stateItem.StateAbbr === requestRecords?.state}
                      key={stateItem.StateAbbr}
                    >
                      {stateItem.name}
                    </option>
                  ))}
              </select> */}
              <select
                name="medical_state"
                id=""
                className="form-select form-control  col-md-9"
                value={values.medical_state}
                onChange={handleChange}
              >
                {states &&
                  states?.map((stateItem) => (
                    <option
                      value={stateItem?.StateAbr}
                      selected={
                        editCaseProvider?.location?.state ===
                        stateItem?.StateAbr
                      }
                      key={stateItem?.id}
                    >
                      {stateItem?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-1 text-left">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                Zip
              </span>
            </div>
            <div className="col-md-2 text-left">
              <input
                type="text"
                placeholder="Enter Zip"
                value={values.medical_zip}
                onChange={handleChange}
                className="form-control"
                name="medical_zip"
              />
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block white-space-no-wrapping text-grey align-self-center T-MR-25-Px">
                Phone
              </span>
            </div>
            <div className="col-md-2 text-left">
              <input
                type="text"
                placeholder="Enter Phone"
                value={values.medical_phone}
                onChange={handleChange}
                className="form-control"
                name="medical_phone"
              />
            </div>
            <div className="col-md-2 text-left">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                Fax
              </span>
            </div>
            <div className="col-md-2 text-left">
              <input
                type="text"
                placeholder="Enter fax"
                value={values.medical_fax}
                onChange={handleChange}
                className="form-control"
                name="medical_fax"
              />
            </div>
            <div className="col-md-2 text-left">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                Email
              </span>
            </div>
            <div className="col-md-2 text-left">
              <input
                type="text"
                placeholder="Enter Email"
                value={values.medical_email}
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
                value={values.medical_website}
                onChange={handleChange}
                className="form-control"
                name="medical_website"
              />
            </div>
          </div>
          <div className="col-md d-md-flex">* Cannot be Blank</div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
