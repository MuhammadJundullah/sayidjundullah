// app/project/data-analytics/[slug]/page.jsx
"use client";

import { fetchDataFromAPI } from "@/lib/actions";

import { useEffect, useState } from "react";

export default function Page({ params }) {
  const { slug } = params;
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
      <pre className="p-4 rounded-md text-sm overflow-x-auto">
        {data ? JSON.stringify(data, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}
