import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
      <div className="flex flex-col max-w-5xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <h1 className="text-4xl font-bold">My Projects</h1>
        <div className="my-20">

            <div className="flex flex-wrap justify-center gap-8">
              {projects.map((project, i) => (
              <div key={i}>
                <TiltedCard
                imageSrc={"/static-image/projects/" + project.photo}
                altText={project.judul}
                captionText={project.category}
                containerHeight="150px"
                containerWidth="300px"
                imageHeight="150px"
                imageWidth="300px"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                overlayContent={
                  <p className="tilted-card-demo-text text-black">
                  {project.judul}
                  </p>
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
