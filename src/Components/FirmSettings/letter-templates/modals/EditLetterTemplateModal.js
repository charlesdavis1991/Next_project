import React, { useEffect, useState, useMemo } from "react";
import ModalComponent from "../../common/ModalComponent";
import NavFirmSettingsTab from "../../common/nav-firm-settings-tab";
import RenameDeleteTemplateModalBody from "./tab/rename-delete-template";
import CopyTemplateModalBody from "./tab/copy-template";
import {
  useCopyLetterTemplate,
  useDeleteLetterTemplate,
  useEditLetterTemplate,
} from "../hooks/useGetLetterTemplates";
import useGetUploadLetterTemplate from "../hooks/useUploadLetterTemplate";
import States from "./tab/states";
import CaseTypes from "./tab/case-types"
import PagesTab from "./tab/PagesTab";
import FileUpload from "../../../CoPilotPage/FileUpload";
import { Form, Row, Col, } from "react-bootstrap";

const EditCopyLetterTemplateModal = ({
  show,
  handleClose,
  size,
  title,
  refetch,
  data,
}) => {

  const [selectedCaseTypes, setSelectedCaseTypes] = useState([]); // State to hold selected checkboxes
  const [selectedStates, setSelectedStates] = useState([]); // State to hold selected checkboxes

  const [jurisdiction, setJurisdiction] = useState(""); // Default to 'Both'
  const [caseCategoryId, setCaseCategoryId] = useState(""); // Default to 'Both'

  const [pageId, setPageId] = useState();
  const [dropdownId, setDropdownId] = useState(""); // State to hold case types

  const [pageCopyId, setPageCopyId] = useState();
  const [dropdownCopyId, setDropdownCopyId] = useState("");


  const [selectedFile, setSelectedFile] = useState(null);

   // Handle case type checkbox selection
   const handleCaseTypeSelect = (caseTypeId) => {
    setSelectedCaseTypes((prevSelectedCt) =>
      prevSelectedCt.includes(caseTypeId)
        ? prevSelectedCt.filter((id) => id !== caseTypeId) // Deselect if already selected
        : [...prevSelectedCt, caseTypeId] // Add if not selected
    );
  };

  const handleStateSelect = (StateId) => {
    setSelectedStates((prevSelectedSt) =>
      prevSelectedSt.includes(StateId)
        ? prevSelectedSt.filter((id) => id !== StateId) // Deselect if already selected
        : [...prevSelectedSt, StateId] // Add if not selected
    );
  };


  const [activeTab, setActiveTab] = useState("rename_delete_template");
  const sidebarItems = [
    { id: "rename_delete_template", name: "Rename / Delete Template" },
    { id: "case_types", name: "Case Types" },
    { id: "states", name: "States" },
    { id: "pages", name: "Pages" },
    { id: "docUpload", name: "Upload Document" },
    { id: "copy_template", name: "Copy To New Document Generation Button" },


  ];
  const { editLetterTemplate } = useEditLetterTemplate();
  const { deleteTemplate } = useDeleteLetterTemplate();
  const [templateName, setTemplateName] = useState("");
  const [docName, setDocName] = useState("");

  const handleTabChange = (id) => {
    setActiveTab(id);
  };
  const { data: getUploadLetterTemplates } = useGetUploadLetterTemplate();
  const { copyTemplate } = useCopyLetterTemplate();




  useEffect(() => {
    if (data) {
      setTemplateName(data?.for_template?.template_name);
      setDocName(data?.for_template?.template?.file_name);
      setSelectedCaseTypes(data?.for_case_types);
      setSelectedStates(data?.for_states);
      setJurisdiction(data?.jurisdiction_type?.name);
      setCaseCategoryId(data?.case_category?.id);
      setPageId(data?.for_page?.id);
      setDropdownId(data?.for_dropdown?.id);
      setPageCopyId(data?.for_page?.id);
      setDropdownCopyId(data?.for_dropdown?.id);
    }
  }, [data]);

  const handleSave = async (tab) => {
    if (tab === "copy_template") {
      console.log("Copy Save ");
      const payload = {
        template_id: data?.id,
        temp_name: templateName,
        dropdown: dropdownCopyId,
        page: pageCopyId,
      };
      await copyTemplate(payload);
      refetch();
      handleClose();
    } else {

      const formData = new FormData();
      formData.append("template_id", data?.id);
      formData.append("temp_name", templateName);
      formData.append("file_name", docName);

      formData.append("j_type", jurisdiction);
      formData.append("page_id", pageId);
      formData.append("dropdown_id", dropdownId);    
      formData.append("file", selectedFile);
      formData.append("case_types", JSON.stringify(selectedCaseTypes));
      formData.append("states", JSON.stringify(selectedStates));

      
      await editLetterTemplate(formData);
      refetch();
      handleClose();
    }
  };

  const handleDelete = async () => {
    await deleteTemplate(data?.id);
    handleClose();
    refetch();
  };

  const editButtonData = [
    { text: "Cancel", variant: "secondary", onClick: handleClose },
    { text: "Delete", variant: "danger", onClick: handleDelete },
    { text: "Save", variant: "success", onClick: () => handleSave(activeTab)},
  ];

  const copyButton = [
    { text: "Cancel", variant: "secondary", onClick: handleClose },
    { text: "Save", variant: "success", onClick: () => handleSave(activeTab) },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "rename_delete_template":
        return (
          <RenameDeleteTemplateModalBody
            data={data}

            templateName={templateName}
            setTemplateName={(e) => setTemplateName(e.target.value)}
            docName={docName}
            setDocName={(e) => setDocName(e.target.value)}
          />
        );
      case "copy_template":
        return (
          <CopyTemplateModalBody
            data={data}
            templateName={templateName}
            setTemplateName={(e) => setTemplateName(e.target.value)}
            selectedCaseTypes={selectedCaseTypes} 
            pageId={pageCopyId} 
            setPageId={setPageCopyId} 
            setDropdownId={setDropdownCopyId} 
            dropdownId={dropdownCopyId}
          />
        );
      case "states":
        return (
          <States selectedStates={selectedStates} handleStateSelect={handleStateSelect} jurisdiction={jurisdiction} setJurisdiction={setJurisdiction}/>
        )
      case "case_types":
        return(
          <CaseTypes selectedCaseTypes={selectedCaseTypes} handleCaseTypeSelect={handleCaseTypeSelect} caseCategoryId={caseCategoryId} setCaseCategoryId={setCaseCategoryId} setSelectedCaseTypes={setSelectedCaseTypes}/>
        )
      case "pages":
        return(
          <PagesTab selectedCaseTypes={selectedCaseTypes} pageId={pageId} setPageId={setPageId} setDropdownId={setDropdownId} dropdownId={dropdownId}/>
        )
      case "docUpload":
        return (
          <>
      
        <FileUpload setSelectedFile={setSelectedFile}/>

          </>)
    }
  };
  return (
    <ModalComponent
      show={show}
      handleClose={handleClose}
      size={size}
      title={title}
      buttonData={
        activeTab === "copy_template" ? copyButton : editButtonData
      }
    >
      <NavFirmSettingsTab
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />
      <div className="tab-content mt-3 edit-template-tab-firmsetting">{renderActiveTabContent()}</div>
    </ModalComponent>
  );
};

export default EditCopyLetterTemplateModal;
