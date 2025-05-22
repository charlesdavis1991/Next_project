import React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTab,
  setSearchResult,
  searchGlobal,
  setHasData,
  setFirmUserPreferences,
} from "../../Redux/search/searchSlice";
import { setSearchTabResults, setSearchText } from "../../Redux/actions";
import api from "../../api/api";
import caseIcon from "../../../public/BP_resources/images/icon/case-icon-color.svg";
import clientIcon from "../../../public/BP_resources/images/icon/client-icon-color.svg";
import defendantIcon from "../../../public/BP_resources/images/icon/defendants-icon-color.svg";
import emailIcon from "../../../public/BP_resources/images/icon/email-logo-icon.svg";
import incidentIcon from "../../assets/images/incident.svg";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import insuranceIcon from "../../../public/BP_resources/images/icon/insurance-icon-color.svg";
import litigationIcon from "../../../public/BP_resources/images/icon/litigation-icon-color.svg";
import witnessIcon from "../../../public/BP_resources/images/icon/witnesses-icon-color.svg";
import costsIcon from "../../../public/BP_resources/images/icon/costs-icon-color.svg";
import checkIcon from "../../../public/BP_resources/images/icon/check-img.png";
import notesPageIcon from "../../../public/BP_resources/images/icon/notes-icon-color.svg";
import docsPageIcon from "../../../public/BP_resources/images/icon/documents-icon-color.svg";
import axios from "axios";
import "./navbar.css";

// import birthdayIcon from "../../../public/BP_resources/images/icon/b"

const Navbar = (props) => {
  const [isNarrowScreen, setIsNarrowScreen] = useState(
    window.innerWidth <= 1824
  );
  const dispatch = useDispatch();
  const currentTab = useSelector((state) => state.searchS.currentTab);
  const searchAlphabet = useSelector((state) => state.searchS.searchAlphabet);
  const searchText = useSelector((state) => state.searchS.searchText);
  const tabsResultCount = useSelector((state) => state.searchS.tabsResultCount);
  const searchResult = useSelector((state) => state.searchS.searchResult);
  const searchType = useSelector((state) => state.searchS.searchType);
  const [nonZeroTabs, setNonZeroTabs] = useState([]);
  const [resultsForTabs, setResultForTabs] = useState({});
  const [userPreferences, setUserPreferences] = useState([]);
  const removalRef = useRef(false);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const token = localStorage.getItem("token");
  // First make an array of strings of the non zero required tabs

  useEffect(() => {
    let i;
    const newTabs = [];
    for (const [key, value] of Object.entries(tabsResultCount)) {
      if (value > 0) {
        newTabs.push(key);
      }
    }
    setNonZeroTabs(newTabs);
  }, [tabsResultCount]);

  useEffect(() => {
    if (nonZeroTabs?.length < 1) {
      dispatch(setHasData(false));
    } else {
      dispatch(setHasData(true));
    }
  }, [nonZeroTabs]);

  // The method to bring the Result for the nonZerotab
  const fetchData = async (key, controller) => {
    const params = new URLSearchParams({ tab: key, searchText: searchText });
    try {
      const response = await axios.get(
        `${origin}/api/search/SearchTabsApi/?${params.toString()}`,
        {
          signal: controller.signal,
          headers: { Authorization: token },
        }
      );
      setResultForTabs((prevState) => ({
        ...prevState,
        [key]: response?.data?.data, // Append new value to the array
      }));

      // Setting user Prefrences
      if (response.data?.firm_user_prefernces) {
        setUserPreferences(response.data.firm_user_prefernces);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Storing the latest FirmUserPrefrences in the searchSlice
  useEffect(() => {
    dispatch(setFirmUserPreferences(userPreferences));
  }, [userPreferences]);

  // Update the Store to keep up with latest values in resultsForTabs i-e result from hitting the API for tabs
  useEffect(() => {
    console.log("Non Zero", nonZeroTabs);
    console.log("Results for Tabs", resultsForTabs);

    if (
      !searchAlphabet &&
      nonZeroTabs.length > 0 &&
      Object.keys(resultsForTabs).length > 0 &&
      nonZeroTabs.every((tab) => resultsForTabs.hasOwnProperty(tab))
    ) {
      dispatch(setSearchResult(resultsForTabs));
      if (Object.keys(resultsForTabs).length > 0) setResultForTabs({});
    }

    if (
      searchAlphabet &&
      nonZeroTabs.length > 0 &&
      Object.keys(resultsForTabs).length > 0
    ) {
      dispatch(setSearchResult(resultsForTabs));
      if (Object.keys(resultsForTabs).length > 0) setResultForTabs({});
    }
  }, [resultsForTabs]); // Dependency array

  // //  Now fetch all the results of that non zero tabs and update the store to keep value in advance
  useEffect(() => {
    let controllers = [];
    if (searchAlphabet) {
      const controller = new AbortController();
      controllers.push(controller);
      fetchData("client-lastname", controller);
    } else {
      nonZeroTabs.forEach((tab) => {
        const controller = new AbortController();
        controllers.push(controller);
        fetchData(tab, controller);
      });
    }
    return () => {
      controllers.forEach((controller) => controller.abort());
    };
  }, [nonZeroTabs, searchText]);

  const handleTabChange = (e) => {
    e.stopPropagation();
    dispatch(setCurrentTab(e.currentTarget.dataset.tab));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsNarrowScreen(window.innerWidth <= 1824);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const divStyle = {
    width: searchAlphabet ? "100%" : "",
    background: searchAlphabet ? "white" : "",
    flexWrap: "nowrap",
    overflowX: "visible",
  };
  const divStyle2 = {
    backgroundColor: "#FFFFFF",
    flexWrap: "nowrap",
    overflowX: "visible",
  };
  const btnskew = {
    transform: "skew(11.31deg, 0deg)",
  };

  return searchType == "alpha" ? (
    <nav className="single-col-nav  fs-14 search-navs">
      {searchAlphabet ? (
        <div
          className="nav nav-tabs invisible-scrollbar fixed-search-tabs ml-0 search-table-navbar"
          id="nav-tab"
          role="tablist"
          style={divStyle}
        >
          <button
            onClick={handleTabChange}
            className={
              "ml-3 pl-0 nav-link left-skew-fix-straight " +
              (currentTab == "client-lastname" ? "active" : "")
            }
            disabled={tabsResultCount["client-lastname"] <= 0}
            data-tab="client-lastname"
            id="client-lastname"
            data-toggle="tab"
            data-target="#nav-client"
            type="button"
            role="tab"
            aria-controls="nav-client"
            aria-selected="true"
            style={{
              verticalAlign: "middle",
              fontSize: "14px",
              maxWidth: "400px",
            }}
          >
            <p className={`p-t-1 d-flex align-items-center `}>
              {tabsResultCount["client-lastname"] > 0 ? (
                <span
                  className="tabs-icon mr-1"
                  style={{ display: "inline-block" }}
                >
                  <img src={clientIcon} className="tab-icon" />
                </span>
              ) : (
                ""
              )}
              Clients With Last Names Beginning With “{searchText}”
            </p>
            {tabsResultCount["client-lastname"] > 0 ? (
              <span
                style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
                class="badge badge-primary m-l-5"
              >
                {tabsResultCount["client-lastname"]}
              </span>
            ) : null}
          </button>
        </div>
      ) : (
        <>
          <div
            className="nav nav-tabs invisible-scrollbar fixed-search-tabs ml-0  search-table-navbar"
            id="nav-tab"
            role="tablist"
            style={{ background: "#FFFFFF" }}
          >
            <button
              onClick={handleTabChange}
              className={
                "nav-link p-l-5 result-color p-r-5 left-skew-fix-straight " +
                (currentTab == "client-name" ? "active" : "")
              }
              disabled={tabsResultCount["client-name"] <= 0}
              data-tab="client-name"
              id="client-name"
              data-toggle="tab"
              data-target="#nav-client"
              type="button"
              role="tab"
              aria-controls="nav-client"
              aria-selected="true"
              style={{ verticalAlign: "middle", fontSize: "14px" }}
            >
              <p
                className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["client-name"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["client-name"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={clientIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Client Name
              </p>
              {tabsResultCount["client-name"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="client-email"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["client-name"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "client-email" ? "active" : "")
              }
              disabled={tabsResultCount["client-email"] <= 0}
              data-tab="client-email"
              id="client-email"
              data-toggle="tab"
              data-target="#nav-client"
              type="button"
              role="tab"
              aria-controls="nav-client"
              aria-selected="true"
            >
              <p
                className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["client-email"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["client-email"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={emailIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Client Email
              </p>
              {tabsResultCount["client-email"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="client-email"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["client-email"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5  " +
                (currentTab == "defendant" ? "active" : "")
              }
              disabled={tabsResultCount["defendant"] <= 0}
              data-tab="defendant"
              id="defendant"
              data-toggle="tab"
              data-target="#nav-defendant_name"
              type="button"
              role="tab"
              aria-controls="nav-defendant_name"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["defendant"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["client-name"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={defendantIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Defendant
              </p>
              {tabsResultCount["defendant"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="defendant"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["defendant"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5  " +
                (currentTab == "witness" ? "active" : "")
              }
              disabled={tabsResultCount["witness"] <= 0}
              data-tab="witness"
              id="witness"
              data-toggle="tab"
              data-target="#nav-witness"
              type="button"
              role="tab"
              aria-controls="nav-witness"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["witness"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["witness"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={witnessIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Witness
              </p>
              {tabsResultCount["witness"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="witness"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["witness"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "claim" ? "active" : "")
              }
              disabled={tabsResultCount["claim"] <= 0}
              data-tab="claim"
              id="claim"
              data-toggle="tab"
              data-target="#nav-adjuster"
              type="button"
              role="tab"
              aria-controls="nav-adjuster"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["claim"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["witness"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={insuranceIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Claim
              </p>
              {tabsResultCount["claim"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="claim"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["claim"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "court-case" ? "active" : "")
              }
              disabled={tabsResultCount["court-case"] <= 0}
              data-tab="court-case"
              id="court-case"
              data-toggle="tab"
              data-target="#nav-court"
              type="button"
              role="tab"
              aria-controls="nav-court"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["court-case"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["court-case"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={litigationIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Court Case
              </p>
              {tabsResultCount["court-case"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="court-case"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["court-case"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "otherparty" ? "active" : "")
              }
              disabled={tabsResultCount["otherparty"] <= 0}
              data-tab="otherparty"
              id="otherparty"
              data-toggle="tab"
              data-target="#nav-otherparty_name"
              type="button"
              role="tab"
              aria-controls="nav-otherparty_name"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text ${tabsResultCount["otherparty"] < 1 ? "no-result-color" : ""}`}
              >
                Other Party
              </p>
              {tabsResultCount["otherparty"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="otherparty"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["otherparty"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "address" ? "active" : "")
              }
              disabled={tabsResultCount["address"] <= 0}
              data-tab="address"
              id="address"
              data-toggle="tab"
              data-target="#nav-provider"
              type="button"
              role="tab"
              aria-controls="nav-provider"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text ${tabsResultCount["address"] < 1 ? "no-result-color" : ""}`}
              >
                Address
              </p>
              {tabsResultCount["address"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="address"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["address"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "notes" ? "active" : "")
              }
              disabled={tabsResultCount["notes"] <= 0}
              data-tab="notes"
              id="notes"
              data-toggle="tab"
              data-target="#nav-notes"
              type="button"
              role="tab"
              aria-controls="nav-notes"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["notes"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["notes"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={notesPageIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Notes
              </p>
              {tabsResultCount["notes"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="notes"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["notes"]}
                </span>
              ) : null}
            </button>
            <button
              onClick={handleTabChange}
              style={{ verticalAlign: "middle", fontSize: "14px" }}
              className={
                "nav-link p-l-5 result-color p-r-5 " +
                (currentTab == "document" ? "active" : "")
              }
              disabled={tabsResultCount["document"] <= 0}
              data-tab="document"
              id="document"
              data-toggle="tab"
              data-target="#nav-document"
              type="button"
              role="tab"
              aria-controls="nav-document"
              aria-selected="false"
            >
              <p
                className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["document"] < 1 ? "no-result-color" : ""}`}
              >
                {tabsResultCount["document"] > 0 ? (
                  <span
                    className="tabs-icon mr-1"
                    style={{ display: "inline-block" }}
                  >
                    <img src={docsPageIcon} className="tab-icon" />
                  </span>
                ) : (
                  ""
                )}
                Document
              </p>
              {tabsResultCount["document"] > 0 ? (
                <span
                  style={{
                    padding: "5px 5px",
                    height: "10px",
                    fontSize: "14px",
                  }}
                  data-tab="document"
                  class="badge badge-primary m-l-5"
                >
                  {tabsResultCount["document"]}
                </span>
              ) : null}
            </button>
          </div>
        </>
      )}
    </nav>
  ) : searchType == "numeric" ? (
    <nav className="single-col-nav  fs-14 search-navs search-table-navbar">
      <div
        className="nav nav-tabs invisible-scrollbar fixed-search-tabs"
        id="nav-tab"
        role="tablist"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <button
          onClick={handleTabChange}
          className={
            "ml-3 nav-link p-l-5 p-r-5 result-color " +
            (currentTab == "client-phone" ? "active" : "")
          }
          disabled={tabsResultCount["client-phone"] <= 0}
          data-tab="client-phone"
          id="client-name"
          data-toggle="tab"
          data-target="#nav-client"
          type="button"
          role="tab"
          aria-controls="nav-client"
          aria-selected="true"
          style={{ verticalAlign: "middle", fontSize: "14px" }}
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["client-phone"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["client-phone"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={clientIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Client Phone
          </p>
          {tabsResultCount["client-phone"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="client-phone"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["client-phone"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "defendant-phone" ? "active" : "")
          }
          disabled={tabsResultCount["defendant-phone"] <= 0}
          data-tab="defendant-phone"
          id="defendant-phone"
          data-toggle="tab"
          data-target="#nav-client"
          type="button"
          role="tab"
          aria-controls="nav-client"
          aria-selected="true"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["defendant-phone"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["defendant-phone"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={defendantIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Defendant Phone
          </p>
          {tabsResultCount["defendant-phone"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="defendant-phone"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["defendant-phone"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "client-email" ? "active" : "")
          }
          disabled={tabsResultCount["client-email"] <= 0}
          data-tab="client-email"
          id="client-email"
          data-toggle="tab"
          data-target="#nav-client-email"
          type="button"
          role="tab"
          aria-controls="nav-client-email"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["client-email"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["client-email"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={emailIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Client Email
          </p>
          {tabsResultCount["client-email"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="client-email"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["client-email"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "client-birthday" ? "active" : "")
          }
          disabled={tabsResultCount["client-birthday"] <= 0}
          data-tab="client-birthday"
          id="client-birthday"
          data-toggle="tab"
          data-target="#nav-client-birthday"
          type="button"
          role="tab"
          aria-controls="nav-client-birthday"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["client-birthday"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["client-birthday"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={birthdayIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Birthday
          </p>
          {tabsResultCount["client-birthday"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="client-birthday"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["client-birthday"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "incident-date" ? "active" : "")
          }
          disabled={tabsResultCount["incident-date"] <= 0}
          data-tab="incident-date"
          id="incident-date"
          data-toggle="tab"
          data-target="#nav-incident-date"
          type="button"
          role="tab"
          aria-controls="nav-incident-date"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["incident-date"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["incident-date"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={incidentIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Incident Date
          </p>
          {tabsResultCount["incident-date"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="incident-date"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["incident-date"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "client-SSN" ? "active" : "")
          }
          disabled={tabsResultCount["client-SSN"] <= 0}
          data-tab="client-SSN"
          id="client-SSN"
          data-toggle="tab"
          data-target="#nav-client-SSN"
          type="button"
          role="tab"
          aria-controls="nav-client-SSN"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["client-SSN"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["client-SSN"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={clientIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Client SSN
          </p>
          {tabsResultCount["client-SSN"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="client-SSN"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["client-SSN"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "claim" ? "active" : "")
          }
          disabled={tabsResultCount["claim"] <= 0}
          data-tab="claim"
          id="claim"
          data-toggle="tab"
          data-target="#nav-adjuster"
          type="button"
          role="tab"
          aria-controls="nav-adjuster"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["claim"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["claim"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={insuranceIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Claim
          </p>
          {tabsResultCount["claim"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="claim"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["claim"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "court-case" ? "active" : "")
          }
          disabled={tabsResultCount["court-case"] <= 0}
          data-tab="court-case"
          id="court-case"
          data-toggle="tab"
          data-target="#nav-court"
          type="button"
          role="tab"
          aria-controls="nav-court"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["court-case"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["court-case"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={litigationIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Court Case
          </p>
          {tabsResultCount["court-case"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="court-case"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["court-case"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "invoice" ? "active" : "")
          }
          disabled={tabsResultCount["invoice"] <= 0}
          data-tab="invoice"
          id="invoice"
          data-toggle="tab"
          data-target="#nav-invoice"
          type="button"
          role="tab"
          aria-controls="nav-invoice"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["invoice"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["invoice"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={costsIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Invoice
          </p>
          {tabsResultCount["invoice"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="invoice"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["invoice"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "check" ? "active" : "")
          }
          disabled={tabsResultCount["check"] <= 0}
          data-tab="check"
          id="check"
          data-toggle="tab"
          data-target="#nav-check"
          type="button"
          role="tab"
          aria-controls="nav-check"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["check"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["check"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={checkIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Check
          </p>
          {tabsResultCount["check"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="check"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["check"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "notes" ? "active" : "")
          }
          disabled={tabsResultCount["notes"] <= 0}
          data-tab="notes"
          id="notes"
          data-toggle="tab"
          data-target="#nav-notes"
          type="button"
          role="tab"
          aria-controls="nav-notes"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["notes"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["notes"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={notesPageIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Notes
          </p>
          {tabsResultCount["notes"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="notes"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["notes"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "document" ? "active" : "")
          }
          disabled={tabsResultCount["document"] <= 0}
          data-tab="document"
          id="document"
          data-toggle="tab"
          data-target="#nav-document"
          type="button"
          role="tab"
          aria-controls="nav-document"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text  d-flex align-items-center ${tabsResultCount["document"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["document"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={docsPageIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Document
          </p>
          {tabsResultCount["document"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="document"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["document"]}
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  ) : searchType == "alphanumeric" ? (
    <nav className="single-col-nav  fs-14 search-navs">
      <div
        className="nav nav-tabs invisible-scrollbar fixed-search-tabs search-table-navbar"
        id="nav-tab"
        role="tablist"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "client-email" ? "active" : "")
          }
          disabled={tabsResultCount["client-email"] <= 0}
          data-tab="client-email"
          id="client-email"
          data-toggle="tab"
          data-target="#nav-client"
          type="button"
          role="tab"
          aria-controls="nav-client"
          aria-selected="true"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["client-email"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["client-email"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={emailIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Client Email
          </p>
          {tabsResultCount["client-email"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="client-email"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["client-email"]}
            </span>
          ) : null}
        </button>

        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "address" ? "active" : "")
          }
          disabled={tabsResultCount["address"] <= 0}
          data-tab="address"
          id="address"
          data-toggle="tab"
          data-target="#nav-provider"
          type="button"
          role="tab"
          aria-controls="nav-provider"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["address"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["address"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={docsPageIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Address
          </p>
          {tabsResultCount["address"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="address"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["address"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "incident" ? "active" : "")
          }
          disabled={tabsResultCount["incident"] <= 0}
          data-tab="incident"
          id="incident"
          data-toggle="tab"
          data-target="#nav-incident"
          type="button"
          role="tab"
          aria-controls="nav-incident"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["incident"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["incident"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={incidentIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Incident
          </p>
          {tabsResultCount["incident"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="incident"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["incident"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "claim" ? "active" : "")
          }
          disabled={tabsResultCount["claim"] <= 0}
          data-tab="claim"
          id="claim"
          data-toggle="tab"
          data-target="#nav-adjuster"
          type="button"
          role="tab"
          aria-controls="nav-adjuster"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["claim"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["claim"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={insuranceIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Claim
          </p>
          {tabsResultCount["claim"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="claim"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["claim"]}
            </span>
          ) : null}
        </button>

        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "invoice" ? "active" : "")
          }
          disabled={tabsResultCount["invoice"] <= 0}
          data-tab="invoice"
          id="invoice"
          data-toggle="tab"
          data-target="#nav-invoice"
          type="button"
          role="tab"
          aria-controls="nav-invoice"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["invoice"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["invoice"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={costsIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Invoice
          </p>
          {tabsResultCount["invoice"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="invoice"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["invoice"]}
            </span>
          ) : null}
        </button>

        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5 result-color  " +
            (currentTab == "notes" ? "active" : "")
          }
          disabled={tabsResultCount["notes"] <= 0}
          data-tab="notes"
          id="notes"
          data-toggle="tab"
          data-target="#nav-notes"
          type="button"
          role="tab"
          aria-controls="nav-notes"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["notes"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["notes"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={notesPageIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Notes
          </p>
          {tabsResultCount["notes"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="notes"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["notes"]}
            </span>
          ) : null}
        </button>
        <button
          onClick={handleTabChange}
          style={{ verticalAlign: "middle", fontSize: "14px" }}
          className={
            "nav-link p-l-5 p-r-5  result-color  " +
            (currentTab == "document" ? "active" : "")
          }
          disabled={tabsResultCount["document"] <= 0}
          data-tab="document"
          id="document"
          data-toggle="tab"
          data-target="#nav-document"
          type="button"
          role="tab"
          aria-controls="nav-document"
          aria-selected="false"
        >
          <p
            className={`whitespace-nowrap tab-text d-flex align-items-center ${tabsResultCount["document"] < 1 ? "no-result-color" : ""}`}
          >
            {tabsResultCount["document"] > 0 ? (
              <span
                className="tabs-icon mr-1"
                style={{ display: "inline-block" }}
              >
                <img src={docsPageIcon} className="tab-icon" />
              </span>
            ) : (
              ""
            )}
            Document
          </p>
          {tabsResultCount["document"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              data-tab="document"
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["document"]}
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  ) : searchType == "letters" ? (
    <nav className="single-col-nav  fs-14 search-navs p-l-28">
      <div
        className="nav nav-tabs invisible-scrollbar fixed-search-tabs"
        id="nav-tab"
        role="tablist"
      >
        <button
          onClick={handleTabChange}
          className={
            "ml-3 nav-link p-l-5 p-r-5  " +
            (currentTab == "client-lastname" ? "active" : "")
          }
          disabled={tabsResultCount["client-lastname"] <= 0}
          data-tab="client-lastname"
          id="client-lastname"
          data-toggle="tab"
          data-target="#nav-client"
          type="button"
          role="tab"
          aria-controls="nav-client"
          aria-selected="true"
          style={{ verticalAlign: "middle", fontSize: "14px" }}
        >
          <p style={style}>Client Lastname</p>
          {tabsResultCount["client-lastname"] > 0 ? (
            <span
              style={{ padding: "5px 5px", height: "10px", fontSize: "14px" }}
              class="badge badge-primary m-l-5"
            >
              {tabsResultCount["client-lastname"]}
            </span>
          ) : null}
        </button>
      </div>
    </nav>
  ) : (
    <div></div>
  );
};

export default Navbar;
