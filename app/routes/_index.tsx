import React from "react";
import type { MetaFunction } from "@remix-run/node";
import Home from "../components/Home";

export const meta: MetaFunction = () => {
  return [
    { title: "yavvir" },
    {
      name: "description",
      content:
        "home learning solutions for kenyan students,during the holiday and when they are at home",
    },
  ];
};

export default function Index() {
  return (
    <div className="">
      {/* <Loader/> */}
      <Home/>
    </div>
  );
}
