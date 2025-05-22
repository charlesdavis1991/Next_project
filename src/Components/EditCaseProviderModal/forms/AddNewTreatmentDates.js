import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VerificationNote from "../VerificationNote";
import UnVerifyAction from "../UnVerifyAction";
import VerifyAction from "../VerifyAction";
import { setFormSubmittingStatus, setIsFormSubmitting } from "../../../Redux/client-providers/clientProviderSlice";
import { getCaseId, getClientId } from "../../../Utils/helper";
import api from "../../../api/api";
import { useFormik } from 'formik';
import { formatDateInputValue } from "../../../Utils/date";

export default function AddNewTreatmentDates() {
  const dispatch = useDispatch();
  const clientProvider = useSelector((state) => state.clientProvider);
  const editCaseProvider = clientProvider?.editCaseProvider;

  const isFormSubmitting = clientProvider?.isFormSubmitting;
  const verifications = clientProvider?.verifications;

  const fieldVerified = (field_name) => {
    const verification = verifications[field_name];
    if (verification) {
      return verification;
    }
    return false;
  };

  const firstDateVerified = fieldVerified("first_date");
  const secondDateVerified = fieldVerified("second_date");
  const visitsVerified = fieldVerified("visits");

  const formik = useFormik({
    initialValues: {
      case_provider_id: editCaseProvider?.id,
      first_appointment: editCaseProvider?.first_date,
      last_appointment: editCaseProvider?.second_date,
      no_of_visits: editCaseProvider?.visits,
      treatment_records: [
        { treatment_note: "", treatment_date: "" },
      ],
    },
    onSubmit: values => {
      const clientId = getClientId();
      const caseId = getCaseId();
      api
        .put(`/api/treatment_dates/${clientId}/${caseId}/`, values)
        .then((response) => {
          console.log("Response: ", response);
          dispatch(setFormSubmittingStatus({ formKey: "treatment_dates", status: "success" }));
        })
        .catch((error) => {
          console.log("Error: ", error);
          dispatch(setFormSubmittingStatus({ formKey: "treatment_dates", status: "error" }));
        });
    },
  });

  useEffect(() => {
    if (isFormSubmitting) {
      formik.submitForm()
      dispatch(setIsFormSubmitting(false));
    }
  }, [isFormSubmitting]);

  return (
    <div>
      <form id="add-new-treatment-date-form" onSubmit={formik.handleSubmit}>
        <div className="row align-items-center form-group">
          <div className="col-md-1 text-left">
            <span className="d-inline-block text-grey">
              <nobr>First Appt.</nobr>
            </span>
          </div>
          <div className="col-md-11 d-flex ">
            <input type="hidden" name="case_provider_id" value={editCaseProvider?.id} />
            <input
              type="date"
              value={formik.values.first_appointment}
              className="form-control"
              min="1000-01-01"
              max="9999-12-31"
              name="first_appointment"
              onChange={formik.handleChange}
            />
            <div className="d-flex  align-items-center">
              {firstDateVerified &&
              firstDateVerified?.action?.toLowerCase() === "verified" ? (
                <UnVerifyAction
                  fieldName="first_date"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              ) : (
                <VerifyAction
                  fieldName="first_date"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              )}
            </div>
          </div>
          <div className="col-md-12 m-t-15">
            <VerificationNote verificationItem={firstDateVerified} />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-1 text-left">
            <span className="d-inline-block text-grey">
              <nobr>Last Appt.</nobr>
            </span>
          </div>
          <div className="col-md-11 d-flex ">
            <input
              type="date"
              min="1000-01-01"
              max="9999-12-31"
              value={formik.values.last_appointment}
              onChange={formik.handleChange}
              className="form-control"
              name="last_appointment"
            />
            <div className="d-flex  align-items-center">
              {secondDateVerified &&
              secondDateVerified?.action?.toLowerCase() === "verified" ? (
                <UnVerifyAction
                  fieldName="second_date"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              ) : (
                <VerifyAction
                  fieldName="second_date"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              )}
            </div>
          </div>
          <div className="col-md-12 m-t-15">
            <VerificationNote verificationItem={secondDateVerified} />
          </div>
        </div>
        <div className="row align-items-center form-group">
          <div className="col-md-1 text-left">
            <span className="d-inline-block text-grey">
              <nobr>{/* No. of */} Visits #</nobr>
            </span>
          </div>
          <div className="col-md-11 d-flex">
            <input
              type="number"
              placeholder="Enter Visits"
              value={formik.values.no_of_visits}
              onChange={formik.handleChange}
              className="form-control"
              name="no_of_visits"
            />
            <div className="d-flex  align-items-center">
              {visitsVerified &&
              visitsVerified?.action?.toLowerCase() === "verified" ? (
                <UnVerifyAction
                  fieldName="visits"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              ) : (
                <VerifyAction
                  fieldName="visits"
                  tableName="CaseProviders"
                  recordId={editCaseProvider?.id}
                />
              )}
            </div>
          </div>
          <div className="col-md-12 m-t-15">
            <VerificationNote verificationItem={visitsVerified} />
          </div>
        </div>
        {formik.values.treatment_records?.map((item, index) => (
          <div className="row m-b-5" key={index}>
            <div className="col-md-3">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="treatment_date1" className="fw-bold mr-1 mb-0">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  min="1000-01-01"
                  max="9999-12-31"
                  placeholder="Treatment Date"
                  name={`treatment_records[${index}].treatment_date`}
                  value={formatDateInputValue(item.treatment_date)}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className="col-md-9">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="treatment_note1" className="fw-bold mr-1 mb-0">
                  Note
                </label>
                <input
                  type="text"
                  placeholder="Treatment Note"
                  className="form-control"
                  name={`treatment_records[${index}].treatment_note`}
                  value={item.treatment_note}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>
        ))}
      </form>
      <div className="d-flex justify-content-end m-b-5">
        <button
          className="btn btn-primary btn-h-25 border-no"
          style={{ backgroundColor: "var(--primary)" }}
          onClick={() => {
            formik.setFieldValue('treatment_records', [
              ...formik.values.treatment_records,
              { treatment_note: "", treatment_date: "" },
            ]);
          }}
        >
          <span className="font-weight-bold pr-2 text-gold  margin-b-08">
            +
          </span>
          Treatment Date
        </button>
      </div>
    </div>
  );
}
