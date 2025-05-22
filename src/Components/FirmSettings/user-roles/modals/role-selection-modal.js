import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RoleSelectionModal = ({
  show,
  handleClose,
  handleSave,
  userRoles,
  userId,
  refetch,
  userDefinedRoles,
}) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [hourlyRates, setHourlyRates] = useState({});
  const handleCheckboxChange = (role) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(role)
        ? prevSelected.filter((r) => r !== role)
        : [...prevSelected, role]
    );
  };
  useEffect(() => {
    if (userId) {
      const user = userDefinedRoles.find((user) => user.id === userId);

      if (user) {
        setSelectedRoles(
          user?.firm_roles[0]?.for_firm_usertype?.map((role) => role.id)
        );
        setHourlyRates(
          user?.hourly_rates?.reduce((acc, role) => {
            if (role?.for_role?.id) {
              acc[role.for_role.id] = role.rate;
            }
            return acc;
          }, {})
        );
      }
    }
  }, [userId, userDefinedRoles]);

  const handleHourlyRateChange = (roleId, rate) => {
    setHourlyRates((prevRates) => ({
      ...prevRates,
      [roleId]: rate,
    }));
  };

  const handleSaveRoles = async () => {
    const payload = userRoles.reduce((acc, role) => {
      acc[role.id] = selectedRoles.includes(role.id);

      acc[`hourly_rate_${role.id}`] = selectedRoles.includes(role.id)
        ? parseFloat(hourlyRates[role.id]) || 0.0
        : 0.0;

      return acc;
    }, {});

    payload.user_id = userId;

    await handleSave(payload);
    refetch();
    handleClose();
    setSelectedRoles([]);
    setHourlyRates({});
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "15px" }}>
          Check the boxes of all the roles this Firm User can hold in the firm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {userRoles?.map((role) => (
            <div
              key={role.id}
              className="d-flex justify-content-between align-items-center m-b-5"
              style={{ width: "100%" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ flexBasis: "50%" }}
              >
                <Form.Check
                  type="checkbox"
                  label={role.name}
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleCheckboxChange(role.id)}
                  style={{ flexShrink: 0 }}
                />
              </div>
              <div style={{ flexBasis: "45%" }}>
                <Form.Control
                  type="text"
                  placeholder="Enter Hourly Rate"
                  value={hourlyRates[role.id] || ""}
                  onChange={(e) =>
                    handleHourlyRateChange(role.id, e.target.value)
                  }
                  disabled={!selectedRoles.includes(role.id)}
                />
              </div>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveRoles}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoleSelectionModal;
