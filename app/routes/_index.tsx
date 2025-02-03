import React, { useEffect, useState } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import Home from "../components/Home";
import Loader from "~/components/Loader";
import { useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import { decryptToken } from "~/services/tokenManager";
import useApi from "~/services/axios-service";
import { userdata } from "~/services/interfaces";

export const meta: MetaFunction = () => {
  return [
    { title: "yavvir" },
    {
      name: "description",
      content:
        "home learning solutions for kenyan students,during the holiday and when they are at home",
    },
  ];
};


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

export default function Index() {
  const { uuidSecret, uuidName, backendUrl } = useLoaderData<typeof loader>();
  const [loading, setloading] = useState(true);
  const api = useApi(backendUrl);
  useEffect(() => {
    validateUser();
  }, []);

  const validateUser = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      let decrypted = decryptToken(cookieValue, uuidSecret);
      // get more details about this user
      const response:userdata = (await api.get('get-user-data',{
        headers:{
          Authorization:`Bearer ${decrypted}`
        }
      })).data;
      if(response.proceed){
        window.location.href = `${response.user?.role}-dashboard`;
        setloading(false);
      }
      return;
    }
    setTimeout(() => {
      setloading(false);
    }, 3000);
    return;
  };

  return (
    <div>
      {loading && <Loader />}
      {!loading && <Home />}
    </div>
  );
}
