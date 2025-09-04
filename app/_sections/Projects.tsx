"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { ProjectsType, TechStackType } from "@/lib/type";
import CustomAnimatedContent from "@/app/_components/AnimatedContent/CustomAnimateContent";

interface Props {
  data: ProjectsType[];
  techstack: TechStackType[];
}

export default function Projects({ data, techstack }: Props) {
  const [projects] = useState<ProjectsType[]>(data);
  const [selectedTech, setSelectedTech] = useState("");
  const [techStacks] = useState<TechStackType[]>(techstack);

  const filteredProjects = useMemo(() => {
    if (!selectedTech) {
      return projects;
    }
    const techQuery = selectedTech.toLowerCase();
    return projects.filter((project) =>
      project.tech.toLowerCase().includes(techQuery)
    );
  }, [projects, selectedTech]);

  return (
    <section id="projects">
      <div className="py-20 flex flex-col sm:mx-auto mx-5 font-thin text-center text-[#0f172a] sm:w-6xl">
        <span className="flex items-center">
          <span className="shrink-0 pe-4">
            <h1 className="sm:text-5xl text-2xl font-mono font-semibold text-gray-800 dark:text-white">
              My Projects Experience
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-300"></span>
        </span>

        <div className="flex justify-center mt-20 px-4">
          <div className="relative w-full sm:w-1/2">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="appearance-none w-full p-3 text-sm text-gray-700 font-bold dark:text-black bg-white dark:bg-gray-300 border border-gray-300 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:border-gray-400">
              <option value="">Show all</option>
              {techStacks.map((techstack, index) => (
                <option key={index} value={techstack.name}>
                  {techstack.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-black">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <p className="py-1 text-sm text-gray-700 dark:text-white font-bold">
          filter by techstacks
        </p>

        <div className="sm:my-20 my-8">
          <div className="flex flex-wrap justify-center gap-8">
            {filteredProjects.map((project, i) => {
              const animationDelay = i * 0.01;
              const finalDirection = "vertical";
              const finalDistance = 80;
              return (
                <div key={i}>
                  <Link
                    href={`/project/${project.category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}/${project.id}`}
                    className="flex flex-row items-center space-x-2 pt-2">
                    <div className="flex hover:scale-105 transition-all duration-300">
                      <CustomAnimatedContent
                        distance={finalDistance}
                        direction={finalDirection}
                        initialOpacity={0}
                        animateOpacity
                        threshold={0.1}
                        delay={animationDelay}>
                        <div className="h-full font-medium">
                          <div className="w-80 h-92 border border-gray-300 shadow-xs rounded-md p-2 align dark:bg-gray-500">
                            <Image
                              src={
                                typeof project.photo === "string"
                                  ? project.photo
                                  : "/placeholder.jpg"
                              }
                              alt={
                                typeof project.photo === "string"
                                  ? project.photo
                                  : "/placeholder.jpg"
                              }
                              height={200}
                              width={320}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="py-3">
                              <p className="text-gray-700 dark:text-white">
                                {project.judul}
                              </p>
                              <span className="block w-full my-2 border-gray-300"></span>
                              <p className="text-gray-700 dark:text-white font-light">
                                {project.tech}
                              </p>
                            </div>
                            <p className="text-gray-500 dark:text-white text-sm items-end justify-center pt-2 flex flex-row">
                              <FaArrowUpRightFromSquare></FaArrowUpRightFromSquare>
                            </p>
                          </div>
                        </div>
                      </CustomAnimatedContent>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
