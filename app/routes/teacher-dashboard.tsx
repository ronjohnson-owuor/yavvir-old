import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Additionalprofile from "~/components/teacher-dashboard/Additionalprofile";
import Finance from "~/components/teacher-dashboard/Finance";
import Lessons from "~/components/teacher-dashboard/Lessons";
import Navigation from "~/components/teacher-dashboard/Navigation";
import Profile from "~/components/teacher-dashboard/Profile";
import useApi from "~/services/axios-service";
import { teacherData, teacherDataRaw, user } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";

export async function loader({ request }: LoaderFunctionArgs) {
  const uuidSecret = process.env.UUID_SECRET;
  const uuidName = process.env.UUID_NAME;
  const backendUrl = process.env.BACKEND_API_URL;
  return Response.json({
    backendUrl,
    uuidSecret,
    uuidName,
  });
}
function Teacherdashboard() {
  const [teacher_data,setteacher_data] = useState<teacherData>();
  const [user_details,setuser_details] = useState<user>();
  const { uuidSecret, uuidName, backendUrl } = useLoaderData<typeof loader>();
  const api = useApi(backendUrl);
  useEffect(() => {
    getTeacherDetails();
  }, []);

  const getTeacherDetails = async () =>{
    const cookieToken = Cookies.get(uuidName);
    const token = decryptToken(cookieToken!,uuidSecret);
    const response:teacherDataRaw = (await api.post("teacher-api/get-teacher-details",null,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })).data;
      if(!response.proceed){
        toast.error(response.message);
        return;
      }
      setuser_details(response.basic_data);
      setteacher_data(response.teacher_data);

  }
  return (
    <div>
      <Navigation />
      <div className="w-full px-4 my-4 min-h-[300px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* userprofile section */}
        <Profile
          uuidName={uuidName}
          uuidSecret={uuidSecret}
          backendUrl={backendUrl}
        />
        <Finance />
        <Additionalprofile backendUrl={backendUrl} uuidName={uuidName} uuidSecret={uuidSecret} teacher_data={teacher_data!} basic_data={user_details!} />
        <Lessons />
      </div>
    </div>
  );
}

export default Teacherdashboard;
