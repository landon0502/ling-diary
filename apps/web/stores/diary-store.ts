import { create } from "zustand";
import {
  getDiaryList,
  getDiaryDetail,
  createDiary,
  deleteDiary,
  getDiaryReport,
  reanalyzeDiary,
  type DiaryItem,
  type DiaryListParams,
  type DiaryReport,
  type CreateDiaryParams,
} from "@/services/diary";

interface DiaryState {
  // ---- 列表 ----
  diaries: DiaryItem[];
  total: number;
  listLoading: boolean;

  // ---- 当前日记 ----
  currentDiary: DiaryItem | null;
  detailLoading: boolean;

  // ---- AI 报告 ----
  report: DiaryReport | null;
  reportLoading: boolean;

  // ---- 错误 ----
  error: string | null;

  // ---- 列表操作 ----
  fetchDiaries: (params?: DiaryListParams) => Promise<void>;
  addDiary: (params: CreateDiaryParams) => Promise<DiaryItem | undefined>;
  removeDiary: (id: number) => Promise<void>;

  // ---- 详情 ----
  fetchDiaryDetail: (id: number) => Promise<void>;

  // ---- AI 分析 ----
  fetchReport: (id: number) => Promise<void>;
  reanalyze: (id: number) => Promise<void>;

  // ---- 工具 ----
  clearError: () => void;
  setCurrentDiary: (diary: DiaryItem | null) => void;
}

export const useDiaryStore = create<DiaryState>()((set, get) => ({
  diaries: [],
  total: 0,
  listLoading: false,
  currentDiary: null,
  detailLoading: false,
  report: null,
  reportLoading: false,
  error: null,

  fetchDiaries: async (params) => {
    set({ listLoading: true, error: null });
    try {
      const res = await getDiaryList(params);
      set({
        diaries: res.data?.list ?? [],
        total: res.data?.total ?? 0,
        listLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "获取日记列表失败";
      set({ error: message, listLoading: false });
    }
  },

  addDiary: async (params) => {
    set({ error: null });
    try {
      const res = await createDiary(params);
      // 插入列表头部
      const newDiary: DiaryItem = {
        id: res.data?.id ?? 0,
        content: params.content,
        word_count: params.content.split(/\s+/).filter(Boolean).length,
        status: res.data?.status ?? "processing",
        created_at: new Date().toISOString(),
      };
      set((s) => ({ diaries: [newDiary, ...s.diaries] }));
      return newDiary;
    } catch (err) {
      const message = err instanceof Error ? err.message : "创建日记失败";
      set({ error: message });
    }
  },

  removeDiary: async (id) => {
    set({ error: null });
    try {
      await deleteDiary(id);
      set((s) => ({
        diaries: s.diaries.filter((d) => d.id !== id),
        currentDiary: s.currentDiary?.id === id ? null : s.currentDiary,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "删除日记失败";
      set({ error: message });
    }
  },

  fetchDiaryDetail: async (id) => {
    set({ detailLoading: true, error: null });
    try {
      const res = await getDiaryDetail(id);
      set({ currentDiary: res.data ?? null, detailLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "获取日记详情失败";
      set({ error: message, detailLoading: false });
    }
  },

  fetchReport: async (id) => {
    set({ reportLoading: true, error: null });
    try {
      const res = await getDiaryReport(id);
      set({ report: res.data ?? null, reportLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "获取分析报告失败";
      set({ error: message, reportLoading: false });
    }
  },

  reanalyze: async (id) => {
    set({ reportLoading: true, error: null });
    try {
      await reanalyzeDiary(id);
      // 重新拉取报告
      const res = await getDiaryReport(id);
      set({ report: res.data ?? null, reportLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "重新分析失败";
      set({ error: message, reportLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  setCurrentDiary: (diary) => set({ currentDiary: diary }),
}));
