import { useRequest } from "ahooks";
import { useMemo } from "react";
import { getDiaryList } from "@/services/diary";
export default function useServices() {
  const diariesControl = useRequest(getDiaryList, { manual: true });
  const { data } = diariesControl;
  const diaries = useMemo(() => data?.data?.list ?? [], [data]);
  const total = useMemo(() => data?.data.total, [data]);

  return {
    diariesControl,
    diaries,
    total,
  };
}
