"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/app/_components/Loading";
import StatusDropdown from "../_components/StatusDropdown";
import { SquarePen, Delete, Search, FilePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface Project {
  id: string;
  judul: string;
  slug: string;
  category: string;
  categoryslug: string;
  url: string;
  photo: string;
  tech: string;
  site: string;
  desc: string;
  updated_at: string;
  status: "published" | "archived";
}

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cek kombinasi Cmd+K (Mac) atau Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // Mencegah perilaku default browser
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Gagal memuat data proyek");
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = useCallback(
    (keyword: string) => {
      const filtered = projects.filter((project) =>
        project.judul.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProjects(filtered);
    },
    [projects]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword, handleSearch]);

  const handleStatusUpdate = async (
    projectId: string,
    newStatus: "published" | "archived"
  ) => {
    try {
      const response = await fetch(`/api/projects?statuschange=${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui status");
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status: newStatus } : project
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-7xl absolute">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-7xl absolute">
        <div className="text-red-500 text-center p-4">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <div className="flex justify-between">
          <p className="text-gray-500 font-medium">
            Kelola proyek Anda dengan rapi dan profesional dengan mengarsipkan
            proyek yang tidak relevan.
          </p>
          <div className="flex gap-3 items-center">
            <Search className="text-gray-400" />
            <Input
              type="text"
              ref={searchInputRef}
              placeholder="⌘ + K / Ctrl + K to Search"
              className="max-w-3xs"
              aria-label="search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-300 mb-10 lg:w-7xl" />
      <Link href={"/admin/projects/add"} className="flex gap-2 pb-5 hover:text-gray-700 transition">
        <FilePlus />
        <span>New Project</span>
      </Link>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 ">
          <p className="text-gray-500">
            {searchKeyword
              ? "Tidak ada proyek yang cocok."
              : "Tidak ada proyek ditemukan"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="">{project.judul}</CardTitle>
                <CardDescription className="">
                  {project.category}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center justify-start gap-3 pb-5">
                    <span className="text-sm text-gray-500">Status:</span>
                    <StatusDropdown
                      currentStatus={project.status}
                      onStatusChange={(newStatus) =>
                        handleStatusUpdate(project.id, newStatus)
                      }
                    />
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-500">Terakhir diperbarui:</p>
                    <p>
                      {new Date(project.updated_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/admin/projects/delete/${project.slug}`}
                  passHref>
                  <Button
                    variant="ghost2"
                    className="flex items-center gap-2 hover:cursor-pointer">
                    <Delete size={16} />
                    Hapus
                  </Button>
                </Link>

                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/admin/projects/edit/${project.slug}`}
                  passHref>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:cursor-pointer">
                    <SquarePen size={16} />
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
