import React from 'react'
import logo  from "../../images/logo.svg";
import { IoLogOutOutline } from 'react-icons/io5';
import { useLoaderData } from '@remix-run/react';
import { loader } from '~/routes/teacher-dashboard';
import Cookies from 'js-cookie';

function Navigation() {

  const {uuidName} = useLoaderData<typeof loader>();
  const logout = () =>{
    Cookies.remove(uuidName);
    window.location.href ="/login";
  }
  return (
    <div className='w-full h-[80px] shadow-md flex justify-between'>
        <div className="grid grid-cols-2 gap-4  place-items-center mx-4 md: mx-0 ">
        <img className="w-[50px]" src={logo} alt="logo" />
        <h3 className="font-bold text-md sm:text-xl">yavvir</h3>
        </div>
        <div className='flex items-center justify-end gap-4 px-4'>
            <button className='link hover:text-main flex items-center' onClick={logout}><IoLogOutOutline /> log out</button>
        </div>
    </div>
  )
}

export default Navigation