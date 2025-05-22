import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import InputWithOutLabels from "../../common/InputWithoutLabel";
import api from "../../../../api/api";

const EditUserModal = ({ show, handleClose, userData, refetch }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [sbn, setSBN] = useState("");
  console.log(userData);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.user.first_name);
      setLastName(userData.user.last_name);
      setEmail(userData.user.email);
      setSBN(userData.statebarnumber);
    }
  }, [userData]);

  const handleSubmit = async () => {
    try {
      const response = await api.patch(
        `/api/firmsetting-page/attorneystaff/${userData.id}/edit/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          statebarnumber: sbn,
        }
      );
      if (response.status === 200) {
        handleClose();
        setFirstName("");
        setLastName("");
        setEmail("");
        setSBN("");
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const ModalData = [
    {
      name: "First Name",
      value: firstName,
      onChange: (e) => setFirstName(e.target.value),
    },
    {
      name: "Last Name",
      value: lastName,
      onChange: (e) => setLastName(e.target.value),
    },
    {
      name: "Email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      name: "SBN",
      value: sbn,
      onChange: (e) => setSBN(e.target.value),
    },
  ];

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px" }}>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ModalData.map((inputData, idx) => {
          return (
            <div className="row align-items-center form-group" key={idx}>
              <div className="col-md-2 text-left">
                <span className="d-inline-block text-grey text-nowrap">
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
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
