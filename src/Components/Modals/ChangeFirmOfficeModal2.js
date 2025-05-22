import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { getCaseId, getClientId } from "../../Utils/helper";
import { Button, Modal } from "react-bootstrap";
import { fetchCurrentCase } from "../../Redux/caseData/caseDataSlice";
import { useDispatch } from "react-redux";

export default function ChangeOfficeFirmLocationModal({
  showModal,
  handleClose,
}) {
  const [attorneyLocations, setAttorneyLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const fetchAttorneyLocations = async () => {
    try {
      const response = await api.get(`/api/attorney-locations/`);
      const data = await response.data;
      setAttorneyLocations(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAttorneyLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/update-firm-address/", {
        location_id: selectedLocationId,
        case_id: getCaseId(),
      });
      dispatch(fetchCurrentCase(getClientId(), getCaseId()));
      handleClose();
    } catch (e) {
      console.error("Error updating firm address:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (location) => {
    const parts = [
      location.address1,
      location.address2,
      `${location.city}, ${location.stateAbr} ${location.zip}`,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <Modal
      size="md"
      style={{ height: "100vh", top: "50%", transform: "translate(0,-25%)" }}
      show={showModal}
      onHide={handleClose}
    >
      <Modal.Header>
        <Modal.Title style={{ fontSize: "15px" }}>
          Select Firm Office Location
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {attorneyLocations.map((location) => (
          <div key={location.id} className="d-flex align-items-start m-b-5">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={`location-${location.id}`}
                name="selectedLocation"
                value={location.id}
                checked={selectedLocationId === location.id.toString()}
                onChange={(e) => setSelectedLocationId(e.target.value)}
              />
              <label
                className="form-check-label"
                htmlFor={`location-${location.id}`}
              >
                <div className="">
                  <p className="">{formatAddress(location)}</p>
                </div>
              </label>
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
