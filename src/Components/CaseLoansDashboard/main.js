import React,{ useState } from 'react';
import ActionBarComponent from '../common/ActionBarComponent';
import GenericTabs from '../common/GenericTab';
import CaseLoanPanel from './CaseLoanPanel';
import NotesSectionDashboard from '../NotesSectionDashboard/main';
import useGetLoansPanels from './hooks/useGetLoansPanels';
import AddCaseLoanModal from './AddCaseLoanModal';
import '../../../public/BP_resources/css/case_loans.css';

const CaseLoansDashboard = () => {
    const [caseLoanTab, setCaseLoanTab] = useState("");
    const loansPanelsObj = useGetLoansPanels();
    const [showAddPopup,setShowAddPopup] = useState(false);
    const tabsData = [
        {   id: "create_caseloan", 
            label: "Case Loan", 
            span: <span className="font-weight-bold pr-2 text-gold">+ </span>,
            onClick: () => {
                setShowAddPopup(true)
            },
            className: caseLoanTab === "create_caseloan" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background:  "var(--primary-90) !important",
            leftHand:true,
            activeColor: 'white',
        },
        {   id: "create_caseloan_application", 
            label: "Case Loan Application", 
            span: <span className="font-weight-bold pr-2 text-gold">+ </span>,
            onClick: () => {
                setShowAddPopup(true)
            },
            className: caseLoanTab === "create_caseloan_application" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
            background: "var(--primary-80) !important",
            leftHand:true,
            activeColor: 'white',
        },
    ]
    return (
        <>
            <div className="top-panel-wrapper"></div>
            <div className="main-content settle-content-div" style={{paddingTop:"169.4px"}}>
                <ActionBarComponent
                    isChecklist={true}
                    src="/BP_resources/images/icon/incident-folder-icon-color.svg"
                    page_name="Loans"
                />
                <GenericTabs tabsData={tabsData} height={25} />
                <CaseLoanPanel loansPanelsObj ={loansPanelsObj} />
                <NotesSectionDashboard />
            </div>
            {showAddPopup && 
            <AddCaseLoanModal 
                show={showAddPopup}
                handleClose={()=>{
                    setShowAddPopup(false)
                }}
                updateLoanStates={loansPanelsObj.updateCaseLoansPanels}
                />
            }
        </>
    )
}

export default CaseLoansDashboard