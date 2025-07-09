"use client";

import Link from "next/link";
import { PiGithubLogoLight } from "react-icons/pi";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Hello = () => {
  const BlurText = dynamic(
    () => import("@/app/_components/BlurText/BlurText"),
    {
      ssr: false,
    }
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50;
      if (window.scrollY > scrollThreshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="hello">
      <div className="h-screen sm:space-y-10 sm:pt-5 py-5 sm:mt-2 lg:item-center sm:py-30">
        <div
          className={`
          flex flex-row justify-between fixed sm:text-3xl text-lg font-bold sm:w-6xl w-xs z-1 text-white rounded-4xl px-7 items-center sm:mx-0 mx-7 sm:py-6 py-3 border border-white transition-all duration-300
          ${
            scrolled
              ? "bg-gray-500/50 backdrop-blur-xl shadow-lg blur-3xl opacity-0 hover:opacity-100 hover:blur-none transition duration-500"
              : "bg-gray-500/70"
          }
        `}>
          <a href="#hello">
            {" "}
            <p className="tracking-[.15em]">Sayid&apos;s Portfolio</p>
          </a>
          <div className="flex flex-row sm:space-x-10 space-x-4">
            <Link
              href={"https://linkedin.com/in/sayidm"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors">
              <FaLinkedin />
            </Link>
            <Link
              href={"https://github.com/MuhammadJundullah"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-whitetransition-colors">
              <PiGithubLogoLight />
            </Link>
          </div>
        </div>

        <div className="h-full text-center items-center flex flex-col justify-evenly sm:w-6xl sm:pt-30 pt-20 sm:mt-10">
          <Image
            src="/static-image/ahmad.png"
            alt="Sayid Muhammad Jundullah"
            width={200}
            height={200}
            className="rounded-xl mx-auto sm:w-70 sm:h-70 object-cover shadow-lg transition-all duration-300 hover:scale-105"
          />

          <h1 className="sm:flex sm:text-3xl text-sm font-mono text-black mx-auto subpixel-antialiased">
            <BlurText
              text="Hi, I am Sayid Muhammad Jundullah, "
              delay={150}
              animateBy="words"
              direction="top"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="">
              <span className="px-2 sm:text-3xl text-sm subpixel-antialiased text-gray-700 rounded-lg sm:inline block sm:my-0 my-4">
                Web Application Developer.
              </span>
            </motion.p>
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
