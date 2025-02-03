import https from "https";

import axios from "axios";

const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST,
  timeout: 1000 * 60,
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.env.NEXT_PUBLIC_MODE !== "dev",
  }),
});
authAxios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 403) {
        window.location.href = `/login?redirectUrl=${window.location.pathname}`; // 리다이렉션
      }
    }
    return error;
  },
);

export default authAxios;
