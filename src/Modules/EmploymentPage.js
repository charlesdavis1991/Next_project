import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../Components/Navbars/main";
import Sidebar from "../Components/Sidebars/main";
import EmploymentMain from "../Components/EmploymentPage/EmploymentMain";
import EmploymentActionBar from "../Components/EmploymentPage/EmploymentActionBar";
import NotesSectionDashboard from "../Components/NotesSectionDashboard/main";
import EditEmploymentModal from "../Components/EmploymentPage/components/EditEmploymentModal";
import ConfirmDeletePopup from "../Components/EmploymentPage/components/ConfirmDeletePopup";
import { getCaseId, getClientId } from "../Utils/helper";
import Footer from "../Components/common/footer";
import api from "../api/api";

function EmploymentPage() {
  const [employmentData, setEmploymentData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditSection, setCurrentEditSection] = useState(null);
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [states, setStates] = useState([]); // Add states
  const origin = process.env.REACT_APP_BACKEND_URL;
  const caseId = getCaseId();
  const clientId = getClientId();

  // Fetch employment data
  useEffect(() => {
    const fetchEmploymentData = async () => {
      try {
        const response = await axios.get(
          `${origin}/api/employment/list/${clientId}/${caseId}/`
        );
        if (response.data.success) {
          setEmploymentData(response.data.data);
          console.log(response.data.data, "eeeeeeeeeeeeeeeeeeeeeeemmmmmmmmm");
        } else {
          console.error(
            "Failed to fetch employment data:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching employment data:", error);
      }
    };

    fetchEmploymentData();
  }, [clientId, caseId]);

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get(`${origin}/api/all/states/`);
        setStates(response.data.data); // Set states from API
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  const handleEditModalShow = (employment, section) => {
    setSelectedEmployment(employment);
    setCurrentEditSection(section);
    setShowEditModal(true);
  };

  const handleEmploymentAddedOrEdited = () => {
    const fetchEmploymentData = async () => {
      try {
        const response = await axios.get(
          `${origin}/api/employment/list/${clientId}/${caseId}/`
        );
        if (response.data.success) {
          setEmploymentData(response.data.data);
        } else {
          console.error(
            "Failed to fetch employment data:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching employment data:", error);
      }
    };
    fetchEmploymentData();
  };

  return (
    <>
    <div className="page-wrapper">
      <Sidebar />
      <div className="page-container">
        <NavBar flaggedPageName={"Employment"} />
        <EmploymentActionBar
          handleEmploymentAddedOrEdited={handleEmploymentAddedOrEdited}
          states={states} // Pass states to ActionBar
        />
        <div className="experts-main-container invisible-scrollbar">
          <EmploymentMain
            employmentData={employmentData}
            onEdit={handleEditModalShow}
          />
          <NotesSectionDashboard />
        </div>
      </div>

      {showEditModal && (
        <EditEmploymentModal
          show={showEditModal}
          object={selectedEmployment}
          section={currentEditSection}
          handleClose={() => setShowEditModal(false)}
          onFetchEmployment={handleEmploymentAddedOrEdited}
          states={states}
        />
      )}
    </div>
    <Footer/>
    </>
  );
}

export default EmploymentPage;
