import React from "react";

export const Signature = () => {
    const signTemplatesForPage = [
        {
            template_name: "",
            status: "Signed",
            signed_at: "2024-02-21",
            signed_document_id: "document1",
        },
        {
            template_name: "",
            status: "Sent",
            sent_at: "2024-02-20",
            signed_document_id: null,
        },
        {
            template_name: "",
            status: "Pending",
            signed_at: null,
            sent_at: null,
            signed_document_id: null,
        },
    ];
    return (
        <div className="row esignatures-wrapper no-gutters m-b-5" style={{ overflow: 'hidden', width:"99%", display:"flex", marginLeft:"10px" }}>
            <div className="col-12">
                <div className="height-25 background-main-10">
                    <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
                        E-Signature Templates for Case
                    </h4>
                </div>
                <div className="row align-items-center flex-row position-relative ml-0 mr-0 mt-2 mb-2">
                    <div className="icon-text-boxes esignatures-cols-wrapper d-flex flex-wrap w-100 e-template-row ">
                        {signTemplatesForPage.map((temp, index) => (
                            <div
                                key={index}
                                id="no-vertical-border"
                                className="col-12 col-md-3 col-xl icon-text-box text-center"
                                onClick={
                                    temp.signed_document_id
                                        ? () => { }
                                        : () => { }
                                }
                            >
                                <p className="name">{temp.template_name}</p>
                                <span className="text-lg d-flex align-items-center justify-content-center text-darkest-grey">
                                    {temp.status}
                                    <i className="ic ic-19 ic-esignature m-r-5 m-l-5"></i>
                                    {temp.status === "Signed"
                                        ? temp.signed_at
                                        : temp.status === "Sent"
                                            ? temp.sent_at
                                            : null}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-l-5 height-25 background-main-10">
                    <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100"></h4>
                </div>
                <div className="row align-items-center flex-row position-relative ml-0 mr-0 mt-2">
                    <div className="icon-text-boxes esignatures-cols-wrapper d-flex flex-wrap w-100 e-template-row "></div>
                </div>
            </div>
        </div>
    )
}