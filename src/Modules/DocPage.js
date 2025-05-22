import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import SearchTab from "../Components/DocPage/SearchTab"; // Correct import

import api, { api_without_cancellation } from "../api/api";
import AllDocs from "../Components/DocPage/AllDocs";
import Treatment from "../Components/DocPage/Treatment";
import TabData from "../Components/DocPage/TabData";
import Tabs from "../Components/DocPage/Tabs";

import TableLoader from "../Components/Loaders/tableLoader";
import { getClientId, getCaseId, mediaRoute } from "../Utils/helper";
import { useDocumentModal } from "../Components/DocumentModal/DocumentModalContext";
import { setSearchDocument } from "../Redux/search/searchSlice";
import Footer from "../Components/common/footer";
import "./docPageStyles.css";
import { LinearProgress } from "@mui/material";
import NewDetailedTab from "../Components/DocPage/new-tab/new-detailed-tab";
import NewDocumentTab from "../Components/DocPage/new-tab/new-document-tab";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";

function DocPage() {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const client = useSelector((state) => state.todos.client);
  const pages = useSelector((state) => state.todos.pages);
  const currentCase = useSelector((state) => state.todos.currentCase);
  const currentCaseId = getCaseId();
  const [pageSlots, setPageSlots] = useState([]);

  const [activeTab, setActiveTab] = useState("all");
  const [activeTabName, setActiveTabName] = useState("All");

  const [tabData, setTabData] = useState(null);
  const [_tabData, _setTabData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetchLoading, setrefetchLoading] = useState(false);

  const [allCount, setAllCount] = useState(0);
  const [unsortedCount, setUnsortedCount] = useState(0);
  const [query, setQuery] = useState("");

  const [pageView, setPageView] = useState("detailed");

  const [loaderKey, setLoaderKey] = useState(0);

  const fetchtabsData = async () => {
    try {
      const response = await api.get(
        `${origin}/api/doc-page/doc-page-api-viewset/`,
        {
          params: {
            case_type_id: currentCaseId ? currentCaseId : "",
          },
        }
      );
      if (response.status === 200) {
        setPageSlots(response.data.data?.filter((tab) => tab?.doc_count != 0));
        setUnsortedCount(response.data.unsorted_count);
        setAllCount(response.data.all_count);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const abortControllerRef = useRef(null);

  const fetchData = async () => {
    // if (!loading) setLoading(true);
    if (!refetchLoading) setrefetchLoading(true);
    // Set loading to true before making the API call

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await api.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: activeTab === "all" ? "" : activeTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: activeTab === "all" ? "True" : false,
            client_id: getClientId(),
          },
          signal: controller.signal,
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
        _setTabData(response.data);
        setLoading(false);
        setrefetchLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    fetchtabsData();
  }, []);

  const fetchDataFully = async () => {
    if (!refetchLoading) setrefetchLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // First API call
      const response = await api_without_cancellation.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: activeTab === "all" ? "" : activeTab,
            case_id: currentCaseId || "",
            all_docs: activeTab === "all" ? "True" : false,
            client_id: getClientId(),
          },
          signal: controller.signal,
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setTabData(data);
        _setTabData(data);
        setLoading(false);
        setrefetchLoading(false);
      }

      // Second API call
      const response2 = await api_without_cancellation.get(
        `${origin}/api/doc-page/doc-page-api-viewset/`,
        {
          params: {
            case_type_id: currentCaseId || "",
          },
          signal: controller.signal,
        }
      );

      if (response2.status === 200) {
        const data = response2.data;
        const filteredTabs = data?.data?.filter((tab) => tab?.doc_count !== 0);

        setPageSlots(filteredTabs);
        setUnsortedCount(data.unsorted_count);
        setAllCount(data.all_count);
      }
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        console.log("Request was cancelled");
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      // Ensure loading flags are reset in all scenarios
      setLoading(false);
      setrefetchLoading(false);
    }
  };

  console.log(pageSlots, "tabData");

  useEffect(() => {
    const fetchDataFirstTime = async () => {
      setLoading(true);
      // Set loading to true before making the API call
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create a new controller
      const controller = new AbortController();
      abortControllerRef.current = controller;
      try {
        const response = await api.get(
          `${origin}/api/doc-page/list-page-doc-optimized/`,
          {
            params: {
              page_id: activeTab === "all" ? "" : activeTab,
              case_id: currentCaseId ? currentCaseId : "",
              all_docs: activeTab === "all" ? "True" : false,
              client_id: getClientId(),
            },
            signal: controller.signal,
          }
        );
        if (response.status === 200) {
          setTabData(response.data);
          _setTabData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataFirstTime();
  }, [currentCaseId]);

  const removeEmptyPanels = (pageView) => {
    setPageView(pageView);
    if (activeTab === "all") {
      if (pageView === "default") {
        setTabData(_tabData);
        return;
      }
      let filteredData = tabData?.data?.filter(
        (tab) => tab?.page_docs?.length > 0
      );
      filteredData = filteredData?.map((tab) => {
        const filteredPanels = tab?.panels?.filter(
          (panel) => panel?.documents?.length > 0
        );
        return { ...tab, panels: filteredPanels };
      });
      setTabData({ data: filteredData });
    } else {
      if (pageView === "default") {
        setTabData(_tabData);
        return;
      }
      setTabData((data) => {
        const filteredPanels = data?.panels?.filter(
          (panel) => panel?.documents?.length > 0
        );
        return { ...data, panels: filteredPanels };
      });
    }
  };

  useEffect(() => {
    removeEmptyPanels(pageView);
  }, [activeTab, loading]);

  const handleSelect = async (selectedTab, selectedTabName) => {
    setActiveTab(selectedTab);
    setActiveTabName(selectedTabName);
    setTabData(null); // Reset tabData to null when a new tab is selected
    console.log(loading);
    setLoading(true); // Set loading to true before making the API call
    setLoaderKey((prev) => prev + 1);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await api_without_cancellation.get(
        `${origin}/api/doc-page/list-page-doc-optimized/`,
        {
          params: {
            page_id: selectedTab === "all" ? "" : selectedTab,
            case_id: currentCaseId ? currentCaseId : "",
            all_docs: selectedTab === "all" ? "True" : false,
            query: query,
            client_id: getClientId(),
          },
          signal: controller.signal,
        }
      );
      if (response.status === 200) {
        setTabData(response.data);
        _setTabData(response.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false after the API call is complete
    } finally {
      setLoading(false); // Set loading to false after the API call is complete
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <Sidebar pages={pages} />
        <div className="page-container">
          <NavBar
            client={client}
            currentCase={currentCase}
            flaggedPageName={"Docs"}
          />
          <div
            className="main-content"
            style={{
              paddingTop: "165px",
              minHeight: "max-content",
              paddingBottom: "30px",
              width: "calc(100% - 0px)",
            }}
          >
            <div className="documents-tabs-container">
              <ActionBarComponent
                src={
                  "https://simplefirm-bucket.s3.amazonaws.com/static/images/documents-icon-color_b6TvcB7.svg"
                }
                page_name="Documents"
              />
              <SearchTab
                setTabData={setTabData}
                activeTab={activeTab}
                setAllCount={setAllCount}
                setPageSlots={setPageSlots}
                setUnsortedCount={setUnsortedCount}
                setLoading={setLoading}
                setQuery={setQuery}
                activeTabName={activeTabName}
                pageViewState={[pageView, removeEmptyPanels]}
                isAngleLong={Boolean(
                  unsortedCount || allCount || pageSlots.length
                )}
              />
              <Tabs
                onSelect={handleSelect}
                data={pageSlots}
                allCount={allCount}
                unsortedCount={unsortedCount}
                activeTab={activeTab}
              />
            </div>

            <div
              className="table--no-card table-img z-index-0-custom-class"
              style={{
                paddingTop: Boolean(
                  unsortedCount || allCount || pageSlots.length
                )
                  ? "65px"
                  : "35px",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress key={loaderKey} color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      padding: "5px",
                      margin: "25px auto",
                      color: "var(--primary)",
                    }}
                    className="m-t-25"
                  >
                    <LinearProgress color="inherit" />
                  </div>
                </>
              ) : pageView === "updated" ? (
                <>
                  <NewDetailedTab
                    data={
                      activeTab === "all"
                        ? tabData?.data || []
                        : [
                            {
                              page_docs: tabData?.data,
                              panels: tabData?.panels,
                              page: tabData?.page,
                            },
                          ] || []
                    }
                    // data={tabData?.data || []}
                    loading={loading}
                    refetchData={fetchDataFully}
                    refetchLoading={refetchLoading}
                    pageView={pageView}
                  />
                  {activeTab === "all" && <NotesSectionDashboard />}
                </>
              ) : pageView === "detailed" ? (
                <>
                  <NewDocumentTab
                    data={
                      activeTab === "all"
                        ? tabData?.data || []
                        : [
                            {
                              page_docs: tabData?.data,
                              panels: tabData?.panels,
                              page: tabData?.page,
                            },
                          ] || []
                    }
                    // data={tabData?.data || []}
                    loading={loading}
                    refetchData={fetchDataFully}
                    refetchLoading={refetchLoading}
                    pageView={pageView}
                  />
                  {activeTab === "all" && <NotesSectionDashboard />}
                </>
              ) : activeTab === "all" ? (
                <AllDocs
                  data={tabData?.data || []}
                  loading={loading}
                  refetchData={fetchData}
                  refetchLoading={refetchLoading}
                  pageView={pageView}
                />
              ) : activeTab === "8" ? (
                <Treatment
                  data={tabData || []}
                  loading={loading}
                  refetchData={fetchData}
                  refetchLoading={refetchLoading}
                  pageView={pageView}
                />
              ) : (
                <TabData
                  activeTab={activeTab}
                  data={tabData || []}
                  loading={loading}
                  refetchData={fetchData}
                  refetchLoading={refetchLoading}
                  pageView={pageView}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DocPage;
