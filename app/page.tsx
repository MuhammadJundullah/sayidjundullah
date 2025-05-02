"use client"

import Hello from "@/app/_sections/Hello";
import About from "@/app/_sections/About";
import WorkExperiences from "@/app/_sections/WorkExperiences";
import Projects from "@/app/_sections/Projects";
import Footer from "@/app/_sections/Footer";

const Home = () => {

  return (
    <>
      <Hello></Hello>
      <About></About>
      <WorkExperiences></WorkExperiences>
      <Projects></Projects>
      <Footer></Footer>
    </>
  );
};

export default Home;

