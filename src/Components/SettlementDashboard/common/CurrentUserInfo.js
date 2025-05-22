import React from 'react'
import { getLoggedInUserId, getLoggedInUserName, getLoggedInUserPf } from '../../../Utils/helper'

const CurrentUserInfo = ({id}) => {
    const userId = getLoggedInUserId();
    const userName = getLoggedInUserName();
    const userPf = getLoggedInUserPf();
    
    return (
        userId == id && 
        <div className='d-flex align-items-center'>
            {userPf ? (
            <span className="ic-avatar has-cover-img sidebar-pic d-inline-block" style={{width:"24px",height:"24px"}}>
                <img
                src={userPf}
                alt={userPf}
                />
            </span>
            ) : (
            <span className="ic ic-avatar has-avatar-icon has-cover-img sidebar-pic" style={{width:"24px",height:"24px"}}></span>
            )}
            
            <span className='ml-2'>{userName}</span>
        </div>
        
    )
}

export default CurrentUserInfo