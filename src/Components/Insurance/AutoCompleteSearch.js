import React from 'react'

function AutoCompleteSearch({searchedInsurances,selectedInsurance,isCompany=false,isAdjuster=false}) {
  
  if (isAdjuster){
    
    return (
      
            <div className='position-relative'>
              <div id="autocomplete-list" className="auto-complete " 
              
              style={{
                position: "absolute",
                zIndex: 1000,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                width: "100%",
                // maxHeight: "150px",
                // overflowY: "auto",
              }}
              >
              {searchedInsurances.length> 0 ? searchedInsurances.slice(0,9).map(adjuster=>{


                  const fullAddress = [
                    (adjuster?.company_name) ? `${adjuster.company_name}` : '',
                    (adjuster?.adjuster_firstname || adjuster?.adjuster_lastname) ? `${adjuster.adjuster_firstname} ${adjuster.adjuster_lastname}` : '',
                    adjuster?.address1,
                    adjuster?.address2,
                    adjuster?.city,
                    adjuster?.state,
                    adjuster?.zip,
                  ].filter(Boolean).join(', ') + (adjuster?.zip ? '' : '');
                return <div
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                
                onClick={()=> selectedInsurance(adjuster.id)}  className="autocomplete-">{fullAddress}</div>
  }):''}
            </div>
            

            </div>
          )
  }

  if (isCompany)
    {
      
      return (
        <div className='position-relative'>
        <div id="autocomplete-list" className="auto-complete " 
         style={{
          position: "absolute",
          zIndex: 1000,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          width: "100%",
        }}
        >
           {searchedInsurances.length> 0 ? searchedInsurances.slice(0,9).map(insurance=>{

              const fullAddress = [
                (insurance?.company_name) ? `${insurance.company_name}` : '',
                (insurance?.first_name || insurance?.last_name) ? `${insurance.first_name} ${insurance.last_name}` : '',
                insurance?.address1,
                insurance?.address2,
                insurance?.city,
                insurance?.state,
                insurance?.zip,
              ].filter(Boolean).join(', ') + (insurance?.zip ? '' : ''); 
             return <div
             style={{
              padding: "5px",
              cursor: "pointer",
              borderBottom: "1px solid #ddd",
            }}
             
             onClick={()=> selectedInsurance(insurance.id)}  className="autocomplete-">{fullAddress}
            </div>
    }):''}
        </div>
        </div>
  )
    }else{
       
      return (
        <div className='position-relative'>

        <div id="autocomplete-list" className="auto-complete"  
         style={{
          position: "absolute",
          zIndex: 1000,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          width: "100%",
        }}
        >
           {searchedInsurances.length> 0 ? searchedInsurances.slice(0,9).map(insurance=>{

              const fullAddress = [
                (insurance?.company_name) ? `${insurance.company_name}` : '',
                (insurance?.adjuster_firstname || insurance?.adjuster_lastname) ? `${insurance.adjuster_firstname} ${insurance.adjuster_lastname}` : '',
                insurance?.address1,
                insurance?.address2,
                insurance?.city,
                insurance?.state,
                insurance?.zip,
              ].filter(Boolean).join(', ') + (insurance?.zip ? '' : '');
             return <div
             style={{
              padding: "5px",
              cursor: "pointer",
              borderBottom: "1px solid #ddd",
            }}
             onClick={()=> selectedInsurance(insurance.id)}  className="autocomplete-">{fullAddress}</div>
    }):''}
        </div>
        </div>
  )
    }
 
 
}

export default AutoCompleteSearch
