import ProjectsComponent from "@/app/_sections/projectsComponent/ProjectsComponent";

export async function generateStaticParams() {
  return [
    { category: ["all"] },
    { category: ["web-development"] },
    { category: ["data-science"] },
    { category: ["data-engineering"] },
    { category: ["data-analytics"] },
  ];
}

export const revalidate = 3600;

export default function ProjectsPage() {
  const initialCategory = "all";

  return <ProjectsComponent initialCategory={initialCategory} />;
}
