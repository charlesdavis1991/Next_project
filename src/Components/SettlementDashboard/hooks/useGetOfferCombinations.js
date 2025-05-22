import { useState, useCallback, useEffect, useMemo } from "react";
import panelGetApi from "../api/panelGetApi";

const useGetOfferCombinations = () => {
    const [offerCombinations, setOfferCombinations] = useState({});

    // Memoized API call function
    const fetchCombinations = useCallback(async () => {
        try {
            const res = await panelGetApi("get-offer");
            console.log("Fetched Offer Combinations:", res);
            if (res) {
                setOfferCombinations(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Offer combinations:", error);
        }
    }, []);

    // Fetch combinations on mount
    useEffect(() => {
        fetchCombinations();
    }, [fetchCombinations]);

    // Memoize the return values
    return useMemo(() => ({
        offerCombinations,
        setOfferCombinations,
        refreshOfferCombinations: fetchCombinations, // Expose function for manual refresh
    }), [offerCombinations, fetchCombinations]);
};

export default useGetOfferCombinations;
