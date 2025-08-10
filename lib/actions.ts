export const fetchDataFromAPI = async (id: string) => {
  const res = await fetch(`${process.env.BASE_URL}/api/projects?id=${id}`, {
    // const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return res.json();
  }

  return res.json();
};
