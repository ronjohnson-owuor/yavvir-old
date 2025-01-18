import { LoaderFunctionArgs } from "@remix-run/node";
import { data, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { generateAuthUrl } from "~/services/google";
import CryptoJS from "crypto-js";
import { CiEdit } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiShowAlt } from "react-icons/bi";
import { LuEyeClosed } from "react-icons/lu";

export async function loader({ request }: LoaderFunctionArgs) {
  const secret = process.env.SECRET_KEY;
  return Response.json({ googleAuthUrl: generateAuthUrl("register"), secret });
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
  picture:string;
  type:number;
}

function Teachersignup() {
  const [params] = useSearchParams();
  const { googleAuthUrl, secret } = useLoaderData<typeof loader>();
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
    picture:"",
    type:0 //0 for student,1 for teachers and 2 for parents
  });
  useEffect(() => {
    setPicture(data?.picture!);
    setUsername(data?.username!);
    setuserdetails((prev) => ({
      ...prev,
      username:username|| prev.username,
      email:data?.email||prev.email,
      picture:data?.picture||prev.picture,
    }));
  }, [data]);
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
      // add a custom toast dialog
      return;
    }
    setuserdetails(prev =>({
      ...prev,
      phone:`+254${e.target.value}` || prev.password
    }));
  };

  const [checked,setChecked] = useState<null| number>(null);
  const checkaccountType = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let value = JSON.parse(e.target.value);
    setChecked(value);
    setuserdetails(prev => ({
      ...prev,
      type:value||prev.type
    }));
  }

  return (
    <div className="w-full min-h-screen border grid grid-cols-1 place-content-center">
      {!proceed && (
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

      {/* next step of signup with google */}
      {proceed && (
        <div className="w-[80%] min-h-[600px] shadow-md rounded-md mx-[10%]">
          <div className="w-full py-4 flex items-center justify-center flex-col">
            <img src={picture} alt="user profile" className="rounded-md" />
            <h1 className="text-[30px] my-10 font-bold mb-2">{username}</h1>
            <p className="mb-4 text-main">finish your account setup</p>
          </div>
          <div className="grid grid-cols-2 place-items-center w-[70%] mx-[15%]">
            <input
              type="text"
              className="bg-transparent w-full border text-center h-[40px] rounded-md"
              disabled
              value={`email: ${data?.email}`}
            />
            <div className="flex items-center w-[80%] ">
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
                onChange={(e)=>setuserdetails(prev =>({
                  ...prev,
                  password:e.target.value || prev.password
                }))}
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
            <div className="flex items-center flex-col">
              <label className="flex items-center my-2" htmlFor="password">
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
          <div className="w-full flex flex-col items-center justify-center my-10">
            <h3 className="font-bold my-2">what account are you creating?</h3>
            <div className="grid grid-cols-2 my-2">
              <input
                type="radio"
                className="accent-main bg-white"
                value={0}
                checked={checked === 0}
                onChange={checkaccountType}
                name="account_type"
              />
              <p>student account</p>{" "}
            </div>
            <div className="grid grid-cols-2 my-2">
              <input
                type="radio"
                className="accent-main bg-white"
                value={1}
                checked={checked === 1}
                onChange={checkaccountType}
                name="account_type"
              />
              <p>teacher account</p>{" "}
            </div>
            <div className="grid grid-cols-2  my-2">
              <input
              checked={checked === 2}
                type="radio"
                className="accent-main bg-white"
                value={2}
                onChange={checkaccountType}
                name="account_type"
              />
              <p> parental account</p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <button onClick={()=> console.log(userdetails)}  className="bg-main h-[40px] rounded-md hover:text-white w-[300px] my-4">
              create account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachersignup;
