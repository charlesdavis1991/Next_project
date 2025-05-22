import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getCaseId, getClientId, getToken } from "../../Utils/helper";

const FinalModal = ({ show, handleClose, injuryId, onSave }) => {
  const [formData, setFormData] = useState({});
  const [injuryData, setInjuryData] = useState({});
  const [caseProviders, setCaseProviders] = useState([]);

  //
  const origin = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (injuryId) {
      fetchInjuryDetails(injuryId);
    }
  }, [injuryId]);

  const fetchInjuryDetails = async (injuryId) => {
    try {
      const response = await fetch(origin + `/api/injuries/${injuryId}/details/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }
      const data = await response.json();
      //alert(JSON.stringify(data, null, 2));
      setInjuryData(data.injury_data);
      setCaseProviders(data.case_providers);
      initializeFormData(data.injury_data.injury_details);
    } catch (error) {
        //alert("Error: " + error.toString());
      console.error("Error fetching injury details:", error);
    }
  };

  const initializeFormData = (details) => {
    const initialData = {};
    details.forEach(detail => {
      initialData[detail.provider] = { linked: true, note: detail.note };
    });
    setFormData(initialData);
  };

  const handleChange = (providerId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    //alert("Submitting form data:", formData);
    const formattedData = {};
    Object.keys(formData).forEach(providerId => {
      formattedData[`checkbox_${providerId}`] = formData[providerId].linked;
      formattedData[`note_${providerId}`] = formData[providerId].note;
    });
    onSave(formattedData);
    //handleClose();
  };

  function mixColorWithWhite(hex, percentage) {
    const whitePercentage = (100 - percentage) / 100;

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r + (255 - r) * whitePercentage);
    g = Math.floor(g + (255 - g) * whitePercentage);
    b = Math.floor(b + (255 - b) * whitePercentage);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header className="text-center height-35 p-0 bg-primary rounder-0 border-0 text-white" closeButton>
        <Modal.Title className="mx-auto">{injuryData.body_part ? `${injuryData.body_part.name}: Link Medical Providers, Records and Notes` : "Add Notes and Link Medical Providers"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <table className="table table-borderless table-striped table-earning injuires-table has-height-25">
            <thead>
              <tr id="tb-header">
                <th className="text-center">PROVIDER</th>
                <th className="text-center">LINKED</th>
                <th className="w-100 text-center">NOTES</th>
              </tr>
            </thead>
            <tbody>
              {caseProviders.map((provider) => {
                const specialtyColor = provider.specialty.color;
                const backgroundColor = mixColorWithWhite(specialtyColor, 10);

                return (
                  <tr key={provider.id} className={`hover has-speciality-color-${provider.specialty.id}`}>
                    <td
                      className="provider-field td-autosize bg-speciality-10"
                      id="provider-td"
                      style={{ backgroundColor: backgroundColor }}
                    >
                      <div className="d-flex">
                        <div
                          className="d-flex align-items-center p-1 h-100 m-r-5 text-center justify-content-center font-weight-600 injury-color-white"
                          style={{ background: provider.specialty.color }}
                          id="max-h-25"
                        >
                          <p className="injury-color-white">{provider.specialty.name.charAt(0)}</p>

                        </div>
                        <div className="align-self-center">
                          <p className="finalModal-p">{provider.location.added_by.providerprofile.office_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td-autosize text-center">
                      <input
                        type="checkbox"
                        checked={formData[provider.id]?.linked || false}
                        onChange={(e) => handleChange(provider.id, 'linked', e.target.checked)}
                        style={{marginLeft: '-0.25rem'}}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={formData[provider.id]?.note || ''}
                        placeholder="Add Note About Injured Body Part"
                        onChange={(e) => handleChange(provider.id, 'note', e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
              <tr class="hover has-speciality-color-">
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
              <tr class="hover has-speciality-color-">
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
            </tbody>
          </table>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FinalModal;
