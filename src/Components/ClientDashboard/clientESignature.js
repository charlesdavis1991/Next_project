import React from 'react';

const ESignatureComponent = () => {
  return (
    <div className="row esignatures-wrapper no-gutters m-t-5">
    <div className="col-12">
      <div style={{ backgroundColor: 'var(--primary-15)'}} className="height-25 d-flex align-items-center justify-content-center">
        <h4 className="client-contact-title text-center d-flex justify-content-center align-items-center h-100">
          E-Signature template for client
        </h4>
      </div>
      <div className="row redtd2 bg-primary-5 align-items-center flex-row position-relative m-0">
        <div className="icon-text-boxes esignatures-cols-wrapper d-flex flex-wrap w-100 e-template-row">
          {['1. example template 1', '2. example template 1', '3. example template 1', '4. example template 1'].map((template, index) => (
            <div key={index} className="col-12 col-md-3 col-xl icon-text-box text-center" id="no-vertical-border">
              <span className="text-lg d-flex align-items-center justify-content-center text-darkest-grey">
                Signed
                <i className="ic ic-16 ic-md-25 ic-esignature m-r-5 m-l-5"></i>
                {/* 12/12/2023 */}
              </span>
              <p className="name">{template}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ESignatureComponent;
