import { getToken } from '../../../Utils/helper';
import axios from 'axios';

const offerTypesApi = async () => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/settlement-page/offer-types/`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
}

export default offerTypesApi