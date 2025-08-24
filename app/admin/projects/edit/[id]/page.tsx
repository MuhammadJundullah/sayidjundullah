"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState, use } from "react";
import Loading from "@/app/_components/Loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";

interface Project {
  judul: string;
  slug: string;
  category: string;
  categoryslug: string;
  url: string;
  photo?: File | string;
  tech: string;
  site: string;
  desc: string;
  status: "published" | "archived";
}

export default function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast, showToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params);
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Cmd+S (Mac) atau Ctrl+S (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); 
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/projects?id=${id}`);

        if (!res.ok) throw new Error("Failed to fetch project");

        const data = await res.json();

        setProject(data.data[0]);
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/error");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen mx-10  w-7xl">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProject((prev) => (prev ? { ...prev, photo: file } : prev));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProject((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) return;

    try {
      setIsLoading(true);
      const formData = new FormData();

      // Append semua field text
      formData.append("judul", project.judul);
      formData.append("category", project.category);
      formData.append("desc", project.desc || "");
      formData.append("status", project.status || "");
      formData.append("url", project.url || "");
      formData.append("tech", project.tech || "");
      formData.append("site", project.site || "");

      // Append file hanya jika itu File object (foto baru)
      if (project.photo instanceof File) {
        formData.append("photo", project.photo);
      }

      const res = await fetch(`/api/projects?id=${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setIsLoading(false);
        showToast("Project has been updated successfully!", "success");
      } else {
        const errorData = await res.json();
        setIsLoading(false);
        showToast(errorData.message, "success");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      alert("Terjadi kesalahan saat mengupdate project");
    }
  };

  return (
    <div className="md:w-6xl flex flex-col justify-center text-black">
      <Link
        href="/admin/projects"
        className="flex items-center gap-3 hover:text-black dark:hover:text-white text-gray-400 my-10 transition-all duration-300">
        <FaArrowLeft />
        <span>Kembali</span>
      </Link>
      <form className="py-3">
        <div className="flex flex-col gap-8 dark:text-white">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="tech">Nama Projek</Label>
            <Input
              type="text"
              placeholder="Nama Projek"
              value={project.judul}
              name="judul"
              onChange={handleChange}
              className="dark:placeholder:text-white dark:text-white"
            />
          </div>

          <div className="grid w-xs gap-1.5">
            <Label htmlFor="status">Kategori</Label>
            <div className="grid w-full gap-1.5">
              <select
                id="category"
                name="category"
                className="select bg-gray-100 dark:bg-gray-500 rounded-2xl px-3 py-2"
                value={project.category}
                onChange={handleChange}>
                <option value="" disabled>
                  Pilih status
                </option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Science">Data Science</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
              </select>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tech">URL Repository Github</Label>
            <Input
              type="text"
              placeholder="URL Repository Github"
              name="url"
              value={project.url}
              onChange={handleChange}
              className="dark:placeholder:text-white dark:text-white"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="photo">Ubah Foto</Label>
              <div className="sm:w-lg aspect-[2/1] relative mb-8">
                <Image
                  src={
                    typeof project.photo === "string"
                      ? project.photo
                      : project.photo instanceof File
                      ? URL.createObjectURL(project.photo)
                      : "https://res.cloudinary.com/dislphwb0/image/upload/v1748565484/404_vzvale.jpg"
                  }
                  alt="Project Photo"
                  fill
                  className="rounded-2xl object-cover overflow-hidden my-3 border-4"
                  onLoad={(e) => {
                    if (project.photo instanceof File) {
                      URL.revokeObjectURL(e.currentTarget.src);
                    }
                  }}
                />
              </div>
            </div>
            <Input
              type="file"
              placeholder="Photo"
              name="photo"
              onChange={handleFileChange}
              accept="image/*"
              className="dark:placeholder:text-white dark:text-white"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tech">Teknologi terkait (framework dsb.)</Label>
            <Input
              type="text"
              placeholder="Teknologi terkait (framework dsb.)"
              name="tech"
              value={project.tech}
              onChange={handleChange}
              className="dark:placeholder:text-white dark:text-white"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="site">URL Deploy/Dashboard link</Label>
            <Input
              type="text"
              placeholder="URL Deploy/Dashboard link"
              name="site"
              value={project.site}
              onChange={handleChange}
              className="dark:placeholder:text-white dark:text-white"
            />
          </div>

          <div className="grid w-xs gap-1.5">
            <Label htmlFor="status">Status (Published / Archived)</Label>
            <div className="grid w-full gap-1.5">
              <select
                id="status"
                name="status"
                className="select bg-gray-100 dark:bg-gray-500 rounded-2xl px-3 py-2"
                value={project.status}
                onChange={handleChange}>
                <option value="" disabled>
                  Pilih status
                </option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="desc">
              Description (jika anda menggunakan tag html, nantinya akan di
              eksekusi di dashboard porto){" "}
            </Label>
            <Textarea
              placeholder="Deskripsi"
              name="desc"
              value={project.desc}
              onChange={handleTextareaChange}
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            type="submit"
            ref={buttonRef}
            className="mt-5 my-10 text-white bg-black hover:cursor-pointer"
            onClick={handleSubmit}>
            Simpan Perubahan
          </Button>
          <span className="text-gray-500">⌘ + S / Ctrl + S</span>
        </div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
