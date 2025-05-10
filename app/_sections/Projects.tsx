import { useEffect, useState } from "react";
import Link from "next/link";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
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
    <section id="Projects">
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
                <div key={i} className="flex">
                  <AnimatedContent
                    distance={100}
                    direction="vertical"
                    reverse={false}
                    config={{ tension: 120, friction: 14 }}
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.1}>
                    <div className="h-full">
                      <Card
                        sx={{
                          maxWidth: 345,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}>
                        <CardActionArea sx={{ flexGrow: 1 }}>
                          <CardMedia>
                            <Image
                              src={`/static-image/Projects/${project.photo}`}
                              alt={project.photo}
                              height={150}
                              width={345}
                              objectFit="cover"
                            />
                          </CardMedia>
                          <CardContent
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}>
                            <div>
                              <Typography
                                gutterBottom
                                component="div"
                                className="text-gray-900 text-3xl">
                                {project.judul}
                              </Typography>
                              <Typography
                                gutterBottom
                                component="div"
                                className="text-gray-500 font-bold">
                                {project.category}
                              </Typography>
                            </div>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                marginTop: "auto",
                              }}>
                              {project.tech}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Button size="small" color="primary">
                            <Link
                              href={
                                "project/" +
                                project.categoryslug +
                                "/" +
                                project.slug
                              }
                              className="flex flex-row items-center space-x-2">
                              <p>Detail</p>{" "}
                              <FaArrowUpRightFromSquare></FaArrowUpRightFromSquare>
                            </Link>
                          </Button>
                        </CardActions>
                      </Card>
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


