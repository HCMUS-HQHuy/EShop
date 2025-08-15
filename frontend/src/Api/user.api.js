import axios from "axios";
console.log("API initialized with base URL:", import.meta.env.VITE_BACK_END_URL);
const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const user = {
  signUp: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getInfor: () => api.get(`/user/getinfor`)
};

export default user;