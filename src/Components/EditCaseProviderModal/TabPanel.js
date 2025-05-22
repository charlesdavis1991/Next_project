import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllStates,
  fetchClientProviderSpecialties,
  setStates,
  setSpecialties,
} from "../../Redux/client-providers/clientProviderSlice";
import Provider from "./forms/Provider";
import TreatmentLocation from "./forms/TreatmentLocation";
import RequestBilling from "./forms/RequestBilling";
import RecordsRequest from "./forms/RecordsRequest";
import LienHolderContact from "./forms/LienHolderContact";
import AddNewTreatmentDates from "./forms/AddNewTreatmentDates";
import ProviderCharges from "./forms/ProviderCharges";
import ClientProvidersStyles from "../CaseDashboard/ClientProvidersStyles";
import { formatDateInputValue } from "../../Utils/date";
import { RequestBillingPaid } from "./forms/RequestBillingPaid";
import { RecordsRequestPaid } from "./forms/RecordsRequestPaid";
import { getToken } from "../../Utils/helper";

export default function TabPanel() {
  const dispatch = useDispatch();

  const clientProvider = useSelector((state) => state.clientProvider);
  const client_providers = clientProvider?.all;
  const editCaseProvider = clientProvider?.editCaseProvider;
  const activeTabId = useSelector(
    (state) => state.clientProvider?.editCaseProviderTab
  );

  const editTreatmentNoteRecords = (e) => {
    console.log("Edit Treatment Note Records: ", e.target);
  };
  const token = getToken();

  useEffect(() => {
    if (token) {
      fetchClientProviderSpecialties()
        .then((data) => {
          dispatch(setSpecialties(data));
        })
        .catch((err) => {
          console.log(err);
        });
      fetchAllStates()
        .then((data) => {
          dispatch(setStates(data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);
  return (
    <div className="tab-content mt-2" id="nav-tabContent">
      <ClientProvidersStyles clientProviders={client_providers} />
      <div
        className={`tab-pane fade ${
          activeTabId === "provider-link" ? "show active" : ""
        }`}
        id="provider-tab"
        role="tabpanel"
        aria-labelledby="provider-link"
      >
        <Provider />
      </div>
      <div
        className={`tab-pane fade ${
          activeTabId === "treatment-location-link" ? "show active" : ""
        }`}
        id="treatment-location-tab"
        role="tabpanel"
        aria-labelledby="treatment-location-link"
      >
        <TreatmentLocation />
      </div>
      <div
        className={`tab-pane fade ${
          activeTabId === "request-billing-link" ? "show active" : ""
        }`}
        id="request-billing-tab"
        role="tabpanel"
        aria-labelledby="request-billing-link"
      >
        <RequestBilling />
        <RequestBillingPaid />
      </div>
      <div
        className={`tab-pane fade ${
          activeTabId === "request-record-link" ? "show active" : ""
        }`}
        id="request-record-tab"
        role="tabpanel"
        aria-labelledby="request-record-link"
      >
        <RecordsRequest />
        <RecordsRequestPaid />
      </div>
      <div
        className={`tab-pane fade ${
          activeTabId === "lien-holder-link" ? "show active" : ""
        }`}
        id="lien-holder-tab"
        role="tabpanel"
        aria-labelledby="lien-holder-link"
      >
        <LienHolderContact />
      </div>
      <div
        className={`tab-pane fade ${
          activeTabId === "treatment-dates-link" ? "show active" : ""
        }`}
        id="treatment-dates-tab"
        role="tabpanel"
        aria-labelledby="treatment-dates-link"
      >
        <AddNewTreatmentDates />
        <div
          className={`row bg-white m-0 p-r-15 has-speciality-color-${editCaseProvider?.specialty?.id}`}
          id={`treatment-dates-block-${editCaseProvider?.id}`}
        >
          <div className="d-flex justify-content-start w-100">
            <div className="table-responsive table--no-card overflow-hidden">
              <table className="table table-borderless table-striped table-earning has-specialty-icon">
                <thead>
                  <tr id="bg-m-10" className="line-height">
                    <th className="p-t-5 p-b-5 pr-3 btn-primary-lighter-default">
                      MEDICAL PROVIDER
                    </th>
                    <th className="p-t-5 p-b-5 btn-primary-lighter-default">
                      Date
                    </th>
                    <th className="pr-3 p-t-5 p-b-5 btn-primary-lighter-default">
                      Record
                    </th>
                    <th
                      colSpan={2}
                      className="p-t-5 p-b-5 btn-primary-lighter-default"
                    >
                      <div className="d-flex align-items-center notes-section">
                        <span>Treatment Note</span>
                        <div className="d-flex flex-g-1 justify-content-end dropdown-btn-row"></div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {editCaseProvider?.treatment_records?.map(
                    (treatment_note_1) => (
                      <tr
                        id=""
                        className="black-color"
                        data-treatment_date_id1={treatment_note_1?.id}
                        data-description={treatment_note_1?.description}
                        data-date={treatment_note_1?.date}
                        data-client_provider_id={editCaseProvider?.id}
                        onClick={editTreatmentNoteRecords}
                      >
                        <td className="td-autosize client-location-class bg-speciality-10">
                          <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center justify-content-center">
                              <span
                                className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                style={{
                                  backgroundColor: `${editCaseProvider?.specialty?.color}`,
                                }}
                              >
                                {editCaseProvider?.specialty?.name[0]}
                              </span>
                            </div>
                            <p className="m-l-5 m-r-5">
                              {editCaseProvider?.treatment_location?.name && (
                                <>{editCaseProvider.treatment_location?.name}</>
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="td-autosize client-location-class">
                          {formatDateInputValue(treatment_note_1?.date)}
                        </td>
                        <td className="td-autosize" />
                        <td className="client-location-class line-height-26">
                          {treatment_note_1?.description}
                        </td>
                        <td className="client-location-class line-height-26"></td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`tab-pane fade ${
          activeTabId === "provider-charges-link" ? "show active" : ""
        }`}
        id="provider-charges-tab"
        role="tabpanel"
        aria-labelledby="provider-charges-link"
      >
        <ProviderCharges />
      </div>
    </div>
  );
}
