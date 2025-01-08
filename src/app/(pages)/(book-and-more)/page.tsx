import React from "react";
import HomeHero from "./components/home-contents/home-hero";
import HomeIntro from "./components/home-contents/home-intro";
import HowItWorks from "./components/home-contents/home-how-it-works";
import HomeFaqs from "./components/home-contents/home-faqs";

function Page() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HowItWorks />
      <HomeFaqs />
    </>
  );
}

export default Page;
