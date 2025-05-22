import React,{useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddOfferPopUp from './AddOfferModal/AddOfferPopUp';
import GenerateCheckPopup from './GenerateCheckPopup';
import CounterOfferPopup from './CounterOfferPopup';
import AddFeePopup from './AddFeePopup';
import AddInsuranceLienPopup from './AddInsuranceLienPopup';
import AddOtherLienPopup from './AddOtherLienPopup';
import AddClientProceedPopup from './AddClientProceedPopup';
import AddCostReimbursePopUp from './AddCostReimbursePopup';
import { useSelector } from 'react-redux';
import AddProviderLienPopup from './AddProviderLienPopup';

const GenericSettlementAddPopup = ({
        show, 
        handleClose,
        addOfferObj, 
        generateCheckObj, 
        counterOfferObj, 
        addFeeObj, 
        addInsuranceLienObj,
        addClientProceedObj,
        addCostReimburseObj,
        addOtherLienObj,
        addMedicalProviderObj,
        initialLabel
    }) => {
    const caseSummary = useSelector((state) => state?.caseData?.summary);
    const labelsData = [ 
        {
            id:1,
            label:"Initial Demand or Offer",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:2,
            label:"Counter Offer",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:3,
            label:"Settlement Check",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:4,
            label:"Fee",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:5,
            label:"Firm Cost Reimbursement",
            header1Label:"Firm Cost Reimbursement"
        },
        {
            id:6,
            label:"Medical Provider Lien or Expense",
            header1Label:"Medical Provider Lien or Expense"
        },
        {
            id:7,
            label:"Insurance Lien",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:8,
            label:"Additional Liens",
            header1Label:`Additional Lien`
        },
        {
            id:9,
            label:"Loan and Advance",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:10,
            label:"Attorney Lien",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },
        {
            id:11,
            label:"Client Proceeds Check",
            header1Label:"Initial Demand or Offer: Select the negotiating Parties"
        },

    ]
    const [disabledSaveBtn, setDisabledSaveBtn] = useState(true);
    const handleDisableSaveBtn = (val) =>{
        setDisabledSaveBtn(val);
    }
    const [selectedLabel1, setSelectedLabel1] = useState(initialLabel);
    const [isOpen1, setIsOpen1] = useState(false);
    const dropdownRef1 = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
        setIsOpen1(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);
    const handleDropdownToggle1 = () => {
        setIsOpen1((prev) => !prev);
    };

    const handleSelection1 = (e,label) => {
        e.stopPropagation();
        setSelectedLabel1(label);
        setIsOpen1(false);
    };
    useEffect(() => {
        if (!show) {
            $('.modal').hide();
            setSelectedLabel1("Select a new Settlement Item")
        }
    }, [show]);
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        centered 
        size="lg"
        dialogClassName="max-1050 modal-dialog-centered"
        contentClassName="custom-modal-new-provider height-542"
        >
        <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Add new Settlement Item</div></div>
        <Modal.Body style={{padding:"0px"}}>
            <div>
                <span className='d-inline-block text-left font-weight-600 text-primary p-l-5 p-r-5' >Select a new Settlement Item from the Dropdown List Below. Controls for inputting the selected Settlement Item will appear below. All controls for Editing or Deleting the Settlement Item after input here are available by clicking the item on the Settle page after it has been input.</span>
            </div>
            <div>
                <div className="d-flex justify-content-center m-t-5 m-b-5 align-items-center">
                    <div className="dropdown-container custom-select-state-entity" style={{width:"300px"}} ref={dropdownRef1}>
                        <div className="form-select form-control d-flex align-items-center height-25 rounded-0" onClick={handleDropdownToggle1} style={{ padding: "0px" }}>
                            <span className={`generic-settlement-popup ${selectedLabel1 === "Select a new Settlement Item" ? "text-grey" : "color-primary"}`} style={{padding:"5px"}}>{ selectedLabel1 === "Select a new Settlement Item" ? "Select a new Settlement Item" : selectedLabel1 }</span>
                            {isOpen1 && (
                                <ul className="dropdown-list generic-settlement-popup" style={{ marginTop: "25px",top:"0px" }}>
                                    {labelsData?.map((labelData, index) => (
                                        <li
                                            key={index}
                                            className='dropdown-list-item color-primary'
                                            onClick={(e) => handleSelection1(
                                                e,
                                                labelData.label
                                            )}
                                        >
                                            {labelData.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`d-flex align-items-center justify-content-center text-uppercase height-25 font-weight-semibold ${selectedLabel1=="Select a new Settlement Item" ? "not-selected-option" : "selected-option"}`}>
                    <span className='text-uppercase'>{selectedLabel1=="Select a new Settlement Item" ? "Select Settlement Item Above" : labelsData.find((labelData)=>labelData.label==selectedLabel1 ).header1Label}</span>
                </div>
            </div>
            {
                selectedLabel1 === "Select a new Settlement Item" && 
                <div className='d-flex flex-column align-items-center justify-content-center' style={{height:"calc(100% - 92px)"}}>
                    <p className='font-weight-semibold mb-3' style={{color:"var(--primary) !important"}}>Select the Settlement Item above.</p>
                    <p className='font-weight-semibold mb-3' style={{color:"var(--primary) !important"}}>After Selection, controls for entering the new Settlement Item will appear here.</p>
                    <p className='font-weight-semibold text-center' style={{color:"var(--primary) !important",width:"53%"}}>If you need to edit or delete a settlement item, you can do it on the Settle page by clicking directly on the Settlement Item you want to edit or delete.</p>
                </div>
            }
            {
                selectedLabel1 === "Initial Demand or Offer" && 
                <AddOfferPopUp 
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    addOfferObj = {addOfferObj}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Settlement Check" && 
                <GenerateCheckPopup 
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    generateCheckObj = {generateCheckObj}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Counter Offer" &&
                <CounterOfferPopup 
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    counterOfferObj = {counterOfferObj}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Fee" &&
                <AddFeePopup 
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    addFeeObj = {addFeeObj}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Insurance Lien" &&
                <AddInsuranceLienPopup 
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    addInsuranceLienObj = {addInsuranceLienObj}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Additional Liens" &&
                <AddOtherLienPopup 
                    addOtherLienObj={addOtherLienObj}
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Client Proceeds Check" &&
                <AddClientProceedPopup 
                    addClientProceedObj={addClientProceedObj}
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    handleClose={handleClose}
                />
            }
            {
                selectedLabel1 === "Firm Cost Reimbursement" &&
                <AddCostReimbursePopUp 
                    addCostReimburseObj={addCostReimburseObj}
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    handleClose={handleClose}
                />
            }
            {   
                selectedLabel1 === "Medical Provider Lien or Expense" &&
                <AddProviderLienPopup 
                    addMedicalProviderObj={addMedicalProviderObj}
                    handleDisableSaveBtn={handleDisableSaveBtn}
                    handleClose={handleClose}
                    firmName={caseSummary}
                />

            }

        </Modal.Body>
        <div className="d-flex justify-content-between p-r-5 p-b-5 p-l-5">
            <Button 
                variant="secondary" 
                className="height-25" 
                style={{padding:"0px 12px"}} 
                onClick={handleClose}
            >
            Close
            </Button>
            <div>
            <Button 
                type="submit" 
                variant="success" 
                className="height-25" 
                style={{padding:"0px 12px"}}
                disabled={disabledSaveBtn}
                onClick={() => {
                    const selected = selectedLabel1;
                    if (selected === "Initial Demand or Offer") {
                        document.querySelector('.initial-offer-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                    else if (selected === "Counter Offer") {
                        document.querySelector('.counter-offer-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                    else if (selected === "Fee") {
                        document.querySelector('.fee-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                    else if (selected === "Insurance Lien") {
                        document.querySelector('.insurance-lien-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                    else if (selected === "Additional Liens") {
                        document.querySelector('.other-lien-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                    else if (selected === "Client Proceeds Check") {
                        handleClose();
                    }
                    else if (selected === "Firm Cost Reimbursement") {
                        handleClose();
                    }
                    else if (selected === "Settlement Check") {
                        handleClose();
                    }
                    else if (selected === "Client Proceeds Check") {
                        handleClose();
                    }
                    else if (selected === "Medical Provider Lien or Expense") {
                        addMedicalProviderObj.updateMedicalBillsState();
                        handleClose();
                    }
                }}
            >
                Save and Close
            </Button>
            </div>
        </div>
    </Modal>
    )
}

export default GenericSettlementAddPopup