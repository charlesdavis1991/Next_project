import React, { useEffect, useRef, useState } from "react";
import ActionBarComponent from "../Components/common/ActionBarComponent";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import Footer from "../Components/common/footer";
import SearchPhotosTab from "../Components/Photo/NewPhotoPage/components/search-photo-tab";
import { getCaseId, getClientId } from "../Utils/helper";
import api, { api_without_cancellation } from "../api/api";
import Tabs from "../Components/DocPage/Tabs";
import { LinearProgress } from "@mui/material";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import NewPhotoTab from "../Components/Photo/NewPhotoPage/new-photo-tab";
import NewPhotoDetailedTab from "../Components/Photo/NewPhotoPage/new-photo-detail-tab";
import NewPhotoShownOnPage from "../Components/Photo/NewPhotoPage/new-photo-shown-on-page";

function PhotoPage() {
  const origin = process.env.REACT_APP_BACKEND_URL;

  const currentCaseId = getCaseId();
  const [pageView, setPageView] = useState("photos");
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
  const abortControllerRef = useRef(null);
  const [loaderKey, setLoaderKey] = useState(0);

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
          (panel) => panel?.photos?.length > 0
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
          (panel) => panel?.photos?.length > 0
        );
        return { ...data, panels: filteredPanels };
      });
    }
  };

  useEffect(() => {
    removeEmptyPanels(pageView);
  }, [activeTab, loading]);

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
          `${origin}/api/photo/list-page-photo-optimized/`,
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

  const fetchtabsData = async () => {
    try {
      const response = await api.get(`${origin}/api/photos/count/`, {
        params: {
          case_id: currentCaseId ? currentCaseId : "",
        },
      });
      if (response.status === 200) {
        setPageSlots(response.data.data?.filter((tab) => tab?.doc_count != 0));
        setUnsortedCount(response.data.unsorted_count);
        setAllCount(response.data.all_count);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchtabsData();
  }, []);

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
        `${origin}/api/photo/list-page-photo-optimized/`,
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
        `${origin}/api/photo/list-page-photo-optimized/`,
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
        `${origin}/api/photos/count/`,
        {
          params: {
            case_id: currentCaseId || "",
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
        `${origin}/api/photo/list-page-photo-optimized/`,
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
        <Sidebar />
        <div className="page-container">
          <NavBar flaggedPageName={"Photos"} />
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
                src={"/BP_resources/images/icon/photo-icon-color.svg"}
                page_name="Photos"
              />
              <SearchPhotosTab
                setTabData={setTabData}
                activeTab={activeTab}
                setAllCount={setAllCount}
                setPageSlots={setPageSlots}
                setUnsortedCount={setUnsortedCount}
                setLoading={setLoading}
                setQuery={setQuery}
                activeTabName={activeTabName}
                pageViewState={[pageView, removeEmptyPanels]}
                // isAngleLong={Boolean(
                //   unsortedCount || allCount || pageSlots.length
                // )}
              />
              <Tabs
                page="photo"
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
              ) : pageView === "photos" ? (
                <>
                  <NewPhotoTab
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
                    tabData={
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
                    activeTab={activeTab}
                  />
                  {activeTab === "all" && <NotesSectionDashboard />}
                </>
              ) : pageView === "detailed" ? (
                <>
                  <NewPhotoDetailedTab
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
                    tabData={
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
                  />
                  {activeTab === "all" && <NotesSectionDashboard />}
                </>
              ) : (
                <>
                  <NewPhotoShownOnPage
                    data={
                      activeTab === "all"
                        ? tabData?.data || []
                        : [
                            {
                              page_docs: tabData?.data,
                              panels: tabData?.panels,
                              page: tabData?.page,
                              page_slots: tabData?.page_slots,
                            },
                          ] || []
                    }
                    // data={tabData?.data || []}
                    loading={loading}
                    refetchData={fetchDataFully}
                    refetchLoading={refetchLoading}
                    pageView={pageView}
                    tabData={
                      activeTab === "all"
                        ? tabData?.data || []
                        : [
                            {
                              page_docs: tabData?.data,
                              panels: tabData?.panels,
                              page: tabData?.page,
                              page_slots: tabData?.page_slots,
                            },
                          ] || []
                    }
                    activeTab={activeTab}
                  />
                  {activeTab === "all" && <NotesSectionDashboard />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PhotoPage;
