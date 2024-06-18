import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Import carousel styles
import { Flex, Spin } from "antd";
import Loading from "../Loading";

const Slider = ({ data = [] }) => {
  // console.log(data);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={2000} // Set the autoplay interval (in milliseconds)
      infinite={true}
      arrows={true} // Show navigation arrows (previous and next)
      className="w-full h-full"
      showDots
    >
      {data.map((items, index) => {
        return (
          <img
            key={index}
            src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_SLIDER}${items.imageUrl}`}
            className="w-full h-full"
            alt={items.description}
          />
        );
      })}
    </Carousel>
  );
};

export default Slider;
