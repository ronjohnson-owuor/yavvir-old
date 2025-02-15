import { data, useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GiBackwardTime, GiPayMoney } from "react-icons/gi";
import { IoWalletOutline } from "react-icons/io5";
import { PiHandWithdrawLight } from "react-icons/pi";
import { loader } from "~/routes/teacher-dashboard";
import useApi from "~/services/axios-service";
import { formartNumber } from "~/services/basic";
import { teacherFinance } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";

function Finance() {
  const [loading, setloading] = useState(true);
  const { backendUrl, uuidSecret, uuidName } = useLoaderData<typeof loader>();
  const [teacherfinance, setteacherfinance] = useState<teacherFinance>();
  const api = useApi(backendUrl);
  const [isWidthdrawing, setisWidthdrawing] = useState(false);
  const [amount, setamount] = useState(0);

  useEffect(() => {
    getFinanceDetails();
  }, []);

  const requestWithdrawal = async () => {
    let cookieValue = Cookies.get(uuidName);
    
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      let amount_data = { amount };
      console.log(amount_data);
      const response = (
        await api.post("teacher-api/withdraw", amount_data, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;

      if (response.proceed) {
        toast.success(response.message);
        setisWidthdrawing(false);
        getFinanceDetails();
        return;
      } else {
        toast.error(response.message);
        return;
      }
    } else {
      window.location.href = "/login";
    }
  };

  const getFinanceDetails = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response: teacherFinance = (
        await api.post("teacher-api/get-finance-details", null, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;

      if (response) {
        setloading(false);
      }

      if (response.proceed) {
        setteacherfinance(response);
        return;
      } else {
        toast.error(response.message);
      }
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="shadow-sm rounded-sm sm:rounded-none w-full min-h-[300px] p-4">
      {isWidthdrawing && (
        <div className="w-full h-full backdrop-blur-md fixed top-0 left-0 bottom-0 h-screen z-10 grid place-items-center">
          <div className="p-4 bg-white min-w-[300px] rounded-md border border-gray-300 text-center">
            <h3
              className="font-bold my-2 mb-0
          "
            >
              Request a withdrawal
            </h3>
            <p className="text-beige mb-2">
              Actual Balance: ksh.{teacherfinance?.balance ?? 0}
            </p>
            <div className="flex flex-col">
              <input
                className="w-full h-[40px] bg-beige_light p-2
            rounded-sm"
                type="number"
                onChange={(e) =>
                  setamount(Number(e.target.value))
                }
                placeholder="enter amount"
              />
              <button
                onClick={requestWithdrawal}
                className="w-full h-[40px] bg-main p-2
            rounded-sm my-2"
              >
                request withdrawal
              </button>
              <button
                onClick={() => setisWidthdrawing(false)}
                className="w-full h-[40px] bg-gray-300 p-2
            rounded-sm my-2"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
          <p className="font-bold text-[40px]">
            KSH.{formartNumber(teacherfinance?.balance ?? 0)}
          </p>
          <p className="text-[10px]">
            Actual Balance: ksh.{teacherfinance?.balance ?? 0}
          </p>
          <div className="flex gap-2 items-center my-4">
            <p>{formartNumber(teacherfinance?.total ?? 0)}</p>
            <span>total widthdrawn</span>
          </div>
          <button className="btn  w-full sm:w-[80%] mx-[10%]  hover:bg-main border-none  hover:text-white" onClick={()=>setisWidthdrawing(true)}>
            request withdrawal
          </button>
          <div className="my-4 w-full ">
            <h3 className="my-2 sm:text-center my-4">withdrawal history</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <button className="bg-beige_light flex items-center gap-2 rounded-[20px] px-4 py-2 w-full  flex items-center justify-center">
                {formartNumber(teacherfinance?.successfull ?? 0)}&nbsp;
                <PiHandWithdrawLight />
                success
              </button>
              <button className="bg-beige_light flex items-center gap-2 rounded-[20px] px-4 py-2 w-full  flex items-center justify-center">
                {" "}
                {formartNumber(teacherfinance?.pending ?? 0)}&nbsp;
                <GiBackwardTime />
                pending
              </button>
              <button className="bg-beige_light flex items-center gap-2 rounded-[20px] px-4 py-2 w-full  flex items-center justify-center">
                {formartNumber(teacherfinance?.failled ?? 0)}&nbsp;
                <GiPayMoney /> failed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Finance;
