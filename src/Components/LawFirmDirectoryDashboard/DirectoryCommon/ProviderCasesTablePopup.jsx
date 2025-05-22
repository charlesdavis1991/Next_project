import React, { useMemo } from "react";
import "../../../../public/BP_resources/css/notes-section.css";
import "../../../../public/BP_resources/css/case.css";
import "../../CaseDashboard/MedicalProvidersTable/MedicalProviders.css";
import { formatDate } from "../../../Utils/helper";
import { formatNum } from "../../../Utils/date";
import ClientProvidersStyles from "../../CaseDashboard/ClientProvidersStyles";
import incidentIcon from "../../../assets/images/incident.svg";

export default function ProviderCasesTablePopup({
  providerCases,
  closedCases,
}) {
  console.log("providerCases: ", providerCases);

  const totalOriginal = useMemo(() => {
    return providerCases.reduce(
      (sum, providerCase) => sum + (Number(providerCase?.amount) || 0),
      0
    );
  }, [providerCases]);

  const totalLien = useMemo(() => {
    return providerCases.reduce(
      (sum, providerCase) => sum + (Number(providerCase?.final) || 0),
      0
    );
  }, [providerCases]);

  const emptyRowsCount = useMemo(() => {
    const actualRows = providerCases?.length || 0;
    if (actualRows >= 14) return 0;
    return 14 - actualRows;
  }, [providerCases]);

  const emptyRows = useMemo(() => {
    return Array(emptyRowsCount)
      .fill(0)
      .map((_, index) => index);
  }, [emptyRowsCount]);

  return (
    <>
      <ClientProvidersStyles clientProviders={providerCases} />
      <div className="provider-cases-table-container font-weight-600">
        <table
          className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
          id="provider-cases-table"
        >
          <thead>
            <tr id="tb-header">
              <th className="text-center color-grey-2">Client</th>
              <th className="text-center color-grey-2">Case</th>
              <th className="text-center color-grey-2">Incident Date</th>
              <th className="text-center color-grey-2">Open</th>
              <th className="text-center color-grey-2">Closed</th>
              <th className="color-grey-2 p-l-5 text-center">
                Treatment Location
              </th>
              <th className="text-center color-grey-2">Provider Phone</th>
              <th className="text-center color-grey-2">Visits</th>
              <th className="text-center color-grey-2">First</th>
              <th className="text-center color-grey-2">Last</th>
              <th className="text-center color-grey-2">Original / Visit</th>
              <th className="text-center color-grey-2">Final / Visit</th>
              {/* <th className="text-end color-grey-2">
                Original = $ {formatNum(totalOriginal)}
              </th>
              <th className="text-end color-grey-2">
                Lien = $ {formatNum(totalLien)}
              </th> */}
            </tr>
          </thead>
          <tbody>
            {providerCases.length > 0 && (
              providerCases.map((providerCase, index) => (
                <tr
                  key={providerCase.id}
                  className={`height-25 has-speciality-color-${providerCase?.specialty?.id}`}
                  id="provider-cases-row"
                >
                  <td className="d-flex">
                    <img
                      className="ic ic-avatar ic-19 has-cover-img user-img-border"
                      id={`output${index}`}
                      src={
                        providerCase?.client?.avatar_url
                          ? providerCase.client.avatar_url
                          : "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                      }
                    />
                    <p className="p-l-5">{providerCase?.client?.name}</p>
                  </td>
                  
                  <td>
                    <div className="d-flex">
                      <img
                        className="ic ic-avatar ic-19 has-cover-img user-img-border"
                        id={`output${index}`}
                        src={
                          providerCase?.case_type?.icon
                            ? providerCase.case_type.icon
                            : "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                        }
                      />
                      <p className="p-l-5">{providerCase?.case_type?.name}</p>
                    </div>
                  </td>

                  <td className="d-flex">
                    <span className="ic-avatar ic-19 d-flex m-r-5">
                      <img src={incidentIcon} />
                    </span>
                    <p className="p-l-r">{formatDate(providerCase?.incident_date)}</p>
                  </td>

                  <td>{formatDate(providerCase?.open_date)}</td>
                  <td>
                    {closedCases ? formatDate(providerCase?.closed_date) : ""}
                  </td>

                  <td className={`bg-speciality-10 color-black`}>
                    <div
                      className="d-flex align-items-center"
                      style={{ width: "fit-content" }}
                    >
                      <span
                        className="d-flex align-items-center justify-content-center text-center text-white font-bold"
                        style={{
                          height: "25px",
                          width: "25px",
                          backgroundColor: `${providerCase?.specialty?.color}`,
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        {providerCase?.specialty?.name[0]}
                      </span>
                      <div className="p-l-5 p-r-5">
                        <p style={{ margin: 0 }}>
                          {providerCase?.treatment_location_details?.address &&
                            `${providerCase?.treatment_location_details?.address}`}
                          {providerCase?.treatment_location_details?.address2 &&
                            `, ${providerCase?.treatment_location_details?.address2}`}
                          {providerCase?.treatment_location_details?.city &&
                            `, ${providerCase?.treatment_location_details?.city}`}
                          {providerCase?.treatment_location_details?.state &&
                            `, ${providerCase?.treatment_location_details?.state}`}
                          {providerCase?.treatment_location_details
                            ?.post_code &&
                            `, ${providerCase?.treatment_location_details?.post_code}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{providerCase?.treatment_location_details?.phone}</td>

                  <td>
                    <div
                      className="d-flex align-items-center  mx-4"
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.visits
                          ?.verified ? (
                          providerCase?.verification_details?.visits?.details[0]
                            ?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  providerCase?.verification_details?.visits
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
                      {providerCase?.visits}
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.visits
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div
                      className="d-flex align-items-center "
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.first_date
                          ?.verified ? (
                          providerCase?.verification_details?.first_date
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  providerCase?.verification_details?.first_date
                                    .details[0]?.profile_pic
                                }
                                alt={
                                  providerCase?.verification_details?.first_date
                                    .details[0]?.date
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
                      <div>
                        {providerCase?.bp_treatment_notes &&
                          [...providerCase?.bp_treatment_notes]
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
                        {providerCase?.verification_details?.first_date
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div
                      className="d-flex align-items-center "
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.second_date
                          ?.verified ? (
                          providerCase?.verification_details?.second_date
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  providerCase?.verification_details
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
                      <div className="d-flex align-items-center justify-content-center">
                        {providerCase?.bp_treatment_notes &&
                          [...providerCase?.bp_treatment_notes]
                            ?.sort(
                              (a, b) => new Date(a.date) - new Date(b.date)
                            )
                            ?.map((note, index) =>
                              index ===
                              providerCase?.bp_treatment_notes.length - 1 ? (
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
                        {providerCase?.verification_details?.second_date
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </td>

                  <td></td>
                  <td></td>
                  {/* <td className="color-black">
                    <div
                      className="d-flex align-items-center "
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-end"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.record_received
                          ?.verified ? (
                          providerCase?.verification_details?.record_received
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  providerCase?.verification_details
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
                        
                      >
                        {providerCase?.record_received ? (
                          <span>
                            Received {formatDate(providerCase?.record_received)}
                          </span>
                        ) : (
                          <span>Waiting</span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.record_received
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="color-black" id="provider-case-no-padding">
                    <div
                      className="d-flex align-items-center "
                      style={{ gap: "5px" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.billing_received
                          ?.verified ? (
                          providerCase?.verification_details?.billing_received
                            ?.details[0]?.profile_pic ? (
                            <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                              <img
                                src={
                                  providerCase?.verification_details
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
                        
                      >
                        {providerCase?.billing_received ? (
                          <span>
                            Received {formatDate(providerCase.billing_received)}
                          </span>
                        ) : (
                          <span>Waiting</span>
                        )}
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "max-content" }}
                      >
                        {providerCase?.verification_details?.billing_received
                          ?.verified ? (
                          <i className="ic ic-verified ic-19"></i>
                        ) : (
                          <i className="ic ic-unverified ic-19"></i>
                        )}
                      </div>
                    </div>
                  </td> */}

                  {/* <td>
                    {providerCase?.amount > 0 ? (
                      <div
                        className="text-end mr-1"
                        
                      >
                        $ {formatNum(providerCase?.amount)}
                      </div>
                    ) : (
                      <div
                        className="text-end text-primary-50 mr-1"
                        
                      >
                        $ {formatNum(providerCase?.amount)}
                      </div>
                    )}
                  </td>

                  <td>
                    {providerCase?.final > 0 ? (
                      <div
                        className="text-end mr-1"
                        
                        id="providerCaseFinalBalance"
                      >
                        $ {formatNum(providerCase?.final)}
                      </div>
                    ) : (
                      <div
                        className="text-end text-primary-50 mr-1"
                        
                        id="providerCaseFinalBalance"
                      >
                        $ {formatNum(providerCase?.final)}
                      </div>
                    )}
                  </td> */}
                </tr>
              )))}
            {emptyRows.map((index) => (
              <tr key={`empty-${index}`} className="height-25">
                <td colSpan={14}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
