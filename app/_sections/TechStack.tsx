"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TechStackType } from "@/lib/type";
import { useState } from "react";

interface techStackProps {
  data: TechStackType[];
}

export default function TechStack({ data }: techStackProps) {
  const [techStack] = useState<TechStackType[]>(data);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="flex flex-col max-w-6xl mb-20 mx-auto px-5">
        <div className="text-center sm:text-left mb-16">
          <div className="flex items-center my-10">
            <span className="flex-1 h-px bg-gray-300 sm:hidden"></span>{" "}
            <h1 className="text-4xl sm:text-6xl font-mono font-light text-black px-4">
              TechStack
            </h1>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          <div className="shadow-lg p-5 sm:p-10 rounded-3xl border border-gray-200 bg-white">
            <motion.div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible">
              {techStack.map((data) => (
                <motion.div
                  key={data.id}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                  variants={itemVariants}>
                  <Image
                    src={data.image}
                    alt={data.name}
                    width={64}
                    height={64}
                    className="object-contain mb-2 sm:mb-3 group-hover:brightness-110"
                  />
                  <p className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {data.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};