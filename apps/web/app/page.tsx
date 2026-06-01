"use client";

import { useEffect } from "react";
import { SpinningText } from "@/components/ui/spinning-text";
export default function HomePage() {
  useEffect(() => {
    window.location.href = "/home";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center relative">
        <SpinningText reverse className="text-2xl" duration={4} radius={6}>
          loading • loading • loading •
        </SpinningText>
      </div>
    </div>
  );
}
