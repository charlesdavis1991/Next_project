import axios from 'axios';
import { getToken,getCaseId,getClientId } from '../../../Utils/helper';

const loanPanelsGetApi = async (baseStr) => {
    const accessToken = getToken();
    const caseId = getCaseId();
    const clientId = getClientId();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/caseloan-page/${baseStr}/?case_id=${caseId}&client_id=${clientId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
};


export default loanPanelsGetApi