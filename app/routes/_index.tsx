import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "yavvir" },
    { name: "description", content: "home learning solutions for kenyan students,during the holiday and when they are at home"},
  ];
};

export default function Index() {
  return (
    <div>
      <h1>hello world</h1>
    </div>
  );
}
