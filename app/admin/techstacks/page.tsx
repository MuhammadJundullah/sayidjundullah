"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/app/_components/Loading";
import { SquarePen, Delete } from "lucide-react";
import Image from "next/image";
import Header from "@/app/admin/_components/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/app/login/_components/Toast";

interface Techstack {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const ManageTechstacks = () => {
  const { toast, showToast } = useToast();
  const [Techstacks, setTechstacks] = useState<Techstack[]>([]);
  const [filteredTechstacks, setFilteredTechstacks] = useState<Techstack[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRevalidating, setRevalidating] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/techstacks");
        if (!response.ok) throw new Error("Gagal memuat data techstack");
        const data = await response.json();
        setTechstacks(data.data);
        setFilteredTechstacks(data.data);
      } catch (err) {
        showToast(`${err}`, "success");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = useCallback(
    (keyword: string) => {
      const filtered = Techstacks.filter((techstack) =>
        techstack.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredTechstacks(filtered);
    },
    [Techstacks]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchKeyword);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchKeyword, handleSearch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    const response = await fetch("/api/techstacks");
    const data = await response.json();
    setTechstacks(data.data);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus techstack ini?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/techstacks?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsLoading(false);
        handleRefresh();
        showToast("Techstacks has been deleted successfully!", "success");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Delete error:", err);
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
          tags: ["techstacks"],
        }),
      });
      setRevalidating(false);

      const data = await res.json();
      if (data.success) {
        showToast("Static Techstack Data has been revalidating!", "success");
      }
    } catch (err) {
      alert("Failed to revalidate " + err);
    }
  };

  return (
    <div className="mx-auto sm:px-4 max-w-6xl">
      <Header
        dynamicText="Techstacks"
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        isRevalidating={isRevalidating}
        isRefreshing={isRefreshing}
        handleRevalidate={handleRevalidate}
        newLink="/admin/techstacks/add"
      />

      {isLoading ? (
        <div className="text-center py-20 my-20">
          <div className="text-center py-10">
            <div className="flex items-center justify-center ">
              <Loading />
            </div>
          </div>
        </div>
      ) : filteredTechstacks.length === 0 ? (
        <div className="text-center py-20 ">
          <div className="py-10">
            <p className="text-gray-500 py-20">
              {searchKeyword
                ? "Tidak ada Techstack yang cocok."
                : "Belum ada Techstack."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTechstacks.map((techstack) => (
            <Card key={techstack.id} className="h-full flex flex-col">
              <Image
                src={techstack.image}
                alt={techstack.name}
                width={100}
                height={50}
                className="rounded-lg p-2 mx-auto"
              />

              <CardHeader>
                <CardTitle>{techstack.name}</CardTitle>
                <CardDescription className="">
                  {techstack.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-center gap-2">
                <Button
                  variant="ghost2"
                  className="flex items-center gap-2 hover:cursor-pointer text-red-500"
                  onClick={() => handleDelete(techstack.id)}>
                  <Delete size={16} />
                  Hapus
                </Button>

                <Link href={`/admin/techstacks/edit/${techstack.id}`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 hover:cursor-pointer">
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

export default ManageTechstacks;
