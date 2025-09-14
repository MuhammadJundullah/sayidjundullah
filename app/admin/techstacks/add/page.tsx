"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";
import Loading from "@/app/_components/Loading";
import TextInput from "@/app/admin/_components/TextInput";
import TextAreaInput from "../../_components/TextAreaInput";
import PhotoUpload from "../../_components/PhotoUpload";
import BackButton from "../../_components/BackButton";
import SubmitButton from "../../_components/SubmitButton";

export default function AddTechstack() {
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

  const [techstack, setTechstack] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 2 * 1024 * 1024;

      if (file.size > maxSize) {
        showToast("Ukuran file maksimal adalah 2 MB.", "error");
        // Anda bisa menambahkan logika lain di sini, seperti mengosongkan input file
        e.target.value = "";
      } else {
        setTechstack((prev) => ({ ...prev, image: e.target.files![0] }));
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTechstack((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!window.confirm("Apakah Anda yakin ingin menambahkan techstack?")) {
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("name", techstack.name);
      formData.append("description", techstack.description);

      if (techstack.image) {
        formData.append("image", techstack.image);
      }

      const response = await fetch(`/api/techstacks`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal membuat techstack");
      }

      setIsLoading(false);
      showToast("Techstack has been added successfully!", "success");
      setTechstack({
        name: "",
        description: "",
        image: null,
      });
    } catch {
      setIsLoading(false);
      showToast("Gagal menambahkan techstack!", "error");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-6xl flex flex-col justify-center text-black">
      <div>
        <BackButton href="/admin/techstacks" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 w-full">
          <div className="py-20">
            <div className="py-20">
              <Loading />
            </div>
          </div>
        </div>
      ) : (
        <form className="py-3 pb-20 mb-20" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <TextInput
              id="name"
              label="Nama Techstack"
              type="text"
              name="name"
              value={techstack.name}
              onChange={handleChange}
              placeholder="Python, Django, JavaScript, Node.js, etc."
              required
            />

            <TextAreaInput
              id="description"
              label="Deskripsi"
              name="description"
              value={techstack.description}
              onChange={handleChange}
              placeholder="Master in this tech stack, because has 3 projects using this techstack."
              required
            />

            <PhotoUpload
              id="project-image"
              label="Logo techstack"
              name="image"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              hint="*Hanya format .png atau .jpeg, tanpa background, max. 2 MB."
              required
            />
          </div>

          <SubmitButton label="Tambah techstack" onClick={handleSubmit} />
        </form>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
