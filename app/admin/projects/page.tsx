"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/app/_components/Loading";
import StatusDropdown from "../_components/StatusDropdown";
import { SquarePen, Delete, Search, FilePlus } from "lucide-react";
import { VscRefresh } from "react-icons/vsc";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";

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
  createdAt: string;
  updatedAt: string;
  status: "published" | "archived";
}

const ManageProjects = () => {
  const { toast, showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRevalidating, setRevalidating] = useState(false);

  // handle search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // handle fetch data projects with client side rendering
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/projects`);
        if (!response.ok) throw new Error("Gagal memuat data proyek");
        const data = await response.json();
        setProjects(data.data);
        setFilteredProjects(data.data);
      } catch (err) {
        showToast(`${err}`, "success");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // logic search
  const handleSearch = useCallback(
    (keyword: string) => {
      const filtered = projects.filter((project) =>
        project.judul.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredProjects(filtered);
    },
    [projects]
  );

  // time to reload data after typing in search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchKeyword);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchKeyword, handleSearch]);

  // for refresh data without reload page
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    const response = await fetch("/api/projects");
    const data = await response.json();
    setProjects(data.data);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  // handle delete project
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus project ini?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsLoading(false);
        handleRefresh();
        showToast("Project has been deleted successfully!", "success");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Delete error:", err);
    }
  };

  // handle update status only
  const handleStatusUpdate = async (
    id: string,
    newStatus: "published" | "archived"
  ) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
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
          project.id === id ? { ...project, status: newStatus } : project
        )
      );

      showToast(`Project has been ${newStatus} successfully!`, "success");
    } catch (error) {
      showToast(` ${error}`, "success");
      handleRefresh();
    }
  };

  const handleRevalidate = async () => {
    try {
      setRevalidating(true);
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`,
        },
        body: JSON.stringify({
          paths: ["/"],
          tags: ["projects"],
        }),
      });
      setRevalidating(false);

      const data = await res.json();
      if (data.success) {
        showToast("Static Project Data has been revalidating!", "success");
      }
    } catch (err) {
      alert("Failed to revalidate " + err);
    }
  };

  return (
    <div className="mx-auto sm:px-4 max-w-6xl">
      <div className="sm:my-10">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <p className="text-gray-500 font-medium">
          Kelola proyek kamu dengan rapi dan profesional dengan mengarsipkan
          proyek yang tidak relevan.
        </p>
      </div>

      <div className="sm:flex gap-3 items-center mb-10">
        <div className="flex items-center gap-2 my-10 sm:my-0">
          <Search className="text-gray-400" />
          <Input
            type="text"
            ref={searchInputRef}
            placeholder="⌘ + K / Ctrl + K to Search"
            className="min-w-3xs border-gray-200 placeholder:text-gray-400"
            aria-label="search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        <div className="border-b border-gray-300 lg:w-7xl sm:block md:block lg:block hidden" />

        <div className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-sm justify-around">
          {/* New Project Button */}
          <Link
            href="/admin/projects/add"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer">
            <FilePlus />
            <span className="w-19">New Project</span>
          </Link>

          <button
            onClick={handleRevalidate}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer">
            <VscRefresh
              className={`w-5 h-5 ${isRevalidating ? "animate-spin" : ""}`}
            />
            <span>{isRevalidating ? "Revalidating..." : "Revalidate"}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      ) : filteredProjects.length === 0 ? (
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
                      {new Date(project.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="ghost2"
                  className="flex items-center gap-2 hover:cursor-pointer text-red-500"
                  onClick={() => handleDelete(project.id)}>
                  <Delete size={16} />
                  Hapus
                </Button>

                <Link href={`/admin/projects/edit/${project.id}`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:cursor-pointer border-gray-300 ">
                    <SquarePen size={16} />
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default ManageProjects;
