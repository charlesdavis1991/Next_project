import axios from 'axios';
import { getCaseId } from '../../../Utils/helper';
import { getClientId } from '../../../Utils/helper';
const callToBackend = async (bType,billType,boolVal) => {
    const origin = process.env.REACT_APP_BACKEND_URL;
        try {
        const response = await axios.post(`${origin}/api/settlement-page/lock-all-settle-value/`, {
            client_id: parseInt(getClientId()),
            case_id: parseInt(getCaseId()),
            b_type: bType,
            bill_type: billType,
            checked:boolVal
        });
        if (response.data) {
            console.log('Update settle amount response: ', response.data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const AllLockSettle = (bType,billType,boolVal) => {
    callToBackend(bType, billType,boolVal);
}

export default AllLockSettle




