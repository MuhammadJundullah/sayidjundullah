// import React from "react";
//
// const ManageTechstacks = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen w-screen">
//       <span>Manage TechStacks Page On Development.</span>
//     </div>
//   );
// };
//
// export default ManageTechstacks;

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/app/_components/Loading";
import { SquarePen, Delete, Search, FilePlus } from "lucide-react";
import Image from "next/image";
import { VscRefresh } from "react-icons/vsc";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
      <div className="sm:my-10">
        <h1 className="text-3xl font-bold">Manage Techstacks</h1>
        <p className="text-gray-500 font-medium">
          Kelola techstack kamu dengan rapi dan profesional.
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
          <Link
            href="/admin/techstacks/add"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer">
            <FilePlus />
            <span className="w-19">New Techstack</span>
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
              <CardHeader>
                <CardTitle>{techstack.name}</CardTitle>
                <CardDescription className="">
                  {techstack.description}
                </CardDescription>
              </CardHeader>

              <Image
                src={techstack.image}
                alt={techstack.name}
                width={200}
                height={100}
                className="rounded-lg p-2 mx-auto"
              />

              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="text-gray-500">Terakhir diperbarui:</p>
                    <p>
                      {new Date(techstack.updatedAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center gap-2">
                <Button
                  variant="ghost2"
                  className="flex items-center gap-2 hover:cursor-pointer text-red-500"
                  onClick={() => handleDelete(techstack.id)}>
                  <Delete size={16} />
                  Hapus
                </Button>

                {/* <Link href={`/admin/techstacks/edit/${techstack.id}`}> */}
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300">
                  <SquarePen size={16} />
                  Edit
                </Button>
                {/* </Link> */}
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
