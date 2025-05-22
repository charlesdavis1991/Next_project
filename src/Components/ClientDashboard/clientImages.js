import React, { useState } from "react";
import Modal from "./modals/modal";
import AvatarModal from "./modals/AvatarModal";
import "../../../public/BP_resources/css/client-4.css";
import avatar from "../../../public/bp_assets/img/avatar_new.svg";
import { mediaRoute } from "../../Utils/helper";
import Button from "./shared/button";

const ClientImages = ({ image1, image2, image3, modalEditShowValue, photos, Avatars, first_name, last_name, middle_name }) => {

    const [clientAvatar, setClientAvatar] = useState(false);

    const showClientAvatar = (event) => {
        event.preventDefault();
        setClientAvatar(!clientAvatar)
    }

    const handleEditShowModal = () => {
        modalEditShowValue(true);
    }

    return (
        <div className="" style={{ height: "113px", width: '135px' }}>
            <div className=" flex-g-1 height-25" style={{ background: 'var(--primary-15)' }}>
                <h4 className="client-contact-title text-center height-25 d-flex align-items-center justify-content-center">client avatar</h4>
            </div>
            <div className="col-auto d-flex flex-column justify-content-center align-items-center p-0 m-l-5 m-r-5 p-t-5">
                <div className="d-flex justify-content-center align-items-center " onClick={handleEditShowModal}>
                    <div className="client-image position-relative image-container cursor-pointer mr-0 border-overlay-client" data-toggle="modal" data-target="#changeAvatar">
                        {image1 ? (
                            <img className="" src={image1} alt="Pic 1" />
                        ) : (
                            <img className="" src={avatar} alt="Pic 1" />
                        )
                        }
                    </div>
                    <div className="m-l-10 d-flex justify-content-between align-items-center flex-column ">
                        <div className="img-align-sm-mobile m-b-5 client-image ic-19-client-image mr-0 border-overlay-client">
                            {image2 ? (
                                <img className="images-client" src={image2} alt="Pic 2" />
                            ) : (
                                <img className="images-client" src={avatar} alt="Pic 2" />
                            )
                            }
                        </div>
                        <div className="img-align-mobile ic-29-client-image mr-0  client-image border-overlay-client">
                            {image3 ? (
                                <img className="images-client" src={image3} alt="Pic 3" />
                            ) : (
                                <img className="images-client" src={avatar} alt="Pic 3" />
                            )
                            }
                        </div>
                    </div>

                </div>

            </div>
            <div className="text-center d-flex align-items-center justify-content-center font-weight-semibold text-lg primary-color-text-client" data-toggle="modal" style={{ height: '25px', marginTop: '-5px' }} data-target="#changeAvatar" onClick={handleEditShowModal}>Click to Edit</div>
            {/* <div className="m-r-5" style={{ marginTop: '-1px'}} onClick={handleEditShowModal}>
                    <Button
                      showButton={true}
                      icon=""
                      buttonText="Click to Edit"
                    />
                  </div> */}
            {/* <button class="btn btn-primary-lighter-2 text-center font-weight-semibold text-lg primary-color-text-client" data-toggle="modal" data-target="#changeAvatar" onClick={handleEditShowModal} style={{paddingTop:"6px"}}>Click to Edit</button> */}


            <Modal show={clientAvatar} onHide={() => setClientAvatar(false)}>
                <AvatarModal photos={photos} middle_name={middle_name} Avatars={Avatars} hideModal={showClientAvatar} last_name={last_name} first_name={first_name} />
            </Modal>
        </div>
    );
};

export default ClientImages;

