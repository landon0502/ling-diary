"use client";

import dynamic from "next/dynamic";

const FloatingParticlesWrapper = dynamic(
  async () => {
    const mod = await import("./wrapper");
    return mod.FloatingParticles;
  },
  {
    ssr: false,
  }
);

export function FloatingParticles() {
  return <FloatingParticlesWrapper />;
}
