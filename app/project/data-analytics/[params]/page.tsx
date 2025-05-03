import React from "react";

const fetchDataFromAPI = async (slug: string) => {
  const response = await fetch(
    `http://localhost:3000/api/projects?slug=${slug}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

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
