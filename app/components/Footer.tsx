import { Link } from "@remix-run/react";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Footer() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div
      data-aos="fade-up"
      className="mt-32 bg-beige_light h-[250px] overflow-clip w-full grid grid-cols-3 place-items-center
    "
    >
      <div>
        <img
          className="w-[40px] rounded-[100vh]"
          src="../../public/logo.svg"
          alt="logo"
        />
        <p>yavvir by zeron Labs</p>
        <p>nairobi,Kenya</p>
        <p className="underline">&copy; yavvir, &copy; zeron labs</p>
      </div>
      <div>
        <h3 className="font-bold mb-4">useful links</h3>
        <ul>
          <li className="underline italic">
            <Link to="">become a student</Link>
          </li>
          <li className="underline italic">
            <Link to="">become an educator</Link>
          </li>
          <li className="underline italic">
            <Link to="">register a child</Link>
          </li>
          <li className="underline italic">
            <Link to="">contact us</Link>
          </li>
          <li className="underline italic">
            <Link to="">about us</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <li className="underline italic">
            <Link to="">terms and conditions</Link>
          </li>
          <li className="underline italic">
            <Link to="">privacy</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
