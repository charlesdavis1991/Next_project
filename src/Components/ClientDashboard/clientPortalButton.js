import React, { useEffect, useState, useContext, useRef } from "react";
import "../../../public/BP_resources/css/client-4.css";
import "../../../public/BP_resources/css/client-main.css"
import PreviewPortalModal from "./modals/ClientPortalModal";
import { useMediaQuery } from "react-responsive";

const ClientPortalButton = ({ }) => {
    const [showClientPortalModal, setShowClientPortalModal] = useState(false);

    function handleClientPortalClose() {
        setShowClientPortalModal(false);
    }

    // Media queries
    const isFiveCards = useMediaQuery({ minWidth: 2350});
    const isFourCards = useMediaQuery({ minWidth: 2100, maxWidth: 2350 });
    const isThreeCards = useMediaQuery({ minWidth: 1850, maxWidth: 2100 });
    const isTwoCards = useMediaQuery({ minWidth: 1650, maxWidth: 1850 });
    const isOneCards = useMediaQuery({ minWidth: 1450, maxWidth: 1650 });
    const isNoCards = useMediaQuery({ minWidth: 1050, maxWidth: 1450 });

    return (
        <div className="client-info-head clienthead">
            <div className="d-flex margin-left-23">
                <button
                    onClick={() => setShowClientPortalModal(true)}
                    className={`btn btn-primary-lighter-2 portal-btn font-weight-semibold text-lg text-capitalize height-30 rounded-0 d-flex align-items-center justify-content-center SkewX-client ${isFiveCards ? 'client-portal-btn-five' : isFourCards ? 'client-portal-btn-four' : isThreeCards ? 'client-portal-btn-three' : isTwoCards ? 'client-portal-btn-two' : isOneCards ? 'client-portal-btn-one' : isNoCards ? 'client-portal-btn-no' : 'client-portal-btn'}`}
                >
                    <span className="ic-custom">
                        <i className="ic ic-19 ic-portal m-r-5 Anti-SkewX-client "></i>
                    </span>
                    <span

                        className="Anti-SkewX-client"
                        style={{marginTop:"-5px"}}
                    >
                        Client portal settings
                    </span>
                </button>
            </div>
            {showClientPortalModal &&
                <PreviewPortalModal
                    show={showClientPortalModal}
                    handleClose={handleClientPortalClose}
                />

            }
        </div>
    );
};

export default ClientPortalButton;
