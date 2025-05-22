import React from "react";

const ClientTab = ({
  title,
  setSelectedClient,
  searchTerm,
  handleSearch,
  filteredClients,
  formData,
  selectedClient,
  handleInputChange,
  handleCheckBoxChange,
  handleDateChange,
}) => {
  return (
    <div className="col-md-6 d-flex flex-column">
      <h3 className="font-weight-bold text-center m-b-5">{title}</h3>
      <div className="row mb-1 align-items-center">
        <div className="col-md-12">
          <input
            type="text"
            name="filter_search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Enter Client First Name or Last Name to filter the results"
            className="form-control mw-100"
          />

          {searchTerm &&
            filteredClients.map((client) => (
              <div
                onClick={() => setSelectedClient(client)}
                key={client.id}
                className="d-flex py-2 px-2"
                style={{ textTransform: "uppercase" }}
              >
                <div className="client-image position-relative ic-19 cursor-pointer mr-1 m-l-10">
                  <img
                    src={
                      client?.profile_pic_19p ??
                      "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                    }
                    alt={`${client?.first_name} ${client?.last_name}`}
                  />
                </div>
                {`${client.first_name} ${client.last_name}: `}
                {client?.case_type.map((caseType) => (
                  <>
                    <span className="ic-avatar ic-19 ml-1 mr-8px">
                      <img className="img-19px" src={caseType?.case_type_url} />
                    </span>
                    {caseType?.case_type_name}
                  </>
                ))}
              </div>
            ))}
        </div>
      </div>
      {/* First Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">First Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="first_name"
            placeholder="Enter First Name"
            data-table="Client"
            data-field_name="first_name"
            data-subtable="None"
            className="form-control"
            value={
              formData.first_name?.value || selectedClient?.first_name || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Middle Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Middle Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="middle_name"
            placeholder="Enter Middle Name"
            data-table="Client"
            data-field_name="middle_name"
            data-subtable="None"
            className="form-control"
            value={
              formData.middle_name?.value || selectedClient?.middle_name || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Last Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Last Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="last_name"
            placeholder="Enter Last Name"
            data-table="Client"
            data-field_name="last_name"
            data-subtable="None"
            className="form-control"
            value={formData.last_name?.value || selectedClient?.last_name || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Title & Gender */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Title:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="title"
            placeholder="Enter Title"
            data-table="Client"
            data-field_name="title"
            data-subtable="None"
            className="form-control"
            value={formData.title?.value || selectedClient?.title || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-1">
          <p className="text-secondary whitespace-nowrap">Gender:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="gender"
            placeholder="Enter Gender"
            data-table="Client"
            data-field_name="gender"
            data-subtable="None"
            className="form-control"
            value={formData.gender?.value || selectedClient?.gender || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* DOB & SSN */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">DOB:</p>
        </div>
        <div className="col-md-4">
          <input
            type="date"
            name="birthday"
            data-field_name="birthday"
            data-table="Client"
            data-subtable="None"
            className="form-control"
            min="1000-01-01"
            max="9999-12-31"
            value={formData.birthday?.value || selectedClient?.birthday || ""}
            onChange={handleDateChange}
          />
          {/* <input
          type="date"
          name="birthday"
          data-table="Client"
          data-field_name="birthday"
          data-subtable="None"
          className="form-control"
          min="1000-01-01"
          max="9999-12-31"
          value={
            formData.birthday?.value || selectedClient?.birthday || ""
          }
          onChange={handleDateChange}
        /> */}
        </div>
        <div className="col-md-1">
          <p className="text-secondary whitespace-nowrap">SSN:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="ssn"
            placeholder="Enter SSN"
            data-table="Client"
            data-field_name="ssn"
            data-subtable="None"
            className="form-control"
            value={formData.ssn?.value || selectedClient?.ssn || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* License & State */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">License:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="license"
            data-table="Client"
            data-field_name="driver_license_number"
            data-subtable="None"
            className="form-control"
            placeholder="Enter License"
            value={
              formData.driver_license_number?.value ||
              selectedClient?.driver_license_number ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-1">
          <p className="text-secondary whitespace-nowrap">State:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="license_state"
            placeholder="Enter License State"
            data-table="Client"
            data-field_name="driver_license_state"
            data-subtable="None"
            className="form-control"
            value={
              formData.driver_license_state?.value ||
              selectedClient?.driver_license_state ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Primary Phone */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Primary Phone:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="primary_phone"
            placeholder="Enter Primary Phone"
            data-table="Contact"
            data-field_name="phone_number"
            data-subtable="primary_phone"
            className="form-control"
            value={
              formData.primary_phone?.value ||
              selectedClient?.primary_phone?.phone_number ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Primary Email */}

      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Primary Email:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="primary_email"
            placeholder="Enter Primary Email"
            data-table="Contact"
            data-field_name="email"
            data-subtable="primary_email"
            className="form-control"
            value={
              formData.primary_email?.value ||
              selectedClient?.primary_email?.email ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Billing Discount */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">
            Billing Discount %:
          </p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="billing_discount_percent"
            placeholder="Enter Billing Discount"
            data-table="Client"
            data-field_name="billing_discount_percent"
            data-subtable="None"
            className="form-control"
            value={
              formData.billing_discount_percent?.value ||
              selectedClient?.billing_discount_percent ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Billing rate */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Billing Rate:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="client_billing_rate"
            placeholder="Enter Billing Rate"
            data-table="Client"
            data-field_name="client_billing_rate"
            data-subtable="None"
            className="form-control"
            value={
              formData.client_billing_rate?.value ||
              selectedClient?.client_billing_rate ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Entity Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Entity Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="entity_name"
            placeholder="Enter Entity"
            data-table="Client"
            data-field_name="entity_name"
            data-subtable="None"
            className="form-control"
            value={
              formData.entity_name?.value || selectedClient?.entity_name || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Entity Type */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Entity Type:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="entity_type"
            placeholder="Enter Entity Type"
            data-table="EntityType"
            data-field_name="entity_type"
            data-subtable="entity_type"
            className="form-control"
            value={
              formData.entity_type?.value ||
              selectedClient?.entity_type?.entity_type ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h5 className="font-weight-bold m-b-5">Phone Numbers</h5>
      {/* Phone Numbers 1 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Phone Number 1:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="phone_1"
            placeholder="Enter Phone Number"
            data-table="Contact"
            data-field_name="phone_number"
            data-subtable="contact_1"
            className="form-control"
            value={
              formData.phone_1?.value ||
              selectedClient?.contact_1?.phone_number ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Phone Number 2 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Phone Number 2:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="phone_2"
            placeholder="Enter Phone Number"
            data-table="Contact"
            data-field_name="phone_number"
            data-subtable="contact_2"
            className="form-control"
            value={
              formData.phone_2?.value ||
              selectedClient?.contact_2?.phone_number ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Phone Number 3 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Phone Number 3:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="phone_3"
            placeholder="Enter Phone Number"
            data-table="Contact"
            data-field_name="phone_number"
            data-subtable="contact_3"
            className="form-control"
            value={
              formData.phone_3?.value ||
              selectedClient?.contact_3?.phone_number ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h5 className="font-weight-bold m-b-5">Emails</h5>
      {/*Email 1 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Email 1:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="email_1"
            placeholder="Enter Email"
            data-table="Contact"
            data-field_name="email"
            data-subtable="contact_1"
            className="form-control"
            value={
              formData.email_1?.value || selectedClient?.contact_1?.email || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Email 2 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Email 2:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="email_2"
            placeholder="Enter Email"
            data-table="Contact"
            data-field_name="email"
            data-subtable="contact_2"
            className="form-control"
            value={
              formData.email_2?.value || selectedClient?.contact_2?.email || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Email 3 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Email 3:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="email_3"
            placeholder="Enter Email"
            data-table="Contact"
            data-field_name="email"
            data-subtable="contact_3"
            className="form-control"
            value={
              formData.email_3?.value || selectedClient?.contact_3?.email || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h5 className="font-weight-bold m-b-5">Mailing Contact</h5>
      {/* Address 1 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Address 1:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="mailing_address1"
            placeholder="Enter Address 1"
            data-table="Contact"
            data-field_name="address1"
            data-subtable="mailing_contact"
            className="form-control"
            value={
              formData.mailing_address1?.value ||
              selectedClient?.mailing_contact?.address1 ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Address 2 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Address 2:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="mailing_address2"
            placeholder="Enter Address 2"
            data-table="Contact"
            data-field_name="address2"
            data-subtable="mailing_contact"
            className="form-control"
            value={
              formData.mailing_address2?.value ||
              selectedClient?.mailing_contact?.address2 ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* City */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">City:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="mailing_city"
            placeholder="Enter City"
            data-table="Contact"
            data-field_name="city"
            data-subtable="mailing_contact"
            className="form-control"
            value={
              formData.mailing_city?.value ||
              selectedClient?.mailing_contact?.city ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* State & Zip */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">State:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="mailing_state"
            placeholder="Enter State"
            data-table="Contact"
            data-field_name="state"
            data-subtable="mailing_contact"
            className="form-control"
            value={
              formData.mailing_state?.value ||
              selectedClient?.mailing_contact?.state ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-1">
          <p className="text-secondary whitespace-nowrap">Zip:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="mailing_zip"
            placeholder="Enter City"
            data-table="Contact"
            data-field_name="zip"
            data-subtable="mailing_contact"
            className="form-control"
            value={
              formData.mailing_zip?.value ||
              selectedClient?.mailing_contact?.zip ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Spouse */}
      <h5 className="font-weight-bold m-b-5">Spouse</h5>
      {/* Spouse RelationShip */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Relationship:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="spouse_relationship"
            placeholder="Enter Relationship"
            data-table="Spouse"
            data-field_name="relationship"
            data-subtable="none"
            className="form-control"
            value={
              formData.spouse_relationship?.value ||
              selectedClient?.spouse?.relationship ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* First Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">First Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="spouse_first_name"
            placeholder="Enter Spouse First Name"
            data-table="Spouse"
            data-field_name="first_name"
            data-subtable="none"
            className="form-control"
            value={
              formData.spouse_first_name?.value ||
              selectedClient?.spouse?.first_name ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Last Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Last Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="spouse_last_name"
            placeholder="Enter Spouse Last Name"
            data-table="Spouse"
            data-field_name="last_name"
            data-subtable="none"
            className="form-control"
            value={
              formData.spouse_last_name?.value ||
              selectedClient?.spouse?.last_name ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Discuss Case */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Discuss Case:</p>
        </div>
        <div class="col-md-9 d-flex justify-content-center">
          <input
            type="checkbox"
            name="spouse_discussCase"
            class=""
            placeholder=""
            data-table="Spouse"
            data-field_name="discussCase"
            data-subtable="none"
            onChange={handleCheckBoxChange}
            checked={
              formData.spouse_discussCase?.value ||
              selectedClient?.spouse?.discussCase ||
              false
            }
          />
        </div>
      </div>

      {/* Divorced */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Divorced:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="divorced"
            placeholder=""
            data-table="Spouse"
            data-field_name="divorced"
            data-subtable="none"
            className="form-control"
            value={
              formData.divorced?.value || selectedClient?.spouse?.divorced || ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Marriage Data */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Marriage Date:</p>
        </div>
        <div className="col-md-9">
          <input
            type="date"
            name="marriage_date"
            placeholder=""
            data-table="Spouse"
            data-field_name="marriage_date"
            data-subtable="none"
            className="form-control"
            value={
              formData.marriage_date?.value ||
              selectedClient?.spouse?.marriage_date ||
              ""
            }
            onChange={handleDateChange}
          />
        </div>
      </div>
      {/* Divorced Data */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Divorced Date:</p>
        </div>
        <div className="col-md-9">
          <input
            type="date"
            name="divorce_date"
            placeholder=""
            data-table="Spouse"
            data-field_name="divorce_date"
            data-subtable="none"
            className="form-control"
            value={
              formData.divorce_date?.value ||
              selectedClient?.spouse?.divorce_date ||
              ""
            }
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* Address 1 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Address 1:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="spouse_address1"
            placeholder="Enter Spouse Address 1"
            data-table="Spouse"
            data-field_name="address1"
            data-subtable="contact"
            className="form-control"
            value={
              formData.spouse_address1?.value ||
              selectedClient?.spouse?.contact?.address1 ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Address 2 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Address 2:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="spouse_address2"
            placeholder="Enter Spouse Address 2"
            data-table="Spouse"
            data-field_name="address2"
            data-subtable="contact"
            className="form-control"
            value={
              formData.spouse_address2?.value ||
              selectedClient?.spouse?.contact?.address2 ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* City */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">City:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="spouse_city"
            placeholder="Enter Spouse City"
            data-table="Spouse"
            data-field_name="city"
            data-subtable="contact"
            className="form-control"
            value={
              formData.spouse_city?.value ||
              selectedClient?.spouse?.contact?.city ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* State & Zip */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">State:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="spouse_state"
            placeholder="Enter Spouse State"
            data-table="Spouse"
            data-field_name="state"
            data-subtable="contact"
            className="form-control"
            value={
              formData.spouse_state?.value ||
              selectedClient?.spouse?.contact?.state ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-1">
          <p className="text-secondary whitespace-nowrap">Zip:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="spouse_zip"
            placeholder="Enter Spouse Zip"
            data-table="Spouse"
            data-field_name="zip"
            data-subtable="contact"
            className="form-control"
            value={
              formData.spouse_zip?.value ||
              selectedClient?.spouse?.contact?.zip ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      <h5 className="font-weight-bold m-b-5">Emergency Contact</h5>
      {/* Emegency RelationShip */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Relationship:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="emergency_relationship"
            placeholder="Enter Relationship"
            data-table="EmergencyContact"
            data-field_name="relationship"
            data-subtable="none"
            className="form-control"
            value={
              formData.emergency_relationship?.value ||
              selectedClient?.emergency_contact?.relationship ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* First Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">First Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="emergency_first_name"
            placeholder="Enter Emergency First Name"
            data-table="EmergencyContact"
            data-field_name="first_name"
            data-subtable="none"
            className="form-control"
            value={
              formData.emergency_first_name?.value ||
              selectedClient?.emergency_contact?.first_name ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Last Name */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Last Name:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="emergency_last_name"
            placeholder="Enter Emergency Last Name"
            data-table="EmergencyContact"
            data-field_name="last_name"
            data-subtable="none"
            className="form-control"
            value={
              formData.emergency_last_name?.value ||
              selectedClient?.emergency_contact?.last_name ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Discuss Case */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Discuss Case:</p>
        </div>
        <div class="col-md-9 d-flex justify-content-center">
          <input
            type="checkbox"
            name="emergency_discussCase"
            class=""
            placeholder=""
            data-table="EmergencyContact"
            data-field_name="discussCase"
            data-subtable="none"
            onChange={handleCheckBoxChange}
            checked={
              formData.emergency_discussCase?.value ||
              selectedClient?.emergency_contact?.discussCase ||
              false
            }
          />
        </div>
      </div>

      {/* Address 1 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Address 1:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="emergency_address1"
            placeholder="Enter Emergency Address 1"
            data-table="EmergencyContact"
            data-field_name="address1"
            data-subtable="contact"
            className="form-control"
            value={
              formData.emergency_address1?.value ||
              selectedClient?.emergency_contact?.contact?.address1 ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Address 2 */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">Address 2:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="emergency_address2"
            placeholder="Enter Emergency Address 2"
            data-table="EmergencyContact"
            data-field_name="address2"
            data-subtable="contact"
            className="form-control"
            value={
              formData.emergency_address2?.value ||
              selectedClient?.emergency_contact?.contact?.address2 ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* City */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">City:</p>
        </div>
        <div className="col-md-9">
          <input
            type="text"
            name="emergency_city"
            placeholder="Enter Emergency City"
            data-table="EmergencyContact"
            data-field_name="city"
            data-subtable="contact"
            className="form-control"
            value={
              formData.emergency_city?.value ||
              selectedClient?.emergency_contact?.contact?.city ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* State & Zip */}
      <div className="row mb-1 align-items-center">
        <div className="col-md-3">
          <p className="text-secondary whitespace-nowrap">State:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="emergency_state"
            placeholder="Enter Emergency State"
            data-table="EmergencyContact"
            data-field_name="state"
            data-subtable="contact"
            className="form-control"
            value={
              formData.emergency_state?.value ||
              selectedClient?.emergency_contact?.contact?.state ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-1">
          <p className="text-secondary whitespace-nowrap">Zip:</p>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="emergency_zip"
            placeholder="Enter Emergency Zip"
            data-table="EmergencyContact"
            data-field_name="zip"
            data-subtable="contact"
            className="form-control"
            value={
              formData.emergency_zip?.value ||
              selectedClient?.emergency_contact?.contact?.zip ||
              ""
            }
            onChange={handleInputChange}
          />
        </div>
      </div>

      <br />
      <br />
      <br />
    </div>
  );
};

export default ClientTab;
