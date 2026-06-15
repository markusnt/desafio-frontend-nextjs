"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { checkHealth } from "@/lib/api";

export function ConnectionCheck() {
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) {
      return;
    }

    checkedRef.current = true;

    void checkHealth().then((isHealthy) => {
      if (!isHealthy) {
        toast.error("API indisponível", {
          description: "Verifique NEXT_PUBLIC_API_URL ou tente novamente em instantes.",
        });
        return;
      }

      toast.success("Conectado à API", { duration: 2500 });
    });
  }, []);

  return null;
}
