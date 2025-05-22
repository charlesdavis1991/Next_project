import React, { useContext, useEffect, useState } from "react";
import { Col, Modal, Row, Form } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import {
  formatDate,
  formatPhoneNumber,
  formatPhoneToDashes,
  getCaseId,
  getClientId,
} from "../../../Utils/helper";
import axios from "axios";
import api from "../../../api/api";
import { ClientDataContext } from "../shared/DataContext";
import ActionBarImg from "../../../../public/BP_resources/images/icon/client-icon-color.svg";
import "./ClientModal.css";
import { fetchCaseSummary } from "../../../api/case";
import { setCaseSummary } from "../../../Redux/caseData/caseDataSlice";
import { useDispatch } from "react-redux";

const ClientEditModal = ({ show, handleClose, clientData }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const node_env = process.env.NODE_ENV;
  const token = localStorage.getItem("token");
  const clientId = getClientId();
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [contact_1_id, setContact_1_id] = useState(null);
  const [contact_2_id, setContact_2_id] = useState(null);
  const [contact_3_id, setContact_3_id] = useState(null);
  const [checkedBox, setCheckedBox] = useState(null);
  const [email_1_id, setEmail_1_id] = useState(null);
  const [email_2_id, setEmail_2_id] = useState(null);
  const [email_3_id, setEmail_3_id] = useState(null);
  const [emailCheckedBox, setEmailCheckedBox] = useState(null);
  const [discussCase, setDiscussCase] = useState(false);
  const [emergencyDiscuss, setEmergencyDiscuss] = useState(false);
  const { setIsClientDataUpdated } = useContext(ClientDataContext);
  const [marraigeDate, setMarraigeDate] = useState(new Date());
  const [divorceDate, setDivorceDate] = useState(new Date());
  const [birthdate, setBirthdate] = useState(new Date());
  const [title, setTitle] = useState(clientData?.identification?.title || "");
  const [marital_status, setMaritalStatus] = useState();
  const [gender, setGender] = useState(
    clientData?.identification?.gender || ""
  );

  const methods = useForm();
  const {
    reset,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const getStates = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/`, {
        headers: { Authorization: token },
      });
      setStates(response.data);
    } catch (error) {
      console.error("Failed to fetch client data:", error);
    }
  };

  useEffect(() => {
    getStates();
  }, []);

  const onSubmitHandler = async (data) => {
    console.log("Submit handler", data);
    setLoading(true);
    const payload = {
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      phone_1: {
        id: contact_1_id,
        phone_number: data.phone1,
        primary_phone: data.phone1Prim,
      },
      phone_2: {
        id: contact_2_id,
        phone_number: data.phone2,
        primary_phone: data.phone2Prim,
      },
      phone_3: {
        id: contact_3_id,
        phone_number: data.phone3,
        primary_phone: data.phone3Prim,
      },
      email_1: {
        id: email_1_id,
        email: data.email1,
        primary_email: data.email1Prim,
      },
      email_2: {
        id: email_2_id,
        email: data.email2,
        primary_email: data.email2Prim,
      },
      email_3: {
        id: email_3_id,
        email: data.email3,
        primary_email: data.email3Prim,
      },
      address1: {
        id: data.address1ID,
        address1: data.clientFirstAddress1,
        address2: data.clientFirstAddress2,
        city: data.clientFirstCity,
        state: data.clientFirstState,
        zip: data.clientFirstZip,
        mailing_contact: data.mailing_contact,
      },
      address2: {
        id: data.address2ID,
        address1: data.clientSecondAddress1,
        address2: data.clientSecondAddress2,
        city: data.clientSecondCity,
        state: data.clientSecondState,
        zip: data.clientSecondZip,
        mailing_contact: data.second_mailing_contact,
      },
      clientIdentificationArea: {
        title: data.title,
        driver_license_number: data.license,
        driver_license_state: data.state,
        birthday: data.birthday || birthdate,
        ssn: ssn,
        gender: data.gender,
        state: data.state,
        license: data.license,
      },
      spouseContact: {
        first_name: data.firstName,
        last_name: data.lastName,
        address1: data.spouse_contact_address1,
        address2: data.spouse_contact_address2,
        city: data.spouse_city,
        state: data.spouse_state,
        zip: data.spouse_zip,
      },
      spouseInfo: {
        DivorceData: data.DivorceDate || divorceDate,
        discussCase: data.discussCase || discussCase,
        divorced: data.divorced,
        email: data.spouse_info_email,
        marraigeDate: data.marraigeDate || marraigeDate,
        relation: data.relation,
        phone_number: data.spouse_info_phone,
        currentContactId: clientData?.spouseInfo?.contact,
        marital_status: data.relation || marital_status,
      },
      emergencyInformation: {
        emrgencyContact: {
          address1: data.emergency_contact_address1,
          address2: data.emergency_contact_address2,
          city: data.emergency_city,
          state: data.emergency_state,
          zip: data.emergency_zip,
          email: data.emergency_info_email,
          phone_number: data.emergency_info_phone,
        },
        first_name: data.emrgency_first_name,
        last_name: data.emrgency_last_name,
        relationship: data?.emergency_relation || "",
        discussCase: data.emergency_discussCase || emergencyDiscuss,
      },
    };

    try {
      const response = await axios.post(
        `${origin}/api/client/edit/${clientId}/case/${getCaseId()}/`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      setIsClientDataUpdated(true);
      handleClose();
      fetchCaseSummary(clientId, getCaseId())
        .then((data) => {
          dispatch(setCaseSummary(data));
        })
        .catch((err) => {
          console.log("Error occurred", err);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleCheckboxChange = (index) => {
    setCheckedBox(index);
    setValue("phone1Prim", index === 1);
    setValue("phone2Prim", index === 2);
    setValue("phone3Prim", index === 3);
  };

  const handleEmailCheckBoxChange = (index) => {
    setEmailCheckedBox(index);
    setValue("email1Prim", index === 1);
    setValue("email2Prim", index === 2);
    setValue("email3Prim", index === 3);
  };

  const handlePhoneInput = (e, name) => {
    let phoneNumber = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    // Enforce max 10 digits
    if (phoneNumber.length > 10) phoneNumber = phoneNumber.slice(0, 10);
    // Apply formatting for (123) 456-7890
    if (phoneNumber.length > 6) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    } else if (phoneNumber.length > 3) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length > 0) {
      phoneNumber = `(${phoneNumber}`;
    }
    setValue(name, phoneNumber);
  };
  const [displayedSSN, setDisplayedSSN] = useState("");
  const [ssn, setSSN] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isSecondMailCheckTrue, setIsSecondMailCheckTrue] = useState(false);

  const formatSSN = (value) => {
    // Ensure value is a string, then format as XXX-XX-XXXX
    const numericValue = value.toString().replace(/\D/g, "");
    return numericValue.replace(/^(\d{3})(\d{2})(\d{4})$/, "$1-$2-$3");
  };
  function formatPhoneNumberModal(phoneNumber) {
    // Remove non-digit characters from the phone number
    phoneNumber = phoneNumber?.replace(/\D/g, "");

    // Format the phone number as (XXX) XXX-XXXX
    return phoneNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  const handleSSNChange = (e) => {
    const inputValue = e.target.value || "";
    const numericValue = inputValue.replace(/\D/g, ""); // Remove any non-numeric characters

    let formattedValue = numericValue;

    if (numericValue.length > 3 && numericValue.length <= 5) {
      formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    } else if (numericValue.length > 5) {
      formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 5)}-${numericValue.slice(5)}`;
    }

    setDisplayedSSN(formattedValue);
    setSSN(numericValue);
    setValue("ssn", numericValue);
  };

  useEffect(() => {
    setValue("first_name", clientData?.first_name);
    setValue("middle_name", clientData?.middle_name);
    setValue("last_name", clientData?.last_name);
    setValue(
      "phone1",
      formatPhoneNumberModal(clientData?.phone_numbers[0]?.phone_number)
    );
    setValue(
      "phone2",
      formatPhoneNumberModal(clientData?.phone_numbers[1]?.phone_number)
    );
    setValue(
      "phone3",
      formatPhoneNumberModal(clientData?.phone_numbers[2]?.phone_number)
    );
    setValue("email1", clientData?.Emails[0]?.email);
    setValue("email2", clientData?.Emails[1]?.email);
    setValue("email3", clientData?.Emails[2]?.email);
    setValue("clientFirstZip", clientData?.Address1?.zip);
    setValue("clientFirstCity", clientData?.Address1?.city);
    setValue("clientFirstState", clientData?.Address1?.state);
    setValue("clientFirstAddress1", clientData?.Address1?.address1);
    setValue("clientFirstAddress2", clientData?.Address1?.address2);
    setValue("mailing_contact", clientData?.Address1?.mailing_contact);
    setValue("address1ID", clientData?.Address1?.currentId);
    setValue("clientSecondZip", clientData?.Address2?.zip);
    setValue("clientSecondCity", clientData?.Address2?.city);
    setValue("clientSecondState", clientData?.Address2?.state);
    setValue("clientSecondAddress1", clientData?.Address2?.address1);
    setValue("clientSecondAddress2", clientData?.Address2?.address2);
    setValue("second_mailing_contact", clientData?.Address2?.mailing_contact);
    setValue("address2ID", clientData?.Address2?.currentId);
    setValue("title", clientData?.identification?.title);
    setValue("birthday", clientData?.identification?.birthday);
    setValue("ssn", clientData?.identification?.ssn);
    setValue("gender", clientData?.identification?.gender);
    setValue("license", clientData?.identification?.license);
    setValue("state", clientData?.identification?.license_state);
    setValue("relation", clientData?.spouseInfo?.relationship);
    setValue("marraigeDate", clientData?.spouseInfo?.MarraigeDate.sp);
    setValue("DivorceDate", clientData?.spouseInfo?.DivorcedDate);
    setValue("divorced", clientData?.spouseInfo?.status);
    setValue("spouse_info_phone", clientData?.spouseInfo?.phone);
    setValue("spouse_info_email", clientData?.spouseInfo?.email);
    setValue("discussCase", clientData?.spouseInfo?.discuss);
    setValue("emergency_zip", clientData?.emergencyContact?.zip);
    setValue("emergency_city", clientData?.emergencyContact?.city);
    setValue("emrgency_first_name", clientData?.emergencyContact?.first_name);
    setValue("emrgency_last_name", clientData?.emergencyContact?.last_name);
    setValue("emergency_state", clientData?.emergencyContact?.state);
    setValue(
      "emergency_contact_address1",
      clientData?.emergencyContact?.address1
    );
    setValue(
      "emergency_contact_address2",
      clientData?.emergencyContact?.address2
    );
    setValue("emergency_relation", clientData?.emergencyInfo?.relation);
    setValue("emergency_info_phone", clientData?.emergencyInfo?.phone);
    setValue("emergency_info_email", clientData?.emergencyInfo?.email);
    setValue("emergency_discussCase", clientData?.emergencyInfo?.discuss);
    setValue("firstName", clientData?.spouseContact?.first_name);
    setValue("lastName", clientData?.spouseContact?.last_name);
    setValue("spouse_contact_address1", clientData?.spouseContact?.address1);
    setValue("spouse_contact_address2", clientData?.spouseContact?.address2);
    setValue("spouse_city", clientData?.spouseContact?.city);
    setValue("spouse_state", clientData?.spouseContact?.state);
    setValue("spouse_zip", clientData?.spouseContact?.zip);
    setContact_1_id(clientData?.phone_numbers[0]?.currentId);
    setContact_2_id(clientData?.phone_numbers[1]?.currentId);
    setContact_3_id(clientData?.phone_numbers[2]?.currentId);
    setEmail_1_id(clientData?.Emails[0]?.currentId);
    setEmail_2_id(clientData?.Emails[1]?.currentId);
    setEmail_3_id(clientData?.Emails[2]?.currentId);
    setMaritalStatus(clientData?.spouseInfo?.relationship);
    setGender(clientData?.identification?.gender);
    setEmergencyDiscuss(clientData?.emergencyInfo?.discuss);
    setDiscussCase(clientData?.spouseInfo?.discuss);
    setBirthdate(clientData?.identification?.birthday?.split("T")[0]);
    setMarraigeDate(clientData.spouseInfo.MarraigeDate?.split("T")[0]);
    setDivorceDate(clientData.spouseInfo.DivorcedDate?.split("T")[0]);

    if (
      clientData?.Emails[0]?.currentId === clientData?.primaryEmail?.primary_id
    ) {
      setEmailCheckedBox(1);
      setValue("email1Prim", true);
    }
    if (
      clientData?.Emails[1]?.currentId === clientData?.primaryEmail?.primary_id
    ) {
      setEmailCheckedBox(2);
      setValue("email2Prim", true);
    }
    if (
      clientData?.Emails[2]?.currentId === clientData?.primaryEmail?.primary_id
    ) {
      setEmailCheckedBox(3);
      setValue("email3Prim", true);
    }

    if (
      clientData?.phone_numbers[0]?.currentId ===
      clientData?.primaryPhone?.primary_id
    ) {
      setCheckedBox(1);
      setValue("phone1Prim", true);
    }
    if (
      clientData?.phone_numbers[1]?.currentId ===
      clientData?.primaryPhone?.primary_id
    ) {
      setCheckedBox(2);
      setValue("phone2Prim", true);
    }
    if (
      clientData?.phone_numbers[2]?.currentId ===
      clientData?.primaryPhone?.primary_id
    ) {
      setCheckedBox(3);
      setValue("phone3Prim", true);
    }

    if (clientData?.identification?.ssn) {
      const initialSSN = clientData.identification.ssn;
      setDisplayedSSN(formatSSN(initialSSN));
      setSSN(initialSSN);
    }
    if (
      clientData?.Address1?.currentId === clientData?.mailingContact?.primary_id
    ) {
      setIsChecked(true);
      setValue("mailing_contact", true);
    } else {
      setIsChecked(false);
      setValue("mailing_contact", false);
    }

    if (
      clientData?.Address2?.currentId === clientData?.mailingContact?.primary_id
    ) {
      setIsSecondMailCheckTrue(true);
      setValue("second_mailing_contact", true);
    } else {
      setIsSecondMailCheckTrue(false);
      setValue("second_mailing_contact", false);
    }
  }, [
    // clientData?.phone_numbers[0],
    // clientData?.phone_numbers[1],
    // clientData?.phone_numbers[2],
    // clientData?.first_name,
    // clientData?.middle_name,
    // clientData?.last_name,
    // clientData?.Emails[0],
    // clientData?.Emails[1],
    // clientData?.Emails[2],
    // clientData?.Address1?.zip,
    // clientData?.Address1?.city,
    // clientData?.Address1?.state,
    // clientData?.Address1?.address1,
    // clientData?.Address1?.address2,
    // clientData?.Address1?.mailing_contact,
    // clientData?.Address1?.currentId,
    // clientData?.Address2?.zip,
    // clientData?.Address2?.city,
    // clientData?.Address2?.state,
    // clientData?.Address2?.address1,
    // clientData?.Address2?.address2,
    // clientData?.Address2?.mailing_contact,
    // clientData?.Address2?.currentId,
    // clientData?.identification?.license_state,
    // clientData?.identification?.license,
    // clientData?.identification?.gender,
    // clientData?.identification?.ssn,
    // clientData?.identification?.birthday,
    clientData,
  ]);

  const titles = [
    {
      key: 1,
      title: "Mr.",
    },
    {
      key: 2,
      title: "Mrs.",
    },
    {
      key: 3,
      title: "Ms.",
    },
    {
      key: 4,
      title: "Miss.",
    },
  ];

  const genders = [
    {
      key: 1,
      title: "Male",
    },
    {
      key: 2,
      title: "Female",
    },
  ];

  const relations = [
    {
      key: 1,
      relation: "single",
    },
    {
      key: 2,
      relation: "married",
    },
    {
      key: 3,
      relation: "divorced",
    },
    {
      key: 4,
      relation: "widowed",
    },
    {
      key: 5,
      relation: "separated",
    },
  ];

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthdate(selectedDate);
    setValue("birthday", selectedDate);
    setValue("bod", selectedDate);
  };

  const handleMarraigeDateChange = (e) => {
    const selectedDate = e.target.value;
    setMarraigeDate(selectedDate);
    setValue("marraigeDate", selectedDate);
  };

  const handleDivorceDateChange = (e) => {
    const selectedDate = e.target.value;
    setDivorceDate(selectedDate);
    setValue("DivorceDate", selectedDate);
  };

  const handleCheckboxChangeMailing = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setValue("mailing_contact", checked);
  };

  const handleCheckboxChangeMailing2 = (e) => {
    const checked = e.target.checked;
    setIsSecondMailCheckTrue(checked);
    setValue("second_mailing_contact", checked);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setValue("title", newTitle); // Update form value for submission
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="client-modals-width-popup"
    >
      <div className="my-action-bar-edit-client-popup">
        <span
          className="page-icon-edit-client-popup"
          style={{ marginLeft: "5px" }}
        >
          <img
            className="translate-note-icon-edit-client-popup"
            style={{ width: "35px", height: "35px" }}
            src={ActionBarImg}
          />
        </span>
        <div className="text-wrapper-edit-client-popup text-nowrap text-white d-flex align-items-center p-l-5">
          <h2
            className="text-white mb-0"
            style={{ zIndex: "10", paddingLeft: "10px" }}
          >
            CLIENT
          </h2>
        </div>
        <div className="text-wrapper-edit-client-popup text-nowrap text-white d-flex align-items-center w-100 justify-content-center p-l-5">
          <h2
            className="text-white mb-0 text-font-weight-edit-popup d-flex align-items-center w-100 justify-content-center"
            style={{ zIndex: "10" }}
          >
            Edit Client Information
          </h2>
        </div>
      </div>
      <Modal.Body style={{ padding: "15px" }}>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmitHandler)}>
            {/* Client Name Area */}
            <Row className="mx-0 align-items-center form-group mb-0 ">
              <Col md={12} className="p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Name
                    </span>
                  </div>
                  <div
                    className="pl-0 pr-0 height-25"
                    style={{
                      flex: "0 0 100px",
                      maxWidth: "100px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("title")}
                      value={title}
                      onChange={handleTitleChange}
                      style={{
                        lineHeight: "1",
                        flex: "0 0 100px",
                        maxWidth: "100px",
                      }}
                      className={`form-control  height-25 ${errors.state && "is-invalid"}`}
                    >
                      <option value="" disabled>
                        Title
                      </option>
                      {titles?.map((titleOption) => (
                        <option key={titleOption.key} value={titleOption.title}>
                          {titleOption.title}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="height-25 "
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter First Name"
                      className="height-25"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                      {...register("first_name")}
                      defaultValue={clientData?.first_name}
                      onChange={(e) => setValue("first_name", e.target.value)}
                    />
                  </div>
                  <div
                    className="height-25 pl-0"
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter Middle Name"
                      className="height-25"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                      {...register("middle_name")}
                      defaultValue={clientData?.middle_name}
                      onChange={(e) => setValue("middle_name", e.target.value)}
                    />
                  </div>
                  <div
                    className="height-25 pl-0 pr-0"
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter Last Name"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                      className="height-25"
                      {...register("last_name")}
                      defaultValue={clientData?.last_name}
                      onChange={(e) => setValue("last_name", e.target.value)}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Phone Area */}
            <Row className="mx-0 align-items-center form-group mb-0">
              <Col md={12} className="p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Phone
                    </span>
                  </div>
                  <div
                    className=""
                    style={{
                      flex: "0 0 135px",
                      maxWidth: "135px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="(###) ###-####"
                      style={{ flex: "0 0 135px", maxWidth: "135px" }}
                      {...register("phone1")}
                      defaultValue={clientData?.phone_numbers[0]?.phone_number}
                      onInput={(e) => handlePhoneInput(e, "phone1", setValue)}
                      maxLength={14}
                      pattern="\(\d{3}\) \d{3}-\d{4}"
                      className="height-25"
                    />
                  </div>
                  <div className="text-left height-25 m-r-5">
                    <span className="d-inline-block text-grey text-nowrap height-25">
                      main
                    </span>
                  </div>
                  <div className="">
                    <Form.Check
                      type="checkbox"
                      {...register("phone1Prim")}
                      className="form-check"
                      style={{ transform: "scale(0.75)" }}
                      checked={checkedBox === 1}
                      onChange={() => handleCheckboxChange(1)}
                    />
                  </div>
                  <div
                    className="pl-0 m-l-5"
                    style={{
                      flex: "0 0 135px",
                      maxWidth: "135px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="(###) ###-####"
                      style={{ flex: "0 0 135px", maxWidth: "135px" }}
                      className="height-25"
                      {...register("phone2")}
                      defaultValue={clientData?.phone_numbers[1]?.phone_number}
                      onInput={(e) => handlePhoneInput(e, "phone2")}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                    />
                  </div>
                  <div className="text-left height-25 m-r-5">
                    <span className="d-inline-block text-grey text-nowrap height-25">
                      main
                    </span>
                  </div>
                  <div className="">
                    <Form.Check
                      type="checkbox"
                      {...register("phone2Prim")}
                      className="form-check"
                      style={{ transform: "scale(0.75)" }}
                      checked={checkedBox === 2}
                      onChange={() => handleCheckboxChange(2)}
                    />
                  </div>
                  <div
                    className="m-l-5"
                    style={{
                      flex: "0 0 135px",
                      maxWidth: "135px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="(###) ###-####"
                      className="height-25"
                      style={{ flex: "0 0 135px", maxWidth: "135px" }}
                      {...register("phone3")}
                      defaultValue={clientData?.phone_numbers[2]?.phone_number}
                      onInput={(e) => handlePhoneInput(e, "phone3")}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                    />
                  </div>
                  <div className="text-left height-25 m-r-5 ">
                    <span className="d-inline-block text-grey text-nowrap height-25">
                      main
                    </span>
                  </div>
                  <div className="">
                    <Form.Check
                      type="checkbox"
                      {...register("phone3Prim")}
                      className="form-check"
                      style={{ transform: "scale(0.75)" }}
                      checked={checkedBox === 3}
                      onChange={() => handleCheckboxChange(3)}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Email Area */}
            <Row className="mx-0 align-items-center form-group mb-0">
              <Col md={12} className="p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Email
                    </span>
                  </div>
                  <div
                    style={{
                      flex: "0 0 300px",
                      maxWidth: "300px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="Email 1"
                      className="height-25"
                      style={{ flex: "0 0 300px", maxWidth: "300px" }}
                      {...register("email1")}
                      defaultValue={clientData?.Emails[0]?.email}
                      onChange={(e) => setValue("email1", e.target.value)}
                    />
                  </div>
                  <div className="text-left height-25 m-r-5 ">
                    <span className="d-inline-block text-grey text-nowrap height-25">
                      main
                    </span>
                  </div>
                  <div className="">
                    <Form.Check
                      type="checkbox"
                      className="form-check"
                      style={{ transform: "scale(0.75)" }}
                      checked={emailCheckedBox === 1}
                      onChange={() => handleEmailCheckBoxChange(1)}
                    />
                  </div>
                  <div
                    className="pl-0 m-l-5"
                    style={{
                      flex: "0 0 300px",
                      maxWidth: "300px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="Email 2"
                      style={{ flex: "0 0 300px", maxWidth: "300px" }}
                      className="height-25"
                      {...register("email2")}
                      defaultValue={clientData?.Emails[1]?.email}
                      onChange={(e) => setValue("email2", e.target.value)}
                    />
                  </div>
                  <div className="text-left height-25 m-r-5 ">
                    <span className="d-inline-block text-grey text-nowrap height-25">
                      main
                    </span>
                  </div>
                  <div className="">
                    <Form.Check
                      type="checkbox"
                      className="form-check"
                      style={{ transform: "scale(0.75)" }}
                      checked={emailCheckedBox === 2}
                      onChange={() => handleEmailCheckBoxChange(2)}
                    />
                  </div>

                  <div
                    className="pl-0 m-l-5"
                    style={{
                      flex: "0 0 300px",
                      maxWidth: "300px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="email"
                      placeholder="Email 3"
                      style={{ flex: "0 0 300px", maxWidth: "300px" }}
                      className="height-25"
                      {...register("email3")}
                      defaultValue={clientData?.Emails[2]?.email}
                      onChange={(e) => setValue("email3", e.target.value)}
                    />
                  </div>
                  <div className="text-left height-25 m-r-5">
                    <span className="d-inline-block text-grey text-nowrap height-25">
                      main
                    </span>
                  </div>
                  <div className="">
                    <Form.Check
                      type="checkbox"
                      className="form-check"
                      style={{ transform: "scale(0.75)" }}
                      checked={emailCheckedBox === 3}
                      onChange={() => handleEmailCheckBoxChange(3)}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Address 1 Area */}
            <Row className="mx-0 align-items-center form-group mb-0">
              <Col md={12} className="p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Address
                    </span>
                  </div>
                  <div
                    className="height-25 pl-0 pr-0"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className="height-25"
                      {...register("clientFirstAddress1")}
                      defaultValue={clientData?.Address1?.address1}
                      onChange={(e) =>
                        setValue("clientFirstAddress1", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      placeholder="Enter Address Line 1"
                    ></Form.Control>
                  </div>
                  <div
                    className=" height-25 p-l-0 pr-0"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("clientFirstAddress2")}
                      className=" height-25"
                      defaultValue={clientData?.Address1?.address2}
                      onChange={(e) =>
                        setValue("clientFirstAddress2", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      placeholder="Enter Address Line 2"
                    ></Form.Control>
                  </div>
                  <div
                    className="height-25 p-l-0"
                    style={{
                      flex: "0 0 200px",
                      maxWidth: "200px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("clientFirstCity")}
                      defaultValue={clientData?.Address1?.city}
                      className=" height-25"
                      onChange={(e) =>
                        setValue("clientFirstCity", e.target.value)
                      }
                      style={{ flex: "0 0 200px", maxWidth: "200px" }}
                      placeholder="Enter City"
                    ></Form.Control>
                  </div>
                  <div
                    className="height-25 p-l-0"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("clientFirstState")}
                      value={
                        watch("clientFirstState") || clientData?.Address1?.state
                      }
                      onChange={(e) =>
                        setValue("clientFirstState", e.target.value)
                      }
                      style={{
                        flex: "0 0 220px",
                        maxWidth: "220px",
                        lineHeight: "1",
                      }}
                      className={`form-control ${errors.state && "is-invalid"}  height-25`}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="height-25 pl-0"
                    style={{
                      flex: "0 0 100px",
                      maxWidth: "100px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      style={{ flex: "0 0 100px", maxWidth: "100px" }}
                      {...register("clientFirstZip")}
                      defaultValue={clientData?.Address1?.zip}
                      onChange={(e) =>
                        setValue("clientFirstZip", e.target.value)
                      }
                      placeholder="Zip"
                    ></Form.Control>
                  </div>
                  <div
                    className="col-md-1 pl-0 d-flex align-items-center"
                    style={{ gap: "5px" }}
                  >
                    <div
                      className="text-left height-25"
                      // height-25 d-flex align-items-center justify-content-center
                      // style={{ background: "var(--primary-10)" }}
                    >
                      <span
                        className="d-inline-block text-grey text-nowrap"
                        // style={{ fontWeight: "600" }}
                      >
                        Mail
                      </span>
                    </div>
                    <div className="">
                      <Form.Check
                        type="checkbox"
                        className="form-check"
                        style={{ transform: "scale(0.75)" }}
                        defaultValue={clientData?.Address1?.mailing_contact}
                        checked={isChecked}
                        onChange={handleCheckboxChangeMailing}
                        // checked={}
                        // onChange={(e) =>
                        //   setValue("mailing_contact", e.target.checked)
                        // }
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Address 2 Area */}
            <Row className="mx-0 align-items-center form-group mb-0">
              <Col md={12} className="p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Address 2
                    </span>
                  </div>
                  <div
                    className="height-25 pl-0 pr-0"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("clientSecondAddress1")}
                      defaultValue={clientData?.Address2?.address1}
                      className=" height-25"
                      onChange={(e) =>
                        setValue("clientSecondAddress1", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      placeholder="Enter Address Line 1"
                    ></Form.Control>
                  </div>
                  <div
                    className="height-25 pl-0 pr-0"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("clientSecondAddress2")}
                      defaultValue={clientData?.Address2?.address2}
                      className=" height-25"
                      onChange={(e) =>
                        setValue("clientSecondAddress2", e.target.value)
                      }
                      placeholder="Enter Address Line 2"
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                    ></Form.Control>
                  </div>
                  <div
                    className=" height-25 pl-0 "
                    style={{
                      flex: "0 0 200px",
                      maxWidth: "200px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("clientSecondCity")}
                      defaultValue={clientData?.Address2?.city}
                      onChange={(e) =>
                        setValue("clientSecondCity", e.target.value)
                      }
                      placeholder="Enter City"
                      style={{ flex: "0 0 200px", maxWidth: "200px" }}
                      className=" height-25"
                    ></Form.Control>
                  </div>
                  <div
                    className="height-25 pl-0"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("clientSecondState")}
                      value={
                        watch("clientSecondState") ||
                        clientData?.Address2?.state
                      }
                      onChange={(e) =>
                        setValue("clientSecondState", e.target.value)
                      }
                      style={{
                        flex: "0 0 220px",
                        maxWidth: "220px",
                        lineHeight: "1",
                      }}
                      className={`form-control  height-25 ${errors.state && "is-invalid"}`}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="height-25 pl-0"
                    style={{
                      flex: "0 0 100px",
                      maxWidth: "100px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("clientSecondZip")}
                      defaultValue={clientData?.Address2?.zip}
                      style={{ flex: "0 0 100px", maxWidth: "100px" }}
                      onChange={(e) =>
                        setValue("clientSecondZip", e.target.value)
                      }
                      className=" height-25"
                      placeholder="Zip"
                    ></Form.Control>
                  </div>
                  <div
                    className="col-md-1 pl-0 d-flex align-items-center"
                    style={{ gap: "5px" }}
                  >
                    <div
                      className=" text-left height-25 "
                      // height-25 d-flex align-items-center justify-content-center
                      // style={{ background: "var(--primary-10)" }}
                    >
                      <span
                        className="d-inline-block text-grey text-nowrap"
                        // style={{ fontWeight: "600" }}
                      >
                        Mail
                      </span>
                    </div>
                    <div className="">
                      <Form.Check
                        type="checkbox"
                        className="form-check"
                        style={{ transform: "scale(0.75)" }}
                        defaultValue={clientData?.Address2?.mailing_contact}
                        // onChange={(e) =>
                        //   setValue("second_mailing_contact", e.target.checked)
                        // }
                        checked={isSecondMailCheckTrue}
                        onChange={handleCheckboxChangeMailing2}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Identification Area */}
            <Row className="mx-0 align-items-center form-group mb-0">
              <Col md={12} className="p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Identification
                    </span>
                  </div>

                  <div
                    className="pl-0 p-r-0 text-left height-25 "
                    // height-25 d-flex align-items-center justify-content-center
                    style={{ marginRight: "15px" }}
                  >
                    <span
                      className="d-inline-block text-grey text-nowrap height-25"
                      // style={{ fontWeight: "600" }}
                    >
                      Date of Birth
                    </span>
                  </div>
                  <div
                    className="pr-0 pl-0 height-25"
                    style={{
                      flex: "160px",
                      maxWidth: "160px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="date"
                      placeholder="Enter Birthday"
                      className=" height-25"
                      style={{
                        flex: "160px",
                        maxWidth: "160px",
                      }}
                      {...register("birthday")}
                      value={birthdate}
                      onChange={(e) => handleDateChange(e)}
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 p-r-0  height-25"
                    style={{
                      flex: "135px",
                      maxWidth: "135px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("ssn", {
                        pattern: /^\d{3}-\d{2}-\d{4}$/, // Pattern for validation
                      })}
                      style={{
                        flex: "135px",
                        maxWidth: "135px",
                      }}
                      // defaultValue={clientData?.identification?.ssn}
                      // onChange={(e) => setValue("ssn", e.target.value)}
                      value={displayedSSN} // Display the formatted SSN
                      onChange={handleSSNChange}
                      maxLength="11"
                      placeholder="SSN"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 p-r-0  height-25"
                    style={{
                      flex: "220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("license")}
                      defaultValue={clientData?.identification?.license}
                      onChange={(e) => setValue("license", e.target.value)}
                      placeholder="Driver License #"
                      style={{
                        flex: "220px",
                        maxWidth: "220px",
                      }}
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0  height-25"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("state")}
                      value={
                        watch("state") ||
                        clientData?.identification?.license_state
                      }
                      style={{
                        flex: "0 0 220px",
                        maxWidth: "220px",
                        lineHeight: "1",
                      }}
                      onChange={(e) => setValue("state", e.target.value)}
                      className={`form-control  height-25 ${errors.state && "is-invalid"}`}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="pl-0  height-25"
                    style={{
                      flex: "0 0 100px",
                      maxWidth: "100px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("gender")}
                      value={
                        watch("gender") ||
                        clientData?.identification?.gender ||
                        gender
                      }
                      style={{
                        flex: "0 0 100px",
                        maxWidth: "100px",
                        lineHeight: "1",
                      }}
                      onChange={(e) => {
                        setGender(e.target.value);
                        setValue("gender", e.target.value);
                      }}
                      className={`form-control  height-25 ${errors.state && "is-invalid"}`}
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      {genders?.map((gender) => (
                        <option key={gender.key} value={gender.title}>
                          {gender.title}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  {/* <div
                    className="pl-0 p-r-0  height-25"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      lineHeight: "1",
                    }}                  >
                    <Form.Control
                      type="text"
                      {...register("gender")}
                      defaultValue={clientData?.identification?.gender}
                      onChange={(e) => setValue("gender", e.target.value)}
                      placeholder="Gender"
                      className=" height-25"
                    ></Form.Control>
                  </div> */}
                </div>
              </Col>
            </Row>

            {/* Client Spouse Contact Area */}
            <Row className="mx-0 align-items-center form-group flex-wrap mb-0">
              <Col md={12} className="form-wrap p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Spouse Contact
                    </span>
                  </div>
                  <div
                    className="height-25"
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("firstName")}
                      placeholder="First Name"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                      className=" height-25"
                      defaultValue={clientData?.spouseContact?.first_name}
                      onChange={(e) => setValue("firstName", e.target.value)}
                    ></Form.Control>
                  </div>
                  <div
                    className="p-l-0 height-25"
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("lastName")}
                      defaultValue={clientData?.spouseContact?.last_name}
                      onChange={(e) => setValue("lastName", e.target.value)}
                      placeholder="Last Name"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 135px",
                      maxWidth: "135px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="tel"
                      {...register("spouse_info_phone")}
                      className=" height-25"
                      style={{ flex: "0 0 135px", maxWidth: "135px" }}
                      defaultValue={clientData?.spouseInfo?.phone}
                      onChange={(e) => handlePhoneInput(e, "spouse_info_phone")}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                      placeholder="(###) ###-####"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 300px",
                      maxWidth: "300px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="email"
                      className=" height-25"
                      style={{ flex: "0 0 300px", maxWidth: "300px" }}
                      {...register("spouse_info_email")}
                      defaultValue={clientData?.spouseInfo?.email}
                      onChange={(e) =>
                        setValue("spouse_info_email", e.target.value)
                      }
                      placeholder="Email"
                    ></Form.Control>
                  </div>
                </div>
              </Col>
            </Row>

            {/* ClientSpouse Address */}
            <Row className="mx-0 align-items-center form-group flex-wrap mb-0">
              <Col md={12} className="form-wrap p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Spouse Address
                    </span>
                  </div>
                  <div
                    className="p-r-0 pl-0  height-25"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("spouse_contact_address1")}
                      defaultValue={clientData?.spouseContact?.address1}
                      onChange={(e) =>
                        setValue("spouse_contact_address1", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      className=" height-25"
                      placeholder="Spouse Address Line 1"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 p-r-0 height-25"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("spouse_contact_address2")}
                      defaultValue={clientData?.spouseContact?.address2}
                      onChange={(e) =>
                        setValue("spouse_contact_address2", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      placeholder="Spouse Address Line 2"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 200px",
                      maxWidth: "200px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("spouse_city")}
                      defaultValue={clientData?.spouseContact?.city}
                      onChange={(e) => setValue("spouse_city", e.target.value)}
                      placeholder="City"
                      style={{ flex: "0 0 200px", maxWidth: "200px" }}
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("spouse_state")}
                      value={
                        watch("spouse_state") ||
                        clientData?.spouseContact?.state
                      }
                      style={{
                        flex: "0 0 220px",
                        maxWidth: "220px",
                        lineHeight: "1",
                      }}
                      onChange={(e) => setValue("spouse_state", e.target.value)}
                      className={`form-control  height-25 ${errors.state && "is-invalid"}`}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 100px",
                      maxWidth: "100px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("spouse_zip")}
                      className=" height-25"
                      style={{ flex: "0 0 100px", maxWidth: "100px" }}
                      defaultValue={clientData?.spouseContact?.zip}
                      onChange={(e) => setValue("spouse_zip", e.target.value)}
                      placeholder="Zip"
                    ></Form.Control>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Spouse Info */}
            <Row className="mx-0 align-items-center form-group flex-wrap mb-0">
              <Col md={12} className="form-wrap p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Client Spouse Information
                    </span>
                  </div>

                  <div
                    className="height-25"
                    style={{
                      flex: "0 0 135px",
                      maxWidth: "135px",
                      marginRight: "15px",
                    }}
                  >
                    {/* <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("relation")}
                      defaultValue={clientData?.spouseInfo?.relationship}
                      onChange={(e) => setValue("relation", e.target.value)}
                      placeholder="Marital Status"
                    ></Form.Control> */}
                    <Form.Select
                      {...register("relation")}
                      placeholder="marital status"
                      defaultValue={marital_status}
                      className="height-25"
                      style={{
                        lineHeight: "1",
                        flex: "0 0 135px",
                        maxWidth: "135px",
                      }}
                      onChange={(e) => {
                        setMaritalStatus(e.target.value);
                        setValue("relation", e.target.value);
                      }}
                    >
                      <option key="" value="">
                        Marital Status
                      </option>
                      {relations?.map((relation) => (
                        <option key={relation.key} value={relation.relation}>
                          {relation.relation}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="text-left height-25"
                    style={{ marginRight: "5px" }}
                  >
                    <span className="d-inline-block text-grey text-nowrap">
                      Discuss
                    </span>
                  </div>
                  <div className="d-flex align-items-center height-25">
                    <Form.Check
                      type="checkbox"
                      {...register("discussCase")}
                      className="form-check  d-flex align-items-center justify-content-center"
                      style={{ transform: "scale(0.75)" }}
                      checked={discussCase}
                      onChange={(e) => {
                        setDiscussCase(e.target.checked);
                        setValue("discussCase", e.target.checked);
                      }}
                    />
                  </div>
                  <div
                    className="text-left height-25"
                    style={{ marginRight: "15px", marginLeft: "10px" }}
                  >
                    <span
                      className="d-inline-block text-grey text-nowrap height-25"
                      // style={{ fontWeight: "600" }}
                    >
                      Married
                    </span>
                  </div>
                  <div
                    className="pl-0 p-r-0  height-25"
                    style={{
                      flex: "0 0 160px",
                      maxWidth: "160px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="date"
                      placeholder="Marriage Date"
                      className=" height-25"
                      style={{
                        flex: "0 0 160px",
                        maxWidth: "160px",
                      }}
                      {...register("marraigeDate")}
                      value={marraigeDate || ""}
                      onChange={(e) => handleMarraigeDateChange(e)}
                    />
                  </div>
                  <div
                    className="text-left height-25 "
                    style={{ marginRight: "15px" }}
                  >
                    <span
                      className="d-inline-block text-grey text-nowrap height-25"
                      // style={{ fontWeight: "600" }}
                    >
                      Divorced
                    </span>
                  </div>
                  <div
                    className="p-l-0 p-r-0 height-25"
                    style={{
                      flex: "0 0 160px",
                      maxWidth: "160px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="date"
                      placeholder="Divorce Date"
                      className=" height-25"
                      {...register("DivorceDate")}
                      style={{
                        flex: "0 0 160px",
                        maxWidth: "160px",
                      }}
                      value={divorceDate || ""}
                      onChange={(e) => handleDivorceDateChange(e)}
                    ></Form.Control>
                  </div>
                  {/* <div
                    className="text-left height-25 "
                    
                  >
                    <span
                      className="d-inline-block text-grey text-nowrap"
                      
                    >
                      Divorced
                    </span>
                  </div>
                  <div className="height-25 d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      {...register("divorced")}
                      className="form-check d-flex align-items-center justify-content-center"
                      style={{ transform: "scale(0.75)" }}
                      defaultValue={clientData?.spouseInfo?.status}
                      onChange={(e) => setValue("divorced", e.target.checked)}
                    ></Form.Check>
                  </div> */}
                  {/* <div className="col-md-2">
                    <Form.Control
                      type="tel"
                      {...register("spouse_info_phone")}
                      defaultValue={clientData?.spouseInfo?.phone}
                      onChange={(e) => handlePhoneInput(e, "spouse_info_phone")}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                      placeholder="(###) ###-####"
                    ></Form.Control>
                  </div> */}
                </div>
              </Col>
            </Row>
            {/* <Row className="mx-0 align-items-center form-group flex-wrap">
              <Col md={12} className="form-wrap">
                <div className="d-flex align-items-center form-group">
                  <div className="col-md-2">
                    <Form.Control
                      type="email"
                      {...register("spouse_info_email")}
                      defaultValue={clientData?.spouseInfo?.email}
                      onChange={(e) =>
                        setValue("spouse_info_email", e.target.value)
                      }
                      placeholder="Email"
                    ></Form.Control>
                  </div>
                </div>
              </Col>
            </Row> */}

            {/* Client Emrgencyt Contact */}
            <Row className="mx-0 align-items-center form-group flex-wrap mb-0">
              <Col md={12} className="form-wrap p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Emergency Contact
                    </span>
                  </div>
                  <div
                    className="height-25"
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                      {...register("emrgency_first_name")}
                      placeholder="First Name"
                      defaultValue={clientData?.emergencyContact?.first_name}
                      onChange={(e) =>
                        setValue("emrgency_first_name", e.target.value)
                      }
                    ></Form.Control>
                  </div>
                  <div
                    className="p-l-0 height-25"
                    style={{
                      flex: "0 0 240px",
                      maxWidth: "240px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      style={{ flex: "0 0 240px", maxWidth: "240px" }}
                      {...register("emrgency_last_name")}
                      defaultValue={clientData?.emergencyContact?.last_name}
                      onChange={(e) =>
                        setValue("emrgency_last_name", e.target.value)
                      }
                      placeholder="Last Name"
                    ></Form.Control>
                  </div>
                </div>
              </Col>
            </Row>
            {/* Emrgency Address */}
            <Row className="mx-0 align-items-center form-group flex-wrap mb-0">
              <Col md={12} className="form-wrap p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Emergency Address
                    </span>
                  </div>
                  <div
                    className="p-r-0 pl-0  height-25"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("emergency_contact_address1")}
                      defaultValue={clientData?.emergencyContact?.address1}
                      onChange={(e) =>
                        setValue("emergency_contact_address1", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      placeholder="Emergency Address Line 1"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 p-r-0  height-25"
                    style={{
                      flex: "0 0 230px",
                      maxWidth: "230px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("emergency_contact_address2")}
                      defaultValue={clientData?.emergencyContact?.address2}
                      onChange={(e) =>
                        setValue("emergency_contact_address2", e.target.value)
                      }
                      style={{
                        flex: "0 0 230px",
                        maxWidth: "230px",
                      }}
                      placeholder="Emergency Address Line 2"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25 "
                    style={{
                      flex: "0 0 200px",
                      maxWidth: "200px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      className=" height-25"
                      {...register("emergency_city")}
                      defaultValue={clientData?.emergencyContact?.city}
                      onChange={(e) =>
                        setValue("emergency_city", e.target.value)
                      }
                      style={{ flex: "0 0 200px", maxWidth: "200px" }}
                      placeholder="City"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Select
                      {...register("emergency_state")}
                      value={
                        watch("emergency_state") ||
                        clientData?.emergencyContact?.state
                      }
                      onChange={(e) =>
                        setValue("emergency_state", e.target.value)
                      }
                      style={{
                        flex: "0 0 220px",
                        maxWidth: "220px",
                        lineHeight: "1",
                      }}
                      className={`form-control  height-25 ${errors.state && "is-invalid"}`}
                    >
                      <option value="" disabled>
                        Select State
                      </option>
                      {states?.map((state) => (
                        <option key={state.id} value={state.StateAbr}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{
                      flex: "0 0 100px",
                      maxWidth: "100px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("emergency_zip")}
                      style={{ flex: "0 0 100px", maxWidth: "100px" }}
                      defaultValue={clientData?.emergencyContact?.zip}
                      onChange={(e) =>
                        setValue("emergency_zip", e.target.value)
                      }
                      className=" height-25"
                      placeholder="Zip"
                    ></Form.Control>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Client Emergency info Info */}
            <Row className="mx-0 align-items-center form-group flex-wrap mb-0">
              <Col md={12} className="form-wrap p-0">
                <div className="d-flex align-items-center form-group m-b-5">
                  <div
                    className="text-left height-25 d-flex align-items-center justify-content-center m-r-5"
                    style={{ background: "var(--primary-10)", width: "255px" }}
                  >
                    <span
                      className="d-inline-block text-primary text-uppercase"
                      style={{ fontWeight: "600" }}
                    >
                      Emergency Information
                    </span>
                  </div>

                  <div
                    className="pl-0 pr-0 height-25"
                    style={{
                      flex: "0 0 220px",
                      maxWidth: "220px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      {...register("emergency_relation")}
                      className=" height-25"
                      defaultValue={clientData?.emergencyInfo?.relation}
                      onChange={(e) =>
                        setValue("emergency_relation", e.target.value)
                      }
                      style={{
                        flex: "0 0 220px",
                        maxWidth: "220px",
                        marginRight: "15px",
                      }}
                      placeholder="Relationship"
                    ></Form.Control>
                  </div>
                  <div
                    className="text-left height-25 "
                    style={{ marginRight: "5px" }}
                    // height-25 d-flex align-items-center justify-content-center
                    // style={{ background: "var(--primary-10)" }}
                  >
                    <span
                      className="d-inline-block text-grey text-nowrap"
                      // style={{ fontWeight: "600" }}
                    >
                      Discuss
                    </span>
                  </div>
                  <div className="d-flex align-items-center height-25">
                    <Form.Check
                      type="checkbox"
                      {...register("emergency_discussCase")}
                      className="form-check  height-25 d-flex align-items-center justify-content-center"
                      style={{ transform: "scale(0.75)" }}
                      checked={emergencyDiscuss}
                      onChange={(e) => {
                        setEmergencyDiscuss(e.target.checked);
                        setValue("emergency_discussCase", e.target.checked);
                      }}
                    />
                  </div>
                  <div
                    className="pl-0  height-25"
                    style={{
                      flex: "0 0 135px",
                      maxWidth: "135px",
                      marginLeft: "10px",
                      marginRight: "15px",
                    }}
                  >
                    <Form.Control
                      type="tel"
                      {...register("emergency_info_phone")}
                      defaultValue={clientData?.emergencyInfo?.phone}
                      className=" height-25"
                      onChange={(e) =>
                        handlePhoneInput(e, "emergency_info_phone")
                      }
                      style={{ flex: "0 0 135px", maxWidth: "135px" }}
                      maxLength={14} // Allows for the formatted string with symbols
                      pattern="\(\d{3}\) \d{3}-\d{4}" // Regex pattern for (123) 456-7890 format
                      placeholder="(###) ###-####"
                    ></Form.Control>
                  </div>
                  <div
                    className="pl-0 height-25"
                    style={{ flex: "0 0 300px", maxWidth: "300px" }}
                  >
                    <Form.Control
                      type="email"
                      {...register("emergency_info_email")}
                      className=" height-25"
                      defaultValue={clientData?.emergencyInfo?.email}
                      onChange={(e) =>
                        setValue("emergency_info_email", e.target.value)
                      }
                      style={{ flex: "0 0 300px", maxWidth: "300px" }}
                      placeholder="Email"
                    ></Form.Control>
                  </div>
                </div>
              </Col>
            </Row>

            <Modal.Footer className="modal-footer p-0 border-0 justify-content-between pt-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
              <button type="submit" className="btn btn-success">
                {loading ? "Saving..." : "Save & Close"}
              </button>
            </Modal.Footer>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default ClientEditModal;
