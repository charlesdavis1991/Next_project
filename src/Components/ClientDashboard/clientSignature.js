import React from "react";

const ClientSignature = (props) => {

    return (
        <>

            <div class={`icon-text-box text-center d-flex align-items-center ${props.p}`} id="no-vertical-border">
                <span class="text-lg d-flex align-items-center justify-content-center text-darkest-grey align-items-center flex-row position-relative">
                    {props.sign}

                    {props.plusIcon ? (
                        <span className={props.className}>{props.plusIcon}</span>
                    ) : (
                        props.icon && <i className={props.icon}></i>
                    )}

                </span>
                <p className={`name ml-1  align-items-center  ${props.textGrey}`}>{props.name}</p>
            </div>


        </>
    );
};

export default ClientSignature;
