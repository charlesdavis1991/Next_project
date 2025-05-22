import React, {useState} from "react";
import ClientName from "./clientName";
import Button from "./shared/button";
import ClientDocument from "./clientDocument";
import InsuranceHeader from "./shared/insuranceHeader";
import InsuranceTableHeader from "./shared/isuranceTableHeader";
import Modal from "./modals/modal";
import AdjustorModal from "./modals/adjustorModal";
import InsuranceInfoModal from "./modals/insuraceInfoModal";
import InsuranceCompany from "./modals/insuranceCompany";
import InsuranceGlobal from "./modals/insuranceGloab";
import CounselModal from "./modals/counselModal";

const ClientInsurance = () => {
    
    const [adjustor, setAdjustor] = useState(false);
    const [clientInfo, setClientInfo] = useState(false);
    const [clientCompany, setClientCompany] = useState(false);
    const [clientGlobal, setClientGlobal] = useState(false);
    const [clientCouncel, setClientCouncel] = useState(false);
    
    const hanldeAdjustor = ()=>{
        setAdjustor(!adjustor)
    }
    
    const hanldeInfo = () =>{
        setClientInfo(!clientInfo)
    }
    
    const handleCompany = () =>{
        setClientCompany(!clientCompany)
    }
    
    const handleGlobal = () =>{
        setClientGlobal(!clientGlobal)
    }
    
    const handleCouncel = ()=>{
        setClientCouncel(!clientCouncel)
    }
    
    const labelsArrayOne = [
        "Insurance Type",
        "Company Address",
        "Company Phone",
        "Adjuster Address",
        "Adjuster Phone",
        "Policy Limits Individual",
        "Policy Limit Global",
        "Policy Number",
        "Claim Number",
        "Coverage Confirmed",
        "Representation Letter",
        "Insurance Co Name",
        "Rep Letter Sent",
        "Rep Letter Uploaded",
        "Insurance Company Name",
        "Company Fax",
        "Company Email",
        "Adjuster Name",
        "Adjuster Email",
        "Adjuster Fax"
      ];
      
      const icon45 =(
        <div class="circlechart" data-percentage="45"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle stroke-violet" stroke-dasharray="45,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="12.5">45%</text><text class="circle-chart__subline" x="16.91549431" y="22">   45%  </text> </g></svg></div>
      )
      
      const icon30 = (
        <div class="circlechart" data-percentage="30"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle stroke-button-blue" stroke-dasharray="30,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="12.5">30%</text><text class="circle-chart__subline" x="16.91549431" y="22">   30%  </text> </g></svg></div>
      )
      
      const icon0 =(
        <div class="circlechart" data-percentage="0"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle grey-stroke" stroke-dasharray="0,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="12.5">0%</text><text class="circle-chart__subline" x="16.91549431" y="22">   0%  </text> </g></svg></div>
      )
      
      const icon40 = (
        <div class="circlechart" data-percentage="40"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle stroke-dark-blueberry" stroke-dasharray="40,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="12.5">40%</text><text class="circle-chart__subline" x="16.91549431" y="22">   40%  </text> </g></svg></div>
      )
      
      const icon55 = (
        <div class="circlechart" data-percentage="55"><svg class="circle-chart" viewBox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg"><circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9"></circle><circle class="circle-chart__circle stroke-rosepink" stroke-dasharray="55,100" cx="16.9" cy="16.9" r="15.9"></circle><g class="circle-chart__info">   <text class="circle-chart__percent" x="17.9" y="12.5">55%</text><text class="circle-chart__subline" x="16.91549431" y="22">   55%  </text> </g></svg></div>
      )
      
    return (
        <>
            <div>
                <ClientDocument />
                <InsuranceHeader title="Health Insurance"name="Lakeasha Johnson" notes="Health Insurance Notes" checklist="Insurance checklist" label={labelsArrayOne} progess={icon45} />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="ADJUSTUR" leftText="Global Test" fontBold="600" />
                                        <ClientName leftText="700 Main Ave 2, Dept 5 2" />
                                        <ClientName leftText="Long Beach 1, AZ 111111" />
                                        <ClientName leftText="(111) 111-1111" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCompany}>
                                        <ClientName title="INSURANCE COMPANY" leftText="INSURANCE COMPANY" fontBold="600" />
                                        <ClientName leftText="700 Main Ave, Dept 5" />
                                        <ClientName leftText="Long Beach 1, AZ 111111" />
                                        <ClientName leftText="(111) 111-1111" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeInfo}>
                                        <ClientName title="CLAIM INFORMATION" leftText="Type:" rightText="Health Insurance" />
                                        <ClientName leftText="limits:" rightText="$ / $" />
                                        <ClientName leftText="ploicy:" rightText="0" />
                                        <ClientName leftText="claim:" rightText="000" />
                                        <ClientName leftText="date" />
                                    </div>
                                    <div className="mt-1">

                                        <Button text="www.insurancecompany.com" />
                                    </div>

                                </div>
                                <div className="m-t-40">
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="SUPERVISOR" leftText="none none" fontBold="600" />
                                        <ClientName leftText="700 Main Ave, Dept 5" />
                                        <ClientName leftText="Long Beach 1, AZ 111111" />
                                        <ClientName leftText="(111) 111-1111" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 2nd component of insurance */}
            <div>
                <ClientDocument />
                <InsuranceHeader title="House Insurance"name="Lakeasha Johnson" notes="Health Insurance Notes" checklist="Insurance checklist" label={labelsArrayOne} progess={icon30} />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeAdjustor}> 
                                        <ClientName title="ADJUSTUR" leftText="John adjuster" fontBold="600" />
                                        <ClientName leftText="13001 Seal Beach Blvd, Ste 3001111" />
                                        <ClientName leftText="Huntington Beach, CA 90740" />
                                        <ClientName leftText="(562) 596-9800" />
                                        <ClientName leftText="(562) 596-9800" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCompany}>
                                        <ClientName title="INSURANCE COMPANY" leftText="Gloabl test" fontBold="600" />
                                        <ClientName leftText="700 Main Ave 2, Dept 5 2" />
                                        <ClientName leftText="Long Beach 1, CA 111111" />
                                        <ClientName leftText="(111) 111-111" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeInfo}>
                                        <ClientName title="CLAIM INFORMATION" leftText="Type:" rightText="Health Insurance" />
                                        <ClientName leftText="limits:" rightText="$ / $" />
                                        <ClientName leftText="ploicy:" rightText="238374rr3f" />
                                        <ClientName leftText="claim:" rightText="test" />
                                        <ClientName leftText="date" rightText="01/03/24" />
                                    </div>
                                    <div className="mt-1">

                                        <Button text="www.insurancecompany.com" />
                                    </div>

                                </div>
                                <div className="m-t-40">
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="SUPERVISOR" leftText="G G" fontBold="600" />
                                        <ClientName leftText="700 Main Ave 2, Dept 5 2" />
                                        <ClientName leftText="Long Beach 1, CA 111111" />
                                        <ClientName leftText="(111) 111-111" />
                                        <ClientName leftText="(562) 596-9800" textColor="text-primary-20" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* 3rd component */}
            <div>
                <ClientDocument />
                <InsuranceHeader title="House Insurance"name="Lakeasha Johnson" notes="Health Insurance Notes" checklist="Insurance checklist" label={labelsArrayOne} progess={icon0} />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="ADJUSTUR" leftText="0" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City CA Zip" />
                                        <ClientName leftText="(0) -" />
                                        <ClientName leftText="(0) -" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCompany}>
                                        <ClientName title="INSURANCE COMPANY" leftText="0" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City CA Zip" />
                                        <ClientName leftText="(0) -" />
                                        <ClientName leftText="(0) -" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeInfo}>
                                        <ClientName title="CLAIM INFORMATION" leftText="Type:" rightText="Health Insurance" />
                                        <ClientName leftText="limits:" rightText="$ / $" />
                                        <ClientName leftText="ploicy:" rightText="1234" />
                                        <ClientName leftText="claim:" rightText="1234" />
                                        <ClientName leftText="date" />
                                    </div>
                                    <div className="mt-1">

                                        <Button text="www.insurancecompany.com" />
                                    </div>

                                </div>
                                <div className="m-t-40">
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="SUPERVISOR" leftText="0" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City CA Zip" />
                                        <ClientName leftText="(0) -" />
                                        <ClientName leftText="(0) -" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 4rd component */}
            <div>
                <ClientDocument />
                <InsuranceHeader title="House Insurance"name="Lakeasha Johnson" notes="Health Insurance Notes" checklist="Insurance checklist" label={labelsArrayOne} progess={icon40} />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="ADJUSTUR" leftText="New Test Insurance" fontBold="600" />
                                        <ClientName leftText="LA, US" />
                                        <ClientName leftText="Los Angeles, CA 77799" />
                                        <ClientName leftText="(555) 666-7777" />
                                        <ClientName leftText="(444) 444-4" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCompany}>
                                        <ClientName title="insurance company" leftText="New Test Insurance" fontBold="600" />
                                        <ClientName leftText="LA, US" />
                                        <ClientName leftText="Los Angeles, CA 77799" />
                                        <ClientName leftText="(555) 666-7777" />
                                        <ClientName leftText="(444) 444-4" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeInfo}>
                                        <ClientName title="CLAIM INFORMATION" leftText="Type:" rightText="Car Insurance" />
                                        <ClientName leftText="limits:" rightText="$ / $" />
                                        <ClientName leftText="ploicy:" rightText="222222" />
                                        <ClientName leftText="claim:" rightText="333333" />
                                        <ClientName leftText="date" />
                                    </div>
                                    <div className="mt-1">

                                        <Button text="www.insurancecompany.com" />
                                    </div>

                                </div>
                                <div className="m-t-40">
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="SUPERVISOR" leftText="New test insurance" fontBold="600" />
                                        <ClientName leftText="LA, US" />
                                        <ClientName leftText="Los Angeles, CA 77799" />
                                        <ClientName leftText="(555) 666-7777" />
                                        <ClientName leftText="(444) 444-4" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* 5th component */}

            <div>
                <ClientDocument />
                <InsuranceHeader title="House Insurance"name="Lakeasha Johnson" notes="Health Insurance Notes" checklist="Insurance checklist" label={labelsArrayOne} progess={icon0} />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="ADJUSTUR" leftText="adjuster name" fontBold="600" />
                                        <ClientName leftText="address" />
                                        <ClientName leftText="city CA zip" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCompany}>
                                        <ClientName title="insurance company" leftText="company name" fontBold="600" />
                                        <ClientName leftText="address" />
                                        <ClientName leftText="city CA zip" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeInfo}>
                                        <ClientName title="CLAIM INFORMATION" leftText="Type:" rightText="Car Insurance" />
                                        <ClientName leftText="limits:" rightText="$ / $" />
                                        <ClientName leftText="ploicy:" rightText="000000" />
                                        <ClientName leftText="claim:" rightText="0000" />
                                        <ClientName leftText="date" />
                                    </div>
                                    <div className="mt-1">

                                        <Button text="www.insurancecompany.com" />
                                    </div>

                                </div>
                                <div className="m-t-40">
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="SUPERVISOR" leftText="supervisor name" fontBold="600" />
                                        <ClientName leftText="address" />
                                        <ClientName leftText="city CA zip" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 6th component */}
            <div>
                <ClientDocument />
                <InsuranceHeader title="House Insurance"name="Lakeasha Johnson" notes="Health Insurance Notes" checklist="Insurance checklist" label={labelsArrayOne} progess={icon55} />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="ADJUSTUR" leftText="test 2 mzz Testtest 2 mzz" fontBold="600" />
                                        <ClientName leftText="700 Main Ave 2, Dept 5 2" />
                                        <ClientName leftText="Long Beach 1, NY 111111" />
                                        <ClientName leftText="(111) 111-1111" />
                                        <ClientName leftText="(552) 596-9800" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCompany}>
                                        <ClientName title="INSURANCE COMPANY" leftText="Ee Eee" fontBold="600" />
                                        <ClientName leftText="123,123" />
                                        <ClientName leftText="123, AZ 000" />
                                        <ClientName leftText="(055) 566-6777" />
                                        <ClientName leftText="(111) 111-111" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={hanldeInfo}>
                                        <ClientName title="CLAIM INFORMATION" leftText="Type:" rightText="Health Insurance" />
                                        <ClientName leftText="limits:" rightText="$  150,002  /  $  300,001  " />
                                        <ClientName leftText="ploicy:" rightText="238374rr3f" />
                                        <ClientName leftText="claim:" rightText="22-3745298" />
                                        <ClientName leftText="date" rightText="10/12/2023" />
                                    </div>
                                    <div className="mt-1">

                                        <Button text="www.insurancecompany.com" />
                                    </div>

                                </div>
                                <div className="m-t-40">
                                    <div onClick={hanldeAdjustor}>
                                        <ClientName title="SUPERVISOR" leftText="John adjuster" fontBold="600" />
                                        <ClientName leftText="13001 Seal Beach Blvd, Ste 3001111" />
                                        <ClientName leftText="Huntington Beach, CA 90740" />
                                        <ClientName leftText="(562) 596-9800" />
                                        <ClientName leftText="(562) 596-9800" fax="true" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 7th component */}
            <div>
                <ClientDocument />
                <InsuranceTableHeader name="" firmName="Gloabl Test" web="" username="UsamaNawaz" fileNumber="Test" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="global test" fontBold="600" />
                                        <ClientName leftText="700 Main Ave 2, Dept 5 2" />
                                        <ClientName leftText="Long Beach 1, NY 111111" />
                                        <ClientName leftText="(111) 111-1111" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="aeeeaa@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>
                                        <ClientName leftText="counsel type" rightText="type 1" />
                                        <ClientName leftText="file #" rightText="test " />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="jhon adjuster" fontBold="600" />
                                        <ClientName leftText="13001 Seal Beach Blvd, Ste 300" />
                                        <ClientName leftText="Huntington Beach, CA 90740" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="someone@allstate.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 8th component */}
            <div>
                <ClientDocument flag={true} />
                <InsuranceTableHeader name="ROMERO CRISTIAN" firmName="CRISTIANFIRM" web="www.cris.com" username="UsamaNawaz" fileNumber="556677" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6  m-t-1">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="CristianFirm" fontBold="600" />
                                        <ClientName leftText="Long beach 1, Cal 1" />
                                        <ClientName leftText="Los Santos 1, CT 56561" />
                                        <ClientName leftText="(454) 545-4511" />
                                        <ClientName leftText="(555) 511-" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="Cris@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>
                                        <ClientName leftText="counsel type" rightText="type 1" />
                                        <ClientName leftText="file #" rightText="556677 " />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6" style={{zIndex: -1}}>
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="Cristian Romero" fontBold="600" />
                                        <ClientName leftText="Lo,Beach" />
                                        <ClientName leftText="LOS Angels, TX 66070" />
                                        <ClientName leftText="(555) 555-55" />
                                        <ClientName leftText="(445) 4545" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="cr@allstate.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 9th component */}
            <div>
                <ClientDocument flag={true} />
                <InsuranceTableHeader name="" firmName="FOLEY & MANSFIELD, PLLP" web="https" username="UsamaNawaz" fileNumber="122221" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="Foley & Mansfield, PLLP" fontBold="600" />
                                        <ClientName leftText="181 W. Huntington Dr, Ste 210" />
                                        <ClientName leftText="Monrovia,CA91016" />
                                        <ClientName leftText="(213) 282-2100" />
                                        <ClientName leftText="(213) 282-2101" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>

                                        <ClientName leftText="counsel type" rightText="type 1" />
                                        <ClientName leftText="file #" rightText="122221 " />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="Opposing Attorney Name" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City CA Zip" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="cr@allstate.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 10th component */}
            <div>
                <ClientDocument flag={true} />
                <InsuranceTableHeader name="DOE JOHN" firmName="DEV FIRM1" web="www.devfirm1.com" username="UsamaNawaz" fileNumber="0909090" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="Dev Firm1" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="city AZ zip" />
                                        <ClientName leftText="(123) -123-123" />
                                        <ClientName leftText="(123) 123-" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="df1@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>
                                        <ClientName leftText="counsel type" rightText="type 1" />
                                        <ClientName leftText="file #" rightText="0909090" />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="john Doe" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City tx Zip" />
                                        <ClientName leftText="(124 -564-566" />
                                        <ClientName leftText="(456) 456-" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="jd@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 11th component */}
            <div>
                <ClientDocument flag={true} />
                <InsuranceTableHeader name="00 000" firmName="00" web="00" username="UsamaNawaz" fileNumber="00" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="00" fontBold="600" />
                                        <ClientName leftText="00,00" />
                                        <ClientName leftText="00, CZ zip" />
                                        <ClientName leftText="(00) --" />
                                        <ClientName leftText="(00) -" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="00" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>

                                        <ClientName leftText="counsel type" rightText="type 1" />
                                        <ClientName leftText="file #" rightText="00" />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="000 00" fontBold="600" />
                                        <ClientName leftText="00,00" />
                                        <ClientName leftText="00, CA 00" />
                                        <ClientName leftText="(00) --" />
                                        <ClientName leftText="(00) -" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="00" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 12th component */}
            <div>
                <ClientDocument flag={true} />
                <InsuranceTableHeader name="DOE JOHN" firmName="CRISTIANFIRM" web="" username="UsamaNawaz" fileNumber="" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="CristianFirm" fontBold="600" />
                                        <ClientName leftText="Long beach 1, Cal 1" />
                                        <ClientName leftText="Los Santos 1, NC 56561" />
                                        <ClientName leftText="(045) 454-5451" />
                                        <ClientName leftText="(100) 00-" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="Cris@gmail.com" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>

                                        <ClientName leftText="counsel type" rightText="type 1" />
                                        <ClientName leftText="file #" rightText="" />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="John Doe" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City, TX Zip" />
                                        <ClientName leftText="(124) -564-566" />
                                        <ClientName leftText="(456) 456-" fax={true} />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="00" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 13th component */}
            <div>
                <ClientDocument flag={true} />
                <InsuranceTableHeader name="" firmName="" web="" username="UsamaNawaz" fileNumber="00001" checklist="Insurance checklist"  />
                <div className="row mb-4 ml-2 m-t-1">
                    <div className="col-md-5">
                        <div className="row">
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                        <ClientName leftText="Opposing Counsel Name" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City CA Zip" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>
                                <div>
                                    <div onClick={handleCouncel}>

                                        <ClientName leftText="counsel type" rightText="type 2" />
                                        <ClientName leftText="file #" rightText="00001" />
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div>
                                    <div onClick={handleGlobal}>
                                    <ClientName leftText="Opposing Counsel Name" fontBold="600" />
                                        <ClientName leftText="Address" />
                                        <ClientName leftText="City CA Zip" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                        <ClientName leftText="(###) ###-####" textColor="text-primary-20" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-email-3d m-r-5" buttonText="" />
                                    </div>
                                    <div className="mt-1">
                                        <Button showButton={true} icon="ic ic-19 ic-generate-document m-r-5" buttonText="generate document" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <table className="table table-borderless table-striped table-earning table-y-down1">
                            <tbody className="tbody-panels">
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>
                                <tr className="">
                                    <td className="td-autosize serial-number"></td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div>
            <ClientDocument flag={true} />
            </div>
            
            <Modal show={adjustor} onHide={()=> setAdjustor(false)}>
                <AdjustorModal hideModal={()=> setAdjustor(false)} />
            </Modal>
            <Modal show={clientInfo}  onHide={()=> setClientInfo(false)}>
                <InsuranceInfoModal hideModal={()=> setClientInfo(false)} />
            </Modal>
            <Modal show={clientCompany} onHide={()=> setClientCompany(false)}>
                <InsuranceCompany hideModal={()=> setClientCompany(false)} />
            </Modal>
            <Modal show={clientGlobal} onHide={()=> setClientGlobal(false) }>
                <InsuranceGlobal hideModal={()=>setClientGlobal(false)} />
            </Modal>
            <Modal show={clientCouncel} onHide={()=>setClientCouncel(false)}>
                <CounselModal hideModal={()=> setClientCouncel(false)} />
            </Modal>
        </>
    )
}
export default ClientInsurance;