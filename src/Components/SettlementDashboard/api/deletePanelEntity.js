import { getToken } from '../../../Utils/helper';
import axios from 'axios';

const deletePanelEntity = async ({ panel_name, record_id }) => {
    const accessToken = getToken();
    const origin = process.env.REACT_APP_BACKEND_URL;
    try {
        console.log("Updating the loan:", { panel_name, record_id });
        const response = await axios.delete(
            `${origin}/api/settlement-page/edit-medical-bill/?panel_name=${panel_name}&record_id=${record_id}`,
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
        console.error("Error deleting panel entity:", error);
        throw error; // Throw the error to handle it in the calling code.
    }
}

export default deletePanelEntity