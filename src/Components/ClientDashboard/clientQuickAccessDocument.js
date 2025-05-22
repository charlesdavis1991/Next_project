import React from 'react';

const QuickAccessDocumentsComponent = ({ insurance, first_name, last_name, insuranceSlots }) => {
  return (
    <div className="row documents-wrapper m-t-5">
      <div className="col-12">
        <div className="m-r-10 background-main-10 height-25 d-flex align-items-center justify-content-center">
          <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
            client {first_name} {last_name} Quick-Access Document Row
          </h4>
        </div>
        <div className="row no-gutters flex-row position-relative bg-primary-2">
          <div className="col p-0">
            <div className="d-flex justify-content-start w-100">
              <div className="icon-text-boxes d-flex flex-wrap w-100 quick-doc-row">
                {insuranceSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`col-12 col-md-3 col-xl icon-text-box text-center dropzone-${insurance.id}-${slot.id} dz-clickable`}
                    id="no-vertical-border"
                  >
                    <p className="date"></p>
                    <span className="icon-wrap">
                      <i className="ic ic-35 ic-custom-icon-cloud-2 cursor-pointer"></i>
                    </span>
                    <p className="name text-lg-grey">
                      {slot.slot_number}. {slot.slot_name || 'Available'}
                    </p>
                  </div>
                ))}
                <div className="col-12 col-md-3 col-xl icon-text-box text-center order-last">
                  <div className="upload-icon border-0 rounded-0 bg-transparent dropzone--137-54">
                    <div className="d-flex align-items-center">
                      <span className="font-weight-bold text-gold h5 m-0 pr-2">+</span>
                      <span className="text-lg-grey">Upload Document to Page</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-120 p-0 ml-auto p-l-5 bg-white">
        <div className="row dtn-re fixed-column m-0">
          <div className="col-12 super-heros p-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="super-hero-img">
                <i className={`ic h-100 w-100 ic-placeholder-grey cursor-pointer dropzone-${i} dz-clickable`}></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessDocumentsComponent;
