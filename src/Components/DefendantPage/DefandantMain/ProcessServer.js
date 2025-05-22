import React from 'react'
import SendEmailBtn from '../../Modals/SendEmailBtn';

function ProcessServer({object , onSelectDefenedant}) {


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
     <div className="" onClick={onSelectDefenedant}>
       
       <div>
         <p className="columnsTitle text-center text-primary font-weight-semibold text-uppercase">
            Process Server
         </p>
         {object?.process_server?.contact_id?.name ? (
           <p className='text-capitalize'>{object.process_server?.contact_id?.name}</p>

         ):
         <p className="text-primary-50"> Name</p>
       
       }
         <div>
         <>
              {object?.process_server?.contact_id?.address1 || object?.process_server?.contact_id?.address2 ? (
                <p className="inline-row-h-21 text-capitalize" style={{ whiteSpace: 'nowrap' }}>
                  {object?.process_server?.contact_id?.address1 && (
                    <span>{object?.process_server?.contact_id?.address1}</span>
                  )}
                  {object?.process_server?.contact_id?.address2 && (
                    <span>{object?.process_server?.contact_id?.address1 && ","} {object?.process_server?.contact_id?.address2}</span>
                  )}
                </p>
              ) : (
                <span className="text-primary-50">Address</span>
              )}
            </>
            
           <p className="inline-row-h-21 text-capitalize">
             {object?.process_server?.contact_id?.city ? object.process_server.contact_id.city+"," : <span className="text-primary-50">city,</span>}{" "}
             {object?.process_server?.contact_id?.state ? object.process_server.contact_id.state : <span className="text-primary-50">state</span>}{" "}
             {object?.process_server?.contact_id?.zip ? object.process_server.contact_id.zip : <span className="text-primary-50">zip</span>}
           </p>
         </div>
         <div>
         <p className="inline-row-h-21 ">
           {object?.process_server?.contact_id?.phone_number ? (
             formatPhoneNumber(object.process_server.contact_id.phone_number)
           ) : (
             <span className="text-primary-50">(###) ###-####</span>
           )}
           <small className="ml-1 text-primary-50">ext </small>{object?.process_server?.contact_id?.phone_ext||""}
         </p>
         <p className="inline-row-h-21" >
           {object?.process_server?.contact_id?.fax ? (
             formatPhoneNumber(object.process_server.contact_id.fax)
           ) : (
             <span className="text-primary-50">(###) ###-####</span>
           )}
           <small className="ml-1 text-primary-50">fax</small>
         </p>
         </div>
       </div>
     </div>
     <div className="mt-auto">
       {/* <a
         style={{ height: "25px" }}
         href="#"
         className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center overflow-hidden info_email m-b-5 p-l-6 p-r-6"
       >
         <i className="ic ic-19 ic-email-3d mr-1"></i>
         <p className="overflow-hidden">{object?.process_server?.contact_id?.email}</p>
       </a> */}

      <SendEmailBtn email={object?.process_server?.contact_id?.email} />
       <a
         style={{ height: "25px" }}
         href="#"
         className="btn btn-primary-lighter-2 btn-white-hover font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center p-l-6 p-r-5"
       >
         <i className="ic ic-19 ic-generate-document mr-1"></i>
         Generate Document
       </a>
     </div>
   </div> 
 </>
  )
}

export default ProcessServer