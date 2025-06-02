"use client";

import { useState, useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
};

export const Toast = ({
  message,
  type = "warning",
  duration = 3000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible) return null;

  return (
    <div className="toast toast-top toast-center">
      <div className={`alert alert-${type}`}>
        <span>{message}</span>
      </div>
    </div>
  );
};
