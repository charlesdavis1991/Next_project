import React from "react";
import { useSelector } from "react-redux";

export default function ImageGalleryModal() {
  const accidentDefendants = useSelector((state) => state.accident?.defendants);
  return (
    <div
      className="modal generic-popup fade bd-example-modal-lg zoom-in"
      id="images-gallery-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="images-gallery-modal"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered Add-Client-W500"
        role="document"
      >
        <div className="modal-content">
          <button
            type="button"
            // the button is in the center of the modal, I need to move it to the right
            className="close position-absolute right-0 top-0 z-index-1"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span >×</span>
          </button>

          <div className="modal-body pt-0 overflow-auto">
            {accidentDefendants?.map((defendant) => (
              <div key={defendant.id}>
                {defendant?.photos &&
                  defendant?.photos.map((photo) => (
                    <img
                      src={photo?.image}
                      alt="defendant"
                      className="img-fluid w-100 h-100 cursor-pointer"
                      key={photo.id}
                      role="button"
                      data-toggle="modal"
                      data-target="#images-gallery-modal"
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
