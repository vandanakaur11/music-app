import axios from "axios";

// console.log("process.env.base_url >>>>>>>>>", process.env.base_url);
// console.log("process.env.media_url >>>>>>>>>", process.env.media_url);
// console.log("process.env.ip_info_token >>>>>>>>>", process.env.ip_info_token);

const api = axios.create({
  baseURL: process.env.base_url,
});

export default api;
