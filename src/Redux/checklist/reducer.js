import {
    SET_LOADING,
    MODIFY_CHECKLIST_DATA,
    MODIFY_PREEXIST_CHECKLIST_DATA,
    SET_CHECKLIST_DATA,
    SET_FIRM_CASES,
    CHECKLIST_CASE_PERCENTAGE, 
    SET_CASES_BY_CASE_TYPE,
    SET_CASE_WORKER_TYPES,
    SET_CASE_ASSIGN_TASKS

      } from "./actions";
      
      const initialState = {
        loading: false,
        checkListData: [],
        firmCases : [],
        case_percentage : {},
        case_details : {},
        worker_types : [],
        assignTask : []
      };
      
    const checkListReducer = (state = initialState, action) => {
        switch (action.type) {
          case SET_LOADING:
            return { ...state, loading: action.payload };
      
          case SET_CHECKLIST_DATA:
            return { ...state, checkListData: action.payload };
    
          case SET_FIRM_CASES:
            return { ...state, firmCases: action.payload };

          case CHECKLIST_CASE_PERCENTAGE:
            const { caseType, pageName, data } = action.payload;
            return {
              ...state,
              case_percentage: {
                ...state.case_percentage,
                [caseType]: {
                  ...state.case_percentage[caseType],
                  [pageName]: {
                    data: data
                  }
                }
              }
            };

          case SET_CASES_BY_CASE_TYPE:
            // console.debug("SET_CASES_BY_CASE_TYPE : ", action)
            const { case_type, page_name, data_cases } = action.payload;
            return { 
              ...state,
              case_details: {
              ...state.case_details,  
              [case_type] : {
                ...state.case_details[case_type],  
                [page_name] : {
                  data : data_cases
                }
            } 
          }};

          case SET_CASE_WORKER_TYPES:
            return { ...state, worker_types: action.payload };

          case SET_CASE_ASSIGN_TASKS:
            return { ...state, assignTask: action.payload };
      
          case MODIFY_CHECKLIST_DATA:
            // const { redInjuries, selectedPart, image } = action.payload;
            // const isSelected =
            //   state?.injuriesData?.selected_body_parts?.includes(selectedPart);
            // let updatedSelectedBodyParts;
            // let updatedSpineUrl;
      
            // if (isSelected) {
            //   updatedSelectedBodyParts =
            //     state?.injuriesData?.selected_body_parts?.filter(
            //       (part) => part !== selectedPart
            //     );
            // } else {
            //   updatedSelectedBodyParts = [
            //     ...state?.injuriesData?.selected_body_parts,
            //     selectedPart,
            //   ];
            // }
      
            // if (selectedPart === "spine") {
            //   updatedSpineUrl = image;
            // } else {
            //   updatedSpineUrl = state?.injuriesData?.spine_url;
            // }
      
            // const updatedInjuriesData = {
            //   ...state.injuriesData,
            //   red_injuries: redInjuries,
            //   selected_body_parts: updatedSelectedBodyParts,
            //   spine_url: updatedSpineUrl,
            // };
      
            // return { ...state, injuriesData: updatedInjuriesData };
            return { ...state, checkListData: action.payload };
      
          case MODIFY_PREEXIST_CHECKLIST_DATA:
            // const { selectedPart: preexisPart } = action.payload;
            // const isPreExistingSelected =
            //   state?.injuriesData?.pre_existing_injuries?.includes(preexisPart);
            // let updatedPreExistingInjuries;
      
            // if (isPreExistingSelected) {
            //   updatedPreExistingInjuries =
            //     state?.injuriesData?.pre_existing_injuries?.filter(
            //       (part) => part !== preexisPart
            //     );
            // } else {
            //   updatedPreExistingInjuries = [
            //     ...state?.injuriesData?.pre_existing_injuries,
            //     preexisPart,
            //   ];
            // }
      
            // const updatedPreExistingInjuriesData = {
            //   ...state.injuriesData,
            //   pre_existing_injuries: updatedPreExistingInjuries,
            // };
      
            // return { ...state, injuriesData: updatedPreExistingInjuriesData };
            return { ...state, checkListData: action.payload };
      
          default:
            return state;
        }
      };
      
      export default checkListReducer;
      