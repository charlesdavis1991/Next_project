import { useDispatch, useSelector } from "react-redux";
import { getCheckListPercentage } from "../../Redux/checklist/actions"
import React, { useState, useEffect } from "react";
import CaseDetailsModal from "./CaseDetailsModal"
import AssignTaskConfirmationModal from "./AssignTaskConfirmationModal"
import ProgressCircle from "./ProgressCircle"
import ReactDOM from 'react-dom';


const CheckListCircularProgress = ({pageItem , case_type_name="All", targetTag="", duration=90}) => {
    
    const case_percentage = useSelector((state) => state.checkLists.case_percentage[case_type_name]?.[JSON.parse(pageItem)[0]?.fields.name]?.data || 0);

    const dispatch = useDispatch();    
    const pageData = JSON.parse(pageItem)[0]   

    const [showModal, setShowModal] = useState(false)


    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    

    const [uniqueCases, setUniqueCases] = useState(null)
    
    

    useEffect(() => {
        getCheckListPercentage(dispatch, JSON.parse(pageItem)[0]?.fields.name, duration, case_type_name)
    }, [])
    
    // const [data, setData] = useState(null)

    const clickHandler = (e) => {
        if(showModal){
            setShowModal(false)
            document.body.classList.remove('modal-open');
        } else{
            setShowModal(true)
            document.body.classList.add('modal-open');
        }
        
    }

    // const json_response = useSelector((state) => state?.checkLists?.assignTask?.json_response_data || null);
    
    const confirmationModalHandler = () =>{
        // setData(json_response)
        if(showConfirmationModal){
            setShowConfirmationModal(false)
            document.body.classList.remove('modal-open');
        } else{
            setShowConfirmationModal(true)
            document.body.classList.add('modal-open');
        }
    }

    return (
        <>
            {/* {showModal && <CaseDetailsModal pageItem={pageItem} case_percentage={case_percentage}  />} */}
            {showModal && (
                ReactDOM.createPortal(
                    <CaseDetailsModal pageItem={pageItem} case_percentage={case_percentage} duration={duration} changeModalState={clickHandler}
                    case_type_name={case_type_name}
                    confirmationModalHandler={confirmationModalHandler}
                    setUniqueCases={setUniqueCases}
                    />,
                    document.body
                )
            )}
            {showConfirmationModal && (
                ReactDOM.createPortal(
                    <AssignTaskConfirmationModal
                        confirmationModalHandler={confirmationModalHandler}
                        uniqueCases={uniqueCases}
                        
                    />,
                    document.body
                )
            )}
            <td onClick={clickHandler}>
                <ProgressCircle  case_percentage={case_percentage} />
            </td>
        </>
    )
}


export default CheckListCircularProgress;