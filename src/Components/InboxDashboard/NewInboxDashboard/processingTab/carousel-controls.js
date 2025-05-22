import React from "react";

const CarouselControls = ({ carouselId }) => (
  <>
    <a
      className="carousel-control-prev carousel-control-prev-2"
      href={`#${carouselId}`}
      role="button"
      data-slide="prev"
    >
      <svg
        width="34"
        height="17"
        viewBox="0 0 34 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">Previous</span>
    </a>
    <a
      className="carousel-control-next carousel-control-next-2"
      href={`#${carouselId}`}
      role="button"
      data-slide="next"
    >
      <svg
        width="34"
        height="17"
        viewBox="0 0 34 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.00683594 0H9.20684L17.0069 7.85384L24.807 0H34.007L17.0069 17L0.00683594 0Z"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">Next</span>
    </a>
  </>
);

export default CarouselControls;
