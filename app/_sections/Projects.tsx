"use client";

import { useState } from "react";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { ProjectsType } from "@/lib/type";

interface ProjectsProps {
  data: ProjectsType[];
}

export default function ProjectsComponent({ data }: ProjectsProps) {
  const [projects] = useState<ProjectsType[]>(data);

  const AnimatedContent = dynamic(
    () => import("@/app/_components/AnimatedContent/AnimatedContent"),
    {
      ssr: false,
    }
  );

  return (
    <section id="projects">
      <div className="py-40 flex flex-col sm:mx-auto mx-5 sm:mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0] max-w-6xl">
        <span className="text-3xl flex items-center">
          <span className="shrink-0 pe-4">
            {" "}
            <h1 className="sm:text-5xl font-mono dark:text-white text-gray-800">
              My Projects
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20 ">
          <div className="flex flex-wrap justify-center gap-8">
            {projects.map((project, i) => (
              <div
                key={i}
                className="flex hover:scale-105 transition-all duration-300">
                <AnimatedContent
                  distance={100}
                  direction="vertical"
                  reverse={false}
                  config={{ tension: 120, friction: 14 }}
                  initialOpacity={0}
                  animateOpacity
                  threshold={0.1}>
                  <div className="h-full font-medium">
                    <div className="w-80 border-1 dark:border-gray-500 border-gray-300 bg-gray-200 dark:bg-gray-800 rounded-lg p-2">
                      <p className="pb-2 text-start text-gray-500 dark:text-gray-400 font-medium text-sm">
                        {project.category}
                      </p>
                      <Link
                        href={
                          "project/" + project.categoryslug + "/" + project.slug
                        }
                        className="flex flex-row items-center space-x-2">
                        <Image
                          // src={`https://res.cloudinary.com/dislphwb0/image/upload/v1747003784/${project.photo}`}
                          src={project.photo}
                          alt={project.photo}
                          height={200}
                          width={320}
                          className="rounded-lg"
                        />
                      </Link>
                      <div className="py-3">
                        <p className="text-gray-700 dark:text-gray-200">
                          {project.judul}
                        </p>
                        <span className="block w-full border-t border-[0.1px] my-2 border-gray-300"></span>
                        <p className="text-gray-700 dark:text-gray-300 font-light">
                          {project.tech}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm items-center text-center justify-center pt-2 flex flex-row">
                          <Link
                            href={
                              "project/" +
                              project.categoryslug +
                              "/" +
                              project.slug
                            }
                            className="flex flex-row items-center space-x-2 pt-2">
                            <FaArrowUpRightFromSquare></FaArrowUpRightFromSquare>
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedContent>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
