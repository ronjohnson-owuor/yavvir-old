import React, { useEffect } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { GiTeacher } from "react-icons/gi";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Teachers() {
  useEffect(()=>{
    AOS.init();
  },[])
  return (
    <div className="my-32 grid grid-cols-2 gap-10 w-[90%] mx-[5%]">
      <div>
        <img data-aos="zoom-in-left" src="../../public/tutor.svg" alt="tutor" />
      </div>
      <div data-aos="zoom-in">
        <h3 className="font-extrabold text-[30px] my-4">A chance to earn more than you had ever imagined</h3>
        <p className="text-md leading-loose my-4">
          As a <span className="font-bold text-beige">teacher</span> , you have the opportunity to expand your reach and
          impact, helping students thrive while earning extra income. With
          flexible scheduling and the ability to teach from anywhere, you can
          grow your career and make a difference, all while being compensated
          for your expertise. Start sharing your knowledge and get rewarded for
          shaping the future of learners!
        </p>
        <ul className="my-4 text-grey text-sm">
          <li className="flex items-center my-2"> <p className="font-bold text-main"><CiCircleCheck /></p>  &nbsp; <p></p>Earn competitive rates for your expertise</li>
          <li className="flex items-center my-2"> <p className="font-bold text-main"><CiCircleCheck /></p>  &nbsp; <p></p>Enjoy flexible teaching hours that fit your schedule</li>
          <li className="flex items-center my-2"> <p className="font-bold text-main"><CiCircleCheck /></p>  &nbsp; <p></p>Reach students from all over, expanding your teaching impact</li>
          <li className="flex items-center my-2"> <p className="font-bold text-main"><CiCircleCheck /></p>  &nbsp; <p></p>
            Access a platform designed to support teachers and enhance the
            learning experience
          </li>
        </ul>
        <button className="w-[80%] h-[50px] text-white shadow-sm rounded-md my-4 bg-main flex justify-center items-center"><GiTeacher />&nbsp;become a yavvir educator</button>
      </div>
    </div>
  );
}

export default Teachers;
