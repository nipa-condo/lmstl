// import axios from "axios";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

import axios from "axios";

const client = () => {
  const defaultOptions = {
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  };

  // Create instance

  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  return instance;
};

export default client();
