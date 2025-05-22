import React from 'react'
import { formatDateForPanelDisplay } from '../../../Utils/helper'

function Information({object , onSelectDefenedant}) {
  

  function roundToInt(value) {
    const number = parseFloat(value) || 0; // Convert value to a float
    return Math.round(number); // Proper rounding without skewing
  }
    
  return (
    <>
    <div className="info-div" >
      <div className="h-100" onClick={onSelectDefenedant}>
        <div>
          <p className="columnsTitle text-center text-primary  text-uppercase">
            Information
          </p>
            

          <div className='custom-font-14px' style={{textWrap: 'nowrap'}}>
            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Type</span>
              </div>
              <div className="col-auto text-left overflow-hidden">
                <p >{object?.gender} {object?.defendantType_name}</p>
              </div>
            </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">DOB</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDateForPanelDisplay(object?.birthday)}</p>
              </div>
            </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Liability%</span>
              </div>
              <div className="col-auto text-left ">
              <p>
                {roundToInt(object?.liability_estimate) + "%"}/{roundToInt(object?.liability_percent) + "%"}
              </p>
              </div>
            </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block text-nowrap">Rep Letter</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDateForPanelDisplay(object?.repr_letter_sent)}</p>
              </div>
            </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Contact</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDateForPanelDisplay(object?.contact_date)}</p>
              </div>
            </div>

            <div className="row mb-0 colFont">
              <div className="col text-left">
                <span className="d-inline-block">Served</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDateForPanelDisplay(object?.defServedDate)}</p>
              </div>
            </div>

           </div>

        </div>
      </div>
      
    </div>
  </>
  )
}

export default Information