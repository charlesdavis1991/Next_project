import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/Sidebars/main";
import NavBar from "../Components/Navbars/main";
import "./injury.css";
import { fetchCheckListPageData, getCaseTypes } from "../Redux/checklist/actions";
import CheckListDashboard from "../Components/CheckListDashboard/main";
import Footer from "../Components/common/footer";

const CheckListPage = ({}) => {
    const dispatch = useDispatch();
    
    const [currentCase, setCurrentCase] = useState([]);

    const [duration, setDuration] = useState(90)

    

    const { checkListData } = useSelector((state) => state.checkLists);
    
    

    useEffect(() => {
      fetchCheckListPageData(dispatch);
      getCaseTypes(dispatch, duration);
    }, [duration]);

    const onChangeDurationDays = (e) => {
      console.debug("changing value")
      fetchCheckListPageData(dispatch);
      getCaseTypes(dispatch, e.target.value);
      setDuration(e.target.value)
    }
   

    return (
      <>
        <div className="page-wrapper checklist-page">
          <Sidebar pages={checkListData?.pages} />
          <div className="page-container">
            <NavBar flaggedPageName="Case" client={checkListData?.client} currentCase={currentCase} />
            {/* {checkListData && <CheckListDashboard checkListData={checkListData} /> } */}
            {duration && <CheckListDashboard onChangeDurationDays={onChangeDurationDays} duration={duration} />}
          </div>
        </div>
        <Footer/>
    </>
    );
}


export default CheckListPage;