import React, { useEffect, useRef } from "react";
import Tabs from "./Tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormSubmittingStatus,
  setIsFormSubmitting,
} from "../../Redux/client-providers/clientProviderSlice";
import { hideModal } from "../../Redux/modal/actions";
import "../../../public/BP_resources/css/theme.css";
import { setCaseSummary } from "../../Redux/caseData/caseDataSlice";
import { fetchCaseSummary } from "../../api/case";
import { getCaseId, getClientId } from "../../Utils/helper";

const EditCaseProviderModal =() => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const show = useSelector((state) => state.modal.show);
  const [isPending, setIsPending] = React.useState(false);

  const {
    provider,
    treatment_location,
    billing_request,
    billing_request_paid,
    records_request,
    records_request_paid,
    lien_holder,
    treatment_dates,
    provider_charges,
  } = useSelector((state) => state.clientProvider?.formSubmittingStatus);
  const handleSave = () => {
    setIsPending(true);
    dispatch(setIsFormSubmitting(true));
  };
  const isLoading = useSelector(
    (state) => state.clientProvider?.isLoading?.editCaseProvider
  );

  useEffect(() => {
    if (
      provider === "success" &&
      treatment_location === "success" &&
      billing_request === "success" &&
      billing_request_paid === "success" &&
      records_request === "success" &&
      records_request_paid === "success" &&
      lien_holder === "success" &&
      treatment_dates === "success"
    ) {
      async function fetchData() {
        const data = await fetchCaseSummary(getClientId(), getCaseId());
        if (data) {
          dispatch(setCaseSummary(data));
        }
        setIsPending(false);
        document.getElementById("close-edit-case-provider-modal")?.click();
      }
      fetchData();

      dispatch(setIsFormSubmitting(false));
      dispatch(
        setFormSubmittingStatus({
          formKey: "provider",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "treatment_location",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "billing_request",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "billing_request_paid",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "records_request",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "records_request_paid",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "lien_holder",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "treatment_dates",
          status: "idle",
        })
      );
      dispatch(
        setFormSubmittingStatus({
          formKey: "provider_charges",
          status: "idle",
        })
      );
    }
  }, [
    provider,
    treatment_location,
    billing_request,
    billing_request_paid,
    records_request,
    records_request_paid,
    lien_holder,
    treatment_dates,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current?.contains(event.target)) {
        dispatch(hideModal());
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, dispatch]);

  return (
    <div
      className={`modal has-mobile-modal generic-popup bd-example-modal-lg`}
      id="edit-case-provider-modal"
      role="dialog"
      ref={modalRef}
    >
      <div
        className="modal-dialog modal-dialog-centered max-width-1200-MT"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header text-center">
            <h5 className="modal-title mx-auto">Edit Case Provider</h5>
          </div>
          {isLoading ? (
            <div className="modal-body min-h-943 max-h-943 overflow-auto">
              <div className="d-flex justify-content-center align-items-center min-h-943">
                <div className="loader" />
              </div>
            </div>
          ) : (
            <div className="modal-body min-h-943 max-h-943 overflow-scroll">
              <Tabs />
            </div>
          )}
          <div className="modal-footer border-0 justify-content-between pt-4">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              id="close-edit-case-provider-modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? <div className="loader loader-small" /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(EditCaseProviderModal)
