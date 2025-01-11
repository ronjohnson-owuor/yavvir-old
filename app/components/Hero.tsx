import React, { useEffect } from "react";
import { PiStudent } from "react-icons/pi";
import AOS from "aos";
import "aos/dist/aos.css";
import hero  from "../images/hero.svg";

function Hero() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div
      data-aos="zoom-in-left"
      className="w-full grid grid-cols-2 gap-10 h-screen overflow-clip p-4 my-10"
    >
      <div>
        <img src={hero} alt="" />
      </div>
      <div className="flex items-center flex-col justify-start p-4">
        <h1 className="text-[30px] my-4 leading-relaxed font-bold">
          With a Little Help and support you will achieve the best grades.
        </h1>
        <p className="leading-snug">
          We’re here to help learners in Kenya shine brighter, boost their
          grades, and learn from some of the most experienced and passionate
          teachers. Get access to top-quality revision materials that will
          empower you to excel and reach your full potential!
        </p>
        <button className="w-[80%]  flex items-center justify-center h-[50px] rounded-md bg-main my-10 mt-20">
          <PiStudent />
          &nbsp;become a yavvir's student
        </button>
      </div>
    </div>
  );
}

export default Hero;
