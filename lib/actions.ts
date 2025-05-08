export const fetchDataFromAPI = async (slug: string) => {
  const response = await fetch(`/api/projects?slug=${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
