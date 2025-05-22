export const findCasesForUserWithStatusTrue = (updateData, targetUserId) => {
    const resultCases = [];
  
    // Iterate through each case in updateData
    for (const caseId in updateData) {
      const caseData = updateData[caseId];
      
      // Iterate through each user in the current case
      for (const userKey in caseData) {
        const user = caseData[userKey];
        
        // Check if the user_id and status match the criteria
        if (user.user_id === targetUserId && user.status === true  ) {
            if(user?.[`firm_user${user?.index}`]){
                resultCases.push(caseId);  // Add caseId to the result
                break;  // No need to check more users in the same case
            }
        }
      }
    }
  
    return resultCases;
  };


  export const countCasesForUserId = (updateData, targetUserId) => {
    let count = 0;
  
    // Iterate through each case in updateData
    for (const caseId in updateData) {
      const caseData = updateData[caseId];
      
      // Iterate through each user in the current case
      for (const userKey in caseData) {
        const user = caseData[userKey];
        
        // Check if the user_id matches the targetUserId
        if (user.user_id === targetUserId) {
            if(user?.[`firm_user${user?.index}`]){
                count++;  // Increment the count
                break;    // No need to check more users in the same case
            }
          
        }
      }
    }
  
    return count;
  };


  export const changeDateFormate = (dob) => {
    var formattedDate = ""
    try {
        if (dob ){
            var date = new Date(dob);
            formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }
    } catch (error) {
        formattedDate =''
    }
    return formattedDate;
}




// Function to get unique objects
export const uniqueByObject = (data) => {
  const uniqueSet = new Set();
  const uniqueItems = [];
  if(data){
      data?.forEach(item => {
          // Parse JSON string to object
          const parsedItem = JSON.parse(item)[0];
          // Serialize object to JSON string
          const serializedItem = JSON.stringify(parsedItem);
      
          // Add to set if it's not already there
          if (!uniqueSet.has(serializedItem)) {
            uniqueSet.add(serializedItem);
            uniqueItems.push(parsedItem);
          }
      });
  }
  return uniqueItems;
};



export const parseJSON = (data) => {
  const results =  data?.map(typeData => JSON.parse(typeData))
  return results
}


export const findTrueStatusCases = (cases) => {
  let groupedCases = {};

  // Loop through all cases
  for (let caseId in cases) {
      let caseEntries = [];
      let shouldAddCase = true;

      for (let index in cases[caseId]) {
          let caseItem = cases[caseId][index];

          // Check if the status is true
          if (caseItem.status === true) {
              let matchingFirmUsers = [];

              // Check each "firm_user_" field
              for (let key in caseItem) {
                  if (key.startsWith("firm_user") && key === `firm_user${caseItem.index}` ) {
                      matchingFirmUsers.push(caseItem[key]);
                  }
              }
              if(matchingFirmUsers.length > 0)
              {
                  caseEntries.push({
                      // index: caseItem.index,
                      user_id: caseItem.user_id,
                      matchingFirmUsers: matchingFirmUsers
                  });
              }

              
          }
      }

      // Only add the case if it passed the null check
      if (shouldAddCase && caseEntries.length > 0) {
          groupedCases[caseId] = caseEntries;
      }
  }

  return groupedCases;
}

export const transformGroupedCases = (groupedCases, page) => {
  // Initialize the array for the transformed data
  let transformedData = [];

  // Loop through all cases
  for (let caseId in groupedCases) {
      // Loop through each entry within a case
      groupedCases[caseId].forEach(entry => {
          // Loop through matchingFirmUsers to get the user_id
          entry.matchingFirmUsers.forEach(userId => {
              // Only add entries where userId is valid
              if (userId !== null && userId !== undefined) {
                  transformedData.push({
                      user_id: userId,
                      case_id: caseId,
                      text: `Review this case and address the ${page} Page Checklist completion percentage.` // Static text or dynamic if needed
                  });
              }
          });
      });
  }
  // setUniqueCases(transformedData)
  return transformedData;
}


export const defaultImagePath = "https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg"


export const  isCaseAndUserSelected = (case_id, cases) => {
    try{
        const caseData = cases[case_id];
  
    // First check if the case itself is selected
    if (caseData && caseData.status === true) {
      // Now check if any user within the case is selected
      for (const key in caseData) {
        if (caseData.hasOwnProperty(key) && caseData[key].status === true) {
          return { caseSelected: true, userSelected: true }; // Case and user both selected
        }
      }
      return { caseSelected: true, userSelected: false }; // Case selected but no user selected
    }
  
    return { caseSelected: false, userSelected: false }; // Case not selected
    } catch(error){
        return { caseSelected: false, userSelected: false }; // Case not selected
    }
  }
  

  export const isAnyCaseAndUserSelected = (cases) => {
    // Iterate over all cases
    for (const caseId in cases) {
      if (cases.hasOwnProperty(caseId)) {
        const caseData = cases[caseId];
  
        // Check if the case itself is selected
        if (caseData.status === true) {
          // Check if any user within the case is selected
          for (const key in caseData) {
            if (caseData.hasOwnProperty(key) && typeof caseData[key] === 'object' && caseData[key].status === true) {
              return true;  // Found a selected case and a selected user
            }
          }
        }
      }
    }
  
    // Return false if no selected case and user is found
    return false;
  }