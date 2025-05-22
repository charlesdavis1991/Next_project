import axios from 'axios';
import { getToken } from '../../../Utils/helper';


const deleteEditLoanApi = async (id) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";

    const { data } = await axios.delete(
        `${origin}/api/caseloan-page/edit-case-loan/?loan_id=${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        }
    );

    return data;
}

export default deleteEditLoanApi