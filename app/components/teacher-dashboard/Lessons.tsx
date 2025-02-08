import React, { useEffect, useState } from "react";
import Lessonlist from "./Lessonlist";
import CreateLesson from "./CreateLesson";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/teacher-dashboard";
import useApi from "~/services/axios-service";
import Cookies from "js-cookie";
import { decryptToken } from "~/services/tokenManager";
import { lessonData, paymentUrl } from "~/services/interfaces";
import toast from "react-hot-toast";

function Lessons() {
  const { backendUrl, uuidSecret, uuidName } = useLoaderData<typeof loader>();
  const [isPremium, setisPremium] = useState(false);
  const api = useApi(backendUrl);
  const [createlesson, setcreatelesson] = useState(false);
  const [data, setData] = useState({
    total: 0,
    expired: 0,
    pending: 0,
  });

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response: lessonData = (
        await api.post("teacher-api/lessons-data", null, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;

      if (response.proceed) {
        setisPremium(response.isPremium);
        setData(response.lesson);
        return;
      }
    } else {
      window.location.href = "/login";
    }
  };

  const handleGoPremium = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response: paymentUrl = (
        await api.post(
          "payment-api/initialize-payment",
          {
            payment_type: 1 // update so that you set the amount in the backend
          },
          {
            headers: {
              Authorization: `Bearer ${decrypted}`,
            },
          }
        )
      ).data;

      if (response.proceed) {
        window.open(response.url);
        return;
      } else {
        toast.error(response.message);
        return;
      }
    } else {
      window.location.href = "/login";
      return;
    }
  };

  return (
    <div className="w-full shadow-sm h-full ">
      {createlesson && <CreateLesson setcreatelesson={setcreatelesson} />}

      {!createlesson && (
        <div className="w-full h-full py-20 md:pb-4">
          <Lessonlist setcreatelesson={setcreatelesson} />
          {!isPremium && (
            <div
              className="w-full bg-main min-h-[250px] rounded-md"
              style={{
                backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='29' height='50.115' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='%23050404ff'/><path d='M14.5 6.628L8.886 3.372v-6.515L14.502-6.4l5.612 3.257-.001 6.514zm0 50.06l-5.613-3.256v-6.515l5.614-3.258 5.612 3.257-.001 6.515zm14.497-25.117l-5.612-3.257v-6.515L29 18.541l5.612 3.257-.001 6.515zm-29 0l-5.612-3.257v-6.515L0 18.541l5.612 3.257v6.515zM14.5 11.82L4.36 5.967l.002-11.706 10.14-5.855L24.638-5.74l-.001 11.707zm0 50.06L4.36 56.028l.002-11.706 10.14-5.855 10.137 5.852-.001 11.707zm14.498-25.118L18.858 30.91l.002-11.707L29 13.349l10.137 5.853-.001 11.706zm-29 0l-10.139-5.852.002-11.707L0 13.349l10.138 5.853-.002 11.706zm14.501-19.905L0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0l-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'  stroke-linecap='square' stroke-width='1' stroke='%2332cd32ff' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`,
              }}
            >
              <div className="w-full rounded-md h-full bg-black opacity-90 p-2 flex flex-col">
                <h1 className="font-bold text-white text-[25px]">
                  Become a premium teacher
                </h1>
                <p className="text-grey my-3">
                  Set your own price,get ranked above others and hence get more
                  students which allow you to earn more income.become premium
                  today.
                </p>
                <p className="text-lg font-bold text-main ">price: 1500/=</p>
                <span className="text-main text-sm">you pay only once.</span>
                <button
                  className="p-2 my-2 animate-in bg-main rounded-md hover:text-white"
                  onClick={handleGoPremium}
                >
                  go premium now
                </button>
              </div>
            </div>
          )}
          <div className="p-4  md:mt-10 mb-40 md:mb-10">
            <h1 className="font-bold">my Statistics</h1>
            <div className="grid grid-cols-3 gap-4 md:my-4">
              <div className="flex items-center justify-center p-4 shadow-sm rounded-lg flex-col">
                <span className="text-[30px] font-bold">{data.total}</span>
                <h1 className="text-sm sm:text-md">total lessons</h1>
              </div>
              <div className="flex items-center justify-center p-4 shadow-sm rounded-lg flex-col">
                <span className="text-[30px] font-bold">{data.pending}</span>
                <h1 className="text-sm sm:text-md">pending lessons</h1>
              </div>
              <div className="flex items-center justify-center p-4 shadow-sm rounded-lg flex-col">
                <span className="text-[30px] font-bold">{data.expired}</span>
                <h1 className="text-sm sm:text-md">expired lessons</h1>
              </div>
            </div>
            <button
              onClick={() => setcreatelesson(true)}
              className="btn w-full bg-main text-white border-none"
            >
              create lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lessons;
