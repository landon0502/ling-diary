import { useRequest } from "ahooks";
import { createDiary } from "@/services/diary";
export default function useServices() {
  const createDiaryControl = useRequest(createDiary, { manual: true });

  return {
    createDiaryControl,
  };
}
