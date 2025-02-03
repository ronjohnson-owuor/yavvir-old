import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "~/components/ui/input";
import useApi from "~/services/axios-service";
import { serverResponse, userdata_login } from "~/services/interfaces";
import { encryptToken } from "~/services/tokenManager";
import logo from "../images/logo.svg";

export async function loader({ request: _ }: LoaderFunctionArgs) {
  const secret = process.env.SECRET_KEY;
  const uuidSecret = process.env.UUID_SECRET;
  const uuidName = process.env.UUID_NAME;
  const backendUrl = process.env.BACKEND_API_URL;
  return Response.json({
    secret,
    backendUrl,
    uuidSecret,
    uuidName,
  });
}

function login() {
  const { backendUrl, uuidName, uuidSecret } = useLoaderData<typeof loader>();
  const [userdata, setuserdata] = useState<userdata_login>({
    email: "",
    password: "",
  });
  const api = useApi(backendUrl);
  const[disabled,setdisabled]  = useState(false);

  const login = async () => {
    if (userdata.email.trim().length == 0) {
      toast.error("please enter your email");
      return;
    }
    if (userdata.password.trim().length == 0) {
      toast.error("please enter your password");
      return;
    }
    try {
      const response = (await api.post("login-user", userdata))
        .data as serverResponse;
        setdisabled(true);
      if (response.proceed) {
        if (response.token) {
          const encrypttoken = encryptToken(response.token, uuidSecret);
          if (encrypttoken.length !== 0) {
            Cookies.set(uuidName, encrypttoken,{expires:40});
            toast.success(response.message);
            if (response.url) window.location.href = response.url;
          } else {
            setdisabled(false);
            toast.error("unable to log you in at the moment try again later");
          }
        }
      } else {
        setdisabled(false);
        toast.error(response.message);
      }
    } catch (err) {
      setdisabled(false);
      toast.error("There was an error...please try again later");
    }
  };


  return (

    <div
  className="w-full min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg id='patternId' width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(7) rotate(40)'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='%23ffffff'/%3E%3Cpath d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z' stroke-width='0.1' stroke='%23dedcdcff' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='800%25' height='800%25' transform='translate(-154,-14)' fill='url(%23a)'/%3E%3C/svg%3E")`
  }}
>

      <div className=" p-4 h-full rounded-sm w-full md:w-[80%] xl:w-[40%]">
        <center><img src={logo} alt=" logo" className="w-[150px] h-[150px] rounded-full object-cover" /></center>
        <h1 className="font-bold my-2 text-[30px] text-center">welcome back</h1>
        <p className="text-center">
          don't have account{" "}
          <Link className="text-beige underline my-4" to="/signup">
            create account
          </Link>
        </p>
        <div className="flex flex-col gap-4 my-10">
          <div>
            <label htmlFor="email">Email</label>
            <Input
              onChange={(e) =>
                setuserdata((prev) => ({
                  ...prev,
                  email: e.target.value || prev.email,
                }))
              }
              type="email"
              id="email"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <Input
              onChange={(e) =>
                setuserdata((prev) => ({
                  ...prev,
                  password: e.target.value || prev.password,
                }))
              }
              type="password"
              id="password"
              placeholder="password"
            />
          </div>
          <button
          disabled={disabled}
            onClick={login}
            className=" w-full h-[40px] bg-main rounded-md hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default login;
