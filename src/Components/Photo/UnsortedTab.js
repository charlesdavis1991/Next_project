import React, { useEffect } from "react";
import { mediaRoute } from "../../Utils/helper";
import { useDocumentModal } from "../PhotoDocumentModal/DocumentModalContext";
import { photoData } from "./utils";
import _ from 'lodash';

const UnsortedTab = ({
  unsortedPhotos,
  photoListData,
  setBulkSelectionMap,
  bulkSelectionMap,
  setPhotoListData,
  case_id
}) => {
  const handleCheckboxChange = (event, page_doc) => {
    const checked = event.target.checked;
    const element = document.getElementById(`customCheck${page_doc.id}`);
    if (element) {
        element.checked = checked;  // Directly manipulating DOM for instant feedback
    }
    setBulkSelectionMap(prevData => {
        const newData = { ...prevData };
        if (!checked) {
            delete newData[page_doc.id];
        } else {
            newData[page_doc.id] = page_doc;
        }
        return newData;
    });
};

  const { showDocumentModal } = useDocumentModal();
  const fetchPhotoListData = async () => {
    photoData("", "", case_id).then((data) => {
      if (data) {
        setPhotoListData(data);
      }
    });
  };
  const handleDocPreview = (doc) => {
    console.log("photo doc", doc);
    console.log("photo doc", mediaRoute(doc.image));
    showDocumentModal(doc.image, doc,photoListData, fetchPhotoListData,doc.case_thumbnail);

  };

  useEffect(() => {
    setBulkSelectionMap({});
  }, []);

  return (
    <>
      <div
        className="tab-pane fade gallery-container"
        id="unsorted"
        role="tabpanel"
        aria-labelledby="unsorted-tab"
      >
        {unsortedPhotos.map((photo_doc) => (
          <div
            className="photo-item gallery-box column has-alternative-child-bg overflow-hidden previewd-image"
            id="no-vertical-border"
            key={photo_doc.id}
            style={{ maxWidth: "315px"}}
          >
            <div className="gallery-content-wrap position-relative">
              <div className="gallery-media d-flex align-items-center justify-content-center overflow-hidden position-relative p-t-5 p-b-5">
                <img
                  src={mediaRoute(photo_doc?.image)}
                  alt="John Doe"
                  className="resized-photo"
                  onClick={() => handleDocPreview(photo_doc)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit:  "contain",
                    objectPosition: "center",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    paddingTop: "25px"
                  }}
                />
              </div>
              <div className="gallery-content d-flex align-items-center p-t-2 p-r-5 p-b-2 p-l-5">
                <p className="date m-r-5 m-l-5">{photo_doc.date_uploaded}</p>
                <div className="custom-control custom-checkbox position-absolute top-0 right-0 z-index-1">
                  <input
                    type="checkbox"
                    checked={!!bulkSelectionMap[photo_doc.id]}
                    onChange={(event) => handleCheckboxChange(event,photo_doc)}

                    // onClick={() => {
                    //   setBulkSelectionMap((prevData) => {
                    //     if (prevData[photo_doc.id]) {
                    //       delete prevData[photo_doc.id];
                    //     } else {
                    //       prevData[photo_doc.id] = photo_doc;
                    //     }
                    //     return prevData;
                    //   });
                    // }}
                    className="custom-control-input"
                    id={`customCheck${photo_doc.id}`}
                  />
                  <label
                    className="custom-control-label m-l-5 text-indent"
                    for={`customCheck${photo_doc.id}`}
                  >
                    Select
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UnsortedTab;
