"use client";

import React from "react";
import { fetchDataFromAPI } from "@/lib/actions";
import { useEffect, useState } from "react";
import Loading from "@/app/_components/Loading";

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
        <Loading />
      )}
    </div>
  );
}
