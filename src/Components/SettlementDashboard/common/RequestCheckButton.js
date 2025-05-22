import React from 'react'

const RequestCheckButton = ({onHandleClick}) => {
    return (
        <button type="button" onClick={(e)=>{
            e.stopPropagation();
            onHandleClick();
        }} className="btn">Request Check</button>
    )
}

export default RequestCheckButton