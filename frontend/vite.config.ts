import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from 'path';

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    sourcemap: true,
  },
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      src: "/src",
      public: "/public",
    },
  },
});
