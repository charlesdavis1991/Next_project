import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { Controller, FormProvider, useForm } from "react-hook-form";
import api, { api_without_cancellation } from "../../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCaseId,
  getClientId,
  formatDateForModalFields,
  formatDateForSubmission,
} from "../../../Utils/helper";
import SelectStateModal from "../../TreatmentPage/modals/state-modal/SelectStateModal";
import ContactPanel from "../../common/ContactPanel";

function EditCaseExpertModal({
  expert,
  handleClose,
  onFetchExperts,
  show,
  activeTab: propActiveTab,
  onShowDeleteConfirmPopup,
  ExpertButtons,
  ExpertAgencyButtons,
  setSelectedExpert,
  setForDeleteExpertId,
}) {
  const [activeTab, setActiveTab] = useState(propActiveTab);

  useEffect(() => {
    setActiveTab(propActiveTab);
  }, [propActiveTab]);

  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const methods = useForm();
  const { reset, handleSubmit, register, watch, setValue, getValues, control, } = methods;

  const [searchResults, setSearchResults] = useState([]); // Expert's Directries
  const [filteredResults, setFilteredResults] = useState([]); //filteredExperties

  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [stateShow, setStateShow] = useState(false);
  const [expertState, setExpertState] = useState(expert?.expert_contact?.state);
  const [firmState, setFirmState] = useState(expert?.second_contact?.state);
  const [expertID, setExpertID] = useState(expert?.expert_directory);
  const token = localStorage.getItem("token");
  const handleStateShow = () => setStateShow(!stateShow);

  const handleStateChange = (state) => {
    if (activeTab === "agency-contact") {
      setValue("firm_state", state.StateAbr);
      setFirmState(state.StateAbr);
    } else if (activeTab === "expert-contact") {
      setValue("expert_state", state.StateAbr);
      setExpertState(state.StateAbr);
    }
  };

  const [expertCategories, setExpertCategories] = useState([]); // all categories
  const [shouldSubmit, setShouldSubmit] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [retainedByRecordId, setRetainedByRecordId] = useState(0);
  const [retainedByEntity, setRetainedByEntity] = useState(0);

  const [retainedByList, setRetainedByList] = useState({
    clients: [],
    defendants: [],
    otherParties: [],
  });

  const handleInputChange = async (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue !== "") {
      const fetchedResults = await fetchFilterExpertData(inputValue);

      const filtered = fetchedResults?.filter((result) => {
        const title = result.title ? result.title.toLowerCase() : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";
        const expert_firstname = result.expert_firstname
          ? result.expert_firstname.toLowerCase()
          : "";
        const expert_lastname = result.expert_lastname
          ? result.expert_lastname.toLowerCase()
          : "";
        const expert_category = result.category
          ? result.category.map((value) => value.toLowerCase())
          : [];

        return (
          expert_firstname.startsWith(inputValue) ||
          expert_lastname.startsWith(inputValue) ||
          expert_category.some((value) => value.startsWith(inputValue)) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          state.startsWith(inputValue) ||
          zip.startsWith(inputValue)
        );
      });

      setFilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setFilteredResults([]);
    }
  };

  const fetchExpertRetainedByList = async () => {
    try {
      const response = await api.get(
        `${origin}/api/experts_retained_by_list/${clientId}/${currentCaseId}/`
      );
      if (response.status === 200) {
        setRetainedByList({
          clients: response.data.client,
          defendants: response.data.defendants,
          otherParties: response.data.other_parties,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchExpertCategories = async () => {
  //   try {
  //     const response = await api.get(`${origin}/api/expert_categories/`);
  //     if (response.status === 200) {
  //       setExpertCategories(response.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchSatesData = async () => {
    try {
      const response = await api.get(`${origin}/api/states/`);
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFilterExpertData = async (query) => {
    try {
      const response = await api.get(
        `${origin}/api/search_filter_expert/?query=${query}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchSingleExpert = async () => {
    try {
      const response = await api.get(
        `${origin}/api/single_expert/${expertID}/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setExpertCategories(response.data?.expert_categoryID);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchSingleExpert();
  }, [expertID]);

  useEffect(() => {
    fetchSatesData();
    // fetchExpertCategories();
    fetchExpertRetainedByList();
  }, [origin]);

  const handleSelectRetainedByChange = (event) => {
    const selectedValue = event.target.value;
    const [Entity, id] = selectedValue.split(",");

    setRetainedByEntity(Entity);
    setRetainedByRecordId(id);

    // setValue("retained_by_entity" ,Entity )
    // setValue("retained_by_record_id" ,id )
  };

  const handleSelectedDirectoryForSecondContant = (expertDirectory) => {
    // Using setValue to update each field individually
    setValue("firm_address1", expertDirectory?.address1 || "");
    setValue("firm_address2", expertDirectory?.address2 || "");
    setValue("firm_city", expertDirectory?.city || "");
    setValue("firm_state", expertDirectory?.state || "");
    setValue("firm_zip", expertDirectory?.zip || "");
    setValue("firm_phone", formatNumber(expertDirectory?.phone_number) || "");
    setValue("firm_extension", expertDirectory?.extension || "");
    setValue("firm_fax", formatNumber(expertDirectory?.fax) || "");
    setValue("firm_email", expertDirectory?.email || "");

    // Optionally handle additional state or logic here if needed
  };

  const handleSelectedDirectoryForExpertContact = (expertDirectory) => {
    // Using setValue to update each field individually
    setValue("expert_title", expertDirectory?.title || "");
    setValue("expert_first_name", expertDirectory?.expert_firstname || "");
    setValue("expert_last_name", expertDirectory?.expert_lastname || "");
    setValue("expert_address1", expertDirectory?.address1 || "");
    setValue("expert_address2", expertDirectory?.address2 || "");
    setValue("expert_city", expertDirectory?.city || "");
    setValue("expert_state", expertDirectory?.state || "");
    setValue("expert_zip", expertDirectory?.zip || "");
    setValue("expert_phone", formatNumber(expertDirectory?.phone_number) || "");
    setValue("expert_extension", expertDirectory?.extension || "");
    setValue("expert_fax", formatNumber(expertDirectory?.fax) || "");
    setValue("expert_email", expertDirectory?.email || "");
    setValue("expert_website", expertDirectory?.website || "");

    setExpertID(expertDirectory.id);
    setValue("expert_categoryID", []);

    // Optionally handle additional state or logic here if needed
  };

  const formatNumber = (value) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleFirmPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("firm_phone", formattedValue, { shouldValidate: true });
  };

  const handleFirmFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("firm_fax", formattedValue, { shouldValidate: true });
  };
  const handleExpertPhoneInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("expert_phone", formattedValue, { shouldValidate: true });
  };

  const handleExpertFaxInputChange = (event) => {
    const formattedValue = formatNumber(event.target.value);
    setValue("expert_fax", formattedValue, { shouldValidate: true });
  };

  const firmPhoneValue = watch("firm_phone");
  const firmFaxValue = watch("firm_fax");

  const expertPhoneValue = watch("expert_phone");
  const expertFaxValue = watch("expert_fax");

  useEffect(() => {
    if (expert) {
      const { expert_contact, second_contact } = expert;

      // Using setValue to populate each field instead of reset
      setValue("expert_title", expert?.title || "");
      setValue("expert_first_name", expert_contact?.first_name || "");
      setValue("expert_last_name", expert_contact?.last_name || "");
      setValue("expert_address1", expert_contact?.address1 || "");
      setValue("expert_address2", expert_contact?.address2 || "");
      setValue("expert_city", expert_contact?.city || "");
      setValue("expert_state", expert_contact?.state || "");
      setValue("expert_zip", expert_contact?.zip || "");
      setValue(
        "expert_phone",
        formatNumber(expert_contact?.phone_number) || ""
      );
      setValue("expert_extension", expert_contact?.phone_ext || "");
      setValue("expert_fax", formatNumber(expert_contact?.fax) || "");
      setValue("expert_email", expert_contact?.email || "");
      setValue("expert_website", expert_contact?.website || "");
      setValue("expert_name", expert_contact?.name || "");

      setValue("firm_name", second_contact?.name || "");
      setValue("firm_first_name", second_contact?.first_name || "");
      setValue("firm_last_name", second_contact?.last_name || "");
      setValue("firm_address1", second_contact?.address1 || "");
      setValue("firm_address2", second_contact?.address2 || "");
      setValue("firm_city", second_contact?.city || "");
      setValue("firm_state", second_contact?.state || "");
      setValue("firm_zip", second_contact?.zip || "");
      setValue("firm_phone", formatNumber(second_contact?.phone_number) || "");
      setValue("firm_extension", second_contact?.phone_ext || "");
      setValue("firm_fax", formatNumber(second_contact?.fax) || "");
      setValue("firm_email", second_contact?.email || "");

      // Setting other fields
      setValue("field", expert?.field || "");
      setValue("retained", formatDateForModalFields(expert?.retained) || "");
      setValue("retainer", expert?.retainer || "");
      setValue("rate", expert?.rate || "");
      setValue("url", expert?.url || "");

      if (
        expert.expert_catagery_ids &&
        Array.isArray(expert.expert_catagery_ids)
      ) {
        // Convert string IDs to numbers if needed
        const categoryIds = expert.expert_catagery_ids.map((id) =>
          Number(id, 10)
        );
        setValue("expert_categoryID", categoryIds);
      } else if (expert.expert_categoryID) {
        // Handle single category ID case
        setValue("expert_categoryID", [Number(expert.expert_categoryID, 10)]);
      } else {
        setValue("expert_categoryID", []);
      }

      // Set the state for retained entity and record ID
      setRetainedByEntity(expert?.retained_by_entity);
      setRetainedByRecordId(expert?.retained_by_record_id);
    }
  }, [expert, setValue]);

  const postDataforUpdateCaseExpertContacts = async (data) => {
    try {
      const response = await api_without_cancellation.post(
        `${origin}/api/edit_expert/${expert.id}/`,
        data,
        {
          headers:{
            Authorization: token,
          }
        }
      );
      if (response.status === 200) {
        onFetchExperts();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {

    const cleanedData = {
      ...data,
      retained: data.retained ? formatDateForSubmission(data.retained) : null,
      retained_by_entity: retainedByEntity || " ",
      retained_by_record_id: retainedByRecordId || null,
      expert_categoryID:
        data?.expert_categoryID?.length > 0 ? data.expert_categoryID : null,
    };

    postDataforUpdateCaseExpertContacts(cleanedData);
  };

  const [selectedLabel1, setSelectedLabel1] = useState("Select Retainer");
  const [selectedIcon1, setSelectedIcon1] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const dropdownRef1 = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setIsOpen1(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDropdownToggle1 = () => {
    setIsOpen1((prev) => !prev);
  };

  const handleSelection1 = (e, value, label, iconClass) => {
    e.stopPropagation();
    const [Entity, id] = value.split(",");
    setRetainedByEntity(Entity);
    setRetainedByRecordId(id);
    setSelectedLabel1(label);
    setSelectedIcon1(iconClass);
    setIsOpen1(false);
  };

  const isCategorySelected = (categoryId) => {
    const categoryIDs = getValues("expert_categoryID") || [];
    return categoryIDs.includes(parseInt(categoryId, 10));
  };

  const handleCategoryChange = (categoryId, isChecked) => {
    const currentCategories = getValues("expert_categoryID") || [];
    const categoryIdNum = parseInt(categoryId, 10);

    if (isChecked) {
      if (!currentCategories.includes(categoryIdNum)) {
        setValue("expert_categoryID", [...currentCategories, categoryIdNum]);
      }
    } else {
      setValue(
        "expert_categoryID",
        currentCategories.filter((id) => id !== categoryIdNum)
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered expert-modal-850p"
        style={{
          opacity: stateShow ? "0.5" : "1",
        }}
      >
        <div>
          <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
              id="modal_title"
              style={{ fontSize: "14px", fontWeight: "600" }}
            >
              Edit Expert
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "5px" }}>
            <div className="custom-tab">
              <Tab.Container
                defaultActiveKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
              >
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    eventKey="expert-contact"
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-before"
                  >
                    Expert
                  </Nav.Link>
                  <Nav.Link eventKey="expertise">Field Of Expertise</Nav.Link>

                  <Nav.Link
                    eventKey="agency-contact"
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite"
                  >
                    Expert Agency
                  </Nav.Link>

                  <Nav.Link
                    eventKey="retained"
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-after"
                  >
                    Retained
                  </Nav.Link>
                </Nav>
                <Form
                  style={{ height: "271px" }}
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="custom-margin-top">
                    <Tab.Content>
                      <Tab.Pane eventKey="expert-contact">
                        <Row className="mx-0 ">
                          <Col md={12} className="p-l-0 p-r-0">
                            <input
                              type="text"
                              placeholder="Type Expert name or field to search directory then click an entry"
                              className="form-control custom-margin-bottom rounded-0 height-25"
                              name="reporting_agency_search_form"
                              onChange={handleInputChange}
                            />
                            {Array.isArray(filteredResults) &&
                              filteredResults.length > 0 && (
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${isFiltersOpen ? "block" : "hidden"}`}
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "#fff",
                                      border: "1px solid #ccc",
                                      width: "100%",
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults.map((result, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedDirectoryForExpertContact(
                                            result
                                          );
                                          setIsFiltersOpen(false);
                                        }}
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        {result?.expert_firstname}{" "}
                                        {result?.expert_lastname}{" "}
                                        {result?.address1} {result?.address2}{" "}
                                        {result?.city} {result?.state}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>
                        <Row className="mx-0">
                          <div style={{ width: "260px" }}>
                            <ContactPanel
                              id={expert?.id}
                              panel_name={"Expert"}
                              className="m-b-5"
                              name={`${watch("expert_first_name")} ${watch("expert_last_name")}`}
                              address1={watch("expert_address1")}
                              address2={watch("expert_address2")}
                              email={watch("expert_email")}
                              phone_number={watch("expert_phone")}
                              city={watch("expert_city")}
                              state={expertState}
                              zip_code={watch("expert_zip")}
                              fax_number={watch("expert_fax")}
                              ext={watch("expert_extension")}
                              buttonData={ExpertButtons}
                              onSelectObject={(e) => (
                                setSelectedExpert(object),
                                (activeTab = "expert-contact"),
                                setForDeleteExpertId(object.id)
                              )}
                              pageName="Experts"
                            />
                          </div>
                          <Col md={"auto"} className="p-0 d-flex-1">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Title"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_title")}
                                />
                              </div>
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_first_name")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_address1")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="City"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_city")}
                                />
                              </div>

                              <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                <div
                                  className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                  onClick={handleStateShow}
                                >
                                  <span id="selectedOption">
                                    {expertState ? (
                                      <div className="d-flex align-items-center">
                                        <svg
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                            fill: "var(--primary-80)",
                                            color: "var(--primary-80)",
                                            stroke: "var(--primary-80)",
                                          }}
                                          className={`icon icon-state-${expertState}`}
                                        >
                                          <use
                                            xlinkHref={`#icon-state-${expertState}`}
                                          ></use>
                                        </svg>
                                        {expertState}
                                      </div>
                                    ) : (
                                      "Select State"
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_phone")}
                                  value={expertPhoneValue || ""}
                                  onChange={handleExpertPhoneInputChange}
                                />
                              </div>

                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="number"
                                  placeholder="Extension"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_extension")}
                                />
                              </div>

                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_fax", {})}
                                  value={expertFaxValue || ""}
                                  onChange={handleExpertFaxInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Email"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_email")}
                                />
                              </div>
                            </div>
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Website"
                                  className="form-control rounded-0 height-25"
                                  {...register("expert_website", {
                                    onChange: (e) =>
                                      setValue("url", e.target.value),
                                  })}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="expertise">
                        <div
                          className="form-control"
                          style={{
                            height: "230px",
                            overflowY: "scroll",
                            border: "1px solid #ccc",
                            padding: "10px",
                          }}
                        >
                          {expertCategories.length > 0 ? (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "10px",
                              }}
                            >
                              {/* Individual District Checkboxes */}
                              {expertCategories?.map((category) => (
                                <Controller
                                  key={category.id}
                                  name="expert_categoryID"
                                  control={control}
                                  render={({ field }) => {
                                    const categoryId = Number(
                                      category.id,
                                      10
                                    );
                                    const isChecked =
                                      Array.isArray(field.value) &&
                                      field.value.includes(categoryId);

                                    return (
                                      <div className="form-check">
                                        <label className="form-check-label">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            style={{ accentColor: "grey" }}
                                            checked={isChecked}
                                            onChange={(e) => {
                                              const currentValues =
                                                Array.isArray(field.value)
                                                  ? field.value
                                                  : [];

                                              if (e.target.checked) {
                                                field.onChange([
                                                  ...currentValues,
                                                  categoryId,
                                                ]);
                                              } else {
                                                field.onChange(
                                                  currentValues.filter(
                                                    (id) => id !== categoryId
                                                  )
                                                );
                                              }
                                            }}
                                          />
                                          {category?.name}
                                        </label>
                                      </div>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <div>No Specialties available for this Expert</div>
                          )}
                        </div>
                        {/* <div>
                          <Form.Control
                            as="select"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("expert_categoryID")}
                            onChange={(e) =>
                              setValue("expert_categoryID", e.target.value)
                            }
                            value={
                              watch("expert_categoryID") ||
                              expert?.expert_categoryID ||
                              null
                            }
                          >
                            <option value="">-----------</option>
                            {expertCategories &&
                              expertCategories.map((obj) => (
                                <option key={obj.id} value={obj.id}>
                                  {obj.name}
                                </option>
                              ))}
                          </Form.Control>
                        </div> */}
                      </Tab.Pane>
                      <Tab.Pane eventKey="agency-contact">
                        <Row className="mx-0 ">
                          <Col md={12} className="p-r-0 p-l-0">
                            <input
                              type="text"
                              placeholder="Type Expert's name or Expertise to search directory then click an entry"
                              className="form-control custom-margin-bottom rounded-0 height-25"
                              name="reporting_agency_search_form"
                              onChange={handleInputChange}
                            />
                            {Array.isArray(filteredResults) &&
                              filteredResults.length > 0 && (
                                <div style={{ position: "relative" }}>
                                  <div
                                    className={`${isFiltersOpen ? "block" : "hidden"}`}
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "#fff",
                                      border: "1px solid #ccc",
                                      width: "100%",
                                      maxHeight: "150px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    {filteredResults.map((result, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleSelectedDirectoryForSecondContant(
                                            result
                                          );
                                          setIsFiltersOpen(false);
                                        }}
                                        style={{
                                          padding: "8px",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        {result?.expert_firstname}{" "}
                                        {result?.expert_lastname}{" "}
                                        {result?.address1} {result?.address2}{" "}
                                        {result?.city} {result?.state}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <div style={{ width: "260px" }}>
                            <ContactPanel
                              panel_name={"Expert Agency"}
                              className="m-b-5"
                              name={`${watch("firm_first_name")} ${watch("firm_last_name")}`}
                              catgegory={watch("firm_name")}
                              title={"Agency"}
                              address1={watch("firm_address1")}
                              address2={watch("firm_address2")}
                              email={watch("firm_email")}
                              phone_number={watch("firm_phone")}
                              city={watch("firm_city")}
                              state={firmState}
                              zip_code={watch("firm_zip")}
                              fax_number={watch("firm_fax")}
                              ext={watch("firm_extension")}
                              buttonData={ExpertAgencyButtons}
                              onSelectObject={(e) => (
                                setSelectedExpert(object),
                                (activeTab = "agency-contact"),
                                setForDeleteExpertId(object.id)
                              )}
                              pageName="Experts"
                            />
                          </div>
                          <Col md={"auto"} className="p-0 d-flex-1">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Agency Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_first_name")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Last Name"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_last_name")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Firm Address 1"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_address1")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Firm Address 2"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_address2")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="Firm City"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_city")}
                                />
                              </div>
                              <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                                <div
                                  className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                  onClick={handleStateShow}
                                >
                                  <span id="selectedOption">
                                    {firmState ? (
                                      <div className="d-flex align-items-center">
                                        <svg
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                            fill: "var(--primary-80)",
                                            color: "var(--primary-80)",
                                            stroke: "var(--primary-80)",
                                          }}
                                          className={`icon icon-state-${firmState}`}
                                        >
                                          <use
                                            xlinkHref={`#icon-state-${firmState}`}
                                          ></use>
                                        </svg>
                                        {firmState}
                                      </div>
                                    ) : (
                                      "Select State"
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Firm Zip"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_zip")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_phone")}
                                  value={firmPhoneValue || ""}
                                  onChange={handleFirmPhoneInputChange}
                                />
                              </div>
                              <div className="d-flex-1 p-r-5">
                                <input
                                  type="number"
                                  placeholder="Extension"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_extension")}
                                />
                              </div>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="(###) ###-####"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_fax", {})}
                                  value={firmFaxValue || ""}
                                  onChange={handleFirmFaxInputChange}
                                />
                              </div>
                            </div>
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1">
                                <input
                                  type="email"
                                  placeholder="Firm Email"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_email")}
                                />
                              </div>
                            </div>
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Website"
                                  className="form-control rounded-0 height-25"
                                  {...register("firm_website")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane
                        eventKey="retained"
                        className="overflow-x-hidden"
                      >
                        <Row className="mx-0">
                          <Col md={12} className="p-0">
                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey">
                                  Retained By:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-select"
                                  // {...register("retained_by_entity")}
                                  onChange={handleSelectRetainedByChange}
                                >

                                    <option
                                      value={" "}
                                      >
                                        -----------
                                      </option>
                                  {retainedByList &&
                                    retainedByList.clients.map((client) => (
                                      <option
                                        key={`Client, ${client.id}`}
                                        value={`Client, ${client.id}`}
                                        selected={
                                          retainedByEntity === "Client" &&
                                          retainedByRecordId === client.id
                                        }
                                      >
                                        {client.first_name} {client.last_name}{" "}
                                        (Client)
                                      </option>
                                    ))}
                                  {retainedByList &&
                                      retainedByList.defendants.map((defendant) => (
                                        <option
                                          key={`Defendant, ${defendant.id}`}
                                          value={`Defendant, ${defendant.id}`}
                                          selected={
                                            retainedByEntity === "Defendant" &&
                                            retainedByRecordId === defendant.id
                                          }
                                        >
                                          {defendant?.defendantType_name === "Private Individual"
                                            ? `${defendant.first_name} ${defendant.last_name}`
                                            : defendant.entity_name}{" "}
                                          (Defendant)
                                        </option>
                                      ))}
                                  {retainedByList &&
                                    retainedByList.otherParties.map(
                                      (otherParty) => (
                                        <option
                                          key={`OtherParty, ${otherParty.id}`}
                                          value={`OtherParty, ${otherParty.id}`}
                                          selected={
                                            retainedByEntity === "OtherParty" &&
                                            retainedByRecordId === otherParty.id
                                          }
                                        >
                                          {otherParty.party_first_name}{" "}
                                          {otherParty.party_last_name} (Other
                                          Party)
                                        </option>
                                      )
                                    )}
                                </select>
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 popup-input-label-2">
                                Retained By:
                              </span>
                              <div className="d-flex-1">
                                <div
                                  className="dropdown-container m-r-5 custom-select-state-entity "
                                  ref={dropdownRef1}
                                >
                                  <div
                                    className="form-select form-control d-flex align-items-center height-25 rounded-0"
                                    onClick={handleDropdownToggle1}
                                    style={{ padding: "0px" }}
                                  >
                                    {selectedIcon1 && (
                                      <i
                                        className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-10`}
                                      ></i>
                                    )}
                                    <span
                                      style={{
                                        padding: !selectedIcon1
                                          ? "5px 10px"
                                          : "",
                                      }}
                                    >
                                      {selectedLabel1}
                                    </span>
                                    {isOpen1 && (
                                      <ul
                                        className="dropdown-list"
                                        style={{
                                          marginTop: "25px",
                                          top: "0px",
                                        }}
                                      >
                                        {retainedByList?.clients?.map(
                                          (client, index) => (
                                            <li
                                              key={index}
                                              onClick={(e) =>
                                                handleSelection1(
                                                  e,
                                                  `Client, ${client?.id}`,
                                                  `${client?.first_name} ${client?.last_name}`,
                                                  "ic-client"
                                                )
                                              }
                                            >
                                              <i
                                                className={`ic ic-19 ic-client m-r-5`}
                                              ></i>
                                              {client?.first_name}{" "}
                                              {client?.last_name}{" "}
                                            </li>
                                          )
                                        )}
                                        {retainedByList?.defendants?.map(
                                          (defendant, index) => (
                                            <li
                                              key={index}
                                              onClick={(e) =>
                                                handleSelection1(
                                                  e,
                                                  `Defendant, ${defendant?.id}`,
                                                  `${defendant?.defendantType_name === "Private Individual" ? `${defendant?.first_name} ${defendant?.last_name}` : `${defendant?.entity_name}`}`,
                                                  "ic-defendants"
                                                )
                                              }
                                            >
                                              <i
                                                className={`ic ic-19 ic-defendants m-r-5`}
                                              ></i>
                                              {defendant?.defendantType_name ===
                                              "Private Individual"
                                                ? `${defendant?.first_name} ${defendant?.last_name}`
                                                : defendant?.entity_name}{" "}
                                            </li>
                                          )
                                        )}
                                        {retainedByList?.otherParties?.map(
                                          (client, index) => (
                                            <li
                                              key={index}
                                              onClick={(e) =>
                                                handleSelection1(
                                                  e,
                                                  `OtherParty, ${otherParty.id}`,
                                                  `${otherParty.party_first_name} ${otherParty.party_last_name}`,
                                                  "ic-parties"
                                                )
                                              }
                                            >
                                              <i
                                                className={`ic ic-19 ic-parties m-r-5`}
                                              ></i>
                                              {otherParty.party_first_name}{" "}
                                              {otherParty.party_last_name}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div className="col-md-2 text-left">
                                <span className="d-inline-block text-grey text-nowrap">
                                  Name:
                                </span>
                              </div>
                              <div className="col-md-10">
                                <input
                                  type="text"
                                  placeholder="Enter Full Name"
                                  className="form-control"
                                  {...register("expert_name")}
                                />
                              </div>
                            </div> */}

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 popup-input-label-2">
                                Field:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="text"
                                  placeholder="Field"
                                  className="form-control height-25 rounded-1"
                                  {...register("field")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 popup-input-label-2">
                                Retainer:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="number"
                                  className="form-control height-25 rounded-1"
                                  {...register("retainer")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 popup-input-label-2">
                                Rate:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="number"
                                  className="form-control height-25 rounded-1"
                                  {...register("rate")}
                                />
                              </div>
                            </div>

                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 popup-input-label-2">
                                Retained:
                              </span>
                              <div className="d-flex-1">
                                <input
                                  type="date"
                                  placeholder=""
                                  className="form-control height-25 rounded-1"
                                  {...register("retained")}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="danger"
                      onClick={onShowDeleteConfirmPopup}
                      className="height-25 m-l-5"
                      style={{ padding: "0px 12px" }}
                    >
                      Delete
                    </Button>
                    <Button
                      type="submit"
                      variant="success"
                      className="m-l-5 bg-success height-25"
                      style={{ padding: "0px 12px" }}
                    >
                      Save and Close
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
        <ToastContainer />
      </Modal>
      {stateShow && (
        <SelectStateModal
          show={stateShow}
          handleClose={handleStateShow}
          onChange={handleStateChange}
          statesData={statesAbrs}
        />
      )}
      {/* {showDeleteConfirm && (
        <ConformDeletePopup handleDeleteSubmission={handleDeleteSubmission} handleClose={hideDeleteConfirmPopup} />
      )} */}
    </FormProvider>
  );
}

export default EditCaseExpertModal;
