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

export default function AddCertificate() {
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

  const [certificate, setCertificate] = useState({
    name: "",
    desc: "",
    date: "",
    photo: null as File | null,
    status: "",
    site: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCertificate((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.confirm("Apakah Anda yakin ingin menambahkan certificate?")) {
      return;
    }

    try {
      setIsLoading(true); 
      const formData = new FormData();

      formData.append("name", certificate.name);
      formData.append("desc", certificate.desc);
      formData.append("date", certificate.date);
      formData.append("site", certificate.site);
      formData.append("status", certificate.status);

      if (certificate.photo) {
        formData.append("photo", certificate.photo);
      }

      const response = await fetch(`/api/certificates`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal membuat certificate");
      }

      setIsLoading(false);
      showToast("Certificate has been added successfully!", "success");
      setCertificate({
        name: "",
        desc: "",
        photo: null,
        date: "",
        site: "",
        status: "",
      });
    } catch {
      setIsLoading(false);
      showToast("Login failed: Invalid credentials", "error");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-6xl flex flex-col justify-center text-black">
      <Link
        href="/admin/certificates"
        className="flex items-center gap-3 hover:text-black text-gray-400 my-5">
        <FaArrowLeft />
        <span>Kembali</span>
      </Link>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Loading />
        </div>
      ) : (
        <form className="py-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-8">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="judul">Nama Sertifikat</Label>
              <Input
                type="text"
                name="judul"
                value={certificate.name}
                onChange={handleChange}
                placeholder="Udemy Certification"
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="url">Deskripsi</Label>
              <Input
                type="text"
                name="url"
                value={certificate.desc}
                onChange={handleChange}
                placeholder="Learning Data Science, Machine Learning, AI on Telkom University"
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
              <Label htmlFor="tech">Tanggal diperoleh sertifikat</Label>
              <Input
                type="date"
                name="tech"
                value={certificate.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="site">
                Site (misalnya url verifikasi sertifikat, boleh link drive. dsb)
              </Label>
              <Input
                type="text"
                name="site"
                value={certificate.site}
                onChange={handleChange}
                placeholder="http://example.com/certificate.pdf"
                required
              />
            </div>

            <div className="grid w-xs gap-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                name="status"
                value={certificate.status}
                onChange={handleChange}
                className="select bg-gray-100 rounded-2xl px-3 py-2"
                required>
                <option value="" disabled>
                  Pilih status
                </option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Button
              type="submit"
              disabled={true}
              ref={submitRef}
              className="mt-5 my-10 text-white bg-black hover:cursor-pointer">
              Add Certificate
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
