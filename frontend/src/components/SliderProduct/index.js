import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Import carousel styles

const Slider = ({ data = [], onChange = () => {}, isShowFull = false }) => {
  const [showFull, setShowFull] = useState(isShowFull);

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

  const CustomDot = ({ onClick, ...rest }) => {
    const { index, active } = rest;
    const carouselItems = data;
    return (
      <div
        className={`w-14 h-14 rounded-md mx-1 my-4 ${
          active ? "border-red-600 border-2" : null
        }`}
        onClick={() => onClick()}
        style={{
          backgroundImage: `url('${process.env.REACT_APP_DOMAIN_API}${
            process.env.REACT_APP_URL_PRODUCT
          }${React.Children.toArray(carouselItems)[index]}')`,
        }}
      ></div>
    );
  };

  useEffect(() => {
    onChange(showFull);
  }, [showFull]);

  return (
    <>
      <Carousel
        responsive={responsive}
        infinite={true}
        customDot={<CustomDot />}
        arrows={true}
        className="z-10 overflow-hidden"
        showDots
      >
        {data?.map((image, index) => {
          return (
            <div className="relative" key={index}>
              <img
                src={`${process.env.REACT_APP_DOMAIN_API}${process.env.REACT_APP_URL_PRODUCT}${image}`}
                className="w-full h-full"
                alt={image}
              />
            </div>
          );
        })}
      </Carousel>
      {!showFull ? (
        <FontAwesomeIcon
          icon="fa-solid fa-maximize"
          className="absolute right-2 top-2 text-rose-500 text-2xl z-20 cursor-pointer"
          onClick={() => {
            setShowFull(true);
          }}
        />
      ) : (
        <FontAwesomeIcon
          icon="fa-solid fa-minimize"
          className="absolute right-2 top-2 text-rose-500 text-2xl z-20 cursor-pointer"
          onClick={() => {
            setShowFull(false);
          }}
        />
      )}
    </>
  );
};

export default Slider;
