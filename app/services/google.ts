import { OAuth2Client } from "google-auth-library";
/* 
every time you make a change to the 
.env file you must  restart the development server for
 the env to make changes
*/

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_REDIRECT_URI
) {
  throw new Error(
    "Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI"
  );
}

const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const generateAuthUrl = (state: string) => {
  return oauthClient.generateAuthUrl({
    access_type: "online",
    scope: ["https://www.googleapis.com/auth/userinfo.email"],
    state,
  });
};
