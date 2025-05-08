"use client";

import React from "react";
import { fetchDataFromAPI } from "@/lib/actions";
import { useEffect, useState } from "react";

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
      {data ? (
        <div>
          {data.map((item) => (
            <div key={item.id} className="mb-8 h-screen">
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
        <div className="flex flex-col justify-center items-center h-32">
          <p className="mb-2">Loading data, please wait...</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      )}
    </div>
  );
}
