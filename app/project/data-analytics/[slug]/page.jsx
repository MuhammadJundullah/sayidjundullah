"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDataFromAPI } from "@/lib/actions";

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
    <div className="container mx-auto p-4">
      <div>
        <Link href="/" className="btn btn-primary mb-4">
          Back
        </Link>
      </div>
      {data ? (
        <div className="container mx-auto p-4">
          {data.map((item) => (
            <div key={item.id} className="mb-8">
              <h2 className="text-xl font-semibold">{item.judul}</h2>
              <p
                className="text-gray-600 mb-2"
                dangerouslySetInnerHTML={{ __html: item.desc }}></p>
              <p>
                <strong>Category:</strong> {item.category}
              </p>
              <p>
                <strong>Technologies:</strong> {item.tech}
              </p>
              <p>
                <strong>GitHub URL:</strong>{" "}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline">
                  {item.url}
                </a>
              </p>
              <div className="mt-4">
                <strong>Dashboard:</strong>
                <div dangerouslySetInnerHTML={{ __html: item.site }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-screen justify-center items-center h-screen">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      )}
    </div>
  );
}
