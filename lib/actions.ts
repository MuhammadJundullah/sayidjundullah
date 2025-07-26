export const fetchDataFromAPI = async (id: string) => {
  const response = await fetch(
    `${process.env.BASE_URL}/api/projects?id=${id}`
  );
  if (!response.ok) {
    return response.json();
  }
  return response.json();
};
