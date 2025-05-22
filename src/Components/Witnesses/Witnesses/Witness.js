import React from 'react'

function Witness({object , onSelect}) {
  // Formating phone number if exist
  const formatPhoneNumber = (number) => {
    if (!number) return null;
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  };


  return (
    <>
       <div className="info-div " >
        <div className="">
          
          <div onClick={onSelect} className=''>
            <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
               Witness 
            </p>
            {object?.witness_first_name || object?.witness_last_name ? (
              <p className='inline-row-h-21 text-capitalize'>{object.witness_first_name} {object.witness_last_name}</p>

            ):
            <p className="text-primary-50">Full Name</p>
          
          }
            <div>
            {/* <>
                {object?.witness_contact_last?.address1 ||
                object?.witness_contact_last?.address2 ? (
                  <>
                    {object?.witness_contact_last?.address1 &&
                      (object?.witness_contact_last?.address1.length > 10 ? (
                        <span title={object?.witness_contact_last?.address1}>
                          {object?.witness_contact_last?.address1.slice(0, 10) + "..."},{" "}
                        </span>
                      ) : (
                        <span>{object?.witness_contact_last?.address1}, </span>
                      ))}{" "}
                    {object?.witness_contact_last?.address2 && (object?.witness_contact_last?.address2.length > 10 ? (
                        <span title={object?.witness_contact_last?.address2}>
                          {object?.witness_contact_last?.address2.slice(0, 10) + "..."}
                        </span>
                      ) : (
                        <span>{object?.witness_contact_last?.address2}</span>
                      ))}
                  </>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </> */}

              <p className='inline-row-h-21 text-capitalize ' style={{textWrap:'nowrap'}}>
                {object?.witness_contact_last?.address1 || object?.witness_contact_last?.address2 ? (
                  <>
                    {object?.witness_contact_last?.address1 && (
                      <span>{object?.witness_contact_last?.address1}, </span>
                    )}
                    {object?.witness_contact_last?.address2 && (
                      <span>{object?.witness_contact_last?.address2}</span>
                    )}
                  </>
                ) : (
                  <span className="text-primary-50">Address</span>
                )}
              </p>
                
              <p className="inline-row-h-21 text-capitalize">
                {object?.witness_contact_last?.city ? object.witness_contact_last?.city : <span className="text-primary-50">city</span>},{" "}
                {object?.witness_contact_last?.state ? object.witness_contact_last?.state : <span className="text-primary-50">state</span>}{" "}
                {object?.witness_contact_last?.zip ? object.witness_contact_last?.zip : <span className="text-primary-50">zip</span>}
              </p>
            </div>
            <div>
            <p className="inline-row-h-21">
              {object?.witness_contact_last?.phone_number ? (
                formatPhoneNumber(object.witness_contact_last?.phone_number)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )} {" "}
                <small className="ml-1 text-primary-50">ext </small>{object?.witness_contact_last?.phone_ext||""}
            </p>
            <p className="inline-row-h-21" >
              {object?.witness_contact_last?.fax ? (
                formatPhoneNumber(object.witness_contact_last.fax)
              ) : (
                <span className="text-primary-50">(###) ###-####</span>
              )}
              <small className="ml-1 text-primary-50">fax</small>
            </p>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <a
            style={{ height: "25px" }}
            href="#"
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-5 p-l-6 p-r-6"
          >
            <i className="ic ic-19 ic-email-3d mr-1"></i>
            <p className="overflow-hidden">{object?.witness_contact_last?.email}</p>
          </a>
          <a
            style={{ height: "25px" }}
            className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
            // onClick={()=>handleGenrateDocument(object.id)}
          >
            <i className="ic ic-19 ic-generate-document mr-1"></i>
            Generate Document
          </a>
        </div>
      </div> 
    </>
  );
}

export default Witness