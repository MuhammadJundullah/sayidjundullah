import React from "react";
import Link from "next/link";
import { fetchDataFromAPI } from "@/lib/actions";
import Loading from "@/app/_components/Loading";
import { FaArrowLeft } from "react-icons/fa6";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetchDataFromAPI(id);

  const data = res.data;

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

  return (
    <div className="sm:mx-auto mx-5 max-w-6xl flex flex-col justify-center min-h-screen">
      {data ? (
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/#projects"
              className="flex hover:text-black dark:hover:text-gray-300 text-gray-400 dark:text-white">
              <FaArrowLeft className="mt-1" />
              <span className="ml-2">Back to Projects</span>
            </Link>
          </div>
          {data.map((item) => (
            <div key={item.id} className="mb-8">
              <h2 className="sm:text-5xl text-3xl sm:bg-white sm:text-center sm:border dark:text-white sm:border-gray-300 font-semibold my-4 sm:dark:text-black sm:sticky top-5 sm:dark:bg-white sm:rounded-3xl sm:p-3 sm:shadow-xl">
                {item.judul}
              </h2>
              <div className="flex flex-col md:flex-row mt-4 gap-5 dark:text-white">
                <p
                  className="my-4 "
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
                <div className="w-full top-5 h-fit">
                  <p className="py-2">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="py-2">
                    <strong>Tech Stack:</strong> {item.tech}
                  </p>
                  <p className="py-2">
                    <strong>Source code: </strong>{" "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline dark:text-white">
                      Notebook.ipynb
                    </a>
                  </p>
                </div>
              </div>
              <div className="my-6 sm:flex justify-center items-center hidden md:block">
                <div dangerouslySetInnerHTML={{ __html: item.site }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const data = await fetchDataFromAPI(id);

  if (!data || data.length === 0) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const item = data.data[0];

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
