"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState, use } from "react";
import Loading from "@/app/_components/Loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";

interface TechStack {
  name: string;
  image?: File | string;
  description: string;
}

export default function EditTechStack({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { toast, showToast } = useToast();
  const [techstack, setTechStack] = useState<TechStack | null>(null);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      <Link
        href="/admin/techstacks"
        className="flex items-center gap-3 hover:text-black text-gray-400 my-10 transition-all duration-300">
        <FaArrowLeft />
        <span>Kembali</span>
      </Link>
      <form className="py-3">
        <div className="flex flex-col gap-8">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="tech">Nama Techstack</Label>
            <Input
              type="text"
              placeholder="Nama Techstack"
              value={techstack.name}
              name="name"
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="tech">Deskripsi</Label>
            <Input
              type="text"
              placeholder="Deskrpsi, seperti penguasaan terkait techstack."
              name="description"
              value={techstack.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="photo">Ubah Foto</Label>
              <div className="sm:w-lg aspect-[2/1] relative mb-8">
                <Image
                  src={
                    typeof techstack.image === "string"
                      ? techstack.image
                      : techstack.image instanceof File
                      ? URL.createObjectURL(techstack.image)
                      : "https://res.cloudinary.com/dislphwb0/image/upload/v1748565484/404_vzvale.jpg"
                  }
                  alt="TechStack Photo"
                  fill
                  sizes="100"
                  className="rounded-2xl object-cover overflow-hidden my-3 border-4"
                  onLoad={(e) => {
                    if (techstack.image instanceof File) {
                      URL.revokeObjectURL(e.currentTarget.src);
                    }
                  }}
                />
              </div>
            </div>
            <Input
              type="file"
              placeholder="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required
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
