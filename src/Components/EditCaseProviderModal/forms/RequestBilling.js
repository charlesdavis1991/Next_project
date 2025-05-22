import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormSubmittingStatus,
  setIsFormSubmitting,
} from "../../../Redux/client-providers/clientProviderSlice";
import { getCaseId, getClientId } from "../../../Utils/helper";
import api from "../../../api/api";
import VerifyAction from "../VerifyAction";
import VerificationNote from "../VerificationNote";
import UnVerifyAction from "../UnVerifyAction";
import { useFormik } from "formik";
import { formatDateInputValue } from "../../../Utils/date";

export default function RequestBilling() {
  const formRef = useRef(null);

  const dispatch = useDispatch();
  const clientProvider = useSelector((state) => state.clientProvider);
  const states = clientProvider?.states;
  const editCaseProvider = clientProvider?.editCaseProvider;
  const billingRequest = editCaseProvider?.billing_request;

  const editCaseProviderTab = clientProvider?.editCaseProviderTab;
  const isFormSubmitting = clientProvider?.isFormSubmitting;
  const verifications = clientProvider?.verifications;

  const fieldVerified = (field_name) => {
    const verification = verifications[field_name];
    if (verification) {
      return verification;
    }
    return false;
  };

  const billingOrdered = fieldVerified("billing_ordered");
  const billingReceived = fieldVerified("billing_received");

  const { handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      address_block_name: "billing_request",
      billing_ordered: editCaseProvider?.billing_ordered || "",
      case_provider_id: editCaseProvider?.id || "",
      billing_received: editCaseProvider?.billing_received || "",
      medical_name: billingRequest?.name || "",
      medical_address1: billingRequest?.address1 || "",
      medical_address2: billingRequest?.address2 || "",
      medical_city: billingRequest?.city || "",
      medical_state: billingRequest?.state || "",
      medical_zip: billingRequest?.zip || "",
      medical_phone: billingRequest?.phone_number || "",
      medical_fax: billingRequest?.fax || "",
      medical_email: billingRequest?.email || "",
      medical_website: billingRequest?.website || "",
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
              formKey: "billing_request",
              status: "success",
            })
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(
            setFormSubmittingStatus({
              formKey: "billing_request",
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
    <form id="editClientForm2_billing_request" ref={formRef}>
      <input type="hidden" name="address_block_name" value="billing_request" />
      <input
        type="hidden"
        name="case_provider_id"
        value={editCaseProvider?.id}
      />
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">
            <nobr>{/* Billing */} Ordered</nobr>
          </span>
        </div>
        <div className="col-md-11 d-flex ">
          <input
            type="date"
            value={formatDateInputValue(values.billing_ordered)}
            onChange={handleChange}
            className="form-control"
            min="1000-01-01"
            max="9999-12-31"
            name="billing_ordered"
          />
          <div className="d-flex  align-items-center">
            {billingOrdered &&
            billingOrdered?.action?.toLowerCase() === "verified" ? (
              <UnVerifyAction
                fieldName="billing_ordered"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            ) : (
              <VerifyAction
                fieldName="billing_ordered"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            )}
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={billingOrdered} />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">
            <nobr>{/* Billing */} Received</nobr>
          </span>
        </div>
        <div className="col-md-11 d-flex ">
          <input
            type="date"
            value={formatDateInputValue(values.billing_received)}
            onChange={handleChange}
            className="form-control"
            min="1000-01-01"
            max="9999-12-31"
            name="billing_received"
          />
          <div className="d-flex  align-items-center">
            {billingReceived &&
            billingReceived?.action?.toLowerCase() === "verified" ? (
              <UnVerifyAction
                fieldName="billing_received"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            ) : (
              <VerifyAction
                fieldName="billing_received"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            )}
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={billingReceived} />
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
                value={values.medical_address2}
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
            <div className="col-md-2">
              <input
                type="text"
                placeholder="Enter City"
                value={values.medical_city}
                onChange={handleChange}
                className="form-control col-md-9"
                name="medical_city"
              />
            </div>
            <div className="col-md-2">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-3">
                State
              </span>
            </div>
            <div className="col-md-3">
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
                value={values.medical_zip}
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
                value={values.medical_phone}
                onChange={handleChange}
                className="form-control"
                name="medical_phone"
              />
            </div>
            <div className="col-md-2">
              <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3">
                Fax
              </span>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                placeholder="Enter fax"
                value={values.medical_fax}
                onChange={handleChange}
                className="form-control col-md-9"
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
        </div>
      </div>
    </form>
  );
}
