import React from 'react'
import chevronRight from '../../../../public/BP_resources/images/icon/chevron_right.svg'

const CopyValueSettlement = ({draft,header}) => {
    return (
    <div className={`${draft 
        ? "copy-centered-draft d-flex align-items-center" 
        : header 
            ? "d-flex align-items-center copy-header m-r-5" 
            : "copy-centered w-100 d-flex align-items-center m-r-5"} color-green`}>
        <img src={chevronRight} className='ic-19' />
        <span>Copy</span>
    </div>

    )
}

export default CopyValueSettlement