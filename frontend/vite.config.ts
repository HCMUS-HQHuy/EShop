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
      Api: path.resolve(__dirname, 'src/Api'),
      App: path.resolve(__dirname, 'src/App'),
      Assets: path.resolve(__dirname, 'src/Assets'),
      Components: path.resolve(__dirname, 'src/Components'),
      Data: path.resolve(__dirname, 'src/Data'),
      Features: path.resolve(__dirname, 'src/Features'),
      Fonts: path.resolve(__dirname, 'src/Fonts'),
      Functions: path.resolve(__dirname, 'src/Functions'),
      Hooks: path.resolve(__dirname, 'src/Hooks'),
      Routes: path.resolve(__dirname, 'src/Routes'),
      Styles: path.resolve(__dirname, 'src/Styles'),
      Types: path.resolve(__dirname, 'src/Types'),
      Utils: path.resolve(__dirname, 'src/Utils'),
    },
  },
});
