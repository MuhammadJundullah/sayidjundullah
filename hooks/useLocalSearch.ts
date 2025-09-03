// hooks/useLocalSearch.ts
import { useState, useEffect } from "react";

/**
 * Custom hook untuk melakukan pencarian lokal pada sebuah array data.
 * @param {T[]} data - Array data asli yang akan dicari.
 * @param {string} searchKeyword - Kata kunci pencarian.
 * @param {(item: T) => string} searchFieldAccessor - Fungsi untuk mendapatkan string dari item yang akan dibandingkan.
 */
const useLocalSearch = <T>(
  data: T[],
  searchKeyword: string,
  searchFieldAccessor: (item: T) => string
) => {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    if (!data) return;

    const lowercasedKeyword = searchKeyword.toLowerCase();
    const result = data.filter((item) =>
      searchFieldAccessor(item).toLowerCase().includes(lowercasedKeyword)
    );
    setFilteredData(result);
  }, [data, searchKeyword, searchFieldAccessor]);

  return filteredData;
};

export default useLocalSearch