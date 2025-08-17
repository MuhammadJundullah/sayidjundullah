export default function Home() {
  return <h1>Hello world</h1>;
}

// import React from "react";
// import Hello from "@/app/_sections/Hello";
// import About from "@/app/_sections/About";
// import WorkExperiences from "@/app/_sections/WorkExperiences";
// import Projects from "@/app/_sections/Projects";
// import Certificates from "@/app/_sections/Certificates";
// import Education from "@/app/_sections/Education";
// import TechStack from "@/app/_sections/TechStack";

// export const revalidate = 86400;

// export default async function Home(): Promise<React.JSX.Element> {
//   const baseUrl = process.env.BASE_URL;

//   const [
//     about,
//     techStacks,
//     workExperiences,
//     projects,
//     certificates,
//     educations,
//   ] = await Promise.all([
//     fetch(`${baseUrl}/api/about?id=1`, {
//       next: { tags: ["about"], revalidate: revalidate },
//     }).then((res) => res.json()),
//     fetch(`${baseUrl}/api/techstacks`, {
//       next: { tags: ["techstacks"], revalidate: revalidate },
//     }).then((res) => res.json()),
//     fetch(`${baseUrl}/api/work-experiences`, {
//       next: { tags: ["work-experiences"], revalidate: revalidate },
//     }).then((res) => res.json()),
//     fetch(`${baseUrl}/api/projects?status=published`, {
//       next: { tags: ["projects"], revalidate: revalidate },
//     }).then((res) => res.json()),
//     fetch(`${baseUrl}/api/certificates?status=published`, {
//       next: { tags: ["certificates"], revalidate: revalidate },
//     }).then((res) => res.json()),
//     fetch(`${baseUrl}/api/educations`, {
//       next: { tags: ["educations"], revalidate: revalidate },
//     }).then((res) => res.json()),
//   ]);

//   return (
//     <>
//       <Hello />
//       <About data={about.data} />
//       <WorkExperiences data={workExperiences.data} />
//       <Projects data={projects.data} techstack={techStacks.data} />
//       <TechStack data={techStacks.data} />
//       <Certificates data={certificates.data} />
//       <Education data={educations.data} />
//     </>
//   );
// }
