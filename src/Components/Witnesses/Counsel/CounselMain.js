import React, { useState } from "react";
import CounselTitleBar from "./CounselTitleBar";
import NotesPanel from "../../NotesPanelSection/NotesPanel";
import OpposingCounsel from "../../DefendantPage/Counsel/pannels/OpposingCounsel";
import OpposingAttorney from "../../DefendantPage/Counsel/pannels/OpposingAttorney";
import CounselInformation from "../../DefendantPage/Counsel/pannels/CounselInformation";
import CounselEditPopup from "../../DefendantPage/Counsel/popups/CounselEditPopup";
import ConfirmDeletePopup from "../../DefendantPage/DefandantMain/ConfirmDeletePopup";
import api from "../../../api/api";
import axios from "axios";
import TitleBarImg from "../../../../public/BP_resources/images/icon/litigation-icon-color.svg"
import PanelActionBarComponent from "../../common/PanelActionBarComponent";

function CounselMain({ object, handleFetchWitnesses, counselTypes }) {
  const [counselEditModal, setCounselEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("counsel");
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
  const origin = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handleDeleteShow = () => {
    setCounselEditModal(!counselEditModal);
    setIsShowConfirmDelete(!isShowConfirmDelete);
  };

  const handleCounselEditModal = (tab) => {
    setCounselEditModal(true);
    setActiveTab(tab);
  };

  //FIx

  const handleDeleteCounselSubmission = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${origin}/api/defendants/delete_opposing_counsel/${object?.id}/`, {
        headers: {
          Authorization: token,
        },
      }
      );
      if (response.status === 204) {
        handleFetchWitnesses();
        setIsShowConfirmDelete(false);
        counselEditModal(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="report m-b-5">
        <PanelActionBarComponent
                  panelIconSrc={TitleBarImg}
                  instanceForName={"Counsel"}
                  page_name={"Client"}
                  id={object?.id}
                  forInstanceName={
                     `${object?.for_client?.first_name || ""} ${object?.for_client?.last_name || ""}`
                  }
                />
        <div className="flex-row d-flex"
          style={{ overflow: 'hidden' }}>
          <div className="row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels">

            <OpposingCounsel
              opposingcounselcontact={object?.opposingcounselcontact}
              handleCounselEditModal={handleCounselEditModal}
            />

            <OpposingAttorney
              opposingattorney={object?.opposingattorney}
              handleCounselEditModal={handleCounselEditModal}
            />

            <CounselInformation
              counselTypeName={object?.counsel_type?.name}
              opposingCounselFileNumber={object?.file_number}
              handleCounselEditModal={handleCounselEditModal}
            />

          </div>
          <NotesPanel record_id={object?.id} module={"Counsel"} pagePanels={3} />
        </div>
      </div>

      <CounselEditPopup
        show={counselEditModal}
        handleClose={() => setCounselEditModal(false)}
        activeTab={activeTab}
        opposingcounsel={object}
        counselTypes={counselTypes}
        handleFacthDefendants={handleFetchWitnesses}
        onShowDeleteConfirmPopup={handleDeleteShow}
      />
      {isShowConfirmDelete && (
        <ConfirmDeletePopup
          entity="Counsel"
          handleClose={handleDeleteShow}
          handleDeleteSubmission={handleDeleteCounselSubmission}
        />
      )}
    </>
  );
}

export default CounselMain;
