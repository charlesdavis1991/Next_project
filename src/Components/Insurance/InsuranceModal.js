import React, { useEffect,useRef,useState } from 'react';
import { Modal, Button, Nav, Form, Col, Row,Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { editInsurance  } from '../../Redux/insurance/insuranceSlice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import api from '../../api/api';
import AutoCompleteSearch from './AutoCompleteSearch';
import { format } from 'date-fns';
import { formatDateForModalFields ,formatDateForSubmission, getToken } from '../../Utils/helper';
import axios from 'axios';
import GenericTabs from '../common/GenericTab';
import ContactPanel from '../common/ContactPanel';
import InformationPanel from '../common/InformationPanel';
import SelectStateModal from '../TreatmentPage/modals/state-modal/SelectStateModal';

function InsuranceModal({ show, handleClose,handleInsuranceCreation,insurance={},insuranceTypes=[],states=[],litigation={},activeTab,deleteInsuranceHandler, InsuranceButtons }) {
  const { register,setValue, handleSubmit,watch ,formState: { errors } } = useForm();
  const dispatch = useDispatch()
  const [searchedInsurances,setSerachInsurances] = useState([])
  const [searchedAjusters,setSerachAdjusters] = useState([])
  const [searchedSupervisors,setSerachSupervisors] = useState([])
  const [searchedLienAdjusters,setSerachLienAdjusters] = useState([])
  const [searchedLienHolders,setSerachLienHolders] = useState([])
  const[showDeleteModal,setShowDeleteModal] = useState(false)

  const [statesAbrs, setStatesAbrs] = useState([]); //state abrs
  const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const accessToken = getToken();
  const [insuranceTab,setInsuraceTab] = useState(activeTab);
  const handleTabChange = (tab) => setInsuraceTab(tab);
  const tabsData =[
    {   
      id: "company", 
      label: "Company", 
      onClick: () => handleTabChange("company"),
      className: insuranceTab === "company" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: insuranceTab === "company" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
        id: "adjuster", 
        label: "Adjuster", 
        onClick: () => handleTabChange("adjuster"),
        className: insuranceTab === "adjuster" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
        background: insuranceTab === "adjuster" ? "var(--primary) !important" : "var(--primary-70) !important",
        leftHand:true,
        activeColor: 'white',
    },
    {   
      id: "supervisor", 
      label: "Supervisor", 
      onClick: () => handleTabChange("supervisor"),
      className: insuranceTab === "supervisor" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: insuranceTab === "supervisor" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
      id: "claim", 
      label: "Claim", 
      onClick: () => handleTabChange("claim"),
      className: insuranceTab === "claim" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: insuranceTab === "claim" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
      id: "lien_adjuster", 
      label: "Lien Adjuster", 
      onClick: () => handleTabChange("lien_adjuster"),
      className: insuranceTab === "lien_adjuster" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: insuranceTab === "lien_adjuster" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
    {   
      id: "lien", 
      label: "Lien", 
      onClick: () => handleTabChange("lien"),
      className: insuranceTab === "lien" ? "active tab-trapezium-cycles-corners" : "tab-trapezium-cycles-corners",
      background: insuranceTab === "lien" ? "var(--primary) !important" : "var(--primary-70) !important",
      leftHand:true,
      activeColor: 'white',
    },
  ]
  const fetchSatesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/states/` , {
        headers: {
          Authorization: accessToken,
        },
      });
      if (response.status === 200) {
        setStatesAbrs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchSatesData();
  },[])

  let search_input = '';

  //   Extracting the client_id and case_id from URL which is expected to /some/client_id/case_id
  const regex = /\d+/g;
  const {pathname} = useLocation();
  // Use match method to find all numbers
  const numbers = pathname.match(regex);
  // Convert the array of string numbers to an array of integers
    const URLParams = numbers.map(Number);


  const formatNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };
  

  useEffect(()=>{

    // Setting the Company Fields
  setValue("company_name",insurance?.company_contact?.name || '' )
  setValue("company_address1",insurance?.company_contact?.address1 || '' )
  setValue("company_address2",insurance?.company_contact?.address2 || '' )
  setValue("company_city",insurance?.company_contact?.city || '' )
  setValue("company_fax",insurance?.company_contact?.fax && formatNumber(insurance?.company_contact?.fax) || '' )
  setValue("company_phone",insurance?.company_contact?.phone_number && formatNumber(insurance?.company_contact?.phone_number) || '' )
  setValue("company_zip",insurance?.company_contact?.zip || '' )
  setValue("company_state",insurance?.company_contact?.state || '' )
  setValue("company_email",insurance?.company_contact?.email || '' )
  setValue("insurance_website",insurance?.company_contact?.website || '' )
  setValue("company_extension_field",insurance?.company_contact?.phone_ext || '' )
  //  setValue("insurance_type_id",insurance?.insurance_type?.id || '' )


  //  Setting the Adjuster Fields
  setValue("adjuster_address1",insurance?.adjuster?.address1 || '' )
  setValue("adjuster_address2",insurance?.adjuster?.address2 || '' )
  setValue("adjuster_city",insurance?.adjuster?.city || '' )
  setValue("adjuster_email",insurance?.adjuster?.email || '' )
  setValue("adjuster_fax",insurance?.adjuster?.fax && formatNumber(insurance?.adjuster?.fax) || '' )
  setValue("adjuster_first_name",insurance?.adjuster?.first_name || '' )
  setValue("adjuster_last_name",insurance?.adjuster?.last_name || '' )
  setValue("adjuster_phone",insurance?.adjuster?.phone_number && formatNumber(insurance?.adjuster?.phone_number) || '' )
  setValue("adjuster_state",insurance?.adjuster?.state || '' )
  setValue("adjuster_zip",insurance?.adjuster?.zip || '' )
  setValue("adjuster_extension_field",insurance?.adjuster?.phone_ext || '' )


  // Setting the Supervisor Fields
  setValue("supervisor_address1",insurance?.supervisor?.address1 || '' )
  setValue("supervisor_address2",insurance?.supervisor?.address2 || '' )
  setValue("supervisor_city",insurance?.supervisor?.city || '' )
  setValue("supervisor_email",insurance?.supervisor?.email || '' )
  setValue("supervisor_fax",insurance?.supervisor?.fax && formatNumber(insurance?.supervisor?.fax) || '' )
  setValue("supervisor_first_name",insurance?.supervisor?.first_name || '' )
  setValue("supervisor_last_name",insurance?.supervisor?.last_name || '' )
  setValue("supervisor_phone",insurance?.supervisor?.phone_number && formatNumber(insurance?.supervisor?.phone_number) || '' )
  setValue("supervisor_state",insurance?.supervisor?.state || '' )
  setValue("supervisor_zip",insurance?.supervisor?.zip || '' )
  setValue("supervisor_extension_field",insurance?.supervisor?.phone_ext || '' )

  // Setting the claim fields
  setValue("claim_number",insurance?.claim_number || '')
  if(insurance?.Dateconfirmedactive !=null)
    {

      setValue("confirmed_date", formatDateForModalFields(insurance?.Dateconfirmedactive) )
    }else{
      setValue("confirmed_date", '' )
    }
  // setValue("insurance_website")
  setValue("liability_limit",insurance?.liabilityLimit || '')
  setValue("policy_number",insurance?.policy_number || '')
  setValue("insurance_type_id",insurance?.insurance_type?.id || '')
  setValue("liability_limit_all",insurance?.liabilityLimitAll || '')


  setValue("lien_holder_address1",insurance?.lien_adjuster?.address1 && insurance?.lien_adjuster?.address2 ? insurance?.lien_adjuster?.address1 : insurance?.lein_holder?.address1 || '' )
  setValue("lien_holder_address2",insurance?.lien_adjuster?.address1 && insurance?.lien_adjuster?.address2 ? insurance?.lien_adjuster?.address2 : insurance?.lein_holder?.address2 || '' )
  setValue("lien_holder_city",insurance?.lein_holder?.city || '' )
  setValue("lien_holder_email",insurance?.lein_holder?.email || '' )
  setValue("lien_holder_fax",insurance?.lein_holder?.fax && formatNumber(insurance?.lein_holder?.fax) || '' )
  setValue("lien_holder_name",insurance?.lein_holder?.name || '' )
  setValue("lien_holder_phone",insurance?.lein_holder?.phone_number && formatNumber(insurance?.lein_holder?.phone_number) || '' )
  setValue("lien_holder_state",insurance?.lein_holder?.state || '' )
  setValue("lien_holder_zip",insurance?.lein_holder?.zip || '' )
  setValue("lien_holder_extension_field",insurance?.lein_holder?.phone_ext || '' )


  setValue("lien_adjuster_address1",insurance?.lien_adjuster?.address1 || '' )
  setValue("lien_adjuster_address2",insurance?.lien_adjuster?.address2 || '' )
  setValue("lien_adjuster_city",insurance?.lien_adjuster?.city || '' )
  setValue("lien_adjuster_email",insurance?.lien_adjuster?.email || '' )
  setValue("lien_adjuster_fax",insurance?.lien_adjuster?.fax && formatNumber(insurance?.lien_adjuster?.fax) || '' )
  setValue("lien_adjuster_first_name",insurance?.lien_adjuster?.first_name || '' )
  setValue("lien_adjuster_last_name",insurance?.lien_adjuster?.last_name || '' )
  setValue("lien_adjuster_phone",insurance?.lien_adjuster?.phone_number && formatNumber(insurance?.lien_adjuster?.phone_number) || '' )
  setValue("lien_adjuster_state",insurance?.lien_adjuster?.state || '' )
  setValue("lien_adjuster_zip",insurance?.lien_adjuster?.zip || '' )
  setValue("lien_adjuster_extension_field",insurance?.lien_adjuster?.phone_ext || '' )
  },[])  


  function handleChange(event,inputType) {
      let formattedValue = formatNumber(event.target.value);
      setValue(`${inputType}`, formattedValue);
  }


  const onSubmit = async(data) => {
    // Handle form submission, send data to the backend
    console.log(data);
      if (data.confirmed_date != '')
        {
          data.confirmed_date = formatDateForSubmission(data.confirmed_date);
        }else{
          data.confirmed_date = null
        }
      
    await dispatch(editInsurance({...data,client_id:URLParams[0],case_id:URLParams[1],insurance_id:insurance.id}))
      
    handleInsuranceCreation()
    handleClose()

    
  };



  // Search functionlity for searching the Insurance company, adjuster,supervisor 
  const fetchData = async (search,type) => {
    let response=''
    try {
      if(type == "company" )
        {
          response = await axios.get(`${origin}/api/insurances/search/`);
        }else if (type == "adjuster" )
        {
          response = await axios.get(`${origin}/api/general/search_filter_adjuster_directoires/`);
        }else if (type=="supervisor"){
          response = await axios.get(`${origin}/api/general/search_filter_adjuster_directoires/`);
        }
        else if (type=="lien_adjuster"){
          response = await axios.get(`${origin}/api/general/search_filter_lien_adjuster_directoires/`);
        }
        else if (type=="lien"){
          response = await axios.get(`${origin}/api/general/search_filter_lien_company_directoires/`);
        }
        const searchedData = response.data.data.filter(insurance => {
          const searchLower = search.trim().toLowerCase();
          const match =
            (insurance?.adjuster_firstname || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.adjuster_lastname || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.company_name || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.address1 || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.address2 || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.city || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.state || '').toLowerCase().startsWith(searchLower) ||
            (insurance?.zip || '').toLowerCase().startsWith(searchLower);
          return match;
        });
      if (type == "company")
        {
          setSerachInsurances(searchedData);
          setSerachAdjusters([])
          setSerachSupervisors([])
          setSerachLienAdjusters([])
          setSerachLienHolders([])
        }

      if (type == "adjuster")
        {
          setSerachAdjusters(searchedData)
          setSerachInsurances([])
          setSerachSupervisors([])
          setSerachLienAdjusters([])
          setSerachLienHolders([])
        }  

      if(type == "supervisor")
        {
          setSerachSupervisors(searchedData)
          setSerachInsurances([])
          setSerachAdjusters([])
          setSerachLienAdjusters([])
          setSerachLienHolders([])
        }  
        if(type == "lien_adjuster")
          {
            setSerachLienAdjusters(searchedData)
            setSerachSupervisors([])
            setSerachInsurances([])
            setSerachAdjusters([])
            setSerachLienHolders([])
          }  
        if(type == "lien")
          {
            setSerachLienHolders(searchedData)
            setSerachSupervisors([])
            setSerachInsurances([])
            setSerachAdjusters([])
            setSerachLienAdjusters([])

          }  
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // setDataLoading(false);
    }
  };


  // Handler for Searching Insurances
  const handleSearchInsurances =  (event,type)=>{
    // console.log("yes clicked")
    search_input = event.target.value
    if (search_input.length >= 2)
    {
        fetchData(search_input,type)
    }else{
      setSerachInsurances([])
      setSerachAdjusters([])
      setSerachSupervisors([])
      setSerachLienAdjusters([])
      setSerachLienHolders([])
    }
  }

  // Populate the fields of Company tab
  const handleSelectedInsuranceTabs = (id)=>{
    console.log(insuranceTab)
    if(insuranceTab == "company")
      {
        let selectedInsurance = searchedInsurances.filter(insurance=> insurance.id == id)
        selectedInsurance = {...selectedInsurance[0]}
        setValue('company_address1',selectedInsurance.address1)
        setValue('company_address2',selectedInsurance.address2)
        setValue('company_city',selectedInsurance.city)
        setValue('company_phone',formatNumber(selectedInsurance.phone))
        setValue('company_state',selectedInsurance.state)
        setValue('company_fax',formatNumber(selectedInsurance.fax))
        setValue('company_zip',selectedInsurance.zip)
        setValue('insurance_type_id',selectedInsurance.insurance_type)
        setValue('company_email',selectedInsurance.email)
        setValue('company_name',selectedInsurance.company_name)
        setValue("company_extension_field",selectedInsurance?.extension || '' )
        
      }

      if (insuranceTab =="adjuster")
        {
          let selectedAdjuster = searchedAjusters.filter(adjuster=> adjuster.id == id)
          selectedAdjuster = {...selectedAdjuster[0]}
          setValue('adjuster_first_name',selectedAdjuster.adjuster_firstname)
          setValue('adjuster_last_name',selectedAdjuster.adjuster_lastname)
          setValue('adjuster_address1',selectedAdjuster.address1)
          setValue('adjuster_address2',selectedAdjuster.address2)
          setValue('adjuster_city',selectedAdjuster.city)
          setValue('adjuster_state',selectedAdjuster.state)
          setValue('adjuster_phone',formatNumber(selectedAdjuster.phone))
          setValue('adjuster_zip',selectedAdjuster.zip)
          setValue('adjuster_fax',formatNumber(selectedAdjuster.fax))
          setValue('adjuster_extension_field',selectedAdjuster.extension)
          setValue('adjuster_email',selectedAdjuster.email)
          
        }

      if(insuranceTab == "supervisor")
        {
          let selectedSupervisor = searchedSupervisors.filter(supervisor=> supervisor.id == id)
          selectedSupervisor = {...selectedSupervisor[0]}
          setValue('supervisor_first_name',selectedSupervisor.adjuster_firstname)
          setValue('supervisor_last_name',selectedSupervisor.adjuster_lastname)
          setValue('supervisor_address1',selectedSupervisor.address1)
          setValue('supervisor_address2',selectedSupervisor.address2)
          setValue('supervisor_city',selectedSupervisor.city)
          setValue('supervisor_state',selectedSupervisor.state)
          setValue('supervisor_zip',selectedSupervisor.zip)
          setValue('supervisor_phone',formatNumber(selectedSupervisor.phone))
          setValue('supervisor_fax',formatNumber(selectedSupervisor.fax))
          setValue('supervisor_extension_field',selectedSupervisor.extension)
          setValue('supervisor_email',selectedSupervisor.email)
        }
      if(insuranceTab == "lien")
        {
          let selectedLienAdjuster = searchedLienHolders.filter(lein_holder=> lein_holder.id == id)
          selectedLienAdjuster = {...selectedLienAdjuster[0]}
          setValue("lien_holder_address1",selectedLienAdjuster.address1 || '' )
          setValue("lien_holder_address2",selectedLienAdjuster.address2 || '' )
          setValue("lien_holder_city",selectedLienAdjuster.city || '' )
          setValue("lien_holder_email",selectedLienAdjuster.email || '' )
          setValue("lien_holder_fax",selectedLienAdjuster.fax && formatNumber(selectedLienAdjuster.fax) || '' )
          setValue("lien_holder_name",selectedLienAdjuster.name || '' )
          setValue("lien_holder_phone",selectedLienAdjuster.phone_number && formatNumber(selectedLienAdjuster.phone_number) || '' )
          setValue("lien_holder_state",selectedLienAdjuster.state || '' )
          setValue("lien_holder_zip",selectedLienAdjuster.zip || '' )
          setValue("lien_holder_extension_field",selectedLienAdjuster.phone_ext || '' )
        }
      if(insuranceTab == "lien_adjuster")
        {

          let selectedLienAdjuster = searchedLienAdjusters.filter(lien_adjuster => lien_adjuster.id == id)
          selectedLienAdjuster = {...selectedLienAdjuster[0]}
          setValue("lien_adjuster_address1",selectedLienAdjuster.address1 || '' )
          setValue("lien_adjuster_address2",selectedLienAdjuster.address2 || '' )
          setValue("lien_adjuster_city",selectedLienAdjuster.city || '' )
          setValue("lien_adjuster_email",selectedLienAdjuster.email || '' )
          setValue("lien_adjuster_fax",selectedLienAdjuster.fax && formatNumber(selectedLienAdjuster.fax) || '' )
          setValue("lien_adjuster_first_name",selectedLienAdjuster.first_name || '' )
          setValue("lien_adjuster_last_name",selectedLienAdjuster.last_name || '' )
          setValue("lien_adjuster_phone",selectedLienAdjuster.phone_number && formatNumber(selectedLienAdjuster.phone_number) || '' )
          setValue("lien_adjuster_state",selectedLienAdjuster.state || '' )
          setValue("lien_adjuster_zip",selectedLienAdjuster.zip || '' )
          setValue("lien_adjuster_extension_field",selectedLienAdjuster.phone_ext || '' )
        }
      setSerachAdjusters([])
      setSerachInsurances([])
      setSerachSupervisors([])
      setSerachLienAdjusters([])
      setSerachLienHolders([])
      
  }

  const handleBlur = ()=>{
    // setSerachInsurances([])
  }

  const [stateShow, setStateShow] = useState(false);
  const handleStateShow = () => setStateShow(!stateShow);

  const SelectedCompanyState = watch("company_state");
  const [companyState, setCompanyState] = useState(insurance?.company_contact?.state);
  const SelectedAdjusterState = watch("adjuster_state");
  const [adjusterState, setAdjusterState] = useState(insurance?.adjuster?.state);
  const SelectedSupervisorState = watch("supervisor_state");
  const [supervisorState, setSupervisorState] = useState(insurance?.supervisor?.state);
  const SelectedLienHolderState = watch("lien_holder_state");
  const [lienState, setLienState] = useState(insurance?.lein_holder?.state);
  const SelectedLienAdjusterState = watch("lien_adjuster_state");
  const [lienAdjusterState, setLienAdjusterState] = useState(insurance?.lien_adjuster?.state);

  const handleStateChange = (state) => {
    if(insuranceTab ==="company"){
      setValue("company_state",state.StateAbr);
      setCompanyState(state.StateAbr);
    }
    else if(insuranceTab === "adjuster"){
      setValue("adjuster_state",state.StateAbr);
      setAdjusterState(state.StateAbr);
    }
    else if(insuranceTab === "supervisor"){
      setValue("supervisor_state",state.StateAbr);
      setSupervisorState(state.StateAbr);
    }
    else if(insuranceTab === "lien_adjuster"){
      setValue("lien_adjuster_state",state.StateAbr);
      setLienAdjusterState(state.StateAbr);
    }
    else if(insuranceTab === "lien"){
      setValue("lien_holder_state",state.StateAbr);
      setLienState(state.StateAbr);
    }
  };

  return (
    <>
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="insurance-modal-dialog modal-dialog-centered modal-800p"
      centered
    >
      <div class="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center modal-header"><div class="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center modal-title h4" id="modal_title" style={{fontSize:"14px",fontWeight:"600"}}>Edit Insurance</div></div>
      <Modal.Body className='p-0' style={{height:"276px"}}>
        <div className="custom-tab m-t-5 insurance-modal-content">
            <GenericTabs tabsData={tabsData} height={25} currentTab={insuranceTab} />
          <Form id="insurance_contacts_form" onSubmit={handleSubmit(onSubmit)} >
            <input type="hidden" name="csrfmiddlewaretoken" value="O2Ft8rMsd5q4FU1rvKFz2PGxAwffHBfGDcOH0reVbGCMGC8pPPACv1qfqaC3huT1" />
            <input type="text" name="block_name" hidden value="" />
            <input type="text" name="insurance_id" hidden value="" />
            <div >
              <div className=''>
                {insuranceTab ==="company" &&
                <>
                  <Row className="mx-0">
                    <Col md={12} className='p-l-5 p-r-5'>
                      <Form.Control
                        type="text"
                        
                        name="search_filter_insurance_input"
                        placeholder="Type insurance company name to search directory then click an entry"
                        className="custom-margin-top custom-margin-bottom height-25 p-0 p-l-5 rounded-0"
                        onKeyUp={()=> handleSearchInsurances(event,"company")}
                      />
                      { searchedInsurances.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedInsurances} selectedInsurance={handleSelectedInsuranceTabs} isCompany={true}/>}
                    </Col>
                  </Row>
                  <Row className="mx-0 p-l-5">
                    <div>
                      <ContactPanel
                        panel_name={"Insurance Company"}
                        className="m-b-5"
                        dynamic_label={"Company Name"}
                        name={watch("company_name")}
                        address1={watch("company_address1")}
                        address2={watch("company_address2")}
                        email={watch("company_email")}
                        phone_number={watch("company_phone")}
                        city={watch("company_city")}
                        state={watch("company_state")}
                        zip_code={watch("company_zip")}
                        fax_number={watch("company_fax")}
                        ext={watch("company_extension_field")}
                        buttonData={InsuranceButtons}
                        pageName="Defendants"
                      />
                    </div>

                    <Col md={"auto"} className="p-0 d-flex-1">
                      <Row className="align-items-center custom-margin-bottom mx-0">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Name:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Enter Company Name"
                            {...register("company_name")} />
                          </Col>
                          {/* <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey Text-w-NW-INS">Coverage Type</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control as="select"   {...register("insurance_type_id")}>
                            {insuranceTypes && insuranceTypes?.map(insuranceType => {
                                    if (!insuranceType.state || (insuranceType.state && insuranceType.state.id === litigation?.state.id)) {
                                      return (
                                        <option key={insuranceType.id} value={insuranceType.id}>
                                          {insuranceType.name}
                                        </option>
                                      );
                                    }
                                    return null;
                                  })}
                            </Form.Control>
                              </Col>
                            */}
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Address 1, 2:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 1"
                            {...register("company_address1")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 2"
                            {...register("company_address2")}  />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          City, State, Zip:
                        </span>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                          type="text"
                          placeholder="City"
                          className='form-control height-25 p-0 p-l-5 rounded-0'
                          {...register("company_city")} />
                        </Col>
                        {/* <Col className="d-flex-1 p-l-0 p-r-0 custom-select-state-entity">
                          <Form.Control as="select"  className="form-control City-Width-OP height-25 p-0 p-l-5 rounded-0" {...register("company_state")}
                            value={SelectedCompanyState || ""}
                            onChange={(e) => setValue("company_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                      
                          </Form.Control>
                        </Col> */}
                        <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                            <div
                              className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                              onClick={handleStateShow}>
                              <span id="selectedOption">
                                {companyState ? (
                                  <div className="d-flex align-items-center">
                                    <svg
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                        fill: "var(--primary-80)",
                                        color: "var(--primary-80)",
                                        stroke: "var(--primary-80)",
                                      }}
                                      className={`icon icon-state-${companyState}`}
                                    >
                                      <use xlinkHref={`#icon-state-${companyState}`}></use>
                                    </svg>
                                    {companyState}
                                  </div>
                                ) : (
                                  "Select State"
                                )}
                              </span>
                            </div>
                        </div>
                        <Col className="d-flex-1 p-r-5">
                          <Form.Control
                            type="text"
                            placeholder="Zip"
                            className='height-25 p-0 p-l-5 rounded-0'
                            {...register("company_zip")} />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Phone, Ext:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"company_phone")}
                            {...register("company_phone")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                        <Form.Control
                            type="text"
                            placeholder="Extension"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("company_extension_field")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Fax:
                        </span>
                        <Col className='d-flex-1 p-l-0 p-r-5'>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"company_fax")}
                            {...register("company_fax")}/>
                        </Col>

                        {/* <Col md={2} className="text-left">
                          <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                        </Col>
                        <Col md={4}>
                          <Form.Control type="text" placeholder="www.insurancecompany.com" {...register("insurance_website")} />
                        </Col> */}
                      </Row>
                        <Row className='align-items-center custom-margin-bottom m-0'>
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Email:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Enter Email"
                              {...register("company_email")} />
                          </Col>
                        </Row>
                    </Col>
                  </Row>
                </> 
                }
                {insuranceTab ==="adjuster" && 
                <>
                  <Row className="mx-0">
                    <Col md={12} className='p-l-5 p-r-5'>
                      <Form.Control
                        type="text"
                        name="search_filter_insurance_input"
                        placeholder="Type insurance company name or Adjuster name to search directory then click an entry"
                        className="custom-margin-top custom-margin-bottom height-25 p-0 p-l-5 rounded-0"
                        onKeyUp={()=> handleSearchInsurances(event,"adjuster")}
                        onBlur={handleBlur}
                      
                      />
                      { searchedAjusters.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedAjusters} selectedInsurance={handleSelectedInsuranceTabs} isAdjuster={true}/>}
                    </Col>
                  </Row>
                  {/* <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey Text-w-NW-INS">First Name :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Enter First Name"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_first_name")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-r-0 p-l-0">
                      <span className="d-inline-block text-grey Text-w-NW-INS">Last Name :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Last Name"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_last_name")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Address 1 :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Address 1"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_address1")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0" >
                      <span className="d-inline-block text-grey">Address 2 :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Address 2"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_address2")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="d-flex p-l-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                      </Col>  
                      <Col md={2} className='p-l-0'>
                        <Form.Control 
                          type="text" 
                          placeholder="City" 
                          className="form-control height-25 p-0 p-l-5 rounded-0" 
                          {...register("adjuster_city")} />
                      </Col>
                      <Col md={4} className="d-flex p-l-0 p-r-0 custom-select-state-entity">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">State :</span>
                        <Form.Control 
                          as="select"
                          className="form-control height-25 p-0 p-l-5 rounded-0 City-Width-OP" 
                          {...register("adjuster_state")}
                          value={SelectedAdjusterState || ""}
                          onChange={(e) => setValue("adjuster_state", e.target.value)}
                          >
                          <option  value="">
                                    Select state
                                  </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                        ))}
                          
                        </Form.Control>
                      </Col>
                      <Col md={4} className="d-flex p-r-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-15">Zip :</span>
                        <Form.Control 
                          type="text"  
                          placeholder="Zip" 
                          className='height-25 p-0 p-l-5 rounded-0'
                          {...register("adjuster_zip")} />
                    </Col>
                    
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Phone :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"adjuster_phone")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_phone")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey">Extension :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Extension"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_extension_field")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom m-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Fax :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"adjuster_fax")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_fax")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0">
                      <span className="d-inline-block text-grey">Email :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Email"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("adjuster_email")}
                      />
                    </Col>
                  </Row> */}

                  <Row className="mx-0 p-l-5">
                    <div style={{width:"260px"}}>
                      <ContactPanel
                        panel_name={"Adjuster"}
                        className="m-b-5"
                        name={`${watch("adjuster_first_name") || ""} ${watch("adjuster_last_name") || ""}`}
                        address1={watch("adjuster_address1")}
                        address2={watch("adjuster_address2")}
                        email={watch("adjuster_email")}
                        phone_number={watch("adjuster_phone")}
                        city={watch("adjuster_city")}
                        state={watch("adjuster_state")}
                        zip_code={watch("adjuster_zip")}
                        fax_number={watch("adjuster_fax")}
                        ext={watch("adjuster_extension_field")}
                        buttonData={InsuranceButtons}
                        pageName="Defendants"
                      />
                    </div>

                    <Col md={"auto"} className="p-0 d-flex-1">
                      <div className="row mx-0 align-items-center custom-margin-bottom">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            First, Last Name:
                          </span>
                        <div className="d-flex-1 p-r-5">
                          <input
                            type="text"
                            placeholder="Enter First Name"
                            className="form-control rounded-0 height-25"
                            {...register("adjuster_first_name")}
                          />
                        </div>
                        <div className="d-flex-1">
                          <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="form-control rounded-0 height-25"
                            {...register("adjuster_last_name")}
                          />
                        </div>
                      </div>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Address 1, 2:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 1"
                            {...register("adjuster_address1")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 2"
                            {...register("adjuster_address2")}  />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          City, State, Zip:
                        </span>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                          type="text"
                          placeholder="City"
                          className='form-control height-25 p-0 p-l-5 rounded-0'
                          {...register("adjuster_city")} />
                        </Col>
                        {/* <Col className="d-flex-1 p-l-0 p-r-0 custom-select-state-entity">
                          <Form.Control as="select"  className="form-control City-Width-OP height-25 p-0 p-l-5 rounded-0" {...register("adjuster_state")}
                            value={SelectedCompanyState || ""}
                            onChange={(e) => setValue("adjuster_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                      
                          </Form.Control>
                        </Col> */}
                        <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                            <div
                              className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                              onClick={handleStateShow}>
                              <span id="selectedOption">
                                {adjusterState ? (
                                  <div className="d-flex align-items-center">
                                    <svg
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                        fill: "var(--primary-80)",
                                        color: "var(--primary-80)",
                                        stroke: "var(--primary-80)",
                                      }}
                                      className={`icon icon-state-${adjusterState}`}
                                    >
                                      <use xlinkHref={`#icon-state-${adjusterState}`}></use>
                                    </svg>
                                    {adjusterState}
                                  </div>
                                ) : (
                                  "Select State"
                                )}
                              </span>
                            </div>
                        </div>
                        <Col className="d-flex-1 p-r-5">
                          <Form.Control
                            type="text"
                            placeholder="Zip"
                            className='height-25 p-0 p-l-5 rounded-0'
                            {...register("adjuster_zip")} />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Phone, Ext:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"adjuster_phone")}
                            {...register("adjuster_phone")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                        <Form.Control
                            type="text"
                            placeholder="Extension"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("adjuster_extension_field")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Fax:
                        </span>
                        <Col className='d-flex-1 p-l-0 p-r-5'>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"adjuster_fax")}
                            {...register("adjuster_fax")}/>
                        </Col>

                        {/* <Col md={2} className="text-left">
                          <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                        </Col>
                        <Col md={4}>
                          <Form.Control type="text" placeholder="www.insurancecompany.com" {...register("insurance_website")} />
                        </Col> */}
                      </Row>
                        <Row className='align-items-center custom-margin-bottom m-0'>
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Email:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Enter Email"
                              {...register("adjuster_email")} />
                          </Col>
                        </Row>
                    </Col>
                  </Row>

                </>
                }

                {insuranceTab ==="supervisor" && 
                <>
                  <Row className="mx-0">
                  <Col md={12} className='p-l-5 p-r-5'>
                    <Form.Control
                      type="text"
                      placeholder="Type insurance company name to search directory then click an entry"
                      className="custom-margin-top custom-margin-bottom height-25 p-0 p-l-5 rounded-0"
                      onKeyUp={()=> handleSearchInsurances(event,"supervisor")}
                      onBlur={handleBlur}
                    
                    />
                    { searchedSupervisors.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedSupervisors} selectedInsurance={handleSelectedInsuranceTabs}/>}
                  </Col>
                  </Row>

                  <Row className="mx-0 p-l-5">
                    <div style={{width:"260px"}}>
                      <ContactPanel
                        panel_name={"Supervisor"}
                        className="m-b-5"
                        name={`${watch("supervisor_first_name" || "")} ${watch("supervisor_last_name" || "")}`}
                        address1={watch("supervisor_address1")}
                        address2={watch("supervisor_address2")}
                        email={watch("supervisor_email")}
                        phone_number={watch("supervisor_phone")}
                        city={watch("supervisor_city")}
                        state={watch("supervisor_state")}
                        zip_code={watch("supervisor_zip")}
                        fax_number={watch("supervisor_fax")}
                        ext={watch("supervisor_extension_field")}
                        buttonData={InsuranceButtons}
                        pageName="Defendants"
                      />
                    </div>

                    <Col md={"auto"} className="p-0 d-flex-1">
                      <div className="row mx-0 align-items-center custom-margin-bottom">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            First, Last Name:
                          </span>
                        <div className="d-flex-1 p-r-5">
                          <input
                            type="text"
                            placeholder="Enter First Name"
                            className="form-control rounded-0 height-25"
                            {...register("supervisor_first_name")}
                          />
                        </div>
                        <div className="d-flex-1">
                          <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="form-control rounded-0 height-25"
                            {...register("supervisor_last_name")}
                          />
                        </div>
                      </div>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Address 1, 2:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 1"
                            {...register("supervisor_address1")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 2"
                            {...register("supervisor_address2")}  />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          City, State, Zip:
                        </span>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                          type="text"
                          placeholder="City"
                          className='form-control height-25 p-0 p-l-5 rounded-0'
                          {...register("supervisor_city")} />
                        </Col>
                        {/* <Col className="d-flex-1 p-l-0 p-r-0 custom-select-state-entity">
                          <Form.Control as="select"  className="form-control City-Width-OP height-25 p-0 p-l-5 rounded-0" {...register("supervisor_state")}
                            value={SelectedCompanyState || ""}
                            onChange={(e) => setValue("supervisor_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                      
                          </Form.Control>
                        </Col> */}
                        <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                            <div
                              className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                              onClick={handleStateShow}>
                              <span id="selectedOption">
                                {supervisorState ? (
                                  <div className="d-flex align-items-center">
                                    <svg
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                        fill: "var(--primary-80)",
                                        color: "var(--primary-80)",
                                        stroke: "var(--primary-80)",
                                      }}
                                      className={`icon icon-state-${supervisorState}`}
                                    >
                                      <use xlinkHref={`#icon-state-${supervisorState}`}></use>
                                    </svg>
                                    {supervisorState}
                                  </div>
                                ) : (
                                  "Select State"
                                )}
                              </span>
                            </div>
                        </div>
                        <Col className="d-flex-1 p-r-5">
                          <Form.Control
                            type="text"
                            placeholder="Zip"
                            className='height-25 p-0 p-l-5 rounded-0'
                            {...register("supervisor_zip")} />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Phone, Ext:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"supervisor_phone")}
                            {...register("supervisor_phone")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                        <Form.Control
                            type="text"
                            placeholder="Extension"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("supervisor_extension_field")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Fax:
                        </span>
                        <Col className='d-flex-1 p-l-0 p-r-5'>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"supervisor_fax")}
                            {...register("supervisor_fax")}/>
                        </Col>

                        {/* <Col md={2} className="text-left">
                          <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                        </Col>
                        <Col md={4}>
                          <Form.Control type="text" placeholder="www.insurancecompany.com" {...register("insurance_website")} />
                        </Col> */}
                      </Row>
                        <Row className='align-items-center custom-margin-bottom m-0'>
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Email:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Enter Email"
                              {...register("supervisor_email")} />
                          </Col>
                        </Row>
                    </Col>
                  </Row>

                  {/* <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey Text-w-NW-INS">First Name :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Enter First Name"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_first_name")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey Text-w-NW-INS">Last Name :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Last Name"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_last_name")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Address 1 :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Address 1"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_address1")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey">Address 2 :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Address 2"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_address2")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                  <Col md={2} className="d-flex p-l-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                      </Col>  
                      <Col md={2} className='p-l-0'>
                        <Form.Control 
                          type="text" 
                          placeholder="City" 
                          className="form-control height-25 p-0 p-l-5 rounded-0 " 
                          {...register("supervisor_city")} />
                      </Col>
                      <Col md={4} className="d-flex p-l-0 p-r-0 custom-select-state-entity">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">State :</span>
                        <Form.Control 
                          as="select"  
                          className="form-control height-25 p-0 p-l-5 rounded-0 City-Width-OP" 
                          {...register("supervisor_state")}
                          value={SelectedSupervisorState || ""}
                          onChange={(e) => setValue("supervisor_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={4} className="d-flex p-r-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-15">Zip :</span>
                        <Form.Control 
                          type="text"  
                          placeholder="Zip" 
                          className='height-25 p-0 p-l-5 rounded-0'
                          {...register("supervisor_zip")} />
                      </Col>

                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Phone :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"supervisor_phone")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_phone")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey">Extension :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Extension"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_extension_field")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom m-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Fax :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"supervisor_fax")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_fax")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey">Email :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Email"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("supervisor_email")}
                      />
                    </Col>
                  </Row> */}
                </>
                }
                {insuranceTab ==="claim" && 
                <>
                  <Row className="align-items-center custom-margin-bottom custom-margin-top mx-0">
                    <Col md={2} className="text-left p-l-5 white-space-nowrap">
                      <span className="d-inline-block text-grey">Coverage Type :</span>
                    </Col>
                    <Col md={10} className='p-l-0 p-r-5 custom-select-state-entity'>
                      <Form.Control 
                        as="select" 
                        id="insurance_type_id"  
                        className='height-25 p-0 p-l-5 rounded-0'
                        {...register("insurance_type_id")}>
                        {insuranceTypes && insuranceTypes?.map(insuranceType => {
                                if (!insuranceType.state || (insuranceType.state && insuranceType.state.id === litigation?.state?.id)) {
                                  return (
                                    <option key={insuranceType.id} value={insuranceType.id}>
                                      {insuranceType.name}
                                    </option>
                                  );
                                }
                                return null;
                              })}
                      </Form.Control>
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5 white-space-nowrap">
                      <span className="d-inline-block text-grey">Liability Limit :</span>
                    </Col>
                    <Col md={10} className='p-l-0 p-r-5'>
                      <Form.Control
                        type="number"
                        placeholder="Enter Liability Limit"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("liability_limit")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5 white-space-nowrap">
                      <span className="d-inline-block text-grey">Liability Limit All :</span>
                    </Col>
                    <Col md={10} className='p-l-0 p-r-5'>
                      <Form.Control
                        type="number"
                        placeholder="Enter Liability Limit All"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("liability_limit_all")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5 white-space-nowrap">
                      <span className="d-inline-block text-grey">Policy # :</span>
                    </Col>
                    <Col md={10} className='p-l-0 p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Policy Number"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("policy_number")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5 white-space-nowrap">
                      <span className="d-inline-block text-grey">Claim # :</span>
                    </Col>
                    <Col md={10} className='p-l-0 p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Claim Number"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        
                        {...register("claim_number")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom m-0">
                    <Col md={2} className="text-left p-l-5 white-space-nowrap">
                      <span className="d-inline-block text-grey">Confirmed Date :</span>
                    </Col>
                    <Col md={10} className='p-l-0 p-r-5'>
                      <Form.Control
                        type="date"
                        placeholder="Enter Confirmed Date"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        min="1000-01-01"
                        max="9999-12-31"
                        
                        {...register("confirmed_date")}
                      />
                    </Col>
                  </Row>
                </>
                }
                {insuranceTab ==="lien_adjuster" && 
                <>
                  <Row className="mx-0">
                    <Col md={12} className='p-l-5 p-r-5'>
                      <Form.Control
                        type="text"
                        name="search_filter_insurance_input"
                        placeholder="Type insurance company name to search directory then click an entry"
                        className="custom-margin-top custom-margin-bottom height-25 p-l-5 p-r-5 rounded-0"
                        onKeyUp={()=> handleSearchInsurances(event,"lien_adjuster")}
                        
                      
                      />
                      { searchedLienAdjusters.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedLienAdjusters} selectedInsurance={handleSelectedInsuranceTabs} isCompany={true}/>}
                    </Col>
                  </Row>

                  <Row className="mx-0 p-l-5">
                    <div style={{width:"260px"}}>
                      <ContactPanel
                        panel_name={"Lien Adjuster"}
                        className="m-b-5"
                        name={`${watch("lien_adjuster_first_name" || "")} ${watch("lien_adjuster_last_name" || "")}`}
                        address1={watch("lien_adjuster_address1")}
                        address2={watch("lien_adjuster_address2")}
                        email={watch("lien_adjuster_email")}
                        phone_number={watch("lien_adjuster_phone")}
                        city={watch("lien_adjuster_city")}
                        state={watch("lien_adjuster_state")}
                        zip_code={watch("lien_adjuster_zip")}
                        fax_number={watch("lien_adjuster_fax")}
                        ext={watch("lien_adjuster_extension_field")}
                        buttonData={InsuranceButtons}
                        pageName="Defendants"
                      />
                    </div>

                    <Col md={"auto"} className="p-0 d-flex-1">
                      <div className="row mx-0 align-items-center custom-margin-bottom">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            First, Last Name:
                          </span>
                        <div className="d-flex-1 p-r-5">
                          <input
                            type="text"
                            placeholder="Enter First Name"
                            className="form-control rounded-0 height-25"
                            {...register("lien_adjuster_first_name")}
                          />
                        </div>
                        <div className="d-flex-1">
                          <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="form-control rounded-0 height-25"
                            {...register("lien_adjuster_last_name")}
                          />
                        </div>
                      </div>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Address 1, 2:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 1"
                            {...register("lien_adjuster_address1")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                            type="text"
                            className='height-25 p-0 p-l-5 rounded-0'
                            placeholder="Address 2"
                            {...register("lien_adjuster_address2")}  />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          City, State, Zip:
                        </span>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                          type="text"
                          placeholder="City"
                          className='form-control height-25 p-0 p-l-5 rounded-0'
                          {...register("lien_adjuster_city")} />
                        </Col>
                        {/* <Col className="d-flex-1 p-l-0 p-r-0 custom-select-state-entity">
                          <Form.Control as="select"  className="form-control City-Width-OP height-25 p-0 p-l-5 rounded-0" {...register("lien_adjuster_state")}
                            value={SelectedCompanyState || ""}
                            onChange={(e) => setValue("lien_adjuster_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                      
                          </Form.Control>
                        </Col> */}
                        <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                            <div
                              className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                              onClick={handleStateShow}>
                              <span id="selectedOption">
                                {lienAdjusterState ? (
                                  <div className="d-flex align-items-center">
                                    <svg
                                      style={{
                                        width: "15px",
                                        height: "15px",
                                        fill: "var(--primary-80)",
                                        color: "var(--primary-80)",
                                        stroke: "var(--primary-80)",
                                      }}
                                      className={`icon icon-state-${lienAdjusterState}`}
                                    >
                                      <use xlinkHref={`#icon-state-${lienAdjusterState}`}></use>
                                    </svg>
                                    {lienAdjusterState}
                                  </div>
                                ) : (
                                  "Select State"
                                )}
                              </span>
                            </div>
                        </div>
                        <Col className="d-flex-1 p-r-5">
                          <Form.Control
                            type="text"
                            placeholder="Zip"
                            className='height-25 p-0 p-l-5 rounded-0'
                            {...register("lien_adjuster_zip")} />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Phone, Ext:
                        </span>
                        <Col className="d-flex-1 p-r-5 p-l-0">
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"lien_adjuster_phone")}
                            {...register("lien_adjuster_phone")} />
                        </Col>
                        <Col className="d-flex-1 p-l-0 p-r-5">
                        <Form.Control
                            type="text"
                            placeholder="Extension"
                            className="form-control height-25 p-0 p-l-5 rounded-0"
                            {...register("lien_adjuster_extension_field")}
                          />
                        </Col>
                      </Row>
                      <Row className="align-items-center custom-margin-bottom mx-0">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                          Fax:
                        </span>
                        <Col className='d-flex-1 p-l-0 p-r-5'>
                          <Form.Control
                            type="text"
                            placeholder="(###) ###-####"
                            className='height-25 p-0 p-l-5 rounded-0'
                            onKeyUp={(e)=> handleChange(e,"lien_adjuster_fax")}
                            {...register("lien_adjuster_fax")}/>
                        </Col>

                        {/* <Col md={2} className="text-left">
                          <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                        </Col>
                        <Col md={4}>
                          <Form.Control type="text" placeholder="www.insurancecompany.com" {...register("insurance_website")} />
                        </Col> */}
                      </Row>
                        <Row className='align-items-center custom-margin-bottom m-0'>
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Email:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Enter Email"
                              {...register("lien_adjuster_email")} />
                          </Col>
                        </Row>
                    </Col>
                  </Row>



                  {/* <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey Text-w-NW-INS">First Name :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Enter First Name"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_first_name")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey Text-w-NW-INS">Last Name :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Last Name"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_last_name")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Address 1 :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Address 1"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_address1")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-r-0 p-l-0">
                      <span className="d-inline-block text-grey">Address 2 :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Address 2"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_address2")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                  <Col md={2} className="d-flex p-l-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                      </Col>  
                      <Col md={2} className='p-l-0'>
                        <Form.Control 
                        type="text"  
                        placeholder="City" 
                        className="form-control height-25 p-0 p-l-5 rounded-0 " 
                        {...register("lien_adjuster_city")} 
                        />
                      </Col>
                      <Col md={4} className="d-flex p-l-0 p-r-0 custom-select-state-entity">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-15">State :</span>
                        <Form.Control 
                          as="select"  
                          className="form-control height-25 p-0 p-l-5 rounded-0 City-Width-OP" 
                          {...register("lien_adjuster_state")}
                          value={SelectedLienAdjusterState || ""}
                          onChange={(e) => setValue("lien_adjuster_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={4} className="d-flex p-r-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">Zip :</span>
                        <Form.Control 
                          type="text"  
                          placeholder="Zip" 
                          className='height-25 p-0 p-l-5 rounded-0'
                          {...register("lien_adjuster_zip")} 
                        />
                      </Col>

                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Phone :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"lien_adjuster_phone")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_phone")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey">Extension :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Extension"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_extension_field")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom m-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Fax :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"lien_adjuster_fax")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_fax")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-r-0 p-l-0">
                      <span className="d-inline-block text-grey">Email :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Email"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_adjuster_email")}
                      />
                    </Col>
                  </Row> */}
                </>
                }
                {insuranceTab ==="lien" && 
                <>
                  <Row className="mx-0">
                    <Col md={12} className='p-l-5 p-r-5'>
                      <Form.Control
                        type="text"
                        name="search_filter_insurance_input"
                        placeholder="Type insurance company name to search directory then click an entry"
                        className="custom-margin-top custom-margin-bottom height-25 p-l-5 p-r-5 rounded-0"
                        onKeyUp={()=> handleSearchInsurances(event,"lien")}
                      />
                      { searchedLienHolders.length > 0 &&  <AutoCompleteSearch searchedInsurances={searchedLienHolders} selectedInsurance={handleSelectedInsuranceTabs} isCompany={true}/>}
                  </Col>
                  </Row>
                  <Row className="mx-0 p-l-5">
                    <div style={{width:"260px"}}>
                      <ContactPanel
                        panel_name={"Lien Contact"}
                        className="m-b-5"
                        name={`${watch("lien_holder_first_name") || ""} ${watch("lien_holder_last_name") || ""}`}
                        address1={watch("lien_holder_address1")}
                        address2={watch("lien_holder_address2")}
                        email={watch("lien_holder_email")}
                        phone_number={watch("lien_holder_phone")}
                        city={watch("lien_holder_city")}
                        state={watch("lien_holder_state")}
                        zip_code={watch("lien_holder_zip")}
                        fax_number={watch("lien_holder_fax")}
                        ext={watch("lien_holder_extension_field")}
                        buttonData={InsuranceButtons}
                        pageName="Defendants"
                      />
                    </div>
                    <Col md={"auto"} className="p-0 d-flex-1">
                        <div className="row mx-0 align-items-center custom-margin-bottom">
                            <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                              First, Last Name:
                            </span>
                          <div className="d-flex-1 p-r-5">
                            <input
                              type="text"
                              placeholder="Enter First Name"
                              className="form-control rounded-0 height-25"
                              {...register("lien_holder_first_name")}
                            />
                          </div>
                          <div className="d-flex-1">
                            <input
                              type="text"
                              placeholder="Enter Last Name"
                              className="form-control rounded-0 height-25"
                              {...register("lien_holder_last_name")}
                            />
                          </div>
                        </div>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Address 1, 2:
                          </span>
                          <Col className="d-flex-1 p-r-5 p-l-0">
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Address 1"
                              {...register("lien_holder_address1")} />
                          </Col>
                          <Col className="d-flex-1 p-l-0 p-r-5">
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Address 2"
                              {...register("lien_holder_address2")}  />
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            City, State, Zip:
                          </span>
                          <Col className="d-flex-1 p-l-0 p-r-5">
                            <Form.Control
                            type="text"
                            placeholder="City"
                            className='form-control height-25 p-0 p-l-5 rounded-0'
                            {...register("lien_holder_city")} />
                          </Col>
                          {/* <Col className="d-flex-1 p-l-0 p-r-0 custom-select-state-entity">
                            <Form.Control as="select"  className="form-control City-Width-OP height-25 p-0 p-l-5 rounded-0" {...register("lien_holder_state")}
                              value={SelectedCompanyState || ""}
                              onChange={(e) => setValue("lien_holder_state", e.target.value)}
                            >
                            <option  value="">
                                  Select state
                                </option>
                            {statesAbrs?.map(state => (
                              <option key={state.StateAbr} value={state.StateAbr}>
                                {state.name}
                              </option>
                            ))}
                        
                            </Form.Control>
                          </Col> */}
                          <div className="d-flex-1 p-l-0 position-relative height-25 p-r-5 custom-select-new-provider">
                              <div
                                className="dropdown-button rounded-0 p-0 p-l-5 form-control height-25 d-flex align-items-center"
                                onClick={handleStateShow}>
                                <span id="selectedOption">
                                  {lienState ? (
                                    <div className="d-flex align-items-center">
                                      <svg
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                          fill: "var(--primary-80)",
                                          color: "var(--primary-80)",
                                          stroke: "var(--primary-80)",
                                        }}
                                        className={`icon icon-state-${lienState}`}
                                      >
                                        <use xlinkHref={`#icon-state-${lienState}`}></use>
                                      </svg>
                                      {lienState}
                                    </div>
                                  ) : (
                                    "Select State"
                                  )}
                                </span>
                              </div>
                          </div>
                          <Col className="d-flex-1 p-r-5">
                            <Form.Control
                              type="text"
                              placeholder="Zip"
                              className='height-25 p-0 p-l-5 rounded-0'
                              {...register("lien_holder_zip")} />
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Phone, Ext:
                          </span>
                          <Col className="d-flex-1 p-r-5 p-l-0">
                            <Form.Control
                              type="text"
                              placeholder="(###) ###-####"
                              className='height-25 p-0 p-l-5 rounded-0'
                              onKeyUp={(e)=> handleChange(e,"lien_holder_phone")}
                              {...register("lien_holder_phone")} />
                          </Col>
                          <Col className="d-flex-1 p-l-0 p-r-5">
                          <Form.Control
                              type="text"
                              placeholder="Extension"
                              className="form-control height-25 p-0 p-l-5 rounded-0"
                              {...register("lien_holder_extension_field")}
                            />
                          </Col>
                        </Row>
                        <Row className="align-items-center custom-margin-bottom mx-0">
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Fax:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control
                              type="text"
                              placeholder="(###) ###-####"
                              className='height-25 p-0 p-l-5 rounded-0'
                              onKeyUp={(e)=> handleChange(e,"lien_holder_fax")}
                              {...register("lien_holder_fax")}/>
                          </Col>

                          {/* <Col md={2} className="text-left">
                            <span className="d-inline-block text-grey Text-w-NW-INS">Website URL :</span>
                          </Col>
                          <Col md={4}>
                            <Form.Control type="text" placeholder="www.insurancecompany.com" {...register("insurance_website")} />
                          </Col> */}
                        </Row>
                        <Row className='align-items-center custom-margin-bottom m-0'>
                          <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">
                            Email:
                          </span>
                          <Col className='d-flex-1 p-l-0 p-r-5'>
                            <Form.Control
                              type="text"
                              className='height-25 p-0 p-l-5 rounded-0'
                              placeholder="Enter Email"
                              {...register("lien_holder_email")} />
                          </Col>
                        </Row>
                    </Col>
                  </Row>

                  {/* <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey contact_name_title">Name :</span>
                    </Col>
                    <Col md={10} className='p-r-5 p-l-0'>
                      <Form.Control type="text" 
                      className='height-25 p-0 p-l-5 rounded-0'
                      placeholder="Enter Company Name" 
                      required
                      {...register("lien_holder_name")} />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Address 1 :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="Address 1"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_holder_address1")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-l-0 p-r-0">
                      <span className="d-inline-block text-grey">Address 2 :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Address 2"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_holder_address2")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                  <Col md={2} className="d-flex p-l-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-70">City :</span>
                      </Col>  
                      <Col md={2} className='p-l-0'>
                        <Form.Control 
                        type="text"  
                        placeholder="City" 
                        className="form-control height-25 p-0 p-l-5 rounded-0 " 
                        {...register("lien_holder_city")} 
                        />
                      </Col>
                      <Col md={4} className="d-flex p-r-0 p-l-0 custom-select-state-entity">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-15">State :</span>
                        <Form.Control 
                          as="select"  
                          className="form-control height-25 p-0 p-l-5 rounded-0 City-Width-OP" 
                          {...register("lien_holder_state")}
                          value={SelectedLienHolderState || ""}
                          onChange={(e) => setValue("lien_holder_state", e.target.value)}
                          >
                          <option  value="">
                                Select state
                              </option>
                          {statesAbrs?.map(state => (
                            <option key={state.StateAbr} value={state.StateAbr}>
                              {state.name}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={4} className="d-flex p-r-5">
                        <span className="d-inline-block white-space-nowrapping text-grey align-self-center m-r-5 insurance-input-label">Zip :</span>
                        <Form.Control 
                          type="text"  
                          placeholder="Zip" 
                          className='height-25 p-0 p-l-5 rounded-0'
                          {...register("lien_holder_zip")} 
                        />
                      </Col>

                  </Row>
                  <Row className="align-items-center custom-margin-bottom mx-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Phone :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"lien_holder_phone")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_holder_phone")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-r-0 p-l-0">
                      <span className="d-inline-block text-grey">Extension :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Extension"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_holder_extension_field")}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center custom-margin-bottom m-0">
                    <Col md={2} className="text-left p-l-5">
                      <span className="d-inline-block text-grey">Fax :</span>
                    </Col>
                    <Col md={4} className='p-l-0'>
                      <Form.Control
                        type="text"
                        placeholder="(###) ###-####"
                        onKeyUp={(e) => handleChange(e,"lien_holder_fax")}
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_holder_fax")}
                      />
                    </Col>
                    <Col md={2} className="text-left p-r-0 p-l-0">
                      <span className="d-inline-block text-grey">Email :</span>
                    </Col>
                    <Col md={4} className='p-r-5'>
                      <Form.Control
                        type="text"
                        placeholder="Enter Email"
                        className="form-control height-25 p-0 p-l-5 rounded-0"
                        {...register("lien_holder_email")}
                      />
                    </Col>
                  </Row> */}
                </>
                }

              </div>
            </div>
          </Form>
        </div>

      </Modal.Body>
      <div className="d-flex justify-content-between align-items-center p-l-5 p-b-5 p-r-5">
            <Button variant="danger" className="height-25" style={{padding:"0px 12px"}}  onClick={() => {
                deleteInsuranceHandler(insurance.id);
                handleClose();
              }}>
              Delete
            </Button>
            <div>
              {/* <Button variant="secondary" className="height-25" style={{padding:"0px 12px"}} onClick={handleClose}>
                  Cancel
                </Button> */}
                <Button form="insurance_contacts_form" variant="success"  className="m-l-5 bg-success height-25" style={{padding:"0px 12px"}}>
                    Save and Close
                </Button>
            </div>
        </div>
      {/* <Modal.Footer className="border-0 justify-content-between pt-4">
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger"  onClick={() => {
          deleteInsuranceHandler(insurance.id);
          handleClose();
        }}>Delete</Button>
        <Button form="insurance_contacts_form" type='submit' className="btn popup-heading-color save-btn-popup">Save</Button>
      </Modal.Footer> */}

      
      
    </Modal>
    {stateShow && (
      <SelectStateModal
        show={stateShow}
        handleClose={handleStateShow}
        onChange={handleStateChange}
        statesData={statesAbrs}
      />
    )}
    </>
  );
}

export default InsuranceModal;
