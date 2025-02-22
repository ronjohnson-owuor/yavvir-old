import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import { PiStudentBold, PiStudentThin } from "react-icons/pi";
import useApi from "~/services/axios-service";
import { envBackendData, user, userdata } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";
import Uploadprofile from "./Uploadprofile";
import { loader } from "~/routes/teacher-dashboard";

function Profile() {
  const { backendUrl, uuidName, uuidSecret } = useLoaderData<typeof loader>();
  const [loading, setloading] = useState(true);
  const [basic_userdata, setbasic_userdata] = useState<user>();
  const [isEditingprofile, setisEditingprofile] = useState(false);
  const [profilescore, setprofilescore] = useState(10);
  const api = useApi(backendUrl);
  useEffect(() => {
    validateUser();
    getProfileCompleteness();
  }, []);

  const getProfileCompleteness = async () =>{
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response = (
        await api.post("teacher-api/profile-completeness",null, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;
      if(response.proceed){
        setprofilescore(response.score);
        return;
      }
  }
}

  const validateUser = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      let decrypted = decryptToken(cookieValue, uuidSecret);

      // get more details about this user
      const response: userdata = (
        await api.get("get-user-data", {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;
      if (response.proceed) {
        setbasic_userdata(response.user);
        setloading(false);
      }
      return;
    }
    setTimeout(() => {
      window.location.href = "/login";
      setloading(false);
    }, 3000);
    return;
  };
  return (
    <div className=" shadow-sm p-2 rounded-sm sm:rounded-none w-full min-h-f[300px]">
      {loading && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="loading loading-spinner text-main"></span>
        </div>
      )}

      {/* when there is some data */}
      {!loading && (
        <div>
          {" "}
          <div className="flex flex-col p-4 items-center gap-4">
            <h1 className="font-bold text-[25px]">my profile</h1>
            {!basic_userdata?.picture && (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-24 rounded-full">
                  <span className="text-3xl">
                    {basic_userdata?.username.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            {basic_userdata?.picture && (
              <div className="avatar">
                <div className="w-20 h-20 rounded-full border-4 border-beige">
                  <img src={basic_userdata.picture} />
                </div>
              </div>
            )}
            <div>
              <h3 className="font-bold text-center sm:text-left"> hello,{basic_userdata?.username}</h3>
              <p className="text-beige text-[12px]">{basic_userdata?.email}</p>
              <p className="text-beige text-center sm:text-left text-[12px]">{basic_userdata?.phone}</p>
            </div>
          </div>
          <div className=" p-4 my-2 grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center gap-2 ">
              <div
                className="radial-progress text-beige bg-beige_light"
                // @ts-ignore
                style={{ "--value": profilescore }}
                role="progressbar"
              >
                {profilescore}%
              </div>
              <h1 className="font-bold">{profilescore}%</h1>
              <p className="text-sm">{profilescore == 100 ? "profile completed":"complete profile"}</p>
            </div>
            <div className="flex flex-col items-center gap-2 ">
              <PiStudentThin className="rounded-[100vh] text-beige bg-beige_light p-2 w-[80px] h-[80px] text-[20px]" />
              <h1 className="font-bold">50</h1>
              <p>student(s)</p>
            </div>
          </div>
          <div className="p-4 my-2 flex items-center justify-center">
            {!basic_userdata?.picture && (
              <button
                onClick={() => setisEditingprofile(true)}
                className="btn bg-transparent border-beige mr-2 w-full text-black text-sm hover:bg-beige"
              >
                <IoCameraOutline /> add profile photo
              </button>
            )}
          </div>
        </div>
      )}
      {isEditingprofile && <Uploadprofile close={setisEditingprofile} />}
    </div>
  );
}

export default Profile;
  function validateUser() {
    throw new Error("Function not implemented.");
  }

