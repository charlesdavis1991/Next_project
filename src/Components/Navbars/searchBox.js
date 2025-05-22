import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchName, setSearchText } from '../../Redux/search/actions';

const SearchBox = (props) => {
    const dispatch = useDispatch();
    
    const handleSearchText = (e) => {
        e.preventDefault();
        dispatch(setSearchName(""))
        dispatch(setSearchText(window.document.getElementById("search_header").value))
    }
    // const handleSearchText = (e) => {
    //     e.preventDefault();
    //     dispatch(setSearchName(""))
    //     dispatch(setSearchText(e.target.value))
    // }

    return (
    <form onSubmit={handleSearchText} className="search-form">
        <input type="text" name="search-text" id="search_header"  className="form-control w-100"  />
        <div className="search-btn">
            <button value="Search" className="btn H-btn" type="submit" >Search</button>
            <div className="right-skew"
                style={{right: "0px",transform: "skew(-11.31deg, 0deg)", width: "5px", zIndex: "1", backgroundColor: "var(--primary)"}}>
            </div>
            <div className="left-skew"
                style={{left: "-5px",transform: "skew(-11.31deg, 0deg)", width: "5px", zIndex: "1", backgroundColor: "var(--primary)", height:"24.8px"}}>
            </div>
        </div>
        <div className="right-skew" style={{right: "0", transform: "skew(-11.31deg, 0deg)", width:"8px !important"}} onclick="location.href = '{% url 'bp-globalsearchrecent' client.id case.id %}'"></div>
        <div className="left-skew Header-left-8px-width-8px" onclick="location.href = '{% url 'bp-globalsearchrecent' client.id case.id %}'"></div>             
    </form>
    );
}

export default SearchBox;
