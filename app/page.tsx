import { headers } from "next/headers";
import React from "react";
import type {
  WorkExperienceType,
  ProjectsType,
  CertificatesType,
  EducationsType,
} from "@/lib/type";
import Hello from "@/app/_sections/Hello";
import About from "@/app/_sections/About";
import WorkExperiences from "@/app/_sections/WorkExperiences";
import ProjectsComponent from "@/app/_sections/Projects";
import Certificates from "@/app/_sections/Certificates";
import Education from "@/app/_sections/Education";
import TechStack from "@/app/_sections/TechStack";

export const revalidate = 86400;

export default async function Home(): Promise<React.JSX.Element> {
  const headersList = headers();
  const host = (await headersList).get("host");
  const baseUrl = `http://${host}`;

  // Fetch all data in parallel with proper typingcl
  const [workExperiences, projects, certificates, educations] =
    await Promise.all([
      fetch(`${baseUrl}/api/work-experiences`, {
        next: { revalidate: revalidate },
      }).then((res) => res.json() as Promise<WorkExperienceType[]>),
      fetch(`${baseUrl}/api/projects?status=published`, {
        next: { tags: ["projects"], revalidate: revalidate },
      }).then((res) => res.json() as Promise<ProjectsType[]>),
      fetch(`${baseUrl}/api/certificates`, {
        next: { tags: ["certificates"], revalidate: revalidate },
      }).then((res) => res.json() as Promise<CertificatesType[]>),
      fetch(`${baseUrl}/api/educations`, {
        next: { revalidate: revalidate },
      }).then((res) => res.json() as Promise<EducationsType[]>),
    ]);

  return (
    <>
      <Hello />
      <About />
      <TechStack />
      <WorkExperiences data={workExperiences} />
      <ProjectsComponent data={projects} />
      <Certificates data={certificates} />
      <Education data={educations} />
    </>
  );
}
