import React, { useEffect, useState, useRef } from "react";
import StatusTabsContent from './StatusTabsContent'

export default function StageTabsContent({activeStage, activeStatus}) {
    
    
    return (
        <>
        
        
        <div className="tab-content">
            <StatusTabsContent activeStage = {activeStage} activeStatus={activeStatus} />
        </div>
        </>
    )
}
