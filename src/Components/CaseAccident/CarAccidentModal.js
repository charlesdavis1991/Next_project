import React, { useState, useEffect, useTransition } from "react";
import AcciLocationModal from "./AcciLocationModal";
import LocationDescModal from "./LocationDescModal";
import AcciDescriptionModal from "./AcciDescriptionModal";
import AcciInfoModal from "./AcciInfoModal";
import DefendantsFaultModal from "./DefendantsFaultModal";
import { useSelector, useDispatch } from "react-redux";
import { getCaseId, getClientId } from "../../Utils/helper";
import api from "../../api/api";
import { fetchAccidentData } from "../../Redux/accident/accidentSlice";

const CarAccidentModal = ({ handleClose, showTab }) => {
  console.log(showTab);
  const dispatch = useDispatch();
  const clientId = getClientId();
  const caseId = getCaseId();
  const accidentData = useSelector((state) => state.accident.current);
  const defendants = useSelector((state) => state.accident.defendants);
  const states = useSelector((state) => state.clientProvider.states);
  const [tabType, setTabType] = useState("");

  const [locationDesc, setLocationDesc] = useState(accidentData.description);
  const [accidentDesc, setAccidentDesc] = useState(
    accidentData.accident_description
  );
  const [accidentTypeID, setAccidentTypeID] = useState(0);
  const [checkboxValues, setCheckboxValues] = useState([]);
  const [radioBoxValues, setRadioBoxValues] = useState([]);
  const [accLocationState, setAccLocationState] = useState({
    location_name: accidentData.contact.name,
    address1: accidentData.contact.address1,
    address2: accidentData.contact.address2,
    city: accidentData.contact.city,
    state: accidentData.contact.state,
    zip: accidentData.contact.zip,
  });
  const [defendantData, setDefendantData] = useState({
    first_name: "",
    last_name: "",
    fault_percent: "",
    id: "",
  });

  const [pending, startTransition] = useTransition();

  const radVals = {
    ambulance: accidentData.ambulance,
    emergencyRoom: accidentData.emergencyRoom,
    lossOfConc: accidentData.lossOfConc,
    reportTaken: accidentData.reportTaken,
  };
  const checkVals = {
    dry: accidentData.dry,
    wet: accidentData.wet,
    raining: accidentData.raining,
    fog: accidentData.fog,
    cloudy: accidentData.cloudy,
  };

  const toggleTab = (type) => {
    setTabType(type);
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckboxValues([...checkboxValues, value]);
    } else {
      setCheckboxValues(checkboxValues.filter((item) => item !== value));
    }
  };

  const handleUncheckRadioChange = (event) => {
    const value = event.target.value;
    setRadioBoxValues(radioBoxValues.filter((item) => item !== value));
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setRadioBoxValues([...radioBoxValues, value]);
    } else {
      setRadioBoxValues(radioBoxValues.filter((item) => item !== value));
    }
  };

  const handleAccidentModal = () => {
    startTransition(async () => {
      let formData = {
        caraccident_id: accidentData.id,
        loc_description: locationDesc,
        acc_description: accidentDesc,
        accident_type:
          accidentTypeID === 0 ? accidentData.accident_type.id : accidentTypeID,
        wetRadio: checkboxValues.includes("wet") ? "True" : "False",
        rainingRadio: checkboxValues.includes("raining") ? "True" : "False",
        fogRadio: checkboxValues.includes("fog") ? "True" : "False",
        cloudyRadio: checkboxValues.includes("cloudy") ? "True" : "False",
        dryRadio: checkboxValues.includes("dry") ? "True" : "False",
        ambulanceRadio: radioBoxValues.includes("ambulance") ? "True" : "False",
        emergencyRadio: radioBoxValues.includes("emergencyRoom")
          ? "True"
          : "False",
        lossRadio: radioBoxValues.includes("lossOfConc") ? "True" : "False",
        reportRadio: radioBoxValues.includes("reportTaken") ? "True" : "False",
        defendant: defendantData,
      };
      formData = { ...formData, ...accLocationState };
      await api
        .put(`/api/accidents/${clientId}/${caseId}/`, formData)
        .then(async (response) => {
          if (response.data.status === 200) {
            if (handleClose) {
              handleClose();
              await dispatch(fetchAccidentData(clientId, caseId));
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    });
  };

  const updateDefendant = (type, val) => {
    if (type === "select") {
      const foundObject = defendants.find((item) => item.id === val);
      setDefendantData({
        ...defendantData,
        id: foundObject.id,
        first_name: foundObject.first_name,
        last_name: foundObject.last_name,
        id: foundObject.id,
      });
    }
    if (type === "fault") {
      setDefendantData({ ...defendantData, fault_percent: val });
    }
  };

  const updateLocationDetail = (type, val) => {
    if (type === "location") {
      setAccLocationState({ ...accLocationState, location_name: val });
    }
    if (type === "address1") {
      setAccLocationState({ ...accLocationState, address1: val });
    }
    if (type === "address2") {
      setAccLocationState({ ...accLocationState, address2: val });
    }
    if (type === "city") {
      setAccLocationState({ ...accLocationState, city: val });
    }
    if (type === "state") {
      const foundObject = states.find((item) => item.StateAbr === val);
      setAccLocationState({ ...accLocationState, state: foundObject.StateAbr });
    }
    if (type === "zip") {
      setAccLocationState({ ...accLocationState, zip: val });
    }
  };
  useEffect(() => {
    setTabType(showTab);

    const trueRadioVal = [];
    const trueCheckVal = [];

    for (const key in radVals) {
      if (radVals[key]) {
        trueRadioVal.push(key);
      }
    }
    for (const key in checkVals) {
      if (checkVals[key]) {
        trueCheckVal.push(key);
      }
    }

    // console.log(trueRadioVal, trueCheckVal, accidentData.accident_description);

    setRadioBoxValues(trueRadioVal);
    setCheckboxValues(trueCheckVal);
  }, [showTab]);
  return (
    <>
      <div className="modal-header text-center border-0">
        <h5 className="modal-title mx-auto">
          Accident Information and Location
        </h5>
      </div>
      <div
        className="nav nav-tabs justify-content-around"
        id="nav-tab"
        role="tablist"
      >
        <a
          className={`nav-item nav-link Pad8 tab-item text-uppercase ${tabType === "accidentInfo" ? "active" : ""}`}
          id="accident-info-link"
          data-toggle="tab"
          href="#provider-tab"
          role="tab"
          aria-controls="provider-tab"
          aria-selected="true"
          onClick={() => toggleTab("accidentInfo")}
        >
          Accident Info
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item text-uppercase ${tabType === "accidentLocation" ? "active" : ""}`}
          id="accident-loc-link"
          data-toggle="tab"
          href="#provider-tab"
          role="tab"
          aria-controls="provider-tab"
          aria-selected="true"
          onClick={() => toggleTab("accidentLocation")}
        >
          Accident Location
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item text-uppercase ${tabType === "locationDesc" ? "active" : ""}`}
          id="location_desc-link"
          data-toggle="tab"
          href="#provider-tab"
          role="tab"
          aria-controls="provider-tab"
          aria-selected="true"
          onClick={() => toggleTab("locationDesc")}
        >
          Location Description
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item text-uppercase ${tabType === "accidentDesc" ? "active" : ""}`}
          id="accidet_desc-link"
          data-toggle="tab"
          href="#provider-tab"
          role="tab"
          aria-controls="provider-tab"
          aria-selected="true"
          onClick={() => toggleTab("accidentDesc")}
        >
          Accident Description
        </a>
        <a
          className={`nav-item nav-link Pad8 tab-item text-uppercase ${tabType === "defendantsFault" ? "active" : ""}`}
          id="defendantsFault-link"
          data-toggle="tab"
          href="#provider-tab"
          role="tab"
          aria-controls="provider-tab"
          aria-selected="true"
          onClick={() => toggleTab("defendantsFault")}
        >
          Defendants At-Fault
        </a>
      </div>
      <div className="tab-content mt-2" id="nav-tabContent">
        <div
          className={`tab-pane fade ${tabType === "accidentInfo" ? "show active" : ""}`}
          id="accident-info-link"
          role="tabpanel"
          aria-labelledby="provider-link"
        >
          <AcciInfoModal
            onCheckboxChange={handleCheckboxChange}
            checkboxValues={checkboxValues}
            onRadioBoxChange={handleRadioChange}
            handleUncheckRadioChange={handleUncheckRadioChange}
            radioBoxValues={radioBoxValues}
          />
        </div>
        <div
          className={`tab-pane fade ${tabType === "accidentLocation" ? "show active" : ""}`}
          id="accident-loc-link"
          role="tabpanel"
          aria-labelledby="provider-link"
        >
          <AcciLocationModal
            accLocation={accLocationState}
            updateLocationDetail={updateLocationDetail}
          />
        </div>
        <div
          className={`tab-pane fade ${tabType === "locationDesc" ? "show active" : ""}`}
          id="location_desc-link"
          role="tabpanel"
          aria-labelledby="provider-link"
        >
          <LocationDescModal
            setLocationDesc={setLocationDesc}
            inputVal={accidentData.description}
          />
        </div>
        <div
          className={`tab-pane fade ${tabType === "accidentDesc" ? "show active" : ""}`}
          id="accidet_desc-link"
          role="tabpanel"
          aria-labelledby="provider-link"
        >
          <AcciDescriptionModal
            setAccidentDesc={setAccidentDesc}
            setAccidentTypeID={setAccidentTypeID}
            inputVal={accidentData.accident_description}
            accident_type={accidentData.accident_type}
          />
        </div>
        <div
          className={`tab-pane fade ${tabType === "defendantsFault" ? "show active" : ""}`}
          id="defendantsFault-link"
          role="tabpanel"
          aria-labelledby="provider-link"
        >
          <DefendantsFaultModal
            defendants={defendants}
            updateDefendant={updateDefendant}
          />
        </div>
      </div>
      <div className="modal-footer border-0 justify-content-between pt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
        >
          Cancel
        </button>
        {pending ? (
          <div className="loader" />
        ) : (
          <button
            form="edit_case_date_form"
            onClick={handleAccidentModal}
            type="button"
            className="btn btn-success"
          >
            Save
          </button>
        )}
      </div>
    </>
  );
};

export default CarAccidentModal;
