import { Link, useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { loader } from "~/routes/teacher-dashboard";
import useApi from "~/services/axios-service";
import { lessonModerators } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";

function CreateLesson({setcreatelesson}:lessonModerators) {
  const { backendUrl, uuidSecret, uuidName } = useLoaderData<typeof loader>();
  const api = useApi(backendUrl);

  const [selected, setSelected] = useState<number>();
  const [fees, setFees] = useState({
    teacher_cost: 0,
    commission: 0,
    total_fees: 0,
  });
  const [lesson, setLesson] = useState({
    lesson_name: "",
    duration: 0,
    start_time: "",
    lesson_price: 0,
  });

  const handleDuration = (duration: number, select_num: number) => {
    setSelected(select_num);
    setLesson((prev) => ({
      ...prev,
      duration,
    }));

    if (select_num == 0) {
      setFees((prev) => ({
        ...prev,
        total_fees: 250,
      }));
    } else if (select_num == 1) {
      setFees((prev) => ({
        ...prev,
        total_fees: 400,
      }));
    } else {
      setFees((prev) => ({
        ...prev,
        total_fees: 600,
      }));
    }
  };

  const calculateFees = () => {
    setFees((prev) => {
      setLesson((prev_less) => ({
        ...prev_less,
        lesson_price: prev.total_fees,
      }));
      const amount = prev.total_fees;
      const commission = (30 / 100) * amount;
      const teacher_cost = amount - commission;
      return { ...prev, teacher_cost, commission };
    });
  };

  useEffect(() => {
    calculateFees();
  }, [selected]);

  const handleCreateLesson = async () => {
    if (!lesson.lesson_name) {
      toast.error("please enter the lesson name");
      return;
    } else if (lesson.duration == 0) {
      toast.error("please choose a duration for you lesson");
      return;
    } else if (!lesson.start_time) {
      toast.error("please choose the start time for your lesson");
      return;
    }

    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response = (
        await api.post("teacher-api/create-lesson",lesson, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;

      if(response.proceed){
        toast.success(response.message);
        return;
      }else{
        toast.error(response.message);
        return;
      }
  }

  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[25px]">About this lesson</h1>
        <IoClose className="font-bold text-xl"  onClick={()=>setcreatelesson && setcreatelesson(false)}/>
      </div>

      <label className="form-control w-full w-full">
        <div className="label">
          <span className="label-text">topic or lesson name</span>
        </div>
        <input
          onChange={(e) =>
            setLesson((prev) => ({
              ...prev,
              lesson_name: e.target.value || prev.lesson_name,
            }))
          }
          type="text"
          placeholder="lesson name"
          className="input input-bordered w-full w-full bg-transparent"
        />
        <div className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt text-red-600">required</span>
        </div>
      </label>
      <div className=" my-10">
        <h3 className="my-2 text-gray-400">Lesson Duration</h3>
        <div className="grid grid-cols-3 gap-4">
          <div
            className={`flex flex-col border border-gray-50 min-h-[80px] my-2 shadow-sm items-center justify-center rounded cursor-pointer hover:bg-green-100 hover:border-green-300 transition-all duration-200 ${
              selected == 0 && "bg-green-100 border-green-300"
            }`}
            onClick={() => handleDuration(30, 0)}
          >
            <span className="font-bold text-xl text-grey">30</span>
            <span className="text-gray-400">minutes</span>
          </div>
          <div
            className={`flex flex-col border border-gray-50 min-h-[80px] my-2 shadow-sm items-center justify-center rounded cursor-pointer hover:bg-green-100 hover:border-green-300 transition-all duration-200 ${
              selected == 1 && "bg-green-100 border-green-300"
            }`}
            onClick={() => handleDuration(60, 1)}
          >
            <span className="font-bold text-xl text-grey">60</span>
            <span className="text-gray-400">minutes</span>
          </div>
          <div
            className={`flex flex-col border border-gray-50 min-h-[80px] my-2 shadow-sm items-center justify-center rounded cursor-pointer hover:bg-green-100 hover:border-green-300 transition-all duration-200 ${
              selected == 2 && "bg-green-100 border-green-300"
            }`}
            onClick={() => handleDuration(90, 2)}
          >
            <span className="font-bold text-xl text-grey">90</span>
            <span className="text-gray-400">minutes</span>
          </div>
        </div>
      </div>

      <div className="shadow-inner p-4 rounded-md">
        <h3 className="text-gray-400 font-bold">lesson profitability metric</h3>
        <p className="text-sm text-gray-300">
          this metric is calculated per student
        </p>
        <div className="my-4 italic text-gray-400">
          <p>streaming and platform fees: {fees.commission}/=</p>
          <p>Your total Earning: {fees.teacher_cost}/=</p>
        </div>
        <p className="text-sm">
          you want to earn more and set your own lesson prices become a{" "}
          <Link to="" className="underline text-yellow-300">
            premium teacher
          </Link>{" "}
        </p>
        <span className="my-4 text-sm text-gray-300">
          you can choose a longer duration for more profit.
        </span>
      </div>

      <div className="my-4">
        <h3 className="my-2 text-gray-400 mb-0">When is your lesson?</h3>
        <p className="text-sm">
          click on the the input to add respective date and time
        </p>
        <input
          onChange={(e) =>
            setLesson((prev) => ({
              ...prev,
              start_time: e.target.value,
            }))
          }
          className="w-full my-4 h-[60px] text-gray-500 p-2 bg-transparent border border-gray-150 rounded-sm"
          min={new Date().toISOString().slice(0, 16)}
          type="datetime-local"
        />
      </div>
      <button
        onClick={handleCreateLesson}
        className="btn bg-main text-white w-full h-[40px] rounded-md border-none hover:bg-beige hover:text-black"
      >
        create lesson
      </button>
    </div>
  );
}

export default CreateLesson;
