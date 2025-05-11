import { useEffect, useState } from "react";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import Loading from "@/app/_components/Loading";

interface Projects {
  judul: string;
  slug: string;
  category: string;
  categoryslug: string;
  url: string;
  photo: string;
  tech: string;
  site: string;
  desc: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Projects[]>([]);

  const AnimatedContent = dynamic(
    () => import("@/app/_components/AnimatedContent/AnimatedContent"),
    {
      ssr: false,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    };

    fetchData();
  }, []);

  return (
    <section id="projects">
      <div className="py-40 flex flex-col max-w-6xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <span className="flex items-center">
          <span className="shrink-0 pe-4 dark:text-white">
            {" "}
            <h1 className="text-6xl font-medium text-gray-400">My Projects</h1>
          </span>
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>

        <div className="flex justify-center mt-12 space-x-4">
          {[
            { label: "All", value: "all" },
            { label: "Web Development", value: "web-development" },
            { label: "Data Science", value: "data-science" },
            { label: "Data Engineering", value: "data-engineering" },
            { label: "Data Analytics", value: "data-analytics" },
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => {
                if (category.value === "all") {
                  fetch("/api/projects")
                    .then((res) => res.json())
                    .then((data) => setProjects(data));
                } else {
                  fetch(`/api/projects?category=${category.value}`)
                    .then((res) => res.json())
                    .then((data) => setProjects(data));
                }
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 border hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              {category.label}
            </button>
          ))}
        </div>

        <div className="my-20">
          <div className="flex flex-wrap justify-center gap-8">
            {projects.length === 0 ? (
              <Loading />
            ) : (
              projects.map((project, i) => (
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
                      <div className="w-80 border-1 border-gray-500 bg-gray-800 rounded-lg p-2">
                        <p className="pb-2 text-start text-gray-500 font-medium text-sm">
                          {project.category}
                        </p>
                        <Link
                          href={
                            "project/" +
                            project.categoryslug +
                            "/" +
                            project.slug
                          }
                          className="flex flex-row items-center space-x-2">
                          <Image
                            src={`/static-image/Projects/${project.photo}`}
                            alt={project.photo}
                            height={200}
                            width={320}
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </Link>
                        <div className="py-3">
                          <p>{project.judul}</p>
                          <span className="block w-full border-t border-[0.1px] my-2 border-gray-500"></span>
                          <p>{project.tech}</p>
                          <p className="text-gray-500 text-sm items-center text-center justify-center pt-2 flex flex-row">
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
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;


