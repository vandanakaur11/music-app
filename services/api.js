import axios from "axios";

console.log("process.env.base_url >>>>>>>>>", process.env.base_url);

const api = axios.create({
  baseURL: process.env.base_url,
});

export default api;
