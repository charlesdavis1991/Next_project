import React,{useEffect} from 'react'
import GenericTabs from '../common/GenericTab';

const SettlementTabs = ({settlementTab,tabsData,handleTabChange}) => {
    useEffect(() => {
        const divRight = document.querySelector('.fake-right');

        if(settlementTab == "create_offer") {
            divRight.style.setProperty('background-color', 'var(--primary)');
        }
        else{
            divRight.style.setProperty('background-color', 'var(--primary-70)');
        }


    }, [settlementTab]);
    const handleSettlementItemWidth = ()=>{
        const parentDivWidth = document.querySelector('.parent-action-bar-div').getBoundingClientRect().width;
        const tabsDivWidth = 446.51;
        const addSettlementItem = document.getElementById('create_item');
        if(parentDivWidth && tabsDivWidth && addSettlementItem){
            const marginLeft = ( (parentDivWidth - tabsDivWidth - 122) / 2 ) ;
            addSettlementItem.style.marginLeft = `${ marginLeft - 219.16 }px`;
        }
    }
    useEffect(() => {
        const handleResize = () => {
            handleSettlementItemWidth();
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="parent-action-bar-div main-action-bar position-relative d-flex justify-content-between">
                
                <div className="child-action-bar-div nav nav-tabs align-items-center height-25 position-relative overflow-visible" role="tablist">
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

export default SettlementTabs