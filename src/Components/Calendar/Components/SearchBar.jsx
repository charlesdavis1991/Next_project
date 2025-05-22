import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterSelectContainer from "./DropDownComponent";
import "./customStyle.css";
// import { WidthFull } from "@mui/icons-material";

const CalendarSearchBox = ({
  onClick,
  setSearch,
  searchResults,
  setClient,
  setCaseSummary,
  search,
  setCaseId,
  setCurrentCase,
  setAssignedUsers,
  setUniqueIdUsers,
  setCaseProvider,
}) => {
  const dispatch = useDispatch();

  const handleSearchTextChange = async (e) => {
    setSearch(e.target.value);
  };
  const handleSearchText = async (e) => {
    e.preventDefault();
    console.log(search);
    await onClick();
  };

  return (
    <div className="skew-containerCustom">
      <FilterSelectContainer
        searchResults={searchResults}
        setClient={setClient}
        setSearch={setSearch}
        setCaseProvider={setCaseProvider}
        search={search}
        setCaseId={setCaseId}
        setCaseSummary={setCaseSummary}
        setCurrentCase={setCurrentCase}
        setAssignedUsers={setAssignedUsers}
        setUniqueIdUsers={setUniqueIdUsers}
      />

      {/* <button 
    value="Search" 
    onClick={handleSearchText} 
    style={{
        marginRight: "11px",
        marginBottom: "2px",
        padding:"3px 10px",
        height: '25px',
        transform: "skew(-11.31deg, 0deg)", 
        backgroundColor: 'var(--primary)',
        color: '#fff',
        lineHeight: '10px',
    }}
> 
    <div 
        style={{  
            transform: "skew(11.31deg, 0deg)", 
            color: '#fff',
            display: 'inline-block',  // Ensures div behaves properly with transform
        }}
    >
        Search
    </div>
</button> */}
    </div>
  );
};

export default CalendarSearchBox;
