import React from "react";
import HomeHero from "./components/home-contents/home-hero";
import HomeIntro from "./components/home-contents/home-intro";
import HowItWorks from "./components/home-contents/home-how-it-works";
import DemoShowcase from "./components/home-contents/home-demo-showcase";
import HomeFaqs from "./components/home-contents/home-faqs";

function Page() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HowItWorks />
      {/* <DemoShowcase /> */}
      <HomeFaqs />
    </>
  );
}

export default Page;
