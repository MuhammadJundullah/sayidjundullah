"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDataFromAPI } from "@/lib/actions";
import Loading from "@/app/_components/Loading";
import { FaArrowLeft } from "react-icons/fa6";

export default function Page({ params }) {
  const { slug } = React.use(params);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchDataFromAPI(slug);
      setData(result);
    };

    fetchData();
  }, [slug]);

  return (
    <div className="sm:mx-auto mx-5 max-w-6xl flex flex-col justify-center min-h-screen">
      {data ? (
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/#projects"
              className="flex hover:text-white text-gray-400">
              <FaArrowLeft className="mt-1" />
              <span className="ml-2">Back to Projects</span>
            </Link>
          </div>
          {data.map((item) => (
            <div key={item.id} className="mb-8">
              <h2 className="sm:text-5xl text-3xl font-semibold my-4">
                {item.judul}
              </h2>
              <div className="flex flex-col md:flex-row mt-4 gap-5">
                <p
                  className="my-4 "
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
                <div className="w-full">
                  <p className="py-2">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="py-2">
                    <strong>Technologies:</strong> {item.tech}
                  </p>
                  <p className="py-2">
                    <strong>GitHub URL:</strong>{" "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline">
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
