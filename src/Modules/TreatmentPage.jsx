import React, { useState, useCallback, useMemo, useEffect } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import { useDispatch, useSelector } from "react-redux";
import MedicalTreatmentIcon from "../assets/images/medical-treatment-icon.svg";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import SimpleIcon from "../assets/images/simple-icon.svg";
import DetailIcon from "../assets/images/detail.svg";
import DatesIcon from "../assets/images/dates.svg";
import "./TreatmentPage.css";
import {
  fetchShakespeareStatus,
  getCaseId,
  getClientId,
} from "../Utils/helper";
import TreatmentDatesPageTable from "./TreatmentDatesPageTable";
import TreatmentPageDetailPage from "./TreatmentPageDetailPage";
import CommonFooter from "../Components/common/footer";
import TreatmentPageSimplePage from "./TreatmentPageSimplePage";
import styled from "styled-components";
import TreatmentTabs from "../Components/TreatmentPage/TreatmentTabs";
import AddNewProvider from "../Components/TreatmentPage/modals/AddNewProvider";
import api, { api_without_cancellation } from "../api/api";
import {
  useGetCaseProviders,
  useGetCaseSpecialities,
  useGetTreatmentDates,
} from "../Components/TreatmentPage/hooks/useApiResource";
import SpecialtyFilters from "../Components/TreatmentPage/components/SpecialityFilters";
import TableLoader from "../Components/Loaders/tableLoader";
import TreatmentFooter from "../Components/TreatmentPage/components/treatmentFooter";
import TreatmentDatesModal from "../Components/TreatmentPage/treatment-dates-modal/treatmentDatesModal";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import ClientProvidersStyles from "../Components/CaseDashboard/ClientProvidersStyles";

const Wrapper = styled.div`
  > :first-of-type .CheckListSection {
    top: -10px;
  }
`;

const TreatmentPage = () => {
  // redux
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.todos);
  // constants
  const caseID = getCaseId();
  const clientID = getClientId();

  const [HandlePage, setHandlePage] = useState("detail");
  const [activeSpecialty, setActiveSpecialty] = useState("all");

  const [firmName, setFirmName] = useState();
  const [newProviderShow, setNewProviderShow] = useState(false);
  const [treatmentDatesPopUpShow, setTreatmentDatesPopUpShow] = useState(false);
  const [treatmentDateData2, setTreatmentDateData2] = useState([]);

  const { data: caseProvidersList, refetch, loading } = useGetCaseProviders();
  const { data: specialitiesList, refetch: refetchSpecial } =
    useGetCaseSpecialities();
  const { data: treatmentDateData, refetch: refetchTreatment } =
    useGetTreatmentDates();
  console.log(specialitiesList);
  const handleSpecialtyChange = (id) => {
    setActiveSpecialty(id);
  };

  useEffect(() => {
    if (treatmentDateData) {
      setTreatmentDateData2(treatmentDateData);
    }
  }, [treatmentDateData]);

  const filteredProviders = useMemo(() => {
    const result = {};
    specialitiesList.forEach((specialty) => {
      if (activeSpecialty === "all" || activeSpecialty === specialty.id) {
        result[specialty.id] = caseProvidersList.filter(
          (provider) => provider.specialty === specialty.id
        );
      }
    });

    if (activeSpecialty === "all") {
      result["null"] = caseProvidersList.filter(
        (provider) => provider.specialty === null
      );
    }
    return result;
  }, [specialitiesList, caseProvidersList, activeSpecialty]);

  React.useEffect(() => {
    async function fetchFirmName() {
      try {
        const response = await api_without_cancellation.get(
          `/api/cases/${clientID}/${caseID}/summary/`
        );
        console.log(response.data);
        setFirmName(response?.data);
      } catch (error) {
        console.error("Error fetching firm name:", error);
      }
    }

    fetchFirmName();
  }, []);

  React.useEffect(() => {
    async function fetchPagePreference() {
      try {
        const response = await api_without_cancellation.get(
          "/api/home/firmuser-preferences/"
        );

        if (response.data?.ProviderFull) {
          setHandlePage("detail");
        } else if (response.data?.ProviderSimple) {
          setHandlePage("simple");
        } else if (response.data?.ProviderDates) {
          setHandlePage("dates");
        }
      } catch (error) {
        console.error("Error fetching page preference:", error);
      }
    }

    fetchPagePreference();
  }, []);

  React.useEffect(() => {
    fetchShakespeareStatus(caseID, clientID, "Treatment", dispatch);
  }, [caseID, clientID]);

  const handlePageChange = useCallback((pageType) => {
    setHandlePage(pageType);
  }, []);
  const handleNewProviderShow = useCallback(() => {
    setNewProviderShow(true);
  }, []);

  const handleNewProviderClose = useCallback((shouldRefresh = false) => {
    setNewProviderShow(false);
    if (shouldRefresh === "true") {
      refetch();
      refetchSpecial();
      refetchTreatment();
    }
  }, []);

  const handleTreatmentDatesPopUpClose = useCallback(
    (shouldRefresh = false) => {
      setTreatmentDatesPopUpShow(false);
      if (shouldRefresh === "true") {
        refetch();
        refetchSpecial();
        refetchTreatment();
      }
    },
    []
  );

  const handleTreatmentDatesPopUpShow = useCallback(() => {
    setTreatmentDatesPopUpShow(true);
  }, []);

  const refetchAll = () => {
    console.log("Hi");
    try {
      refetch(true);
      refetchSpecial(true);
      refetchTreatment(true);
    } catch (error) {
      console.error(error);
    }
  };

  const [progress, setProgress] = React.useState(0);

  // React.useEffect(() => {
  //   let timer = null;

  //   if (!loading) {
  //     timer = setInterval(() => {
  //       setProgress((oldProgress) => {
  //         if (oldProgress === 100) {
  //           return 0;
  //         }
  //         const diff = Math.random() * 10;
  //         return Math.min(oldProgress + diff, 100);
  //       });
  //     }, 200);
  //   }

  //   return () => {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   };
  // }, [loading]);

  const tabsData = [
    {
      id: "simple",
      label: "Simple",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-60)",

      onClick: () => handlePageChange("simple"),
      leftHand: true,
      span: (
        <span className="font-weight-bold text-gold">
          <img src={SimpleIcon} width="25" alt="Dates" />
        </span>
      ),
    },
    {
      id: "treatment",
      label: "Detail",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-60)",

      onClick: () => handlePageChange("detail"),
      leftHand: true,
      span: (
        <span className="font-weight-bold text-gold">
          <img src={DetailIcon} width="25" alt="Detail" />
        </span>
      ),
    },
    {
      id: "dates",
      label: "Dates",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-60)",
      left: "0px",
      onClick: () => handlePageChange("dates"),
      leftHand: true,
      span: (
        <span className="font-weight-bold text-gold">
          <img src={DatesIcon} width="25" alt="Dates" />
        </span>
      ),
    },
    {
      id: "newProvider",
      label: "Provider",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-60)",

      left: "0px",
      onClick: handleNewProviderShow,
      leftHand: true,
      span: <span className="font-weight-bold p-r-5 text-gold">+</span>,
    },
    {
      id: "treatmentDates",
      label: "Dates",
      className: "tab-trapezium-cycles-corners",
      background: "var(--primary-60)",

      left: "0px",
      onClick: handleTreatmentDatesPopUpShow,
      leftHand: true,
      span: <span className="font-weight-bold p-r-5 text-gold">+</span>,
    },
  ];

  const [maxWidth, setMaxWidth] = useState(225);
  return (
    <>
      <div className="page-wrapper">
        <Sidebar pages={reduxData} />
        <div className="page-container overflow-hidden">
          <NavBar
            flaggedPageName="Treatment"
            client={reduxData}
            currentCase={reduxData}
          />
          <ActionBarComponent
            src={MedicalTreatmentIcon}
            page_name={"Treatment"}
            buttons={[]}
            isChecklist={true}
          />
          <div className="TreatmentPage-main-container invisible-scrollbar">
            <div className="d-flex align-items-center">
              <SpecialtyFilters
                specialitiesList={specialitiesList}
                activeSpecialty={activeSpecialty}
                onSpecialtyChange={handleSpecialtyChange}
                setMaxWidth={setMaxWidth}
              />
              <div style={{ minWidth: "71%" }}>
                <TreatmentTabs
                  handlePage={HandlePage}
                  tabsData={tabsData}
                  height={25}
                />
              </div>
            </div>
            {loading ? (
              <Box sx={{ width: "100%", paddingTop: "15px" }}>
                <LinearProgress
                  sx={{
                    backgroundColor: "#8C9AAF", // Background track color
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#19395f", // Progress bar color
                    },
                  }}
                />
              </Box>
            ) : (
              <div
                style={{
                  height: "100%",
                }}
              >
                <ClientProvidersStyles
                  clientProviders={[
                    {
                      specialty: {
                        ...specialitiesList,
                      },
                    },
                  ]}
                />
                {HandlePage === "detail" ? (
                  <Wrapper>
                    {specialitiesList.map((specialitie) =>
                      filteredProviders[specialitie.id]?.map((caseProvider) => (
                        <TreatmentPageDetailPage
                          key={caseProvider?.id}
                          caseProvider={caseProvider}
                          specialitiesList={specialitie}
                          firmName={firmName}
                          refetchAll={refetchAll}
                          refetchTreatment={refetchTreatment}
                          handleTreatmentDatesPopUpShow={
                            handleTreatmentDatesPopUpShow
                          }
                          maxWidth={maxWidth}
                        />
                      ))
                    )}

                    {filteredProviders["null"]?.map((caseProvider) => (
                      <TreatmentPageDetailPage
                        key={caseProvider?.id}
                        caseProvider={caseProvider}
                        specialitiesList={{
                          id: "null",
                          name: "",
                          color: "#19395f",
                          secondary_color: "#75889f",
                        }}
                        firmName={firmName}
                        refetchAll={refetchAll}
                        refetchTreatment={refetchTreatment}
                        maxWidth={maxWidth}
                      />
                    ))}
                  </Wrapper>
                ) : HandlePage === "simple" ? (
                  <>
                    <Wrapper>
                      {specialitiesList.map((specialitie) =>
                        filteredProviders[specialitie.id]?.map(
                          (caseProvider) => (
                            <TreatmentPageSimplePage
                              key={caseProvider?.id}
                              caseProvider={caseProvider}
                              specialitiesList={specialitie}
                              firmName={firmName}
                              refetchAll={refetchAll}
                              maxWidth={maxWidth}
                            />
                          )
                        )
                      )}

                      {filteredProviders["null"]?.map((caseProvider) => (
                        <TreatmentPageSimplePage
                          key={caseProvider?.id}
                          caseProvider={caseProvider}
                          specialitiesList={{
                            id: "null",
                            name: "",
                            color: "#19395f",
                            secondary_color: "#75889f",
                          }}
                          firmName={firmName}
                          refetchAll={refetchAll}
                          maxWidth={maxWidth}
                        />
                      ))}
                    </Wrapper>
                  </>
                ) : HandlePage === "dates" ? (
                  <>
                    <TreatmentDatesPageTable
                      treatmentDateData={treatmentDateData2}
                      setTreatmentDateData2={setTreatmentDateData2}
                      activeSpecialty={activeSpecialty}
                      refetchTreatment={refetchTreatment}
                    />
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
      {newProviderShow && (
        <AddNewProvider
          show={newProviderShow}
          handleClose={handleNewProviderClose}
          firmName={firmName}
        />
      )}

      {treatmentDatesPopUpShow && (
        <TreatmentDatesModal
          show={treatmentDatesPopUpShow}
          handleClose={handleTreatmentDatesPopUpClose}
          // firmName={firmName}
          caseProvider={caseProvidersList}
          specialitie={specialitiesList}
          firmName={firmName}
        />
      )}

      <TreatmentFooter />
    </>
  );
};

export default React.memo(TreatmentPage);
