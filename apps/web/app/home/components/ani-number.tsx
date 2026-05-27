"use client";

import { useState, useEffect } from "react";

// 动态数字动画组件
export function AnimatedNumber({
  target,
  duration = 2000,
}: {
  target: number;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(target * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{current.toLocaleString()}</span>;
}
