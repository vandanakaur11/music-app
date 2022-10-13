import axios from "axios";

const api = axios.create({
  baseURL: process.env.base_url,
});

export default api;
