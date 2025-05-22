import { useEffect, useState, useCallback, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetCaseInsurances = () => {
    const [insurances, setInsurances] = useState([]);
    const fetchInsurances = useCallback(async () => {
        try {
            const res = await panelGetApi("insurances");

            if (res) {
                setInsurances(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Insurances:", error);
        }
    }, []);

    // Fetch Insurances on component mount
    useEffect(() => {
        fetchInsurances();
    }, [fetchInsurances]);

    // Memoize return values to prevent unnecessary re-renders
    return useMemo(() => ({
        insurances,setInsurances
    }), [
        insurances
    ]);
}

export default useGetCaseInsurances