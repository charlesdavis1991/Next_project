import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatNum } from "../../../Utils/date";
import "../../../../public/BP_resources/css/notes-section.css";
import "../../../../public/BP_resources/css/case.css";

import { formatDate, getCaseId, getClientId } from "../../../Utils/helper";
import { showModal } from "../../../Redux/modal/actions";
import {
  fetchClientProvider,
  fetchClientProviderVerifications,
  // fetchClientProviders,
  fetchCasePageClientProviders,
} from "../../../api/clientProviders";
import {
  setClientProviders,
  setEditCaseProvider,
  setLoading,
  setVerifications,
} from "../../../Redux/client-providers/clientProviderSlice";
import "./MedicalProviders.css";
import {
  setCommonLoadingEffect,
  setComponentLoadingEffect,
} from "../../../Redux/common/Loader/action";
import PulseLoader from "react-spinners/PulseLoader";
import MedicalProviderPlaceholder from "./MedicalProviderPlaceholder";

export default function MedicalProviders() {
  const dispatch = useDispatch();
  const caseSummary = useSelector((state) => state?.caseData?.summary);
  const client = useSelector((state) => state?.client?.current);
  const client_providers = useSelector((state) => state.clientProvider.all);
  const isLoading = useSelector((state) => state.clientProvider.isLoading?.all);
  const show = useSelector((state) => state.modal.show);
  const medicalProvidersLoading = useSelector(
    (state) => state?.loadEffect?.componentLoadStates?.medicalProviders
  );

  useEffect(() => {
    if (caseSummary && client) {
      setLoading({
        key: "all",
        value: true,
      });

      dispatch(setComponentLoadingEffect("medicalProviders", true));
      fetchCasePageClientProviders(getClientId(), getCaseId())
        .then((data) => {
          dispatch(setClientProviders(data?.results));
          setLoading({
            key: "all",
            value: false,
          });
          dispatch(setComponentLoadingEffect("medicalProviders", false));
        })
        .catch((error) => {
          console.error(
            "Error occurred while fetching client-providers",
            error
          );
          dispatch(setComponentLoadingEffect("medicalProviders", false));
          setLoading({
            key: "all",
            value: false,
          });
        });

      // fetchCaseSummary(getClientId(), getCaseId())
      //   .then((data) => {
      //     dispatch(setCaseSummary(data));
      //   })
      //   .catch((err) => {
      //     console.log("Error occurred", err);
      //   });
    }
  }, [caseSummary, client]);

  // useEffect(() => {
  //   if (client_providers && medicalProvidersLoading) {
  //     dispatch(setComponentLoadingEffect("medicalProviders", false));
  //   }
  // }, [client_providers, medicalProvidersLoading]);

  const loadingState = !medicalProvidersLoading || !isLoading;

  return (
    <table
      className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
      id="treatment-summary-table"
    >
      <thead>
        <tr id="tb-header">
          <th className=" td-autosize color-grey-2 p-l-5 text-center">
            Medical Provider
          </th>
          <th className=" text-center color-grey-2">First / Last</th>
          <th className=""></th>
          <th className=" text-center color-grey-2">Visits</th>
          <th className=""></th>
          <th className=" text-center color-grey-2">Records / Bills</th>
          <th className=""></th>
          <th className=" text-center color-grey-2">Original / Lien</th>
        </tr>
      </thead>
      <tbody>
        {!medicalProvidersLoading ? (
          client_providers && client_providers.length > 0 ? (
            client_providers?.map((client_provider, index) => (
              <tr
                className={`height-50 has-speciality-color-${client_provider?.specialty?.id}`}
                id="treatment-summary-row"
                data-table_id={36}
                data-toggle="modal"
                data-target="#edit-case-provider-modal"
                onClick={() => {
                  if (!show) {
                    dispatch(showModal());
                    dispatch(
                      setLoading({
                        key: "editCaseProvider",
                        value: true,
                      })
                    );
                    fetchClientProvider(client_provider.id)
                      .then((data) => {
                        dispatch(setEditCaseProvider(data));
                        dispatch(
                          setLoading({
                            key: "editCaseProvider",
                            value: false,
                          })
                        );
                      })
                      .catch((err) => {
                        console.log("Error Occurred fetchClientProvider", err);
                        dispatch(
                          setLoading({
                            key: "editCaseProvider",
                            value: false,
                          })
                        );
                      });
                    fetchClientProviderVerifications(
                      client_provider.id,
                      "CaseProviders",
                      "all"
                    )
                      .then((verificationData) => {
                        dispatch(setVerifications(verificationData));
                      })
                      .catch((err) => {
                        console.log(
                          "Error Occurred fetchClientProviderVerifications",
                          err
                        );
                      });
                  }
                }}
              >
                {client_provider.profile_pic ? (
                  <td
                    className={`td-autosize bg-speciality-10 color-black`}
                    style={{ height: "50px" }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ width: "fit-content" }}
                    >
                      <span
                        className="d-flex align-items-center justify-content-center text-center text-white specialty-icon flex-shrink-0"
                        style={{
                          backgroundColor: `${client_provider?.specialty?.color}`,
                          height: "50px",
                        }}
                      >
                        {client_provider?.specialty?.name[0]}
                      </span>
                      <p
                        className="p-l-5 p-r-5"
                        style={{ fontWeight: "600", wordBreak: "break-word" }}
                      >
                        {client_provider?.treatment_location?.name
                          ? client_provider?.treatment_location?.name
                          : null}
                      </p>
                    </div>
                  </td>
                ) : (
                  <td
                    className=" td-autosize bg-speciality-10 color-black"
                    style={{ height: "50px" }}
                  >
                    <div
                      className="d-flex align-items-center"
                      style={{ width: "fit-content" }}
                    >
                      <span
                        className="d-flex align-items-center justify-content-center text-center text-white specialty-icon flex-shrink-0"
                        style={{
                          backgroundColor: `${client_provider?.specialty?.color}`,
                          height: "50px",
                        }}
                      >
                        {client_provider?.specialty?.name[0]}
                      </span>
                      <p
                        className="p-l-5 p-r-5"
                        style={{ fontWeight: "600", wordBreak: "break-word" }}
                      >
                        {client_provider?.treatment_location?.name
                          ? client_provider?.treatment_location?.name
                          : null}
                      </p>
                    </div>
                  </td>
                )}
                <td className="td-autosize" style={{ height: "50px" }}>
                  <div
                    className="d-flex flex-column "
                    style={{ height: "50px" }}
                  >
                    {/* First Date */}
                    <div
                      className="d-flex align-items-center justify-content-between height-25"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.first_date
                          ?.verified ? (
                          client_provider?.verification_details?.first_date
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  client_provider?.verification_details
                                    ?.first_date.details[0]?.profile_pic
                                }
                                alt={
                                  client_provider?.verification_details
                                    ?.first_date.details[0]?.date
                                }
                                className="pl-0"
                              />
                            </span>
                          ) : (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                          )
                        ) : (
                          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img"></span>
                        )}
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {client_provider?.bp_treatment_notes &&
                          [...client_provider?.bp_treatment_notes]
                            ?.sort(
                              (a, b) => new Date(a.date) - new Date(b.date)
                            )
                            ?.map((note, index) =>
                              index === 0 ? (
                                <span key={note.id}>
                                  {formatDate(note.date)}
                                </span>
                              ) : null
                            )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.first_date
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>

                    {/* Second Date */}
                    <div
                      className="d-flex align-items-center justify-content-between height-25"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.second_date
                          ?.verified ? (
                          client_provider?.verification_details?.second_date
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  client_provider?.verification_details
                                    ?.second_date?.details[0]?.profile_pic
                                }
                                alt=""
                                className="pl-0"
                              />
                            </span>
                          ) : (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                          )
                        ) : (
                          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img"></span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ fontWeight: "600" }}
                      >
                        {client_provider?.bp_treatment_notes &&
                          [...client_provider?.bp_treatment_notes]
                            ?.sort(
                              (a, b) => new Date(a.date) - new Date(b.date)
                            )
                            ?.map((note, index) =>
                              index ===
                              client_provider?.bp_treatment_notes.length - 1 ? (
                                <span key={note.id}>
                                  {formatDate(note.date)}
                                </span>
                              ) : null
                            )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.second_date
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className=""></td>
                <td
                  className="td-autosize"
                  style={{ width: "19px", height: "50px" }}
                >
                  <div
                    className="d-flex align-items-center height-25 justify-content-between"
                    style={{ gap: "5px", fontWeight: "600" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "max-content" }}
                    >
                      {client_provider?.verification_details?.visits
                        ?.verified ? (
                        client_provider?.verification_details?.visits
                          ?.details[0]?.profile_pic ? (
                          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                            <img
                              src={
                                client_provider?.verification_details?.visits
                                  ?.details[0]?.profile_pic
                              }
                              alt=""
                              className="pl-0"
                            />
                          </span>
                        ) : (
                          <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                        )
                      ) : (
                        <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img"></span>
                      )}
                    </div>
                    {client_provider?.visits}
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "max-content" }}
                    >
                      {client_provider?.verification_details?.visits
                        ?.verified ? (
                        <i className="ic ic-verified ic-19"></i>
                      ) : (
                        <i className="ic ic-unverified ic-19"></i>
                      )}
                    </div>
                  </div>
                </td>

                <td className=""></td>
                <td
                  className="color-black td-autosize"
                  style={{ height: "50px" }}
                >
                  <div className="d-flex flex-column">
                    <div
                      className="d-flex align-items-center height-25 justify-content-between"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.record_received
                          ?.verified ? (
                          client_provider?.verification_details?.record_received
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  client_provider?.verification_details
                                    ?.record_received?.details[0]?.profile_pic
                                }
                                alt=""
                                className="pl-0"
                              />
                            </span>
                          ) : (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                          )
                        ) : (
                          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img"></span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ fontWeight: "600" }}
                      >
                        {client_provider?.record_received ? (
                          <span>
                            Received{" "}
                            {formatDate(client_provider?.record_received)}
                          </span>
                        ) : (
                          <span>Waiting</span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.record_received
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>

                    <div
                      className="d-flex align-items-center height-25 justify-content-between"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.billing_received
                          ?.verified ? (
                          client_provider?.verification_details
                            ?.billing_received?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  client_provider?.verification_details
                                    ?.billing_received?.details[0]?.profile_pic
                                }
                                alt=""
                                className="pl-0"
                              />
                            </span>
                          ) : (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                          )
                        ) : (
                          <span className="ic ic-avatar-grey ic-19 has-avatar-icon has-cover-img"></span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ fontWeight: "600" }}
                      >
                        {client_provider?.billing_received ? (
                          <span>
                            Received{" "}
                            {formatDate(client_provider.billing_received)}
                          </span>
                        ) : (
                          <span>Waiting</span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {client_provider?.verification_details?.billing_received
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td></td>
                <td className="td-autosize" style={{ height: "50px" }}>
                  <div className="d-flex flex-column">
                    {client_provider?.amount > 0 ? (
                      <div
                        class="text-end height-25"
                        style={{ fontWeight: "600" }}
                      >
                        $ {formatNum(client_provider?.amount)}
                      </div>
                    ) : (
                      <div
                        class="text-end text-primary-50 height-25"
                        style={{ fontWeight: "600" }}
                      >
                        $ {formatNum(client_provider?.amount)}
                      </div>
                    )}
                    {client_provider?.final > 0 ? (
                      <div
                        class="text-end height-25"
                        style={{ fontWeight: "600" }}
                      >
                        $ {formatNum(client_provider?.final)}
                      </div>
                    ) : (
                      <div
                        class="text-end text-primary-50 height-25"
                        style={{ fontWeight: "600" }}
                      >
                        $ {formatNum(client_provider?.final)}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <MedicalProviderPlaceholder />
          )
        ) : (
          Array.from({ length: caseSummary?.providers_count || 0 }).map(
            (_, index) => (
              <tr key={index}>
                <td colSpan={8} className="empty-row">
                  <div
                    style={{
                      height: "25px", // You can set a height here to match your table rows
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></div>
                </td>
              </tr>
            )
          )
        )}
      </tbody>
    </table>
  );
}
