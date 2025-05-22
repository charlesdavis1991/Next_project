
import { currencyFormat,inputCurrencyFormat } from '../../../Utils/helper';
import updateLockSettleAmount from './updateLockSettleAmount';
const updateRightColumnValue = (lockDraft,lockFinal,setLocks,className,id,lockValues,setLockValues,panelName,updatedColumn,amount) => {
    if((updatedColumn == "draft1" && !lockDraft) || (updatedColumn == "final" && lockDraft && !lockFinal)){
        updateLockSettleAmount(id, panelName, updatedColumn, parseFloat(amount || 0).toFixed(2));
        setLocks((prevStates) =>
            prevStates.map((row) =>
                row.id === id ? { ...row, [updatedColumn === "draft1" ? "isDraftAmount" : "isFinalAmount"]: amount } : row
            )
        );
        const input = document.querySelector(`.${className}-${id}`);
        let numericValue = amount
        ?.replace(/[^0-9.-]/g, '') 
        ?.replace(/(?!^)-/g, '');
        input.setAttribute('data-value',numericValue);
        input.placeholder = amount ? currencyFormat(amount) : "$ 0.00";
        input.value = amount ? currencyFormat(amount) : "$ 0.00";
        const loanInputs = [...document.querySelectorAll(`.${className}`)];
        const sum = loanInputs.reduce((acc, input) => {
            const val = input.getAttribute('data-value') || '0';
            const num = parseFloat(val);
    
            return !isNaN(num) ? acc + num : acc;
        }, 0);
        if(updatedColumn == "draft1"){
            
            setLockValues([sum, lockValues[1]]);
        }
        else{
            setLockValues([lockValues[0], sum]);
        }
    }
}

export default updateRightColumnValue