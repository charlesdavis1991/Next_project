export const  formatCaseProvider = (provider) => {
    const firstName = provider?.provider?.providerprofile?.first_name || '';
    const lastName = provider?.provider?.providerprofile?.last_name || '';
    const specialty = provider?.specialty?.name || '';
    const separator = firstName && lastName ? ' - ' : ' ';
  
    return {
      id: provider.id,
      name: `${specialty}${separator}${firstName} ${lastName}`.trim(),
      providerProfile: provider?.provider?.providerprofile || {},
      specialty: provider?.specialty || {},
    };
  }
  export const formatTreatmentEvent = (treatment,otherData,providerMapList) => {
    const clientDetails = providerMapList?.find((p) => p?.id == treatment?.id);
    
    return {
      id: treatment?.id+"Tr",
      title2: treatment?.description,
      title: `${treatment?.description || ''} ${otherData?.find((i) => i.id === treatment?.for_provider)?.specialty?.name || ''} appt: ${clientDetails?.first_name|| ''} ${clientDetails?.last_name || ''}, ${clientDetails?.case_summary || ""}`,
      eventType: "treatmentDates",
      caseType: clientDetails?.case_summary,
      provider: otherData?.find((i) => i.id === treatment?.for_provider),
      clientFirstName: clientDetails?.first_name,
      clientLastName: clientDetails?.last_name,
      start: safeToISOString(treatment?.date),
      allDay: true,
    }
  }
  export const formatLitigationActEvent = (act) => {
    return {
      id: act?.id+"L",
      title2: act?.event_type_id?.litigation_event_type || "",
      title: `${act?.event_type_id?.litigation_event_type || ""} ${act?.for_case?.for_client?.first_name || ""} ${act?.for_case?.for_client?.last_name || ""}, ${act?.for_case?.case_type?.name || ""}`,
      eventType: "litigationAct",
      caseType: act?.for_case?.case_type?.name,
      clientFirstName: act?.for_case?.for_client?.first_name,
      clientLastName: act?.for_case?.for_client?.last_name,
      start: safeToISOString(act?.date,true),
      allDay: true,
    }
  }
  export const formatTodoEvent = (todo) => {
    return {
      id: todo?.id+"Td",
      title2: todo?.todo_type?.tab_name || todo?.notes,
      title: `${todo?.todo_type?.name || todo?.notes || ""} ${todo.for_client?.first_name || ""} ${todo.for_client?.last_name || ""}, ${todo?.for_case?.case_type?.name || ""}`,
      eventType: "todo",
      clientFirstName: todo?.for_client?.first_name,
      clientLastName: todo?.for_client?.last_name,
      caseType: todo?.for_case?.case_type?.name,
      start: safeToISOString(todo?.due_date),
      allDay: true,
    }
  };

  export const safeToISOString = (date, make12 = false) => {
    try{

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return null;
      
      // Set time to 12:00 AM if make12 is true
      if (make12) {
        parsedDate.setHours(0, 0, 0, 0);
      }
      
      return parsedDate.toISOString();
    }catch(e){
      return ;
    }
  };
  