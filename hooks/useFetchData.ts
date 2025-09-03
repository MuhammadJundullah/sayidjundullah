import { useState, useEffect } from "react";

/**
 * Custom hook untuk mengambil data dari API.
 * @param {string} url - URL API yang akan diambil datanya.
 */

const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Gagal memuat data");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};

export default useFetchData;
