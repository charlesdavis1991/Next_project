import { useState } from "react";
import api from "../../../../api/api";

const useUpdateFirmSetting = () => {
  const [error, setError] = useState(null);

  const updateFirmSetting = async (userId, updatedSettings) => {
    const { id, ...settingsWithoutId } = updatedSettings;

    try {
      const payload = {
        user_id: userId,
        ...settingsWithoutId,
      };

      const response = await api.post(
        "/api/firmsetting-page/update-user-permissions/",
        payload
      );

      return response.data;
    } catch (err) {
      setError(err.message || "Unknown error");
      console.error("API error caught in catch:", err);
      return null;
    }
  };

  return { updateFirmSetting, error };
};

export default useUpdateFirmSetting;
