"use client";

import { useState } from "react";
import "./style.scss";
// 浮动粒子组件
export function FloatingParticles() {
  const [grain] = useState(() => {
    return Array(20)
      .fill(null)
      .map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        animation: 3 + Math.random() * 4,
        animationDelay: Math.random() * 2,
      }));
  });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {grain.map((g, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            animation: `float ${g.animation}s ease-in-out infinite`,
            animationDelay: `${g.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
