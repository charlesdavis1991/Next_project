import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function ProviderCharges() {
  const editCaseProvider = useSelector(
    (state) => state.clientProvider.editCaseProvider
  );
  const [finalAmount, setFinalAmount] = useState(editCaseProvider?.final_amount || '');
  const [proAmount, setProAmount] = useState(editCaseProvider?.amount || '');
  const [proInsPaid, setProInsPaid] = useState(editCaseProvider?.ins_paid || '');
  const [proWriteOff, setProWriteOff] = useState(editCaseProvider?.write_off || '');
  const [proMedPayPaip, setProMedPayPaip] = useState(editCaseProvider?.medpaypaip || '');
  const [proReduction, setProReduction] = useState(editCaseProvider?.reduction || '');
  const [proPatientPaid, setProPatientPaid] = useState(editCaseProvider?.patient_paid || '');

  const calculateFinalAmount = () => {
    const finalAmount = parseFloat(proAmount) - (parseFloat(proInsPaid) + parseFloat(proWriteOff) + parseFloat(proMedPayPaip) + parseFloat(proReduction) + parseFloat(proPatientPaid));
    setFinalAmount(finalAmount.toFixed(2));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'provider-amount') {
      setProAmount(value);
    } else if (name === 'provider-ins_paid') {
      setProInsPaid(value);
    } else if (name === 'write_off') {
      setProWriteOff(value);
    } else if (name === 'provider-medpaypaip') {
      setProMedPayPaip(value);
    } else if (name === 'provider-reduction') {
      setProReduction(value);
    } else if (name === 'provider-patient_paid') {
      setProPatientPaid(value);
    }
    else if(name === 'final_amount') {
      setFinalAmount(value);
    }
  };

  return (
    <form
      id="editClientForm2_lien_holder"
    //   action="/30/medical_provider_charges_edit/"
    //   method="post"
    >
      {/* PROVIDER ID */}
      <div className="row align-items-end form-group">
        <div className="col-md-2 text-left labe-col">
          <span className="d-block text-grey" id="modal-med-provider-name">
          {editCaseProvider?.panel_name}
          </span>
          <span className="d-block text-grey" id="modal-firm-name">
            {editCaseProvider?.for_case?.for_client?.created_by?.office_name}
          </span>
        </div>
        <div className="col-md-10">
          <div className="row pr-3">
            <div className="col p-1">
              <span className="d-block top-label">Original</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <input
                    type="text"
                    name="orignal"
                    placeholder="999,999.99"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group mb-0">
                <div className="input-group-charge">
                  <div className=" input-group-text-charge">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-amount"
                    name="provider-amount"
                    defaultValue={editCaseProvider?.amount}
                    className="form-control form-control-charge"
                    onChange={handleChange}
                    onBlur={calculateFinalAmount}
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">HI Paid</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="ins_paid"
                    placeholder="999,999.99"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-ins_paid"
                    name="provider-ins_paid"
                    value={proInsPaid}
                    className="form-control form-control-charge"
                    onChange={handleChange}
                    onBlur={calculateFinalAmount}
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">HI Reduction</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="ins_reduction"
                    placeholder="999,999.99"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge">$</div>
                  <input
                    type="number"
                    name="write_off"
                    placeholder=""
                    id="provider-write_off"
                    value={proWriteOff}
                    className="form-control form-control-charge"
                    onChange={handleChange}
                    onBlur={calculateFinalAmount}
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">MP / PIP</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="medpaypaip"
                    placeholder="999,999.99"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-medpaypaip"
                    name="provider-medpaypaip"
                    value={proMedPayPaip}
                    onChange={handleChange}
                    className="form-control form-control-charge"
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">Reduc.</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="reduction"
                    placeholder="999,999.99"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-reduction"
                    name="provider-reduction"
                    value={proReduction}
                    onChange={handleChange}
                    className="form-control form-control-charge"
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">Client Paid</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="patient_paid"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-patient_paid"
                    name="provider-patient_paid"
                    value={proPatientPaid}
                    className="form-control form-control-charge"
                    onChange={handleChange}
                    onBlur={calculateFinalAmount}
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">Lien</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="final_amount"
                    placeholder="999,999.99"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-final_amount"
                    name="provider-final_amount"
                    value={finalAmount}
                    onChange={handleChange}
                    className="form-control form-control-charge no-border"
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="col p-1">
              <span className="d-block top-label">Final Amount</span>
              <div className="form-group">
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text border-0 text-grey">$</div>
                  </div>
                  <input
                    type="text"
                    name="final"
                    defaultValue=""
                    className="form-control border-0 text-grey"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-group  mb-0">
                <div className="input-group-charge">
                  <div className="input-group-text-charge no-border">$</div>
                  <input
                    type="number"
                    placeholder=""
                    id="provider-final"
                    name="provider-final"
                    value={0.00}
                    className="form-control form-control-charge no-border"
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
