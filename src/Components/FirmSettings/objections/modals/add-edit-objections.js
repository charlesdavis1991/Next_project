import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useEditObjection, useSaveObjection } from "../hooks/useGetObjections";
import InputWithOutLabels from "../../common/InputWithoutLabel";

const AddEditObjectionModal = ({
  showModal,
  handleClose,
  filters,
  refetch,
  case_types,
  isEdit = false,
  filledData = {},
  filtersRefetch,
}) => {
  const [jurisdiction, setJurisdiction] = useState("all");
  const [casetype, setCaseType] = useState("all");
  const [name, setName] = useState("");
  const [objection, setObjection] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");

  console.log("case_types", case_types);
  useEffect(() => {
    if (isEdit && filledData) {
      setJurisdiction(filledData?.jurisdictiontype?.id || "");
      setCaseType(filledData?.case_type?.id || "");
      setName(filledData?.name || "");
      setObjection(filledData?.objection || "");
      setCategory(filledData?.category || "");
      setVenue(filledData?.venue || "");
      setState(filledData?.state?.id || "");
      setCounty(filledData?.county?.id || "");
    }
  }, [isEdit, filledData]);

  const { saveObjection } = useSaveObjection();
  const { editObjection } = useEditObjection();

  const handleSubmit = async () => {
    const payload = {
      jurisdiction_type_id: jurisdiction,
      case_type_id: casetype,
      name,
      objection,
      venue,
      category,
      state,
      county: county,
    };

    try {
      if (isEdit) {
        payload.objection_id = filledData?.id;
        await editObjection(payload);
      } else {
        await saveObjection(payload);
      }
      filtersRefetch();
      refetch();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const ModalData = [
    {
      name: "Jurisdiction",
      value: Number(jurisdiction),
      onChange: (e) => setJurisdiction(e.target.value),
    },
    {
      name: "Case Type",
      value: Number(casetype),
      onChange: (e) => setCaseType(e.target.value),
    },

    {
      name: "Name",
      value: name,
      onChange: (e) => setName(e.target.value),
    },
    {
      name: "Objection",
      value: objection,
      onChange: (e) => setObjection(e.target.value),
    },
    {
      name: "Venue",
      value: venue,
      onChange: (e) => setVenue(e.target.value),
    },
    {
      name: "Category",
      value: category,
      onChange: (e) => setCategory(e.target.value),
    },
    {
      name: "State",
      value: Number(state),
      onChange: (e) => setState(e.target.value),
    },

    {
      name: "County",
      value: Number(county),
      onChange: (e) => setCounty(e.target.value),
    },
  ];
  return (
    <Modal size="md" show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title style={{ fontSize: "15px" }}>
          {isEdit ? "Edit Objection" : "New Objection"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ModalData.map((inputData, idx) => {
          if (inputData.name === "Jurisdiction") {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    value={inputData.value}
                    onChange={inputData.onChange}
                    className="form-select"
                  >
                    <option value="all">All</option>
                    {filters?.jurisdiction_types?.map((jurisdiction) => (
                      <option
                        selected={jurisdiction.id === inputData.value}
                        key={jurisdiction.id}
                        value={jurisdiction.id}
                      >
                        {jurisdiction.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          } else if (inputData.name === "Case Type") {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left text-nowrap">
                  <span className="d-inline-block text-grey">
                    {inputData.name}
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    value={inputData.value}
                    onChange={inputData.onChange}
                    className="form-select color-grey"
                  >
                    <option value="all">All</option>
                    {case_types?.map((caseType) => (
                      <option
                        selected={caseType.id === inputData.value}
                        key={caseType.id}
                        value={caseType.id}
                      >
                        {caseType.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          } else if (inputData.name === "State") {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    value={inputData.value}
                    onChange={inputData.onChange}
                    className="form-select"
                  >
                    <option value="all">All</option>
                    {filters?.states?.map((state) => (
                      <option
                        selected={state.id === inputData.value}
                        key={state.id}
                        value={state.id}
                      >
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          } else if (inputData.name === "County") {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}
                  </span>
                </div>
                <div className="col-md-10">
                  <select
                    value={inputData.value}
                    onChange={inputData.onChange}
                    className="form-select"
                  >
                    <option value="all">All</option>
                    {filters?.counties?.map((county) => (
                      <option
                        selected={county.id === inputData.value}
                        key={county.id}
                        value={county.id}
                      >
                        {county.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          } else {
            return (
              <div className="row align-items-center form-group" key={idx}>
                <div className="col-md-2 text-left">
                  <span className="d-inline-block text-grey">
                    {inputData.name}
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
          {isEdit ? "Save" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditObjectionModal;
