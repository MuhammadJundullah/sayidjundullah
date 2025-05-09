"use client";

import React from "react";

import { usefetchDataFromAPI } from "@/lib/actions";

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
      <h1 className="text-2xl font-bold mb-4">Project: {slug}</h1>
      {data ? (
        <pre className="p-4 rounded-md text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className="flex flex-col justify-center items-center h-32">
          <p className="mb-2">Loading data, please wait...</p>
          <span className="loading loading-dots loading-xl"></span>
        </div>
      )}
    </div>
  );
}
