import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import SelectStateModal from "./state-modal/SelectStateModal";
import { api_without_cancellation } from "../../../api/api";
import ClientProvidersStyles from "../../CaseDashboard/ClientProvidersStyles";
import mixColorWithWhite from "../utils/helperFn";
import PR from "../../../assets/state-svg/puerto-rico";
import GU from "../../../assets/state-svg/guam";
import MP from "../../../assets/state-svg/marian";
import VI from "../../../assets/state-svg/us-virigin-island";

// Component for data fields (used for Client1, Client2, Work rows)
const DataField = ({ field, data, placeholder }) => (
  <div
    style={{
      color: data?.[field] ? "black" : "var(--primary-25)",
      ...(field === "city" && { minWidth: "232px" }),
      ...(field === "state" && { minWidth: "90px" }),
      ...(field === "address" && { minWidth: "295px" }),
    }}
    className={`d-inline-block ${field === "address" ? "col-md-3" : field === "city" ? "col-md-2" : "col-md-1"} height-25 ${field === "address" ? "pl-0" : "p-l-5"} pr-0`}
  >
    <span
      className="d-flex p-l-5 align-items-center height-25"
      style={{ fontWeight: "600" }}
    >
      {data?.[field] || placeholder}
    </span>
  </div>
);

// Component for input fields (used for Input row)
const InputField = ({
  field,
  placeholder,
  value,
  onChange,
  statesAbrs,
  setStateNewShow,
}) => {
  if (field === "state") {
    const [stateShow, setStateShow] = React.useState(false);
    // const handleStateShow = () => setStateShow(!stateShow);
    const handleStateShow = () => {
      setStateNewShow(!stateShow);
      setStateShow(!stateShow);
    };
    const [statesAbrs, setStatesAbrs] = useState([]);
    const stateMap = {
      PR: PR,
      GU: GU,
      VI: VI,
      MP: MP,
    };
    const specialStates = Object.keys(stateMap);

    const fetchSatesData = async () => {
      try {
        const response = await api_without_cancellation.get(`/api/states/`);
        if (response.status === 200) {
          setStatesAbrs(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      fetchSatesData();
    }, []);

    return (
      <div
        className="col-md-1 height-25 p-l-5 pr-0 custom-select-new-provider"
        style={{ minWidth: "90px" }}
      >
        {/* <select
          name="state"
          className="form-control rounded-0 height-25 p-0 p-l-5 p-r-5"
          value={value || ""}
          onChange={onChange}
        >
          <option value="">State</option>
          {statesAbrs?.map((state) => (
            <option key={state.id} value={state.StateAbr}>
              {state.name}
            </option>
          ))}
        </select> */}
        <div
          className="dropdown-button rounded-0 p-0 p-l-5 p-r-5 form-control height-25 d-flex align-items-center"
          onClick={handleStateShow}
        >
          <span id="selectedOption">
            {specialStates.includes(value) ? (
              <div className="d-flex align-items-center">
                {React.createElement(stateMap[value])}
                {value}
              </div>
            ) : value ? (
              <div className="d-flex align-items-center">
                <svg
                  style={{
                    width: "15px",
                    height: "15px",
                    fill: "var(--primary-80)",
                    color: "var(--primary-80)",
                    stroke: "var(--primary-80)",
                  }}
                  className={`icon icon-state-${value}`}
                >
                  <use xlinkHref={`#icon-state-${value}`}></use>
                </svg>
                {value}
              </div>
            ) : (
              "State"
            )}
          </span>
          {/* <span id="selectedOption">
            {value ? (
              <div className="d-flex align-items-center">
                <svg
                  style={{
                    width: "15px",
                    height: "15px",
                    fill: "var(--primary-80)",
                    color: "var(--primary-80)",
                    stroke: "var(--primary-80)",
                  }}
                  className={`icon icon-state-${value}`}
                >
                  <use xlinkHref={`#icon-state-${value}`}></use>
                </svg>
                {value}
              </div>
            ) : (
              "Select State"
            )}
          </span> */}
        </div>

        {stateShow && (
          <SelectStateModal
            show={stateShow}
            handleClose={handleStateShow}
            onChange={onChange}
            statesData={statesAbrs}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`${field === "address" ? "col-md-3" : field === "city" ? "col-md-2" : "col-md-1"} height-25 ${field === "address" ? "pl-0" : "p-l-5"} pr-0`}
      style={
        field === "city"
          ? { minWidth: "232px" }
          : field === "address"
            ? { minWidth: "295px" }
            : {}
      }
    >
      <input
        type="text"
        placeholder={placeholder}
        className="form-control rounded-0 p-0 p-l-5 height-25"
        value={value || ""}
        onChange={onChange}
      />
    </div>
  );
};

// Specialty dropdown component
const SpecialtyDropdown = ({
  addressKey,
  selectedSpecialty,
  specialties,
  dropdownOpen,
  onToggleDropdown,
  onSelectSpecialty,
  closeDropdown,
}) => {
  const drpdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (drpdownRef.current && !drpdownRef.current.contains(event.target)) {
      closeDropdown(); // Only close if open
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drpdownRef]);

  return (
    <div
      style={{ minWidth: "230px" }}
      className={`col-md-2 p-l-5 height-25 pr-0 custom-select-new-provider `}
      ref={drpdownRef}
    >
      <div
        className="dropdown-button rounded-0 pr-0 pt-0 pb-0 form-control height-25 d-flex align-items-center"
        onClick={onToggleDropdown}
        style={{
          paddingLeft: selectedSpecialty ? "0px" : "5px",
          backgroundColor: selectedSpecialty
            ? selectedSpecialty?.color
            : "white",
        }}
      >
        <span id="selectedOption">
          {selectedSpecialty ? (
            <div
              className="d-flex p-l-5 align-items-center justify-content-start "
              style={{
                height: "25px",
                fontSize: "16px",
                color: "white",
                fontWeight: "700",
                gap: "5px",
              }}
            >
              {/* <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: "25px",
                  width: "25px",
                  backgroundColor: selectedSpecialty?.color,
                  color: "white",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {selectedSpecialty?.name[0]}
              </span> */}
              {selectedSpecialty?.name}
            </div>
          ) : (
            // <div className="d-flex align-items-center">
            //   <span>

            //   </span>
            //   {selectedSpecialty.name}
            // </div>
            "Select Specialty"
          )}
        </span>
      </div>

      {dropdownOpen && (
        <div
          className="dropdown-menu p-0 mt-0"
          style={{
            width: "100%",
            border: "1px solid #ced4da",
            borderRadius: "0px",
            maxWidth: "225px",
            marginLeft: "5px",
            maxHeight: "330px",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {specialties?.map((specialty) => (
            <div className={`has-speciality-color-${specialty?.id}`}>
              <div
                key={specialty.id}
                className={`dropdown-option bg-speciality d-flex align-items-center height-25 `}
                style={{
                  // backgroundColor: specialty?.secondary_color,
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "white",
                  paddingLeft: "5px",
                }}
                onClick={() => onSelectSpecialty(addressKey, specialty)}
              >
                <ClientProvidersStyles
                  clientProviders={[
                    {
                      specialty: {
                        ...specialty,
                      },
                    },
                  ]}
                />
                {/* <span
                  className="m-r-5 d-flex bg-speciality align-items-center justify-content-center text-white"
                  style={{
                    width: "25px",
                    height: "25px",
                    // backgroundColor: specialty?.color,
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                >
                  {specialty?.name[0]}
                </span> */}
                {specialty.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// SearchButton component
const SearchButton = ({ onClick, isAddressAndSpecialtySelected }) => {
  return (
    <div className="p-l-5 height-25 d-flex align-items-center justify-content-center pr-0">
      <button
        onClick={onClick}
        style={{
          width: "max-content",
          padding: "5px",
          color: "white",
          backgroundColor: isAddressAndSpecialtySelected
            ? "var(--green)"
            : "var(--primary-50)",
        }}
        className="btn search-btn-new-provider d-flex align-items-center justify-content-center height-25"
      >
        Search
      </button>
    </div>
  );
};

const AddressRow = ({
  label,
  addressKey,
  addressData,
  dropdownState,
  setDropdownState,
  selectedSpecialities,
  speciality,
  handleSelectSpeciality,
  handleSearch,
  isInputRow = false,
  searchQueries,
  setSearchQueries,
  statesAbrs,
  setStateNewShow,
}) => {
  console.log(speciality);
  const handleInputChange = (field, value) => {
    setSearchQueries({
      ...searchQueries,
      input: {
        ...searchQueries?.input,
        [field]: value,
      },
    });
  };

  console.log(addressData, addressKey);

  const toggleDropdown = () => {
    setDropdownState((prev) => ({
      ...prev,
      [addressKey]: !prev[addressKey],
    }));
  };

  const closeDropdown = () => {
    setDropdownState((prev) => ({
      ...prev,
      [addressKey]: false,
    }));
  };

  const requiredFields = ["state"];

  const hasRequiredFields = requiredFields.every((field) => {
    const val = searchQueries[addressKey]?.[field];
    return typeof val === "string" && val.trim() !== "";
  });

  const hasCityOrZip = ["city", "zip"].some((field) => {
    const val = searchQueries[addressKey]?.[field];
    return typeof val === "string" && val.trim() !== "";
  });

  const hasValidAddress = hasRequiredFields && hasCityOrZip;

  const hasSelectedSpeciality =
    selectedSpecialities?.[addressKey] &&
    selectedSpecialities[addressKey] !== null;

  const isAddressAndSpecialtySelected =
    hasValidAddress && hasSelectedSpeciality;

  return (
    <>
      <Row style={{ paddingLeft: "5px", paddingRight: "5px" }} className="mx-0">
        <Col md={12} className="p-0">
          <div className="row mx-0 align-items-center custom-margin-bottom">
            {/* Label */}
            <div
              style={{ maxWidth: "70px" }}
              className="col-md-2 pl-0 p-r-5 height-25 text-left"
            >
              <span
                style={{
                  color: "var(--primary)",
                  background: "var(--primary-15)",
                  fontWeight: "600",
                  paddingLeft: "5px",
                }}
                className="d-inline-block height-25 d-flex align-items-center text-nowrap"
              >
                {label}
              </span>
            </div>

            {/* Address fields - either display or input */}
            {isInputRow ? (
              <>
                <InputField
                  field="address"
                  placeholder="Address"
                  value={searchQueries?.input?.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
                <InputField
                  field="city"
                  placeholder="City"
                  value={searchQueries?.input?.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
                <InputField
                  field="state"
                  placeholder="State"
                  value={searchQueries?.input?.state}
                  onChange={(state) =>
                    handleInputChange("state", state.StateAbr)
                  }
                  statesAbrs={statesAbrs}
                  setStateNewShow={setStateNewShow}
                />
                <InputField
                  field="zip"
                  placeholder="Zip"
                  value={searchQueries?.input?.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                />
              </>
            ) : (
              <>
                <DataField
                  field="address"
                  data={addressData}
                  placeholder="Address"
                />
                <DataField field="city" data={addressData} placeholder="City" />
                <DataField
                  field="state"
                  data={addressData}
                  placeholder="State"
                />
                <DataField field="zip" data={addressData} placeholder="Zip" />
              </>
            )}

            {/* Specialty dropdown */}
            <SpecialtyDropdown
              addressKey={addressKey}
              selectedSpecialty={selectedSpecialities?.[addressKey]}
              specialties={speciality}
              dropdownOpen={dropdownState?.[addressKey]}
              onToggleDropdown={toggleDropdown}
              onSelectSpecialty={handleSelectSpeciality}
              closeDropdown={closeDropdown}
            />

            {/* Search button */}
            <SearchButton
              onClick={() => handleSearch(addressKey)}
              isAddressAndSpecialtySelected={isAddressAndSpecialtySelected}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default AddressRow;
