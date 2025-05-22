import axios from 'axios';
import { getCaseId } from '../../../Utils/helper';
import { getClientId } from '../../../Utils/helper';
const callToBackend = async (providerId,bType,billType,amountVal) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
        console.log("PROVIDER ID: ",providerId)
        try {
        const response = await axios.post(`${origin}/api/settlement-page/update-settle-value/`, {
            client_id: parseInt(getClientId()),
            case_id: parseInt(getCaseId()),
            entity_id: parseInt(providerId),
            b_type: bType,
            bill_type: billType,
            amount: parseFloat(amountVal).toFixed(2)
        });
        if (response.data) {
            return response.data;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const updateLockSettleAmount = (providerId,bType,billType,amount) => {
    return callToBackend(providerId, bType, billType, amount);
}
export default updateLockSettleAmount