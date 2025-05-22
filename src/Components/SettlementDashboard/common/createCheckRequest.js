import axios from 'axios';
import { getToken } from '../../../Utils/helper';


const createCheckRequest = async (payload) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL;
    try {
       
        const response = await axios.post(
            `${origin}/api/settlement-page/create-check-request/`,
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
        console.error("Error creating chech request:", error);
        throw error; 
    }
}

export default createCheckRequest