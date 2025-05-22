import axios from 'axios';
import { getToken } from '../../../Utils/helper';
const addOffer = async (payload,url) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL;
    try {
        console.log("Updating the loan:", payload);
        const response = await axios.post(
            `${origin}/api/settlement-page/${url}/`,
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
        console.error("Error updating fee:", error);
        throw error; // Throw the error to handle it in the calling code.
    }
}

export default addOffer