import React,{useEffect} from 'react'
import GenericTabs from '../common/GenericTab'
const LitigationActionTabs = ({litigationActionTab,tabsData}) => {


    useEffect(() => {
        const divLeft = document.querySelector('.fake-left');
        const divRight = document.querySelector('.fake-right');
        if (litigationActionTab == "case") {
            divLeft.style.setProperty('background-color', 'var(--primary)');
        }
        else{
            divLeft.style.setProperty('background-color', 'var(--primary-70)');
        }

        if(litigationActionTab == "litigation_act") {
            divRight.style.setProperty('background-color', 'var(--primary)');
        }
        else{
            divRight.style.setProperty('background-color', 'var(--primary-70)');
        }


    }, [litigationActionTab]);
    return (
        <div className=" main-action-bar position-relative d-flex justify-content-between" style={{left:"36px",marginTop:"5px"}}>
            <div className='fake-left' style={{
                position: "absolute",
                top: "0px",
                left:"-6px",
                width:"25px",
                height:"25px",
                backgroundColor: "var(--primary)",
                padding: "5px",
                transform: "skewX(-11.31deg)"
                }}></div>
            
            <div className="nav nav-tabs align-items-center height-25 position-relative overflow-visible" style={{marginLeft:"-3px"}} role="tablist">
                <GenericTabs tabsData={tabsData} height={25}  />
                <div className='fake-right' style={{
                position: "absolute",
                top: "0px",
                right:"-5px",
                width:"0px",
                height:"25px",
                backgroundColor: "var(--primary-70)",
                padding: "5px",
                transform: "skewX(11.31deg)"
                }}></div>
            </div>
        </div>  
    )
}

export default LitigationActionTabs