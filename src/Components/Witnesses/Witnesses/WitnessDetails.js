import React from 'react'
// import { formatDate } from '../../../Utils/helper'
import { parseISO , format } from 'date-fns';

function WitnessDetails({object , onSelect}) {
    
  const formatDate = (date) => {
    if (!date) return "";
    
    const parsedDate = parseISO(date);
    return format(parsedDate, 'M/dd/yyyy');
  };

  return (
    <>
    <div className="info-div" >
      <div className="" onClick={onSelect} >
        <div>
          <p className="columnsTitle text-center text-primary  text-uppercase">
            Witness details
          </p>
          <div>
            <div className="row mb-0 ">
              <div className="col text-left">
                <span className="d-inline-block">For</span>
              </div>
              <div className="col-auto text-left ">
                <p>
                    {/* {object?.witness_for_entity},{" "} */}
                    {object?.witness_for_name}
                </p>
                {/* <p>
                    {object?.witness_for_entity},{" "}
                    {object?.witness_for_record_id}
                </p> */}
              </div>
            </div>


            <div className="row mb-0 ">
              <div className="col text-left">
                <span className="d-inline-block">DOB</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDate(object?.witness_birthday)}</p>
              </div>
            </div>

            <div className="row mb-0 ">
              <div className="col text-left">
                <span className="d-inline-block">Gender</span>
              </div>
              <div className="col-auto text-left ">
                <p>{object?.witness_gender}</p>
              </div>
            </div>

            <div className="row mb-0 ">
              <div className="col text-left">
                <span className="d-inline-block text-nowrap">Rep Letter</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDate(object?.RepLetterSent)}</p>
              </div>
            </div>

            <div className="row mb-0 ">
              <div className="col text-left">
                <span className="d-inline-block">Contact</span>
              </div>
              <div className="col-auto text-left ">
                <p>{formatDate(object?.contact_confirmed_date)}</p>
              </div>
            </div>

            {/* <div className="row mb-0 ">
              <div className="col text-left">
                <span className="d-inline-block">Relationship to Client </span>
              </div>
              <div className="col-auto text-left ">
                <p>{object?.relationship_to_client?.toString()}</p>
              </div>
            </div> */}

           </div>

        </div>
      </div>
      
    </div>
  </>
  )
}

export default WitnessDetails