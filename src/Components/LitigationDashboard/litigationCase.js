import React, { useState, useEffect,useRef } from "react";
import "../../../public/BP_resources/css/litigation.css";
import LitigationCasePopUp from "../Modals/LitigationCasePopUp";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import Button from "../ClientDashboard/shared/button";
import CourtForm from "../CourtForm/CourtForm";
import NotEnablePopUp from "../Modals/NotEnablePopUp";

export default function LitigationCase({ caseInfo, litigation_obj}) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const media_origin =
    node_env === "production" ? "" : process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);

  const caseSummary = useSelector((state) => state.caseData?.summary);
  const [firmUsers, setFirmUsers] = useState([]);

  useEffect(() => {
    if (caseSummary?.workers) {
      const lawyerEntries = Array.from({ length: 6 }, (_, i) => ({
        firm_user: caseSummary[`firm_user${i + 1}`],
        user_type: caseSummary.workers[i]
      })).filter(entry => 
        entry.user_type?.name?.toLowerCase().match(/lawyer|attorney/)
      );
      setFirmUsers(lawyerEntries);
    }
  }, [caseSummary]);
  
  const handleCaseClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Media queries
  const isSmallestCards = useMediaQuery({ minWidth: 2400 });
  const isSmallerCards = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
  const isSmallCards = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
  const isBigCards = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
  const isBiggerCards = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
  const isBiggestCards = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

  const truncateName = (item) => {
    if (item && item.length > 12) {
      return <span title={item}>{item.slice(0, 10) + "..."}</span>;
    }
    return <span>{item}</span>;
  };

  const [showCourtForm, setShowCourtForm] = useState(false);
  const [validationText, setValidationText] = useState("");
  const [validationPopUp, setValidationPopUp] = useState(false);

  const handleValidationPopUp = () => {
    setValidationPopUp(false);
  };

  const handleCourtForm = () => {

    if (litigation_obj && Object.keys(litigation_obj).length === 0) {
      setValidationText("Please select Jurisdiction type and State first.");
      setValidationPopUp(true);
    } else {
      const litigation_jurisdiction_type = litigation_obj?.jurisdiction_type;
      const litigation_states = litigation_obj?.state;
      
      if (litigation_states && litigation_jurisdiction_type) {
        setShowCourtForm(true);
      } else {
        return;
      }
    }
   
  };

  const paragraphRef = useRef(null);
  const [childClass, setChildClass] = useState("");

  useEffect(() => {
      const checkWidth = () => {
          if (paragraphRef.current) {
              const width = paragraphRef.current.offsetWidth;
              if (width > 400) {
                  setChildClass("");
              } else {
                  setChildClass("flex-column justify-content-center");
              }
          }
      };

      checkWidth(); // Check on mount

      // Optional: Check on window resize
      window.addEventListener("resize", checkWidth);
      return () => window.removeEventListener("resize", checkWidth);
  }, []);
  

  return (
    <div ref={paragraphRef} className="dynamic-width-litigation d-flex flex-column p-0 p-r-5">
        <div
          className="flex-grow-1"
          onClick={handleCaseClick}
          style={{ cursor: "pointer" }}
        >
          <div className="text-left h-100 position-relative">
            {/* <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase d-flex justify-content-center align-items-center" style={{height: "25px", backgroundColor: "var(--primary-15)"}}>
              {caseInfo?.case_short_name && caseInfo?.case_number ? <span>{caseInfo?.case_short_name} <span style={{color:"var(--primary-25)"}}>|</span> {caseInfo?.case_number}</span>  : caseInfo?.case_short_name ? caseInfo?.case_short_name : caseInfo?.case_number ? caseInfo?.case_number : "Case"}
            </p> */}
            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase d-flex flex-column justify-content-center align-items-center" style={{backgroundColor: "var(--primary-15)"}}>
              <div>{caseInfo?.case_short_name ? caseInfo?.case_short_name : "Short Case"}</div>
              <div>{caseInfo?.case_number ? caseInfo?.case_number : "Case Number"}</div>
            </p>
            {/* <p className="d-flex justify-content-between">
              <span className="primary25-label mr-1 font-weight-semibold">
                Short Case Name:
              </span>
              <span className="text-right">
                {caseInfo?.case_short_name || ""}
              </span>
            </p> */}
            <div className="d-flex flex-column justify-content-between" style={{height:"calc(100% - 42px)"}}>

            
              <div>
              <p className={`colFont text-black d-flex justify-content-center ${childClass} font-weight-semibold text-right`} style={{backgroundColor:childClass == "" && "var(--primary-4)",flexWrap:"wrap"}}>
                {(() => {
                  const caseName = caseInfo?.case_full_name || "";
                  if (caseName.includes(" and ")) {
                    const parts = caseName.split(" and ");
                    return (
                        <>
                            <span className={`text-center ${childClass == "" ? "" :"p-l-5 p-r-5"} `} style={{backgroundColor:childClass != "" && "var(--primary-2)"}} >{parts[0]} and </span>
                            <span className={`text-center ${childClass == "" ? "" :"p-l-5 p-r-5"} `} style={{marginLeft:childClass == "" && "3px",backgroundColor:childClass != "" && "var(--primary-4)" }}>{parts[1]}</span>
                        </>
                    );
                }
                
                  return (
                    isBigCards || isBiggerCards || isBiggestCards
                      ? truncateName(caseName)
                      : caseName
                  );
                })()}
              </p>
                <div>
                  <p className="case-panel colFont m-0 font-weight-semibold info_address d-flex justify-content-between align-items-start">
                    <span className="primary25-label mr-1 font-weight-semibold p-l-5 p-r-5 color-black" style={{zIndex:1}}>
                      {caseInfo?.jurisdiction_type?.name
                          && `${caseInfo.jurisdiction_type.name} Court: `}
                    </span>
                    <span className="p-l-5 p-r-5" style={{zIndex:1}}>
                      <div className="text-right">
                        {caseInfo?.jurisdiction_obj?.name}
                      </div>
                      <div className="text-right">
                        {caseInfo?.county?.name ? (
                          `${caseInfo.county.name} County, `
                        ) : (
                          <span className="text-wrap text-grey">County, </span>
                        )}
                        {caseInfo?.state?.name ? (
                          `${caseInfo.state.name}`
                        ) : (
                          <span className="text-wrap text-grey">State</span>
                        )}
                      </div>
                    </span>
                  </p>
                </div>
                <p className="colFont m-0 font-weight-normaspan text-black d-flex justify-content-between p-l-5 p-r-5">
                  <span className="mr-1">{"    "}</span>
                  <span className="text-right w-100">
                    {caseInfo?.jurisdiction_obj?.districts?.map((district) => (
                      <span key={district.id}>
                        {district?.name}
                        {", "}
                      </span>
                    ))}
                  </span>
                  {caseInfo?.jurisdiction_obj?.circuits?.length > 0 && (
                    <span className="text-right">
                      {" - "}
                      {caseInfo.jurisdiction_obj.circuits.map((circuit) => (
                        <span key={circuit.id}>
                          {circuit?.circuit_name}
                          {", "}
                        </span>
                      ))}
                    </span>
                  )}
                </p>
              </div>
              <div className="case-panel-2 remaining-height flex-grow-1" style={{background:"var(--primary-10)"}}></div>
              <div >
                { firmUsers &&
                  firmUsers.length > 0 &&
                  firmUsers.slice(0, 3).map((user, index) => (
                    <p style={{backgroundColor: (index%2==0 )? "var(--primary-2)" : "var(--primary-4)"}} key={index} className="d-flex justify-content-between p-l-5 p-r-5 height-21">
                      <span className="primary25-label mr-1 font-weight-semibold">
                        {user?.user_type?.name}:
                      </span>
                      <span className="d-flex align-items-center justify-content-right">
                        <img
                          className={`${user?.firm_user?.is_active ? "img-border" : ""}`+"ic ic-avatar ic-19 has-cover-img user-img-border"}
                          id={`output${index}`}
                          src={
                            user?.firm_user?.profile_pic_29p
                              ? user.firm_user.profile_pic_29p
                              : "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"
                          }
                        />
                        <span className="m-l-5 text-right font-weight-semibold">
                          {user?.firm_user?.user?.first_name}{" "}
                          {user?.firm_user?.user?.last_name}
                        </span>
                      </span>
                    </p>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
          {!window.location.href.includes("bp-courtform") ? (
            <div onClick={handleCourtForm}>
              <Button
                
                showButton={true}
                icon={"ic ic-19 ic-court-form m-r-5"}
                buttonText={"Court Form"}
              />
            </div>
          ) : null}
        {showPopup && (
          <LitigationCasePopUp
            showPopup={showPopup}
            handleClose={handleClosePopup}
            caseInfo={caseInfo}
          />
        )}
        {
          <NotEnablePopUp
            confirmPopUp={validationPopUp}
            handleClose={handleValidationPopUp}
            title={validationText}
          />
        }
        {showCourtForm && (
          <CourtForm
            show={true}
            handleClose={() => setShowCourtForm(false)}
            PageEntity="litigation"
            instanceId={"0"}
            // instanceId={litigation_obj?.id}
          />
        )}
    </div>
  );
}
