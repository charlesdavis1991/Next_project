import axios from 'axios';
import { getToken } from '../../../Utils/helper';

const generateCheckOffer = async(payload) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL;
    try {
        console.log("generating offer check:", payload);
        const response = await axios.post(
            `${origin}/api/settlement-page/generate-check-offer/`,
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
        console.error("Error generating offer check:", error);
        throw error; // Throw the error to handle it in the calling code.
    }
}

export default generateCheckOffer