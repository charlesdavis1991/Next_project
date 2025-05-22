import React from 'react';

const ClientContent = ({ client, clientCasesProp }) => {
    const clientCases = [...clientCasesProp];
  return (
    <div className="container-fluid overflow-hidden Cus-PLC-2 PR-0-PX">
      <div  className="row">
        <div className="col-12">
          <div id="clientContentWrap" className="d-flex flex-column flex-lg-row flex-lg-nowrap position-relative m-r-5">
            <div className="content-left order-2 order-lg-1 d-flex-lg-1 d-lg-flex">
              <div className="p-0 rounded-0 d-flex-lg-1 client-communication-wrapper" id="communication_panel">
                <div className="row client-communication-interface no-gutters m-b-5 ">
                  <div className="col-12">
                    <div className="row no-gutters client-communication-main justify-content-between flex-nowrap">
                      <div className="client-contact-phone-col client-contact-col c-case custom-w-mw client-contact-wrapper">
                        <div>
                          <h4 className="client-contact-title text-center">
                            {client.first_name ? client.first_name : ''} {client.last_name ? client.last_name : ''} Case History
                          </h4>
                        </div>
                        <div className="m-r-5 position-relative overflow-hidden fake-rows-holder">
                          <div className="p-r-5 position-relative">
                            {clientCases.map((clientCase, index) => (
                              <div
                                key={index}
                                className="client-identification-row-2 d-flex cursor-pointer"
                                onClick={''}
                              >
                                <div className="d-flex flex-grow-1 justify-content-between">
                                  <div className="d-flex align-items-center client-identifier-name font-weight-semibold mr-10-custom-history">
                                    <i className="ic ic-accident ic-19"></i>
                                    <span className="m-r-5 m-l-5 white-space-nowrap">{clientCase.name}</span>
                                  </div>
                                  <span className="client-identifier-date">DOI<span className="font-weight-bold"> {clientCase.incident_date}</span></span>
                                  {clientCase.open === 'True' ? (
                                    <>
                                      <span className="color-green font-weight-bold m-r-5">OPEN:</span>
                                      <span className="font-weight-semibold">3/02/2023</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="colorgrey-2 font-weight-bold">CLOSED</span>
                                      <span className="font-weight-semibold">3/02/2023</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex client-avatar-wrapper flex-none-260">
                        <div className="client-address-wrapper">
                          <div className="client-address-wrapper-row row no-gutters justify-content-end">
                            <div className="col w-md-235 client-contact-phone-col client-contact-col c-name Client-H-109 min-w-260px-client">
                              <div className="">
                                <h4 className="client-contact-title text-center ">Client Name</h4>
                              </div>
                              <div className="m-r-5">
                                <div className="p-l-5 p-r-5 background-white client-name-panel" onClick={`() => fill_spouse_info_modal()`} data-toggle="modal" data-target="#edit-client-information-modal">
                                  <div className="client-identification-row d-flex">
                                    <div className="colFonts text-left col-title min-h-0 mb-0">First:</div>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                      {client.first_name || ''}
                                    </div>
                                  </div>
                                  <div className="client-identification-row d-flex">
                                    <div className="colFonts text-left col-title min-h-0 mb-0">Middle:</div>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                      {client.middle_name || ''}
                                    </div>
                                  </div>
                                  <div className="client-identification-row d-flex">
                                    <div className="colFonts text-left col-title min-h-0 mb-0">Last:</div>
                                    <div className="col-value colFonts min-h-0 mb-0">
                                      {client.last_name || ''}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-auto">
                                  <a href="#" className="btn btn-primary-lighter-2 btn-white-hover text-lg height-21 rounded-0 d-flex align-items-center justify-content-center info_email d-flex-1 font-weight-semibold" onClick={`(e) => { e.preventDefault(); openClientMessageModal(e, 'chat'); }`}>
                                    <i className="ic ic-19 ic-chat-3d mr-2"></i>
                                    Chat Client
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="client-image-wrapper m-l-5 m-r-5 d-flex flex-column justify-content-start">
                            <div className="flex-g-1">
                              <h4 className="client-contact-title text-center pos-rel-index">CLIENT AVATAR</h4>
                            </div>
                            <div className="col-auto d-flex flex-column justify-content-center align-items-center p-0 m-l-5 m-r-5">
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="client-image position-relative ic-63 cursor-pointer mr-0" onClick={'() => fill_spouse_info_modal()'} data-toggle="modal" data-target="#edit-client-information-modal">
                                  {client.profile_pic_63p ? (
                                    <img className="client_profile_image_63" src={client.profile_pic_63p.url} alt="John Doe" />
                                  ) : (
                                    <i className="ic ic-client-avatar h-100 w-100"></i>
                                  )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center flex-column">
                                  <div className="client-image position-relative ic-19 cursor-pointer mr-0 m-l-10 m-b-5" onClick={'() => fill_spouse_info_modal()'} data-toggle="modal" data-target="#edit-client-information-modal">
                                    {client.profile_pic_19p ? (
                                      <img className="client_profile_image_19" src={client.profile_pic_19p.url} alt="John Doe" />
                                    ) : (
                                      <i className="ic ic-client-avatar h-100 w-100"></i>
                                    )}
                                  </div>
                                  <div className="client-image position-relative ic-29 cursor-pointer mr-0 m-l-10" onClick={'() => fill_spouse_info_modal()'} data-toggle="modal" data-target="#edit-client-information-modal">
                                    {client.profile_pic_29p ? (
                                      <img className="client_profile_image_29" src={client.profile_pic_29p.url} alt="John Doe" />
                                    ) : (
                                      <i className="ic ic-client-avatar h-100 w-100"></i>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-center p-t-2 color-grey-2" onClick={'() => fill_spouse_info_modal()'} data-toggle="modal" data-target="#edit-client-information-modal">Click to Edit</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ClientContent;