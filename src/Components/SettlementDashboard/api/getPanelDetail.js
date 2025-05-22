import { getToken } from '../../../Utils/helper';
import axios from 'axios';

const getPanelDetail = async(panelName,panelAttrName,panelID) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/settlement-page/${panelName}/?${panelAttrName}=${panelID}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
}

export default getPanelDetail