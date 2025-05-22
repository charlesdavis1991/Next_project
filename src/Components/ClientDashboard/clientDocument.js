import React ,{useState} from "react";
import ClientSignature from "./clientSignature";
import Modal from "./modals/modal";
import UploadModal from "./modals/uploadDoc";

const ClientDocument = (props) => {
    const [open, setOpen] = useState(false)
    
    const showModal = ()=>{
        setOpen(!open)
    }
    
    
    return (

        <div>
            <div class="background-main-10 height-25 d-flex align-items-center justify-content-center">
                <h4 class="client-contact-title text-center d-flex justify-content-center align-items-center h-100">Client Lakeasha Johnson Quick-Access Document Row</h4>
            </div>

            {props.flag ? <>
                <div className="d-flex justify-content-start w-100">
                    <div className="icon-text-boxes-client d-flex flex-wrap w-100 quick-doc-row">
                        <div className="col-12 col-md-12 col-xl icon-text-box text-center dropzone-82-2  bg-primary-100  pl-0 pr-0 mt-2">
                            <ClientSignature p="p-2" name="Upload Document to Page" className="font-weight-bold text-gold h5 m-0 pr-2" plusIcon="+" textGrey="text-lg-grey font-13" />
                        </div>
                        <div class=" col-12 col-md-12">
                            <div class="row dtn-re fixed-column m-0">
                                <div class="col-12 super-heros p-0 justify-content-end">
                                    <div class="super-hero-img">
                                        <i class="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-2 dz-clickable"></i>
                                    </div>
                                    <div class="super-hero-img">
                                        <i class="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-3 dz-clickable"></i>
                                    </div>
                                    <div class="super-hero-img">
                                        <i class="ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-4 dz-clickable"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </> : <>
                <div className="d-flex justify-content-start w-100">
                    <div className="icon-text-boxes-client d-flex flex-wrap w-100 quick-doc-row">

                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2 bg-primary-100 pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="1. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2  bg-primary-101  pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="2. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2 bg-primary-100  pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="3. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2  bg-primary-101  pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="4. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2  bg-primary-100  pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="5. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2  bg-primary-101  pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="6. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2  bg-primary-100  pl-0 pr-0 mt-2" onClick={showModal}>
                            <ClientSignature p="p-2" name="7. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                        <div className="col-12 col-md-3 col-xl icon-text-box text-center dropzone-82-2  bg-primary-101  pl-0 pr-0 mt-2" onClick={showModal}> 
                            <ClientSignature p="p-2" name="8. Available" icon="ic ic-24 ic-file-grey cursor-pointer" textGrey="text-lg-grey font-13" />
                        </div>
                    </div>
                </div></>}
                
                <Modal show={open} onHide={()=>setOpen(false)} size="modal-90w">
                    <UploadModal hideModal={()=> setOpen(false)} />
                </Modal>



        </div>

    )
}

export default ClientDocument;