function getTimeFromDateTime(dateTimeString) {
    if (!dateTimeString || typeof dateTimeString !== 'string') {
        console.error("Invalid input: expected a non-null string");
        return null;
    }

    const separatorIndex = dateTimeString.indexOf('T');
    if (separatorIndex === -1) {
        console.error("Invalid format: expected 'T' separator in the string");
        return null; 
    }

    const [datePart, timePart] = dateTimeString.split('T');
    
    if (timePart) {
        const cleanTime = timePart.replace('Z', '');
        return cleanTime;
    } else {
        console.error("Invalid format: could not extract time");
        return null;
    }
}

export default getTimeFromDateTime;