"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
// Import komponen HeaderScroll yang baru
import HeaderScroll from "@/app/_components/HeaderScrool/HeaderScrool"; // Sesuaikan path jika berbeda

const Hello = () => {
  const BlurText = dynamic(
    () => import("@/app/_components/BlurText/BlurText"),
    {
      ssr: false,
    }
  );

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
            className="rounded-xl mx-auto sm:w-70 sm:h-70 object-cover shadow-lg transition-all duration-300 hover:scale-105"
          />

          <h1 className="sm:flex font-light text-black subpixel-antialiased  sm:mx-auto">
            <BlurText
              text="Hello, i am Sayid Muhammad Jundullah, Web Application Developer."
              delay={150}
              className="sm:text-4xl text-center text-3xl font-bold text-gray-800"
              animateBy="words"
              direction="top"
            />
          </h1>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="sm:text-xl text-md font-light text-gray-600 dark:text-gray-400 mt-4">
            <p className="transition-colors">
              Scroll down to discover more about my work and experience !
            </p>
          </motion.h1>
        </div>
      </div>
    </section>
  );
};

export default Hello;
