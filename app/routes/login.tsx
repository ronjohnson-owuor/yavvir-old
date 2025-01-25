import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "~/components/ui/input";
import useApi from "~/services/axios-service";
import { encryptToken } from "~/services/tokenManager";

export async function loader({ request }: LoaderFunctionArgs) {
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

interface serverResponse {
  message: string;
  proceed: boolean;
  url?: string;
  token?: string;
}

interface userdata {
  email: string;
  password: string;
}

function login() {
  const { secret, backendUrl, uuidName, uuidSecret } =
    useLoaderData<typeof loader>();
  const [userdata, setuserdata] = useState<userdata>({
    email: "",
    password: "",
  });
  const api = useApi(backendUrl);

  // function to login the user
  const login = async () => {
    // validate email and password for frontend
    if (userdata.email.trim().length == 0) {
        console.log(userdata);
      toast.error("please enter your email");
      return
    }
    if (userdata.password.trim().length == 0) {
      toast.error("please enter your password");
      return
    }
    try {
      const response = (await api.post("login-user", userdata))
        .data as serverResponse;
      if (response.proceed) {
        if (response.token) {
          const encrypttoken = encryptToken(response.token, uuidSecret);
          if (encrypttoken.length !== 0) {
            Cookies.set(uuidName, encrypttoken);
            toast.success(response.message);
            if (response.url) window.location.href = response.url;
          } else {
            toast.error("unable to log you in at the moment try again later");
          }
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("There was an error...please try again later");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className=" p-4 h-full border rounded-sm">
        <h1 className="font-bold my-2 text-[30px]">welcome back</h1>
        <p>
          don't have account{" "}
          <Link className="text-beige underline my-4" to="/signup">
            create account
          </Link>
        </p>
        <div className="flex flex-col gap-4 my-10">
          <div>
            <label htmlFor="email">Email</label>
            <Input onChange={(e)=>setuserdata(prev =>({
                ...prev,
                email:e.target.value || prev.email
            }))} type="email" id="email" placeholder="Email" />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <Input onChange={(e)=>setuserdata(prev =>({
                ...prev,
                password:e.target.value || prev.password
            }))} type="password" id="password" placeholder="password" />
          </div>
          <button
            onClick={login}
            className="w-full h-[40px] bg-main rounded-md hover:text-white"
          >
            log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default login;
