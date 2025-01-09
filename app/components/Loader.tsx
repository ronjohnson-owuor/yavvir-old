import React, { useEffect, useState } from "react";

interface props{
    text?:string
}
function Loader({text}:props) {
  const [no_bg, setno_bg] = useState(true);
  const [background, setBackground] = useState("logo_no_background.svg");

  useEffect(() => {
    const loader = setInterval(() => {
      setno_bg((prev)=>!prev);
    }, 2000);
    return () => clearInterval(loader);
  }, []);

  useEffect(() => {
    setBackground(no_bg ? "logo.svg" : "logo_no_background.svg");
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
