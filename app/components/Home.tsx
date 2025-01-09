import React from "react";
import Homenav from "./Homenav";
import Hero from "./Hero";
import Whyus from "./Whyus";
import Teachers from "./Teachers";
import Parents from "./Parents";
import Footer from "./Footer";

function Home() {
  return (
    <div>
      <Homenav/>
      <Hero/>
      <Whyus/>
      <Teachers/>
      <Parents/>
      <Footer/>
    </div>
  );
}

export default Home;
