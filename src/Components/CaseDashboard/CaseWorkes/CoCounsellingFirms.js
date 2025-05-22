import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AttachUserModal from "../AttachUserModal";
import "./CaseWorkers.css";

export const CoCounsellingFirms = () => {
  const clickRecordsDate = [];
  const currentCase = useSelector((state) => state.caseData?.current);
  const caseSummary = useSelector((state) => state.caseData?.summary);

  return (
    <>
      {caseSummary?.case_councelling_firms &&
        caseSummary?.case_councelling_firms.map((counsellingFirm) => (
          <div className="row m-b-5 m-t-5">
            <div className="col-12 position-relative overflow-hidden">
              <div className="expandable-section">
                <div className="p-l-5 background-main-10 height-25">
                  <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                    Co-Counsel Firm:{" "}
                    {
                      counsellingFirm.firm.counseling_firm.attorneyprofile
                        .office_name
                    }{" "}
                    Case Users
                  </h4>
                </div>
                <div className="d-none align-items-center p-b-5 ">
                  <h3 className="font-weight-normal height-25">
                    Usama Associates
                  </h3>
                  <button
                    type="button"
                    className="btn btn-primary height-25 text-uppercase d-flex align-items-center justify-content-center bg-clr-primary"
                    data-toggle="modal"
                    data-target="#add_firm_user"
                  >
                    Select Firm Users for each case role
                  </button>
                </div>
                <div className="d-md-flex f-gap-05">
                  <div className="table-responsive table--no-card rounded-0 border-0 position-relative">
                    <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel large-spacing-around table-layout-fixed">
                      <tbody>
                        {counsellingFirm?.firm_users &&
                          counsellingFirm?.firm_users?.map(
                            (firmUser, index) => {
                              if (index % 2 === 1) {
                                return (
                                  <tr key={index}>
                                    <td className="color-black">
                                      {caseSummary?.workers[0].name}
                                    </td>
                                    <td className="d-flex justify-content-between align-items-center w-100 color-black">
                                      {firmUser?.profile_pic_29p ? (
                                        <button
                                          className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                          type="button"
                                          data-toggle="modal"
                                          data-target={`#avatarModal${index}`}
                                        >
                                          <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                            <img
                                              id={`output${index}`}
                                              src={firmUser?.profile_pic_29p}
                                              alt="Profile"
                                            />
                                          </div>
                                          <div className="ml-2">
                                            {firmUser?.user?.first_name}{" "}
                                            {firmUser?.user?.last_name}
                                          </div>
                                        </button>
                                      ) : (
                                        <div className="d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1">
                                          <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></div>
                                          <div className="ml-2">
                                            {firmUser?.user?.first_name}{" "}
                                            {firmUser?.user?.last_name}
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {clickRecordsDate
                                        .filter(
                                          (click) =>
                                            click.user.id === firmUser.user.id
                                        )
                                        .map((click, idx) => (
                                          <span key={idx}>
                                            {formatDate(click.created_at)}
                                          </span>
                                        ))}
                                    </td>
                                  </tr>
                                );
                              }
                              return null;
                            }
                          )}
                      </tbody>
                    </table>
                  </div>

                  <div className="table-responsive table--no-card rounded-0 border-0">
                    <table className="table table-borderless table-striped table-earning has-height-25 has-table-sub-panel large-spacing-around table-layout-fixed">
                      <tbody>
                        {counsellingFirm?.firm_users &&
                          counsellingFirm?.firm_users?.map(
                            (firmUser, index) => {
                              if (index % 2 === 0) {
                                return (
                                  <tr key={index}>
                                    <td className="color-black">
                                      {caseSummary?.workers[0].name}
                                    </td>
                                    <td className="color-black">
                                      {firmUser?.profile_pic_29p ? (
                                        <button
                                          className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                          type="button"
                                          data-toggle="modal"
                                          data-target={`#avatarModal${index}`}
                                        >
                                          <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                            <img
                                              id={`output${index}`}
                                              src={firmUser?.profile_pic_29p}
                                              alt="Profile"
                                            />
                                          </div>
                                          <div className="ml-2">
                                            {firmUser?.user.first_name}{" "}
                                            {firmUser?.user.last_name}
                                          </div>
                                        </button>
                                      ) : (
                                        <button
                                          className="btn d-flex align-items-center justify-content-start padding-transform-visibility-margin flex-g-1"
                                          type="button"
                                        >
                                          <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></div>
                                          <div className="ml-2">
                                            {firmUser?.user.first_name}{" "}
                                            {firmUser?.user.last_name}
                                          </div>
                                        </button>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {clickRecordsDate &&
                                        clickRecordsDate
                                          .filter(
                                            (click) =>
                                              click.user?.id ===
                                              firmUser.user?.id
                                          )
                                          .map((click, idx) => (
                                            <span key={idx}>
                                              {formatDate(click.created_at)}
                                            </span>
                                          ))}
                                    </td>
                                  </tr>
                                );
                              }
                              return null;
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
