import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import InputWithOutLabels from "../../common/InputWithoutLabel";
import { useEditSaveAddress, useSaveAddress } from "../hooks/useFirmAddress";
import { formatPhoneNumber } from "../../../../Utils/helper";

const AddEditModal = ({
  showModal,
  handleClose,
  data,
  refetch,
  isEdit = false,
  filledData = {},
}) => {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [firmAddressName, setFirmAddressName] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [email, setEmail] = useState("");

  const { saveAddress } = useSaveAddress();
  const { editAddress } = useEditSaveAddress();
  useEffect(() => {
    if (isEdit && filledData) {
      setFirmAddressName(filledData?.name || "");
      setAddress1(filledData?.address1 || "");
      setAddress2(filledData?.address2 || "");
      setCity(filledData?.city || "");
      setZip(filledData?.zip || "");
      setState(filledData?.state_abr || "");
      setPhone(formatPhoneNumber(filledData?.phone_number) || "");
      setFax(formatPhoneNumber(filledData?.fax) || "");
      setEmail(filledData?.email || "");
    }
  }, [isEdit, filledData]);

  const ModalData = [
    {
      name: "Firm Name",
      value: firmAddressName,
      onChange: (e) => setFirmAddressName(e.target.value),
    },
    {
      name: "Address 1",
      value: address1,
      onChange: (e) => setAddress1(e.target.value),
    },
    {
      name: "Address 2",
      value: address2,
      onChange: (e) => setAddress2(e.target.value),
    },
    {
      name: "City",
      value: city,
      onChange: (e) => setCity(e.target.value),
    },
    {
      name: "State",
      value: state,
      onChange: (e) => setState(e.target.value),
    },
    {
      name: "Zip",
      value: zip,
      onChange: (e) => setZip(e.target.value),
    },
    {
      name: "Phone",
      value: phone,
      onChange: (e) => setPhone(e.target.value),
    },
    {
      name: "Fax",
      value: fax,
      onChange: (e) => setFax(e.target.value),
    },
    {
      name: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
  ];

  const handleSubmit = async () => {
    const payload = {
      name: firmAddressName,
      firm_address1: address1,
      firm_address2: address2,
      firm_city: city,
      firm_state: state,
      firm_zip: zip,
      firm_email: email,
      firm_fax: fax,
      firm_phone: phone,
    };

    try {
      if (isEdit) {
        payload.contact_id = filledData?.id;

        await editAddress(payload);
      } else {
        await saveAddress(payload);
      }
      refetch();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal size="lg" show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title style={{ fontSize: "15px" }}>
          {isEdit ? "Edit Address" : "Add Address"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ModalData.map((inputData, idx) => {
          if (inputData.name === "State") {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}:{" "}
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    value={inputData.value}
                    onChange={inputData.onChange}
                    className="form-select"
                  >
                    <option value="">Select a State</option>
                    {data?.states?.map((state) => (
                      <option
                        selected={state.StateAbr === inputData.value}
                        key={state.id}
                        value={state.StateAbr}
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          } else if (inputData.name === "Phone" || inputData.name === "Fax") {
            const handlePhoneFaxChange = (e) => {
              let numbers = e.target.value.replace(/\D/g, "");
              let formattedValue = numbers;

              if (numbers.length > 3) {
                formattedValue = `(${numbers.slice(0, 3)})`;
                if (numbers.length > 3) {
                  formattedValue += ` ${numbers.slice(3, 6)}`;
                }
                if (numbers.length > 6) {
                  formattedValue += `-${numbers.slice(6, 10)}`;
                }
              }

              inputData.onChange({ target: { value: formattedValue } });
            };

            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}:{" "}
                  </span>
                </div>
                <InputWithOutLabels
                  cn="col-md-10"
                  placeholder={`Enter ${inputData.name}`}
                  type={"text"}
                  value={inputData.value}
                  onChange={handlePhoneFaxChange}
                />
              </div>
            );
          } else {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}:{" "}
                  </span>
                </div>
                <InputWithOutLabels
                  cn="col-md-10"
                  placeholder={`Enter ${inputData.name}`}
                  type={"text"}
                  value={inputData.value}
                  onChange={inputData.onChange}
                />
              </div>
            );
          }
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {isEdit ? "Update Address" : "Save Address"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditModal;
