import { LoaderFunctionArgs } from "@remix-run/node";
import { data, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { generateAuthUrl } from "~/services/google";
import CryptoJS from "crypto-js";

const secret = process.env.SECRET_KEY;

export async function loader({ request }: LoaderFunctionArgs) {
  return Response.json({ googleAuthUrl: generateAuthUrl("register") });
}

function Teachersignup() {
  const [params] = useSearchParams();
  const { googleAuthUrl } = useLoaderData<typeof loader>();
  // check if there is data one the url and decode it
  const encryptedData = params.get("data");
  const shouldProceed = () => {
    if (encryptedData) {
      const data = JSON.parse(
        CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedData),
          secret!
        ).toString(CryptoJS.enc.Utf8)
      );
      if (data) {
        return data.proceed;
      }
      return false;
    }
    return false;
  };

  return (
    <div className="w-full min-h-screen border grid grid-cols-1 place-content-center">
      {!shouldProceed() && (
        <div className=" shadow-md rounded-md w-full xl:w-[60%] xl:mx-[20%] min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-full bg-main rounded-tl-md rounded-bl-md">
            {/* heading */}
            <div className="my-10 text-white w-full">
              <h3 className="font-bold mx-[10%]">
                <Link to="/">YAVVIR</Link>
              </h3>
            </div>
            {/* body */}
            <div className="my-10 text-white p-4">
              <h1 className="font-bold text-[40px]">
                Start your journey with us
              </h1>
              <p className="text-md md:text-sm my-4">
                Join one of Kenya's tution platform,register your child or start
                earning by teaching what you know to ambitious student
                countrywide.The best place to better your grades.
              </p>
            </div>
          </div>
          {/* signup page */}
          <div>
            <div className="my-10 p-4 text-center md:text-start">
              <h3 className="font-bold text-[40px] md:text-[30px]">signup</h3>
              <p className="text-sm">
                Have an account{" "}
                <Link className="text-main underline" to="">
                  login
                </Link>
              </p>
            </div>
            <div className="flex flex-col p-4 my-4 w-full md:w-[85%] items-center md:items-start">
              <div className="flex flex-col my-2 w-[80%] md:w-full">
                <label className="text-grey text-md my-2" htmlFor="user_name">
                  full name
                </label>
                <input
                  type="text"
                  id="user_name"
                  className="bg-transparent border border-gray-400 h-[45px] rounded-md"
                />
              </div>
              <div className="flex flex-col my-2 w-[80%] md:w-full">
                <label className="text-grey text-md my-2" htmlFor="email">
                  email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-transparent border border-gray-400 h-[45px] rounded-md"
                />
              </div>
              <div className="flex flex-col my-2 w-[80%] md:w-full">
                <label className="text-grey text-md my-2" htmlFor="phone">
                  phone( eg +2547***)
                </label>
                <input
                  type="text"
                  id="phone"
                  className="bg-transparent border border-gray-400 h-[45px] rounded-md"
                />
              </div>
              <button className="my-4 bg-main w-[80%] md:w-full h-[45px] rounded-md hover:text-white">
                sign in
              </button>

              <div className="my-10 w-full ">
                <div className="grid grid-cols-3 text-grey place-content-center">
                  <hr />
                  <p className="flex items-center font-bold justify-center">
                    or
                  </p>
                  <hr />
                </div>
                <div className="w-full p-2">
                  <a
                    href={googleAuthUrl}
                    className="bg-beige w-[80%] mx-[10%] md:mx-0 md:w-full h-[45px] rounded-md hover:text-white my-4  flex items-center justify-center gap-4 "
                  >
                    <FaGoogle />
                    signup with google
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachersignup;
