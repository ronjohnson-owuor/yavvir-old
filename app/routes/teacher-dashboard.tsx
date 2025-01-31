import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React, { useState } from 'react'
import Additionalprofile from '~/components/teacher-dashboard/Additionalprofile';
import Finance from '~/components/teacher-dashboard/Finance';
import Lessons from '~/components/teacher-dashboard/Lessons';
import Navigation from '~/components/teacher-dashboard/Navigation'
import Profile from '~/components/teacher-dashboard/Profile'


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
    const { uuidSecret, uuidName, backendUrl } = useLoaderData<typeof loader>();
  return (
    <div>
      <Navigation/>
      <div className='w-full px-4 my-4 min-h-[300px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {/* userprofile section */}
        <Profile uuidName={uuidName} uuidSecret={uuidSecret} backendUrl={backendUrl}/>
        <Finance/>
        <Additionalprofile/>
        <Lessons/>

      </div>
      
    </div>
  )
}

export default Teacherdashboard