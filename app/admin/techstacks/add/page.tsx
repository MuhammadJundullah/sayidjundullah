"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";
import Loading from "@/app/_components/Loading";

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
      setTechstack((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTechstack((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      <Link
        href="/admin/techstacks"
        className="flex items-center gap-3 hover:text-black text-gray-400 my-5">
        <FaArrowLeft />
        <span>Kembali</span>
      </Link>

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
            <div className="grid w-full gap-1.5">
              <Label htmlFor="name">Nama Techstack</Label>
              <Input
                type="text"
                name="name"
                value={techstack.name}
                onChange={handleChange}
                placeholder="Python, Django, JavaScript, Node.js, etc."
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                name="description"
                value={techstack.description}
                onChange={handleChange}
                placeholder="Master in this tech stack, because has 3 projects using this techstack."
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="image">Foto</Label>
              <Input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              <p className="text-gray-500 text-xs">
                *png & without background.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center pb-20">
            <Button
              type="submit"
              disabled={isLoading}
              ref={submitRef}
              className="mt-5 my-10 text-white bg-black hover:cursor-pointer">
              Add Techstack
            </Button>
            <span className="text-gray-500">
              ⌘ + Return / Ctrl + Enter to Save
            </span>
          </div>
        </form>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
