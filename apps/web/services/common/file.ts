import fetchClient from "@/lib/fetch";

// ==================== 文件相关 ====================

// 上传文件
export const uploadFile = (
  file: File,
  onProgress?: (p: { loaded: number; total: number; percent: number }) => void
) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetchClient.upload<{ url: string }>("/upload", formData, onProgress);
};

// 批量上传
export const uploadFiles = (
  files: File[],
  onProgress?: (p: { loaded: number; total: number; percent: number }) => void
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return fetchClient.upload<{ urls: string[] }>(
    "/upload/batch",
    formData,
    onProgress
  );
};
