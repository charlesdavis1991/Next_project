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
import { formatDateInputValue } from "../../../Utils/date";
import { useFormik } from "formik";

export function RequestBillingPaid() {
  const formRef = useRef(null);

  const dispatch = useDispatch();

  const clientProvider = useSelector((state) => state.clientProvider);
  const states = clientProvider?.states;
  const editCaseProvider = clientProvider?.editCaseProvider;
  const billingRequestPaid = editCaseProvider?.billing_request_paid;

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

  const billsCost = fieldVerified("billsCost");
  const billsRequestPaid = fieldVerified("bills_request_paid");

  const { handleSubmit, handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      address_block_name: "billing_request_paid",
      case_provider_id: editCaseProvider?.id || "",
      bills_cost: editCaseProvider?.billsCost || "",
      billing_paid: editCaseProvider?.billing_paid || "",
      bills_request_paid: editCaseProvider?.bills_request_paid || "",
      medical_name: billingRequestPaid?.name || "",
      medical_address1: billingRequestPaid?.address1 || "",
      medical_address2: billingRequestPaid?.address2 || "",
      medical_city: billingRequestPaid?.city || "",
      medical_state: billingRequestPaid?.state || "",
      medical_zip: billingRequestPaid?.zip || "",
      medical_phone: billingRequestPaid?.phone_number || "",
      medical_fax: billingRequestPaid?.fax || "",
      medical_email: billingRequestPaid?.email || "",
      medical_website: billingRequestPaid?.website || "",
    },
    onSubmit: (values) => {
      const clientId = getClientId();
      const caseId = getCaseId();
      api
        .post(`/api/medical_contact_panel/${clientId}/${caseId}/`, values)
        .then((response) => {
          dispatch(
            setFormSubmittingStatus({
              formKey: "billing_request_paid",
              status: "success",
            })
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(
            setFormSubmittingStatus({
              formKey: "billing_request_paid",
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
    <form id="editClientForm2_billing_request_paid" ref={formRef}>
      <input
        type="hidden"
        name="address_block_name"
        value="billing_request_paid"
      />
      <input
        type="hidden"
        name="case_provider_id"
        value={editCaseProvider?.id}
      />
      <div className="row">
        <div className="col-md-5">
          <div className="row align-items-center form-group">
            <div className="col-md-1 text-left">
              <span className="d-inline-block text-grey">
                <nobr>Cost</nobr>
              </span>
            </div>
            <div className="col-md-11 d-flex">
              <input
                type="number"
                placeholder="Enter Cost"
                value={values.bills_cost}
                onChange={handleChange}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setFieldValue("bills_cost", "0.00");
                  } else {
                    const floatValue = parseFloat(value);
                    if (isNaN(floatValue)) {
                      setFieldValue("bills_cost", "0.00");
                    } else {
                      setFieldValue("bills_cost", floatValue.toFixed(2));
                    }
                  }
                }}
                className="form-control"
                name="bills_cost"
              />
              <div className="d-flex  align-items-center">
                {billsCost && billsCost?.action?.toLowerCase() === "verified" ? (
                  <UnVerifyAction
                    fieldName="billsCost"
                    tableName="CaseProviders"
                    recordId={editCaseProvider?.id}
                  />
                ) : (
                  <VerifyAction
                    fieldName="billsCost"
                    tableName="CaseProviders"
                    recordId={editCaseProvider?.id}
                  />
                )}
              </div>
            </div>
            <div className="col-md-12 m-t-15">
              <VerificationNote verificationItem={billsCost} />
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div className="col-md-1 text-left">
              <span className="d-inline-block text-grey">
                {/*Bills Request*/}Paid
              </span>
            </div>
            <div className="col-md-11">
              <div className="d-flex justify-content-between align-items-center ">
                <div className="d-flex justify-content-around align-items-center ">
                  <input
                    type="date"
                    value={formatDateInputValue(values.billing_paid)}
                    onChange={handleChange}
                    className="form-control"
                    min="1000-01-01"
                    max="9999-12-31"
                    name="billing_paid"
                  />
                </div>
                <div className="d-flex justify-content-around align-items-center ">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="bills_request_paid"
                      value={values?.bills_request_paid}
                      defaultChecked={
                        values?.bills_request_paid?.toUpperCase() === "YES"
                      }
                      onChange={(e) => {
                        setFieldValue("bills_request_paid", "YES");
                      }}
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="bills_request_paid"
                      value={values?.bills_request_paid}
                      defaultChecked={
                        values?.bills_request_paid?.toUpperCase() === "NO"
                      }
                      onChange={(e) => {
                        setFieldValue("bills_request_paid", "NO");
                      }}
                    />{" "}
                    No
                  </label>
                </div>
                <div className="d-flex  align-items-center">
                  {billsRequestPaid &&
                  billsRequestPaid?.action?.toLowerCase() === "verified" ? (
                    <UnVerifyAction
                      fieldName="bills_request_paid"
                      tableName="CaseProviders"
                      recordId={editCaseProvider?.id}
                    />
                  ) : (
                    <VerifyAction
                      fieldName="bills_request_paid"
                      tableName="CaseProviders"
                      recordId={editCaseProvider?.id}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12 m-t-15">
              <VerificationNote verificationItem={billsRequestPaid} />
            </div>
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
            <div className="col-md-2 text-left">
              <span className="">City</span>
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
              <span className="">State</span>
            </div>
            <div className="col-md-3 text-left">
              <select
                name="medical_state"
                id=""
                className="form-select form-control"
                value={values.medical_state}
                onChange={handleChange}
              >
                {states &&
                  states?.map((stateItem) => (
                    <option
                      value={stateItem?.StateAbr}
                      key={stateItem?.StateAbr}
                      selected={stateItem?.StateAbr === values.medical_state}
                    >
                      {stateItem?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-1 text-left">
              <span className="">Zip</span>
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
              <span className="">Phone</span>
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
            <div className="col-md-1 text-left">
              <span className="">Fax</span>
            </div>
            <div className="col-md-3 text-left">
              <input
                type="text"
                placeholder="Enter fax"
                value={values.medical_fax}
                onChange={handleChange}
                className="form-control"
                name="medical_fax"
              />
            </div>
            <div className="col-md-1 text-left">
              <span className="">Email</span>
            </div>
            <div className="col-md-3 text-left">
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
