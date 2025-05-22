import axios from 'axios';
import { getToken} from '../../../Utils/helper';

const callToBackend = async(payload) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL;
    try {
        console.log("accpeting the offer:", payload);
        const response = await axios.post(
            `${origin}/api/settlement-page/accept-offer/`,
            payload,
            {
                headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
                },
            }
            );
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error accpeting the offer:", error);
        throw error; // Throw the error to handle it in the calling code.
    }
}

const acceptOffer = (payload) => {
    callToBackend(payload);
}
export default acceptOffer