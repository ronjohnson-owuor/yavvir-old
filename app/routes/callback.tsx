import React from "react";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getTokenFromCode } from "~/services/google";
import CryptoJS from "crypto-js";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // if the signup is not successfull redirect the user to the signup page
  if (!state || !code) {
    return redirect("/signup");
  }

  const idToken = await getTokenFromCode(code);
  // check if its login or signup

  if (idToken) {
    const data = {
      username: idToken.name,
      picture: idToken.picture,
      email: idToken.email,
      proceed: true,
    };

    // add data to the url
    const secret = process.env.SECRET_KEY || "";
    console.log(secret);
    const cipherText = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secret
    ).toString();

    // return the data to the initial page for user to continue with the signup
    return redirect(`/signup?data=${encodeURIComponent(cipherText)}`);
  }
  return redirect("/signup");
}

function Callback() {
  return (
    <>
      <h1>you will be automatically redirected...</h1>
    </>
  );
}

export default Callback;
