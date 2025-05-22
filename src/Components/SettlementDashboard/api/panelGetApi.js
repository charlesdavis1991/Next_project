import { getToken,getCaseId,getClientId } from '../../../Utils/helper';
import axios from 'axios';

const panelGetApi = async (baseStr) => {
    const accessToken = getToken();
    const caseId = getCaseId();
    const clientId = getClientId();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/settlement-page/${baseStr}/?case_id=${caseId}&client_id=${clientId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
};


export default panelGetApi