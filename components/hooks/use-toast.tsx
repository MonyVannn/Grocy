"use client";

// This is a simplified version of the use-toast hook
// In a real implementation, you would use a proper toast library

import { useState } from "react";

type ToastProps = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, props]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props));
    }, 3000);

    return id;
  };

  return { toast, toasts };
}
