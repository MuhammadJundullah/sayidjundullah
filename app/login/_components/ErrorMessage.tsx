"use client";

import { useSearchParams } from "next/navigation";

const ErrorMessage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  return (
    <div className="text-red-500 text-sm">
      {error === "CredentialsSignin"
        ? "Terjadi kesalahan. Silakan coba lagi."
        : "Email atau password salah."}
    </div>
  );
};

export default ErrorMessage;
