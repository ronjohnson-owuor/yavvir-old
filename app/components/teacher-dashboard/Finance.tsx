import React, { useState } from "react";
import { GiBackwardTime, GiPayMoney } from "react-icons/gi";
import { IoWalletOutline } from "react-icons/io5";
import { PiHandWithdrawLight } from "react-icons/pi";

function Finance() {
  const [loading, setloading] = useState(false);
  return (
    <div className="shadow-md rounded-sm sm:rounded-none w-full min-h-[300px] p-4">
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="loading loading-spinner text-main"></span>
        </div>
      )}
      {!loading && (
        <div className="flex items-center justify-center flex-col ">
          <center>
            <h1 className="my-4 font-bold text-[20px]">My Wallet</h1>
          </center>
          <IoWalletOutline className="font-bold text-[60px] my-4 bg-beige p-4 rounded-[100vh] text-white" />
          <p className="font-bold text-[40px]">1.2k</p>
          <div className="flex gap-2 items-center my-4">
            <p>120K</p>
            <span>total widthdrawn</span>
          </div>
          <button className="btn w-[80%] mx-[10%]  hover:bg-main border-none  hover:text-white">
            request withdrawal
          </button>
          <div className="my-4 ">
            <h3 className="my-2">withdrawal history</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-beige_light flex items-center gap-2 rounded-[20px] px-4 py-2"><PiHandWithdrawLight />success</button>
              <button className="bg-beige_light flex items-center gap-2 rounded-[20px] px-4 py-2"> <GiBackwardTime />pending</button> <button className="bg-beige_light flex items-center gap-2 rounded-[20px] px-4 py-2"><GiPayMoney /> failed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;
