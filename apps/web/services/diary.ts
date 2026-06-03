// ==================== 日记相关 ====================
import fetchClient from "@/lib/fetch";
export interface CreateDiaryParams {
  id?: string;
  title: string;
  content: string;
  contentJSON: string;
  isAnalyze: 0 | 1;
}

export interface DiaryItem {
  id: number;
  title: string;
  content: string;
  contentJSON: string;
  word_count: number;
  score?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DiaryListParams {
  keyword?: string;
  page?: number;
  page_size?: number;
}

export interface DiaryListResponse {
  list: DiaryItem[];
  total: number;
}

// 创建日记
export const createDiary = (data: CreateDiaryParams) => {
  return fetchClient.post<{ id: number; status: 0 | 1; message: string }>(
    "/diary/",
    data
  );
};

// 获取日记列表
export const getDiaryList = (params?: DiaryListParams) => {
  return fetchClient.get<DiaryListResponse>(
    "/diary/",
    params as Record<string, unknown>
  );
};

// 获取日记详情
export const getDiaryDetail = (id: number) => {
  return fetchClient.get<DiaryItem>(`/diaries/${id}`);
};

// 删除日记
export const deleteDiary = (id: number) => {
  return fetchClient.delete(`/diaries/${id}`);
};

// ==================== AI 分析 ====================

export interface GrammarError {
  original: string;
  fixed: string;
  reason: string;
}

export interface DiaryReport {
  score: number;
  grammar_score: number;
  fluency_score: number;
  vocabulary_score: number;
  grammar_errors: GrammarError[];
  rewrite: string;
}

// 获取 AI 分析
export const getDiaryReport = (id: number) => {
  return fetchClient.get<DiaryReport>(`/diaries/${id}/report`);
};

// 重新分析
export const reanalyzeDiary = (id: number) => {
  return fetchClient.post(`/diaries/${id}/reanalyze`);
};
