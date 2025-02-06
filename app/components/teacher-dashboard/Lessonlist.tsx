import React, { useEffect, useState } from "react";
import empty from "../../images/empty.svg";
import { FaRegClipboard } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { LuClock10, LuMenu } from "react-icons/lu";
import trim from "~/services/basic";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/teacher-dashboard";
import useApi from "~/services/axios-service";
import Cookies from "js-cookie";
import { decryptToken } from "~/services/tokenManager";
import { lessonList, lessonModerators, lessons } from "~/services/interfaces";
import { formatDate } from "~/services/moment_function";
import toast from "react-hot-toast";
import EditLesson from "./EditLesson";

function Lessonlist({setcreatelesson}:lessonModerators) {
  const [haslessons, setHaslessons] = useState(true);
  const [editingLesson,seteditingLesson] = useState(false);
  const [editedid,seteditedid] = useState<number|null> (null);
  const [lessons,setLessons] = useState<lessons[]>([]);
  const { backendUrl, uuidSecret, uuidName } = useLoaderData<typeof loader>();
  const api = useApi(backendUrl);
  
  useEffect(()=>{
      getLesson();
  },[]);

  const editMode = (editid:number) => {
    seteditedid(editid);
    seteditingLesson(true);
  }

  const getLesson = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response:lessonList = (
        await api.post("teacher-api/get-lesson",null, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;

      if(response.proceed){
        setHaslessons(true);
        setLessons(response.lessons)
        return;
      }
  }else{
    window.location.href="/login";
  }
  }

  const deleteLesson = async  (lesson_id:number) =>{
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response:lessonList = (
        await api.post("teacher-api/delete-lesson",{id:lesson_id}, {
          headers: {
            Authorization: `Bearer ${decrypted}`,
          },
        })
      ).data;

      if(response.proceed){
      toast.success(response.message);
        getLesson();
        return;
      }
      if(!response.proceed){
        toast.error(response.message);
          return;
        }
  }
  }


  return (
    <div className="w-full min-h-[60%] p-4">
      {editingLesson && <div className="fixed top-0 left-0 right-0 bottom-0 z-10 w-full h-screen backdrop-blur-md">

        <EditLesson id={editedid!} setEditLesson={seteditingLesson}/>

      </div> }
      {haslessons && (
        <div className="bg-gray-50 p-4 rounded-sm mb-10">
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <h1 className="border-r-2 pr-4 font-bold text-xl">My lessons </h1>
              <span className="text-grey text-sm ">pending</span>
            </div>
            <button onClick={()=>setcreatelesson && setcreatelesson(true)}  className=" flex items-center justify-center h-[30px] px-3 rounded-md text-grey bg-beige_light border-none text-sm">
              <IoAdd />
              new
            </button>
          </div>
          {/* lesson lists starts here */}
          <div className=" w-full my-10">
            {lessons.map((each_lesson,index) =>(
              <div key={index}  className="flex items-center justify-around gap- my-8 hover:shadow-md transition-all p-4 shadow-sm">
              <h1>
                {trim(
                  each_lesson.lesson_name
                )}
              </h1>
              <div className="flex items-center justify-evenly text-sm gap-4">
                <span>{formatDate(each_lesson.start_time)}</span>
                <span className="flex items-center gap-2">
                  <LuClock10 />
                  {each_lesson.duration} mins
                </span>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <div tabIndex={0} role="button" className=" m-1">
                    <LuMenu />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-beige_light text-black rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li>
                      <button onClick={()=>editMode(each_lesson.id)}>edit</button>
                    </li>
                    <li>
                      <button onClick={()=>deleteLesson(each_lesson.id)}>delete</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            ))}
            
          </div>
        </div>
      )}
      {!haslessons && (
        <div className="w-full h-full my-4 flex items-center justify-center flex-col">
          <img className="w-[250px]" src={empty} alt="empty" />
          <h1 className="font-bold mt-10 text-[25px]">
            Create your first lesson
          </h1>
          <p className="text-grey text-center textt-sm my-2 w-[80%] mx-[10%]">
            Start earning with your very first lesson! Every lesson is an
            opportunity to generate income. Create your first lesson today and
            invite your students to join.
          </p>
          <button className="btn my-4 hover:bg-beige border-none text-white bg-main">
            create lesson
          </button>
        </div>
      )}
      {/* invite students */}
      <div className="mt-20 mx-[5%]">
        <h1 className="font-bold flex items-center gap-2">
          {" "}
          <div className=" w-2 h-2 animate-ping rounded-full bg-main delay-700">
            <div className=" w-2 h-2 animate-ping rounded-full bg-main "></div>
          </div>
          Invite student
        </h1>
        <p className="text-sm text-grey">
          If you already have a group of students share the link below with them{" "}
        </p>
        <div className="w-full flex gap-2 mt-4">
          <input
            className="bg-transparent h-[40px] rounded-md text-sm text-grey border border-gray-200 p-1 w-[80%]"
            type="text"
            value={`https://www.yavvir.com/signup?ref=9839093-mcke20-3ind0-pdk`}
          />
          <button className="w-[18%] flex items-center justify-center bg-main rounded-md text-sm text-white hover:bg-beige">
            <FaRegClipboard />
            copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lessonlist;
