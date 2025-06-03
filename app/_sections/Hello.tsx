"use client";

import Link from "next/link";
import { PiGithubLogoLight } from "react-icons/pi";
import { FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Hello = () => {
  const BlurText = dynamic(
    () => import("@/app/_components/BlurText/BlurText"),
    {
      ssr: false,
    }
  );

  const GradientText = dynamic(
    () => import("@/app/_components/GradientText/GradientText"),
    {
      ssr: false,
    }
  );

  return (
    <section id="hello">
      <div className="h-screen sm:space-y-10 mx-5 lg:item-center py-5">
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

        <div className="h-full text-center items-center flex flex-col justify-center sm:w-6xl">
          <h1 className="sm:flex sm:text-4xl text-xl font-light text-black mx-auto text-center">
            <BlurText
              text="Hi There, I am Sayid Muhammad Jundullah, "
              delay={150}
              animateBy="words"
              direction="top"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="">
              <span className="px-2 bg-black text-white dark:bg-white dark:text-black rounded-lg sm:inline block sm:my-0 my-4">
                Web Developer & Data Enthusiast.
              </span>
            </motion.p>
          </h1>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="sm:text-xl text-md font-light text-gray-600 dark:text-gray-400 mt-4">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}>
              <p>Scroll down to discover more about my work and experience !</p>
            </GradientText>
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default Hello;
 