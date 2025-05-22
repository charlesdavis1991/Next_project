// import React from 'react'
// import {  useFormContext } from 'react-hook-form';
// import check from './check.png'


// function SearchOptions() {
//   const {
//     register,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();

//   // Define the fields object
//   const fields = {
//     clientInfo: {
//       srclientbday,
//       srcasestage,
//       srmainphone,
//       srmainemail,
//     },
//     caseType: {
//       SRincidentdate,
//       sropendate,
//       srcloseddate,
//       srlastaccessed,
//     },
//   };

//   // Watch the form's current values
//   const clientInfo = watch('clientInfo') || {};
//   const caseType = watch('caseType') || {};


//   return (
//     <div className="checkbox-groups">
//       {/* Client Info Group */}
//       <div className="checkbox-group">
//         <h4 style={{ fontSize: '16px', marginLeft: '15px' }}>Client Name</h4>
//         {Object.entries(clientInfo).map(([field, checked]) => (
//           <div key={field} className="checkbox-item">
//             <div className={`checkbox-container ${checked ? 'checked' : ''}`}>
//               <input
//                 type="checkbox"
//                 {...register(`clientInfo.${field}`)}
//                className ={`checkbox-secondary  ${SRincidentdateChecked ? 'checkbox-chacked-secondary' : ''}`}
//               />
//               {checked && (
//                 <span className="check-icon" style={{ height: '15px', width: '15px' }}>
//                   <img src={check} alt="check" />
//                 </span>
//               )}
//             </div>
//             <p>{field.replace(/([A-Z])/g, ' $1')}</p>
//           </div>
//         ))}
//       </div>

//       {/* Case Type Group */}
//       <div className="checkbox-group">
//         <h4 style={{ fontSize: '16px', marginLeft: '15px' }}>Case Type</h4>
//         {Object.entries(fields).map(([field, checked]) => (
//           <div key={field} className="checkbox-item">
//             <div className={`checkbox-container ${checked ? 'checked' : ''}`}>
//               <input
//                 type="checkbox"
//                 {...register(`caseType.${field}`)}
//                className ={`checkbox-secondary  ${SRincidentdateChecked ? 'checkbox-chacked-secondary' : ''}`}
//               />
//               {checked && (
//                 <span className="check-icon" style={{ height: '15px', width: '15px' }}>
//                   <img src={check} alt="check" />
//                 </span>
//               )}
//             </div>
//             <p>{field.replace(/([A-Z])/g, ' $1')}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SearchOptions



import React from 'react';
import { useFormContext } from 'react-hook-form';
import check from './check.png';

function SearchOptions() {
  const { register, watch } = useFormContext();

  // Watch individual fields to detect changes
  const srclientbdayChecked = watch("srclientbday");
  const srcasestageChecked = watch("srcasestage");
  const srmainphoneChecked = watch("srmainphone");
  const srmainemailChecked = watch("srmainemail");
  const SRincidentdateChecked = watch("SRincidentdate");
  const sropendateChecked = watch("sropendate");
  const srcloseddateChecked = watch("srcloseddate");
  const srlastaccessedChecked = watch("srlastaccessed");

  return (
    <div className="checkbox-groups">
      {/* Client Info Group */}
      <div className="checkbox-group">
        <h4 style={{ fontSize: '16px', marginLeft: '15px' }}>Client Name</h4>

        {/* srclientbday */}
        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("srclientbday")}
             className ={`checkbox-secondary  ${srclientbdayChecked ? 'checkbox-chacked-secondary' : ''}`}
            />
          <p>Client Birthday</p>
        </div>

        {/* srcasestage */}
        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("srcasestage")}
             className ={`checkbox-secondary  ${srcasestageChecked ? 'checkbox-chacked-secondary' : ''}`}
            />
          <p>Case Stage</p>
        </div>

        {/* srmainphone */}
        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("srmainphone")}
             className ={`checkbox-secondary  ${srmainphoneChecked ? 'checkbox-chacked-secondary' : ''}`}
            />
          <p>Main Phone</p>
        </div>

        {/* srmainemail */}
        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("srmainemail")}
             className ={`checkbox-secondary  ${srmainemailChecked ? 'checkbox-chacked-secondary' : ''}`}
            />
          <p>Main Email</p>
        </div>
      </div>

      {/* Case Type Group */}
      <div className="checkbox-group">
        <h4 style={{ fontSize: '16px', marginLeft: '15px' }}>Case Type</h4>

     
        <div className="checkbox-item">
            <input
              className ={`checkbox-secondary  ${SRincidentdateChecked ? 'checkbox-chacked-secondary' : ''}`}
              type="checkbox"
              {...register("SRincidentdate")}
            />
         
          <p>Incident Date</p>
        </div>

        {/* sropendate */}
        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("sropendate")}
             className ={`checkbox-secondary  ${sropendateChecked ? 'checkbox-chacked-secondary' : ''}`}
            />

          <p>Open Date</p>
        </div>

        {/* srcloseddate */}
        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("srcloseddate")}
             className ={`checkbox-secondary  ${srcloseddateChecked ? 'checkbox-chacked-secondary' : ''}`}
            />
          <p>Closed Date</p>
        </div>

        <div className="checkbox-item">
            <input
              type="checkbox"
              {...register("srlastaccessed")}
             className ={`checkbox-secondary  ${srlastaccessedChecked ? 'checkbox-chacked-secondary' : ''}`}
            />
          <p>Last Accessed</p>
        </div>
      </div>
    </div>
  );
}

export default SearchOptions;
