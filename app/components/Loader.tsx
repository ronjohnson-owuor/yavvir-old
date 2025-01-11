import React, { useEffect, useState } from "react";
import no_background from "../images/logo_no_background.svg";
import logo from "../images/logo.svg";

interface props{
    text?:string
}
function Loader({text}:props) {
  const [no_bg, setno_bg] = useState(true);
  const [background, setBackground] = useState(no_background);

  useEffect(() => {
    const loader = setInterval(() => {
      setno_bg((prev)=>!prev);
    }, 2000);
    return () => clearInterval(loader);
  }, []);

  useEffect(() => {
    setBackground(no_bg ? logo : no_background);
  }, [no_bg]);

  return (
    <div className="w-full h-screen overflow-clip grid place-content-center">
      <img className="w-[100px] transition-all ease-linear" src={background} alt="logo" />
      <p className="font-bold animate-pulse">
        {text?text:<>initializing <span className="text-main">yavvir</span>...</>}
      </p>
    </div>
  );
}

export default Loader;
