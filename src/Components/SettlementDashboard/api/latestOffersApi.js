import axios from "axios";
import { getToken,getCaseId,getClientId } from "../../../Utils/helper";
const latestOffersApi = async() => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const { data } = await axios.get(`${origin}/api/settlement-page/latest-offers/?case_id=${getCaseId()}&client_id=${getClientId()}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken,
        },
    });
    return data;
}

export default latestOffersApi