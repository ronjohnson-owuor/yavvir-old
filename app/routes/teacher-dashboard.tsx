import { LoaderFunctionArgs } from "@remix-run/node";
import React from "react";
import Additionalprofile from "~/components/teacher-dashboard/Additionalprofile";
import Finance from "~/components/teacher-dashboard/Finance";
import Lessons from "~/components/teacher-dashboard/Lessons";
import Navigation from "~/components/teacher-dashboard/Navigation";
import Profile from "~/components/teacher-dashboard/Profile";

export async function loader({ request: _ }: LoaderFunctionArgs) {
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
  return (
    <div className="w-full">
      <Navigation />
      <div className="w-full md:px-4 my-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <Profile />
        <Finance />
        <Lessons />
        <Additionalprofile />
      </div>
    </div>
  );
}

export default Teacherdashboard;
