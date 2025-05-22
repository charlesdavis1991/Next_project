import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { useDocumentModal } from "../common/CustomModal/CustomModalContext";

const DocumentCarousel = (props) => {
  console.log(props.docs);
  const { showDocumentModal } = useDocumentModal();
  return (
    <>
      <Carousel
        onClick={() =>
          showDocumentModal(
            "document",
            props?.docs?.document?.upload,
            props?.docs?.document
          )
        }
      >
        {props.images?.map((image) => (
          <Carousel.Item>
            <div class="doc-image mx-auto my-0 text-center">
              {image?.url ? (
                <img
                  src={image.url}
                  text="First slide"
                  style={{
                    height: "auto",
                  }}
                />
              ) : (
                <img
                  src={image}
                  text="First slide"
                  style={{
                    height: "auto",
                  }}
                />
              )}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default DocumentCarousel;
