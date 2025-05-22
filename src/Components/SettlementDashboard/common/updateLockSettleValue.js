import React from 'react'
import axios from 'axios';
import { getCaseId } from '../../../Utils/helper';
import { getClientId } from '../../../Utils/helper';

const callToBackend = async (providerId,bType,billType) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
    console.log("PROVIDER ID: ",providerId)
    try {
      const response = await axios.post(`${origin}/api/settlement-page/lock-settle-value/`, {
        client_id: parseInt(getClientId()),
        case_id: parseInt(getCaseId()),
        entity_id: parseInt(providerId),
        b_type: bType,
        bill_type: billType,
      });
      if (response.data) {
          console.log('Lock settle value response: ', response.data);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

const updateLockSettleValue = (providerId,bType,billType) => {
  callToBackend(providerId, bType, billType);
}
export default updateLockSettleValue