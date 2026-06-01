"use client";
import { useState } from "react";
import { useMount } from "ahooks";
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useMount(() => {
    setMounted(true);
  });
  return mounted;
}
