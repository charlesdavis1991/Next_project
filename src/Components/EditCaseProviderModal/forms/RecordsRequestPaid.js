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

export function RecordsRequestPaid() {
  const formRef = useRef(null);

  const dispatch = useDispatch();

  const clientProvider = useSelector((state) => state.clientProvider);
  const states = clientProvider?.states;
  const editCaseProvider = clientProvider?.editCaseProvider;
  const requestRecordsPaid = editCaseProvider?.records_request_paid;

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

  const recordCost = fieldVerified("recordCost");
  const recordRequestPaid = fieldVerified("rec_request_paid");

  useEffect(() => {
    if (isFormSubmitting) {
      const formData = new FormData(formRef.current);
      const data = {};
      for (let pair of formData.entries()) {
        data[pair[0]] = pair[1];
      }
      const clientId = getClientId();
      const caseId = getCaseId();
      api
        .post(`/api/medical_contact_panel/${clientId}/${caseId}/`, data)
        .then((response) => {
          dispatch(
            setFormSubmittingStatus({
              formKey: "records_request_paid",
              status: "success",
            })
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(
            setFormSubmittingStatus({
              formKey: "records_request_paid",
              status: "error",
            })
          );
        });

      dispatch(setIsFormSubmitting(false));
    }
  }, [isFormSubmitting]);
  return (
    <form id="editClientForm2_records_request_paid" ref={formRef}>
      <input
        type="hidden"
        name="address_block_name"
        value="records_request_paid"
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
                {/* Records */} Cost
              </span>
            </div>
            <div className="col-md-11 d-flex">
              <input
                type="number"
                placeholder="Enter Cost"
                defaultValue={editCaseProvider?.recordCost}
                className="form-control"
                name="record_cost"
              />
              <div className="d-flex  align-items-center">
                {recordCost &&
                recordCost?.action?.toLowerCase() === "verified" ? (
                  <UnVerifyAction
                    fieldName="recordCost"
                    tableName="CaseProviders"
                    recordId={editCaseProvider?.id}
                  />
                ) : (
                  <VerifyAction
                    fieldName="recordCost"
                    tableName="CaseProviders"
                    recordId={editCaseProvider?.id}
                  />
                )}
              </div>
            </div>
            <div className="col-md-12 m-t-15">
              <VerificationNote verificationItem={recordCost} />
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div className="col-md-1 text-left">
              <span className="d-inline-block text-grey">
                <nobr>{/* Record Request */} Paid</nobr>
              </span>
            </div>
            <div className="col-md-11">
              <div className="d-flex justify-content-between align-items-center ">
                <div className="d-flex justify-content-around align-items-center ">
                  <input
                    type="date"
                    defaultValue={
                      editCaseProvider?.record_paid
                        ? formatDateInputValue(editCaseProvider?.record_paid)
                        : ""
                    }
                    className="form-control"
                    min="1000-01-01"
                    max="9999-12-31"
                    name="record_paid"
                  />
                </div>
                <div className="d-flex justify-content-around align-items-center ">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="record_request_paid"
                      defaultValue="YES"
                    />{" "}
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="record_request_paid"
                      defaultValue="NO"
                    />{" "}
                    No
                  </label>
                </div>
                <div className="d-flex  align-items-center">
                  {recordRequestPaid &&
                  recordRequestPaid?.action?.toLowerCase() === "verified" ? (
                    <UnVerifyAction
                      fieldName="rec_request_paid"
                      tableName="CaseProviders"
                      recordId={editCaseProvider?.id}
                    />
                  ) : (
                    <VerifyAction
                      fieldName="rec_request_paid"
                      tableName="CaseProviders"
                      recordId={editCaseProvider?.id}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12 m-t-15">
              <VerificationNote verificationItem={recordRequestPaid} />
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
                defaultValue={requestRecordsPaid?.name}
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
                defaultValue={requestRecordsPaid?.address1}
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
                defaultValue={requestRecordsPaid?.address2}
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
                defaultValue={requestRecordsPaid?.city}
                className="form-control col-md-9"
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
              >
                {states &&
                  states?.map((stateItem) => (
                    <option
                      value={stateItem?.StateAbbr}
                      selected={
                        stateItem?.StateAbbr === requestRecordsPaid?.state
                      }
                      key={stateItem?.StateAbbr}
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
                defaultValue={requestRecordsPaid?.zip}
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
                defaultValue={requestRecordsPaid?.phone_number}
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
                defaultValue={requestRecordsPaid?.fax}
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
                defaultValue={requestRecordsPaid?.email}
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
                defaultValue={requestRecordsPaid?.website}
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
