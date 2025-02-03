import { Link } from "@remix-run/react";
import React from "react";
import logo  from "../images/logo.svg";
import "../css/mediaqueries.css";

function Homenav() {
  return (
    <div className="w-full h-[80px] flex items-center justify-around sm:justify-between overflow-clip p-4 text-grey shadow-sm">
      <div className="grid grid-cols-2 gap-4  place-items-center mx-4 md: mx-0 ">
        <img className="w-[50px]" src={logo} alt="logo" />
        <h3 className="font-bold text-xl">yavvir</h3>
      </div>
      <ul className="flex gap-4 hidden sm:flex text-sm md:text-md items-center">
        <Link className="hover:text-main" to="/signup">
          <li>learners</li>
        </Link>
        <Link className="hover:text-main" to="/signup">
          <li>teachers</li>
        </Link>
        <Link className="hover:text-main" to="/signup">
          <li>parents</li>
        </Link>
        <Link className="hover:text-main hidden md:block" to="">
          <li>contacts</li>
        </Link>
        <Link className="hover:text-main hidden md:block" to="">
          <li>about</li>
        </Link>
      </ul>
      <div className="flex gap-2  md:gap-4 ml-4 ">
      <Link to="/login"> <button id="nav_buttons"  className="bg-beige_light text-sm sm:text-md w-[60px]  md:w-[80px] shadow-sm rounded-md h-[35px]">
          login
        </button></Link>
        
          <Link to="/signup"><button id="nav_buttons"  className="bg-main text-sm sm:text-md w-[60px]  md:w-[80px] rounded-md h-[35px] shadow-sm hover:text-white transition-all">signup</button></Link>
        
      </div>
    </div>
  );
}

export default Homenav;
