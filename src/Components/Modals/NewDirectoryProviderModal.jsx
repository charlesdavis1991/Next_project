import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import { dummyProvider } from "../../Utils/constants";
import {
  deleteProviderData,
  getProviderInfo,
  setBulkProviderData,
  setProviderData,
  updateProviderData,
} from "../../Redux/client-providers/clientProviderSlice";
import { Modal, Nav, Tab } from "react-bootstrap";
import ContactPanelWithoutButtons from "../common/ContactPanelWithoutButtons";
import ClientProvidersStyles from "../CaseDashboard/ClientProvidersStyles";

function NewDirectoryProviderModal({
  providerPopUp,
  handleClose,
  isEdit,
  providerData,
}) {
  const dispatch = useDispatch();
  const tokenBearer = localStorage.getItem("token");
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const origin = process.env.REACT_APP_BACKEND_URL;
  const { statesData } = useSelector((state) => state.states);
  const [form, setForm] = useState(
    isEdit && providerData ? providerData : dummyProvider
  );

  const [specialityColumn, setSpecialityColumn] = useState([]);
  const [activeTab, setActiveTab] = useState("locations");
  const [selectedLocationType, setSelectedLocationType] = useState(null);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
  const [locationInputs, setLocationInputs] = useState({
    name: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    fax: "",
    email: "",
  });
  const selectedState = useSelector((state) => state?.selectedState);
  const selectedSpeciality = useSelector((state) => state?.selectedSpeciality);
  const [isCopied, setIsCopied] = useState(false);
  const [stylishSpecialties, setStylishSpecialties] = useState([]);
  const [selectedAdminOfficeType, setSelectedAdminOfficeType] =
    useState("recordRequest");

  useEffect(() => {
    if (providerPopUp) {
      getSpecialityData();
      if (providerData) {
        const updatedProviderData = { ...providerData };
        const providerName = isEdit
          ? updatedProviderData.search_name_provider
          : updatedProviderData.name_provider;

        // Update name in all locations
        if (updatedProviderData.locations) {
          updatedProviderData.locations = updatedProviderData.locations.map((location) => ({
            ...location,
            fullAddress: {
              ...location.fullAddress,
              name: providerName,
            },
          }));
        }
        
        setForm(updatedProviderData);
      } else {
        setForm(dummyProvider);
      }

      handleSelectLocation("locations", 0);
      handleSelectAdminOffice("recordRequest");
    }
  }, [providerData, providerPopUp]);

  const sortedLocations = useMemo(() => {
    return form?.locations
      ?.map((location, index) => ({ location, originalIndex: index }))
      ?.sort((a, b) => {
        const cityA = a.location?.fullAddress?.city || '';
        const cityB = b.location?.fullAddress?.city || '';
        return cityA.toLowerCase().localeCompare(cityB.toLowerCase());
      });
  }, [form?.locations]);

  const handleCopyAddress = (fullAddress) => {
    setForm((prev) => {
      if (providerData && isEdit) {
        return {
          ...prev,
          recordRequest: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.recordRequest?.id || null,
          },
          billingRequest: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.billingRequest?.id || null,
          },
          payRecord: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.payRecord?.id || null,
          },
          payBilling: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.payBilling?.id || null,
          },
          lienHolder: {
            ...fullAddress,
            name: prev.search_name_provider,
            id: prev.lienHolder?.id || null,
          },
        };
      }

      return {
        ...prev,
        recordRequest: {
          ...prev.recordRequest,
          ...fullAddress,
          name: prev.name_provider,
        },
        billingRequest: {
          ...prev.billingRequest,
          ...fullAddress,
          name: prev.name_provider,
        },
        payRecord: {
          ...prev.payRecord,
          ...fullAddress,
          name: prev.name_provider,
        },
        payBilling: {
          ...prev.payBilling,
          ...fullAddress,
          name: prev.name_provider,
        },
        lienHolder: {
          ...prev.lienHolder,
          ...fullAddress,
          name: prev.name_provider,
        },
      };
    });

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getSpecialityData = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/case-provider-specialties/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setSpecialityColumn(response.data);
      specialtyTransformer(response.data);
    } catch (err) {
      console.error(err);
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

  const providerMatchesFilters = (
    provider,
    selectedState,
    selectedSpeciality
  ) => {
    if (!provider.locations || provider.locations.length === 0) {
      return false;
    }
    const stateFilter = selectedState?.selectedState;
    const specialtyFilterId = selectedSpeciality?.selectedSpeciality;

    const matchesState = stateFilter
      ? provider.locations.some(
          (location) => location.fullAddress?.state === stateFilter
        )
      : true;

    if (!specialtyFilterId) {
      return matchesState;
    }

    const selectedSpecialtyObj = specialityColumn.find(
      (s) => s.id.toString() === specialtyFilterId.toString()
    );

    if (!selectedSpecialtyObj) {
      console.warn(
        `Specialty with ID ${specialtyFilterId} not found in specialityColumn`
      );
      return matchesState;
    }

    const selectedSpecialtyName = selectedSpecialtyObj.name;

    const matchesSpecialty = provider.locations.some(
      (location) =>
        location.speciality_checkbox &&
        location.speciality_checkbox.includes(selectedSpecialtyName)
    );

    return matchesState && matchesSpecialty;
  };

  const handleAttorneySubmit = async (e) => {
    e.preventDefault();
    handleClose();
  
    try {
      if (isEdit) {
        const providerId = providerData.id;
        
        if (providerMatchesFilters(form, selectedState, selectedSpeciality)) {
          dispatch(
            updateProviderData({
              id: providerId,
              updatedData: form,
            })
          );
        } else {
          dispatch(deleteProviderData(providerId));
        }
  
        const response = await axios.patch(
          `${origin}/api/add/provider/${clientId}/${currentCaseId}/`,
          form,
          {
            headers: {
              Authorization: tokenBearer,
            },
            validateStatus: function (status) {
              return status === 200;
            }
          }
        );
        
        const serverProvider = response.data.data;
        
        if (serverProvider) {
          if (providerMatchesFilters(serverProvider, selectedState, selectedSpeciality)) {
            dispatch(
              updateProviderData({
                id: providerId,
                updatedData: serverProvider,
              })
            );
          } else {
            dispatch(deleteProviderData(providerId));
          }
        }
      } else {
        // New Provider Add
        const tempId = `temp-${Date.now()}`;
        const optimisticNewProvider = {
          ...form,
          id: tempId,
          treatment_location_count: form.locations ? form.locations.length : 0,
          open_cases_count: 0,
          closed_cases_count: 0,
          isSearchable: form?.isSearchable || false,
        };
  
        if (providerMatchesFilters(optimisticNewProvider, selectedState, selectedSpeciality)) {
          dispatch(setProviderData(optimisticNewProvider));
        }
  
        const response = await axios.post(
          `${origin}/api/add/provider/${clientId}/${currentCaseId}/`,
          form,
          {
            headers: {
              Authorization: tokenBearer,
            },
            validateStatus: function (status) {
              return status === 200;
            }
          }
        );
  
        const serverProvider = response.data?.data;
        
        if (serverProvider) {
          dispatch(deleteProviderData(tempId));
          
          if (providerMatchesFilters(serverProvider, selectedState, selectedSpeciality)) {
            dispatch(setProviderData(serverProvider));
          }
        }
      }
      
      setForm(dummyProvider);
      setLocationInputs({
        name: "",
        address: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        fax: "",
        email: "",
      })
    } catch (err) {
      console.error(err.message || "Something went wrong");
      const data = await getProviderInfo(
        clientId,
        currentCaseId,
        selectedState,
        selectedSpeciality
      );
      dispatch(setBulkProviderData(data));
    }
  };

  const handleDeleteClick = async () => {
    try {
      handleClose();
      dispatch(deleteProviderData(providerData.id));
      const response = await axios.delete(
        `${origin}/api/add/provider/${clientId}/${currentCaseId}/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
          data: {
            id: providerData.id,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting litigation events:", error.message);
      const data = await getProviderInfo(
        clientId,
        currentCaseId,
        selectedState,
        selectedSpeciality
      );
      dispatch(setBulkProviderData(data));
    }
  };

  const handleSelectAdminOffice = (officeType) => {
    setSelectedAdminOfficeType(officeType);
  };

  const handleSelectLocation = (locationType, index = -1) => {
    if (!form.locations || !form.locations[index]) {
      console.error("Location not found at index", index);
      return;
    }
    
    const location = form.locations[index].fullAddress;
    setSelectedLocationIndex(index);
    setSelectedLocationType(locationType);
    
    setLocationInputs({
      name: location?.name || "",
      address: location?.address || "",
      address2: location?.address2 || "",
      city: location?.city || "",
      state: location?.state || "",
      zip: location?.zip || "",
      phone: location?.phone || "",
      fax: location?.fax || "",
      email: location?.email || "",
    });
  };

  const handleAddLocation = () => {
    const providerName = isEdit
      ? form.search_name_provider
      : form.name_provider;

    if (!form.locations || form.locations.length === 0) {
      setForm((prev) => {
        return {
          ...prev,
          locations: [
            {
              speciality_checkbox: [],
              fullAddress: {
                name: providerName,
                address: "",
                address2: "",
                city: "",
                state: "",
                zip: "",
                phone: "",
                fax: "",
                email: "",
              },
            },
          ],
        };
      });

      setTimeout(() => {
        handleSelectLocation("locations", 0);
      }, 0);
      return;
    }

    setForm((prev) => {
      return {
        ...prev,
        locations: [
          ...prev.locations,
          {
            speciality_checkbox: [],
            fullAddress: {
              name: providerName,
              address: "",
              address2: "",
              city: "",
              state: "",
              zip: "",
              phone: "",
              fax: "",
              email: "",
            },
          },
        ],
      };
    });

    const newIndex = form.locations.length;
    setTimeout(() => {
      handleSelectLocation("locations", newIndex);
    }, 0);
  };

  const handleSpecialtyChange = (specialtyName, checked) => {
    setForm((prev) => {
      const updatedLocations = prev.locations.map((location, index) => {
        if (index === selectedLocationIndex) {
          const currentSpecialties = [...(location.speciality_checkbox || [])];

          if (checked) {
            if (!currentSpecialties.includes(specialtyName)) {
              currentSpecialties.push(specialtyName);
            }
          } else {
            const index = currentSpecialties.indexOf(specialtyName);
            if (index !== -1) {
              currentSpecialties.splice(index, 1);
            }
          }

          return {
            ...location,
            speciality_checkbox: currentSpecialties,
          };
        }
        return location;
      });

      return {
        ...prev,
        locations: updatedLocations,
      };
    });
  };

  const handleDeleteLocation = (index) => {
    if (form.locations.length <= 1) {
      console.log("Cannot delete the only location");
      return;
    }

    setForm((prev) => {
      const updatedLocations = [...prev.locations];
      updatedLocations.splice(index, 1);
      return {
        ...prev,
        locations: updatedLocations,
      };
    });

    // If the deleted location was selected, select another one
    if (selectedLocationIndex === index) {
      const nextIndex = index === 0 ? 0 : index - 1;

      setTimeout(() => {
        handleSelectLocation("locations", nextIndex);
      }, 0);
    } else if (selectedLocationIndex > index) {
      setSelectedLocationIndex(selectedLocationIndex - 1);
    }
  };

  const handleProviderNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => {
      const updatedForm = { ...prev };

      if (isEdit) {
        updatedForm.search_name_provider = name;
      } else {
        updatedForm.name_provider = name;
      }

      // Update name in all locations
      if (updatedForm.locations) {
        updatedForm.locations = updatedForm.locations.map((location) => ({
          ...location,
          fullAddress: {
            ...location.fullAddress,
            name: name,
          },
        }));
      }

      // // Update name in all admin locations
      // const adminLocations = [
      //   "recordRequest",
      //   "billingRequest",
      //   "payRecord",
      //   "payBilling",
      //   "lienHolder",
      // ];
      // adminLocations.forEach((loc) => {
      //   if (updatedForm[loc]) {
      //     updatedForm[loc] = {
      //       ...updatedForm[loc],
      //       name: name,
      //     };
      //   }
      // });

      return updatedForm;
    });
  };

  const handleCopyToAllAddresses = () => {
    const fullAddress = form.locations[selectedLocationIndex].fullAddress;
    handleCopyAddress(fullAddress);
  };

  // Function to handle admin location input changes
  const handleAdminOfficeInputChange = (e) => {
    const { name, value } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [selectedAdminOfficeType]: {
        ...prev[selectedAdminOfficeType],
        [name]: value,
      },
    }));
  };

  const handleTreatmentLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    setForm((prev) => {
      const providerName = isEdit
        ? prev.search_name_provider
        : prev.name_provider;
      const updatedLocations = [...prev.locations];

      updatedLocations[selectedLocationIndex] = {
        ...updatedLocations[selectedLocationIndex],
        fullAddress: {
          ...updatedLocations[selectedLocationIndex].fullAddress,
          [name]: value,
          name: providerName,
        },
      };

      return {
        ...prev,
        locations: updatedLocations,
      };
    });
  };

  return (
    <Modal
      show={providerPopUp}
      onHide={handleClose}
      dialogClassName="Law-firm-direct-max-width-1100px mr-20px"
      centered
    >
      <Modal.Header className="text-center p-0 justify-content-center bg-primary">
        <h3 className="modal-title mx-auto height-35 text-white font-weight-500">
          {isEdit ? "EDIT THE MEDICAL PROVIDER" : "ADD THE MEDICAL PROVIDER"}
        </h3>
      </Modal.Header>
      <Modal.Body>
        {stylishSpecialties.length > 0 && (
          <ClientProvidersStyles clientProviders={stylishSpecialties} />
        )}

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-3 justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="admin">Admin Offices</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="locations">Treatment Locations</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="admin" className="overflow-hidden">
              <div className="d-flex pb-2">
                <div className="text-grey text-right width-120 mr-2">Provider Name:</div>
                <div className="w-100">
                  {isEdit ? (
                    <input
                      value={form.search_name_provider || ""}
                      onChange={handleProviderNameChange}
                      required={true}
                      type="text"
                      name="search_filter_provider_input"
                      placeholder="Enter Name of Provider"
                      className="form-control height-25 p-1"
                    />
                  ) : (
                    <input
                      value={form.name_provider || ""}
                      onChange={handleProviderNameChange}
                      required={true}
                      type="text"
                      name="name_provider"
                      placeholder="Enter Name of Provider"
                      className="form-control height-25 p-1"
                    />
                  )}
                </div>
              </div>
              <div className="d-flex pb-2">
                <div className="text-grey text-right width-120 mr-2">Website:</div>
                <div className="w-100">
                  <input
                    required={true}
                    value={form.website || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    type="url"
                    name="website"
                    placeholder="Enter Website Url"
                    className="form-control height-25 p-1"
                  />
                </div>
              </div>
              <div className="d-flex pb-2">
                <div className="text-grey text-right width-120 mr-2">Searchable:</div>
                <div className="w-100 mr-4">
                  <input
                    type="checkbox"
                    checked={form.isSearchable || false}
                    name="searchable"
                    className="ml-1 cursor-pointer w-100"
                    style={{ accentColor: "grey" }}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isSearchable: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>
              {/* Admin Location Input Fields */}
              <div className="mt-3">
                <div className="text-center mb-2">
                  <h4 className="text-primary font-weight-semibold">
                    {selectedAdminOfficeType === "recordRequest"
                      ? "Records Request"
                      : selectedAdminOfficeType === "billingRequest"
                        ? "Billing Request"
                        : selectedAdminOfficeType === "payRecord"
                          ? "Pay Records Request"
                          : selectedAdminOfficeType === "payBilling"
                            ? "Pay Billing"
                            : "Lien Holder"}
                  </h4>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Name:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      name="name"
                      className="form-control height-25 py-0"
                      value={form[selectedAdminOfficeType]?.name || ""}
                      onChange={handleAdminOfficeInputChange}
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Address 1, 2:
                    </span>
                  </div>
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      name="address"
                      className="form-control height-25 py-0 mr-2"
                      value={form[selectedAdminOfficeType]?.address || ""}
                      onChange={handleAdminOfficeInputChange}
                    />
                    <input
                      type="text"
                      name="address2"
                      className="form-control height-25 py-0"
                      value={form[selectedAdminOfficeType]?.address2 || ""}
                      onChange={handleAdminOfficeInputChange}
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      City, State, Zip:
                    </span>
                  </div>
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      name="city"
                      className="form-control height-25 py-0 mr-2"
                      value={form[selectedAdminOfficeType]?.city || ""}
                      onChange={handleAdminOfficeInputChange}
                    />
                    <select
                      name="state"
                      className="form-select form-control height-25 py-0 mr-2"
                      value={form[selectedAdminOfficeType]?.state || ""}
                      onChange={handleAdminOfficeInputChange}
                    >
                      {statesData?.map((state) => (
                        <option value={state.StateAbr} key={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="zip"
                      className="form-control height-25 py-0"
                      value={form[selectedAdminOfficeType]?.zip || ""}
                      onChange={handleAdminOfficeInputChange}
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Phone:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      name="phone"
                      className="form-control height-25 py-0"
                      value={form[selectedAdminOfficeType]?.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        e.target.value = value;
                        handleAdminOfficeInputChange(e);
                      }}
                      maxLength="10"
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Fax:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      name="fax"
                      className="form-control height-25 py-0"
                      value={form[selectedAdminOfficeType]?.fax || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        e.target.value = value;
                        handleAdminOfficeInputChange(e);
                      }}
                      maxLength="10"
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Email:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      name="email"
                      className="form-control height-25 py-0"
                      value={form[selectedAdminOfficeType]?.email || ""}
                      onChange={handleAdminOfficeInputChange}
                    />
                  </div>
                </div>
              </div>
              {/* Admin Location Blocks */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="d-flex flex-wrap">
                    {[
                      "recordRequest",
                      "billingRequest",
                      "payRecord",
                      "payBilling",
                      "lienHolder",
                    ].map((locType) => (
                      <div
                        key={locType}
                        className="cursor-pointer mr-2 mb-2"
                        onClick={() => handleSelectAdminOffice(locType)}
                      >
                        <ContactPanelWithoutButtons
                          className="p-0"
                          panel_name={
                            locType === "recordRequest"
                              ? "Records Request"
                              : locType === "billingRequest"
                                ? "Billing Request"
                                : locType === "payRecord"
                                  ? "Pay Records Request"
                                  : locType === "payBilling"
                                    ? "Pay Billing"
                                    : "Lien Holder"
                          }
                          name={form[locType]?.name || ""}
                          address1={form[locType]?.address || ""}
                          address2={form[locType]?.address2 || ""}
                          city={form[locType]?.city || ""}
                          state={form[locType]?.state || ""}
                          zip_code={form[locType]?.zip || ""}
                          phone_number={form[locType]?.phone || ""}
                          fax_number={form[locType]?.fax || ""}
                          email={form[locType]?.email || ""}
                          isEmail
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="locations" className="overflow-hidden">
              <div className="mb-3">
              <div className="text-center w-100 mb-2"><h4 className="text-primary font-weight-semibold">{form?.locations[selectedLocationIndex]?.fullAddress?.city || "Treatment Location"}</h4></div>
                <div>
                  <h5 className="ml-1 text-primary font-weight-semibold">
                    SPECIALTIES
                  </h5>
                </div>
                <div className="row ml-1">
                  {specialityColumn?.map((specialty) => (
                    <div
                      className={`col-3 p-0 d-flex align-items-center w-100 h-100 has-speciality-color-${specialty?.id}`}
                      key={specialty.id}
                    >
                      <span className="bg-speciality-10 w-100 h-100">
                        <label className="mb-0 text-nowrap d-flex align-items-center">
                          <input
                            type="checkbox"
                            style={{
                              cursor: "pointer",
                              accentColor: specialty.color,
                            }}
                            value={specialty.name}
                            className="mr-1"
                            checked={
                              form.locations[
                                selectedLocationIndex
                              ]?.speciality_checkbox?.includes(
                                specialty.name
                              ) || false
                            }
                            onChange={(e) =>
                              handleSpecialtyChange(
                                specialty.name,
                                e.target.checked
                              )
                            }
                          />
                          {specialty.name}
                        </label>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input fields section */}
              <div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Name:
                    </span>
                  </div>
                  <div className="w-100">
                    <p className="text-nowrap" style={{color: "#495057", marginLeft: "12px"}}>
                      {locationInputs.name}{locationInputs?.city && ` ,${locationInputs.city} Location`}</p>
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Address 1, 2:
                    </span>
                  </div>
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      className="form-control height-25 py-0 mr-2"
                      name="address"
                      value={locationInputs.address}
                      onChange={handleTreatmentLocationChange}
                    />
                    <input
                      type="text"
                      className="form-control height-25 py-0"
                      name="address2"
                      value={locationInputs.address2}
                      onChange={handleTreatmentLocationChange}
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      City, State, Zip:
                    </span>
                  </div>
                  <div className="d-flex w-100">
                    <input
                      type="text"
                      className="form-control height-25 py-0 mr-2"
                      name="city"
                      value={locationInputs.city}
                      onChange={handleTreatmentLocationChange}
                    />
                    <select
                      name="state"
                      className="form-select form-control height-25 py-0 mr-2"
                      onChange={handleTreatmentLocationChange}
                      value={locationInputs.state}
                    >
                      {statesData?.map((state) => (
                        <option value={state.StateAbr} key={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-control height-25 py-0"
                      name="zip"
                      value={locationInputs.zip}
                      onChange={handleTreatmentLocationChange}
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Phone:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      className="form-control height-25 py-0"
                      name="phone"
                      value={locationInputs.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        e.target.value = value;
                        handleTreatmentLocationChange(e);
                      }}
                      maxLength="10"
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Fax:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      className="form-control height-25 py-0"
                      name="fax"
                      value={locationInputs.fax}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        e.target.value = value;
                        handleTreatmentLocationChange(e);
                      }}
                      maxLength="10"
                    />
                  </div>
                </div>
                <div className="d-flex form-group mb-1">
                  <div className="text-right width-120 mr-2">
                    <span className="d-inline-block text-grey text-nowrap">
                      Email:
                    </span>
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      className="form-control height-25 py-0"
                      name="email"
                      value={locationInputs.email}
                      onChange={handleTreatmentLocationChange}
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-flex align-items-center justify-content-center height-25 mr-2"
                    onClick={handleCopyToAllAddresses}
                  >
                    <span className="m-l-5 font-white">
                      {isCopied ? "Copied" : "Copy Location Address"}
                    </span>
                  </button>

                  {form.locations.length > 1 && (
                    <button
                      className="btn btn-sm btn-danger d-flex align-items-center justify-content-center height-25 mr-2"
                      onClick={() =>
                        handleDeleteLocation(selectedLocationIndex)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Add location button */}
              <div className="d-flex justify-content-end mt-3 mb-2 mr-2">
                <button
                  onClick={handleAddLocation}
                  type="button"
                  className="btn btn-primary btn-sm d-flex align-items-center height-25"
                >
                  <span className="text-white">+ Add Location</span>
                </button>
              </div>

              {/* Location blocks display */}
              <div className="d-flex flex-wrap" 
                style={{
                  maxHeight: "318px",
                  overflowX: "scroll",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  }
                }}
              >
                {sortedLocations?.map(({location, originalIndex}) => (
                    <div
                      key={`location-${originalIndex}`}
                      className="cursor-pointer mr-2 mb-2"
                      onClick={() => handleSelectLocation("locations", originalIndex)}
                    >
                      <ContactPanelWithoutButtons
                        className="p-0"
                        panel_name={
                          location?.fullAddress?.city || `Location ${originalIndex + 1}`
                        }
                        dynamic_label="Provider Name"
                        name={location?.fullAddress?.name}
                        address1={location?.fullAddress?.address}
                        address2={location?.fullAddress?.address2}
                        city={location?.fullAddress?.city}
                        state={location?.fullAddress?.state}
                        zip_code={location?.fullAddress?.zip}
                        phone_number={location?.fullAddress?.phone}
                        fax_number={location?.fullAddress?.fax}
                        email={location?.fullAddress?.email}
                        isEmail
                      />
                    </div>
                  ))}
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
        >
          Close
        </button>
        {isEdit && (activeTab==="admin") && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}
        <button
          type="submit"
          className="btn popup-heading-color save-btn-popup"
          onClick={handleAttorneySubmit}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default React.memo(NewDirectoryProviderModal);
