import { useEffect, useState, useCallback, useMemo } from 'react';
import panelGetApi from '../api/panelGetApi';


const useGetGroupedOffers = () => {

    const [groupedOffers, setGroupedOffers] = useState([]);

    // Fetch offers data with memoization
    const fetchOffers = useCallback(async () => {
        try {
            const res = await panelGetApi("grouped-offers");
            if (res) {
                setGroupedOffers(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Offers:", error);
        }
    }, []);

    // Fetch offers on component mount
    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    // Memoized function to update offers state
    const updateGroupedOffersState = useCallback(async () => {
        try {
            const res = await panelGetApi("grouped-offers");
            if (res) {
                setGroupedOffers(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch Offers:", error);
        }
    }, []);

    // Memoize return values to avoid unnecessary re-renders
    return useMemo(() => ({
        groupedOffers, setGroupedOffers,
        updateGroupedOffersState

    }), [
        groupedOffers, updateGroupedOffersState
    ]);
};

export default useGetGroupedOffers;
