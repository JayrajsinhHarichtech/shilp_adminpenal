import React from "react";
import AboutUsContent from "../components/aboutpage/AboutUsForm";
import AboutUslist from "../components/aboutpage/AboutUsList";

const AboutPage = () => {
  return (
    <div className="page-content space-y-6">
      <AboutUsContent/>
      <AboutUslist/>
    </div>
  );
};

export default AboutPage;
