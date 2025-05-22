import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Modal, Nav, Row, Tab, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import api from "../../../api/api";
import { useSelector } from "react-redux";
import {
  getCaseId,
  getClientId,
  formatPhoneNumber,
} from "../../../Utils/helper";
import SelectStateModal from "../../TreatmentPage/modals/state-modal/SelectStateModal";

function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  return screenSize;
}

function NewCaseExpertModal({ show, handleClose, fetchExperts }) {
  const { width } = useScreenSize();
  const [selectedRow, setSelectedRow] = useState(null);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const { register, handleSubmit, reset, watch, setValue, clearErrors } =
    useForm();

  const [searchResults, setSearchResults] = useState([]); // Expert's Directries
  const [filteredResults, setfilteredResults] = useState([]); //filteredExperties
  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const [expertCategories, setExpertCategories] = useState([]); // all categories

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const selectedFirmState = useRef("");
  const selectedExpertState = useRef("");

  const [retainedByRecordId, setRetainedByRecordId] = useState(0);
  const [retainedByEntity, setRetainedByEntity] = useState(0);

  const [currentSearchQuery, setCurrentSearchQuery] = useState("");

  const [expertState, setExpertState] = useState("");
  const [stateShow, setStateShow] = useState(false);
  const handleStateShow = () => setStateShow(!stateShow);

  const [retainedByList, setRetainedByList] = useState({
    clients: [],
    defendants: [],
    otherParties: [],
  });

  const getModalSizeClass = () => {
    if (width >= 2500) {  // 4K screens
      return "modal-dialog-centered expert-modal-1400p";
    } else if (width >= 1440) {  // 2K screens
      return "modal-dialog-centered expert-modal-1200p";
    } else {  // 1080p and smaller
      return "modal-dialog-centered expert-modal-1000p";
    }
  };

  useEffect(() => {
    fetchSatesData();
    fetchExpertCategories();
    fetchExpertRetainedByList();
  }, []);

  const fetchExpertCategories = async () => {
    try {
      const response = await api.get(`${origin}/api/expert_categories/`);
      if (response.status === 200) {
        setExpertCategories(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const fetchFilterExpertData = async (query, categoryID = null) => {
    try {
      let url = `${origin}/api/search_filter_expert/?query=${query}`;
      if (categoryID) {
        url += `&expert_categoryID=${categoryID}`;
      }
      const response = await api.get(url);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const handleInputChange = async (e, category=null) => {
    setSelectedRow(null);
    clearNewExpertValues();
    handleSelectedDirectoryForExpertContant(null);
    handleSelectedDirectoryForSecondContant(null);

    const inputValue = e.target.value.toLowerCase();
    setCurrentSearchQuery(inputValue);

    let catID = null;
    if (category) {
      catID = category;
    } else {
      catID = selectedCategory
    }
    
    if (inputValue !== "") {
      const fetchedResults = await fetchFilterExpertData(
        inputValue,
        catID
      );

      const filtered = fetchedResults?.filter((result) => {
        const title = result.title?.toLowerCase() || "";
        const address1 = result.address1?.toLowerCase() || "";
        const address2 = result.address2?.toLowerCase() || "";
        const city = result.city?.toLowerCase() || "";
        const state = result.state?.toLowerCase() || "";
        const zip = result.zip?.toLowerCase() || "";
        const expert_firstname = result.expert_firstname?.toLowerCase() || "";
        const expert_lastname = result.expert_lastname?.toLowerCase() || "";
        const expert_phone_number =
          result.expert_phone_number?.toLowerCase() || "";
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

      setSearchResults(fetchedResults);
      setfilteredResults(filtered);
      setIsFiltersOpen(true);
    } else {
      setfilteredResults([]);
    }
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

  const handleSelectedDirectoryForSecondContant = (expertDirectory) => {
    if (expertDirectory != null) {
      setValue("expert_firmID", expertDirectory?.expert_firmID);
      setValue("firm_first_name", expertDirectory?.firm_first_name || "");
      setValue("firm_last_name", expertDirectory?.firm_last_name || "");
      setValue("firm_address1", expertDirectory?.firm_address1 || "");
      setValue("firm_address2", expertDirectory?.firm_address2 || "");
      setValue("firm_city", expertDirectory?.firm_city || "");
      setValue("firm_state", expertDirectory?.firm_state || "");
      setValue("firm_zip", expertDirectory?.firm_zip || "");
      setValue("firm_phone", formatNumber(expertDirectory?.firm_phone) || "");
      setValue("firm_extension", expertDirectory?.firm_extension || "");
      setValue("firm_fax", formatNumber(expertDirectory?.firm_fax) || "");
      setValue("firm_email", expertDirectory?.firm_email || "");

      // Optionally handle additional state or logic here if needed
    }
  };

  const handleSelectedDirectoryForExpertContant = (expertDirectory) => {
    if (expertDirectory != null) {
      setValue("expert_id", expertDirectory?.id);
      setValue("expert_contactID", expertDirectory?.expert_contactID);
      setValue("expert_title", expertDirectory?.title || "");
      setValue("expert_first_name", expertDirectory?.expert_firstname || "");
      setValue("expert_last_name", expertDirectory?.expert_lastname || "");
      setValue("expert_address1", expertDirectory?.address1 || "");
      setValue("expert_address2", expertDirectory?.address2 || "");
      setValue("expert_city", expertDirectory?.city || "");
      setValue("expert_state", expertDirectory?.state || "");
      setValue("expert_zip", expertDirectory?.zip || "");
      setValue("expert_phone", formatNumber(expertDirectory?.phone) || "");
      setValue("expert_extension", expertDirectory?.extension || "");
      setValue("expert_fax", formatNumber(expertDirectory?.fax) || "");
      setValue("expert_email", expertDirectory?.email || "");
    }
  };

  const selectedCategoryID = watch("expert_categoryID");
  const newExpertCategory = watch("new_expert_category");

  React.useEffect(() => {
    if (selectedCategoryID) {
      // Reset new expert category when a category is selected
      setValue("new_expert_category", "");
      clearErrors("new_expert_category");
    }
  }, [selectedCategoryID, setValue, clearErrors]);

  React.useEffect(() => {
    if (newExpertCategory) {
      // Reset selected category when new expert category is entered
      setValue("expert_categoryID", "");
      clearErrors("expert_categoryID");
    }
  }, [newExpertCategory, setValue, clearErrors]);

  const sendDataToCreateCaseExpert = async (data) => {
    // Add current time for date_ordered field
    data.date_ordered = new Date().toISOString();
    try {
      const response = await api.post(
        `${origin}/api/add_new_expert/${clientId}/${currentCaseId}/`,
        data
      );
      if (response.status === 201) {
        reset();
        handleClose();
        fetchExperts(true);
        fetchExpertCategories();
      }
    } catch (error) {
      console.error("Error at sendData", error);
    }
  };

  const onSubmit = (data) => {
    let retainedDate = null;
    if (data.retained) {
      const date = new Date(data.retained);
      if (!isNaN(date)) {
        retainedDate = date.toISOString();
      }
    }

    const cleanedData = {
      ...data,
      retained: retainedDate,
      // firm_state: selectedFirmState.current, // this field is tracked with useRef
      // expert_state: selectedExpertState.current, // this field is tracked with useRef
      retained_by_entity: retainedByEntity || " ",
      retained_by_record_id: retainedByRecordId || null,
      expert_categoryID: data?.expert_categoryID || null,
    };

    sendDataToCreateCaseExpert(cleanedData);
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

  const [retainedTabFilteredResults, setRetainedTabFilteredResults] = useState(
    []
  );
  const [retainedTabSelectedRow, setRetainedTabSelectedRow] = useState(null);

  const handleRetainedTabInputChange = async (e) => {
    setRetainedTabSelectedRow(null);
    clearDirectoryExpertValues();

    const inputValue = e.target.value.toLowerCase();

    if (inputValue !== "") {
      const fetchedResults = await fetchFilterExpertData(inputValue);

      const filtered = fetchedResults?.filter((result) => {
        const title = result.expert_title?.toLowerCase() || "";
        const address1 = result.address1?.toLowerCase() || "";
        const address2 = result.address2?.toLowerCase() || "";
        const city = result.city?.toLowerCase() || "";
        const state = result.state?.toLowerCase() || "";
        const zip = result.zip?.toLowerCase() || "";
        const expert_firstname = result.expert_firstname?.toLowerCase() || "";
        const expert_lastname = result.expert_lastname?.toLowerCase() || "";
        const expert_phone_number =
          result.expert_phone_number?.toLowerCase() || "";
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

      setRetainedTabFilteredResults(filtered);
    } else {
      setRetainedTabFilteredResults([]);
    }
  };

  const handleRetainedTabSelectedExpert = (expertDirectory) => {
    if (expertDirectory != null) {
      setValue("expert_id", expertDirectory?.id);
      setValue("expert_title", expertDirectory?.title || "");
      setValue("expert_first_name", expertDirectory?.expert_firstname || "");
      setValue("expert_last_name", expertDirectory?.expert_lastname || "");
      setValue("expert_address1", expertDirectory?.address1 || "");
      setValue("expert_address2", expertDirectory?.address2 || "");
      setValue("expert_city", expertDirectory?.city || "");
      setValue("expert_state", expertDirectory?.state || "");
      setValue("expert_zip", expertDirectory?.zip || "");
      setValue(
        "expert_phone",
        formatNumber(expertDirectory?.phone_number) || ""
      );
      setValue("expert_extension", expertDirectory?.extension || "");
      setValue("expert_fax", formatNumber(expertDirectory?.fax) || "");
      setValue("expert_email", expertDirectory?.email || "");
    }
  };

  const handleStateChange = (state) => {
    setValue("new_expert_state", state.StateAbr);
    setExpertState(state.StateAbr);
    clearDirectoryExpertValues();
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = async (e) => {
    const newCategoryValue = e.target.value;
    setSelectedCategory(newCategoryValue);

    if (currentSearchQuery && currentSearchQuery.trim() !== "") {
      const syntheticEvent = {
        target: { value: currentSearchQuery }
      };
      await handleInputChange(syntheticEvent, newCategoryValue);
    }
  };

  const clearDirectoryExpertValues = () => {
    // Clear all expert directory fields
    setValue("expert_id", "");
    setValue("expert_contactID", "");
    setValue("expert_title", "");
    setValue("expert_first_name", "");
    setValue("expert_last_name", "");
    setValue("expert_address1", "");
    setValue("expert_address2", "");
    setValue("expert_city", "");
    setValue("expert_state", "");
    setValue("expert_zip", "");
    setValue("expert_phone", "");
    setValue("expert_extension", "");
    setValue("expert_fax", "");
    setValue("expert_email", "");

    // Clear firm fields
    setValue("expert_firmID", "");
    setValue("firm_first_name", "");
    setValue("firm_last_name", "");
    setValue("firm_address1", "");
    setValue("firm_address2", "");
    setValue("firm_city", "");
    setValue("firm_state", "");
    setValue("firm_zip", "");
    setValue("firm_phone", "");
    setValue("firm_extension", "");
    setValue("firm_fax", "");
    setValue("firm_email", "");
  };

  const clearNewExpertValues = () => {
    // Clear all new expert fields
    setValue("new_expert_first_name", "");
    setValue("new_expert_last_name", "");
    setValue("new_expert_address1", "");
    setValue("new_expert_address2", "");
    setValue("new_expert_city", "");
    setValue("new_expert_state", "");
    setValue("new_expert_zip", "");
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName={getModalSizeClass()}
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
              Add Expert
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "5px" }}>
            <div className="custom-tab">
              <Tab.Container defaultActiveKey={"expert-contact"}>
                <Nav variant="tabs" className="justify-content-around">
                  <Nav.Link
                    eventKey="expert-contact"
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-before"
                  >
                    Expert
                  </Nav.Link>
                  <Nav.Link
                    eventKey="retained"
                    className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-after"
                  >
                    Add Expert not in Directory
                  </Nav.Link>
                </Nav>
                <Form
                  id="Experts_form "
                  className="d-flex flex-column justify-content-between"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Tab.Content className="custom-margin-top height-410">
                    <Tab.Pane eventKey="expert-contact">
                      <Row className="mx-0">
                        <Col md={12} className="p-l-0 p-r-0">
                          <input
                            type="text"
                            placeholder="Type Expert name or field to search directory then click an entry"
                            className="form-control custom-margin-bottom rounded-0 height-21"
                            onChange={handleInputChange}
                          />
                        </Col>
                      </Row>
                      <Row className="mx-0 custom-margin-bottom">
                        <div className="w-100">
                          <div className="row mx-0 align-items-center">
                            <Col
                              md={12}
                              className="d-flex p-l-0 p-r-0 custom-select-state-entity"
                            >
                              <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5">
                                Select Category:{" "}
                              </span>
                              <Form.Control
                                as="select"
                                className="form-control City-Width-OP height-21 p-0 p-l-5 rounded-0"
                                {...register("expert_categoryID", {
                                  onChange: (e) => {
                                    handleCategoryChange(e);
                                    setValue("new_expert_category", "");
                                  },
                                })}
                              >
                                <option value="">-----------</option>
                                {expertCategories &&
                                  expertCategories.map((obj) => (
                                    <option key={obj.id} value={obj.id}>
                                      {obj.name}
                                    </option>
                                  ))}
                              </Form.Control>
                            </Col>
                          </div>
                        </div>
                      </Row>
                      <div
                        className="invisible-scrollbar"
                        style={{
                          height: "350px",
                          overflowY: "auto",
                          width: "100%",
                        }}
                      >
                        <table
                          className="table table-borderless table-striped table-treatment font-weight-600"
                          id="treatment-summary-table"
                          style={{ width: "100%" }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: "0",
                            }}
                          >
                            <tr id="tb-header">
                              <th className="text-center color-grey-2" style={{maxWidth: "20%"}}>
                                Name
                              </th>
                              <th className="text-center color-grey-2" style={{maxWidth: "30%"}}>
                                Expert Address
                              </th>
                              <th className="text-center color-grey-2" style={{maxWidth: "30%"}}>
                                Expert Agency
                              </th>
                              <th
                                className=" text-center color-grey-2"
                                style={{maxWidth: "20%"}}
                              >
                                Contact
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              maxHeight: "325px",
                              overflowY: "auto",
                              width: "100%",
                            }}
                          >
                            {filteredResults &&
                              filteredResults?.map((result, index) => {
                                return (
                                  <tr
                                    className="expert-table-row"
                                    id=""
                                    data-table_id={36}
                                    style={{
                                      height: "75px",
                                      cursor: "pointer",
                                      backgroundColor:
                                        selectedRow === index &&
                                        "var(--primary-50)",
                                    }}
                                    onClick={() => {
                                      handleSelectedDirectoryForExpertContant(
                                        result
                                      );
                                      handleSelectedDirectoryForSecondContant(
                                        result
                                      );
                                      setSelectedRow(index);
                                    }}
                                  >
                                    <td className="text-left color-black" style={{maxWidth: "20%"}}>
                                      <div>
                                        {result?.expert_firstname ||
                                        result?.expert_lastname
                                          ? result?.expert_firstname +
                                            " " +
                                            result?.expert_lastname +
                                            " " +
                                            result?.title
                                          : result?.name + " " + result?.title}
                                      </div>
                                      <div className="text-wrap d-inline-block">
                                          {result?.category
                                            ?.slice(0, 3)
                                            .map((category, index, arr) => (
                                              <span key={index} className="d-inline-block text-wrap">
                                                {category}
                                                {index < arr.length - 1
                                                  ? ",\u00A0"
                                                  : ""}
                                              </span>
                                            ))}{" "}
                                          {result?.category?.length > 3 && (
                                            <span className="d-inline-block">…</span>
                                          )}
                                        </div>
                                    </td>
                                    <td
                                      className="color-black"
                                      style={{
                                        maxWidth: "30%",
                                        height: "25px",
                                      }}
                                    >
                                      <div className="text-wrap">
                                        {result?.address1} {result?.address2}
                                      </div>
                                      <div>
                                        {result?.city} {result?.state}{" "}
                                        {result?.zip}
                                      </div>
                                    </td>
                                    <td style={{maxWidth: "30%"}}>
                                      <div className="text-wrap">
                                        {result?.firm_address1}{" "}
                                        {result?.firm_address2}
                                      </div>
                                      <div>
                                        {result?.firm_city} {result?.firm_state}{" "}
                                        {result?.firm_zip}
                                      </div>
                                      <div>
                                        {formatPhoneNumber(result?.firm_phone)}
                                      </div>
                                    </td>
                                    <td className="color-black text-center" style={{maxWidth: "20%"}}>
                                      <div>
                                        {formatPhoneNumber(result?.phone)}
                                      </div>
                                      <div>{result?.fax}</div>
                                      <div>{result?.email}</div>
                                    </td>
                                  </tr>
                                );
                              })}
                            {Array.from({
                              length:
                                4 -
                                (filteredResults ? filteredResults?.length : 0),
                            }).map((_, index) => (
                              <tr
                                key={index}
                                className="fake-rows-new-provider"
                                style={{ height: "75px" }}
                              >
                                <td colSpan={12}></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="retained">
                      <div className="row mx-0 align-items-center custom-margin-bottom">
                        <div className="col-6 px-1">
                          <div
                            className="dropdown-container m-r-5 custom-select-state-entity "
                            ref={dropdownRef1}
                          >
                            <div
                              className="form-select form-control d-flex align-items-center height-21 rounded-0"
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
                                  padding: !selectedIcon1 ? "5px 10px" : "",
                                }}
                              >
                                {selectedLabel1}
                              </span>
                              {isOpen1 && (
                                <ul
                                  className="dropdown-list invisible-scrollbar"
                                  style={{
                                    marginTop: "25px",
                                    top: "0px",
                                    overflowY: "scroll",
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
                                        {client?.first_name} {client?.last_name}{" "}
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
                                    (otherParty, index) => (
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
                        <div className="col-6 px-1">
                          <input
                            type="date"
                            placeholder=""
                            className="form-control rounded-0 height-21"
                            {...register("retained")}
                          />
                        </div>
                      </div>
                      <div className="row mx-0 align-items-center custom-margin-bottom">
                        <div className="col-6 px-1">
                          <input
                            type="number"
                            placeholder="Retainer"
                            className="form-control rounded-0 height-21"
                            {...register("retainer")}
                          />
                        </div>
                        <div className="col-6 px-1">
                          <input
                            type="number"
                            placeholder="Rate"
                            className="form-control rounded-0 height-21"
                            {...register("rate")}
                          />
                        </div>
                      </div>

                      <div className="row mx-0 align-items-center custom-margin-bottom">
                        <div className="col-4 px-1">
                          <input
                            type="text"
                            placeholder="Enter First Name"
                            className="form-control rounded-0 height-21"
                            {...register("new_expert_first_name", {
                              onChange: (e) => {
                                handleRetainedTabInputChange(e);
                              },
                            })}
                          />
                        </div>
                        <div className="col-4 px-1">
                          <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="form-control rounded-0 height-21"
                            {...register("new_expert_last_name")}
                          />
                        </div>
                        <div className="col-4 px-1">
                          <input
                            type="text"
                            placeholder="Enter Field"
                            className="form-control rounded-0 height-21"
                            {...register("field")}
                          />
                        </div>
                      </div>

                      <div className="row mx-0 align-items-center custom-margin-bottom">
                        <div className="col-6 px-1">
                          <input
                            type="text"
                            placeholder="Address 1"
                            className="form-control rounded-0 height-21"
                            {...register("new_expert_address1", {
                              onChange: () => {
                                clearDirectoryExpertValues();
                              },
                            })}
                          />
                        </div>
                        <div className="col-6 px-1">
                          <input
                            type="text"
                            placeholder="Address 2"
                            className="form-control rounded-0 height-21"
                            {...register("new_expert_address2", {
                              onChange: () => {
                                clearDirectoryExpertValues();
                              },
                            })}
                          />
                        </div>
                      </div>

                      <div className="row mx-0 align-items-center custom-margin-bottom">
                        <div className="col-4 px-1">
                          <input
                            type="text"
                            placeholder="City"
                            className="form-control rounded-0 height-21"
                            {...register("new_expert_city", {
                              onChange: () => {
                                clearDirectoryExpertValues();
                              },
                            })}
                          />
                        </div>
                        <div className="d-flex-1 p-l-0 position-relative height-21 p-r-5 custom-select-new-provider">
                          <div
                            className="dropdown-button rounded-0 p-0 p-l-5 form-control height-21 d-flex align-items-center"
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
                        <div className="col-4 px-1">
                          <input
                            type="text"
                            placeholder="Zip"
                            className="form-control rounded-0 height-21"
                            {...register("new_expert_zip", {
                              onChange: () => {
                                clearDirectoryExpertValues();
                              },
                            })}
                          />
                        </div>
                      </div>
                      <div className="w-100 custom-margin-bottom px-1">
                        <input
                          {...register("new_expert_category", {
                            onChange: () => {
                              setValue("expert_categoryID", "");
                            },
                          })}
                          className="form-control rounded-0 height-21"
                          placeholder="Enter New Expert Category"
                        />
                      </div>

                      {/* Add expert directory search and table below */}
                      <div
                        className="invisible-scrollbar"
                        style={{
                          height: "250px",
                          overflowY: "auto",
                          width: "100%",
                        }}
                      >
                        <table
                          className="table table-borderless table-striped table-treatment font-weight-600"
                          id="treatment-summary-table"
                          style={{ width: "100%" }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: "0",
                            }}
                          >
                            <tr id="tb-header">
                              <th className="text-center color-grey-2">
                                Name
                              </th>
                              <th className="text-center color-grey-2">
                                Expert Address
                              </th>
                              <th className="text-center color-grey-2">
                                Expert Agency
                              </th>
                              <th
                                // style={{
                                //   width: "110px",
                                // }}
                                className=" text-center color-grey-2"
                              >
                                Contact
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              maxHeight: "215px",
                              overflowY: "auto",
                              width: "100%",
                            }}
                          >
                            {retainedTabFilteredResults &&
                              retainedTabFilteredResults?.map(
                                (result, index) => {
                                  return (
                                    <tr
                                      key={index}
                                      className="expert-table-row"
                                      id=""
                                      data-table_id={36}
                                      style={{
                                        height: "75px",
                                        cursor: "pointer",
                                        backgroundColor:
                                          retainedTabSelectedRow === index &&
                                          "var(--primary-50)",
                                      }}
                                      onClick={() => {
                                        handleRetainedTabSelectedExpert(result);
                                        setRetainedTabSelectedRow(index);
                                      }}
                                    >
                                      <td className="text-left color-black">
                                        <div>
                                          {result?.expert_firstname ||
                                          result?.expert_lastname
                                            ? result?.expert_firstname +
                                              " " +
                                              result?.expert_lastname +
                                              " " +
                                              result?.title
                                            : result?.name +
                                              " " +
                                              result?.title}
                                        </div>
                                        <div className="text-wrap d-inline-block">
                                          {result?.category
                                            ?.slice(0, 3)
                                            .map((category, index, arr) => (
                                              <span key={index} className="d-inline-block text-wrap">
                                                {category}
                                                {index < arr.length - 1
                                                  ? ",\u00A0"
                                                  : ""}
                                              </span>
                                            ))}{" "}
                                          {result?.category?.length > 3 && (
                                            <span className="d-inline-block">…</span>
                                          )}
                                        </div>
                                      </td>
                                      <td
                                        className="color-black"
                                        style={{
                                          height: "25px",
                                        }}
                                      >
                                        <div className="text-wrap">
                                          {result?.address1} {result?.address2}
                                        </div>
                                        <div>
                                          {result?.city} {result?.state}{" "}
                                          {result?.zip}
                                        </div>
                                      </td>
                                      <td>
                                        <div className="text-wrap">
                                          {result?.firm_address1}{" "}
                                          {result?.firm_address2}
                                        </div>
                                        <div>
                                          {result?.firm_city}{" "}
                                          {result?.firm_state}{" "}
                                          {result?.firm_zip}
                                        </div>
                                        <div>
                                          {formatPhoneNumber(
                                            result?.firm_phone
                                          )}
                                        </div>
                                      </td>
                                      <td className="color-black text-center">
                                        <div>
                                          {formatPhoneNumber(result?.phone)}
                                        </div>
                                        <div>{result?.fax}</div>
                                        <div>{result?.email}</div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            {Array.from({
                              length:
                                3 -
                                (retainedTabFilteredResults
                                  ? retainedTabFilteredResults?.length
                                  : 0),
                            }).map((_, index) => (
                              <tr
                                key={index}
                                className="fake-rows-new-provider"
                                style={{ height: "75px" }}
                              >
                                <td colSpan={4}></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                  <div className="d-flex justify-content-between custom-margin-top">
                    <Button
                      variant="secondary"
                      className="height-25"
                      style={{ padding: "0px 12px" }}
                      onClick={handleClose}
                    >
                      Close
                    </Button>

                    <Button
                      type="submit"
                      variant="success"
                      className="m-l-5 bg-success height-25"
                      style={{ padding: "0px 12px" }}
                      disabled={
                        selectedRow === null &&
                        (watch("new_expert_first_name") === "" ||
                          watch("new_expert_first_name") === null)
                      }
                    >
                      Save and Close
                    </Button>
                  </div>
                </Form>
              </Tab.Container>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      {stateShow && (
        <SelectStateModal
          show={stateShow}
          handleClose={handleStateShow}
          onChange={handleStateChange}
          statesData={statesAbrs}
        />
      )}
    </>
  );
}

export default NewCaseExpertModal;
