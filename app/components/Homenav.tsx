import { Link } from "@remix-run/react";
import React from "react";
import logo  from "../images/logo.svg";

function Homenav() {
  return (
    <div className="w-full h-[80px] flex items-center justify-between overflow-clip p-4 text-grey shadow-sm">
      <div className="grid grid-cols-2 gap-4 place-items-center ">
        <img className="w-[50px]" src={logo} alt="logo" />
        <h3 className="font-bold text-xl">yavvir</h3>
      </div>
      <ul className="flex gap-4 items-center">
        <Link className="hover:text-main" to="">
          <li>learners</li>
        </Link>
        <Link className="hover:text-main" to="">
          <li>teachers</li>
        </Link>
        <Link className="hover:text-main" to="">
          <li>parents</li>
        </Link>
        <Link className="hover:text-main" to="">
          <li>contacts</li>
        </Link>
        <Link className="hover:text-main" to="">
          <li>about</li>
        </Link>
      </ul>
      <div className="flex gap-4">
        <button className="bg-beige_light w-[80px] shadow-sm rounded-md h-[35px]">
          log in
        </button>
        <button className="bg-main w-[80px] rounded-md h-[35px] shadow-sm hover:text-white transition-all">
          sign up
        </button>
      </div>
    </div>
  );
}

export default Homenav;
