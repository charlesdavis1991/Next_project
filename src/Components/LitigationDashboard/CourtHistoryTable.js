import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { formatDate, formatPhoneNumber, getCaseId, getClientId, getToken } from '../../Utils/helper';
import CurrentUserInfo from '../SettlementDashboard/common/CurrentUserInfo';
import CourtHistoryEmptyTable from './CourtHistoryEmptyTable';
const CourtHistoryTable = () => {
    
    const [isAbove1100, setIsAbove1100] = useState(window.innerWidth > 1100);
    
    const accessToken = getToken();
    const clientId = getClientId();
    const caseId = getCaseId();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const [courtHistory,setCourtHistory] = useState([])
    const fetchCourtHistoryTable = async() => {
        try {
            const response = await axios.get(`${origin}/api/court-history/?client_id=${clientId}&case_id=${caseId}`,{
                headers: {
                    Authorization: accessToken,
                },
            })
            setCourtHistory(response.data)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        fetchCourtHistoryTable()
        const handleResize = () => {
            setIsAbove1100(window.innerWidth > 1100);
        };

        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    },[])
    return (
        <div className="row m-0 m-b-5">
            <div className="col-md-12 pl-0 pr-0">
                <div className="no-border-1 table-responsive table--no-card m-b-40 position-relative">
                <table
                    className="table table-earning t-b-0 table-history table-striped">
                    <thead>
                    <tr className="litigation-notes-header lg-screen-header">
                        <th className="td-autosize"></th>
                        <th className="text-center text-uppercase td-autosize">Change Made</th>
                        <th className="text-center text-uppercase">Jurisdiction Type</th>
                        <th className="text-center text-uppercase">Court</th>
                        <th className="text-center text-uppercase">Judge</th>
                        <th className="text-center text-uppercase">Department</th>
                    </tr>
                    <tr className="litigation-notes-header sm-screen-header">
                        <th className="td-autosize"></th>
                        <th className="text-center text-uppercase">Change Made</th>
                        <th className="text-center text-uppercase">Jurisdiction Type & Court</th>
                        <th className="text-center text-uppercase">Judge & Department</th>
                    </tr>
                    </thead>
                    <tbody>
                        {courtHistory.length < 1 && <CourtHistoryEmptyTable isAbove1100={isAbove1100} arrayLength={4}  />}
                        {isAbove1100 && courtHistory?.map((element,index)=>
                        (<tr key={index} className='lg-screen-row'>
                            <td className="text-dark-grey text-center font-weight-semibold">{index + 1}</td>

                            <td className='td-autosize font-weight-semibold'>
                                <p className="d-flex text-darker whitespace-nowrap mb-0 height-21">
                                    <span className='ic-24'></span>
                                    <span className="ml-2 d-inline-block text-dark-grey mr-1 height-21 font-weight-semibold">{formatDate(element?.created_on)}</span>
                                    
                                </p>
                                <div className="d-flex align-items-center height-21 font-weight-semibold">
                                    <CurrentUserInfo id={element?.created_by} />    
                                </div>
                            </td>

                            <td>
                                <div className='d-flex justify-content-center font-weight-semibold'>
                                    <div className="d-flex flex-column align-items-start">
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.jurisdiction_type?.name}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.states[0]?.name}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.counties[0]?.name} County</span>
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.name}</span>
                                    </div>
                                </div>
                            </td>

                            <td>
                                <div className='d-flex justify-content-center'>
                                    <div className="d-flex flex-column align-items-start">
                                        <span className='height-21 font-weight-semibold'>{element?.court?.name || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.court?.court_contact?.address1 || ''}, {element?.court?.court_contact?.address2 || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.court?.court_contact?.city || ''}, {element?.court?.court_contact?.state || ''} {element?.court?.court_contact?.zip || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{formatPhoneNumber(element?.court?.court_contact?.phone_number)}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.court?.court_contact?.email || ''}</span>
                                    </div>
                                </div>
                            </td>

                            <td>
                                <div class="d-flex justify-content-center">
                                    <div className="d-flex flex-column align-items-start">
                                        <span className='height-21 font-weight-semibold'>Honourable {element?.judge?.judge_first_name || ''} {element?.judge?.judge_last_name || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.judge?.judge_contact?.address1 || ''}, {element?.judge?.judge_contact?.address2 || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.judge?.judge_contact?.city || ''}, {element?.judge?.judge_contact?.state || ''} {element?.judge?.judge_contact?.zip || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{formatPhoneNumber(element?.judge?.judge_contact?.phone_number)}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.judge?.judge_contact?.email || ''}</span>
                                    </div>
                                </div>
                            </td>

                            <td>
                                <div class="d-flex justify-content-center">
                                    <div className="d-flex flex-column align-items-start">
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department || ''}, {element?.department?.clerk_first_name || ''} {element?.department?.clerk_last_name || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department_contact?.address1}, {element?.department?.department_contact?.address2}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department_contact?.city || ''}, {element?.department?.department_contact?.state || ''} {element?.department?.department_contact?.zip || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{formatPhoneNumber(element?.department?.department_contact?.phone_number)}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department_contact?.email || ''}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>)
                        )}

                        {!isAbove1100 && courtHistory?.map((element,index)=>
                        (<tr key={index} className='sm-screen-row'>
                            <td className="text-dark-grey text-center td-autosize font-weight-semibold">{index + 1}</td>
                            <td className='td-autosize'>
                                <p className="d-flex text-darker whitespace-nowrap mb-0 height-21">
                                    <span className='ic-24'></span>
                                    <span className="ml-2 d-inline-block text-dark-grey mr-1 height-21 font-weight-semibold">{formatDate(element?.created_on)}</span>
                                    
                                </p>
                                <div className="d-flex align-items-center height-21 font-weight-semibold">
                                    <CurrentUserInfo id={element?.created_by} />    
                                </div>
                            </td>

                            <td>
                                <div className='d-flex flex-column align-items-center'>
                                    <div className="d-flex flex-column align-items-start">
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.jurisdiction_type?.name}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.states[0]?.name}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.counties[0]?.name} County</span>
                                        <span className='height-21 font-weight-semibold'>{element?.jurisdiction?.name}</span>

                                        <span className='height-21 font-weight-semibold'>{element?.court?.name || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.court?.court_contact?.address1 || ''}, {element?.court?.court_contact?.address2 || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.court?.court_contact?.city || ''}, {element?.court?.court_contact?.state || ''} {element?.court?.court_contact?.zip || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{formatPhoneNumber(element?.court?.court_contact?.phone_number)}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.court?.court_contact?.email || ''}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column align-items-start">
                                        <span className='height-21 font-weight-semibold'>Honourable {element?.judge?.judge_first_name || ''} {element?.judge?.judge_last_name || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.judge?.judge_contact?.address1 || ''}, {element?.judge?.judge_contact?.address2 || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.judge?.judge_contact?.city || ''}, {element?.judge?.judge_contact?.state || ''} {element?.judge?.judge_contact?.zip || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{formatPhoneNumber(element?.judge?.judge_contact?.phone_number)}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.judge?.judge_contact?.email || ''}</span>

                                        <span className='height-21 font-weight-semibold'>{element?.department?.department || ''}, {element?.department?.clerk_first_name || ''} {element?.department?.clerk_last_name || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department_contact?.address1}, {element?.department?.department_contact?.address2}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department_contact?.city || ''}, {element?.department?.department_contact?.state || ''} {element?.department?.department_contact?.zip || ''}</span>
                                        <span className='height-21 font-weight-semibold'>{formatPhoneNumber(element?.department?.department_contact?.phone_number)}</span>
                                        <span className='height-21 font-weight-semibold'>{element?.department?.department_contact?.email || ''}</span>
                                    </div>
                                </div>
                                
                            </td>
                        </tr>)
                        )}
                        {courtHistory.length > 0 && courtHistory.length < 5 && <CourtHistoryEmptyTable isAbove1100={isAbove1100} arrayLength={4 - courtHistory.length}  />}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}

export default CourtHistoryTable