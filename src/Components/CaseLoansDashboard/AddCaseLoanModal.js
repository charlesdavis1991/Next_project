import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  currencyFormat,
  getCaseId,
  getClientId,
  getToken,
  formatDateForSubmission,
} from "../../Utils/helper";
import addEditLoanApi from "./common/addEditLoanApi";
import axios from "axios";

const AddCaseLoanModal = ({ show, handleClose, updateLoanStates }) => {
  const [statesAbrs, setStatesAbrs] = useState([]);
  const [formattedPhone, setFormattedPhone] = useState("");
  const [formattedFax, setFormattedFax] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const formatPhoneNumberForDisplay = (value) => {
    if (!value) return "";
    const phoneNumber = value.replace(/[^\d]/g, "").slice(0, 10);

    if (phoneNumber.length < 4) return `(${phoneNumber}`;
    if (phoneNumber.length < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  };
  const handlePhoneChange = (e) => {
    const rawDigits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
    formik.setFieldValue("phone", rawDigits);
    setFormattedPhone(formatPhoneNumberForDisplay(rawDigits));
  };
  const handleFaxChange = (e) => {
    const rawDigits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
    formik.setFieldValue("fax", rawDigits);
    setFormattedFax(formatPhoneNumberForDisplay(rawDigits));
  };
  const fetchSatesData = async () => {
    try {
      const origin =
        process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
      const accessToken = getToken();
      const response = await axios.get(`${origin}/api/states/`, {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip_code: "",
      fax: "",
      email: "",
      phone: "",
      extension: "",
      loan_company: "",
      current_amount_verified: "",
      date_disbursed: null,
      fees: "",
      interest: "",
      amount_estimate: "",
      date_verified: null,
      final_payoff: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().nullable(),
      last_name: Yup.string().nullable(),
      address1: Yup.string().nullable(),
      address2: Yup.string().nullable(),
      city: Yup.string().nullable(),
      state: Yup.string().nullable(),
      zip_code: Yup.string().nullable(),
      fax: Yup.string().nullable(),
      email: Yup.string().email("Invalid email").nullable(),
      phone: Yup.string().nullable(),
      extension: Yup.string().nullable(),
      loan_company: Yup.string().nullable(),
      current_amount_verified: Yup.number().nullable(),
      date_disbursed: Yup.date().nullable(),
      status: Yup.string().nullable(),
      fees: Yup.number().nullable(),
      interest: Yup.string().nullable(),
      amount_estimate: Yup.number(),
      date_verified: Yup.date().nullable(),
      final_payoff: Yup.number().nullable(),
    }),
    onSubmit: async (values) => {
      const transformedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === null ? null : value.toString(),
        ])
      );
      if (transformedValues["date_disbursed"])
        transformedValues["date_disbursed"] = formatDateForSubmission(
          transformedValues["date_disbursed"]
        );
      if (transformedValues["date_verified"])
        transformedValues["date_verified"] = formatDateForSubmission(
          transformedValues["date_verified"]
        );
      if (!transformedValues["final_payoff"])
        transformedValues["final_payoff"] = null;
      if (!transformedValues["amount_estimate"])
        transformedValues["amount_estimate"] = null;
      if (!transformedValues["fees"]) transformedValues["fees"] = null;
      if (!transformedValues["interest"]) transformedValues["interest"] = null;
      if (!transformedValues["current_amount_verified"])
        transformedValues["current_amount_verified"] = null;
      const payload = {
        case_id: getCaseId(),
        client_id: getClientId(),
        ...transformedValues,
      };
      console.log(payload);
      const res = await addEditLoanApi(payload);
      console.log(res);
      updateLoanStates();
      handleClose();
    },
  });
  useEffect(() => {
    fetchSatesData();
  }, []);
  useEffect(() => {
    if (!show) {
      $(".modal").hide();
    }
  }, [show]);

  const handleSearch = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const origin =
        process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
      const accessToken = getToken();
      const clientId = getClientId();
      const caseId = getCaseId();

      const response = await axios.get(
        `${origin}/api/add/case/loan/${clientId}/${caseId}/`,
        {
          headers: {
            Authorization: accessToken,
          },
          params: {
            search: value,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelect = (result) => {
    // Format phone numbers for display if available
    if (result.contact?.phone_number) {
      const formattedPhoneValue = formatPhoneNumberForDisplay(
        result.contact.phone_number
      );
      setFormattedPhone(formattedPhoneValue);
    }

    if (result.contact?.fax) {
      const formattedFaxValue = formatPhoneNumberForDisplay(result.contact.fax);
      setFormattedFax(formattedFaxValue);
    }

    formik.setFieldValue("company_id", result.id || "");
    formik.setFieldValue("loan_company", result.loan_company || "");
    formik.setFieldValue("contact_name", result.contact_name || "");

    // Map contact fields
    if (result.contact) {
      formik.setFieldValue("first_name", result.contact.first_name || "");
      formik.setFieldValue("last_name", result.contact.last_name || "");
      formik.setFieldValue("address1", result.contact.address1 || "");
      formik.setFieldValue("address2", result.contact.address2 || "");
      formik.setFieldValue("city", result.contact.city || "");
      formik.setFieldValue("state", result.contact.state || "");
      formik.setFieldValue("zip_code", result.contact.zip || "");
      formik.setFieldValue("phone", result.contact.phone_number || "");
      formik.setFieldValue("extension", result.contact.phone_ext || "");
      formik.setFieldValue("email", result.contact.email || "");
      formik.setFieldValue("fax", result.contact.fax || "");
      formik.setFieldValue("lender_website", result.contact.website || "");
    }

    // Clear search results
    setSearchResults([]);
    setSearchTerm("");
    setIsFiltersOpen(false);
  };

  // Add debounce to prevent excessive API calls
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        dialogClassName="custom-insurance-dialog justify-content-center "
      >
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header">
          <div
            class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4"
            id="modal_title"
            style={{ fontSize: "14px", fontWeight: "600" }}
          >
            Add Case Loan
          </div>
        </div>
        <Modal.Body className="p-0">
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mx-0 p-t-5">
              <Col md={12} className="p-l-5 p-r-5">
                <input
                  type="text"
                  placeholder="Search Loan Companies"
                  className="form-control custom-margin-bottom rounded-0 height-25"
                  name="case_loans_search_form"
                  onChange={(e) => {
                    const value = e.target.value;
                    setIsFiltersOpen(true);
                    setSearchTerm(value);
                    debouncedSearch(value);
                  }}
                />
                {Array.isArray(searchResults) && searchResults.length > 0 && (
                  <div style={{ position: "relative" }}>
                    <div
                      className={`${isFiltersOpen ? "block" : "hidden"} p-l-5 p-r-5`}
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
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            handleResultSelect(result);
                            setIsFiltersOpen(false);
                          }}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {result?.loan_company}
                          {" - "}
                          {result?.contact?.address1}{" "}
                          {result?.contact?.address2} {result?.contact?.city}{" "}
                          {result?.contact?.state}{" "}
                          {result?.contact?.phone_number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom mx-0">
              <Col sm={12} className="p-l-5 p-r-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Loan Company"
                  id="loan_company"
                  name="loan_company"
                  value={formik.values.loan_company}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.loan_company}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Col sm={6} className="p-l-5 p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="First Name"
                  id="first_name"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.first_name}
                </Form.Control.Feedback>
              </Col>
              <Col sm={6} className="p-r-5">
                <Form.Control
                  className="height-25 p-0 p-l-5 rounded-0"
                  type="text"
                  placeholder="Last Name"
                  id="last_name"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.last_name}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Col sm={6} className="p-l-5 p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Address 1"
                  id="address1"
                  name="address1"
                  value={formik.values.address1}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address1}
                </Form.Control.Feedback>
              </Col>
              <Col sm={6} className="p-r-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Address 2"
                  id="address2"
                  name="address2"
                  value={formik.values.address2}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address2}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Col sm={4} className="p-l-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="City"
                  id="city"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.city}
                </Form.Control.Feedback>
              </Col>
              <Col sm={4} className="custom-select-state-entity p-r-0 p-l-0">
                <Form.Control
                  as="select"
                  id="state"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  className={`form-control custom-margin-bottom height-25 p-0 p-l-5 mb-0 rounded-0`}
                  isInvalid={!!formik.errors.state && formik.touched.state}
                >
                  <option value="">State</option>
                  {statesAbrs.map((state, index) => (
                    <option key={index} value={state.abbreviation}>
                      {state.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.state}
                </Form.Control.Feedback>
              </Col>
              <Col sm={4} className="p-r-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Zip Code"
                  id="zip_code"
                  name="zip_code"
                  value={formik.values.zip_code}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.zip_code}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Col sm={4} className="p-l-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Phone: (###) ###-####"
                  id="phone"
                  name="phone"
                  value={formattedPhone}
                  onChange={handlePhoneChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Col>
              <Col sm={4} className="p-r-0 p-l-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Ext."
                  id="extension"
                  name="extension"
                  value={formik.values.extension}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.extension}
                </Form.Control.Feedback>
              </Col>
              <Col sm={4} className="p-r-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Fax: (###) ###-####"
                  id="fax"
                  name="fax"
                  value={formattedFax}
                  onChange={handleFaxChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.fax}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Col sm={6} className="p-l-5 p-r-0">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Website: www.insurancewebsite.com "
                  id="lender_website"
                  name="lender_website"
                  value={formik.values.lender_website}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lender_website}
                </Form.Control.Feedback>
              </Col>
              <Col sm={6} className="p-r-5">
                <Form.Control
                  type="text"
                  className="height-25 p-0 p-l-5 rounded-0"
                  placeholder="Email: someone@insurance.com"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-5 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Disbursed Date:
              </Form.Label>
              <Col sm={10} className="p-l-0 p-r-5">
                <Form.Control
                  type="date"
                  className="height-25 p-0 p-l-5 rounded-0"
                  name="date_disbursed"
                  {...formik.getFieldProps("date_disbursed")}
                  style={{ appearance: "none" }}
                  onClick={(e) => e.target.showPicker()}
                  isInvalid={
                    formik.touched["date_disbursed"] &&
                    formik.errors["date_disbursed"]
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.values["date_disbursed"]}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-5 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Loan Amount:
              </Form.Label>
              <Col sm={4} className="p-l-0 p-r-0">
                <Form.Control
                  type="text"
                  name="current_amount_verified"
                  className="monospace-font height-25 p-0 p-l-5 rounded-0"
                  value={
                    formik.values.current_amount_verified
                      ? `$ ${formik.values.current_amount_verified}`
                      : "$ "
                  }
                  onFocus={(e) => {
                    formik.setFieldValue("current_amount_verified", ""); // Clear only the numeric value on click
                  }}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                    // Ensure only one decimal point
                    if ((value.match(/\./g) || []).length > 1) {
                      value = value.substring(0, value.lastIndexOf("."));
                    }

                    // Restrict to 2 decimal places
                    if (value.includes(".")) {
                      let parts = value.split(".");
                      if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                      }
                      value = parts.join(".");
                    }

                    formik.setFieldValue("current_amount_verified", value); // Update Formik state
                  }}
                  onBlur={(e) => {
                    if (!formik.values.current_amount_verified) {
                      formik.setFieldValue("current_amount_verified", "0.00"); // Keep "$ " in place if empty
                    }
                  }}
                  isInvalid={
                    formik.touched.current_amount_verified &&
                    !!formik.errors.current_amount_verified
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.current_amount_verified}
                </Form.Control.Feedback>
              </Col>
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-15 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Fees:
              </Form.Label>
              <Col sm={4} className="p-l-15 p-r-5">
                <Form.Control
                  type="text"
                  name="fees"
                  className="monospace-font height-25 p-0 p-l-5 rounded-0"
                  value={formik.values.fees ? `$ ${formik.values.fees}` : "$ "}
                  onFocus={(e) => {
                    formik.setFieldValue("fees", ""); // Clear only the numeric value on click
                  }}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                    // Ensure only one decimal point
                    if ((value.match(/\./g) || []).length > 1) {
                      value = value.substring(0, value.lastIndexOf("."));
                    }

                    // Restrict to 2 decimal places
                    if (value.includes(".")) {
                      let parts = value.split(".");
                      if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                      }
                      value = parts.join(".");
                    }

                    formik.setFieldValue("fees", value); // Update Formik state
                  }}
                  onBlur={(e) => {
                    if (!formik.values.fees) {
                      formik.setFieldValue("fees", "0.00"); // Keep "$ " in place if empty
                    }
                  }}
                  isInvalid={formik.touched.fees && !!formik.errors.fees}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.fees}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-5 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Interest:
              </Form.Label>
              <Col sm={4} className="p-l-0 p-r-0">
                <Form.Control
                  type="text"
                  name="interest"
                  className="monospace-font height-25 p-0 p-l-5 rounded-0"
                  value={
                    formik.values.interest
                      ? `$ ${formik.values.interest}`
                      : "$ "
                  }
                  onFocus={(e) => {
                    formik.setFieldValue("interest", ""); // Clear only the numeric value on click
                  }}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                    // Ensure only one decimal point
                    if ((value.match(/\./g) || []).length > 1) {
                      value = value.substring(0, value.lastIndexOf("."));
                    }

                    // Restrict to 2 decimal places
                    if (value.includes(".")) {
                      let parts = value.split(".");
                      if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                      }
                      value = parts.join(".");
                    }

                    formik.setFieldValue("interest", value); // Update Formik state
                  }}
                  onBlur={(e) => {
                    if (!formik.values.interest) {
                      formik.setFieldValue("interest", "0.00"); // Keep "$ " in place if empty
                    }
                  }}
                  isInvalid={
                    formik.touched.interest && !!formik.errors.interest
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.interest}
                </Form.Control.Feedback>
              </Col>
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-15 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Payoff Estimate:
              </Form.Label>
              <Col sm={4} className="p-l-15 p-r-5">
                <Form.Control
                  type="text"
                  name="amount_estimate"
                  className="monospace-font height-25 p-0 p-l-5 rounded-0"
                  value={
                    formik.values.amount_estimate
                      ? `$ ${formik.values.amount_estimate}`
                      : "$ "
                  }
                  onFocus={(e) => {
                    formik.setFieldValue("amount_estimate", ""); // Clear only the numeric value on click
                  }}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                    // Ensure only one decimal point
                    if ((value.match(/\./g) || []).length > 1) {
                      value = value.substring(0, value.lastIndexOf("."));
                    }

                    // Restrict to 2 decimal places
                    if (value.includes(".")) {
                      let parts = value.split(".");
                      if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                      }
                      value = parts.join(".");
                    }

                    formik.setFieldValue("amount_estimate", value); // Update Formik state
                  }}
                  onBlur={(e) => {
                    if (!formik.values.amount_estimate) {
                      formik.setFieldValue("amount_estimate", "0.00"); // Keep "$ " in place if empty
                    }
                  }}
                  isInvalid={
                    formik.touched.amount_estimate &&
                    !!formik.errors.amount_estimate
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.amount_estimate}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="align-items-center custom-margin-bottom mx-0">
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-5 p-r-0 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Final Payoff:
              </Form.Label>
              <Col sm={10} className="p-r-5 p-l-0">
                <Form.Control
                  type="text"
                  name="final_payoff"
                  className="monospace-font height-25 p-0 p-l-5 rounded-0"
                  value={
                    formik.values.final_payoff
                      ? `$ ${formik.values.final_payoff}`
                      : "$ "
                  }
                  onFocus={(e) => {
                    formik.setFieldValue("final_payoff", ""); // Clear only the numeric value on click
                  }}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and '.'

                    // Ensure only one decimal point
                    if ((value.match(/\./g) || []).length > 1) {
                      value = value.substring(0, value.lastIndexOf("."));
                    }

                    // Restrict to 2 decimal places
                    if (value.includes(".")) {
                      let parts = value.split(".");
                      if (parts[1].length > 2) {
                        parts[1] = parts[1].substring(0, 2);
                      }
                      value = parts.join(".");
                    }

                    formik.setFieldValue("final_payoff", value); // Update Formik state
                  }}
                  onBlur={(e) => {
                    if (!formik.values.final_payoff) {
                      formik.setFieldValue("final_payoff", "0.00"); // Keep "$ " in place if empty
                    }
                  }}
                  isInvalid={
                    formik.touched.final_payoff && !!formik.errors.final_payoff
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.final_payoff}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="align-items-center custom-margin-bottom mx-0 mb-0">
              <Form.Label
                column
                sm={2}
                className="fw-bold p-l-5 p-r-0 white-space-nw height-25 d-flex align-items-center py-0"
              >
                Verified Date
              </Form.Label>
              <Col sm={10} className="p-r-5 p-l-0">
                <Form.Control
                  type="date"
                  className="height-25 p-0 p-l-5 rounded-0"
                  name="date_verified"
                  {...formik.getFieldProps("date_verified")}
                  style={{ appearance: "none" }}
                  onClick={(e) => e.target.showPicker()}
                  isInvalid={
                    formik.touched["date_verified"] &&
                    formik.errors["date_verified"]
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.values["date_verified"]}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <div
              className="d-flex justify-content-between"
              style={{ padding: "5px" }}
            >
              <div>
                <Button
                  variant="secondary"
                  className="height-25"
                  style={{ padding: "0px 12px" }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  type="submit"
                  variant="success"
                  className="m-l-5 bg-success height-25"
                  style={{ padding: "0px 12px" }}
                >
                  Save
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddCaseLoanModal;
