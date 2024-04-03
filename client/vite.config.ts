import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [react()],
  define: {
    "process.env": {
      VITE_APP_API_BASE_URL: JSON.stringify("http://server:3000/api"),
    },
  },
});
