import React, { useEffect, useState } from "react";
import { Stages } from "../common/CaseStage";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommulativeChecklist } from "../../Redux/search/actions";
import { CustomDropdown } from "../common/Dropdown";
import { useLocation } from "react-router-dom";
import api, { api_without_cancellation } from "../../api/api";
import FlagModal from "../Modals/flagModal";
import Loader from "react-loaders";
import PulseLoader from "react-spinners/PulseLoader";
import {
  setCommonLoadingEffect,
  setComponentLoadingEffect,
} from "../../Redux/common/Loader/action";
import { getCaseId, getClientId } from "../../Utils/helper";
import "./detailBar.css";
import PinnedCasePopUp from "../Modals/PinnedCasePopUp";
const DetailBar = (props) => {
  const dispatch = useDispatch();
  const currentCase = useSelector((state) => state?.caseData?.current);
  const stages = useSelector((state) => state?.caseData?.stages);
  const client = useSelector((state) => state?.client?.current);
  const url = window.location.pathname;
  const paths = url.split("/");
  const client_id = paths[paths.length - 2];
  const todos_count = currentCase?.current_todos;
  const location = useLocation();
  const link = location.pathname.split("/")[1] || "";
  const [flagPage, setFlagPage] = useState();
  const [flagPagesCount, setFlagPagesCount] = useState("");
  const [flagModalShow, setFlagModalShow] = useState(false);
  const [isFlagPageLoading, setFlagPageIsLoading] = useState(true);
  const dynamicWidth = useSelector((state) => state.dynamicWidth.dynamicWidth);
  const statusLoader = useSelector((state) => state?.general?.statusLoader);
  const detailBarLoading = useSelector(
    (state) => state?.loadEffect?.componentLoadStates?.detailBar
  );
  const [pinnedCaseModal, setPinnedCaseModal] = useState(false);
  const [pinnedCases, setPinnedCases] = useState({});

  const handleClose = () => {
    setPinnedCaseModal(false);
  };

  const showPinnedCaseModal = () => {
    setPinnedCaseModal(true);
  };
  const doesAnyPinnedCaseMatchId = () => {
    const pinnedKeys = [
      "p1",
      "p2",
      "p3",
      "p4",
      "p5",
      "p6",
      "p7",
      "p8",
      "p9",
      "p10",
    ];
    const caseIdToCheck = getCaseId(); // Retrieve the case ID to check

    return pinnedKeys.some((key) => {
      const pinnedCase = pinnedCases[key];
      // Check if pinnedCase exists and compare IDs using loose equality (==)
      return pinnedCase && pinnedCase.id == caseIdToCheck; // Using '==' for type coercion
    });
  };

  useEffect(() => {
    if (client && currentCase) {
      dispatch(fetchCommulativeChecklist(getClientId(), getCaseId()));
    }
    const flaggedCases = async () => {
      try {
        const response = await api_without_cancellation
          .get(
            `/api/flaggedcases/${
              client_id ? getClientId() : client_id
            }/${getCaseId()}/`,
            {
              params: {
                page_name: props?.flaggedPageName,
              },
            }
          )
          .then((response) => {
            setFlagPage(response.data.flagPage);
            setFlagPagesCount(response.data.flagPageCount);
            setFlagPageIsLoading(false);
          });
      } catch (error) {
        console.error("error", error);
      }
    };

    flaggedCases();
  }, [dispatch, client, currentCase, props?.newFlags]);

  useEffect(() => {
    const pinnedCases = async () => {
      try {
        const response = await api_without_cancellation
          .get(`/api/pinned-cases/`)
          .then((response) => {
            setPinnedCases(response.data);
          });
      } catch (error) {
        console.error("error", error);
      }
    };
    pinnedCases();
  }, []);

  const flag_page = async () => {
    setFlagModalShow(false);
    setFlagPage({ flagged_by: true });
    await api_without_cancellation
      .post(`/api/flaggedcases/${getClientId()}/${getCaseId()}/`, {
        flaggedPage: props?.flaggedPageName,
        link: link,
      })
      .then((response) => {
        setFlagPage(response.data.flagPage);
        if (typeof props?.setNewFlags === "function") {
          props.setNewFlags((prevState) => [
            ...prevState,
            response.data.flagPage,
          ]);
        }
      })
      .catch((e) => {
        console.error("error", e);
      });
  };

  // const remove_flag = async () => {
  //   await api
  //     .delete(`/api/flaggedcases/${getClientId()}/${getCaseId()}/`, {
  //       data: {
  //         flagPageId: flagPage?.id,
  //       },
  //     })
  //     .then(() => {
  //       setFlagPage();
  //       if (typeof props?.setNewFlags === "function") {
  //         props.setNewFlags([]);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("error", e);
  //     });
  // };
  const remove_flag = async () => {
    try {
      const response = await api_without_cancellation.delete(
        `/api/flaggedcases/${getClientId()}/${getCaseId()}/`,
        {
          data: {
            flagPageId: flagPage?.id,
          },
        }
      );

      if (response.data.data != "Not Deleted") {
        // Perform the necessary actions after successful deletion
        setFlagPage();
        if (typeof props?.setNewFlags === "function") {
          props.setNewFlags([]);
        }
      }
    } catch (e) {
      // Log the error for debugging purposes
      console.error("error", e);
    }
  };

  useEffect(() => {
    if (stages && currentCase?.auto_case_stage?.length > 0) {
      dispatch(setComponentLoadingEffect("detailBar", false));
    }
  }, [stages, currentCase?.auto_case_stage]);

  const open = useSelector((state) => state?.open?.open);

  const [statusLoder, setStatusLoader] = useState(false);
  const [caseStatus, setCaseStatus] = useState([]);

  const fetchStatuse = async () => {
    try {
      setStatusLoader(true);
      const response = await api_without_cancellation.get(
        `/api/cases/statuses/?case_id=${getCaseId()}`
      );

      const data = await response.data;
      setStatusLoader(false);
      setCaseStatus(data);
    } catch (error) {
      console.error("error", error);
      setStatusLoader(false);
    }
  };

  useEffect(() => {
    fetchStatuse();
  }, [getCaseId()]);

  return (
    <>
      <FlagModal
        flagPage={flag_page}
        show={flagModalShow}
        onHide={() => setFlagModalShow(false)}
      />
      <PinnedCasePopUp
        confirmPopUp={pinnedCaseModal}
        handleClose={handleClose}
        pinnedCases={pinnedCases}
        setPinnedCases={setPinnedCases}
      />
      <div
        className="client-information bottom-row d-md-flex flex-wrap bg-white blurred-detail-bar"
        id="client-information"
        style={{ zIndex: "999" }}
      >
        <div
          className="client-details-wrap d-flex d-flex-lg-1"
          style={{
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingLeft: "10px",
            paddingRight: open ? "10px" : "20px",
          }}
        >
          <div className="client-details-inner p-l-10 d-flex-lg-1">
            <div className="row Header-width-100P align-items-start">
              <div
                className="col client-details-first-col"
                style={{ flexBasis: "505.5px", paddingLeft: 133 }}
              >
                <div className="check-detail-items d-none">
                  <div className="d-flex">
                    <p className="font-weight-semibold">Car Accident</p>
                  </div>
                  <div className="d-flex">
                    <div className="text-label">DOI</div>
                    <p className="font-weight-semibold">10/25/2023</p>
                  </div>
                </div>
              </div>

              {detailBarLoading ? (
                <PulseLoader
                  loading={detailBarLoading}
                  size={16}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  color="#19395F"
                  style={{
                    marginLeft: `${dynamicWidth - 296 ?? 0}px`,
                  }}
                />
              ) : (
                <div className="d-flex-lg-1" style={{ height: "50px" }}>
                  <div
                    className="d-flex menu margin-left-001"
                    style={{ height: "25px" }}
                  >
                    <Stages stageCase={currentCase} stages={stages} />
                  </div>
                  <div
                    className="d-flex status-column align-items-center"
                    style={{
                      marginLeft: `${dynamicWidth - 308 ?? 0}px`,
                      height: "25px",
                      marginTop: "-5px",
                    }}
                  >
                    <p className="m-l-10" style={{ marginLeft: "20px" }}>
                      {statusLoder ? (
                        <PulseLoader
                          loading={true}
                          size={14}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                          color="#19395F"
                          style={{
                            paddingTop: `5px`,
                          }}
                        />
                      ) : caseStatus ? (
                        caseStatus?.map((status) => status["name"] + ", ")
                      ) : null}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="to-do-flag-wrapper ml-auto pb-0 col-auto">
            <small className="pr-2 pr-lg-5 text-center">
              <div className="text-label">To-Dos</div>
              <h3 style={{ fontSize: "24px", fontWeight: "700", margin: "0" }}>
                {todos_count}
              </h3>
            </small>
            <div
              className="flagged-icon-wrap text-right d-flex"
              id="flagged_icon_div"
              style={{ marginRight: "5px" }}
            >
              <div
                className="d-flex align-items-center mr-2"
                onClick={showPinnedCaseModal}
              >
                <i
                  className={`ic ic-44 ${doesAnyPinnedCaseMatchId() ? "ic-home" : "ic-home-gray"} cursor-pointer`}
                ></i>
              </div>

              {flagPage?.flagged_by ? (
                <div
                  className="d-flex align-items-center"
                  onClick={remove_flag}
                >
                  <i className="ic ic-44 ic-flag-red cursor-pointer"></i>
                </div>
              ) : flagPagesCount > 0 ? (
                <div
                  className="d-flex align-items-center"
                  onClick={async () => {
                    if (!isFlagPageLoading) {
                      setFlagModalShow(true);
                    }
                  }}
                >
                  <i className="ic ic-44 ic-flag-green-icon d-flex cursor-pointer"></i>
                  {/* <i className="ic ic-44 ic-flag-green cursor-pointer"></i> */}
                </div>
              ) : (
                <div
                  className="d-flex align-items-center"
                  onClick={async () => {
                    if (!isFlagPageLoading) {
                      setFlagModalShow(true);
                    }
                  }}
                >
                  <i className="ic ic-44 ic-flag-grey d-flex cursor-pointer"></i>
                </div>
              )}
            </div>
          </div>
        </div>
        <CustomDropdown />

        {/* <div className="checklist-section-wrapper ml-md-auto height-md-50">
        <CustomDropdown items={dropdownItems} />
      </div> */}
      </div>
    </>
  );
};

export default React.memo(DetailBar);
