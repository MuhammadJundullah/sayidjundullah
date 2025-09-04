import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Definisi tipe data untuk props
interface SubmitButtonProps {
  label: string; 
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex gap-3 items-center">
      <Button
        type="submit"
        ref={buttonRef}
        className="mt-5 my-10 text-white bg-black dark:bg-white dark:text-black hover:cursor-pointer dark:hover:bg-gray-300"
        onClick={onClick}>
        {label}
      </Button>
      <span className="text-gray-500 dark:text-gray-200">⌘ + S / Ctrl + S</span>
    </div>
  );
};

export default SubmitButton;
