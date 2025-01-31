import React from "react";
import { FaBook, FaBriefcase, FaRegUser, FaSchool } from "react-icons/fa";
import { GiGraduateCap, GiTeacher } from "react-icons/gi";
import { IoInformationOutline, IoLocationSharp } from "react-icons/io5";

function Additionalprofile() {
  return (
    <div className=" shadow-sm rounded-sm sm:rounded-none w-full min-h-[300px]">
      <div className="w-[95%] flex items-center justify-between p-2 my-2 rounded-md">
        <h1 className="font-bold text-xl">additional Info</h1>
        <div className="badge badge-error gap-2">
         attention
        </div>
      </div>
      <div className="w-full text-[12px] flex items-center justify-center h-[50px] bg-green-50 border-b-2 border-b-main">
      <IoInformationOutline className="rounded-[100vh] w-4 bg-beige_light" /><p>you need to udate your profile for better visibility</p>
      </div>
      <div className="w-full p-2 min-h-[200px] my-4 grid grid-cols-2 gap-2">
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "> <FaRegUser />username</p>
            <span className="font-bold my-2">Ronjohnson owuor</span>
        </div>
        <div className="flex flex-col p-2">
        <p className="flex items-center text-sm flex-row gap-2  text-beige  "><GiGraduateCap />education</p>
        <span className="font-bold my-2">not specified</span>
        </div>
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "><GiTeacher /> in-person tutoring</p>
            <span className="font-bold my-2">not specified</span>
        </div>
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "><IoLocationSharp />Location</p>
            <span className="font-bold my-2">not specified</span>
        </div>
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "><FaSchool />your school</p>
            <span className="font-bold my-2">not specified</span>
        </div>
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "><FaBriefcase />your bio</p>
            <span className="font-bold my-2">not written</span>
        </div>
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "><FaBook />subjects you teach</p>
            <span className="font-bold my-2">not specified</span>
        </div>
        <div className="flex flex-col p-2">
            <p className="flex items-center text-sm flex-row gap-2  text-beige  "> <FaBriefcase /> extra info</p>
            <span className="font-bold my-2">not specified</span>
        </div>
      </div>
      <hr />
      <div className="my-4 text-sm">
        <p>edit this information to boost your profile and attract better clients</p>
        <button className="btn w-[80%] mx-[10%] bg-main text-sm md:text-md hover:bg-beige text-black border-none my-4">edit information</button>
      </div>
    </div>
  );
}

export default Additionalprofile;
