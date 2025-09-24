export const fetchDataFromAPI = async (id: string) => {
  const res = await fetch(`${process.env.BASE_URL}/api/projects?id=${id}`, {
    next: { tags: ["projects"], revalidate: 86400 },
  });

  if (!res.ok) {
    return res.json();
  }

  return res.json();
};
