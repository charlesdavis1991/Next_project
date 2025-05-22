import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { getCaseId } from "../../../Utils/helper";
import { formatDateForInput } from "../../TreatmentPage/utils/helperFn";
import api, { api_without_cancellation } from "../../../api/api";
import VerificationInfo from "../../TreatmentPage/components/VerificationInfo";

function VisitsModal({
  show,
  handleClose,
  verification,
  dates,
  setdates,
  caseProviderID,
  visits,
  setVisits,
  refetch,
  params,
}) {
  const [visitCount, setVisitCount] = useState(visits || 0);
  const [firstVisitDate, setFirstVisitDate] = useState(
    dates.length > 0 ? dates[0]?.date : ""
  );
  const [lastVisitDate, setLastVisitDate] = useState(
    dates.length > 1 ? dates[1]?.date : ""
  );
  const firstDateVerification = verification?.first_date;
  const secondDateVerification = verification?.second_date;
  const visitsVerification = verification?.visits;

  const origin = process.env.REACT_APP_BACKEND_URL;

  function verify_unverify(arg) {
    const data = {
      client_id: 20,
      case_id: getCaseId(),
      visits: visitCount,
      first_visit_date: firstVisitDate,
      last_visit_date: lastVisitDate,
      Arg: arg,
      case_provider_id: caseProviderID,
    };

    const apiUrl = `${origin}/api/treatment/verify-unverify/`;
    api_without_cancellation
      .post(apiUrl, data)
      .then((response) => {
        // updateCall();
        // onUpdate();
        refetch(); //handleClose()
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  }

  function updateCaseProvider() {
    const data = {
      visits: visitCount,
      first_date: formatDateForInput(firstVisitDate),
      last_date: formatDateForInput(lastVisitDate),
    };

    api_without_cancellation
      .patch(
        `${origin}/api/treatment/update/case-provider/${caseProviderID}/`,
        data
      )
      .then((response) => response.data)
      .then((data) => {
        const newDates = [
          { date: data?.first_date },
          { date: data?.last_date },
        ];
        setdates(newDates);
        setVisits(data?.visits);

        // updateCall()
        // onUpdate();
        refetch();
        handleClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Body>
        <div class="modal-header">
          <h5 class="modal-title mx-auto" id="exampleModalLabel">
            Add Number of Visits, First and Last Treatment Dates
          </h5>
        </div>
        <div class="modal-body">
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left"></div>
            <div class="col-md-10">
              <div class="d-flex align-items-center">
                <input
                  type="number"
                  placeholder="Number of Visits"
                  class="form-control"
                  name="visits"
                  value={visitCount}
                  onChange={(e) => setVisitCount(e.target.value)}
                />
                <div class="icon-wrap ic-25 m-l-5 m-r-5">
                  {visitsVerification !== null ? (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-verified ic-25"
                    ></i>
                  ) : (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-unverified ic-25"
                    ></i>
                  )}
                </div>

                <button
                  id="is_request_billing_recived_verified_btn"
                  className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                  onClick={() => verify_unverify("CaseProviders-visits")}
                >
                  {visitsVerification !== null ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
            <div class="col-md-12 m-t-15">
              <div class="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                <VerificationInfo verificationData={visitsVerification} />
              </div>
            </div>
          </div>
          <div class="k-separator mt-4 mb-4"></div>
          <div class="row align-items-center form-group">
            <div class="col-md-2 text-left">
              <label class="d-inline-block text-grey " for="first_date">
                First Visit
              </label>
            </div>
            <div class="col-md-10">
              <div class="d-flex align-items-center">
                <input
                  type="date"
                  class="form-control"
                  value={formatDateForInput(firstVisitDate)}
                  onChange={(e) => setFirstVisitDate(e.target.value)}
                />
                <div class="icon-wrap ic-25 m-l-5 m-r-5">
                  {firstDateVerification !== null ? (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-verified ic-25"
                    ></i>
                  ) : (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-unverified ic-25"
                    ></i>
                  )}
                </div>

                <button
                  id="is_request_billing_recived_verified_btn"
                  className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                  onClick={() => verify_unverify("CaseProviders-first_date")}
                >
                  {firstDateVerification !== null ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
            <div class="col-md-12 m-t-15">
              <div class="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                <VerificationInfo verificationData={firstDateVerification} />
              </div>
            </div>
          </div>
          <div class="k-separator mt-4 mb-4"></div>
          <div class="row align-items-center form-group mb-0">
            <div class="col-md-2 text-left">
              <label class="d-inline-block text-grey" for="second_date">
                Last Visit
              </label>
            </div>
            <div class="col-md-10">
              <div class="d-flex align-items-center">
                <input
                  type="date"
                  class="form-control"
                  value={formatDateForInput(lastVisitDate)}
                  onChange={(e) => setLastVisitDate(e.target.value)}
                />
                <div class="icon-wrap ic-25 m-l-5 m-r-5">
                  {secondDateVerification !== null ? (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-verified ic-25"
                    ></i>
                  ) : (
                    <i
                      id="is_request_billing_recived_verified"
                      className="ic ic-unverified ic-25"
                    ></i>
                  )}
                </div>

                <button
                  id="is_request_billing_recived_verified_btn"
                  className="btn btn-primary rounded-0 height-35 d-flex align-items-center"
                  onClick={() => verify_unverify("CaseProviders-second_date")}
                >
                  {secondDateVerification !== null ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
            <div class="col-md-12 m-t-15">
              <div class="bg-grey-100 mt-2 height-35 d-flex align-items-center justify-content-center text-center">
                <VerificationInfo verificationData={secondDateVerification} />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary footer-btn"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={updateCaseProvider}
            className="btn btn-success"
          >
            Save
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default React.memo(VisitsModal);
