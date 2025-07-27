// app/projects/page.tsx (atau lokasi ProjectsComponent Anda)
"use client";

import { useState } from "react";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { ProjectsType } from "@/lib/type";
import CustomAnimatedContent from "@/app/_components/AnimatedContent/CustomAnimateContent";

interface ProjectsProps {
  data: ProjectsType[];
}

export default function ProjectsComponent({ data }: ProjectsProps) {
  const [projects] = useState<ProjectsType[]>(data);

  return (
    <section id="projects">
      <div className="py-40 flex flex-col sm:mx-auto mx-5 sm:mb-20 font-thin text-center text-[#0f172a] max-w-6xl">
        <span className="flex items-center">
          <span className="shrink-0 pe-4">
            {" "}
            <h1 className="sm:text-5xl text-2xl font-mono font-semibold text-gray-800">
              My Projects Experience
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-300"></span>
        </span>
        <div className="sm:my-20 my-8">
          <div className="flex flex-wrap justify-center gap-8">
            {projects.map((project, i) => {
              const animationDistance = 80;
              const animationDelay = i * 0.01;
              const finalDirection = "vertical";
              const finalDistance = animationDistance;
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
                          <div className="w-80 border border-gray-300 shadow-xs rounded-md p-2">
                            <Image
                              src={project.photo || ""}
                              alt={project.photo || ""}
                              height={200}
                              width={320}
                              className="rounded-md"
                              style={{ objectFit: "cover" }}
                            />
                            <div className="py-3">
                              <p className="text-gray-700 ">{project.judul}</p>
                              <span className="block w-full my-2 border-gray-300"></span>
                              <p className="text-gray-700  font-light">
                                {project.tech}
                              </p>
                              <p className="text-gray-500 text-sm items-center text-center justify-center pt-2 flex flex-row">
                                <FaArrowUpRightFromSquare></FaArrowUpRightFromSquare>
                              </p>
                            </div>
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
