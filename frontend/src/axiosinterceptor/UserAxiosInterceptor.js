import axios from "axios";
const BASE_URL = import.meta.env.VITE_USERBASE_URL
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(
                    `${BASE_URL}token/refresh/`,
                    {},
                    { withCredentials: true }
                )
                return axiosInstance(originalRequest)
            } catch (err) {
                console.error("Token refresh failed:", err);
                window.location.href = "/login";
            }
        }
        if (error.response?.status === 403 && error.response.data?.detail?.includes("blocked") && !originalRequest.url.includes("/logout")) {
            window.location.href = "/blocked";
        }

        return Promise.reject(error);
    }
)

export default axiosInstance