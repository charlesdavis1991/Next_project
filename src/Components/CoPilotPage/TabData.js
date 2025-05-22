import React, { useEffect, useState, useMemo } from "react";
import { mediaRoute } from "../../Utils/helper";

import TableLoader from "../Loaders/tableLoader";



const TabData = ({ data, loading }) => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

    // Function to save sorting preferences to localStorage
    const saveSortingPreferences = (field, order) => {
      localStorage.setItem('sortField', field);
      localStorage.setItem('sortOrder', order);
    };
  
  // Function to retrieve sorting preferences from localStorage
  const loadSortingPreferences = () => {
    const savedSortField = localStorage.getItem('sortField');
    const savedSortOrder = localStorage.getItem('sortOrder');
    if (savedSortField && savedSortOrder) {
      setSortField(savedSortField);
      setSortOrder(savedSortOrder);
    }
  };

  const sortData = (data, sortField, sortOrder) => {
    // Check if data is an array and not empty
    if (!Array.isArray(data) || data.length === 0) {
      return data; // Return the original data if it's empty or not an array
    }
  
    return [...data].sort((a, b) => {
      const aField = a[sortField];
      const bField = b[sortField];
  
      // Handle cases where aField or bField might be undefined
      if (aField === undefined) return 1; // Treat undefined as greater
      if (bField === undefined) return -1; // Treat undefined as lesser
  
      // Compare values based on sort order
      if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };
  



  // Load sorting preferences on component mount
  useEffect(() => {
    loadSortingPreferences();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    saveSortingPreferences(field, order); // Save to localStorage
  };
 
  const sortedData = sortField ? sortData(data.data, sortField, sortOrder) : data.data;

  return (
    <>
    {!sortedData?(<TableLoader/>):(<div className="table-responsive table--no-card rounded-0 border-0">
      <table className="table table-borderless table-striped table-earning has-height-25 generate-doc-table">
        <thead>
        <tr>
          <th scope="col" className="width-1"></th>
          <th onClick={() => handleSort('template_name')}>
            Template Name {sortField === 'template_name' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
          <th className="text-center" onClick={() => handleSort('pages')}>
            Pages {sortField === 'pages' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
          <th className="text-center" onClick={() => handleSort('created')}>
            Uploaded {sortField === 'created' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
          <th className="text-center">Copilot</th>
          <th className="text-center width-25" onClick={() => handleSort('firm')}>
            Firm {sortField === 'firm' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
          <th className="text-center width-25" onClick={() => handleSort('user_name')}>
            Uploaded User {sortField === 'user_name' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
          <th className="text-center width-25" onClick={() => handleSort('page_name')}>
            Page {sortField === 'page_name' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
          <th className="text-center width-25" onClick={() => handleSort('dropdown')}>
            Dropdown {sortField === 'dropdown' && (
              sortOrder === 'asc' ? '' : ''
            )}
          </th>
        </tr>

        </thead>
        <tbody id="table-body-cat" className="generate-doc-body">
          {sortedData?.map((obj, index) => (
            <tr key={obj.doc_id}>
              <td>{index + 1}</td>
              <td className="text-nowrap">{obj.template_name}</td>
              <td className="text-center">{obj.pages}</td>
              <td className="text-center">{obj.created}</td>
              <td className="text-center">
                {obj.copilot_logo ? (
                  <img className="copilot-logo-generate-document" src={obj.copilot_logo} alt="" />
                ) : (
                  <img className="copilot-logo-generate-document" src="https://simplefirm-bucket.s3.amazonaws.com/static/images/shutterstock_583717939_c7Rm30h.jpg" alt="" />
                )}
              </td>
              <td className="text-center">
                <a href="#" className="has-light-btn">
                  <span className="ml-1 text-black">{obj.firm}</span>
                </a>
              </td>
              <td className="text-center">
                <a href="#" className="has-light-btn">
                  <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img">
                    {obj.profile_pic && <img src={obj.profile_pic} alt="" />}
                  </span>
                  <span className="ml-1 text-black">{obj.user_name}</span>
                </a>
              </td>
              <td className="text-center">
                <a href="#" className="has-light-btn">
                  {obj.page_icon && <span className="ic ic-19"><img src={mediaRoute(obj.page_icon)} alt="" /></span> }
                  <span className="ml-1 text-black">{obj.page_name}</span>
                </a>
              </td>
              <td className="text-center">{obj.dropdown_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)}
    </>
  );
};

export default TabData;
