import axios from 'axios';
import { getToken } from '../../../Utils/helper';

const editLoanApi = async (payload) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

    const { data } = await axios.post(
        `${origin}/api/caseloan-page/edit-case-loan/`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        }
    );

    return data;
}

export default editLoanApi