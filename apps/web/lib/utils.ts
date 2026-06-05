import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateId() {
  // 💡 现代浏览器原生支持，零依赖，安全性极高
  return window.crypto.randomUUID();
}
