import React, { useEffect } from "react";
import { CiCircleCheck } from "react-icons/ci";
import AOS from "aos";
import "aos/dist/aos.css";
import parent from "../images/parent.svg";
import "../css/mediaqueries.css";
import { Link } from "@remix-run/react";

function Parents() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      data-aos="fade-right"
      className="my-32 grid md:grid-cols-2  gap-10 w-[90%] mx-[5%]"
    >
      <div className="order-last md:order-first" data-aos="flip-right">
        <h3 className="font-extrabold text-[30px] my-4">
          Keep your child busy at home.
        </h3>
        <p className="text-md leading-loose my-4">
          As a parent, you can stay fully engaged in your child's learning
          journey and ensure they stay on track at home. Our platform allows you
          to monitor their progress, access study resources, and support their
          academic growth in real-time. You’ll be able to keep your child
          motivated and help them achieve their best, all from the comfort of
          your home.
        </p>
        <ul className="my-4 text-grey text-sm">
          <li className="flex items-center my-2">
            <p className="font-bold text-main">
              <CiCircleCheck />
            </p>
            &nbsp;{" "}
            <p>
              Track your child's learning progress with easeEarn competitive
              rates for your expertise
            </p>
          </li>
          <li className="flex items-center my-2">
            <p className="font-bold text-main">
              <CiCircleCheck />
            </p>
            &nbsp;{" "}
            <p>
              Quality educational materials and resources to aid their studies
            </p>
          </li>
          <li className="flex items-center my-2">
            <p className="font-bold text-main">
              <CiCircleCheck />
            </p>
            &nbsp;{" "}
            <p>
              Stay informed with updates and performance reports and daily
              notifications
            </p>
          </li>
          <li className="flex items-center my-2">
            <p className="font-bold text-main">
              <CiCircleCheck />
            </p>
            &nbsp;{" "}
            <p>
              There are quizzes test and exams offered by the teachers,you will
              be receiving scores and feedback of your son or daughter instantly
              and dailly
            </p>
          </li>
        </ul>

        <Link to="/signup">
          <button
            id="parent_btn"
            className="w-[80%] h-[50px] text-white shadow-sm rounded-md my-4 bg-main flex justify-center items-center"
          >
            register your child today
          </button>
        </Link>
      </div>
      <div className="w-full h-full">
        <img src={parent} alt="parent" className="w-full h-full" />
      </div>
    </div>
  );
}

export default Parents;
