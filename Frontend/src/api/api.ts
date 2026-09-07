import axios from "axios";
import { refresh } from "./todoApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }, 
});

// api.interceptors.request.use((config) =>
// {
//   const token = localStorage.getItem("Token");
//   if(token)
//   {
//     config.headers.Authorization =`Bearer ${token}`
//   }

//   return config;
// })

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/Auth/Refresh")
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await refresh();
                console.log("New access token received:", refreshResponse);
                return api(originalRequest);

            } 
            catch (refreshError) {
                console.log("Refresh token expired or invalid");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;