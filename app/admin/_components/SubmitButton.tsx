import React, { forwardRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Definisi tipe data untuk props
interface SubmitButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ label, onClick }, ref) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          if (ref && "current" in ref && ref.current) {
            ref.current.click();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [ref]);

    return (
      <div className="flex gap-3 items-center">
        <Button
          type="submit"
          ref={ref}
          className="mt-5 my-10 text-white bg-black dark:bg-white dark:text-black hover:cursor-pointer dark:hover:bg-gray-300"
          onClick={onClick}>
          {label}
        </Button>
        <span className="text-gray-500 dark:text-gray-200">
          ⌘ + S / Ctrl + S
        </span>
      </div>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
