import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { generateAuthUrl } from "~/services/google";
import CryptoJS from "crypto-js";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiShowAlt } from "react-icons/bi";
import { LuEyeClosed } from "react-icons/lu";
import useApi from "~/services/axios-service";
import toast from "react-hot-toast";
import { encryptToken } from "~/services/tokenManager";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  dataInterface,
  serverResponse,
  userdetails,
} from "~/services/interfaces";

export async function loader({ request: _ }: LoaderFunctionArgs) {
  const secret = process.env.SECRET_KEY;
  const uuidSecret = process.env.UUID_SECRET;
  const uuidName = process.env.UUID_NAME;
  const backendUrl = process.env.BACKEND_API_URL;
  return Response.json({
    googleAuthUrl: generateAuthUrl("register"),
    secret,
    backendUrl,
    uuidSecret,
    uuidName,
  });
}

function Teachersignup() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(0);
  const { googleAuthUrl, secret, backendUrl, uuidName, uuidSecret } =
    useLoaderData<typeof loader>();
  const api = useApi(backendUrl);
  const [proceed, setProceed] = useState(false);
  const [data, setData] = useState<dataInterface>();
  const [username, setUsername] = useState("");
  const [picture, setPicture] = useState("");
  const [wrongnumber, setwrongnumber] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const [isdisabled,setisdisabled] = useState(true);

  const [userdetails, setuserdetails] = useState<userdetails>({
    username: "",
    email: "",
    password: "",
    phone: "",
    picture: "",
    type: null, //1 for student,2 for teachers and 3 for parents
  });
  useEffect(() => {
    setPicture(data?.picture!);
    setUsername(data?.username!);
    setuserdetails((prev) => ({
      ...prev,
      email: data?.email || prev.email,
      picture: data?.picture || prev.picture,
    }));
  }, [data]);

  useEffect(() => {
    setuserdetails((prev) => ({
      ...prev,
      username: username || prev.username,
    }));
  }, [username]);

  // getting user data from the url
  useEffect(() => {
    const encryptedData = params.get("data");
    if (encryptedData) {
      try {
        const decryptedString = CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedData),
          secret!
        ).toString(CryptoJS.enc.Utf8);

        const data = JSON.parse(decryptedString);
        setData(data);
        if (data?.proceed) {
          setProceed(true);
        }
      } catch (error) {
        console.error("Error decrypting or parsing data:", error);
      }
    }
  }, [params]);

  const checkNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    var numberInarray = [...e.target.value];
    if (numberInarray.length > 9) {
      setwrongnumber(true);
      numberInarray = [];
      e.target.value = "";
      setTimeout(() => {
        setwrongnumber(false);
      }, 1000);
      toast.error("phone number is invalid");
      return;
    }
    setuserdetails((prev) => ({
      ...prev,
      phone: `+254${e.target.value}` || prev.password,
    }));
  };

  const checkaccountType = (value_string: string) => {
    let value = Number(value_string);
    setuserdetails((prev) => ({
      ...prev,
      type: value || prev.type,
    }));
  };

  const handleUserSignup = async (userdetails: userdetails) => {
    if (!userdetails.type) {
      toast.error("not account type selected");
      return;
    }
    try {
      setisdisabled(true);
      const response = (await api.post("signup-user", userdetails))
        .data as serverResponse;
      if (response.proceed) {
        if (response.token) {
          const encrypttoken = encryptToken(response.token, uuidSecret);
          if (encrypttoken.length !== 0) {
            Cookies.set(uuidName, encrypttoken,{expires:40});
            toast.success(response.message);
            if (response.url) window.location.href = response.url;
          } else {
            toast.success("proceed to login please");
          }
        }
      } else {
        setisdisabled(false);
        toast.error(response.message);
      }
    } catch (err) {
      setisdisabled(false);
      toast.error("There was an error...please try again later");
    }
  };

  /* normal signin logic */
  const [step, setStep] = useState(0);
  const normalSignin = async () => {
    if (userdetails.username.trim().length == 0) {
      toast.error("username cannot be null");
      return;
    }
    if (userdetails.phone.trim().length == 0) {
      toast.error("phone cannot be null");
      return;
    }
    const response = (
      await api.post("generate-email-code", { email: userdetails.email })
    ).data as serverResponse;
    if (!response.proceed) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
    setStep(1);
  };

  // verify the code sent
  const verifyCode = async () => {
    const response = (
      await api.post("verify-email-code", { email: userdetails.email, code })
    ).data as serverResponse;
    if (!response.proceed) {
      toast.error(response.message);
      return;
    }
    if (response.proceed) {
      toast.success(response.message);
      setStep(2);
      setProceed(response.proceed);
      return;
    }
  };

  return (
    <div
      className="w-full min-h-screen border grid grid-cols-1 place-content-center"
      style={{
        backgroundImage: `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='35.584' height='30.585' patternTransform='scale(2) rotate(25)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(46,74.4%,92.4%,1)'/><path d='M36.908 9.243c-5.014 0-7.266 3.575-7.266 7.117 0 3.376 2.45 5.726 5.959 5.726 1.307 0 2.45-.463 3.244-1.307.744-.811 1.125-1.903 1.042-3.095-.066-.811-.546-1.655-1.274-2.185-.596-.447-1.639-.894-3.162-.546-.48.1-.778.58-.662 1.06.1.48.58.777 1.06.661.695-.149 1.274-.066 1.705.249.364.265.546.645.562.893.05.679-.165 1.308-.579 1.755-.446.48-1.125.744-1.936.744-2.55 0-4.188-1.538-4.188-3.938 0-2.466 1.44-5.347 5.495-5.347 2.897 0 6.008 1.888 6.388 6.058.166 1.804.067 5.147-2.598 7.034a.868.868 0 00-.142.122c-1.311.783-2.87 1.301-4.972 1.301-4.088 0-6.123-1.952-8.275-4.021-2.317-2.218-4.7-4.518-9.517-4.518-4.094 0-6.439 1.676-8.479 3.545.227-1.102.289-2.307.17-3.596-.496-5.263-4.567-7.662-8.159-7.662-5.015 0-7.265 3.574-7.265 7.116 0 3.377 2.45 5.727 5.958 5.727 1.307 0 2.449-.463 3.243-1.308.745-.81 1.126-1.903 1.043-3.095-.066-.81-.546-1.654-1.274-2.184-.596-.447-1.639-.894-3.161-.546-.48.1-.778.58-.662 1.06.099.48.579.777 1.059.66.695-.148 1.275-.065 1.705.25.364.264.546.645.563.893.05.679-.166 1.307-.58 1.754-.447.48-1.125.745-1.936.745-2.549 0-4.188-1.539-4.188-3.939 0-2.466 1.44-5.345 5.495-5.345 2.897 0 6.008 1.87 6.389 6.057.163 1.781.064 5.06-2.504 6.96-1.36.864-2.978 1.447-5.209 1.447-4.088 0-6.124-1.952-8.275-4.021-2.317-2.218-4.7-4.518-9.516-4.518v1.787c4.088 0 6.123 1.953 8.275 4.022 2.317 2.218 4.7 4.518 9.516 4.518 4.8 0 7.2-2.3 9.517-4.518 2.151-2.069 4.187-4.022 8.275-4.022s6.124 1.953 8.275 4.022c2.318 2.218 4.701 4.518 9.517 4.518 4.8 0 7.2-2.3 9.516-4.518 2.152-2.069 4.188-4.022 8.276-4.022s6.123 1.953 8.275 4.022c2.317 2.218 4.7 4.518 9.517 4.518v-1.788c-4.088 0-6.124-1.952-8.275-4.021-2.318-2.218-4.701-4.518-9.517-4.518-4.103 0-6.45 1.683-8.492 3.556.237-1.118.304-2.343.184-3.656-.497-5.263-4.568-7.663-8.16-7.663z'  stroke-width='1' stroke='none' fill='%23b9b9b9ff'/><path d='M23.42 41.086a.896.896 0 01-.729-.38.883.883 0 01.215-1.242c2.665-1.887 2.764-5.23 2.599-7.034-.38-4.187-3.492-6.058-6.389-6.058-4.055 0-5.495 2.88-5.495 5.346 0 2.4 1.639 3.94 4.188 3.94.81 0 1.49-.265 1.936-.745.414-.447.63-1.076.58-1.755-.017-.248-.2-.629-.547-.893-.43-.315-1.026-.398-1.704-.249a.868.868 0 01-1.06-.662.868.868 0 01.662-1.059c1.523-.348 2.566.1 3.161.546.729.53 1.209 1.374 1.275 2.185.083 1.191-.298 2.284-1.043 3.095-.794.844-1.936 1.307-3.244 1.307-3.508 0-5.958-2.35-5.958-5.726 0-3.542 2.25-7.117 7.266-7.117 3.591 0 7.663 2.4 8.16 7.663.347 3.79-.828 6.868-3.344 8.656a.824.824 0 01-.53.182zm0-30.585a.896.896 0 01-.729-.38.883.883 0 01.215-1.242c2.665-1.887 2.764-5.23 2.599-7.034-.381-4.187-3.493-6.058-6.389-6.058-4.055 0-5.495 2.88-5.495 5.346 0 2.4 1.639 3.94 4.188 3.94.81 0 1.49-.266 1.936-.746.414-.446.629-1.075.58-1.754-.017-.248-.2-.629-.547-.894-.43-.314-1.026-.397-1.705-.248A.868.868 0 0117.014.77a.868.868 0 01.662-1.06c1.523-.347 2.566.1 3.161.547.729.53 1.209 1.374 1.275 2.185.083 1.191-.298 2.284-1.043 3.095-.794.844-1.936 1.307-3.244 1.307-3.508 0-5.958-2.35-5.958-5.726 0-3.542 2.25-7.117 7.266-7.117 3.591 0 7.663 2.4 8.16 7.663.347 3.79-.828 6.868-3.344 8.656a.824.824 0 01-.53.182zm29.956 1.572c-4.8 0-7.2-2.3-9.517-4.518-2.151-2.069-4.187-4.022-8.275-4.022S29.46 5.486 27.31 7.555c-2.317 2.218-4.7 4.518-9.517 4.518-4.8 0-7.2-2.3-9.516-4.518C6.124 5.486 4.088 3.533 0 3.533s-6.124 1.953-8.275 4.022c-2.317 2.218-4.7 4.518-9.517 4.518-4.8 0-7.2-2.3-9.516-4.518-2.152-2.069-4.188-4.022-8.276-4.022V1.746c4.8 0 7.2 2.3 9.517 4.518 2.152 2.069 4.187 4.022 8.275 4.022s6.124-1.953 8.276-4.022C-7.2 4.046-4.816 1.746 0 1.746c4.8 0 7.2 2.3 9.517 4.518 2.151 2.069 4.187 4.022 8.275 4.022s6.124-1.953 8.275-4.022c2.318-2.218 4.7-4.518 9.517-4.518 4.8 0 7.2 2.3 9.517 4.518 2.151 2.069 4.187 4.022 8.275 4.022s6.124-1.953 8.275-4.022c2.317-2.218 4.7-4.518 9.517-4.518v1.787c-4.088 0-6.124 1.953-8.275 4.022-2.317 2.234-4.717 4.518-9.517 4.518z'  stroke-width='1' stroke='none' fill='%23a5a9b1ff'/></pattern></defs><rect width='800%' height='800%' transform='translate(-28,-118)' fill='url(%23a)'/></svg>")`,
      }}
    >
      {!proceed && step == 0 && (
        <div className=" shadow-md rounded-md w-full xl:w-[60%] xl:mx-[20%] min-h-[400px] grid grid-cols-1 md:grid-cols-2">
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
          <div className="bg-white">
            <div className="my-10 p-4 text-center md:text-start ">
              <h3 className="font-bold text-[40px] md:text-[30px]">signup</h3>
              <p className="text-sm">
                Have an account
                <Link className="text-main underline" to="/login">
                  login
                </Link>
              </p>
            </div>
            <div className="flex flex-col p-4 my-4 w-full md:w-[85%] items-center md:items-start">
              <div className="flex flex-col my-2 w-[80%] md:w-full">
                <label className="text-black text-md my-2" htmlFor="user_name">
                  full name
                </label>
                <input
                  onChange={(e) =>
                    setuserdetails((prev) => ({
                      ...prev,
                      username: e.target.value || prev.username,
                    }))
                  }
                  type="text"
                  id="user_name"
                  className="bg-transparent border border-gray-400 h-[45px] rounded-md"
                />
              </div>
              <div className="flex flex-col my-2 w-[80%] md:w-full">
                <label className="text-black text-md my-2" htmlFor="email">
                  email
                </label>
                <input
                  onChange={(e) =>
                    setuserdetails((prev) => ({
                      ...prev,
                      email: e.target.value || prev.email,
                    }))
                  }
                  type="email"
                  id="email"
                  className="bg-transparent border border-gray-400 h-[45px] rounded-md"
                />
              </div>
              <div className="flex items-start flex-col w-[80%] xl:w-full ">
                <label className="flex items-center my-2" htmlFor="phone">
                  <RiLockPasswordLine className="text-md" /> &nbsp;phone number
                </label>
                <div
                  className={`w-full flex items-center ${
                    wrongnumber
                      ? "border-red-500 border-2"
                      : "border border-gray-400"
                  } rounded-md`}
                >
                  <div className="flex items-center">
                    <p className="px-2">🇰🇪</p> <p>+254</p>
                  </div>
                  <input
                    className="bg-transparent outline-none w-full h-[40px] rounded-md"
                    type="text"
                    onChange={checkNumber}
                  />
                </div>
              </div>
              <button
                onClick={normalSignin}
                className="my-4 bg-main w-[80%] md:w-full h-[45px] rounded-md hover:text-white"
              >
                sign in
              </button>

              <div className="my-10 w-full ">
                <div className="grid grid-cols-3 text-black place-content-center">
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

      {/* next step of signup with google */}
      {proceed && step == 0 && (
        <div className=" md:w-[80%] bg-white w-full min-h-[600px] md:shadow-md rounded-md md:mx-[10%]">
          <div className="w-full py-4 flex items-center justify-center flex-col">
            <img src={picture} alt="user profile" className="rounded-md" />
            <h1 className="text-[30px] my-10 font-bold mb-2">{username}</h1>
            <p className="mb-4 text-main font-bold text-xl sm:text-[25px]">
              finish your account setup
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 place-items-center  w-[80%] mx-[10%] p-2">
            <input
              type="text"
              className="bg-transparent border text-gray-300 text-sm w-full shadow-inner my-4 text-center h-[40px] rounded-md"
              disabled
              value={`email: ${data?.email}`}
            />
            <div className="flex items-center w-full my-2 xl:w-[80%] ">
              <input
                className="bg-transparent border text-gray-300 text-sm w-full px-4 shadow-inner my-4 text-center h-[40px] rounded-md"
                type="text"
                disabled
                value={"Username: " + data?.username}
              />
            </div>
            <div className=" my-4  w-full">
              <label className="flex items-center my-2" htmlFor="password">
                <RiLockPasswordLine className="text-md" /> &nbsp;Enter your
                password <span className="text-red-500 italic"> *</span>
              </label>
              <div className="flex items-center">
                <input
                  onChange={(e) =>
                    setuserdetails((prev) => ({
                      ...prev,
                      password: e.target.value || prev.password,
                    }))
                  }
                  className="bg-transparent border w-full h-[40px] rounded-tl-md rounded-bl-md"
                  type={showpassword ? "text" : "password"}
                />
                <button
                  onClick={() => setshowpassword((prev) => !prev)}
                  className="flex items-center justify-center w-[80px] h-[40px] bg-main rounded-tr-md rounded-br-md"
                >
                  {showpassword ? <BiShowAlt /> : <LuEyeClosed />}
                  <p>{showpassword ? "hide" : "show"}</p>
                </button>
              </div>
            </div>
            <div className="flex items-center flex-col w-full xl:w-[80%]">
              <label className="flex items-center my-2" htmlFor="phone">
                <RiLockPasswordLine className="text-md" /> &nbsp;phone number
                (EG: +2547***) <span className="text-red-500 italic"> *</span>
              </label>
              <div
                className={`w-full flex items-center ${
                  wrongnumber ? "border-red-500 border-2" : "border"
                } rounded-md`}
              >
                <div className="flex items-center">
                  <p className="px-2">🇰🇪</p> <p>+254</p>
                </div>
                <input
                  className="bg-transparent outline-none w-full h-[40px] rounded-md"
                  type="text"
                  onChange={checkNumber}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:flex flex-col md:items-center md:justify-center my-10 px-2 gap-2">
            <h3 className="font-bold my-2 w-full text-center">
              what account are you creating?
            </h3>
            <div className="w-[80%] mx-[10%]">
              <Select onValueChange={(value) => checkaccountType(value)}>
                <SelectTrigger className="w-full my-4">
                  <SelectValue placeholder="account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>account type</SelectLabel>
                    <SelectItem value={"1"}>student account</SelectItem>
                    <SelectItem value={"2"}>teacher account</SelectItem>
                    <SelectItem value={"3"}>parent account</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
            disabled={isdisabled}
              onClick={() => handleUserSignup(userdetails)}
              className="bg-main h-[40px] rounded-md hover:text-white w-[300px] my-4 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
             {isdisabled ? <div className="text-sm flex items-center justify-center gap-2"><span className="loading loading-spinner loading-xs"></span> <span>creating account ...</span></div> :"create account"}
            </button>
          </div>
        </div>
      )}

      {/* normal account login */}
      {step == 1 && (
        <div className="w-full p-4 bg-gradient-to-b from-beige_light to-beige h-screen flex items-center justify-start flex-col">
          <h1 className="font-bold w-full text-center mb-4 text-[25px] mt-10 md:mt-0 ">
            🔐 verify your email
          </h1>
          <center>
            <p className="text-center text-sm">
              we have sent a verification code to{" "}
              <span className="text-main font-bold">
                💌 ronjohnsonowuor83@gmail.com
              </span>{" "}
            </p>
          </center>
          <div className="my-10 flex flex-col items-center">
            <input
              onChange={(e) => setCode(Number(e.target.value))}
              className="border w-full border-gray-500 rounded-md bg-transparent font-bold h-[40px] text-center text-[30px]"
              type="text"
              placeholder="0000"
            />

            <button
              onClick={verifyCode}
              className=" w-full p-2 h-[40px] bg-main text-white my-4 rounded"
            >
              verify
            </button>
            <div className="flex gap-4 items-center my-10">
              <Link
                className="font-extralight underline text-black"
                to="/signup"
              >
                back
              </Link>
              <button
                onClick={normalSignin}
                className="font-extralight underline text-black"
              >
                🔁resend email
              </button>
            </div>
          </div>
        </div>
      )}
      {step == 2 && (
        <div className="w-full min-h-screen flex items-center justify-center flex-col p-4 bg-gradient-to-b from-beige_light to-beige">
          <h1 className="font-bold text-[40px]">signup page</h1>
          <p className="text-center text-sm">complete creating your account</p>
          <div className="my-10 w-full xl:w-[40%] xl:mx-[30%] p-4 flex flex-col items-center">
            <label className="w-[80%] mx-[10%] text-start" htmlFor="name">
              full name
            </label>
            <input
              id="name"
              disabled
              value={userdetails.username}
              className=" bg-white p-2 text-black rounded-md bg-transparent font-bold  w-[80%] mx-[10%] my-4 h-[40px]"
              type="text"
            />

            <label className="w-[80%] mx-[10%] text-start" htmlFor="phone">
              phone number
            </label>
            <input
              id="phone"
              disabled
              value={userdetails.phone}
              className=" bg-white p-2 text-black rounded-md bg-transparent font-bold  w-[80%] mx-[10%] my-4 h-[40px]"
              type="text"
            />
            <label className="w-[80%] mx-[10%] text-start" htmlFor="email">
              email
            </label>
            <input
              disabled
              value={userdetails.email}
              id="email"
              className=" bg-white p-2 text-black rounded-md bg-transparent font-bold  w-[80%] mx-[10%] my-4 h-[40px]"
              type="email"
            />
            <label className="w-[80%] mx-[10%] text-start" htmlFor="password">
              password <span className="text-red-500 italic ">fill here *</span>
            </label>
            <input
              onChange={(e) =>
                setuserdetails((prev) => ({
                  ...prev,
                  password: e.target.value || prev.password,
                }))
              }
              id="password"
              className=" bg-white p-2 text-black rounded-md bg-transparent font-bold  w-[80%] mx-[10%] my-4 h-[40px]"
              type="password"
            />
            {/* role teacher student etc*/}
            <div className="w-full my-4 flex items-center flex-col">
              <p className="w-[80%] mx-[10%]">
                choose the type of account you want to create eg teacher student
                or parent account{" "}
                <span className="text-red-500 italic ">fill here *</span>
              </p>
              <Select
                onValueChange={(value) =>
                  setuserdetails((prev) => ({
                    ...prev,
                    type: Number(value) || prev.type,
                  }))
                }
              >
                <SelectTrigger className="w-[80%] my-4">
                  <SelectValue placeholder="account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>account type</SelectLabel>
                    <SelectItem value={"1"}>student account</SelectItem>
                    <SelectItem value={"2"}>teacher account</SelectItem>
                    <SelectItem value={"3"}>parent account</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={() => handleUserSignup(userdetails)}
              className=" w-[80%] mx-[10%] my-4 p-2 h-[40px] bg-main text-white my-4 rounded"
            >
              signup
            </button>
            <div className="flex gap-4 items-center my-10">
              <Link className="font-extralight underline text-beige" to="/">
                terms and conditions
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachersignup;
