import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

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

  const TiltedCard = dynamic(
    () => import("@/app/_components/TiltedCard/TiltedCard"),
    {
      ssr: false,
    }
  );

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
                <TiltedCard
                  imageSrc={"/static-image/projects/" + project.photo}
                  altText={project.judul}
                  captionText={project.category}
                  containerHeight="200px"
                  containerWidth="350px"
                  imageHeight="200px"
                  imageWidth="350px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={true}
                  showTooltip={true}
                  // displayOverlayContent={true}
                  overlayContent={
                    <Link
                      href={
                        "project/" + project.categoryslug + "/" + project.slug
                      }>
                      <div>
                        <p className="tilted-card-demo-text text-black font-bold">
                          {project.judul}
                        </p>
                        <p className="tilted-card-demo-text text-black italic font-medium">
                          {project.tech}
                          <LuSquareArrowOutUpRight className="mx-auto mt-5" />
                        </p>
                      </div>
                    </Link>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
