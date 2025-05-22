import React, { useEffect, useState } from "react";
import useGetDocumentVariablesTest, {
  useGetDocumentVariables,
  useGetDocumentVariablesPages,
} from "../hooks/useDocumentVariable";
import { getCaseId, getClientId } from "../../../../Utils/helper";
import AddEditDocumentVariable from "../modals/addEditDocumentVariable";
import NavLetterTemplates from "../nav-tabs-dyamic";
import TableFirmSettings from "../../common/table-firm-settings";
import api from "../../../../api/api";

const DocumentVariables = () => {
  const [pageId, setPageId] = useState("all");
  const [editingVariable, setEditingVariable] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVariables, setFilteredVariables] = useState([]);
  const { data, loading, error, refetch } = useGetDocumentVariablesTest();
  const { data: getVariablesPages } = useGetDocumentVariablesPages();
  const {
    data: getDocumentVariables,
    loading: variablesLoading,
    error: variablesError,
    refetch: documentVariablesRefetch,
  } = useGetDocumentVariables({ page_id: pageId });

  const fetchVariableDetails = async (variableId) => {
    console.log(variableId);
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-document-variable/`,
        {
          params: { variable_id: variableId },
        }
      );
      setEditingVariable(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching variable details:", error);
    }
  };
  const isProduction = process.env.NODE_ENV === "production";
  const replaceBaseUrl = (url) => {
    const newBaseUrl = isProduction
      ? `https://react-dev.simplefirm.com/bp-wordprocessor/${getClientId()}/${getCaseId()}`
      : `http://localhost:3000/bp-wordprocessor/${getClientId()}/${getCaseId()}`;

    const urlObj = new URL(url);
    const docId = urlObj.searchParams.get("docId");

    const finalUrl = `${newBaseUrl}?docId=${docId}`;
    return finalUrl;
  };

  const handleTabChange = (id) => {
    console.log("id ==>", id);
    setPageId(id);
    documentVariablesRefetch(id);
  };

  const handleSearch = () => {
    if (getDocumentVariables) {
      const filtered = getDocumentVariables.filter(
        (variable) =>
          variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          variable.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          variable.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVariables(filtered);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredVariables(getDocumentVariables || []);
    }
  }, [getDocumentVariables, searchTerm]);

  useEffect(() => {
    if (data && data.url) {
      const url = replaceBaseUrl(data.url);
      window.open(url, "_blank");
    }
  }, [data]);
  return (
    <>
      <div className="mb-5 d-flex justify-content-between">
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary float-right m-t-5 m-b-5"
        >
          Add Variable
        </button>
        <button
          onClick={() => refetch(pageId)}
          disabled={loading}
          className="btn btn-primary m-t-5 m-b-5 m-r-5"
        >
          Document Variables Test
        </button>
      </div>

      <NavLetterTemplates
        pages={getVariablesPages || []}
        activeTab={pageId}
        handleTabChange={handleTabChange}
      />
      <div className="mb-2 mt-2 d-flex align-items-center justify-content-end">
        <input
          type="text"
          className="form-control col-sm-2"
          placeholder="Search variables..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary ml-2 mr-2" onClick={handleSearch}>
          Search
        </button>
      </div>
      {variablesLoading ? (
        <p>Loading...</p>
      ) : getDocumentVariables && getDocumentVariables.length > 0 ? (
        <TableFirmSettings>
          <thead id="template-th" role="row">
            <tr>
              <th></th>
              <th style={{ fontWeight: "semibold" }}>Page</th>
              <th style={{ fontWeight: "semibold" }}>Name</th>
              <th style={{ fontWeight: "semibold" }}>Description</th>
              <th style={{ fontWeight: "semibold" }}>Field</th>
            </tr>
          </thead>
          <tbody id="variable-body">
            {filteredVariables &&
              filteredVariables.length > 0 &&
              filteredVariables.map((variables, idx) => (
                <tr
                  key={idx}
                  style={{ height: "35px" }}
                  onClick={() => fetchVariableDetails(variables?.id)}
                >
                  <td className="dt-type-numeric sorting_1">{idx + 1}</td>
                  <td id="variable_page_11">
                    <span className="d-flex align-items-center client-name-box account_text-ellipsis">
                      {variables?.for_page && (
                        <>
                          <span className="ic ic-20">
                            <img src={variables?.for_page?.page_icon} />
                          </span>
                          <span className="ml-2 text-black text-black-2 whitespace-nowrap account_text-ellipsis">
                            {variables?.for_page?.name}
                          </span>
                        </>
                      )}
                    </span>
                  </td>
                  <td id="variable_name_11">{variables?.name}</td>
                  <td id="variable_description_11">{variables?.description}</td>
                  <td>{variables?.value}</td>
                </tr>
              ))}
          </tbody>
        </TableFirmSettings>
      ) : (
        <p>No document variables found.</p>
      )}

      {showAddModal && (
        <AddEditDocumentVariable
          show={showAddModal}
          size={"lg"}
          handleClose={() => setShowAddModal(false)}
          title={"Add Variable"}
          pageId={pageId}
          setPageId={setPageId}
          pages={getVariablesPages}
          refetch={documentVariablesRefetch}
          isEdit={false}
        />
      )}

      {showEditModal && (
        <AddEditDocumentVariable
          show={showEditModal}
          size={"lg"}
          handleClose={() => setShowEditModal(false)}
          title={"Edit Variable"}
          pageId={pageId}
          setPageId={setPageId}
          pages={getVariablesPages}
          refetch={documentVariablesRefetch}
          editingVariable={editingVariable}
        />
      )}
    </>
  );
};

export default DocumentVariables;
