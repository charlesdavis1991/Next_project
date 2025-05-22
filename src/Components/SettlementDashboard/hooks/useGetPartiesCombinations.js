import { useState, useCallback, useEffect, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetPartiesCombinations = () => {
    const [partiesCombinations, setPartiesCombinations] = useState({});

    // Memoized API call function
    const fetchPartiesCombinations = useCallback(async () => {
        try {
            const res = await panelGetApi("get-entity");
            console.log("Fetched Parties Combinations:", res);
            if (res) {
                setPartiesCombinations(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Parties combinations:", error);
        }
    }, []);

    // Fetch combinations on mount
    useEffect(() => {
        fetchPartiesCombinations();
    }, [fetchPartiesCombinations]);

    // Memoize the return values
    return useMemo(() => ({
        partiesCombinations,
        setPartiesCombinations,
        fetchPartiesCombinations, // Expose function for manual refresh
    }), [partiesCombinations, fetchPartiesCombinations]);
};

export default useGetPartiesCombinations;
