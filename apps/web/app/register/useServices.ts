import { register } from "@/services/auth";
import { useRequest } from "ahooks";
export default function useService() {
  // 注册
  const registerControl = useRequest(register, {
    manual: false,
  });

  return {
    registerControl,
  };
}
