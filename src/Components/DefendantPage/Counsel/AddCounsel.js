import React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import api from "../../../api/api";
import { getCaseId, getClientId, getToken, formatPhoneNumber } from "../../../Utils/helper";
import axios from "axios";

function AddCounsel({
  handleClose,
  handleFacthDefendants,
  defendants = [],
  currentDefendantId,
}) {
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const currentCaseId = getCaseId();
  const clientId = getClientId();
  const [counselTypes, setCounselTypes] = useState([]);
  const [currentDefendantIdCounsel, setCurrentDefendantId] = useState("");
  const [selectedDefendants, setSelectedDefendants] = useState([]);
  const [currentDefendantName, setCurrentDefendantName] = useState("");
  const [searchResults, setSearchResults] = useState([]); // counsel's filters
  const [filteredFirmResults, setFilteredFirmResults] = useState([]);
  const [filteredCounselResults, setFilteredCounselResults] = useState([]);
  const [filteredCounselOpen, setIsFiltersCounselOpen] = useState(false);
  const [filteredFirmOpen, setIsFiltersFirmOpen] = useState(false);

  const [selectedRow,setSelectedRow] = useState(null);
  const [selectedRow1,setSelectedRow1] = useState(null);

  const [states, setStates] = useState([]); //state abrs
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();

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

  const fecthCounselFilter = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/general/search_filter_counsel/`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        setSearchResults(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fecthCounselTypes = async () => {
    try {
      const response = await axios.get(
        `${origin}/api/defendants/counsel_types/`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      if (response.status === 200) {
        setCounselTypes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setCurrentDefendant = () => {
    if (defendants) {
      const matchedDefendant = defendants.find(
        (d) => d.id === currentDefendantId
      );
      if (matchedDefendant) {
        setSelectedDefendants([matchedDefendant]);
      }
    }
    return;
  };

  useEffect(() => {
    fetchSatesData();
    fecthCounselTypes();
    setCurrentDefendant();
    fecthCounselFilter();
  }, []);

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

  const handleInputFirmChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2) {
      const filtered = searchResults?.firms?.filter((result) => {
        const office_name = result?.office_name
          ? result?.office_name?.toLowerCase()
          : "";
        const first_name = result.first_name
          ? result?.first_name?.toLowerCase()
          : "";
        const last_name = result?.last_name
          ? result?.last_name?.toLowerCase()
          : "";
        const address1 = result?.address1 ? result?.address1?.toLowerCase() : "";
        const address2 = result?.address2 ? result?.address2?.toLowerCase() : "";
        const city = result?.city ? result?.city?.toLowerCase() : "";
        const state = result?.state ? result?.state?.toLowerCase() : "";
        const zip = result?.zip ? result?.zip?.toLowerCase() : "";
        const website = result?.zip ? result?.website?.toLowerCase() : "";
        const phone = result?.zip ? result?.phone?.toLowerCase() : "";

        return (
          office_name?.startsWith(inputValue) ||
          first_name?.startsWith(inputValue) ||
          last_name?.startsWith(inputValue) ||
          address1?.startsWith(inputValue) ||
          address2?.startsWith(inputValue) ||
          city?.startsWith(inputValue) ||
          zip?.startsWith(inputValue) ||
          phone?.startsWith(inputValue) ||
          website?.startsWith(inputValue) ||
          state?.startsWith(inputValue)
        );
      });

      setFilteredFirmResults(filtered);
      setIsFiltersFirmOpen(true);
    } else {
      setFilteredFirmResults([]);
    }
  };

  const handleCounselChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 2) {
      const filtered = searchResults?.attorneys?.filter((result) => {
        const first_name = result.first_name
          ? result.first_name.toLowerCase()
          : "";
        const last_name = result.last_name
          ? result.last_name.toLowerCase()
          : "";
        const firm_name = result.firm_name
          ? result.firm_name.toLowerCase()
          : "";
        const address1 = result.address1 ? result.address1.toLowerCase() : "";
        const address2 = result.address2 ? result.address2.toLowerCase() : "";
        const city = result.city ? result.city.toLowerCase() : "";
        const state = result.state ? result.state.toLowerCase() : "";
        const zip = result.zip ? result.zip.toLowerCase() : "";

        return (
          firm_name.startsWith(inputValue) ||
          first_name.startsWith(inputValue) ||
          last_name.startsWith(inputValue) ||
          address1.startsWith(inputValue) ||
          address2.startsWith(inputValue) ||
          city.startsWith(inputValue) ||
          zip.startsWith(inputValue) ||
          state.startsWith(inputValue)
        );
      });

      setFilteredCounselResults(filtered);
      setIsFiltersCounselOpen(true);
    } else {
      setFilteredCounselResults([]);
    }
  };

  const handleSelectedForFirm = (instance) => {
    // setValue(
    //   "firm_name",
    //   instance.first_name && instance.last_name
    //     ? `${instance.first_name} ${instance.last_name}`
    //     : ""
    // );

    setValue("firm_name", instance?.office_name);
    setValue("firm_address1", instance.address1 || "");
    setValue("firm_address2", instance.address2 || "");
    setValue("firm_city", instance.city || "");
    setValue("firm_state", instance.state || "");
    setValue("firm_zip", instance.zip || "");
    setValue("firm_phone", formatNumber(instance.phone) || "");
    setValue("firm_id", instance.id || "");
    setValue("firm_extension", instance.extension || "");
    setValue("firm_fax", formatNumber(instance.fax) || "");
    setValue("firm_email", instance.email || "");
    setValue("frim_website", instance.website || "");
  };

  const handleSelectedForCounsel = (instance) => {
    const office_name = instance?.office_name;
    const firstName = instance?.first_name; // First word as first name
    const lastName = instance?.last_name; // Last word as first name

    setValue("counsel_first_name", firstName || "");
    setValue("counsel_last_name", lastName || "");
    setValue("counsel_address1", instance.address1 || "");
    setValue("counsel_address2", instance.address2 || "");
    setValue("counsel_city", instance.city || "");
    setValue("counsel_state", instance.state || "");
    setValue("counsel_zip", instance.zip || "");
    setValue("counsel_phone", formatNumber(instance.phone) || "");
    setValue("counsel_extension", instance.extension || "");
    setValue("counsel_fax", formatNumber(instance.fax) || "");
    setValue("counsel_email", instance.email || "");
    setValue("counsel_website", instance.website || "");
  };

  const selectMultipleDefendant = (event, defendant) => {
    event.stopPropagation();
    const updatedSelectedDefendants = [...selectedDefendants];
    const index = updatedSelectedDefendants.findIndex(
      (d) => d.id === defendant.id
    );

    if (index > -1) {
      updatedSelectedDefendants.splice(index, 1);
    } else {
      updatedSelectedDefendants.push(defendant);
    }

    setSelectedDefendants(updatedSelectedDefendants);
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

  function handleChange(event, inputType) {
    if (inputType == "firm_phone") {
      let formattedValue = formatNumber(event.target.value);
      setValue("firm_phone", formattedValue);
    }
    if (inputType == "firm_fax") {
      let formattedValue = formatNumber(event.target.value);
      setValue("firm_fax", formattedValue);
    }
    if (inputType == "counsel_phone") {
      let formattedValue = formatNumber(event.target.value);
      setValue("counsel_phone", formattedValue);
    }
    if (inputType == "counsel_fax") {
      let formattedValue = formatNumber(event.target.value);
      setValue("counsel_fax", formattedValue);
    }
  }

  const onSubmit = async (data) => {
    const cleanedData = {
      ...data,
      defendant_ids: Number(currentDefendantIdCounsel),
      counsel_type_id: data.counsel_type_id ? data.counsel_type_id : null,
    };

    try {
      const response = await api.post(
        `${origin}/api/defendants/add_counsel/${clientId}/${currentCaseId}/`,
        cleanedData
      );
      if (response.status === 201) {
        handleClose();
        handleFacthDefendants();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Getting the currentDefendent name
  useEffect(() => {
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
      setValue("defendant_ids", value);
      setCurrentDefendantId(value);
      setSelectedLabel1(label);
      setSelectedIcon1(iconClass);
      setIsOpen1(false);
  };

  useEffect(() => {
    register("counsel_type_id");
  }, [register]);

  return (
    <Modal
      show={true}
      onHide={handleClose}
      centered
      dialogClassName="modal-dialog-centered INS-max-width-1000px justify-content-center custom-add-insurance-dialog"
    >
      <div>
      <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add Counsel To Defendant</div></div>
        <Modal.Body className="panel-popups-body" style={{padding:"5px"}}>
          <Form id="addCounsel_form" onSubmit={handleSubmit(onSubmit)}>
            {/* <Row className="mb-2">
              <Col md={3} className="d-flex align-items-center">
                <p className="text-secondary text-darker">
                  Counsel for Defendant :
                </p>
              </Col>
              <Col md={9}>
                <Form.Control
                  as="select"
                  value={currentDefendantIdCounsel} 
                  {...register("defendant_ids", { required: true })}
                  onChange={(e) => handleDefendantChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select a defendant
                  </option>
                  {defendants.map((defendant) => (
                    <option key={defendant.id} value={defendant.id}>
                      {defendant.defendantType_name === "Private Individual"
                        ? defendant?.first_name + " " + defendant?.last_name
                        : defendant?.entity_name}{" "}
                      - {defendant.defendantType_name}
                    </option>
                  ))}
                </Form.Control>
                 <Form.Control
                  type="text"
                  value={currentDefendantName}
                  disabled
                /> 
              </Col>
            </Row> */}
            <div className="custom-margin-bottom d-flex justify-content-center">
              <div className="p-r-5 d-flex align-items-center" >
                <p className="text-secondary text-darker white-space-nowrap">
                Select Defendant:
                </p>
              </div>
              <div className="custom-select-new-entity d-flex-1">
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
              <Col md={6} className="p-r-5">
                <Form.Control
                  type="text"
                  className="form-control height-25 rounded-0"
                  placeholder="Enter File #"
                  {...register("file_number")}
                />
              </Col>
              <Col md={6} className="custom-select-new-entity p-l-5">
              <Form.Control
                    as="select"
                    value={watch("counsel_type_id") || ""}
                    onChange={(e) => setValue("counsel_type_id", e.target.value)}
                    className={`custom-margin-bottom height-25 p-0 p-l-5 rounded-0 mb-0 ${errors.counsel_type_id && "is-invalid"}`}
                  >
                  <option value="" disabled>
                    Select Counsel Type
                  </option>
                  {counselTypes &&
                    counselTypes.map((counsel) => (
                      <option key={counsel.id} value={counsel.id}>
                        {counsel.name}
                      </option>
                    ))}
                </Form.Control>
              </Col>
            </Row>

            <p className="font-weight-bold m-b-5 m-t-5">Firm Information</p>
            <Row>
              <Col md={12}>
                <input
                  id="1222"
                  type="text"
                  className="form-control height-25 rounded-0"
                  placeholder="Type Counsel Name or Firm Name to add from library"
                  onChange={handleInputFirmChange}
                />

                {/* {Array.isArray(filteredFirmResults) &&
                  filteredFirmResults?.length > 0 && (
                    <div style={{ position: "relative" }}>
                      <div
                        className={`${filteredFirmOpen ? "block" : "hidden"}`}
                        style={{
                          position: "absolute",
                          zIndex: 1000,
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          width: "100%",
                          // maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredFirmResults
                          ?.slice(0, 9)
                          ?.map((result, index) => {
                            const fullAddress =
                              [
                                result?.office_name
                                  ? `${result.office_name}`
                                  : "",
                                result?.first_name,
                                result?.last_name,
                                result?.address1,
                                result?.address2,
                                result?.city,
                                result?.state,
                                result?.zip,
                                result?.phone,
                                result?.website,
                              ]
                                .filter(Boolean)
                                .join(", ") + (result?.zip ? "" : "");
                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  handleSelectedForFirm(result);
                                  setIsFiltersFirmOpen(false);
                                }}
                                style={{
                                  padding: "5px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {fullAddress}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )} */}
              </Col>
            </Row>
            {/* <Row className="align-items-center  mt-2">
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  className={`form-control`}
                  {...register("firm_name")}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter website"
                  {...register("frim_website")}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  {...register("firm_phone")}
                  onKeyUp={() => handleChange(event, "firm_phone")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Fax"
                  onKeyUp={() => handleChange(event, "firm_fax")}
                  {...register("firm_fax")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Email"
                  {...register("firm_email")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter extension"
                  {...register("firm_extension")}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom  mt-2">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 1"
                  {...register("firm_address1")}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 2"
                  {...register("firm_address2")}
                />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  {...register("firm_city")}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  {...register("firm_state")}
                  className={`form-control dropdown-h-35px `}
                >
                  <option value="" disabled selected>
                    Select State
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
                  placeholder="Enter ZIP"
                  {...register("firm_zip")}
                />
              </Col>
            </Row> */}
            <Row className="mx-0 custom-margin-bottom m-t-5">
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
                        Name
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
                    {filteredFirmResults?.length > 0 && filteredFirmResults?.map((result,index) => {
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
                            handleSelectedForFirm(result);
                            setIsFiltersFirmOpen(false);
                            setSelectedRow(index);
                          }}
                        >
                          <td className=""></td>
                          <td
                            className="text-left color-black"
                            style={{ fontWeight: "600" }}
                          >
                            {(result?.firstname || result?.lastname) ? result?.firstname + " " + result?.lastname : result?.office_name}
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
                        (filteredFirmResults
                          ? filteredFirmResults?.length
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


            <p className="font-weight-bold m-b-5 m-t-5">Counsel Information</p>
            <Row>
              <Col md={12}>
                <input
                  placeholder="Type Counsel Name or Firm Name to add from library"
                  id="12"
                  type="text"
                  className="form-control height-25 rounded-0"
                  onChange={handleCounselChange}
                />
                {/* {Array.isArray(filteredCounselResults) &&
                  filteredCounselResults?.length > 0 && (
                    <div style={{ position: "relative" }}>
                      <div
                        className={`${filteredCounselOpen ? "block" : "hidden"}`}
                        style={{
                          position: "absolute",
                          zIndex: 1000,
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          width: "100%",
                          // maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredCounselResults
                          .slice(0, 9)
                          ?.map((result, index) => {
                            const fullAddress =
                              [
                                result?.firm_name ? `${result.firm_name}` : "",
                                result?.first_name,
                                result?.last_name,
                                result?.address1,
                                result?.address2,
                                result?.city,
                                result?.state,
                                result?.zip,
                              ]
                                .filter(Boolean)
                                .join(", ") + (result?.zip ? "" : "");
                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  handleSelectedForCounsel(result);
                                  setIsFiltersCounselOpen(false);
                                }}
                                style={{
                                  padding: "5px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #ddd",
                                }}
                              >
                                {fullAddress}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )} */}
              </Col>
            </Row>
            {/* <Row className="align-items-center  mt-2">
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter First name"
                  {...register("counsel_first_name")}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  {...register("counsel_last_name")}
                />
              </Col>
              <Col md={4} className="custom-margin-bottom">
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  {...register("counsel_phone")}
                  onKeyUp={() => handleChange(event, "counsel_phone")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Fax"
                  onKeyUp={() => handleChange(event, "counsel_fax")}
                  {...register("counsel_fax")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter Email"
                  {...register("counsel_email")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter extension"
                  {...register("counsel_extension")}
                />
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom mt-2">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 1"
                  {...register("counsel_address1")}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Enter Address 2"
                  {...register("counsel_address2")}
                />
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Enter City"
                  {...register("counsel_city")}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  className="dropdown-h-35px"
                  {...register("counsel_state")}
                >
                  <option value="" disabled selected>
                    Select State
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
                  placeholder="Enter ZIP"
                  {...register("counsel_zip")}
                />
              </Col>
            </Row> */}
            <Row className="mx-0 m-t-5">
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
                        Name
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
                    {filteredCounselResults?.length > 0 && filteredCounselResults?.map((result,index) => {
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
                            handleSelectedForCounsel(result);
                            setIsFiltersCounselOpen(false);
                            setSelectedRow1(index);
                          }}
                        >
                          <td className=""></td>
                          <td
                            className="text-left color-black"
                            style={{ fontWeight: "600" }}
                          >
                            {(result?.firstname || result?.lastname) ? result?.firstname + " " + result?.lastname : result?.firm_name}
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
                        (filteredCounselResults
                          ? filteredCounselResults?.length
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

          </Form>
        </Modal.Body>
        <div className="d-flex justify-content-between align-items-center p-b-5 p-r-5 p-l-5">
          <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled={(selectedRow == null) && (selectedRow1 == null)} variant="success" className="m-l-5 btn-success height-25" style={{padding:"0px 12px"}} type="submit" form="addCounsel_form">
            Save and Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddCounsel;
