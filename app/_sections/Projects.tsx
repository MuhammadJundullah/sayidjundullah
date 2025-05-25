// app/projects/page.tsx
import ProjectsComponent from "@/app/_sections/projectsComponent/ProjectsComponent";

// Fungsi ini akan dijalankan pada build time untuk menghasilkan halaman statis
export async function generateStaticParams() {
  // Anda bisa mengembalikan array kosong jika tidak ingin generate semua kategori
  // atau mengembalikan semua kategori yang mungkin
  return [
    { category: ["all"] },
    { category: ["web-development"] },
    { category: ["data-science"] },
    { category: ["data-engineering"] },
    { category: ["data-analytics"] },
  ];
}

// Revalidate setiap 3600 detik (1 jam)
export const revalidate = 3600;

export default function ProjectsPage() {
  const initialCategory = "all";

  return <ProjectsComponent initialCategory={initialCategory} />;
}
