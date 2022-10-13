import React from "react";
import Card from "../../card/Card";
import classes from "./Banner.module.css";
// import Slider from "react-slick";

const Banner = () => {
  console.log("Banner >>>>>>>>");

  // const settings = {
  //     dots: true,
  //     className: "center",
  //     // centerMode: true,
  //     infinite: true,
  //     centerPadding: "60px",
  //     speed: 500,
  //     slidesToShow: 2,
  //     initialSlide: 0,
  // };

  const style = {
    height: 350,
    width: 500,
  };

  return (
    <div className={classes.banner}>
      {/* <Slider {...settings}> */}
      <h2>Top Music</h2>
      <div className={classes.bannerCarousel}>
        {[...Array(10)].map((_, i) => {
          const isLarge = i % 2 === 0;
          return (
            <Card
              key={i}
              title={isLarge ? "Invasion of Privacy" : "BOSS"}
              isLarge={isLarge}
              style={style}
              url={"banner-" + (!isLarge ? "1" : "2")}
            />
          );
        })}
        {/* </Slider> */}
      </div>
    </div>
  );
};
export default Banner;
