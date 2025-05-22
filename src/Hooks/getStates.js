// statesData.js
import React, { useEffect, useState} from 'react';
import axios from 'axios';


const useIsStates = () => {
    const [states, setStates] = useState([]);
    const origin = process.env.REACT_APP_BACKEND_URL; // Get the backend URL from environment variables
    const token = localStorage.getItem('token'); // Get the token from local storage

    // Fetch states
    const getStates = async () => {
        try {
            const response = await axios.get(`${origin}/api/states/`, {
                headers: { Authorization: token },
            });
            setStates(response.data);
        } catch (error) {
            console.error("Failed to fetch states data:", error);
        }
    };

    // Execute getStates when the hook is used
    useEffect(() => {
        getStates();
    }, []); // Empty dependency array means it runs once on mount

    return states;
};

export default useIsStates;
