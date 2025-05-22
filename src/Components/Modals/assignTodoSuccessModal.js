import React from 'react';
import "../../../public/BP_resources/css/notes-section.css";
import "../../../public/BP_resources/css/global-modals.css";
import avatarImage from './../../assets/images/avatar.svg';
import birthdayIcon from "./../../assets/images/birthdayicon.svg"
import incidentSvg from "./../../assets/images/incident.svg"
import { mediaRoute } from '../../Utils/helper';
import { Modal, Button, Table } from 'react-bootstrap';


const SuccessAssignTaskModal = ({ show,handleClose,res,setRes}) => {
  const length = res.length;
  function closeClickHandler(){
    setRes([]);
    handleClose();
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };
  const renderTableRows = () => {
    return res.map((item, index) => {
      let client = '';
      let caseData = '';
      let todoFor = '';
      let createdBy = item?.created_by?.first_name + " " + item?.created_by?.last_name;
      console.log(item)
      if (item.for_client) {
        client = `${item.for_client.last_name} ${item.for_client.first_name}`;
      }

      if (item.todo_for) {
        todoFor = `${item.todo_for.user.first_name} ${item.todo_for.user.last_name}`;
      }

      if (item.for_case) {
        let caseType = '';
        if (item.for_case.case_type) {
       
          caseType = item.for_case.case_type.name;
          caseData = (
            <span>
              <p><img style={{width:"19px",height:"19px",marginRight:"8px"  }} src={birthdayIcon} alt={""}></img>{item?.for_case?.for_client?.birthday}</p>
              <p > 
                <img style={{width:"19px",height:"19px",marginRight:"8px"}} src={item?.for_case?.case_type?.casetype_icon ? mediaRoute(item?.for_case?.case_type?.casetype_icon) : avatarImage} alt={""}></img>
                {caseType}
              </p>
              <p>
                <img style={{width:"19px",height:"19px",marginRight:"8px"}} src={incidentSvg} alt={"Case Type Image"}></img>
                {item?.for_case?.incident_date}</p>
            </span>
          );
        }
      }

      return (
        <tr key={index} >
          <td className='width-36'>{index + 1}</td>
          <td className="td-autosize">
            <div className="d-flex align-items-center">
                <div className="ic ic-29 align-items-center justify-content-center">
                  <img className={`icon-29 output-${(res?.created_by?.id)} theme-ring`} src={res?.created_by?.bp_userprofile?.profile_pic ? mediaRoute(res?.created_by?.bp_userprofile?.profile_pic): avatarImage} alt="profile" />
                </div>
                <div className="m-l-5">{createdBy}</div>
            </div>
          </td>
          <td className="text-justify">
            <p>
              <img style={{width:"19px",height:"19px",marginRight:"8px", borderRadius:"10px"}} src={item?.for_client?.profile_pic ? mediaRoute(item?.for_client?.profile_pic) : avatarImage} alt={""}></img>
              {client}</p>
            <p>{caseData}</p>
          </td>
          <td style={{whiteSpace:"wrap"}}>
            <div className="d-flex align-items-center justify-content-center">
              {item.notes}
            </div>
          </td>
          <td className="td-autosize">
            <div className="d-flex align-items-center">
              <div className="ic ic-29 align-items-center justify-content-center">
                <img className={`icon-29 output-${item.todo_for.user.id} theme-ring`} src={item?.todo_for?.profile_pic ? mediaRoute(item?.todo_for?.profile_pic) : avatarImage} alt="profile" />
              </div>
              <div style={{marginLeft:"8px"}}>{todoFor} <br/>{formatDate(item.created_at)}</div>
            </div>
          </td>
          <td className="td-autosize">{formatDate(item.due_date)}</td>
        </tr>
      );
    });
  };

  return (
    <Modal
      show={show}
      onHide={closeClickHandler}
      keyboard={false}
      centered
      style={{ zIndex: 100000 }}
      dialogClassName="modal-dialog modal-lg modal-dialog-centered max-800p custom-insurance-dialog"
    >
      <Modal.Header className="text-center p-0 bg-primary popup-heading-color justify-content-center modal-header">
        <Modal.Title className="mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
          You assigned Tasks to {length} worker{length > 1 ? "s" : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overflow-x-hidden overflow-y-scroll invisible-scrollbar p-l-5 p-r-5 p-b-5" style={{ height: '550px' }}>
        <Table hover borderless striped className='table table-borderless table-striped table-earning has-height-25 additional-instructions navigator-standard-table-header'>
          <thead>
            <tr>
              <th></th>
              <th className="text-uppercase">Created By</th>
              <th className="text-uppercase td-autosize">Case</th>
              <th className="text-uppercase">Task</th>
              <th className="text-uppercase">Assigned to</th>
              <th className="text-uppercase">Due By</th>
            </tr>
          </thead>
          <tbody>{renderTableRows()}</tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-between pt-0 m-t-5" style={{justifyContent:'flex-end'}}>
        <Button variant="secondary" onClick={closeClickHandler}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    // <div className='modal generic-popup fade bd-example-modal-lg show'  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',zIndex:100000,display: show ? 'flex' : 'none', justifyContent:"center",alignItems:"center" }}>
    // <div style={{background:"white",width:"80%"}} className='modal-lg max-800p'>
    
    //   <div className="modal-header text-center p-0 bg-primary popup-heading-color justify-content-center" >
    //     <h5 className="modal-title mx-auto font-size-24 height-35 font-weight-semibold text-uppercase popup-heading-color font-weight-500">
    //       You assigned Tasks to {length} worker{length > 1 ? "s" : ""}
    //     </h5>
    //   </div>
    //   <div className="modal-body overflow-x-scroll" style={{height:'450px'}}>
    //     <table className="table table-hover table-borderless table-striped table-earning">
    //       <thead>
    //         <tr>
    //           <th></th>
    //           <th className='text-uppercase'>Created By</th>
    //           <th className='text-uppercase'>Case</th>
    //           <th className='text-uppercase'>Task</th>
    //           <th className='text-uppercase'>Assigned to</th>
    //           <th className='text-uppercase'>Due By</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {renderTableRows()}
    //       </tbody>
    //     </table>
    //   </div>
    //   <div className="modal-footer border-0 justify-content-between pt-0">
    //     <button type="button" onClick={closeClickHandler} className="btn btn-secondary doc-pop-margin-0-auto-0-auto" data-dismiss="modal">
    //       Close
    //     </button>
    //   </div>
    // </div>
    // </div>
  );
};

export default SuccessAssignTaskModal;