import React from 'react'

export default function CalenderHeading({name}) {
  return (
    <div className="action-bar client-BarAlign main-action-bar  d-flex m-b-5 m-t-5 vertical-align-middle calendar-heading" style={{zIndex:"1000"}}>
        <span className="page-icon">
          <img src="/BP_resources/images/icon/calendar-logo-icon.svg" />
        </span>
        <div className="text-wrapper text-white d-flex align-items-center p-l-5 ">
          <h2 className="text-white">{name}</h2>
        </div>
        <div className="d-flex-1 position-relative z-index-1 text-white "></div>
        </div>

  )
}
