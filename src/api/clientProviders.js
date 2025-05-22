import api from "./api";

const fetchClientProviders = (clientId, caseId, limit = 100, offset = 0) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/client-providers/${clientId}/${caseId}/`, {
        params: {
          limit,
          offset,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occurred while fetching client-providers", err);
        reject(err);
      });
  });
};

const fetchClientProvider = (id) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/client-providers/${id}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occurred while fetching client-provider", err);
        reject(err);
      });
  });
};

const fetchClientProviderVerifications = (record_id, table_name, fields) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/api/case-provider-verification/?fields=all`, {
        record_id,
        table_name,
        field_name: "billing_received",
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occurred while fetching client-providers", err);
        reject(err);
      });
  });
};

const fetchCasePageClientProviders = (clientId, caseId, limit = 100, offset = 0) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/api/casepage-client-providers/${clientId}/${caseId}/`, {
        params: {
          limit,
          offset,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occurred while fetching client-providers", err);
        reject(err);
      });
  });
};


export {
  fetchClientProviders,
  fetchClientProvider,
  fetchClientProviderVerifications,
  fetchCasePageClientProviders,
};
