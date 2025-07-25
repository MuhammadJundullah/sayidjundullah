export const fetchDataFromAPI = async (slug: string) => {
  const response = await fetch(
    `${process.env.BASE_URL}/api/projects?slug=${slug}`
  );
  if (!response.ok) {
    return response.json();
  }
  return response.json();
};
