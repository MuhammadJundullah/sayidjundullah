// app/portofolio/[slug]/page.tsx
import React from "react";
import Link from "next/link";
import { fetchDataFromAPI } from "@/lib/actions";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa6";
import { ProjectsType, ApiResponse } from "@/lib/type";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data: ApiResponse = await fetchDataFromAPI(slug);

  if (
    !data ||
    (typeof data === "object" &&
      "message" in data &&
      data.message === "Project not found") ||
    (Array.isArray(data) && data.length === 0)
  ) {
    notFound();
  }

  if (!Array.isArray(data)) {
    notFound();
  }

  const item = data[0];

  return (
    <div className="sm:mx-auto mx-5 max-w-6xl flex flex-col justify-center min-h-screen">
      <div className="container sm:mx-auto py-8">
        <div className="flex justify-between items-center py-4">
          <Link
            href="/#projects"
            className="flex hover:text-black text-gray-400">
            <FaArrowLeft className="mt-1" />
            <span className="ml-2">Back to Projects</span>
          </Link>
        </div>
        {/* Render hanya satu item karena ini halaman detail */}
        <div key={item.id} className="mb-8">
          <h2 className="sm:text-5xl text-3xl font-semibold my-4">
            {item.judul}
          </h2>
          <div className="my-10 flex justify-center items-center">
            <Image
              src={item.photo || ""}
              alt={item.judul || ""}
              width={800}
              height={600}
              className="rounded-lg border-2 border-gray-300 shadow-lg"
            />
          </div>
          <div className="sm:flex flex-col sm:flex-row mt-4 sm:gap-5">
            <p
              className="my-4"
              dangerouslySetInnerHTML={{ __html: item.desc }}
            />
            <div className="w-full">
              <p className="py-2">
                <strong>Site: </strong>
                {item.site == "#" || null ? (
                  "Not Available"
                ) : (
                  <a
                    href={item.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline">
                    {item.site}
                  </a>
                )}
              </p>
              <p className="py-2">
                <strong>Tech Stack:</strong> {item.tech}
              </p>
              <p className="py-2">
                <strong>Source code:</strong>{" "}
                {item.url == "#" || null ? (
                  "Not Available"
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline">
                    Github Repository
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data: ProjectsType[] | null = await fetchDataFromAPI(slug);

  if (!data || data.length === 0) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const item = data[0];

  return {
    title: `${item.judul} - My Portfolio Project`,
    description: item.desc.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
    openGraph: {
      title: `${item.judul} - My Portfolio Project`,
      description: item.desc.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
      images: item.photo ? [{ url: item.photo }] : [],
    },
  };
}
