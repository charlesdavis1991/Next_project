import React from 'react';

const SettlementEmptyTable = ({ tableName,colSpan }) => {
    return (
        <>
        {(tableName === "insurance_liens" || tableName === "otder_liens" || tableName === "costs")  &&
        [1, 2].map((element) => (
            <React.Fragment key={element}>
            <tr className="height-25">
                <td className="height-25 text-capitalize text-right big-n-4 whitespace-SETTLE primary-clr-25" colSpan={colSpan}></td>
                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value td-autosize"></td>
                <td className="s-draft text-end monospace-font"></td>
                <td className="s-final text-end monospace-font"></td>
                <td className="s-verify"></td>
                <td className="td-autosize check-request-td text-center"></td>
            </tr>
            </React.Fragment>
        ))}
        {(tableName === "medical_bills" )  &&
        [1, 2].map((element) => (
            <React.Fragment key={element}>
            <tr className="height-25">
                <td className="height-25 text-capitalize text-right big-n-4 whitespace-SETTLE primary-clr-25" colSpan={colSpan}></td>
                <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value td-autosize"></td>
                <td className="s-draft text-end monospace-font"></td>
                <td className="s-final text-end monospace-font"></td>
                <td className="s-verify"></td>
                <td className="td-autosize check-request-td text-center"></td>
            </tr>
            </React.Fragment>
        ))}
        {tableName === "loans" &&
        [1, 2].map((element) => (
            <React.Fragment key={element}>
            <tr className="height-25">
                <td className=""></td>
                <td className="td-autosize"></td>
                <td className="td-autosize text-center"></td>
                <td className="td-autosize text-center"></td>
                <td className="td-autosize text-center"></td>
                <td className="td-autosize text-center"></td>
                <td className="td-autosize text-center"></td>
                <td className=""></td>
                <td className=""></td>
                <td className="s-draft text-right"></td>
                <td className="s-final"></td>
                <td className="s-verify"></td>
                <td className="td-autosize check-request-td"></td>
            </tr>
            </React.Fragment>
        ))}
        {tableName === "client_proceeds" &&
        [1, 2].map((element) => (
            <React.Fragment key={element}>
                <tr className="height-25">
                    <td className=""></td>
                    <td className='text-left'></td>
                    <td className=""></td>
                    <td className="td-autosize height-25 monospace-font text-right font-weight-bold dollar-amount-value td-autosize"></td>
                    <td className="s-draft text-right"></td>
                    <td className="s-final"></td>
                    <td className="s-verify"></td>
                    <td className="td-autosize check-request-td text-center"></td>
                </tr>
            </React.Fragment>
        ))}
        {tableName === "offers" &&
        [1, 2,3,4,5,6,7,8].map((element) => ( <tr key={element}>
            <td className="td-autosize height-33"></td>
            <td className="s-offer-date height-33"></td>
            <td className="td-autosize height-33"></td>
            <td className="td-autosize height-33"></td>
            <td className="td-autosize height-33"></td>
            <td className="td-autosize height-33"></td>
            <td className="td-autosize height-33"></td>
            <td className=" text-capitalize big-n-1 height-33"></td>
            <td className="s-offer-date height-33"></td>
            <td className="td-autosize text-right whitespace-SETTLE"></td>
            <td className="td-autosize text-right whitespace-SETTLE"></td>
            {/* <td className="td-autosize height-25 monospace-font text-right font-weight-bold"></td>
            <td className="s-draft text-right"></td>
            <td className="s-final"></td>
            <td className="s-verify"></td>
            <td className="td-autosize check-request-td"></td> */}
        </tr>))}
        {tableName === "recent_offers" &&
        [1, 2].map((element) => ( <tr key={element}>
            <td></td>
            <td className=' text-center'></td>
            <td className="td-autosize"></td>
            <td></td>
            <td colSpan={5}></td>
            <td className=""></td>
            <td className="text-end td-autosize"></td>
            <td className="text-end td-autosize"></td>
            <td className="s-draft text-end"></td>
            <td className="s-final text-end"></td>
            <td className="s-verify"></td>
            <td className='td-autosize check-request-td text-center'></td>
        </tr>))}
        {tableName === "fees" &&
        [1, 2,3,4,5,6,7,8].map((element) => (
            <React.Fragment key={element}>
            <tr style={{height:"25px"}}>
                <td class="td-autosize height-33"></td>
                <td class="s-offer-date height-33"></td>
                <td class="td-autosize height-33"></td>
                <td class="c-percentage height-33"></td>
                <td class="s-paid text-right"></td>
                <td class=""></td>
                <td class=""></td>
                <td class=""></td>
                <td class=""></td>
                <td class="text-capitalize big-n-2 height-33"></td>
                <td class="dollar-amount-value monospace-font td-autosize text-center font-weight-bold"></td>
                <td className="s-draft text-right"></td>
                <td className="s-final"></td>
                <td className="verify"></td>
                <td className="td-autosize check-request-td"></td>
            </tr>
            </React.Fragment>
        ))}
        {tableName === "offer_fees" &&
        [1, 2].map((element) => (
            <React.Fragment key={element}>
            <tr style={{height:"25px"}}>
                <td class="td-autosize height-33"></td>
                <td class="s-offer-date height-33"></td>
                <td class="td-autosize height-33"></td>
                <td class="c-percentage height-33"></td>
                <td class="dollar-amount-value monospace-font td-autosize text-end font-weight-bold"></td>
                <td class="s-paid text-right"></td>
                <td class=""></td>
                <td class=""></td>
                <td class=""></td>
                <td class=""></td>
                <td class="text-capitalize big-n-2 height-33"></td>
                <td class="dollar-amount-value monospace-font td-autosize text-center font-weight-bold"></td>
                <td className="s-draft text-right"></td>
                <td className="s-final"></td>
                <td className="verify"></td>
                <td className="td-autosize check-request-td"></td>
            </tr>
            </React.Fragment>
        ))}
        {tableName === "trust_ledger" &&
        [1, 2, 3 ,4, 5].map((element) => (
            <React.Fragment key={element}>
            <tr id="trust-ledger-row">
                <td class="td-autosize"></td>
                {/* <td className='td-autosize height-25 tl-account'></td> */}
                <td className='td-autosize height-25 tl-requested'></td>
                <td className='td-autosize height-25'></td>
                <td className='td-autosize height-25'></td>
                <td></td>
                <td className="td-autosize height-25 text-end"></td>
                <td className='td-autosize'></td>
                <td className='text-center td-autosize height-25 tl-amount-checknum'></td>
                <td className='text-center td-autosize height-25 tl-amount-checknum'></td>

                <td className='text-center td-autosize height-25 tl-amount-checknum'></td>
                <td className='text-center td-autosize height-25 tl-amount-checknum'></td>
                <td className='text-center td-autosize height-25 tl-amount-checknum'></td>
                <td className='text-center td-autosize height-25 tl-amount-checknum'></td>
            </tr>
            </React.Fragment>
        ))}
        </>
    );
};

export default SettlementEmptyTable;
