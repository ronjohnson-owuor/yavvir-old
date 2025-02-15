import { Link, useLoaderData, useParams } from "@remix-run/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoaderFunctionArgs } from "react-router";
import useApi from "~/services/axios-service";
import { paymentData, paymentDataResponse } from "~/services/interfaces";
import { decryptToken } from "~/services/tokenManager";
import logo from "../../app/images/logo.png";
import { ArrowLeft, FolderOpen } from "lucide-react";

export async function loader({ request: _ }: LoaderFunctionArgs) {
  const uuidSecret = process.env.UUID_SECRET;
  const uuidName = process.env.UUID_NAME;
  const backendUrl = process.env.BACKEND_API_URL;
  return Response.json({
    backendUrl,
    uuidSecret,
    uuidName,
  });
}

function Paymenthistory() {
  const { uuidName, uuidSecret, backendUrl } = useLoaderData<typeof loader>();
  const [data, setData] = useState<paymentData[] | []>([]);

  const api = useApi(backendUrl);
  let params = useParams();
  const [status, setstatus] = useState(0);
  useEffect(() => {
    setstatus(Number(params.status));
  }, [params]);

  useEffect(() => {
    if (status != 0) {
      getPaymentHistory();
    }
  }, [status]);

  const getPaymentHistory = async () => {
    let cookieValue = Cookies.get(uuidName);
    if (cookieValue) {
      const decrypted = decryptToken(cookieValue, uuidSecret);
      const response: paymentDataResponse = (
        await api.post(
          "teacher-api/transaction-tracker",
          { status },
          {
            headers: {
              Authorization: `Bearer ${decrypted}`,
            },
          }
        )
      ).data;
      if (response.proceed) {
        console.log(response);
        setData(response.data);
        return;
      } else {
        toast.error("error retrieving your payment information");
      }
    }
  };

  return (
    <div>
      <div className="w-full h-[80px] shadow flex items-center justify-evenly">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" src={logo} alt="logo" />
          <h1>yavvir</h1>
        </div>
        <div className="flex items-center">
        <Link to="/teacher-dashboard">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </Link>
          <details className="dropdown">
            <summary className=" p-2 border cursor-pointer border-gray-300 rounded-md m-1">
              filter
            </summary>
            <ul className="menu dropdown-content rounded-box z-[1] w-52 p-2 shadow bg-beige_light">
              <li className="hover:bg-gray-50 p-2 rounded-md cursor-pointer" onClick={()=>setstatus(3)}>successfull</li>

              <li className="hover:bg-gray-50 p-2 rounded-md cursor-pointer" onClick={()=>setstatus(1)}>pending</li>

              <li className="hover:bg-gray-50 p-2 rounded-md cursor-pointer" onClick={()=>setstatus(2)}>error</li>
              <li className="hover:bg-gray-50 p-2 rounded-md cursor-pointer" onClick={()=>setstatus(4)}>all</li>
            </ul>
          </details>
        </div>
      </div>

      {data.length == 0 && <div className="w-full h-full flex items-center justify-center p-8">
      <div className="bg-[#F5F5DC] rounded-lg p-6 text-center shadow-md max-w-sm w-full mx-auto">
        <div className="flex justify-center mb-4">
          <FolderOpen className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No transaction found
        </h3>
        <p className="text-gray-500 text-sm">
          Your transactions folder is currently empty.create more lessons
        </p>
      </div>
    </div>}

      {data.length > 0 && <div className="overflow-x-auto my-10 sm:w-[80%] sm:mx-[10%] border">
        <table className="table max-h-screen overflow-scroll">
          {/* head */}
          <thead className="bg-beige text-white ">
            <tr>
              <th className="border">#</th>
              <th className="border">status</th>
              <th className="border">amount</th>
            </tr>
          </thead>
          <tbody className="my-4 bg-gray-50">
            {data &&
              data.map((each_data, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td className="flex items-center gap-2">
                    <p
                      className={`w-3 h-3 rounded-full ${
                        each_data.status == 1
                          ? "bg-yellow-500 animate-pulse"
                          : each_data.status == 3
                          ? "bg-main"
                          : "bg-red-500 animate-none"
                      }`}
                    ></p>
                    <p>
                      {each_data.status == 1
                        ? "pending payment"
                        : each_data.status == 3
                        ? "paid to account"
                        : "not paid to account"}
                    </p>
                  </td>
                  <td>{each_data.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
}

export default Paymenthistory;
