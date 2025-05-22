import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientModal from "../Modals/clientModal";
import EmailModal from "../Modals/emailModal";
import TextModal from "../Modals/textModal";
import { useSelector } from "react-redux";
import bdayIcon from "../../assets/images/birthdayicon.svg";
import incidentIcon from "../../assets/images/incident.svg";
import TableLoader from "../Loaders/tableLoader";
import { mediaRoute } from "../../Utils/helper";
import { addNote } from "../../Redux/notes/notesSlice";
import { useDispatch } from "react-redux";
import NotesCategoryDropdown from "./NotesCategoryDropdown";



const Table1 = (props) => {
  const defaltImagePath = "bp_assets/img/avatar.png"
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Redux
  let {data} = useSelector((state) => state.searchS.searchResult);
  const searchAlphabet = useSelector((state) => state.searchS.searchAlphabet);
  const isLoading = useSelector((state) => state.searchS.loading);
  

  // States
  const [customModalShow, setcustomModalShow] = useState(false);
  const [textModalShow, setTextModalShow] = useState(false);
  const [emailModalShow, setEmailModalShow] = useState(false);
  const [NoteDescription, setNoteDescription] = useState('');

  // Handlers not used for now
  const showCustomModal = (event) => {
    event.preventDefault();
    setcustomModalShow(!customModalShow);
  };
  const showTextModal = (event) => {
    event.preventDefault();
    setTextModalShow(!textModalShow);
  };

  const showEmailModal = (event) => {
    event.preventDefault();
    setEmailModalShow(!emailModalShow);
  };

  const openCase = (client_id,case_id)=>{
    navigate(`/bp-case/${client_id}/${case_id}`)
  }

  const handleTextChange = (event) => {
    setNoteDescription(event.target.value);
};

  const handleNoteCreateFormSubmission = async (category, description) => {
    const currentDate = new Date();
    await dispatch(
      addNote({
        client_id: getClientId(),
        case_id: getCaseId(),
        category: category,
        entity_type: "None",
        record_id: 0,
        description: description,
        created_at: currentDate.toLocaleString()
      })
    );
    setNoteDescription('')
  };



  return (
    <>
     {isLoading ? <TableLoader/>: 
     <table className="table-borderless table-striped table-earning theme-colored fake-rows-2">
     <thead>
       {data?.length > 0 && (
         <tr>
           <th class="testSearch-width-1P"></th>
           <th class="text-center" style={{width:"5%"}}>Case</th>
           <th class="text-center" style={{width:"40%"}}>Result</th>
           <th style={{width:"5px"}}></th>
           <th class=" text-center" style={{width:"20%"}}>NOTES AND TODOS</th>
           <th style={{width:"15%"}}></th>
           <th class="has-form-check"></th>
           <th></th>
           <th></th>
         </tr>
       )}
     </thead>
     <tbody>
       {data
         ? data?.map((record, index) => (
             <tr className="search-row fake-row-2 p-5 vertical-align-middle">
               <td className="td-autosize text-center" onClick={()=> openCase(record.for_client.id,record.id)}>&nbsp;&nbsp; {index + 1}</td>
               <td style={{cursor:"pointer"}}  onClick={()=> openCase(record.for_client.id,record.id)}>
               
              <div className="d-flex align-items-center client-name-box account_text-ellipsis"  style={{ height: "21px" }}>
                <span className="ic mar-8 ic-avatar ic-19 has-avatar-icon has-cover-img">
                  <img
                    src={
                      record?.for_client?.profile_pic_19p ||
                      "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar_new.svg"
                    }
                    className="output-3 theme-ring"
                    alt="avatar"
                  />
                </span>
                <span className="text-black text-black-2 whitespace-nowrap text-nowrap account_text-ellipsis font-600">
                  {record?.for_client?.last_name},{" "}
                  {record?.for_client?.first_name}
                </span>
              </div>
              <p className="text-darker account_text-ellipsis">
                <span className="text-grey mr-1">DOB</span>
                {record?.for_client?.birthday}
              </p>
              <div className="visible-responsive">
                <div className="search-Flex-1">
                  {record?.case_type?.casetype_icon && (
                    <img
                      src={mediaRoute(record.case_type.casetype_icon)}
                     
                    />
                  )}
                  <p className="MR8H19">{record?.case_type?.name}</p>
                </div>
                <p className="text-darker text-start-important">
                  <span className="d-inline-block text-grey mr-1 ">DOI</span>
                  {record?.incident_date}
                </p>
              </div>
            </td>


               

               <td className="text-left" style={{whiteSpace: "nowrap",cursor:"pointer" }} onClick={()=> openCase(record.for_client.id,record.id)}>
                 Last Name Starting with <br/>
                 <b className="text-center" style={{ display: "block" }}>'{searchAlphabet}'</b>
               </td>
               <td className="text-center" style={{height:"100%"}}>
                 <div style={{"left": "75px"}} className="d-flex ">
                   {/* <div className="button-skew-1R-custom"> */}
                   <div style={{height:"75px"}} >
                     <button
                       onClick={() =>
                         props.addNotesHandler(
                           "note",
                           record?.id,
                           record?.for_client?.id
                         )
                       }
                       className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                       style={{whiteSpace:"normal",marginRight:"5px"}}
                     >
                       <span className="anti-skew btn-text-holder Pos-Rel-1T">
                        Assign Note Task
                       </span>
                     </button>
                   </div>
                   {/* <div className="button-skew-2R-custom"> */}
                   <div style={{height:"75px"}}>
                     <button
                       onClick={() =>
                         props.addNotesHandler(
                           "critical",
                           record?.id,
                           record?.for_client?.id
                         )
                       }
                       className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                       style={{whiteSpace:"normal",marginRight:"5px"}}
                     >
                       <span className="anti-skew btn-text-holder Pos-Rel-1T p-l-5 text-left">
                         Critical Case Note
                       </span>
                     </button>
                   </div>
                   <div style={{height:"75px"}}>
                     <button
                       onClick={() =>
                         props.addNotesHandler(
                           "update",
                           record?.id,
                           record?.for_client?.id
                         )
                       }
                       className="btn btn-primary mb-1 height-100 Width-75-ic-1 d-flex align-items-center justify-content-center no-border-radius angle-skew-11"
                       style={{whiteSpace:"normal",marginRight:"5px"}}
                     >
                       <span className="anti-skew btn-text-holder Pos-Rel-1T p-l-5 text-left">
                         Update Case Status
                       </span>
                     </button>
                   </div>
                 </div>
               </td>
               <td className="text-center">
                 <div
                   className="justify-content-center"
                   style={{ width: "100% !important", height: "80%" }}
                 >
                   <form id="notes-form" style={{ height: "75px",position:"relative",top:"13.2%",paddingLeft:"0px" }}>
                     <div className="notes-text-area primary-border-2" style={{ marginLeft: "0px", marginRight: "15px" }}>
                       <textarea
                         onclick=""
                         id={
                           record
                             ? "case-note-" + record.id.toString()
                             : "case-note"
                         }
                         required
                         style={{fontSize: "14px"}}
                         name="description"
                         value={NoteDescription}
                         onChange={handleTextChange}
                         placeholder="Input a text for a note, task or client communication:"
                         className="form-control d-inline-block ML5PX-PLC"
                       ></textarea>
                     </div>
                   </form>
                 </div>
               </td>

               <td style={{  cursor:"pointer" }} className="text-right"  onClick={()=> openCase(record.for_client.id,record.id)}>
               <NotesCategoryDropdown handleNoteCreateFormSubmission={handleNoteCreateFormSubmission} NoteDescription={NoteDescription} />
               </td>
             
             </tr>
           ))
         : null}
     </tbody>
     <tr
       style={{
         height: "94px",
       }}
       className="search-row fake-row-2 p-5"
     >
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
     <tr style={{ height: "94px" }} className="search-row fake-row-2 p-5">
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
       <td></td>
     </tr>
   </table>
      }
      <ClientModal
        show={customModalShow}
        onHide={() => setcustomModalShow(false)}
      />
      <EmailModal
        show={emailModalShow}
        onHide={() => setEmailModalShow(false)}
      />
      <TextModal show={textModalShow} onHide={() => setTextModalShow(false)} />
    </>
  );
};

export default Table1;
