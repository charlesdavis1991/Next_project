import { getCaseId, getClientId } from "../../Utils/helper";
import api, { api_without_cancellation } from "../api";

const fetchCaseSummary = (clientId, caseId, limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    api_without_cancellation
      .get(`/api/cases/${clientId}/${caseId}/summary/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occurred while fetching case summary data", err);
        reject(err);
      });
  });
};

async function updateCaseDates(data) {
  const res = await new Promise(async (resolve, reject) => {
    await api
      .put(
        `/api/cases/${getClientId()}/${getCaseId()}/summary/?tab=case_dates`,
        data
      )
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
  return res;
}

async function updateCaseType(data) {
  const res = await new Promise(async (resolve, reject) => {
    await api
      .put(
        `/api/cases/${getClientId()}/${getCaseId()}/summary/?tab=case_type`,
        data
      )
      .then((response) => {
        // document.getElementById("edit-case-dates-modal").click();
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
  return res;
}

export { fetchCaseSummary, updateCaseDates, updateCaseType };
