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

export default async function Home(): Promise<React.JSX.Element> {
  const headersList = headers();
  const host = (await headersList).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http:" : "http:";
  const baseUrl = `${protocol}//${host}`;

  // Fetch all data in parallel with proper typing
  const [workExperiences, projects, certificates, educations] =
    await Promise.all([
      fetch(`${baseUrl}/api/work-experiences`).then(
        (res) => res.json() as Promise<WorkExperienceType[]>
      ),
      fetch(`${baseUrl}/api/projects`).then(
        (res) => res.json() as Promise<ProjectsType[]>
      ),
      fetch(`${baseUrl}/api/certificates`).then(
        (res) => res.json() as Promise<CertificatesType[]>
      ),
      fetch(`${baseUrl}/api/educations`).then(
        (res) => res.json() as Promise<EducationsType[]>
      ),
    ]);

  return (
    <>
      <Hello />
      <About />
      <WorkExperiences data={workExperiences} />
      <ProjectsComponent data={projects} />
      <Certificates data={certificates} />
      <Education data={educations} />
    </>
  );
}
