import { LoaderFunctionArgs } from "@remix-run/node";
import {
  data,
  Link,
  redirect,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { generateAuthUrl } from "~/services/google";
import CryptoJS from "crypto-js";
import { CiEdit } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiShowAlt } from "react-icons/bi";
import { LuEyeClosed } from "react-icons/lu";
import axios from "axios";
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

export async function loader({ request }: LoaderFunctionArgs) {
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

interface dataInterface {
  email: string;
  picture: string;
  username: string;
}

interface userdetails {
  username: string;
  email: string;
  password: string;
  phone: string;
  picture: string;
  type: number;
}

interface serverResponse {
  message: string;
  proceed: boolean;
  url?: string;
  token?: string;
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

  const [userdetails, setuserdetails] = useState<userdetails>({
    username: "",
    email: "",
    password: "",
    phone: "",
    picture: "",
    type: 1, //1 for student,2 for teachers and 3 for parents
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

  // getting user data
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

  // check the number if its wrong
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

  const [checked, setChecked] = useState<null | number>(null);
  const checkaccountType = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let value = JSON.parse(e.target.value);
    setChecked(value);
    setuserdetails((prev) => ({
      ...prev,
      type: value || prev.type,
    }));
  };

  const handleUserGoogleSignup = async (userdetails: userdetails) => {
    try {
      const response = (await api.post("signup-user", userdetails)).data as serverResponse;
      if (response.proceed) {
        if (response.token) {
          const encrypttoken = encryptToken(response.token, uuidSecret);
          if (encrypttoken.length !== 0) {
            Cookies.set(uuidName, encrypttoken);
            toast.success(response.message);
            // redirect user to respoective dashboard
            if (response.url) window.location.href = response.url;
          } else {
            toast.success("proceed to login please");
          }
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      // handle api request failure
      console.log(err);
      toast.error("There was an error...please try again later");
    }
  };

  /* normal signin logic */
  const [step, setStep] = useState(0);
  const normalSignin = async () => {
    if(userdetails.username.trim().length == 0 ){
      toast.error("username cannot be null");
      return
    }
    if(userdetails.phone.trim().length == 0 ){
      toast.error("phone cannot be null");
      return
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
    <div className="w-full min-h-screen border grid grid-cols-1 place-content-center">
      {!proceed && step == 0 && (
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
                <label className="text-grey text-md my-2" htmlFor="email">
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
              <div className="flex items-center flex-col w-full">
                <label className="flex items-center my-2" htmlFor="phone">
                  <RiLockPasswordLine className="text-md" /> &nbsp;phone number
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
              <button
                onClick={normalSignin}
                className="my-4 bg-main w-[80%] md:w-full h-[45px] rounded-md hover:text-white"
              >
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

      {/* next step of signup with google */}
      {proceed && step == 0 && (
        <div className=" md:w-[80%] w-full min-h-[600px] md:shadow-md rounded-md md:mx-[10%]">
          <div className="w-full py-4 flex items-center justify-center flex-col">
            <img src={picture} alt="user profile" className="rounded-md" />
            <h1 className="text-[30px] my-10 font-bold mb-2">{username}</h1>
            <p className="mb-4 text-main">finish your account setup</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 place-items-center w-full md:w-[70%] md:mx-[15%] p-2">
            <input
              type="text"
              className="bg-transparent w-full border text-center h-[40px] rounded-md"
              disabled
              value={`email: ${data?.email}`}
            />
            <div className="flex items-center w-full my-2 xl:w-[80%] ">
              <input
                className="bg-transparent w-full px-4 border text-center h-[40px] rounded-md"
                type="text"
                disabled
                value={"Username: " + data?.username}
              />
            </div>
            <div className=" my-4  w-full">
              <label className="flex items-center my-2" htmlFor="password">
                <RiLockPasswordLine className="text-md" /> &nbsp;Enter your
                password
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
                (EG: +2547***)
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
            <div className=" flex w-full items-center justify-center text-md my-2 ">
              <input
                type="radio"
                className="accent-main bg-white"
                value={1}
                checked={checked === 1}
                onChange={checkaccountType}
                name="account_type"
              />
              <p>student account</p>{" "}
            </div>
            <div className=" flex w-full items-center justify-center text-md my-2">
              <input
                type="radio"
                className="accent-main bg-white"
                value={2}
                checked={checked === 2}
                onChange={checkaccountType}
                name="account_type"
              />
              <p>teacher account</p>{" "}
            </div>
            <div className=" flex w-full items-center justify-center text-md  my-2">
              <input
                checked={checked === 3}
                type="radio"
                className="accent-main bg-white"
                value={3}
                onChange={checkaccountType}
                name="account_type"
              />
              <p> parental account</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              onClick={() => handleUserGoogleSignup(userdetails)}
              className="bg-main h-[40px] rounded-md hover:text-white w-[300px] my-4"
            >
              create account
            </button>
          </div>
        </div>
      )}

      {/* normal account login */}
      {step == 1 && (
        <div className="w-full h-screen grid place-content-center">
          <h1 className="font-bold text-xl">verify your email</h1>
          <p className="text-center">
            we have sent a code to <span>ronjohnsonowuor83@gmail.com</span>{" "}
          </p>
          <div className="my-10 flex flex-col items-start">
            <input
              onChange={(e) => setCode(Number(e.target.value))}
              className="border border-gray-200 rounded-md bg-transparent font-bold w-[250px] h-[40px] text-center"
              type="text"
              placeholder="0000"
            />

            <button
              onClick={verifyCode}
              className="w-[250px] p-2 h-[40px] bg-main text-white my-4 rounded"
            >
              verify
            </button>
            <div className="flex gap-4 items-center my-10">
              <Link
                className="font-extralight underline text-beige"
                to="/signup"
              >
                back
              </Link>
              <button  className="font-extralight underline text-beige">
                resend email
              </button>
            </div>
          </div>
        </div>
      )}
      {step == 2 && (
        <div className="w-full min-h-screen flex items-center justify-center flex-col p-4">
          <h1 className="font-bold text-xl">signup</h1>
          <p className="text-center">complete creating your account</p>
          <div className="my-10 flex flex-col items-center">
            <label htmlFor="name">full name</label>
            <input
              id="name"
              disabled
              value={userdetails.username}
              className="border border-gray-200 rounded-md bg-transparent font-bold  w-[300px] my-4 h-[40px]"
              type="text"
            />

            <label htmlFor="phone">phone number</label>
            <input
              id="phone"
              disabled
              value={userdetails.phone}
              className="border border-gray-200 rounded-md bg-transparent font-bold  w-[300px] my-4 h-[40px]"
              type="text"
            />
            <label htmlFor="email">email</label>
            <input
            value={userdetails.email}
              id="email"
              className="border border-gray-200 rounded-md bg-transparent font-bold  w-[300px] my-4 h-[40px]"
              type="email"
            />
            <label htmlFor="password">password</label>
            <input
            onChange={(e)=> setuserdetails(prev =>({
              ...prev,
              password:e.target.value || prev.password
            }))}
              id="password"
              className="border border-gray-200 rounded-md bg-transparent font-bold  w-[300px] my-4 h-[40px]"
              type="password"
            />
            {/* role teacher student etc*/}
            <div className="w-full my-4 flex items-center flex-col">
              <p className="w-[50%]">choose the type of account you want to create eg teacher student or parent account</p>
            <Select onValueChange={(value)=>setuserdetails(prev =>({
              ...prev,
              type: Number(value) || prev.type
            }))}>
              <SelectTrigger className="w-[180px]">
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
            <button onClick={()=> handleUserGoogleSignup(userdetails)}  className=" w-[300px] my-4 p-2 h-[40px] bg-main text-white my-4 rounded">
              signup
            </button>
            <div className="flex gap-4 items-center my-10">
              <Link
                className="font-extralight underline text-beige"
                to="/"
              >
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
