import React from 'react';

const CourtHistoryEmptyTable = ({ arrayLength,isAbove1100 }) => {
    const arr = [...Array(arrayLength).keys()].map(i => i + 1);

    return (
        <>
            {isAbove1100 && arr.map(element => (
                <tr key={`lg-${element}`} className='lg-screen-row'>
                    <td className="text-dark-grey text-center"></td>
                    <td className='td-autosize'>
                        <p className="d-flex text-darker whitespace-nowrap mb-0 height-21">
                            <span className='ic-24'></span>
                            <span className="ml-2 d-inline-block text-dark-grey mr-1 height-21"></span>
                        </p>
                        <div className="d-flex align-items-center height-21"></div>
                    </td>

                    <td>
                        <div className='d-flex justify-content-center'>
                            <div className="d-flex flex-column align-items-start">
                                {Array(4).fill().map((_, i) => <span key={i} className='height-21'></span>)}
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className='d-flex justify-content-center'>
                            <div className="d-flex flex-column align-items-start">
                                {Array(5).fill().map((_, i) => <span key={i} className='height-21'></span>)}
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-start">
                                {Array(5).fill().map((_, i) => <span key={i} className='height-21'></span>)}
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-start">
                                {Array(5).fill().map((_, i) => <span key={i} className='height-21'></span>)}
                            </div>
                        </div>
                    </td>
                </tr>
            ))}

            {!isAbove1100 && arr.map(element => (
                <tr key={`sm-${element}`} className='sm-screen-row'>
                    <td className="text-dark-grey text-center td-autosize"></td>
                    <td className='td-autosize'>
                        <p className="d-flex text-darker whitespace-nowrap mb-0 height-21">
                            <span className='ic-24'></span>
                            <span className="ml-2 d-inline-block text-dark-grey mr-1 height-21"></span>
                        </p>
                        <div className="d-flex align-items-center height-21"></div>
                    </td>

                    <td>
                        <div className='d-flex flex-column align-items-center'>
                            <div className="d-flex flex-column align-items-start">
                                {Array(9).fill().map((_, i) => <span key={i} className='height-21'></span>)}
                            </div>
                        </div>
                    </td>

                    <td>
                        <div className="d-flex flex-column align-items-center">
                            <div className="d-flex flex-column align-items-start">
                                {Array(10).fill().map((_, i) => <span key={i} className='height-21'></span>)}
                            </div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default CourtHistoryEmptyTable;
