import React,{ useEffect, useState, useRef }  from 'react';
import CaseAgeBody from './CaseAgeBody';
import CaseStateVenue from './CaseStateVenue';
import CaseCountyVenue from './CaseCountyVenue';
import CaseInjuries from './CaseInjuries';

export default function StatusTabsContent({ activeStage, activeStatus }) {
    const [activeTab, setActiveTab] = useState('caseage');
    const HandleTabClick = (tab) => {
        setActiveTab(tab);
      }
    return (
        <>
            <div className="case-navigator-filters">
                <div className="nav nav-tabs nav-tabs-filter" role="tablist">
                    <button className={`nav-link ${activeTab === 'caseage' ? 'active' : ''} no-left-skew no-right-skew m-l-5`} data-bs-toggle="tab" type="button" role="tab" aria-selected="true" onClick={() => HandleTabClick('caseage')}>
                      
                        Case Age
                    </button>
                    <button className={`nav-link ${activeTab === 'statevenue' ? 'active' : ''} no-left-skew no-right-skew`} data-bs-toggle="tab"  type="button" role="tab" aria-selected="false" onClick={() => HandleTabClick('statevenue')}>
                        
                        State Venue
                    </button>
                    <button className={`nav-link ${activeTab === 'countyvenue' ? 'active' : ''} no-left-skew no-right-skew`}  data-bs-toggle="tab" type="button" role="tab" aria-selected="false" onClick={() => HandleTabClick('countyvenue')}>
                        
                        County Venue
                    </button>
                    <button className={`nav-link ${activeTab === 'injuries' ? 'active' : ''} no-left-skew no-right-skew`} data-bs-toggle="tab" type="button" role="tab"  aria-selected="false" onClick={() => HandleTabClick('injuries')}>
                        
                        Injuries
                    </button>
                </div>
            </div>
            <div className="tab-content">
                {activeTab === 'caseage' ?<CaseAgeBody activeStage={activeStage} activeStatus={activeStatus} />:
                activeTab === 'statevenue' ?<CaseStateVenue activeStage={activeStage} activeStatus={activeStatus} />:                
                activeTab === 'countyvenue' ?<CaseCountyVenue activeStage={activeStage} activeStatus={activeStatus} />:               
                activeTab === 'injuries' ?<CaseInjuries activeStage={activeStage} activeStatus={activeStatus} />:''}
                
            </div>
        </>
    )
}
