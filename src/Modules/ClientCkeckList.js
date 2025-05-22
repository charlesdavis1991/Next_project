import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { useSelector } from "react-redux";
import TableLoader from "../Components/Loaders/tableLoader";
import NotesPanel from "../Components/NotesPanelSection/NotesPanel";
import CounselContactModal from "../Components/ClientDashboard/modals/CounselContactModal";
import PanelChecklist from "../Components/common/PanelChecklist";
import { ClientDataContext } from "../Components/ClientDashboard/shared/DataContext";
import CounselMain from "../Components/Witnesses/Counsel/CounselMain.js";
import { getClientId, getCaseId } from "../Utils/helper";
import axios from "axios";
// import ClientCheckListEditModal2 from './modals/ClientCheckListEditModal2';

const ClientCheckList = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [clientData, setClientData] = useState(null);
  const currentCase = getCaseId();
  const client = getClientId();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [showCounselModal, setshowCounselModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const ModalData = useSelector((state) => state.insurances.modalData);
  const { isClientDataUpdated, setIsClientDataUpdated } = useContext(ClientDataContext);
  const [counselTypes, setCounselTypes] = useState([])


  const fetchTabsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${origin}/api/client/opposingcounsel/`, {
        params: {
          for_case: currentCase ? currentCase : "",
          for_client: client ? client : "",
        },
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setClientData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounseTypesData = async () => {
    try {
      const response = await axios.get(`${origin}/api/defendants/counsel_types/`, {
        headers: {
          Authorization: token,
        }
      }

      );
      setCounselTypes(response.data);
    } catch (error) {
      console.log("Error : ", error)
    }
  };


  useEffect(() => {
    fetchTabsData();
    fetchCounseTypesData();
  }, [currentCase, client, isClientDataUpdated]);

  useEffect(() => {
    console.log("Selected checklist = ", selectedChecklist);
  }, [selectedChecklist]);

  // Helper functions
  const formatPhoneNumber = (number) => {
    if (!number) return "(###) ###-####";
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
  };

  const formatAddress = (address1, address2, city, state, zip) => {
    return [
      address1 || "Address",
      address2
    ]
      .filter(Boolean)
      .join(" ");
  };

  const handleCloseModal = () => {
    fetchTabsData();
    setshowCounselModal(!showCounselModal);
  };

  if (loading) {
    return <TableLoader />;
  }

  return (
    // OLD COUNSEL LAYOUT
    // <>
    //   <div className="border-box-wrap" style={{ width: "100%" }}>
    //     {clientData?.map((data, index) => (
    //       <div
    //         className="border-box has-checklist rounded-0 mr-15 m-t-5 m-t-15"
    //         key={index}
    //       >
    //         <div className="row no-gutters has-title-bg">
    //           <div className="checklist-section-wrapper position-absolute top-0 right-0 z-index-9">
    //             <PanelChecklist entity={"Clients"} entity_id={data?.id} />
    //           </div>
    //           <div className="col-auto p-0">
    //             <div className="top-header-wrap">
    //               {/* <div className="panel-icon">
    //                 <i className="ic ic-insurance ic-25"></i>
    //               </div> */}
    //               <div className="top-header height-25 d-flex panel-title">
    //                 <div className="top-head d-flex align-items-md-center">
    //                   <div className="d-inline-flex flex-wrap d-md-flex align-items-center">
    //                     <h2 className="d-flex align-items-center">
    //                       <small className="font-weight-bold custom-font-14px"> </small>
    //                       <span className="font-weight-normal ml-2 mr-2">
    //                         |
    //                       </span>
    //                     </h2>
    //                     <h2 className="d-flex align-items-center">
    //                       <small className=" custom-font-14px" style={{fontWeight:600}}>
    //                         {data?.opposingcounselcontact?.name}
    //                       </small>
    //                       <span className="font-weight-normal ml-2 mr-2">
    //                         |
    //                       </span>
    //                     </h2>
    //                     <p>{data?.opposingcounselcontact?.website}</p>
    //                     <span className="font-weight-normal ml-2 mr-2">|</span>
    //                     <p>{data?.opposingcounselcontact?.last_name}</p>
    //                     <span className="font-weight-normal ml-2 mr-2">|</span>
    //                     <p>{data?.opposingcounselcontact?.phone_ext}</p>
    //                     <span className="font-weight-normal ml-2 mr-2">|</span>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //             <div
    //               className="row no-gutters equal-column-wrapper position-relative insurance-cols client-counsel-cols"
    //               onClick={() => {
    //                 setshowCounselModal(true), setSelectedChecklist(data);
    //               }}
    //             >
    //               <div className="d-md-flex">
    //                 <div
    //                   className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-lg-250"
    //                   style={{ width: "250px" }}
    //                 >
    //                   <div className="information-wrapper">
    //                     <div
    //                       data-toggle="modal"
    //                       data-target="#editcounsel_contact_modal"
    //                       data-id="19"
    //                       data-block="firm_block"
    //                       data-name="Dev Firm"
    //                       data-add1="N Hwy"
    //                       data-add2="Bsmt"
    //                       data-city=""
    //                       data-state="CA"
    //                       data-zip=""
    //                       data-phone=""
    //                       data-fax=""
    //                       data-email=""
    //                     >
    //                       <div className="text-left p-l-5 p-r-5">
    //                         <p className="columnsTitle">
    //                           {data?.opposingcounselcontact?.name || (
    //                             <span className="text-primary-20">
    //                               Opposing Counsel Name
    //                             </span>
    //                           )}
    //                         </p>
    //                         <div>
    //                           <p className="colFont info_phone_number text-black">
    //                             {data?.opposingcounselcontact?.address1 || (
    //                               <span className="text-primary-20">
    //                                 Address,
    //                               </span>
    //                             )}
    //                             &nbsp;{data?.opposingcounselcontact?.address2}
    //                           </p>
    //                           <p className="colFont info_fax">
    //                             {data?.opposingcounselcontact?.city || (
    //                               <span className="text-primary-20">City</span>
    //                             )}
    //                             ,&nbsp;{data?.opposingcounselcontact?.state || (
    //                               <span className="text-primary-20">State</span>
    //                             )}
    //                             &nbsp;{data?.opposingcounselcontact?.zip || (
    //                               <span className="text-primary-20 ">Zip</span>
    //                             )}
    //                           </p>
    //                         </div>
    //                         <p className="colFont info_phone_number text-black">
    //                           <small>(</small>
    //                           {data?.opposingcounselcontact?.phone_number || (
    //                             <span className="text-primary-20">
    //                               (###) ###-####
    //                             </span>
    //                           )}
    //                           <small>)</small>
    //                         </p>
    //                         <p className="colFont info_fax">
    //                           {data?.opposingcounselcontact?.fax ? (
    //                             <>
    //                               <small>(</small>
    //                               {data.opposingcounselcontact?.fax.slice(0, 3)}
    //                               <small>)</small>
    //                               {data?.opposingcounselcontact?.fax.slice(
    //                                 3,
    //                                 6
    //                               )}
    //                               -{data.opposingcounselcontact?.fax.slice(6)}
    //                               <small className="ml-2 text-grey">fax</small>
    //                             </>
    //                           ) : (
    //                             <span className="text-primary-20">
    //                               (###) ###-####
    //                             </span>
    //                           )}
    //                         </p>
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="mt-auto">
    //                     {data?.opposingcounselcontact?.email ? (
    //                       <a
    //                         href="#"
    //                         className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
    //                       >
    //                         <i className="ic ic-19 ic-email-3d m-r-5"></i>
    //                         {data?.opposingcounselcontact?.email}
    //                       </a>
    //                     ) : (
    //                       <p className="btn btn-primary-lighter-2 rounded-0 height-25 d-flex align-items-center justify-content-center m-b-5">
    //                         <i className="ic ic-19 ic-email-3d"></i>
    //                       </p>
    //                     )}
    //                     <a
    //                       href="#"
    //                       className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 m-t-5 d-flex align-items-center justify-content-center"
    //                     >
    //                       <i className="ic ic-19 ic-generate-document m-r-5"></i>
    //                       Generate Document
    //                     </a>
    //                   </div>
    //                 </div>

    //                 <div
    //                   className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-lg-250"
    //                   style={{ width: "250px" }}
    //                 >
    //                   <div className="information-wrapper">
    //                     <div
    //                       data-toggle="modal"
    //                       data-target="#editcounsel_contact_modal"
    //                       data-id="19"
    //                       data-block="opposingdata?.opposingattorney?_block"
    //                       data-name=" "
    //                       data-add1="N Hwy"
    //                       data-add2="Bsmt"
    //                       data-city=""
    //                       data-state="CA"
    //                       data-zip=""
    //                       data-phone=""
    //                       data-fax=""
    //                       data-email=""
    //                     >
    //                       <div className="text-left p-l-5 p-r-5">
    //                         <p className="columnsTitle">
    //                           {data?.opposingattorney?.name?.trim() ? (
    //                             data?.opposingattorney?.name
    //                           ) : (
    //                             <span className="text-primary-20">
    //                               Name
    //                             </span>
    //                           )}
    //                         </p>
    //                         <div>
    //                           <p className="colFont info_phone_number text-black">
    //                             {formatAddress(
    //                               data?.opposingattorney?.address1,
    //                               data?.opposingattorney?.address2,
    //                               // data?.opposingattorney?.city,
    //                               // data?.opposingattorney?.state,
    //                               // data?.opposingattorney?.zip
    //                             )}
    //                           </p>
    //                           <p className="colFont info_fax">
    //                             {data?.opposingattorney?.city ? (
    //                               `${data?.opposingattorney?.city}, `
    //                             ) : (
    //                               <span className="text-primary-20">City, </span>
    //                             )}
    //                             {data?.opposingattorney?.state || (
    //                               <span className="text-primary-20">State </span>
    //                             )}
    //                             &nbsp; {data?.opposingattorney?.zip || (
    //                               <span className="text-primary-20">Zip</span>
    //                             )}
    //                           </p>
    //                         </div>
    //                         <p className="colFont info_phone_number text-black">
    //                           {formatPhoneNumber(
    //                             data?.opposingattorney?.phone_number
    //                           )}
    //                         </p>
    //                         <p className="colFont info_fax">
    //                           {formatPhoneNumber(data?.opposingattorney?.fax)}{" "}
    //                           <small className="ml-2 text-grey">fax</small>
    //                         </p>
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="mt-auto">
    //                     {data?.opposingattorney?.email ? (
    //                       <a
    //                         href="#"
    //                         className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 rounded-0 d-flex align-items-center justify-content-center info_email m-b-5 p-l-6 p-r-6"
    //                       >
    //                         <i className="ic ic-19 ic-email-3d m-r-5"></i>
    //                         {data?.opposingattorney?.email}
    //                       </a>
    //                     ) : (
    //                       <p className="btn btn-primary-lighter-2 rounded-0 height-25 d-flex align-items-center justify-content-center m-b-5">
    //                         <i className="ic ic-19 ic-email-3d"></i>
    //                       </p>
    //                     )}
    //                     <a
    //                       href="#"
    //                       className="btn btn-primary-lighter-2 font-weight-semibold btn-white-hover text-lg height-25 m-t-5 rounded-0 d-flex align-items-center justify-content-center"
    //                     >
    //                       <i className="ic ic-19 ic-generate-document m-r-5"></i>
    //                       Generate Document
    //                     </a>
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="d-md-flex">
    //                 <div
    //                   className="dynamic-width col-auto d-flex flex-column p-0 p-r-5 width-lg-250"
    //                   data-toggle="modal"
    //                   data-target="#editcounsel_information_modal"
    //                   data-id={data?.id}
    //                   data-counsel_type={data?.counsel_type.id}
    //                   data-file_number={data?.file_number}
    //                 >
    //                   <div className="text-left p-l-5 p-r-5">
    //                     <div className="row mb-0 colFont">
    //                       <div className="col text-left">
    //                         <span className="d-inline-block">Counsel Type</span>
    //                       </div>
    //                       <div className="col-auto text-left font-weight-semibold">
    //                         <p>{data?.counsel_type.name}</p>
    //                       </div>
    //                     </div>
    //                     <div className="row mb-0 colFont">
    //                       <div className="col text-left">
    //                         <span className="d-inline-block">File #</span>
    //                       </div>
    //                       <div className="col-auto text-left font-weight-semibold">
    //                         <p>{data?.file_number}</p>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div
    //             className="d-flex-1 p-0 position-relative z-index-1 mt-4"
    //             style={{ marginTop: "25px" }}
    //           >
    //             <NotesPanel record_id={data?.id} module={"Counsel"} />
    //           </div>
    //           <div className="d-flex-1 p-0 position-relative z-index-1">
    //             <div
    //               className="fields-wrap overflow-hidden h-100"
    //               data-toggle="modal"
    //               data-target="#individual_notes_modal"
    //             >
    //               <div
    //                 className="tab-pane"
    //                 id="custom-nav-todo"
    //                 role="tabpanel"
    //                 aria-labelledby="custom-nav-todo-tab"
    //               >
    //                 <div className="col-lg-12">
    //                   <div className="row">
    //                     <div className="table-responsive table--no-card border-0 has-alternate-grey client-counsel-table p-r-15 overflow-hidden">
    //                       {/* <NotesPanel record_id={data?.id} module={"Counsel"} /> */}
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="row documents-wrapper m-t-5">
    //           <div className="col-12">
    //             <div className="m-r-10 background-main-10 height-25 d-flex align-items-center justify-content-center">
    //               <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
    //                 {" "}
    //                 for UpdatedFirstName Root Quick-Access Document Row
    //               </h4>
    //             </div>
    //             <div className="row no-gutters flex-row position-relative bg-primary-2">
    //               <div className="col p-0">
    //                 <div className="d-flex justify-content-start w-100">
    //                   <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
    //                     <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
    //                       <div className="upload-icon border-0 rounded-0 bg-transparent dropzone--137-54">
    //                         <div
    //                           className="d-flex align-items-center"
    //                           style={{ position: "relative", left: "46%" }}
    //                         >
    //                           <span className="font-weight-bold text-gold h5 m-0 pr-2">
    //                             +
    //                           </span>
    //                           <span className="text-lg-grey">
    //                             Upload Document to Page
    //                           </span>
    //                         </div>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="w-120 p-0 ml-auto p-l-5 bg-white">
    //             <div className="row dtn-re fixed-column m-0">
    //               <div className="col-12 super-heros p-0">
    //                 <div className="super-hero-img">
    //                   <i className="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-1 dz-clickable"></i>
    //                 </div>
    //                 <div className="super-hero-img">
    //                   <i className="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-2 dz-clickable"></i>
    //                 </div>
    //                 <div className="super-hero-img">
    //                   <i className="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-3 dz-clickable"></i>
    //                 </div>
    //                 <div className="super-hero-img">
    //                   <i className="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-4 dz-clickable"></i>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    //   <CounselContactModal
    //     show={showCounselModal}
    //     handleClose={handleCloseModal}
    //     states={ModalData?.states}
    //     opposingcounselcontact={selectedChecklist?.opposingcounselcontact}
    //     counselTypeId={selectedChecklist?.counsel_type?.id}
    //     opposingCounselId={selectedChecklist?.id}
    //   />
    // </>


    // NEW COUNSEL LAYOUT START 
    <>
      <div className="border-box-wrap" style={{ width: "100%" }}>
        {clientData?.map((data, index) => (
          <CounselMain
            object={data}
            handleFetchWitnesses={() => setIsClientDataUpdated(true)}
            counselTypes={counselTypes ? counselTypes : []}
          />
        ))}
      </div>

      {/* NEW COUNSEL LAYOUT END */}

      {/* <CounselContactModal
        show={showCounselModal}
        handleClose={handleCloseModal}
        states={ModalData?.states}
        opposingcounselcontact={selectedChecklist?.opposingcounselcontact}
        counselTypeId={selectedChecklist?.counsel_type?.id}
        opposingCounselId={selectedChecklist?.id}
      /> */}
    </>
  );
};

export default ClientCheckList;
