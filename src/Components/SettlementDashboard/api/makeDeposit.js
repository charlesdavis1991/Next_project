import axios from 'axios';
import { getToken} from '../../../Utils/helper';

const callToBackend = async(payload) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL;
    try {
        console.log("making deposit:", payload);
        const response = await axios.post(
            `${origin}/api/settlement-page/make-deposit/`,
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
        console.error("Error making deposit:", error);
        throw error; // Throw the error to handle it in the calling code.
    }
}

const makeDeposit = (payload) => {
    callToBackend(payload);
}
export default makeDeposit