import React, {useState} from "react";
import Dropdown  from "./dropdwon";
import Modal from "../modals/modal";
import HeaderModal from "../modals/insuranceHeaderModal";

const InsuranceHeader = (props) => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () =>{
        setOpen(!open)
    }
    
    return (
        <div className="row mt-2">
        <div className="col-md-10 pr-0">
            <div className="d-flex">
                <div ><i class="ic ic-insurance ic-25"></i></div>
                <div className="skew-insurance ml-2"></div>
                <div className="insurance-header w-100">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="ml-2 text-white d-flex">
                                <h5 className="text-white font-weight-normal">{props.title}</h5>
                                <div className="ml-3">
                                    for Client
                                </div>
                                <h4 class="d-flex align-items-center text-white ml-5 text-transform-uppercase">
                                    <small class="font-weight-bold"> {props.name} </small>
                                </h4>
                            </div>
                        </div>
                        <div className="col-md-5 d-flex justify-content-center">
                            <div className="ml-2 text-white d-flex">
                                <div className="ml-3" onClick={handleOpen}>
                                  {props.notes}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
          <div className="col-md-2 pl-0 pr-0" style={{marginLeft:"-9px"}}>
                <div className="d-flex">
                    <div className="client-check-list-skew"></div>
                    <div className="client-insurance-checklist w-100 d-flex justify-content-space-between">
                        <div className="d-flex justify-content-space-between">
                            {props.progess}
                            <span class="ml-2 ic has-no-after ic-check text-success d-flex align-items-center justify-content-center text-brightgreen">
                            <svg width="17" height="50" viewBox="0 0 17 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 25.5923L2.16281 23.2528L6.69618 27.4438L14.5501 18L17 20.0372L6.99858 32.0626L0 25.5923Z" fill="currentColor"></path>
                            </svg>
                        </span>
                        </div>
                        <div className="d-flex pr-1">
                            <div class="text-white break-after-word">{props.checklist }</div>
                            
                                <Dropdown label={props.label} className="order-3"/>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={open} onHide={()=> setOpen(false)} size="modal-w60">
                <HeaderModal hideModal={()=> setOpen(false)} />
            </Modal>
    </div>
    )
}

export default InsuranceHeader;