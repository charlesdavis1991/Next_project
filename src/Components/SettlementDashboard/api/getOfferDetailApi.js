import { getToken } from '../../../Utils/helper';
import axios from 'axios';

const getOfferDetailApi = async(id) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    if(id){
        const { data } = await axios.get(`${origin}/api/settlement-page/edit-offer/?offer_id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        });
        return data;
    }
    return null;

}

export default getOfferDetailApi