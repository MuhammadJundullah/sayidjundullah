"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TechStackType } from "@/lib/type";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface techStackProps {
  data: TechStackType[];
}

export default function TechStack({ data }: techStackProps) {
  const [techStack] = useState<TechStackType[]>(data);

  const [openId, setOpenId] = useState(null);

  const handleToggle = (id: any) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="techstack-accordion" className="py-16 sm:py-24">
      <div className="flex flex-col max-w-6xl mx-auto px-5">
        <div className="text-center mb-16">
          <div className="flex items-center my-10">
            <span className="flex-1 h-px bg-gray-300 sm:hidden"></span>{" "}
            <h1 className="text-4xl sm:text-5xl font-mono font-light text-black dark:text-white px-4">
              TechStack
            </h1>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          <div className="shadow-lg rounded-3xl border border-gray-200 bg-white dark:bg-gray-700 p-5 sm:p-8">
            <div className="flex flex-wrap -mx-2">
              {techStack.map((data) => (
                <div key={data.id} className="w-full sm:w-1/2 p-2">
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleToggle(data.id)}
                      className="flex justify-between items-center w-full py-4 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg px-4">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={
                            typeof data.image === "string"
                              ? data.image
                              : "/placeholder.jpg"
                          }
                          alt={data.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                        <span className="text-lg font-medium text-gray-800 dark:text-white">
                          {data.name}
                        </span>
                      </div>
                      <FaChevronDown
                        className={`transform transition-transform duration-300 ${
                          openId === data.id ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openId === data.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden">
                          <p
                            className="py-4 px-4 text-gray-600 border-t dark:text-white"
                            dangerouslySetInnerHTML={{
                              __html: data.description,
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};