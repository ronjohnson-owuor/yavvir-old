import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBook, FaBriefcase, FaRegUser, FaSchool } from "react-icons/fa";
import { GiGraduateCap, GiTeacher } from "react-icons/gi";
import {
  IoCheckmarkDoneCircle,
  IoCloseCircleOutline,
  IoInformationOutline,
  IoLocationSharp,
} from "react-icons/io5";
import useApi from "~/services/axios-service";
import trim from "~/services/basic";
import { teacherData, teacherDataRaw, user } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";
import Fileupload from "./fileupload";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/teacher-dashboard";

function Additionalprofile() {
  const { backendUrl, uuidName, uuidSecret } = useLoaderData<typeof loader>();
  const [isEditing, setisEditing] = useState(false);
  const [uploadingdocuments, setuploadingdocuments] = useState(false);
  const [teacher_data, setteacher_data] = useState<teacherData>();
  const [user_details, setuser_details] = useState<user>();
  const api = useApi(backendUrl);
  const [profilescore, setprofilescore] = useState(10);
  const [userData, setuserData] = useState({
    location: "",
    school: "",
    bio: "",
    subjects: "",
    extra_info: "",
    ground_tutor: false,
  });

  useEffect(() => {
    getProfileCompleteness();
    getTeacherDetails();
  }, []);

  const getProfileCompleteness = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response = (
        await api.post("teacher-api/profile-completeness", null, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;
      if (response.proceed) {
        setprofilescore(response.score);
        return;
      }
    }
  };

  const getTeacherDetails = async () => {
    const cookieToken = Cookies.get(uuidName);
    const token = decryptToken(cookieToken!, uuidSecret);
    const response: teacherDataRaw = (
      await api.post("teacher-api/get-teacher-details", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
    if (!response.proceed) {
      toast.error(response.message);
      return;
    }
    setuser_details(response.basic_data);
    setteacher_data(response.teacher_data);
  };

  const handleProfileEdit = async () => {
    const cookieToken = Cookies.get(uuidName);
    const token = decryptToken(cookieToken!, uuidSecret);
    const response = (
      await api.post("teacher-api/edit-teacher-details", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
    if (!response.proceed) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    window.location.reload();
    return;
  };

  return (
    <div className="shadow-sm">
      {teacher_data && user_details && !isEditing && (
        <div className=" shadow-sm rounded-sm sm:rounded-none w-full min-h-[300px]">
          <div className="w-[95%] flex items-center justify-between p-2 my-2 rounded-md">
            <h1 className="font-bold text-xl">additional Info</h1>
            <div
              className={`badge ${
                profilescore < 50
                  ? "bg-red-500  animate-pulse"
                  : profilescore > 50 && profilescore < 100
                  ? "bg-yellow-300"
                  : "bg-main no-animation"
              } border-none text-white  gap-2`}
            >
              {profilescore < 50
                ? "attention"
                : profilescore > 50 && profilescore < 100
                ? "almost done"
                : "completed"}
            </div>
          </div>
          {profilescore != 100 && (
            <div className="w-full text-[12px] flex items-center justify-center min-h-[50px] bg-green-50 border-b-2 border-b-main">
              <IoInformationOutline className="rounded-[100vh] w-4 bg-beige_light" />
              <p>you need to udate your profile for better visibility</p>
            </div>
          )}
          <div className="w-full p-2 min-h-[200px] my-4 grid grid-cols-1 gap-10">
            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <FaRegUser />
                  username
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {trim(user_details?.username)}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    user_details?.username ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <FaBook />
                  subjects you teach
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {trim(teacher_data?.subject ?? "no information specified")}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    teacher_data?.subject ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <IoLocationSharp />
                  Enter your current location
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {trim(teacher_data?.location ?? "no information specified")}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    teacher_data?.location ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <FaBriefcase />
                  More about you
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {trim(teacher_data?.bio ?? "no information specified")}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    teacher_data?.bio ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <FaSchool />
                  where do you teach at the moment
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {trim(teacher_data?.school ?? "no information specified")}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    teacher_data?.school ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <FaBriefcase />
                  extra info to help students locate your profile
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {trim(teacher_data?.extra_info ?? "no information specified")}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    teacher_data?.extra_info ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between  p-2 px-4 rounded-md shadow-sm min-h-[50px]">
              <div>
                <p className="flex items-center text-sm flex-row gap-2 font-bold  text-black  ">
                  <GiGraduateCap />
                  Your certificates
                </p>
                <span className="text-grey text-sm p-2 my-2">
                  {teacher_data?.certificates ? (
                    <p className="link">
                      {teacher_data.certificates} certificates found
                    </p>
                  ) : (
                    trim("no information specified")
                  )}
                </span>
              </div>
              <div>
                <IoCheckmarkDoneCircle
                  className={`text-[20px] ${
                    teacher_data?.certificates ? "text-main" : "text-red-500"
                  }`}
                />
              </div>
            </div>
          </div>
          <hr />
          {profilescore != 100 && (
            <div className="my-4 text-sm">
              <p>
                edit this information to boost your profile and attract better
                clients
              </p>
              <button
                onClick={() => setisEditing(true)}
                className="btn w-[80%] mx-[10%] bg-main text-sm md:text-md hover:bg-beige text-black border-none my-4"
              >
                edit information
              </button>
            </div>
          )}
        </div>
      )}
      {!teacher_data && !user_details && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="loading loading-spinner text-main"></span>
        </div>
      )}

      {isEditing && (
        <div>
          <div className="flex justify-between p-4 items-center w-[90%]">
            <p className="font-bold text-lg">Edit your profile</p>
            <IoCloseCircleOutline
              className=" cursor-pointer text-xl"
              onClick={() => setisEditing(false)}
            />
          </div>
          <div className=" my-10">
            <div className="flex items-start p-2 flex-col my-2">
              <label className="text-sm ">Enter your current location</label>
              <input
                type="text"
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="bg-transparent border w-full my-2 h-[40px] rounded-md border-gray-200 hover:border-beige_light p-2"
                placeholder="mamboleo,kisumu,Kenya"
              />
            </div>
            <div className="flex items-start p-2 flex-col my-2">
              <label className="text-sm ">
                subject you teach(separated by a comma){" "}
              </label>
              <input
                type="text"
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    subjects: e.target.value,
                  }))
                }
                className="bg-transparent border w-full my-2 h-[40px] rounded-md border-gray-200 hover:border-beige_light p-2"
                placeholder="mathematics,science"
              />
            </div>
            <div className="flex items-start p-2 flex-col my-2">
              <label className="text-sm ">school you teach at</label>
              <input
                type="text"
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    school: e.target.value,
                  }))
                }
                className="bg-transparent border w-full my-2 h-[40px] rounded-md border-gray-200 hover:border-beige_light p-2"
                placeholder="maranda high school"
              />
            </div>
            <div className="flex items-start p-2 flex-col my-2">
              <label className="text-sm ">
                a simple bio for others to know you better
              </label>
              <textarea
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                className="bg-transparent border w-full my-2 h-[80px] resize-none rounded-md border-gray-200 hover:border-beige_light p-2"
              ></textarea>
            </div>
            <div className="flex items-start p-2 flex-col my-2">
              <label className="text-sm ">
                any other information that may be relevant
              </label>
              <textarea
                onChange={(e) =>
                  setuserData((prev) => ({
                    ...prev,
                    extra_info: e.target.value,
                  }))
                }
                className="bg-transparent border w-full my-2 h-[80px] resize-none rounded-md border-gray-200 hover:border-beige_light p-2"
              ></textarea>
            </div>

            <div className="form-control w-[90%] mx-[5%] my-2 bg-grey p-2 rounded-md text-white animate-bounce">
              <label className="cursor-pointer label">
                <span className="text-sm">
                  do you offer in-person tutoring in your area?
                </span>
                <input
                  onChange={(e) =>
                    setuserData((prev) => ({
                      ...prev,
                      ground_tutor: !prev.ground_tutor,
                    }))
                  }
                  type="checkbox"
                  className="checkbox checkbox-main"
                  defaultChecked={false}
                />
              </label>
            </div>

            <button
              onClick={handleProfileEdit}
              className="w-[96%] h-[40px] bg-main rounded-md hover:text-white mx-4"
            >
              {" "}
              save changes
            </button>
            <div className="my-4 mt-10 px-4">
              <p>additional settings</p>
              <button
                onClick={() => setuploadingdocuments(true)}
                className="link text-sm text-beige"
              >
                upload documents(certificates etc)
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadingdocuments && <Fileupload close={setuploadingdocuments} />}
    </div>
  );
}

export default Additionalprofile;
