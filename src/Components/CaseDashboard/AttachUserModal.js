import React, { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkerOnCase } from "../../Redux/case/actions";
import { useFormik } from "formik";
import { fetchCaseSummary } from "../../api/case";
import { getCaseId, getClientId } from "../../Utils/helper";
import { setCaseSummary } from "../../Redux/caseData/caseDataSlice";
import api from "../../api/api";

const AttachUserModal = () => {
  const firmRoles = useSelector(
    (state) => state?.caseData?.summary?.firm_roles
  );

  const dispatch = useDispatch();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const caseSummary = useSelector((state) => state.caseData?.summary);

  const [workers, setWorkers] = useState([]);
  const [dropdowns, setDropdowns] = useState(
    Array(workers.length || 6).fill(false)
  );

  useEffect(() => {
    if (currentCase && caseSummary && caseSummary?.workers) {
      setWorkers([
        {
          firm_user: currentCase?.firm_user1,
          user_type: caseSummary?.workers[0],
        },
        {
          firm_user: currentCase?.firm_user2,
          user_type: caseSummary?.workers[1],
        },
        {
          firm_user: currentCase?.firm_user3,
          user_type: caseSummary?.workers[2],
        },
        {
          firm_user: currentCase?.firm_user4,
          user_type: caseSummary?.workers[3],
        },
        {
          firm_user: currentCase?.firm_user5,
          user_type: caseSummary?.workers[4],
        },
        {
          firm_user: currentCase?.firm_user6,
          user_type: caseSummary?.workers[5],
        },
      ]);
    }
  }, [currentCase, caseSummary?.workers]);
  const [isPending, setIsPending] = useState(false);
  const formik = useFormik({
    initialValues: {
      firm_user1: {
        id: workers[0]?.firm_user?.id || "",
        user: {
          first_name: workers[0]?.firm_user?.user?.first_name || "",
          last_name: workers[0]?.firm_user?.user?.last_name || "",
        },
        avatar: workers[0]?.firm_user?.profile_pic_19p || "",
      },
      firm_user2: {
        id: workers[1]?.firm_user?.id || "",
        user: {
          first_name: workers[1]?.firm_user?.user?.first_name || "",
          last_name: workers[1]?.firm_user?.user?.last_name || "",
        },
        avatar: workers[1]?.firm_user?.profile_pic_19p || "",
      },
      firm_user3: {
        id: workers[2]?.firm_user?.id || "",
        user: {
          first_name: workers[2]?.firm_user?.user?.first_name || "",
          last_name: workers[2]?.firm_user?.user?.last_name || "",
        },
        avatar: workers[2]?.firm_user?.profile_pic_19p || "",
      },
      firm_user4: {
        id: workers[3]?.firm_user?.id || "",
        user: {
          first_name: workers[3]?.firm_user?.user?.first_name || "",
          last_name: workers[3]?.firm_user?.user?.last_name || "",
        },
        avatar: workers[3]?.firm_user?.profile_pic_19p || "",
      },
      firm_user5: {
        id: workers[4]?.firm_user?.id || "",
        user: {
          first_name: workers[4]?.firm_user?.user?.first_name || "",
          last_name: workers[4]?.firm_user?.user?.last_name || "",
        },
        avatar: workers[4]?.firm_user?.profile_pic_19p || "",
      },
      firm_user6: {
        id: workers[5]?.firm_user?.id || "",
        user: {
          first_name: workers[5]?.firm_user?.user?.first_name || "",
          last_name: workers[5]?.firm_user?.user?.last_name || "",
        },
        avatar: workers[5]?.firm_user?.profile_pic_19p || "",
      },
    },
    onSubmit: async (values) => {
      setIsPending(true);
      const workerIds = Object.keys(values).reduce((acc, key) => {
        acc[key] = values[key].id;
        return acc;
      }, {});
      // dispatch(updateWorkerOnCase({ ...workerIds, case_id: currentCase.id }));
      const caseID = getCaseId();
      const responseData = await api.post(`/api/case-update/`, {
        ...workerIds,
        case_id: caseID,
      });
      if (responseData.status === 200) {
        dispatch(setCaseSummary(null));
        const data = await fetchCaseSummary(getClientId(), getCaseId());
        dispatch(setCaseSummary(data));
      } else {
        console.log("Error updating case workers");
      }
      setIsPending(false);
      document.getElementById("attach-user-modal-close").click();
    },
    enableReinitialize: true,
  });

  const handleClickOutsideSelect = (e) => {
    if (e.target.closest(".select2-container") === null) {
      setDropdowns((prev) => {
        return prev.map(() => false);
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideSelect);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSelect);
    };
  }, []);

  return (
    <div>
      <div
        className="modal generic-popup fade bd-example-modal-lg zoom-in"
        id="attach-user-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="attach-user-modal"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header bg-primary justify-content-center">
              <h5 className="modal-title text-white" id="exampleModalLabel">
                Attach and Edit Case Workers Assigned to Case
              </h5>
            </div>
            <div className="modal-body">
              <table className="table">
                <tbody>
                  {workers.length > 0 &&
                    workers.slice(0, 3).map((worker, index) => (
                      <tr>
                        <td className="border-0px-padding-0px-0px-10px-10px">
                          {workers[index]?.user_type?.name}:
                        </td>
                        <td className="border-0px-padding-0px-0px-10px-10px drop-down">
                          <span
                            className="select2 select2-container select2-container--default select2-container--below select2-container--focus"
                            dir="ltr"
                            // style={{ width: 100 }}
                            data-select2-id={1}
                            onClick={() => {
                              setDropdowns((prev) => {
                                const newDropdowns = [...prev];
                                newDropdowns[index] = !newDropdowns[index];
                                return newDropdowns;
                              });
                            }}
                          >
                            <span className="selection">
                              <span
                                className="select2-selection select2-selection--single"
                                role="combobox"
                                aria-haspopup="true"
                                aria-expanded="false"
                                tabIndex={0}
                                aria-labelledby="select2-user_type1-container"
                              >
                                <span
                                  className="select2-selection__rendered"
                                  id="select2-user_type1-container"
                                  title={
                                    formik.values["firm_user" + (index + 1)]
                                      .user.first_name
                                  }
                                >
                                  <span className="d-flex align-items-center">
                                    {formik.values["firm_user" + (index + 1)]
                                      .avatar ? (
                                      <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                        <img
                                          src={
                                            formik.values[
                                              "firm_user" + (index + 1)
                                            ].avatar
                                          }
                                          className="img-user"
                                        />{" "}
                                      </div>
                                    ) : (
                                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                        <span className="img-user" />
                                      </span>
                                    )}
                                    <div className="select2_text">
                                      {
                                        formik.values["firm_user" + (index + 1)]
                                          .user.first_name
                                      }{" "}
                                      {
                                        formik.values["firm_user" + (index + 1)]
                                          .user.last_name
                                      }
                                    </div>
                                  </span>
                                </span>
                                <span
                                  className="select2-selection__arrow"
                                  role="presentation"
                                >
                                  <b role="presentation" />
                                </span>
                              </span>
                            </span>
                            <span
                              className="dropdown-wrapper"
                              aria-hidden="true"
                            />
                          </span>
                          {dropdowns[index] && (
                            <span
                              className="select2-container select2-container--default select2-container--open"
                              style={{
                                position: "relative",
                                top: "0px",
                                left: "0px",
                              }}
                            >
                              <span
                                className="select2-dropdown select2-dropdown--below"
                                dir="ltr"
                                style={{ width: "211.233px" }}
                              >
                                <span className="select2-search select2-search--dropdown select2-search--hide">
                                  <input
                                    className="select2-search__field"
                                    type="search"
                                    tabIndex={0}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    role="textbox"
                                  />
                                </span>
                                <span className="select2-results">
                                  <ul
                                    className="select2-results__options"
                                    role="tree"
                                    id="select2-user_type1-results"
                                    aria-expanded="true"
                                    aria-hidden="false"
                                  >
                                    {firmRoles &&
                                      firmRoles.map((role) => (
                                        <li
                                          className="select2-results__option"
                                          id="select2-user_type1-result-jkbs-10"
                                          role="treeitem"
                                          aria-selected="false"
                                          tabIndex={-1}
                                          key={role.id}
                                          onClick={() => {
                                            formik.setFieldValue(
                                              `firm_user${index + 1}`,
                                              {
                                                id: role.for_firm_user.id,
                                                user: {
                                                  first_name:
                                                    role.for_firm_user.user
                                                      .first_name,
                                                  last_name:
                                                    role.for_firm_user.user
                                                      .last_name,
                                                },
                                                avatar:
                                                  role.for_firm_user
                                                    .profile_pic_19p,
                                              }
                                            );
                                            setDropdowns((prev) => {
                                              const newDropdowns = [...prev];
                                              newDropdowns[index] = false;
                                              return newDropdowns;
                                            });
                                          }}
                                        >
                                          <span className="d-flex align-items-center">
                                            {role.for_firm_user
                                              .profile_pic_19p ? (
                                              <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                <img
                                                  src={
                                                    role.for_firm_user
                                                      .profile_pic_19p
                                                  }
                                                  className="img-user"
                                                />
                                              </div>
                                            ) : (
                                              <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                <img
                                                  src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                                                  className="img-user"
                                                />
                                              </span>
                                            )}
                                            <div className="select2_text">
                                              {
                                                role.for_firm_user.user
                                                  .first_name
                                              }{" "}
                                              {
                                                role.for_firm_user.user
                                                  .last_name
                                              }
                                            </div>
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                </span>
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="border-0px-padding-0px-0px-10px-10px">
                          {workers[index + 3]?.user_type?.name}:
                        </td>
                        <td className="border-0px-padding-0px-0px-10px-10px drop-down">
                          <span
                            className="select2 select2-container select2-container--default"
                            dir="ltr"
                            style={{ width: 100 }}
                            data-select2-id={index + 3}
                            onClick={() => {
                              setDropdowns((prev) => {
                                const newDropdowns = [...prev];
                                newDropdowns[index + 3] =
                                  !newDropdowns[index + 3];
                                return newDropdowns;
                              });
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <span className="selection">
                              <span
                                className="select2-selection select2-selection--single"
                                role="combobox"
                                aria-haspopup="true"
                                aria-expanded="false"
                                tabIndex={0}
                                aria-labelledby="select2-user_type4-container"
                              >
                                <span
                                  className="select2-selection__rendered"
                                  id="select2-user_type4-container"
                                  title={
                                    formik.values["firm_user" + (index + 4)]
                                      .user.first_name
                                  }
                                >
                                  <span className="d-flex align-items-center">
                                    {formik.values["firm_user" + (index + 4)]
                                      .avatar ? (
                                      <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                        <img
                                          src={
                                            formik.values[
                                              "firm_user" + (index + 4)
                                            ].avatar
                                          }
                                          className="img-user"
                                        />{" "}
                                      </div>
                                    ) : (
                                      <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                        <span className="img-user" />
                                      </span>
                                    )}
                                    <div className="select2_text">
                                      {
                                        formik.values["firm_user" + (index + 4)]
                                          .user.first_name
                                      }{" "}
                                      {
                                        formik.values["firm_user" + (index + 4)]
                                          .user.last_name
                                      }
                                    </div>
                                  </span>
                                </span>
                                <span
                                  className="select2-selection__arrow"
                                  role="presentation"
                                >
                                  <b role="presentation" />
                                </span>
                              </span>
                            </span>
                            <span
                              className="dropdown-wrapper"
                              aria-hidden="true"
                            />
                          </span>
                          {dropdowns[index + 3] && (
                            <span
                              className="select2-container select2-container--default select2-container--open"
                              style={{
                                position: "relative",
                                top: "0px",
                                left: "0px",
                              }}
                            >
                              <span
                                className="select2-dropdown select2-dropdown--below"
                                dir="ltr"
                                style={{ width: "211.233px" }}
                                onClick={() => {
                                  console.log("clicked: ", index + 3);
                                  setDropdowns((prev) => {
                                    const newDropdowns = [...prev];
                                    newDropdowns[index + 3] =
                                      !newDropdowns[index + 3];
                                    return newDropdowns;
                                  });
                                }}
                              >
                                <span className="select2-search select2-search--dropdown select2-search--hide">
                                  <input
                                    className="select2-search__field"
                                    type="search"
                                    tabIndex={0}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    role="textbox"
                                  />
                                </span>
                                <span className="select2-results">
                                  <ul
                                    className="select2-results__options"
                                    role="tree"
                                    id="select2-user_type1-results"
                                    aria-expanded="true"
                                    aria-hidden="false"
                                  >
                                    {firmRoles &&
                                      firmRoles.map((role) => (
                                        <li
                                          className="select2-results__option"
                                          id="select2-user_type1-result-jkbs-10"
                                          role="treeitem"
                                          aria-selected="false"
                                          tabIndex={-1}
                                          key={role.id}
                                          onClick={() => {
                                            formik.setFieldValue(
                                              `firm_user${index + 4}`,
                                              {
                                                id: role.for_firm_user.id,
                                                user: {
                                                  first_name:
                                                    role.for_firm_user.user
                                                      .first_name,
                                                  last_name:
                                                    role.for_firm_user.user
                                                      .last_name,
                                                },
                                                avatar:
                                                  role.for_firm_user
                                                    .profile_pic_19p,
                                              }
                                            );
                                            setDropdowns((prev) => {
                                              const newDropdowns = [...prev];
                                              newDropdowns[index] = false;
                                              return newDropdowns;
                                            });
                                          }}
                                        >
                                          <span className="d-flex align-items-center">
                                            {role.for_firm_user
                                              .profile_pic_19p ? (
                                              <div className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                <img
                                                  src={
                                                    role.for_firm_user
                                                      .profile_pic_19p
                                                  }
                                                  className="img-user"
                                                />
                                              </div>
                                            ) : (
                                              <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                                                <img
                                                  src="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                                                  className="img-user"
                                                />
                                              </span>
                                            )}
                                            <div className="select2_text">
                                              {
                                                role.for_firm_user.user
                                                  .first_name
                                              }{" "}
                                              {
                                                role.for_firm_user.user
                                                  .last_name
                                              }
                                            </div>
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                </span>
                              </span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="attach-user-modal-close"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={formik.handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="loader loader-small" />
                ) : (
                  <>Save Changes to Case Workers Assigned to Case</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachUserModal;
