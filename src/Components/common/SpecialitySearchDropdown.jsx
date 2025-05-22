import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./directorySearchDropdown.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSpeciality } from "../../Redux/selectedSpeciality/actions";
import ClientProvidersStyles from "../CaseDashboard/ClientProvidersStyles";

const SpecialitySearchDropdown = () => {
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpecialityLocal, setSelectedSpecialityLocal] = useState(null);
  const selectedSpeciality = useSelector((state) => state.selectedSpeciality);
  // const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const tokenBearer = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [stylishSpecialties, setStylishSpecialties] = useState([]);
  

  const getSpecialityData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${origin}/api/case-provider-specialties/`,
        {
          headers: {
            Authorization: tokenBearer,
          },
        }
      );
      setSpecialities(response.data);
      specialtyTransformer(response.data);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSpecialityData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (speciality) => {
    setSelectedSpecialityLocal(speciality);
    dispatch(setSelectedSpeciality(speciality.id));
    localStorage.setItem("selectedSpeciality", JSON.stringify(speciality));
    setIsOpen(false);
  };

  useEffect(() => {
    const savedSpecialityStr = localStorage.getItem("selectedSpeciality");

    if (savedSpecialityStr) {
      try {
        const savedSpeciality = JSON.parse(savedSpecialityStr);

        dispatch(setSelectedSpeciality(savedSpeciality.id));

        if (specialities.length > 0) {
          const freshSpeciality = specialities.find(
            (spec) => spec.id.toString() === savedSpeciality.id.toString()
          );

          setSelectedSpecialityLocal(freshSpeciality || savedSpeciality);
        } else {
          setSelectedSpecialityLocal(savedSpeciality);
        }
      } catch (err) {
        console.error("Error parsing saved speciality:", err);
      }
    }
  }, [specialities]);

  // const filteredSpecialities = specialities.filter((speciality) =>
  //   speciality.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  useEffect(() => {
    if (
      selectedSpeciality &&
      selectedSpeciality.selectedSpeciality &&
      specialities.length > 0
    ) {
      const specialityId = selectedSpeciality.selectedSpeciality.toString();

      const specialityObj = specialities.find(
        (spec) => spec.id.toString() === specialityId
      );

      if (specialityObj) {
        setSelectedSpecialityLocal(specialityObj);
      }
    }
  }, [selectedSpeciality, specialities]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const specialtyTransformer = (specialties) => {
    const transformedData = specialties.map((specialty) => {
      return {
        specialty: {
          ...specialty,
        },
      };
    });
    setStylishSpecialties(transformedData);
  };

  return (
    <div
      style={{ minWidth: "224px" }}
      className="col-md-2 p-l-5 height-25 pr-0 custom-select-new-provider"
      ref={dropdownRef}
    >
      {stylishSpecialties && <ClientProvidersStyles clientProviders={stylishSpecialties} />}
      <div
        className={`dropdown-button rounded-0 pr-0 pt-0 pb-0 form-control height-25 d-flex align-items-center has-speciality-color-${selectedSpecialityLocal?.id}`}
        onClick={toggleDropdown}
        style={{
          paddingLeft: selectedSpecialityLocal ? "0px" : "5px",
        }}
      >
        <span id="selectedOption" className="bg-speciality-10 w-100">
          {selectedSpecialityLocal ? (
            <div
              className="d-flex p-r-5 align-items-center justify-content-start"
              style={{
                height: "25px",
                color: "black",
                fontWeight: "600",
                gap: "5px",
              }}
            >
              <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: "25px",
                  width: "25px",
                  backgroundColor: selectedSpecialityLocal?.color,
                  color: "white",
                }}
              >
                {selectedSpecialityLocal?.name[0]}
              </span>
              {selectedSpecialityLocal?.name}
            </div>
          ) : (
            "Select Speciality"
          )}
        </span>
      </div>

      {isOpen && (
        <div
          className="dropdown-menu p-0 mt-0 z-2"
          style={{
            width: "100%",
            border: "1px solid #ced4da",
            borderRadius: "0px",
            maxWidth: "400px",
            marginLeft: "5px",
            maxHeight: "400px",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* <input
            type="text"
            placeholder="Search specialities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{
              marginBottom: "4px",
              borderRadius: "0",
            }}
          /> */}

          {loading ? (
            <div className="dropdown-option d-flex align-items-center height-25">
              Loading specialities...
            </div>
          ) : error ? (
            <div className="dropdown-option d-flex align-items-center height-25">
              Error loading specialities
            </div>
          ) : specialities.length > 0 ? (
            specialities.map((speciality) => (
              <div
                className={`has-speciality-color-${speciality?.id}`}
                key={speciality.id}
              >
                <div
                  className="dropdown-option d-flex align-items-center height-25 bg-speciality-10"
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelect(speciality)}
                >
                  <span
                    className="m-r-5 d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: "25px",
                      height: "25px",
                      backgroundColor: speciality?.color,
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {speciality?.name[0]}
                  </span>
                  {speciality.name}
                </div>
              </div>
            ))
          ) : (
            <div className="dropdown-option d-flex align-items-center height-25">
              No specialities found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialitySearchDropdown;