"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { ProjectsType } from "@/lib/type";
import CustomAnimatedContent from "@/app/_components/AnimatedContent/CustomAnimateContent";

interface Props {
  data: ProjectsType[];
}

export default function Projects({ data }: Props) {
  const [projects] = useState<ProjectsType[]>(data);
  const [selectedTech, setSelectedTech] = useState("");

  const filteredProjects = useMemo(() => {
    if (!selectedTech) {
      return projects;
    }
    const categoryQuery = selectedTech.toLowerCase();
    return projects.filter((project) =>
      project.category.toLowerCase().includes(categoryQuery)
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

              <option value="Data Analytics">Data Analytics</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="AI ML">AI/ML</option>
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
          filter by projects category.
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
                    className="group block">
                    <div className="group-hover:scale-105 transition-all duration-300">
                      <CustomAnimatedContent
                        distance={finalDistance}
                        direction={finalDirection}
                        initialOpacity={0}
                        animateOpacity
                        threshold={0.1}
                        delay={animationDelay}>
                        {/* Modern Card Container */}
                        <div className="relative w-80 h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300">
                          {/* Image Section */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={
                                typeof project.photo === "string"
                                  ? project.photo
                                  : "/placeholder.jpg"
                              }
                              alt={project.judul}
                              height={200}
                              width={320}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Tech Badge */}
                            {/* <div className="absolute top-3 right-3">
                              <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                {project.category} 
                              </span>
                            </div> */}
                          </div>

                          {/* Content Section */}
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                              {project.judul}
                            </h3>

                            <div className="flex items-center mb-3">
                              <div className="w-full h-px bg-gradient-to-r from-gray-200 to-gray-200 dark:from-gray-600 dark:to-gray-600"></div>
                            </div>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.tech
                                .split(",")
                                .slice(0, 3)
                                .map((tech, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-md">
                                    {tech.trim()}
                                  </span>
                                ))}
                              {project.tech.split(",").length > 3 && (
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-md">
                                  +{project.tech.split(",").length - 3}
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                                View Details
                                <FaArrowUpRightFromSquare className="ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                              </div>
                            </div>
                          </div>

                          {/* Hover Effect Border */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-xl transition-all duration-300 pointer-events-none"></div>
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
