import React from "react";
import CarouselControls from "./carousel-controls";
import { Carousel } from "react-bootstrap";

const DocPanelItem = ({ docPanel }) => {
  // Don't render if images aren't available
  if (!docPanel?.images) {
    return null;
  }

  const carouselId = `carouselExampleControls-${docPanel?.document?.id || index}`;

  return (
    <div
      className=" inbox-doc-parent w-100 col-auto pl-0 pr-0"
      // style={{ maxWidth: "217px", flex: "0 0 217px" }}
    >
      <div className="single-document single-document-2 p-t-0 w-100">
        <div className="confirmation-modal" id="confirmationMessageModal">
          <div className="modal-dialog modal-dialog-centered inbox-confirmation-modal">
            <div className="modal-content inbox-confirmation-content">
              <div className="modal-body"></div>
            </div>
          </div>
        </div>
        <div className="row m-0 display-flex-inbox inbox-doc-panel">
          <div
            className=" p-0  m-0"
            style={{ border: "5px solid white", height: "330px" }}
            id="colc"
          >
            <div
              id={carouselId}
              className="carousel slide doc-img-pad"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <Carousel>
                  {docPanel?.images?.map((image, imageIndex) => (
                    <Carousel.Item key={`carousel-item-${imageIndex}`}>
                      <div className="doc-image mx-auto my-0 text-center" id="">
                        <div
                          className="loader"
                          style={{
                            position: "absolute",
                            top: "40%",
                            left: "40%",
                            transform: "translate(-40%, -40%)",
                          }}
                        />
                        <img
                          src={image?.url}
                          alt={`Document slide ${imageIndex + 1}`}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
              <CarouselControls carouselId={carouselId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocPanelItem;
