"use client";

import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { PiGithubLogoLight } from "react-icons/pi";
import { useEffect, useState } from "react";

const HeaderScroll = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 50; // Jarak scroll untuk mengaktifkan efek
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
    <div
      className={`
        flex flex-row justify-between fixed sm:text-3xl text-lg font-bold shadow-lg sm:w-6xl w-xs z-1 text-gray-500 rounded-4xl px-7 items-center sm:mx-0 mx-3 sm:py-6 py-3 border border-white transition-all duration-300
        ${
          scrolled
            ? "bg-gray-600/70 text-white backdrop-blur-xl shadow-lg blur-3xl opacity-0 hover:opacity-100 hover:blur-none duration-500"
            : "bg-gray-300/70"
        }
      `}>
      <a href="#hello">
        {" "}
        <p className="sm:tracking-[.30em]">Sayid&apos;s Portfolio</p>
      </a>
      <div className="flex flex-row sm:space-x-10 space-x-4">
        <Link
          href={"https://linkedin.com/in/sayidm"}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors">
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
  );
};

export default HeaderScroll;
