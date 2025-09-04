import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa"; 

// Definisi tipe data untuk props
interface DynamicBackButtonProps {
  href: string; 
  label?: string;
}

const BackButton: React.FC<DynamicBackButtonProps> = ({
  href,
  label = "Kembali",
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 hover:text-black dark:hover:text-white text-gray-400 my-5 transition-all">
      <FaArrowLeft />
      <span>{label}</span>
    </Link>
  );
};

export default BackButton;
