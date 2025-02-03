import React from 'react'
import logo  from "../../images/logo.svg";
import { Link } from '@remix-run/react';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { PiStudentLight } from 'react-icons/pi';

function Navigation() {
  return (
    <div className='w-full h-[80px] shadow-md flex justify-between'>
        <div className="grid grid-cols-2 gap-4  place-items-center mx-4 md: mx-0 ">
        <img className="w-[50px]" src={logo} alt="logo" />
        <h3 className="font-bold text-md sm:text-xl">yavvir</h3>
        </div>
        <div className='flex items-center justify-end gap-4 px-4'>
            <Link className='hover:text-main flex items-center' to=""><PiStudentLight /> students</Link>
            <Link className='hover:text-main flex items-center' to=""><LiaChalkboardTeacherSolid /> classes</Link>
        </div>
    </div>
  )
}

export default Navigation