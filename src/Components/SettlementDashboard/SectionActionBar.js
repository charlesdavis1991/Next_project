import React from 'react'

const SectionActionBar = ({sectionName, tab}) => {
    return (
        <div className="litigation-sec-action-bar">
            <div className="w-100 height-25" style={{ height: "25px" }}>
                <div className={`d-flex align-items-center height-25 justify-content-center`}>
                    <span className={`text-uppercase m-l-5 text-white font-weight-bold `}>{sectionName}</span>
                </div>
            </div>
        </div>
    )
}

export default SectionActionBar