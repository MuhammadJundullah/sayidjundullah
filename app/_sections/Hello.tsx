"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import HeaderScroll from "@/app/_components/HeaderScrool/HeaderScrool";

const Hello = () => {
  const BlurText = dynamic(
    () => import("@/app/_components/BlurText/BlurText"),
    {
      ssr: false,
    }
  );

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="hello">
      <div className="flex h-screen sm:space-y-10 sm:pt-5 py-5 sm:mt-2 p-4 lg:item-center sm:py-30">
        <HeaderScroll />

        <div className="h-full text-center items-center flex flex-col justify-evenly sm:w-6xl sm:pt-30 pt-20 sm:mt-10">
          <Image
            src="/static-image/ahmad.png"
            alt="Sayid Muhammad Jundullah"
            width={200}
            height={200}
            className="rounded-lg sm:rounded-full mx-auto sm:w-70 sm:h-70 object-cover shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:border"
          />

          <h1 className="sm:shadow-none shadow-2xl sm:flex bg-gray-700 sm:bg-white dark:bg-gray-700  font-light dark:text-white sm:text-black subpixel-antialiased sm:mx-auto py-5 sm:py-0 sm:px-0 px-5 rounded-xl transition-all duration-300 hover:scale-105">
            <BlurText
              text="Hello 👋, i am Sayid Muhammad Jundullah, Web Application Developer."
              delay={150}
              className="sm:text-4xl text-center text-2xl font-bold"
              animateBy="words"
              direction="top"
            />
          </h1>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 4, duration: 1, ease: "easeOut" }}
            className="max-w-2xl text-start text-base font-light text-gray-600 dark:text-white sm:text-lg lg:text-xl">
            Scroll down to discover more about me!
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Hello;
