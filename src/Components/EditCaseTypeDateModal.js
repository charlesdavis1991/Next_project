import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { formatDateInputValue } from "../Utils/date";
import { fetchCaseSummary, updateCaseDates, updateCaseType } from "../api/case";
import { getCaseId, getClientId } from "../Utils/helper";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
  setCurrentCase,
} from "../Redux/caseData/caseDataSlice";
import api, { api_without_cancellation } from "../api/api";

export default function EditCaseTypeDateModal() {
  const dispatch = useDispatch();
  const caseSummary = useSelector((state) => state?.caseData?.summary);
  const [isLoading, setIsLoading] = useState(false);
  const [caseTypes, setCaseTypes] = useState([
    {
      id: 6,
      name: "Defective Product",
      icon: "",
    },
    {
      id: 2,
      name: "Dog Bite",
      icon: "https://simplefirm-bucket.s3.amazonaws.com/static/images/animal-bite-icon.svg",
    },
    {
      id: 5,
      name: "Food Poisoning",
      icon: "https://simplefirm-bucket.s3.amazonaws.com/static/images/food-poisoning-icon-color.svg",
    },
    {
      id: 3,
      name: "Slip and Fall",
      icon: "https://simplefirm-bucket.s3.amazonaws.com/static/images/slip-fall-icon-v2.0.svg",
    },
    {
      id: 1,
      name: "Car Accident",
      icon: "https://simplefirm-bucket.s3.amazonaws.com/static/images/car-accident-icon-color_Wgzt9S5.svg",
    },
    {
      id: 8,
      name: "Worker's Compensation Plaintiff",
      icon: "",
    },
    {
      id: 9,
      name: "Premises Liability",
      icon: "",
    },
  ]);
  const formik = useFormik({
    initialValues: {
      caseTypes: {
        case_type: caseSummary?.case_type.id || "",
        case_type_sol_check: false,
        delete_sol_check: false,
      },
      caseDates: {
        intake_date: formatDateInputValue(caseSummary?.intake_date) || "",
        retained: formatDateInputValue(caseSummary?.retained) || "",
        accepted_date: formatDateInputValue(caseSummary?.accepted_date) || "",
        date_closed: formatDateInputValue(caseSummary?.date_closed) || "",
        doi_date: formatDateInputValue(caseSummary?.incident_date) || "",
        case_doi_sol_check: false,
        delete_sol_check: false,
      },
    },
    onSubmit: async (values) => {
      const caseTypeData = {
        case_type: values.caseTypes.case_type,
      };

      if (values.caseTypes.case_type_sol_check) {
        caseTypeData.case_type_sol_check = "True";
        if (values.caseTypes.delete_sol_check) {
          caseTypeData.delete_sol_check = "True";
        }
      }

      const caseDateData = {
        intake_date: values.caseDates.intake_date,
        retained: values.caseDates.retained,
        accepted_date: values.caseDates.accepted_date,
        date_closed: values.caseDates.date_closed,
        doi_date: values.caseDates.doi_date,
      };

      if (values.caseDates.case_doi_sol_check) {
        caseDateData.case_doi_sol_check = "True";
        if (values.caseDates.delete_sol_check) {
          caseDateData.delete_sol_check = "True";
        }
      }
      try {
        setIsLoading(true);

        const datesRes = await api_without_cancellation.put(
          `/api/cases/${getClientId()}/${getCaseId()}/summary/?tab=case_dates`,
          caseDateData
        );
        const typesRes = await api_without_cancellation.put(
          `/api/cases/${getClientId()}/${getCaseId()}/summary/?tab=case_type`,
          caseTypeData
        );
        fetchCaseSummary(getClientId(), getCaseId())
          .then((data) => {
            dispatch(setCaseSummary(data));
          })
          .catch((err) => {
            console.error("Error occurred", err);
          })
          .finally(() => {
            setIsLoading(false);
            document.getElementById("edit-case-dates-modal").click();
          });
      } catch (error) {
        setIsLoading(false);
        console.error("Error occurred", error);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div
      className="modal generic-popup fade bd-example-modal-lg zoom-in"
      id="edit-case-dates-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="edit-case-dates-modal"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered Add-Client-W500"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title mx-auto">Case Type and Dates</h5>
          </div>
          {isLoading ? (
            <div className="modal-body pt-0 min-h-400 max-h-400 overflow-auto">
              <div className="d-flex justify-content-center align-items-center min-h-400">
                <div className="loader"></div>
              </div>
            </div>
          ) : (
            <div className="modal-body pt-0 min-h-400 max-h-400 overflow-auto">
              <div className="custom-tab mt-3">
                <nav className="ml-0">
                  <div
                    className="nav nav-tabs justify-content-around"
                    id="nav-tab"
                    role="tablist"
                  >
                    <a
                      className="nav-item nav-link active Pad8 tab-item"
                      id="case-type-link"
                      data-toggle="tab"
                      href="#case-type-tab"
                      role="tab"
                      aria-controls="case-type-tab"
                      aria-selected="false"
                    >
                      Case Types
                    </a>
                    <a
                      className="nav-item nav-link Pad8 tab-item"
                      id="case-dates-link"
                      data-toggle="tab"
                      href="#case-dates-tab"
                      role="tab"
                      aria-controls="case-dates-tab"
                      aria-selected="false"
                    >
                      Case Dates
                    </a>
                  </div>
                </nav>
                <div className="tab-content mt-2" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="case-type-tab"
                    role="tabpanel"
                    aria-labelledby="case-type-link"
                  >
                    <form id="edit_case_type_form">
                      <div className="d-flex flex-wrap">
                        {caseTypes.map((caseType) => (
                          <div className="col-md-6 px-0 py-1" key={caseType.id}>
                            <div className="row align-items-center">
                              <div className="col-md-8 text-left d-flex align-items-center">
                                <label
                                  className="font-weight-semibold"
                                  htmlFor={`case_type_${caseType.id}`}
                                >
                                  {caseType.icon && caseType.icon !== "" && (
                                    <span className="ic-avatar ic-19 mr-8px">
                                      <img
                                        className="img-19px"
                                        src={caseType.icon}
                                      />
                                    </span>
                                  )}
                                  {caseType.name}
                                </label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="radio"
                                  name="caseTypes.case_type"
                                  id={`case_type_${caseType.id}`}
                                  value={caseType.id}
                                  onChange={formik.handleChange}
                                  defaultChecked={
                                    caseType.id ===
                                    formik.values.caseTypes.case_type
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-11 text-left">
                          <span className="d-inline-block text-grey">
                            Recalculate Statute of Limitations if Case Type is
                            changed
                          </span>
                        </div>
                        <div className="col-md-1 p-0 d-flex align-items-center">
                          <input
                            type="checkbox"
                            id=""
                            defaultValue="True"
                            onChange={formik.handleChange}
                            name="caseTypes.case_type_sol_check"
                            value={formik.values.caseTypes.case_type_sol_check}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-11 text-left">
                          <span className="d-inline-block text-grey">
                            Delete old statute entries on case
                          </span>
                        </div>
                        <div className="col-md-1 p-0 d-flex align-items-center">
                          <input
                            type="checkbox"
                            name="caseTypes.delete_sol_check"
                            onChange={formik.handleChange}
                            value={formik.values.caseTypes.delete_sol_check}
                            disabled={
                              formik.values.caseTypes.case_type_sol_check
                                ? false
                                : "disabled"
                            }
                            checked={
                              formik.values.caseTypes.case_type_sol_check
                                ? formik.values.caseTypes.delete_sol_check
                                : false
                            }
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div
                    className="tab-pane fade "
                    id="case-dates-tab"
                    role="tabpanel"
                    aria-labelledby="case-dates-link"
                  >
                    <form id="edit_case_date_form">
                      <div className="row align-items-center form-group">
                        <div className="col-md-2 text-left">
                          <label
                            className="d-inline-block text-grey"
                            htmlFor="intake_date"
                          >
                            Intake
                          </label>
                        </div>
                        <div className="col-md-10">
                          <input
                            type="date"
                            id="intake_date"
                            className="form-control"
                            min="1000-01-01"
                            max="9999-12-31"
                            name="caseDates.intake_date"
                            value={formik.values.caseDates.intake_date}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-2 text-left">
                          <label
                            className="d-inline-block text-grey"
                            htmlFor="retained"
                          >
                            Retained
                          </label>
                        </div>
                        <div className="col-md-10">
                          <input
                            type="date"
                            id="retained"
                            className="form-control"
                            min="1000-01-01"
                            max="9999-12-31"
                            name="caseDates.retained"
                            value={formik.values.caseDates.retained}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-2 text-left">
                          <label
                            className="d-inline-block text-grey"
                            htmlFor="accepted_date"
                          >
                            Accepted
                          </label>
                        </div>
                        <div className="col-md-10">
                          <input
                            type="date"
                            id="accepted_date"
                            className="form-control"
                            min="1000-01-01"
                            max="9999-12-31"
                            name="caseDates.accepted_date"
                            value={formik.values.caseDates.accepted_date}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-2 text-left">
                          <label
                            className="d-inline-block text-grey"
                            htmlFor="date_closed"
                          >
                            Closed
                          </label>
                        </div>
                        <div className="col-md-10">
                          <input
                            type="date"
                            id="date_closed"
                            className="form-control"
                            min="1000-01-01"
                            max="9999-12-31"
                            name="caseDates.date_closed"
                            value={formik.values.caseDates.date_closed}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-2 text-left">
                          <label
                            className="d-inline-block text-grey"
                            htmlFor="doi_date"
                          >
                            DOI
                          </label>
                        </div>
                        <div className="col-md-10">
                          <input
                            type="date"
                            id="doi_date"
                            className="form-control"
                            min="1000-01-01"
                            max="9999-12-31"
                            name="caseDates.doi_date"
                            value={formik.values.caseDates.doi_date}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-11 text-left">
                          <span className="d-inline-block text-grey">
                            Recalculate Statute of Limitations if Incident Date
                            is changed
                          </span>
                        </div>
                        <div className="col-md-1 p-0 d-flex align-items-center">
                          <input
                            type="checkbox"
                            id="case_dates_doi_sol_check"
                            defaultValue="True"
                            name="caseDates.case_doi_sol_check"
                            value={formik.values.caseDates.case_doi_sol_check}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row align-items-center form-group">
                        <div className="col-md-11 text-left">
                          <span className="d-inline-block text-grey">
                            Delete old statute entries on case
                          </span>
                        </div>
                        <div className="col-md-1 p-0 d-flex align-items-center">
                          <input
                            type="checkbox"
                            name="caseDates.delete_sol_check"
                            value={formik.values.caseDates.delete_sol_check}
                            disabled={
                              formik.values.caseDates.case_doi_sol_check
                                ? false
                                : "disabled"
                            }
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="modal-footer border-0 justify-content-between pt-4">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              form="edit_case_date_form"
              type="button"
              className="btn btn-success"
              onClick={formik.handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
