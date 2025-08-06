import React from "react";
import Hello from "@/app/_sections/Hello";
import About from "@/app/_sections/About";
import WorkExperiences from "@/app/_sections/WorkExperiences";
import ProjectsComponent from "@/app/_sections/Projects";
import Certificates from "@/app/_sections/Certificates";
import Education from "@/app/_sections/Education";
import TechStack from "@/app/_sections/TechStack";

export const revalidate = 86400;

export default async function Home(): Promise<React.JSX.Element> {
  const baseUrl = process.env.BASE_URL;

  // Fetch all data in parallel with proper typing
  const [workExperiences, projects, certificates, educations] =
    await Promise.all([
      fetch(`${baseUrl}/api/work-experiences`, {
        next: { revalidate: revalidate },
      }).then((res) => res.json()),
      fetch(`${baseUrl}/api/projects?status=published`,{
        next: { tags: ["projects"], revalidate: revalidate },
      }).then((res) => res.json()),
      fetch(`${baseUrl}/api/certificates`, {
        next: { tags: ["certificates"], revalidate: revalidate },
      }).then((res) => res.json()),
      fetch(`${baseUrl}/api/educations`, {
        next: { revalidate: revalidate },
      }).then((res) => res.json()),
    ]);

  return (
    <>
      <Hello />
      <About />
      <TechStack />
      <WorkExperiences data={workExperiences.data} />
      <ProjectsComponent data={projects.data} />
      <Certificates data={certificates} />
      <Education data={educations} />
    </>
  );
}

