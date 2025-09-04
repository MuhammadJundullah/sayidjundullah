"use client";

import { useEffect, useState, use } from "react";
import Loading from "@/app/_components/Loading";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";
import SubmitButton from "@/app/admin/_components/SubmitButton";
import { TechStackType } from "@/lib/type";
import TextInput from "@/app/admin/_components/TextInput";
import TextAreaInput from "@/app/admin/_components/TextAreaInput";
import UpdatePhotoInput from "@/app/admin/_components/UpdatePhotoInput";
import BackButton from "@/app/admin/_components/BackButton";

export default function EditTechStack({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast, showToast } = useToast();
  const [techstack, setTechStack] = useState<TechStackType | null>(null);
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
    const fetchTechStack = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/techstacks?id=${id}`);

        if (!res.ok) throw new Error("Failed to fetch techstack");

        const data = await res.json();

        setTechStack(data.data[0]);
      } catch (error) {
        console.error("Error fetching techstack:", error);
        router.push("/error");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTechStack();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen mx-10  w-7xl">
        <Loading />
      </div>
    );
  }

  if (!techstack) {
    return <div>TechStack not found</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTechStack((prev) => (prev ? { ...prev, image: file } : prev));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTechStack((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!techstack) return;

    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("name", techstack.name);
      formData.append("description", techstack.description);

      if (techstack.image instanceof File) {
        formData.append("image", techstack.image);
      }

      const res = await fetch(`/api/techstacks?id=${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setIsLoading(false);
        showToast("TechStack has been updated successfully!", "success");
      } else {
        const errorData = await res.json();
        setIsLoading(false);
        showToast(errorData.message, "success");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      alert("Terjadi kesalahan saat mengupdate techstack");
    }
  };

  return (
    <div className="md:w-6xl flex flex-col justify-center text-black">
      <div>
        <BackButton href="/admin/techstacks" />
      </div>
      <form className="py-3">
        <div className="flex flex-col gap-8">
          <TextInput
            id="techstack-name"
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

          <UpdatePhotoInput
            id="techstack-photo"
            label="Ubah Foto"
            name="image"
            image={techstack.image || "null"}
            onChange={handleFileChange}
            alt="TechStack Photo"
          />
        </div>
        <SubmitButton label="Simpan Perubahan" onClick={handleSubmit} />
      </form>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
