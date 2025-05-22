import React,{ useState } from 'react';
import ActionBarComponent from '../common/ActionBarComponent';
import GenericTabs from '../common/GenericTab';
import NotesSectionDashboard from '../NotesSectionDashboard/main';

const OtherPartiesDashBoard = () => {
    const [showAddPopup,setShowAddPopup] = useState(false);
    const [otherPartiesTab, setOtherPartiesTab] = useState("");
    const tabsData = [
        {   id: "create_party", 
            label: "Party", 
            span: <span className="font-weight-bold pr-2 text-gold">+ </span>,
            onClick: () => {
                setShowAddPopup(true)
            },
            className: otherPartiesTab === "create_party" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background:  "var(--primary-90) !important",
            leftHand:true,
            activeColor: 'white',
        }
    ]
    return (
        <>
            <div className="top-panel-wrapper"></div>
            <div className="main-content settle-content-div" style={{paddingTop:"169.4px"}}>
                <ActionBarComponent
                    isChecklist={true}
                    src="/BP_resources/images/icon/incident-folder-icon-color.svg"
                    page_name="Parties"
                />
                <GenericTabs tabsData={tabsData} height={25} />
                {/* <CaseLoanPanel loansPanelsObj ={loansPanelsObj} /> */}
                <NotesSectionDashboard />
            </div>
        </>
    )
}

export default OtherPartiesDashBoard