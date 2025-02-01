import Cookies from "js-cookie";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaBook, FaBriefcase, FaRegUser, FaSchool } from "react-icons/fa";
import { GiGraduateCap, GiTeacher } from "react-icons/gi";
import {
  IoCloseCircleOutline,
  IoInformationOutline,
  IoLocationSharp,
} from "react-icons/io5";
import useApi from "~/services/axios-service";
import trim from "~/services/basic";
import { addittionalProfile } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";

function Additionalprofile({
  teacher_data,
  basic_data,
  backendUrl,
  uuidName,
  uuidSecret,
}: addittionalProfile) {
  const [isEditing, setisEditing] = useState(false);
  const [uploadingdocuments,setuploadingdocuments] = useState(false);
  const api = useApi(backendUrl);
  const [userData, setuserData] = useState({
    location: "",
    school: "",
    bio: "",
    extra_info: "",
    ground_tutor: false,
  });

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
    <>
      {teacher_data && basic_data && !isEditing && (
        <div className=" shadow-sm rounded-sm sm:rounded-none w-full min-h-[300px]">
          <div className="w-[95%] flex items-center justify-between p-2 my-2 rounded-md">
            <h1 className="font-bold text-xl">additional Info</h1>
            <div className="badge badge-error gap-2">attention</div>
          </div>
          <div className="w-full text-[12px] flex items-center justify-center h-[50px] bg-green-50 border-b-2 border-b-main">
            <IoInformationOutline className="rounded-[100vh] w-4 bg-beige_light" />
            <p>you need to udate your profile for better visibility</p>
          </div>
          <div className="w-full p-2 min-h-[200px] my-4 grid grid-cols-2 gap-2">
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                {" "}
                <FaRegUser />
                username
              </p>
              <span className="font-bold my-2">{trim(basic_data?.username)}</span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                <GiGraduateCap />
                education
              </p>
              <span className="font-bold my-2">
                {teacher_data?.certificates
                  ? "view certificates"
                  : "not specified"}
              </span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                <GiTeacher /> in-person tutoring
              </p>
              <span className="font-bold my-2">
                {teacher_data?.ground_tutor ? (
                  <p className="text-main">yes</p>
                ) : (
                  <p className="text-red-500">no</p>
                )}
              </span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                <IoLocationSharp />
                Location
              </p>
              <span className="font-bold my-2">
                {teacher_data?.location ? trim(teacher_data.location) : "not specified"}
              </span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                <FaSchool />
                your school
              </p>
              <span className="font-bold my-2">
                {teacher_data?.school ? trim(teacher_data.school): "not specified"}
              </span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                <FaBriefcase />
                your bio
              </p>
              <span className="font-bold my-2">
                {teacher_data?.bio ?trim(teacher_data.bio): "add bio"}
              </span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                <FaBook />
                subjects you teach
              </p>
              <span className="font-bold my-2">
                {teacher_data?.subject ? "view subjects" : "not specified"}
              </span>
            </div>
            <div className="flex flex-col p-2">
              <p className="flex items-center text-sm flex-row gap-2  text-beige  ">
                {" "}
                <FaBriefcase /> extra info
              </p>
              <span className="font-bold my-2">
                {teacher_data?.extra_info ?trim(teacher_data.extra_info): "not specified"}
              </span>
            </div>
          </div>
          <hr />
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
        </div>
      )}
      {!teacher_data && !basic_data && (
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

            <div className="form-control w-[90%] mx-[5%] my-2">
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
              className="w-full h-[40px] bg-main rounded-md hover:text-white"
            >
              {" "}
              save changes
            </button>
            <div className="my-4 mt-10">
              <p>additional settings</p>
              <button onClick={()=>setuploadingdocuments(true)}  className="link text-sm text-beige">
                upload documents(certificates etc)
              </button>
              <button className="link text-sm text-beige">
                edit the subjects you teach
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Additionalprofile;
