"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AddProject() {

  const submitRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        submitRef.current?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [project, setProject] = useState({
    judul: "",
    category: "",
    url: "",
    photo: null as File | null,
    tech: "",
    site: "",
    status: "",
    desc: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProject((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.confirm("Apakah Anda yakin ingin menambahkan project?")) {
      return;
    }  

    try {
      // Membuat FormData object
      const formData = new FormData();

      // Menambahkan field-text ke FormData
      formData.append("judul", project.judul);
      formData.append("category", project.category);
      formData.append("desc", project.desc);
      formData.append("status", project.status);
      formData.append("url", project.url);
      formData.append("tech", project.tech);
      formData.append("site", project.site);

      // Menambahkan file photo jika ada
      if (project.photo) { 
        formData.append("photo", project.photo);
      }

      // Mengirim request ke API
      const response = await fetch(`/api/projects`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal membuat project");
      }

      alert("Submitted Successfully");
      router.push("/admin/projects");
      
    } catch {
      alert("Submitted Failed");
    
    }
  };

  return (
    <div className="sm:mx-auto mx-5 w-6xl flex flex-col justify-center text-black">
      <Link
        href="/admin/projects"
        className="flex items-center gap-3 dark:hover:text-white hover:text-black text-gray-400 my-5">
        <FaArrowLeft />
        <span>Kembali</span>
      </Link>

      <form className="py-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-8">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="judul">Nama Projek</Label>
            <Input
              type="text"
              name="judul"
              value={project.judul}
              onChange={handleChange}
              placeholder="Nama Projek"
              required
            />
          </div>

          <div className="grid w-xs gap-1.5">
            <Label htmlFor="status">Category</Label>
            <select
              name="category"
              value={project.category}
              onChange={handleChange}
              className="select bg-gray-100 border-2 rounded-2xl px-3 py-2"
              required>
              <option value="" disabled>
                Pilih kategori
              </option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Data Science">Data Science</option>
              <option value="Data Engineering">Data Engineering</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="url">URL Repository Github</Label>
            <Input
              type="text"
              name="url"
              value={project.url}
              onChange={handleChange}
              placeholder="URL Repository Github"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="photo">Ubah Foto</Label>
            <Input
              type="file"
              id="photo"
              name="photo"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tech">Teknologi terkait (framework dsb.)</Label>
            <Input
              type="text"
              name="tech"
              value={project.tech}
              onChange={handleChange}
              placeholder="Teknologi terkait"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="site">URL Deploy/Dashboard link</Label>
            <Input
              type="text"
              name="site"
              value={project.site}
              onChange={handleChange}
              placeholder="URL Deploy/Dashboard link"
              required
            />
          </div>

          <div className="grid w-xs gap-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              name="status"
              value={project.status}
              onChange={handleChange}
              className="select bg-gray-100 border-2 rounded-2xl px-3 py-2"
              required>
              <option value="" disabled>
                Pilih status
              </option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="desc">Description (bisa pakai tag HTML)</Label>
            <Textarea
              name="desc"
              value={project.desc}
              onChange={handleTextareaChange}
              placeholder="Deskripsi"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            type="submit"
            ref={submitRef}
            className="mt-5 my-10 text-white hover:cursor-pointer">
            Add Project
          </Button>
          <span className="text-gray-500">
            ⌘ + Return / Ctrl + Enter to Save
          </span>
        </div>
      </form>
    </div>
  );
}
