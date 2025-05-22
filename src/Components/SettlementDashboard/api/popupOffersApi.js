import axios from "axios";
import { getToken,getCaseId,getClientId } from "../../../Utils/helper";

const popupOffersApi = async() => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const res = await axios.get(`${origin}/api/settlement-page/offer-info/?case_id=${getCaseId()}&client_id=${getClientId()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return res.data;
}

export default popupOffersApi