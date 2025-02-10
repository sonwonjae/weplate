import https from "https";

import axios from "axios";
import { toast } from "sonner";

const apiAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  timeout: 1000 * 60,
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NEXT_PUBLIC_MODE !== "dev",
  }),
});
apiAxios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (typeof window !== "undefined") {
      console.log("intercept: ", error.response?.status);
      if (error.response?.status === 400) {
        /** FIXME: 추후 전역 Errorboundary로 이동 예정 */
        toast.error("요청이 실했습니다. 다시 시도해주세요.");
      }
      if (error.response?.status === 403) {
        window.location.href = `/login?redirectUrl=${window.location.pathname}`; // 리다이렉션
      }
    }
    return error;
  },
);

export default apiAxios;
