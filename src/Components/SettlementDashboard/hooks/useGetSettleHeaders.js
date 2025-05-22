import { useEffect, useState, useCallback, useMemo } from 'react';
import panelGetApi from '../api/panelGetApi';

const useGetSettleHeaders = () => {

    const [finals,setfinals] = useState({});

    // Fetch offers data with memoization
    const fetchOffers = useCallback(async () => {
        try {
            const res = await panelGetApi("header-data");
            if (res) {
                console.log("RES:",res);
                setfinals({...res.data});
            }
        } catch (error) {
            console.error("Failed to fetch finals:", error);
        }
    }, []);

    // Fetch offers on component mount
    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);


    // Memoize return values to avoid unnecessary re-renders
    return useMemo(() => ({
        finals
    }), [
        finals
    ]);
};

export default useGetSettleHeaders