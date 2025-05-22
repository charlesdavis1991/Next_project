import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { getCaseId, getClientId, mediaRoute } from '../../Utils/helper';
import SuccessAssignTaskModal from '../Modals/assignTodoSuccessModal';
import avatarImage from './../../assets/images/avatar.svg';
import incidentIcon from "../../assets/images/incident.svg";
import birthdayIcon from "../../assets/images/birthdayicon.svg";
import PulseLoader from "react-spinners/PulseLoader";
import {
  setCommonLoadingEffect,
  setComponentLoadingEffect,
} from "../../Redux/common/Loader/action";
import {
  calculateAge,
  formatDate,
  formatDateUTC,
  setCaseId,
  setClientId,
} from "../../Utils/helper";
import {
  fetchAllPages,
  fetchCurrentCase,
  setCaseSummary,
} from "../../Redux/caseData/caseDataSlice";
import { setBlurEffect } from "../../Redux/header_blur/action";
import { fetchCaseSummary } from "../../api/case";
import { setHeaderName } from "../../Redux/header_name/action";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
function CasesModal({ show, handleClose, caseType, Status, Stage, tabName, tabValue, headerString,caseTypeId }) {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');
  
  const [CasesData, setCasesData] = useState([]);
  const [FilteredCasesData, setFilteredCasesData] = useState([]);
  const [UniqueUserTypes, setUniqueUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(`${origin}/api/navigator/filter_navigator_cases/`);
  const [hasMore, setHasMore] = useState(true);
  const [requestCount, setRequestCount] = useState(0);

  // const fetchCasesData = async () => {
  //   const cases_data = await axios.get(`${origin}/api/navigator/filter_navigator_cases/`, {
  //     headers: { Authorization: token },
  //   });
  //   setCasesData(cases_data.data.cases);
  //   setUniqueUserTypes(cases_data.data.unique_user_types);
  // };
  useEffect(() => {
    if (show) {
      setHasMore(true);
      setNextPageUrl(`${origin}/api/navigator/filter_navigator_cases/`)
      setCasesData([])
    }
  }, [show]);
  const fetchCasesData = async () => {
    
    setLoading(true);
    try {
      const response = await axios.get(nextPageUrl, {
        headers: { Authorization: token },
        params: {
          caseType: caseTypeId,
          Status: Status,
          Stage: Stage,
          tabName: tabName,
          tabValue: tabValue,
        },
      });
      setCasesData(prevCases => [...prevCases, ...response.data.results.cases]);
      // Ensure asynchronous updates and avoid caching issues
      setNextPageUrl(response.data.next );
      setHasMore(!!response.data.next);
      setRequestCount( prevCount + 1 ); // Update requestCount

    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };
   const fetchUniqueUserTypes = async () => {
    const unique_usertype = await axios.get(`${origin}/api/navigator/get_unique_usertypes/`, {
      headers: { Authorization: token },
    });
    setUniqueUserTypes(unique_usertype.data.unique_user_types);
  };
  useEffect(()=>{    
    fetchUniqueUserTypes()
  },[])
  useEffect(() => {  
    if (show && hasMore && !loading) {
      const interval = setInterval(() => {
        fetchCasesData();
      }, 500);

      return () => clearInterval(interval); // Cleanup on unmount or when 'show' changes
    }
  }, [show, hasMore, loading, nextPageUrl,tabName]);


  const filterCases = () => {
    return CasesData.filter(caseItem => {      
      const matchCaseType = caseType === '' || caseItem.case.case_type?.name === caseType;
      const matchStatus = Status === 'all_status' || caseItem.case.auto_case_status.some(status => status.name === Status);
      const matchStage = Stage === 'all_stage' || caseItem.case.auto_case_stage.some(stage => stage.name === Stage);

      let matchTabValue;
      if (tabName === 'Case Age') {
        matchTabValue = tabValue === 'All' || caseItem.span_class_name === tabValue;
      } else if (tabName === 'State') {
        matchTabValue = tabValue === 'All' || caseItem.state_name === tabValue;
      } else if (tabName === 'County') {
        matchTabValue = tabValue === 'All' || caseItem.county_name === tabValue;
      } else if (tabName === 'Injury') {
        matchTabValue = tabValue === 'All' || new RegExp(`\\b${tabValue}\\b`).test(caseItem.injury_class_names);
      }
      return matchCaseType && matchStatus && matchStage && matchTabValue;
    });
  };


  const evenTypes = UniqueUserTypes.filter((_, index) => index % 2 === 0);
  const oddTypes = UniqueUserTypes.filter((_, index) => index % 2 !== 0);


  
  const [allCaseCheckbox, setAllCaseCheckbox] = useState(false);

  const handleCheckboxChange = (checkboxes, shouldCheck) => {
    checkboxes.each((index, checkbox) => {
        $(checkbox).prop("checked", shouldCheck);  
        var caseId = $(checkbox).data("case_id");
        var userId = $(checkbox).attr("data-user_id");
        handleIndividualUserTypesCheckbox({ target: { checked: shouldCheck } }, caseId, { id: userId } )
    });
};

const updateLabelColors = (checkboxes, color) => {
    checkboxes.each((index, checkbox) => {
        $(checkbox).next().css("color", color);
    });
};

const checkAnyCheckboxChecked = (checkboxes) => {
    return checkboxes.toArray().some(checkbox => $(checkbox).prop('checked'));
};

const handleAllCaseCheckbox = () => {
    setAllCaseCheckbox(!allCaseCheckbox);
    const checkboxes = $('#navigator-cases-table').find('.case-row-checkboxes');
    const allChecked = !allCaseCheckbox;

    handleCheckboxChange(checkboxes, allChecked);

    const allWorkerCheckboxes = $('#navigator-cases-table').find('.all-workers-types');
    if (allChecked && !checkAnyCheckboxChecked(allWorkerCheckboxes)) {
        updateLabelColors(allWorkerCheckboxes, "red");
    } else {
        updateLabelColors(allWorkerCheckboxes, "#000");
    }

};

const handleAllUserTypesCheckbox = (event, userTypeId) => {
    const isChecked = event.target.checked;
    const userTypeCheckboxes = $('#navigator-cases-table').find(`.case-worker-usertype-${userTypeId}`);

    handleCheckboxChange(userTypeCheckboxes, isChecked);

    if (isChecked && !allCaseCheckbox) {
        handleAllCaseCheckbox();
    }

    const allWorkerCheckboxes = $('#navigator-cases-table').find('.all-workers-types');
    if (allCaseCheckbox) {
        if (!checkAnyCheckboxChecked(allWorkerCheckboxes)) {
            updateLabelColors(allWorkerCheckboxes, "red");
        } else {
            updateLabelColors(allWorkerCheckboxes, "#000");
        }
    } else {
        updateLabelColors(allWorkerCheckboxes, "#000");
    }

    handleEnableAllTaskButton();
};


  const handleIndividualCaseCheckbox = (event, caseId) => {
    const isChecked = event.target.checked;
    const checkboxes = $(`#navigator-cases-table .case-worker-checkbox-${caseId}`);
    
    updateCheckboxColors(checkboxes, isChecked);
    handleEnableAllTaskButton()
  };
  
  const handleIndividualUserTypesCheckbox = (event, caseId,user) => {
    const isChecked = event.target.checked;
    const caseCheckbox = $(`#navigator-cases-table .case-row-checkbox-${caseId}`);
    
    if (isChecked && !caseCheckbox.prop('checked')) {
        caseCheckbox.prop('checked', true);
  
      handleIndividualCaseCheckbox({ target: caseCheckbox }, caseId);
    }
  
    updateCheckboxColors($(`#navigator-cases-table .case-worker-checkbox-${caseId}`), caseCheckbox.prop('checked'));
    handleEnableAllTaskButton()

    setCheckedUsers((prevCheckedUsers) => {
        const updatedCheckedUsers = [...prevCheckedUsers];

        if (isChecked) {
            updatedCheckedUsers.push({
                caseId,
                userId: user.id,
            });
        } else {
            const index = updatedCheckedUsers.findIndex(
                (item) => item.userId === user.id && item.caseId === caseId
            );
            if (index > -1) {
                updatedCheckedUsers.splice(index, 1);
            }
        }

        console.log('updated', updatedCheckedUsers);
        return updatedCheckedUsers;
    });
  };
  
  const updateCheckboxColors = (checkboxes, isChecked) => {
    if (isChecked){
        const anyChecked = checkboxes.toArray().some(checkbox => $(checkbox).prop('checked'));
  
    checkboxes.next().css('color', anyChecked ? '#000' : 'red');
    }
    else{
     
        for (let i = 0; i < checkboxes.length; i++) {
            $(checkboxes[i]).next().css("color", "#000");
            }
        

    }
    
  };

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const handleEnableAllTaskButton = () => {
    let check = false;
  
    const row_checkboxes = $('#navigator-cases-table .case-row-checkboxes');
    for (let i = 0; i < row_checkboxes.length; i++) {
      if ($(row_checkboxes[i]).prop('checked')) {
        const case_id = $(row_checkboxes[i]).attr('data-case-id');
        const worker_checkbox = $(`#navigator-cases-table .case-worker-checkbox-${case_id}`);
        for (let j = 0; j < worker_checkbox.length; j++) {
          if ($(worker_checkbox[j]).prop('checked')) {
            check = true;
            break; // Early exit if one worker checkbox is checked
          }
        }
        if (check) break; // Early exit if one row checkbox is checked
      }
    }
  
    setIsButtonDisabled(!check);
  };
  

  const [mainInput, setMainInput] = useState('');
  const [caseInputs, setCaseInputs] = useState({});
  const [checkedUsers, setCheckedUsers] = useState([]);

  const handleMainInputChange = (event) => {
    setMainInput(event.target.value);
  };
  const handleCaseInputChange = (event, caseId) => {
    const updatedCaseInputs = { ...caseInputs };
    updatedCaseInputs[caseId] = event.target.value;
    setCaseInputs(updatedCaseInputs);
  };


  const [newCaseTasks, setNewCaseTasks] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const sendCheckedUsersData = async () => {
    console.log('Checked users')
    const payload = checkedUsers.map((user) => ({
      ...user,
      text: mainInput
        ? `${mainInput} ${caseInputs[user.caseId] || ''}`
        : caseInputs[user.caseId] || '',
    }));

    const data = await axios.post(origin + '/api/navigator/create_navigator_todo/',
        payload,
        {
        headers: {
          Authorization: token,
        },
      });
    handleClose()
    setNewCaseTasks(data.data)
    setShowSuccessModal(true);
    setCheckedUsers([])
    setIsButtonDisabled(true)
    setAllCaseCheckbox(false)
    setMainInput('')
    setCaseInputs({})

  };
  const renderFirmUsers = (user, userType, profilePicUrl, caseId) => {
    if (user) {
      return (
        <div className="checkbox-wrapper w-100 inline-row-h-21 overflow-2100px" key={user.id}>
          <input
            data-case_id = {caseId}
            data-usertype-id={userType ? userType.pk : ''}
            data-user_id={user.id}
            onChange={(event) => handleIndividualUserTypesCheckbox(event,caseId,user)}
            className={`case-worker-checkbox-${caseId} cursor-pointer case-worker-usertype-${userType ? userType.pk : ''}`}
            type="checkbox"
            id={`case_worker_${user.id}`}
          />
          <label
            className={`ml-2 d-flex w-100 align-items-center text-left mb-0 case-worker-label- case-worker-usertype-label-${userType ? userType.pk : ''}`}
            htmlFor={`case_worker_${user.id}`}
          >
            <span className="fluid-width-50 min-w-175px">
              {userType?.fields?.name || ''}
            </span>
            <div className="d-flex">
              <span className="ic-avatar ic-19 has-avatar-icon has-cover-img mr-1">
                <img className={` output-${user.id} theme-ring ${user?.is_active ? "img-border" : ""}`} src={profilePicUrl?mediaRoute(profilePicUrl):avatarImage} />
              </span>
              <span>{`${user.user.first_name} ${user.user.last_name}`}</span>
            </div>
          </label>
        </div>
      );
    } else {
      return (
        <div className="checkbox-wrapper w-100 inline-row-h-21 overflow-2100px" key={`empty-${userType.pk}`}>
          <input type="checkbox" id={`case_worker_empty_${userType.pk}`} />
        </div>
      );
    }
  };

  
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);  
  const [showRecentCases, setShowRecentCases] = useState(false);  
  const navigate = useNavigate();
  const handleCaseSwitch = async (clientID, caseID, pageName) => {
    try {
      setIsLoading(true);
      dispatch(setComponentLoadingEffect("medicalProviders", true));
      dispatch(setComponentLoadingEffect("detailBar", true));
  
      const response = await api.get(
        `/api/switch_client/${clientID}/${caseID}/${pageName}/`
      );
  
      setClientId(clientID);
      setCaseId(caseID);
      dispatch(fetchCurrentCase(clientID, caseID));
  
      const caseSummaryData = await fetchCaseSummary(clientID, caseID);
      dispatch(setCaseSummary(caseSummaryData));
  
      dispatch(fetchAllPages(caseID));
      setIsLoading(false);
      setShowRecentCases(false);
      dispatch(setBlurEffect(false));
      dispatch(setHeaderName("Case"));
  
      document.body.classList.remove("modal-open", "has-blurred-bg");
  
      const menuContainer = document.getElementById("padding-top-165");
      if (menuContainer) {
        menuContainer.style.filter = "";
      }
  
      const divToRemove = document.querySelector(".header-blur-show");
      if (divToRemove) {
        document.body.removeChild(divToRemove);
      }
  
      navigate(`/bp-case/${clientID}/${caseID}`, { replace: true });
    } catch (err) {
      console.log("Error occurred", err);
    }
  };
  
  return (
    <>
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-dialog modal-lg modal-dialog-centered max-800p custom-insurance-dialog">
      <Modal.Header closeButton className='text-center p-0 bg-primary popup-heading-color justify-content-center modal-header'>
        <Modal.Title>Case Navigator: Assign Tasks to Sorted Cases</Modal.Title>
      </Modal.Header>
      <Modal.Body className='pt-0 overflow-x-scroll invisible-scrollbar' style={{height:"550px"}}>
        <p className="text-center p-t-5 p-b-5 middle-text1">
          {headerString}
        </p>
        <table className="table table-borderless table-striped table-earning has-height-25 additional-instructions navigator-standard-table-header" id='navigator-cases-table'>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th className="fluid-width-60 text-uppercase">Additional Instructions for Each Task</th>
              <th className="fluid-width-50 text-uppercase">Case Workers</th>
            </tr>
          </thead>
          <tbody>
            <tr className="has-white-td">
              <td><input onChange={handleAllCaseCheckbox} checked={allCaseCheckbox} className="all_checkbox_check align-middle cursor-pointer" type="checkbox" /></td>
              <td></td>
              <td className="text-left white_space-wrap assign-task-container">
                <div className="assign-task-div-2 white-space">Assign Task to All Cases Listed Here</div>
              </td>
              <td></td>
              <td className="text-left">
                <input type="text" className="form-control all-checkbox-text" value={mainInput}
                onChange={handleMainInputChange} />
              </td>
              <td className="td-autosize">
                <div className="row flex-nowrap m-0 top-checkboxes">
                  <div className="col-md-6 col-lg-6 pl-0">
                    {evenTypes.map((type, index) => {
                      const parsedType = JSON.parse(type)[0];
                      return (
                        <div key={parsedType.pk} className={`checkbox-wrapper ${parsedType.pk}`}>
                          <input
                            data-usertype-id={parsedType.pk}
                            data-user_id=""
                            className="all-workers-types cursor-pointer"
                            type="checkbox"
                            id={`case_worker_${index * 2 + 1}`}
                            onChange={() => handleAllUserTypesCheckbox(event,parsedType.pk)}
                          />
                          <label className="ml-2 text-left mb-0" htmlFor={`case_worker_${index * 2 + 1}`}>
                            {parsedType?.fields?.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <div className="col-md-6 col-lg-6 pl-0">
                    {oddTypes.map((type, index) => {
                      const parsedType = JSON.parse(type)[0];
                      return (
                        <div key={parsedType?.pk} className="checkbox-wrapper">
                          <input
                            data-usertype-id={parsedType?.pk}
                            data-user_id=""
                            className="all-workers-types cursor-pointer"
                            type="checkbox"
                            id={`case_worker_${index * 2 + 2}`}
                            onChange={() => handleAllUserTypesCheckbox(event,parsedType?.pk)}
                          />
                          <label className="ml-2 text-left mb-0" htmlFor={`case_worker_${index * 2 + 2}`}>
                            {parsedType?.fields?.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody className="all_case_tbody_case_age">
            <tr className="header">
              <th></th>
              <th className="columnCounter"></th>
              <th className="text-center">Client</th>
              <th className="text-center">Case</th>
              <th></th>
              <th></th>
            </tr>
            {CasesData.map((caseItem, index) => (
              <tr key={index} data-case_id={caseItem.case.id} className={`checklist-wo-header-height-63px ${caseItem.span_class_name} ${caseItem.state_name} ${caseItem.county_name} ${caseItem.injury_class_names}`}>
                <td><input type="checkbox" data-case-id={caseItem.case.id} className={`case-row-checkboxes cursor-pointer case-row-checkbox-${caseItem.case.id}`} onChange={() => handleIndividualCaseCheckbox(event,caseItem.case.id)} /></td>
                <td className='width-36' onClick={async (e) => {
                    e.preventDefault();
                    const clientID = getClientId();
                    const caseID = getCaseId();
                    const pageName = 'Case';

                    await handleCaseSwitch(clientID, caseID, pageName);
                  }}>{index + 1}</td>
                <td className="text-left" onClick={async (e) => {
                    e.preventDefault();
                    const clientID = getClientId();
                    const caseID = getCaseId();
                    const pageName = 'Case';

                    await handleCaseSwitch(clientID, caseID, pageName);
                  }}>
                  <div className="d-flex align-items-center">
                    <span className="ic-avatar ic-29 has-avatar-icon has-cover-img">
                      <img className="output-18 theme-ring" src={mediaRoute(caseItem.case.for_client.profile_pic_29p ? caseItem.case.for_client.profile_pic_29p : avatarImage)}/>
                    </span>
                    <div className="ml-1">
                      <p className="text-darker font-weight-semibold">{caseItem.case.for_client?.last_name}, {caseItem.case.for_client?.first_name}</p>
                      <p className="text-darker d-flex align-items-center">
                          <span className="ic-avatar ic-19 d-flex m-r-5">
                            <img src={birthdayIcon}/>
                          </span>
                          <span>{caseItem.case.for_client?.birthday}</span>
                         
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-left" onClick={async (e) => {
                    e.preventDefault();
                    const clientID = getClientId();
                    const caseID = getCaseId();
                    const pageName = 'Case';

                    await handleCaseSwitch(clientID, caseID, pageName);
                  }}>
                  <div className="d-flex align-items-center">
                    <div className="ml-1">
                      <p className="text-darker d-flex">
                        <span className="ic-avatar ic-19 mr-1">
                          <img src={mediaRoute(caseItem.case.case_type?.casetype_icon)} />
                        </span>{caseItem.case.case_type?.name}
                      </p>
                      <p className="text-darker d-flex align-items-center">
                        <span className="ic-avatar ic-19 d-flex m-r-5">
                          <img src={incidentIcon} className="" />
                        </span>
                        <span>{caseItem.case?.incident_date}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-left">
                  <input type="text" className="form-control case-row-text-46" 
                  value={caseInputs[caseItem.case.id] || ''}
                  onChange={(event) => handleCaseInputChange(event, caseItem.case.id)} />
                </td>
                <td className="td-autosize">
                  <div className="row flex-nowrap m-0 main-checkboxes block-2100px">
                    <div className="col-md-6 col-lg-6 pl-0">
                      {renderFirmUsers(caseItem.case.firm_user1, caseItem.sorted_user_types[0], (caseItem.case.firm_user1?.profile_pic_19p), caseItem.case.id)}
                      {renderFirmUsers(caseItem.case.firm_user2, caseItem.sorted_user_types[1], (caseItem.case.firm_user2?.profile_pic_19p), caseItem.case.id)}
                      {renderFirmUsers(caseItem.case.firm_user3, caseItem.sorted_user_types[2], (caseItem.case.firm_user3?.profile_pic_19p), caseItem.case.id)}
                    </div>
                    <div className="col-md-6 col-lg-6 pl-0">
                      {renderFirmUsers(caseItem.case.firm_user4, caseItem.sorted_user_types[3], (caseItem.case.firm_user4?.profile_pic_19p), caseItem.case.id)}
                      {renderFirmUsers(caseItem.case.firm_user5, caseItem.sorted_user_types[4], (caseItem.case.firm_user5?.profile_pic_19p), caseItem.case.id)}
                      {renderFirmUsers(caseItem.case.firm_user6, caseItem.sorted_user_types[5], (caseItem.case.firm_user6?.profile_pic_19p), caseItem.case.id)}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {hasMore && <tr><td colSpan="6" className="text-center">
              <PulseLoader
              loading={true}
              size={14}
              aria-label="Loading Spinner"
              data-testid="loader"
              color="#19395F"
              style={{
                paddingTop: `5px`,
              }}
            /></td></tr>}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className='h-35px'  onClick={handleClose}>Cancel</Button>
        <Button id='createTodoSaveBtn' variant="success" disabled={isButtonDisabled} onClick={sendCheckedUsersData}>Assign Tasks</Button>
      </Modal.Footer>
    </Modal>    
     <SuccessAssignTaskModal
     show={showSuccessModal}
     setRes={setNewCaseTasks}
     handleClose={handleCloseSuccessModal}
     res={newCaseTasks}
   />
   </>

  );
}

CasesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  caseType: PropTypes.string,
  Status: PropTypes.string,
  Stage: PropTypes.string,
  tabName: PropTypes.string,
  tabValue: PropTypes.string,
};

export default CasesModal;
