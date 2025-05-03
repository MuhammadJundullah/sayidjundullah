export const fetchDataFromAPI = async (slug: string) => {
  const response = await fetch(`http://localhost:3000/api/projects?slug=${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
