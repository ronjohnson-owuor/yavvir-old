import { useLoaderData } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiSolidCloudUpload } from "react-icons/bi";
import { loader } from "~/routes/teacher-dashboard";
import useApi from "~/services/axios-service";
import { modalInterface } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";

function Fileupload({ close }: modalInterface) {
  const { backendUrl, uuidName, uuidSecret } = useLoaderData<typeof loader>();
  const [filename, setfilename] = useState("");
  const api = useApi(backendUrl);

  const [title, settitle] = useState("");
  const [file, setfile] = useState<File | null>(null);

  const handleCertUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    let formData = new FormData();
    const token_encrypted = Cookies.get(uuidName);
    const token = decryptToken(token_encrypted!, uuidSecret);
    formData.append("title", title);
    formData.append("data", file);
    try {
      const response = (
        await api.post("teacher-api/upload-teacher-files", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ).data;
      if (response.proceed) {
        toast.success(response.message);
        return;
      }

      if (!response.proceed) {
        toast.error(response.message);
        return;
      }
    } catch (error) {
      toast.error("there was an error try again later");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="w-full min-h-screen backdrop-blur-lg fixed top-0 left-0 bottom-0">
      <div className="bg-white w-[80%] border flex items-center flex-col mx-[10%]">
        <h1 className="font-bold mt-4  ">Upload your certificate</h1>
        <p className="text-sm mb-4">upload one certificate at a time</p>

        <div className="my-10 w-[80%] mx-[10%]">
          <div className="flex flex-col">
            <label className="text-sm my-2" htmlFor="name">
              title of the certificate
            </label>
            <input
              onChange={(e) => settitle(e.target.value)}
              className="input bg-transparent input-bordered mb-4 "
              type="text"
              placeholder="eg: my degree / my cv"
            />
          </div>

          <div>
            <label
              className="w-full rounded-md cursor-pointer  p-4 flex flex-col items-center justify-center text-beige h-[150px] border-4 my-4 border-dotted"
              htmlFor="user_certificate"
            >
              <BiSolidCloudUpload className="text-lg" />
              <span>drag a document here or click to upload</span>
            </label>
            <input
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setfile(e.target.files[0]);
                  setfilename(e.target.files[0].name);
                }
              }}
              className="hidden"
              type="file"
              id="user_certificate"
            />
          </div>

          <div>
            <p
              className={`${filename && "animate-bounce text-main font-bold"}`}
            >
              file choosen: {filename}
            </p>
          </div>
          <div className="w-full flex gap-4 items-center">
            <button
              className="btn bg-main border-none w-[80%] text-white my-2"
              onClick={handleCertUpload}
            >
              save changes
            </button>
            <button
              onClick={() => close(false)}
              className="border hover:bg-beige bg-transparent text-black btn w-[10%]"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fileupload;
