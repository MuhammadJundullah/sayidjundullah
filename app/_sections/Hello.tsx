"use client";

import Link from "next/link";
import { PiGithubLogoLight } from "react-icons/pi";
import { FaLinkedin } from "react-icons/fa";

const Hello = () => {
  return (
    <section id="hello">
      <div className="h-screen sm:space-y-10 max-w-6xl sm:mx-auto mx-5 item-center py-5">
        <div className="flex flex-row justify-between sm:text-3xl text-2xl font-bold text-gray-900 dark:text-gray-200 ">
          <p>Sayid&apos;s Portfolio</p>
          <div className="flex flex-row sm:space-x-10 space-x-4">
            <Link
              href={"https://linkedin.com/in/sayidm"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-blue-400 transition-colors">
              <FaLinkedin />
            </Link>
            <Link
              href={"https://github.com/MuhammadJundullah"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors">
              <PiGithubLogoLight />
            </Link>
          </div>
        </div>

        <div className="h-full text-center items-center flex flex-col justify-center">
          <h1 className="sm:text-4xl text-xl font-semibold sm:font-light text-black mx-auto text-center">
            Hi There, I am Sayid Muhammad Jundullah,{" "}
            <span className="px-2 bg-black text-white dark:bg-white dark:text-black rounded-md sm:inline block sm:my-0 my-4">
              Web Developer & Data Enthusiast.
            </span>
          </h1>
          <p className="sm:text-xl text-lg font-light text-gray-600 dark:text-gray-400 mt-4">
            Scroll down to discover more about my work and experience!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hello;
