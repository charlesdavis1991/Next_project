import React, { useState } from "react";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import { useDispatch } from "react-redux";
import Footer from "../Components/common/footer";

export const WitnessesPage = () => {
  // Redux
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCheckboxClick = (checklist, witnessId, clientId, caseId) => {
    if (!checklist.status) {
      window.location.href = `/bp-markPanelChecklist/${checklist.id}/${witnessId}/${clientId}/${caseId}/Witness/`;
    } else {
      window.location.href = `/bp-uncheckPanelChecklist/${checklist.panel_case_checklist}`;
    }
  };

  const witness = {
    witness_contact_home: {
      email: "", // Replace with an actual email or an empty string for the else condition
    },
  };
  const witness2 = {
    id: "12345", // Replace with the actual ID for your use case
  };

  const templatePopUp = (
    param1,
    param2,
    witnessId,
    param4,
    param5,
    param6,
    param7,
    param8
  ) => {
    console.log(`Called templatePopUp with witnessId: ${witnessId}`);
    // Implement the actual functionality here
  };

  const witness3 = {
    witness_contact_last: {
      email: "example@example.com", // Replace with an actual email or an empty string for the else condition
    },
  };
  const witness4 = {
    id: "123", // Dummy witness ID
    model_name: "witness", // Dummy model name
  };

  const notes = [
    {
      category: { name: "Witnesses" },
      entity_type: "Witness", // Dummy entity type
      record_id: "123", // Dummy record ID
      created_at: "2024-05-23", // Dummy created date
      created_by_v1: {
        profile_pic: { url: "https://example.com/profile_pic.jpg" },
      }, // Dummy profile pic URL
      created_by: { first_name: "John", last_name: "Doe" }, // Dummy creator info
      description: "This is a witness note.", // Dummy note description
    },
    // Add more dummy notes as needed
  ];

  const note_counter = 1; // Dummy note counter

  const show_notes = () => {
    // Dummy function for showing notes
    console.log("Showing notes...");
  };

  const witness0 = {
    id: "987", // Dummy witness ID
    witness_for_entity: "John Doe", // Dummy entity name
    witness_for_record_id: "789", // Dummy record ID
  };

  const select_witness = (element, form) => {
    // Dummy function for selecting witness
    console.log(
      `Selected witness: ${element.getAttribute("data-id")}, Form: ${form}`
    );
  };

  const witness11 = {
    id: "987", // Dummy witness ID
    witness_first_name: "John", // Dummy witness first name
    witness_last_name: "Doe", // Dummy witness last name
    witness_contact_home: {
      address1: "123 Main St", // Dummy address line 1
      address2: "Apt 101", // Dummy address line 2
      city: "Anytown", // Dummy city
      state: "CA", // Dummy state
      zip: "12345", // Dummy zip code
      phone_number: "5551234567", // Dummy phone number
      fax: "5559876543", // Dummy fax number
      email: "john.doe@example.com", // Dummy email
    },
  };

  const editHomeContact = (element) => {
    // Dummy function for editing home contact
    console.log("Editing home contact:", element);
  };

  const witness12 = {
    id: "123", // Dummy witness ID
    witness_employer: "ABC Company", // Dummy employer name
    witness_contact_last: {
      address1: "456 Business St", // Dummy address line 1
      address2: "Suite 200", // Dummy address line 2
      city: "Metropolis", // Dummy city
      state: "NY", // Dummy state
      zip: "10001", // Dummy zip code
      phone_number: "5559876543", // Dummy phone number
      fax: "5551234567", // Dummy fax number
      email: "john.doe@example.com", // Dummy email
    },
  };

  const editWorkContact = (element) => {
    // Dummy function for editing work contact
    console.log("Editing work contact:", element);
  };

  const processedPageSlots = [
    {
      doc: { id: 1, created: "2024-05-25", fileName: "Document 1.pdf" },
      pageSlotId: 1,
      witnessId: 1,
      pageSlotNumber: 1,
      pageSlotName: "Slot 1",
    },
    {
      doc: null,
      pageSlotId: 2,
      witnessId: 1,
      pageSlotNumber: 2,
    },
    {
      doc: { id: 2, created: "2024-05-26", fileName: "Document 2.pdf" },
      pageSlotId: 3,
      witnessId: 1,
      pageSlotNumber: 3,
      pageSlotName: "Slot 3",
    },
  ];

  const pageData = { id: 1 };

  const witnessData = {
    id: 1,
  };

  const insuranceChecklistPanelPercentage = {
    1: 30,
    2: 45,
    3: 20,
  };

  const insuranceFinalChecklist = [
    { id: 1, name: "Checklist Item 1", status: true },
    { id: 2, name: "Checklist Item 2", status: false },
    { id: 3, name: "Checklist Item 3", status: true },
  ];

  const clientProviderId = 1;
  const clientId = 1;
  const caseId = 1;

  const insurance = {
    id: 1,
    insurance_type: {
      id: 1,
      name: "Health Insurance",
    },
    supervisor: {
      name: "John Doe",
      first_name: "John",
      last_name: "Doe",
      address1: "123 Main St",
      address2: "Apt 101",
      city: "Springfield",
      state: "IL",
      zip: "12345",
      phone_number: "5551234567",
      fax: "5559876543",
      email: "john.doe@example.com",
    },
    company_contact: {
      name: "ABC Insurance Company",
      first_name: "John",
      last_name: "Doe",
      address1: "123 Main St",
      address2: "Apt 101",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      phone_number: "5551234567",
      fax: "5557654321",
      email: "john.doe@example.com",
    },
  };

  const insurance2 = {
    id: 1,
    adjuster: {
      name: "John Doe",
      first_name: "John",
      last_name: "Doe",
      address1: "123 Main St",
      address2: "Apt 101",
      city: "Springfield",
      state: "IL",
      zip: "12345",
      phone_number: "5551234567",
      fax: "5559876543",
      email: "john.doe@example.com",
    },
  };

  const defendant = {
    id: 1,
  };

  const handleClick = () => {
    // Handle click logic
  };

  const insuranceData = {
    id: 1,
    supervisor: {
      name: "John Doe",
      first_name: "John",
      last_name: "Doe",
      address1: "123 Main St",
      address2: "Apt 101",
      city: "Springfield",
      state: "IL",
      zip: "12345",
      phone_number: "5551234567",
      fax: "5559876543",
      email: "john.doe@example.com",
    },
    insurance_type: {
      id: 1,
      name: "Car Insurance",
    },
    policy_number: "123456789",
    claim_number: "987654321",
    liabilityLimit: 10000,
    liabilityLimitAll: 50000,
    Dateconfirmedactive: "2024-05-20",
  };

  const insurance11 = {
    model_name: {
      title: "Car",
    },
    id: 123,
    insurance_type: {
      name: "Car Insurance",
    },
  };

  const notes11 = [
    {
      category: { name: "Insurance" },
      entity_type: "Car",
      record_id: 123,
      created_at: new Date(),
      created_by_v1: { profile_pic: { url: "profile_pic_url" } },
      created_by: { first_name: "John", last_name: "Doe" },
      description: "This is a note about car insurance",
    },
    {
      category: { name: "Update Case Status" },
      entity_type: "Car",
      record_id: 123,
      created_at: new Date(),
      created_by_v1: { profile_pic: { url: "profile_pic_url" } },
      created_by: { first_name: "Jane", last_name: "Doe" },
      description: "Case status updated for car insurance",
    },
    {
      category: { name: "Critical" },
      entity_type: "Car",
      record_id: 123,
      created_at: new Date(),
      created_by_v1: { profile_pic: { url: "profile_pic_url" } },
      created_by: { first_name: "Alex", last_name: "Smith" },
      description: "Critical update regarding car insurance",
    },
  ];

  const insuranceType = "Health Insurance";

  const insurancePageSlots = [
    {
      insuranceId: 1,
      doc: {
        id: 1,
        created: "2024-05-23",
        fileName: "Document1.pdf",
      },
      pageSlot: {
        id: 1,
        slotNumber: 1,
        slotName: "Policy Document",
        pageId: 1,
      },
    },
    {
      insuranceId: 1,
      doc: null,
      pageSlot: {
        id: 2,
        slotNumber: 2,
        slotName: "Claim Form",
        pageId: 1,
      },
    },
    // Add more data as needed
  ];

  // Define the functions
  function docPreview(docId, param) {
    // Implement the docPreview function
  }

  function uploadPopUp(slotId, insuranceId, pageId) {
    // Implement the uploadPopUp function
  }

  const checklistPanelPercentage = {
    1: 50,
    2: 75,
    // Add more data as needed
  };

  const page = {
    id: 1,
    name: "Health Insurance",
  };

  const finalChecklist = [
    { id: 1, name: "Checklist 1", status: true },
    { id: 2, name: "Checklist 2", status: false },
    // Add more data as needed
  ];

  const opposingCounsel = {
    id: 1,
    name: "Opposing Counsel Name",
    opposingCounselContact: {
      name: "Opposing Counsel Name",
      website: "www.opposingcounsel.com",
      address1: "123 Main St",
      address2: "Suite 100",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      phone_number: "1234567890",
      fax: "0987654321",
      email: "opposingcounsel@example.com",
      // Add more contact details as needed
    },
    forClient: {
      createdBy: {
        attorneyProfile: {
          user: {
            username: "Attorney Username",
            // Add more attorney profile details as needed
          },
        },
      },
    },
    fileNumber: "ABC123",
    // Add more opposing counsel details as needed
  };

  const opposingcounsel = {
    id: 1,
    opposingattorney: {
      name: "John Doe",
      address1: "123 Main St",
      address2: "Apt 2",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      phone_number: "5551234567",
      fax: "5559876543",
      email: "john.doe@example.com",
    },
    counsel_type: {
      id: 1,
      name: "Legal",
    },
    file_number: "ABC123",
  };

  const counselContactModal = (event) => {
    const { id, block, name, add1, add2, city, state, zip, phone, fax, email } =
      event.target.dataset;
    // Your modal logic here
  };

  const sampleData = {
    checklistPercentage: 75,
    clientProviderId: 1,
    pageName: "Witness",
    checklistItems: [
      { label: "example 1", checked: true },
      { label: "example 2", checked: true },
      { label: "example 3", checked: true },
      { label: "example 4", checked: true },
      { label: "example 5", checked: true },
      { label: "example 6", checked: true },
      { label: "example 7", checked: true },
      { label: "example 8", checked: true },
      { label: "example 9", checked: true },
      { label: "example 10", checked: true },
    ],
  };

  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <div className="top-panel-wrapper"></div>
        <NavBar flaggedPageName="Witness" />
        <div class="main-content p-t-180 ">
          {/* Navbar */}
          <div className="action-bar client-BarAlign main-action-bar has-checklist d-flex mb-5 ml-3">
            <span className="page-icon">
              <img
                className="translate-note-icon"
                src="https://simplefirm-bucket.s3.amazonaws.com/static/BP_resources/images/icon/witnesses-icon-color.svg"
                alt="Witnesses Icon"
              />
            </span>
            <div className="text-wrapper text-white d-flex align-items-center pl-3">
              <h2 className="text-white">Witnesses</h2>
            </div>
            <div className="checklist-section-wrapper">
              <div className="skew-box"></div>
              <div className="checklist-section">
                <div className="dropdown">
                  <button
                    className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                    id={`myDropdown${sampleData.clientProviderId}`}
                    type="button"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="nt-box" id="ntbox-margin-20">
                      <div
                        className="circlechart"
                        data-percentage={sampleData.checklistPercentage}
                      ></div>
                    </div>
                    <span className="d-flex align-items-center">
                      <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                        <svg
                          width="17"
                          height="50"
                          viewBox="0 0 17 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="checklist-text text-capitalize">
                        {sampleData.pageName} <br />
                        Page
                      </span>
                      <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                        <svg
                          width="17"
                          height="50"
                          viewBox="0 0 17 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                            fill="currentColor"
                          />
                          <path
                            d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>
                  <div
                    aria-labelledby={`myDropdown${sampleData.clientProviderId}`}
                    className="dropdown-menu dropdown-menu-right dropdown-content"
                  >
                    {sampleData.checklistItems.map((item, index) => (
                      <div className="checkbox-line" key={index}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          id={`examplecheck${index + 1}`}
                          name={`examplecheck${index + 1}`}
                        />
                        <label htmlFor={`examplecheck${index + 1}`}>
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-0 action-line-btn height-25"
              data-toggle="modal"
              data-target="#addcase"
            >
              <span className="font-weight-bold pr-2 text-gold">+</span>Witness
            </button>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="border-box has-checklist rounded-0 mr-15 m-t-5">
                <div class="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                  <div class="skew-box"></div>
                  <div class="checklist-section">
                    <div className="dropdown w-100">
                      <button
                        className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                        //   id={`myDropdown${clientProviderId}`}
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-expanded={dropdownOpen}
                      >
                        <div className="nt-box sub-gauge">
                          {/* {Object.entries(checklistPanelPercentage).map(
                ([key, value]) =>
                  key === witness.id && (
                    <div
                      className="circlechart"
                      data-percentage={value}
                      key={key}
                    ></div>
                  )
              )} */}
                        </div>
                        <span className="d-flex align-items-center">
                          <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <span className="checklist-text">
                            {/* {page.panel_name} */}
                            Witnesses Checklist
                          </span>
                          <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                            <svg
                              width="17"
                              height="50"
                              viewBox="0 0 17 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                                fill="currentColor"
                              />
                              <path
                                d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                        </span>
                      </button>

                      {dropdownOpen && (
                        <div
                          // aria-labelledby={`myDropdown${clientProviderId}`}
                          className="dropdown-menu dropdown-menu-right dropdown-content"
                          id="insurance-dropdown-width"
                        >
                          {/* {finalChecklist.map(
                        (checklist) =>
                          checklist.provider.id === witness.id && (
                            <div
                              className="checkbox-line"
                              key={checklist.id}
                            >
                              <input
                                type="checkbox"
                                id={`medicalcheck${checklist.id}`}
                                name={`medicalcheck${checklist.id}`}
                                checked={checklist.status}
                                onChange={() =>
                                  handleCheckboxClick(
                                    checklist,
                                    witness.id
                                  )
                                }
                              />
                              <label
                                htmlFor={`medicalcheck${checklist.id}`}
                              >
                                {checklist.name}
                              </label>
                            </div>
                          )
                      )} */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div class="row no-gutters has-title-bg m-b-5 flex-nowrap">
                  <div class="col-auto p-0">
                    <div class="panel-icon">
                      <i class="ic ic-witnesses ic-25"></i>
                    </div>
                    {/* Header2 */}
                    <div className="top-header height-25 d-flex">
                      <div className="top-head d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <h2 className="d-flex align-items-center">
                            <small className="font-weight-bold text-wrap-no-wrap-Wit">
                              Witness for {witness0.witness_for_entity} (
                              {witness0.witness_for_record_id})
                            </small>
                          </h2>
                          <div className="btn-wrapper">
                            <button
                              type="submit"
                              className="btn btn-primary rounded-0"
                              data-toggle="modal"
                              data-target="#addparty"
                              data-id={witness0.id}
                              onClick={() =>
                                select_witness(this, "addWitnessInsuranceForm")
                              }
                            >
                              <span className="font-weight-bold pr-2 text-gold">
                                +
                              </span>
                              Insurance
                            </button>

                            <button
                              type="submit"
                              className="btn btn-primary rounded-0"
                              data-toggle="modal"
                              data-target="#addlegalcounsel"
                              data-id={witness0.id}
                              onClick={() =>
                                select_witness(this, "addCounselForm")
                              }
                            >
                              <span className="font-weight-bold pr-2 text-gold">
                                +
                              </span>
                              Counsel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*  */}
                    <div class="row no-gutters equal-column-wrapper position-relative insurance-cols witness-col-pans">
                      <div class="d-flex">
                        <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div
                              data-toggle="modal"
                              data-target="#home-adress-modal"
                              data-witness-id={witness11.id}
                              data-witness-first_name={
                                witness11.witness_first_name
                              }
                              data-witness-last_name={
                                witness11.witness_last_name
                              }
                              data-witness-home_contact_address1={
                                witness11.witness_contact_home.address1
                              }
                              data-witness-home_contact_address2={
                                witness11.witness_contact_home.address2
                              }
                              data-witness-home_contact_city={
                                witness11.witness_contact_home.city
                              }
                              data-witness-home_contact_state={
                                witness11.witness_contact_home.state
                              }
                              data-witness-home_contact_zip={
                                witness11.witness_contact_home.zip
                              }
                              data-witness-home_contact_phone_number={
                                witness11.witness_contact_home.phone_number
                              }
                              data-witness-home_contact_fax={
                                witness11.witness_contact_home.fax
                              }
                              data-witness-home_contact_email={
                                witness11.witness_contact_home.email
                              }
                              onClick={() => editHomeContact(this)}
                            >
                              <div className="text-left p-l-5 p-r-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  Witness
                                </p>
                                <p className="columnsTitle">
                                  {witness11.witness_first_name}{" "}
                                  {witness11.witness_last_name}
                                </p>
                                <div>
                                  <p className="colFont m-0 font-weight-semibold info_address">
                                    {witness11.witness_contact_home.address1 ? (
                                      `${witness11.witness_contact_home.address1}, `
                                    ) : (
                                      <span className="text-primary-20">
                                        Address
                                      </span>
                                    )}
                                    {witness11.witness_contact_home.address2}
                                  </p>
                                  <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                    {witness11.witness_contact_home.city ? (
                                      `${witness11.witness_contact_home.city}, `
                                    ) : (
                                      <span className="text-primary-20">
                                        City
                                      </span>
                                    )}
                                    {witness11.witness_contact_home.state ? (
                                      `${witness11.witness_contact_home.state}, `
                                    ) : (
                                      <span className="text-primary-20">
                                        State
                                      </span>
                                    )}
                                    {witness11.witness_contact_home.zip || (
                                      <span className="text-primary-20">
                                        Zip
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="colFont info_phone_number text-black">
                                  {witness11.witness_contact_home
                                    .phone_number ? (
                                    `(${witness11.witness_contact_home.phone_number.slice(0, 3)}) ${witness11.witness_contact_home.phone_number.slice(3, 6)}-${witness11.witness_contact_home.phone_number.slice(6)}`
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                                <p className="colFont info_fax">
                                  {witness11.witness_contact_home.fax ? (
                                    `(${witness11.witness_contact_home.fax.slice(0, 3)}) ${witness11.witness_contact_home.fax.slice(3, 6)}-${witness11.witness_contact_home.fax.slice(6)} Fax`
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {witness11.witness_contact_home.email ? (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center m-b-5 p-l-6 p-r-6 mt-auto"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                {witness11.witness_contact_home.email}
                              </a>
                            ) : (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center m-b-5 p-l-6 p-r-6 mt-auto"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              </a>
                            )}
                          </div>
                          <div className="mt-auto">
                            <a
                              href="#"
                              onClick={() =>
                                templatePopUp(
                                  "",
                                  "",
                                  witness11.id,
                                  "",
                                  "",
                                  "",
                                  "",
                                  16
                                )
                              }
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                            >
                              <i className="ic ic-19 ic-generate-document m-r-5"></i>
                              Generate Document
                            </a>
                          </div>
                        </div>
                        {/*  */}
                        <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div
                              id="Div2"
                              data-toggle="modal"
                              data-target="#work-adress-modal"
                              data-witness-id={witness12.id}
                              data-witness-witness_employer={
                                witness12.witness_employer
                              }
                              data-witness-work_contact_address1={
                                witness12.witness_contact_last.address1
                              }
                              data-witness-work_contact_address2={
                                witness12.witness_contact_last.address2
                              }
                              data-witness-work_contact_city={
                                witness12.witness_contact_last.city
                              }
                              data-witness-work_contact_state={
                                witness12.witness_contact_last.state
                              }
                              data-witness-work_contact_zip={
                                witness12.witness_contact_last.zip
                              }
                              data-witness-work_contact_phone_number={
                                witness12.witness_contact_last.phone_number
                              }
                              data-witness-work_contact_fax={
                                witness12.witness_contact_last.fax
                              }
                              data-witness-work_contact_email={
                                witness12.witness_contact_last.email
                              }
                              onClick={() => editWorkContact(this)}
                            >
                              <div className="text-left p-l-5 p-r-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                  Witness
                                </p>
                                <p className="columnsTitle text-capitalize">
                                  <span className="text-grey">
                                    Employer: {witness12.witness_employer}
                                  </span>
                                </p>
                                <div>
                                  <p className="colFont m-0 font-weight-semibold info_address">
                                    {witness12.witness_contact_last.address1 ? (
                                      `${witness12.witness_contact_last.address1}, `
                                    ) : (
                                      <span className="text-primary-20">
                                        Address
                                      </span>
                                    )}
                                    {witness12.witness_contact_last.address2}
                                  </p>
                                  <p className="colFont m-0 font-weight-semibold info_city_state_zip">
                                    {witness12.witness_contact_last.city ? (
                                      `${witness12.witness_contact_last.city}, `
                                    ) : (
                                      <span className="text-primary-20">
                                        City
                                      </span>
                                    )}
                                    {witness12.witness_contact_last.state ? (
                                      `${witness12.witness_contact_last.state}, `
                                    ) : (
                                      <span className="text-primary-20">
                                        State
                                      </span>
                                    )}
                                    {witness12.witness_contact_last.zip || (
                                      <span className="text-primary-20">
                                        Zip
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="colFont info_phone_number text-black">
                                  {witness12.witness_contact_last
                                    .phone_number ? (
                                    `(${witness12.witness_contact_last.phone_number.slice(0, 3)}) ${witness12.witness_contact_last.phone_number.slice(3, 6)}-${witness12.witness_contact_last.phone_number.slice(6)}`
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                                <p className="colFont info_fax">
                                  {witness12.witness_contact_last.fax ? (
                                    `(${witness12.witness_contact_last.fax.slice(0, 3)}) ${witness12.witness_contact_last.fax.slice(3, 6)}-${witness12.witness_contact_last.fax.slice(6)} Fax`
                                  ) : (
                                    <span className="text-primary-20">
                                      (###) ###-####
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {witness12.witness_contact_last.email ? (
                              <a
                                href="#"
                                className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center m-b-5 p-l-6 p-r-6 mt-auto"
                              >
                                <i className="ic ic-19 ic-email-3d m-r-5"></i>
                                {witness12.witness_contact_last.email}
                              </a>
                            ) : null}
                          </div>
                          <div className="mt-auto">
                            <a
                              href="#"
                              onClick={() =>
                                templatePopUp(
                                  "",
                                  "",
                                  witness12.id,
                                  "",
                                  "",
                                  "",
                                  "",
                                  17
                                )
                              }
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                            >
                              <i className="ic ic-19 ic-generate-document m-r-5"></i>
                              Generate Document
                            </a>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex">
                        <div class="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                          <div class="information-wrapper"></div>
                        </div>

                        <div className="dynamic-width col-auto d-flex flex-column hidden-panel p-0 pr-5 width-250 flex-g-1">
                          <div className="information-wrapper">
                            <div>
                              <div className="text-left pl-5 pr-5">
                                <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase"></p>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="row colFonts mb-0">
                                  <div className="col text-left">
                                    <span className="d-inline-block text-dark-grey"></span>
                                  </div>
                                  <div className="col-auto text-left font-weight-semibold">
                                    <p></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex-1 p-0">
                    <div className="fields-wrap overflow-hidden h-100">
                      <div className="tab-pane">
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="table-responsive table--no-card border-0 has-alternate-grey witness-col-table z1 overflow-hidden pr-15">
                              <div
                                className="note-fake-rows w-100 pr-15"
                                data-toggle="modal"
                                data-target="#individual_notes_modal"
                                onClick={() =>
                                  show_notes(
                                    this,
                                    `${witness4.model_name}${witness.id}`,
                                    `${witness4.model_name}`,
                                    `${witness4.id}`,
                                    "Witnesses"
                                  )
                                }
                              >
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                                <div className="note-fake-row"></div>
                              </div>
                              <p className="p-0 height-25 d-flex justify-content-center text-center text-white position-relative line-height-25 margin-right-206">
                                Witnesses Notes
                              </p>

                              <table
                                className="table table-borderless table-striped table-earning table-y-down1"
                                data-toggle="modal"
                                data-target="#individual_notes_modal"
                                onClick={() =>
                                  show_notes(
                                    this,
                                    `${witness4.model_name}${witness.id}`,
                                    `${witness4.model_name}`,
                                    `${witness4.id}`,
                                    "Witnesses"
                                  )
                                }
                              >
                                <tbody className="tbody-panels">
                                  {notes.map((note, index) => {
                                    if (
                                      note.category.name === "Witnesses" ||
                                      note.category.name ===
                                        "Update Case Status" ||
                                      note.category.name === "Critical"
                                    ) {
                                      if (
                                        note.entity_type ===
                                          witness4.model_name.title &&
                                        note.record_id === witness4.id
                                      ) {
                                        return (
                                          <tr key={index}>
                                            <td className="serial-number">
                                              {note_counter}
                                            </td>
                                            <td className="td-autosize">
                                              {note.created_at}
                                            </td>
                                            <td className="td-autosize">
                                              {note.created_at}
                                            </td>
                                            <td className="td-autosize">
                                              <div className="d-flex align-items-center">
                                                <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                  {note.created_by_v1
                                                    .profile_pic && (
                                                    <img
                                                      src={
                                                        note.created_by_v1
                                                          .profile_pic.url
                                                      }
                                                      alt=""
                                                    />
                                                  )}
                                                </span>
                                                <span className="ml-2 text-black">
                                                  {note.created_by.first_name}{" "}
                                                  {note.created_by.last_name}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="client_page_note_row color-white-space-word-wrap">
                                              {note.entity_type &&
                                                note.record_id &&
                                                `${note.entity_type} Note: `}{" "}
                                              {note.description}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    }
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row documents-wrapper m-b-15 ">
                  <div class="col-12">
                    <div class=" m-r-15 background-main-10">
                      <h4 class="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                        Witness Quick-Access Document Row
                      </h4>
                    </div>
                    <div className="row no-gutters flex-row position-relative p-0">
                      <div className="col">
                        <div className="d-flex justify-content-start w-100">
                          <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                            {processedPageSlots.map((processedPageSlot) => {
                              if (
                                processedPageSlot.witnessId === witnessData.id
                              ) {
                                return (
                                  <React.Fragment
                                    key={
                                      processedPageSlot.doc
                                        ? processedPageSlot.doc.id
                                        : processedPageSlot.pageSlotId
                                    }
                                  >
                                    {processedPageSlot.doc ? (
                                      <div
                                        className="col-12 col-md-3 col-xl icon-text-box text-center"
                                        id="no-vertical-border"
                                        onClick={() =>
                                          docPreview(
                                            processedPageSlot.doc.id,
                                            ""
                                          )
                                        }
                                      >
                                        <p className="date">
                                          {processedPageSlot.doc.created}
                                        </p>
                                        <span className="icon-wrap">
                                          <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                                        </span>
                                        {processedPageSlot.pageSlotName ? (
                                          <p className="name">
                                            {processedPageSlot.pageSlotNumber}.{" "}
                                            {processedPageSlot.pageSlotName}
                                          </p>
                                        ) : (
                                          <p className="name">
                                            {processedPageSlot.pageSlotNumber}.{" "}
                                            {processedPageSlot.doc.fileName}
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <div
                                        className={`col-12 col-md-3 col-xl icon-text-box text-center dropzone-${processedPageSlot.pageSlotId}-${witnessData.id}-${pageData.id}`}
                                        id="no-vertical-border"
                                        onClick={() =>
                                          uploadPopUp(
                                            processedPageSlot.pageSlotId,
                                            witnessData.id,
                                            pageData.id
                                          )
                                        }
                                      >
                                        <p className="date"></p>
                                        <span className="icon-wrap">
                                          <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                                        </span>
                                        {processedPageSlot.pageSlotName ? (
                                          <p className="name text-lg-grey">
                                            {processedPageSlot.pageSlotNumber}.{" "}
                                            {processedPageSlot.pageSlotName}
                                          </p>
                                        ) : (
                                          <p className="name text-lg-grey">
                                            {processedPageSlot.pageSlotNumber}.
                                            Available
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </React.Fragment>
                                );
                              }
                              return null;
                            })}
                          </div>
                          <div className="upload-icon-wrap">
                            <div
                              className={`upload-icon dropzone-${pageData.id}-${witnessData.id}`}
                            >
                              <i className="ic ic-64 ic-upload-document cursor-pointer"></i>
                              To Page
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*Insurance section */}
              {/* <div class="border-box has-checklist rounded-0  mr-15 m-t-5 ">
              <div class="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                <div class="skew-box"></div>
                <div className="checklist-section">
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                      type="button"
                      id={`myDropdown${clientProviderId}`}
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="nt-box sub-gauge">
                        {Object.entries(
                          insuranceChecklistPanelPercentage
                        ).map(([key, value]) => {
                          return (
                            <div
                              className="circlechart"
                              data-percentage={value}
                            ></div>
                          );
                        })}
                      </div>
                      <span className="d-flex align-items-center">
                        <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                          <svg
                            width="17"
                            height="50"
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        <span className="checklist-text">
                          Insurance
                          <br />
                          Checklist
                        </span>
                        <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                          <svg
                            width="17"
                            height="50"
                            viewBox="0 0 17 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                              fill="currentColor"
                            />
                            <path
                              d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>

                    <div
                      className="dropdown-menu dropdown-menu-right dropdown-content"
                      id="insurance-dropdown-width"
                      aria-labelledby={`myDropdown${clientProviderId}`}
                    >
                      {insuranceFinalChecklist.map((checklist) => (
                        <div className="checkbox-line" key={checklist.id}>
                          {checklist.status ? (
                            <input
                              type="checkbox"
                              // onClick={() => location.href={`{% url 'bp-uncheckChecklist' checklist.id ${clientId} ${caseId} %}`}}
                              checked
                              id={`medicalcheck${checklist.id}`}
                              name={`medicalcheck${checklist.id}`}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              // onClick={() => location.href={`{% url 'bp-markChecklist' checklist.id ${clientId} ${caseId} %}`}}
                              id={`medicalcheck${checklist.id}`}
                              name={`medicalcheck${checklist.id}`}
                            />
                          )}
                          <label htmlFor={`medicalcheck${checklist.id}`}>
                            {checklist.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div class="row no-gutters has-title-bg m-b-5 flex-nowrap">
                <div class="col-auto p-0">
                  <div class="panel-icon">
                    <i class="ic ic-insurance ic-25"></i>
                  </div>
                  <div class="top-header height-25 d-flex">
                    <div class="top-head d-flex align-items-center">
                      <div class="d-flex align-items-center">
                        <h2 class="d-flex align-items-center">
                          <small class="font-weight-bold">
                            Health Insurance
                          </small>
                          <span
                            class="font-weight-normal ms-2 me-2"
                            id="for-defendant"
                          >
                            for Witness
                          </span>
                          <small class="font-weight-bold">John Doe</small>
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div class="row no-gutters equal-column-wrapper position-relative panels-direction-column def-col-pans-2">
                    <div class="d-flex">
                      <div class="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editinsurance_contact_modal"
                            onClick={() =>
                              insurance_contact_modal(insurance.id)
                            }
                            data-id={insurance.id}
                            data-coverage={insurance.insurance_type.id}
                            data-block="Insurance Company"
                            data-name={insurance.company_contact.name}
                            data-firstname={
                              insurance.company_contact.first_name
                            }
                            data-lastname={
                              insurance.company_contact.last_name
                            }
                            data-add1={insurance.company_contact.address1}
                            data-add2={insurance.company_contact.address2}
                            data-city={insurance.company_contact.city}
                            data-state={insurance.company_contact.state}
                            data-zip={insurance.company_contact.zip}
                            data-phone={
                              insurance.company_contact.phone_number
                            }
                            data-fax={insurance.company_contact.fax}
                            data-email={insurance.company_contact.email}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                INSURANCE COMPANY
                              </p>
                              <p className="columnsTitle">
                                {insurance.company_contact.name ? (
                                  insurance.company_contact.name
                                ) : (
                                  <span className="text-primary-20">
                                    Company Name
                                  </span>
                                )}
                              </p>
                              <div>
                                <p className="colFont info_phone_number text-black">
                                  {insurance.company_contact.address1 ? (
                                    `${insurance.company_contact.address1},`
                                  ) : (
                                    <span className="text-primary-20">
                                      Address
                                    </span>
                                  )}
                                  {insurance.company_contact.address2}
                                </p>
                                <p className="colFont info_fax">
                                  {insurance.company_contact.city ? (
                                    `${insurance.company_contact.city},`
                                  ) : (
                                    <span className="text-primary-20">
                                      City
                                    </span>
                                  )}
                                  {insurance.company_contact.state ? (
                                    insurance.company_contact.state
                                  ) : (
                                    <span className="text-primary-20">
                                      State
                                    </span>
                                  )}
                                  {insurance.company_contact.zip ? (
                                    insurance.company_contact.zip
                                  ) : (
                                    <span className="text-primary-20">
                                      Zip
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p className="colFont info_phone_number text-black">
                                {insurance.company_contact.phone_number ? (
                                  <>
                                    <small>(</small>
                                    {insurance.company_contact.phone_number.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>
                                    {insurance.company_contact.phone_number.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {insurance.company_contact.phone_number.slice(
                                      6
                                    )}
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                              <p className="colFont info_fax">
                                {insurance.company_contact.fax ? (
                                  <>
                                    <small>(</small>
                                    {insurance.company_contact.fax.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>
                                    {insurance.company_contact.fax.slice(
                                      3,
                                      6
                                    )}
                                    -{insurance.company_contact.fax.slice(6)}
                                    <small className="ml-2 text-grey">
                                      fax
                                    </small>
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {insurance.company_contact.email ? (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              {insurance.company_contact.email}
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            </a>
                          )}
                        </div>
                        <div className="mt-auto">
                          <a
                            href="#"
                            //   onClick={() => TemplatePopUp(defendantId)}
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
                          >
                            <i className="ic ic-19 ic-generate-document m-r-5"></i>
                            Generate Document
                          </a>
                        </div>
                      </div>
                      <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editinsurance_contact_modal"
                            onClick={handleClick}
                            data-id={insurance2.id}
                            data-block="Insurance Adjuster"
                            data-name={insurance2.adjuster.name}
                            data-firstname={insurance2.adjuster.first_name}
                            data-lastname={insurance2.adjuster.last_name}
                            data-add1={insurance2.adjuster.address1}
                            data-add2={insurance2.adjuster.address2}
                            data-city={insurance2.adjuster.city}
                            data-state={insurance2.adjuster.state}
                            data-zip={insurance2.adjuster.zip}
                            data-phone={insurance2.adjuster.phone_number}
                            data-fax={insurance2.adjuster.fax}
                            data-email={insurance2.adjuster.email}
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                ADJUSTER
                              </p>
                              <p className="columnsTitle">
                                {insurance2.adjuster.first_name
                                  ? `${insurance2.adjuster.first_name} ${insurance2.adjuster.last_name}`
                                  : insurance2.adjuster.name || (
                                      <span className="text-primary-20">
                                        Adjuster Name
                                      </span>
                                    )}
                              </p>
                              <div>
                                <p className="colFont info_phone_number text-black">
                                  {insurance2.adjuster.address1 ? (
                                    `${insurance2.adjuster.address1},`
                                  ) : (
                                    <span className="text-primary-20">
                                      Address
                                    </span>
                                  )}{" "}
                                  {insurance2.adjuster.address2}
                                </p>
                                <p className="colFont info_fax">
                                  {insurance2.adjuster.city ? (
                                    `${insurance2.adjuster.city},`
                                  ) : (
                                    <span className="text-primary-20">
                                      City
                                    </span>
                                  )}{" "}
                                  {insurance2.adjuster.state || (
                                    <span className="text-primary-20">
                                      State
                                    </span>
                                  )}{" "}
                                  {insurance2.adjuster.zip || (
                                    <span className="text-primary-20">
                                      Zip
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p className="colFont info_phone_number text-black">
                                {insurance2.adjuster.phone_number ? (
                                  <>
                                    <small>(</small>
                                    {insurance2.adjuster.phone_number.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>{" "}
                                    {insurance2.adjuster.phone_number.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {insurance2.adjuster.phone_number.slice(
                                      6
                                    )}
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                              <p className="colFont info_fax">
                                {insurance2.adjuster.fax ? (
                                  <>
                                    <small>(</small>
                                    {insurance2.adjuster.fax.slice(0, 3)}
                                    <small>)</small>{" "}
                                    {insurance2.adjuster.fax.slice(3, 6)}-
                                    {insurance2.adjuster.fax.slice(6)}
                                    <small className="ml-2 text-grey">
                                      fax
                                    </small>
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {insurance2.adjuster.email ? (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              {insurance2.adjuster.email}
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            </a>
                          )}
                        </div>
                        <div className="mt-auto">
                          <a
                            href="#"
                            onClick={() =>
                              templatePopUp(
                                "",
                                defendant.id,
                                "",
                                "",
                                "",
                                "",
                                "",
                                12
                              )
                            }
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                          >
                            <i className="ic ic-19 ic-generate-document m-r-5"></i>
                            Generate Document
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editinsurance_contact_modal"
                            onClick={handleClick}
                            data-id={insurance.id}
                            data-block="Insurance Claim Supervisor"
                            data-name={insurance.supervisor.name}
                            data-firstname={insurance.supervisor.first_name}
                            data-lastname={insurance.supervisor.last_name}
                            data-add1={insurance.supervisor.address1}
                            data-add2={insurance.supervisor.address2}
                            data-city={insurance.supervisor.city}
                            data-state={insurance.supervisor.state}
                            data-zip={insurance.supervisor.zip}
                            data-phone={insurance.supervisor.phone_number}
                            data-fax={insurance.supervisor.fax}
                            data-email={insurance.supervisor.email}
                          >
                            <div className="text-left p-l-5 p-r-5 ">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                supervisor
                              </p>
                              <p className="columnsTitle">
                                {insurance.supervisor.first_name
                                  ? `${insurance.supervisor.first_name} ${insurance.supervisor.last_name}`
                                  : insurance.supervisor.name || (
                                      <span className="text-primary-20">
                                        Supervisor Name
                                      </span>
                                    )}
                              </p>
                              <div>
                                <p className="colFont info_phone_number text-black">
                                  {insurance.supervisor.address1 ? (
                                    `${insurance.supervisor.address1},`
                                  ) : (
                                    <span className="text-primary-20">
                                      Address
                                    </span>
                                  )}{" "}
                                  {insurance.supervisor.address2}
                                </p>
                                <p className="colFont info_fax">
                                  {insurance.supervisor.city ? (
                                    `${insurance.supervisor.city},`
                                  ) : (
                                    <span className="text-primary-20">
                                      City
                                    </span>
                                  )}{" "}
                                  {insurance.supervisor.state || (
                                    <span className="text-primary-20">
                                      State
                                    </span>
                                  )}{" "}
                                  {insurance.supervisor.zip || (
                                    <span className="text-primary-20">
                                      Zip
                                    </span>
                                  )}
                                </p>
                              </div>
                              <p className="colFont info_phone_number text-black">
                                {insurance.supervisor.phone_number ? (
                                  <>
                                    <small>(</small>
                                    {insurance.supervisor.phone_number.slice(
                                      0,
                                      3
                                    )}
                                    <small>)</small>{" "}
                                    {insurance.supervisor.phone_number.slice(
                                      3,
                                      6
                                    )}
                                    -
                                    {insurance.supervisor.phone_number.slice(
                                      6
                                    )}
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                              <p className="colFont info_fax">
                                {insurance.supervisor.fax ? (
                                  <>
                                    <small>(</small>
                                    {insurance.supervisor.fax.slice(0, 3)}
                                    <small>)</small>{" "}
                                    {insurance.supervisor.fax.slice(3, 6)}-
                                    {insurance.supervisor.fax.slice(6)}
                                    <small className="ml-2 text-grey">
                                      fax
                                    </small>
                                  </>
                                ) : (
                                  <span className="text-primary-20">
                                    (###) ###-####
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          {insurance.supervisor.email ? (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                              {insurance.supervisor.email}
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                            >
                              <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            </a>
                          )}
                        </div>
                        <div className="mt-auto">
                          <a
                            href="#"
                            onClick={() =>
                              templatePopUp(
                                "",
                                defendant.id,
                                "",
                                "",
                                "",
                                "",
                                "",
                                13
                              )
                            }
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                          >
                            <i className="ic ic-19 ic-generate-document m-r-5"></i>
                            Generate Document
                          </a>
                        </div>
                      </div>
                      <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                        <div className="information-wrapper">
                          <div
                            data-toggle="modal"
                            data-target="#editinsurance_information_modal"
                            onClick={handleClick}
                            data-id={insuranceData.id}
                            //   data-coverage={
                            //     insuranceData?.insuranceData_type.id
                            //   }
                            //   data-liability={insuranceData.liabilityLimit}
                            data-liabilityall={
                              insuranceData.liabilityLimitAll
                            }
                            data-policy_number={insuranceData.policy_number}
                            data-claim_number={insuranceData.claim_number}
                            data-confirmed_date={
                              insuranceData.Dateconfirmedactive
                            }
                          >
                            <div className="text-left p-l-5 p-r-5">
                              <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                                CLAIM INFORMATION
                              </p>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    Type
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>{insuranceData.insurance_type.name}</p>
                                </div>
                              </div>

                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    Policy
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>{insuranceData.policy_number}</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    Claim
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>{insuranceData.claim_number}</p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    Limits
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>
                                    ${" "}
                                    {insuranceData.liabilityLimit
                                      ? insuranceData.liabilityLimit.toLocaleString()
                                      : 0}{" "}
                                    / ${" "}
                                    {insuranceData.liabilityLimitAll
                                      ? insuranceData.liabilityLimitAll.toLocaleString()
                                      : 0}{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="row mb-0 colFont">
                                <div className="col text-left">
                                  <span className="d-inline-block text-dark-grey">
                                    Confirmed
                                  </span>
                                </div>
                                <div className="col-auto text-left font-weight-semibold">
                                  <p>
                                    {new Date(
                                      insuranceData.Dateconfirmedactive
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex-1 p-0 position-relative z-index-1">
                  <div
                    className="fields-wrap overflow-hidden h-100"
                    data-toggle="modal"
                    data-target="#individual_notes_modal"
                    onClick={() =>
                      show_notes(
                        this,
                        `${insurance11.model_name.title}${insurance11.id}`,
                        `${insurance11.model_name.title}`,
                        `${insurance11.id}`,
                        "Insurance"
                      )
                    }
                  >
                    <div
                      className="tab-pane"
                      id="custom-nav-todo"
                      role="tabpanel"
                      aria-labelledby="custom-nav-todo-tab"
                    >
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="table-responsive table--no-card border-0 has-alternate-grey def-col-table-2 overflow-hidden p-r-15">
                            <div className="note-fake-rows w-100 p-r-15">
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                              <div className="note-fake-row"></div>
                            </div>
                            <p className="p-0 height-25 d-flex justify-content-center text-center text-white line-height-25 margin-right-206">
                              {insurance11.insurance_type.name} Notes
                            </p>
                            <table className="table table-borderless table-striped table-earning table-y-down1">
                              <tbody className="tbody-panels">
                                {notes11.map((note, index) => {
                                  if (
                                    note.category.name === "Insurance" ||
                                    note.category.name ===
                                      "Update Case Status" ||
                                    note.category.name === "Critical"
                                  ) {
                                    if (
                                      note.entity_type ===
                                        insurance11.model_name.title &&
                                      note.record_id === insurance11.id
                                    ) {
                                      return (
                                        <tr key={index}>
                                          <td className="td-autosize serial-number">
                                            {note_counter}
                                          </td>
                                          <td className="td-autosize">
                                            {note.created_at.toLocaleDateString(
                                              "en-US"
                                            )}
                                          </td>
                                          <td className="td-autosize">
                                            {note.created_at.toLocaleTimeString(
                                              "en-US"
                                            )}
                                          </td>
                                          <td className="td-autosize">
                                            <div className="d-flex align-items-center">
                                              <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                {note.created_by_v1
                                                  .profile_pic ? (
                                                  <img
                                                    src={
                                                      note.created_by_v1
                                                        .profile_pic.url
                                                    }
                                                    alt=""
                                                    className=""
                                                  />
                                                ) : null}
                                              </span>
                                              <span className="ml-2 text-black">
                                                {note.created_by.first_name}{" "}
                                                {note.created_by.last_name}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="client_page_note_row color-white-space-word-wrap">
                                            {note.entity_type &&
                                            note.record_id
                                              ? `${note.entity_type} Note: `
                                              : null}{" "}
                                            {note.description}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  }
                                  return null;
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row documents-wrapper">
                <div className="col-12">
                  <div className="m-r-15 background-main-10 height-25">
                    <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center">
                      {insuranceType} Quick-Access Document Row
                    </h4>
                  </div>
                  <div className="row no-gutters flex-row position-relative p-r-15">
                    <div className="col p-0">
                      <div className="d-flex justify-content-start w-100">
                        <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                          {insurancePageSlots.map(
                            (processedPageSlot) =>
                              processedPageSlot.insuranceId ===
                                insurance.id &&
                              (processedPageSlot.doc ? (
                                <div
                                  key={processedPageSlot.doc.id}
                                  className="col-12 col-md-3 col-xl icon-text-box text-center"
                                  id="no-vertical-border"
                                  onClick={() =>
                                    docPreview(processedPageSlot.doc.id, "")
                                  }
                                >
                                  <p className="date">
                                    {processedPageSlot.doc.created}
                                  </p>
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-file-colored cursor-pointer"></i>
                                  </span>
                                  <p className="name">
                                    {processedPageSlot.pageSlot.slotNumber}.{" "}
                                    {processedPageSlot.pageSlot.slotName ||
                                      processedPageSlot.doc.fileName}
                                  </p>
                                </div>
                              ) : (
                                <div
                                  key={processedPageSlot.pageSlot.id}
                                  className={`col-12 col-md-3 col-xl icon-text-box text-center dropzone-${processedPageSlot.pageSlot.id}-${insurance.id}-${processedPageSlot.pageSlot.pageId}`}
                                  id="no-vertical-border"
                                  onClick={() =>
                                    uploadPopUp(
                                      processedPageSlot.pageSlot.id,
                                      insurance.id,
                                      processedPageSlot.pageSlot.pageId
                                    )
                                  }
                                >
                                  <p className="date"></p>
                                  <span className="icon-wrap">
                                    <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                                  </span>
                                  <p className="name text-lg-grey">
                                    {processedPageSlot.pageSlot.slotNumber}.{" "}
                                    {processedPageSlot.pageSlot.slotName
                                      ? processedPageSlot.pageSlot.slotName
                                      : "Available"}
                                  </p>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

              {/* OPPOSING COUNSEL */}
              {/* <div class="border-box has-checklist rounded-0 mr-15 m-t-5 ">
              <div class="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
                <div class="skew-box"></div>
                <div className="checklist-section">
                  <button
                    className="dropdown-toggle text-darker d-flex align-items-center justify-content-end w-100"
                    id={`myDropdown${clientProviderId}`}
                    type="button"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {Object.entries(checklistPanelPercentage).map(
                      ([key, value]) => {
                        if (key === opposingCounsel.id) {
                          return (
                            <div
                              className="circlechart"
                              data-percentage={value}
                            ></div>
                          );
                        }
                      }
                    )}
                    <span className="d-flex align-items-center">
                      <span className="ic has-no-after ic-check text-success d-flex align-items-center justify-content-center">
                        <svg
                          width="17"
                          height="50"
                          viewBox="0 0 17 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="checklist-text">
                        {page.name} <br />
                        Checklist
                      </span>
                      <span className="ic has-no-after ic-arrow text-white d-flex align-items-center justify-content-center">
                        <svg
                          width="17"
                          height="50"
                          viewBox="0 0 17 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 16H4.59998L8.5 19.95L12.4 16H17L8.5 24.55L0 16Z"
                            fill="currentColor"
                          />
                          <path
                            d="M0 25.4512H4.59998L8.5 29.4012L12.4 25.4512H17L8.5 34.0012L0 25.4512Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>

                  <div
                    aria-labelledby={`myDropdown${clientProviderId}`}
                    className="dropdown-menu dropdown-menu-right dropdown-content"
                    id="insurance-dropdown-width"
                  >
                    {finalChecklist.map((checklist) => (
                      <div className="checkbox-line" key={checklist.id}>
                        <input
                          type="checkbox"
                          onClick={() => {
                            const url = checklist.status
                              ? `{% url 'bp-uncheckChecklist' ${checklist.id} client.id case.id %}`
                              : `{% url 'bp-markChecklist' ${checklist.id} client.id case.id %}`;
                            location.href = url;
                          }}
                          checked={checklist.status}
                          id={`medicalcheck${checklist.id}`}
                          name={`medicalcheck${checklist.id}`}
                        />
                        <label htmlFor={`medicalcheck${checklist.id}`}>
                          {checklist.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div class="row no-gutters has-title-bg m-b-5 flex-nowrap">
                <div class="col-auto p-0">
                  <div class="panel-icon">
                    <i class="ic ic-insurance ic-25"></i>
                  </div>

                  <div className="top-header height-25 d-flex">
                    <div className="top-head d-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <h2 className="d-flex align-items-center">
                          <small className="font-weight-bold">
                            {opposingCounsel.opposingCounselContact.name}
                          </small>
                          <span className="font-weight-normal ml-2 mr-2">
                            |
                          </span>
                        </h2>
                        <p>
                          {opposingCounsel.opposingCounselContact.website}
                        </p>
                        <span className="font-weight-normal ml-2 mr-2">
                          |
                        </span>
                        <p>
                          {
                            opposingCounsel.forClient.createdBy
                              .attorneyProfile.user.username
                          }
                        </p>
                        <span className="font-weight-normal ml-2 mr-2">
                          |
                        </span>
                        <p>{opposingCounsel.fileNumber}</p>
                        <span className="font-weight-normal ml-2 mr-2">
                          |
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="row no-gutters equal-column-wrapper position-relative panels-direction-column def-col-pans-3">
                    <div class="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                      <div class="information-wrapper">
                        <div
                          data-toggle="modal"
                          data-target="#editcounsel_contact_modal"
                          // onClick={handleModalClick}
                          data-id={opposingCounsel.id}
                          data-block="firm_block"
                          data-name={
                            opposingCounsel.opposingCounselContact.name
                          }
                          data-add1={
                            opposingCounsel.opposingCounselContact.address1
                          }
                          data-add2={
                            opposingCounsel.opposingCounselContact.address2
                          }
                          data-city={
                            opposingCounsel.opposingCounselContact.city
                          }
                          data-state={
                            opposingCounsel.opposingCounselContact.state
                          }
                          data-zip={
                            opposingCounsel.opposingCounselContact.zip
                          }
                          data-phone={
                            opposingCounsel.opposingCounselContact
                              .phone_number
                          }
                          data-fax={
                            opposingCounsel.opposingCounselContact.fax
                          }
                          data-email={
                            opposingCounsel.opposingCounselContact.email
                          }
                          className="text-left p-l-5 p-r-5"
                        >
                          <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                            opposing counsel
                          </p>
                          <p className="columnsTitle">
                            {opposingCounsel.opposingCounselContact.name ? (
                              opposingCounsel.opposingCounselContact.name
                            ) : (
                              <span className="text-primary-20">
                                Opposing Counsel Name
                              </span>
                            )}
                          </p>
                          <div>
                            <p className="colFont info_phone_number text-black">
                              {opposingCounsel.opposingCounselContact
                                .address1 ? (
                                opposingCounsel.opposingCounselContact
                                  .address1 + ", "
                              ) : (
                                <span className="text-primary-20">
                                  Address
                                </span>
                              )}
                              {
                                opposingCounsel.opposingCounselContact
                                  .address2
                              }
                            </p>
                            <p className="colFont info_fax">
                              {opposingCounsel.opposingCounselContact.city ? (
                                opposingCounsel.opposingCounselContact.city +
                                ", "
                              ) : (
                                <span className="text-primary-20">City</span>
                              )}
                              {opposingCounsel.opposingCounselContact
                                .state ? (
                                opposingCounsel.opposingCounselContact.state
                              ) : (
                                <span className="text-primary-20">State</span>
                              )}
                              {opposingCounsel.opposingCounselContact.zip ? (
                                opposingCounsel.opposingCounselContact.zip
                              ) : (
                                <span className="text-primary-20">Zip</span>
                              )}
                            </p>
                          </div>
                          <p className="colFont info_phone_number text-black">
                            {opposingCounsel.opposingCounselContact
                              .phone_number ? (
                              `(${opposingCounsel.opposingCounselContact.phone_number.slice(0, 3)}) ${opposingCounsel.opposingCounselContact.phone_number.slice(3, 6)}-${opposingCounsel.opposingCounselContact.phone_number.slice(6)}`
                            ) : (
                              <span className="text-primary-20">
                                (###) ###-####
                              </span>
                            )}
                          </p>
                          <p className="colFont info_fax">
                            {opposingCounsel.opposingCounselContact.fax ? (
                              `(${opposingCounsel.opposingCounselContact.fax.slice(0, 3)}) ${opposingCounsel.opposingCounselContact.fax.slice(3, 6)}-${opposingCounsel.opposingCounselContact.fax.slice(6)} fax`
                            ) : (
                              <span className="text-primary-20">
                                (###) ###-####
                              </span>
                            )}
                          </p>
                        </div>
                        {opposingCounsel?.opposingCounselContact.email ? (
                          <a
                            href="#"
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                          >
                            <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            {opposingCounsel?.opposingCounselContact.email}
                          </a>
                        ) : (
                          <a
                            href="#"
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                          >
                            <i className="ic ic-19 ic-email-3d m-r-5"></i>
                          </a>
                        )}
                      </div>
                      <div className="mt-auto">
                        <a
                          href="#"
                          onClick={() =>
                            templatePopUp(
                              "",
                              `${defendant.id}`,
                              "",
                              "",
                              "",
                              "",
                              ""
                            )
                          }
                          className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                        >
                          <i className="ic ic-19 ic-generate-document m-r-5"></i>
                          Generate Document
                        </a>
                      </div>
                    </div>
                    <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                      <div className="information-wrapper">
                        <div
                          data-toggle="modal"
                          data-target="#editcounsel_contact_modal"
                          onClick={counselContactModal}
                          data-id={opposingcounsel.id}
                          data-block="opposingattorney_block"
                          data-name={opposingcounsel.opposingattorney.name}
                          data-add1={
                            opposingcounsel.opposingattorney.address1
                          }
                          data-add2={
                            opposingcounsel.opposingattorney.address2
                          }
                          data-city={opposingcounsel.opposingattorney.city}
                          data-state={opposingcounsel.opposingattorney.state}
                          data-zip={opposingcounsel.opposingattorney.zip}
                          data-phone={
                            opposingcounsel.opposingattorney.phone_number
                          }
                          data-fax={opposingcounsel.opposingattorney.fax}
                          data-email={opposingcounsel.opposingattorney.email}
                        >
                          <div className="text-left p-l-5 p-r-5">
                            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                              opposing attorney
                            </p>
                            <p className="columnsTitle">
                              {opposingcounsel.opposingattorney.name ? (
                                opposingcounsel.opposingattorney.name
                              ) : (
                                <span className="text-primary-20">
                                  Opposing Attorney Name
                                </span>
                              )}
                            </p>
                            <div>
                              <p className="colFont info_phone_number text-black">
                                {opposingcounsel.opposingattorney.address1 ? (
                                  `${opposingcounsel.opposingattorney.address1}, `
                                ) : (
                                  <span className="text-primary-20">
                                    Address
                                  </span>
                                )}
                                {opposingcounsel.opposingattorney.address2}
                              </p>
                              <p className="colFont info_fax">
                                {opposingcounsel.opposingattorney.city ? (
                                  `${opposingcounsel.opposingattorney.city}, `
                                ) : (
                                  <span className="text-primary-20">
                                    City
                                  </span>
                                )}
                                {opposingcounsel.opposingattorney.state ? (
                                  `${opposingcounsel.opposingattorney.state} `
                                ) : (
                                  <span className="text-primary-20">
                                    State
                                  </span>
                                )}
                                {opposingcounsel.opposingattorney.zip ? (
                                  opposingcounsel.opposingattorney.zip
                                ) : (
                                  <span className="text-primary-20">Zip</span>
                                )}
                              </p>
                            </div>
                            <p className="colFont info_phone_number text-black">
                              {opposingcounsel.opposingattorney
                                .phone_number ? (
                                <>
                                  <small>(</small>
                                  {opposingcounsel.opposingattorney.phone_number.slice(
                                    0,
                                    3
                                  )}
                                  <small>)</small>
                                  {opposingcounsel.opposingattorney.phone_number.slice(
                                    3,
                                    6
                                  )}
                                  -
                                  {opposingcounsel.opposingattorney.phone_number.slice(
                                    6
                                  )}
                                </>
                              ) : (
                                <span className="text-primary-20">
                                  (###) ###-####
                                </span>
                              )}
                            </p>
                            <p className="colFont info_fax">
                              {opposingcounsel.opposingattorney.fax ? (
                                <>
                                  <small>(</small>
                                  {opposingcounsel.opposingattorney.fax.slice(
                                    0,
                                    3
                                  )}
                                  <small>)</small>
                                  {opposingcounsel.opposingattorney.fax.slice(
                                    3,
                                    6
                                  )}
                                  -
                                  {opposingcounsel.opposingattorney.fax.slice(
                                    6
                                  )}
                                  <small className="ml-2 text-grey">
                                    fax
                                  </small>
                                </>
                              ) : (
                                <span className="text-primary-20">
                                  (###) ###-####
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {opposingcounsel.opposingattorney.email ? (
                          <a
                            href="#"
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                          >
                            <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            {opposingcounsel.opposingattorney.email}
                          </a>
                        ) : (
                          <a
                            href="#"
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                          >
                            <i className="ic ic-19 ic-email-3d m-r-5"></i>
                          </a>
                        )}
                      </div>
                      <div className="mt-auto">
                        <a
                          href="#"
                          onClick={() =>
                            templatePopUp(
                              "",
                              defendant.id,
                              "",
                              "",
                              "",
                              "",
                              ""
                            )
                          }
                          className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                        >
                          <i className="ic ic-19 ic-generate-document m-r-5"></i>
                          Generate Document
                        </a>
                      </div>
                    </div>

                    <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                      <div className="information-wrapper">
                        <div
                          data-toggle="modal"
                          data-target="#editcounsel_contact_modal"
                          onClick={counselContactModal}
                          data-id={opposingcounsel.id}
                          data-block="opposingattorney_block"
                          data-name={opposingcounsel.opposingattorney.name}
                          data-add1={
                            opposingcounsel.opposingattorney.address1
                          }
                          data-add2={
                            opposingcounsel.opposingattorney.address2
                          }
                          data-city={opposingcounsel.opposingattorney.city}
                          data-state={opposingcounsel.opposingattorney.state}
                          data-zip={opposingcounsel.opposingattorney.zip}
                          data-phone={
                            opposingcounsel.opposingattorney.phone_number
                          }
                          data-fax={opposingcounsel.opposingattorney.fax}
                          data-email={opposingcounsel.opposingattorney.email}
                        >
                          <div className="text-left p-l-5 p-r-5">
                            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                              Opposing Attorney
                            </p>
                            <p className="columnsTitle">
                              {opposingcounsel.opposingattorney.name ? (
                                opposingcounsel.opposingattorney.name
                              ) : (
                                <span className="text-primary-20">
                                  Opposing Attorney Name
                                </span>
                              )}
                            </p>
                            <div>
                              <p className="colFont info_phone_number text-black">
                                {opposingcounsel.opposingattorney.address1 ? (
                                  opposingcounsel.opposingattorney.address1 +
                                  ","
                                ) : (
                                  <span className="text-primary-20">
                                    Address
                                  </span>
                                )}
                                {opposingcounsel.opposingattorney.address2}
                              </p>
                              <p className="colFont info_fax">
                                {opposingcounsel.opposingattorney.city ? (
                                  opposingcounsel.opposingattorney.city + ","
                                ) : (
                                  <span className="text-primary-20">
                                    City
                                  </span>
                                )}
                                {opposingcounsel.opposingattorney.state ? (
                                  opposingcounsel.opposingattorney.state
                                ) : (
                                  <span className="text-primary-20">
                                    State
                                  </span>
                                )}
                                {opposingcounsel.opposingattorney.zip ? (
                                  opposingcounsel.opposingattorney.zip
                                ) : (
                                  <span className="text-primary-20">Zip</span>
                                )}
                              </p>
                            </div>
                            <p className="colFont info_phone_number text-black">
                              {opposingcounsel.opposingattorney
                                .phone_number ? (
                                <>
                                  <small>(</small>
                                  {opposingcounsel.opposingattorney.phone_number.slice(
                                    0,
                                    3
                                  )}
                                  <small>)</small>
                                  {opposingcounsel.opposingattorney.phone_number.slice(
                                    3,
                                    6
                                  )}
                                  -
                                  {opposingcounsel.opposingattorney.phone_number.slice(
                                    6
                                  )}
                                </>
                              ) : (
                                <span className="text-primary-20">
                                  (###) ###-####
                                </span>
                              )}
                            </p>
                            <p className="colFont info_fax">
                              {opposingcounsel.opposingattorney.fax ? (
                                <>
                                  <small>(</small>
                                  {opposingcounsel.opposingattorney.fax.slice(
                                    0,
                                    3
                                  )}
                                  <small>)</small>
                                  {opposingcounsel.opposingattorney.fax.slice(
                                    3,
                                    6
                                  )}
                                  -
                                  {opposingcounsel.opposingattorney.fax.slice(
                                    6
                                  )}
                                  <small className="ml-2 text-grey">
                                    fax
                                  </small>
                                </>
                              ) : (
                                <span className="text-primary-20">
                                  (###) ###-####
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {opposingcounsel.opposingattorney.email ? (
                          <a
                            href="#"
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                          >
                            <i className="ic ic-19 ic-email-3d m-r-5"></i>
                            {opposingcounsel.opposingattorney.email}
                          </a>
                        ) : (
                          <a
                            href="#"
                            className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
                          >
                            <i className="ic ic-19 ic-email-3d m-r-5"></i>
                          </a>
                        )}
                      </div>
                      <div className="mt-auto">
                        <a
                          href="#"
                          onClick={() => templatePopUp("", defendant.id)}
                          className="btn btn-primary-lighter font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center"
                        >
                          <i className="ic ic-19 ic-generate-document m-r-5"></i>
                          Generate Document
                        </a>
                      </div>
                    </div>

                    <div className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-250 flex-g-1">
                      <div className="information-wrapper">
                        <div
                          data-toggle="modal"
                          data-target="#editcounsel_information_modal"
                          // onClick={counselInformationModal}
                          data-id={opposingcounsel.id}
                          data-counsel_type={opposingcounsel.counsel_type.id}
                          data-file_number={opposingcounsel.file_number}
                        >
                          <div className="text-left p-l-5 p-r-5">
                            <p className="columnsTitle text-primary text-center font-weight-semibold text-uppercase">
                              Counsel Information
                            </p>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block text-dark-grey">
                                  Type
                                </span>
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p>{opposingcounsel.counsel_type.name}</p>
                              </div>
                            </div>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block text-dark-grey">
                                  File #
                                </span>
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p>{opposingcounsel.file_number}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dynamic-width col-auto d-flex flex-column hidden-panel p-0 p-r-5 width-250 flex-g-1">
                      <div className="information-wrapper">
                        <div
                          data-toggle="modal"
                          data-target="#editcounsel_information_modal"
                          // onClick={counselInformationModal}
                          data-id={opposingcounsel.id}
                          data-counsel_type={opposingcounsel.counsel_type.id}
                          data-file_number={opposingcounsel.file_number}
                        >
                          <div className="text-left p-l-5 p-r-5">
                            <p className="columnsTitle text-primary font-weight-semibold text-uppercase"></p>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block text-dark-grey"></span>
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p></p>
                              </div>
                            </div>
                            <div className="row mb-0 colFont">
                              <div className="col text-left">
                                <span className="d-inline-block text-dark-grey"></span>
                              </div>
                              <div className="col-auto text-left font-weight-semibold">
                                <p></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex-1 p-0 position-relative z-index-1">
                  <div
                    className="fields-wrap overflow-hidden h-100"
                    data-toggle="modal"
                    data-target="#individual_notes_modal"
                    onClick={(event) =>
                      showNotes(
                        event,
                        `${opposingcounsel.model_name.title}${opposingcounsel.id}`,
                        opposingcounsel.model_name.title,
                        opposingcounsel.id,
                        "Counsel"
                      )
                    }
                  >
                    <div
                      className="tab-pane"
                      id="custom-nav-todo"
                      role="tabpanel"
                      aria-labelledby="custom-nav-todo-tab"
                    >
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="table-responsive table--no-card border-0 has-alternate-grey def-col-table-3 overflow-hidden p-r-15">
                            <div className="note-fake-rows w-100 p-r-15">
                              {Array.from({ length: 12 }).map((_, index) => (
                                <div
                                  key={index}
                                  className="note-fake-row"
                                ></div>
                              ))}
                            </div>
                            <p className="p-0 height-25 d-flex justify-content-center text-center text-white line-height-25 margin-right-206">
                              Counsel Notes
                            </p>
                            <table className="table table-borderless table-striped table-earning table-y-down1">
                              <tbody className="tbody-panels">
                                {notes.map((note, index) => {
                                  if (
                                    note.category.name === "Counsel" ||
                                    note.category.name ===
                                      "Update Case Status" ||
                                    note.category.name === "Critical"
                                  ) {
                                    if (
                                      note.entity_type ===
                                        `${opposingcounsel.model_name.title}` &&
                                      note.record_id === opposingcounsel.id
                                    ) {
                                      return (
                                        <tr key={index}>
                                          <td className="td-autosize serial-number">
                                            {noteCounter}
                                          </td>
                                          <td className="td-autosize">
                                            {note.created_at.toLocaleDateString(
                                              "en-US"
                                            )}
                                          </td>
                                          <td className="td-autosize">
                                            {note.created_at.toLocaleTimeString(
                                              "en-US"
                                            )}
                                          </td>
                                          <td className="td-autosize">
                                            <div className="d-flex align-items-center">
                                              <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                                                {note.created_by_v1
                                                  .profile_pic ? (
                                                  <img
                                                    src={
                                                      note.created_by_v1
                                                        .profile_pic.url
                                                    }
                                                    alt=""
                                                    className=""
                                                  />
                                                ) : null}
                                              </span>
                                              <span className="ml-2 text-black">
                                                {note.created_by.first_name}{" "}
                                                {note.created_by.last_name}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="client_page_note_row color-white-space-word-wrap ">
                                            {note.entity_type &&
                                            note.record_id
                                              ? `${note.entity_type} Note: `
                                              : ""}{" "}
                                            {note.description}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  }
                                  return null;
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};
