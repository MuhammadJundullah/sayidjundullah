"use client"

import Hello from "@/app/_sections/Hello";
import About from "@/app/_sections/About";
import WorkExperiences from "@/app/_sections/WorkExperiences";
import Projects from "@/app/_sections/Projects";
import Certificates from "@/app/_sections/Certificates";
import Education from "@/app/_sections/Education";
import { Suspense } from "react";
import Loading from "./_components/Loading";
import Footer from "./_sections/Footer";

const Home = () => {
  return (
    <>
      <Hello></Hello>
      <About></About>
      <WorkExperiences></WorkExperiences>
      <Suspense fallback={<Loading />}>
        <Projects></Projects>
      </Suspense>
      <Certificates></Certificates>
      <Education></Education>
      <Footer></Footer>
    </>
  );
};

export default Home;

