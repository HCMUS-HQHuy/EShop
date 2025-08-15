import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACK_END_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const user = {
  signUp: (userData) => api.post("/users/signup", userData),
  login: (credentials) => api.post("/users/login", credentials),
  getInfor: () => api.get(`/users/getinfor`)
};

export default user;