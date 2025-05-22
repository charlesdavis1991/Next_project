import React, { useState } from "react";
import CommonHeader from "../common/common-header";
import useGetCards, {
  useChangeCardStatus,
  useDeleteCard,
  useGetAddCardsDetails,
} from "./hooks/useGetCardsTabAPI";
import TableFirmSettings from "../common/table-firm-settings";
import StatusToggle from "./StatusToggle";
import AddEditCardModal from "./modals/add-edit-card";
import api from "../../../api/api";
import ImagePreviewModal from "./modals/image-preview-modal";

const CardsTab = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState({
    show: false,
    url: "",
    alt: "",
  });

  const handleImageClick = (imageUrl, imageAlt) => {
    setPreviewImage({
      show: true,
      url: imageUrl,
      alt: imageAlt,
    });
  };

  const handleClosePreview = () => {
    setPreviewImage({
      show: false,
      url: "",
      alt: "",
    });
  };

  const { data: cardsData, refetch: fetchCardsDetails } = useGetCards();
  const { changeStatus } = useChangeCardStatus();
  const { deleteCard } = useDeleteCard();
  const { data: modaldata } = useGetAddCardsDetails();
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await changeStatus({
        card_id: id,
        is_active: newStatus,
      });
      await fetchCardsDetails();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowEditModal = async (cardId) => {
    try {
      const response = await api.get(`/api/firmsetting-page/edit-card/`, {
        params: { id: cardId },
      });
      setData(response.data);
      setEditId(cardId);
      setShowEditModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <h2 className="font-weight-bold">Cards Settings</h2>
      <div className="col-lg-12 m-t-5 m-b-5">
        <div style={{ textAlign: "end" }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Create Card
          </button>
        </div>
      </div>
      <TableFirmSettings>
        <thead>
          <tr id="tb-header">
            <th>Card Name</th>
            <th>Message</th>
            <th>HandWriting</th>
            <th>Template</th>
            <th className="td-autosize">Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cardsData?.map((item) => (
            <tr style={{ height: "35px" }} key={item.id}>
              <td className="color-grey td-autosize">{item.name}</td>
              <td className="td-autosize">{item.message}</td>
              <td className="td-autosize">
                <img
                  className="thumbnail"
                  alt={`Handwritiing-image-${item.id}`}
                  src={item.handwriting_image_src}
                  onClick={() =>
                    handleImageClick(
                      item.handwriting_image_src,
                      `Handwriting-image-${item.id}`
                    )
                  }
                />
              </td>
              <td className="td-autosize">
                <img
                  className="thumbnail"
                  alt={`template-image-${item.id}`}
                  src={item.template_image_src}
                  onClick={() =>
                    handleImageClick(
                      item.template_image_src,
                      `Handwriting-image-${item.id}`
                    )
                  }
                />
              </td>
              <td className="td-autosize" style={{ width: "auto" }}>
                <StatusToggle
                  initialActive={item.is_active}
                  onToggle={(newStatus) =>
                    handleStatusToggle(item.id, newStatus)
                  }
                />
              </td>
              <td className="td-autosize">
                <button
                  onClick={() => handleShowEditModal(item.id)}
                  className="btn btn-primary m-r-5"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await deleteCard(item.id);
                      await fetchCardsDetails();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </TableFirmSettings>

      <AddEditCardModal
        showModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        data={modaldata}
        refetch={fetchCardsDetails}
      />
      <AddEditCardModal
        showModal={showEditModal}
        handleClose={() => setShowEditModal(false)}
        data={modaldata}
        refetch={fetchCardsDetails}
        filledData={data}
        isEdit={true}
        editId={editId}
      />

      <ImagePreviewModal
        show={previewImage.show}
        handleClose={handleClosePreview}
        imageUrl={previewImage.url}
        imageAlt={previewImage.alt}
      />
    </div>
  );
};

export default CardsTab;
