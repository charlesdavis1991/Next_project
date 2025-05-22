import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import useGetClientFilters, { useSaveClients } from "./hooks/useGetClientMerge";
import ClientTab from "./client-tab";

const ClientMerge = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [duplicateSearchTerm, setDuplicateSearchTerm] = useState("");
  const [formData, setFormData] = useState({});
  const [duplicateFormData, setDuplicateFormData] = useState({});

  console.log(duplicateFormData);

  const { data, refetch } = useGetClientFilters();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientDuplicate, setSelectedClientDuplicate] = useState(null);

  const filteredClients =
    data?.filter(
      (client) =>
        client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const DuplicateClient =
    data?.filter(
      (client) =>
        client.first_name
          ?.toLowerCase()
          .includes(duplicateSearchTerm.toLowerCase()) ||
        client.last_name
          ?.toLowerCase()
          .includes(duplicateSearchTerm.toLowerCase())
    ) || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDuplicateSearch = (e) => {
    setDuplicateSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        value,
        field_name: dataset.field_name,
        table: dataset.table,
        subtable: dataset.subtable,
      },
    }));
  };

  const handleCheckBoxChange = (e) => {
    const { name, type, checked, value, dataset } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        value: type === "checkbox" ? checked : value,
        field_name: dataset.field_name,
        table: dataset.table,
        subtable: dataset.subtable,
      },
    }));
  };

  const handleDateChange = (e) => {
    const { name, type, checked, value, dataset } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        value: type === "checkbox" ? checked : type === "date" ? value : value,
        field_name: dataset.field_name,
        table: dataset.table,
        subtable: dataset.subtable,
      },
    }));
  };

  const handleDuplicateInputChange = (e) => {
    const { name, value, dataset } = e.target;
    setDuplicateFormData((prev) => ({
      ...prev,
      [name]: {
        value,
        field_name: dataset.field_name,
        table: dataset.table,
        subtable: dataset.subtable,
      },
    }));
  };

  const handleDuplicateCheckBoxChange = (e) => {
    const { name, type, checked, value, dataset } = e.target;
    setDuplicateFormData((prev) => ({
      ...prev,
      [name]: {
        value: type === "checkbox" ? checked : value,
        field_name: dataset.field_name,
        table: dataset.table,
        subtable: dataset.subtable,
      },
    }));
  };

  const handleDuplicateDateChange = (e) => {
    const { name, type, checked, value, dataset } = e.target;

    setDuplicateFormData((prev) => ({
      ...prev,
      [name]: {
        value: type === "checkbox" ? checked : type === "date" ? value : value,
        field_name: dataset.field_name,
        table: dataset.table,
        subtable: dataset.subtable,
      },
    }));
  };
  const { clientMerge } = useSaveClients();

  const prepareDataForBackend = () => {
    const mergedData = {};

    if (
      Object.keys(formData).length === 0 &&
      Object.keys(duplicateFormData).length === 0 &&
      selectedClientDuplicate
    ) {
      [
        "first_name",
        "middle_name",
        "last_name",
        "title",
        "gender",
        "birthday",
        "ssn",
        "driver_license_number",
        "driver_license_state",
        "billing_discount_percent",
        "client_billing_rate",
        "entity_name",
      ].forEach((field) => {
        if (selectedClientDuplicate[field] && !selectedClient[field]) {
          mergedData[field] = {
            value: selectedClientDuplicate[field],
            field_name: field,
            table: "Client",
            subtable: "None",
          };
        }
      });

      if (
        selectedClientDuplicate.primary_phone?.phone_number &&
        !selectedClient.primary_phone?.phone_number
      ) {
        mergedData.primary_phone = {
          value: selectedClientDuplicate.primary_phone.phone_number,
          field_name: "phone_number",
          table: "Contact",
          subtable: "primary_phone",
        };
      }

      if (
        selectedClientDuplicate.primary_email?.email &&
        !selectedClient.primary_email?.email
      ) {
        mergedData.primary_email = {
          value: selectedClientDuplicate.primary_email.email,
          field_name: "email",
          table: "Contact",
          subtable: "primary_email",
        };
      }

      if (
        selectedClientDuplicate.entity_type?.entity_type &&
        !selectedClient.entity_type?.entity_type
      ) {
        mergedData.entity_type = {
          value: selectedClientDuplicate.entity_type.entity_type,
          field_name: "entity_type",
          table: "EntityType",
          subtable: "entity_type",
        };
      }

      ["contact_1", "contact_2", "contact_3"].forEach((contact) => {
        if (
          selectedClientDuplicate[contact]?.phone_number &&
          !selectedClient[contact]?.phone_number
        ) {
          mergedData[`phone_${contact.split("_")[1]}`] = {
            value: selectedClientDuplicate[contact].phone_number,
            field_name: "phone_number",
            table: "Contact",
            subtable: contact,
          };
        }
        if (
          selectedClientDuplicate[contact]?.email &&
          !selectedClient[contact]?.email
        ) {
          mergedData[`email_${contact.split("_")[1]}`] = {
            value: selectedClientDuplicate[contact].email,
            field_name: "email",
            table: "Contact",
            subtable: contact,
          };
        }
      });

      ["address1", "address2", "city", "state", "zip"].forEach((field) => {
        if (
          selectedClientDuplicate.mailing_contact?.[field] &&
          !selectedClient.mailing_contact?.[field]
        ) {
          mergedData[`mailing_${field}`] = {
            value: selectedClientDuplicate.mailing_contact[field],
            field_name: field,
            table: "Contact",
            subtable: "mailing_contact",
          };
        }
      });

      if (selectedClientDuplicate.spouse) {
        [
          "relationship",
          "first_name",
          "last_name",
          "discussCase",
          "divorced",
          "marriage_date",
          "divorce_date",
        ].forEach((field) => {
          if (
            selectedClientDuplicate.spouse[field] &&
            !selectedClient.spouse?.[field]
          ) {
            mergedData[`spouse_${field}`] = {
              value: selectedClientDuplicate.spouse[field],
              field_name: field,
              table: "Spouse",
              subtable: "none",
            };
          }
        });

        if (selectedClientDuplicate.spouse.contact) {
          ["address1", "address2", "city", "state", "zip"].forEach((field) => {
            if (
              selectedClientDuplicate.spouse.contact[field] &&
              !selectedClient.spouse?.contact?.[field]
            ) {
              mergedData[`spouse_${field}`] = {
                value: selectedClientDuplicate.spouse.contact[field],
                field_name: field,
                table: "Spouse",
                subtable: "contact",
              };
            }
          });
        }
      }

      if (selectedClientDuplicate.emergency_contact) {
        ["relationship", "first_name", "last_name", "discussCase"].forEach(
          (field) => {
            if (
              selectedClientDuplicate.emergency_contact[field] &&
              !selectedClient.emergency_contact?.[field]
            ) {
              mergedData[`emergency_${field}`] = {
                value: selectedClientDuplicate.emergency_contact[field],
                field_name: field,
                table: "EmergencyContact",
                subtable: "none",
              };
            }
          }
        );

        if (selectedClientDuplicate.emergency_contact.contact) {
          ["address1", "address2", "city", "state", "zip"].forEach((field) => {
            if (
              selectedClientDuplicate.emergency_contact.contact[field] &&
              !selectedClient.emergency_contact?.contact?.[field]
            ) {
              mergedData[`emergency_${field}`] = {
                value: selectedClientDuplicate.emergency_contact.contact[field],
                field_name: field,
                table: "EmergencyContact",
                subtable: "contact",
              };
            }
          });
        }
      }

      return mergedData;
    }

    const isValueChanged = (value, fieldName, table, subtable) => {
      if (!selectedClient) return true;

      if (subtable && subtable !== "None") {
        if (table === "Contact") {
          if (subtable === "primary_phone") {
            return (
              !selectedClient.primary_phone?.phone_number ||
              selectedClient.primary_phone.phone_number !== value
            );
          } else if (subtable === "primary_email") {
            return (
              !selectedClient.primary_email?.email ||
              selectedClient.primary_email.email !== value
            );
          } else if (subtable === "mailing_contact") {
            return (
              !selectedClient.mailing_contact?.[fieldName] ||
              selectedClient.mailing_contact[fieldName] !== value
            );
          } else if (subtable.startsWith("contact_")) {
            return (
              !selectedClient[subtable]?.[fieldName] ||
              selectedClient[subtable][fieldName] !== value
            );
          }
        } else if (table === "Spouse" && subtable === "contact") {
          return (
            !selectedClient.spouse?.contact?.[fieldName] ||
            selectedClient.spouse.contact[fieldName] !== value
          );
        } else if (table === "EmergencyContact" && subtable === "contact") {
          return (
            !selectedClient.emergency_contact?.contact?.[fieldName] ||
            selectedClient.emergency_contact.contact[fieldName] !== value
          );
        }
      } else if (table && table !== "None") {
        if (table === "Client") {
          return (
            !selectedClient[fieldName] || selectedClient[fieldName] !== value
          );
        } else if (table === "Spouse") {
          return (
            !selectedClient.spouse?.[fieldName] ||
            selectedClient.spouse[fieldName] !== value
          );
        } else if (table === "EmergencyContact") {
          return (
            !selectedClient.emergency_contact?.[fieldName] ||
            selectedClient.emergency_contact[fieldName] !== value
          );
        } else if (table === "EntityType") {
          return (
            !selectedClient.entity_type?.[fieldName] ||
            selectedClient.entity_type[fieldName] !== value
          );
        }
      }
      return !selectedClient[fieldName] || selectedClient[fieldName] !== value;
    };

    const processField = (fieldData, key) => {
      const { value, field_name, table, subtable } = fieldData;

      if (value === null || value === undefined || value === "") return;

      if (isValueChanged(value, field_name, table, subtable)) {
        mergedData[key] = {
          value,
          field_name,
          table,
          subtable,
        };
      }
    };

    Object.entries(formData).forEach(([key, fieldData]) => {
      processField(fieldData, key);
    });

    Object.entries(duplicateFormData).forEach(([key, fieldData]) => {
      if (!formData[key] && !mergedData[key]) {
        processField(fieldData, key);
      }
    });

    return mergedData;
  };
  const handleMergeClick = async () => {
    const mergedData = prepareDataForBackend();
    console.log(mergedData);
    setFormData((prev) => ({
      ...prev,
      ...mergedData,
    }));
    await clientMerge({
      original_client_id: selectedClient?.id,
      duplicate_client_id: selectedClientDuplicate?.id,
      ...mergedData,
    });
    refetch();
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div
        className="d-flex justify-content-end m-b-15"
        style={{ paddingRight: "15px" }}
      >
        <button
          onClick={handleMergeClick}
          type="button"
          class="btn save-btn-popup popup-heading-color"
        >
          Merge Client
        </button>
      </div>
      <div className="row" style={{ paddingRight: "15px" }}>
        <ClientTab
          title={"Original Client"}
          setSelectedClient={setSelectedClient}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          filteredClients={filteredClients}
          formData={formData}
          selectedClient={selectedClient}
          handleInputChange={handleInputChange}
          handleCheckBoxChange={handleCheckBoxChange}
          handleDateChange={handleDateChange}
        />

        {/* Duplicate Client */}
        <ClientTab
          title={"Duplicate Client"}
          setSelectedClient={setSelectedClientDuplicate}
          searchTerm={duplicateSearchTerm}
          handleSearch={handleDuplicateSearch}
          filteredClients={DuplicateClient}
          formData={duplicateFormData}
          selectedClient={selectedClientDuplicate}
          handleInputChange={handleDuplicateInputChange}
          handleCheckBoxChange={handleDuplicateCheckBoxChange}
          handleDateChange={handleDuplicateDateChange}
        />
      </div>
    </div>
  );
};

export default ClientMerge;
