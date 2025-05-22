import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../../Utils/helper";
import "../../../../public/bp_assets/css/provider.css";
import {
  setBulkProviderData,
  setSpecialties,
} from "../../../Redux/client-providers/clientProviderSlice";
import axios from "axios";
import { Table } from "react-bootstrap";
import ProviderTableAddress from "../../common/ProviderTableAddress";
import { setIsSearchDisabled } from "../../../Redux/Directory/directorySlice";
import { setSelectedState } from "../../../Redux/selectedState/actions";
import NewDirectoryProviderModal from "../../Modals/NewDirectoryProviderModal";
import ClientProvidersStyles from "../../CaseDashboard/ClientProvidersStyles";
import ProviderCasesHistory from "../../Modals/DirectoryCasesHistoryModals/ProviderCasesHistory";

const ProviderTable = ({ admin = false }) => {
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const dispatch = useDispatch();
  const providerData = useSelector(
    (state) => state.clientProvider.providerData
  );
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [updateProvider, setUpdateProvider] = useState(null);
  const [additionalRows, setAdditionalRows] = useState(0);
  const tableRef = useRef();
  const lastRealRowRef = useRef(null);
  const [numColumns, setNumColumns] = useState(0);
  const [hasNoData, setHasNoData] = useState(false);
  const selectedState = useSelector((state) => state?.selectedState);
  const selectedSpeciality = useSelector((state) => state?.selectedSpeciality);
  const [stylishSpecialties, setStylishSpecialties] = useState([]);
  const [stylishSpecialty, setStylishSpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let url = `${origin}/api/add/provider/${clientId}/${currentCaseId}/`;

        if (selectedState && selectedState?.selectedState) {
          url += `?state=${selectedState.selectedState}`;
        } else {
          dispatch(setSelectedState("CA"));
          url += "?state=CA";
        }
        if (selectedSpeciality && selectedSpeciality?.selectedSpeciality) {
          url += `&speciality=${selectedSpeciality.selectedSpeciality}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: tokenBearer,
          },
        });

        dispatch(setBulkProviderData(response.data.data));
      } catch (err) {
        console.error(err);
      } finally {
        if (setLoading) {
          setLoading(false);
        }
      }
    })();
  }, [clientId, currentCaseId, tokenBearer, selectedState, selectedSpeciality]);

  useEffect(() => {
    getSpecialityData();
  }, []);

  useEffect(() => {
    if (
      specialties.length > 0 &&
      selectedSpeciality &&
      selectedSpeciality.selectedSpeciality
    ) {
      const specialty = specialties.find(
        (spec) =>
          spec.id &&
          spec.id.toString() ===
            selectedSpeciality.selectedSpeciality.toString()
      );
      setStylishSpecialty(specialty || {});
    }
  }, [selectedSpeciality, specialties]);

  const getSpecialityData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${origin}/api/case-provider-specialties/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setSpecialties(response.data);
      specialtyTransformer(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const specialtyTransformer = (specialties) => {
    const transformedData = specialties.map((specialty) => {
      return {
        specialty: {
          ...specialty,
        },
      };
    });
    setStylishSpecialties(transformedData);
  };

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current || !lastRealRowRef.current) return;

      const pageHeight = window.innerHeight;
      const tableTop =
        tableRef.current.getBoundingClientRect().top + window.scrollY;
      if (tableTop > 0) {
        const lastRowHeight =
          lastRealRowRef.current.getBoundingClientRect().height || 25;

        // Count total rows with data (now multiple per provider)
        const totalDataRows = providerData.reduce(
          (acc, provider) => acc + provider.locations.length,
          0
        );

        const existingRowsHeight = totalDataRows * lastRowHeight;

        const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10;
        const rows = Math.floor(remainingHeight / lastRowHeight);
        // Set the number of rows needed to fill the remaining space
        setAdditionalRows(rows > 0 ? rows : 0);
      }
    };
    const extractColumns = () => {
      if (tableRef.current && tableRef.current.rows.length > 0) {
        const columns = tableRef.current.rows[0].cells.length;
        setNumColumns(columns);
      }
    };

    // Initial calculations
    calculateRows();
    extractColumns();

    // Resize event listener
    const handleResize = () => {
      calculateRows();
      extractColumns();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [providerData]);

  // Fake rows when there is no data at all
  const calculateAdditionalRows = useCallback(() => {
    if (hasNoData) {
      // Perform the logic when there is no data
      dispatch(setIsSearchDisabled(true));
      const table = document.querySelector(".custom-table-directory");
      if (!table) return; // Check if the table exists

      const rowHeight = 31; // height of each row in px
      const viewportHeight = window.innerHeight;
      const tableBottom = table.getBoundingClientRect().bottom;
      const remainingHeight = viewportHeight - tableBottom;

      let additionalRows = Math.max(0, Math.floor(remainingHeight / rowHeight));

      const colSpan = table.querySelectorAll("thead tr th").length;
      const tbody = table.querySelector("tbody");

      // Clear existing fake rows
      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());
      // Append new fake rows
      for (let i = 0; i < additionalRows; i++) {
        const fakeRow = document.createElement("tr");
        fakeRow.className = "fake-row-2";
        fakeRow.style.height = `${rowHeight}px`;

        const td = document.createElement("td");
        td.colSpan = colSpan;
        td.innerHTML = "&nbsp;";
        fakeRow.appendChild(td);
        tbody.appendChild(fakeRow);
      }
    } else {
      const table = document.querySelector(".custom-table-directory");
      if (!table) return;
      const tbody = table.querySelector("tbody");

      // Clear existing fake rows
      const existingFakeRows = tbody.querySelectorAll(".fake-row-2");
      existingFakeRows.forEach((row) => row.remove());
    }
  }, [hasNoData, providerData]);

  useEffect(() => {
    // Initial call
    calculateAdditionalRows();
    // Add resize event listener
    const handleResize = () => {
      calculateAdditionalRows();
    };
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateAdditionalRows]);

  const renderAdditionalRows = () => {
    return Array.from({ length: additionalRows }).map((_, rowIndex) => (
      <tr
        key={rowIndex}
        className="emptytestRows"
        style={{
          height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
        }}
      >
        {Array.from({ length: numColumns }).map((_, colIndex) => (
          <td
            key={colIndex}
            style={{
              height: `${lastRealRowRef.current ? lastRealRowRef.current.getBoundingClientRect().height : 25}px`,
              color: "transparent",
            }}
          ></td>
        ))}
      </tr>
    ));
  };

  useEffect(() => {
    if (updateProvider) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [updateProvider]);

  const handleClosePopup = () => {
    setUpdateProvider(null);
  };

  const [showPopup2, setShowPopup2] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [providerName, setProviderName] = useState("");

  const handleClosePopup2 = () => {
    setShowPopup2(false);
    setProviderId(null);
  };

  const openProviderCasesPopup = (Id, name) => {
    setShowPopup2(true);
    setProviderId(Id);
    setProviderName(name);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-container">
          <span class="loader"></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Table
        className="text-start custom-table-directory font-weight-600"
        striped
        responsive
        bordered
        hover
        ref={tableRef}
      >
        <thead>
          <tr>
            <th style={{ width: "0%" }}></th>
            <th style={{ width: "0%" }}>TR</th>
            <th className="col-2">Provider</th>
            <th className="col-1"></th>
            <th className="col-2">Treatment Location</th>
            <th className="col-1"></th>
            <th className="col-2">Contact</th>
            <th style={{ width: "0%" }}>TF</th>
            <th style={{ width: "0%" }}>FAV</th>
            {admin && (
              <>
                <th style={{ width: "0%" }}>RR</th>
                <th style={{ width: "0%" }}>BR</th>
                <th style={{ width: "0%" }}>RP</th>
                <th style={{ width: "0%" }}>BP</th>
                <th style={{ width: "0%" }}>L</th>
                <th style={{ width: "0%" }}>S</th>
                <th className="col-2">Firm Name</th>
              </>
            )}
            <th className="col-2">Provider History</th>
          </tr>
        </thead>
        <tbody style={{ fontWeight: "600" }}>
          {stylishSpecialties && (
            <ClientProvidersStyles clientProviders={stylishSpecialties} />
          )}
          {providerData?.flatMap((provider, providerIndex) =>
            provider.locations
              .filter(
                (location) =>
                  location.speciality_checkbox &&
                  location.speciality_checkbox.includes(stylishSpecialty.name)
              )
              .map((location, locationIndex) => {
                const overallIndex =
                  providerData
                    .slice(0, providerIndex)
                    .reduce((total, p) => total + p.locations.length, 0) +
                  locationIndex +
                  1;

                return (
                  <tr
                    key={`${provider.id}-${location.id}`}
                    onClick={() =>
                      admin
                        ? setUpdateProvider(provider)
                        : openProviderCasesPopup(
                            provider.id,
                            provider?.search_name_provider
                          )
                    }
                    ref={
                      providerIndex === providerData.length - 1 &&
                      locationIndex === provider.locations.length - 1
                        ? lastRealRowRef
                        : null
                    }
                    style={{
                      height: "73px",
                    }}
                    className={`specialty-row-${selectedSpeciality.selectedSpeciality}`}
                  >
                    <td>{overallIndex + 1}</td>
                    <td></td>
                    <td>
                      <div
                        className={`has-speciality-color-${selectedSpeciality.selectedSpeciality}`}
                      >
                        <div
                          className="d-flex align-items-center bg-speciality-10"
                          style={{
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            className="m-r-5 d-flex align-items-center justify-content-center text-white"
                            style={{
                              width: "21px",
                              height: "21px",
                              backgroundColor: stylishSpecialty?.color || "",
                              fontSize: "14px",
                            }}
                          >
                            {stylishSpecialty?.name && stylishSpecialty.name[0]}
                          </span>
                          <span className="is-search">
                            {provider?.search_name_provider}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td></td>
                    <td className="is-search">
                      {location?.fullAddress && (
                        <ProviderTableAddress
                          fullAddress={location?.fullAddress}
                          website={provider.website || ""}
                        />
                      )}
                    </td>
                    <td></td>

                    <td>
                      {location?.fullAddress?.phone ? (
                        <>
                          ({location.fullAddress.phone?.slice(0, 3)}){" "}
                          {location.fullAddress.phone?.slice(3, 6)}-
                          {location.fullAddress.phone?.slice(6)}
                        </>
                      ) : (
                        <span className="text-primary-50">(###) ###-####</span>
                      )}
                      <br />
                      {location?.fullAddress?.fax ? (
                        <>
                          ({location.fullAddress.fax?.slice(0, 3)}){" "}
                          {location.fullAddress.fax?.slice(3, 6)}-
                          {location.fullAddress.fax?.slice(6)} <b>fax</b>
                        </>
                      ) : (
                        <span className="text-primary-50">(###) ###-####</span>
                      )}
                      <br />
                      {location?.fullAddress?.email ? (
                        location?.fullAddress?.email
                      ) : (
                        <p className="text-primary-50">abc@xyz.com</p>
                      )}
                    </td>
                    <td>{provider?.treatment_location_count}</td>
                    <td>{/* fav */}</td>
                    {admin && (
                      <>
                        <td>{provider?.RR}</td>
                        <td>{provider?.BR}</td>
                        <td>{provider?.RP}</td>
                        <td>{provider?.BP}</td>
                        <td>{provider?.L}</td>
                        <td>
                          {provider?.isSearchable ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="green"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--primary-50)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </td>
                        <td className="is-search">
                          {provider?.for_firm?.attorneyprofile?.office_name}
                        </td>
                      </>
                    )}
                    <td
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openProviderCasesPopup(
                          provider.id,
                          provider?.search_name_provider
                        );
                      }}
                    >
                      <div className="row cursor-pointer">
                        <div className="col-6 text-right pr-2">Open:</div>
                        <div className="col-6 text-left">
                          {provider?.open_cases_count || 0}
                        </div>
                      </div>
                      <div className="row cursor-pointer">
                        <div className="col-6 text-right pr-2">Closed:</div>
                        <div className="col-6 text-left">
                          {provider?.closed_cases_count || 0}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 text-right pr-2">Copilots:</div>
                        <div className="col-6 text-left">12</div>
                      </div>
                    </td>
                  </tr>
                );
              })
          )}
          {renderAdditionalRows()}
        </tbody>
      </Table>
      {/* 
      {showPopup &&
        <AddProviderDirectoryModal
          handleClose={handleClosePopup}
          providerPopUp={showPopup}
          providerData={updateProvider}
          isEdit={true}
        /> 
      }
      */}
      {showPopup && (
        <NewDirectoryProviderModal
          handleClose={handleClosePopup}
          providerPopUp={showPopup}
          providerData={updateProvider}
          isEdit={true}
        />
      )}
      {showPopup2 && providerId && (
        <ProviderCasesHistory
          handleClose={handleClosePopup2}
          providerCasesPopup={showPopup2}
          providerId={providerId}
          specialties={stylishSpecialties}
          specialty={stylishSpecialty}
          providerName={providerName}
        />
      )}
    </div>
  );
};

export default ProviderTable;
