import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import { setFormSubmittingStatus, setIsFormSubmitting } from "../../../Redux/client-providers/clientProviderSlice";
import api from "../../../api/api";
import VerificationNote from "../VerificationNote";
import UnVerifyAction from "../UnVerifyAction";
import VerifyAction from "../VerifyAction";
export default function LienHolderContact() {
  const formRef = useRef(null);

  const dispatch = useDispatch();

  const clientProvider = useSelector((state) => state.clientProvider);
  const states = clientProvider?.states;
  const editCaseProvider = clientProvider?.editCaseProvider;
  const lienHolder = editCaseProvider?.lien_holder;
  const balanceConfirmed = editCaseProvider?.balance_confirmed;

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

  const balanceVerified = fieldVerified("final");
  const balanceConfirmedVerified = fieldVerified("balance_confirmed");

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
          dispatch(setFormSubmittingStatus({ formKey: "lien_holder", status: "success" }));
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(setFormSubmittingStatus({ formKey: "lien_holder", status: "error" }));
        });

      dispatch(setIsFormSubmitting(false));
    }
  }, [isFormSubmitting]);

  return (
    <form id="editClientForm2_lien_holder_contact" ref={formRef}>
      <input type="hidden" name="address_block_name" value="lien_holder" />
      <input
        type="hidden"
        name="case_provider_id"
        value={editCaseProvider?.id}
      />
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">Balance</span>
        </div>
        <div className="col-md-11 d-flex">
          <input
            type="number"
            placeholder="Enter Balance"
            defaultValue={editCaseProvider?.final}
            className="form-control"
            name="balance"
          />
          <div className="d-flex  align-items-center">
            {balanceVerified &&
            balanceVerified?.action?.toLowerCase() === "verified" ? (
              <UnVerifyAction
                fieldName="final"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            ) : (
              <VerifyAction
                fieldName="final"
                tableName="CaseProviders"
                recordId={editCaseProvider?.id}
              />
            )}
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={balanceVerified} />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-1 text-left">
          <span className="d-inline-block text-grey">
            <nobr>{/* Balance */} Confirmed</nobr>
          </span>
        </div>
        <div className="col-md-11">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="d-flex justify-content-around align-items-center ml-3">
              <label className="mr-3">
                <input
                  type="radio"
                  name="balance_confirmed"
                  defaultValue="YES"
                  defaultChecked={balanceConfirmed === "YES"}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="balance_confirmed"
                  defaultValue="NO"
                  defaultChecked={balanceConfirmed === "NO"}
                />{" "}
                No
              </label>
            </div>
            <div className="d-flex  align-items-center">
              {balanceConfirmedVerified &&
              balanceConfirmedVerified?.action?.toLowerCase() === "verified" ? (
                <UnVerifyAction
                  fieldName="balance_confirmed"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              ) : (
                <VerifyAction
                  fieldName="balance_confirmed"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-md-12 m-t-15">
          <VerificationNote verificationItem={balanceConfirmedVerified} />
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
                defaultValue={lienHolder?.name}
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
                defaultValue={lienHolder?.address1}
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
                defaultValue={lienHolder?.address2}
                className="form-control"
                name="medical_address2"
              />
            </div>
          </div>
          <div className="row align-items-center form-group">
            <div className="col-md-2 text-left">
              <span className="d-inline-block white-space-no-wrapping text-grey align-self-center">
                City
              </span>
            </div>
            <div className="col-md-2 text-left">
              <input
                type="text"
                placeholder="Enter City"
                defaultValue={lienHolder?.city}
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
              <select
                name="medical_state"
                id=""
                className="form-select form-control"
              >
                {states &&
                  states?.map((stateItem) => (
                    <option
                      value={stateItem?.StateAbbr}
                      key={stateItem?.id}
                      selected={lienHolder?.state === stateItem?.StateAbbr}
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
                defaultValue={lienHolder?.zip}
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
                defaultValue={lienHolder?.phone_number}
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
                defaultValue={lienHolder?.fax}
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
                defaultValue={lienHolder?.email}
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
                defaultValue={lienHolder?.website}
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
