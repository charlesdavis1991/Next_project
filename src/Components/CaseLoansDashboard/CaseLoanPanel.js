import React from 'react';
import PanelEntity from './PanelEntity';

const CaseLoanPanel = ({loansPanelsObj}) => {
    const { loans, updateCaseLoansPanels } = loansPanelsObj;
    return (
        <>
            {loans?.map(loan=>
                <>
                    <PanelEntity loan={loan} key={loan?.id} updateLoans={updateCaseLoansPanels} />
                </>
            )}
        </>
        

    )
}

export default CaseLoanPanel