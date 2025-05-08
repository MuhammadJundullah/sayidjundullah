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
          <span className="shrink-0 pe-4 text-gray-900 dark:text-white">
            {" "}
            <h1 className="text-4xl font-bold">My Projects</h1>
          </span>

          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20">
          <div className="flex flex-wrap justify-center gap-8">
            {projects.map((project, i) => (
              <div key={i}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia>
                      <Image
                        src={`/static-image/Projects/${project.photo}`}
                        alt={project.photo}
                        height={150}
                        width={345}
                        objectFit="cover"
                      />
                    </CardMedia>
                    <CardContent>
                      <Typography
                        gutterBottom
                        component="div"
                        className="text-gray-900 text-3xl">
                        {project.judul}
                      </Typography>
                      <Typography
                        gutterBottom
                        component="div"
                        className="text-gray-500 font-thin">
                        {project.category}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}>
                        {project.tech}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      <Link
                        href={
                          "project/" + project.categoryslug + "/" + project.slug
                        }>
                        Detail
                      </Link>
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
