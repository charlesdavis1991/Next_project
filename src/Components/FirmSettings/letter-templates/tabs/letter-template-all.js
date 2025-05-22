import React, { useState,useEffect,useReducer } from "react";
import useGetLetterTemplates from "../hooks/useGetLetterTemplates";
import TableFirmSettings from "../../common/table-firm-settings";
import { formatDate, getLoggedInUserId, getCaseId, getClientId } from "../../../../Utils/helper";
import api from "../../../../api/api";
import EditCopyLetterTemplateModal from "../modals/EditLetterTemplateModal";
import fetchEditDocs from "../../../common/footer"
import { Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useFooter } from "../../../common/shared/FooterContext";
import avatar from "../../../../../public/bp_assets/img/avatar_new.svg"

const LetterTemplatesALL = () => {
  const { data: getLetterTemplates, refetch } = useGetLetterTemplates();
  const origin = process.env.REACT_APP_BACKEND_URL;

  const { footerState, setFooterState } = useFooter();
  const [ editExist, setEditExist ] = useState(null);


  const initialState = {

    show: false,
    status: "",
   
  };

  function reducer(state, action) {
    switch (action.type) {
  
      case "SHOW_MODAL":
        return { ...state, show: true, status: action.payload };
      case "HIDE_MODAL":
        return { ...state, show: false };
    
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);



  const createEditDoc = async (docId,url,name,dynamic_template_id) => {
    try { 
          const  currentUrl = window.location.href;

          const formData = new FormData();
            formData.append("doc_id", docId);
            formData.append("url", url);
            formData.append("name", name);
            formData.append("template_id", dynamic_template_id);


            const response = await api.post(`${origin}/api/create-edit-doc/`, formData);
            fetchEditDocs();
            if (response.success) {
                console.log(response);
            }

            // Proceed with additional logic if needed
        

        
    } catch (error) {
        console.error("An error occurred:", error);
    }
};


useEffect(() => {
  const hasMatchingUrl = footerState?.find(item => item.url.includes("LetterTemplate"));  
  setEditExist(hasMatchingUrl?.for_template)
}, [footerState,getLetterTemplates]);



  const userId = getLoggedInUserId();
  const handleEditButton = (docId, loggedInUserId, templateId,templateName, edit, edit_by,edit_by_profile_pic) => {
    const wp_url = "/bp-wordprocessor/" + getClientId() + "/" + getCaseId() + `/?docId=${docId}&dynamic_template_id=${templateId}&type=LetterTemplate`
    const matchedItem = footerState.some(
      item =>
        item.url === wp_url
    );
    if (matchedItem){
      window.location.href = wp_url;
      return;
    }

    
   
  
   

        if(edit){
          const edit_by_user = `
   
          <p>
          The template is being edited by 
          <span class="d-flex align-items-center justify-content-center">
              <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img m-r-5">
                  ${edit_by_profile_pic ? `<img src="${edit_by_profile_pic}" class="theme-ring">` : ""}
              </span>
              <span>${edit_by?.first_name} ${edit_by?.last_name}</span>
          </span>
          It will be available when that user has closed the template.
      </p>
      
        
            
      
       
        `;
          dispatch({
            type: "SHOW_MODAL",
            payload: edit_by_user,
        });
        }
        else{

          if(editExist){
            dispatch({
              type: "SHOW_MODAL",
              payload: `You currently have a template open for editing. Close that template before editing another.`,
          });
      
          } else{
          createEditDoc(docId,wp_url,templateName,templateId);
          window.location.href = wp_url;  // Change URL in the current tab
        }
        
    }
    
   

  };
  const [editData, setEditData] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditModalShow = async (templateId) => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-dl-template/`,
        {
          params: {
            template_id: templateId,
          },
        }
      );
      setEditData(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
      <TableFirmSettings>

        <thead>
          <tr>
            <th></th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Template Name
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>Page</th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Generate Document Popup
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>File Name</th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>
              Date Uploaded
            </th>
            <th style={{ fontSize: "14px", fontWeight: "bold" }}>Firm User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {getLetterTemplates &&
            getLetterTemplates?.map((letter, idx) => {
              return (
                <tr style={{ height: "37px" }}>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {letter?.for_template?.template_name}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    <span className="d-flex align-items-center">
                      <span className="ic ic-20">
                        <img
                          src={letter?.for_page?.page_icon}
                          alt={`${letter?.for_page?.page_icon} Icon`}
                        ></img>
                      </span>
                      <span
                        style={{ fontSize: "13px" }}
                        className="m-l-5 text-black text-black-2 whitespace-nowrap account_text-ellipsis"
                      >
                        {letter?.for_page?.name}
                      </span>
                    </span>
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {letter?.for_dropdown?.name}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {letter?.for_template?.template?.file_name}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    {formatDate(letter?.for_template?.template?.created)}
                  </td>
                  <td
                    style={{ fontSize: "13px" }}
                    onClick={() => handleEditModalShow(letter?.id)}
                  >
                    <span className="d-flex align-items-center">
                      {letter?.profile_pic ? (
                        <span
                          className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"
                          id={`letter-template-profile-${idx + 1}`}
                        >
                          <img id="output" src={letter?.profile_pic} />
                        </span>
                      ) : (
                        <span className="ic ic-29 ic-avatar"></span>
                      )}
                      <span
                        style={{ fontSize: "13px" }}
                        className="m-l-5 text-black text-black-2 whitespace-nowrap account_text-ellipsis"
                      >
                        {letter?.for_firm_user?.first_name}{" "}
                        {letter?.for_firm_user?.last_name}
                      </span>
                    </span>
                  </td>
                  <td>
                  <div class="d-flex justify-content-center space-x-5">
                    <Button
                      variant={
                        letter.edit_by ?
                        (letter.edit_by.id == userId ? "primary": "secondary"):(
                          editExist ? (editExist == letter.id ? "primary":"secondary"):("primary")
                        )

                      }
                      className="height-25 d-flex align-items-center justify-content-center"
                      onClick={() =>
                        handleEditButton(
                          letter?.for_template?.template?.id,
                          userId,
                          letter?.id,
                          letter?.for_template.template_name,
                          letter?.edit,
                          letter?.edit_by,
                          letter?.edit_by_profile_pic
                        )
                      }
        
                    >
                      <span>
                      Edit

                      </span>
                      <span>
                      <i className="ic ic-19 edit-template-icon ml-1"></i>


                      </span>
                    </Button>
                   </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableFirmSettings>
      {showEditModal && (
        <EditCopyLetterTemplateModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          size={"lg"}
          title={"Document Template Controls"}
          data={editData}
          refetch={refetch}
        />
      )}

      {
        <Modal
        show={state.show}        
        onHide={() => dispatch({ type: "HIDE_MODAL" })}
      >
        <Modal.Header closeButton>
          <Modal.Title dangerouslySetInnerHTML={{ __html: state.status }}  className="modal-title h4 justify-content-center text-center">
              
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer style={{ borderTop: 'none' }}>
          <Button
            variant="secondary"
            className="mx-auto"
            onClick={() => dispatch({ type: "HIDE_MODAL" })}
          >
            Dismiss
          </Button>
        </Modal.Footer>
      </Modal>
      
      }
    </>
  );
};

export default LetterTemplatesALL;
