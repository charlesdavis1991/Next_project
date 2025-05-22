import React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import AutoCompleteSearch from "../../Insurance/AutoCompleteSearch";
import api from "../../../api/api";
import { getCaseId, getClientId, getToken,formatPhoneNumber } from "../../../Utils/helper";
import { createInsurance } from "../../../Redux/insurance/insuranceSlice";
import axios from "axios";
import { ClientDataContext } from "../../ClientDashboard/shared/DataContext";
import { compareAsc } from "date-fns";

const AddDefendantInsuranceModal = ({
  show,
  handleClose,
  setReducer,
  reducerValue,
  handleInsuranceSubmit,
  currentDefendantId,
  client,
  otherParties = [],
  defendants = [],
  insuranceTypes = [],
  litigation,
}) => {
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [selectedRow,setSelectedRow] = useState(null);
  const [selectedRow1,setSelectedRow1] = useState(null);
  const [openDropdown, setOpenDropDown] = useState(false);
  const [currentDefendantIdInsurance, setCurrentDefendantId] = useState("");

  const [searchedCompany, setSearchedCompany] = useState([]);
  const [searchedAdjuster, setSearchedAdjuster] = useState([]);
  const [currentDefendantName, setCurrentDefendantName] = useState("");
  const searchType = useRef("");
  const dropdownRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const dispatch = useDispatch();
  const { isPanelChecklistUpdated, setIsPanelChecklistUpdated } =
    useContext(ClientDataContext);
  const [states, setStates] = useState([]); //state abrs
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();

  const [selectedCompanyId, setSelectedComponyId] = useState("");

  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStates(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    // const defendant_ids = document.querySelector(".defendant-ids").value
    await dispatch(
      createInsurance({
        client_id: getClientId(),
        case_id: getCaseId(),
        data: { ...data, defendant_id: Number(currentDefendantIdInsurance) },
      })
    );
    setReducer(reducerValue);
    setIsPanelChecklistUpdated(!isPanelChecklistUpdated);
    handleClose();
    handleInsuranceSubmit();
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

  const selectedInsuranceTypeId = parseInt(watch("insuranceTypeId"));

  // Handling Searching
  const handleSearch = async (event, type) => {
    
    searchType.current = type;
    let companies = [];
    let adjusters = [];

    if (event.target.value.length >= 2) {
      if (type === "company") {
        setSelectedRow(null);
        const response = await axios.get(`${origin}/api/insurances/search/`);
        companies = response.data.data.filter(
          (insurance) =>
            // Check if the insurance type matches the selected insurance type
            parseInt(insurance.insurance_type) === selectedInsuranceTypeId &&
            (insurance?.company_name
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
              insurance?.adjuster_firstname
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()) ||
              insurance?.adjuster_lastname
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()) ||
              insurance?.address1
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()) ||
              insurance?.address2
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()) ||
              insurance?.city
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()) ||
              insurance?.state
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()) ||
              insurance?.zip
                ?.toLowerCase()
                .startsWith(event.target.value.toLowerCase()))
        );
        console.log(companies)
        setSearchedCompany(companies);
      } else if (type === "adjuster") {
        setSelectedRow1(null);
        const response = await axios.get(
          `${origin}/api/general/search_filter_adjuster_directoires/`,
          {
            params: {
              company_id: selectedCompanyId ? selectedCompanyId : "",
            },
          }
        );
        console.log(response);
        adjusters = response.data.data.filter(
          (insurance) =>
            insurance?.company_name
              .toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_firstname
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.adjuster_lastname
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.address1
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.address2
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.city
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.state
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase()) ||
            insurance?.zip
              ?.toLowerCase()
              .startsWith(event.target.value.toLowerCase())
        );
        setSearchedAdjuster(adjusters);
      }
    }

    
    
  };

  function handleChange(event, inputType) {
    if (inputType == "phoneNumber") {
      let formattedValue = formatNumber(event.target.value);
      setValue("phoneNumber", formattedValue);
    }
    if (inputType == "fax") {
      let formattedValue = formatNumber(event.target.value);
      setValue("fax", formattedValue);
    }
  }
  const handleSelectedInsurance = (id,panelName) => {
    if ( panelName == "company") {
      let selectedCompany = searchedCompany.filter(
        (insurance) => insurance.id == id
      );
      selectedCompany = { ...selectedCompany[0] };
      console.log(selectedCompany)
      setValue("phoneNumber", formatNumber(selectedCompany?.phone));
      setValue("fax", formatNumber(selectedCompany?.fax));
      setValue("email", selectedCompany?.email);
      setValue("companyName", selectedCompany?.company_name);
      setValue("website", selectedCompany?.website);
      setValue("address1", selectedCompany?.address1);
      setValue("address2", selectedCompany?.address2);
      setValue("zip", selectedCompany?.zip);
      setValue("city", selectedCompany?.city);
      setValue("state", selectedCompany?.state);
      setValue("extension", selectedCompany?.extension);
      setSelectedComponyId(selectedCompany?.company_id);
      // setSearchedCompany([]);
    }

    if (panelName == "adjuster") {
      let selectedAdjuster = searchedAdjuster.filter(
        (insurance) => insurance.id == id
      );
      selectedAdjuster = { ...selectedAdjuster[0] };
      setValue("adjuster_fname", selectedAdjuster?.adjuster_firstname);
      setValue("adjuster_lname", selectedAdjuster?.adjuster_lastname);

      // setSearchedAdjuster([]);
    }
  };

  useEffect(() => {
    fetchSatesData();

    const currentDefendant = defendants.find(
      (defendant) => defendant.id === currentDefendantId
    );

    if (currentDefendant) {
      if (currentDefendant.defendantType_name === "Private Individual") {
        const name = `${currentDefendant.first_name} ${currentDefendant.last_name}`;
        setCurrentDefendantName(name);
      } else {
        setCurrentDefendantName(currentDefendant.entity_name);
      }
    }
  }, []);

  // function select_multiple_defendant(this_el) {
  //   var id = this_el.getAttribute('data-id');
  //   var name = this_el.textContent.trim();

  //   var defendantNamesInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-names");
  //   var defendantIdsInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-ids");
  //   var names = defendantNamesInput.value.trim();
  //   var ids = defendantIdsInput.value.trim();

  //   if (names && ids) {

  //     names = names.split(", ");
  //     ids = ids.split(",");
  //   } else {

  //     names = [];
  //     ids = [];
  //   }

  //   var index = names.indexOf(name);
  //   if (index === -1) {
  //     names.push(name);
  //     ids.push(id);
  //     defendantNamesInput.value = names.join(", ");
  //     defendantIdsInput.value = ids.join(",");
  //     this_el.classList.add("selected");
  //     // document.getElementById("defendant-names-container").insertAdjacentHTML('beforeend', '<span class="defendant-tag" data-id="'+id+'">'+name+'<span class="remove-defendant">x</span></span>');
  //   } else {
  //     names.splice(index, 1);
  //     ids.splice(index, 1);
  //     defendantNamesInput.value = names.join(", ");
  //     defendantIdsInput.value = ids.join(",");
  //     this_el.classList.remove("selected");
  //     var tagToRemove = document.querySelector("#defendant-names-container [data-id='" + id + "']");
  //     if (tagToRemove) {
  //       tagToRemove.remove();
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (dropdownRef.current) {
  //     const listItems = dropdownRef.current.querySelectorAll('li');
  //     for (let i = 0; i < listItems.length; i++) {
  //        const this_el = listItems[i]
  //         const id = this_el.getAttribute('data-id'); // Perform your logic here
  //         if(id == currentDefendantId)
  //         {
  //           var name = this_el.textContent.trim();

  //           var defendantNamesInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-names");

  //           var defendantIdsInput = this_el.closest('.dropdown-content-defendant').parentElement.querySelector(".defendant-ids");

  //           var names = defendantNamesInput.value.trim();

  //           var ids = defendantIdsInput.value.trim();

  //           if (names && ids) {

  //             names = names.split(", ");

  //             ids = ids.split(",");

  //           } else {

  //             names = [];
  //             ids = [];
  //           }

  //           var index = names.indexOf(name);
  //           if (index === -1) {
  //             names.push(name);
  //             ids.push(id);
  //             defendantNamesInput.value = names.join(", ");
  //             defendantIdsInput.value = ids.join(",");
  //             this_el.classList.add("selected");
  //             // document.getElementById("defendant-names-container").insertAdjacentHTML('beforeend', '<span class="defendant-tag" data-id="'+id+'">'+name+'<span class="remove-defendant">x</span></span>');
  //           }
  //         }

  //     };
  //   }
  // }, []);

  const handleDefendantChange = (id) => {
    setCurrentDefendantId(id); // Update the selected defendant's ID in state
    console.log(id);
    console.log(defendants);
    const selectedDefendant = defendants.find((def) => def.id === Number(id));
    console.log(selectedDefendant);
    if (selectedDefendant?.defendantType_name === "Private Individual") {
      const name = `${selectedDefendant.first_name} ${selectedDefendant.last_name}`;
      setCurrentDefendantName(name);
    } else {
      setCurrentDefendantName(selectedDefendant.entity_name);
    }
  };

      const [selectedLabel1, setSelectedLabel1] = useState("Select By Both Name and Type");
      const [selectedIcon1, setSelectedIcon1] = useState(null);
      const [isOpen1, setIsOpen1] = useState(false);
      const dropdownRef1 = useRef(null);
      // Close dropdown when clicking outside
      useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
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
  
      const handleSelection1 = (e,value, label, iconClass) => {
          e.stopPropagation();
          handleDefendantChange(value);
          setValue("defendant_id", value);
          setSelectedLabel1(label);
          setSelectedIcon1(iconClass);
          setIsOpen1(false);
      };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="modal-dialog-centered INS-max-width-1000px justify-content-center custom-add-insurance-dialog"
    >
      <div>
          <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add Insurance to Defendant</div></div>

        <Modal.Body className="panel-popups-body" style={{padding:"5px"}}>
          <Form id="addinsurance_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-margin-bottom d-flex justify-content-center">
              <div className="p-r-5 d-flex align-items-center" >
                <p className="text-secondary text-darker white-space-nowrap">
                Select Defendant:
                </p>
              </div>
              <div className="custom-select-new-entity d-flex-1">
                {/* <div className="dropdown-defendant form-control">
                  <input
                    type="text"
                    className="defendant-names"
                    placeholder="select a defendant"
                    onClick={()=> setOpenDropDown(!openDropdown)}
                    readOnly
                    style={{border: "none"}}
                  />
                  <input
                    type="hidden"
                    ref={hiddenInputRef}
                    className="defendant-ids"
                  />
                  <span className="dropdown-arrow"  onClick={()=> setOpenDropDown(!openDropdown)}></span>
                  <div ref={dropdownRef} className={`dropdown-content-defendant ${openDropdown ? 'd-block': ''}`}>
                    <ul className="defendant-list ">
                      {defendants && defendants.map((defendant, index) => (
                        <li key={index} data-id={defendant.id}
                         onClick={() => select_multiple_defendant(event.target)}>
                          {defendant?.first_name} {defendant?.last_name}
                          </li>
                      ))}
                    </ul>
                  </div>
                </div> */}
                {/* <Form.Control type='text' value={currentDefendantName} disabled/> */}
                {/* <Form.Control
                className="height-25 p-0 p-l-5 rounded-0"
                  as="select"
                  value={currentDefendantIdInsurance} // Bind the current selection by ID
                  {...register("defendant_id", { required: true })}
                  onChange={(e) => handleDefendantChange(e.target.value)} // Handle dropdown changes
                >
                  <option value="" disabled>
                    Select by both name and type
                  </option>
                  {defendants.map((defendant) => (
                    <option key={defendant.id} value={defendant.id}>
                      {defendant.defendantType_name === "Private Individual"
                        ? defendant?.first_name + " " + defendant?.last_name
                        : defendant?.entity_name}{" "}
                      - {defendant.defendantType_name}
                    </option>
                  ))}
                </Form.Control> */}
                <div className="dropdown-container " ref={dropdownRef1}>
                  <div className="height-25 p-0 rounded-0 form-control form-select d-flex align-items-center custom-select-state-entity" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                      {selectedIcon1 && <i className={`ic ic-19 ${selectedIcon1} m-r-5 m-l-5`}></i>}
                      <span style={{padding:!selectedIcon1 ? "5px" : ""}}>{selectedLabel1}</span>
                      {isOpen1 && (
                          <ul className="dropdown-list" style={{ marginTop: "25px",top:"0px" }}>
                              {defendants?.map((defendant, index) => (
                                  <li
                                      style={{padding:"5px"}}
                                      key={index}
                                      onClick={(e) => handleSelection1(
                                          e,
                                          `${defendant.id}`,
                                          `${defendant.defendantType_name === "Private Individual" ? defendant?.first_name + " " + defendant?.last_name : defendant?.entity_name} - ${defendant.defendantType_name}`,
                                          "ic-defendants"
                                      )}
                                  >
                                      <i className={`ic ic-19 ic-defendants m-r-5`}></i>
                                      {defendant.defendantType_name === "Private Individual"
                                        ? defendant?.first_name + " " + defendant?.last_name
                                        : defendant?.entity_name}{" "}
                                      - {defendant.defendantType_name}
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>
              </div>
              </div>
            </div>
            <Row className="align-items-center custom-margin-bottom">
              <Col md={4} className="p-r-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Policy#"
                  {...register("policyNumber")}
                />
              </Col>
              <Col md={4} className="p-l-0 p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Claim#"
                  {...register("claimNumber")}
                />
              </Col>
              <Col md={4} className="custom-select-new-entity p-l-5">
                <Form.Control
                  as="select"
                  className={`custom-margin-bottom height-25 p-0 p-l-5 rounded-0 mb-0 ${errors.insuranceTypeId && "is-invalid"}`}
                  {...register("insuranceTypeId")}
                >
                  <option value="" disabled selected>
                    Select Coverage Type
                  </option>
                  {insuranceTypes &&
                    insuranceTypes?.map((insuranceType) => {
                      if (
                        !insuranceType?.state ||
                        (insuranceType?.state &&
                          insuranceType?.state?.id === litigation?.state?.id)
                      ) {
                        return (
                          <option
                            key={insuranceType?.id}
                            value={insuranceType?.id}
                          >
                            {insuranceType?.name}
                          </option>
                        );
                      }
                      return null;
                    })}
                </Form.Control>
              </Col>
            </Row>
            <Row className="custom-margin-bottom">
              <Col md={12}>
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Type Insurance Company Name to add from library"
                  onKeyUp={() => handleSearch(event, "company")}
                  disabled={!selectedInsuranceTypeId}
                />
                {/* {searchedCompany.length > 0 && (
                  <AutoCompleteSearch
                    searchedInsurances={searchedCompany}
                    selectedInsurance={handleSelectedInsurance}
                    isCompany={true}
                  />
                )} */}
              </Col>
            </Row>
            <Row className="mx-0 custom-margin-bottom">
              <div
                className="no-scroll-bar"
                style={{
                  height: "275px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                <table
                  className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
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
                      <th style={{ width: "35px" }} className=""></th>
                      <th className="text-left color-grey-2 td-autosize">
                        Company Name
                      </th>
                      <th className="text-center color-grey-2">
                        Address
                      </th>
                      <th
                        style={{
                          width: "110px",
                        }}
                        className=" text-center color-grey-2"
                      >
                        Phone
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
                    {searchedCompany.length > 0 && searchedCompany?.map((result,index) => {
                      return (
                        <tr 
                          className={`height-25 expert-table-row`}
                          id=""
                          data-table_id={36}
                          style={{
                            cursor: "pointer",
                            backgroundColor: selectedRow === index && "var(--primary-50)"
                          }}
                          
                          // onMouseEnter={() =>
                          //   setSelectedProviderByHover(result)
                          // }
                          // onMouseLeave={() =>
                          //   setSelectedProviderByHover(null)
                          // }
                          onClick={() => {
                            handleSelectedInsurance(result.id,"company");
                            setSelectedRow(index);
                          }}
                        >
                          <td className=""></td>
                          <td
                            className="text-left color-black"
                            style={{ fontWeight: "600" }}
                          >
                            {result?.company_name && result?.company_name }
                          </td>
                          <td
                            className="color-black"
                            style={{
                              height: "25px",
                              fontWeight: "600",
                            }}
                          >
                            <div className="d-flex align-items-center height-25 ">
                              {(() => {
                                const fullAddress = [
                                  result?.address1,
                                  result?.address2,
                                  `${result?.city || ""} ${result?.state || ""} ${result?.zip || ""}`,
                                ]
                                  .filter(Boolean)
                                  .join(", ");
                                return fullAddress.length > 78
                                  ? fullAddress.substring(0, 78) +
                                      "..."
                                  : fullAddress;
                              })()}
                            </div>
                          </td>

                          <td
                            className="color-black text-left"
                            style={{ fontWeight: "600" }}
                            id="phone-padding-tables-new-provider"
                          >
                            {formatPhoneNumber(
                              result?.phone
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {Array.from({
                      length:
                        10 -
                        (searchedCompany
                          ? searchedCompany?.length
                          : 0),
                    }).map((_, index) => (
                      <tr
                        key={index}
                        className="fake-rows-new-provider height-25"
                      >
                        <td colSpan={12}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Row>
            {/* <Row className="align-items-center custom-margin-bottom">
              <Col md={12} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Company Name"
                  {...register("companyName")}
                />
              </Col>
              <Col md={6} className="p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Address 1"
                  {...register("address1")}
                />
              </Col>
              <Col md={6} >
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Address 2"
                  {...register("address2")}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom ">
              <Col md={4} >
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="City"
                  {...register("city")}
                />
              </Col>
              <Col md={4} className="custom-select-state-entity p-l-0 p-r-0">
                <Form.Select
                  {...register("state")}
                  className={`form-control custom-margin-bottom height-25 p-0 p-l-5 mb-0 rounded-0 ${errors.state && "is-invalid"}`}
                >
                  <option value="" disabled selected>
                    State
                  </option>
                  {states?.map((state) => (
                    <option key={state.StateAbr} value={state.StateAbr}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Zip"
                  {...register("zip")}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom">
              <Col md={4}>
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Phone: (###) ###-####"
                  {...register("phoneNumber")}
                  onKeyUp={() => handleChange(event, "phoneNumber")}
                />
              </Col>
              <Col md={4} className="p-l-0 p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Ext."
                  {...register("extension")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Fax: (###) ###-####"
                  onKeyUp={() => handleChange(event, "fax")}
                  {...register("fax")}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom">
                <Col md={6} className="p-r-0">
                  <Form.Control
                    type="text"
                    className="height-25 p-0 p-l-5 rounded-0"
                    placeholder="Website: www.companyurl.com"
                    {...register("website")}
                  />
                </Col>
                <Col md={6} className="">
                  <Form.Control
                    type="text"
                    className="height-25 p-0 p-l-5 rounded-0"
                    placeholder="Email: someone@companyurl.com"
                    {...register("email")}
                  />
                  </Col>
            </Row> */}
            
            <Row className="custom-margin-bottom">
              <Col md={12}>
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Type Adjuster Name to add from library"
                  onKeyUp={() => handleSearch(event, "adjuster")}
                  disabled={!selectedCompanyId}
                />
                {/* {searchedAdjuster.length > 0 && (
                  <AutoCompleteSearch
                    searchedInsurances={searchedAdjuster}
                    selectedInsurance={handleSelectedInsurance}
                    isAdjuster={true}
                  />
                )} */}
              </Col>
            </Row>
            <Row className="mx-0 custom-margin-bottom">
              <div
                className="no-scroll-bar"
                style={{
                  height: "150px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                <table
                  className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
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
                      <th style={{ width: "35px" }} className=""></th>
                      <th className="text-left color-grey-2 td-autosize">
                        Adjuster Name
                      </th>
                      <th className="text-center color-grey-2">
                        Address
                      </th>
                      <th
                        style={{
                          width: "110px",
                        }}
                        className=" text-center color-grey-2"
                      >
                        Phone
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
                    {searchedAdjuster.length > 0 && searchedAdjuster?.map((result,index) => {
                      return (
                        <tr 
                          className={`height-25 expert-table-row`}
                          id=""
                          data-table_id={36}
                          style={{
                            cursor: "pointer",
                            backgroundColor: selectedRow1 === index && "var(--primary-50)"
                          }}
                          
                          // onMouseEnter={() =>
                          //   setSelectedProviderByHover(result)
                          // }
                          // onMouseLeave={() =>
                          //   setSelectedProviderByHover(null)
                          // }
                          onClick={() => {
                            console.log("Result:",result.id)
                            handleSelectedInsurance(result.id,"adjuster");
                            setSelectedRow1(index);
                          }}
                        >
                          <td className=""></td>
                          <td
                            className="text-left color-black"
                            style={{ fontWeight: "600" }}
                          >
                            {(result?.adjuster_firstname || result?.adjuster_lastname) ? result?.adjuster_firstname + " " + result?.adjuster_lastname : result?.name}
                          </td>
                          <td
                            className="color-black"
                            style={{
                              height: "25px",
                              fontWeight: "600",
                            }}
                          >
                            <div className="d-flex align-items-center height-25 ">
                              {(() => {
                                const fullAddress = [
                                  result?.address1,
                                  result?.address2,
                                  `${result?.city || ""} ${result?.state || ""} ${result?.zip || ""}`,
                                ]
                                  .filter(Boolean)
                                  .join(", ");
                                return fullAddress.length > 78
                                  ? fullAddress.substring(0, 78) +
                                      "..."
                                  : fullAddress;
                              })()}
                            </div>
                          </td>

                          <td
                            className="color-black text-left"
                            style={{ fontWeight: "600" }}
                            id="phone-padding-tables-new-provider"
                          >
                            {formatPhoneNumber(
                              result?.phone
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {Array.from({
                      length:
                        5 -
                        (searchedAdjuster
                          ? searchedAdjuster?.length
                          : 0),
                    }).map((_, index) => (
                      <tr
                        key={index}
                        className="fake-rows-new-provider height-25"
                      >
                        <td colSpan={12}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Row>
            {/* <Row className="align-items-center">
              <Col md={6} className="p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Adjuster First Name"
                  {...register("adjuster_fname")}
                />
              </Col>
              <Col md={6} className="">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Adjuster Last Name"
                  {...register("adjuster_lname")}
                />
              </Col>
            </Row> */}
          </Form>
          <div className="d-flex justify-content-between align-items-center">
              <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                Cancel
              </Button>
              <div>
                  <Button form="addinsurance_form" disabled={selectedRow == null} type="submit" variant="success" className="m-l-5 btn-success height-25" style={{padding:"0px 12px"}}>
                      Save and Close
                  </Button>
              </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default AddDefendantInsuranceModal;
