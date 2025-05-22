import React from 'react'

function WitnessStatementSummary({object ,onSelect}) {
  return (
    <div className="info-div-witness-statement-summary" onClick={onSelect} >
    <div className=" ">
      
      <div >
        <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase ">
        Witness Statement Summary 
        </p>
        {object?.statement_summary ? (
            object.statement_summary.length > 200 ? (
              <span title={object.statement_summary}>
                {object.statement_summary.slice(0, 200) + "..."}
              </span>
            ) : (
              <span>{object.statement_summary}</span>
            )
          ) : (
            <p className="text-primary-50">Statement Summary</p>
          )}
        
       
      </div>
    </div>
   
  </div> 
  )
}

export default WitnessStatementSummary