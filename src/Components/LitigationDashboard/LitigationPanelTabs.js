import React,{useEffect} from 'react'
import GenericTabs from '../common/GenericTab';
const LitigationPanelTabs = ({tabsData}) => {
  return (
    <div className=" main-action-bar position-relative d-flex justify-content-between m-b-5" >
    
    <div className="nav nav-tabs align-items-center height-25 position-relative overflow-visible w-100" id="litigation-tabs" role="tablist">
        <GenericTabs tabsData={tabsData} height={25}  />
    </div>
</div>
  )
}

export default LitigationPanelTabs