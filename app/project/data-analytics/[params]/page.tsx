import React from "react";
import { fetchDataFromAPI } from "@/lib/actions";

const Page = async ({ params }: { params: { params: string } }) => {
  const slug = params.params;

  if (!slug) {
    return <h1>Error: Invalid slug</h1>;
  }

  try {
    const data = await fetchDataFromAPI(slug);

    return (
      <div>
        <h1>Data for slug: {slug}</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return <h1>Error: {(error as Error).message}</h1>;
  }
};

export default Page;