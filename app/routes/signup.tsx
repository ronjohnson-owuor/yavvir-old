import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { FaGoogle, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { generateAuthUrl } from "~/services/google";

export async function loader({ request }: LoaderFunctionArgs) {
    return Response.json({ googleAuthUrl: generateAuthUrl("register") });
  }

function Teachersignup() {
    const { googleAuthUrl } = useLoaderData<typeof loader>();
  return (
    <div className="w-full min-h-screen border grid grid-cols-1 place-content-center">
      <div className=" shadow-md rounded-md w-full xl:w-[60%] xl:mx-[20%] min-h-[400px] grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full bg-main rounded-tl-md rounded-bl-md">
          {/* heading */}
          <div className="my-10 text-white w-full">
            <h3 className="font-bold mx-[10%]">YAVVIR</h3>
          </div>
          {/* body */}
          <div className="my-10 text-white p-4">
            <h1 className="font-bold text-[40px]">
              Start your journey with us
            </h1>
            <p className="text-md md:text-sm my-4">
              Join Kenya's Leading Tuition Platform for Teachers! Unlock
              limitless earning potential while empowering students to excel.
              Your journey to financial growth and meaningful impact starts
              here.
            </p>
          </div>
          {/* testimonial */}
          <div className="hidden md:block text-white p-2 my-4 shadow-inner w-[80%] mx-[10%] rounded-md">
            <p>
              <FaQuoteLeft className="text-sm" />
              Jukwaa hili limebadilisha maisha yangu kama mwalimu. Kipato changu
              kimeongezeka,Naweza kufikia wanafunzi wengi kila sehemu nchini.
              <FaQuoteRight className="text-sm" />
            </p>
            <span className="my-4 text-sm italic underline ">
              Joseph Adinda,Mwalimu wa kiswahili,Nairobi
            </span>
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
                <p className="flex items-center font-bold justify-center">or</p>
                <hr />
              </div>
              <div className="w-full p-2">
                <a href={googleAuthUrl} className="bg-beige w-[80%] mx-[10%] md:mx-0 md:w-full h-[45px] rounded-md hover:text-white my-4  flex items-center justify-center gap-4 ">
                  <FaGoogle />
                  signup with google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teachersignup;
