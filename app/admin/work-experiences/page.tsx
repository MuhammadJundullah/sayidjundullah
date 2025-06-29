"use client";

import React from "react";

const ManageWorkExperiences = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen">
      <span>Manage Work Experiences Page On Development.</span>
    </div>
  );
};

export default ManageWorkExperiences;

// "use client";

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import Loading from "@/app/_components/Loading";
// import StatusDropdown from "../_components/StatusDropdown";
// import {
//   SquarePen,
//   Delete,
//   Search,
//   FilePlus,
//   RefreshCwIcon,
// } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";

// interface Project {
//   id: string;
//   judul: string;
//   slug: string;
//   category: string;
//   categoryslug: string;
//   url: string;
//   photo: string;
//   tech: string;
//   site: string;
//   desc: string;
//   updated_at: string;
//   status: "published" | "archived";
// }

// const ManageProjects = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
//   const [searchKeyword, setSearchKeyword] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // handle search shortcut
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//         e.preventDefault();
//         searchInputRef.current?.focus();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // handle fetch data projects with client side rendering
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("/api/projects");
//         if (!response.ok) throw new Error("Gagal memuat data proyek");
//         const data = await response.json();
//         setProjects(data);
//         setFilteredProjects(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Terjadi kesalahan");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // logic search
//   const handleSearch = useCallback(
//     (keyword: string) => {
//       const filtered = projects.filter((project) =>
//         project.judul.toLowerCase().includes(keyword.toLowerCase())
//       );
//       setFilteredProjects(filtered);
//     },
//     [projects]
//   );

//   // time to reload data after typing in search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       handleSearch(searchKeyword);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [searchKeyword, handleSearch]);

//   // for refresh data without reload page
//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     setIsLoading(true);
//     const response = await fetch("/api/projects");
//     const data = await response.json();
//     setProjects(data);
//     setIsLoading(false);
//     setIsRefreshing(false);
//   };

//   // handle delete project
//   const handleDelete = async (slug: string) => {
//     if (!confirm("Yakin ingin menghapus project ini?")) return;

//     try {
//       const response = await fetch(`/api/projects?slug=${slug}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         handleRefresh();
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//     }
//   };

//   // handle update status only
//   const handleStatusUpdate = async (
//     projectId: string,
//     newStatus: "published" | "archived"
//   ) => {
//     try {
//       const response = await fetch(`/api/projects?statuschange=${projectId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         throw new Error("Gagal memperbarui status");
//       }

//       setProjects((prevProjects) =>
//         prevProjects.map((project) =>
//           project.id === projectId ? { ...project, status: newStatus } : project
//         )
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Gagal memperbarui status");
//     }
//   };

//   // show loading before data loaded
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen w-7xl">
//         <Loading />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen w-7xl absolute">
//         <div className="text-red-500 text-center p-4">
//           <p>{error}</p>
//           <Button
//             variant="outline"
//             className="mt-4"
//             onClick={() => window.location.reload()}>
//             Coba Lagi
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto sm:px-4 max-w-6xl">
//       <div className="sm:my-10">
//         <h1 className="text-3xl font-bold">Manage Projects</h1>
//         <p className="text-gray-500 font-medium">
//           Kelola proyek kamu dengan rapi dan profesional dengan mengarsipkan
//           proyek yang tidak relevan.
//         </p>
//       </div>

//       <div className="sm:flex gap-3 items-center mb-10">
//         <div className="flex items-center gap-2 my-10 sm:my-0">
//           <Search className="text-gray-400" />
//           <Input
//             type="text"
//             ref={searchInputRef}
//             placeholder="⌘ + K / Ctrl + K to Search"
//             className="min-w-3xs border-gray-200 placeholder:text-gray-400"
//             aria-label="search"
//             value={searchKeyword}
//             onChange={(e) => setSearchKeyword(e.target.value)}
//           />
//         </div>

//         <div className="border-b border-gray-300 lg:w-7xl sm:block md:block lg:block hidden" />

//         <div className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-sm justify-around">
//           {/* New Project Button */}
//           <Link
//             href="/admin/projects/add"
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer">
//             <FilePlus />
//             <span className="w-19">New Project</span>
//           </Link>

//           {/* Refresh Button */}
//           <button
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer">
//             <RefreshCwIcon
//               className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
//             />
//             <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
//           </button>
//         </div>
//       </div>

//       {filteredProjects.length === 0 ? (
//         <div className="text-center py-20 ">
//           <p className="text-gray-500">
//             {searchKeyword
//               ? "Tidak ada proyek yang cocok."
//               : "Tidak ada proyek ditemukan"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
//           {filteredProjects.map((project) => (
//             <Card key={project.id} className="h-full flex flex-col">
//               <CardHeader>
//                 <CardTitle className="">{project.judul}</CardTitle>
//                 <CardDescription className="">
//                   {project.category}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex-grow">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-start gap-3 pb-5">
//                     <span className="text-sm text-gray-500">Status:</span>
//                     <StatusDropdown
//                       currentStatus={project.status}
//                       onStatusChange={(newStatus) =>
//                         handleStatusUpdate(project.id, newStatus)
//                       }
//                     />
//                   </div>

//                   <div className="text-sm">
//                     <p className="text-gray-500">Terakhir diperbarui:</p>
//                     <p>
//                       {new Date(project.updated_at).toLocaleDateString(
//                         "id-ID",
//                         {
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                         }
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>

//               <CardFooter className="flex justify-end gap-2">
//                 <Button
//                   variant="ghost2"
//                   className="flex items-center gap-2 hover:cursor-pointer text-red-500"
//                   onClick={() => handleDelete(project.slug)}>
//                   <Delete size={16} />
//                   Hapus
//                 </Button>

//                 <Link href={`/admin/projects/edit/${project.slug}`}>
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-2 hover:cursor-pointer border-gray-300">
//                     <SquarePen size={16} />
//                     Edit
//                   </Button>
//                 </Link>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageProjects;
