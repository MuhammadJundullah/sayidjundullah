// hooks/useKeyboardShortcut.ts
import { useEffect, RefObject } from "react";

// 💡 Perbaikan: Menerima `RefObject<HTMLInputElement | null>` sebagai parameter
 const useKeyboardShortcut = (
  inputRef: RefObject<HTMLInputElement | null>,
  key: string = "k"
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === key) {
        e.preventDefault();
        // 💡 Lakukan pemeriksaan null sebelum memanggil .focus()
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef, key]);
};

export default useKeyboardShortcut