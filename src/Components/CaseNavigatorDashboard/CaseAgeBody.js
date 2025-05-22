import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from "axios";
import { CaseNavigatorModalContext } from './CaseNavigatorModalContext';
import { setEqualColumnWidths} from './../../Utils/helper.js';

export default function CaseAgeBody({activeStage, activeStatus}) {  
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem('token');
  
  const [CaseAgeData, setCaseAgeData] = useState([]);
  
  // API call for CASE AGE DATA
  const fetchCaseAgeData = async () => {
    const caseage_data = await axios.post(origin + '/api/navigator/navigator_case_age_data/',
      {'status_name': activeStatus, 'stage_name': activeStage},
      {
      headers: {
        Authorization: token,
      },
    });
    setCaseAgeData(caseage_data.data.caseage_data);
    console.log('CASE AGE DATA', caseage_data.data.caseage_data);
  }

  useEffect(() => {
    fetchCaseAgeData();
  }, [activeStage, activeStatus]);

  const { handleShowModal } = useContext(CaseNavigatorModalContext);


  const getSpanText = (spanClass) => {
    switch (spanClass) {
      case 'span_1_D': return 'between 0 Day and 1 Day';
      case 'span_2_D': return 'between 1 Day and 2 Day';
      case 'span_3_D': return 'between 2 Day and 3 Day';
      case 'span_1_Wk': return 'between 3 Day and 1 Week';
      case 'span_2_Wks': return 'between 1 Week and 2 Weeks';
      case 'span_1_Mo': return 'between 2 Week and 1 Month';
      case 'span_2_Mos': return 'between 1 Month and 2 Months';
      case 'span_3_Mos': return 'between 2 Months and 3 Months';
      case 'span_6_Mos': return 'between 3 Months and 6 Months';
      case 'span_1_Yr': return 'between 6 Months and 1 Year';
      case 'span_2_Yrs': return 'between 1 Year and 2 Years';
      case 'span_3_Yrs': return 'between 2 Years and 3 Years';
      case 'span_5_Yrs': return 'between 3 Years and 5 Years';
      case 'span_greater_5_Yrs': return 'more than 5 Years';
      default: return '';
    }
  };
  const openModal = (caseType, tabValue, caseTypeId) => () => {
    console.log('OPEN MODAL')
    const span = getSpanText(tabValue);
    const typeText = caseType === '' ? 'All Case Types' : caseType;
    const stageText = activeStage === 'all_stage' ? 'All Stages' : activeStage;
    const statusText = activeStatus === 'all_status' ? 'All Statuses' : activeStatus;
  
    const headerString = `${typeText} Cases sorted by ${stageText}, ${statusText} with Case Age ${span}`;
    
    handleShowModal({
      caseType: caseType,
      Status: activeStatus,
      Stage: activeStage,
      tabName: 'Case Age',
      tabValue: tabValue,
      headerString:headerString,
      caseTypeId:caseTypeId
    });
  };

  const [numRows, setNumRows] = useState(0);
  const [numColumns, setNumColumns] = useState(0);
  const tableRef = useRef(null);

  // Setting equal Width of each column
  useEffect(() => {    
    setEqualColumnWidths(tableRef);
    window.addEventListener('resize', () =>setEqualColumnWidths(tableRef));
    return () => {
      window.removeEventListener('resize', () => setEqualColumnWidths(tableRef));
    };
  }, [activeStage, activeStatus,CaseAgeData]);

  useEffect(() => {
    const calculateRows = () => {
      if (!tableRef.current) return;
  
      const rowHeight = 25; // Height of each row in pixels
      const pageHeight = window.innerHeight;
      const tableTop = tableRef.current.getBoundingClientRect().top;
  
      // Get the height of existing rows
      const existingRows = tableRef.current.rows.length;
      const existingRowsWithData = Array.from(tableRef.current.rows).filter(row => {
        return Array.from(row.cells).some(cell => cell.textContent.trim() !== "");
      }).length;
      const existingRowsHeight = existingRowsWithData * rowHeight;
  
      // Calculate the remaining height excluding the existing rows
      const remainingHeight = pageHeight - tableTop - existingRowsHeight - 10; // Subtracting a small buffer
  
      // Calculate number of rows needed based on the remaining height
      const rows = Math.floor(remainingHeight / rowHeight);
      // Set the number of rows needed to fill the remaining space
      setNumRows(rows > 0 ? rows : 0);
    };
  
    const extractColumns = () => {
      if (tableRef.current && tableRef.current.rows.length > 0) {
        const columns = tableRef.current.rows[0].cells.length;
        setNumColumns(columns);
      }
    };
  
    // Initial calculations
    calculateRows();
    extractColumns();
  
    // Resize event listener
    const handleResize = () => {
      calculateRows();
      extractColumns();
    };
  
    window.addEventListener('resize', handleResize);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeStage, activeStatus, CaseAgeData]);
  

  return (
    <div>
      <table className="table res_tab table-responsive ml-0 equal-column-width-table navigator-standard-table-header" ref={tableRef}>													
        <tbody className="case-counter-table Index-width-webkit-fill-available-display-inline-table">
            <tr className="thead">
                <th>1 Day</th>
                <th>2 Days</th>
                <th>3 Days</th>
                <th>1 Wk</th>
                <th>2 Wks</th>
                <th>1 Mo</th>
                <th>2 Mos</th>
                <th>3 Mos</th>
                <th>6 Mos</th>
                <th>1 Yr</th>
                <th>2 Yrs</th>
                <th>3 Yrs</th>
                <th>5 Yrs</th>
                <th> &gt;5 Yrs</th>
            </tr>
            {CaseAgeData.filter(case_data => case_data.length > 0).map((case_data, index) => (
            <tr key={index} className='h-25px'>
              {case_data.map((individual_data, idx) => (
                  individual_data.count > 0 ? (
                    <td
                      key={'td-' + idx}
                      className='h-25px cursor-pointer text-center'
                      onClick={
                        openModal(
                          individual_data.case_type,
                          individual_data.class_name,
                          individual_data?.case_type_id || ''
                        )}
                    >
                      <p
                        className='font-weight-bold'
                      >
                        {individual_data.count}
                      </p>
                    </td>
                  ) : (
                    <td key={'td-' + idx} className='h-25px cursor-pointer text-center'>
                      <p
                        className='text-grey'
                      >
                        {individual_data.count}
                      </p>
                    </td>
                  )
              ))}
            </tr>
          ))}
          {Array.from({ length: numRows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: numColumns }).map((_, colIndex) => (
              <td key={colIndex} style={{height: '25px' }}></td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
