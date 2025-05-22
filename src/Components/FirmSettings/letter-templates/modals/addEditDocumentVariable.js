import React, { useEffect, useState } from "react";
import ModalComponent from "../../common/ModalComponent";
import { useAddVariable, useEditVariable } from "../hooks/useDocumentVariable";

const AddEditDocumentVariable = ({
  show,
  handleClose,
  size,
  title,
  refetch,
  pageId,
  setPageId,
  pages,
  editingVariable,
  isEdit = true,
}) => {
  const [varibaleName, setVariableName] = useState();
  const [description, setDescription] = useState();
  const [value, setValue] = useState();
  const { addVariable } = useAddVariable();
  const { editVariable } = useEditVariable();

  useEffect(() => {
    if (editingVariable && isEdit) {
      setVariableName(editingVariable.name);
      setDescription(editingVariable.description);
      setValue(editingVariable.value);
      setPageId(editingVariable.for_page?.id);
    }
  }, [editingVariable, setPageId, isEdit]);

  // Handle save action
  const handleSave = () => {
    if (editingVariable) {
      editVariable({
        id: editingVariable.id,
        name: varibaleName,
        description,
        page: pageId,
      });
    } else {
      addVariable({
        page: pageId,
        name: varibaleName,
        description: description,
        value: value,
      });
    }
    refetch(pageId);
    handleClose();
  };

  const addButton = [
    { text: "Cancel", variant: "secondary", onClick: handleClose },
    {
      text: editingVariable ? "Update" : "Save",
      variant: "success",
      onClick: handleSave,
    },
  ];

  return (
    <ModalComponent
      show={show}
      handleClose={handleClose}
      size={size}
      title={title}
      buttonData={addButton}
    >
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Name :</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder={"Enter Variable Name"}
            name={"name"}
            className="form-control"
            value={varibaleName || ""}
            onChange={(e) => setVariableName(e.target.value)}
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Description :</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder={"Enter Description"}
            name={"description"}
            className="form-control"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Page :</span>
        </div>
        <div className="col-md-10">
          <select
            className="form-control"
            value={pageId || ""}
            onChange={(e) => setPageId(e.target.value)}
          >
            <option value="">Select a Page</option>
            {pages &&
              pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="row align-items-center form-group">
        <div className="col-md-2 text-left">
          <span className="d-inline-block text-grey">Value :</span>
        </div>
        <div className="col-md-10">
          <input
            type="text"
            placeholder={"Enter Value"}
            name={"value"}
            disabled={isEdit}
            className="form-control"
            value={value || ""}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </ModalComponent>
  );
};

export default AddEditDocumentVariable;
