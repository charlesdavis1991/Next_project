import React, { useState, useRef } from "react";
import Select from "react-select";
import SearchRow from "../../Calendar/Components/SearchRow";

import { fetchCaseProvider } from "../../../Providers/main";
import { formatCaseProvider } from "../Util/format";
import { calculateAge, formatDate } from "../../../Utils/helper";

const FilterSelectContainer = ({
  searchResults,
  setClient,
  setCaseSummary,
  setSearch,
  search,
  setCaseId,
  setCurrentCase,
  setAssignedUsers,
  setUniqueIdUsers,
  setCaseProvider,
}) => {
  const [selectedDropdown, setSelectedDropdown] = useState(null);
  const [inputValue, setInputValue] = useState(search || "");
  const selectRef = useRef(null);


  
  // const colourStyles = {
  //   control: (styles, { isFocused }) => ({
  //     ...styles,
  //     backgroundColor: "white",
  //     border: isFocused ? "none" : "none",
  //     boxShadow: "none",
  //     "&:hover": {
  //       border: "none",
  //     },
  //   }),
  //   option: (styles, { isFocused, isSelected }) => ({
  //     ...styles,
  //     backgroundColor: isSelected ? "#19395f" : isFocused ? "white" : "white",
  //     color: isSelected ? "white" : "#4a5568",
  //     fontWeight: "bold",
  //     fontStyle: "italic",
  //     "&:hover": {
  //       backgroundColor: "#25568f",
  //       color: "white",
  //     },
  //   }),
  //   menuPortal: (base) => ({ ...base, zIndex: 99999999 }),
  //   menu: (styles) => ({ ...styles}),
  // };

  const handleChange = async (selectedOption) => {
   
    setSelectedDropdown(selectedOption);
    setCurrentCase(selectedOption);
    setCaseId(selectedOption?.id);
    setAssignedUsers([]);
    setUniqueIdUsers([]);
    setClient(selectedOption?.for_client);

    const summary = {
      case_type: selectedOption?.case_type,
      incident_date: selectedOption?.incident_date,
    };
    
    setCaseSummary(summary);
    selectRef.current.blur();
    try {
      const response = await fetchCaseProvider(selectedOption.id);
      if (response) {
        const formattedCaseProvider = response.case_providers?.map(formatCaseProvider);
        setCaseProvider(formattedCaseProvider);
      }
    } catch (err) {
      setCaseProvider([]);
    }
    setSearch("");
    setInputValue("");
    setSelectedDropdown(null);
  };

  const handleInputChange = (newInputValue) => {
    if (newInputValue != null && newInputValue !== "") {
      setSearch(newInputValue);
      setInputValue(newInputValue);
    }
  };

  const options = searchResults.map((result) => {
    const clientName = `${result?.for_client?.first_name || ""} ${result?.for_client?.last_name || ""}`;
    const caseType = result?.case_type?.name || "";
    const birthday = result?.for_client?.birthday ? formatDate(result.for_client.birthday) : "";
    const age = result?.for_client?.birthday ? calculateAge(result.for_client.birthday) : "";

    let label = clientName;
    if (caseType) label += label ? ` - ${caseType}` : caseType;
    if (birthday) label += label ? ` - ${birthday}` : birthday;
    if (age) label += label ? ` - ${age}` : age;

    return {
      value: result.id,
      label: label || "N/A",
      ...result, // Include the entire object for selection handling
    };
  });

  const handleKeyDown = (e) => {
    let currentValue = e.target.value;

    if (e.key === "Backspace") {
      currentValue = currentValue.slice(0, -1); // Remove the last character
    } else if (e.key.length === 1) {
      currentValue += e.key; // Add the pressed key to the current value
    }

    setInputValue(currentValue);
    setSearch(currentValue);
    
  };

  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      onClick={() => handleChange(data)} // Call handleChange on click
      style={{ cursor: "pointer" ,width:'100%'}} // Add cursor pointer to make it look clickable
    >
      <SearchRow
        client={data?.for_client}
        caseSummary={{
          case_type: data?.case_type,
          incident_date: data?.incident_date,
        }}
      />
    </div>
  );

  return (
    <Select
      ref={selectRef}
      value={selectedDropdown ? options.find((option) => option.value === selectedDropdown.id) : null}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      components={{ Option: CustomOption }}
      menuPortalTarget={document.body}
      styles={{height: "25px ! important"}}
      options={options} // Options for dropdown
      isSearchable={true} // Enable search functionality
      placeholder="Type the name of the client you want to add a Litigation Act, ToDo Event, or Treatment Date to:"
    />
  );
};

export default FilterSelectContainer;
