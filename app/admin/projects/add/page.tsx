"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";
import Loading from "@/app/_components/Loading";
import TextInput from "../../_components/TextInput";
import PhotoUpload from "../../_components/PhotoUpload";
import TextAreaInput from "../../_components/TextAreaInput";
import SelectInput from "../../_components/SelectInput";
import BackButton from "../../_components/BackButton";
import SubmitButton from "../../_components/SubmitButton";

export default function AddProject() {
  const { toast, showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const submitRef = useRef<HTMLButtonElement>(null);

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
      const file = e.target.files[0];
      const maxSize = 2 * 1024 * 1024; // 2 MB dalam bytes

      if (file.size > maxSize) {
                showToast("Ukuran file maksimal adalah 2 MB.", "error");
        // Anda bisa menambahkan logika lain di sini, seperti mengosongkan input file
        e.target.value = "";
      } else {
        setProject((prev) => ({ ...prev, photo: file }));
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.confirm("Apakah Anda yakin ingin menambahkan project?")) {
      return;
    }

    try {
      setIsLoading(true);
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

      setIsLoading(false);
      showToast("Project has been added successfully!", "success");
      setProject({
        judul: "",
        category: "",
        url: "",
        photo: null,
        tech: "",
        site: "",
        status: "",
        desc: "",
      });
    } catch {
      setIsLoading(false);
      showToast("Login failed: Invalid credentials", "error");
    }
  };

  const statusOptions = [
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  const categoryOptions = [
    { value: "Data Analytics", label: "Data Analytics" },
    { value: "Data Science", label: "Data Science" },
    { value: "Data Engineering", label: "Data Engineering" },
    { value: "Web Development", label: "Web Development" },
    { value: "Mobile Development<", label: "Mobile Development" },
  ];

  return (
    <div className="sm:mx-auto sm:w-6xl flex flex-col justify-center text-black">
      <div>
        <BackButton href="/admin/projects" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Loading />
        </div>
      ) : (
        <form className="py-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <TextInput
              id="judul"
              label="Nama Proyek"
              type="text"
              name="judul"
              value={project.judul}
              onChange={handleChange}
              placeholder="Nama Proyek"
              required
            />

            <SelectInput
              id="category"
              label="Kategori"
              name="category"
              value={project.category}
              onChange={handleChange}
              options={categoryOptions}
              placeholder="Pilih kategori proyek"
              required
            />

            <TextInput
              id="url"
              label="URL Repository Github"
              type="text"
              name="url"
              value={project.url}
              onChange={handleChange}
              placeholder="URL Repository Github"
              required
            />

            <PhotoUpload
              id="image"
              label="Lampirkan Foto"
              name="image"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              hint="*Hanya format .png atau .jpeg"
              required
            />

            <TextInput
              id="tech"
              label="Teknologi terkait (framework dsb.)"
              type="text"
              name="tech"
              value={project.tech}
              onChange={handleChange}
              placeholder="Teknologi terkait. ex Laravel, Next.js, etc."
              required
            />

            <TextInput
              id="site"
              label="URL Deploy/Dashboard link"
              type="text"
              name="site"
              value={project.site}
              onChange={handleChange}
              placeholder="URL Deploy/Dashboard link."
              required
            />

            <SelectInput
              id="status"
              label="Status"
              name="status"
              value={project.status}
              onChange={handleChange}
              options={statusOptions}
              placeholder="Pilih status"
              required
            />

            <TextAreaInput
              id="desc"
              label="Description (bisa pakai tag HTML)"
              name="desc"
              value={project.desc}
              onChange={handleTextareaChange}
              placeholder="Project Description."
              required
            />
          </div>

          <SubmitButton label="Tambah proyek" onClick={handleSubmit} />
        </form>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
