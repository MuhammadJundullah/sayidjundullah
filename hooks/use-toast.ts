// hooks/useToast.ts
import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
};