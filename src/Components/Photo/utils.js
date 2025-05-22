import api from "../../api/api";

export async function photoData(page_id, page_name, case_id,load_5) {
  console.log("case_id", case_id);
  if(load_5){
    try {
      const res = await api.get("/api/list_page_photos/", {
        params: {
          page_id: page_id,
          case_id: case_id,
          all_docs: page_id === "" ? "True" : "False",
          load_5:true
        },
      });
      return res.data.data;
    } catch (error) {
      console.error(error);
    }
  }
  else{
    try {
      const res = await api.get("/api/list_page_photos/", {
        params: {
          page_id: page_id,
          case_id: case_id,
          all_docs: page_id === "" ? "True" : "False",
        
        },
      });
      return res.data.data;
    } catch (error) {
      console.error(error);
    }
  }
  
 
}
